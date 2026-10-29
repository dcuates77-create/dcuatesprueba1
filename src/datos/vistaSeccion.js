// VISTA DE SECCIONES (e35) — textos y tarjetas de cada pestaña. Edita aquí sin tocar el código.
// Los proyectos de cada sección (Libros, Ecatepets…) salen solos de su categoría y van PRIMERO;
// después van las tarjetas "extras" de abajo.
//   anidada: "qs" | "mision" | "sumar" | "manifiesto" (Nosotros) · "slot" (contenido de la pestaña) · "fichas" (comercios y mapa) · "portada" (videos/galería)
//   a: acción al tocar → { entrada:1 } abre ENTRADA DCUATES · { acceso:"proyectos" } mapa del sitio · { proy:"id" } ventana de proyecto
//      { zona:"juegos" } ventana de zona · { invitar:1 } invitar a un vecino por WhatsApp · { compartir:1 } compartir DCUATES (menú del teléfono) · { ir:"id" } baja a una sección · { wa:"texto" } WhatsApp · { bajar:1 } baja a las tarjetas
export const VISTA = {
  nosotros: {
    titulo: "Nosotros",
    portada: "/images/portada-nosotros.webp",
    texto: "Somos una comunidad que teje confianza, suma voluntades y cosecha logros desde hace más de 19 años.",
    boton: { t: "Conoce cómo participar", a: { entrada: 1 } },
    pregunta: "¿Quiénes somos?",
    intro: "Conoce nuestra historia, lo que nos mueve y cómo puedes sumarte.",
    extras: [
      { ico: "✅", t: "Quiénes somos", d: "Nuestra idea, objetivos y filosofía.", anidada: "qs" },
      { ico: "🎯", t: "Misión y visión", d: "Hacia dónde vamos y por qué.", anidada: "mision" },
      { ico: "🤝", t: "Cómo podemos sumar", d: "Las ventajas de trabajar en comunidad.", anidada: "sumar" },
      { ico: "📜", t: "Manifiesto DCUATES", d: "Lo que nos une y nos da identidad y más valor.", anidada: "manifiesto" },
      { ico: "🗺️", t: "Mapa del sitio", d: "Todos los proyectos en un vistazo.", a: { acceso: "proyectos" } }
    ],
    cta: { t: "¿Quieres sumarte?", d: "Conoce cómo apoyar como voluntario.", a: { ir: "donaciones" } },
    sumar: {
      img: "/images/sumar-nosotros.webp",
      titulo: "Tu participación suma",
      texto: "Una comunidad se construye con personas como tú. Hoy puedes dar el primer paso: regístrate, cuéntanos cómo quieres participar y sumemos voluntades.",
      botones: [{ t: "Regístrate o participa", a: { acceso: "registros" } }, { t: "Quiero ser voluntario", a: { ir: "donaciones" } }]
    }
  },
  beneficios: {
    titulo: "Beneficios",
    portada: "/images/portada-beneficios.webp",
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
    portada: "/images/portada-causas.webp",
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
      img: "/images/sumar-causas.webp",
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
    portada: "/images/portada-regalos.webp",
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
  // OCTAVA PESTAÑA «Reservado» (e52): solo administración (?admin=1). Su contenido vive en tu hoja de Google.
  reservado: {
    titulo: "Reservado",
    texto: "Convenios, contratos e información por perfil. Cada elemento tiene su enlace propio para compartir.",
    pregunta: "Área reservada",
    intro: "Solo la administración ve esta pestaña. Toca el índice y escribe tu clave de administrador.",
    extras: [{ ico: "🔐", t: "Índice reservado", d: "Convenios y documentos por perfil, con enlace para compartir.", anidada: "reservado" }]
  },
  // SECCIÓN DE CIERRE — sintetiza y conecta todas las demás. Nombre provisional: "Súmate" (cámbialo en BloqueCentral.jsx → TABS, id "cierre").
  cierre: {
    titulo: "Súmate",
    portada: "/images/portada-cierre.webp",
    texto: "Todo lo que hacemos se une aquí. Tu parte, grande o pequeña, completa la historia.",
    boton: { t: "Elige tu parte", a: { bajar: 1 } },
    pregunta: "Todo lo que hacemos se conecta",
    intro: "Nosotros tejemos confianza, los beneficios llegan a tu puerta, las causas y los valores nos mueven, los emprendimientos multiplican valor, los regalos celebran y la gratitud cierra el círculo. Pero nada de esto existe sin ti.",
    extras: [],
    // MICRO-ACCIONES (e49): cosas pequeñas que cualquiera hace desde el celular. min = minutos que toma. Quita o reordena a tu gusto.
    micro: {
      titulo: "Micro-acciones: suma en pocos minutos",
      intro: "Toca la que puedas hacer ahora. Cada una suma.",
      items: [
        { min: 1, ico: "💚", t: "Invita a un vecino", d: "Le mandas un WhatsApp con la invitación lista.", a: { invitar: 1 } },
        { min: 1, ico: "📣", t: "Comparte DCUATES en tu estado y/o redes sociales", d: "Comparte tus capturas y GANA MAYORES BENEFICIOS MIENTRAS MÁS DIFUSIÓN DCUATES REALICES.", a: { compartir: 1 } },
        { min: 1, ico: "📸", t: "Envíanos tus capturas", d: "Mándanos por WhatsApp la captura de lo que compartiste.", a: { wa: "¡Hola DCUATES! Comparto la captura de mi difusión de DCUATES." } },
        { min: 2, ico: "🙏", t: "Deja un agradecimiento en el Muro", d: "Un gracias que otros vecinos podrán leer.", a: { ir: "muro-gratitud" } },
        { min: 2, ico: "🏪", t: "Registra tu negocio gratis", d: "Aparece en el mapa y en la lista.", a: { ir: "publicidad" } },
        { min: 3, ico: "🌟", t: "Recomienda a quien hace labor social", d: "Un negocio, una organización o una persona que hace labor social en beneficio de nuestra comunidad.", a: { micro: "recomienda" } },
        { min: 5, ico: "🤝", t: "Suma tu negocio a los apoyos mutuos", d: "Si tienes o conoces un negocio que le interese SUMAR y GENERAR BENEFICIOS Y APOYOS MUTUOS Y COMUNITARIOS, contáctanos para platicar y armar los proyectos que nos ayuden a lograr NUESTROS OBJETIVOS PARTICULARES Y CONJUNTOS.", a: { micro: "negocio" } },
        { min: 3, ico: "📚", t: "Dona o presta un libro", d: "Dinos qué libro y lo coordinamos por WhatsApp.", a: { wa: "¡Hola DCUATES! Quiero donar un libro." } },
        { min: 5, ico: "⭐", t: "Cuéntanos tu opinión", d: "Dinos cómo te fue y qué mejorarías.", a: { ir: "opinion-rapida" } },
        // e55: reto de recomendación de confianza, eventos y espacios
        { min: 3, ico: "🔁", t: "Recomienda de confianza y pide dos que necesites", d: "Por cada recomendación de confianza que nos hagas, te damos dos recomendaciones de lo que necesites o te interese.", a: { micro: "dos" } },
        { min: 4, ico: "📅", t: "Propón un evento o actividad", d: "Cuéntanos qué harás y, si lo aprobamos, lo sumamos a la Agenda de la comunidad.", a: { micro: "evento" } },
        { min: 4, ico: "🏛️", t: "Ofrece un espacio para actividades de la red", d: "Café, salón, patio o galería: préstalo para cafés literarios, pláticas, presentaciones o talleres.", a: { micro: "espacio" } },
        { min: 4, ico: "🎤", t: "Busca un espacio para tu actividad", d: "Conferencias, cafés literarios, presentaciones de producto, galería: te conectamos con quien presta.", a: { micro: "usar" } },
        // MICRO-META (e53): una micro-acción para proponer más micro-acciones.
        { min: 3, ico: "💡", meta: true, t: "Micro-meta: sugiere una micro-acción", d: "Si tienes y deseas sugerir o compartir una o más micro-acciones que sean significativas y de APOYO para ti y NUESTRA COMUNIDAD, haznos llegar tu propuesta.", a: { micro: "meta" } }
      ]
    },
    // RETO DEL MES (e49): cámbialo cada mes. El aviso llega por WhatsApp y tú pones el nombre en el Muro (con permiso).
    reto: {
      ico: "🏆",
      titulo: "Reto del mes",
      t: "Por cada RECOMENDACIÓN DE CONFIANZA, solicita dos que necesites",
      d: "Recomienda a una persona, negocio u organización de confianza y, a cambio, te damos dos recomendaciones de lo que necesites o te interese. Es una forma de apoyarnos entre vecinos.",
      botones: [
        { t: "Recomendar y pedir dos", a: { micro: "dos" } },
        { t: "Prefiero hacerlo por WhatsApp", a: { wa: "¡Hola DCUATES! Quiero hacer una recomendación de confianza y pedir dos recomendaciones de lo que necesito." } }
      ]
    },
    extrasFinalTitulo: "Explora las secciones",
    extrasFinal: [
      { ico: "👥", t: "Nosotros", d: "Tejemos confianza y sumamos voluntades.", a: { tab: "nosotros" } },
      { ico: "🎁", t: "Beneficios", d: "Oportunidades que llegan a tu puerta.", a: { tab: "beneficios" } },
      { ico: "❤️", t: "Causas y valores", d: "Ayudar con los valores que nos unen.", a: { tab: "causas" } },
      { ico: "🏪", t: "Emprendimientos que multiplican valor", d: "Compra local y crece en comunidad.", a: { tab: "negocios" } },
      { ico: "🎉", t: "Regalos y gratitud", d: "Compartir también es celebrar y agradecer.", a: { tab: "gratitud" } },
      { ico: "🗺️", t: "Ver todos los proyectos", d: "El mapa del sitio, en un vistazo.", a: { acceso: "proyectos" } }
    ],
    ctaAlFinal: true,
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
