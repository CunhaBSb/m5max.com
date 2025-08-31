// M5 Max Service Worker for Offline Performance
// Version 1.0 - Optimized caching strategy

const CACHE_NAME = 'm5max-v1';
const STATIC_CACHE = 'm5max-static-v1';
const DYNAMIC_CACHE = 'm5max-dynamic-v1';

// Cache different types of resources with different strategies
const CACHE_STRATEGIES = {
  // Critical resources - cache first, update in background
  CRITICAL: [
    '/',
    '/index.html',
    '/manifest.json',
    '/m5logo.svg'
  ],
  
  // Static assets - cache with long expiration
  STATIC: [
    /.*\.(js|css|woff2?|ttf|eot)$/,
    /.*\.(png|jpg|jpeg|webp|svg|gif|ico)$/
  ],
  
  // API responses - network first, fallback to cache
  API: [
    /^https:\/\/api\./,
    /^https:\/\/.*\.googleapis\.com/
  ],
  
  // External resources - cache with shorter expiration
  EXTERNAL: [
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
    /^https:\/\/www\.youtube\.com/,
    /^https:\/\/img\.youtube\.com/
  ]
};

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(CACHE_STRATEGIES.CRITICAL);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Strategy 1: Critical resources - Cache First
    if (CACHE_STRATEGIES.CRITICAL.some(path => pathname === path || pathname.endsWith(path))) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Static assets - Cache First with long expiration
    if (CACHE_STRATEGIES.STATIC.some(pattern => pattern.test(request.url))) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 3: API calls - Network First
    if (CACHE_STRATEGIES.API.some(pattern => pattern.test(request.url))) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: External resources - Stale While Revalidate
    if (CACHE_STRATEGIES.EXTERNAL.some(pattern => pattern.test(request.url))) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
    
    // Strategy 5: HTML pages - Network first, fallback to offline page
    if (request.headers.get('accept').includes('text/html')) {
      return await networkFirst(request, DYNAMIC_CACHE, '/index.html');
    }
    
    // Default: Network first
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // Fallback to cache for any request
    const cachedResponse = await getCachedResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      const cache = await caches.open(STATIC_CACHE);
      return await cache.match('/index.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Network Error', { status: 503 });
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetchAndCache(request, cache);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

// Network First Strategy
async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback URL (for HTML requests)
    if (fallbackUrl) {
      return await cache.match(fallbackUrl);
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update cache in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache available
  return await fetchPromise;
}

// Helper function to fetch and cache
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log('[SW] Background fetch failed:', error);
  }
}

// Helper function to get cached response
async function getCachedResponse(request) {
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  return null;
}

// Background sync for offline actions (if needed)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      Promise.resolve()
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/m5logo.svg',
        badge: '/m5logo.svg',
        tag: 'm5max-notification'
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});