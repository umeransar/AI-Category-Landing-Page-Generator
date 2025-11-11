import React from 'react';
import type { LandingPageData } from '../types';
import { ThemeIcon } from './ThemeIcon';

interface HeroSectionProps {
  hero: LandingPageData['hero'];
  categoryName: string;
  heroImageUrls: LandingPageData['design']['heroImageUrls'];
  themeVector?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, categoryName, heroImageUrls, themeVector }) => {
    const hasImages = heroImageUrls.desktop || heroImageUrls.tablet || heroImageUrls.mobile;
    
    return (
    <div className="relative bg-gray-900 text-white min-h-[400px] flex items-center">
      <div className="absolute inset-0 w-full h-full bg-black">
         {hasImages && (
            <picture>
                {heroImageUrls.mobile && <source media="(max-width: 767px)" srcSet={heroImageUrls.mobile} />}
                {heroImageUrls.tablet && <source media="(max-width: 1023px)" srcSet={heroImageUrls.tablet} />}
                <img 
                    src={heroImageUrls.desktop || heroImageUrls.tablet || heroImageUrls.mobile}
                    alt={categoryName} 
                    className="w-full h-full object-cover opacity-20" 
                />
            </picture>
         )}
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl flex items-center justify-center gap-4">
          <ThemeIcon name={themeVector} className="w-12 h-12 opacity-80" />
          <span>{categoryName}</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
          {hero.tagline}
        </p>
        <div className="mt-8">
          <a
            href={hero.ctaUrl}
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary-color)'}}
            className="inline-block border border-transparent rounded-md py-3 px-8 text-base font-medium transition hover:opacity-90"
          >
            {hero.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
};
