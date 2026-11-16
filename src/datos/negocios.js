// =========================================================================
// src/datos/negocios.js (e79, ampliado en e80) — PÁGINAS CUATE DE NEGOCIOS (dcuates.com/n/<slug>)
// Los datos viven en tu hoja de Google, pestaña «NegociosCUATE» (una fila por negocio). Aquí solo hay:
//  · las categorías (color e ícono): si agregas una categoría nueva en la hoja, hay que darla de alta aquí,
//  · los niveles (Básico / Impulsor / Patrocinador),
//  · las funciones que piden el negocio o el directorio al Apps Script (?a=negocio / ?a=negocios),
//  · los negocios de EJEMPLO (negociosEjemplos.js), que solo se muestran si la hoja todavía no responde.
// =========================================================================
import { GOOGLE_SHEETS_URL } from "./config.js";
import { EJEMPLOS, EJEMPLOS_DIRECTORIO } from "./negociosEjemplos.js";

const K = (s) => String(s || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const CATS = [
  ["SALUD", "🩺", "#0E7490", "Salud"],
  ["ALIMENTOS", "🍽️", "#C2410C", "Alimentos"],
  ["EDUCACION", "🎓", "#4F46E5", "Educación"],
  ["SERVICIOS COMUNITARIOS", "🤝", "#0F766E", "Servicios comunitarios"],
  ["PRODUCTOS VARIOS", "🛍️", "#B45309", "Productos varios"],
  ["SERVICIOS VARIOS", "🛠️", "#475569", "Servicios varios"],
  ["MERCADOS Y TIANGUIS", "🧺", "#15803D", "Mercados y tianguis"],
  ["TECNOLOGIA", "💻", "#1D4ED8", "Tecnología"],
  ["BELLEZA Y BIENESTAR", "💆", "#A21CAF", "Belleza y bienestar"],
  ["HOGAR Y CONSTRUCCION", "🏠", "#78350F", "Hogar y construcción"],
  ["MASCOTAS", "🐾", "#4D7C0F", "Mascotas"],
  ["TRANSPORTE Y REPARTO", "🚚", "#0369A1", "Transporte y reparto"],
  ["OCIO Y CULTURA", "🎭", "#7A5AD8", "Ocio y cultura"],
  ["ALTRUISMO", "💞", "#BE185D", "Altruismo"],
  ["ESPECIALIDADES", "⭐", "#1F7A46", "Especialidades"]
];
export const CATEGORIAS = Object.fromEntries(CATS.map(([k, e, color, nombre]) => [k, { e, color, nombre }]));
// Nombres anteriores (e79) que siguen funcionando
CATEGORIAS.OCIO = CATEGORIAS["OCIO Y CULTURA"];
CATEGORIAS.SERVICIOS = CATEGORIAS["SERVICIOS VARIOS"];
CATEGORIAS.COMERCIO = CATEGORIAS["PRODUCTOS VARIOS"];
CATEGORIAS.OTRO = CATEGORIAS.ESPECIALIDADES;
export const LISTA_CATEGORIAS = CATS.map(([k, e, color, nombre]) => ({ k, e, color, nombre }));
export const categoriaDe = (c) => CATEGORIAS[K(c)] || CATEGORIAS.ESPECIALIDADES;
export const claveCategoria = (c) => { const x = CATEGORIAS[K(c)]; return x ? x.nombre : "Especialidades"; };

// Niveles: P = Patrocinador, I = Impulsor (aportación voluntaria), B = Básico (gratuito con promociones para Cuates)
export const NIVELES = {
  P: { t: "🌟 CUATE PATROCINADOR", color: "#8a5a0c", orden: 0 },
  I: { t: "💛 CUATE IMPULSOR", color: "#7a5a00", orden: 1 },
  B: { t: "", color: "#0f2d1e", orden: 2 }
};

const cache = {};
const pedir = async (qs) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 12000);
  try {
    const res = await fetch(`${GOOGLE_SHEETS_URL}?${qs}`, { signal: ctl.signal });
    return await res.json();
  } finally { clearTimeout(t); }
};
// Devuelve { ok:true, negocio, ejemplo? } o { ok:false, motivo }.
export async function cargarNegocio(slug) {
  const s = String(slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!s) return { ok: false, motivo: "sin-slug" };
  if (cache[s]) return cache[s];
  let r = null;
  try {
    const j = await pedir(`a=negocio&slug=${encodeURIComponent(s)}`);
    if (j && j.ok && j.negocio) r = { ok: true, negocio: j.negocio };
    else if (j && j.motivo === "no-encontrado") r = { ok: false, motivo: "no-encontrado" };
  } catch (e) { /* sin respuesta: se intenta el ejemplo */ }
  if (!r) r = EJEMPLOS[s] ? { ok: true, negocio: EJEMPLOS[s], ejemplo: true } : { ok: false, motivo: "sin-conexion" };
  if (r.ok) cache[s] = r;
  return r;
}
// Directorio: { ok:true, items:[{s,n,c,e,l,col,niv,of}], ejemplo? }
let dir = null;
export async function cargarDirectorio() {
  if (dir) return dir;
  let r = null;
  try {
    const j = await pedir("a=negocios");
    if (j && j.ok && Array.isArray(j.negocios)) r = { ok: true, items: j.negocios };
  } catch (e) { /* sin respuesta */ }
  if (!r) r = { ok: true, items: EJEMPLOS_DIRECTORIO, ejemplo: true };
  dir = r;
  return r;
}
// Orden del directorio: Patrocinador → Impulsor → Básico; dentro de cada nivel, un orden que cambia cada día (trato parejo).
export const ORDENES = [["destacados", "Destacados"], ["recientes", "Más recientes"], ["az", "A–Z"], ["ofertas", "Con oferta primero"]];
// Orden del directorio. «destacados»: nivel (Patrocinador → Impulsor → Básico), luego «Prioridad» de la hoja (1 = primero) y, a igualdad, rotación diaria.
export function ordenarDirectorio(items, modo = "destacados") {
  const d = new Date(); const sem = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate();
  const h = (s) => { let x = sem; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 100003; return x; };
  const lista = items.map((x, k) => ({ x, k }));
  const niv = (a) => (NIVELES[a.niv] || NIVELES.B).orden;
  const pr = (a) => (a.pr > 0 ? a.pr : 9999);
  const dest = (a, b) => niv(a.x) - niv(b.x) || pr(a.x) - pr(b.x) || h(a.x.s) - h(b.x.s);
  const rec = (a) => (a.x.f ? a.x.f : "") + "#" + String(100000 + (a.x.i != null ? a.x.i : a.k));
  if (modo === "recientes") lista.sort((a, b) => (rec(b) < rec(a) ? -1 : rec(b) > rec(a) ? 1 : 0));
  else if (modo === "az") lista.sort((a, b) => String(a.x.n || "").localeCompare(String(b.x.n || ""), "es"));
  else if (modo === "ofertas") lista.sort((a, b) => (b.x.of ? 1 : 0) - (a.x.of ? 1 : 0) || dest(a, b));
  else lista.sort(dest);
  return lista.map((e) => e.x);
}
