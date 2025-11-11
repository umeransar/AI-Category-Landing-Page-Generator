import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UploadIcon } from './icons/UploadIcon';
import type { Product } from '../types';
import { extractProductsFromUrl } from '../services/geminiService';

export interface HeroData {
    ctaUrl: string;
    banners: {
        desktop: string;
        tablet: string;
        mobile: string;
    }
}

interface InputPanelProps {
  onGenerate: (link: string, products: Product[], holiday: string, heroData: HeroData) => void;
  isLoading: boolean;
}

const holidays = [
  'None', 'New Year\'s Day', 'Martin Luther King, Jr. Day', 'Valentine\'s Day',
  'Presidents\' Day', 'St. Patrick\'s Day', 'Easter', 'Mother\'s Day',
  'Memorial Day', 'Father\'s Day', 'Juneteenth', 'Independence Day',
  'Labor Day', 'Halloween', 'Veterans Day', 'Thanksgiving',
  'Black Friday', 'Cyber Monday', 'Christmas', 'Holiday Season',
];

const initialProductState: Product = { title: '', imageUrl: '', tagline: '', price: '', productUrl: '' };

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const BannerUploader: React.FC<{
    name: 'desktop' | 'tablet' | 'mobile';
    label: string;
    size: string;
    value: string;
    onUpload: (name: string, base64: string) => void;
    onRemove: (name: string) => void;
}> = ({ name, label, size, value, onUpload, onRemove }) => {
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files[0]) {
            try {
                const base64 = await fileToBase64(files[0]);
                onUpload(name, base64);
            } catch (error) {
                console.error("Error converting file:", error);
                alert("Could not load image file.");
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">{label}</label>
              <span className="text-xs text-gray-500">{size}</span>
            </div>
            {value ? (
                <div className="group relative">
                    <img src={value} alt={`${label} preview`} className="w-full h-24 object-cover rounded-md border border-gray-600" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => onRemove(name)} className="px-3 py-1.5 border border-red-500/50 text-xs font-medium rounded-md text-white bg-red-600/80 hover:bg-red-600">
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-gray-600 rounded-md px-6 pt-5 pb-6 flex justify-center items-center hover:border-indigo-500 transition-colors">
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-8 w-8 text-gray-500" />
                        <div className="flex text-sm text-gray-400">
                            <label htmlFor={name} className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id={name} name={name} type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isLoading }) => {
  const [link, setLink] = useState<string>('https://blade-city.com/collections/karambit-knives');
  const [selectedHoliday, setSelectedHoliday] = useState<string>('None');
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>(initialProductState);
  const [heroCtaUrl, setHeroCtaUrl] = useState<string>('https://example.com/shop-now');
  const [heroBanners, setHeroBanners] = useState({ desktop: '', tablet: '', mobile: '' });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) {
      alert("Please fetch or add at least one product before generating the page.");
      return;
    }
    onGenerate(link, products, selectedHoliday, { ctaUrl: heroCtaUrl, banners: heroBanners });
  };

  const handleFetchProducts = async () => {
    if (!link) {
      setFetchError('Please enter a category link to fetch products.');
      return;
    }
    setIsFetching(true);
    setFetchError(null);
    try {
      const fetchedProducts = await extractProductsFromUrl(link);
      setProducts(fetchedProducts);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleRemoveProduct = (indexToRemove: number) => {
    setProducts(products.filter((_, index) => index !== indexToRemove));
  };

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.title && newProduct.imageUrl && newProduct.price && newProduct.productUrl) {
      setProducts([...products, newProduct]);
      setNewProduct(initialProductState);
      setShowManualForm(false);
    } else {
      alert("Please fill all product fields.");
    }
  };
  
  const handleBannerUpload = (name: string, base64: string) => {
    setHeroBanners(prev => ({ ...prev, [name]: base64 }));
  };
  
  const handleBannerRemove = (name: string) => {
     setHeroBanners(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg sticky top-8 border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            1. Add Products
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="category-link" className="block text-sm font-medium text-gray-300 mb-1">
                E-commerce Category Link
              </label>
              <div className="flex items-stretch space-x-2">
                <input
                  type="url"
                  id="category-link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="flex-grow w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="https://yourstore.com/collections/..."
                  required
                />
                <button type="button" onClick={handleFetchProducts} disabled={isFetching || isLoading} className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isFetching ? '...' : 'Fetch'}
                </button>
              </div>
              {fetchError && <p className="mt-1 text-xs text-red-400">{fetchError}</p>}
              <p className="mt-2 text-xs text-gray-400">
                Paste a link and click 'Fetch' to auto-load products.
              </p>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600" /></div>
                <div className="relative flex justify-center text-sm"><span className="bg-gray-800 px-2 text-gray-400">Or</span></div>
            </div>
            
            {!showManualForm ? (
                 <button type="button" onClick={() => setShowManualForm(true)} className="w-full px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                    Add Product Manually
                </button>
            ) : (
                <div className="space-y-3 p-4 border border-gray-600 rounded-lg bg-gray-900/50">
                    <h3 className="text-sm font-medium text-white">New Product</h3>
                    <input type="text" name="title" value={newProduct.title} onChange={handleNewProductChange} placeholder="Title" required className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                    <input type="url" name="imageUrl" value={newProduct.imageUrl} onChange={handleNewProductChange} placeholder="Image URL" required className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                    <input type="url" name="productUrl" value={newProduct.productUrl} onChange={handleNewProductChange} placeholder="Product URL" required className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                    <input type="text" name="price" value={newProduct.price} onChange={handleNewProductChange} placeholder="Price (e.g., $19.99)" required className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                    <input type="text" name="tagline" value={newProduct.tagline} onChange={handleNewProductChange} placeholder="Tagline (optional)" className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={() => { setShowManualForm(false); setNewProduct(initialProductState); }} className="px-3 py-1.5 border border-gray-600 text-xs font-medium rounded-md text-gray-300 hover:bg-gray-700">Cancel</button>
                        <button type="button" onClick={handleAddProduct} className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Product</button>
                    </div>
                </div>
            )}

            <div className="pt-2">
                <h3 className="text-md font-medium text-gray-200 mb-2">
                    Product List ({products.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-b border-gray-700 py-2">
                    {products.length > 0 ? products.map((p, i) => (
                        <div key={i} className="flex items-center space-x-3 bg-gray-700/50 p-2 rounded-md">
                            <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded flex-shrink-0 bg-gray-500 border border-gray-600" />
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium text-white truncate" title={p.title}>{p.title}</p>
                                <p className="text-xs text-gray-400">{p.price}</p>
                            </div>
                            <button type="button" onClick={() => handleRemoveProduct(i)} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white flex-shrink-0">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">No products loaded.</p>}
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-700">
            <h2 className="text-lg font-semibold text-white">
                2. Customize Hero & Generate
            </h2>
            <div>
              <label htmlFor="hero-cta-url" className="block text-sm font-medium text-gray-300 mb-1">
                Hero CTA URL
              </label>
              <input type="url" id="hero-cta-url" value={heroCtaUrl} onChange={(e) => setHeroCtaUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://yourstore.com/action" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <BannerUploader name="desktop" label="Desktop Banner" size="1920x1080px" value={heroBanners.desktop} onUpload={handleBannerUpload} onRemove={handleBannerRemove} />
              <BannerUploader name="tablet" label="Tablet Banner" size="1024x768px" value={heroBanners.tablet} onUpload={handleBannerUpload} onRemove={handleBannerRemove} />
              <BannerUploader name="mobile" label="Mobile Banner" size="800x1200px" value={heroBanners.mobile} onUpload={handleBannerUpload} onRemove={handleBannerRemove} />
            </div>
            <div>
              <label htmlFor="holiday-theme" className="block text-sm font-medium text-gray-300 mb-1">
                Campaign Theme (Optional)
              </label>
              <select id="holiday-theme" value={selectedHoliday} onChange={(e) => setSelectedHoliday(e.target.value)} className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {holidays.map(holiday => <option key={holiday} value={holiday} className="bg-gray-700 text-white">{holiday}</option>)}
              </select>
            </div>

            <button type="submit" disabled={isLoading || products.length === 0} className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
              {isLoading ? (
                <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
              ) : (
                <><SparklesIcon className="w-5 h-5 mr-2" />Generate Page</>
              )}
            </button>
        </div>
      </form>
    </div>
  );
};