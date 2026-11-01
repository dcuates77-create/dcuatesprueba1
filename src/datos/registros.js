// =========================================================================
// src/datos/registros.js — REGISTROS PREVIOS (e56)
// Cada proyecto o sección clave que antes mandaba directo a WhatsApp ahora pide primero un registro corto:
//   1) se guarda en tu hoja de Google (pestañas «Mensajes» y «Registros») con un FOLIO,
//   2) te llega un correo de aviso (lo manda el Apps Script),
//   3) la persona ve su folio y puede avisar también por WhatsApp (botón secundario).
// Para AGREGAR un registro nuevo: copia un bloque, cambia la clave (id), el prefijo del folio y los campos.
//   tipo     → columna «Tipo» de «Mensajes» (si es «Alianza» también se llena la pestaña «Alianzas»; «Registro de red» → «Red»)
//   folio    → letras del folio (ej. ECA → ECA-1030-K7Q)
//   campos   → { k, etiqueta, tipo: texto|area|opciones|fecha|hora, opciones, req, ph, max }
//   Nombre y WhatsApp se agregan solos (WhatsApp de 10 dígitos obligatorio).
// =========================================================================
const NOMBRE = { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", req: true, max: 80, ph: "Ej. Ana López" };
const WHATS = { k: "wa", etiqueta: "Tu WhatsApp", campo: "Contacto", req: true, max: 20, ph: "10 dígitos. Ej. 5512345678" };
const ZONA = { k: "zona", etiqueta: "Tu colonia o zona", max: 80, ph: "Ej. Jardines de Morelos" };

const PERM = { k: "perm", pub: "Permiso", etiqueta: "¿Autorizas que publiquemos esto en «Lo que hay hoy», sin tu nombre ni tu teléfono?", tipo: "opciones", opciones: ["Sí, publíquenlo", "No, solo contáctenme"], req: true };

const R = (id, e, titulo, folio, tipo, proyecto, intro, campos, extra = {}) => ({
  id, e, titulo, folio, tipo, proyecto, intro, campos: [NOMBRE, WHATS, ...campos], ...extra,
});

export const REGISTROS = {
  libros: R("libros", "📚", "Préstamo gratuito de libros", "BIB", "Solicitud libros", "La Bibliobici · Libros",
    "Cuéntanos qué libro o material necesitas, o cuál quieres donar o compartir. Te contactamos por WhatsApp.",
    [
      { k: "q", etiqueta: "¿Qué quieres hacer?", tipo: "opciones", opciones: ["Pedir un libro o material", "Donar libros", "Ser voluntario(a)"], req: true },
      { k: "t", pub: "Titulo", etiqueta: "Título, tema o cantidad", ph: "Ej. Libros de primaria / 10 novelas", max: 140, req: true },
      { k: "cuando", etiqueta: "¿Cuándo te queda bien? (día y horario)", max: 100 },
      ZONA,
      { k: "perm", pub: "Permiso", etiqueta: "¿Autorizas que publiquemos esto en «Lo que hay hoy», sin tu nombre ni tu teléfono?", tipo: "opciones", opciones: ["Sí, publíquenlo", "No, solo contáctenme"], req: true },
    ], { seccion: "Libros", wa: "¡Hola DCUATES! Acabo de registrar mi solicitud en La Bibliobici (préstamo de libros)." }),
  ecatepets: R("ecatepets", "🐾", "Ecatepets · bienestar animal", "ECA", "Solicitud Ecatepets", "Ecatepets",
    "Cuéntanos cómo quieres sumarte o qué necesitas para un peludito. Te contactamos por WhatsApp.",
    [
      { k: "q", pub: "Titulo", etiqueta: "¿Qué quieres hacer?", tipo: "opciones", opciones: ["Adoptar", "Dar en adopción", "Hogar temporal", "Donar alimento o insumos", "Ser voluntario(a)", "Otra forma de ayudar"], req: true },
      { k: "d", pub: "Texto", etiqueta: "Cuéntanos más", tipo: "area", max: 400, ph: "Ej. Busco un perro mediano, vivo en casa con patio", req: true },
      ZONA,
      { k: "perm", pub: "Permiso", etiqueta: "¿Autorizas que publiquemos esto en «Lo que hay hoy», sin tu nombre ni tu teléfono?", tipo: "opciones", opciones: ["Sí, publíquenlo", "No, solo contáctenme"], req: true },
    ], { seccion: "Adopciones", wa: "¡Hola DCUATES! Acabo de registrarme en Ecatepets para el bienestar animal." }),
  asesorias: R("asesorias", "🎓", "Asesoría gratuita", "ASE", "Solicitud asesoría", "Asesorías",
    "Dinos qué tipo de orientación necesitas. Es gratuita y te contactamos por WhatsApp.",
    [
      { k: "tipo", etiqueta: "¿Qué tipo de asesoría?", tipo: "opciones", opciones: ["De negocio", "Legal", "Educativa", "Personal", "Otra"], req: true },
      { k: "tema", etiqueta: "¿Sobre qué tema?", tipo: "area", max: 400, req: true },
      { k: "disp", etiqueta: "¿Cuándo te queda bien?", max: 100, ph: "Ej. Sábados por la mañana" },
    ], { wa: "¡Hola DCUATES! Acabo de registrar mi solicitud de asesoría." }),
  asesor: R("asesor", "🎓", "Ser asesor voluntario", "ASV", "Asesor voluntario", "Asesorías · voluntarios",
    "Gracias por querer compartir tus conocimientos. Cuéntanos en qué puedes orientar.",
    [
      { k: "area", etiqueta: "¿En qué área puedes orientar?", max: 140, req: true, ph: "Ej. Contabilidad, derecho familiar, psicología" },
      { k: "disp", etiqueta: "¿Cuándo tienes tiempo?", max: 100 },
    ], { wa: "¡Hola DCUATES! Acabo de registrarme como asesor(a) voluntario(a)." }),
  alianza: R("alianza", "🤝", "Alianza ganar-ganar", "ALI", "Alianza", "Alianzas y negocios",
    "Platiquemos cómo sumar y generar beneficios y apoyos mutuos. Te contactamos por WhatsApp.",
    [
      { k: "neg", etiqueta: "Negocio u organización", max: 100, req: true },
      { k: "of", etiqueta: "¿Qué puedes ofrecer?", tipo: "area", max: 300, req: true },
      { k: "bus", etiqueta: "¿Qué buscas o necesitas?", tipo: "area", max: 300 },
    ], { wa: "¡Hola DCUATES! Acabo de registrar mi interés en una alianza." }),
  circulo: R("circulo", "🤝", "Círculo de Confianza", "CIR", "Registro de red", "Círculo de Confianza",
    "Súmate a los apoyos y beneficios mutuos. Cuéntanos qué aportas y qué necesitas.",
    [
      { k: "of", etiqueta: "¿Qué puedes aportar?", tipo: "area", max: 300, req: true },
      { k: "bus", etiqueta: "¿Qué te hace falta?", tipo: "area", max: 300 },
    ], { perfil: "Círculo de Confianza", wa: "¡Hola DCUATES! Acabo de registrarme en el Círculo de Confianza." }),
  bazar: R("bazar", "🛍️", "Bazares y mercados", "BAZ", "Solicitud bazar", "Bazares y mercados",
    "Cuéntanos qué ofreces para incluirte en los próximos bazares.",
    [
      { k: "of", etiqueta: "¿Qué vendes u ofreces?", max: 160, req: true },
      { k: "fecha", etiqueta: "¿Para qué fecha te interesa?", tipo: "fecha" },
      { k: "mesa", etiqueta: "¿Necesitas mesa o espacio?", tipo: "opciones", opciones: ["Sí", "No"] },
    ], { wa: "¡Hola DCUATES! Acabo de registrarme para participar en un bazar." }),
  bienestar: R("bienestar", "🌿", "Bienestar y recreación", "BIE", "Interés bienestar", "Bienestar y recreación",
    "Dinos qué te interesa y te avisamos de talleres y actividades.",
    [
      { k: "int", etiqueta: "¿Qué te interesa?", tipo: "opciones", opciones: ["Talleres", "Salud", "Deporte", "Cultura", "Recreación"], req: true },
      { k: "quien", etiqueta: "¿Para quién?", tipo: "opciones", opciones: ["Niñez", "Juventud", "Personas adultas", "Personas mayores", "Familia"] },
      { k: "hor", etiqueta: "¿Qué horario te queda mejor?", max: 100 },
    ], { wa: "¡Hola DCUATES! Acabo de registrar mi interés en bienestar y recreación." }),
  noticias: R("noticias", "📰", "Agenda y noticias del barrio", "NOT", "Interés agenda", "Agenda y noticias",
    "Dinos qué actividades quieres sumar o qué temas te interesa recibir.",
    [
      { k: "q", etiqueta: "¿Qué quieres hacer?", tipo: "opciones", opciones: ["Sumar una actividad", "Recibir información"], req: true },
      { k: "d", etiqueta: "Cuéntanos más", tipo: "area", max: 400 },
    ], { wa: "¡Hola DCUATES! Acabo de registrar mi interés en la agenda y noticias del barrio." }),
  reto: R("reto", "⭐", "Propón un reto", "RET", "Propuesta", "Retos",
    "Un reto que nos haga mejores. Cuéntanos tu idea.",
    [{ k: "d", etiqueta: "Tu propuesta de reto", tipo: "area", max: 400, req: true }], { perfil: "Reto", wa: "¡Hola DCUATES! Acabo de enviar una propuesta de reto." }),
  regalo: R("regalo", "🎁", "Propón un regalo", "REG", "Propuesta", "Regalos",
    "Un regalo que motive a la comunidad. Cuéntanos qué podrías aportar.",
    [{ k: "d", etiqueta: "Tu propuesta de regalo", tipo: "area", max: 400, req: true }], { perfil: "Regalo", wa: "¡Hola DCUATES! Acabo de enviar una propuesta de regalo." }),
  reconocimiento: R("reconocimiento", "🏅", "Propón un reconocimiento", "REC", "Propuesta", "Reconocimientos",
    "¿A quién reconocemos? Cuéntanos por qué inspira.",
    [
      { k: "a", etiqueta: "¿A quién propones?", max: 100, req: true },
      { k: "p", etiqueta: "¿Por qué merece el reconocimiento?", tipo: "area", max: 400, req: true },
      { k: "perm", etiqueta: "¿Esa persona sabe que la propones?", tipo: "opciones", opciones: ["Sí", "No"] },
    ], { perfil: "Reconocimiento", wa: "¡Hola DCUATES! Acabo de proponer a alguien para un reconocimiento." }),
  extraviado: R("extraviado", "🐾", "Reportar un caso", "EXT", "Caso extraviado", "Extraviados",
    "Mascota, persona o cosa extraviada. Si es una persona en peligro, llama primero al 911.",
    [
      { k: "tipo", etiqueta: "¿Qué se extravió?", tipo: "opciones", opciones: ["Mascota", "Persona", "Cosa"], req: true },
      { k: "d", etiqueta: "Descripción (señas, nombre, color…)", tipo: "area", max: 400, req: true },
      { k: "donde", etiqueta: "¿Dónde y cuándo fue la última vez?", max: 160, req: true },
    ], { wa: "¡Hola DCUATES! Acabo de reportar un caso extraviado (urgente).", urgente: true }),
  aportacion: R("aportacion", "💛", "Aportación para causas", "APO", "Aportación", "Causas · aportaciones",
    "Gracias por querer aportar. Te contactamos por WhatsApp para ver cómo hacerlo de forma segura.",
    [
      { k: "tipo", etiqueta: "¿Cómo quieres aportar?", tipo: "opciones", opciones: ["Económica", "En especie", "Trueque solidario", "Labor voluntaria"], req: true },
      { k: "d", etiqueta: "Cuéntanos qué puedes aportar", tipo: "area", max: 400 },
    ], { wa: "¡Hola DCUATES! Acabo de registrar una aportación." }),
  clave: R("clave", "🌟", "Solicitar clave de la Zona de aliados", "CLV", "Solicitud de clave", "Zona de aliados",
    "La clave se entrega solo a quienes ya forman parte de la red. Cuéntanos quién eres.",
    [
      { k: "perfil", etiqueta: "¿Con qué perfil quieres entrar?", tipo: "opciones", opciones: ["Aliado", "Patrocinador", "Voluntario", "Amigo"], req: true },
      { k: "org", etiqueta: "Negocio, organización o a qué te dedicas", max: 120 },
    ], { wa: "¡Hola DCUATES! Acabo de pedir mi clave de la Zona de aliados." }),
  horario: R("horario", "🕒", "Publicar horario de mi negocio", "HOR", "Horario de negocio", "Agenda · horarios",
    "Dinos el horario para publicarlo en la Agenda.",
    [
      { k: "neg", etiqueta: "Nombre del negocio", max: 100, req: true },
      { k: "hor", etiqueta: "Días y horario", max: 160, req: true, ph: "Ej. Lunes a sábado de 9 a 18 h" },
    ], { wa: "¡Hola DCUATES! Acabo de enviar el horario de mi negocio." }),
  interes: R("interes", "💌", "Recibir información de valor", "INT", "Interés", "Información de valor",
    "Elige los temas y te enviamos información útil por WhatsApp.",
    [{ k: "temas", etiqueta: "Temas que te interesan", tipo: "area", max: 300, req: true }], { wa: "¡Hola DCUATES! Acabo de pedir información de valor." }),
  "otro-perfil": R("otro-perfil", "🧩", "Otro perfil", "OTR", "Otro perfil", "Otro perfil",
    "¿No te ves en ninguna puerta? Descríbenos tu perfil y qué solicitas. Así creamos el camino que te toca.",
    [
      { k: "perfil", etiqueta: "Describe tu perfil", tipo: "area", max: 300, req: true, ph: "Ej. Soy repartidor y conozco todas las calles de la colonia" },
      { k: "sol", etiqueta: "¿Qué solicitas o qué puedes ofrecer?", tipo: "area", max: 400, req: true },
    ], { wa: "¡Hola DCUATES! Acabo de registrar un perfil que no estaba en las puertas." }),
  iniciativa: R("iniciativa", "💡", "Tu iniciativa puede ser un beneficio", "INI", "Iniciativa", "Iniciativas",
    "¿Tienes una idea, proyecto o servicio que pueda beneficiar a la comunidad? Cuéntanosla y vemos cómo sumarla.",
    [
      { k: "ini", etiqueta: "Tu iniciativa", tipo: "area", max: 500, req: true, ph: "Ej. Clases gratis de regularización los sábados" },
      { k: "quien", etiqueta: "¿A quién beneficiaría?", max: 160 },
      { k: "nec", etiqueta: "¿Qué necesitas para lograrla?", tipo: "area", max: 300 },
    ], { wa: "¡Hola DCUATES! Acabo de enviar una iniciativa que puede ser un beneficio." }),
  // e57 — TABLÓN «Lo que hay hoy»: OFREZCO / NECESITO (se publican desde la hoja, con permiso) y «Me interesa» (contacto a través de DCUATES)
  ofrezco: R("ofrezco", "🎁", "Ofrezco", "OFR", "Ofrezco", "Tablón · Ofrezco",
    "Algo que puedes dar, prestar, vender con causa o hacer por alguien. Lo revisamos y, si lo autorizas, lo publicamos sin tu nombre ni tu teléfono.",
    [
      { k: "cat", pub: "Categoria", etiqueta: "¿Qué ofreces?", tipo: "opciones", opciones: ["Producto", "Servicio", "Ayuda o voluntariado", "Libros", "Mascota", "Otro"], req: true },
      { k: "tit", pub: "Titulo", etiqueta: "Título corto", max: 80, req: true, ph: "Ej. Regalo cuna en buen estado" },
      { k: "d", pub: "Texto", etiqueta: "Cuéntanos más", tipo: "area", max: 300, req: true, ph: "Estado, cantidad, horarios, condiciones…" },
      ZONA,
      PERM,
    ], { seccion: "Ofrezco", wa: "¡Hola DCUATES! Acabo de registrar algo que ofrezco." }),
  necesito: R("necesito", "🙏", "Necesito", "NEC", "Necesito", "Tablón · Necesito",
    "Algo que te hace falta: una cosa, un servicio, una recomendación o una mano. Lo revisamos y, si lo autorizas, lo publicamos sin tu nombre ni tu teléfono.",
    [
      { k: "cat", pub: "Categoria", etiqueta: "¿Qué necesitas?", tipo: "opciones", opciones: ["Producto", "Servicio", "Recomendación", "Ayuda o voluntariado", "Libros", "Mascota", "Otro"], req: true },
      { k: "tit", pub: "Titulo", etiqueta: "Título corto", max: 80, req: true, ph: "Ej. Busco silla de ruedas prestada" },
      { k: "d", pub: "Texto", etiqueta: "Cuéntanos más", tipo: "area", max: 300, req: true, ph: "Qué necesitas, para cuándo, en qué zona…" },
      ZONA,
      PERM,
    ], { seccion: "Necesito", wa: "¡Hola DCUATES! Acabo de registrar algo que necesito." }),
  interesa: R("interesa", "🙋", "Me interesa", "MEI", "Me interesa", "Tablón · Me interesa",
    "DCUATES te pone en contacto: avisamos a quien publicó y, si está de acuerdo, le compartimos tu WhatsApp. Tu teléfono no se publica.",
    [
      { k: "ref", etiqueta: "Publicación", max: 160, req: true },
      { k: "msg", etiqueta: "Mensaje (opcional)", tipo: "area", max: 300, ph: "Ej. Me interesa, puedo pasar el sábado" },
    ], { wa: "¡Hola DCUATES! Me interesa una publicación de «Lo que hay hoy»." }),
  "puerta-participar": R("puerta-participar", "🙌", "Quiero participar o proponer algo", "PUE", "Propuesta de puerta", "Puertas",
    "Cuéntanos qué te gustaría hacer o proponer.",
    [{ k: "d", etiqueta: "¿Qué te gustaría hacer o proponer?", tipo: "area", max: 400, req: true }], { wa: "¡Hola DCUATES! Acabo de enviar una propuesta desde una puerta." }),
};
// Nombre de la clave y lista para el REGÍSTRATE Y PARTICIPA
export const idsRegistro = Object.keys(REGISTROS);

// Convierte el título de una opción de aportación («Aportación en Especie») a la opción del formulario («En especie»).
export const opcionAportacion = (t) => {
  const x = String(t || "").toLowerCase();
  if (x.includes("especie")) return "En especie";
  if (x.includes("econ")) return "Económica";
  if (x.includes("trueque")) return "Trueque solidario";
  if (x.includes("labor") || x.includes("volunt")) return "Labor voluntaria";
  return "";
};
