import { GoogleGenAI, Type } from "@google/genai";
import type { LandingPageContent, Product, EmailData, HeroContent, LandingPageData } from '../types';
import { PALETTES } from "../themes";
import { HeroData } from "../components/InputPanel";

const productSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Product title." },
        imageUrl: { type: Type.STRING, description: "Direct URL to the product image." },
        tagline: { type: Type.STRING, description: "A short, one-line description or tagline for the product." },
        price: { type: Type.STRING, description: "Product price, formatted as a string (e.g., '$99.99')." },
        productUrl: { type: Type.STRING, description: "Direct URL to the product's own page." },
    },
    required: ["title", "imageUrl", "tagline", "price", "productUrl"]
};

const landingPageSchemaBase = {
    categoryName: { type: Type.STRING, description: "The name of the product category." },
    intro: {
        type: Type.OBJECT,
        properties: {
            description: { type: Type.STRING, description: "A 2-3 sentence introduction to the category." },
            highlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 bullet points highlighting key features."
            },
        },
        required: ["description", "highlights"]
    },
    brandStory: {
        type: Type.OBJECT,
        properties: {
            paragraph: { type: Type.STRING, description: "A 3-4 line paragraph about brand values or category uniqueness." },
        },
        required: ["paragraph"]
    },
    couponOffer: {
        type: Type.OBJECT,
        description: "Details for an email signup coupon offer. Should be omitted entirely if not requested.",
        properties: {
            headline: { type: Type.STRING, description: "Catchy headline for the coupon section, e.g., 'Get $10 Off'." },
            description: { type: Type.STRING, description: "Short description encouraging signup." },
            discountValue: { type: Type.STRING, description: "The value of the discount, e.g., '$10 OFF' or '15% OFF'." },
            ctaText: { type: Type.STRING, description: "The text for the submit button, e.g., 'Get My Code'." }
        },
        required: ["headline", "description", "discountValue", "ctaText"]
    },
    footer: {
        type: Type.OBJECT,
        properties: {
            ctaText: { type: Type.STRING, description: "Call-to-action text for the footer." },
        },
        required: ["ctaText"]
    },
    seo: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "An SEO-optimized title tag for the page." },
            metaDescription: { type: Type.STRING, description: "An SEO-optimized meta description for the page." },
        },
        required: ["title", "metaDescription"]
    },
    design: {
        type: Type.OBJECT,
        properties: {
            paletteName: {
                type: Type.STRING,
                description: "The name of the color palette to use from the provided list.",
                enum: Object.keys(PALETTES)
            },
            themeVectors: {
                type: Type.OBJECT,
                description: "Single-word, lowercase names of icons for theme decoration. If no icon is suitable, omit the key. Examples: 'snowflake', 'gift', 'shopping-tag', 'autumn-leaf', 'turkey'.",
                properties: {
                    hero: { type: Type.STRING },
                    intro: { type: Type.STRING },
                    productGrid: { type: Type.STRING },
                    footer: { type: Type.STRING },
                }
            }
        },
        required: ["paletteName"]
    }
};

