// DCUATES — service worker mínimo: siempre intenta primero la red (así ves cada versión nueva) y,
// si no hay señal, muestra lo último que guardó. No cambia cómo se actualiza la página.
const CACHE = "dcuates-v3";
const MAX = 150; // e62: tope de archivos guardados para el modo sin señal (los más viejos se borran)
self.addEventListener("install", (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/offline.html"])).catch(() => {})); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || !r.url.startsWith(self.location.origin) || r.url.includes("/api/")) return;
  e.respondWith(fetch(r).then((res) => { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(r, copia).then(() => c.keys()).then((k) => { if (k.length > MAX) c.delete(k[0]); })).catch(() => {}); return res; }).catch(() => caches.match(r).then((x) => x || (r.mode === "navigate" ? caches.match("/").then((i) => i || caches.match("/offline.html")) : Response.error()))));
});
