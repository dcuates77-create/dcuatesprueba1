// =========================================================================
// src/datos/proyectos.js — Proyectos, categorías y listas de la página
// Solo datos: aquí se cambian textos sin tocar la lógica de la página.
// =========================================================================
import { WHATSAPP_NUMERO } from "./config.js";

// Clave de acceso del candado que protege el botón "Únete a Nuestra Red de
// Confianza" dentro de Círculo de Confianza — cámbiala aquí cuando quieras.
// AVISO: esto NO es seguridad real (cualquiera puede verla si revisa el
// código fuente de la página), solo filtra visitas casuales.
export const CLAVE_CIRCULO_CONFIANZA = "confianza2026";

// Botón "🎵 Escucha Música DCUATES" — pega aquí la ruta de tu archivo de
// audio (colócalo en /public/audio/, ej. /public/audio/musica-dcuates.mp3).
// Mientras esté vacío, el botón se muestra pero no reproduce nada.
export const MUSICA_DCUATES_URL = "/audio/musica-dcuates.mp3";

// Catálogo de "Ventas con Causa". Mientras no esté conectado a Baserow
// (ver BASEROW_TABLE_ID_VENTAS_CON_CAUSA abajo), el carrusel usa esta
// lista de EJEMPLO como respaldo. BASEROW_GALLERY_URL se deja como
// enlace — "ver catálogo completo" — apuntando a tu galería pública real.
export const BASEROW_GALLERY_URL = "https://baserow.io/public/gallery/xCYm1NOc3A5wuJC1NeYlVYyVeY_w7O2tQdNRKcDsiyE";

export const VENTAS_CON_CAUSA_ITEMS = [
  { id: "vc1", tipo: "Artesanías", nombre: "Bordados hechos a mano", descripcion: "Piezas únicas bordadas por manos locales. Pregunta por diseños personalizados.", img: "/images/ventas-causa-1.png" },
  { id: "vc2", tipo: "Alimentos", nombre: "Pan casero y repostería", descripcion: "Pedidos con un día de anticipación. Ideal para eventos y reuniones.", img: "/images/ventas-causa-2.png" },
  { id: "vc3", tipo: "Servicios", nombre: "Jardinería a domicilio", descripcion: "Poda, mantenimiento y diseño de jardines. Cotización sin costo.", img: "/images/ventas-causa-3.png" },
  { id: "vc4", tipo: "Segunda mano", nombre: "Ropa y accesorios", descripcion: "Prendas en buen estado a precios accesibles. Nuevo inventario cada semana.", img: "/images/ventas-causa-4.png" }
];

export const EXTRAVIADOS_ITEMS = [
  { id: "ex1", tipo: "Mascota", nombre: "Firulais", descripcion: "Perrito café, orejas caídas, visto por última vez cerca de la colonia centro.", img: "/images/extraviado-1.png" },
  { id: "ex2", tipo: "Persona", nombre: "Sr. Ramírez", descripcion: "Adulto mayor, salió de casa el martes por la tarde y no ha regresado.", img: "/images/extraviado-2.png" },
  { id: "ex3", tipo: "Cosa", nombre: "Mochila escolar azul", descripcion: "Olvidada en la parada del camión sobre la avenida principal.", img: "/images/extraviado-3.png" },
  { id: "ex4", tipo: "Mascota", nombre: "Michi", descripcion: "Gata blanca con manchas grises, muy asustadiza, extraviada desde el fin de semana.", img: "/images/extraviado-4.png" }
];

// =========================================================================
// CONEXIÓN REAL A BASEROW (segura: el token vive en el servidor, ver
// /api/baserow-rows.js, nunca en este archivo). Mientras el ID de una
// tabla esté vacío ("") o la función /api/baserow-rows todavía no
// responda datos, el carrusel correspondiente sigue mostrando su lista de
// EJEMPLO de arriba — nada se rompe entretanto.
//
// Para activar el catálogo REAL de Ventas con Causa, pega aquí el Table ID
// de tu tabla en Baserow (instrucciones de cómo encontrarlo, y cómo
// configurar el token, están en /api/baserow-rows.js).
export const BASEROW_TABLE_ID_VENTAS_CON_CAUSA = "1164149";

