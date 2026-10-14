// =========================================================================
// src/datos/temporada.js — FONDO TEMÁTICO por temporada (editable).
// Cada temporada: desde/hasta "MM-DD", nombre, emojis del patrón, color base claro y color de acento.
// Para probar otra fecha: pon FORZAR = "diciembre" (nombre exacto de una temporada) o null para automático.
// =========================================================================
export const FORZAR = null;
export const TEMPORADAS = [
  { n: "Año nuevo y Reyes", d: "01-01", h: "01-10", em: ["🎉", "✨", "👑", "⭐"], base: "#FFF9E6", acento: "#B7791F" },
  { n: "Invierno", d: "01-11", h: "02-06", em: ["🧣", "☕", "❄️", "🧤"], base: "#EEF5FB", acento: "#1B6F8A" },
  { n: "Amor y amistad", d: "02-07", h: "02-14", em: ["💛", "💌", "🤝", "💕"], base: "#FFF0F3", acento: "#BE185D" },
  { n: "Primavera", d: "02-15", h: "04-29", em: ["🌸", "🌼", "🦋", "🌱"], base: "#F3FBF1", acento: "#2E9E5B" },
  { n: "Día del Niño", d: "04-30", h: "04-30", em: ["🎈", "🧸", "🪁", "🎨"], base: "#FFF6E5", acento: "#F07A1A" },
  { n: "Día de las Madres", d: "05-01", h: "05-10", em: ["🌷", "💐", "💛", "🌹"], base: "#FFF0F5", acento: "#BE185D" },
  { n: "Verano", d: "05-11", h: "08-14", em: ["☀️", "🌻", "🍉", "🌴"], base: "#FFFBE6", acento: "#F07A1A" },
  { n: "Regreso a clases", d: "08-15", h: "08-31", em: ["🎒", "📚", "✏️", "🍎"], base: "#EEF6FF", acento: "#1B6F8A" },
  { n: "Fiestas patrias", d: "09-01", h: "09-20", em: ["🇲🇽", "🎺", "🌮", "🎉"], base: "#F2FBF3", acento: "#C2410C" },
  { n: "Otoño", d: "09-21", h: "10-09", em: ["🍂", "🍁", "🎃", "☕"], base: "#FFF5E8", acento: "#C2410C" },
  { n: "Día de Muertos", d: "10-10", h: "11-03", em: ["🌼", "🕯️", "💀", "🧡"], base: "#FFF4E2", acento: "#C2410C" },
  { n: "Otoño tardío", d: "11-04", h: "11-30", em: ["🍂", "🧡", "🍞", "🍁"], base: "#FFF5EA", acento: "#9A3412" },
  { n: "Navidad", d: "12-01", h: "12-31", em: ["🎄", "⭐", "🎁", "❄️"], base: "#F1FAF3", acento: "#B91C1C" }
];
export function temporadaActual(fecha = new Date()) {
  if (FORZAR) { const f = TEMPORADAS.find((t) => t.n.toLowerCase() === FORZAR.toLowerCase()); if (f) return f; }
  const md = String(fecha.getMonth() + 1).padStart(2, "0") + "-" + String(fecha.getDate()).padStart(2, "0");
  return TEMPORADAS.find((t) => md >= t.d && md <= t.h) || TEMPORADAS[0];
}
// Patrón SVG suave (emojis dispersos con poca opacidad) para fondos claros
export function patronSvg(t) {
  const [a, b, c, d] = t.em;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><g font-size="22" opacity=".16"><text x="10" y="32">${a}</text><text x="88" y="62" font-size="18">${b}</text><text x="34" y="112">${c}</text><text x="108" y="138" font-size="20">${d}</text></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
