const CACHE_NAME = "studyhub-v21"; // Incremented version to force update
const ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // CRITICAL FIX: Bypass caching for API calls (Supabase) and non-GET requests
  // This prevents the SW from returning stale/failed responses for auth
  if (url.hostname.includes('supabase') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Return nothing if offline/failed to let browser handle or show offline page
        return undefined; 
      });
    })
  );
});