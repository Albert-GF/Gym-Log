const CACHE_NAME = 'gym-log-v1';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Al instalar, guardamos una copia local de todos los archivos de la app.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Al activarse, borramos versiones antiguas de la caché si las hay.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Al pedir un archivo, servimos primero la copia local; si no existe, vamos a la red.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
