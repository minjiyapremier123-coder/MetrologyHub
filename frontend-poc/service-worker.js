// Minimal service worker for offline caching of the frontend shell
const CACHE_NAME = 'lm-poc-shell-v1';
const ASSETS = [ '/', '/index.html', '/app.js', '/manifest.json' ];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
