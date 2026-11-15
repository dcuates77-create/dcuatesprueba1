// Estadísticas de uso de las Páginas CUATE (e81): visitas, WhatsApp, llamadas, Club, etc.
// Anónimo: solo se envía el slug del negocio y el nombre del evento a tu hoja («EventosNegocios»). No se cuenta localhost, el modo admin (?admin=1)
// ni los negocios de ejemplo. Nunca rompe la página.
import { GOOGLE_SHEETS_URL, esAdmin } from "../datos/config.js";

const vistos = new Set();
export function eventoNegocio(slug, ev) {
  try {
    if (typeof window === "undefined" || !slug || /^ejemplo-/.test(slug)) return;
    if (/^(localhost|127\.|\[::1\])/.test(window.location.hostname) || esAdmin()) return;
    if (ev === "visita" || ev === "directorio") { const k = slug + "|" + ev; if (vistos.has(k)) return; vistos.add(k); }
    fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", keepalive: true, body: new URLSearchParams({ Tipo: "NegocioEvento", Slug: slug, Evento: ev }) }).catch(() => {});
  } catch (e) { /* la analítica nunca debe romper la página */ }
}
