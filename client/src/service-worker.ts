/**
 * Service Worker TypeScript - compiled to client/public/sw.js
 * Comprehensive offline caching strategy with multiple cache buckets
 */

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  STATIC: `tempmail-static-${CACHE_VERSION}`,
  IMAGES: `tempmail-images-${CACHE_VERSION}`,
  API: `tempmail-api-${CACHE_VERSION}`,
};

const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/logo-32.png',
  '/logo-64.png',
  '/manifest.json',
];

const PRELOAD_ASSETS = [
  '/logo-32.webp',
  '/logo-32.png',
  '/logo-64.webp',
  '/logo-64.png',
];

// Install: Cache critical assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      caches
        .open(CACHE_NAMES.STATIC)
        .then((cache) => cache.addAll(CRITICAL_ASSETS).catch(() => {})),
      caches
        .open(CACHE_NAMES.IMAGES)
        .then((cache) => cache.addAll(PRELOAD_ASSETS).catch(() => {})),
    ])
  );
  self.skipWaiting();
});

// Activate: Cleanup old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Intelligent routing
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from same origin
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Route by content type
  if (isImage(url.pathname)) {
    handleImageCache(event);
  } else if (isAPI(url.pathname)) {
    handleAPICache(event);
  } else if (isStaticAsset(url.pathname)) {
    handleStaticCache(event);
  } else {
    handleDocumentCache(event);
  }
});

/**
 * Cache-first for static assets (JS, CSS, fonts)
 */
function handleStaticCache(event: FetchEvent) {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          if (response?.status === 200) {
            caches.open(CACHE_NAMES.STATIC).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })
      );
    })
  );
}

/**
 * Cache-first with stale-while-revalidate for images
 */
function handleImageCache(event: FetchEvent) {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Serve from cache immediately
      if (cachedResponse) {
        // Update in background
        fetch(event.request)
          .then((response) => {
            if (response?.status === 200) {
              caches.open(CACHE_NAMES.IMAGES).then((cache) => {
                cache.put(event.request, response.clone());
              });
            }
          })
          .catch(() => {});

        return cachedResponse;
      }

      // Not cached, fetch and cache
      return fetch(event.request).then((response) => {
        if (response?.status === 200) {
          caches.open(CACHE_NAMES.IMAGES).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
}

/**
 * Network-first with timeout for API calls
 */
function handleAPICache(event: FetchEvent) {
  event.respondWith(
    Promise.race([
      fetch(event.request),
      new Promise((resolve) =>
        setTimeout(() => resolve(null), 5000)
      ),
    ])
      .then((response: any) => {
        if (response?.status === 200) {
          caches.open(CACHE_NAMES.API).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      })
      .catch(() => null)
      .then((response) => {
        return (
          response ||
          caches.match(event.request) ||
          new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      })
  );
}

/**
 * Network-first for HTML documents
 */
function handleDocumentCache(event: FetchEvent) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response?.status === 200) {
          caches.open(CACHE_NAMES.STATIC).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        return (
          caches.match(event.request) ||
          caches.match('/') ||
          new Response('Offline', { status: 503 })
        );
      })
  );
}

// Helpers
function isImage(pathname: string): boolean {
  return /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(pathname);
}

function isAPI(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(pathname);
}

export {};
