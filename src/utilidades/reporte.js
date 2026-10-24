// REPORTES POR WHATSAPP (e48): «Algo no funciona» y «Reportar anuncio».
// Arman un mensaje con datos básicos del teléfono para poder ayudar. No se guarda nada: solo se abre WhatsApp.
import { VERSION_BUILD, WHATSAPP_NUMERO } from "../datos/config.js";

function dondeEstoy() {
  try {
    const c = [...document.querySelectorAll("[data-vista]")].find((e) => e.offsetParent !== null);
    const vista = c ? c.getAttribute("data-vista") : "?";
    const tab = document.querySelector("[aria-current='page'], .bc-tab[aria-selected='true']");
    return vista + (tab && tab.textContent ? " · " + tab.textContent.trim().slice(0, 24) : "") + (window.location.hash || "");
  } catch { return "?"; }
}

export function datosDelTelefono() {
  try {
    const ua = navigator.userAgent || "";
    const aparato = (ua.match(/\(([^)]+)\)/) || [])[1] || "?";
    const navegador = (ua.match(/(SamsungBrowser|Firefox|CriOS|Chrome|Safari)\/[\d.]+/) || [])[0] || "?";
    const dentroDeApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Messenger/i.test(ua) ? "sí (abierta desde una app)" : "no";
    const red = navigator.connection && navigator.connection.effectiveType ? navigator.connection.effectiveType : "?";
    return [
      "Sección: " + dondeEstoy(),
      "Versión: " + VERSION_BUILD,
      "Pantalla: " + window.innerWidth + "x" + window.innerHeight,
      "Conexión: " + (navigator.onLine === false ? "sin conexión" : red),
      "Dentro de otra app: " + dentroDeApp,
      "Teléfono: " + aparato.slice(0, 60),
      "Navegador: " + navegador
    ];
  } catch { return []; }
}

const wa = (t) => "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(t);

export function enlaceReporteProblema() {
  return wa(["Hola DCUATES, algo no funciona en la página.", "", "¿Qué pasó? (cuéntanos aquí):", "", "— Datos para ayudarte (no los borres) —", ...datosDelTelefono()].join("\n"));
}

export function enlaceReporteAnuncio(titulo) {
  return wa(["Hola DCUATES, quiero reportar un anuncio del Tablero.", "Anuncio: " + String(titulo || "").slice(0, 80), "", "Motivo (engaño, dato incorrecto, ya no está vigente, otro):", "", "Versión: " + VERSION_BUILD].join("\n"));
}
