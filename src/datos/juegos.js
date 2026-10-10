// =========================================================================
// src/datos/juegos.js — Zona de juegos (Juega y diviértete + Empieza aquí)
// "Contextos" = el tema (skin) con el que se visten los juegos.
// Desde Baserow (tabla ENLACES, opcional) se puede apagar o renombrar un juego:
//   JUEGO CLAVE (memorama | bloques | cometacos | fusiona | papalote | atrapa | escaleras | gato | simon)
//   JUEGO TITULO (nombre nuevo) · JUEGO ACTIVO (no = se oculta)
// =========================================================================
export const CONTEXTOS = [
  { id: "nosotros", nombre: "Nosotros", emoji: "🏠", color: "#1B6F8A",
    pares: ["📚", "🚲", "🐾", "🤝", "🎓", "🌱"], buenos: ["🤝", "💛", "🌟"], malo: "⚠️", heroe: "🪁",
    meta: "¡Sumaste amigos a la comunidad!" },
  { id: "beneficios", nombre: "Beneficios", emoji: "🎁", color: "#F07A1A",
    pares: ["📚", "🎓", "🌿", "🐾", "💬", "🎁"], buenos: ["📚", "📘", "📖"], malo: "⚠️", heroe: "📚",
    meta: "¡Aprovechaste los beneficios!" },
  { id: "causas", nombre: "Causas", emoji: "❤️", color: "#E5484D",
    pares: ["🐶", "🐱", "🦴", "❤️", "🧺", "🏠"], buenos: ["🦴", "🥣", "❤️"], malo: "⚠️", heroe: "🐶",
    meta: "¡Tu ayuda llegó a quien la necesitaba!" },
  { id: "negocios", nombre: "Negocios", emoji: "🗺️", color: "#2E9E5B",
    pares: ["🌮", "🥖", "☕", "💈", "🧵", "🍎"], buenos: ["🌮", "🏷️", "🥖"], malo: "⚠️", heroe: "🛒",
    meta: "¡Compraste local y ayudaste al barrio!" },
  { id: "muertos", nombre: "Día de Muertos", emoji: "🌼", color: "#E8710A",
    pares: ["🌼", "🕯️", "💀", "🍞", "🧡", "🦋"], buenos: ["🌼", "🕯️", "🍞"], malo: "⚠️", heroe: "🦋",
    meta: "¡Recordaste con cariño a quienes quieres!" }
];

export const JUEGOS = [
  { id: "memorama", nombre: "Memorama", emoji: "🃏", info: "Encuentra las parejas." },
  { id: "bloques", nombre: "Bloques", emoji: "🧱", info: "Acomoda piezas y completa líneas." },
  { id: "cometacos", nombre: "Come-tacos", emoji: "🌮", info: "Come todo y esquiva las alertas." },
  { id: "fusiona", nombre: "Fusiona", emoji: "🔢", info: "Desliza y une números." },
  { id: "papalote", nombre: "Papalote", emoji: "🪁", info: "Toca para volar." },
  { id: "atrapa", nombre: "Atrapa", emoji: "🧺", info: "Mueve la canasta." },
  { id: "escaleras", nombre: "Escaleras", emoji: "🎲", info: "Serpientes y escaleras." },
  { id: "gato", nombre: "Gato", emoji: "❌", info: "Tres en raya." },
  { id: "simon", nombre: "Simón dice", emoji: "💡", info: "Repite las luces." }
];

export const NIVELES = [
  { min: 0, emoji: "🌱", nombre: "Semilla" },
  { min: 10, emoji: "🌿", nombre: "Brote" },
  { min: 30, emoji: "🌳", nombre: "Árbol" },
  { min: 70, emoji: "🍎", nombre: "Fruto" },
  { min: 150, emoji: "🌎", nombre: "Bosque" }
];

export function normalizarJuegos(filas = []) {
  const por = {};
  filas.forEach((f) => {
    const k = f && f["JUEGO CLAVE"] && String(f["JUEGO CLAVE"]).trim().toLowerCase();
    if (!k) return;
    por[k] = {
      titulo: f["JUEGO TITULO"] ? String(f["JUEGO TITULO"]).trim() : "",
      activo: !/^(no|0|false)$/i.test(String(f["JUEGO ACTIVO"] || "si").trim())
    };
  });
  return JUEGOS.filter((j) => !por[j.id] || por[j.id].activo).map((j) => ({ ...j, nombre: (por[j.id] && por[j.id].titulo) || j.nombre }));
}

// Semillas (puntos) guardadas solo en el celular de cada persona.
const CLAVE = "dc_semillas";
export function leerSemillas() {
  try { return parseInt(localStorage.getItem(CLAVE) || "0", 10) || 0; } catch { return 0; }
}
export function sumarSemillas(n) {
  const v = leerSemillas() + n;
  try { localStorage.setItem(CLAVE, String(v)); } catch { /* sin almacenamiento */ }
  return v;
}
export function nivelDe(semillas) {
  let n = NIVELES[0], i = 0;
  NIVELES.forEach((x, k) => { if (semillas >= x.min) { n = x; i = k; } });
  return { ...n, indice: i, siguiente: NIVELES[i + 1] || null };
}
export function leerPref(k, def) { try { return localStorage.getItem("dc_" + k) || def; } catch { return def; } }
export function guardarPref(k, v) { try { localStorage.setItem("dc_" + k, v); } catch { /* nada */ } }
export function leerRecord(juego) { try { return parseInt(localStorage.getItem("dc_rec_" + juego) || "0", 10) || 0; } catch { return 0; } }
export function guardarRecord(juego, v) { try { if (v > leerRecord(juego)) localStorage.setItem("dc_rec_" + juego, String(v)); } catch { /* nada */ } }
