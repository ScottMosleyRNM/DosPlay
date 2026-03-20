const CACHE = 'dosplay-v7';
const ASSETS = [
  '/DosPlay/',
  '/DosPlay/index.html',
  '/DosPlay/js-dos.js',
  '/DosPlay/js-dos.css',
  '/DosPlay/emulators/emulators.js',
  '/DosPlay/emulators/wdosbox.js',
  '/DosPlay/emulators/wdosbox.wasm',
  '/DosPlay/emulators/wlibzip.js',
  '/DosPlay/emulators/wlibzip.wasm',
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
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
