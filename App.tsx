import React, { useState } from 'react';
import { InputPanel, HeroData } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { generateLandingPageData } from './services/geminiService';
import type { LandingPageData, Product } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [landingPageData, setLandingPageData] = useState<LandingPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (link: string, products: Product[], holiday: string, heroData: HeroData) => {
    if (products.length === 0) {
      setError('Please fetch or add some products before generating the page.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLandingPageData(null);

    try {
      const geminiData = await generateLandingPageData(link, products, holiday);
      const finalData: LandingPageData = {
        ...geminiData,
        products, // Ensure the final product list is the one from the input panel
        hero: {
          ...geminiData.hero,
          ctaUrl: heroData.ctaUrl || '#',
        },
        design: {
          ...geminiData.design,
          heroImageUrls: heroData.banners,
        },
      };
      setLandingPageData(finalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl font-bold text-white">
            AI Category Landing Page Generator
          </h1>
        </div>
      </header>
      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <OutputPanel 
              data={landingPageData} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;