// tabla "Productos"
export const BASEROW_TABLE_ID_EXTRAVIADOS = "1165684";

// tabla "Servicios DC"

// Pega aquí el ID de tabla en cuanto crees las tablas nuevas en Baserow
// (mismo procedimiento que las 2 de arriba). Mientras estén vacías (""),
// las pasarelas de Noticias/Comunicación y Bienestar/Salud siguen usando
// los datos de ejemplo (NOTICIAS_GALERIA_ITEMS / BIENESTAR_GALERIA_ITEMS)
// sin romper nada.
// Nota: las galerías de Noticias y Bienestar ya NO usan tablas propias —
// ahora se alimentan de las columnas GALCULTURA y GALSALUD dentro de la
// misma tabla ENLACES (ver BASEROW_TABLE_ID_ENLACES más abajo).

// Tabla "ENLACES" en Baserow (la que ya armaste con columnas VIDPORT,
// RECASA, RECOMUN, RECMUSIC, RECLIBROS, RECVIDEOSYMAS, GALCULTURA, GALSALUD,
// etc.). Un solo ID de tabla alimenta el video de portada, las
// recomendaciones, la música y las 2 galerías — cada quien lee su propia
// columna. IMPORTANTE: esto asume que /api/baserow-rows.js devuelve las
// filas "crudas" (con el nombre exacto de cada columna de Baserow como
// llave). Si aún no lo hace así para esta tabla, compárteme ese archivo
// para ajustarlo — mientras tanto, todo sigue funcionando con los datos
// de respaldo, sin romper nada.
export const BASEROW_TABLE_ID_ENLACES = "1178299";

// =========================================================================

// Galerías de EJEMPLO para la prueba de "pasarela en ventana emergente"
// (ver GALERIAS_PROYECTOS y el modal correspondiente más abajo). Por ahora
// solo Noticias y Bienestar la tienen, a modo de prueba — si el resultado
// gusta, se puede replicar para cualquier otro proyecto agregando su propio
// arreglo aquí y una entrada en GALERIAS_PROYECTOS.
export const NOTICIAS_GALERIA_ITEMS = [
  { id: "not1", tipo: "Evento", nombre: "Feria cultural de agosto", descripcion: "Música en vivo, gastronomía local y actividades para toda la familia en la plaza principal.", img: "/images/noticias-1.png" },
  { id: "not2", tipo: "Convocatoria", nombre: "Taller de muralismo vecinal", descripcion: "Convocatoria abierta para pintar un mural comunitario. Se proporcionan materiales.", img: "/images/noticias-2.png" },
  { id: "not3", tipo: "Aviso", nombre: "Jornada de limpieza del parque", descripcion: "Súmate el próximo sábado a la jornada de limpieza y reforestación del parque de la colonia.", img: "/images/noticias-3.png" }
];

export const BIENESTAR_GALERIA_ITEMS = [
  { id: "bien1", tipo: "Taller", nombre: "Yoga al aire libre", descripcion: "Sesiones gratuitas los domingos por la mañana, para todos los niveles.", img: "/images/bienestar-1.png" },
  { id: "bien2", tipo: "Actividad", nombre: "Grupo de caminata vecinal", descripcion: "Caminatas ligeras entre semana para fomentar la actividad física y la convivencia.", img: "/images/bienestar-2.png" },
  { id: "bien3", tipo: "Charla", nombre: "Salud mental y comunidad", descripcion: "Plática abierta sobre bienestar emocional, con espacio para preguntas.", img: "/images/bienestar-3.png" }
];

// 3 secciones naranjas nuevas, debajo de los botones verdes (Historias,
// Cupones/Promos y Patrocinadores/Alianzas). Cada arreglo alimenta su
// propio carrusel — reemplaza estas fotos/textos de EJEMPLO por las reales
// cuando las tengas. Misma estructura que las galerías de arriba, así que
// también se pueden conectar a Baserow más adelante si se desea.
export const HISTORIAS_DCUATES_ITEMS = [
  { id: "hist1", tipo: "Historia", nombre: "El renacer de la Panadería Café Sol", descripcion: "Cómo una alianza vecinal ayudó a reabrir sus puertas después de un momento difícil.", img: "/images/historias-1.png" },
  { id: "hist2", tipo: "Historia", nombre: "De la calle a un hogar: la adopción de Firulais", descripcion: "Una historia de Ecatepets con final feliz gracias a la red de vecinos.", img: "/images/historias-2.png" },
  { id: "hist3", tipo: "Historia", nombre: "Voluntarios que cambian vidas", descripcion: "El testimonio de una familia apoyada por la comunidad DCUATES.", img: "/images/historias-3.png" }
];

