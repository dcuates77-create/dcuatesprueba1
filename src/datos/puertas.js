// =========================================================================
// src/datos/puertas.js — PUERTAS (perfiles) de entrada a DCUATES. Todo editable aquí.
// Cada puerta: id, e (emoji), t (texto del botón), c (color), titulo (ventana), intro, modos[].
// Cada modo: n (texto del interruptor; null si no hay), intro, pasos (4: [emoji, TÍTULO, detalle, acción]),
//            grupos [[titulo, [[texto, acción, color?]]]], desarrollo (ideas "en desarrollo").
// Acciones: {p:"id"} proyecto · {z:"zona"} · {serv:1} · {logros:1} · {acc:"registros|beneficios|mapa"} ·
//           {aliados:1} · {chat:"mensaje"} WhatsApp a DCUATES · {wa:"mensaje"} compartir · {scroll:"id"}
// sensible:true → no se recuerda la elección ni se registra nada (privacidad).
// =========================================================================
const INV = "¡Hola! Te comparto DCUATES, una comunidad de apoyo mutuo con libros, asesorías, mascotas, cupones y más: dcuates.com 💛";
const DES = (t, d) => ["🚧", t, d];
const MAS = { chat: "¡Hola DCUATES! Me gustaría participar o proponer algo para esta idea en desarrollo: ___" };

