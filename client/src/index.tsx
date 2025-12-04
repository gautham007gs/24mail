
<old_str>
// Register service worker for offline support
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silently fail - SW registration is optional
    });
  });
}
</old_str>
<new_str>
import './react-fix';

// Register service worker for offline support
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silently fail - SW registration is optional
    });
  });
}
</new_str>
