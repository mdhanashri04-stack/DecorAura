import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Hero3D from '../components/Hero3D';
import Hero3DErrorBoundary from '../components/Hero3DErrorBoundary';
import HeroToContentTransition from '../components/HeroToContentTransition';
import ShopBySpace from '../components/ShopBySpace';
import FeaturedCollection from '../components/FeaturedCollection';
import ShopTheLook from '../components/ShopTheLook';
import ScrollStorytelling from '../components/ScrollStorytelling';
import ProductImage from '../components/ProductImage';
import { API } from '../services/api';

export default function Home({ onNavigate, onSelectProduct, onSectionChange, onHeroReady }) {
  const [products, setProducts] = useState(API.getFallbackProducts());
  const [blogs, setBlogs] = useState(API.getFallbackBlogs());

  const curatedCollections = [
    {
      slug: 'minimal',
      title: 'MINIMAL',
      subtitle: 'Pure Form & Essential Lines',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800',
      description: 'Monochromatic architectural objects built around subtle proportions and quiet luxury.'
    },
    {
      slug: 'earthbound',
      title: 'EARTHBOUND',
      subtitle: 'Raw Stone & Ceramic Geometry',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800',
      description: 'Hand-carved travertine, terracotta vessels, and textured natural stone lighting.'
    },
    {
      slug: 'luxe',
      title: 'LUXE',
      subtitle: 'Champagne Bronze & Glass',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
      description: 'Sculptural mouth-blown glass diffusers paired with precision-machined solid brass.'
    },
    {
      slug: 'neutrals',
      title: 'WARM NEUTRALS',
      subtitle: 'Sensory Tactile Warmth',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800',
      description: 'Soft linen tones, warm alabaster glows, and serene ambient home accessories.'
    }
  ];

  useEffect(() => {
    document.title = 'DecorAura — Luxury Interior & Home Decor';
    console.log('[DecorAura] Homepage mounted');
    async function loadData() {
      try {
        const [prods, b] = await Promise.all([
          API.getProducts().catch(() => API.getFallbackProducts()),
          API.getBlogs().catch(() => API.getFallbackBlogs())
        ]);
        if (prods && prods.length > 0) setProducts(prods);
        if (b && b.length > 0) setBlogs(b);
      } catch (err) {
        console.warn('Home data API load fallback:', err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!onSectionChange) return;

    const sections = ['hero', 'shop', 'collections', 'spaces', 'journal'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onSectionChange(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onSectionChange]);

  const handleExploreProduct = () => {
    const aurelia = products.find((p) => p.slug === 'aurelia-lamp') || products[0];
    if (aurelia) onSelectProduct(aurelia);
  };

  return (
    <div className="w-full">
      {/* 1. 3D HERO (#hero) */}
      <section id="hero">
        <Hero3DErrorBoundary onExploreProduct={handleExploreProduct}>
          <Hero3D onExploreProduct={handleExploreProduct} onReady={onHeroReady} />
        </Hero3DErrorBoundary>
      </section>

      {/* 2. BRAND STATEMENT (#brand) */}
      <section id="brand">
        <HeroToContentTransition />
      </section>

      {/* 3. SHOP SECTION (#shop) */}
      <section id="shop" className="scroll-mt-20">
        <FeaturedCollection products={products} onSelectProduct={onSelectProduct} />
        <div className="bg-ivory-50 pb-16 text-center">
          <button
            onClick={() => onNavigate('shop-page')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-xs font-sans uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl"
          >
            View All Products Catalog <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 4. COLLECTIONS SECTION (#collections) */}
      <section id="collections" className="py-24 bg-ivory-100/60 border-t border-b border-ivory-300 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
                Portfolio Curation
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900">CURATED COLLECTIONS</h2>
            </div>
            <button
              onClick={() => onNavigate('collections-page')}
              className="text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors"
            >
              Explore Full Collections →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {curatedCollections.map((col) => (
              <div
                key={col.slug}
                onClick={() => onNavigate('collection-detail', { slug: col.slug })}
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/30 to-transparent"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <span className="text-xs font-sans uppercase tracking-widest text-bronze-400 font-bold mb-1">
                    {col.subtitle}
                  </span>
                  <h3 className="text-3xl font-serif mb-2 tracking-tight text-white">{col.title}</h3>
                  <p className="text-xs font-sans text-white/70 max-w-md line-clamp-2 mb-4 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-bronze-400 group-hover:text-white transition-colors duration-300 font-semibold">
                    Explore Collection <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SPACES SECTION (#spaces) */}
      <section id="spaces" className="scroll-mt-20">
        <ShopBySpace
          onSelectSpace={() => {
            const el = document.getElementById('shop');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* 6. SHOP THE LOOK (#shop-the-look) */}
      <section id="shop-the-look" className="scroll-mt-20">
        <ShopTheLook products={products} onSelectProduct={onSelectProduct} />
      </section>

      {/* 7. SCROLL STORYTELLING (#story) */}
      <section id="story" className="scroll-mt-20">
        <ScrollStorytelling />
      </section>

      {/* 8. JOURNAL SECTION (#journal) */}
      <section id="journal" className="py-24 bg-ivory-50 border-t border-ivory-300 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
                Editorial Publication
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900">THE DECORAURA JOURNAL</h2>
            </div>
            <button
              onClick={() => onNavigate('journal-page')}
              className="text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors"
            >
              View All Journal →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((article) => (
              <div
                key={article.id}
                onClick={() => onNavigate('journal-page')}
                className="group bg-white rounded-3xl overflow-hidden border border-ivory-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden bg-ivory-200">
                  <ProductImage
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs font-sans text-charcoal-500 mb-3">
                    <span className="text-bronze-600 font-bold uppercase tracking-wider">
                      {article.category ? article.category.name : 'Journal'}
                    </span>
                    <span>•</span>
                    <span>{article.reading_time}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-charcoal-900 group-hover:text-bronze-600 transition-colors mb-3">
                    {article.title}
                  </h3>
                  <p className="text-sm font-sans text-charcoal-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
