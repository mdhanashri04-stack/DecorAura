import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, ShoppingBag, Plus } from 'lucide-react';
import { API } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';
import { trackViewArticle } from '../utils/analytics';

export default function Article({ article, onBack, onSelectProduct }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadArticleProducts() {
      if (!article) return;
      trackViewArticle(article);
      const prods = await API.getBlogProducts(article.slug);
      setFeaturedProducts(prods);
    }
    loadArticleProducts();
  }, [article]);

  if (!article) return <div className="pt-32 text-center">Article not found.</div>;

  return (
    <div className="pt-28 pb-24 bg-ivory-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Journal
        </button>

        {/* Article Header */}
        <div className="mb-10 text-center">
          <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-600 mb-3 block">
            {article.category ? article.category.name : 'Journal'}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-charcoal-900 leading-tight mb-6">{article.title}</h1>
          
          <div className="flex items-center justify-center gap-6 text-xs font-sans text-charcoal-500">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {article.reading_time || '5 min read'}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recent'}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-ivory-300 mb-12 aspect-[16/9] max-h-[520px]">
          <ProductImage src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-lg max-w-none text-charcoal-700 font-sans leading-relaxed space-y-6 mb-16">
          <p className="text-lg font-serif italic text-charcoal-900 border-l-2 border-bronze-500 pl-4 py-1">
            "{article.excerpt}"
          </p>
          <div className="whitespace-pre-line text-sm md:text-base leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Content-Commerce: Products Featured in this Look */}
        {featuredProducts.length > 0 && (
          <div className="p-8 bg-ivory-100 rounded-3xl border border-ivory-300">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag size={18} className="text-bronze-600" />
              <h3 className="text-2xl font-serif text-charcoal-900">Products Featured in this Article</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredProducts.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-ivory-200 flex gap-4 items-center shadow-sm">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <ProductImage src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-charcoal-900 cursor-pointer hover:text-bronze-600" onClick={() => onSelectProduct(p)}>{p.name}</h4>
                    <div className="text-sm font-serif font-semibold text-charcoal-900 mb-2">${(Number(p?.price) || 0).toFixed(2)}</div>
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="px-3 py-1 bg-charcoal-900 text-white hover:bg-bronze-500 rounded-full text-[10px] font-sans uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Add to Bag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
