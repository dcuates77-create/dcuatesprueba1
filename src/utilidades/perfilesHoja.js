// PERFILES DESDE GOOGLE SHEETS (e54) — lee la pestaña «Perfiles» (vía Apps Script, ?a=perfiles) y la mezcla con los
// subtipos del código. Si falla internet o la hoja no existe, no pasa nada: se usan los del código.
// Se guarda una copia en el teléfono 6 horas.
import { GOOGLE_SHEETS_URL } from "../datos/config.js";
import { SUBTIPOS } from "../datos/subtipos.js";

const CLAVE = "dcuates_perfiles_hoja";
const HORAS = 6;
const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const leer = () => { try { const o = JSON.parse(localStorage.getItem(CLAVE) || "null"); return o && Array.isArray(o.items) ? o : null; } catch (e) { return null; } };
const guardar = (items) => { try { localStorage.setItem(CLAVE, JSON.stringify({ t: Date.now(), items })); } catch (e) { /* nada */ } };

// Convierte una fila de la hoja al formato del código.
export const deFila = (r) => ({
  p: String(r.puerta || "").split(",").map((x) => x.trim()).filter(Boolean),
  g: String(r.perfil || ""), s: String(r.s || "").trim(), i: String(r.i || ""),
  a: [r.p1, r.p2, r.p3].map((x) => String(x || "")), o: String(r.o || ""), e: String(r.e || ""), d: String(r.d || ""),
  activo: r.activo !== false,
});

// Mezcla: la hoja manda sobre el código (misma puerta + mismo subtipo = reemplaza; Activo = No = lo quita).
export function mezclar(base, filas) {
  const salida = base.map((x) => ({ ...x, activo: true }));
  (filas || []).map(deFila).forEach((f) => {
    if (!f.s || !f.p.length) return;
    const k = norm(f.s);
    const i = salida.findIndex((x) => norm(x.s) === k && x.p[0] === f.p[0]);
    // Las celdas vacías de la hoja conservan lo del código (paso por paso, y también interés, oferta, etc.).
    if (i >= 0) { const b = salida[i]; salida[i] = { ...b, ...f, g: f.g || b.g, i: f.i || b.i, o: f.o || b.o, e: f.e || b.e, d: f.d || b.d, a: f.a.map((t, k) => t || b.a[k] || "") }; }
    else salida.push(f);
  });
  return salida.filter((x) => x.activo !== false && x.a.some(Boolean));
}

let memoria = null;
export function subtiposDe(puertaId) {
  if (!memoria) { const c = leer(); memoria = mezclar(SUBTIPOS, c ? c.items : []); }
  return memoria.filter((x) => x.p.includes(puertaId));
}

export async function cargarPerfilesHoja() {
  try {
    const c = leer();
    if (c && Date.now() - c.t < HORAS * 3600 * 1000) return;
    if (!GOOGLE_SHEETS_URL) return;
    const r = await fetch(GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=perfiles");
    const j = await r.json();
    if (j && j.ok && Array.isArray(j.items)) { guardar(j.items); memoria = null; window.dispatchEvent(new CustomEvent("dcuates:perfiles-cambio")); }
  } catch (e) { /* silencio: se usan los del código */ }
}
