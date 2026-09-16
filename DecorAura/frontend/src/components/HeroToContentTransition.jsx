import React from 'react';

export default function HeroToContentTransition() {
  return (
    <section className="relative bg-ivory-200/60 py-24 md:py-36 text-center border-t border-b border-ivory-300">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-bronze-600 mb-4 block">
          Spatial Harmony
        </span>

        <h2 className="text-4xl md:text-6xl font-serif text-charcoal-900 leading-tight mb-8">
          "Designed for spaces <br className="hidden md:inline" />
          <span className="italic text-bronze-600 font-light">that feel like you.</span>"
        </h2>

        <div className="w-16 h-0.5 bg-bronze-500 mx-auto mb-8"></div>

        <p className="text-base md:text-lg font-sans text-charcoal-500 max-w-2xl mx-auto leading-relaxed">
          Every piece in the DecorAura portfolio is crafted alongside master stone masons, ceramicists, and mouth-blown glass artisans. Built for quiet luxury and sensory tactile warmth.
        </p>
      </div>
    </section>
  );
}