export const CUPONES_PROMOS_ITEMS = [
  { id: "cup1", tipo: "Cupón", nombre: "20% en tu primera visita — Taquería El Sol", descripcion: "Válido presentando este cupón digital directo desde tu celular.", img: "/images/cupones-1.png" },
  { id: "cup2", tipo: "Promo", nombre: "2x1 en tu primera consulta de asesoría", descripcion: "Cupo limitado — agenda tu lugar directo por WhatsApp.", img: "/images/cupones-2.png" },
  { id: "cup3", tipo: "Promo", nombre: "Descuento en Ventas con Causa", descripcion: "Pregunta por la promoción vigente del mes en el catálogo.", img: "/images/cupones-3.png" }
];

// Mapa que conecta cada id de proyecto con su galería y título de modal —
// así el botón "Ver galería" sabe qué mostrar sin más configuración.
export const GALERIAS_PROYECTOS = {
  noticias: { titulo: "Agenda Cultural — Noticias de Barrio", items: NOTICIAS_GALERIA_ITEMS },
  bienestar: { titulo: "Actividades de Bienestar, Salud y Recreación", items: BIENESTAR_GALERIA_ITEMS }
};

// Los mismos 12 botones naranjas de la cuadrícula de portada — se sacó a
// nivel de archivo (antes vivía solo dentro del JSX de la portada) para
// poder reutilizarlo también en el Mapa de Sitio. "modal" = id que se
// busca en TODOS_LOS_PROYECTOS (o los 2 casos especiales
// "ventas-con-causa" / "donaciones") para llenar la ventana emergente.
// "h" se conserva solo como respaldo por si JavaScript llegara a fallar
// (accesibilidad).
// Orden A→L pedido explícitamente (de izquierda a derecha / de arriba hacia
// abajo): Ecatepets, Publicidad, Apoyo Voluntario, Recomienda, Alianzas,
// Círculo, Asesorías, Bazar, Ventas, Noticias, Bienestar, Libros.
// Ya NO se muestra directo en la portada (que ahora usa las 4 categorías
// de CATEGORIAS_PROYECTOS, más abajo) — este arreglo sigue vivo porque lo
// usan el Mapa de Sitio (ModalMapaSitio) y las tarjetas de cada categoría
// (ModalCategoria), así que reordenarlo aquí los reordena a ambos.
export const BOTONES_PORTADA = [
  { t: "ECATEPETS MASCOTAS", h: "#ecatepets", modal: "ecatepets", img: "/images/Ecatepets.png" },
  { t: "PUBLICIDAD GRATUITA", h: "#publicidad", modal: "publicidad-tarjeta", img: "/images/Publicidad2.png" },
  { t: "APOYO VOLUNTARIO", h: "#donaciones", modal: "donaciones", img: "/images/ApoyoVoluntario.png" },
  { t: "RECOMIENDA, EVALÚA Y GANA", h: "#recomienda-evalua-gana", modal: "recomienda-evalua-gana", img: "/images/Recomienda.png" },
  { t: "ALIANZAS SOLIDARIAS", h: "#iniciativas", modal: "alianzas-tarjeta", img: "/images/Alianzas.png" },
  { t: "CÍRCULO DE CONFIANZA", h: "#circulo-confianza", modal: "circulo-confianza", img: "/images/Círculo.png" },
  { t: "ASESORÍAS GRATUITAS", h: "#asesorias", modal: "asesorias", img: "/images/Asesorías.png" },
  { t: "BAZAR Y COMERCIO", h: "#bazares", modal: "bazares", img: "/images/Bazar.png" },
  { t: "VENTAS CON CAUSA", h: "#ventas-con-causa", modal: "ventas-con-causa", img: "/images/VentasConCausa.png" },
  { t: "NOTICIAS DE BARRIO", h: "#noticias", modal: "noticias", img: "/images/Noticias.png" },
  { t: "BIENESTAR Y RECREACIÓN", h: "#bienestar", modal: "bienestar", img: "/images/Bienestar.png" },
  { t: "PRÉSTAMO GRATUITO DE LIBROS", h: "#libros", modal: "libros", img: "/images/bb.png" }
];

