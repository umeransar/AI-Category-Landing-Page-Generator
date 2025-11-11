
import React from 'react';
import type { LandingPageData } from '../types';

interface BrandStorySectionProps {
  brandStory: LandingPageData['brandStory'];
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ brandStory }) => {
  return (
    <div className="bg-[var(--accent-color)]">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-[var(--text-on-primary-color)] sm:text-4xl">
          <span className="block">Our Commitment to Excellence</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-[var(--text-on-primary-color)] opacity-80">
          {brandStory.paragraph}
        </p>
      </div>
    </div>
  );
};