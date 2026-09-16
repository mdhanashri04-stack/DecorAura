import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ShopBySpace({ onSelectSpace }) {
  const spaces = [
    {
      title: 'LIVING ROOM',
      count: '18 Objects',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
      slug: 'living'
    },
    {
      title: 'BEDROOM',
      count: '12 Objects',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800',
      slug: 'bedroom'
    },
    {
      title: 'DINING',
      count: '15 Objects',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800',
      slug: 'dining'
    },
    {
      title: 'HOME OFFICE',
      count: '9 Objects',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800',
      slug: 'office'
    }
  ];

  return (
    <section className="py-24 bg-ivory-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-2 block">
              Spatial Curation
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900">FIND YOUR SPACE</h2>
          </div>
          <p className="text-sm font-sans text-charcoal-500 max-w-sm">
            Curated furniture, illumination, and tactile objects tailored for distinct living environments.
          </p>
        </div>

        {/* Spaces Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spaces.map((space) => (
            <div
              key={space.slug}
              onClick={() => onSelectSpace(space.slug)}
              className="group relative h-[480px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Background Image */}
              <img
                src={space.image}
                alt={space.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <span className="text-[11px] font-sans uppercase tracking-widest text-bronze-500 font-bold bg-charcoal-900/60 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                  {space.count}
                </span>

                <div>
                  <h3 className="text-2xl font-serif mb-2 tracking-tight text-white">{space.title}</h3>
                  <div className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-widest text-bronze-500 group-hover:text-white transition-colors duration-300">
                    Explore Space <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
