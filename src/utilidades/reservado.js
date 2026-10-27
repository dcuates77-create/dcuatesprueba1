// ÁREA RESERVADA (e52) — pide los elementos a tu hoja de Google (pestaña «Reservado») a través del Apps Script (doGet).
// Nada del contenido viaja en el código de la página: cada elemento se pide por su id y, si tiene clave, el Apps Script la valida.
import { GOOGLE_SHEETS_URL } from "../datos/config.js";

export const LLAVE_ADMIN = "dcuates_adm_k";

async function pedir(params) {
  const url = GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + new URLSearchParams(params).toString();
  const r = await fetch(url, { method: "GET", redirect: "follow" });
  return r.json();
}

// Un elemento por su id. Si pide clave y no se manda (o es incorrecta), devuelve { ok:false, motivo:"clave", tipo, t }.
export async function pedirElemento(id, clave) {
  try { return await pedir({ a: "item", id, ...(clave ? { k: clave } : {}) }); } catch (e) { return { ok: false, motivo: "red" }; }
}
// Índice completo (solo administración): requiere la clave de administrador del Apps Script.
export async function pedirIndice(claveAdmin) {
  try { return await pedir({ a: "indice", adm: claveAdmin }); } catch (e) { return { ok: false, motivo: "red" }; }
}
export const enlaceElemento = (id) => `${window.location.origin}/#reservado-${id}`;
export const leerClaveAdmin = () => { try { return localStorage.getItem(LLAVE_ADMIN) || ""; } catch (e) { return ""; } };
export const guardarClaveAdmin = (k) => { try { localStorage.setItem(LLAVE_ADMIN, k); } catch (e) { /* ignorar */ } };
export const olvidarClaveAdmin = () => { try { localStorage.removeItem(LLAVE_ADMIN); } catch (e) { /* ignorar */ } };
