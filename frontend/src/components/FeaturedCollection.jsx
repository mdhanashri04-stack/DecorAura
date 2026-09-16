import React from 'react';
import { Plus, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';

export default function FeaturedCollection({ products = [], onSelectProduct }) {
  const { addToCart } = useCart();
  const displayProducts = Array.isArray(products) && products.length > 0 ? products : [];

  return (
    <section className="py-24 bg-ivory-100/60 border-t border-ivory-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
              Curated Releases
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900">THE NEW COLLECTION</h2>
          </div>
          <p className="text-sm font-sans text-charcoal-500 max-w-sm mt-2 md:mt-0">
            Four flagship architectural releases designed for quiet elegance and sensory longevity.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-ivory-300 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] bg-ivory-200 overflow-hidden">
                {product.is_3d_enabled && (
                  <span className="absolute top-3 left-3 bg-bronze-500 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                    3D Interactive
                  </span>
                )}
                
                <ProductImage
                  src={product.primary_image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-charcoal-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="p-3 rounded-full bg-white text-charcoal-900 hover:bg-bronze-500 hover:text-white transition-colors duration-300 shadow-md"
                    title="Quick View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-3 rounded-full bg-charcoal-900 text-white hover:bg-bronze-500 transition-colors duration-300 shadow-md"
                    title="Add to Bag"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[11px] font-sans uppercase tracking-widest text-charcoal-500 mb-1">
                  {product.category ? product.category.name : 'Decor'}
                </span>
                <h3
                  onClick={() => onSelectProduct(product)}
                  className="text-xl font-serif text-charcoal-900 hover:text-bronze-600 transition-colors duration-200 cursor-pointer mb-2"
                >
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 text-xs text-bronze-600 mb-4">
                  <Star size={12} fill="currentColor" />
                  <span>{(Number(product?.rating) || 5.0).toFixed(1)} ({product?.reviews_count || 0})</span>
                </div>

                <div className="mt-auto pt-4 border-t border-ivory-200 flex items-center justify-between">
                  <span className="text-xl font-serif font-semibold text-charcoal-900">
                    ${(Number(product?.price) || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="text-xs font-sans font-semibold uppercase tracking-wider text-bronze-600 hover:text-charcoal-900 transition-colors"
                  >
                    Add to Bag +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
