// VISTA DE SECCIONES (e35) — textos y tarjetas de cada pestaña. Edita aquí sin tocar el código.
// Los proyectos de cada sección (Libros, Ecatepets…) salen solos de su categoría y van PRIMERO;
// después van las tarjetas "extras" de abajo.
//   anidada: "qs" | "mision" | "sumar" (Nosotros) · "slot" (contenido de la pestaña) · "fichas" (comercios y mapa) · "portada" (videos/galería)
//   a: acción al tocar → { entrada:1 } abre ENTRADA DCUATES · { acceso:"proyectos" } mapa del sitio · { proy:"id" } ventana de proyecto
//      { zona:"juegos" } ventana de zona · { ir:"id" } baja a una sección · { wa:"texto" } WhatsApp · { bajar:1 } baja a las tarjetas
export const VISTA = {
  nosotros: {
    titulo: "Nosotros",
    portada: "/images/portada-nosotros.jpg",
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
    cta: { t: "¿Quieres sumarte?", d: "Conoce cómo apoyar como voluntario.", a: { ir: "donaciones" } },
    sumar: {
      img: "/images/sumar-nosotros.jpg",
      titulo: "Tu participación suma",
      texto: "Una comunidad se construye con personas como tú. Hoy puedes dar el primer paso: regístrate, cuéntanos cómo quieres participar y sumemos voluntades.",
      botones: [{ t: "Regístrate o participa", a: { acceso: "registros" } }, { t: "Quiero ser voluntario", a: { ir: "donaciones" } }]
    }
  },
  beneficios: {
    titulo: "Beneficios",
    portada: "/images/portada-beneficios.jpg",
    texto: "Ser parte de DCUATES te da más oportunidades: libros, asesorías, bienestar y apoyo para tus mascotas, sin costo.",
    boton: { t: "Conoce todos los beneficios", a: { bajar: 1 } },
    pregunta: "¿Qué beneficios puedes obtener?",
    intro: "En DCUATES, participar también te beneficia. Aquí algunos de los principales:",
    extras: [
      { ico: "📝", t: "Registra tu solicitud", d: "Cuéntanos qué necesitas y te contactamos por WhatsApp.", anidada: "slot" }
    ],
    cta: { t: "Tu iniciativa también puede ser un beneficio", d: "Únete a DCUATES y sé parte del cambio.", a: { entrada: 1 } },
    sumar: {
      img: "/images/sumar-beneficios.jpg",
      titulo: "Tus beneficios también suman",
      texto: "Cada persona que usa y comparte un beneficio hace crecer la red. Pide el tuyo o recomiéndalo a alguien que lo necesite.",
      botones: [{ t: "Registra tu solicitud", a: { ir: "solicitudes" } }, { t: "Regístrate o participa", a: { acceso: "registros" } }]
    }
  },
  causas: {
    titulo: "Causas y valores",
    portada: "/images/portada-causas.jpg",
    texto: "Proyectos que generan cambio, guiados por los valores que nos unen: confianza, solidaridad y gratitud.",
    boton: { t: "Conoce cómo ayudar", a: { bajar: 1 } },
    pregunta: "¿Por qué van juntas las causas y los valores?",
    intro: "Una causa sin valores se queda en buena intención, y los valores sin causa se quedan en palabras. En nuestra comunidad van de la mano: la confianza, la honestidad y la solidaridad que practicamos son las que permiten que cada ayuda llegue a quien la necesita, y cada causa nos hace vivir mejor esos valores.",
    extras: [
      { ico: "🙏", t: "Apoyo voluntario, donativos y casos", d: "Tu ayuda cambia vidas; reporta o consulta casos.", anidada: "slot" },
      { ico: "📚", t: "Recursos y recomendaciones", d: "Música, libros, películas, recomendaciones y preguntas.", anidada: "valores" },
      { ico: "🎥", t: "Videos y galería", d: "Lo que tu ayuda ya ha logrado.", anidada: "portada" }
    ],
    cta: { t: "¿Quieres ayudar hoy?", d: "Regístrate como voluntario o donante.", a: { ir: "donaciones" } },
    sumar: {
      img: "/images/sumar-causas.jpg",
      titulo: "Tu ayuda cambia vidas",
      texto: "Un poco de tu tiempo, talento o recursos puede cambiar la historia de alguien. Elige cómo ayudar y hazlo visible: tu ejemplo invita a otros.",
      botones: [{ t: "Quiero ser voluntario", a: { ir: "donaciones" } }, { t: "Reporta un caso", a: { ir: "extraviados-registro" } }]
    }
  },
  negocios: {
    titulo: "Negocios",
    portada: "/images/portada-negocios.jpg",
    texto: "Emprendimientos que MULTIPLICAN VALOR: generan ingresos, fortalecen comunidades y promueven el desarrollo sostenible.",
    boton: { t: "Conoce nuestros negocios", a: { bajar: 1 } },
    pregunta: "¿Qué ofrecemos?",
    intro: "Apoyamos emprendimientos y negocios locales que comparten nuestros valores y generan un impacto positivo.",
    extras: [
      { ico: "🗺️", t: "Comercios y mapa de la zona", d: "Fichas, cupones, aliados, agenda y mapa.", anidada: "fichas" },
      { ico: "🛍️", t: "Ventas con causa y publicidad", d: "Compra, vende y registra tu negocio gratis.", anidada: "slot" }
    ],
    cta: { t: "¿Tienes un negocio o emprendimiento?", d: "Únete a nuestra red de negocios comunitarios.", a: { zona: "negocio" } },
    sumar: {
      img: "/images/sumar-negocios.jpg",
      titulo: "Tu negocio también suma",
      texto: "Cuando compramos y recomendamos local, el valor se multiplica en el barrio. Registra tu negocio gratis y forma parte de la red.",
      botones: [{ t: "Registra tu negocio", a: { zona: "negocio" } }, { t: "Regístrate o participa", a: { acceso: "registros" } }]
    }
  },
  gratitud: {
    titulo: "Gratitud",
    portada: "/images/portada-regalos.jpg",
    texto: "Retos, regalos y reconocimientos: porque tu apoyo también se celebra. Juega, participa y cuéntanos a quién quieres agradecer.",
    boton: { t: "Ver retos y reconocimientos", a: { bajar: 1 } },
    pregunta: "¿Qué celebramos hoy?",
    intro: "Aquí jugamos, regalamos y damos las gracias: cada gesto cuenta.",
    extras: [
      { ico: "🎁", t: "Retos, regalos y reconocimientos", d: "Participa, comparte y envía tus propuestas.", anidada: "regalos" },
      { ico: "🎮", t: "Juega y diviértete", d: "Juegos DCUATES y tableros de regalos.", a: { zona: "juegos" } },
      { ico: "🏆", t: "Juega y gana", d: "Retos con premio para la comunidad.", a: { zona: "gana" } },
      { ico: "🙏", t: "Reconocimientos", d: "Gracias por hacer el bien.", anidada: "slot" },
      { ico: "💛", t: "Muro de gratitud", d: "Mensajes de la comunidad.", anidada: "muro" },
      { ico: "🤝", t: "Patrocinadores y alianzas", d: "Quienes nos ayudan a crecer.", a: { proy: "patrocinadores-alianzas" } }
    ],
    cta: { t: "Cuéntanos a quién quieres agradecer", d: "Escríbenos por WhatsApp.", a: { wa: "¡Hola DCUATES! Quiero agradecer a alguien de la comunidad." } },
    sumar: {
      img: "/images/sumar-regalos.jpg",
      titulo: "Suma con un reto, un regalo o un gracias",
      texto: "Compartir también es sumar. Propón un reto, regala una sonrisa, reconoce a alguien o patrocina un proyecto.",
      botones: [{ t: "Propón un reto o regalo", a: { wa: "¡Hola DCUATES! Tengo una propuesta de reto o regalo." } }, { t: "Quiero ser patrocinador", a: { proy: "patrocinadores-alianzas" } }]
    }
  },
  // SECCIÓN DE CIERRE — sintetiza y conecta todas las demás. Nombre provisional: "Súmate" (cámbialo en BloqueCentral.jsx → TABS, id "cierre").
  cierre: {
    titulo: "Súmate",
    portada: "/images/portada-cierre.jpg",
    texto: "Todo lo que hacemos se une aquí. Tu parte, grande o pequeña, completa la historia.",
    boton: { t: "Elige tu parte", a: { bajar: 1 } },
    pregunta: "Todo lo que hacemos se conecta",
    intro: "Nosotros tejemos confianza, los beneficios llegan a tu puerta, las causas y los valores nos mueven, los emprendimientos multiplican valor, los regalos celebran y la gratitud cierra el círculo. Pero nada de esto existe sin ti.",
    extras: [
      { ico: "👥", t: "Nosotros", d: "Tejemos confianza y sumamos voluntades.", a: { tab: "nosotros" } },
      { ico: "🎁", t: "Beneficios", d: "Oportunidades que llegan a tu puerta.", a: { tab: "beneficios" } },
      { ico: "❤️", t: "Causas y valores", d: "Ayudar con los valores que nos unen.", a: { tab: "causas" } },
      { ico: "🏪", t: "Emprendimientos que multiplican valor", d: "Compra local y crece en comunidad.", a: { tab: "negocios" } },
      { ico: "🎉", t: "Regalos y gratitud", d: "Compartir también es celebrar y agradecer.", a: { tab: "gratitud" } },
    ],
    accionesTitulo: "Tu parte, hoy",
    acciones: [
      { ico: "🙋", t: "Quiero ser voluntario", a: { ir: "donaciones" }, c: "#2E9E5B" },
      { ico: "💚", t: "Quiero donar", a: { proy: "donaciones" }, c: "#E65100" },
      { ico: "🏪", t: "Tengo un negocio", a: { zona: "negocio" }, c: "#7A5AD8" },
      { ico: "🤝", t: "Necesito apoyo", a: { evento: "dcuates:abrir-apoyo" }, c: "#C2255C" },
      { ico: "📝", t: "Regístrate o participa", a: { acceso: "registros" }, c: "#1B6F8A" },
      { ico: "💛", t: "Para ti", a: { acceso: "beneficios" }, c: "#B7791F" }
    ],
    cta: { t: "Da hoy tu primer paso", d: "Regístrate y cuéntanos cómo quieres sumar.", a: { acceso: "registros" } },
    sumar: {
      img: "/images/sumar-cierre.jpg",
      titulo: "Juntos hacemos comunidad",
      texto: "Mucha gente pequeña, en lugares pequeños, haciendo cosas pequeñas, puede cambiar el mundo. Tú eres parte de esa suma.",
      botones: [{ t: "Quiero participar", a: { acceso: "registros" } }, { t: "Escríbenos por WhatsApp", a: { wa: "¡Hola DCUATES! Quiero sumarme." } }]
    }
  }
};
