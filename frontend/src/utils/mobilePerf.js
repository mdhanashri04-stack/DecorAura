/**
 * DecorAura Mobile Performance Utility
 *
 * Provides device detection, WebGL rendering preset switching (Mobile vs Desktop),
 * and IntersectionObserver helpers to freeze offscreen WebGL render loops.
 */

/**
 * Check if the current environment is a mobile / small touch device
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const isSmallScreen = window.innerWidth <= 768;
  const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  return isSmallScreen || (isTouch && (isMobileUA || window.innerWidth <= 820));
};

/**
 * Get device-tailored WebGL configuration parameters
 */
export const getWebGLConfig = () => {
  const mobile = isMobileDevice();

  return {
    isMobile: mobile,
    // Pixel ratio: cap at 1.0 on mobile to avoid 3x retina overdraw lag
    pixelRatio: mobile ? 1.0 : Math.min(window.devicePixelRatio, 2),
    // Disable shadow mapping on mobile to save GPU frame passes
    enableShadows: !mobile,
    // Subdivision geometry counts (reduced on mobile for zero visual loss)
    cylinderSegments: mobile ? 24 : 64,
    torusRadialSegments: mobile ? 24 : 32,
    torusTubularSegments: mobile ? 48 : 100,
    sphereSegments: mobile ? 24 : 64,
    // GSAP ScrollTrigger scrub configuration
    scrubConfig: mobile ? 0.2 : true
  };
};

/**
 * Utility to observe element visibility and pause WebGL RAF render loops when offscreen
 */
export const setupVisibilityObserver = (element, onVisibilityChange) => {
  if (typeof window === 'undefined' || !element || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        onVisibilityChange(entry.isIntersecting);
      });
    },
    { threshold: 0.05 }
  );

  observer.observe(element);

  return () => {
    observer.disconnect();
  };
};
