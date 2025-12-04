/**
 * Web Vitals tracking utility
 * Measures Core Web Vitals and other performance metrics
 */

export function initPerformanceTracking(): void {
  if (!('web' in window) || !('vitals' in (window as any).web)) {
    // Initialize Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      try {
        // Monitor Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.debug('[Web Vitals] LCP:', lastEntry.renderTime || lastEntry.loadTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor First Input Delay (FID) / Interaction to Next Paint (INP)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ('processingDuration' in entry) {
              console.debug('[Web Vitals] FID/INP:', (entry as any).processingDuration);
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input', 'event'] });

        // Monitor Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          console.debug('[Web Vitals] CLS:', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.debug('[Web Vitals] PerformanceObserver not fully supported:', e);
      }
    }
  }
}

export function logPerformanceSummary(): void {
  if ('PerformanceAPI' in window || 'performance' in window) {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;

    console.debug('[Web Vitals] Performance Summary:', {
      pageLoadTime: `${pageLoadTime}ms`,
      connectTime: `${connectTime}ms`,
      renderTime: `${renderTime}ms`,
      domContentLoaded: `${domContentLoaded}ms`,
    });
  }
}
