// VISTA DE SECCIONES (e35) — textos y tarjetas de cada pestaña. Edita aquí sin tocar el código.
// Los proyectos de cada sección (Libros, Ecatepets…) salen solos de su categoría y van PRIMERO;
// después van las tarjetas "extras" de abajo.
//   anidada: "qs" | "mision" | "sumar" (Nosotros) · "slot" (contenido de la pestaña) · "fichas" (comercios y mapa) · "portada" (videos/galería)
//   a: acción al tocar → { entrada:1 } abre ENTRADA DCUATES · { acceso:"proyectos" } mapa del sitio · { proy:"id" } ventana de proyecto
//      { zona:"juegos" } ventana de zona · { ir:"id" } baja a una sección · { wa:"texto" } WhatsApp · { bajar:1 } baja a las tarjetas
export const VISTA = {
  nosotros: {
    titulo: "Nosotros",
    texto: "Somos una comunidad que teje confianza, suma voluntades y cosecha logros desde hace más de 19 años.",
    boton: { t: "Conoce cómo participar", a: { entrada: 1 } },
    pregunta: "¿Quiénes somos?",
    intro: "Conoce nuestra historia, lo que nos mueve y cómo puedes sumarte.",
    extras: [
      { ico: "✅", t: "Quiénes somos", d: "Nuestra idea, objetivos y filosofía.", anidada: "qs" },
      { ico: "🎯", t: "Misión y visión", d: "Hacia dónde vamos y por qué.", anidada: "mision" },
      { ico: "🤝", t: "Cómo podemos sumar", d: "Las ventajas de trabajar en comunidad.", anidada: "sumar" },
      { ico: "🚪", t: "Tu entrada a DCUATES", d: "Puertas, Hoy, Regístrate y Explora.", a: { entrada: 1 } },
      { ico: "🗺️", t: "Mapa del sitio", d: "Todos los proyectos en un vistazo.", a: { acceso: "proyectos" } }
    ],
    cta: { t: "¿Quieres sumarte?", d: "Conoce cómo apoyar como voluntario.", a: { ir: "donaciones" } }
  },
  beneficios: {
    titulo: "Beneficios",
    texto: "Ser parte de DCUATES te da más oportunidades: libros, asesorías, bienestar y apoyo para tus mascotas, sin costo.",
    boton: { t: "Conoce todos los beneficios", a: { bajar: 1 } },
    pregunta: "¿Qué beneficios puedes obtener?",
    intro: "En DCUATES, participar también te beneficia. Aquí algunos de los principales:",
    extras: [
      { ico: "📝", t: "Registra tu solicitud", d: "Cuéntanos qué necesitas y te contactamos por WhatsApp.", anidada: "slot" }
    ],
    cta: { t: "Tu iniciativa también puede ser un beneficio", d: "Únete a DCUATES y sé parte del cambio.", a: { entrada: 1 } }
  },
  causas: {
    titulo: "Causas",
    texto: "Proyectos que generan cambio: tu tiempo, tu talento o tus recursos pueden transformar la vida de alguien.",
    boton: { t: "Conoce cómo ayudar", a: { bajar: 1 } },
    pregunta: "¿Cómo puedes ayudar?",
    intro: "Elige la causa que te mueva y descubre cómo sumarte.",
    extras: [
      { ico: "🙏", t: "Apoyo voluntario, donativos y casos", d: "Tu ayuda cambia vidas; reporta o consulta casos.", anidada: "slot" },
      { ico: "🎥", t: "Videos y galería", d: "Lo que tu ayuda ya ha logrado.", anidada: "portada" }
    ],
    cta: { t: "¿Quieres ayudar hoy?", d: "Regístrate como voluntario o donante.", a: { ir: "donaciones" } }
  },
  negocios: {
    titulo: "Negocios",
    texto: "Impulsamos proyectos productivos que generan ingresos, fortalecen comunidades y promueven el desarrollo sostenible.",
    boton: { t: "Conoce nuestros negocios", a: { bajar: 1 } },
    pregunta: "¿Qué ofrecemos?",
    intro: "Apoyamos emprendimientos y negocios locales que comparten nuestros valores y generan un impacto positivo.",
    extras: [
      { ico: "🗺️", t: "Comercios y mapa de la zona", d: "Fichas, cupones, aliados, agenda y mapa.", anidada: "fichas" },
      { ico: "🛍️", t: "Ventas con causa y publicidad", d: "Compra, vende y registra tu negocio gratis.", anidada: "slot" }
    ],
    cta: { t: "¿Tienes un negocio o emprendimiento?", d: "Únete a nuestra red de negocios comunitarios.", a: { zona: "negocio" } }
  },
  valores: {
    titulo: "Valores",
    texto: "Confianza, alianzas y buenas noticias del barrio. Entra y mira cómo los vivimos.",
    boton: { t: "Conoce lo que nos guía", a: { bajar: 1 } },
    pregunta: "¿Qué nos guía?",
    intro: "Los valores que nos unen se ven en lo que hacemos cada día.",
    extras: [
      { ico: "📚", t: "Recursos y recomendaciones", d: "Música, libros, películas, recomendaciones y preguntas.", anidada: "slot" }
    ],
    cta: { t: "Comparte lo que te inspira", d: "Lee y cuenta historias de la comunidad.", a: { proy: "historias-dcuates" } }
  },
  regalos: {
    titulo: "Regalos",
    texto: "Porque todo lo bueno merece ser compartido. Participa en retos y regalos, y envíanos tus propuestas.",
    boton: { t: "Ver retos y regalos", a: { bajar: 1 } },
    pregunta: "¿Qué retos y regalos hay?",
    intro: "Juega, participa y gana mientras sumas a la comunidad.",
    extras: [
      { ico: "🎁", t: "Retos, regalos y reconocimientos", d: "Participa, comparte y envía tus propuestas.", anidada: "slot" },
      { ico: "🎮", t: "Juega y diviértete", d: "Juegos DCUATES y tableros de regalos.", a: { zona: "juegos" } },
      { ico: "🏆", t: "Juega y gana", d: "Retos con premio para la comunidad.", a: { zona: "gana" } }
    ],
    cta: { t: "¿Tienes una idea de reto o regalo?", d: "Cuéntanosla por WhatsApp.", a: { wa: "¡Hola DCUATES! Tengo una propuesta de reto o regalo." } }
  },
  gratitud: {
    titulo: "Gratitud",
    texto: "Reconocemos a quienes hacen el bien en nuestra comunidad. Cuéntanos a quién quieres agradecer.",
    boton: { t: "Conoce los reconocimientos", a: { bajar: 1 } },
    pregunta: "¿A quién agradecemos?",
    intro: "Cada gesto cuenta: aquí damos las gracias.",
    extras: [
      { ico: "🙏", t: "Reconocimientos", d: "Gracias por hacer el bien.", anidada: "slot" },
      { ico: "🤝", t: "Patrocinadores y alianzas", d: "Quienes nos ayudan a crecer.", a: { proy: "patrocinadores-alianzas" } }
    ],
    cta: { t: "Cuéntanos a quién quieres agradecer", d: "Escríbenos por WhatsApp.", a: { wa: "¡Hola DCUATES! Quiero agradecer a alguien de la comunidad." } }
  }
};
