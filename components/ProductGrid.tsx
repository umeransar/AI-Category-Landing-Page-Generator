import React, { useState } from 'react';
import type { LandingPageData, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ThemeIcon } from './ThemeIcon';

interface ProductGridProps {
  products: Product[];
  themeVector?: string;
  couponOffer?: LandingPageData['couponOffer'];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, themeVector, couponOffer }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-[var(--background-color)]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          <ThemeIcon name={themeVector} className="w-8 h-8 text-[var(--primary-color)]" />
          <h2 className="text-3xl font-extrabold tracking-tight text-center">
            Featured Products
          </h2>
        </div>

        {couponOffer && (
          <div className="max-w-2xl mx-auto text-center my-12 p-8 rounded-lg bg-[var(--secondary-color)] shadow-lg border border-white/5">
            {isSubmitted ? (
              <div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
                  Thank You!
                </h3>
                <p className="mt-3 text-base leading-6 opacity-80">
                  Your coupon for {couponOffer.discountValue} is on its way to your inbox.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-extrabold">
                  <span className="block">{couponOffer.headline}</span>
                </h3>
                <p className="mt-3 text-base leading-6 opacity-80">
                  {couponOffer.description} Get <span className="font-bold text-[var(--primary-color)]">{couponOffer.discountValue}</span> on your next order!
                </p>
                <form onSubmit={handleCouponSubmit} className="mt-6 sm:flex justify-center">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-5 py-3 border border-white/20 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] bg-white/5"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-on-primary-color)'}}
                      className="block w-full py-3 px-5 rounded-md shadow-md text-base font-medium transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] focus:ring-offset-gray-900"
                    >
                      {couponOffer.ctaText}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};