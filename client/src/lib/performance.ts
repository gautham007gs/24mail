/**
 * Performance monitoring and optimization utilities
 */

class PerformanceMonitor {
  private static marks = new Map<string, number>();

  /**
   * Start performance measurement
   */
  static startMeasure(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * End performance measurement and log
   */
  static endMeasure(label: string, logToConsole = false): number {
    const start = this.marks.get(label);
    if (!start) return 0;

    const duration = performance.now() - start;
    if (logToConsole && duration > 16) { // Log if slower than 1 frame (60fps)
      console.debug(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }

    this.marks.delete(label);
    return duration;
  }

  /**
   * Batch DOM updates using requestAnimationFrame
   */
  static scheduleRender(callback: () => void): void {
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(callback);
    } else {
      callback();
    }
  }

  /**
   * Schedule low-priority work for when browser is idle
   */
  static scheduleIdleWork(callback: () => void): void {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 0);
    }
  }

  /**
   * Measure Web Vitals
   */
  static measureWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.debug('[Web Vital] LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (err) {
        // Silently fail - not all browsers support this
      }
    }
  }
}

export default PerformanceMonitor;