// Una línea que explica cada proyecto: aparece en su tarjeta y en el mensaje
// que se envía al compartirlo. Edítalas aquí cuando quieras.
export const RESUMEN_PROYECTO = {
  libros: "Préstamo gratuito de libros",
  bienestar: "Talleres, cursos y recreación",
  asesorias: "Orientación gratuita",
  ecatepets: "Adopción y ayuda a peluditos",
  "circulo-confianza": "Red de confianza vecinal",
  "publicidad-tarjeta": "Promociona tu negocio gratis",
  "recomienda-evalua-gana": "Recomienda, evalúa y gana",
  "alianzas-tarjeta": "Alianzas ganar-ganar",
  bazares: "Comercio y bazar local",
  "ventas-con-causa": "Compra y apoya una causa",
  donaciones: "Tu tiempo, talento o recursos",
  noticias: "Lo que pasa en tu barrio"
};

// Logos para las ventanas que no salen de BOTONES_PORTADA (los 3 botones
// de abajo: Historias, Cupones, Patrocinadores). Ajusta las rutas si tus
// archivos se llaman distinto.
export const LOGOS_EXTRA_MODAL = {
  "historias-dcuates": "/images/HistoriasDCUATES.png"
};

// Portada simplificada: en vez de los 12 botones de proyecto, se muestran
// solo estas 4 categorías (más grandes). Cada una agrupa varios proyectos
// — al tocarla se abre un modal de presentación con acceso directo a cada
// proyecto incluido (ver ModalCategoria). Los 12 proyectos originales
// siguen totalmente accesibles uno por uno desde el Mapa de Sitio (usa
// BOTONES_PORTADA arriba, sin tocar).
// "emoji" es el respaldo mientras no exista un logo propio: en cuanto
// tengas la imagen, solo agrega "img: '/images/NombreDelArchivo.png'" y se
// usará automáticamente en su lugar (mismo patrón que los botones de
// proyecto). Slogans son provisionales — cámbialos cuando quieras.
// Nota: "Bazar y Comercio" no estaba en ninguna de las 4 categorías que
// diste, así que se agregó a "Alianzas y Negocios" por ser lo más afín
// (comercio local) — muévelo si lo quieres en otra.
export const CATEGORIAS_PROYECTOS = [
  {
    id: "beneficios-comunitarios",
    titulo: "BENEFICIOS COMUNITARIOS",
    slogan: "Todo lo que la comunidad te regala",
    emoji: "🎁",
    img: null,
    descripcion: "Recursos pensados para tu bienestar y el de tu familia, sin costo: préstamo de libros, actividades de bienestar, asesorías, apoyo para tus mascotas y una red de confianza vecinal.",
    proyectos: ["libros", "bienestar", "asesorias", "ecatepets", "circulo-confianza"]
  },
  {
    id: "alianzas-y-negocios",
    titulo: "ALIANZAS Y NEGOCIOS",
    slogan: "Creciendo juntos, ganamos más",
    emoji: "🤝",
    img: null,
    descripcion: "Todo lo que impulsa tu negocio o emprendimiento: publicidad gratuita, recomendaciones que valen, alianzas ganar-ganar, asesoría profesional, comercio local y ventas con causa, y una red de confianza para crecer sin miedo.",
    proyectos: ["publicidad-tarjeta", "recomienda-evalua-gana", "alianzas-tarjeta", "asesorias", "bazares", "ventas-con-causa", "circulo-confianza"]
  },
  {
    id: "apoya-causas",
    titulo: "APOYANDO CAUSAS",
    slogan: "Tu ayuda, su bienestar",
    emoji: "💚",
    img: null,
    descripcion: "Formas de aportar tu tiempo, dinero o talento para causas que transforman: apoyo voluntario, asesoría a quien la necesita, bienestar comunitario, préstamo de libros y apoyo a mascotas.",
    proyectos: ["donaciones", "asesorias", "bienestar", "libros", "ecatepets"]
  },
  {
    id: "sumando-valores",
    titulo: "SUMANDO VALORES",
    slogan: "Valores que se multiplican",
    emoji: "✨",
    img: null,
    descripcion: "Proyectos que fortalecen el tejido comunitario desde distintos frentes: asesoría, alianzas, noticias de barrio, bienestar, mascotas y una red basada en la confianza.",
    proyectos: ["asesorias", "alianzas-tarjeta", "noticias", "bienestar", "ecatepets", "circulo-confianza"]
  }
];

