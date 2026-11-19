// OPINIONES (e84c): se leen las aprobadas por DCUATES y se envían nuevas SIN publicarse solas (quedan «Pendiente» en la hoja «ResenasNegocios»).
// Una opinión por persona y emprendimiento cada 30 días (se recuerda en el celular). No se pide ningún dato personal.
import { pedir } from "../datos/negocios.js";
import { enviar, nuevoId, paseGuardado } from "./pedidos.js";
const K = "dc_resenas", DIAS = 30;
const leer = () => { try { const o = JSON.parse(localStorage.getItem(K) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } };
export const yaOpino = (slug) => { const t = leer()[slug]; return !!t && Date.now() - t < DIAS * 864e5; };
// Lo mismo que revisa el script: sin enlaces, correos ni teléfonos.
export const comentarioValido = (t) => !/https?:|www\.|\.com\b|\.mx\b|@|\d{7,}/i.test(String(t || ""));
export async function cargarResenas(slug) {
  try {
    const j = await pedir(`a=negocio_resenas&slug=${encodeURIComponent(slug)}`);
    if (j && j.ok) return { n: j.n || 0, prom: j.prom || 0, lista: Array.isArray(j.lista) ? j.lista : [] };
  } catch (e) { /* sin respuesta: sin opiniones */ }
  return { n: 0, prom: 0, lista: [], sinDatos: true };
}
export function enviarResena(slug, estrellas, comentario, nombre) {
  enviar({ Tipo: "NegocioResena", Slug: slug, Id: nuevoId(), Estrellas: String(estrellas), Comentario: String(comentario || "").slice(0, 280), Nombre: String(nombre || "").slice(0, 30), Pase: paseGuardado() });
  try { const o = leer(); o[slug] = Date.now(); localStorage.setItem(K, JSON.stringify(o)); } catch (e) { /* sin almacenamiento */ }
}
