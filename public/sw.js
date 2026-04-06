const CACHE = 'dosplay-v1';

// All assets needed to run offline
const PRECACHE = [
  '/DosPlay/',
  '/DosPlay/index.html',
  '/DosPlay/js-dos.js',
  '/DosPlay/js-dos.css',
  '/DosPlay/manifest.json',
  '/DosPlay/emulators/emulators.js',
  '/DosPlay/emulators/wdosbox.js',
  '/DosPlay/emulators/wdosbox.wasm',
  '/DosPlay/emulators/wlibzip.js',
  '/DosPlay/emulators/wlibzip.wasm',
  '/DosPlay/emulators/emulators/emulators.js',
  '/DosPlay/emulators/emulators/wdosbox.js',
  '/DosPlay/emulators/emulators/wdosbox.wasm',
  '/DosPlay/emulators/emulators/wdosbox-x.js',
  '/DosPlay/emulators/emulators/wdosbox-x.wasm',
  '/DosPlay/emulators/emulators/wlibzip.js',
  '/DosPlay/emulators/emulators/wlibzip.wasm',
];

// Install: cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fall back to network, cache new responses
self.addEventListener('fetch', e => {
  // Only handle GET requests for our origin
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache successful responses for our own assets
        if (response.ok && e.request.url.includes('/DosPlay/')) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline and not cached — return the app shell for navigation
        if (e.request.mode === 'navigate') {
          return caches.match('/DosPlay/index.html');
        }
      });
    })
  );
});
