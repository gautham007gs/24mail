/**
 * Service Worker for offline support and comprehensive caching strategy
 * Cache Strategy:
 * - Static Assets: Cache-first (HTML, CSS, JS, fonts)
 * - Images: Cache-first with stale-while-revalidate
 * - API Calls: Network-first with timeout fallback
 */

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  STATIC: `tempmail-static-${CACHE_VERSION}`,
  IMAGES: `tempmail-images-${CACHE_VERSION}`,
  API: `tempmail-api-${CACHE_VERSION}`,
  OFFLINE: `tempmail-offline-${CACHE_VERSION}`,
};

// Critical assets that MUST be cached immediately
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/logo-32.png',
  '/logo-64.png',
  '/manifest.json',
];

// Assets to preload during install
const PRELOAD_ASSETS = [
  '/logo-32.webp',
  '/logo-32.png',
  '/logo-64.webp',
  '/logo-64.png',
  '/apple-touch-icon.webp',
  '/apple-touch-icon.png',
];

// Install event - cache static assets and images
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CACHE_NAMES.STATIC).then((cache) => {
        return cache.addAll(CRITICAL_ASSETS).catch((err) => {
          console.warn('[SW] Failed to cache some critical assets:', err);
        });
      }),
      // Preload images for faster LCP
      caches.open(CACHE_NAMES.IMAGES).then((cache) => {
        return cache.addAll(PRELOAD_ASSETS).catch((err) => {
          console.warn('[SW] Failed to preload images:', err);
        });
      }),
    ])
  );
  
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old versioned caches
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - intelligent caching based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return event.respondWith(fetch(request));
  }
  
  // Skip external/cross-origin requests (except APIs we explicitly allow)
  if (url.origin !== self.location.origin) {
    if (request.url.includes('api.barid.site')) {
      // Allow Barid API calls but with network-first
      return handleAPIRequest(event);
    }
    return event.respondWith(fetch(request));
  }
  
  // Route by asset type
  if (isImage(url.pathname)) {
    handleImageRequest(event);
  } else if (isAPI(url.pathname)) {
    handleAPIRequest(event);
  } else if (isStaticAsset(url.pathname)) {
    handleStaticAssetRequest(event);
  } else {
    handleDocumentRequest(event);
  }
});

/**
 * Cache-first strategy for static assets (JS, CSS, fonts)
 */
function handleStaticAssetRequest(event) {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAMES.STATIC).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Offline fallback for static assets
          return caches.match('/');
        });
    })
  );
}

/**
 * Cache-first with stale-while-revalidate for images
 */
function handleImageRequest(event) {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache immediately
        // Update cache in background for next visit
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAMES.IMAGES).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          })
          .catch(() => {}); // Silent fail
        
        return cachedResponse;
      }
      
      // Not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Cache successful image responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAMES.IMAGES).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Return a 1x1 transparent PNG as fallback
          return new Response(
            new Uint8Array([
              0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
              0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
              0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
              0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0xf8, 0xff, 0xff, 0xff,
              0x7f, 0x00, 0x05, 0x00, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb4, 0x00,
              0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
            ]),
            {
              headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'no-store',
              },
            }
          );
        });
    })
  );
}

/**
 * Network-first strategy for API calls with timeout fallback
 */
function handleAPIRequest(event) {
  event.respondWith(
    new Promise((resolve) => {
      const timeout = setTimeout(() => {
        // Timeout after 5 seconds, try cache
        caches
          .match(event.request)
          .then((response) => {
            resolve(
              response ||
                new Response(
                  JSON.stringify({ error: 'Offline and no cached data' }),
                  {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' },
                  }
                )
            );
          });
      }, 5000);
      
      fetch(event.request)
        .then((response) => {
          clearTimeout(timeout);
          
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Cache successful API responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAMES.API).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          resolve(response);
        })
        .catch(() => {
          clearTimeout(timeout);
          
          // Network failed, try cache
          caches
            .match(event.request)
            .then((response) => {
              resolve(
                response ||
                  new Response(
                    JSON.stringify({ error: 'Network request failed' }),
                    {
                      status: 503,
                      headers: { 'Content-Type': 'application/json' },
                    }
                  )
              );
            });
        });
    })
  );
}

/**
 * Network-first for HTML documents (fallback to offline page)
 */
function handleDocumentRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Cache HTML documents
        const responseToCache = response.clone();
        caches.open(CACHE_NAMES.STATIC).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Return cached version or offline page
        return (
          caches.match(event.request) ||
          caches.match('/') ||
          new Response('Offline - No content available', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          })
        );
      })
  );
}

// Utility functions
function isImage(pathname) {
  return /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(pathname);
}

function isAPI(pathname) {
  return pathname.startsWith('/api/');
}

function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(pathname);
}

console.log('[SW] Service worker loaded');
