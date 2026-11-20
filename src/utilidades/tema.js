// TEMA Y TEXTOS DESDE LA HOJA (e85d). Pestañas «TemaDCUATES» (colores globales) y «TextosDCUATES» (textos y mensajes de WhatsApp).
// - Colores: se aplican como variables CSS (--dc-verde, --dc-fondo, --dc-dorado). Antes de aplicar se VUELVE a validar el contraste;
//   si un color no pasa, se usa el original. Se guardan en el celular para pintar bien desde el primer instante.
// - Textos: texto("clave", "texto por defecto", { nombre, folio }) → usa el de la hoja si existe; si no, el de siempre.
import { useEffect, useState } from "react";
import { pedir } from "../datos/negocios.js";

const K = "dc_tema";
export const COLORES_ORIGINALES = { verde: "#1F7A46", fondo: "#FBF7EC", dorado: "#B7791F" };
const VAR = { verde: "--dc-verde", fondo: "--dc-fondo", dorado: "--dc-dorado" };

const lum = (hex) => { const h = hex.replace("#", ""); const c = [0, 2, 4].map((i) => { const v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const contraste = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
// Mismas reglas que el script: botones con texto blanco (4.5), acento con texto blanco (3.5), fondo con texto oscuro (7).
export const colorValido = (clave, hex) => {
  if (!/^#[0-9a-f]{6}$/i.test(String(hex || ""))) return false;
  if (clave === "verde") return contraste(hex, "#FFFFFF") >= 4.5;
  if (clave === "dorado") return contraste(hex, "#FFFFFF") >= 3.5;
  if (clave === "fondo") return contraste(hex, "#0F2D1E") >= 7;
  return false;
};
const leer = () => { try { const o = JSON.parse(localStorage.getItem(K) || "null"); return o && typeof o === "object" ? { colores: o.colores || {}, textos: o.textos || {} } : { colores: {}, textos: {} }; } catch (e) { return { colores: {}, textos: {} }; } };
let datos = leer();

export function aplicarColores(colores) {
  if (typeof document === "undefined") return;
  const raiz = document.documentElement;
  Object.keys(VAR).forEach((k) => {
    const v = colores && colores[k];
    if (v && colorValido(k, v)) raiz.style.setProperty(VAR[k], v); else raiz.style.removeProperty(VAR[k]);
  });
}
aplicarColores(datos.colores);

export async function cargarTema() {
  try {
    const j = await pedir("a=tema");
    if (!j || !j.ok) return;
    datos = { colores: j.colores && typeof j.colores === "object" ? j.colores : {}, textos: j.textos && typeof j.textos === "object" ? j.textos : {} };
    try { localStorage.setItem(K, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
    aplicarColores(datos.colores);
    window.dispatchEvent(new CustomEvent("dcuates:tema"));
  } catch (e) { /* sin respuesta: se queda lo que ya había */ }
}

export function texto(clave, porDefecto, vars) {
  let t = datos.textos && typeof datos.textos[clave] === "string" && datos.textos[clave].trim() ? datos.textos[clave] : porDefecto;
  if (vars) t = t.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? String(vars[k]) : m));
  return t;
}
// Hace que el componente se vuelva a dibujar cuando llegan los textos de la hoja.
export function useTextos() {
  const [, set] = useState(0);
  useEffect(() => { const f = () => set((n) => n + 1); window.addEventListener("dcuates:tema", f); return () => window.removeEventListener("dcuates:tema", f); }, []);
}
export async function estadoAlta(folio) {
  try {
    const j = await pedir(`a=alta_estado&folio=${encodeURIComponent(String(folio || "").toUpperCase().trim())}`);
    return j && typeof j === "object" ? j : { ok: false, motivo: "red" };
  } catch (e) { return { ok: false, motivo: "red" }; }
}
