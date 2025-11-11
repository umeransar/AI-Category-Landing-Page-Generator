
import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative flex flex-col bg-[var(--secondary-color)] border border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
      <div className="aspect-w-1 aspect-h-1 bg-white/5 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-center object-cover group-hover:opacity-85 transition-opacity"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-semibold">
          <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.title}
          </a>
        </h3>
        <p className="mt-1 text-sm opacity-70">{product.tagline}</p>
        <div className="mt-auto pt-4">
            <p className="text-lg font-bold">{product.price}</p>
            <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                    backgroundColor: 'transparent',
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)'
                }}
                className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors hover:text-[var(--text-on-primary-color)] hover:bg-[var(--primary-color)]"
            >
                View Product
            </a>
        </div>
      </div>
    </div>
  );
};