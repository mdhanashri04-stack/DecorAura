import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { API } from '../services/api';
import ProductImage from '../components/ProductImage';

export default function Collections({ onSelectCollection, onNavigate }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Collections | DecorAura';
    async function loadCollections() {
      try {
        const data = await API.getCollections();
        setCollections(data);
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollections();
  }, []);

  return (
    <div className="pt-28 pb-24 bg-ivory-50 min-h-screen">
      {/* Hero Editorial Header */}
      <div className="bg-ivory-200/60 py-20 text-center border-b border-ivory-300 mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors mb-6"
          >
            ← Back to Home
          </button>
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-bronze-600 mb-3 block flex items-center justify-center gap-2">
            <Sparkles size={14} /> Curated Design Stories
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-charcoal-900 mb-4 tracking-tight">
            The Collections
          </h1>
          <p className="text-sm md:text-base font-sans text-charcoal-600 max-w-xl mx-auto leading-relaxed">
            Curated ensembles built around distinct spatial aesthetics, intentional forms, and quiet luxury.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 bg-ivory-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {collections.map((collection, index) => (
              <div
                key={collection.id || collection.slug}
                onClick={() => onSelectCollection(collection)}
                className="group cursor-pointer bg-white rounded-3xl border border-ivory-300/80 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Large Editorial Card Hero Image */}
                <div className="relative aspect-[16/10] bg-ivory-200 overflow-hidden">
                  <ProductImage
                    src={collection.hero_image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-ivory-50/90 backdrop-blur-md text-charcoal-900 text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-ivory-300/50">
                      Collection 0{index + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="text-3xl font-serif font-medium tracking-tight mb-1 group-hover:text-bronze-300 transition-colors">
                      {collection.name}
                    </h2>
                    <p className="text-xs font-sans text-ivory-100 line-clamp-1 opacity-90">
                      {collection.description}
                    </p>
                  </div>
                </div>

                {/* Card Content & Product Preview */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-xs font-sans text-charcoal-600 leading-relaxed mb-6">
                      {collection.description}
                    </p>

                    {/* Curated Products Teaser Pills */}
                    {collection.products && collection.products.length > 0 && (
                      <div className="mb-6 pt-4 border-t border-ivory-200">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-bronze-600 block mb-3">
                          Curated Pieces ({collection.products.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {collection.products.slice(0, 3).map(prod => (
                            <span
                              key={prod.id}
                              className="text-xs font-sans text-charcoal-700 bg-ivory-100 border border-ivory-300 px-3 py-1 rounded-full"
                            >
                              {prod.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
                    <span className="text-xs font-sans font-semibold uppercase tracking-widest text-charcoal-900 group-hover:text-bronze-600 transition-colors">
                      Explore Collection
                    </span>
                    <div className="w-9 h-9 rounded-full bg-ivory-100 group-hover:bg-bronze-500 group-hover:text-white text-charcoal-900 flex items-center justify-center transition-all duration-300 shadow-sm">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
