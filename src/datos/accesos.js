// =========================================================================
// src/datos/accesos.js — Botones de acceso rápido (Beneficios · Registros)
// Aquí se editan las listas de las ventanas de los 3 botones que están
// debajo del carrusel de cada pestaña. Cada elemento puede llevar:
//   modal:   abre la ventana de un proyecto (ids de BOTONES_PORTADA)
//   seccion: baja hasta una sección de la página (abre su pestaña sola)
//   accion:  "comparte" o "sugerencias" (abren su formulario)
// "logo" es opcional: si no se pone, se usa el emoji.
// =========================================================================

export const ACCESOS_BENEFICIOS = [
  { emoji: "📚", t: "Préstamo gratuito de libros", d: "Pide o dona libros y materiales", modal: "libros" },
  { emoji: "🎓", t: "Asesorías gratuitas", d: "Orientación legal, de negocio y personal", modal: "asesorias" },
  { emoji: "🌿", t: "Bienestar y recreación", d: "Actividades para tu salud y convivencia", modal: "bienestar" },
  { emoji: "🐾", t: "Ecatepets", d: "Adopciones y apoyo a mascotas", modal: "ecatepets" },
  { emoji: "🤝", t: "Círculo de Confianza", d: "Apoyos y beneficios mutuos", modal: "circulo-confianza" },
  { emoji: "📣", t: "Publicidad gratuita", d: "Da a conocer tu negocio", modal: "publicidad-tarjeta" },
  { emoji: "🏷️", t: "Cupones y promociones", d: "Descuentos en negocios locales", modal: "cupones-promos" },
  { emoji: "⭐", t: "Recomienda, evalúa y gana", d: "Comparte tu experiencia y suma", modal: "recomienda-evalua-gana" }
];

export const ACCESOS_REGISTROS = [
  { emoji: "📝", t: "Registra tu solicitud", d: "Cuéntanos qué apoyo necesitas", seccion: "solicitudes" },
  { emoji: "🏪", t: "Registra tu negocio gratis", d: "Publicidad y mapa de negocios", seccion: "publicidad" },
  { emoji: "🛍️", t: "Ventas con causa", d: "Ofrece tu producto o servicio", seccion: "ventas-con-causa" },
  { emoji: "🔎", t: "Reporta un caso", d: "Mascotas, personas o cosas extraviadas", seccion: "extraviados-registro" },
  { emoji: "💚", t: "Quiero ser voluntario", d: "Aporta tiempo, talento o recursos", seccion: "donaciones" },
  { emoji: "🎓", t: "Ser asesor voluntario", d: "Comparte tus conocimientos", modal: "asesorias" },
  { emoji: "🌟", t: "Conocer y compartir más", d: "Invita a tus contactos", accion: "comparte" },
  { emoji: "💬", t: "Sugerencias y quejas", d: "Ayúdanos a mejorar", accion: "sugerencias" }
];
