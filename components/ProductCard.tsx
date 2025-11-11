
import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const parsePrice = (priceStr: string | undefined): number | null => {
    if (!priceStr) return null;
    const num = parseFloat(priceStr.replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? null : num;
}

const calculateDiscount = (price: number, fullPrice: number): number | null => {
    if (fullPrice <= price) return null;
    return Math.round(((fullPrice - price) / fullPrice) * 100);
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const priceNum = parsePrice(product.price);
  const fullPriceNum = parsePrice(product.fullPrice);
  const discount = (priceNum && fullPriceNum) ? calculateDiscount(priceNum, fullPriceNum) : null;

  return (
    <div className="group relative flex flex-col bg-[var(--secondary-color)] border border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:border-[var(--primary-color)]/50 transition-all duration-300">
      {discount && (
         <div className="absolute top-2 right-2 z-10 bg-[var(--primary-color)] text-[var(--text-on-primary-color)] text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
        </div>
      )}
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
        <p className="mt-1 text-sm opacity-70 flex-grow">{product.tagline}</p>
        <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-[var(--primary-color)]">{product.price}</p>
                {product.fullPrice && <p className="text-base font-normal opacity-60 line-through">{product.fullPrice}</p>}
            </div>
            <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                    backgroundColor: 'var(--primary-color)',
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--text-on-primary-color)'
                }}
                className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md transition-colors hover:opacity-90"
            >
                View Product
            </a>
        </div>
      </div>
    </div>
  );
};
