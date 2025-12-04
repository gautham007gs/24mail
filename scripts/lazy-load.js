#!/usr/bin/env node
/**
 * Lazy-load helper script to inject into the app for:
 * - Deferring analytics until after LCP
 * - Lazy-loading third-party scripts
 * - Deferring non-critical styles and fonts
 */

export const initLazyLoading = () => {
  // Defer analytics (e.g., Google Analytics, Sentry) until after LCP
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      // Load analytics here
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://analytics.example.com/tracking.js'; // placeholder
      // document.body.appendChild(script); // Uncomment when real analytics are set up
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      // Load analytics here
    }, 2000);
  }
};

export const lazyLoadImages = () => {
  // Use Intersection Observer to lazy-load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

export const deferFonts = () => {
  // Fonts are already set to load asynchronously in index.html
  // This function ensures fallback behavior for browsers without font-display support
  const fonts = document.querySelectorAll('link[rel="preload"][as="font"]');
  fonts.forEach(font => {
    font.addEventListener('load', () => {
      font.media = 'all';
    });
  });
};
