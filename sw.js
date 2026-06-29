const CACHE_NAME = "molkky-pwa-cache-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",                     
        "/index.html",           
        "/manifest.webmanifest",
        "/icons/icon-192.png",
        "/icons/icon-512.png",

        // ⭐ MP3-äänet lisätty suoraan cacheen
        "/sounds/alkulasku.mp3",
        "/sounds/piippaus.mp3",
        "/sounds/aikaloppu.mp3",
        "/sounds/laskentastart.mp3",

        "/fonts/roboto-regular.woff2",
        "/fonts/roboto-bold.woff2",

        // ⭐ Vite buildin JS-bundle (tämä on kriittinen)
        "/assets/index-Dhcb6sqb.js",

        // ⭐ Vite buildin CSS
        "/assets/index-DDu93xAL.css"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match("/index.html");
        });
    })
  );
});
