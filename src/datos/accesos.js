// =========================================================================
// src/datos/accesos.js — Botones de acceso rápido (Beneficios · Registros)
// Aquí se editan las listas de las ventanas de los 3 botones que están
// debajo del carrusel de cada pestaña. Cada elemento puede llevar:
//   modal:   abre la ventana de un proyecto (ids de BOTONES_PORTADA)
//   seccion: baja hasta una sección de la página (abre su pestaña sola)
//   accion:  "comparte" o "sugerencias" (abren su formulario)
//   blanco:  true -> el emoji se ve en blanco (silueta)
//   abre:    "ventas" o "extraviados": además despliega ese registro
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

// REGÍSTRATE Y PARTICIPA (e56): todas las formas de registro, en grupos. Un elemento con «grupo» es solo un título.
//   reg: "id"   abre un registro previo con folio (src/datos/registros.js)
//   micro: "id" abre una micro-acción (recomienda, dos, evento, espacio, usar)
export const ACCESOS_REGISTROS = [
  { grupo: "🙏 NECESITO · Pide apoyo o servicios" },
  { emoji: "🙏", t: "NECESITO algo", d: "Una cosa, servicio, recomendación o ayuda", reg: "necesito" },
  { emoji: "📝", t: "Registra tu solicitud", d: "Cuéntanos qué apoyo necesitas", seccion: "solicitudes" },
  { emoji: "📚", t: "Préstamo de libros", d: "Pide o dona libros y materiales", reg: "libros" },
  { emoji: "🎓", t: "Asesoría gratuita", d: "Legal, de negocio o personal", reg: "asesorias" },
  { emoji: "🐾", t: "Ecatepets", d: "Adopta, ayuda o sé hogar temporal", reg: "ecatepets" },
  { emoji: "🌿", t: "Bienestar y recreación", d: "Talleres y actividades", reg: "bienestar" },
  { emoji: "🐾👣", blanco: true, t: "Reporta un caso", d: "Mascotas, personas o cosas extraviadas", reg: "extraviado" },
  { emoji: "🎤", t: "Espacio para tu actividad", d: "Pide prestado un espacio", micro: "usar" },
  { grupo: "🤝 OFREZCO · Suma tu parte" },
  { emoji: "🎁", t: "OFREZCO algo", d: "Una cosa, servicio o ayuda para alguien", reg: "ofrezco" },
  { emoji: "🏪", t: "Registra tu negocio gratis", d: "Publicidad y mapa de negocios", seccion: "publicidad" },
  { emoji: "🤝", t: "Alianza ganar-ganar", d: "Negocios y organizaciones", reg: "alianza" },
  { emoji: "🛍️", t: "Ventas con causa", d: "Ofrece tu producto o servicio", seccion: "registro-ventas", abre: "ventas" },
  { emoji: "🧺", t: "Bazares y mercados", d: "Participa con lo que ofreces", reg: "bazar" },
  { emoji: "🔒", t: "Círculo de Confianza", d: "Apoyos y beneficios mutuos", reg: "circulo" },
  { emoji: "💚", t: "Quiero ser voluntario", d: "Aporta tiempo, talento o recursos", seccion: "donaciones" },
  { emoji: "🎓", t: "Ser asesor voluntario", d: "Comparte tus conocimientos", reg: "asesor" },
  { emoji: "💛", t: "Aportación para causas", d: "Económica, en especie o trueque", reg: "aportacion" },
  { emoji: "🏡", t: "Presta un espacio", d: "Para actividades de la red", micro: "espacio" },
  { grupo: "🧺 RECIBO · Lo que hay hoy" },
  { emoji: "🧺", t: "Ver lo que hay hoy", d: "Ofertas, necesidades, adopciones y libros", reg: "tablon" },
  { grupo: "💡 Propón y recomienda" },
  { emoji: "⭐", t: "Recomienda a alguien", d: "Quien hace labor social", micro: "recomienda" },
  { emoji: "✌️", t: "Reto: pide dos recomendaciones", d: "Por cada una que das, pide dos", micro: "dos" },
  { emoji: "📅", t: "Propón un evento", d: "Súmalo a la Agenda", micro: "evento" },
  { emoji: "💡", t: "Tu iniciativa", d: "Una idea que beneficie a todos", reg: "iniciativa" },
  { emoji: "🧩", t: "Otro perfil", d: "Describe tu perfil y tu solicitud", reg: "otro-perfil" },
  { emoji: "🌟", t: "Pedir mi clave de aliados", d: "Zona de aliados y patrocinadores", reg: "clave" },
  { grupo: "💬 Cuéntanos" },
  { emoji: "🌟", t: "Conocer y compartir más", d: "Invita a tus contactos", accion: "comparte" },
  { emoji: "💬", t: "Sugerencias y quejas", d: "Ayúdanos a mejorar", accion: "sugerencias" }
];
