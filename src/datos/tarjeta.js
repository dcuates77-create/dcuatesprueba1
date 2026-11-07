// =========================================================================
// src/datos/tarjeta.js — PASE DIGITAL DEL CUATE (e64 «tarjeta» → e65 «Pase»)
// AQUÍ SE EDITA lo visual y los textos de la tarjeta: colores por perfil, lemas, avatares y leyendas.
// Los DATOS de cada Cuate (número, nombre, puntos) y los PREMIOS viven en tu hoja de Google (pestañas «Cuates», «Puntos» y «Premios»), no aquí.
// El perfil se toma de la modalidad del Club (src/datos/club.js); aquí solo se le pone su «vestido»: colores, ícono, lemas y siluetas.
// =========================================================================
import { modalidadPorNombre } from "./club.js";

export const PUNTOS_BIENVENIDA = 50;
export const TARJETA_TITULO = "DCUATES";
export const TARJETA_LEMA = "¡COMPARTE Y GANA!";
export const TARJETA_LEGAL = "Pase comunitario del Club DCUATES: no es una credencial oficial ni una identificación. Los puntos son un reconocimiento de la comunidad: no tienen valor en dinero y se canjean por los recursos disponibles.";
export const TARJETA_PRIVACIDAD_FOTO = "Tu foto se queda solo en este celular: no se sube ni se guarda en ningún servidor.";
export const TEXTO_CANJEAR = "Revisa por qué PREMIOS puedes cambiar tus puntos";
export const TEXTO_SIGUE_SUMANDO = "Sigue SUMANDO y ganando";

// Zona CUATES: pestañas en el orden en que aparecen. El contenido viene de la pestaña «Contenido Club» de tu hoja; una sección nueva escrita allí
// aparece sola como pestaña nueva (con su nombre). Aquí solo se ponen el ícono y el nombre de las secciones conocidas.
export const SECCIONES_CLUB = [
  { id: "proyectos", ic: "🧭", t: "Proyectos" },
  { id: "beneficios", ic: "🎁", t: "Beneficios" },
  { id: "retos", ic: "🎯", t: "Retos" },
  { id: "ganar", ic: "⭐", t: "Cómo ganar" },
  { id: "novedades", ic: "📣", t: "Novedades" }
];
export const nombreSeccion = (id) => { const s = SECCIONES_CLUB.find((x) => x.id === id); return s ? { ic: s.ic, t: s.t } : { ic: "✨", t: String(id).replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()) }; };

// Fondos de la tarjeta: intensidad del velo claro que se pone sobre la foto para que el texto se lea siempre
export const VELOS = [{ id: "suave", t: "Suave", a: 0.4 }, { id: "medio", t: "Medio", a: 0.62 }, { id: "fuerte", t: "Fuerte", a: 0.8 }];

// Las tres letras del número de Cuate → perfil (por si el nombre del perfil cambiara)
export const PREFIJO_A_PERFIL = { VEC: "vecino", VOL: "voluntario", PAD: "padrino", ALI: "aliado", PAT: "patrocinador", ORG: "organizacion" };

// c1 = color oscuro (títulos y encabezado del panel) · c2 = color principal (insignia y barra) · f1→f2 = degradado del fondo
// silueta: casas | ciudad | gente | corazon | corazones | edificio
export const TEMAS = {
  vecino: {
    rotulo: "CUATE VECINO", icono: "🏠", c1: "#1B5E20", c2: "#2E9E3E", f1: "#EEF8D6", f2: "#BFE3A0", silueta: "casas",
    lemas: ["Construyendo comunidad juntos…", "Mi colonia, nuestra casa común…", "Un buen vecino siempre suma…"]
  },
  patrocinador: {
    rotulo: "CUATE PATROCINADOR/A", icono: "🤝", c1: "#0D3B7A", c2: "#1E78E6", f1: "#E4F1FF", f2: "#B3D6F7", silueta: "ciudad",
    lemas: ["Impulsando proyectos con causa…", "Apoyar también es sembrar…", "Cada aportación hace comunidad…"]
  },
  aliado: {
    rotulo: "CUATE ALIAD@", icono: "👥", c1: "#7A3A0A", c2: "#F57C00", f1: "#FFEFD3", f2: "#FFC98A", silueta: "gente",
    lemas: ["Sumando esfuerzos por una mejor comunidad…", "Ganar-ganar: así se avanza…", "Juntos crecemos más…"]
  },
  voluntario: {
    rotulo: "CUATE VOLUNTARI@", icono: "💜", c1: "#3D2A7A", c2: "#7B4FC9", f1: "#F0E8FD", f2: "#CDB8F0", silueta: "corazon",
    lemas: ["Servir también nos une…", "Mi tiempo, mi aportación…", "Dar la mano nos hace comunidad…"]
  },
  padrino: {
    rotulo: "CUATE PADRINO/MADRINA", icono: "💛", c1: "#8E1148", c2: "#D81B60", f1: "#FFE8F1", f2: "#F8B6D0", silueta: "corazones",
    lemas: ["Acompañar es sembrar futuro…", "Apadrinar es cuidar de cerca…", "Un gesto que se multiplica…"]
  },
  organizacion: {
    rotulo: "CUATE ORGANIZACIÓN", icono: "🏛️", c1: "#004D40", c2: "#00897B", f1: "#DDF6F1", f2: "#A5E0D6", silueta: "edificio",
    lemas: ["Juntos llegamos más lejos…", "Un grupo, muchas manos…", "Organizados, la comunidad avanza…"]
  }
};
export const TEMA_BASE = TEMAS.vecino;

