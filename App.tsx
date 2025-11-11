import React, { useState } from 'react';
import { InputPanel, HeroData } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { generateLandingPageData, generateEmailData } from './services/geminiService';
import type { LandingPageData, Product, EmailData } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [isGeneratingPage, setIsGeneratingPage] = useState<boolean>(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [heroDataForEmail, setHeroDataForEmail] = useState<HeroData | null>(null);

  const handleGeneratePage = async (products: Product[], holiday: string, heroData: HeroData, isCouponEnabled: boolean) => {
    if (products.length === 0) {
      setError('Please fetch or add some products before generating.');
      return;
    }
    setIsGeneratingPage(true);
    setError(null);
    setLandingPageData(null);
    setEmailData(null);
    setHeroDataForEmail(heroData);

    try {
      const geminiContent = await generateLandingPageData(products, holiday, isCouponEnabled);
      
      const finalPageData: LandingPageData = {
        ...geminiContent,
        products,
        hero: heroData.content,
        design: {
            ...geminiContent.design,
            heroImageUrls: heroData.imageUrls,
        },
      };

      setLandingPageData(finalPageData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsGeneratingPage(false);
    }
  };
  
  const handleGenerateEmail = async () => {
    if (!landingPageData || !heroDataForEmail) {
      setError('A landing page must be generated first to provide context for the email.');
      return;
    }
    setIsGeneratingEmail(true);
    setError(null);
    setEmailData(null);

    try {
      const email = await generateEmailData(landingPageData, heroDataForEmail);
      setEmailData(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold text-white">
            AI Campaign Generator
          </h1>
        </div>
      </header>
      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputPanel 
                onGeneratePage={handleGeneratePage} 
                onGenerateEmail={handleGenerateEmail}
                isGeneratingPage={isGeneratingPage} 
                isGeneratingEmail={isGeneratingEmail}
                isPageGenerated={!!landingPageData}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <OutputPanel 
              pageData={landingPageData} 
              emailData={emailData}
              isGeneratingPage={isGeneratingPage}
              isGeneratingEmail={isGeneratingEmail} 
              error={error} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
