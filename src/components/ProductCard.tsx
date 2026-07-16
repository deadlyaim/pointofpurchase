import React, { useState } from 'react';
import { Plus, AlertTriangle, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');

  const displayImage = product.colors?.find(c => c.name === selectedColor)?.image || product.image;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50">
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
        />

        {/* Stock Badges */}
        {isOutOfStock ? (
          <div className="absolute top-2 right-2 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
            Agotado
          </div>
        ) : isLowStock ? (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
            <AlertTriangle className="h-3 w-3" />
            Solo {product.stock}
          </div>
        ) : null}

        {/* Quick Add Overlay on desktop (hidden when out of stock) */}
        {!isOutOfStock && (
          <button
            onClick={() => onAddToCart(product, product.sizes ? selectedSize : undefined, product.colors ? selectedColor : undefined)}
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-white shadow-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-gray-800 active:scale-95 max-md:opacity-100 max-md:h-8 max-md:w-8"
            title="Añadir al carrito"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-mono text-xs font-semibold text-gray-600">
                  {product.rating}
                </span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="mt-1.5 font-sans text-sm font-semibold text-gray-900 group-hover:text-gray-950">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="mt-1 line-clamp-2 font-sans text-xs text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Sizes Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-3">
              <span className="font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Talla:
              </span>
              {product.id === 'prod-4' ? (
                <div className="relative">
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold font-mono text-gray-700 outline-none focus:border-gray-950 transition-colors cursor-pointer appearance-none pr-8"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      className={`flex h-6 min-w-8 items-center justify-center rounded-md border text-[10px] font-bold font-mono transition-all ${
                        selectedSize === size
                          ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Colors Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-3">
              <span className="font-sans text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Color: <span className="text-gray-700 font-bold">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    title={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(color.name);
                    }}
                    className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all active:scale-90 ${
                      selectedColor === color.name
                        ? 'border-gray-950 ring-2 ring-gray-950/20 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span 
                      className="h-4 w-4 rounded-full border border-black/10 block" 
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="font-mono text-base font-bold text-gray-950">
            ${product.price.toFixed(2)}
          </span>

          {isOutOfStock ? (
            <span className="font-sans text-xs font-medium text-gray-400">
              Sin stock
            </span>
          ) : (
            <button
              onClick={() => onAddToCart(product, product.sizes ? selectedSize : undefined, product.colors ? selectedColor : undefined)}
              className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 transition-colors hover:border-gray-200 hover:bg-gray-100"
            >
              <Plus className="h-3 w-3" /> Añadir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
