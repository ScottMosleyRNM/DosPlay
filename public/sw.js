const CACHE = 'dosplay-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/js-dos.js',
  '/js-dos.css',
  '/emulators/emulators.js',
  '/emulators/wdosbox.js',
  '/emulators/wdosbox.wasm',
  '/emulators/wlibzip.js',
  '/emulators/wlibzip.wasm',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Always network-first for the app shell (index.html) and sw.js itself
  // so updates are picked up immediately
  if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/sw.js') {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Network-first for user-selected game files
  if (url.pathname.endsWith('.zip') || url.pathname.endsWith('.img')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for heavy emulator assets (WASM, JS bundles)
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
