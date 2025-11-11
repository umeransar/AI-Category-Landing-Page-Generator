
export interface Product {
  title: string;
  imageUrl: string;
  tagline: string;
  price: string;
  productUrl: string;
}

export interface LandingPageData {
  categoryName: string;
  hero: {
    tagline: string;
    ctaText: string;
    ctaUrl: string;
  };
  intro: {
    description: string;
    highlights: string[];
  };
  products: Product[];
  brandStory: {
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
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      textOnPrimary: string;
    };
    themeVectors: {
      hero?: string;
      intro?: string;
      productGrid?: string;
      footer?: string;
    };
    heroImageUrls: {
        desktop: string;
        tablet: string;
        mobile: string;
    };
  };
}
