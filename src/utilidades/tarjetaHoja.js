// PASE DEL CUATE (e64 «tarjeta» → e65 «Pase») — el PIN se valida SIEMPRE con tu hoja (doGet ?a=tarjeta&k=PIN[&n=NÚMERO]).
// Se recuerda en el celular (se renueva cada vez que entra bien) y cada vez que se abre el Pase se vuelve a validar:
// si pones Activo = No o cambias el PIN en la hoja, el Pase deja de abrir al momento. Las preferencias (avatar, foto, fondo, nombre, lema,
// ocultar puntos) viven SOLO en el celular de cada Cuate. El enlace personal «…/#pase=PIN» guarda el PIN solo, sin escribir nada.
import { useCallback, useEffect, useRef, useState } from "react";
import { GOOGLE_SHEETS_URL } from "../datos/config.js";

const LLAVE = "dc_tarjeta";             // { n, k, t } sesión recordada (k = PIN)
const LLAVE_DATOS = "dc_tarjeta_datos";  // último Pase válido (para verlo sin internet)
const LLAVE_PREF = "dc_tarjeta_pref";    // { n, av, foto, fondo, velo, nombre, lema, oculto }
const DIAS = 400;                        // se renueva con cada entrada correcta: en la práctica no caduca mientras se use

const leer = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } };
const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
const borrar = (k) => { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } };
const avisarCambio = () => { try { window.dispatchEvent(new CustomEvent("dcuates:pase-cambio")); } catch (e) { /* nada */ } };

