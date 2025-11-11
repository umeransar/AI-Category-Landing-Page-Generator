import React, { useState } from 'react';
import type { LandingPageData, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ThemeIcon } from './ThemeIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';

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
          <div
            className="max-w-3xl mx-auto text-center my-12 p-8 md:p-12 rounded-lg shadow-lg border border-black/10"
            style={{
                backgroundColor: 'var(--primary-color)',
                color: 'var(--text-on-primary-color)'
            }}
          >
            {isSubmitted ? (
                <div>
                    <h3 className="text-3xl font-bold">
                        Thank You!
                    </h3>
                    <p className="mt-4 text-lg leading-6 opacity-90">
                        Your coupon for <span className="font-bold">{couponOffer.discountValue}</span> is on its way to your inbox.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center gap-4">
                        <EnvelopeIcon className="w-10 h-10 opacity-90 flex-shrink-0" />
                        <h3 className="text-3xl md:text-4xl font-extrabold">
                            {couponOffer.headline}
                        </h3>
                    </div>
                    <p className="mt-4 max-w-xl mx-auto text-lg leading-7 opacity-90">
                        {couponOffer.description} Enter your email to get <span className="font-bold underline">{couponOffer.discountValue}</span> on your next order!
                    </p>
                    <form onSubmit={handleCouponSubmit} className="mt-8 sm:flex justify-center max-w-lg mx-auto gap-3">
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
                                className="block w-full px-5 py-3 border border-transparent rounded-md shadow-sm placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white bg-black/20 text-white transition"
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div className="mt-3 sm:mt-0 sm:flex-shrink-0">
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: 'var(--background-color)',
                                    color: 'var(--primary-color)'
                                }}
                                className="block w-full py-3 px-5 rounded-md shadow-md text-base font-bold transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white"
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
