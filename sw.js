// Change 'pdek1991' to your repository name
const REPO_PATH = '/pdek1991'; 

// Increment this version number every time you change a cached file!
const CACHE_NAME = 'pdek1991-cache-v1'; 

// List all files that should be cached for offline use.
const urlsToCache = [
  // The root path of your application
  `${REPO_PATH}/`, 
  `${REPO_PATH}/index.html`,
  
  
  // The manifest and service worker itself
  `${REPO_PATH}/manifest.json`,
  `${REPO_PATH}/sw.js`, 
  
  // Your image file
  `${REPO_PATH}/images/icon-192x192.png`,
  `${REPO_PATH}/images/icon-512x512.png`,

  // Add all other essential files (CSS, JS, etc.)
  // Example: `${REPO_PATH}/css/style.css`, 
];

// 1. Installation: Cache all essential assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Install Event - Caching App Shell');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      // Force the new service worker to activate immediately
      .then(self.skipWaiting())
  );
});

// 2. Fetch: Intercept requests and serve from cache first (Cache-First Strategy)
self.addEventListener('fetch', event => {
  // Only handle requests for this origin (to exclude Google Analytics, etc.)
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
    // Ensure the service worker takes control of the page immediately
    .then(() => self.clients.claim()) 
  );
});