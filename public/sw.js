// DOS/PLAY service worker — offline support
// Page: network-first (so updates arrive), falls back to cache offline.
// Engine/assets: cache-first (large, versioned by CACHE name).
const CACHE = 'dosplay-2.0.0';
const PRECACHE = [
  '/DosPlay/',
  '/DosPlay/index.html',
  '/DosPlay/js-dos.js',
  '/DosPlay/js-dos.css',
  '/DosPlay/manifest.json',
  '/DosPlay/apple-touch-icon.png',
  '/DosPlay/favicon.png',
  '/DosPlay/emulators/emulators.js',
  '/DosPlay/emulators/wdosbox-x.js',
  '/DosPlay/emulators/wdosbox-x.wasm',
  '/DosPlay/emulators/wlibzip.js',
  '/DosPlay/emulators/wlibzip.wasm',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith('/DosPlay/')) return; // blob: game bundles etc.

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('/DosPlay/index.html', copy)); }
        return res;
      }).catch(() => caches.match('/DosPlay/index.html').then(r => r || caches.match('/DosPlay/')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
