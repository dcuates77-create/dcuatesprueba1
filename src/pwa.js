// =========================================================================
// PWA — DCUATES: permite instalar la página como app (ícono en la pantalla
// de inicio) y abrirla aunque la señal sea mala. NO cambia cómo se actualiza
// la página: el service worker (public/sw.js) siempre intenta primero la red,
// así que cada versión nueva se ve en cuanto hay internet.
// =========================================================================
import { registrar } from "./analitica";

let evento = null;
const oyentes = new Set();
let iniciada = false;

export function iniciarPWA() {
  if (iniciada || typeof window === "undefined") return;
  iniciada = true;
  try {
    const local = /^(localhost|127\.|\[::1\])/.test(window.location.hostname);
    if ("serviceWorker" in navigator && !local) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      evento = e;
      oyentes.forEach((f) => f());
    });
    window.addEventListener("appinstalled", () => {
      evento = null;
      registrar("pwa_instalada");
      oyentes.forEach((f) => f());
    });
  } catch {
    /* la PWA nunca debe romper la página */
  }
}

export function puedeInstalar() {
  return !!evento;
}

export async function instalarApp() {
  if (!evento) return false;
  try {
    evento.prompt();
    const r = await evento.userChoice;
    evento = null;
    return r && r.outcome === "accepted";
  } catch {
    return false;
  }
}

export function suscribirPWA(f) {
  oyentes.add(f);
  return () => oyentes.delete(f);
}

export function yaInstalada() {
  try {
    return (
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true
    );
  } catch {
    return false;
  }
}

export function esIOS() {
  try {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  } catch {
    return false;
  }
}
