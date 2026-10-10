// =========================================================================
// src/datos/zona.js — Contenido editable de la ZONA DCUATES
// =========================================================================
import { CUPONES_PROMOS_ITEMS } from "./proyectos.js";

// ---- JUEGA Y GANA ---------------------------------------------------------
// Premios de la ruleta y la tragamonedas. "tipo": cupon | semillas | frase | reto
// Los cupones salen de CUPONES_PROMOS_ITEMS (los mismos de la ventana de Cupones).
// Desde Baserow (tabla ENLACES) se SUMAN los que tengan: PREMIO TITULO, PREMIO INFO
// y (opcional) PREMIO ENLACE. Participar es gratis y los premios los aportan
// negocios aliados y patrocinadores; no es un sorteo.
export const GIROS_POR_DIA = 3;
export const PREMIOS_BASE = [
  ...CUPONES_PROMOS_ITEMS.map((c) => ({ tipo: "cupon", emoji: "🏷️", titulo: c.nombre, info: c.descripcion })),
  { tipo: "semillas", emoji: "🌱", titulo: "+3 Semillas", info: "Tu camino crece: ¡sigue sumando!", n: 3 },
  { tipo: "semillas", emoji: "🌱", titulo: "+2 Semillas", info: "Cada paso cuenta.", n: 2 },
  { tipo: "frase", emoji: "💛", titulo: "Mensaje para ti", info: "“Lo que haces por otros regresa multiplicado.”" },
  { tipo: "reto", emoji: "⭐", titulo: "Reto amable del día", info: "Saluda hoy a un vecino y pregúntale cómo está." }
];
export function normalizarPremios(filas = []) {
  const extra = filas
    .filter((f) => f && f["PREMIO TITULO"])
    .map((f) => ({ tipo: "cupon", emoji: "🎁", titulo: String(f["PREMIO TITULO"]).trim(), info: f["PREMIO INFO"] ? String(f["PREMIO INFO"]).trim() : "", enlace: f["PREMIO ENLACE"] ? String(f["PREMIO ENLACE"]).trim() : "" }));
  return [...PREMIOS_BASE, ...extra];
}

// ---- INFO CLAVE -----------------------------------------------------------
// Teléfonos nacionales de uso general. VERIFÍCALOS de vez en cuando y agrega los
// locales (Protección Civil Ecatepec, clínicas cercanas, etc.) en TELEFONOS_LOCALES.
export const TELEFONOS_EMERGENCIA = [
  { emoji: "🚨", nombre: "Emergencias", tel: "911", info: "Policía, bomberos y ambulancias" },
  { emoji: "🕵️", nombre: "Denuncia anónima", tel: "089", info: "Reporta delitos sin dar tu nombre" },
  { emoji: "🚑", nombre: "Cruz Roja Mexicana", tel: "065", info: "Urgencias médicas" },
  { emoji: "💬", nombre: "Línea de la Vida", tel: "8009112000", mostrar: "800 911 2000", info: "Apoyo emocional y adicciones" }
];
export const TELEFONOS_LOCALES = [
  // { emoji: "🚒", nombre: "Protección Civil Ecatepec", tel: "5500000000", info: "Agrega aquí tus números locales" }
];
export const TIPS_SEGURIDAD = [
  "Los únicos canales oficiales de DCUATES son los de esta página (WhatsApp 55 2069 6627 y redes verificadas).",
  "Nunca des claves, códigos ni datos bancarios por mensaje. Los pagos son solo por transferencia a la CLABE oficial.",
  "Si una promoción parece demasiado buena o te presiona, desconfía y pregúntanos antes."
];

// ---- TABLA NUEVA DE BASEROW: ZONA PÚBLICA DE CUATES ------------------------
// Crea una tabla nueva en Baserow, importa ZONA_PUBLICA.csv y pega aquí su ID
// (el número que aparece en la dirección: .../table/XXXXXX). Mientras esté
// vacío ("") la zona usa los contenidos de ejemplo que ya trae el código.
// Columnas: ZONA, TARJETA, TIPO, TITULO, INFO, ENLACE, EMOJI, FECHA, ORDEN, ACTIVO, NOTA
// ¡OJO! Todo lo que pongas en esa tabla es PÚBLICO (la página la lee sin clave).
export const BASEROW_TABLE_ID_ZONA = "1254189";

