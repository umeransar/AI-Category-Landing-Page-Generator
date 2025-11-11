import { GoogleGenAI, Type } from "@google/genai";
import type { LandingPageData, Product } from '../types';

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

// This schema defines the full data structure, which is useful elsewhere,
// but for the page generation call, we'll remove the 'products' part.
const fullResponseSchema = {
    type: Type.OBJECT,
    properties: {
        categoryName: { type: Type.STRING, description: "The name of the product category." },
        hero: {
            type: Type.OBJECT,
            properties: {
                tagline: { type: Type.STRING, description: "A catchy tagline for the hero section." },
                ctaText: { type: Type.STRING, description: "Call-to-action button text." },
            },
            required: ["tagline", "ctaText"]
        },
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
        products: {
            type: Type.ARRAY,
            description: "An array of exactly the first 8 products found on the category page.",
            items: productSchema,
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
                colorPalette: {
                    type: Type.OBJECT,
                    properties: {
                        primary: { type: Type.STRING, description: "Hex code for primary color (buttons, CTAs)." },
                        secondary: { type: Type.STRING, description: "Hex code for secondary color (card backgrounds)." },
                        accent: { type: Type.STRING, description: "Hex code for accent color (special sections)." },
                        background: { type: Type.STRING, description: "Hex code for page background color." },
                        text: { type: Type.STRING, description: "Hex code for main text color." },
                        textOnPrimary: { type: Type.STRING, description: "Hex code for text on primary backgrounds, ensuring good contrast." },
                    },
                    required: ["primary", "secondary", "accent", "background", "text", "textOnPrimary"]
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
            required: ["colorPalette"]
        }
    },
    required: ["categoryName", "hero", "intro", "products", "brandStory", "footer", "seo", "design"]
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

    // FIX: Completed the try...catch block to call the Gemini API and return a value.
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

// FIX: Added the missing generateLandingPageData function and exported it to resolve the error in App.tsx.
export const generateLandingPageData = async (
    categoryLink: string,
    products: Product[],
    holiday: string,
    isCouponEnabled: boolean
): Promise<Omit<LandingPageData, 'products'>> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const { products: _, ...generationSchemaProperties } = fullResponseSchema.properties;
    
    const generationSchema = {
        type: Type.OBJECT,
        properties: { ...generationSchemaProperties },
        required: fullResponseSchema.required.filter(field => field !== 'products'),
    };
    
    if (!isCouponEnabled) {
        delete generationSchema.properties.couponOffer;
    }

    const productListString = products.map(p => `- ${p.title} (${p.price})`).join('\n');

    const prompt = `
        You are a world-class e-commerce marketing expert and designer AI. Your task is to generate the complete JSON data needed to build a high-converting category landing page.
        
        **Context:**
        - Category Page URL: ${categoryLink}
        - Product List (for context, do not include this in the output JSON):
        ${productListString}
        - Thematic Focus: ${holiday === 'None' ? 'General/Evergreen' : holiday}
        - Include Coupon Offer Section: ${isCouponEnabled}

        **Instructions:**
        1.  **Analyze:** Analyze the category and products to understand the target audience and value proposition.
        2.  **Copywriting:** Write compelling, creative, and on-brand copy for all text fields (hero, intro, brand story, SEO, etc.).
        3.  **Design:** Propose a visually appealing color palette and thematic vector icons that match the category and the selected theme.
            - **High Contrast is CRITICAL:** You must ensure high contrast and readability. 
            - If the 'background' color is dark (e.g., '#1A202C'), the main 'text' color must be very light (e.g., '#F7FAFC').
            - Conversely, if the 'background' is light, the 'text' color must be dark.
            - This rule applies to ALL color combinations, especially 'primary' with 'textOnPrimary', to guarantee accessibility and a professional, polished look. Do not use similar colors for background and text.
        4.  **Coupon:** If requested (Include Coupon Offer Section is true), create an enticing coupon offer. If not, omit the 'couponOffer' object completely from your response.
        5.  **JSON Output:** Your entire response must be a single, valid JSON object that strictly adheres to the provided schema. Do NOT include the 'products' array in your output.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: generationSchema as any,
            }
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        return data as Omit<LandingPageData, 'products'>;
    } catch (error) {
        console.error("Error generating landing page data:", error);
        throw new Error("Failed to generate landing page data. The AI may have returned an unexpected format.");
    }
};