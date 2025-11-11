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

export const extractProductsFromUrl = async (categoryLink: string): Promise<Product[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an intelligent e-commerce data extraction AI. Your task is to analyze the provided e-commerce category URL and extract the first 8 products listed on that page. For each product, extract the title, a direct image URL, a short tagline or description, the price (as a string), and a direct URL to the product's own page.
        
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
                responseMimeType: "application/json",
                responseSchema: productArraySchema,
            },
        });
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        if (!Array.isArray(data)) {
            console.warn("Gemini did not return a valid product array.");
            return [];
        }
        
        return data as Product[];

    } catch (error) {
        console.error("Error calling Gemini API for product extraction:", error);
        throw new Error("Failed to extract products from the link. The URL might be inaccessible or the format unsupported.");
    }
};


export const generateLandingPageData = async (categoryLink: string, products: Product[], holidayTheme: string, isCouponEnabled: boolean): Promise<Omit<LandingPageData, 'products' | 'design' | 'hero'> & { hero: Omit<LandingPageData['hero'], 'ctaUrl'>, design: Omit<LandingPageData['design'], 'heroImageUrls'>}> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // The schema for this specific call should NOT include the product list,
    // as we are providing it in the prompt and don't want the AI to hallucinate new ones.
    const pageContentSchema: any = {
        type: Type.OBJECT,
        properties: { ...fullResponseSchema.properties },
        required: [...fullResponseSchema.required],
    };
    delete pageContentSchema.properties.products;
    pageContentSchema.required = pageContentSchema.required.filter((p: string) => p !== 'products');
    // Coupon offer is optional, so it should not be in the required list
    pageContentSchema.required = pageContentSchema.required.filter((p: string) => p !== 'couponOffer');


    const themeInstruction = holidayTheme !== 'None' 
        ? `
        CAMPAIGN THEME:
        The landing page MUST be themed for the "${holidayTheme}" campaign. All generated content—including copy and the entire design system—MUST reflect this specific holiday theme. Infuse everything with the spirit of ${holidayTheme}.
        ` 
        : `
        CAMPAIGN THEME:
        No specific theme. Generate a standard, evergreen landing page with a visually appealing, professional color palette.
        `;

    const couponInstruction = isCouponEnabled
        ? `
        COUPON OFFER:
        Generate a compelling "couponOffer" section. The goal is to get users to submit their email in exchange for a discount. Create a catchy headline, a short description, and a discount value of approximately $10 (e.g., '$10 OFF'). The ctaText should be a call to action like 'Get My Code'.
        `
        : `
        COUPON OFFER:
        Do not generate a "couponOffer" section. It has been disabled. Omit the 'couponOffer' key from your JSON response.
        `;

    const prompt = `
        You are a smart web page generator and designer AI. Your job is to use the provided PRODUCT DATA to generate structured JSON data for a Category Landing Page. The product list is the ONLY source of truth. Do NOT generate a 'products' array in your response.

        PRODUCT DATA (This is the absolute and only source of truth for all content generation. Derive the category name, themes, and all copy from this data):
        ${JSON.stringify(products, null, 2)}
        
        ${themeInstruction}
        
        ${couponInstruction}

        MAIN OBJECTIVE:
        Generate structured JSON data for all parts of the landing page EXCEPT for the product list itself. All fields (categoryName, hero, intro, etc.) MUST be creatively generated based ONLY on the provided products and the CAMPAIGN THEME.

        DETAILED REQUIREMENTS:

        1. CONTENT: Generate compelling, theme-appropriate copy for all text fields (hero, intro, brand story, CTAs, SEO). The content MUST be directly related to the products provided above. For example, the categoryName MUST be derived from the provided product data. DO NOT use any external knowledge about any URLs.

        2. COUPON (if enabled): If instructed to create a coupon offer, generate persuasive copy to maximize email signups.

        3. DESIGN SYSTEM:
        - COLOR PALETTE: Based on the CAMPAIGN THEME, generate a 6-point color palette. The colors MUST be hex codes (e.g., "#FFFFFF").
          - "primary": For main buttons and calls-to-action.
          - "secondary": For card backgrounds and secondary elements.
          - "accent": For standout sections like the brand story.
          - "background": For the main page background.
          - "text": For primary body text.
          - "textOnPrimary": For text on top of primary-colored elements (e.g., button text), ensure it has good contrast.
        - THEME VECTORS: Suggest simple, single-word, lowercase names for decorative vector icons for different sections. If no icon is suitable, omit the key. Allowed names: "snowflake", "gift", "shopping-tag", "autumn-leaf", "turkey".
          - "hero"
          - "intro"
          - "productGrid"
          - "footer"

        Strictly adhere to the provided JSON schema for your response. Do not include a 'products' key in your output.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: pageContentSchema,
            },
        });
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);
        
        return data;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate landing page data. The AI model might be unavailable or the request failed. Please check the console for more details.");
    }
};