import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';
import type { Product } from '../types';
import { extractProductsFromUrl } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import { PencilIcon } from './icons/PencilIcon';

export interface HeroData {
    ctaUrl: string;
    imageUrls: {
        desktop: string;
        tablet: string;
        mobile: string;
    };
}

interface InputPanelProps {
  onGenerate: (link: string, products: Product[], holiday: string, heroData: HeroData, isCouponEnabled: boolean) => void;
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

const bannerConfigs = [
    { device: 'Desktop Banner', size: '1920x1080px', key: 'desktop' as const },
    { device: 'Tablet Banner', size: '1024x768px', key: 'tablet' as const },
    { device: 'Mobile Banner', size: '768x1024px', key: 'mobile' as const },
];

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, isLoading }) => {
  const [link, setLink] = useState<string>('https://blade-city.com/collections/karambit-knives');
  const [selectedHoliday, setSelectedHoliday] = useState<string>('None');
  const [numProducts, setNumProducts] = useState<number>(8);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>(initialProductState);
  const [heroCtaUrl, setHeroCtaUrl] = useState<string>('https://example.com/shop-now');
  const [isCouponEnabled, setIsCouponEnabled] = useState<boolean>(true);
  
  const [heroImageUrls, setHeroImageUrls] = useState({
    desktop: 'https://images.unsplash.com/photo-1555529771-835f5de6b662?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tablet: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    mobile: 'https://images.unsplash.com/photo-1558002416-332a61353f86?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  });

  const [selectedBannerDevice, setSelectedBannerDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Product editing state
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [editingProductData, setEditingProductData] = useState<Product | null>(null);

  const handleBannerUrlChange = (device: 'desktop' | 'tablet' | 'mobile', value: string) => {
      setHeroImageUrls(prev => ({ ...prev, [device]: value }));
  };

  const handleBannerFileChange = async (device: 'desktop' | 'tablet' | 'mobile', file: File | null) => {
      if (file) {
          try {
              const dataUrl = await fileToDataUrl(file);
              handleBannerUrlChange(device, dataUrl);
          } catch (error) {
              console.error("Error converting file to data URL", error);
          }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) {
      alert("Please fetch or add at least one product before generating the page.");
      return;
    }
    const heroData: HeroData = {
        ctaUrl: heroCtaUrl,
        imageUrls: heroImageUrls
    };
    onGenerate(link, products, selectedHoliday, heroData, isCouponEnabled);
  };

  const handleFetchProducts = async () => {
    if (!link) {
      setFetchError('Please enter a category link to fetch products.');
      return;
    }
    setIsFetching(true);
    setFetchError(null);
    try {
      const fetchedProducts = await extractProductsFromUrl(link, numProducts);
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

  // --- Product Editing Handlers ---
  const handleEditProduct = (index: number) => {
    setEditingProductIndex(index);
    setEditingProductData({ ...products[index] });
  };

  const handleCancelEdit = () => {
    setEditingProductIndex(null);
    setEditingProductData(null);
  };

  const handleSaveProduct = () => {
    if (editingProductIndex !== null && editingProductData) {
      const updatedProducts = [...products];
      updatedProducts[editingProductIndex] = editingProductData;
      setProducts(updatedProducts);
      handleCancelEdit();
    }
  };

  const handleEditingProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProductData) {
      setEditingProductData({ ...editingProductData, [e.target.name]: e.target.value });
    }
  };

  const handleProductImageUpload = async (file: File | null) => {
    if (file && editingProductData) {
      const dataUrl = await fileToDataUrl(file);
      setEditingProductData({ ...editingProductData, imageUrl: dataUrl });
    }
  };
  
  const currentBannerConfig = bannerConfigs.find(c => c.key === selectedBannerDevice)!;

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

            <div>
              <label htmlFor="num-products" className="block text-sm font-medium text-gray-300 mb-1">
                Number of Products to Fetch
              </label>
              <select
                id="num-products"
                value={numProducts}
                onChange={(e) => setNumProducts(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value={4}>Up to 4 products</option>
                <option value={6}>Up to 6 products</option>
                <option value={8}>Up to 8 products</option>
              </select>
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
              <h3 className="text-md font-medium text-gray-200 mb-2">Product List ({products.length})</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 border-t border-b border-gray-700 py-3">
                {products.length > 0 ? products.map((p, i) => (
                  <div key={i}>
                    {editingProductIndex === i && editingProductData ? (
                      <div className="p-3 border border-indigo-500 rounded-lg bg-gray-900/50 space-y-3">
                        <input type="text" name="title" value={editingProductData.title} onChange={handleEditingProductChange} placeholder="Title" className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md"/>
                        <input type="url" name="imageUrl" value={editingProductData.imageUrl} onChange={handleEditingProductChange} placeholder="Image URL" className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md"/>
                        <label htmlFor={`product-image-upload-${i}`} className="relative cursor-pointer bg-gray-700 rounded-md text-sm text-center font-medium text-indigo-400 hover:text-indigo-300 flex items-center justify-center px-3 py-2 border border-dashed border-gray-600 hover:border-indigo-500 transition-colors">
                            <UploadIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Upload New Image</span>
                            <input id={`product-image-upload-${i}`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleProductImageUpload(e.target.files ? e.target.files[0] : null)} />
                        </label>
                        <input type="url" name="productUrl" value={editingProductData.productUrl} onChange={handleEditingProductChange} placeholder="Product URL" className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md"/>
                        <input type="text" name="price" value={editingProductData.price} onChange={handleEditingProductChange} placeholder="Price" className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md"/>
                        <input type="text" name="tagline" value={editingProductData.tagline} onChange={handleEditingProductChange} placeholder="Tagline" className="w-full px-2 py-1.5 text-sm border border-gray-600 bg-gray-700 text-white rounded-md"/>
                        <div className="flex justify-end space-x-2 pt-2">
                            <button type="button" onClick={handleCancelEdit} className="px-3 py-1.5 border border-gray-600 text-xs font-medium rounded-md text-gray-300 hover:bg-gray-700">Cancel</button>
                            <button type="button" onClick={handleSaveProduct} className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 bg-gray-700/50 p-2 rounded-md">
                        <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded flex-shrink-0 bg-gray-500 border border-gray-600" />
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-white truncate" title={p.title}>{p.title}</p>
                          <p className="text-xs text-gray-400">{p.price}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center space-x-1">
                          <button type="button" onClick={() => handleEditProduct(i)} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleRemoveProduct(i)} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )) : <p className="text-sm text-gray-500 text-center py-4">No products loaded.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-700">
            <h2 className="text-lg font-semibold text-white">
                2. Customize & Generate
            </h2>

            <details className="group">
                <summary className="list-none flex items-center justify-between cursor-pointer text-sm font-medium text-gray-300 hover:text-white">
                    <span>Customize Hero Banners (Optional)</span>
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="banner-device-select" className="sr-only">Select banner to edit</label>
                        <select
                            id="banner-device-select"
                            value={selectedBannerDevice}
                            onChange={(e) => setSelectedBannerDevice(e.target.value as 'desktop' | 'tablet' | 'mobile')}
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {bannerConfigs.map(config => (
                                <option key={config.key} value={config.key}>{config.device}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-2 p-3 border border-gray-700 rounded-lg">
                        <label className="block text-sm font-medium text-gray-300">
                            {currentBannerConfig.device} URL <span className="text-gray-400 text-xs">({currentBannerConfig.size})</span>
                        </label>
                        <input
                            type="url"
                            value={heroImageUrls[currentBannerConfig.key]}
                            onChange={(e) => handleBannerUrlChange(currentBannerConfig.key, e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Paste image URL..."
                        />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600" /></div>
                            <div className="relative flex justify-center text-xs"><span className="bg-gray-800 px-2 text-gray-400">Or</span></div>
                        </div>
                        <label htmlFor={`${currentBannerConfig.key}-file-upload`} className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 focus-within:ring-offset-gray-800 flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-colors">
                            <UploadIcon className="w-5 h-5 mr-2 text-gray-400" />
                            <span>Upload a file</span>
                            <input id={`${currentBannerConfig.key}-file-upload`} name={`${currentBannerConfig.key}-file-upload`} type="file" className="sr-only" accept="image/*" onChange={(e) => handleBannerFileChange(currentBannerConfig.key, e.target.files ? e.target.files[0] : null)} />
                        </label>
                        {heroImageUrls[currentBannerConfig.key] && <img src={heroImageUrls[currentBannerConfig.key]} alt={`${currentBannerConfig.device} preview`} className="mt-2 rounded-md max-h-24 w-full object-cover" />}
                    </div>
                </div>
            </details>

            <div>
              <label htmlFor="hero-cta-url" className="block text-sm font-medium text-gray-300 mb-1">
                Hero CTA URL
              </label>
              <input type="url" id="hero-cta-url" value={heroCtaUrl} onChange={(e) => setHeroCtaUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://yourstore.com/action" />
            </div>
            <div>
              <label htmlFor="holiday-theme" className="block text-sm font-medium text-gray-300 mb-1">
                Campaign Theme (Optional)
              </label>
              <select id="holiday-theme" value={selectedHoliday} onChange={(e) => setSelectedHoliday(e.target.value)} className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {holidays.map(holiday => <option key={holiday} value={holiday} className="bg-gray-700 text-white">{holiday}</option>)}
              </select>
            </div>

            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="coupon-enabled"
                  name="coupon-enabled"
                  type="checkbox"
                  checked={isCouponEnabled}
                  onChange={(e) => setIsCouponEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="coupon-enabled" className="font-medium text-gray-300">
                  Email Coupon Section
                </label>
                <p className="text-gray-400">Include a section to capture emails for a discount code.</p>
              </div>
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