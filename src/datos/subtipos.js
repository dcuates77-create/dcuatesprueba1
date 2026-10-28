// =========================================================================
// src/datos/subtipos.js (e54) — SUBTIPOS por puerta («Soy…») con su protocolo de 3 pasos.
// Es el punto de partida: la pestaña «Perfiles» de tu hoja de Google puede AGREGAR subtipos, cambiar los textos de uno
// existente (misma puerta y mismo nombre de subtipo) o quitarlo (Activo = No). Ver LEEME de la e54.
//   p: puertas donde aparece (ids de puertas.js) · g: grupo · s: subtipo · i: qué le interesa · a: [paso 1, 2, 3]
//   o: qué ofrece DCUATES · e: qué esperamos a cambio · d: datos mínimos que se piden
// =========================================================================
export const SUBTIPOS = [
 {
  "p": [
   "vecino"
  ],
  "g": "Vecino/a",
  "s": "Deportista o activo/a físicamente",
  "i": "Espacios, grupos y eventos para moverse",
  "a": [
   "Regístrate y dinos qué deporte o actividad practicas.",
   "Súmate a un grupo o propón una actividad (caminata, torneo, clase abierta).",
   "Invita a dos vecinos a una actividad y comparte la convocatoria."
  ],
  "o": "Difusión de tu convocatoria y enlace con espacios aliados (canchas, patios).",
  "e": "Cuidar los espacios y avisar si cambias fecha.",
  "d": "Nombre, WhatsApp, actividad, colonia"
 },
 {
  "p": [
   "familia"
  ],
  "g": "Vecino/a",
  "s": "Ama/amo de casa o cuidador/a",
  "i": "Apoyos, talleres, negocios de confianza",
  "a": [
   "Cuéntanos qué sabes hacer y qué te hace falta.",
   "Conoce los talleres, asesorías y negocios aliados que te sirvan.",
   "Recomienda a un vecino o negocio de confianza."
  ],
  "o": "Orientación, talleres y recomendaciones de la red.",
  "e": "Compartir lo que te funcionó.",
  "d": "Nombre, WhatsApp, interés"
 },
 {
  "p": [
   "joven"
  ],
  "g": "Vecino/a",
  "s": "Estudiante",
  "i": "Libros, asesorías, servicio social",
  "a": [
   "Regístrate y elige lo que buscas (libros, asesorías, horas de servicio social).",
   "Usa la Bibliobici o una asesoría, o suma horas como voluntario/a.",
   "Comparte DCUATES en tu escuela o grupo."
  ],
  "o": "Libros, asesorías y constancias de colaboración (según lo que defina DCUATES).",
  "e": "Para menores de edad: permiso de madre, padre o tutor.",
  "d": "Nombre, WhatsApp o de tu tutor/a, escuela (opcional)"
 },
 {
  "p": [
   "vecino"
  ],
  "g": "Vecino/a",
  "s": "Busca empleo",
  "i": "Oportunidades, asesoría, contactos",
  "a": [
   "Regístrate y dinos qué tipo de trabajo buscas (sin datos personales delicados).",
   "Revisa asesorías y oportunidades; ofrece tu oficio o talento en la red.",
   "Recomienda a alguien que busque o dé trabajo."
  ],
  "o": "Difusión de tu oficio (con tu permiso) y enlace con negocios aliados.",
  "e": "No se piden documentos ni identificaciones.",
  "d": "Nombre, WhatsApp, tipo de trabajo que buscas"
 },
 {
  "p": [
   "vecino"
  ],
  "g": "Vecino/a",
  "s": "Empleado/a con poco tiempo",
  "i": "Micro-acciones rápidas",
  "a": [
   "Elige una micro-acción de 1 a 5 minutos.",
   "Hazla y marca que la hiciste.",
   "Comparte una micro-acción con un amigo."
  ],
  "o": "Acciones de pocos minutos que sí suman.",
  "e": "Nada más: cada quien da lo que puede.",
  "d": "Opcional: nombre y WhatsApp"
 },
 {
  "p": [
   "talento"
  ],
  "g": "Vecino/a",
  "s": "Con oficio o talento (arte, costura, cocina, música…)",
  "i": "Mostrar y compartir su talento",
  "a": [
   "Cuéntanos tu oficio o talento.",
   "Aparece en el directorio de talentos (con tu permiso).",
   "Comparte una clase, taller o muestra con la comunidad."
  ],
  "o": "Espacio en Agenda y presentación de tu talento.",
  "e": "Dar un taller o muestra al menos una vez.",
  "d": "Nombre, WhatsApp, talento, permiso para publicar"
 },
 {
  "p": [
   "mayor"
  ],
  "g": "Vecino/a",
  "s": "Persona mayor",
  "i": "Compañía, actividades, contar su experiencia",
  "a": [
   "Pídenos ayuda por WhatsApp o llamada (también puede hacerlo un familiar).",
   "Conoce actividades y apoyos cercanos.",
   "Comparte tu experiencia: un cuento, un oficio, un recuerdo del barrio."
  ],
  "o": "Atención sencilla por WhatsApp o llamada; actividades en espacios aliados.",
  "e": "Solo si quieres: compartir tu historia.",
  "d": "Nombre, teléfono, colonia"
 },
 {
  "p": [
   "joven"
  ],
  "g": "Vecino/a",
  "s": "Joven emprendedor/a o artista",
  "i": "Visibilidad y primeros clientes",
  "a": [
   "Regístrate y cuéntanos qué haces.",
   "Publica tu propuesta gratis en Publicidad Comunitaria.",
   "Conecta con otro joven o negocio para hacer algo juntos."
  ],
  "o": "Difusión gratuita y vínculo con mentores.",
  "e": "Cumplir lo que ofreces.",
  "d": "Nombre, WhatsApp, qué haces"
 },
 {
  "p": [
   "animales"
  ],
  "g": "Vecino/a",
  "s": "Protector/a de animales",
  "i": "Mascotas, adopciones, esterilización",
  "a": [
   "Regístrate y dinos cómo ayudas a los animales.",
   "Súmate a una jornada o publica un caso (adopción, extravío).",
   "Difunde un caso o apadrina a un animal."
  ],
  "o": "Difusión de casos y enlace con Ecatepets.",
  "e": "Cuidar a los animales y avisar cuando se resuelva el caso.",
  "d": "Nombre, WhatsApp, tipo de apoyo"
 },
 {
  "p": [
   "dificil"
  ],
  "g": "Vecino/a",
  "s": "Necesita ayuda ahora",
  "i": "Una respuesta pronta",
  "a": [
   "Cuéntanos qué necesitas en «Solicitar apoyo» (respondemos en máximo 24 h).",
   "Te orientamos o canalizamos con la persona u organización indicada.",
   "Cuando puedas, devuelve con una micro-acción."
  ],
  "o": "Orientación y, si hay, líneas de ayuda.",
  "e": "Nada a cambio para recibir ayuda.",
  "d": "Nombre, WhatsApp, qué necesitas"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Formal con local",
  "i": "Más clientes de la zona",
  "a": [
   "Regístrate gratis en Publicidad Comunitaria.",
   "Arma tu beneficio para la comunidad (cupón, descuento, promoción).",
   "Recomienda a dos negocios o personas de confianza."
  ],
  "o": "Publicidad gratuita, cupones y ficha en el mapa.",
  "e": "Cumplir las promociones que publiques.",
  "d": "Negocio, contacto, WhatsApp, giro, horario"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Informal con local o desde casa",
  "i": "Darse a conocer sin trámites",
  "a": [
   "Regístrate gratis; no pedimos RFC.",
   "Arma tu beneficio y sube un logo o foto.",
   "Recomienda a dos vecinos de confianza."
  ],
  "o": "Publicidad gratuita y ficha en el mapa.",
  "e": "Cumplir lo que ofreces; trato justo.",
  "d": "Negocio, contacto, WhatsApp, giro"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Ambulante, tianguis o mercado",
  "i": "Que te encuentren los días de venta",
  "a": [
   "Regístrate y anota tus días, horarios y punto de venta.",
   "Arma tu beneficio (ej. precio especial «vecino DCUATES»).",
   "Recomienda a otro vendedor de tu tianguis o mercado."
  ],
  "o": "Ficha con días y puntos de venta.",
  "e": "Avisar si cambias de lugar o dejas de vender.",
  "d": "Negocio, WhatsApp, días y lugar"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Vende productos de otros (catálogo, reventa)",
  "i": "Ampliar tu clientela",
  "a": [
   "Regístrate y di qué marcas o productos vendes.",
   "Confirma que tienes permiso para anunciar esas marcas y arma tu beneficio.",
   "Recomienda a un cliente satisfecho."
  ],
  "o": "Publicidad gratuita.",
  "e": "No usar logos ni promesas de marcas sin permiso.",
  "d": "Negocio, WhatsApp, productos o marcas"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Venta por comisión o agente",
  "i": "Clientes de la comunidad",
  "a": [
   "Regístrate y explica qué representas.",
   "Indica cómo contactarte y qué beneficio puedes dar sin engañar al cliente.",
   "Recomienda a una persona de confianza."
  ],
  "o": "Publicidad gratuita.",
  "e": "Decir con claridad a quién representas.",
  "d": "Nombre, WhatsApp, qué representas"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Maquila o producción para otros",
  "i": "Encontrar clientes y alianzas",
  "a": [
   "Regístrate y dinos qué produces y en qué volumen.",
   "Describe tu ventaja (calidad, tiempos, cercanía).",
   "Conecta con un negocio que necesite lo que produces."
  ],
  "o": "Vínculo con negocios aliados y difusión.",
  "e": "Cumplir plazos acordados.",
  "d": "Taller, WhatsApp, qué produces"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Servicios y oficios a domicilio",
  "i": "Clientes cercanos y confianza",
  "a": [
   "Regístrate y dinos qué servicio das y en qué colonias.",
   "Arma tu beneficio (revisión gratis, primer servicio con descuento…).",
   "Recomienda a otro oficio complementario."
  ],
  "o": "Publicidad gratuita y recomendaciones de la red.",
  "e": "Dar presupuesto claro y trato respetuoso.",
  "d": "Nombre, WhatsApp, servicio, zona"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Alimentos y bebidas",
  "i": "Más clientes y fidelidad",
  "a": [
   "Regístrate y comparte tu menú o especialidad.",
   "Arma tu beneficio (combo, 2×1, sello de visitas).",
   "Recomienda a un proveedor o negocio vecino."
  ],
  "o": "Publicidad gratuita y ficha en el mapa.",
  "e": "Cuidar higiene y cumplir tus promociones.",
  "d": "Negocio, WhatsApp, horario, especialidad"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Emprendimiento en línea",
  "i": "Que te encuentren en tu zona",
  "a": [
   "Regístrate y pon el enlace de tus redes.",
   "Arma tu beneficio y di si haces entregas.",
   "Recomienda a otro emprendimiento."
  ],
  "o": "Publicidad gratuita y difusión local.",
  "e": "Responder mensajes y cumplir entregas.",
  "d": "Nombre, WhatsApp, enlace de redes"
 },
 {
  "p": [
   "negocio"
  ],
  "g": "Negocio",
  "s": "Productor/a o artesano/a",
  "i": "Ventas y reconocimiento",
  "a": [
   "Regístrate y cuéntanos cómo lo haces.",
   "Arma tu beneficio y súmate a ferias o bazares de la red.",
   "Recomienda a otro artesano o productor."
  ],
  "o": "Publicidad gratuita y espacios en eventos.",
  "e": "Cumplir lo ofrecido y avisar cuando falte producto.",
  "d": "Nombre, WhatsApp, producto"
 },
 {
  "p": [
   "voluntario"
  ],
  "g": "Voluntario/a",
  "s": "Ocasional",
  "i": "Ayudar sin compromiso largo",
  "a": [
   "Elige una micro-acción o actividad.",
   "Participa en una actividad.",
   "Invita a una persona más."
  ],
  "o": "Reconocimiento y constancia de colaboración (según lo que defina DCUATES).",
  "e": "Puntualidad y buen trato.",
  "d": "Nombre, WhatsApp, disponibilidad"
 },
 {
  "p": [
   "voluntario"
  ],
  "g": "Voluntario/a",
  "s": "Con profesión (orientación)",
  "i": "Compartir conocimiento",
  "a": [
   "Dinos tu profesión y cuántas horas puedes dar.",
   "Da una asesoría u orientación general.",
   "Recomienda a otro profesional."
  ],
  "o": "Espacio para orientar a la comunidad.",
  "e": "Orientación general: no sustituye un servicio profesional.",
  "d": "Nombre, WhatsApp, profesión, horas"
 },
 {
  "p": [
   "voluntario"
  ],
  "g": "Voluntario/a",
  "s": "Causa animal",
  "i": "Ayudar a los animales",
  "a": [
   "Regístrate y elige cómo ayudas (traslados, casa temporal, difusión).",
   "Súmate a una jornada.",
   "Difunde un caso."
  ],
  "o": "Coordinación con Ecatepets.",
  "e": "Cuidado responsable.",
  "d": "Nombre, WhatsApp, tipo de ayuda"
 },
 {
  "p": [
   "voluntario"
  ],
  "g": "Voluntario/a",
  "s": "Joven o servicio social",
  "i": "Horas y experiencia",
  "a": [
   "Regístrate (menores: con permiso de madre, padre o tutor).",
   "Participa en una actividad acordada.",
   "Cuenta tu experiencia o invita a un compañero."
  ],
  "o": "Constancia de colaboración (según lo que defina DCUATES).",
  "e": "Cumplir horarios acordados.",
  "d": "Nombre, escuela (opcional), contacto"
 },
 {
  "p": [
   "organizacion"
  ],
  "g": "Organización o institución",
  "s": "Organización civil o colectivo",
  "i": "Sumar esfuerzos",
  "a": [
   "Preséntate: quiénes son y qué hacen.",
   "Plática con DCUATES para acordar cómo colaborar.",
   "Firmen un acuerdo sencillo y registren actividades en la Agenda."
  ],
  "o": "Difusión, Agenda y alianzas.",
  "e": "Información veraz y respeto a la comunidad.",
  "d": "Organización, contacto, qué hacen"
 },
 {
  "p": [
   "organizacion"
  ],
  "g": "Organización o institución",
  "s": "Escuela o biblioteca",
  "i": "Actividades y lectura",
  "a": [
   "Preséntate y dinos qué actividad quieren.",
   "Acuerden fecha, lugar y quién coordina.",
   "Registren la actividad en la Agenda y compartan resultados."
  ],
  "o": "Libros, talleres y Agenda.",
  "e": "Permisos de madres, padres o tutores cuando haya menores.",
  "d": "Escuela, responsable, contacto"
 },
 {
  "p": [
   "organizacion"
  ],
  "g": "Organización o institución",
  "s": "Institución pública o dependencia",
  "i": "Servicios para vecinos",
  "a": [
   "Preséntate y comparte qué servicios ofrecen.",
   "Acuerden cómo difundir sin duplicar información.",
   "Mantener actualizada su información en la Agenda."
  ],
  "o": "Difusión local gratuita.",
  "e": "Información oficial y actualizada.",
  "d": "Dependencia, responsable, contacto"
 },
 {
  "p": [
   "patrocinador"
  ],
  "g": "Patrocinador o aliado",
  "s": "Patrocinador o donante",
  "i": "Apoyar una causa o proyecto",
  "a": [
   "Conoce los niveles de apoyo.",
   "Plática para elegir una causa o proyecto.",
   "Acuerdo y reconocimiento público (con tu permiso)."
  ],
  "o": "Reconocimiento, informes y ficha de patrocinio.",
  "e": "Cumplir el apoyo acordado.",
  "d": "Nombre, contacto, tipo de apoyo"
 },
 {
  "p": [
   "patrocinador"
  ],
  "g": "Patrocinador o aliado",
  "s": "Medio o comunicador",
  "i": "Difundir historias de la comunidad",
  "a": [
   "Preséntate y comparte tu alcance.",
   "Recibe el kit de prensa.",
   "Publica y comparte tus notas con DCUATES."
  ],
  "o": "Kit de prensa e información veraz.",
  "e": "Dar crédito y respetar permisos de imagen.",
  "d": "Medio, contacto"
 },
 {
  "p": [
   "patrocinador"
  ],
  "g": "Patrocinador o aliado",
  "s": "Mentor o colaborador",
  "i": "Acompañar a emprendedores y jóvenes",
  "a": [
   "Preséntate y di en qué puedes acompañar.",
   "Elige a quién acompañar.",
   "Comparte lo aprendido."
  ],
  "o": "Guía de mentoría y espacio de encuentro.",
  "e": "Confidencialidad básica y buen trato.",
  "d": "Nombre, contacto, área"
 },
 {
  "p": [
   "negocio",
   "organizacion"
  ],
  "g": "Anfitrión de espacio",
  "s": "Café o local comercial",
  "i": "Atraer visitantes con actividades",
  "a": [
   "Dinos qué días y horarios puedes prestar el espacio.",
   "Elige qué actividades permites (café literario, plática, exposición).",
   "Acuerden la fecha y el responsable."
  ],
  "o": "Difusión de tus eventos y de tu local.",
  "e": "Cuidar el espacio y las condiciones acordadas.",
  "d": "Nombre, contacto, capacidad, horarios"
 },
 {
  "p": [
   "organizacion"
  ],
  "g": "Anfitrión de espacio",
  "s": "Salón o centro comunitario, escuela, iglesia",
  "i": "Uso comunitario del espacio",
  "a": [
   "Dinos capacidad, horarios y reglas.",
   "Revisen el acuerdo de una página.",
   "Publiquen la actividad en la Agenda."
  ],
  "o": "Difusión y coordinación de actividades.",
  "e": "Cumplir reglas de seguridad y aforo.",
  "d": "Responsable, contacto, capacidad"
 },
 {
  "p": [
   "vecino"
  ],
  "g": "Anfitrión de espacio",
  "s": "Casa o patio (reuniones pequeñas)",
  "i": "Reuniones y círculos de lectura",
  "a": [
   "Dinos cuántas personas caben y cuándo.",
   "Acuerda una actividad pequeña de prueba.",
   "Evalúen juntos cómo salió."
  ],
  "o": "Difusión entre vecinos de confianza.",
  "e": "Dirección solo con tu permiso.",
  "d": "Nombre, contacto, capacidad"
 }
];
