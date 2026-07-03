/* Number Puzzle Pro — offline cache */
const CACHE = 'npp-v1.3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/icons/logo.png',
  './pages/about.html',
  './pages/guide.html',
  './pages/privacy.html',
  './assets/images/preset-1.jpg',
  './assets/images/preset-2.jpg',
  './assets/images/preset-3.jpg',
  './assets/images/preset-4.jpg',
  './assets/images/preset-5.jpg',
  './assets/sounds/move.wav',
  './assets/sounds/click.wav',
  './assets/sounds/win.wav',
  './assets/sounds/error.wav'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok && new URL(req.url).origin === location.origin) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
