import React, { useState, useEffect } from "react";

// =========================================================================
// 1. CONFIGURACIÓN CENTRALIZADA DE VARIABLES, REDES Y HOJA DE CÁLCULO
// =========================================================================
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxngMxuH03w0rI7AyJHRap9QCVf_Xs5roypGXnnkSGr_22SyfxWAVAiH614r1eGC2DW2g/exec";

// Número de WhatsApp centralizado — cámbialo aquí una sola vez si cambia el teléfono
const WHATSAPP_NUMERO = "525520696627";

// ID del video de portada en YouTube — reemplaza esto por el ID real de "Chuy el Sapo Soñador"
// (el ID es lo que va después de "v=" en la URL normal de YouTube)
const YOUTUBE_VIDEO_ID = "SUnE27QnnyI";

const REDES_SOCIALES = {
  facebook: "https://www.facebook.com/abelzarem/",
  instagram: "https://www.instagram.com/conexionesconcausa/",
  youtube: "http://www.youtube.com/@abelmeraz",
  tiktok: "https://www.tiktok.com/@dcuates"
};

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos Base", href: "#iniciativas" },
  { label: "Nuevos Proyectos", href: "#nuevos-proyectos" },
  { label: "Ventas con Causa", href: "#ventas-con-causa" },
  { label: "Apoyo Voluntario", href: "#donaciones" },
  { label: "Publicidad Gratuita", href: "#publicidad" }
];

// Función helper para armar enlaces directos de WhatsApp de forma consistente
function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

// Datos de EJEMPLO para la barra ticker inferior — reemplázalos por contenido real
// cuando tengas fotos/avisos definitivos. Los 4 tipos rotan automáticamente.
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
  momento: { emoji: "📸", label: "Momento DCUATES" }
};

// Arreglo de los 4 Proyectos Iniciales con Enlaces Directos de WhatsApp
const INICIATIVAS_PRINCIPALES = [
  {
    id: "libros",
    categoria: "EDUCACIÓN Y DESARROLLO",
    titulo: "LA BIBLIOBICI Y AMIGOS",
    descripcion: "Préstamo gratuito de libros y materiales educativos para el desarrollo personal y social. La lectura que llega hasta tu colonia para fortalecer a la COMUNIDAD.",
    puntos: ["Préstamo sin costo", "Materiales para todas las edades", "Recibimos y hacemos donaciones"],
    textoBoton: "Quiero participar",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa participar en el proyecto de La Bibliobici y Amigos.")
  },
  {
    id: "ecatepets",
    categoria: "BIENESTAR ANIMAL",
    titulo: "ECATEPETS",
    descripcion: "Apoyo en la búsqueda de mascotas extraviadas, y fomento de la adopción y el cuidado animal responsable en conjunto con los vecinos de DCUATES.",
    puntos: ["Difusión de extravíos", "Adopción responsable", "Cuidado y concientización"],
    textoBoton: "Sumarme a la causa",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Quiero sumarme a la causa de Ecatepets para el bienestar animal.")
  },
  {
    id: "alianzas-tarjeta",
    categoria: "CRECIMIENTO CONJUNTO",
    titulo: "ALIANZAS GANAR-GANAR",
    descripcion: "Emprendedores, organizaciones y particulares que desean hacer sinergia para crecer juntos y robustecer el tejido social de la COMUNIDAD.",
    puntos: ["Colaboración mutua", "Red de contactos", "Impacto comunitario"],
    textoBoton: "Generar alianza",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa generar una alianza ganar-ganar con ustedes.")
  },
  {
    id: "circulo-confianza",
    categoria: "APOYOS Y BENEFICIOS MUTUOS",
    titulo: "CÍRCULO DE CONFIANZA",
    descripcion: "Si eres una persona o negocio TOTALMENTE CONFIABLE que desea SUMAR con perfiles que están en la misma sintonía, o conoces personas o negocios que les gustaría formar parte de nuestro círculo, ¡serán muy BIENVENIDOS!",
    puntos: ["Perfiles verificados por confianza", "Sinergia que multiplica", "Red exclusiva de contactos"],
    textoBoton: "Me interesa sumar",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa sumarme al Círculo de Confianza y sus Apoyos y Beneficios Mutuos.")
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
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Deseo publicar mi negocio en la plataforma de publicidad comunitaria.")
  }
];

// Arreglo de los 4 Proyectos Nuevos con Enlaces Directos de WhatsApp
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
    textoBoton: "Ver agenda cultural",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Me interesa conocer la agenda cultural y las noticias del barrio.")
  },
  {
    id: "bienestar",
    categoria: "SALUD Y ESPARCIMIENTO",
    titulo: "Bienestar, Cultura y Recreación",
    descripcion: "Actividades recreativas y talleres enfocados en el desarrollo integral, la salud mental y el esparcimiento familiar.",
    puntos: ["Desarrollo Personal y Social", "Salud Integral", "Disfrute Personal y Social"],
    textoBoton: "Ver y sumar actividades",
    enlaceDirectoWA: enlaceWhatsApp("¡Hola DCUATES! Solicito información sobre los talleres de bienestar, cultura y recreación.")
  }
];

// Catálogo de "Ventas con Causa". Mientras no esté conectado a Baserow
// (ver BASEROW_TABLE_ID_VENTAS_CON_CAUSA abajo), el carrusel usa esta
// lista de EJEMPLO como respaldo. BASEROW_GALLERY_URL se deja como
// enlace — "ver catálogo completo" — apuntando a tu galería pública real.
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
const BASEROW_TABLE_ID_VENTAS_CON_CAUSA = "1164149"; // tabla "Productos"
const BASEROW_TABLE_ID_EXTRAVIADOS = "1165684";      // tabla "Servicios DC"
// =========================================================================

