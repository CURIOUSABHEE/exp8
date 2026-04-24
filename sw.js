const CACHE_NAME = 'shopeasy-v2';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/script.js',
    './manifest.json',
    'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js'
];

// Install: Cache essential files
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('[SW] Caching app shell');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys
                    .filter(function (key) { return key !== CACHE_NAME; })
                    .map(function (key) { return caches.delete(key); })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Cache-first with network fallback
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(function (networkResponse) {
                if (event.request.method === 'GET' && networkResponse.status === 200) {
                    var responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        }).catch(function () {
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});