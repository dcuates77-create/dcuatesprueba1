// ZONAS CON CLAVE (e63) — las claves y el contenido protegido ya NO viven en el código: se piden al Apps Script (doGet ?a=zona&k=CLAVE).
// El script compara con la pestaña «Claves» de tu hoja y, si la clave es válida y no ha vencido, entrega solo el contenido de ese perfil
// (pestaña «Zonas»). Aquí se recuerda la clave en el celular hasta 90 días; cada vez que se abre la zona se vuelve a validar con la hoja,
// así que si cambias o vences una clave, deja de servir al momento.
import { useCallback, useEffect, useRef, useState } from "react";
import { GOOGLE_SHEETS_URL } from "../datos/config.js";

const LLAVE = "dc_claves";
const DIAS = 90;

const leer = () => { try { return JSON.parse(localStorage.getItem(LLAVE) || "{}") || {}; } catch (e) { return {}; } };
const escribir = (o) => { try { localStorage.setItem(LLAVE, JSON.stringify(o)); } catch (e) { /* sin almacenamiento */ } };
const guardar = (perfil, k) => { const o = leer(); o[perfil] = { k, t: Date.now() }; escribir(o); };
const olvidar = (perfiles) => { const o = leer(); perfiles.forEach((p) => { delete o[p]; }); escribir(o); };

// Texto amable para cada motivo de rechazo
export const MENSAJE_ZONA = {
  clave: "Esa clave no es válida. Revísala o solicítala por WhatsApp.",
  vencida: "Tu clave venció. Pide la nueva por WhatsApp.",
  ocupado: "Hay muchos intentos en este momento. Espera un minuto e inténtalo de nuevo.",
  otra: "Esa clave es de otra zona. Prueba en la zona que te corresponde.",
  red: "No pudimos verificar tu clave ahora. Intenta más tarde o escríbenos por WhatsApp."
};

// Pide la zona al script. Devuelve { ok:true, perfil, contenido, vence } o { ok:false, motivo }.
export const pedirZona = async (clave) => {
  try {
    if (!GOOGLE_SHEETS_URL) return { ok: false, motivo: "red" };
    const r = await fetch(GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=zona&k=" + encodeURIComponent(String(clave || "").trim()));
    const j = await r.json();
    if (j && j.ok && j.perfil) return { ok: true, perfil: j.perfil, contenido: j.contenido || {}, vence: j.vence || "" };
    if (j && j.ok && j.ocupado) return { ok: false, motivo: "ocupado" };
    if (j && j.motivo === "vencida") return { ok: false, motivo: "vencida" };
    if (j && j.motivo === "clave") return { ok: false, motivo: "clave" };
    return { ok: false, motivo: "red" };
  } catch (e) { return { ok: false, motivo: "red" }; }
};

// Hook: zona = { perfil, contenido } o null. «permitidos» = perfiles que esta pantalla acepta. «activo» = true cuando se abre la zona (ahí se restaura lo recordado).
export function useZona(permitidos, activo = true) {
  const [zona, setZona] = useState(null);
  const [cargando, setCargando] = useState(false);
  const lista = useRef(permitidos); lista.current = permitidos;
  const restaurado = useRef(false);
  useEffect(() => {
    if (!activo || restaurado.current) return;
    restaurado.current = true;
    const g = leer(); const vigentes = lista.current.filter((p) => g[p] && Date.now() - g[p].t < DIAS * 86400000);
    if (!vigentes.length) return;
    let vivo = true; setCargando(true);
    (async () => {
      for (const p of vigentes) {
        const r = await pedirZona(g[p].k);
        if (!vivo) return;
        if (r.ok && lista.current.includes(r.perfil)) { setZona({ perfil: r.perfil, contenido: r.contenido }); break; }
        if (!r.ok && (r.motivo === "clave" || r.motivo === "vencida")) olvidar([p]);
      }
      if (vivo) setCargando(false);
    })();
    return () => { vivo = false; };
  }, [activo]);
  const entrar = useCallback(async (clave) => {
    const r = await pedirZona(clave);
    if (!r.ok) return r;
    if (!lista.current.includes(r.perfil)) return { ok: false, motivo: "otra" };
    guardar(r.perfil, String(clave).trim());
    setZona({ perfil: r.perfil, contenido: r.contenido });
    return r;
  }, []);
  const salir = useCallback(() => { olvidar(lista.current); setZona(null); }, []);
  return { zona, cargando, entrar, salir };
}
