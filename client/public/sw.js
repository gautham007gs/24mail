/**
 * Service Worker for offline support and smart caching
 * Bypasses caching for development requests
 */

const CACHE_NAME = 'tempmail-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - cleanup old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - pass through to network (disable caching for now)
self.addEventListener('fetch', (event) => {
  // Always pass through to network - no caching
  return;
});