// Las 4 formas de aportación — se reutilizan aquí y en la sección de Apoyo
// Voluntario más abajo, para no tener el mismo texto escrito dos veces.
export const OPCIONES_APORTACION = [
  { t: "Aportación Económica", d: "Solicita los datos bancarios de manera directa y segura.", m: "¡Hola DCUATES! Deseo realizar una Aportación Económica. ¿Me podrías proporcionar los datos seguros?" },
  { t: "Aportación en Especie", d: "Apoya donando herramientas, materiales o insumos útiles.", m: "¡Hola DCUATES! Quiero realizar una Aportación en Especie. ¿Qué tipo de herramientas o insumos se requieren actualmente?" },
  { t: "Trueque Solidario", d: "Intercambia productos o servicios de valor equivalente.", m: "¡Hola DCUATES! Me interesa el Trueque Solidario. Tengo productos/servicios para intercambiar a favor de la causa." },
  { t: "Labor Voluntaria", d: "Dona tu valioso tiempo y conocimientos para crecer juntos.", m: "¡Hola DCUATES! Quiero sumarme con Labor Voluntaria aportando mi tiempo y conocimientos comunitarios." }
];

// Contenido de "Quiénes Somos" — edítalo aquí, se usa en la nueva sección
// justo después de la portada.
export const QUIENES_SOMOS = {
  idea: "DCUATES nace como un programa de CONEXIONES CON CAUSA ♥ para conectar a vecinos, negocios y organizaciones de la comunidad, y así generar apoyos y beneficios mutuos reales, todos los días.",
  objetivos: ["Difundir de forma gratuita a negocios, personas y causas de la zona", "Facilitar el acceso a libros, asesorías y bienestar para todas las familias", "Conectar a quien necesita ayuda con quien puede darla, sin barreras", "Fortalecer el tejido social a través de alianzas ganar-ganar", "Apoyar a quienes AYUDAN a AYUDAR MÁS Y MEJOR !!!"],
  filosofia: "Creemos en la CADENA DE VALOR Y DE VALORES: cuando una persona o negocio suma su talento, tiempo o recursos, se multiplica el beneficio para todos. Ninguna aportación es demasiado pequeña.",
  colofon: "AYUDAR A QUIEN LO NECESITA ES UN GUSTO, UN PRIVILEGIO Y UNA BENDICIÓN; AYUDAR A QUIENES AYUDAN ES UNA GRAN BENDICIÓN, Y GENERAR APOYOS MUTUOS ES UNA LLUVIA DE BENDICIONES PARA TODOS !!!",
  firma: "ATTE: CONEXIONES CON CAUSA ♥"
};

// Contenido de los 4 botones verdes desplegables que van junto al video
// (entre la portada y la sección de Proyectos Base). Edítalo aquí.
export const MISION_VISION = {
  mision: "Conectar personas, negocios, causas y organizaciones de la comunidad para generar apoyos y beneficios mutuos reales, todos los días, sin costo y sin barreras.",
  vision: "Ser la red comunitaria de referencia donde cualquier persona o negocio de la zona encuentre, en un solo lugar, difusión gratuita, alianzas confiables y oportunidades de ayudar y ser ayudado.",
  filosofia: "Creemos en LA CADENA DE VALOR Y DE VALORES: cada aportación, por pequeña que parezca, se multiplica cuando se comparte con la comunidad."
};

