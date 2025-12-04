// Service Worker for PWA functionality
declare const self: any;

const CACHE_NAME = "tempmail-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.png",
];

// Install event - cache essential files
self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache: any) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames: any) => {
      return Promise.all(
        cacheNames.map((cacheName: any) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy for static assets, network-first for API
self.addEventListener("fetch", (event: any) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls and external requests
  if (url.pathname.startsWith("/api/") || url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Return cached response on network failure
          return caches.match(request);
        });
    })
  );
});

export {};
