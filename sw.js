// Removed const REPO_PATH = '/pdek1991'; 

// *** CRITICAL FIX: INCREMENT VERSION TO FORCE UPDATE ***
// This must change every time you modify the Service Worker or cached file list!
const CACHE_NAME = 'pdek1991-cache-v6'; 

// List all files that should be cached for offline use. Use root-relative paths (start with /)
const urlsToCache = [
  // Core application files
  '/', 
  '/index.html',
  
  // PWA files
  '/manifest.json',
  '/sw.js', 
  
  // Your image files referenced in the manifest (must be in the /images folder)
  '/images/icon-192x192.png',
  '/images/icon-512x512.png', 

  // Add any other essential files (CSS, JS, e.g., '/style.css')
];

// 1. Installation: Cache all essential assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Install Event - Caching App Shell');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // This is the array that must contain error-free URLs!
        return cache.addAll(urlsToCache);
      })
      // Force the new service worker to activate immediately
      .then(self.skipWaiting())
  );
});

// 2. Fetch: Intercept requests and serve from cache first (Cache-First Strategy)
self.addEventListener('fetch', event => {
  // Only handle requests for this origin (to exclude external services like CDNs)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached response if found, otherwise fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// 3. Activation: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate Event - Cleaning old caches');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});