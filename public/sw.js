const CACHE_NAME = 'suvojeet-cache-v2';
const IMAGE_CACHE_NAME = 'suvojeet-image-cache-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/about',
        '/music',
        '/blog',
        '/contact',
        '/suvojeet.jpg',
        '/logo.svg',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== IMAGE_CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

const isCacheable = (request, response) =>
  request.method === 'GET' &&
  response &&
  response.status === 200 &&
  (response.type === 'basic' || response.type === 'cors');

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Cache API only supports GET. Let the browser handle everything else.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip non-http(s) schemes (chrome-extension://, data:, blob:, etc.)
  if (!url.protocol.startsWith('http')) return;

  // Image caching: Cache First
  if (
    request.destination === 'image' ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.webp') ||
    url.hostname.includes('ytimg.com')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) =>
        cache.match(request).then(
          (cached) =>
            cached ||
            fetch(request).then((networkResponse) => {
              if (isCacheable(request, networkResponse)) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
        )
      )
    );
    return;
  }

  // General caching: Network First, falling back to Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (isCacheable(request, response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Push notification logic
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || '/suvojeet.jpg',
      badge: '/logo.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      }
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
