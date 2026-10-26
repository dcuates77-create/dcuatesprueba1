// =========================================================================
// ANALÍTICA — DCUATES (CLON8)
// Cuenta visitas y eventos (qué pestañas, proyectos y botones usa la gente)
// SIN instalar paquetes y sin cookies de seguimiento.
//
// 1) Vercel Web Analytics (visitas, páginas, países, dispositivos):
//    actívalo en Vercel → tu proyecto → pestaña "Analytics" → Enable. Solo
//    en producción; no hace falta nada más. Si no lo activas, el script no
//    carga y la página funciona igual.
// 2) GoatCounter (opcional, gratis para uso no comercial; cuenta también los
//    eventos): crea una cuenta en goatcounter.com, elige un código (ej.
//    "dcuates") y escríbelo en GOATCOUNTER_CODIGO. Déjalo vacío para no usarlo.
//
// Uso en el código:  registrar("proyecto_abrir", { id: "libros" })
// =========================================================================

import { GOOGLE_SHEETS_URL, esAdmin } from "./datos/config.js";

// e49: tu cuenta de GoatCounter (dcuates2.goatcounter.com). La página carga sola el script: NO pegues <script> en index.html.
export const GOATCOUNTER_CODIGO = "dcuates2";

let iniciada = false;

export function iniciarAnalitica() {
  if (iniciada || typeof window === "undefined") return;
  iniciada = true;
  const local = /^(localhost|127\.|\[::1\])/.test(window.location.hostname);
  if (local) return;
  try {
    if (!window.va) {
      window.va = function va(...params) {
        (window.vaq = window.vaq || []).push(params);
      };
    }
    const v = document.createElement("script");
    v.defer = true;
    v.src = "/_vercel/insights/script.js";
    v.onerror = () => {};
    document.head.appendChild(v);

    // De dónde llegó la visita: enlaces con ?origen=nombre (por ejemplo los
    // enlaces cortos). Se registra y se limpia de la barra de direcciones
    // para que nadie comparta el enlace con la marca de origen.
    try {
      const url = new URL(window.location.href);
      const origen = url.searchParams.get("origen");
      if (origen) {
        registrar("visita_origen", { origen: origen.slice(0, 40) });
        url.searchParams.delete("origen");
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
    } catch {
      /* ignorar */
    }

    // Los dispositivos de administración (?admin=1) no se cuentan.
    if (GOATCOUNTER_CODIGO && !esAdmin()) {
      const g = document.createElement("script");
      g.async = true;
      g.src = "//gc.zgo.at/count.js";
      g.setAttribute("data-goatcounter", `https://${GOATCOUNTER_CODIGO}.goatcounter.com/count`);
      g.onerror = () => {};
      document.head.appendChild(g);
    }
  } catch {
    /* la analítica nunca debe romper la página */
  }
}

export function registrar(nombre, datos) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.va === "function") window.va("event", { name: nombre, data: datos });
    if (GOATCOUNTER_CODIGO && !esAdmin() && window.goatcounter && typeof window.goatcounter.count === "function") {
      const partes = datos ? Object.values(datos).join("/") : "";
      window.goatcounter.count({ path: `evento/${nombre}${partes ? "/" + partes : ""}`, title: nombre, event: true });
    }
  } catch {
    /* ignorar */
  }
}

// BÚSQUEDAS SIN RESULTADO (e48): guarda la palabra que la gente buscó y no encontró, para ampliar sinonimos.js.
// - Se guarda en tu hoja de Google (pestaña «Búsquedas», Tipo «Busqueda») y, si hay GoatCounter, también ahí.
// - Solo guarda la palabra (máx. 40 letras): nada de nombre, teléfono ni datos del visitante.
// - Máximo 5 distintas por visita, y no guarda desde localhost.
export function registrarBusquedaVacia(texto, desde) {
  try {
    if (typeof window === "undefined") return;
    const q = String(texto || "").trim().toLowerCase().replace(/\s+/g, " ").slice(0, 40);
    if (q.length < 3) return;
    registrar("busqueda_sin_resultado", { q });
    if (/^(localhost|127\.|\[::1\])/.test(window.location.hostname)) return;
    let vistas = [];
    try { vistas = JSON.parse(window.sessionStorage.getItem("dcuates_bq") || "[]"); } catch { vistas = []; }
    if (vistas.includes(q) || vistas.length >= 5) return;
    vistas.push(q);
    try { window.sessionStorage.setItem("dcuates_bq", JSON.stringify(vistas)); } catch { /* ignorar */ }
    const d = new URLSearchParams({ Tipo: "Busqueda", Busqueda: q, Resultados: "0", Desde: desde || "" });
    fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", keepalive: true, body: d }).catch(() => {});
  } catch {
    /* la analítica nunca debe romper la página */
  }
}

// GUARDAR EN LA HOJA (e50): manda un registro a tu hoja de Google (el Apps Script lo reparte por «Tipo»).
// Nunca bloquea ni rompe la página; si falla, el mensaje igual sigue por WhatsApp.
export function guardarEnHoja(campos) {
  try {
    if (typeof window === "undefined") return;
    const d = new URLSearchParams({ ...campos, Estado: "Recibido", Fecha: new Date().toLocaleString("es-MX") });
    fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", keepalive: true, body: d }).catch(() => {});
  } catch {
    /* ignorar */
  }
}
