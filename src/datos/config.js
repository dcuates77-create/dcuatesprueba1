// =========================================================================
// src/datos/config.js — Datos generales: números, enlaces y menús
// Solo datos: aquí se cambian textos sin tocar la lógica de la página.
// =========================================================================

// =========================================================================
// 1. CONFIGURACIÓN CENTRALIZADA DE VARIABLES, REDES Y HOJA DE CÁLCULO y BORRADO DE TODOS LOS ANTERIORES JSX CAMBIOS VIDEOS
// =========================================================================
export const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxngMxuH03w0rI7AyJHRap9QCVf_Xs5roypGXnnkSGr_22SyfxWAVAiH614r1eGC2DW2g/exec";

// Número de WhatsApp centralizado — cámbialo aquí una sola vez si cambia el teléfono
export const WHATSAPP_NUMERO = "525520696627";

// ID del video de portada en YouTube — reemplaza esto por el ID real de "Chuy el Sapo Soñador"
// (el ID es lo que va después de "v=" en la URL normal de YouTube)
export const YOUTUBE_VIDEO_ID = "SUnE27QnnyI";

// Mapa de negocios locales — embed de Google Maps / My Maps, se muestra
// debajo de los botones de Historias, Cupones y Patrocinadores. Para
// agregar, quitar o mover un negocio, edita el mapa directamente en Google
// Maps/My Maps y pega aquí el nuevo link de "Insertar un mapa" (src del
// iframe); no hace falta tocar nada más en el código.
// Sello de versión: se ve en pequeño al final de los accesos rápidos y en la
// consola del navegador. Sirve para comprobar que el celular ya cargó lo último.
export const VERSION_BUILD = "CLON10 · e14";

export const MAPA_NEGOCIOS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15034.541076557625!2d-99.00223799999999!3d19.600120500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ee234c038987%3A0x4b578513910d8103!2sJardines%20de%20Morelos%2C%20Ecatepec%20de%20Morelos%2C%20M%C3%A9x.!5e0!3m2!1ses!2smx!4v1790129394750!5m2!1ses!2smx";

// Ventana de Solicitudes — formulario visible directo en la página (no es
// modal), debajo del mapa de negocios (busca id="solicitudes" más abajo en
// el archivo). Para dirigir tráfico desde WhatsApp Business a esta sección
// exacta, comparte el link "dcuates.com/#solicitudes" (o el dominio que
// uses en cada rama/proyecto) — el navegador baja solo hasta ahí, sin
// necesitar nada de código extra.
//
// CÓMO CONFIGURARLO (nada de esto se toca en código, solo en Google):
// El formulario es propio (ver FormularioSolicitud más abajo): guarda cada
// solicitud en Google Sheets (el mismo Apps Script de GOOGLE_SHEETS_URL,
// con Tipo "Solicitud") y abre WhatsApp con el mensaje ya escrito.
export const REDES_SOCIALES = {
  facebook: "https://www.facebook.com/abelzarem/",
  instagram: "https://www.instagram.com/conexionesconcausa/",
  youtube: "http://www.youtube.com/@abelmeraz",
  tiktok: "https://www.tiktok.com/@dcuates"
};

// Barra fija de navegación: una sola fila de accesos directos + un menú
// "MÁS" con todo lo demás (se despliega hacia abajo). Para agregar/quitar
// algo del menú "MÁS", edita NAV_LINKS_MAS — no se necesita tocar el
// componente SiteHeader. Cada elemento de NAV_LINKS_MAS puede ser:
// - { label, href }   -> enlace normal a una sección de la página
// - { label, action: "faq" } -> abre la ventana de Preguntas Frecuentes
// - { label, modal }  -> abre la ventana emergente de ese proyecto (mismo
//   id que en TODOS_LOS_PROYECTOS)
export const NAV_LINKS_MAS = [
  { label: "Publicidad Gratuita", emoji: "📣", href: "#publicidad" },
  { label: "Ventas con Causa", emoji: "🛍️", href: "#ventas-con-causa" },
  { label: "Alianzas Solidarias", emoji: "🤝", modal: "alianzas-tarjeta" },
  { label: "Apoyo a Causas", emoji: "❤️", href: "#extraviados-registro" },
  { label: "Historias que inspiran (videos)", emoji: "🎥", href: "#historias-reflexiones" },
  { label: "Mapa del Sitio", emoji: "🗺️", action: "mapa-sitio" },
  { label: "Registra tu Solicitud", emoji: "📝", href: "#solicitudes" },
  { label: "Préstamo Gratuito de Libros", emoji: "📚", modal: "libros" },
  { label: "Ecatepets Mascotas", emoji: "🐾", modal: "ecatepets" },
  { label: "Círculo de Confianza", emoji: "👥", modal: "circulo-confianza" },
  { label: "Recomienda, Evalúa y Gana", emoji: "⭐", modal: "recomienda-evalua-gana" },
  { label: "Asesorías Gratuitas", emoji: "🎓", modal: "asesorias" },
  { label: "Bazar y Comercio", emoji: "🏪", modal: "bazares" },
  { label: "Noticias de Barrio", emoji: "📰", modal: "noticias" },
  { label: "Bienestar y Recreación", emoji: "🧘", modal: "bienestar" },
  { label: "Sugerencias y Quejas", emoji: "💬", action: "sugerencias" },
  { label: "Preguntas Frecuentes", emoji: "❓", action: "faq" }
];

// Items extra del Mapa de Sitio que NO abren un modal de proyecto, sino
// una acción especial (igual que en NAV_LINKS_MAS): FAQ y Sugerencias.
export const MAPA_SITIO_EXTRA = [
  { t: "PREGUNTAS FRECUENTES", accion: "faq", emoji: "❓" },
  { t: "SUGERENCIAS Y QUEJAS", accion: "sugerencias", emoji: "💬" },
  { t: "AVISO DE SEGURIDAD", accion: "seguridad", emoji: "⚠️" },
  { t: "ESCUDO DE SEGURIDAD", accion: "escudo", emoji: "🛡️" }
];

export const SECCIONES_BUSCABLES = [
  { t: "Registra tu Solicitud (formulario)", kw: "solicitud formulario pedir apoyo ayuda registro necesito whatsapp", id: "solicitudes" },
  { t: "Mapa de Negocios Locales", kw: "mapa negocios locales aliados ubicacion donde direccion", id: "mapa-negocios" },
  { t: "Video de Chuy, el Sapo Soñador", kw: "chuy sapo soñador video ejemplo donativos vida", id: "chuy-video" },
  { t: "Historias y reflexiones DCUATES (videos)", kw: "historias reflexiones videos testimonios inspiracion", id: "historias-reflexiones" },
  { t: "Publicidad Comunitaria (publica tu negocio)", kw: "publicidad publicar negocio servicio anunciar formulario gratis", id: "publicidad" },
  { t: "Ventas con Causa (catálogo)", kw: "ventas causa catalogo productos comprar apartar", id: "ventas-con-causa" },
  { t: "Mascotas, personas y cosas extraviadas", kw: "extraviados extraviado perdido mascota persona cosa registro adopcion", id: "extraviados-registro" },
  { t: "Aviso de Seguridad de la Comunidad", kw: "aviso seguridad fraude estafa suplantacion cuenta clabe pagos reglas encuentros baneo", id: "seguridad" },
  { t: "Escudo de Seguridad (cómo identificar el espacio seguro)", kw: "escudo seguridad fraude estafa seguro oficial whatsapp identificar proteccion", id: "escudo" }
];
