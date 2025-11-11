import React, { useState } from 'react';
import type { LandingPageData, EmailData } from '../types';
import { HeroSection } from './HeroSection';
import { IntroSection } from './IntroSection';
import { ProductGrid } from './ProductGrid';
import { BrandStorySection } from './BrandStorySection';
import { FooterSection } from './FooterSection';
import { SparklesIcon } from './icons/SparklesIcon';
import { PALETTES } from '../themes';
import { EmailPreview } from './EmailPreview';

interface OutputPanelProps {
  pageData: LandingPageData | null;
  emailData: EmailData | null;
  isGeneratingPage: boolean;
  isGeneratingEmail: boolean;
  error: string | null;
}

type ActiveTab = 'page' | 'email';

export const OutputPanel: React.FC<OutputPanelProps> = ({ pageData, emailData, isGeneratingPage, isGeneratingEmail, error }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('page');

  if (isGeneratingPage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl shadow-lg p-8 min-h-[80vh] border border-gray-700">
        <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white">Generating Landing Page</h3>
        <p className="text-gray-400 mt-2 text-center">AI is crafting your landing page. This may take a moment...</p>
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

  if (!pageData) {
    return (
       <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-dashed border-gray-700 min-h-[80vh]">
        <SparklesIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-2xl font-bold text-white">Your Generated Campaign Will Appear Here</h3>
        <p className="text-gray-400 mt-2 text-center max-w-md">
          Fill in the details and click "Generate Page" to see the AI-powered result.
        </p>
      </div>
    );
  }

  const colorPalette = PALETTES[pageData.design.paletteName] || PALETTES['professional-blue'];

  const themeStyles: React.CSSProperties = {
    '--primary-color': colorPalette.primary,
    '--secondary-color': colorPalette.secondary,
    '--accent-color': colorPalette.accent,
    '--background-color': colorPalette.background,
    '--text-color': colorPalette.text,
    '--text-on-primary-color': colorPalette.textOnPrimary,
  } as React.CSSProperties;

  const tabClasses = (tabName: ActiveTab) => 
    `px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors ${
      activeTab === tabName
        ? 'bg-indigo-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-500 border border-gray-700">
        <div className="p-4 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400">SEO Title Suggestion</h3>
                    <p className="text-base text-gray-100">{pageData.seo.title}</p>
                </div>
                 <div className="flex space-x-2">
                    <button onClick={() => setActiveTab('page')} className={tabClasses('page')}>Landing Page</button>
                    <button onClick={() => setActiveTab('email')} className={tabClasses('email')} disabled={!pageData}>Email Preview</button>
                </div>
            </div>
        </div>
      <div className="p-2 bg-gray-900">
        {activeTab === 'page' && (
             <div 
                className="w-full bg-[var(--background-color)] text-[var(--text-color)]"
                style={themeStyles}
                >
                <HeroSection 
                    hero={pageData.hero} 
                    categoryName={pageData.categoryName} 
                    heroImageUrls={pageData.design.heroImageUrls} 
                    themeVector={pageData.design.themeVectors.hero}
                />
                <IntroSection 
                    intro={pageData.intro} 
                    themeVector={pageData.design.themeVectors.intro}
                />
                <ProductGrid 
                    products={pageData.products} 
                    themeVector={pageData.design.themeVectors.productGrid}
                    couponOffer={pageData.couponOffer}
                />
                <BrandStorySection brandStory={pageData.brandStory} />
                <FooterSection 
                    footer={pageData.footer} 
                    themeVector={pageData.design.themeVectors.footer}
                />
            </div>
        )}
        {activeTab === 'email' && (
            isGeneratingEmail ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8 min-h-[80vh]">
                     <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold text-white">Generating Email...</h3>
                </div>
            ) : emailData ? (
                 <EmailPreview emailData={emailData} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8 min-h-[80vh]">
                    <h3 className="text-xl font-semibold text-white">Generate an Email</h3>
                    <p className="text-gray-400 mt-2">Click the "Generate Email" button in the control panel.</p>
                </div>
            )
        )}
      </div>
    </div>
  );
};
