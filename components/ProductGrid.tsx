
import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ThemeIcon } from './ThemeIcon';

interface ProductGridProps {
  products: Product[];
  themeVector?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, themeVector }) => {
  return (
    <div className="bg-[var(--background-color)]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          <ThemeIcon name={themeVector} className="w-8 h-8 text-[var(--primary-color)]" />
          <h2 className="text-3xl font-extrabold tracking-tight text-center">
            Featured Products
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};