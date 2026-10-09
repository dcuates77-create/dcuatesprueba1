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
