// AGENDA PLUS — contenidos. Los EJEMPLOS se ocultan solos cuando en Baserow (tabla ENLACES) hay filas reales.
// Columnas de Baserow (todas en la tabla ENLACES, una fila por elemento):
//   TABLERO:     ANUNCIO TIPO · ANUNCIO TITULO · ANUNCIO TEXTO · ANUNCIO TEL (opcional) · ANUNCIO HASTA (fecha AAAA-MM-DD, opcional)
//   DIRECTORIO:  DIRECTORIO AREA · DIRECTORIO NOMBRE · DIRECTORIO DETALLE · DIRECTORIO TEL (opcional)
// OJO: la tabla ENLACES es pública. Aquí solo va el directorio PÚBLICO; los directorios con clave NO se guardan aquí.

export const MAPAS = [
  { id: "jardines", t: "Jardines de Morelos", q: "Jardines de Morelos, Ecatepec de Morelos, Estado de México", nota: "Nuestra colonia y sus calles." },
  { id: "americas", t: "Las Américas", q: "Fraccionamiento Las Américas, Ecatepec de Morelos, Estado de México", nota: "Fraccionamiento Las Américas, Ecatepec." },
  { id: "azteca", t: "Ciudad Azteca", q: "Ciudad Azteca, Ecatepec de Morelos, Estado de México", nota: "Ciudad Azteca y su metro." },
  { id: "sancristobal", t: "San Cristóbal", q: "San Cristóbal Centro, Ecatepec de Morelos, Estado de México", nota: "San Cristóbal Ecatepec." },
  { id: "tecamac", t: "Tecámac", q: "Tecámac, Estado de México", nota: "Tecámac y alrededores." },
  { id: "alrededores", t: "Ecatepec y alrededores", q: "Ecatepec de Morelos, Estado de México", nota: "Vista general de la zona." },
  { id: "centro", t: "Centro de la CDMX", q: "Centro Histórico, Ciudad de México", nota: "Zócalo y Centro Histórico." },
  { id: "coyoacan", t: "Coyoacán", q: "Coyoacán, Ciudad de México", nota: "Centro de Coyoacán." },
  { id: "tlalpan", t: "Tlalpan", q: "Tlalpan Centro, Ciudad de México", nota: "Centro de Tlalpan." }
];

export const TIPOS_ANUNCIO = [
  ["renta", "🏠", "Renta o venta de inmuebles"],
  ["felicitacion", "🎉", "Felicitaciones y agradecimientos"],
  ["recomendacion", "👍", "Recomendaciones"],
  ["evento", "📍", "Eventos de la zona"],
  ["aviso", "📢", "Avisos y otros"]
];
export const tipoAnuncio = (t) => {
  const k = String(t || "").toLowerCase();
  return TIPOS_ANUNCIO.find((x) => k.includes(x[0].slice(0, 5))) || TIPOS_ANUNCIO[4];
};

// EJEMPLOS (se muestran marcados como «Ejemplo» hasta que haya anuncios reales).
export const ANUNCIOS_EJEMPLO = [
  { tipo: "renta", titulo: "Se renta departamento (ejemplo)", texto: "Así se vería un anuncio de renta: describe el lugar, la zona y cómo contactarte.", ejemplo: true },
  { tipo: "felicitacion", titulo: "¡Feliz cumpleaños, vecina! (ejemplo)", texto: "Aquí caben felicitaciones, agradecimientos y buenas noticias de la comunidad.", ejemplo: true },
  { tipo: "recomendacion", titulo: "Recomiendo a un técnico de confianza (ejemplo)", texto: "Cuenta quién te ayudó y por qué lo recomiendas, sin datos personales de terceros.", ejemplo: true },
  { tipo: "evento", titulo: "Kermés de la colonia (ejemplo)", texto: "Eventos vecinales, kermeses, rodadas y reuniones de la zona.", ejemplo: true }
];

export const REGLAS_TABLERO = [
  "No publiques datos personales de otras personas (domicilios, teléfonos ni fotos sin permiso).",
  "Todo se revisa antes de publicarse; puede tardar unas horas.",
  "Para vender productos o servicios con registro usa «Quiero vender» o «Tengo un negocio».",
  "Los anuncios duran unas semanas; escribe si quieres renovarlos o retirarlos."
];

export const DIRECTORIO_AREAS = [
  ["salud", "🩺", "Salud y bienestar"],
  ["hogar", "🔧", "Hogar y oficios"],
  ["comida", "🍽️", "Comida"],
  ["educacion", "📚", "Educación y cursos"],
  ["mascotas", "🐾", "Mascotas"]
];

// EJEMPLOS del directorio público (sin teléfonos: no se inventan datos de contacto).
export const DIRECTORIO_EJEMPLO = [
  { area: "salud", nombre: "Consultorio de la colonia (ejemplo)", detalle: "Así se ve una recomendación: nombre, a qué se dedica y por qué la comunidad lo recomienda.", ejemplo: true },
  { area: "hogar", nombre: "Plomería y electricidad (ejemplo)", detalle: "Los oficios de confianza de la zona estarán aquí, con su forma de contacto.", ejemplo: true },
  { area: "comida", nombre: "Cocina casera por encargo (ejemplo)", detalle: "Negocios de comida que los vecinos recomiendan.", ejemplo: true },
  { area: "educacion", nombre: "Clases y regularización (ejemplo)", detalle: "Maestros, talleres y cursos recomendados por la comunidad.", ejemplo: true },
  { area: "mascotas", nombre: "Veterinaria y estética canina (ejemplo)", detalle: "Servicios para mascotas recomendados en la zona.", ejemplo: true }
];

// Directorios con clave (se activan con claves verificadas en servidor en una etapa siguiente).
export const DIRECTORIOS_CLAVE = [
  { id: "A", t: "Directorio PLUS · A", d: "Para quien tiene clave de este grupo." },
  { id: "B", t: "Directorio PLUS · B", d: "Para quien tiene clave de este grupo." },
  { id: "C", t: "Directorio PLUS · C", d: "Para quien tiene clave de este grupo." }
];

const t = (f, c) => (f && f[c] && String(f[c]).trim()) || "";
const hoyIso = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

export function normalizarAnuncios(filas = []) {
  const hoy = hoyIso();
  return filas
    .filter((f) => f && t(f, "ANUNCIO TITULO"))
    .filter((f) => { const h = t(f, "ANUNCIO HASTA").slice(0, 10); return !/^\d{4}-\d{2}-\d{2}$/.test(h) || h >= hoy; })
    .slice(0, 40)
    .map((f) => ({ tipo: tipoAnuncio(t(f, "ANUNCIO TIPO"))[0], titulo: t(f, "ANUNCIO TITULO"), texto: t(f, "ANUNCIO TEXTO"), tel: t(f, "ANUNCIO TEL").replace(/\D/g, "") }));
}
export function normalizarDirectorio(filas = []) {
  return filas
    .filter((f) => f && t(f, "DIRECTORIO NOMBRE"))
    .slice(0, 60)
    .map((f) => {
      const a = t(f, "DIRECTORIO AREA").toLowerCase();
      const area = (DIRECTORIO_AREAS.find((x) => a.includes(x[0].slice(0, 4))) || ["otros", "📌", "Otros"])[0];
      return { area, nombre: t(f, "DIRECTORIO NOMBRE"), detalle: t(f, "DIRECTORIO DETALLE"), tel: t(f, "DIRECTORIO TEL").replace(/\D/g, "") };
    });
}
