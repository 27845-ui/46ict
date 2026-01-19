const CACHE_NAME = '46ict-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/form.html',
  '/calendar.html',
  '/info.html',
  '/score-form.html',
  '/style.css',
  '/info.css',
  '/calendar.js',
  '/form.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});