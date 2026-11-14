// =========================================================================
// src/datos/negocios.js (e79) — MINI PÁGINAS DE NEGOCIOS CUATE (dcuates.com/n/<slug>)
// Los datos viven en tu hoja de Google, pestaña «NegociosCUATE» (una fila por negocio). Aquí solo hay:
//  · las categorías (color e ícono),
//  · dos negocios de EJEMPLO que solo se muestran si la hoja todavía no responde (para probar el diseño),
//  · la función que pide el negocio al Apps Script (?a=negocio&slug=…).
// =========================================================================
import { GOOGLE_SHEETS_URL } from "./config.js";

export const CATEGORIAS = {
  SALUD: { e: "🩺", color: "#0E7490", nombre: "Salud" },
  ALIMENTOS: { e: "🍽️", color: "#C2410C", nombre: "Alimentos" },
  "EDUCACIÓN": { e: "🎓", color: "#4F46E5", nombre: "Educación" },
  EDUCACION: { e: "🎓", color: "#4F46E5", nombre: "Educación" },
  OCIO: { e: "🎭", color: "#7A5AD8", nombre: "Ocio" },
  ALTRUISMO: { e: "🤲", color: "#BE185D", nombre: "Altruismo" },
  SERVICIOS: { e: "🛠️", color: "#475569", nombre: "Servicios" },
  COMERCIO: { e: "🛍️", color: "#B7791F", nombre: "Comercio" },
  OTRO: { e: "🏪", color: "#1F7A46", nombre: "Negocio" }
};
export const categoriaDe = (c) => CATEGORIAS[String(c || "").toUpperCase()] || CATEGORIAS.OTRO;

const EJEMPLOS = {
  "ejemplo-salud": {
    s: "ejemplo-salud", n: "Fisioterapia Movimiento Vivo", e: "Muévete sin dolor, vive con ganas", c: "SALUD", patro: true,
    d: "Consultorio de fisioterapia y rehabilitación en Jardines de Morelos. Atendemos dolor de espalda, lesiones deportivas y movilidad en adultos mayores, con trato cercano y precios justos.",
    of: ["Valoración y plan de ejercicios", "Terapia para dolor de espalda y cuello", "Rehabilitación después de lesiones", "Activación física para adultos mayores"],
    h: "Lun a Vie 9:00–19:00 · Sáb 9:00–14:00", dir: "Jardines de Morelos, Ecatepec (dirección de ejemplo)", mapa: "", wa: "525500000000", tel: "", web: "", fb: "", ig: "", logo: "", portada: "", gal: [],
    ofT: "Valoración sin costo", ofD: "Presenta tu Pase CUATE y recibe tu primera valoración sin costo y 10% en tu plan de terapia.",
    rec: "Valoración inicial sin costo y 10% de descuento para Cuates del Club", nec: "Voluntarios para jornadas de activación física en el parque", com: "Videos cortos de ejercicios de cuidado para adultos mayores",
    club: true, cod: "NEG-1001-SLD",
    red: [{ s: "ejemplo-alimentos", n: "Tamales Doña Chela", c: "ALIMENTOS", l: "", e: "Sabor casero, hecho con cariño" }]
  },
  "ejemplo-alimentos": {
    s: "ejemplo-alimentos", n: "Tamales Doña Chela", e: "Sabor casero, hecho con cariño", c: "ALIMENTOS", patro: false,
    d: "Tamales y atole hechos a diario con receta familiar. Pedidos para desayunos, reuniones y fechas especiales. Entrega gratis en la colonia.",
    of: ["Tamales de rajas, mole, dulce y verde", "Atole y champurrado", "Pedidos para eventos", "Entrega a domicilio en la colonia"],
    h: "Todos los días 7:00–13:00", dir: "Jardines de Morelos, Ecatepec (dirección de ejemplo)", mapa: "", wa: "525500000000", tel: "", web: "", fb: "", ig: "", logo: "", portada: "", gal: [],
    ofT: "", ofD: "", rec: "Tamales y atole frescos todos los días; pedidos con un día de anticipación", nec: "Vecinos que quieran repartir pedidos en bicicleta", com: "Receta de atole y consejos para tus reuniones",
    club: false, cod: "NEG-1002-ALM", red: []
  }
};

const cache = {};
// Devuelve { ok:true, negocio, ejemplo? } o { ok:false, motivo }.
export async function cargarNegocio(slug) {
  const s = String(slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!s) return { ok: false, motivo: "sin-slug" };
  if (cache[s]) return cache[s];
  let r = null;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 12000);
    const res = await fetch(`${GOOGLE_SHEETS_URL}?a=negocio&slug=${encodeURIComponent(s)}`, { signal: ctl.signal });
    clearTimeout(t);
    const j = await res.json();
    if (j && j.ok && j.negocio) r = { ok: true, negocio: j.negocio };
    else if (j && j.motivo === "no-encontrado") r = { ok: false, motivo: "no-encontrado" };
  } catch (e) { /* sin respuesta: se intenta el ejemplo */ }
  if (!r) r = EJEMPLOS[s] ? { ok: true, negocio: EJEMPLOS[s], ejemplo: true } : { ok: false, motivo: "sin-conexion" };
  if (r.ok) cache[s] = r;
  return r;
}
