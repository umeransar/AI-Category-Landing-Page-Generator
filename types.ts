import { ColorPalette } from "./themes";

export interface Product {
  title: string;
  imageUrl: string;
  tagline: string;
  price: string;
  fullPrice?: string;
  productUrl: string;
}

export interface HeroContent {
  title: string;
  tagline: string;
  ctaText: string;
  ctaUrl: string;
}

// Data structure for the AI-generated email
export interface EmailData {
  subject: string;
  preheader: string;
  bodyHtml: string;
}

// Data structure for the AI-generated landing page content
export interface LandingPageContent {
  categoryName: string;
  intro: {
    description: string;
    highlights: string[];
  };
  brandStory: {
    headline: string;
    paragraph: string;
  };
  couponOffer?: {
    headline: string;
    description: string;
    discountValue: string;
    ctaText: string;
  };
  footer: {
    ctaText: string;
  };
  seo: {
    title: string;
    metaDescription: string;
  };
  design: {
    paletteName: keyof typeof import('./themes').PALETTES;
    themeVectors: {
      hero?: string;
      intro?: string;
      productGrid?: string;
      footer?: string;
    };
  };
}

// The complete data structure for rendering the landing page
export interface LandingPageData extends LandingPageContent {
  products: Product[];
  hero: {
    desktop: HeroContent;
    tablet: HeroContent;
    mobile: HeroContent;
  };
  design: LandingPageContent['design'] & {
     heroImageUrls: {
        desktop: string;
        tablet: string;
        mobile: string;
    };
  }
}