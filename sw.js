const CACHE_NAME = 'shopeasy-v1';
const ASSETS = [
    './index.html',
    './script.js',
    './manifest.json',
    'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css',
    'https://code.jquery.com/jquery-3.6.0.min.js',
    'https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js'
];

// Install: Cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
});

// Fetch: Serve from cache, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});