export const normalizaNumero = (t) => String(t || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
// ¿Este celular ya tiene un Pase guardado? (para cambiar los botones del Club y de Inicio)
export const haySesionPase = () => { const s = leer(LLAVE); return !!(s && s.k && Date.now() - (s.t || 0) < DIAS * 86400000); };
export const pinGuardado = () => { const s = leer(LLAVE); return s && s.k ? String(s.k) : ""; };
// Lee el PIN de un enlace personal: «#pase=K7M2QX». Devuelve "" si no hay.
export const pinDeEnlace = (hash = typeof location !== "undefined" ? location.hash : "") => { const m = /^#pase=([A-Za-z0-9-]{3,20})$/.exec(String(hash || "")); return m ? m[1] : ""; };

export const MENSAJE_TARJETA = {
  clave: "Ese PIN no es válido. Revísalo o pídelo por WhatsApp.",
  vencida: "Tu Pase venció. Escríbenos por WhatsApp para renovarlo.",
  ocupado: "Hay muchos intentos en este momento. Espera un minuto e inténtalo de nuevo.",
  red: "No pudimos verificar tu Pase ahora. Intenta más tarde o escríbenos por WhatsApp.",
  forma: "Escribe tu PIN."
};
// Respuestas del canje (e67)
export const MENSAJE_CANJE = {
  puntos: "Tus puntos disponibles no alcanzan para este premio (los de canjes pendientes ya están apartados).",
  agotado: "Ese premio se agotó por ahora. Revisa los otros o vuelve pronto.",
  limite: "Ya usaste todas las veces que puedes canjear este premio.",
  ya: "Ya tienes un canje de este premio en proceso. Míralo en «Mis canjes».",
  premio: "Ese premio ya no está disponible. Actualiza tu Pase.",
  clave: "Tu PIN ya no es válido. Vuelve a entrar a tu Pase.",
  ocupado: "Hay muchos intentos en este momento. Espera un minuto e inténtalo de nuevo.",
  red: "No pudimos registrar tu canje (sin conexión). Inténtalo de nuevo en un momento."
};
export const ESTADO_CANJE = { pendiente: { ic: "🕓", t: "Pendiente" }, listo: { ic: "📦", t: "Listo para entregar" }, entregado: { ic: "✅", t: "Entregado" }, cancelado: { ic: "✖️", t: "Cancelado" } };

// Pide un canje. Devuelve { ok:true, canje, tarjeta } o { ok:false, motivo }.
export const pedirCanje = async (pin, premio) => {
  try {
    const k = String(pin || "").trim();
    if (!k || !premio) return { ok: false, motivo: "clave" };
    if (!GOOGLE_SHEETS_URL) return { ok: false, motivo: "red" };
    const r = await fetch(GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=canjear&k=" + encodeURIComponent(k) + "&p=" + encodeURIComponent(premio));
    const j = await r.json();
    if (j && j.ok && j.canje && j.tarjeta) return { ok: true, canje: j.canje, tarjeta: j.tarjeta };
    if (j && j.ok && j.ocupado) return { ok: false, motivo: "ocupado" };
    if (j && j.motivo && MENSAJE_CANJE[j.motivo]) return { ok: false, motivo: j.motivo };
    return { ok: false, motivo: "red" };
  } catch (e) { return { ok: false, motivo: "red" }; }
};

// Devuelve { ok:true, tarjeta } o { ok:false, motivo }.
export const pedirTarjeta = async (pin, numero = "") => {
  try {
    const k = String(pin || "").trim(), n = normalizaNumero(numero);
    if (!k) return { ok: false, motivo: "forma" };
    if (!GOOGLE_SHEETS_URL) return { ok: false, motivo: "red" };
    const r = await fetch(GOOGLE_SHEETS_URL + (GOOGLE_SHEETS_URL.includes("?") ? "&" : "?") + "a=tarjeta" + (n ? "&n=" + encodeURIComponent(n) : "") + "&k=" + encodeURIComponent(k));
    const j = await r.json();
    if (j && j.ok && j.tarjeta && j.tarjeta.numero) return { ok: true, tarjeta: j.tarjeta };
    if (j && j.ok && j.ocupado) return { ok: false, motivo: "ocupado" };
    if (j && j.motivo === "vencida") return { ok: false, motivo: "vencida" };
    if (j && j.motivo === "clave") return { ok: false, motivo: "clave" };
    return { ok: false, motivo: "red" };
  } catch (e) { return { ok: false, motivo: "red" }; }
};

// e78 — «MIS PUNTOS» en la portada: lee lo último que este celular vio de su Pase (sin pedir nada) y, si hay Pase guardado,
// lo actualiza una vez en silencio al abrir la página. Nunca borra la sesión (eso solo lo hace el Pase al abrirse).
const misDatos = () => {
  const tiene = haySesionPase(), d = leer(LLAVE_DATOS) || {}, pr = leer(LLAVE_PREF) || {};
  const puntos = tiene && typeof d.puntos === "number" ? d.puntos : null;
  const apart = Number(d.comprometidos) || 0;
  const premios = Array.isArray(d.premios) ? d.premios : [];
  const disp = puntos === null ? null : Math.max(0, puntos - apart);
  const sig = disp === null ? null : premios.filter((x) => x && x.p > disp).sort((a, b) => a.p - b.p)[0] || null;
  return { tiene, puntos, disp, oculto: !!pr.oculto, faltan: sig ? sig.p - disp : null, hayPremios: premios.length > 0 };
};
export function useMisPuntos() {
  const [d, setD] = useState(misDatos);
  useEffect(() => {
    const f = () => setD(misDatos());
    window.addEventListener("dcuates:pase-cambio", f);
    window.addEventListener("storage", f);
    let vivo = true;
    const s = leer(LLAVE);
    if (s && s.k && Date.now() - (s.t || 0) < DIAS * 86400000) {
      pedirTarjeta(s.k, s.n).then((r) => { if (vivo && r.ok) { escribir(LLAVE_DATOS, r.tarjeta); setD(misDatos()); } });
    }
    return () => { vivo = false; window.removeEventListener("dcuates:pase-cambio", f); window.removeEventListener("storage", f); };
  }, []);
  return d;
}

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
    if (!s || !s.k || Date.now() - (s.t || 0) > DIAS * 86400000) { if (s) { borrar(LLAVE); borrar(LLAVE_DATOS); avisarCambio(); } setTarjeta(null); return; }
    let vivo = true;
    const previa = leer(LLAVE_DATOS);
    if (previa && (!s.n || previa.numero === s.n)) setTarjeta(previa); // muestra lo último mientras revalida
    setCargando(!previa);
    (async () => {
      const r = await pedirTarjeta(s.k, s.n);
      if (!vivo) return;
      setCargando(false);
      if (r.ok) { setTarjeta(r.tarjeta); setSinConexion(false); setAviso(""); escribir(LLAVE_DATOS, r.tarjeta); escribir(LLAVE, { n: r.tarjeta.numero, k: s.k, t: Date.now() }); return; }
      if (r.motivo === "clave" || r.motivo === "vencida") {
        borrar(LLAVE); borrar(LLAVE_DATOS); setTarjeta(null); avisarCambio();
        setAviso(r.motivo === "vencida" ? MENSAJE_TARJETA.vencida : "Tu PIN ya no es válido. Pídelo de nuevo por WhatsApp si lo necesitas.");
        return;
      }
      // sin red o con pausa: se queda con lo último que se vio
      if (previa) { setTarjeta(previa); setSinConexion(true); }
      else setAviso(MENSAJE_TARJETA[r.motivo] || MENSAJE_TARJETA.red);
    })();
    return () => { vivo = false; };
  }, [activo]); // eslint-disable-line react-hooks/exhaustive-deps

  const entrar = useCallback(async (pin, numero = "") => {
    const r = await pedirTarjeta(pin, numero);
    if (!r.ok) return r;
    escribir(LLAVE, { n: r.tarjeta.numero, k: String(pin).trim().toUpperCase(), t: Date.now() });
    escribir(LLAVE_DATOS, r.tarjeta);
    const p = leer(LLAVE_PREF);
    if (p && p.n && p.n !== r.tarjeta.numero) { borrar(LLAVE_PREF); setPrefs({}); prefsRef.current = {}; } // otra persona en este celular: se limpian sus gustos
    setTarjeta(r.tarjeta); setSinConexion(false); setAviso("");
    avisarCambio();
    return r;
  }, []);

  // Pide un premio. Si sale bien, el Pase se actualiza con lo que devuelve la hoja (puntos comprometidos, «Mis canjes»…).
  const canjear = useCallback(async (premio) => {
    const r = await pedirCanje(pinGuardado(), premio);
    if (r.ok) { escribir(LLAVE_DATOS, r.tarjeta); setTarjeta(r.tarjeta); }
    return r;
  }, []);

  const salir = useCallback(() => { borrar(LLAVE); borrar(LLAVE_DATOS); borrar(LLAVE_PREF); setPrefs({}); prefsRef.current = {}; setTarjeta(null); setSinConexion(false); setAviso(""); avisarCambio(); }, []);

  // Guarda gustos. Devuelve false si el celular no tiene espacio (p. ej. la imagen es muy pesada).
  const guardarPrefs = useCallback((cambios) => {
    const sig = { ...prefsRef.current, ...cambios, n: (tarjeta && tarjeta.numero) || prefsRef.current.n };
    Object.keys(sig).forEach((k) => { if (sig[k] === null) delete sig[k]; });
    const ok = escribir(LLAVE_PREF, sig);
    if (ok) { prefsRef.current = sig; setPrefs(sig); }
    return ok;
  }, [tarjeta]);

  return { tarjeta, cargando, sinConexion, aviso, prefs, entrar, salir, guardarPrefs, canjear };
}

// Imagen del celular → JPG reducido (cuadrado de 256 px para la foto; 720 px de ancho máx. para el fondo). Nunca sale del celular.
function reducir(archivo, { lado = 0, maxAncho = 0, calidad = 0.82 }) {
  return new Promise((resolve) => {
    try {
      if (!archivo || !/^image\//.test(archivo.type) || archivo.size > 20 * 1024 * 1024) { resolve(""); return; }
      const url = URL.createObjectURL(archivo);
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas"), ctx = c.getContext("2d");
          if (lado) {
            const m = Math.min(img.width, img.height); c.width = lado; c.height = lado;
            ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, lado, lado);
          } else {
            const f = Math.min(1, maxAncho / img.width); c.width = Math.round(img.width * f); c.height = Math.round(img.height * f);
            ctx.drawImage(img, 0, 0, c.width, c.height);
          }
          resolve(c.toDataURL("image/jpeg", calidad));
        } catch (e) { resolve(""); }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
      img.src = url;
    } catch (e) { resolve(""); }
  });
}
export const procesarFoto = (archivo) => reducir(archivo, { lado: 256, calidad: 0.82 });
export const procesarFondo = (archivo) => reducir(archivo, { maxAncho: 720, calidad: 0.7 });
