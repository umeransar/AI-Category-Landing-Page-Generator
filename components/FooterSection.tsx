
import React from 'react';
import type { LandingPageData } from '../types';
import { ThemeIcon } from './ThemeIcon';

interface FooterSectionProps {
  footer: LandingPageData['footer'];
  themeVector?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ footer, themeVector }) => {
  return (
    <footer className="bg-[var(--secondary-color)] border-t border-white/10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <ThemeIcon name={themeVector} className="w-6 h-6 text-[var(--primary-color)]" />
          <h2 className="text-2xl font-extrabold mb-4">{footer.ctaText}</h2>
        </div>
        <a
          href="#"
          style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary-color)'}}
          className="inline-block border border-transparent rounded-md py-3 px-8 text-base font-medium transition hover:opacity-90"
        >
          Shop All
        </a>
        <p className="mt-8 text-center text-base opacity-60">&copy; 2024 Your Brand. All rights reserved.</p>
      </div>
    </footer>
  );
};