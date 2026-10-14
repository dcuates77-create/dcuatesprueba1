// DCUATES — service worker mínimo: siempre intenta primero la red (así ves cada versión nueva) y,
// si no hay señal, muestra lo último que guardó. No cambia cómo se actualiza la página.
const CACHE = "dcuates-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/"])).catch(() => {})); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || !r.url.startsWith(self.location.origin) || r.url.includes("/api/")) return;
  e.respondWith(fetch(r).then((res) => { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(r, copia)).catch(() => {}); return res; }).catch(() => caches.match(r).then((x) => x || caches.match("/"))));
});
