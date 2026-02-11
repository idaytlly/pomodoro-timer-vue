const CACHE_NAME = 'candy-pomodoro-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/vite.svg'
]

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files')
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache')
            return caches.delete(cache)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch Strategy: Cache First, then Network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return
  
  // Skip API requests
  if (event.request.url.includes('/api/')) return
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response
        }
        
        // Clone the request
        const fetchRequest = event.request.clone()
        
        // Make network request
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // Clone the response
          const responseToCache = response.clone()
          
          // Add to cache
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache)
          })
          
          return response
        }).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html')
          }
        })
      })
  )
})

// Background Sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-sessions') {
    event.waitUntil(syncSessions())
  }
})

async function syncSessions() {
  // This would sync offline data when back online
  console.log('Background sync: Syncing sessions...')
}
