
import React from 'react';
import type { LandingPageData } from '../types';
import { BulletIcon } from './icons/BulletIcon';
import { ThemeIcon } from './ThemeIcon';

interface IntroSectionProps {
  intro: LandingPageData['intro'];
  themeVector?: string;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ intro, themeVector }) => {
  return (
    <div className="bg-[var(--secondary-color)] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <div className="flex items-center justify-center gap-3">
            <ThemeIcon name={themeVector} className="w-8 h-8 text-[var(--primary-color)]" />
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Experience Unmatched Quality
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-xl opacity-80 lg:mx-auto">
            {intro.description}
          </p>
        </div>

        <div className="mt-12">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            {intro.highlights.map((highlight, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[var(--primary-color)] text-[var(--text-on-primary-color)]">
                    <BulletIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">{highlight}</p>
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};