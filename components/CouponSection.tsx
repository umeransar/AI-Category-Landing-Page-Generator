import React, { useState } from 'react';
import type { LandingPageData } from '../types';

interface CouponSectionProps {
  couponOffer: LandingPageData['couponOffer'] | undefined;
}

export const CouponSection: React.FC<CouponSectionProps> = ({ couponOffer }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!couponOffer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-[var(--secondary-color)]">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        {isSubmitted ? (
          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: 'var(--primary-color)' }}>
              Thank You!
            </h2>
            <p className="mt-4 text-lg leading-6 opacity-80">
              Your coupon for {couponOffer.discountValue} is on its way to your inbox.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              <span className="block">{couponOffer.headline}</span>
            </h2>
            <p className="mt-4 text-lg leading-6 opacity-80">
              {couponOffer.description} Get <span className="font-bold text-[var(--primary-color)]">{couponOffer.discountValue}</span> on your next order!
            </p>
            <form onSubmit={handleSubmit} className="mt-8 sm:flex justify-center">
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
    </div>
  );
};
