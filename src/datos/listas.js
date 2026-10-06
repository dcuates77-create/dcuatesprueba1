import React from "react";
import { CLAVE_CIRCULO_CONFIANZA } from "./proyectos.js";
import { enlaceWhatsApp } from "../utilidades/baserow.js";

export const INICIATIVAS_PRINCIPALES = [
  {
    id: "libros",
    categoria: "EDUCACIÓN Y DESARROLLO",
    titulo: "LA BIBLIOBICI Y AMIGOS",
    descripcion: "Préstamo gratuito de libros y materiales educativos para el desarrollo personal y social. La lectura que llega hasta tu colonia para fortalecer a la COMUNIDAD.",
    puntos: ["Préstamo sin costo", "Materiales para todas las edades", "Recibimos y hacemos donaciones"],
    textoBoton: "NECESITO UN MATERIAL / QUIERO COLABORAR",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Necesito un material o quiero colaborar con el proyecto de La Bibliobici y Amigos."),
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
    // En vez de abrir WhatsApp, este botón lleva directo al registro de
    // extraviados/adopciones dentro de la sección "Ventas con Causa".
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
      enlace: "https://chat.whatsapp.com/F2Rdvu5ueSlJ0YuDYGi8VL",
      // Al tener "claveAcceso", este botón sale bloqueado con un candado en
      // vez de abrir el enlace directo (ver BotonModalProtegido más abajo).
      claveAcceso: CLAVE_CIRCULO_CONFIANZA
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
    // En vez de abrir WhatsApp, este botón lleva directo al formulario de
    // registro "Publicar mi Negocio" dentro de la sección de Publicidad.
    scrollDestino: "publicidad",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Deseo publicar mi negocio en la plataforma de publicidad comunitaria.")
  }
];

// Arreglo de los 4 Proyectos Nuevos con Enlaces Directos de WhatsApp
export const NUEVOS_PROYECTOS_DATA = [
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

// =========================================================================
// 1B. VENTANA EMERGENTE ÚNICA DE PROYECTO (reemplaza el "solo scroll" de
// los 12 botones naranjas de portada). Junta la info de los 10 proyectos
// que ya tienen tarjeta (INICIATIVAS_PRINCIPALES + NUEVOS_PROYECTOS_DATA)
// y agrega, a mano, el contenido de los 2 casos especiales que no son una
// sola tarjeta: "Ventas con Causa" y "Apoyo Voluntario" (donaciones).
// =========================================================================
export const TODOS_LOS_PROYECTOS = [...INICIATIVAS_PRINCIPALES, ...NUEVOS_PROYECTOS_DATA];

// Navegación por Necesidades — botón flotante naranja (arriba a la derecha)
// que agrupa TODAS las preguntas por necesidad del visitante en 4 categorías,
// cada una con su propio color (a partir de los logos de cada sección).
// Cada pregunta lleva a un "modal" (mismo id que en TODOS_LOS_PROYECTOS o en
// las 3 cajas naranjas nuevas), o a un "enlace" directo (para las necesidades
// "próximamente" que aún no tienen su propia sección/modal).
export const NECESIDADES_GRUPOS = [
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

// Retos, Regalos y Reconocimientos DCUATES — 3 botones naranjas que arman
// un mensaje de WhatsApp distinto cada uno. Para cambiar el texto o el
// ícono de alguno, solo edita este arreglo (mismo patrón que los demás).
export const RETOS_REGALOS_ITEMS = [
  {
    titulo: "RETOS que nos hacen MEJORES !!!",
    icono: "🎯",
    intro: "Ejemplos de retos que podríamos lanzar entre vecinos, familias y negocios:",
    ejemplos: [
      "🧹 Reto Cuadra Limpia: 30 días dejando tu banqueta y tu cuadra más limpias; sube foto de antes y después.",
      "📚 Reto Un Libro al Mes: lee un libro (de nuestro préstamo gratuito) y comparte tu reseña en una frase.",
      "🛍️ Reto Compra Local: una semana comprando en negocios de la colonia y recomendando tu favorito.",
      "💚 Reto Un Acto de Bondad al Día: ayuda a alguien sin esperar nada y cuéntanos la historia.",
      "🌱 Reto Cuadra Verde: siembra una planta o adopta un árbol y cuídalo durante 3 meses."
    ],
    cta: "💡 Propón tu propio RETO",
    enlace: enlaceWhatsApp("¡Hola DCUATES! Quiero proponer o participar en un Reto que nos haga mejores.")
  },
  {
    titulo: "REGALOS que motivan",
    icono: "🎁",
    intro: "Ejemplos de regalos que pueden motivar la participación (donados por vecinos y negocios aliados):",
    ejemplos: [
      "🎟️ Sorteo mensual de una canasta de productos de negocios aliados entre quienes cumplan los retos.",
      "📖 Un libro nuevo para quien complete el Reto Un Libro al Mes.",
      "🏷️ Cupones y descuentos exclusivos en negocios de la comunidad.",
      "✂️ Un servicio gratis donado por un negocio: corte de cabello, asesoría, clase de prueba, etc.",
      "🐶 Un kit para mascota (croquetas, collar o placa) para quien adopte o cuide a un peludito en apuros."
    ],
    cta: "🎁 Propón tu propio REGALO",
    enlace: enlaceWhatsApp("¡Hola DCUATES! Tengo una propuesta de Regalo que motive a la comunidad.")
  },
  {
    titulo: "RECONOCIMIENTO a quienes nos INSPIRAN",
    icono: "🏅",
    intro: "Ejemplos de reconocimientos que podríamos entregar y difundir en nuestras redes:",
    ejemplos: [
      "🏆 Vecino/a del Mes: por su ayuda constante a la comunidad.",
      "🏪 Negocio con Causa del Mes: por apoyar a familias y causas sociales.",
      "🤝 Voluntario/a Constante: por sumar tiempo y talento sin descanso.",
      "🐾 Héroe/Heroína de Ecatepets: por rescatar, cuidar o dar hogar a una mascota.",
      "👩‍🏫 Promotor/a de la Lectura: por acercar libros y educación a niñas y niños."
    ],
    cta: "🏅 Propón a quien merece un RECONOCIMIENTO",
    enlace: enlaceWhatsApp("¡Hola DCUATES! Quiero proponer a alguien para un Reconocimiento que inspira.")
  }
];