export const PUERTAS = [
  {
    id: "vecino", e: "🏘️", t: "Soy vecino o vecina", c: "#2E9E5B", titulo: "Soy vecino o vecina",
    intro: "Aquí lo vecinal es lo primero: pide lo que necesites o suma lo que puedas dar. Todo es de apoyo mutuo. 💛",
    modos: [
      { n: "🙏 Necesito algo", pasos: [
        ["📝", "CUÉNTANOS", "Dinos qué necesitas", { chat: "¡Hola DCUATES! Soy vecino(a) y necesito: ___ · Mi colonia es: ___" }],
        ["🔎", "ENCUENTRA", "Libros, asesorías y apoyos", { acc: "beneficios" }],
        ["🤝", "RECIBE", "Con confianza y respeto", { p: "circulo-confianza" }],
        ["🌱", "AGRADECE Y SUMA", "Devuelve algo cuando puedas", { acc: "registros" }]],
        grupos: [["Lo que puedes pedir", [["📚 Un libro prestado", { p: "libros" }], ["🎓 Una asesoría gratuita", { p: "asesorias" }], ["🏷️ Cupones y promociones", { p: "cupones-promos" }], ["🔎 Algo o alguien extraviado", { p: "extraviados-registro" }], ["📝 Registrar una solicitud", { acc: "registros" }]]]] },
      { n: "💛 Quiero sumar", pasos: [
        ["👋", "CONÓCENOS", "Empieza con un clic", { z: "empieza" }],
        ["📚", "COMPARTE", "Presta un libro o un saber", { p: "libros" }],
        ["🙋", "ACOMPAÑA", "Da un poco de tu tiempo", { p: "donaciones" }],
        ["📲", "INVITA", "Suma a un vecino", { wa: INV }]],
        grupos: [["Formas de sumar", [["📚 Prestar libros", { p: "libros" }], ["🎓 Enseñar lo que sé", { p: "asesorias" }], ["🙋 Ser voluntario(a)", { p: "donaciones" }], ["🧺 Participar en un bazar", { p: "bazares" }], ["🤝 Círculo de Confianza", { p: "circulo-confianza" }]]]] }
    ]
  },
  {
    id: "cliente", e: "🛒", t: "Soy cliente", c: "#F07A1A", titulo: "Soy cliente",
    intro: "Comprar local también es apoyar: encuentra beneficios cerca de ti y ayuda a mejorar los negocios con tu opinión.",
    modos: [
      { n: "🎁 Busco beneficios", pasos: [
        ["🗺️", "EXPLORA", "Negocios cerca de ti", { acc: "mapa" }],
        ["🏷️", "APROVECHA", "Cupones y promos", { p: "cupones-promos" }],
        ["🛍️", "COMPRA CON CAUSA", "Tu compra apoya", { p: "ventas-con-causa" }],
        ["💼", "DESCUBRE MÁS", "Servicios y promos especiales", { serv: 1 }]],
        grupos: [["Beneficios y oportunidades", [["🏷️ Cupones y promociones", { p: "cupones-promos" }], ["🛍️ Ventas con causa", { p: "ventas-con-causa" }], ["🗺️ Mapa de negocios", { acc: "mapa" }], ["🧺 Bazares", { p: "bazares" }], ["💼 Servicios y promociones especiales", { serv: 1 }]]]] },
      { n: "👍 Recomiendo y opino", pasos: [
        ["🛒", "VISITA", "Compra en el barrio", { acc: "mapa" }],
        ["👍", "RECOMIENDA", "Cuenta tu buena experiencia", { p: "recomienda-evalua-gana" }],
        ["💬", "RETROALIMENTA", "Sugiere cómo mejorar", { chat: "¡Hola DCUATES! Quiero dar una retroalimentación amable sobre un negocio: ___" }],
        ["🏆", "GANA", "Semillas y premios", { z: "gana" }]],
        grupos: [["Ayuda a mejorar", [["👍 Recomendar y evaluar", { p: "recomienda-evalua-gana" }], ["🏆 Ganar Semillas", { z: "gana" }], ["📣 Invitar a un negocio a sumarse", { wa: "¡Hola! Te invito a anunciar tu negocio gratis en DCUATES: dcuates.com 📣" }]]]] }
    ]
  },
  {
    id: "negocio", e: "🏪", t: "Tengo un negocio o quiero vender", c: "#C2410C", titulo: "Tengo un negocio o quiero vender",
    intro: "Tu negocio crece más cuando la comunidad lo conoce. Y si no tienes negocio pero quieres un ingreso complementario, puedes vender lo de nuestra red y apoyar causas al mismo tiempo. 💛",
    modos: [
      { n: "🏪 Mi negocio", pasos: [
        ["📣", "ANÚNCIATE", "Publicidad gratuita", { p: "publicidad-tarjeta" }],
        ["🗺️", "REGÍSTRATE", "Aparece en el mapa", { acc: "registros" }],
        ["🏷️", "ATRAE CLIENTES", "Cupones y promos", { p: "cupones-promos" }],
        ["🤝", "ALÍATE", "Apoyos ganar-ganar", { p: "alianzas-tarjeta" }]],
        grupos: [["Para tu negocio", [["📣 Publicidad gratuita", { p: "publicidad-tarjeta" }], ["🗺️ Registrar mi negocio en el mapa", { acc: "registros" }], ["🏷️ Cupones y promociones", { p: "cupones-promos" }], ["🏪 Alianzas solidarias", { p: "alianzas-tarjeta" }], ["🎓 Asesorías para emprender", { p: "asesorias" }], ["💼 Servicios y promociones especiales", { serv: 1 }], ["📋 Ver la guía completa para negocios", { z: "negocio" }]]]] },
      { n: "🛍️ Quiero vender", vender: true, pasos: [
        ["💭", "¿QUÉ TE GUSTARÍA VENDER?", "Dinos tus ideas", { chat: "¡Hola DCUATES! Me gustaría vender: ___ · Tengo experiencia en: ___" }],
        ["📘", "SOLICITA CATÁLOGOS", "Pídelos por WhatsApp", { chat: "¡Hola DCUATES! Quiero solicitar los catálogos de productos y servicios de la red para vender. Mi nombre es: ___" }],
        ["🛒", "VENDE Y ENTREGA", "Ventas con causa", { p: "ventas-con-causa" }],
        ["💛", "APOYA UNA CAUSA", "Parte de lo que vendes ayuda", { z: "causa" }]],
        grupos: [
          ["💭 ¿Qué te gustaría vender?", [["🧴 Productos de la red", { chat: "¡Hola DCUATES! Me gustaría vender PRODUCTOS de la red. Cuéntenme cómo funciona. Mi nombre es: ___" }], ["💼 Servicios (asesoría, coaching…)", { chat: "¡Hola DCUATES! Me gustaría ofrecer SERVICIOS de la red. Cuéntenme cómo funciona. Mi nombre es: ___" }], ["🧩 Un poco de todo", { chat: "¡Hola DCUATES! Me gustaría vender productos y servicios de la red. Mi nombre es: ___" }], ["✨ Tengo otra idea", { chat: "¡Hola DCUATES! Tengo esta idea para vender con causa: ___" }]]],
          ["📘 Solicita catálogos", [["📲 Pedir los catálogos por WhatsApp", { chat: "¡Hola DCUATES! Quiero solicitar los catálogos de productos y servicios de la red para vender. Mi nombre es: ___" }]]],
          ["🛒 Vende y apoya", [["🛍️ Ver Ventas con causa", { p: "ventas-con-causa" }], ["💛 Elegir la causa que quiero apoyar", { z: "causa" }]]]
        ],
        nota: "💡 Un ingreso complementario que también apoya causas. Reglas claras: comisión, porcentaje para la causa y entrega se te explican por WhatsApp antes de empezar. Pagos solo por transferencia y por el canal oficial; nunca des datos bancarios a desconocidos. (Reglas por confirmar.)" }
    ]
  },
  {
    id: "organizacion", e: "🏛️", t: "Organización o institución solidaria", c: "#7a5ad8", titulo: "Organización o institución solidaria",
    intro: "Personas, colectivos, escuelas e instituciones: juntos llegamos más lejos. Sumar en DCUATES no quita lo que ya haces en otros espacios: lo multiplica.",
    modos: [
      { n: "🤲 Ya sumo en otros espacios", pasos: [
        ["📋", "PRESÉNTATE", "Cuéntanos qué haces", { chat: "¡Hola DCUATES! Somos una organización/institución y ya sumamos en otros espacios. Nos llamamos: ___ · Hacemos: ___" }],
        ["🗺️", "REGÍSTRATE", "Aparece en el mapa", { acc: "registros" }],
        ["📣", "DIFUNDE", "Tus causas y eventos", { p: "noticias" }],
        ["🤝", "ALÍATE", "Proyectos en común", { aliados: 1 }]],
        grupos: [["Para tu organización", [["📰 Difundir una causa o evento", { p: "noticias" }], ["📅 Reuniones y agenda", { z: "info:agenda" }], ["🌟 Ser aliada de DCUATES", { aliados: 1 }], ["🏆 Ver nuestros logros", { logros: 1 }]]]] },
      { n: "🌱 Quiero empezar a sumar", pasos: [
        ["👋", "CONÓCENOS", "Lo que ya hacemos", { logros: 1 }],
        ["🙋", "PRUEBA", "Voluntariado de una jornada", { p: "donaciones" }],
        ["💬", "PLATICA", "Cuéntanos tu idea", { chat: "¡Hola DCUATES! Nos gustaría empezar a sumar como organización/institución. Nos interesa: ___" }],
        ["🌟", "CRECE", "Alianza solidaria", { aliados: 1 }]],
        grupos: [["Primeros pasos", [["🏆 Mira lo que hemos logrado", { logros: 1 }], ["🙋 Voluntariado", { p: "donaciones" }], ["🎁 Apoyar una causa", { z: "causa" }]]]] }
    ]
  },
  {
    id: "patrocinador", e: "🌟", t: "Patrocinador, aliado o amigo", c: "#B7791F", titulo: "Patrocinador, aliado o amigo",
    intro: "Tu apoyo, grande o pequeño, mueve cosas reales: libros, asesorías, mascotas y causas. Gracias por estar. 🌟",
    modos: [
      { n: "💛 Ya sumo", pasos: [
        ["🙏", "GRACIAS", "Mira lo que juntos logramos", { logros: 1 }],
        ["🌟", "TU ESPACIO", "Aliados y patrocinadores", { aliados: 1 }],
        ["📣", "DIFUNDE", "Cuenta tu alianza", { wa: INV }],
        ["🚀", "SUMA MÁS", "Una nueva forma de apoyar", { chat: "¡Hola DCUATES! Ya apoyo y me gustaría sumar de otra forma: ___" }]],
        grupos: [["Tu alianza", [["🌟 Espacio de aliados", { aliados: 1 }], ["🏆 Nuestros logros", { logros: 1 }], ["🌟 Patrocinios y alianzas", { p: "patrocinadores-alianzas", }]]]] },
      { n: "🚀 Quiero y puedo sumar", pasos: [
        ["👀", "CONOCE", "Qué se logra con tu apoyo", { logros: 1 }],
        ["💬", "PLATICA", "Cuéntanos cómo quieres apoyar", { chat: "¡Hola DCUATES! Quiero y puedo sumar como patrocinador/aliado/amigo. Me interesa: ___" }],
        ["🤝", "ELIGE", "Alianza o patrocinio", { p: "patrocinadores-alianzas" }],
        ["🌟", "SÉ VISIBLE", "Reconocimiento solidario", { aliados: 1 }]],
        grupos: [["Cómo puedes sumar", [["🌟 Patrocinar o aliarme", { p: "patrocinadores-alianzas" }], ["🎁 Apoyar una causa", { z: "causa" }], ["💼 Servicios y promociones especiales", { serv: 1 }]]]] }
    ]
  },
  {
    id: "voluntario", e: "🙋", t: "Voluntario o donador", c: "#334155", titulo: "Voluntario o donador",
    intro: "Tu tiempo, tus manos o un donativo se convierten en apoyo para alguien de tu comunidad. Elige como quieras sumar. 💛",
    modos: [{ n: null, pasos: [
      ["🔎", "ELIGE", "Dónde hace falta", { p: "noticias" }],
      ["🙋", "DA TU TIEMPO", "Voluntariado", { p: "donaciones" }],
      ["🎁", "DONA", "Con causa y claridad", { z: "causa" }],
      ["📲", "INVITA", "Suma a otra persona", { wa: INV }]],
      grupos: [["Voluntariado", [["🙋 Quiero ser voluntario(a)", { p: "donaciones" }], ["🐾 Ayudar a peluditos", { p: "ecatepets" }]]], ["Donativos", [["🎁 Quiero donar o ayudar", { z: "causa" }], ["📚 Donar libros", { p: "libros" }], ["🧺 Dar o recibir en bazares", { p: "bazares" }]]]],
      desarrollo: [DES("Bolsa de voluntariado por habilidades", "Elegir cómo ayudar según lo que sabes hacer."), DES("Jornadas comunitarias del mes", "Calendario de faenas y colectas.")] }]
  },
  {
    id: "discapacidad", e: "♿", t: "Con discapacidad o cuidador(a)", c: "#0E7490", sensible: true, titulo: "Con discapacidad o cuidadores",
    intro: "Para personas con alguna discapacidad y para quienes las cuidan. No te pedimos datos ni diagnósticos: tú decides qué contarnos. Aquí hay orientación, compañía y una comunidad que escucha. 💛",
    modos: [{ n: null, pasos: [
      ["👋", "CONÓCENOS", "Un espacio sin prisa", { z: "empieza" }],
      ["💬", "PLATÍCANOS", "Qué te ayudaría", { chat: "¡Hola DCUATES! Me gustaría orientación o apoyo. Prefiero que me contacten por: ___" }],
      ["🤝", "CONECTA", "Personas de confianza", { p: "circulo-confianza" }],
      ["🌟", "PARTICIPA", "Con tus talentos y tu voz", { acc: "registros" }]],
      grupos: [["Lo que ya hay", [["🤝 Círculo de Confianza", { p: "circulo-confianza" }], ["🎓 Asesorías y orientación", { p: "asesorias" }], ["🧘 Bienestar y recreación", { p: "bienestar" }], ["📚 Libros y lectura", { p: "libros" }]]], ["Si cuidas a alguien", [["💬 Hablar con alguien de DCUATES", { chat: "¡Hola DCUATES! Cuido a una persona y me gustaría orientación o compañía." }], ["🧘 Un respiro para ti", { p: "bienestar" }]]]],
      desarrollo: [DES("Ruta de lugares y negocios accesibles", "Un mapa colaborativo con rampas, baños y trato incluyente."), DES("Red de cuidadores", "Un grupo para compartir experiencias y turnos de respiro."), DES("Talleres y actividades incluyentes", "Propuestas adaptadas, creadas junto con quienes las usan."), DES("Voluntariado de acompañamiento", "Vecinos que ayudan con trámites, traslados o compañía.")],
      aviso: "Este espacio no sustituye atención médica, legal ni de emergencia." }]
  },
  {
    id: "animales", e: "🐾", t: "Amo a los animales", c: "#E5484D", titulo: "Amo a los animales (Ecatepets)",
    intro: "Peluditos y quienes los quieren: adopciones, extravíos y ayuda para animalitos de la comunidad. 🐶🐱",
    modos: [{ n: null, pasos: [
      ["🐾", "CONOCE", "Ecatepets", { p: "ecatepets" }],
      ["🔎", "REPORTA", "Extraviados y encontrados", { p: "extraviados-registro" }],
      ["🏠", "ADOPTA O AYUDA", "Hogar temporal y apoyo", { chat: "¡Hola DCUATES! Quiero ayudar a los animales. Puedo: adoptar / dar hogar temporal / donar / ser voluntario(a)." }],
      ["📲", "COMPARTE", "Difunde casos", { wa: "Te comparto casos de mascotas y peluditos que necesitan ayuda en DCUATES: dcuates.com 🐾" }]],
      grupos: [["Para los peluditos", [["🐾 Ecatepets", { p: "ecatepets" }], ["🔎 Mascotas extraviadas o encontradas", { p: "extraviados-registro" }], ["🎁 Donar alimento o ayuda", { z: "causa" }], ["🙋 Ser voluntario(a)", { p: "donaciones" }]]]],
      desarrollo: [DES("Jornadas de esterilización y vacunación", "Aliados veterinarios y fechas cercanas."), DES("Red de hogares temporales", "Vecinos que dan refugio mientras llega una familia."), DES("Directorio de veterinarias aliadas", "Descuentos y apoyo para casos urgentes."), DES("Paseos y cuidados solidarios", "Voluntarios para acompañar a peluditos de adultos mayores.")] }]
  },
  {
    id: "dificil", e: "🤍", t: "Estoy en una situación difícil, o quiero apoyar a quien lo está", c: "#9D174D", sensible: true, ancha: true, titulo: "Situación difícil · apoyo",
    intro: "Pasar por un momento difícil no es ser menos: es ser humano. Aquí no se piden datos ni se juzga. Puedes pedir apoyo o ayudar a quien lo necesita. 🤍",
    modos: [
      { n: "🤝 Necesito apoyo", pasos: [
        ["💬", "HABLA", "Cuéntanos a tu ritmo", { chat: "¡Hola DCUATES! Estoy pasando por un momento difícil y me gustaría orientación. Prefiero que me escriban por: ___" }],
        ["🔎", "ENCUENTRA", "Apoyos que ya existen", { acc: "beneficios" }],
        ["🤝", "ACÉRCATE", "Personas de confianza", { p: "circulo-confianza" }],
        ["🌱", "AVANZA", "Un paso a la vez", { z: "empieza" }]],
        grupos: [["Apoyos disponibles", [["💬 Escribirle a alguien de DCUATES", { chat: "¡Hola DCUATES! Me gustaría orientación. Prefiero que me escriban por: ___" }], ["📚 Libros y lectura", { p: "libros" }], ["🎓 Asesorías", { p: "asesorias" }], ["🧘 Bienestar y recreación", { p: "bienestar" }], ["🤝 Círculo de Confianza", { p: "circulo-confianza" }]]]],
        aviso: "🚨 Si hay peligro o emergencia, llama al 911. Si necesitas apoyo emocional, la Línea de la Vida atiende al 800 911 2000. DCUATES no sustituye atención médica, psicológica ni legal." },
      { n: "💛 Quiero apoyar", pasos: [
        ["👂", "ESCUCHA", "Sin juzgar ni exponer", { p: "circulo-confianza" }],
        ["🎁", "AYUDA", "Con causa y claridad", { z: "causa" }],
        ["🙋", "ACOMPAÑA", "Con tu tiempo", { p: "donaciones" }],
        ["📲", "INVITA", "Que más personas sepan", { wa: INV }]],
        grupos: [["Formas de apoyar", [["🎁 Quiero donar o ayudar", { z: "causa" }], ["🙋 Ser voluntario(a)", { p: "donaciones" }], ["🤝 Círculo de Confianza", { p: "circulo-confianza" }], ["📰 Ver qué se necesita hoy", { p: "noticias" }]]]],
        aviso: "Cuida la privacidad de quien apoyas: no compartas su nombre ni su situación sin su permiso." }
    ],
    desarrollo: [DES("Directorio de apoyos y servicios gratuitos", "Teléfonos y lugares de ayuda de la zona."), DES("Despensa y red de ayuda solidaria", "Coordinar apoyos entre vecinos con total discreción.")]
  },
  {
    id: "invitado", e: "💌", t: "Me invitaron", c: "#BE185D", efimera: true, titulo: "Me invitaron a DCUATES",
    intro: "¡Bienvenido(a)! Alguien que te quiere bien te invitó a conocer una comunidad de apoyo mutuo: libros, asesorías, mascotas, cupones y mucho más. Sin costo y sin compromiso. 💛",
    modos: [{ n: null, pasos: [
      ["👋", "CONÓCENOS", "Empieza con un clic", { z: "empieza" }],
      ["🏆", "MIRA LO QUE LOGRAMOS", "Resultados reales", { logros: 1 }],
      ["📝", "REGÍSTRATE", "Pide o suma, cuando quieras", { acc: "registros" }],
      ["🙏", "AGRADECE", "Cuéntale a quien te invitó", { wa: "¡Gracias por invitarme a DCUATES! Ya lo conocí y me gustó 💛 dcuates.com" }]],
      grupos: [["Para empezar", [["🎮 Juega y gana Semillas", { z: "juegos" }], ["📚 Pedir un libro prestado", { p: "libros" }], ["🏷️ Ver cupones y promos", { p: "cupones-promos" }], ["🚪 Elegir mi puerta", { elegir: 1 }]]]] }]
  },
  // ---- puertas dentro de «Ver 4 puertas más» ----
  {
    id: "joven", e: "🎓", t: "Joven o estudiante", c: "#1B6F8A", titulo: "Joven o estudiante",
    intro: "Aprender, practicar y crecer con apoyo de la comunidad. Tu energía y tus ideas cuentan. ✨",
    modos: [{ n: null, pasos: [
      ["🎓", "APRENDE", "Asesorías gratuitas", { p: "asesorias" }],
      ["📚", "LEE", "Libros prestados", { p: "libros" }],
      ["🏆", "GANA", "Juega y suma Semillas", { z: "gana" }],
      ["🙋", "PARTICIPA", "Servicio y voluntariado", { p: "donaciones" }]],
      grupos: [["Para ti", [["🎓 Asesorías", { p: "asesorias" }], ["📚 Libros", { p: "libros" }], ["🎮 Juegos y retos", { z: "juegos" }], ["🙋 Voluntariado y servicio social", { p: "donaciones" }]]]],
      desarrollo: [DES("Bolsa de prácticas y primer empleo", "Negocios aliados que abren espacio a jóvenes."), DES("Mentorías entre generaciones", "Emprendedores y vecinos que te acompañan.")] }]
  },
  {
    id: "familia", e: "👨‍👩‍👧", t: "Soy familia", c: "#BE185D", titulo: "Soy familia",
    intro: "Para mamás, papás, abuelos, hijos: actividades, lectura y juegos para disfrutar y crecer en comunidad. 🏡",
    modos: [{ n: null, pasos: [
      ["📚", "LEAN JUNTOS", "Libros para todos", { p: "libros" }],
      ["🎮", "JUEGUEN", "Retos para la familia", { z: "juegos" }],
      ["🧘", "DISFRUTEN", "Bienestar y recreación", { p: "bienestar" }],
      ["🏷️", "AHORREN", "Cupones y promos", { p: "cupones-promos" }]],
      grupos: [["Para la familia", [["📚 Libros", { p: "libros" }], ["🎮 Juegos y retos", { z: "juegos" }], ["🧘 Bienestar y recreación", { p: "bienestar" }], ["🏷️ Cupones", { p: "cupones-promos" }], ["🐾 Peluditos de la familia", { p: "ecatepets" }]]]],
      desarrollo: [DES("Actividades de fin de semana", "Paseos, talleres y juegos para todas las edades."), DES("Red de crianza y cuidados", "Compartir consejos y turnos de apoyo entre familias.")] }]
  },
  {
    id: "mayor", e: "🧓", t: "Adulto mayor o cuidador(a)", c: "#0F766E", titulo: "Adulto mayor o cuidador(a)",
    intro: "Tu experiencia es un tesoro. Aquí hay compañía, actividades y apoyo para ti o para quien cuidas. 💛",
    modos: [{ n: null, pasos: [
      ["👋", "CONÓCENOS", "Sin prisa y sin costo", { z: "empieza" }],
      ["🧘", "DISFRUTA", "Bienestar y recreación", { p: "bienestar" }],
      ["🤝", "ACOMPÁÑATE", "Círculo de Confianza", { p: "circulo-confianza" }],
      ["📖", "COMPARTE", "Tu experiencia y tus historias", { p: "asesorias" }]],
      grupos: [["Para ti", [["🧘 Bienestar y recreación", { p: "bienestar" }], ["📚 Libros", { p: "libros" }], ["🤝 Círculo de Confianza", { p: "circulo-confianza" }], ["💬 Pedir que me llamen", { chat: "¡Hola DCUATES! Me gustaría que me orientaran. Mi nombre es: ___ y prefiero que me llamen por teléfono." }]]]],
      desarrollo: [DES("Compañía y llamadas amigas", "Voluntarios que platican con quien vive solo(a)."), DES("Talleres de memoria y manualidades", "Actividades suaves, en grupo y cerca de casa."), DES("Apoyo con trámites y tecnología", "Jóvenes que ayudan con el celular y papeleos.")] }]
  },
  {
    id: "talento", e: "🎨", t: "Tengo un talento o un proyecto que compartir o construir", c: "#7C3AED", titulo: "Talento o proyecto",
    intro: "Si sabes hacer algo —o sueñas algo— aquí puedes compartirlo, encontrar quién se sume y construirlo en comunidad. 🎨",
    modos: [{ n: null, pasos: [
      ["💡", "CUÉNTANOS", "Tu talento o tu idea", { z: "propon" }],
      ["🤝", "ENCUENTRA", "Personas que se sumen", { p: "circulo-confianza" }],
      ["📣", "MUESTRA", "Dalo a conocer", { p: "noticias" }],
      ["🌱", "CONSTRUYE", "Con aliados y apoyo", { p: "asesorias" }]],
      grupos: [["Para compartir y construir", [["💡 Proponer una idea o proyecto", { z: "propon" }], ["🎓 Enseñar lo que sé", { p: "asesorias" }], ["📣 Dar a conocer lo que hago", { p: "publicidad-tarjeta" }], ["🛍️ Vender con causa", { p: "ventas-con-causa" }]]]],
      desarrollo: [DES("Escaparate de talentos del barrio", "Una vitrina con músicos, artistas, artesanos y más."), DES("Proyectos buscan equipo", "Ideas de la comunidad que necesitan manos y mentes.")] }]
  }
];

export const PUERTAS_BASE = ["vecino", "cliente", "negocio", "organizacion", "patrocinador", "voluntario", "discapacidad", "animales"];
export const PUERTAS_MAS = ["joven", "familia", "mayor", "talento"];
export const puertaPorId = (id) => PUERTAS.find((p) => p.id === id);
