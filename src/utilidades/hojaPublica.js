// LECTURAS PÚBLICAS DE LA HOJA (e55) — «Espacios» publicados y eventos aprobados de la pestaña «Agenda».
// Se piden al Apps Script (doGet ?a=espacios / ?a=agenda). Si falla internet o no existe la pestaña, devuelven lista vacía.
import { GOOGLE_SHEETS_URL } from "../datos/config.js";

const pedir = async (a) => {
  try {
    if (!GOOGLE_SHEETS_URL) return [];
    const r = await fetch(GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=" + a);
    const j = await r.json();
    return j && j.ok && Array.isArray(j.items) ? j.items : [];
  } catch (e) { return []; }
};
let espaciosP = null, espaciosT = 0;
export const cargarEspacios = () => {
  if (!espaciosP || Date.now() - espaciosT > 600000) { espaciosT = Date.now(); espaciosP = pedir("espacios"); }
  return espaciosP;
};
export const cargarAgendaHoja = () => pedir("agenda");

// e57 — publicaciones del tablón «Lo que hay hoy» (Ofrezco / Necesito / Adopciones / Libros): solo las que tú marcas «Sí» en la hoja.
let pubP = null, pubT = 0;
export const cargarPublicados = () => {
  if (!pubP || Date.now() - pubT > 600000) { pubT = Date.now(); pubP = pedir("publicados"); }
  return pubP;
};
