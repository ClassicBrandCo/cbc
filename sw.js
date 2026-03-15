// PWA Service Worker - Cache static assets
const CACHE_NAME = 'cbc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/contact.html',
  '/style.css',
  '/assets/js/main.js',
  '/img/logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
