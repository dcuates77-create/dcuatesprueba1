import React, { useState, useEffect, useRef } from "react";

// =========================================================================
// 1. CONFIGURACIÓN CENTRALIZADA DE VARIABLES, REDES Y HOJA DE CÁLCULO
// =========================================================================
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxngMxuH03w0rI7AyJHRap9QCVf_Xs5roypGXnnkSGr_22SyfxWAVAiH614r1eGC2DW2g/exec";

// Número de WhatsApp centralizado
const WHATSAPP_NUMERO = "525520696627";

// ID del video de portada en YouTube
const YOUTUBE_VIDEO_ID = "SUnE27QnnyI";

const REDES_SOCIALES = {
  facebook: "https://www.facebook.com/abelzarem/",
  instagram: "https://www.instagram.com/conexionesconcausa/",
  youtube: "http://www.youtube.com/@abelmeraz",
  tiktok: "https://www.tiktok.com/@dcuates"
};

const RECOMENDACIONES_ESTRELLA = {
  dcuates: [
    { nombre: "Facebook DCUATES", enlace: REDES_SOCIALES.facebook },
    { nombre: "Instagram DCUATES", enlace: REDES_SOCIALES.instagram },
    { nombre: "YouTube DCUATES", enlace: REDES_SOCIALES.youtube },
    { nombre: "TikTok DCUATES", enlace: REDES_SOCIALES.tiktok }
  ],
  comunidad: [
    { nombre: "Panadería Café Sol", enlace: "#" },
    { nombre: "Taquería El Sol", enlace: "#" },
    { nombre: "Refugio Animal Ecatepec", enlace: "#" }
  ]
};

const MUSICA_DCUATES_URL = "/audio/musica-dcuates.mp3";

const NAV_LINKS_PRINCIPALES = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#inicio" },
  { label: "Apoyo Voluntario", href: "#donaciones" }
];

const NAV_LINKS_MAS = [
  { label: "Publicidad Gratuita", href: "#publicidad" },
  { label: "Ventas con Causa", href: "#ventas-con-causa" },
  { label: "Alianzas Solidarias", modal: "alianzas-tarjeta" },
  { label: "Apoyo a Causas", href: "#extraviados-registro" },
  { label: "Preguntas Frecuentes", action: "faq" },
  { label: "Sugerencias y Quejas", action: "sugerencias" },
  { label: "Préstamo Gratuito de Libros", modal: "libros" },
  { label: "Ecatepets Mascotas", modal: "ecatepets" },
  { label: "Círculo de Confianza", modal: "circulo-confianza" },
  { label: "Recomienda, Evalúa y Gana", modal: "recomienda-evalua-gana" },
  { label: "Asesorías Gratuitas", modal: "asesorias" },
  { label: "Bazar y Comercio", modal: "bazares" },
  { label: "Noticias de Barrio", modal: "noticias" },
  { label: "Bienestar y Recreación", modal: "bienestar" }
];

function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

