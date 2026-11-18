// RETO DEL MES «Visita emprendimientos CUATE» (e84b): al abrir la página de 3 emprendimientos distintos en el mes, la persona puede reclamar sus puntos.
// Todo queda en el celular; el reclamo llega a tu hoja como un registro (folio RVI-…) y tú acreditas los puntos en el Pase.
import { useEffect, useState } from "react";
export const META_RETO = 3;
const K = "dc_reto_vis";
const mesActual = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); };
export const leerReto = () => {
  try {
    const v = JSON.parse(localStorage.getItem(K) || "null");
    if (v && v.mes === mesActual() && Array.isArray(v.v)) return { mes: v.mes, v: v.v.filter((s) => typeof s === "string").slice(0, 50), r: !!v.r };
  } catch (e) { /* sin almacenamiento */ }
  return { mes: mesActual(), v: [], r: false };
};
const guardar = (x) => { try { localStorage.setItem(K, JSON.stringify(x)); } catch (e) { /* sin almacenamiento */ } window.dispatchEvent(new CustomEvent("dcuates:reto")); };
// Las páginas oficiales de DCUATES (dcuates-…) no cuentan: el reto es para conocer emprendimientos de la comunidad.
export function registrarVisita(slug) {
  const s = String(slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!s || /^dcuates-/.test(s) || /^categorias?(-|$)/.test(s)) return;
  const x = leerReto();
  if (x.v.includes(s)) return;
  guardar({ ...x, v: [...x.v, s] });
}
export const marcarReclamado = () => guardar({ ...leerReto(), r: true });
export function useReto() {
  const [x, setX] = useState(leerReto);
  useEffect(() => {
    const al = () => setX(leerReto());
    window.addEventListener("dcuates:reto", al);
    return () => window.removeEventListener("dcuates:reto", al);
  }, []);
  return x;
}
