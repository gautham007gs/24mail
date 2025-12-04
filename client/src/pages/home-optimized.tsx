import { useEffect } from "react";
import Home from "./home";
import { deferAnalytics, observeLazyImages } from "@/lib/performance";

/**
 * HomeOptimized: Wraps the home page with performance optimizations
 * - Defers analytics loading until after LCP
 * - Observes lazy-loaded images
 * - Ensures critical path rendering
 */
export default function HomeOptimized() {
  useEffect(() => {
    // Defer analytics/tracking until after initial load completes
    deferAnalytics(() => {
      // Initialize any analytics here (e.g., Google Analytics, Sentry)
      // Example: window.gtag?.('event', 'page_view');
      console.log("[Performance] Analytics deferred until after LCP");
    });

    // Start observing lazy-loadable images
    observeLazyImages('img[data-src]');

    // Prefetch API data that will be needed soon
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Prefetch domains and other critical API calls
        fetch('/api/domains', { credentials: 'include' }).catch(() => {
          // Silently fail if prefetch is not available
        });
      });
    }
  }, []);

  return <Home />;
}
