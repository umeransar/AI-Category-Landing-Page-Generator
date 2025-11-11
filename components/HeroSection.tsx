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
        <div className="flex items-center justify-center gap-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <ThemeIcon name={themeVector} className="w-12 h-12 opacity-80 flex-shrink-0" />
          <h1>
            <span className="hidden lg:inline">{hero.desktop.title || categoryName}</span>
            <span className="hidden md:inline lg:hidden">{hero.tablet.title || categoryName}</span>
            <span className="inline md:hidden">{hero.mobile.title || categoryName}</span>
          </h1>
        </div>
        <div className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
            <p className="hidden lg:block">{hero.desktop.tagline}</p>
            <p className="hidden md:block lg:hidden">{hero.tablet.tagline}</p>
            <p className="block md:hidden">{hero.mobile.tagline}</p>
        </div>
        <div className="mt-8">
            {/* Desktop Button */}
            <a
                href={hero.desktop.ctaUrl}
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary-color)'}}
                className="hidden lg:inline-block border border-transparent rounded-md py-3 px-8 text-base font-medium transition hover:opacity-90"
            >
                {hero.desktop.ctaText}
            </a>
            {/* Tablet Button */}
            <a
                href={hero.tablet.ctaUrl}
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary-color)'}}
                className="hidden md:inline-block lg:hidden border border-transparent rounded-md py-3 px-8 text-base font-medium transition hover:opacity-90"
            >
                {hero.tablet.ctaText}
            </a>
            {/* Mobile Button */}
            <a
                href={hero.mobile.ctaUrl}
                style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary-color)'}}
                className="inline-block md:hidden border border-transparent rounded-md py-3 px-8 text-base font-medium transition hover:opacity-90"
            >
                {hero.mobile.ctaText}
            </a>
        </div>
      </div>
    </div>
  );
};
