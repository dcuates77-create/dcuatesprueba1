// TARJETA DEL CUATE (e64) — el número de Cuate y el código se validan SIEMPRE con tu hoja (doGet ?a=tarjeta&n=&k=).
// Se recuerdan en el celular hasta 90 días, pero cada vez que se abre la tarjeta se vuelve a validar: si pones Activo = No o cambias el código,
// la tarjeta deja de abrir al momento. Las preferencias (avatar, foto, nombre, lema, ocultar puntos) viven SOLO en el celular de cada Cuate.
import { useCallback, useEffect, useRef, useState } from "react";
import { GOOGLE_SHEETS_URL } from "../datos/config.js";

const LLAVE = "dc_tarjeta";          // { n, k, t } sesión recordada
const LLAVE_DATOS = "dc_tarjeta_datos"; // última tarjeta válida (para verla sin internet)
const LLAVE_PREF = "dc_tarjeta_pref";   // { n, av, foto, nombre, lema, oculto }
const DIAS = 90;

const leer = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
const borrar = (k) => { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } };

export const normalizaNumero = (t) => String(t || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export const MENSAJE_TARJETA = {
  clave: "Ese número o ese código no coinciden. Revísalos o pídelos por WhatsApp.",
  vencida: "Tu tarjeta venció. Escríbenos por WhatsApp para renovarla.",
  ocupado: "Hay muchos intentos en este momento. Espera un minuto e inténtalo de nuevo.",
  red: "No pudimos verificar tu tarjeta ahora. Intenta más tarde o escríbenos por WhatsApp.",
  forma: "Escribe tu número de Cuate (ej. VEC100A) y tu código."
};

// Devuelve { ok:true, tarjeta } o { ok:false, motivo }.
export const pedirTarjeta = async (numero, codigo) => {
  try {
    const n = normalizaNumero(numero), k = String(codigo || "").trim();
    if (!n || !k) return { ok: false, motivo: "forma" };
    if (!GOOGLE_SHEETS_URL) return { ok: false, motivo: "red" };
    const r = await fetch(GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=tarjeta&n=" + encodeURIComponent(n) + "&k=" + encodeURIComponent(k));
    const j = await r.json();
    if (j && j.ok && j.tarjeta && j.tarjeta.numero) return { ok: true, tarjeta: j.tarjeta };
    if (j && j.ok && j.ocupado) return { ok: false, motivo: "ocupado" };
    if (j && j.motivo === "vencida") return { ok: false, motivo: "vencida" };
    if (j && j.motivo === "clave") return { ok: false, motivo: "clave" };
    return { ok: false, motivo: "red" };
  } catch (e) { return { ok: false, motivo: "red" }; }
};

// Hook. «activo» = true mientras la ventana está abierta (cada apertura revalida con la hoja).
export function useTarjeta(activo) {
  const [tarjeta, setTarjeta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [sinConexion, setSinConexion] = useState(false);
  const [aviso, setAviso] = useState("");
  const [prefs, setPrefs] = useState(() => leer(LLAVE_PREF) || {});
  const hecho = useRef(false);
  const prefsRef = useRef(prefs); prefsRef.current = prefs;

  useEffect(() => {
    if (!activo) { hecho.current = false; return; }
    if (hecho.current) return;
    hecho.current = true;
    const s = leer(LLAVE);
    if (!s || !s.k || !s.n || Date.now() - (s.t || 0) > DIAS * 86400000) { if (s) { borrar(LLAVE); borrar(LLAVE_DATOS); } setTarjeta(null); return; }
    let vivo = true;
    const previa = leer(LLAVE_DATOS);
    if (previa && previa.numero === s.n && !tarjeta) setTarjeta(previa); // muestra lo último mientras revalida
    setCargando(!previa);
    (async () => {
      const r = await pedirTarjeta(s.n, s.k);
      if (!vivo) return;
      setCargando(false);
      if (r.ok) { setTarjeta(r.tarjeta); setSinConexion(false); setAviso(""); escribir(LLAVE_DATOS, r.tarjeta); return; }
      if (r.motivo === "clave" || r.motivo === "vencida") {
        borrar(LLAVE); borrar(LLAVE_DATOS); setTarjeta(null);
        setAviso(r.motivo === "vencida" ? MENSAJE_TARJETA.vencida : "Tu código ya no es válido. Pídelo de nuevo por WhatsApp si lo necesitas.");
        return;
      }
      // sin red o con pausa: se queda con lo último que se vio
      if (previa && previa.numero === s.n) { setTarjeta(previa); setSinConexion(true); }
      else setAviso(MENSAJE_TARJETA[r.motivo] || MENSAJE_TARJETA.red);
    })();
    return () => { vivo = false; };
  }, [activo]); // eslint-disable-line react-hooks/exhaustive-deps

  const entrar = useCallback(async (numero, codigo) => {
    const r = await pedirTarjeta(numero, codigo);
    if (!r.ok) return r;
    escribir(LLAVE, { n: r.tarjeta.numero, k: String(codigo).trim(), t: Date.now() });
    escribir(LLAVE_DATOS, r.tarjeta);
    const p = leer(LLAVE_PREF);
    if (p && p.n && p.n !== r.tarjeta.numero) { borrar(LLAVE_PREF); setPrefs({}); prefsRef.current = {}; } // otra persona en este celular: se limpian sus gustos
    setTarjeta(r.tarjeta); setSinConexion(false); setAviso("");
    return r;
  }, []);

  const salir = useCallback(() => { borrar(LLAVE); borrar(LLAVE_DATOS); borrar(LLAVE_PREF); setPrefs({}); prefsRef.current = {}; setTarjeta(null); setSinConexion(false); setAviso(""); }, []);

  // Guarda gustos. Devuelve false si el celular no tiene espacio (p. ej. la foto es muy pesada).
  const guardarPrefs = useCallback((cambios) => {
    const sig = { ...prefsRef.current, ...cambios, n: (tarjeta && tarjeta.numero) || prefsRef.current.n };
    const ok = escribir(LLAVE_PREF, sig);
    if (ok) { prefsRef.current = sig; setPrefs(sig); }
    return ok;
  }, [tarjeta]);

  return { tarjeta, cargando, sinConexion, aviso, prefs, entrar, salir, guardarPrefs };
}

// Foto del celular → cuadrado de 256 px en JPG (≈15-25 KB). Nunca sale del celular.
export function procesarFoto(archivo) {
  return new Promise((resolve) => {
    try {
      if (!archivo || !/^image\//.test(archivo.type) || archivo.size > 15 * 1024 * 1024) { resolve(""); return; }
      const url = URL.createObjectURL(archivo);
      const img = new Image();
      img.onload = () => {
        try {
          const L = 256, c = document.createElement("canvas"); c.width = L; c.height = L;
          const ctx = c.getContext("2d"), lado = Math.min(img.width, img.height);
          ctx.drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, L, L);
          resolve(c.toDataURL("image/jpeg", 0.82));
        } catch (e) { resolve(""); }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
      img.src = url;
    } catch (e) { resolve(""); }
  });
}
