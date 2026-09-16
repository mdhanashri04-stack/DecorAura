import React, { useState, useEffect, useRef } from 'react';
import { getProductImageUrl } from '../utils/imageHelper';

export default function ProductImage({
  src,
  alt = 'DecorAura Product',
  className = 'w-full h-full object-cover',
  fallbackSrc = null,
  containerClassName = 'relative w-full h-full bg-ivory-200 overflow-hidden'
}) {
  const [imageStage, setImageStage] = useState(0); // 0: primary, 1: fallback, 2: neutral SVG placeholder
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000";

  const primaryUrl = getProductImageUrl(src);
  const secondaryUrl = fallbackSrc ? getProductImageUrl(fallbackSrc) : DEFAULT_FALLBACK;

  useEffect(() => {
    setImageStage(0);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  useEffect(() => {
    if (imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoading(false);
      }
    }
  }, [primaryUrl, secondaryUrl, imageStage]);

  const handleError = () => {
    setIsLoading(false);
    if (imageStage === 0 && secondaryUrl && secondaryUrl !== primaryUrl) {
      setImageStage(1);
    } else {
      setImageStage(2);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={containerClassName}>
      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-200 via-ivory-100 to-ivory-200 animate-pulse z-10" />
      )}

      {imageStage === 0 && primaryUrl && (
        <img
          ref={imgRef}
          src={primaryUrl}
          alt={alt || 'DecorAura Product'}
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {imageStage === 1 && secondaryUrl && (
        <img
          ref={imgRef}
          src={secondaryUrl}
          alt={alt || 'DecorAura Product'}
          className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Stage 2: Beautiful Neutral DecorAura Placeholder */}
      {(imageStage === 2 || !primaryUrl) && (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-ivory-100 via-ivory-200 to-ivory-300 text-charcoal-700 select-none">
          <div className="w-14 h-14 mb-3 rounded-full bg-ivory-50/80 border border-ivory-300 flex items-center justify-center shadow-sm">
            <svg
              className="w-7 h-7 text-bronze-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <span className="text-xs font-serif font-medium text-charcoal-900 tracking-wide text-center">
            DecorAura Object
          </span>
          <span className="text-[10px] font-sans uppercase tracking-widest text-bronze-600 mt-1">
            {alt || 'Curated Design'}
          </span>
        </div>
      )}
    </div>
  );
}