export const COMO_SUMAR = {
  intro: "Si hay algo en lo que podamos APOYAR O SUMAR a tus proyectos, negocios o causas, escríbenos — con gusto vemos cómo conectar esfuerzos.",
  ventajas: "Sumarte a una RED CONFIABLE Y DE VALOR como DCUATES multiplica tu alcance: más ojos ven tu negocio o causa, más manos pueden ayudarte, y toda la comunidad sale ganando.",
  cierre: "Te invitamos a colaborar si hay algún proyecto DCUATES en el que te interese SUMARTE — dinos cuál y platicamos los siguientes pasos."
};

// Botón "Recibe Beneficios" del encabezado — abre un mini formulario de
// intereses y arma un mensaje de WhatsApp con lo seleccionado (sin backend:
// tú decides después si lo que envías es un boletín periódico o avisos
// puntuales). Para agregar/quitar un interés, solo edita este arreglo.
export const INTERESES_BENEFICIOS = [
  "Promociones y negocios locales",
  "Mascotas (adopciones y extravíos)",
  "Noticias y eventos del barrio",
  "Bienestar y actividades comunitarias",
  "Otros Beneficios y Apoyos/Voluntariado"
];

// =========================================================================
// 3. SUBCOMPONENTE: SITE HEADER
// =========================================================================
// Barra de búsqueda del encabezado (con lupa): busca por palabras en los
// proyectos, categorías, preguntas frecuentes y secciones de la página, y al
// elegir un resultado abre su ventana o baja hasta esa sección. Ignora
// acentos y mayúsculas ("asesoria" encuentra "Asesorías").
export const normalizarBusqueda = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const WA_OFICIAL_TXT = "5520696627";

export const WA_OFICIAL_URL = `https://wa.me/${WHATSAPP_NUMERO}`;

export const DEGRADADO_AVISOS = "linear-gradient(135deg,#e65100 0%,#ff8f00 100%)";

export const DEGRADADO_COMPARTIR = "linear-gradient(135deg,#17472d 0%,#1B6F8A 100%)";

export const DEGRADADO_SUGERENCIAS = "linear-gradient(135deg,#1B6F8A 0%,#7A5AD8 100%)";

export const DEGRADADO_DUDAS = "linear-gradient(135deg,#0b6e5f 0%,#25d366 100%)";

export const EMOJIS_INTERESES = ["🛍️", "🐾", "📰", "🧘", "🤝"];

// Trae los renglones reales de una tabla de Baserow a través de nuestra
// función serverless (/api/baserow-rows) — nunca habla con Baserow
// directamente desde el navegador. Si "tableId" está vacío, o la petición
// falla, o Baserow todavía no tiene filas, se queda con "itemsRespaldo"
// (los datos de ejemplo) sin romper nada.
// Trae los renglones "crudos" de la tabla ENLACES (uno por fila, con las
// columnas tal cual las nombraste en Baserow: VIDPORT, RECASA, RECOMUN,
// RECMUSIC, RECLIBROS, RECVIDEOSYMAS, GALCULTURA, GALSALUD, etc.). Si la tabla
// aún no responde o está vacía, regresa un arreglo vacío y quien la usa
// se queda con su propio respaldo — nunca rompe la página.
// Caché simple en memoria + sessionStorage (5 minutos) para no repetir la
// misma llamada a Baserow — este hook se usa más de una vez en la página
// (el video/recomendaciones arriba, y los botones de Apoyo/Recomendación
// más abajo), así que sin caché se disparaban 2 peticiones idénticas.
export const CACHE_ENLACES_MS = 5 * 60 * 1000;

// Decide qué mostrar dentro del modal según el id recibido: los 10 proyectos
// "normales" (con tarjeta propia), o los 2 casos especiales sin tarjeta
// (Ventas con Causa y Apoyo Voluntario/donaciones).
// Formulario de "Registra tu Solicitud": guarda el registro en Google Sheets
// (mismo Apps Script de Publicidad, con Tipo "Solicitud") y, en paralelo,
// abre WhatsApp con el mensaje ya escrito. Al terminar muestra el logo y un
// mensaje de agradecimiento.
export const TIPOS_DE_APOYO = [
  "Libros o materiales educativos",
  "Asesoría gratuita",
  "Mascotas (adopción, extravío o rescate)",
  "Apoyo en especie o económico",
  "Publicidad para mi negocio",
  "Apoyo voluntario",
  "Otro"
];
