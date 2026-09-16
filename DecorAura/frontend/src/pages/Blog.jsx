import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { Clock, ArrowRight } from 'lucide-react';
import ProductImage from '../components/ProductImage';

export default function Blog({ onSelectArticle, onNavigate }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    document.title = 'Journal | DecorAura';
    async function loadBlogs() {
      const data = await API.getBlogs();
      setBlogs(data);
    }
    loadBlogs();
  }, []);

  return (
    <div className="pt-28 pb-24 bg-ivory-50 min-h-screen">
      <div className="bg-ivory-200/60 py-16 text-center border-b border-ivory-300 mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors mb-6"
          >
            ← Back to Home
          </button>
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
            Editorial Publication
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-3">The DecorAura Journal</h1>
          <p className="text-sm font-sans text-charcoal-500 max-w-md mx-auto">
            Lighting architecture, spatial theory, and material craftsmanship.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden bg-ivory-200">
                <ProductImage
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs font-sans text-charcoal-500 mb-3">
                  <span className="text-bronze-600 font-bold uppercase tracking-wider">
                    {article.category ? article.category.name : 'Journal'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {article.reading_time}</span>
                </div>

                <h2 className="text-2xl font-serif text-charcoal-900 group-hover:text-bronze-600 transition-colors mb-3">
                  {article.title}
                </h2>

                <p className="text-sm font-sans text-charcoal-500 line-clamp-3 leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-ivory-200 flex items-center gap-1 text-xs font-sans font-bold uppercase tracking-wider text-bronze-600 group-hover:text-charcoal-900 transition-colors">
                  Read Full Article <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
