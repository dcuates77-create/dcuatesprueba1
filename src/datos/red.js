// =========================================================================
// src/datos/red.js — TERCER NIVEL: RED DE CONFIANZA (actividades INDIVIDUALES)
// ⚠️ Candado sencillo de prueba (la clave vive en el código). Acceso por invitación:
// cámbiala y dásela solo a quien invites. Lo que cada persona escribe (diario, notas,
// retos, sellos) se guarda SOLO en su celular; no se envía a ningún lado.
// =========================================================================
export const CLAVE_RED = "red2026";

export const LIBRO_MES = {
  titulo: "Fábulas de Samaniego",
  info: "Fábulas breves con moraleja sobre honestidad, trabajo y amistad. Una al día basta.",
  enlace: "https://www.gutenberg.org/ebooks/55206",
  pregunta: "¿Qué moraleja te sirvió esta semana en tu vida diaria?"
};

export const METAS_SEMANA = [
  { id: "leer", emoji: "📖", texto: "Leer 15 minutos", dias: 4 },
  { id: "caminar", emoji: "🚶", texto: "Caminar o moverme 20 minutos", dias: 4 },
  { id: "aprender", emoji: "💡", texto: "Aprender algo nuevo", dias: 3 },
  { id: "ahorrar", emoji: "💰", texto: "Guardar una moneda o ahorrar algo", dias: 5 },
  { id: "contactar", emoji: "📞", texto: "Saludar a alguien que quiero", dias: 3 }
];

export const INSIGNIAS = [
  { id: "primer-sello", emoji: "🥾", nombre: "Primer paso", info: "Marcaste tu primer sello del pasaporte." },
  { id: "pasaporte", emoji: "🧭", nombre: "Explorador(a)", info: "Conociste todos los proyectos." },
  { id: "lector", emoji: "📖", nombre: "Lector(a) del mes", info: "Terminaste el libro del mes." },
  { id: "gratitud3", emoji: "💛", nombre: "Corazón agradecido", info: "3 días seguidos de gratitud." },
  { id: "gratitud7", emoji: "🌟", nombre: "Gratitud constante", info: "7 días seguidos de gratitud." },
  { id: "reto-semana", emoji: "🎯", nombre: "Constante", info: "Cumpliste tu reto semanal." },
  { id: "mentor", emoji: "🧑‍🏫", nombre: "Mentor(a)", info: "Compartiste un consejo con la comunidad." },
  { id: "embajador", emoji: "🔗", nombre: "Embajador(a)", info: "Compartiste tu enlace personal." }
];

export const leerJSON = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } };
export const guardarJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* nada */ } };
export const leerInsignias = () => leerJSON("dc_insignias", []);
export function otorgar(id) { const a = leerInsignias(); if (a.includes(id)) return false; guardarJSON("dc_insignias", [...a, id]); return true; }
export const hoyISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export function semanaClave(d = new Date()) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dia = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dia); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return `${t.getUTCFullYear()}-S${Math.ceil(((t - y0) / 86400000 + 1) / 7)}`; }
