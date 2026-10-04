// Service worker de DCUATES — mínimo y seguro.
// Siempre intenta primero la red (así ves la versión más nueva en cuanto hay
// internet); solo si no hay señal usa lo que ya guardó. Nunca toca /api ni
// las estadísticas. Para forzar una limpieza, sube el número de VERSION.
const VERSION = "dcuates-v1";
const MAX_ARCHIVOS = 120;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function recortar(cache) {
  const claves = await cache.keys();
  if (claves.length > MAX_ARCHIVOS) {
    await Promise.all(claves.slice(0, claves.length - MAX_ARCHIVOS).map((k) => cache.delete(k)));
  }
}

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin) return;
  if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/_vercel/")) return;

  const guardable = r.mode === "navigate" || /\.(js|css|png|jpe?g|webp|svg|woff2?|webmanifest)$/i.test(u.pathname);

  e.respondWith(
    fetch(r)
      .then((res) => {
        if (res.ok && guardable) {
          const copia = res.clone();
          caches.open(VERSION).then(async (c) => {
            await c.put(r.mode === "navigate" ? new Request("/") : r, copia);
            recortar(c);
          });
        }
        return res;
      })
      .catch(async () => {
        const c = await caches.open(VERSION);
        const guardado = await c.match(r.mode === "navigate" ? "/" : r);
        return guardado || Response.error();
      })
  );
});