export const extractProductsFromUrl = async (categoryLink: string, productCount: number): Promise<Product[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an intelligent e-commerce data extraction AI. Your task is to analyze the provided e-commerce category URL and extract up to ${productCount} products listed on that page. If there are fewer than ${productCount} products available, extract all of them. For each product, extract the title, a direct image URL, a short tagline or description, the price (as a string), and a direct URL to the product's own page.
        
        CATEGORY LINK: ${categoryLink}

        Strictly adhere to the provided JSON schema for your response. Your response should be a JSON array of product objects.
    `;
    
    const productArraySchema = {
        type: Type.ARRAY,
        items: productSchema,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: productArraySchema,
            },
        });
        const jsonText = response.text.trim();
        const products = JSON.parse(jsonText) as Product[];
        return products;
    } catch (error) {
        console.error("Error extracting products:", error);
        throw new Error("Failed to extract products from the provided URL. Please check the link and try again.");
    }
};

export const generateLandingPageData = async (
    products: Product[],
    holiday: string,
    isCouponEnabled: boolean
): Promise<LandingPageContent> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const landingPageSchema = {
        type: Type.OBJECT,
        properties: { ...landingPageSchemaBase },
        required: ["categoryName", "intro", "brandStory", "footer", "seo", "design"],
    };
    if (!isCouponEnabled) {
        delete landingPageSchema.properties.couponOffer;
    }

    const productListString = products.map(p => `- ${p.title} (${p.price})`).join('\n');
    const paletteNames = Object.keys(PALETTES).join(', ');

    const prompt = `
        You are a world-class e-commerce marketing expert and designer AI. Your task is to generate the JSON data for a category landing page.
        
        **Context:**
        - Product List:
        ${productListString}
        - Thematic Focus: ${holiday === 'None' ? 'General/Evergreen' : holiday}
        - Include Coupon Offer Section: ${isCouponEnabled}

        **Instructions:**
        1.  **Analyze & Copywrite:** Based on the product list, determine the category and write compelling copy for all text fields (intro, brand story, SEO, etc.).
        2.  **Design:** From the list [${paletteNames}], choose the single best palette name for the Thematic Focus. Propose thematic vector icons.
        3.  **Coupon:** If requested, create an enticing coupon offer. If not, omit the 'couponOffer' object.
        4.  **Output:** Your entire response must be a single, valid JSON object that strictly adheres to the provided schema. Do NOT include 'products' or 'hero' objects in your response.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: landingPageSchema as any,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as LandingPageContent;
    } catch (error) {
        console.error("Error generating landing page data:", error);
        throw new Error("Failed to generate landing page data. The AI may have returned an unexpected format.");
    }
};

export const generateEmailData = async (
    pageData: LandingPageData,
    heroData: HeroData
): Promise<EmailData> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const emailSchema = {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: "A compelling, concise email subject line." },
            preheader: { type: Type.STRING, description: "A short preheader text that appears in the inbox preview." },
            bodyHtml: { type: Type.STRING, description: "The full, responsive HTML code for the email body." }
        },
        required: ["subject", "preheader", "bodyHtml"]
    };
    
    const palette = PALETTES[pageData.design.paletteName];
    const productListString = pageData.products.map(p => `- ${p.title} (${p.price})`).join('\n');

    const prompt = `
      You are a world-class e-commerce email developer AI. Your task is to create a responsive HTML marketing email that perfectly complements an existing landing page.

      **Context for the email:**
      - Landing Page Category: ${pageData.categoryName}
      - Primary CTA URL (for the main button): ${heroData.content.desktop.ctaUrl}
      - Color Palette to Use: ${JSON.stringify(palette)}
      - Product List to feature:
      ${productListString}

      **Instructions:**
      1.  **Email Copy:** Write a compelling subject line and preheader that matches the landing page's tone.
      2.  **HTML Body:** Generate the complete, responsive HTML for the email body.
          - **Structure:** Use HTML tables for layout to ensure maximum compatibility with email clients.
          - **Responsiveness:** Use media queries (\`@media screen and (max-width: 600px)\`) for mobile-first adjustments.
          - **Styling:** Use the provided color palette values DIRECTLY in inline styles (e.g., \`style="background-color: ${palette.primary};"\`) or in a \`<style>\` tag in the HTML head. DO NOT USE CSS variables.
          - **Content:** Feature 2-3 products from the list, including their image, title, price, and a button linking to their productUrl. The main call-to-action button for the whole email must link to: ${heroData.content.desktop.ctaUrl}
      3.  **Output:** Your entire response must be a single, valid JSON object that strictly adheres to the provided schema for the email.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: emailSchema as any,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as EmailData;
    } catch (error) {
        console.error("Error generating email data:", error);
        throw new Error("Failed to generate email data. The AI may have returned an unexpected format.");
    }
};