// Galerías de EJEMPLO para la prueba de "pasarela en ventana emergente"
// (ver GALERIAS_PROYECTOS y el modal correspondiente más abajo). Por ahora
// solo Noticias y Bienestar la tienen, a modo de prueba — si el resultado
// gusta, se puede replicar para cualquier otro proyecto agregando su propio
// arreglo aquí y una entrada en GALERIAS_PROYECTOS.
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

// Mapa que conecta cada id de proyecto con su galería y título de modal —
// así el botón "Ver galería" sabe qué mostrar sin más configuración.
const GALERIAS_PROYECTOS = {
  noticias: { titulo: "Agenda Cultural — Noticias de Barrio", items: NOTICIAS_GALERIA_ITEMS },
  bienestar: { titulo: "Actividades de Bienestar, Cultura y Recreación", items: BIENESTAR_GALERIA_ITEMS }
};

// =========================================================================
// 2. COMPONENTE PRINCIPAL (INICIO DEL RENDERIZADO)
// =========================================================================
export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [modalGaleria, setModalGaleria] = useState(null); // null | "noticias" | "bienestar"

  return (
    <div className="min-h-screen bg-[#17472d] font-sans antialiased text-slate-900 selection:bg-emerald-500/30 relative pb-28 sm:pb-24">

      {/* Barra Ticker Inferior Fija — combina negocios, mascotas, avisos y momentos */}
      <BarraTicker />

      {/* Botón Flotante Permanente de WhatsApp — efecto 3D + anillo parpadeante + etiqueta */}
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

      {/* Encabezado */}
      <SiteHeader />

      {/* SECCIÓN PORTADA / HERO — 3 columnas (texto+imagen | 4 botones | 4 botones) */}
      <section id="inicio" className="bg-[#e8f5e9] text-[#0f2d1e] py-12 px-4 md:py-16 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-7xl grid gap-6 items-stretch lg:grid-cols-10">

          {/* COLUMNA 1: Texto + Imagen Bibliobici */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 min-w-0">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#0f2d1e] leading-none">
                Juntos hacemos<br />COMUNIDAD
              </h1>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed text-justify font-medium">
                <strong>DCUATES</strong> impulsa proyectos, <strong>PERSONAS, ORGANIZACIONES Y EMPRENDIMIENTOS</strong> que <strong>BENEFICIAN a las FAMILIAS</strong>: <strong>PUBLICIDAD GRATUITA</strong> para tu negocio, préstamo de <strong>LIBROS</strong> y materiales <strong>EDUCATIVOS</strong>, apoyo a <strong>MASCOTAS Y GRUPOS VULNERABLES</strong>, y <strong>ALIANZAS GANAR-GANAR</strong> que generan apoyos y beneficios mutuos y comunitarios. Suma con tu valiosa colaboración o con tu invaluable <strong>APOYO VOLUNTARIO</strong> para lograr nuestros objetivos de forma más efectiva, y forjar <strong>LA CADENA DE VALOR Y DE VALORES</strong> que nos liberará de nuestras limitaciones para ser mejores, Y ASÍ MEJORAR NUESTRO ENTORNO Y NUESTRO MUNDO !!!
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border-4 border-[#0f2d1e]/30 bg-white shadow-lg flex-1">
              <img
                src="/images/bibliobici-movil.png"
                alt="Bibliobici Móvil DCUATES en la comunidad"
                className="w-full h-full min-h-[280px] sm:min-h-[420px] object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="p-12 text-center text-[#0f2d1e]/70 font-bold uppercase text-xs tracking-wider bg-emerald-50 h-full flex items-center justify-center min-h-[280px]">📷 [Espacio para Foto de la Bibliobici]</div>';
                }}
              />
            </div>
          </div>

          {/* Datos de los 8 botones — mismo orden en que aparecen los proyectos en sus bloques */}
          {(() => {
            const BOTONES_PORTADA = [
              { t: "PRÉSTAMO GRATUITO DE LIBROS", h: "#libros", img: "/images/bb.png", puntos: ["GRATUITO", "PÍDELO CON UN SOLO CLIC ;)", "SE ACEPTAN DONACIONES DE LIBROS Y MÁS..."] },
              { t: "ECATEPETS MASCOTAS", h: "#ecatepets", img: "/images/Ecatepets.png", puntos: ["DIFUSIÓN DE EXTRAVÍOS", "ADOPCIÓN RESPONSABLE", "CUIDADO Y CONCIENTIZACIÓN"] },
              { t: "ALIANZAS SOLIDARIAS", h: "#iniciativas", img: "/images/Alianzas.png", puntos: ["COLABORACIÓN MUTUA", "RED DE CONTACTOS", "IMPACTO COMUNITARIO"] },
              { t: "CÍRCULO DE CONFIANZA", h: "#circulo-confianza", img: "/images/Círculo.png", puntos: ["PERFILES VERIFICADOS POR CONFIANZA", "SINERGIA QUE MULTIPLICA", "RED EXCLUSIVA DE CONTACTOS"] },
              { t: "RECOMIENDA, EVALÚA Y GANA", h: "#recomienda-evalua-gana", img: "/images/Recomienda.png", puntos: ["RECOMENDACIONES CON VALOR REAL", "RECONOCIMIENTO POR TU EXPERIENCIA", "MEJORA CONTINUA DE NEGOCIOS"] },
              { t: "PUBLICIDAD GRATUITA", h: "#publicidad", img: "/images/Publicidad.png", puntos: ["REGISTRO GRATUITO", "COMPARTE PROMOCIONES E IMÁGENES", "MÁS CLIENTES DE TU ZONA"] },
              { t: "ASESORÍAS GRATUITAS", h: "#asesorias", img: "/images/Asesorías.png", puntos: ["ASESORÍA GRATUITA", "APORTACIÓN VOLUNTARIA", "IMPULSO DE METAS"] },
              { t: "BAZAR Y COMERCIO", h: "#bazares", img: "/images/Bazar.png", puntos: ["COMERCIO LOCAL SEGURO", "BARRIO DE CONFIANZA", "APOYO A CAUSAS"] },
              { t: "NOTICIAS DE BARRIO", h: "#noticias", img: "/images/Noticias.png", puntos: ["EVENTOS CULTURALES", "CONVOCATORIAS VECINALES", "ACONTECIMIENTOS SOCIALES"] },
              { t: "BIENESTAR Y RECREACIÓN", h: "#bienestar", img: "/images/Bienestar.png", puntos: ["DESARROLLO PERSONAL Y SOCIAL", "SALUD INTEGRAL", "DISFRUTE PERSONAL Y SOCIAL"] },
              { t: "VENTAS CON CAUSA", h: "#ventas-con-causa", img: "/images/VentasConCausa.png", puntos: ["PRODUCTOS Y SERVICIOS LOCALES", "CATÁLOGO SIEMPRE ACTUALIZADO", "CONTACTO DIRECTO POR WHATSAPP"] },
              { t: "APOYO VOLUNTARIO", h: "#donaciones", img: "/images/ApoyoVoluntario.png", puntos: ["ECONÓMICA, EN ESPECIE O TRUEQUE", "LABOR VOLUNTARIA", "TOTAL TRANSPARENCIA"] }
            ];

            const BotonProyecto = ({ btn }) => (
              <a
                href={btn.h}
                className="flex flex-col rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-md transition-all hover:scale-[1.02] overflow-hidden font-heading"
              >
                <div className="px-2 pt-3 pb-1 text-center border-b border-white/20">
                  <h4 className="uppercase font-black leading-tight text-xs sm:text-sm lg:text-base">
                    {btn.t}
                  </h4>
                </div>
                <div className="flex flex-1 items-center gap-2 px-2 py-2">
                  <div className="w-2/5 h-full flex items-center justify-center">
                    {btn.img && (
                      <img
                        src={btn.img}
                        alt=""
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
              </a>
            );

            return (
              <>
                {/* COLUMNA 2: 6 botones — Proyectos Base */}
                <div className="lg:col-span-3 grid grid-rows-6 gap-3">
                  {BOTONES_PORTADA.slice(0, 6).map((btn, idx) => <BotonProyecto key={idx} btn={btn} />)}
                </div>

                {/* COLUMNA 3: 6 botones — Nuevos Proyectos + Ventas con Causa + Apoyo Voluntario */}
                <div className="lg:col-span-3 grid grid-rows-6 gap-3">
                  {BOTONES_PORTADA.slice(6, 12).map((btn, idx) => <BotonProyecto key={idx} btn={btn} />)}
                </div>
              </>
            );
          })()}

          <p className="lg:col-span-6 lg:col-start-5 flex items-center justify-center gap-3 text-center text-4xl sm:text-5xl font-black text-[#0f2d1e] uppercase tracking-tight leading-none pt-2">
            <span>⭐</span> Proyectos Comunitarios DCUATES <span>⭐</span>
          </p>

        </div>
      </section>

      {/* Nota: el video de portada (YOUTUBE_VIDEO_ID) queda reservado para su propia sección — aún no incluido aquí */}

      {/* SECCIÓN 1: LOS 4 PROYECTOS BASE */}
      <section id="iniciativas" className="bg-[#17472d] text-white py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight mb-12 text-emerald-300">
            Nuestros Proyectos Originales
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {INICIATIVAS_PRINCIPALES.map((item) => (
              <div
                id={item.id}
                key={item.id}
                className={`scroll-mt-24 rounded-3xl border-4 border-[#0f2d1e] p-6 text-slate-800 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] duration-200 ${
                  item.id === "libros" || item.id === "alianzas-tarjeta" || item.id === "recomienda-evalua-gana" ? "bg-[#e8f5e9]" : "bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-[#0f2d1e]">
                      <p className="text-sm sm:text-lg font-black uppercase text-amber-700 tracking-wider">
                        {item.categoria}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-black text-[#0f2d1e] uppercase tracking-tight leading-tight">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify mb-4 pt-2 font-medium">
                    {item.descripcion}
                  </p>

                  <ul className="space-y-2 mb-6 pl-1">
                    {item.puntos.map((punto, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 uppercase">
                        <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Enlace directo a WhatsApp */}
                <a
                  href={item.enlaceDirectoWA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3 px-4 shadow-md transition-colors uppercase tracking-wide text-xs sm:text-sm font-heading block"
                >
                  {item.textoBoton}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: LOS 4 NUEVOS PROYECTOS SOCIALES */}
      <section id="nuevos-proyectos" className="bg-[#17472d] text-white py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight mb-3 text-emerald-300">
            Nuevos Proyectos Sociales
          </h2>
          <p className="text-center text-emerald-200/80 mb-12 max-w-xl mx-auto text-xs sm:text-sm font-bold uppercase tracking-wide">
            Ampliamos nuestro impacto con cuatro nuevos canales comunitarios unificados.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {NUEVOS_PROYECTOS_DATA.map((item) => (
              <div
                id={item.id}
                key={item.id}
                className={`scroll-mt-24 rounded-3xl border-4 border-[#0f2d1e] p-6 text-slate-800 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] duration-200 ${
                  item.id === "asesorias" || item.id === "noticias" ? "bg-[#e8f5e9]" : "bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <p className="text-sm sm:text-lg font-black uppercase text-amber-700 tracking-wider">
                        {item.categoria}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-black text-[#0f2d1e] uppercase tracking-tight leading-tight">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-justify mb-4 pt-2 font-medium">
                    {item.descripcion}
                  </p>

                  <ul className="space-y-2 mb-6 pl-1">
                    {item.puntos.map((punto, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 uppercase">
                        <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Enlace directo a WhatsApp */}
                <a
                  href={item.enlaceDirectoWA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3 px-4 shadow-md transition-colors uppercase tracking-wide text-xs sm:text-sm font-heading block"
                >
                  {item.textoBoton}
                </a>

                {/* Prueba: botón que abre una pasarela en ventana emergente (solo Noticias y Bienestar, por ahora) */}
                {GALERIAS_PROYECTOS[item.id] && (
                  <button
                    onClick={() => setModalGaleria(item.id)}
                    className="w-full mt-2 text-center rounded-xl border-2 border-[#0f2d1e] text-[#0f2d1e] hover:bg-[#0f2d1e] hover:text-white font-black py-2.5 px-4 transition-colors uppercase tracking-wide text-xs sm:text-sm font-heading block"
                  >
                    📷 Ver galería
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: VENTAS CON CAUSA */}
      <section id="ventas-con-causa" className="bg-[#e8f5e9] text-[#0f2d1e] py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🛍️ Ventas con Causa
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              Productos y servicios que también apoyan la comunidad
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-bold">
              Artículos y servicios de vecinos y negocios locales. Explora, cuéntanos qué te interesa o qué estás buscando, y te contactamos directo por WhatsApp.
            </p>
          </div>

          {/* Pasarela de Ventas con Causa — mismo formato de carrusel que Extraviados */}
          <div className="max-w-3xl mx-auto mb-4">
            <PasarelaVentasConCausa />
          </div>
          <p className="text-center text-xs sm:text-sm font-bold text-emerald-800 mb-10">
            ¿Quieres ver el catálogo completo y siempre actualizado?{" "}
            <a href={BASEROW_GALLERY_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-900">
              Ábrelo aquí
            </a>.
          </p>

          <div className="max-w-xl mx-auto">
            <FormularioVentasConCausa />
          </div>

          {/* Pasarela de mascotas, personas y cosas extraviadas */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="text-center mb-6 space-y-2">
              <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-base sm:text-xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
                🔎 Mascotas, Personas y Cosas Extraviadas
              </span>
              <p className="text-sm sm:text-base text-slate-700 font-bold max-w-xl mx-auto">
                Ayuda a la comunidad reconociendo estos casos, o repórtanos uno nuevo.
              </p>
            </div>

            <PasarelaExtraviados />

            <a
              href={enlaceWhatsApp("¡Hola DCUATES! Quiero reportar un caso de mascota, persona o cosa extraviada.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs sm:text-sm transition-all shadow-md font-heading"
            >
              Reportar un caso por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN: APORTE VOLUNTARIO */}
      <section id="donaciones" className="bg-[#e8f5e9] text-[#0f2d1e] py-20 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl flex flex-col md:grid md:grid-cols-12 gap-y-8 md:gap-x-10 md:gap-y-10">

          {/* Bloque 1: intro + CTA — fila 1 en escritorio (col. izquierda) */}
          <div className="order-1 md:order-none md:col-start-1 md:col-span-5 md:row-start-1 space-y-6">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🟢 Apoyo Voluntario
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              TU APORTACIÓN IMPULSA A LA COMUNIDAD
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-bold">
              Cada donativo, del formato que decidas, nos ayuda a sostener y hacer crecer los proyectos que benefician a los negocios y familias latinas en conjunto con DCUATES Y CONEXIONES CON CAUSA ♥
            </p>
            <p className="text-lg sm:text-xl font-black uppercase text-center text-white bg-[#e65100] border-4 border-[#0f2d1e] rounded-2xl py-4 px-5 shadow-md leading-snug">
              ¡Tu apoyo hoy es el cambio que nuestra comunidad necesita — súmate ahora! ♥
            </p>
          </div>

          {/* Bloque 2: selecciona tu tipo de aportación + botones — fila 1 en escritorio (col. derecha) */}
          <div className="order-4 md:order-none md:col-start-6 md:col-span-7 md:row-start-1 space-y-3">
            <p className="text-xl sm:text-3xl font-black uppercase tracking-wide text-[#0f2d1e] mb-4 block leading-tight">
              Selecciona el tipo de aportación que te agrade más:
            </p>
            {[
              { t: "Aportación Económica", d: "Solicita los datos bancarios de manera directa y segura.", m: "¡Hola DCUATES! Deseo realizar una Aportación Económica. ¿Me podrías proporcionar los datos seguros?" },
              { t: "Aportación en Especie", d: "Apoya donando herramientas, materiales o insumos útiles.", m: "¡Hola DCUATES! Quiero realizar una Aportación en Especie. ¿Qué tipo de herramientas o insumos se requieren actualmente?" },
              { t: "Trueque Solidario", d: "Intercambia productos o servicios de valor equivalente.", m: "¡Hola DCUATES! Me interesa el Trueque Solidario. Tengo productos/servicios para intercambiar a favor de la causa." },
              { t: "Labor Voluntaria", d: "Dona tu valioso tiempo y conocimientos para crecer juntos.", m: "¡Hola DCUATES! Quiero sumarme con Labor Voluntaria aportando mi tiempo y conocimientos comunitarios." }
            ].map((opc) => (
              <a
                key={opc.t}
                href={enlaceWhatsApp(opc.m)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left rounded-2xl border-4 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-4 sm:p-5 shadow-md transition-all hover:scale-[1.01] group duration-200 block"
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">{opc.t}</p>
                    <p className="text-sm sm:text-base font-bold text-[#0f2d1e] uppercase tracking-wide leading-snug pt-1">{opc.d}</p>
                  </div>
                  <svg
                    viewBox="0 0 100 60"
                    preserveAspectRatio="none"
                    className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 opacity-90 group-hover:opacity-100 transition-all drop-shadow"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 22 H58 V4 L96 30 L58 56 V38 H4 Z" fill="#ffffff" stroke="#0f2d1e" strokeWidth="6" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Bloque 3: transparencia — fila 2 en escritorio (col. izquierda), justo antes del video en móvil */}
          <div className="order-2 md:order-none md:col-start-1 md:col-span-5 md:row-start-2">
            <div className="h-full rounded-2xl bg-emerald-200 border-2 border-emerald-500/40 p-5 sm:p-6 text-base sm:text-lg font-black text-emerald-900 leading-relaxed flex items-start gap-3 shadow-sm">
              <span className="text-2xl">💡</span>
              <p className="text-justify uppercase tracking-wide">
                Rendimos cuentas de cómo se usa cada aportación con total transparencia. Parte de la utilidad de nuestros proyectos y de lo que los amigos y la comunidad suman se destina al apoyo de causas sociales como esta gran causa y ejemplo de vida y de lo que se puede lograr con la suma de voluntades, talentos y corazones solidarios ♥
              </p>
            </div>
          </div>

          {/* Bloque 4: flecha + video de Chuy — fila 2 en escritorio (col. derecha), justo después de la transparencia en móvil.
              col-start-6 (en vez de 7) para que la flecha quede pegada al cuadro de transparencia, sin columna vacía de por medio;
              col-span-7 (en vez de 6) le da más ancho al video, y por lo tanto también más alto. */}
          <div className="order-3 md:order-none md:col-start-6 md:col-span-7 md:row-start-2 flex flex-col md:flex-row items-center gap-2 md:gap-3">
            {/* Flecha con relleno naranja: apunta hacia abajo en móvil y hacia la derecha en escritorio */}
            <div className="flex justify-center items-center shrink-0" aria-hidden="true">
              <svg
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                className="w-14 h-24 sm:w-16 sm:h-28 md:w-20 md:h-36 rotate-90 md:rotate-0 drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 22 H58 V4 L96 30 L58 56 V38 H4 Z"
                  fill="#e65100"
                  stroke="#0f2d1e"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="w-full">
              <div className="rounded-2xl overflow-hidden border-4 border-[#0f2d1e] shadow-lg bg-black aspect-[4/3] sm:aspect-[16/10]">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                  title="Video de Chuy — DCUATES"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <a
                href="https://chuytrujillo.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block cursor-pointer rounded-2xl border-4 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-sm sm:text-base px-4 py-3.5 shadow-md transition-all hover:scale-[1.01] text-justify leading-snug"
              >
                Conoce la vida y obra de nuestro amigo y maestro de vida, Chuy, el Sapo Soñador aquí: https://chuytrujillo.blogspot.com/
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN 4: FORMULARIO DE PUBLICIDAD */}
      <section id="publicidad" className="bg-[#17472d] text-white py-16 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-block rounded-full bg-emerald-900/60 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-400">
              📢 Publicidad Comunitaria
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight text-emerald-300">
              Publica tu negocio gratis
            </h2>
            <p className="text-xs font-bold text-emerald-100/70 uppercase max-w-md mx-auto leading-relaxed">
              Comparte la información de tu negocio, sube imágenes de tus promociones y publicidad, y agrega tu página o redes sociales. Tu aportación voluntaria es bienvenida.
            </p>
          </div>
          <FormularioPublicidad />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#e8f5e9] text-[#0f2d1e] py-12 px-4 text-center space-y-8 border-t-4 border-[#0f2d1e]">

        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f2d1e] font-black text-white text-lg shrink-0">DC</span>
          <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
        </div>

        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#0f2d1e]/80 leading-relaxed font-medium">
          Proyectos SOCIALES Y EMPRENDEDORES que IMPULSAN a NUESTRAS COMUNIDADES. Parte de la utilidad se destina al apoyo de causas sociales, con total transparencia.
        </p>

        <div className="flex items-center justify-center gap-3">
          <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2d1e] text-white transition-colors hover:bg-emerald-800" title="Facebook">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2d1e] text-white transition-colors hover:bg-emerald-800" title="YouTube">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2d1e] text-white transition-colors hover:bg-emerald-800" title="Instagram">
            <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0f2d1e] text-white transition-colors hover:bg-emerald-800" title="TikTok">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
            </svg>
          </a>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base font-bold text-[#0f2d1e]/80">
          <a href="#iniciativas" className="hover:text-[#0f2d1e] transition-colors">Proyectos</a>
          <a href="#publicidad" className="hover:text-[#0f2d1e] transition-colors">Publicidad</a>
          <a href="#donaciones" className="hover:text-[#0f2d1e] transition-colors">Donaciones</a>
          <button
            onClick={() => setShowPrivacy(true)}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            Aviso de Privacidad
          </button>
        </nav>

        <p className="text-xs sm:text-sm text-[#0f2d1e]/60 pt-4 border-t border-[#0f2d1e]/20 max-w-md sm:max-w-lg mx-auto font-medium">
          © {new Date().getFullYear()} DCUATES, un programa de CONEXIONES CON CAUSA ♥.<br />
          Todos los derechos reservados.
        </p>
      </footer>

      {/* MODAL DEL AVISO DE PRIVACIDAD */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="text-xl font-bold uppercase tracking-tight border-b pb-3 mb-4 text-emerald-800 font-heading">
              Aviso de Privacidad Simplificado
            </h3>
            <div className="overflow-y-auto space-y-3 pr-2 text-sm text-slate-600 leading-relaxed text-justify font-medium">
              <p>
                En cumplimiento con la normativa de protección de datos, <strong>DCUATES</strong> le informa que los datos recabados en este formulario (Nombre de Negocio, Categoría y Enlaces Digitales) tienen la única y exclusiva finalidad de promover de forma comunitaria y gratuita sus actividades comerciales.
              </p>
              <p>
                Sus datos no serán vendidos, transferidos ni compartidos con terceros con fines de lucro. Al enviar la información y continuar la interacción en WhatsApp, usted acepta el tratamiento de los mismos para los fines de difusión colectiva estipulados en nuestras iniciativas de Apoyo al Emprendimiento.
              </p>
              <p>
                Usted puede solicitar la baja, rectificación o eliminación de los datos publicitados en cualquier momento poniéndose en contacto directo mediante nuestros canales oficiales de atención.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 w-full rounded-xl bg-emerald-700 text-white font-black py-3.5 text-center transition-colors hover:bg-emerald-800 uppercase text-xs tracking-wider font-heading"
            >
              Aceptar y Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE GALERÍA (prueba: pasarela dentro de una ventana emergente) */}
      {modalGaleria && GALERIAS_PROYECTOS[modalGaleria] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-[#e8f5e9] text-slate-900 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#0f2d1e]/15 pb-3 mb-4">
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#0f2d1e] font-heading pr-4">
                {GALERIAS_PROYECTOS[modalGaleria].titulo}
              </h3>
              <button
                onClick={() => setModalGaleria(null)}
                aria-label="Cerrar"
                className="shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-[#0f2d1e] text-white font-black hover:bg-emerald-800 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto pr-1">
              <Carrusel
                items={GALERIAS_PROYECTOS[modalGaleria].items}
                renderItem={(item) => <TarjetaCarrusel item={item} etiqueta={item.tipo} />}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// =========================================================================
// 3. SUBCOMPONENTE: SITE HEADER
// =========================================================================
function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-800/20 bg-white/95 backdrop-blur py-3 px-4 shadow-sm text-slate-900 relative">
      <div className="mx-auto flex flex-wrap items-center gap-y-2 max-w-6xl">

        {/* Logo + nombre — siempre primero, en la misma fila que las redes en móvil */}
        <a href="#inicio" className="order-1 flex items-center gap-3 shrink-0">
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full overflow-hidden bg-[#0f2d1e] border-2 border-[#0f2d1e]/20 shadow-sm shrink-0">
            <img
              src="/images/logo-circular.png"
              alt="Logo DCUATES"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="font-black text-white text-2xl">DC</span>';
              }}
            />
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
        </a>

        {/* Íconos de redes: comparten la primera fila con el logo (empujados a la derecha) en móvil; en escritorio, a la derecha del todo */}
        <div className="order-2 md:order-3 ml-auto flex items-center gap-2 sm:gap-3">
          <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Facebook">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Instagram">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="YouTube">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="TikTok">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
            </svg>
          </a>
        </div>

        {/* Menú tipo pestañas: en móvil ocupa toda la fila de abajo; en escritorio va entre el logo y las redes */}
        <nav className="order-3 md:order-2 w-full md:w-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black text-emerald-900 lg:text-sm md:ml-6 lg:ml-10">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full border-2 border-transparent bg-emerald-50 hover:bg-[#0f2d1e] hover:text-white hover:border-[#0f2d1e] transition-colors uppercase tracking-wide text-center leading-tight px-3 py-1.5 sm:px-4 sm:py-2"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// =========================================================================
// 4. SUBCOMPONENTE: FORMULARIO DE PUBLICIDAD
// =========================================================================
function FormularioPublicidad() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [canal1, setCanal1] = useState("");
  const [canal2, setCanal2] = useState("");
  const [canal3, setCanal3] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fecha = new Date().toLocaleString();

    // Apps Script (doPost) lee e.parameter.X, así que se envía como
    // application/x-www-form-urlencoded — NO como JSON.
    const datosFormulario = new URLSearchParams({
      Nombre: contacto,
      Negocio: nombre,
      Giro: categoria,
      Telefono: telefono,
      Fecha: fecha
    });

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: datosFormulario
      });
    } catch (err) {
      console.error("Error guardando respaldo en Sheets:", err);
    }

    const mensaje = `¡Hola DCUATES!\n\nSolicito el registro de publicidad para mi negocio:\n• Contacto: ${contacto}\n• Negocio: ${nombre}\n• Categoría: ${categoria}\n• Teléfono: ${telefono}\n• Enlace 1: ${canal1 || "No especificado"}\n• Enlace 2: ${canal2 || "No especificado"}\n• Canal 3: ${canal3 || "No especificado"}\n\nA continuación adjunto mis imágenes promocionales.`;
    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener,noreferrer');

    // Limpiar el formulario para dejarlo listo para un nuevo registro
    setContacto("");
    setTelefono("");
    setNombre("");
    setCategoria("");
    setCanal1("");
    setCanal2("");
    setCanal3("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-slate-800 border-4 border-[#0f2d1e] p-6 rounded-3xl space-y-4 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Nombre de contacto</label>
          <input type="text" value={contacto} onChange={e => setContacto(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Juan Pérez" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Teléfono</label>
          <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. 5512345678" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Nombre del negocio</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Taquería El Sol" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Giro / Categoría</label>
          <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Restaurante, Salón, Tienda" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800">ENLACES Y REDES DIGITALES</label>
        <input type="text" value={canal1} onChange={e => setCanal1(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="1. Página principal o Correo Electrónico" />
        <input type="text" value={canal2} onChange={e => setCanal2(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="2. Perfil o Página de Facebook (Opcional)" />
        <input type="text" value={canal3} onChange={e => setCanal3(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="3. Cualquier otra Red Social (Opcional)" />
      </div>
      <button type="submit" className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs transition-all mt-2 shadow-md font-heading">
        Enviar registro
      </button>
    </form>
  );
}

// =========================================================================
// 4B. SUBCOMPONENTE: FORMULARIO DE VENTAS CON CAUSA
// =========================================================================
function FormularioVentasConCausa() {
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [meInteresa, setMeInteresa] = useState("");
  const [estoyBuscando, setEstoyBuscando] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fecha = new Date().toLocaleString();

    // Mismo patrón que FormularioPublicidad: se envía como
    // application/x-www-form-urlencoded al Apps Script (doPost).
    // Nota: el Apps Script necesita distinguir estos registros de los de
    // Publicidad — por eso se agrega el campo "Tipo". Si el Sheet actual
    // no lo contempla, conviene sumar una columna "Tipo" (o una pestaña
    // aparte) en la hoja de cálculo para que no se mezclen los datos.
    const datosFormulario = new URLSearchParams({
      Tipo: "VentasConCausa",
      Nombre: contacto,
      Telefono: telefono,
      MeInteresa: meInteresa,
      EstoyBuscando: estoyBuscando,
      Fecha: fecha
    });

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: datosFormulario
      });
    } catch (err) {
      console.error("Error guardando respaldo en Sheets:", err);
    }

    const mensaje = `¡Hola DCUATES!\n\nEsto es lo que me interesa de Ventas con Causa:\n• Contacto: ${contacto}\n• Teléfono: ${telefono}\n• Me interesa: ${meInteresa || "No especificado"}\n• Estoy buscando: ${estoyBuscando || "No especificado"}`;
    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener,noreferrer');

    setContacto("");
    setTelefono("");
    setMeInteresa("");
    setEstoyBuscando("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-slate-800 border-4 border-[#0f2d1e] p-6 rounded-3xl space-y-4 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Nombre de contacto</label>
          <input type="text" value={contacto} onChange={e => setContacto(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. María López" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Teléfono</label>
          <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. 5512345678" />
        </div>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 mb-1">¿Qué artículo o servicio te interesa? (nombre y/o clave)</label>
        <textarea value={meInteresa} onChange={e => setMeInteresa(e.target.value)} rows={2} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium resize-none" placeholder="Ej. Me interesan las artesanías bordadas" />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 mb-1">¿Qué estás buscando?</label>
        <textarea value={estoyBuscando} onChange={e => setEstoyBuscando(e.target.value)} rows={2} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium resize-none" placeholder="Ej. Busco quién pueda hacer reparaciones de bicicletas" />
      </div>
      <button type="submit" className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs transition-all mt-2 shadow-md font-heading">
        Enviar registro
      </button>
    </form>
  );
}

// =========================================================================
// 4C. SUBCOMPONENTE GENÉRICO: CARRUSEL AUTOMÁTICO (con pausa y flechas manuales)
// =========================================================================
// Reutilizable: gira solo de derecha a izquierda cada "intervaloMs", se
// puede pausar/reanudar, y se puede navegar manualmente con las flechas o
// los puntos (al usar cualquier control manual, se pausa solo, para no
// pelear con quien lo está viendo). "renderItem" decide cómo se ve cada
// tarjeta — así el mismo carrusel sirve para Extraviados, Ventas con
// Causa, o cualquier otra pasarela futura.
function Carrusel({ items, renderItem, intervaloMs = 4000 }) {
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervaloMs);
    return () => clearInterval(id);
  }, [pausado, items.length, intervaloMs]);

  // Precarga en segundo plano todas las fotos del carrusel apenas
  // llegan (o cambian) los items, para que ya estén en caché del
  // navegador cuando el carrusel las quiera mostrar (evita el
  // parpadeo/foto en blanco en la primera visita al sitio).
  useEffect(() => {
    items.forEach((item) => {
      if (item.img) {
        const imgPrecarga = new Image();
        imgPrecarga.src = resolverSrcImagen(item.img);
      }
    });
  }, [items]);

  const anterior = () => { setIndex((i) => (i - 1 + items.length) % items.length); setPausado(true); };
  const siguiente = () => { setIndex((i) => (i + 1) % items.length); setPausado(true); };

  const item = items[index];

  return (
    <div className="rounded-2xl border-4 border-[#0f2d1e] bg-white overflow-hidden shadow-md">
      <div className="relative flex items-center">

        <button
          onClick={anterior}
          aria-label="Anterior"
          className="absolute left-2 z-10 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/90 border-2 border-[#0f2d1e] text-[#0f2d1e] font-black shadow-md hover:bg-emerald-50 transition-colors"
        >
          ‹
        </button>

        {renderItem(item)}

        <button
          onClick={siguiente}
          aria-label="Siguiente"
          className="absolute right-2 z-10 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/90 border-2 border-[#0f2d1e] text-[#0f2d1e] font-black shadow-md hover:bg-emerald-50 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-3 border-t border-[#0f2d1e]/10 bg-emerald-50/60">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setPausado(true); }}
            aria-label={`Ir al elemento ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-emerald-700" : "bg-emerald-700/30"}`}
          />
        ))}
        <button
          onClick={() => setPausado((p) => !p)}
          className="ml-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
        >
          {pausado ? "▶ Reanudar" : "❚❚ Pausar"}
        </button>
      </div>
    </div>
  );
}

// Tarjeta compartida por ambas pasarelas (extraviados y ventas con causa) —
// misma estructura visual, cambia solo la etiqueta y el pie de foto.
// Las fotos que vienen de Baserow (URLs de S3) pasan por nuestro propio
// "puente" (/api/imagen-proxy) para evitar bloqueos del navegador del
// visitante. Las rutas locales de marcador de posición (/images/...) se
// usan tal cual, sin pasar por el puente. La usan tanto la tarjeta como
// la precarga del carrusel, para no repetir la misma lógica dos veces.
function resolverSrcImagen(img) {
  if (!img) return img;
  return img.startsWith("http") ? `/api/imagen-proxy?url=${encodeURIComponent(img)}` : img;
}

function TarjetaCarrusel({ item, etiqueta, mostrarDetallesVenta = false }) {
  const srcImagen = resolverSrcImagen(item.img);

  return (
    <div className="w-full grid sm:grid-cols-2">
      <div className="aspect-video sm:aspect-square bg-emerald-100">
        <img
          key={item.id || srcImagen}
          src={srcImagen}
          alt={item.nombre}
          className="w-full h-full object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <div className="p-5 flex flex-col justify-center gap-2">
        <span className="inline-block w-fit rounded-full bg-emerald-200 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-800">
          {etiqueta}
        </span>
        <p className="text-lg sm:text-xl font-black text-[#0f2d1e] uppercase leading-tight">{item.nombre}</p>
        {item.codigo && (
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Código: {item.codigo}</p>
        )}
        <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.descripcion}</p>
        {mostrarDetallesVenta && (
          <div className="mt-1 space-y-1">
            {item.precio && (
              <p className="text-base font-black text-[#0f2d1e]">
                ${item.precio} <span className="font-medium text-xs text-slate-600">MXN</span>
              </p>
            )}
            {item.proveedor && (
              <p className="text-xs font-bold text-slate-600">Proveedor: {item.proveedor}</p>
            )}
            {item.notas && (
              <p className="text-xs text-slate-500 italic">{item.notas}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Trae los renglones reales de una tabla de Baserow a través de nuestra
// función serverless (/api/baserow-rows) — nunca habla con Baserow
// directamente desde el navegador. Si "tableId" está vacío, o la petición
// falla, o Baserow todavía no tiene filas, se queda con "itemsRespaldo"
// (los datos de ejemplo) sin romper nada.
function useCatalogoBaserow(tableId, itemsRespaldo) {
  const [items, setItems] = useState(itemsRespaldo);

  useEffect(() => {
    if (!tableId) return; // sin Table ID configurado: nos quedamos con el respaldo
    let cancelado = false;

    fetch(`/api/baserow-rows?table=${encodeURIComponent(tableId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelado && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {
        // Sin conexión, token aún no configurado, etc. — nos quedamos con el respaldo.
      });

    return () => { cancelado = true; };
  }, [tableId]);

  return items;
}

function PasarelaExtraviados() {
  const items = useCatalogoBaserow(BASEROW_TABLE_ID_EXTRAVIADOS, EXTRAVIADOS_ITEMS);
  return (
    <Carrusel
      items={items}
      renderItem={(item) => (
        <TarjetaCarrusel item={item} etiqueta={item.tipo ? `${item.tipo} extraviad${item.tipo === "Persona" ? "a" : "o"}` : ""} />
      )}
    />
  );
}

function PasarelaVentasConCausa() {
  const items = useCatalogoBaserow(BASEROW_TABLE_ID_VENTAS_CON_CAUSA, VENTAS_CON_CAUSA_ITEMS);
  return (
    <Carrusel
      items={items}
      renderItem={(item) => (
        <TarjetaCarrusel item={item} etiqueta={item.tipo} mostrarDetallesVenta />
      )}
    />
  );
}

// =========================================================================
// 5. SUBCOMPONENTE: BARRA TICKER INFERIOR (negocios / mascotas / avisos / momentos)
// =========================================================================
// Una sola fila del ticker — recibe su propio índice para poder mostrar
// dos filas simultáneas desfasadas entre sí (ver BarraTicker más abajo).
function FilaTicker({ index, onClose, mostrarCerrar }) {
  const item = TICKER_ITEMS[index];
  const etiqueta = TICKER_ETIQUETAS[item.tipo];
  const esExterno = item.enlace && item.enlace.startsWith("http");

  return (
    <div className="mx-auto max-w-6xl flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1.5">

      <span className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 shrink-0 border-r border-emerald-700/50 pr-3">
        <span>{etiqueta.emoji}</span> {etiqueta.label}
      </span>

      <a
        key={index}
        href={item.enlace || "#"}
        target={esExterno ? "_blank" : undefined}
        rel={esExterno ? "noopener noreferrer" : undefined}
        className="flex-1 flex items-center gap-3 text-white overflow-hidden min-w-0"
      >
        <span className="sm:hidden text-lg shrink-0">{etiqueta.emoji}</span>
        {item.img && (
          <img
            src={item.img}
            alt=""
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover shrink-0 border border-white/20"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <span className="text-xs sm:text-sm font-bold truncate">
          {item.texto || item.nombre}
        </span>
      </a>

      <div className="hidden sm:flex items-center gap-1 shrink-0">
        {TICKER_ITEMS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-emerald-300" : "bg-emerald-700/60"}`}
          />
        ))}
      </div>

      {mostrarCerrar && (
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white text-xl leading-none shrink-0 pl-1"
          title="Cerrar barra"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Barra ticker inferior fija, con DOS filas simultáneas que rotan de forma
// independiente (desfasadas a la mitad del arreglo) para mostrar el doble
// de contenido sin esperar tanto tiempo entre anuncios.
function BarraTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 4500);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  // La segunda fila va desfasada a la mitad del arreglo para no repetir
  // exactamente el mismo anuncio que la primera fila al mismo tiempo.
  const indexFila2 = (index + Math.floor(TICKER_ITEMS.length / 2)) % TICKER_ITEMS.length;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#17472d] border-t-2 border-emerald-700/50 shadow-[0_-4px_12px_rgba(0,0,0,0.25)] divide-y divide-emerald-800/40">
      <FilaTicker index={index} mostrarCerrar={false} />
      <FilaTicker index={indexFila2} onClose={() => setVisible(false)} mostrarCerrar={true} />
    </div>
  );
}