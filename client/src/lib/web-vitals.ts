/**
 * Performance monitoring and Web Vitals tracking
 * Logs critical performance metrics for debugging and optimization
 */

export interface PerformanceMetrics {
  fcp: number | null;        // First Contentful Paint
  lcp: number | null;        // Largest Contentful Paint
  cls: number | null;        // Cumulative Layout Shift
  fid: number | null;        // First Input Delay
  ttfb: number | null;       // Time to First Byte
  dcl: number | null;        // DOM Content Loaded
  loadTime: number | null;   // Full page load time
}

let metrics: PerformanceMetrics = {
  fcp: null,
  lcp: null,
  cls: null,
  fid: null,
  ttfb: null,
  dcl: null,
  loadTime: null,
};

/**
 * Initialize Web Vitals tracking
 */
export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  // Measure Time to First Byte (TTFB)
  window.addEventListener('load', () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
    if (navigationTiming) {
      metrics.ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
      metrics.dcl = navigationTiming.domContentLoadedEventEnd - navigationTiming.navigationStart;
      metrics.loadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
    }
  });

  // Measure First Contentful Paint (FCP)
  if ('PerformanceObserver' in window) {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = Math.round(entry.startTime);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Silently fail if API not available
    }

    // Measure Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = Math.round(lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Silently fail if API not available
    }

    // Measure Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = parseFloat(clsValue.toFixed(3));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Silently fail if API not available
    }

    // Measure First Input Delay (FID) - deprecated in favor of INP but still useful
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const firstEntry = list.getEntries()[0] as any;
        metrics.fid = Math.round(firstEntry.processingEnd - firstEntry.startTime);
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Silently fail if API not available
    }
  }

  // Report metrics when user leaves the page
  if ('sendBeacon' in navigator) {
    window.addEventListener('beforeunload', () => {
      const metricsData = JSON.stringify(metrics);
      // Send to your analytics endpoint
      // navigator.sendBeacon('/api/metrics', metricsData);
      console.log('[Performance Metrics]', metrics);
    });
  }
}

/**
 * Get current metrics
 */
export function getMetrics(): PerformanceMetrics {
  return { ...metrics };
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary() {
  if (typeof window === 'undefined') return;

  setTimeout(() => {
    console.log('%c⚡ Performance Summary', 'color: #00d4ff; font-weight: bold; font-size: 14px;');
    console.log(`  FCP: ${metrics.fcp}ms`);
    console.log(`  LCP: ${metrics.lcp}ms`);
    console.log(`  CLS: ${metrics.cls}`);
    console.log(`  FID: ${metrics.fid}ms`);
    console.log(`  TTFB: ${metrics.ttfb}ms`);
    console.log(`  DCL: ${metrics.dcl}ms`);
    console.log(`  Load Time: ${metrics.loadTime}ms`);
  }, 5000);
}