function irASeccion(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Función auxiliar para extraer IDs o URLs de Embed de TikTok
function obtenerEmbedUrlTikTok(urlOrId) {
  if (!urlOrId) return null;
  const match = urlOrId.match(/\/video\/(\d+)/);
  const id = match ? match[1] : urlOrId.replace(/\D/g, "");
  return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
}

const TICKER_ITEMS = [
  { tipo: "negocio", nombre: "Taquería El Sol — 20% en tu primera visita", img: "/images/ticker-negocio-1.png", enlace: enlaceWhatsApp("¡Hola! Vi la promoción de Taquería El Sol en DCUATES.") },
  { tipo: "mascota", nombre: "Firulais — en búsqueda por la colonia centro", img: "/images/ticker-mascota-1.png", enlace: "#ecatepets" },
  { tipo: "aviso", texto: "🎉 Bazar comunitario este sábado en la plaza principal, 10am–4pm" },
  { tipo: "momento", nombre: "Entrega de libros de la Bibliobici, agosto 2026", img: "/images/ticker-momento-1.png", enlace: "#libros" },
  { tipo: "negocio", nombre: "Estética Lupita — corte + peinado con descuento", img: "/images/ticker-negocio-2.png", enlace: enlaceWhatsApp("¡Hola! Vi la promoción de Estética Lupita en DCUATES.") },
  { tipo: "mascota", nombre: "Michi — en adopción, ya vacunada y esterilizada", img: "/images/ticker-mascota-2.png", enlace: "#ecatepets" },
  { tipo: "aviso", texto: "📚 Nueva alianza con la papelería del barrio: 10% para vecinos DCUATES" },
  { tipo: "momento", nombre: "Taller de bienestar comunitario, julio 2026", img: "/images/ticker-momento-2.png", enlace: "#bienestar" }
];

const TICKER_ETIQUETAS = {
  negocio: { emoji: "🏪", label: "Negocio Local" },
  mascota: { emoji: "🐾", label: "Ecatepets" },
  aviso: { emoji: "📢", label: "Aviso" },
  momento: { emoji: "📸", label: "Momento DCUATES" },
  frase: { emoji: "💚", label: "DCUATES" }
};

const TICKER_FRASES = [
  { tipo: "frase", texto: "“Nadie es tan rico que no necesite ayuda, ni tan pobre que no pueda ofrecerla.”", enlace: "#quienes-somos" },
  { tipo: "frase", texto: "“Solos avanzamos más rápido; juntos llegamos más lejos.” — Proverbio africano", enlace: "#donaciones" },
  { tipo: "frase", texto: "💚 ¿Ya eres parte de la RED DCUATES? Súmate hoy mismo", enlace: "#donaciones" },
  { tipo: "frase", texto: "“La solidaridad no es un acto de caridad, es un acto de justicia.” — E. Galeano", enlace: "#quienes-somos" },
  { tipo: "frase", texto: "🤝 Comparte tu talento, tiempo o recursos — cada aportación suma", enlace: "#donaciones" },
  { tipo: "frase", texto: "“El bien que haces hoy será olvidado mañana. Haz el bien de todos modos.” — Madre Teresa de Calcuta", enlace: "#quienes-somos" }
];

const INICIATIVAS_PRINCIPALES = [
  {
    id: "libros",
    categoria: "EDUCACIÓN Y DESARROLLO",
    titulo: "LA BIBLIOBICI Y AMIGOS",
    descripcion: "Préstamo gratuito de libros y materiales educativos para el desarrollo personal y social. La lectura que llega hasta tu colonia para fortalecer a la COMUNIDAD.",
    puntos: ["Préstamo sin costo", "Materiales para todas las edades", "Recibimos y hacemos donaciones"],
    textoBoton: "Quiero participar",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa participar en el proyecto de La Bibliobici y Amigos."),
    segundoBoton: {
      titulo: "Ver Libros y Materiales en Préstamo, Trueque, Donación y Más...",
      enlace: "https://whatsapp.com/channel/0029VbE8Mri4Crfe0r8cuj2n"
    }
  },
  {
    id: "ecatepets",
    categoria: "BIENESTAR ANIMAL",
    titulo: "ECATEPETS",
    descripcion: "Apoyo en la búsqueda de mascotas extraviadas, y fomento de la adopción y el cuidado animal responsable en conjunto con los vecinos de DCUATES.",
    puntos: ["Difusión de extravíos", "Adopción responsable", "Cuidado y concientización"],
    textoBoton: "Publicar Extravíos y Adopciones",
    scrollDestino: "extraviados-registro",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Quiero sumarme a la causa de Ecatepets para el bienestar animal."),
    segundoBoton: {
      titulo: "Ver Adopciones, Extraviados y Temas sobre Cuidado Animal",
      enlace: "https://www.whatsapp.com/channel/0029Vb6OjCQGk1FkkmvSzP3S"
    }
  },
  {
    id: "alianzas-tarjeta",
    categoria: "CRECIMIENTO CONJUNTO",
    titulo: "ALIANZAS GANAR-GANAR",
    descripcion: "Emprendedores, organizaciones y particulares que desean hacer sinergia para crecer juntos y robustecer el tejido social de la COMUNIDAD.",
    puntos: ["Colaboración mutua", "Red de contactos", "Impacto comunitario"],
    textoBoton: "Generar alianza",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa generar una alianza ganar-ganar con ustedes."),
    segundoBoton: {
      titulo: "Apoyos y Beneficios para Nuestros Aliados (Con Clave de Acceso)",
      enlace: "https://chat.whatsapp.com/F2Rdvu5ueSlJ0YuDYGi8VL"
    }
  },
  {
    id: "circulo-confianza",
    categoria: "APOYOS Y BENEFICIOS MUTUOS",
    titulo: "CÍRCULO DE CONFIANZA",
    descripcion: "Si eres una persona o negocio TOTALMENTE CONFIABLE que desea SUMAR con perfiles que están en la misma sintonía, o conoces personas o negocios que les gustaría formar parte de nuestro círculo, ¡serán muy BIENVENIDOS!",
    puntos: ["Perfiles verificados por confianza", "Sinergia que multiplica", "Red exclusiva de contactos"],
    textoBoton: "Me interesa sumar",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa sumarme al Círculo de Confianza y sus Apoyos y Beneficios Mutuos."),
    segundoBoton: {
      titulo: "Únete a Nuestra Red de Confianza (Con Clave de Acceso)",
      enlace: "https://chat.whatsapp.com/F2Rdvu5ueSlJ0YuDYGi8VL"
    }
  },
  {
    id: "recomienda-evalua-gana",
    categoria: "CONOCIMIENTOS Y EXPERIENCIAS QUE VALEN",
    titulo: "RECOMIENDA, EVALÚA Y GANA",
    descripcion: "Tus recomendaciones y comentarios sobre las buenas o malas prácticas, acciones y calidad que tienen los negocios con sus productos y servicios, y las personas que están a cargo de estos, APORTAN VALOR Y MERECEN ser RECOMPENSADOS de alguna forma.",
    puntos: ["Recomendaciones con valor real", "Reconocimiento por tu experiencia", "Mejora continua de negocios"],
    textoBoton: "Me interesa colaborar",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa colaborar con Recomienda, Evalúa y Gana compartiendo mi experiencia.")
  },
  {
    id: "publicidad-tarjeta",
    categoria: "APOYOS COMUNITARIOS",
    titulo: "PUBLICIDAD GRATUITA",
    descripcion: "Difunde tu negocio, promociones y servicios de forma gratuita. Con aportación voluntaria ya ayudas a que la plataforma de DCUATES llegue a más familias.",
    puntos: ["Registro gratuito", "Comparte promociones e imágenes", "Más clientes de tu zona"],
    textoBoton: "Publicar mi negocio",
    scrollDestino: "publicidad",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Deseo publicar mi negocio en la plataforma de publicidad comunitaria.")
  }
];

const NUEVOS_PROYECTOS_DATA = [
  {
    id: "asesorias",
    categoria: "DESARROLLO PROFESIONAL",
    titulo: "Asesorías Personales y de Negocios",
    descripcion: "Orientación profesional sin barreras para impulsar tus metas o regularizar tu modelo de negocio de manera efectiva.",
    puntos: ["Asesoría gratuita", "Aportación voluntaria", "Impulso de metas"],
    textoBoton: "Solicitar asesoría",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me gustaría solicitar una asesoría personal o de negocios.")
  },
  {
    id: "bazares",
    categoria: "VENTAS CON CAUSA",
    titulo: "Comercios Físicos y Digitales",
    descripcion: "Ventas caseras y de calle basadas en la confianza mutua para el apoyo de la economía familiar y solidaria.",
    puntos: ["Comercio local seguro", "Barrio de confianza", "Apoyo a causas"],
    textoBoton: "Incluir mi negocio",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Quiero obtener información para participar en los bazares y mercados.")
  },
  {
    id: "noticias",
    categoria: "COMUNICACIÓN COLECTIVA",
    titulo: "Noticias y Agenda Cultural",
    descripcion: "Mantente al día con los eventos culturales, convocatorias comunitarias y acontecimientos sociales de la zona.",
    puntos: ["Eventos culturales", "Convocatorias vecinales", "Acontecimientos sociales"],
    textoBoton: "Sumar Actividades",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa conocer la agenda cultural y las noticias del barrio.")
  },
  {
    id: "bienestar",
    categoria: "SALUD Y ESPARCIMIENTO",
    titulo: "Bienestar, Salud y Recreación",
    descripcion: "Actividades recreativas y talleres enfocados en el desarrollo integral, la salud mental y el esparcimiento familiar.",
    puntos: ["Desarrollo Personal y Social", "Salud Integral", "Disfrute Personal y Social"],
    textoBoton: "Sumar Actividades",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Solicito información sobre los talleres de bienestar, salud y recreación.")
  }
];

const BASEROW_GALLERY_URL = "https://baserow.io/public/gallery/xCYm1NOc3A5wuJC1NeYlVYyVeY_w7O2tQdNRKcDsiyE";

const VENTAS_CON_CAUSA_ITEMS = [
  { id: "vc1", tipo: "Artesanías", nombre: "Bordados hechos a mano", descripcion: "Piezas únicas bordadas por manos locales. Pregunta por diseños personalizados.", img: "/images/ventas-causa-1.png" },
  { id: "vc2", tipo: "Alimentos", nombre: "Pan casero y repostería", descripcion: "Pedidos con un día de anticipación. Ideal para eventos y reuniones.", img: "/images/ventas-causa-2.png" },
  { id: "vc3", tipo: "Servicios", nombre: "Jardinería a domicilio", descripcion: "Poda, mantenimiento y diseño de jardines. Cotización sin costo.", img: "/images/ventas-causa-3.png" },
  { id: "vc4", tipo: "Segunda mano", nombre: "Ropa y accesorios", descripcion: "Prendas en buen estado a precios accesibles. Nuevo inventario cada semana.", img: "/images/ventas-causa-4.png" }
];

const EXTRAVIADOS_ITEMS = [
  { id: "ex1", tipo: "Mascota", nombre: "Firulais", descripcion: "Perrito café, orejas caídas, visto por última vez cerca de la colonia centro.", img: "/images/extraviado-1.png" },
  { id: "ex2", tipo: "Persona", nombre: "Sr. Ramírez", descripcion: "Adulto mayor, salió de casa el martes por la tarde y no ha regresado.", img: "/images/extraviado-2.png" },
  { id: "ex3", tipo: "Cosa", nombre: "Mochila escolar azul", descripcion: "Olvidada en la parada del camión sobre la avenida principal.", img: "/images/extraviado-3.png" },
  { id: "ex4", tipo: "Mascota", nombre: "Michi", descripcion: "Gata blanca con manchas grises, muy asustadiza, extraviada desde el fin de semana.", img: "/images/extraviado-4.png" }
];

const BASEROW_TABLE_ID_VENTAS_CON_CAUSA = "1164149";
const BASEROW_TABLE_ID_EXTRAVIADOS = "1165684";
const BASEROW_TABLE_ID_ENLACES = "1178299";

const NOTICIAS_GALERIA_ITEMS = [
  { id: "not1", tipo: "Evento", nombre: "Feria cultural de agosto", descripcion: "Música en vivo, gastronomía local y actividades para toda la familia en la plaza principal.", img: "/images/noticias-1.png" },
  { id: "not2", tipo: "Convocatoria", nombre: "Taller de muralismo vecinal", descripcion: "Convocatoria abierta para pintar un mural comunitario. Se proporcionan materiales.", img: "/images/noticias-2.png" },
  { id: "not3", tipo: "Aviso", nombre: "Jornada de limpieza del parque", descripcion: "Súmate el próximo sábado a la jornada de limpieza y reforestación del parque de la colonia.", img: "/images/noticias-3.png" }
];

const BIENESTAR_GALERIA_ITEMS = [
  { id: "bien1", tipo: "Taller", nombre: "Yoga al aire libre", descripcion: "Sesiones gratuitas los domingos por la mañana, para todos los niveles.", img: "/images/bienestar-1.png" },
  { id: "bien2", tipo: "Actividad", nombre: "Grupo de caminata vecinal", descripcion: "Caminatas ligeras entre semana para fomentar la actividad física y la convivencia.", img: "/images/bienestar-2.png" },
  { id: "bien3", tipo: "Charla", nombre: "Salud mental y comunidad", descripcion: "Plática abierta sobre bienestar emocional, con espacio para preguntas.", img: "/images/bienestar-3.png" }
];

const HISTORIAS_DCUATES_ITEMS = [
  { id: "hist1", tipo: "Historia", nombre: "El renacer de la Panadería Café Sol", descripcion: "Cómo una alianza vecinal ayudó a reabrir sus puertas después de un momento difícil.", img: "/images/historias-1.png" },
  { id: "hist2", tipo: "Historia", nombre: "De la calle a un hogar: la adopción de Firulais", descripcion: "Una historia de Ecatepets con final feliz gracias a la red de vecinos.", img: "/images/historias-2.png" },
  { id: "hist3", tipo: "Historia", nombre: "Voluntarios que cambian vidas", descripcion: "El testimonio de una familia apoyada por la comunidad DCUATES.", img: "/images/historias-3.png" }
];

const CUPONES_PROMOS_ITEMS = [
  { id: "cup1", tipo: "Cupón", nombre: "20% en tu primera visita — Taquería El Sol", descripcion: "Válido presentando este cupón digital directo desde tu celular.", img: "/images/cupones-1.png" },
  { id: "cup2", tipo: "Promo", nombre: "2x1 en tu primera consulta de asesoría", descripcion: "Cupo limitado — agenda tu lugar directo por WhatsApp.", img: "/images/cupones-2.png" },
  { id: "cup3", tipo: "Promo", nombre: "Descuento en Ventas con Causa", descripcion: "Pregunta por la promoción vigente del mes en el catálogo.", img: "/images/cupones-3.png" }
];

const PATROCINADORES_ALIANZAS_ITEMS = [
  { id: "aliado1", tipo: "Aliado", nombre: "Panadería Café Sol", descripcion: "Aliado fundador de la Bibliobici Móvil DCUATES.", img: "/images/aliados-1.png" },
  { id: "aliado2", tipo: "Patrocinador", nombre: "Refugio Animal Ecatepec", descripcion: "Apoya activamente la difusión de Ecatepets.", img: "/images/aliados-3.png" },
  { id: "aliado3", tipo: "Aliado", nombre: "Conexiones con Causa", descripcion: "Organización impulsora del programa DCUATES.", img: "/images/aliados-3.png" }
];

const GALERIAS_PROYECTOS = {
  noticias: { titulo: "Agenda Cultural — Noticias de Barrio", items: NOTICIAS_GALERIA_ITEMS },
  bienestar: { titulo: "Actividades de Bienestar, Salud y Recreación", items: BIENESTAR_GALERIA_ITEMS }
};

const TODOS_LOS_PROYECTOS = [...INICIATIVAS_PRINCIPALES, ...NUEVOS_PROYECTOS_DATA];

const OPCIONES_APORTACION = [
  { t: "Aportación Económica", d: "Solicita los datos bancarios de manera directa y segura.", m: "¡Hola DCUATES! Deseo realizar una Aportación Económica. ¿Me podrías proporcionar los datos seguros?" },
  { t: "Aportación en Especie", d: "Apoya donando herramientas, materiales o insumos útiles.", m: "¡Hola DCUATES! Quiero realizar una Aportación en Especie. ¿Qué tipo de herramientas o insumos se requieren actualmente?" },
  { t: "Trueque Solidario", d: "Intercambia productos o servicios de valor equivalente.", m: "¡Hola DCUATES! Me interesa el Trueque Solidario. Tengo productos/servicios para intercambiar a favor de la causa." },
  { t: "Labor Voluntaria", d: "Dona tu valioso tiempo y conocimientos para crecer juntos.", m: "¡Hola DCUATES! Quiero sumarme con Labor Voluntaria aportando mi tiempo y conocimientos comunitarios." }
];

const QUIENES_SOMOS = {
  idea: "DCUATES nace como un programa de CONEXIONES CON CAUSA ♥ para conectar a vecinos, negocios y organizaciones de la comunidad, y así generar apoyos y beneficios mutuos reales, todos los días.",
  objetivos: ["Difundir de forma gratuita a negocios, personas y causas de la zona", "Facilitar el acceso a libros, asesorías y bienestar para todas las familias", "Conectar a quien necesita ayuda con quien puede darla, sin barreras", "Fortalecer el tejido social a través de alianzas ganar-ganar", "Apoyar a quienes AYUDAN a AYUDAR MÁS Y MEJOR !!!"],
  filosofia: "Creemos en la CADENA DE VALOR Y DE VALORES: cuando una persona o negocio suma su talento, tiempo o recursos, se multiplica el beneficio para todos. Ninguna aportación es demasiado pequeña.",
  colofon: "AYUDAR A QUIEN LO NECESITA ES UN GUSTO, UN PRIVILEGIO Y UNA BENDICIÓN; AYUDAR A QUIENES AYUDAN ES UNA GRAN BENDICIÓN, Y GENERAR APOYOS MUTUOS ES UNA LLUVIA DE BENDICIONES PARA TODOS !!!",
  firma: "ATTE: CONEXIONES CON CAUSA ♥"
};

const MISION_VISION = {
  mision: "Conectar personas, negocios, causas y organizaciones de la comunidad para generar apoyos y beneficios mutuos reales, todos los días, sin costo y sin barreras.",
  vision: "Ser la red comunitaria de referencia donde cualquier persona o negocio de la zona encuentre, en un solo lugar, difusión gratuita, alianzas confiables y oportunidades de ayudar y ser ayudado.",
  filosofia: "Creemos en LA CADENA DE VALOR Y DE VALORES: cada aportación, por pequeña que parezca, se multiplica cuando se comparte con la comunidad."
};

const COMO_SUMAR = {
  intro: "Si hay algo en lo que podamos APOYAR O SUMAR a tus proyectos, negocios o causas, escríbenos — con gusto vemos cómo conectar esfuerzos.",
  ventajas: "Sumarte a una RED CONFIABLE Y DE VALOR como DCUATES multiplica tu alcance: más ojos ven tu negocio o causa, más manos pueden ayudarte, y toda la comunidad sale ganando.",
  cierre: "Te invitamos a colaborar si hay algún proyecto DCUATES en el que te interese SUMARTE — dinos cuál y platicamos los siguientes pasos."
};

const AVISO_PRIVACIDAD_PARRAFOS = [
  "En cumplimiento con la normativa de protección de datos, DCUATES le informa que los datos recabados en este formulario (Nombre de Negocio, Categoría y Enlaces Digitales) tienen la única y exclusiva finalidad de promover de forma comunitaria y gratuita sus actividades comerciales.",
  "Sus datos no serán vendidos, transferidos ni compartidos con terceros con fines de lucro. Al enviar la información y continuar la interacción en WhatsApp, usted acepta el tratamiento de los mismos para los fines de difusión colectiva estipulados en nuestras iniciativas de Apoyo al Emprendimiento.",
  "Usted puede solicitar la baja, rectificación o eliminación de los datos publicitados en cualquier momento poniéndose en contacto directo mediante nuestros canales oficiales de atención."
];

const FAQ_ITEMS = [
  { pregunta: "¿DCUATES tiene algún costo para participar?", respuesta: "No. Todos los proyectos (libros, publicidad, Ecatepets, asesorías, etc.) son gratuitos. Las aportaciones voluntarias solo ayudan a que la plataforma llegue a más familias." },
  { pregunta: "¿Cómo publico mi negocio o servicio?", respuesta: "Usa el botón \"Publicidad Gratuita\" en la portada, o baja hasta la sección de Publicidad Comunitaria y llena el formulario. También puedes escribirnos directo por WhatsApp." },
  { pregunta: "¿Cómo reporto una mascota, persona o cosa extraviada?", respuesta: "Entra al botón \"Ecatepets\" o a la sección \"Ventas con Causa\" y da clic en \"Reportar un caso por WhatsApp\"; te contactamos directo." },
  { pregunta: "¿Qué pasa con mis datos si lleno un formulario?", respuesta: "Solo se usan para la difusión comunitaria del proyecto que elegiste. Puedes ver el detalle completo en nuestro Aviso de Privacidad, en el pie de página." },
  { pregunta: "¿Cómo puedo apoyar como voluntario o con una donación?", respuesta: "En el botón \"Apoyo Voluntario\" puedes elegir entre aportación económica, en especie, trueque solidario o labor voluntaria — cada opción te conecta directo por WhatsApp." },
  { pregunta: "¿Necesito ser un negocio formal para participar?", respuesta: "No. DCUATES está abierto a negocios formales, informales, personas y organizaciones de la comunidad; lo importante es la intención de sumar y beneficiar a la zona." },
  { pregunta: "¿Cómo me entero de las noticias y actividades nuevas?", respuesta: "Sigue nuestras redes sociales (Facebook, Instagram, YouTube y TikTok) y revisa el botón de \"Noticias de Barrio\" en la portada; ahí publicamos convocatorias y eventos." }
];

const NECESIDADES_GRUPOS = [
  {
    id: "mascotas",
    titulo: "Mascotas",
    colorClaro: "#fbeaf0",
    colorFuerte: "#ed93b1",
    colorTexto: "#4b1528",
    preguntas: [
      { texto: "Perdí a mi mascota", modal: "ecatepets" },
      { texto: "Quiero adoptar una mascota", modal: "ecatepets" },
      { texto: "Rescaté a un peludito y no sé qué hacer", modal: "ecatepets" },
      { texto: "Busco una recomendación de atención veterinaria de confianza (próximamente)", enlace: enlaceWhatsApp("¡Hola DCUATES! Busco una recomendación de atención veterinaria de confianza.") },
      { texto: "Busco accesorios, alimentos o productos de calidad para mi mascota (próximamente)", enlace: enlaceWhatsApp("¡Hola DCUATES! Busco accesorios, alimentos o productos de calidad para mi mascota.") }
    ]
  },
  {
    id: "negocios",
    titulo: "Negocios",
    colorClaro: "#faece7",
    colorFuerte: "#f0997b",
    colorTexto: "#4a1b0c",
    preguntas: [
      { texto: "Tengo un negocio y quiero más clientes de mi zona", modal: "publicidad-tarjeta" },
      { texto: "Quiero anunciar una promoción o evento de mi negocio", modal: "publicidad-tarjeta" },
      { texto: "Busco aliados o proveedores de confianza para crecer", modal: "alianzas-tarjeta" },
      { texto: "Quiero vender o comprar algo de segunda mano de forma segura", modal: "bazares" },
      { texto: "Busco un bazar comunitario donde participar", modal: "bazares" },
      { texto: "Busco un producto o servicio local que también apoye una causa", modal: "ventas-con-causa" },
      { texto: "Quiero vender mi producto o servicio con causa", modal: "ventas-con-causa" },
      { texto: "Busco descuentos en negocios locales", modal: "cupones-promos" },
      { texto: "Mi negocio quiere patrocinar o aliarse con DCUATES", modal: "patrocinadores-alianzas" },
      { texto: "Busco trabajo o quiero ofrecer una vacante (próximamente)", enlace: enlaceWhatsApp("¡Hola DCUATES! Me interesa la futura bolsa de empleo comunitaria.") }
    ]
  },
  {
    id: "apoyos-mutuos",
    titulo: "Beneficios y Apoyos Mutuos",
    colorClaro: "#e1f5ee",
    colorFuerte: "#5dcaa5",
    colorTexto: "#04342c",
    preguntas: [
      { texto: "Busco un libro o material educativo prestado", modal: "libros" },
      { texto: "Tengo libros para donar o intercambiar", modal: "libros" },
      { texto: "Necesito un servicio y quiero una recomendación de confianza", modal: "circulo-confianza" },
      { texto: "Quiero unirme a una red de apoyo mutuo", modal: "circulo-confianza" },
      { texto: "Tuve una experiencia con un negocio y quiero compartirla", modal: "recomienda-evalua-gana" },
      { texto: "Quiero apoyar con dinero, en especie, trueque o mi tiempo", modal: "donaciones" },
      { texto: "Mi familia o yo necesitamos apoyo y no sabemos a quién acudir", modal: "donaciones" },
      { texto: "Quiero avisar o enterarme de algo importante de mi colonia (próximamente)", enlace: enlaceWhatsApp("¡Hola DCUATES! Quiero compartir o enterarme de alertas de mi colonia.") }
    ]
  },
  {
    id: "conocer-mas",
    titulo: "Conocer y Compartir Más",
    colorClaro: "#eeedfe",
    colorFuerte: "#afa9ec",
    colorTexto: "#26215c",
    preguntas: [
      { texto: "Necesito orientación (legal, de negocio, personal)", modal: "asesorias" },
      { texto: "Tengo conocimientos que quiero compartir como asesor voluntario", modal: "asesorias" },
      { texto: "Quiero inspirarme con testimonios reales de la comunidad", modal: "historias-dcuates" },
      { texto: "Tengo una historia que quiero compartir", modal: "historias-dcuates" },
      { texto: "Quiero enterarme de eventos y convocatorias de mi colonia", modal: "noticias" },
      { texto: "Tengo una noticia o evento que quiero compartir", modal: "noticias" },
      { texto: "Busco actividades para mi salud física o mental", modal: "bienestar" },
      { texto: "Quiero organizarme o sumarme a una actividad recreativa comunitaria", modal: "bienestar" }
    ]
  }
];

const INTERESES_BENEFICIOS = [
  "Promociones y negocios locales",
  "Mascotas (adopciones y extravíos)",
  "Noticias y eventos del barrio",
  "Bienestar y actividades comunitarias",
  "Otros Beneficios y Apoyos/Voluntariado"
];

const RETOS_REGALOS_ITEMS = [
  {
    titulo: "RETOS que nos hacen MEJORES !!!",
    icono: "🎯",
    enlace: enlaceWhatsApp("¡Hola DCUATES! Quiero proponer o participar en un Reto que nos haga mejores.")
  },
  {
    titulo: "REGALOS que motivan",
    icono: "🎁",
    enlace: enlaceWhatsApp("¡Hola DCUATES! Tengo una propuesta de Regalo que motive a la comunidad.")
  },
  {
    titulo: "RECONOCIMIENTO a quienes nos INSPIRAN",
    icono: "🏅",
    enlace: enlaceWhatsApp("¡Hola DCUATES! Quiero proponer a alguien para un Reconocimiento que inspira.")
  }
];

// =========================================================================
// 2. COMPONENTE PRINCIPAL (INICIO DEL RENDERIZADO)
// =========================================================================
export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [modalProyecto, setModalProyecto] = useState(null);
  const [modalFormulario, setModalFormulario] = useState(null);
  // Estado para reproducir videos (apoya YouTube y TikTok)
  const [videoEnGrande, setVideoEnGrande] = useState(null);
  const [heroExpandido, setHeroExpandido] = useState(false);
  const [quienesExpandido, setQuienesExpandido] = useState(false);
  const [misionExpandida, setMisionExpandida] = useState(false);
  const [infoAbierta, setInfoAbierta] = useState(null);
  const [registroVentasAbierto, setRegistroVentasAbierto] = useState(false);

  const filasEnlaces = useFilasEnlaces();
  
  // Soporte para videos de YouTube y TikTok desde Baserow
  const videosPortada = paresBaserow(filasEnlaces, "NOMBRE VIDPORT", "VIDPORT", 12)
    .map((v) => {
      const tiktokEmbed = obtenerEmbedUrlTikTok(v.enlace);
      const ytId = idYoutubeDesdeUrl(v.enlace);
      if (tiktokEmbed) {
        return { tipo: "tiktok", url: tiktokEmbed, nombre: v.nombre };
      } else if (ytId) {
        return { tipo: "youtube", id: ytId, nombre: v.nombre };
      }
      return null;
    })
    .filter(Boolean);

  const videosPortadaFinal = videosPortada.length > 0 
    ? videosPortada 
    : [{ tipo: "youtube", id: YOUTUBE_VIDEO_ID, nombre: "Video de presentación DCUATES" }];

  const galeriaRetos = galeriaDesdeColumna(filasEnlaces, "RETOSGALERIA", 10, "Retos");
  const videosRetos = paresBaserow(filasEnlaces, "NOMBRE RETOSVID", "RETOSVID", 8)
    .map((v) => {
      const tiktokEmbed = obtenerEmbedUrlTikTok(v.enlace);
      const ytId = idYoutubeDesdeUrl(v.enlace);
      if (tiktokEmbed) {
        return { tipo: "tiktok", url: tiktokEmbed, nombre: v.nombre };
      } else if (ytId) {
        return { tipo: "youtube", id: ytId, nombre: v.nombre };
      }
      return null;
    })
    .filter(Boolean);

  const recomendacionesDcuates = (() => {
    const desdeBaserow = paresBaserow(filasEnlaces, "Nombre Recocasa", "RECASA", 5);
    return desdeBaserow.length > 0 ? desdeBaserow : RECOMENDACIONES_ESTRELLA.dcuates;
  })();
  const recomendacionesComunidad = (() => {
    const desdeBaserow = paresBaserow(filasEnlaces, "Nombre ReComun", "RECOMUN", 5);
    return desdeBaserow.length > 0 ? desdeBaserow : RECOMENDACIONES_ESTRELLA.comunidad;
  })();

  const musicaLinks = primerosValores(filasEnlaces, "RECMUSIC", 5);
  const librosLinks = primerosValores(filasEnlaces, "RECLIBROS", 5);
  const videosLinks = primerosValores(filasEnlaces, "RECVIDEOSYMAS", 6);

  const apoyoCausaAnimalLinks = primerosValores(filasEnlaces, "APOYO CAUSA ANIMAL", 5);
  const apoyoPersonasExtraviadasLinks = primerosValores(filasEnlaces, "APOYO PERSONAS EXTRAVIADAS", 5);
  const apoyoCosasCasosLinks = primerosValores(filasEnlaces, "APOYO COSAS Y CASOS", 5);
  
  const recomendacionesCompra = paresBaserow(filasEnlaces, "NOMBRE RECOMENDACIONES DE COMPRA", "RECOMENDACIONES DE COMPRA", 5);
  const recomendacionesVenta = paresBaserow(filasEnlaces, "NOMBRE RECOMENDACIONES DE VENTA", "RECOMENDACIONES DE VENTA", 5);
  const compraVentaDcuates = paresBaserow(filasEnlaces, "NOMBRE COMPRA-VENTA DCUATES", "COMPRA-VENTA DCUATES", 5);

  return (
    <div className="min-h-screen bg-[#17472d] font-sans antialiased text-slate-900 selection:bg-emerald-500/30 relative pb-28 sm:pb-24">

      {/* Barra Ticker Inferior Fija */}
      <BarraTicker />

      {/* Botón Flotante Permanente de WhatsApp */}
      <div className="fixed bottom-20 sm:bottom-24 right-6 z-50 flex items-center gap-3">
        <span className="bg-[#25d366] text-white text-[11px] sm:text-sm font-black uppercase tracking-wide px-3 py-2 rounded-full shadow-lg border border-white/30 whitespace-nowrap animate-pulse">
          Dudas y Atención
        </span>
        <a
          href={enlaceWhatsApp("¡Hola DCUATES! Me gustaría más información.")}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#34e372] to-[#128c7e] text-white shadow-[0_10px_20px_rgba(0,0,0,0.35),inset_0_-3px_6px_rgba(0,0,0,0.25),inset_0_3px_4px_rgba(255,255,255,0.4)] transition-all hover:scale-110 active:scale-95 border-2 border-white/40"
          title="Chat de Atención Directa"
        >
          <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-60"></span>
          <svg className="relative z-10 h-7 w-7 fill-current drop-shadow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.729-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.428 1.978 13.96 1.951 12.01 1.951c-5.438 0-9.863 4.374-9.867 9.802 0 1.685.459 3.324 1.333 4.766L2.483 20.3l3.966-.995zM17.15 14.34c-.283-.141-1.674-.824-1.933-.917-.26-.093-.448-.14-.637.142-.188.282-.729.917-.894 1.105-.165.188-.33.212-.613.07a9.23 9.23 0 0 1-2.28-1.401 10.15 10.15 0 0 1-1.579-1.954c-.165-.282-.018-.434.124-.574.127-.127.283-.329.424-.494.141-.165.188-.282.283-.47.094-.188.047-.353-.024-.494-.071-.141-.637-1.53-.873-2.102-.229-.554-.46-.478-.637-.487-.164-.008-.353-.01-.542-.01-.189 0-.495.07-.755.353-.26.282-.99 1.011-.99 2.467 0 1.457 1.06 2.867 1.201 3.056.142.188 2.086 3.178 5.053 4.462.705.305 1.256.488 1.684.624.708.226 1.353.194 1.863.118.568-.085 1.674-.682 1.909-1.34.236-.658.236-1.223.165-1.34-.07-.117-.26-.188-.542-.329z"/>
          </svg>
        </a>
      </div>

      {/* Encabezado + ticker de frases */}
      <div className="sticky top-0 z-40 relative">
        <SiteHeader
          onAbrirFAQ={() => setShowFAQ(true)}
          onAbrirPrivacidad={() => setShowPrivacy(true)}
          onAbrirProyecto={(id) => setModalProyecto(id)}
          onAbrirSugerencias={() => setModalFormulario("sugerencias")}
          onAbrirComparte={() => setModalFormulario("comparte")}
        />
        <TickerFrases />

        <BotonNecesidades
          onAbrirProyecto={(id) => setModalProyecto(id)}
          onAccionEspecial={(accion) => setModalFormulario(accion)}
        />
      </div>

      {/* SECCIÓN PORTADA / HERO */}
      <section id="inicio" className="scroll-mt-48 md:scroll-mt-36 bg-[#e8f5e9] text-[#0f2d1e] py-8 px-4 sm:py-12 md:py-16 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-12 lg:items-stretch">

          {/* Columna izquierda */}
          <div className="lg:col-span-6 flex flex-col gap-4 min-w-0 lg:h-full">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0f2d1e] leading-tight">
                Juntos hacemos una mejor comunidad ⭐ 😊
              </h1>
              <p className={`text-sm sm:text-base text-slate-800 leading-relaxed text-justify font-medium overflow-hidden mt-3 ${heroExpandido ? "max-h-none" : "max-h-[4.9em]"}`}>
                <strong>DCUATES</strong> impulsa proyectos, <strong>PERSONAS, ORGANIZACIONES Y EMPRENDIMIENTOS</strong> que <strong>BENEFICIAN a las FAMILIAS</strong>: <strong>PUBLICIDAD GRATUITA</strong> para tu negocio, préstamo de <strong>LIBROS</strong> y materiales <strong>EDUCATIVOS</strong>, apoyo a <strong>MASCOTAS Y GRUPOS VULNERABLES</strong>, y <strong>ALIANZAS GANAR-GANAR</strong> que generan apoyos y beneficios mutuos y comunitarios. Suma con tu valiosa colaboración o con tu invaluable <strong>APOYO VOLUNTARIO</strong> para lograr nuestros objetivos de forma más efectiva, y forjar <strong>LA CADENA DE VALOR Y DE VALORES</strong> que nos liberará de nuestras limitaciones para ser mejores, Y ASÍ MEJORAR NUESTRO ENTORNO Y NUESTRO MUNDO !!!
              </p>
              <button
                type="button"
                onClick={() => setHeroExpandido((v) => !v)}
                className="text-xs font-black uppercase text-emerald-800 underline underline-offset-2 mt-1"
              >
                {heroExpandido ? "Leer menos" : "Leer más"}
              </button>
            </div>

            {/* QUIÉNES SOMOS */}
            <div id="quienes-somos" className="scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">✅</span> Quiénes Somos
              </span>
              <div className={`overflow-hidden ${quienesExpandido ? "max-h-none" : "max-h-[5.6em]"}`}>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">
                  {QUIENES_SOMOS.idea}
                </p>
                <div className="grid gap-2 text-left pt-3">
                  {QUIENES_SOMOS.objetivos.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-900/40 rounded-xl px-3 py-2">
                      <span className="h-2 w-2 mt-1.5 rounded-full bg-[#00c853] flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase leading-snug">{obj}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/80 italic leading-relaxed pt-3">
                  {QUIENES_SOMOS.filosofia}
                </p>
                <p className="text-sm sm:text-base font-black uppercase text-white bg-[#0f2d1e]/60 border-2 border-emerald-500/40 rounded-2xl py-4 px-4 mt-3 leading-snug">
                  {QUIENES_SOMOS.colofon}
                  <span className="block mt-2 text-emerald-300 tracking-wide">{QUIENES_SOMOS.firma}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuienesExpandido((v) => !v)}
                className="text-xs font-black uppercase text-emerald-300 underline underline-offset-2 mt-2"
              >
                {quienesExpandido ? "Mostrar menos" : "Mostrar más"}
              </button>
            </div>

            {/* NUESTRA MISIÓN */}
            <div className="rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">🎯</span> Nuestra Misión
              </span>
              <div className={`overflow-hidden ${misionExpandida ? "max-h-none" : "max-h-[5.6em]"}`}>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">
                  <strong>Misión:</strong> {MISION_VISION.mision}
                </p>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium pt-2">
                  <strong>Visión:</strong> {MISION_VISION.vision}
                </p>
                <p className="text-xs sm:text-sm text-emerald-200/80 italic leading-relaxed pt-3">
                  <strong className="not-italic">Filosofía:</strong> {MISION_VISION.filosofia}
                </p>
                <p className="text-sm sm:text-base font-black uppercase text-white bg-[#0f2d1e]/60 border-2 border-emerald-500/40 rounded-2xl py-4 px-4 mt-3 leading-snug">
                  Mucha gente pequeña, en lugares pequeños, haciendo cosas pequeñas, puede cambiar el mundo (Eduardo Galeano)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMisionExpandida((v) => !v)}
                className="text-xs font-black uppercase text-emerald-300 underline underline-offset-2 mt-2"
              >
                {misionExpandida ? "Mostrar menos" : "Mostrar más"}
              </button>
            </div>

            {/* CÓMO PODEMOS SUMAR */}
            <div className="rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">🤝</span> Cómo Podemos Sumar
              </span>
              <div>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">{COMO_SUMAR.intro}</p>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium pt-2">{COMO_SUMAR.ventajas}</p>
                <p className="text-sm sm:text-base font-bold text-emerald-100 pt-2">{COMO_SUMAR.cierre}</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setTimeout(() => irASeccion("donaciones"), 50)}
                  className="rounded-lg bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-2 px-3 uppercase tracking-wide text-[11px] sm:text-xs"
                >
                  Ir a Apoyo Voluntario
                </button>
              </div>
            </div>

            {/* Bibliobici */}
            <div className="rounded-2xl overflow-hidden border-4 border-[#0f2d1e]/30 shadow-lg h-56 sm:h-72 lg:h-auto lg:flex-1 bg-[#0f2d1e]/5">
              <img
                src="/images/bibliobici-movil.png"
                alt="Bibliobici Móvil DCUATES en la comunidad"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="p-12 text-center text-[#0f2d1e]/70 font-bold uppercase text-xs tracking-wider bg-emerald-50 h-full flex items-center justify-center">📷 [Espacio para Foto de la Bibliobici]</div>';
                }}
              />
            </div>
          </div>

          {/* Cuadrícula de los 12 botones */}
          <div className="lg:col-span-6">
            <p className="flex items-center justify-center gap-3 text-center text-3xl sm:text-4xl font-black text-[#0f2d1e] uppercase tracking-tight leading-none mb-4">
              <span>⭐</span> Proyectos Comunitarios DCUATES <span>⭐</span>
            </p>
            {(() => {
              const BOTONES_PORTADA = [
                { t: "PRÉSTAMO GRATUITO DE LIBROS", h: "#libros", modal: "libros", img: "/images/bb.png", puntos: ["GRATUITO", "PÍDELO CON UN SOLO CLIC ;)", "SE ACEPTAN DONACIONES DE LIBROS Y MÁS..."] },
                { t: "ECATEPETS MASCOTAS", h: "#ecatepets", modal: "ecatepets", img: "/images/Ecatepets.png", puntos: ["DIFUSIÓN DE EXTRAVÍOS", "ADOPCIÓN RESPONSABLE", "CUIDADO Y CONCIENTIZACIÓN"] },
                { t: "ALIANZAS SOLIDARIAS", h: "#iniciativas", modal: "alianzas-tarjeta", img: "/images/Alianzas.png", puntos: ["COLABORACIÓN MUTUA", "RED DE CONTACTOS", "IMPACTO COMUNITARIO"] },
                { t: "CÍRCULO DE CONFIANZA", h: "#circulo-confianza", modal: "circulo-confianza", img: "/images/Círculo.png", puntos: ["PERFILES VERIFICADOS POR CONFIANZA", "SINERGIA QUE MULTIPLICA", "RED EXCLUSIVA DE CONTACTOS"] },
                { t: "RECOMIENDA, EVALÚA Y GANA", h: "#recomienda-evalua-gana", modal: "recomienda-evalua-gana", img: "/images/Recomienda.png", puntos: ["RECOMENDACIONES CON VALOR REAL", "RECONOCIMIENTO POR TU EXPERIENCIA", "MEJORA CONTINUA DE NEGOCIOS"] },
                { t: "PUBLICIDAD GRATUITA", h: "#publicidad", modal: "publicidad-tarjeta", img: "/images/Publicidad2.png", puntos: ["REGISTRO GRATUITO", "COMPARTE PROMOCIONES E IMÁGENES", "MÁS CLIENTES DE TU ZONA"] },
                { t: "ASESORÍAS GRATUITAS", h: "#asesorias", modal: "asesorias", img: "/images/Asesorías.png", puntos: ["ASESORÍA GRATUITA", "APORTACIÓN VOLUNTARIA", "IMPULSO DE METAS"] },
                { t: "BAZAR Y COMERCIO", h: "#bazares", modal: "bazares", img: "/images/Bazar.png", puntos: ["COMERCIO LOCAL SEGURO", "BARRIO DE CONFIANZA", "APOYO A CAUSAS"] },
                { t: "NOTICIAS DE BARRIO", h: "#noticias", modal: "noticias", img: "/images/Noticias.png", puntos: ["EVENTOS CULTURALES", "CONVOCATORIAS VECINALES", "ACONTECIMIENTOS SOCIALES"] },
                { t: "BIENESTAR Y RECREACIÓN", h: "#bienestar", modal: "bienestar", img: "/images/Bienestar.png", puntos: ["DESARROLLO PERSONAL Y SOCIAL", "SALUD INTEGRAL", "DISFRUTE PERSONAL Y SOCIAL"] },
                { t: "VENTAS CON CAUSA", h: "#ventas-con-causa", modal: "ventas-con-causa", img: "/images/VentasConCausa.png", puntos: ["PRODUCTOS Y SERVICIOS LOCALES", "CATÁLOGO SIEMPRE ACTUALIZADO", "CONTACTO DIRECTO POR WHATSAPP"] },
                { t: "APOYO VOLUNTARIO", h: "#donaciones", modal: "donaciones", img: "/images/ApoyoVoluntario.png", puntos: ["ECONÓMICA, EN ESPECIE O TRUEQUE", "LABOR VOLUNTARIA", "TOTAL TRANSPARENCIA"] }
              ];

              const BotonProyecto = ({ btn }) => (
                <button
                  type="button"
                  onClick={() => setModalProyecto(btn.modal)}
                  className="flex flex-col rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-md transition-all hover:scale-[1.02] overflow-hidden font-heading text-left w-full"
                >
                  <div className="px-2 pt-3 pb-1 text-center border-b border-white/20">
                    <h4 className="uppercase font-black leading-tight text-sm sm:text-base lg:text-lg">
                      {btn.t}
                    </h4>
                  </div>
                  <div className="flex flex-1 items-center gap-2 px-2 py-2">
                    <div className="w-2/5 h-full flex items-center justify-center">
                      {btn.img && (
                        <img
                          src={btn.img}
                          alt=""
                          loading="lazy"
                          className="max-h-16 sm:max-h-20 w-auto object-contain drop-shadow"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    {btn.puntos.length > 0 && (
                      <ul className="w-3/5 space-y-1 text-left text-[10px] sm:text-xs font-bold leading-snug">
                        {btn.puntos.map((p, i) => <li key={i}>* {p}</li>)}
                      </ul>
                    )}
                  </div>
                </button>
              );

              return (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {BOTONES_PORTADA.map((btn, idx) => <BotonProyecto key={idx} btn={btn} />)}
                </div>
              );
            })()}

            {/* Retos, Regalos y Reconocimientos DCUATES */}
            <div className="mt-3">
              <div className="rounded-2xl overflow-hidden border-4 border-[#0f2d1e]/30 shadow-lg bg-[#0f2d1e] p-3">
                <p className="text-white font-black uppercase text-xs sm:text-sm tracking-wide mb-2 px-1 text-center">
                  🔎 Retos, Regalos y Reconocimientos DCUATES
                  <br className="sm:hidden" />
                  <span className="block sm:inline sm:ml-1 normal-case font-bold text-emerald-100">Porque todo lo bueno merece ser compartido y reconocido, envíanos tus propuestas</span>
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Columna 1: los 3 botones naranjas */}
                  <div className="flex flex-col gap-2">
                    {RETOS_REGALOS_ITEMS.map((item, i) => (
                      <a
                        key={i}
                        href={item.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-xs sm:text-sm leading-tight px-4 py-3.5 transition-colors"
                      >
                        <span>{item.titulo}</span>
                        <span className="text-xl shrink-0" aria-hidden="true">{item.icono}</span>
                      </a>
                    ))}
                  </div>

                  {/* Columna 2: carrusel de fotos */}
                  <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center min-h-[180px]">
                    {galeriaRetos.length > 0 ? (
                      <Carrusel
                        items={galeriaRetos}
                        renderItem={(item) => (
                          <img
                            src={resolverSrcImagen(item.img)}
                            alt={item.nombre}
                            loading="lazy"
                            className="w-full aspect-square object-cover"
                          />
                        )}
                      />
                    ) : (
                      <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-wide text-center px-4">
                        Sube fotos a la columna "RETOSGALERIA" en Baserow para verlas aquí
                      </p>
                    )}
                  </div>

                  {/* Columna 3: videos relacionados (YouTube y TikTok) */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-2 flex flex-col gap-2 max-h-[260px] lg:max-h-none overflow-y-auto">
                    {videosRetos.length > 0 ? (
                      videosRetos.map((v, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setVideoEnGrande(v)}
                          className="group relative rounded-lg overflow-hidden border-2 border-white/10 hover:border-[#e65100] transition-colors bg-black/30 text-left shrink-0"
                        >
                          <div className="aspect-video w-full overflow-hidden bg-black/50 flex items-center justify-center">
                            {v.tipo === "tiktok" ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-black/70 text-white p-2 text-center">
                                <span className="text-2xl font-black text-[#ff0050]">TikTok</span>
                                <span className="text-[10px] uppercase font-bold text-emerald-300">Ver Video</span>
                              </div>
                            ) : (
                              <img
                                src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                                alt={v.nombre}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-8 h-8 rounded-full bg-[#e65100]/90 flex items-center justify-center text-white text-sm shadow-md group-hover:bg-[#e65100]">▶</span>
                          </span>
                          <p className="px-2 py-1 text-[10px] font-black text-white uppercase tracking-tight leading-tight">
                            {v.nombre}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-wide text-center px-2 py-6">
                        Sube videos con las columnas "NOMBRE RETOSVID" y "RETOSVID" en Baserow para verlos aquí
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal de reproductor de Video en grande (YouTube o TikTok) */}
              {videoEnGrande && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                  onClick={() => setVideoEnGrande(null)}
                >
                  <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setVideoEnGrande(null)}
                      className="absolute -top-10 right-0 text-white text-2xl font-black hover:text-[#e65100] transition-colors"
                      aria-label="Cerrar video"
                    >
                      ✕
                    </button>
                    {videoEnGrande.tipo === "tiktok" ? (
                      <div className="rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl h-[80vh] max-h-[650px] w-full max-w-[360px] mx-auto bg-black">
                        <iframe
                          className="w-full h-full"
                          src={videoEnGrande.url}
                          title={videoEnGrande.nombre || "Video TikTok"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl aspect-video bg-black">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${videoEnGrande.id}?autoplay=1`}
                          title={videoEnGrande.nombre || "Video YouTube"}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recomendaciones / Música-Libros-Pelis / Preguntas Frecuentes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                <BotonVerdeInfo
                  titulo="Recomendaciones ⭐⭐⭐⭐⭐"
                  abierto={infoAbierta === "recomendaciones"}
                  onClick={() => setInfoAbierta((v) => (v === "recomendaciones" ? null : "recomendaciones"))}
                >
                  <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide">Recomendaciones DCUATES</p>
                  <ul className="space-y-1">
                    {recomendacionesDcuates.map((r, i) => (
                      <li key={i}>
                        <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                          {r.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide pt-2">Recomendaciones de la Comunidad</p>
                  <ul className="space-y-1">
                    {recomendacionesComunidad.map((r, i) => (
                      <li key={i}>
                        <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                          {r.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-2 font-black uppercase text-emerald-300">Si necesitas alguna recomendación en especial, contáctanos !!!</p>
                </BotonVerdeInfo>

                <BotonVerdeInfo
                  titulo="Música, Libros, Pelis y Más... 🎵📚🎬"
                  abierto={infoAbierta === "recursos"}
                  onClick={() => setInfoAbierta((v) => (v === "recursos" ? null : "recursos"))}
                >
                  <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide">🎵 Música</p>
                  <ul className="space-y-1">
                    {musicaLinks.map((enlace, i) => (
                      <li key={i}>
                        <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                          Música {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide pt-2">📚 Libros</p>
                  <ul className="space-y-1">
                    {librosLinks.map((enlace, i) => (
                      <li key={i}>
                        <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                          Libro {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide pt-2">🎬 Películas y Más</p>
                  <ul className="space-y-1">
                    {videosLinks.map((enlace, i) => (
                      <li key={i}>
                        <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                          Recurso {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BotonVerdeInfo>

                <BotonVerdeInfo
                  titulo="Preguntas Frecuentes ❓💬"
                  abierto={infoAbierta === "faq"}
                  onClick={() => setInfoAbierta((v) => (v === "faq" ? null : "faq"))}
                >
                  <div className="space-y-2">
                    {FAQ_ITEMS.map((f, i) => (
                      <details key={i} className="rounded-lg bg-emerald-900/40 px-3 py-2">
                        <summary className="cursor-pointer text-xs sm:text-sm font-bold">{f.pregunta}</summary>
                        <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed">{f.respuesta}</p>
                      </details>
                    ))}
                  </div>
                </BotonVerdeInfo>
              </div>

              {/* 3 botones naranjas adicionales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                {[
                  { t: "HISTORIAS DCUATES", modal: "historias-dcuates", img: "/images/HistoriasDCUATES.png", puntos: ["TESTIMONIOS REALES", "HISTORIAS CON CAUSA", "INSPIRACIÓN COMUNITARIA"] },
                  { t: "CUPONES, PROMOS Y MÁS", modal: "cupones-promos", img: "/images/CuponesPromos.png", puntos: ["DESCUENTOS EXCLUSIVOS", "PROMOCIONES LOCALES", "SE ACTUALIZA CADA MES"] },
                  { t: "PATROCINADORES Y ALIANZAS DCUATES", modal: "patrocinadores-alianzas", img: "/images/PatrocinadoresAlianzas.png", puntos: ["NEGOCIOS ALIADOS", "ORGANIZACIONES QUE APOYAN", "¡GRACIAS POR SUMAR!"] }
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModalProyecto(btn.modal)}
                    className="flex flex-col rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-md transition-all hover:scale-[1.02] overflow-hidden font-heading text-left w-full"
                  >
                    <div className="px-2 pt-3 pb-1 text-center border-b border-white/20">
                      <h4 className="uppercase font-black leading-tight text-sm sm:text-base lg:text-lg">
                        {btn.t}
                      </h4>
                    </div>
                    <div className="flex flex-1 items-center gap-2 px-2 py-2">
                      <div className="w-2/5 h-full flex items-center justify-center">
                        <img
                          src={btn.img}
                          alt=""
                          loading="lazy"
                          className="max-h-16 sm:max-h-20 w-auto object-contain drop-shadow"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                      <ul className="w-3/5 space-y-1 text-left text-[10px] sm:text-xs font-bold leading-snug">
                        {btn.puntos.map((p, i) => <li key={i}>* {p}</li>)}
                      </ul>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HISTORIAS Y REFLEXIONES DCUATES — Soporta YouTube y TikTok */}
      <section id="historias-reflexiones" className="scroll-mt-48 md:scroll-mt-36 bg-[#0f2d1e] py-6 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <p className="text-[#00c853] font-black uppercase text-xs sm:text-sm tracking-wide mb-2 px-1 text-center">
            Historias y reflexiones DCUATES que INSPIRAN 💡
            <br className="sm:hidden" />
            <span className="block sm:inline sm:ml-1 text-white">Dales clic para ampliarlos y disfrutarlos 🎥 🍿 😊</span>
          </p>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
            {videosPortadaFinal.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setVideoEnGrande(v)}
                className="group relative rounded-xl overflow-hidden border-2 border-white/10 hover:border-[#e65100] transition-colors bg-black/30 text-left w-40 sm:w-56 shrink-0"
              >
                <div className="aspect-video w-full overflow-hidden bg-black/50 flex items-center justify-center">
                  {v.tipo === "tiktok" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/70 text-white p-2 text-center">
                      <span className="text-2xl font-black text-[#ff0050]">TikTok</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-300">Ver Video</span>
                    </div>
                  ) : (
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.nombre}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#e65100]/90 flex items-center justify-center text-white text-base sm:text-lg shadow-md group-hover:bg-[#e65100]">▶</span>
                </span>
                <p className="px-2 py-1.5 text-[10px] sm:text-xs font-black text-white uppercase tracking-tight leading-tight">
                  {v.nombre}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: VENTAS CON CAUSA */}
      <section id="ventas-con-causa" className="scroll-mt-48 md:scroll-mt-36 bg-[#e8f5e9] text-[#0f2d1e] py-10 sm:py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🛍️ Ventas con Causa
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              Productos y servicios que también apoyan la comunidad
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-bold">
              Artículos y servicios de vecinos y negocios locales. Explora, cuéntanos qué te interesa o qué estás buscando, y te contactamos directo por WhatsApp.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-12 items-start max-w-5xl mx-auto mb-14">
            <div className="md:col-span-7">
              <PasarelaVentasConCausa />
            </div>
            <div className="md:col-span-5 space-y-3">
              <BotonNaranjaDesplegable
                titulo="Si algo te gustó y deseas apartarlo o comprarlo, regístralo aquí"
                abierto={registroVentasAbierto}
                onClick={() => setRegistroVentasAbierto((v) => !v)}
              >
                <FormularioVentasConCausa />
              </BotonNaranjaDesplegable>
              <a
                href="https://whatsapp.com/channel/0029Vb8gAjd1dAvyGu9Jmv1i"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
              >
                <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
                  Si quieres ver más productos y catálogos, da clic aquí !!!
                </p>
                <FlechaBlanca />
              </a>

              <BotonNaranjaDesplegable
                titulo="Recomendaciones de Compra"
                abierto={infoAbierta === "recomendaciones-compra"}
                onClick={() => setInfoAbierta((v) => (v === "recomendaciones-compra" ? null : "recomendaciones-compra"))}
              >
                {recomendacionesCompra.length === 0 && <p>Muy pronto encontrarás aquí recomendaciones de compra.</p>}
                <ul className="space-y-1.5">
                  {recomendacionesCompra.map((r, i) => (
                    <li key={i}>
                      <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100]">
                        {r.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </BotonNaranjaDesplegable>

              <BotonNaranjaDesplegable
                titulo="Recomendaciones de Venta"
                abierto={infoAbierta === "recomendaciones-venta"}
                onClick={() => setInfoAbierta((v) => (v === "recomendaciones-venta" ? null : "recomendaciones-venta"))}
              >
                {recomendacionesVenta.length === 0 && <p>Muy pronto encontrarás aquí recomendaciones de venta.</p>}
                <ul className="space-y-1.5">
                  {recomendacionesVenta.map((r, i) => (
                    <li key={i}>
                      <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100]">
                        {r.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </BotonNaranjaDesplegable>

              <BotonNaranjaDesplegable
                titulo="Compra-Venta DCUATES"
                abierto={infoAbierta === "compra-venta-dcuates"}
                onClick={() => setInfoAbierta((v) => (v === "compra-venta-dcuates" ? null : "compra-venta-dcuates"))}
              >
                {compraVentaDcuates.length === 0 && <p>Muy pronto encontrarás aquí más opciones de compra-venta DCUATES.</p>}
                <ul className="space-y-1.5">
                  {compraVentaDcuates.map((r, i) => (
                    <li key={i}>
                      <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100]">
                        {r.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </BotonNaranjaDesplegable>
            </div>
          </div>

          {/* Pasarela de mascotas, personas y cosas extraviadas */}
          <div id="extraviados-registro" className="scroll-mt-48 md:scroll-mt-36 mt-14 max-w-5xl mx-auto">
            <div className="text-center mb-6 space-y-2">
              <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-base sm:text-xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
                🔎 Mascotas, Personas y Cosas Extraviadas
              </span>
              <p className="text-sm sm:text-base text-slate-700 font-bold max-w-xl mx-auto">
                Ayuda a la comunidad reconociendo estos casos, o repórtanos uno nuevo.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-12 items-start">
              <div className="md:col-span-7">
                <PasarelaExtraviados />
              </div>
              <div className="md:col-span-5 space-y-3">
                <a
                  href="https://whatsapp.com/channel/0029Vb6OjCQGk1FkkmvSzP3S"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
                >
                  <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
                    Ver Más Casos e Información de Valor
                  </p>
                  <FlechaBlanca />
                </a>
                <a
                  href={enlaceWhatsApp("¡Hola DCUATES! Quiero reportar un caso de mascota, persona o cosa extraviada.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
                >
                  <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
                    Reportar un Caso por WhatsApp
                  </p>
                  <FlechaBlanca />
                </a>

                <BotonNaranjaDesplegable
                  titulo="Apoyo a Causa Animal"
                  abierto={infoAbierta === "apoyo-causa-animal"}
                  onClick={() => setInfoAbierta((v) => (v === "apoyo-causa-animal" ? null : "apoyo-causa-animal"))}
                >
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">La prevención es la mejor ayuda</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Esteriliza a tu mascota: es la forma más efectiva de evitar camadas no deseadas y abandono.</li>
                    <li>Coloca collar con placa o microchip, por si se extravía.</li>
                    <li>Vacunas y desparasitación al día — previenen enfermedades que también afectan a otros animales.</li>
                    <li>Si ves un animal en la calle, no lo alimentes con lo que comemos nosotros; ofrece agua y contacta a un refugio o veterinario cercano.</li>
                    <li>Adoptar, en vez de comprar, ayuda a que menos animales terminen en situación de calle.</li>
                  </ul>
                  <p className="pt-2 font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">Más Información de Apoyo</p>
                  {apoyoCausaAnimalLinks.length === 0 && <p>Muy pronto encontrarás aquí más recursos de apoyo a causa animal.</p>}
                  <ul className="space-y-1.5">
                    {apoyoCausaAnimalLinks.map((enlace, i) => (
                      <li key={i}>
                        <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100] break-words">
                          Apoyo {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BotonNaranjaDesplegable>

                <BotonNaranjaDesplegable
                  titulo="Apoyo a Personas Extraviadas"
                  abierto={infoAbierta === "apoyo-personas-extraviadas"}
                  onClick={() => setInfoAbierta((v) => (v === "apoyo-personas-extraviadas" ? null : "apoyo-personas-extraviadas"))}
                >
                  <p>Recursos, protocolos y contactos de apoyo para casos de personas extraviadas.</p>
                  {apoyoPersonasExtraviadasLinks.length === 0 && <p>Muy pronto encontrarás aquí más recursos de apoyo.</p>}
                  <ul className="space-y-1.5">
                    {apoyoPersonasExtraviadasLinks.map((enlace, i) => (
                      <li key={i}>
                        <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100] break-words">
                          Apoyo {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BotonNaranjaDesplegable>

                <BotonNaranjaDesplegable
                  titulo="Apoyo a Cosas y Casos"
                  abierto={infoAbierta === "apoyo-cosas-casos"}
                  onClick={() => setInfoAbierta((v) => (v === "apoyo-cosas-casos" ? null : "apoyo-cosas-casos"))}
                >
                  <p>Guías y recursos para reportar u obtener ayuda sobre objetos extraviados o casos especiales de la comunidad.</p>
                  {apoyoCosasCasosLinks.length === 0 && <p>Muy pronto encontrarás aquí más recursos de apoyo.</p>}
                  <ul className="space-y-1.5">
                    {apoyoCosasCasosLinks.map((enlace, i) => (
                      <li key={i}>
                        <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100] break-words">
                          Apoyo {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </BotonNaranjaDesplegable>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE APOYO VOLUNTARIO Y DONACIONES */}
      <section id="donaciones" className="scroll-mt-48 md:scroll-mt-36 bg-[#0f2d1e] text-white py-12 px-4 border-b-4 border-emerald-500">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-900/60 border border-emerald-500/30 px-5 py-2 text-base sm:text-xl font-black uppercase tracking-wider text-emerald-300 shadow-sm mb-4">
            💚 Apoyo Voluntario y Donaciones
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Súmate a la red DCUATES
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Puedes apoyar con una aportación económica, en especie, trueque solidario o sumándote como voluntario. Toda ayuda transparente fortalece a las familias y la comunidad.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {OPCIONES_APORTACION.map((op, i) => (
              <a
                key={i}
                href={enlaceWhatsApp(op.m)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl bg-[#17472d] p-5 border-2 border-emerald-500/20 hover:border-emerald-400 transition-all hover:scale-[1.02]"
              >
                <div>
                  <h3 className="text-lg font-black uppercase text-emerald-300 group-hover:text-emerald-200">
                    {op.t}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/90 font-medium mt-1">
                    {op.d}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase text-[#25d366] group-hover:underline">
                  Contactar por WhatsApp →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN PUBLICIDAD GRATUITA */}
      <section id="publicidad" className="scroll-mt-48 md:scroll-mt-36 bg-[#e8f5e9] text-[#0f2d1e] py-12 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-base sm:text-xl font-black uppercase tracking-wider text-emerald-800 shadow-sm mb-3">
            📢 Publicidad Gratuita
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0f2d1e] mb-2">
            Anuncia tu negocio o servicio
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-bold mb-6">
            Llena el siguiente formulario para dar a conocer tu negocio a más familias de la comunidad.
          </p>
          <div className="rounded-2xl bg-white p-6 shadow-xl border-2 border-[#0f2d1e]/20 text-left">
            <FormularioPublicidad />
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="bg-[#0b1f14] text-emerald-200/80 text-xs py-8 px-4 text-center border-t border-emerald-900">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-4 font-bold text-emerald-300 uppercase text-xs">
            <button type="button" onClick={() => setShowFAQ(true)} className="hover:underline">Preguntas Frecuentes</button>
            <span>•</span>
            <button type="button" onClick={() => setShowPrivacy(true)} className="hover:underline">Aviso de Privacidad</button>
            <span>•</span>
            <button type="button" onClick={() => setModalFormulario("sugerencias")} className="hover:underline">Sugerencias y Quejas</button>
          </div>
          <p>© {new Date().getFullYear()} DCUATES — Conexiones con Causa ♥. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* MODALES Y VENTANAS EMERGENTES */}
      {showPrivacy && (
        <ModalGenerico titulo="Aviso de Privacidad" onClose={() => setShowPrivacy(false)}>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {AVISO_PRIVACIDAD_PARRAFOS.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </ModalGenerico>
      )}

      {showFAQ && (
        <ModalGenerico titulo="Preguntas Frecuentes" onClose={() => setShowFAQ(false)}>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <details key={i} className="rounded-xl bg-emerald-50 p-3 border border-emerald-200">
                <summary className="cursor-pointer font-black text-xs sm:text-sm text-[#0f2d1e]">{f.pregunta}</summary>
                <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{f.respuesta}</p>
              </details>
            ))}
          </div>
        </ModalGenerico>
      )}

      {modalProyecto && (
        <ModalProyecto
          id={modalProyecto}
          onClose={() => setModalProyecto(null)}
          filasEnlaces={filasEnlaces}
        />
      )}

      {modalFormulario && (
        <ModalFormularioAccion
          tipo={modalFormulario}
          onClose={() => setModalFormulario(null)}
        />
      )}

    </div>
  );
}

// =========================================================================
// 3. COMPONENTES AUXILIARES Y PANELES REUTILIZABLES
// =========================================================================

function SiteHeader({ onAbrirFAQ, onAbrirPrivacidad, onAbrirProyecto, onAbrirSugerencias, onAbrirComparte }) {
  const [menuMasAbierto, setMenuMasAbierto] = useState(false);

  return (
    <header className="bg-[#0f2d1e] text-white shadow-md border-b-2 border-emerald-500/30">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-2">
        <a href="#inicio" className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400">
          <span>💚</span> DCUATES
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS_PRINCIPALES.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-100 hover:bg-emerald-800/60 transition-colors uppercase"
            >
              {link.label}
            </a>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuMasAbierto((v) => !v)}
              className="rounded-lg bg-emerald-800/80 hover:bg-emerald-700 px-3 py-1.5 text-xs sm:text-sm font-black uppercase text-emerald-200 flex items-center gap-1 transition-colors"
            >
              MÁS ▾
            </button>

            {menuMasAbierto && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#17472d] border-2 border-emerald-500/40 shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-[80vh] overflow-y-auto"
                onClick={() => setMenuMasAbierto(false)}
              >
                {NAV_LINKS_MAS.map((item, idx) => {
                  if (item.action === "faq") {
                    return (
                      <button key={idx} type="button" onClick={onAbrirFAQ} className="text-left px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-800 rounded-lg uppercase">
                        {item.label}
                      </button>
                    );
                  }
                  if (item.action === "sugerencias") {
                    return (
                      <button key={idx} type="button" onClick={onAbrirSugerencias} className="text-left px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-800 rounded-lg uppercase">
                        {item.label}
                      </button>
                    );
                  }
                  if (item.modal) {
                    return (
                      <button key={idx} type="button" onClick={() => onAbrirProyecto(item.modal)} className="text-left px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-800 rounded-lg uppercase">
                        {item.label}
                      </button>
                    );
                  }
                  return (
                    <a key={idx} href={item.href} className="px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-800 rounded-lg uppercase">
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function TickerFrases() {
  return (
    <div className="bg-[#0b1f14] text-emerald-300 py-1.5 px-2 overflow-hidden border-b border-emerald-800 text-xs font-bold">
      <div className="flex animate-marquee whitespace-nowrap gap-8">
        {TICKER_FRASES.map((f, idx) => (
          <a key={idx} href={f.enlace} className="hover:underline flex items-center gap-2 shrink-0">
            <span>{f.texto}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function BarraTicker() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f2d1e] border-t-2 border-emerald-500/40 text-white py-2 px-3 overflow-hidden shadow-2xl">
      <div className="flex animate-marquee whitespace-nowrap gap-6 items-center">
        {TICKER_ITEMS.map((item, idx) => {
          const etiq = TICKER_ETIQUETAS[item.tipo] || { emoji: "📌", label: "Aviso" };
          return (
            <a
              key={idx}
              href={item.enlace || "#"}
              className="inline-flex items-center gap-2 rounded-full bg-[#17472d] border border-emerald-500/30 px-3 py-1 hover:border-emerald-400 transition-colors shrink-0 text-xs font-bold"
            >
              <span>{etiq.emoji}</span>
              <span className="text-emerald-300 font-black uppercase text-[10px]">{etiq.label}:</span>
              <span className="text-emerald-50">{item.nombre || item.texto}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function BotonNecesidades({ onAbrirProyecto, onAccionEspecial }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="absolute right-4 top-full mt-2 z-40">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="rounded-full bg-[#e65100] hover:bg-[#bf360c] text-white font-black text-xs uppercase px-4 py-2 shadow-xl border-2 border-white/40 flex items-center gap-2 animate-bounce hover:animate-none"
      >
        <span>🧭</span> Navegar por Necesidades ▾
      </button>

      {abierto && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0f2d1e] border-4 border-[#e65100] shadow-2xl p-4 z-50 max-h-[80vh] overflow-y-auto text-white">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-emerald-800">
            <h3 className="font-black uppercase text-sm text-emerald-300">¿Qué estás buscando hoy?</h3>
            <button type="button" onClick={() => setAbierto(false)} className="text-emerald-400 font-bold hover:text-white">✕</button>
          </div>

          <div className="space-y-4">
            {NECESIDADES_GRUPOS.map((grupo) => (
              <div key={grupo.id} className="rounded-xl p-3 border border-white/10" style={{ backgroundColor: grupo.colorClaro, color: grupo.colorTexto }}>
                <h4 className="font-black uppercase text-xs mb-2 text-slate-900 border-b pb-1" style={{ borderColor: grupo.colorFuerte }}>
                  {grupo.titulo}
                </h4>
                <ul className="space-y-1.5">
                  {grupo.preguntas.map((p, idx) => (
                    <li key={idx}>
                      {p.modal ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAbierto(false);
                            onAbrirProyecto(p.modal);
                          }}
                          className="text-left text-xs font-bold hover:underline block w-full"
                        >
                          • {p.texto}
                        </button>
                      ) : (
                        <a
                          href={p.enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setAbierto(false)}
                          className="text-left text-xs font-bold hover:underline block"
                        >
                          • {p.texto}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BotonVerdeInfo({ titulo, abierto, onClick, children }) {
  return (
    <div className="rounded-xl bg-[#17472d] border border-emerald-500/30 overflow-hidden shadow-md">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left font-black uppercase text-xs sm:text-sm text-emerald-300 p-3 bg-emerald-900/40 hover:bg-emerald-900/60 flex items-center justify-between transition-colors"
      >
        <span>{titulo}</span>
        <span>{abierto ? "▲" : "▼"}</span>
      </button>
      {abierto && (
        <div className="p-3 text-xs text-emerald-100 font-medium space-y-2 border-t border-emerald-800/60 bg-[#0f2d1e]/40">
          {children}
        </div>
      )}
    </div>
  );
}

function BotonNaranjaDesplegable({ titulo, abierto, onClick, children }) {
  return (
    <div className="rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] text-white overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left font-black uppercase text-sm p-3 flex items-center justify-between hover:bg-[#bf360c] transition-colors"
      >
        <span>{titulo}</span>
        <span>{abierto ? "▲" : "▼"}</span>
      </button>
      {abierto && (
        <div className="p-4 bg-white text-slate-800 text-xs sm:text-sm font-medium border-t-2 border-[#0f2d1e]">
          {children}
        </div>
      )}
    </div>
  );
}

function FlechaBlanca() {
  return <span className="text-xl font-black text-white shrink-0">→</span>;
}

function PasarelaVentasConCausa() {
  return (
    <div className="rounded-2xl border-4 border-[#0f2d1e] bg-white p-4 shadow-xl">
      <Carrusel
        items={VENTAS_CON_CAUSA_ITEMS}
        renderItem={(item) => (
          <div className="flex flex-col items-center text-center p-2">
            <img src={item.img} alt={item.nombre} className="h-40 w-auto object-contain mb-3 rounded-lg" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">{item.tipo}</span>
            <h3 className="font-black uppercase text-base text-[#0f2d1e]">{item.nombre}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">{item.descripcion}</p>
          </div>
        )}
      />
    </div>
  );
}

function PasarelaExtraviados() {
  return (
    <div className="rounded-2xl border-4 border-[#0f2d1e] bg-white p-4 shadow-xl">
      <Carrusel
        items={EXTRAVIADOS_ITEMS}
        renderItem={(item) => (
          <div className="flex flex-col items-center text-center p-2">
            <img src={item.img} alt={item.nombre} className="h-40 w-auto object-contain mb-3 rounded-lg" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-[10px] font-black uppercase tracking-wider text-red-800 bg-red-100 px-2 py-0.5 rounded-full mb-1">{item.tipo}</span>
            <h3 className="font-black uppercase text-base text-[#0f2d1e]">{item.nombre}</h3>
            <p className="text-xs text-slate-600 font-medium mt-1">{item.descripcion}</p>
          </div>
        )}
      />
    </div>
  );
}

function Carrusel({ items, renderItem }) {
  const [indice, setIndice] = useState(0);

  if (!items || items.length === 0) return null;

  const anterior = () => setIndice((i) => (i === 0 ? items.length - 1 : i - 1));
  const siguiente = () => setIndice((i) => (i === items.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full">
      <div className="overflow-hidden min-h-[220px] flex items-center justify-center">
        {renderItem(items[indice])}
      </div>
      {items.length > 1 && (
        <div className="flex justify-between items-center mt-2 px-2">
          <button type="button" onClick={anterior} className="rounded-full bg-[#0f2d1e] text-white h-8 w-8 font-black text-sm hover:bg-[#17472d]">‹</button>
          <span className="text-[11px] font-bold text-slate-500">{indice + 1} / {items.length}</span>
          <button type="button" onClick={siguiente} className="rounded-full bg-[#0f2d1e] text-white h-8 w-8 font-black text-sm hover:bg-[#17472d]">›</button>
        </div>
      )}
    </div>
  );
}

function FormularioVentasConCausa() {
  const [nombre, setNombre] = useState("");
  const [interes, setInteres] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `¡Hola DCUATES! Me interesa apartar o comprar: ${interes}. Mi nombre es: ${nombre}.`;
    window.open(enlaceWhatsApp(msg), "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1">Tu Nombre:</label>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Ej. María López"
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1">Producto / Servicio de Interés:</label>
        <input
          type="text"
          required
          value={interes}
          onChange={(e) => setInteres(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Ej. Pan casero / Bordados"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-[#25d366] hover:bg-[#128c7e] text-white font-black uppercase text-xs py-2.5 transition-colors shadow-md"
      >
        Apartar / Pedir por WhatsApp
      </button>
    </form>
  );
}

function FormularioPublicidad() {
  const [negocio, setNegocio] = useState("");
  const [giro, setGiro] = useState("");
  const [contacto, setContacto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `¡Hola DCUATES! Quiero registrar mi negocio para Publicidad Gratuita.\nNegocio: ${negocio}\nGiro: ${giro}\nContacto: ${contacto}`;
    window.open(enlaceWhatsApp(msg), "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1">Nombre de tu Negocio o Servicio:</label>
        <input
          type="text"
          required
          value={negocio}
          onChange={(e) => setNegocio(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Ej. Taquería El Sol"
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1">Giro o Categoría:</label>
        <input
          type="text"
          required
          value={giro}
          onChange={(e) => setGiro(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Ej. Alimentos / Estética / Reparaciones"
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase text-slate-700 mb-1">Teléfono o Red Social de Contacto:</label>
        <input
          type="text"
          required
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="Ej. 55 1234 5678 / @mimodas"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-sm py-3 transition-colors shadow-lg"
      >
        Enviar Registro por WhatsApp
      </button>
    </form>
  );
}

function ModalGenerico({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
          <h3 className="text-xl font-black uppercase text-[#0f2d1e] font-heading">{titulo}</h3>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-black font-black text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalProyecto({ id, onClose, filasEnlaces }) {
  const proyecto = TODOS_LOS_PROYECTOS.find((p) => p.id === id);

  if (!proyecto && id !== "ventas-con-causa" && id !== "donaciones" && id !== "historias-dcuates" && id !== "cupones-promos" && id !== "patrocinadores-alianzas") {
    return null;
  }

  return (
    <ModalGenerico titulo={proyecto ? proyecto.titulo : id.replace("-", " ").toUpperCase()} onClose={onClose}>
      {proyecto ? (
        <div className="space-y-4">
          <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-3 py-1">
            {proyecto.categoria}
          </span>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {proyecto.descripcion}
          </p>
          {proyecto.puntos && (
            <ul className="space-y-1 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs font-bold text-[#0f2d1e]">
              {proyecto.puntos.map((pt, i) => <li key={i}>✓ {pt}</li>)}
            </ul>
          )}
          <div className="pt-2 space-y-2">
            {proyecto.enlaceDirectoWA && (
              <a
                href={proyecto.enlaceDirectoWA}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-xl bg-[#25d366] hover:bg-[#128c7e] text-white font-black uppercase text-xs sm:text-sm py-3 transition-colors shadow-md"
              >
                {proyecto.textoBoton || "Contactar por WhatsApp"}
              </a>
            )}
            {proyecto.segundoBoton && (
              <a
                href={proyecto.segundoBoton.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-xs py-2.5 transition-colors"
              >
                {proyecto.segundoBoton.titulo}
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-slate-600 font-bold mb-4">Explora el contenido completo de esta sección directamente en la página principal o contáctanos por WhatsApp.</p>
          <a
            href={enlaceWhatsApp(`¡Hola DCUATES! Quisiera más información sobre ${id}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-[#25d366] text-white font-black uppercase text-xs px-6 py-3"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      )}
    </ModalGenerico>
  );
}

function ModalFormularioAccion({ tipo, onClose }) {
  const titulo = tipo === "sugerencias" ? "Sugerencias y Quejas" : "Conocer y Compartir Más";
  const [texto, setTexto] = useState("");
  const [contacto, setContacto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `¡Hola DCUATES! Mensaje de ${titulo}:\n${texto}\nContacto: ${contacto}`;
    window.open(enlaceWhatsApp(msg), "_blank");
    onClose();
  };

  return (
    <ModalGenerico titulo={titulo} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1">Tu Mensaje o Aportación:</label>
          <textarea
            required
            rows={4}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Escribe aquí tu sugerencia, comentario o lo que desees compartir..."
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1">Tu Nombre o Teléfono (Opcional):</label>
          <input
            type="text"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Ej. Juan Pérez / 5512345678"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-xs py-3 transition-colors shadow-md"
        >
          Enviar por WhatsApp
        </button>
      </form>
    </ModalGenerico>
  );
}

// =========================================================================
// 4. HOOKS AUXILIARES Y FUNCIONES DE BASEROW
// =========================================================================

function useFilasEnlaces() {
  const [filas, setFilas] = useState([]);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/baserow-rows?table_id=${BASEROW_TABLE_ID_ENLACES}`);
        if (res.ok) {
          const data = await res.json();
          setFilas(data.results || data || []);
        }
      } catch (err) {
        console.error("Error cargando filas de Baserow:", err);
      }
    }
    cargar();
  }, []);

  return filas;
}

function idYoutubeDesdeUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function paresBaserow(filas, colNombre, colEnlace, max = 5) {
  const res = [];
  for (const f of filas) {
    const enlace = f[colEnlace];
    if (enlace) {
      const nombre = f[colNombre] || `Opción ${res.length + 1}`;
      res.push({ nombre, enlace });
    }
    if (res.length >= max) break;
  }
  return res;
}

function primerosValores(filas, col, max = 5) {
  const res = [];
  for (const f of filas) {
    const val = f[col];
    if (val) res.push(val);
    if (res.length >= max) break;
  }
  return res;
}

function galeriaDesdeColumna(filas, col, max = 5, prefijo = "Item") {
  const res = [];
  for (const f of filas) {
    const val = f[col];
    if (val && Array.isArray(val)) {
      for (const imgObj of val) {
        if (imgObj.url) {
          res.push({ id: imgObj.id || res.length, nombre: `${prefijo} ${res.length + 1}`, img: imgObj.url });
        }
        if (res.length >= max) break;
      }
    }
    if (res.length >= max) break;
  }
  return res;
}

function resolverSrcImagen(img) {
  if (!img) return "/images/placeholder.png";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
    return img;
  }
  return `/images/${img}`;
}
