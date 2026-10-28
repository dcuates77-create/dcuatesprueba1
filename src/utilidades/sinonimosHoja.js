// SINÓNIMOS DESDE GOOGLE SHEETS (e53) — pide a tu Apps Script (doGet, a=sinonimos) la pestaña «Sinónimos»
// (columnas: Palabra | Lleva a | Activo) y la suma a datos/sinonimos.js. Así agregas palabras sin subir código.
// - Se guarda en el teléfono 6 horas para no pedirla en cada visita.
// - Si no hay conexión o la pestaña no existe, la búsqueda sigue con las palabras del archivo (nunca se rompe).
import { GOOGLE_SHEETS_URL } from "../datos/config.js";
import { agregarSinonimos } from "../datos/sinonimos.js";
import { normalizarBusqueda } from "../datos/proyectos.js";

const LLAVE = "dcuates_sin_hoja";
const VIDA_MS = 6 * 3600 * 1000;

// Convierte [{p:"chamba", a:["Asesorías","laboral"]}] en { chamba: ["asesorias","laboral"] } (sin acentos ni mayúsculas, máx. 40 palabras).
export function aMapa(items) {
  const mapa = {};
  (Array.isArray(items) ? items : []).slice(0, 400).forEach((it) => {
    const p = normalizarBusqueda(it && it.p).trim();
    const a = (Array.isArray(it && it.a) ? it.a : []).map((x) => normalizarBusqueda(x).trim()).filter(Boolean).slice(0, 12);
    if (p && p.length <= 40 && a.length) mapa[p] = [...new Set([...(mapa[p] || []), ...a])];
  });
  return mapa;
}

export async function cargarSinonimosHoja() {
  try {
    if (typeof window === "undefined" || !GOOGLE_SHEETS_URL) return;
    let guardado = null;
    try { guardado = JSON.parse(window.localStorage.getItem(LLAVE) || "null"); } catch (e) { guardado = null; }
    if (guardado && Array.isArray(guardado.items)) agregarSinonimos(aMapa(guardado.items));
    if (guardado && Date.now() - (guardado.t || 0) < VIDA_MS) return;
    const url = GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=sinonimos";
    const r = await fetch(url, { method: "GET", redirect: "follow" });
    const j = await r.json();
    if (!j || !j.ok || !Array.isArray(j.items)) return;
    agregarSinonimos(aMapa(j.items));
    try { window.localStorage.setItem(LLAVE, JSON.stringify({ t: Date.now(), items: j.items.slice(0, 400) })); } catch (e) { /* ignorar */ }
  } catch (e) {
    /* la búsqueda sigue con las palabras del archivo */
  }
}
