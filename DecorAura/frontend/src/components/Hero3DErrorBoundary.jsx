import React from 'react';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

export default class Hero3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Hero3D WebGL Exception captured by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-screen bg-ivory-50 overflow-hidden flex flex-col justify-between p-6 md:p-12 pt-44 md:pt-48 border-b border-ivory-300">
          {/* Static Hero Image Fallback Background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-90">
            <img
              src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200"
              alt="Aurelia Halo Lamp"
              className="max-h-[70vh] max-w-[80vw] object-contain drop-shadow-2xl filter contrast-105"
            />
          </div>

          {/* Top Eyebrow & Headline */}
          <div className="max-w-xl z-10 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ivory-100/80 border border-ivory-300 text-[11px] font-sans font-semibold tracking-widest uppercase text-bronze-600 mb-4 backdrop-blur-md">
              <Sparkles size={12} /> OBJECT 01
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-charcoal-900 leading-[1.05] tracking-tight mb-4">
              Light, <br /><span className="italic font-light text-bronze-600">reimagined.</span>
            </h1>

            <p className="text-sm md:text-base font-sans text-charcoal-500 max-w-md leading-relaxed mb-8">
              Aurelia Halo is a sculptural table lamp designed to turn ordinary spaces into atmospheric ones through floating glass and brushed bronze.
            </p>

            <button
              onClick={this.props.onExploreProduct}
              className="px-6 py-3 bg-charcoal-900 hover:bg-bronze-500 text-white rounded-full text-xs font-sans uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-bronze-500/20"
            >
              Explore Aurelia <ArrowRight size={14} />
            </button>
          </div>

          {/* Bottom Assembly Counter & Scroll Prompt */}
          <div className="flex items-end justify-between w-full border-t border-ivory-300/40 pt-4 z-10 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-bronze-500"></div>
              <span className="text-xs font-sans uppercase tracking-widest text-charcoal-500 font-semibold">
                Sculptural Edition: <span className="text-bronze-600 font-bold">Aurelia Halo</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-bronze-600 font-semibold">
              <span>Scroll to explore collection</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
