const CACHE_NAME = "ar-typing-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/icon-maskable.svg",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell and core assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  
  // Skip non-GET requests, API calls, and Next.js hot-reloading websockets
  if (
    request.method !== "GET" || 
    request.url.includes("/api/") || 
    request.url.includes("/_next/webpack-hmr") ||
    request.url.includes("/_next/image")
  ) {
    return;
  }

  // Strategy: Stale-While-Revalidate for JS/CSS/HTML and static files
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and fetch from network in background to update cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {
            // Ignore background fetch errors
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(request).then((networkResponse) => {
        // Cache valid static resource responses
        if (
          networkResponse.status === 200 &&
          (request.url.includes("/_next/static/") ||
            request.url.includes("/fonts/") ||
            request.url.includes(".png") ||
            request.url.includes(".svg"))
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for offline pages
        if (request.mode === "navigate") {
          return caches.match("/");
        }
      });
    })
  );
});