// Devuelve { id, tema } a partir del nombre del perfil (como viene de la hoja) o, si no coincide, de las 3 letras del número.
export function temaDe(perfilNombre, numero) {
  const m = modalidadPorNombre(String(perfilNombre || "").trim());
  let id = m ? m.id : PREFIJO_A_PERFIL[String(numero || "").slice(0, 3).toUpperCase()];
  if (!TEMAS[id]) id = "vecino";
  return { id, tema: TEMAS[id] };
}

// Logos de los proyectos DCUATES (miniaturas en public/images/cuate/). Para agregar uno: copia su miniatura a esa carpeta y añade una línea aquí.
export const AVATARES_LOGO = [
  { id: "dcuates", nombre: "DCUATES Comunidad" },
  { id: "alianzas", nombre: "Alianzas Ganar-Ganar" },
  { id: "bienestar", nombre: "Salud y Bienestar" },
  { id: "ecatepets", nombre: "Ecatepets" },
  { id: "eventos", nombre: "Eventos y más" },
  { id: "prestamos", nombre: "Préstamos y trueque" },
  { id: "recomienda", nombre: "Recomienda y gana" },
  { id: "publicidad", nombre: "Publicidad gratis" },
  { id: "ventas", nombre: "Ventas con causa" },
  { id: "bazar", nombre: "Comercio justo" },
  { id: "historias", nombre: "Historias DCUATES" },
  { id: "cupones", nombre: "Cupones y promos" },
  { id: "voluntario", nombre: "Apoyo voluntario" },
  { id: "patrocinadores", nombre: "Patrocinadores y alianzas" }
];
export const rutaLogo = (id) => `/images/cuate/${id}.webp`;

// Avatares con emoji (se pintan sobre el color de tu perfil)
export const AVATARES_EMOJI = ["🙂", "😄", "😎", "🤓", "🧓", "👵", "👨‍🦱", "👩‍🦱", "🧑‍🌾", "🧑‍🍳", "🧑‍🏫", "🧑‍🎨", "🧑‍🔧", "🐶", "🐱", "🌻", "🌳", "🚲", "📚", "♻️"];

// Ícono del premio según las palabras de su nombre (los premios se editan en la pestaña «Premios» de la hoja)
export function iconoPremio(nombre) {
  const n = String(nombre || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (/libro|lectura|biblio/.test(n)) return "📖";
  if (/recomend|difusion|publicidad|anuncio/.test(n)) return "📣";
  if (/curso|taller|clase|capacit/.test(n)) return "🎓";
  if (/regalo|sorpresa|obsequio/.test(n)) return "🎁";
  if (/cupon|descuento|promo/.test(n)) return "🏷️";
  if (/reciclaj|recicla/.test(n)) return "♻️";
  if (/bici/.test(n)) return "🚲";
  return "🎁";
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
// «01/11/2026» → «nov 2026»
export function desdeTexto(dmy) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(dmy || "").trim());
  return m && Number(m[2]) >= 1 && Number(m[2]) <= 12 ? `${MESES[Number(m[2]) - 1]} ${m[3]}` : "";
}
