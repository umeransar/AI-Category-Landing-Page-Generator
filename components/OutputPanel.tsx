
import React from 'react';
import type { LandingPageData } from '../types';
import { HeroSection } from './HeroSection';
import { IntroSection } from './IntroSection';
import { ProductGrid } from './ProductGrid';
import { BrandStorySection } from './BrandStorySection';
import { FooterSection } from './FooterSection';
import { SparklesIcon } from './icons/SparklesIcon';
import { CouponSection } from './CouponSection';

interface OutputPanelProps {
  data: LandingPageData | null;
  isLoading: boolean;
  error: string | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl shadow-lg p-8 min-h-[80vh] border border-gray-700">
        <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white">Generating Landing Page</h3>
        <p className="text-gray-400 mt-2 text-center">AI is analyzing the link and crafting your page. This may take a moment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 rounded-xl shadow-md p-8 border border-red-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-red-300">An Error Occurred</h3>
        <p className="text-red-400 mt-2 text-center">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
       <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-dashed border-gray-700 min-h-[80vh]">
        <SparklesIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-2xl font-bold text-white">Your Generated Page Will Appear Here</h3>
        <p className="text-gray-400 mt-2 text-center max-w-md">
          Enter an e-commerce category link and click "Generate Page" to see the AI-powered result.
        </p>
      </div>
    );
  }

  const themeStyles: React.CSSProperties = {
    '--primary-color': data.design.colorPalette.primary,
    '--secondary-color': data.design.colorPalette.secondary,
    '--accent-color': data.design.colorPalette.accent,
    '--background-color': data.design.colorPalette.background,
    '--text-color': data.design.colorPalette.text,
    '--text-on-primary-color': data.design.colorPalette.textOnPrimary,
  } as React.CSSProperties;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-500 border border-gray-700">
        <div className="p-4 bg-gray-900 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400">SEO Title Suggestion</h3>
            <p className="text-base text-gray-100">{data.seo.title}</p>
            <h3 className="text-sm font-semibold text-gray-400 mt-2">Meta Description Suggestion</h3>
            <p className="text-sm text-gray-300">{data.seo.metaDescription}</p>
        </div>
      <div className="p-2 bg-gray-900">
        <div 
          className="w-full bg-[var(--background-color)] text-[var(--text-color)]"
          style={themeStyles}
        >
          <HeroSection 
            hero={data.hero} 
            categoryName={data.categoryName} 
            heroImageUrls={data.design.heroImageUrls} 
            themeVector={data.design.themeVectors.hero}
          />
          <IntroSection 
            intro={data.intro} 
            themeVector={data.design.themeVectors.intro}
          />
          <ProductGrid 
            products={data.products} 
            themeVector={data.design.themeVectors.productGrid}
          />
          <BrandStorySection brandStory={data.brandStory} />
          <CouponSection couponOffer={data.couponOffer} />
          <FooterSection 
            footer={data.footer} 
            themeVector={data.design.themeVectors.footer}
          />
        </div>
      </div>
    </div>
  );
};
