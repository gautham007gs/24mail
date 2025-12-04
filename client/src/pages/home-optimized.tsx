import { useEffect } from "react";
import Home from "./home";
import { observeLazyImages } from "@/lib/performance";

/**
 * HomeOptimized: Wraps the home page with performance optimizations
 * - Observes lazy-loaded images
 * - Prefetches critical API data in idle time
 * - Ensures fast critical path rendering
 */
export default function HomeOptimized() {
  useEffect(() => {
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
