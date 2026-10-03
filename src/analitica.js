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

export const GOATCOUNTER_CODIGO = "";

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

    if (GOATCOUNTER_CODIGO) {
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
    if (GOATCOUNTER_CODIGO && window.goatcounter && typeof window.goatcounter.count === "function") {
      const partes = datos ? Object.values(datos).join("/") : "";
      window.goatcounter.count({ path: `evento/${nombre}${partes ? "/" + partes : ""}`, title: nombre, event: true });
    }
  } catch {
    /* ignorar */
  }
}
