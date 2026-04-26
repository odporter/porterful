// Porterful service worker — v2 (network-first for HTML, cache-first for assets)
//
// Why this rewrite:
// v1 was cache-first for every request, including HTML. Once the homepage
// was cached on install, PWAs kept rendering the old shell after deploys.
// The old shell referenced old JS bundle hashes that no longer matched the
// server, producing client-side exceptions and (because the JS itself was
// stale) blocked the live light/dark theme listener and other recent fixes.
//
// Strategy now:
// - Navigation requests (HTML)         → network first, cache as fallback
// - Same-origin static GETs            → cache first, fall back to network
// - Cross-origin / non-GET             → passthrough (do not handle)
// - On activate, delete every old cache name so users on v1 get a clean slate

const CACHE_NAME = 'porterful-v2'
const OFFLINE_URL = '/'

self.addEventListener('install', (event) => {
  // Take over as soon as we install — old SW had no skipWaiting and could
  // sit dormant for an extra page load.
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL).catch(() => {}))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request

  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // HTML / navigation — always try network first so deploys take effect
  // immediately. Fall back to last-known cached HTML only if the network
  // is unavailable.
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Stash a fresh copy for offline fallback (best-effort, ignore errors).
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {})
          return response
        })
        .catch(() => caches.match(request).then((r) => r || caches.match(OFFLINE_URL)))
    )
    return
  }

  // Static assets — cache first, network fallback. Cache successful basic
  // responses so subsequent loads stay fast.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {})
        return response
      })
    })
  )
})
