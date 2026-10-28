// BÚSQUEDA INTELIGENTE (e46): palabras que la gente escribe → palabras que sí existen en la página.
// Cada línea: "lo que escribe" : ["palabras de la página con las que se conecta"].
// Edítalas con calma: agrega las que veas en las búsquedas reales (GoatCounter → eventos buscar_inicio / atajo_inicio).
export const SINONIMOS = {
  perro: ["mascota", "ecatepets", "adopcion", "rescate", "peludito"],
  gato: ["mascota", "ecatepets", "adopcion", "rescate", "peludito"],
  cachorro: ["mascota", "ecatepets", "adopcion"],
  canino: ["mascota", "ecatepets"], felino: ["mascota", "ecatepets"], animal: ["mascota", "ecatepets", "causa animal"],
  peludo: ["mascota", "ecatepets"], peludito: ["mascota", "ecatepets"], adoptar: ["adopcion", "mascota", "ecatepets"], veterinario: ["mascota", "ecatepets"],
  libro: ["libros", "bibliobici", "biblioteca", "prestamo", "lectura"],
  leer: ["libros", "bibliobici", "lectura"], lectura: ["libros", "bibliobici"], biblioteca: ["libros", "bibliobici"], prestar: ["libros", "prestamo"],
  trabajo: ["asesorias", "laboral", "orientacion"], empleo: ["asesorias", "laboral", "orientacion"], chamba: ["asesorias", "laboral"], vacante: ["asesorias", "laboral"], cv: ["asesorias", "laboral"],
  estudiar: ["asesorias", "educativa", "cursos", "talleres"], escuela: ["asesorias", "educativa", "libros"], tarea: ["asesorias", "educativa", "libros"],
  curso: ["bienestar", "talleres", "cursos", "asesorias"], taller: ["bienestar", "talleres", "cursos"], clase: ["cursos", "talleres", "asesorias"],
  comida: ["negocios", "comercio", "tienda"], comer: ["negocios", "comercio"], tienda: ["negocios", "comercio", "publicidad"],
  vender: ["ventas", "negocio", "publicidad", "bazar"], venta: ["ventas", "negocio", "bazar"], comprar: ["negocios", "ventas", "comercio", "bazar"], emprender: ["negocio", "emprendimiento", "publicidad"], negocio: ["negocios", "publicidad", "emprendimiento"],
  anuncio: ["publicidad", "tablero", "anuncios"], promocion: ["publicidad", "cupones", "promociones"], cupon: ["cupones", "promociones", "regalos"], descuento: ["cupones", "promociones"], oferta: ["cupones", "promociones"],
  ayuda: ["apoyo", "voluntario", "necesitas"], apoyo: ["apoyo", "voluntario", "urgencia"], necesito: ["necesitas", "apoyo", "urgencia"], urgencia: ["apoyo", "urgencia", "emergencia"], emergencia: ["urgencia", "emergencia", "telefonos"], problema: ["apoyo", "urgencia"],
  donar: ["donaciones", "donativos", "apoyo"], donacion: ["donaciones", "apoyo"], donativo: ["donaciones", "apoyo"], regalar: ["donaciones", "regalos"], regalo: ["regalos", "gratitud", "retos"],
  voluntario: ["voluntario", "apoyo", "voluntariado"], voluntariado: ["voluntario", "apoyo"], colaborar: ["voluntario", "sumar", "participa"], sumar: ["sumate", "voluntario", "participa"],
  evento: ["agenda", "calendario", "eventos"], agenda: ["agenda", "calendario"], calendario: ["agenda", "calendario"], fecha: ["agenda", "calendario"],
  salud: ["bienestar", "psicologico", "emocional"], psicologo: ["bienestar", "psicologico", "apoyo"], ansiedad: ["bienestar", "emocional", "apoyo"], estres: ["bienestar", "emocional"], emocional: ["bienestar", "apoyo"],
  juego: ["juegos", "zona publica", "juega"], jugar: ["juegos", "zona publica", "juega"], diversion: ["juegos", "zona publica"],
  gracias: ["gratitud", "reconocimientos", "muro"], agradecer: ["gratitud", "reconocimientos", "muro"], reconocimiento: ["gratitud", "reconocimientos"],
  privacidad: ["privacidad", "aviso", "datos"], datos: ["privacidad", "aviso"], seguridad: ["seguridad", "escudo", "fraude"], fraude: ["seguridad", "escudo", "fraude"], estafa: ["seguridad", "escudo", "fraude"], robo: ["seguridad", "escudo"],
  mapa: ["mapa", "negocios", "ubicacion"], ubicacion: ["mapa", "negocios"], direccion: ["mapa", "negocios"], llegar: ["mapa", "negocios"],
  telefono: ["whatsapp", "contacto", "dudas", "telefonos"], whatsapp: ["whatsapp", "contacto", "dudas"], contacto: ["contacto", "whatsapp", "dudas"], escribir: ["whatsapp", "contacto", "dudas"],
  registro: ["registro", "registrate", "solicitud"], registrar: ["registro", "registrate", "solicitud"], inscribir: ["registro", "registrate"], solicitud: ["solicitudes", "registro"],
  vecino: ["nosotros", "comunidad", "participa"], comunidad: ["nosotros", "comunidad"], quienes: ["quienes somos", "nosotros"], mision: ["mision", "nosotros"]
};

// SINÓNIMOS DESDE TU HOJA (e53): las palabras de la pestaña «Sinónimos» de tu hoja de Google se SUMAN a las de arriba
// (nunca las reemplazan). Las carga utilidades/sinonimosHoja.js al abrir la página.
export function agregarSinonimos(extra) {
  Object.keys(extra || {}).forEach((k) => {
    const nuevos = Array.isArray(extra[k]) ? extra[k] : [];
    SINONIMOS[k] = [...new Set([...(SINONIMOS[k] || []), ...nuevos])];
  });
}

// Devuelve, por cada palabra escrita, una lista de alternativas (ella misma, su singular y sus sinónimos).
export function expandirBusqueda(palabras) {
  return palabras.map((w) => {
    const alt = new Set([w]);
    const sing = w.length > 4 && w.endsWith("es") ? w.slice(0, -2) : w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w;
    alt.add(sing);
    if (w.length > 4 && w.endsWith("es")) alt.add(w.slice(0, -1));
    [w, sing].forEach((k) => (SINONIMOS[k] || []).forEach((s) => alt.add(s)));
    return [...alt];
  });
}