const activa = (f) => !/^(no|0|false|falso)$/i.test(String(f.ACTIVO == null ? "SI" : f.ACTIVO).trim());
const ord = (a, b) => (Number(a.ORDEN) || 999) - (Number(b.ORDEN) || 999);
export const filasDe = (filas, tarjeta, tipo) =>
  (filas || []).filter((f) => f && String(f.ZONA || "publica").toLowerCase() === "publica" && String(f.TARJETA || "").toLowerCase() === tarjeta && (!tipo || String(f.TIPO || "").toLowerCase() === tipo) && f.TITULO && activa(f)).sort(ord);

// Reemplaza, en orden, los botones de cada tema (música, pelis, páginas, libros).
export function temasDesdeZona(temasBase, filas) {
  return temasBase.map((t) => {
    const nuevos = filasDe(filas, "aprende", t.id).map((f) => ({ titulo: String(f.TITULO).trim(), info: f.INFO ? String(f.INFO).trim() : "", enlace: f.ENLACE ? String(f.ENLACE).trim() : "", emoji: f.EMOJI ? String(f.EMOJI).trim() : "" }));
    return { ...t, items: t.items.map((d, i) => (nuevos[i] ? { ...d, ...nuevos[i], emoji: nuevos[i].emoji || d.emoji } : d)) };
  });
}
export const agendaDesdeZona = (filas) => filasDe(filas, "agenda").map((f) => ({ fecha: String(f.FECHA || "").trim().slice(0, 10), titulo: String(f.TITULO).trim(), info: f.INFO ? String(f.INFO).trim() : "", enlace: f.ENLACE ? String(f.ENLACE).trim() : "" })).filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.fecha));
export const premiosDesdeZona = (filas) => filasDe(filas, "gana", "premio").map((f) => ({ tipo: "cupon", emoji: f.EMOJI || "🎁", titulo: String(f.TITULO).trim(), info: f.INFO ? String(f.INFO).trim() : "", enlace: f.ENLACE ? String(f.ENLACE).trim() : "" }));
export const telefonosDesdeZona = (filas) => filasDe(filas, "info", "telefono").filter((f) => f.ENLACE).map((f) => ({ emoji: f.EMOJI || "📞", nombre: String(f.TITULO).trim(), tel: String(f.ENLACE).replace(/\s/g, ""), info: f.INFO ? String(f.INFO).trim() : "" }));
export const palabrasDesdeZona = (filas) => filasDe(filas, "empieza", "palabra").map((f) => [f.EMOJI || "🌟", String(f.TITULO).trim(), f.INFO ? String(f.INFO).trim() : ""]);
export const necesidadesDesdeZona = (filas) => filasDe(filas, "causa", "dona").map((f) => ({ emoji: f.EMOJI || "🎁", titulo: String(f.TITULO).trim(), info: f.INFO ? String(f.INFO).trim() : "", proyecto: f.ENLACE ? String(f.ENLACE).trim() : "" }));
export const juegosActivosDesdeZona = (filas) => {
  const hay = (filas || []).some((f) => f && String(f.TARJETA || "").toLowerCase() === "juegos");
  if (!hay) return null;
  return new Set((filas || []).filter((f) => f && String(f.TARJETA || "").toLowerCase() === "juegos" && activa(f)).map((f) => String(f.ENLACE || "").trim().toLowerCase()));
};

export const NECESIDADES_BASE = [
  { emoji: "📚", titulo: "Libros y cuentos en buen estado", info: "Para el préstamo de libros y Bibliobici: de lectura, escolares o infantiles.", proyecto: "libros" },
  { emoji: "🐾", titulo: "Croquetas y cobijas", info: "Para los peluditos de Ecatepets que esperan hogar.", proyecto: "ecatepets" },
  { emoji: "✏️", titulo: "Útiles escolares", info: "Cuadernos, colores y mochilas para niñas y niños de la colonia.", proyecto: "donaciones" },
  { emoji: "👕", titulo: "Ropa limpia y en buen estado", info: "Para familias que la necesitan; se entrega por medio de la comunidad.", proyecto: "donaciones" },
  { emoji: "🙋", titulo: "Tu tiempo como voluntario", info: "Una tarde al mes para leer, orientar o acompañar.", proyecto: "apoyo-voluntario" }
];
