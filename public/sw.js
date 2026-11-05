const CACHE_NAME = 'porterful-v1';
const urlsToCache = [
  '/',
  '/digital',
  '/marketplace',
  '/radio',
  '/manifest.json',
  '/logo.svg',
];

// Install event — resilient to individual URL failures
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('Opened cache');
        // Add URLs one by one so one failure doesn't break the whole install
        const failures = [];
        for (const url of urlsToCache) {
          try {
            await cache.add(url);
          } catch (err) {
            // Non-200 and redirects are silently skipped
            failures.push(url);
          }
        }
        if (failures.length > 0) {
          console.log('SW: Some URLs could not be cached (may be redirects or unavailable):', failures.length);
        }
        return;
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});