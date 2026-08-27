import React, { useState } from "react";

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
  { label: "Donaciones", href: "#donaciones" },
  { label: "Publicidad", href: "#publicidad" }
];

// Función helper para armar enlaces directos de WhatsApp de forma consistente
function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

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
    puntos: ["Perfiles verificados por confianza", "Beneficios y apoyos mutuos", "Red exclusiva de contactos"],
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

// =========================================================================
// 2. COMPONENTE PRINCIPAL (INICIO DEL RENDERIZADO)
// =========================================================================
export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-[#1b4332] font-sans antialiased text-slate-900 selection:bg-emerald-500/30 relative">

      {/* Botón Flotante Permanente de WhatsApp — efecto 3D + anillo parpadeante + etiqueta */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <span className="bg-emerald-100/60 text-emerald-900 text-[11px] sm:text-sm font-black uppercase tracking-wide px-3 py-2 rounded-full shadow-lg border border-emerald-700/20 whitespace-nowrap animate-pulse backdrop-blur-sm">
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
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
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
              { t: "ECATEPETS MASCOTAS", h: "#ecatepets", img: "/images/Ecatepets.png", puntos: [] },
              { t: "ALIANZAS SOLIDARIAS", h: "#iniciativas", img: "/images/Alianzas.png", puntos: [] },
              { t: "CÍRCULO DE CONFIANZA", h: "#circulo-confianza", img: "/images/Círculo.png", puntos: [] },
              { t: "RECOMIENDA, EVALÚA Y GANA", h: "#recomienda-evalua-gana", img: "/images/Recomienda.png", puntos: [] },
              { t: "PUBLICIDAD GRATIS", h: "#publicidad", img: "/images/Publicidad.png", puntos: [] },
              { t: "ASESORÍAS GRATUITAS", h: "#asesorias", img: "/images/Asesorías.png", puntos: [] },
              { t: "BAZAR Y COMERCIO", h: "#bazares", img: "/images/Bazar.png", puntos: [] },
              { t: "NOTICIAS DE BARRIO", h: "#noticias", img: "/images/Noticias.png", puntos: [] },
              { t: "BIENESTAR Y RECREACIÓN", h: "#bienestar", img: "/images/Bienestar.png", puntos: [] }
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

                {/* COLUMNA 3: 4 botones — Nuevos Proyectos */}
                <div className="lg:col-span-3 flex flex-col gap-3">
                  <div className="grid grid-rows-4 gap-3 flex-1">
                    {BOTONES_PORTADA.slice(6, 10).map((btn, idx) => <BotonProyecto key={idx} btn={btn} />)}
                  </div>
                </div>
              </>
            );
          })()}

          <p className="lg:col-span-6 lg:col-start-5 text-center text-lg sm:text-xl font-black text-[#0f2d1e] uppercase tracking-wider pt-2">
            ⚡ Proyectos Comunitarios DCUATES
          </p>

        </div>
      </section>

      {/* Nota: el video de portada (YOUTUBE_VIDEO_ID) queda reservado para su propia sección — aún no incluido aquí */}

      {/* SECCIÓN 1: LOS 4 PROYECTOS BASE */}
      <section id="iniciativas" className="bg-[#1b4332] text-white py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight mb-12 text-emerald-300">
            Nuestros Proyectos Originales
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {INICIATIVAS_PRINCIPALES.map((item) => (
              <div
                id={item.id}
                key={item.id}
                className="scroll-mt-24 rounded-3xl border-4 border-[#0f2d1e] bg-white p-6 text-slate-800 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] duration-200"
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
      <section id="nuevos-proyectos" className="bg-[#1b4332] text-white py-16 px-4 border-b-4 border-[#0f2d1e]">
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
                className="scroll-mt-24 rounded-3xl border-4 border-[#0f2d1e] bg-white p-6 text-slate-800 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] duration-200"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: APORTE VOLUNTARIO */}
      <section id="donaciones" className="bg-[#e8f5e9] text-[#0f2d1e] py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-12 items-center">

          <div className="md:col-span-5 space-y-5">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🟢 Apoyo Voluntario
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              TU APORTACIÓN IMPULSA A LA COMUNIDAD
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-bold">
              Cada donativo, del formato que decidas, nos ayuda a sostener y hacer crecer los proyectos que benefician a los negocios y familias latinas en conjunto con DCUATES.
            </p>
            <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 p-4 text-sm sm:text-base font-black text-emerald-900 leading-relaxed flex items-start gap-3 shadow-sm">
              <span className="text-xl">💡</span>
              <p className="text-justify uppercase tracking-wide">
                Parte de la utilidad de los proyectos se destina al apoyo de causas sociales, con total transparencia. Rendimos cuentas de cómo se usa cada aportación.
              </p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <p className="text-lg sm:text-2xl font-black uppercase tracking-widest text-[#0f2d1e]/80 mb-3 block">
              Selecciona tu tipo de aportación:
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
                className="w-full text-left rounded-2xl border-4 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-4 shadow-md transition-all hover:scale-[1.01] group duration-200 block"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">{opc.t}</p>
                    <p className="text-xs sm:text-sm font-bold text-[#0f2d1e] uppercase tracking-wide leading-none pt-1">{opc.d}</p>
                  </div>
                  <span className="text-xl text-white opacity-70 group-hover:opacity-100 transition-all pl-2">➔</span>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* SECCIÓN 4: FORMULARIO DE PUBLICIDAD */}
      <section id="publicidad" className="bg-[#1b4332] text-white py-16 px-4">
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
      <footer className="bg-slate-950 text-slate-400 py-10 text-center text-xs space-y-3 border-t border-emerald-950">
        <p>© {new Date().getFullYear()} DCUATES Comunidad, un programa de CONEXIONES CON CAUSA ♥</p>
        <p className="font-bold tracking-wide">TODOS LOS DERECHOS RESERVADOS</p>
        <div className="pt-1">
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-emerald-400 hover:text-emerald-300 font-black bg-transparent border-none cursor-pointer text-sm sm:text-base tracking-wide transition-colors"
          >
            👉 VER AVISO DE PRIVACIDAD OFICIAL 👈
          </button>
        </div>
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

    </div>
  );
}

// =========================================================================
// 3. SUBCOMPONENTE: SITE HEADER
// =========================================================================
function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-800/20 bg-white/95 backdrop-blur py-2 sm:py-3 px-4 shadow-sm text-slate-900 relative">
      <div className="mx-auto flex flex-wrap items-center gap-y-2 max-w-6xl">

        <a href="#inicio" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <span className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full overflow-hidden bg-[#0f2d1e] border-2 border-[#0f2d1e]/20 shadow-sm shrink-0">
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
          <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-xs font-black text-slate-600 lg:text-sm ml-8 lg:ml-12">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="hover:text-emerald-700 transition-colors uppercase tracking-wide">{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Facebook">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Instagram">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="YouTube">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="TikTok">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
            </svg>
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden font-bold text-xs bg-emerald-50 border border-emerald-800/20 px-3 py-2.5 rounded-lg text-emerald-950 shrink-0">
            {open ? "CERRAR" : "MENÚ"}
          </button>
        </div>
      </div>
      {/* Menú móvil: anclado justo debajo del header (top-full), nunca se encima con el contenido */}
      {open && (
        <div className="absolute top-full inset-x-0 bg-white z-50 flex flex-col p-6 md:hidden border-t border-emerald-800/20 shadow-lg">
          <nav className="flex flex-col gap-4 text-base font-bold">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b pb-2 uppercase text-slate-800 hover:text-emerald-700">{link.label}</a>
            ))}
          </nav>
        </div>
      )}
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




