import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Star, Plus, BookOpen, Layers } from 'lucide-react';
import { API } from '../services/api';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { trackViewCollection } from '../utils/analytics';

export default function CollectionDetail({ slug, onBack, onSelectProduct, onSelectArticle, onSelectCollection }) {
  const [collection, setCollection] = useState(null);
  const [allCollections, setAllCollections] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadCollectionDetail() {
      setLoading(true);
      try {
        const [coll, collectionsList, blogs] = await Promise.all([
          API.getCollection(slug),
          API.getCollections(),
          API.getBlogs()
        ]);
        setCollection(coll);
        setAllCollections(collectionsList.filter(c => c.slug !== slug));
        setRelatedBlogs(blogs.slice(0, 2));

        // SEO Title & Meta Description update
        if (coll) {
          document.title = coll.seo_title || `${coll.name} Home Decor Collection | DecorAura`;
          trackViewCollection(coll);
        }
      } catch (err) {
        console.error('Error fetching collection detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCollectionDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-ivory-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-bronze-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <span className="text-xs font-sans uppercase tracking-widest text-charcoal-500">Loading Story...</span>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-ivory-50 text-center">
        <h2 className="text-3xl font-serif text-charcoal-900 mb-4">Collection Not Found</h2>
        <button onClick={onBack} className="px-6 py-2.5 bg-charcoal-900 text-white rounded-full text-xs font-sans uppercase tracking-widest">
          Back to Collections
        </button>
      </div>
    );
  }

  const products = collection.products || [];

  return (
    <div className="pt-24 pb-24 bg-ivory-50 min-h-screen">
      {/* Top Back Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-4 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-charcoal-600 hover:text-bronze-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Collections
        </button>
      </div>

      {/* 1. Large Collection Hero Banner */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16">
        <div className="relative aspect-[21/9] min-h-[360px] rounded-3xl overflow-hidden shadow-2xl">
          <ProductImage
            src={collection.hero_image}
            alt={collection.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 max-w-2xl text-white">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-bronze-300 block mb-2">
              Editorial Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-3">
              {collection.name}
            </h1>
            <p className="text-sm md:text-lg font-sans text-ivory-100 italic leading-relaxed opacity-95">
              "{collection.description}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Editorial Narrative Section */}
      <div className="max-w-3xl mx-auto px-6 text-center mb-20">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-bronze-600 mb-3 block">
          Spatial Aesthetic & Concept
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-charcoal-900 mb-6 leading-snug">
          Designed around quiet silhouettes, intentional materials, and tactile longevity.
        </h2>
        <p className="text-sm font-sans text-charcoal-600 leading-relaxed">
          The {collection.name} collection expresses DecorAura's commitment to subtle geometry and natural warmth. Every piece in this selection is curated to harmonize with architectural light and quiet living.
        </p>
      </div>

      {/* 3. Curated Product Selection */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-ivory-300">
          <div>
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-600">
              Curated Objects
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-charcoal-900">Featured Pieces</h3>
          </div>
          <span className="text-xs font-sans text-charcoal-500">
            {products.length} {products.length === 1 ? 'Object' : 'Objects'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-ivory-300 text-center">
            <p className="text-sm font-sans text-charcoal-500">No objects currently assigned to this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-ivory-300 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[4/5] bg-ivory-200 overflow-hidden cursor-pointer"
                >
                  <ProductImage
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.is_3d_enabled && (
                    <span className="absolute top-3 left-3 bg-bronze-500 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10">
                      3D Interactive
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-charcoal-500 mb-1">
                    {product.category ? product.category.name : 'Decor'}
                  </span>
                  <h4
                    onClick={() => onSelectProduct(product)}
                    className="text-xl font-serif text-charcoal-900 hover:text-bronze-600 transition-colors cursor-pointer mb-2"
                  >
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-1 text-xs text-bronze-600 mb-4">
                    <Star size={12} fill="currentColor" />
                    <span>{(Number(product?.rating) || 5.0).toFixed(1)} ({product?.reviews_count || 12})</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-ivory-200 flex items-center justify-between">
                    <span className="text-xl font-serif font-semibold text-charcoal-900">
                      ${(Number(product?.price) || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="p-2.5 rounded-full bg-ivory-200 hover:bg-charcoal-900 hover:text-white transition-colors"
                      title="Add to Bag"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Related Blog Articles (From the Journal) */}
      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-24 pt-16 border-t border-ivory-300">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-600">
                Editorial Journal
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-charcoal-900">From the Journal</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedBlogs.map(blog => (
              <div
                key={blog.id}
                onClick={() => onSelectArticle && onSelectArticle(blog)}
                className="group cursor-pointer bg-white p-6 rounded-3xl border border-ivory-300 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-center"
              >
                <div className="w-full md:w-44 h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-ivory-200">
                  <ProductImage
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-bronze-600 block mb-1">
                    {blog.reading_time || '5 min read'}
                  </span>
                  <h4 className="text-lg font-serif text-charcoal-900 group-hover:text-bronze-600 transition-colors mb-2">
                    {blog.title}
                  </h4>
                  <p className="text-xs font-sans text-charcoal-500 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Related Collections Navigation */}
      {allCollections.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 border-t border-ivory-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif text-charcoal-900 flex items-center gap-2">
              <Layers size={18} className="text-bronze-600" /> Explore Other Collections
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCollections.map(other => (
              <div
                key={other.id}
                onClick={() => onSelectCollection && onSelectCollection(other)}
                className="group cursor-pointer bg-white p-5 rounded-2xl border border-ivory-300 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-ivory-200">
                  <ProductImage
                    src={other.hero_image}
                    alt={other.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-serif text-lg text-charcoal-900 group-hover:text-bronze-600 transition-colors mb-1">
                  {other.name}
                </h4>
                <p className="text-xs font-sans text-charcoal-500 line-clamp-1">
                  {other.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
