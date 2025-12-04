import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * createLazyRoute: Helper to create lazy-loaded route components
 * with automatic Suspense boundary and fallback UI.
 */
export function createLazyRoute<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const Component = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={fallback || <RouteSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Fallback skeleton component for lazy-loaded routes.
 */
function RouteSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

/**
 * Lazy-load images by using IntersectionObserver.
 * Add data-src="..." and loading="lazy" to <img> elements.
 */
export function observeLazyImages(selector = 'img[data-src]') {
  if (typeof window === 'undefined') return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: just load all images immediately
    document.querySelectorAll(selector).forEach((img: any) => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
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
    },
    { rootMargin: '50px' }
  );

  document.querySelectorAll(selector).forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * Defer analytics and tracking until after LCP.
 */
export function deferAnalytics(callback: () => void) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 5000 });
  } else {
    setTimeout(callback, 2000);
  }
}
