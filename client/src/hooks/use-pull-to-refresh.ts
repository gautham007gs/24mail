import { useEffect, useRef } from 'react';

export function usePullToRefresh(onRefresh: () => void, threshold = 100) {
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      isScrolling.current = container.scrollTop === 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isScrolling.current) return;

      const touchCurrentY = e.touches[0].clientY;
      const diff = touchCurrentY - touchStartY.current;

      if (diff > threshold) {
        if (container.style.transform !== `translateY(${diff}px)`) {
          container.style.transform = `translateY(${Math.min(diff, threshold * 1.5)}px)`;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchEndY - touchStartY.current;

      container.style.transform = 'translateY(0)';
      container.style.transition = 'transform 0.3s ease-out';

      if (diff > threshold && isScrolling.current) {
        onRefresh();
      }

      setTimeout(() => {
        container.style.transition = '';
      }, 300);

      isScrolling.current = false;
    };

    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', handleTouchMove, false);
    container.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold]);

  return containerRef;
}
