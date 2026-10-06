import React, { useState, useEffect } from "react";
import { BarraLogros, BarraPatrocinadores, BarraTicker, TickerFrases } from "./componentes/barras.jsx";
import { BarraAccionesFinal, BotonNecesidades, SiteHeader } from "./componentes/encabezado.jsx";
import { FormularioPublicidad, FormularioSolicitud, FormularioVentasConCausa } from "./componentes/formularios.jsx";
import { BotonCerrar, ModalAvisoSeguridad, ModalEscudoSeguridad, ModalLegal } from "./componentes/legal.jsx";
import { BotonNaranjaDesplegable, BotonesNaranjasSeccion, BotonesRetosRegalos, Carrusel, FlechaBlanca, IframeVideo, MiniaturaVideo, PasarelaExtraviados, PasarelaVentasConCausa } from "./componentes/media.jsx";
import { BotonVerdeInfo, ContenidoModalProyecto, ModalCategoria, ModalCompartirMas, ModalDudas, ModalFormularioWhatsApp, ModalMapaSitio } from "./componentes/ventanas.jsx";
import { LOGROS_ITEMS, RECOMENDACIONES_ESTRELLA } from "./datos/cintas.js";
import { MAPA_NEGOCIOS_EMBED_URL, REDES_SOCIALES, VERSION_BUILD, WHATSAPP_NUMERO, YOUTUBE_VIDEO_ID } from "./datos/config.js";
import { AVISO_PRIVACIDAD_INTEGRAL, FAQ_ITEMS, TERMINOS_CONDICIONES } from "./datos/legal.js";
import { TODOS_LOS_PROYECTOS } from "./datos/listas.js";
import { BOTONES_PORTADA, CATEGORIAS_PROYECTOS, COMO_SUMAR, DEGRADADO_SUGERENCIAS, LOGOS_EXTRA_MODAL, MISION_VISION, QUIENES_SOMOS, RESUMEN_PROYECTO } from "./datos/proyectos.js";
import { detectarVideo, enlaceWhatsApp, esPDF, galeriaDesdeColumna, irASeccion, paresBaserow, primerosValores, resolverSrcImagen, tituloProyecto, urlDesdeCeldaBaserow, useCarruselAutomatico, useFilasEnlaces } from "./utilidades/baserow.js";
import BloqueCentral from "./BloqueCentral";
import BotonCompartir from "./BotonCompartir";
import { iniciarAnalitica, registrar } from "./analitica";
import { iniciarPWA } from "./pwa";

if (typeof console !== "undefined") console.info("[DCUATES] versión", VERSION_BUILD);

// =========================================================================
// 2. COMPONENTE PRINCIPAL (INICIO DEL RENDERIZADO)
// =========================================================================
export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerminos, setShowTerminos] = useState(false);
  const [showSeguridad, setShowSeguridad] = useState(false);
  const [showEscudo, setShowEscudo] = useState(false);
  useEffect(() => {
    const alPedir = (e) => {
      if (e.detail === "privacidad") setShowPrivacy(true);
      else if (e.detail === "terminos") setShowTerminos(true);
      else if (e.detail === "seguridad") setShowSeguridad(true);
      else if (e.detail === "escudo") setShowEscudo(true);
    };
    window.addEventListener("dcuates:abrir-legal", alPedir);
    return () => window.removeEventListener("dcuates:abrir-legal", alPedir);
  }, []);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showDudas, setShowDudas] = useState(false);
  // Modal del Mapa de Sitio — tarjetas con acceso directo a todo lo que
  // hay en la página (accesible desde el pie de página y el menú "Más").
  const [showMapaSitio, setShowMapaSitio] = useState(false);
  // Categoría abierta (portada simplificada de 4 botones) — null = cerrada.
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);
  // Ventana emergente única para los 12 botones naranjas de portada.
  // null = cerrada; si tiene un id (ej. "libros", "ecatepets", "ventas-con-causa",
  // "donaciones") se abre con la información de ese proyecto.
  const [modalProyecto, setModalProyecto] = useState(null);
  // Analítica: cuenta visitas y registra qué proyectos se abren.
  useEffect(() => { iniciarAnalitica(); iniciarPWA(); }, []);
  useEffect(() => { if (modalProyecto) registrar("proyecto_abrir", { id: String(modalProyecto) }); }, [modalProyecto]);
  // ¿Ya respondió Baserow (bien o mal)? Mientras no, se muestran esqueletos.
  const [baserowListo, setBaserowListo] = useState(() => typeof window !== "undefined" && !!window.__dcuatesBaserow);
  useEffect(() => {
    const listo = () => setBaserowListo(true);
    window.addEventListener("dcuates:baserow-estado", listo);
    const tope = setTimeout(listo, 8000);
    return () => { window.removeEventListener("dcuates:baserow-estado", listo); clearTimeout(tope); };
  }, []);
  // Enlaces con # que abren la ventana de un proyecto:
  //   dcuates.com/#proyecto-libros  (el que se comparte)  y  dcuates.com/#libros
  // (el de la barra de logros). Los ids de secciones de la página (#donaciones,
  // #solicitudes…) no abren ventana: los maneja BloqueCentral.
  useEffect(() => {
    const IDS_DE_SECCION = new Set(["donaciones", "chuy-video", "extraviados-registro", "quienes-somos", "solicitudes", "recursos", "mapa-negocios", "ventas-con-causa", "publicidad", "retos-regalos", "inicio", "historias-reflexiones"]);
    const abrir = () => {
      const h = decodeURIComponent(window.location.hash || "");
      if (h.length < 2) return;
      let id = h.slice(1);
      if (id === "avisos") { window.dispatchEvent(new Event("dcuates:abrir-avisos")); return; }
      if (id === "compartir") { setModalFormulario("comparte"); return; }
      if (id === "seguridad") { setShowSeguridad(true); return; }
      if (id === "escudo") { setShowEscudo(true); return; }
      if (id.startsWith("proyecto-")) id = id.slice("proyecto-".length);
      else if (IDS_DE_SECCION.has(id)) return;
      if (BOTONES_PORTADA.some((b) => b.modal === id) || TODOS_LOS_PROYECTOS.some((x) => x.id === id)) setModalProyecto(id);
    };
    abrir();
    window.addEventListener("hashchange", abrir);
    return () => window.removeEventListener("hashchange", abrir);
  }, []);
  // Búsqueda: vive aquí (no dentro de SiteHeader) para poder abrirla desde
  // cualquier parte de la página (ej. el acceso rápido de "Registra tu
  // Solicitud"), además del botón del encabezado.
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);

  // Formulario de "Registra tu Solicitud" (junto al mapa): ahora es propio y
  // siempre se ve completo.
  const [solicitudExpandida, setSolicitudExpandida] = useState(true);
  // Botones naranjas junto a los carruseles de Ventas con Causa y de
  // Extraviados: agrupados en un solo botón resumen debajo del carrusel.
  const [ventasResumenAbierto, setVentasResumenAbierto] = useState(false);
  const [extraviadosResumenAbierto, setExtraviadosResumenAbierto] = useState(false);
  // Botón flotante "Subir" + barra de progreso de lectura (aparecen solo
  // después de bajar un poco en la página).
  const [mostrarSubir, setMostrarSubir] = useState(false);
  const [progresoLectura, setProgresoLectura] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const pct = alto > 0 ? Math.min(100, Math.max(0, (window.scrollY / alto) * 100)) : 0;
      setProgresoLectura(pct);
      setMostrarSubir(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Enlaces con "#algo" (ej. dcuatesmini.vercel.app/#solicitudes): la página
  // se dibuja con React DESPUÉS de cargar, así que el navegador no encuentra
  // la sección a tiempo y se queda arriba. Aquí, al entrar, esperamos a que
  // exista y bajamos hasta ella (reintentando unos segundos, porque el
  // contenido de Baserow puede mover la altura de la página al cargar).
  // Si el "#algo" es el id de un proyecto (ej. #ecatepets), abre su ventana.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!id) return;
    let intentos = 0;
    const timer = setInterval(() => {
      intentos += 1;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(timer);
      } else if (TODOS_LOS_PROYECTOS.some((p) => p.id === id)) {
        setModalProyecto(id);
        clearInterval(timer);
      } else if (intentos >= 20) {
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);
  // Formulario emergente reutilizable: null = cerrado; "sugerencias" abre el
  // de Sugerencias y Quejas (pie de página / menú "MÁS"); "comparte" abre el
  // de Conocer y Compartir Más (desde el botón naranja "Compartir Más" del encabezado).
  const [modalFormulario, setModalFormulario] = useState(null);
  // Id de YouTube del video que se está viendo en grande (ventana flotante),
  // al tocar una miniatura de la barra de videos de portada.
  const [videoEnGrande, setVideoEnGrande] = useState(null);
  // Controla si el párrafo largo de la portada se ve completo o resumido
  // en pantallas pequeñas (para que se necesite menos scroll en celular).
  const [heroExpandido, setHeroExpandido] = useState(false);
  // Controla si el bloque de "Quiénes Somos" se ve resumido (3 líneas) o
  // completo, con su propio botón "Mostrar más".
  const [quienesExpandido, setQuienesExpandido] = useState(false);
  // Tarjetas "Nuestra Misión" y "Cómo Podemos Sumar" — mismo formato que
  // Quiénes Somos (expandir/mostrar más), ya no son botones verdes.
  const [misionExpandida, setMisionExpandida] = useState(false);
  // Controla cuál de los 4 botones verdes desplegables (Nuestra Misión,
  // Cómo Podemos Sumar, Preguntas Frecuentes, Aviso de Privacidad) está
  // abierto junto al video. null = ninguno abierto; solo uno a la vez.
  const [infoAbierta, setInfoAbierta] = useState(null);

  // Filas "crudas" de la tabla ENLACES en Baserow — alimentan el video de
  // portada, las recomendaciones y el botón de Música/Libros/Pelis.
  const filasEnlaces = useFilasEnlaces();
  // Miniaturas de video de portada — igual que Recomendaciones: cada video
  // puede tener un nombre en la columna "NOMBRE VIDPORT"; si no lo tiene,
  // se numera solo como "Video 1", "Video 2"... Reconoce YouTube y TikTok
  // (ver detectarVideo más abajo en el archivo).
  const videosPortada = paresBaserow(filasEnlaces, "NOMBRE VIDPORT", "VIDPORT", 20)
    .map((v) => ({ video: detectarVideo(v.enlace), nombre: v.nombre }))
    .filter((v) => v.video);
  const videosPortadaFinal = videosPortada.length > 0 ? videosPortada : [{ video: { plataforma: "youtube", id: YOUTUBE_VIDEO_ID }, nombre: "Video de presentación DCUATES" }];
  // Rotación automática de la barra de Historias y reflexiones (misma
  // lógica que Patrocinadores): se pausa sola en cuanto alguien la toca.
  const carruselHistorias = useCarruselAutomatico(videosPortadaFinal.length);

  // Retos, Regalos y Reconocimientos — carrusel de fotos desde la columna
  // "RETOSGALERIA" (Archivo/Adjunto, igual que "MUSICA") y videos
  // relacionados desde "NOMBRE RETOSVID" / "RETOSVID" (mismo patrón que
  // los videos de portada, también reconoce YouTube, TikTok y Facebook).
  // Mientras no subas nada a esas columnas, estas listas simplemente salen
  // vacías y la sección lo indica.
  const galeriaRetos = galeriaDesdeColumna(filasEnlaces, "RETOSGALERIA", 10, "Retos");
  const videosRetos = paresBaserow(filasEnlaces, "NOMBRE RETOSVID", "RETOSVID", 8)
    .map((v) => ({ video: detectarVideo(v.enlace), nombre: v.nombre }))
    .filter((v) => v.video);

  // Carrusel de portada de cada pestaña (un cuadro cada 3 segundos). Para cada
  // pestaña (NOSOTROS, BENEFICIOS, CAUSAS, VALORES, REGALOS, GRATITUD), en la
  // tabla ENLACES de Baserow:
  //  - "PORTADA <PESTAÑA>"  (columna Archivo): una imagen o un PDF por fila.
  //    Opcional: "NOMBRE PORTADA <PESTAÑA>" como texto al pie del cuadro.
  //  - "VIDEOS <PESTAÑA>" (texto/URL): un enlace de video por fila.
  //    Opcional: "NOMBRE VIDEOS <PESTAÑA>" como texto al pie del cuadro.
  //  Pestañas: NOSOTROS, BENEFICIOS, CAUSAS, VALORES, NEGOCIOS, REGALOS, GRATITUD.
  // En CAUSAS se suman además los videos de RETOSVID (el carrusel que antes
  // estaba arriba de todo). Si una pestaña no tiene nada, muestra su imagen de
  // respaldo (ver PORTADAS_BASE en BloqueCentral.jsx).
  const portadasItems = {};
  ["nosotros", "beneficios", "causas", "valores", "negocios", "regalos", "gratitud"].forEach((id) => {
    const K = id.toUpperCase();
    const archivos = filasEnlaces
      .flatMap((f, i) => {
        if (!f) return [];
        const celda = f[`PORTADA ${K}`];
        // Una celda de Archivo puede traer varios archivos: se usan todos.
        const lista = Array.isArray(celda)
          ? celda
              .map((x) => x && { url: x.url || (x.thumbnails && x.thumbnails.card && x.thumbnails.card.url), nombreArchivo: x.visible_name || "" })
              .filter((x) => x && x.url)
          : [urlDesdeCeldaBaserow(celda)].filter(Boolean).map((url) => ({ url, nombreArchivo: "" }));
        const nombre = (f[`NOMBRE PORTADA ${K}`] && String(f[`NOMBRE PORTADA ${K}`]).trim()) || "";
        return lista.map((x, j) => {
          const esDoc = esPDF(x.url) || /\.pdf$/i.test(x.nombreArchivo);
          return esDoc
            ? { id: `${id}-arch-${i}-${j}`, tipo: "pdf", url: x.url, nombre: (j === 0 && nombre) || "Documento PDF" }
            : { id: `${id}-arch-${i}-${j}`, tipo: "imagen", img: resolverSrcImagen(x.url), nombre: j === 0 ? nombre : "" };
        });
      })
      .slice(0, 10);
    const videos = filasEnlaces
      .filter((f) => f && f[`VIDEOS ${K}`] && String(f[`VIDEOS ${K}`]).trim() !== "")
      .slice(0, 10)
      .map((f) => ({
        video: detectarVideo(f[`VIDEOS ${K}`]),
        nombre: (f[`NOMBRE VIDEOS ${K}`] && String(f[`NOMBRE VIDEOS ${K}`]).trim()) || ""
      }))
      .filter((v) => v.video)
      .map((v, i) => ({
        id: `${id}-vid-${i}`,
        tipo: "video",
        nombre: v.nombre,
        media: <MiniaturaVideo video={v.video} nombre={v.nombre} />,
        onClick: () => setVideoEnGrande(v.video)
      }));
    portadasItems[id] = [...archivos, ...videos];
  });
  portadasItems.causas = [
    ...portadasItems.causas,
    ...videosRetos.map((v, i) => ({
      id: `causas-retos-${i}`,
      tipo: "video",
      nombre: v.nombre,
      media: <MiniaturaVideo video={v.video} nombre={v.nombre} />,
      onClick: () => setVideoEnGrande(v.video)
    }))
  ];

  // Logros para la banda de impacto: los de Baserow ("NOMBRE LOGROS" /
  // "ENLACE LOGROS") o, si no hay, los ejemplos LOGROS_ITEMS (los mismos de
  // la barra de logros de arriba).
  const logrosBaserow = paresBaserow(filasEnlaces, "NOMBRE LOGROS", "ENLACE LOGROS", 20);
  const logrosBanda = logrosBaserow.length > 0
    ? logrosBaserow.map((l) => ({ texto: l.nombre, enlace: l.enlace }))
    : LOGROS_ITEMS;

  // Negocios que aparecen en las fichas debajo del mapa. Se dan de alta en la
  // tabla ENLACES de Baserow, una fila por negocio, con estas columnas (solo
  // "NEGOCIO NOMBRE" es obligatoria):
  //   NEGOCIO NOMBRE · NEGOCIO GIRO · NEGOCIO ZONA · NEGOCIO PROMO ·
  //   NEGOCIO TEL (con lada, sin +) · NEGOCIO EMOJI · NEGOCIO LOGO (Archivo)
  const PALETA_NEGOCIOS = ["#F07A1A", "#E5484D", "#C58A1B", "#3B82C4", "#2E9E5B", "#7A5AD8"];
  const textoDe = (f, col) => (f[col] && String(f[col]).trim()) || "";
  const negociosBaserow = filasEnlaces
    .filter((f) => f && textoDe(f, "NEGOCIO NOMBRE"))
    .slice(0, 20)
    .map((f, i) => {
      const logo = f["NEGOCIO LOGO"] ? urlDesdeCeldaBaserow(f["NEGOCIO LOGO"]) : "";
      return {
        nombre: textoDe(f, "NEGOCIO NOMBRE"),
        giro: textoDe(f, "NEGOCIO GIRO") || "Negocio local",
        zona: textoDe(f, "NEGOCIO ZONA") || "Jardines de Morelos",
        promo: textoDe(f, "NEGOCIO PROMO"),
        tel: textoDe(f, "NEGOCIO TEL").replace(/\D/g, ""),
        emoji: textoDe(f, "NEGOCIO EMOJI") || "🏪",
        logo: logo ? resolverSrcImagen(logo) : "",
        color: PALETA_NEGOCIOS[i % PALETA_NEGOCIOS.length]
      };
    });

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

  // Enlaces de apoyo (columnas de Baserow con links de internet, de tipo
  // texto plano). Se muestran los primeros 5 de cada una; para mostrar más
  // basta con subir el número.
  const apoyoCausaAnimalLinks = primerosValores(filasEnlaces, "APOYO CAUSA ANIMAL", 5);
  const apoyoPersonasExtraviadasLinks = primerosValores(filasEnlaces, "APOYO PERSONAS EXTRAVIADAS", 5);
  const apoyoCosasCasosLinks = primerosValores(filasEnlaces, "APOYO COSAS Y CASOS", 5);
  // Apoyo 4 y Apoyo 5 — columnas todavía no creadas en Baserow; en cuanto
  // se agreguen con estos nombres exactos, los botones las tomarán solas.
  // Recomendaciones de Compra/Venta/Compra-Venta DCUATES — igual que el
  // botón verde de Recomendaciones del inicio: cada liga puede tener un
  // nombre en una columna "NOMBRE ..." de Baserow; si no lo tiene, se
  // muestra "Recomendación 1", "2"... automáticamente.
  const recomendacionesCompra = paresBaserow(filasEnlaces, "NOMBRE RECOMENDACIONES DE COMPRA", "RECOMENDACIONES DE COMPRA", 5);
  const recomendacionesVenta = paresBaserow(filasEnlaces, "NOMBRE RECOMENDACIONES DE VENTA", "RECOMENDACIONES DE VENTA", 5);
  const compraVentaDcuates = paresBaserow(filasEnlaces, "NOMBRE COMPRA-VENTA DCUATES", "COMPRA-VENTA DCUATES", 5);

  return (
    <div className="min-h-screen bg-[#17472d] font-sans antialiased text-slate-900 selection:bg-emerald-500/30 relative pb-28 sm:pb-24">

      {/* Barra de progreso de lectura — línea delgada pegada arriba de todo */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-black/10">
        <div
          className="h-full bg-[#e65100] transition-[width] duration-150"
          style={{ width: `${progresoLectura}%` }}
        />
      </div>

      {/* Barra Ticker Inferior Fija — combina negocios, mascotas, avisos y momentos */}
      <BarraTicker />

      {/* Botón Flotante Permanente de WhatsApp — efecto 3D + anillo parpadeante + etiqueta */}
      <div className="fixed right-4 sm:right-6 z-50 flex flex-col items-end gap-1.5" style={{ bottom: "calc(var(--alto-ticker, 48px) + 6px)" }}>
        {/* Flecha "Subir" — a la derecha, arriba de ¿Qué necesitas hoy?; aparece
            solo después de bajar un poco. */}
        {mostrarSubir && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Subir al inicio de la página"
            title="Subir al menú"
            className="h-12 w-12 flex items-center justify-center rounded-full bg-[#0f2d1e] text-white shadow-lg border-2 border-white/40 hover:bg-emerald-800 transition-colors"
          >
            <span className="text-2xl leading-none font-black" aria-hidden="true">↑</span>
          </button>
        )}
        {/* ¿Qué necesitas hoy? — arriba del botón de WhatsApp */}
        <BotonNecesidades
          onAbrirProyecto={(id) => setModalProyecto(id)}
          onAccionEspecial={(accion) => setModalFormulario(accion)}
          onAbrirFAQ={() => setShowFAQ(true)}
        />
        <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => { registrar("dudas_abrir"); setShowDudas(true); }}
          className="bg-[#25d366] text-white text-[11px] sm:text-sm font-black uppercase tracking-wide px-3 py-2 rounded-full shadow-lg border border-white/30 whitespace-nowrap animate-pulse"
        >
          Dudas y Atención
        </button>
        <button
          type="button"
          onClick={() => { registrar("dudas_abrir"); setShowDudas(true); }}
          aria-label="Abrir ventana de dudas y atención"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#34e372] to-[#128c7e] text-white shadow-[0_10px_20px_rgba(0,0,0,0.35),inset_0_-3px_6px_rgba(0,0,0,0.25),inset_0_3px_4px_rgba(255,255,255,0.4)] transition-all hover:scale-110 active:scale-95 border-2 border-white/40"
          title="Dudas y Atención"
        >
          <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-60"></span>
          <svg className="relative z-10 h-7 w-7 fill-current drop-shadow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.729-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.428 1.978 13.96 1.951 12.01 1.951c-5.438 0-9.863 4.374-9.867 9.802 0 1.685.459 3.324 1.333 4.766L2.483 20.3l3.966-.995zM17.15 14.34c-.283-.141-1.674-.824-1.933-.917-.26-.093-.448-.14-.637.142-.188.282-.729.917-.894 1.105-.165.188-.33.212-.613.07a9.23 9.23 0 0 1-2.28-1.401 10.15 10.15 0 0 1-1.579-1.954c-.165-.282-.018-.434.124-.574.127-.127.283-.329.424-.494.141-.165.188-.282.283-.47.094-.188.047-.353-.024-.494-.071-.141-.637-1.53-.873-2.102-.229-.554-.46-.478-.637-.487-.164-.008-.353-.01-.542-.01-.189 0-.495.07-.755.353-.26.282-.99 1.011-.99 2.467 0 1.457 1.06 2.867 1.201 3.056.142.188 2.086 3.178 5.053 4.462.705.305 1.256.488 1.684.624.708.226 1.353.194 1.863.118.568-.085 1.674-.682 1.909-1.34.236-.658.236-1.223.165-1.34-.07-.117-.26-.188-.542-.329z"/>
          </svg>
        </button>
              </div>
      </div>

      {/* Encabezado + ticker de frases, pegados juntos como una sola barra fija.
          "relative" para poder anclar el botón de Necesidades justo debajo
          (top-full), pegado al borde inferior, y que se mueva junto con todo
          el bloque al hacer scroll (igual que el header, que es sticky). */}
      <div id="encabezado-fijo" className="sticky top-0 z-40 relative">
        <SiteHeader
          onAbrirFAQ={() => setShowFAQ(true)}
          onAbrirPrivacidad={() => setShowPrivacy(true)}
          onAbrirTerminos={() => setShowTerminos(true)}
          onAbrirSeguridad={() => setShowSeguridad(true)}
          onAbrirEscudo={() => setShowEscudo(true)}
          onAbrirProyecto={(id) => setModalProyecto(id)}
          onAbrirSugerencias={() => setModalFormulario("sugerencias")}
          onAbrirMapaSitio={() => setShowMapaSitio(true)}
          onAbrirCategoria={(id) => setCategoriaAbierta(id)}
          busquedaAbierta={busquedaAbierta}
          setBusquedaAbierta={setBusquedaAbierta}
        />
        <TickerFrases />
        <BarraLogros />

      </div>

      {/* SECCIÓN PORTADA / HERO — izquierda: título+texto+Quiénes Somos+Bibliobici a toda altura; derecha: cuadrícula de 12 botones (2 columnas en celular, 3 en escritorio = 3x4) */}
      <section id="inicio" className="scroll-mt-48 md:scroll-mt-36 bg-[#e8f5e9] text-[#0f2d1e] py-4 px-4 sm:py-6">
        <div className="mx-auto max-w-2xl md:max-w-4xl xl:max-w-6xl flex flex-col gap-4">

          {/* Banner de avisos + bloque central de 7 pestañas (BloqueCentral).
              Nosotros y Causas reciben aquí su contenido; lo que sigue
              debajo (Retos, Historias, Solicitudes, etc.) se migrará a
              su pestaña en la fase 2. */}
          <div className="min-w-0">
            <BloqueCentral
              categorias={CATEGORIAS_PROYECTOS}
              proyectos={BOTONES_PORTADA}
              mapaUrl={MAPA_NEGOCIOS_EMBED_URL}
              whatsappNumero={WHATSAPP_NUMERO}
              portadasItems={portadasItems}
              resumenes={RESUMEN_PROYECTO}
              logros={logrosBanda}
              cargando={!baserowListo}
              negocios={negociosBaserow}
              onAbrirCategoria={(id) => setCategoriaAbierta(id)}
              onAbrirProyecto={(id) => setModalProyecto(id)}
              beneficios={(
                <div className="flex flex-col gap-4 min-w-0">
                  <BotonesNaranjasSeccion modales={["cupones-promos"]} onAbrir={(id) => setModalProyecto(id)} />
<div id="solicitudes" className="relative mt-3 scroll-mt-40 sm:scroll-mt-36 rounded-2xl overflow-hidden border-4 border-[#0f2d1e]/30 shadow-lg bg-white">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="solicitudes" titulo="Registra tu solicitud" texto="Cuéntanos qué necesitas y te contactamos por WhatsApp" />
                <div className="bg-[#e65100] px-3 py-2">
                  <p className="text-white font-black uppercase text-xs sm:text-sm tracking-wide text-center">
                    📝 Registra tu Solicitud
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed text-center">
                    Cuéntanos qué necesitas con el siguiente formulario. En cuanto lo revisemos, te contactamos directo por WhatsApp para darle seguimiento.
                  </p>

                  {/* Accesos rápidos — para quien llega directo desde
                      WhatsApp sin conocer el resto de la página, un vistazo
                      rápido de qué más hay antes de llenar el formulario. */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => setModalProyecto("libros")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">📚 Libros</button>
                    <button type="button" onClick={() => setModalProyecto("ecatepets")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">🐾 Mascotas</button>
                    <button type="button" onClick={() => setModalProyecto("asesorias")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">🎓 Asesorías</button>
                    <button type="button" onClick={() => setModalProyecto("donaciones")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">💚 Apoyo Voluntario</button>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="rounded-full bg-amber-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-amber-200 transition-colors"
                    >
                      🏆 Ver Logros
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFAQ(true)}
                      className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors"
                    >
                      ❓ Preguntas Frecuentes
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusquedaAbierta(true)}
                      className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors"
                    >
                      🔍 Buscar
                    </button>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-100">
                    <div
                      className="overflow-hidden transition-[max-height] duration-300"
                      style={{ maxHeight: solicitudExpandida ? 2000 : 210 }}
                      onClick={() => { if (!solicitudExpandida) setSolicitudExpandida(true); }}
                      onFocus={() => setSolicitudExpandida(true)}
                    >
                      <FormularioSolicitud />
                    </div>
                    {!solicitudExpandida && (
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-white/95 via-white/70 to-transparent pb-2 pt-8">
                        <button
                          type="button"
                          onClick={() => setSolicitudExpandida(true)}
                          className="rounded-full bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-[10px] sm:text-[11px] tracking-wide px-4 py-1.5 shadow-md transition-colors"
                        >
                          ✍️ Toca para completar tu registro
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500 font-medium mb-2">¿Prefieres contarnos directo?</p>
                    <a
                      href={enlaceWhatsApp("¡Hola DCUATES! Quiero registrar una solicitud de apoyo.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-[#25d366] hover:bg-[#1da851] text-white font-black uppercase text-xs px-4 py-2.5 transition-colors"
                    >
                      💬 Escríbenos por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
                </div>
              )}
              valores={(
                <div className="flex flex-col gap-4 min-w-0">
                  <BotonesNaranjasSeccion modales={["historias-dcuates"]} onAbrir={(id) => setModalProyecto(id)} />
                  <div id="recursos" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#0f2d1e] p-4">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="recursos" titulo="Más recursos e información de valor" texto="Recomendaciones, música, libros, películas y preguntas frecuentes" />
          <p className="text-white font-black uppercase text-sm sm:text-base tracking-wide text-center mb-3">
            🔎 Más recursos e información de valor
          </p>
            {/* Recomendaciones / Música-Libros-Pelis / Preguntas Frecuentes,
                en fila horizontal debajo del video (antes eran una columna
                al lado del video). */}
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
                    <details open key={i} className="rounded-lg bg-emerald-900/40 px-3 py-2">
                      <summary className="cursor-pointer text-xs sm:text-sm font-bold">{f.pregunta}</summary>
                      <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed">{f.respuesta}</p>
                    </details>
                  ))}
                </div>
              </BotonVerdeInfo>
            </div>
        
                  </div>
                </div>
              )}
              negociosSeccion={(
                <div className="flex flex-col gap-6 min-w-0 text-[#0f2d1e]">
                  <div id="ventas-con-causa" className="relative scroll-mt-48 md:scroll-mt-36">
<BotonCompartir variante="circulo" className="absolute top-2 right-2 z-10" hash="ventas-con-causa" titulo="Ventas con Causa" texto="Compra y apoya una causa de tu comunidad" />
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
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

          {/* Pasarela de Ventas con Causa — a la izquierda el carrusel, a la
              derecha el registro (como botón desplegable) y el acceso al
              catálogo/canal de WhatsApp. */}
          <div className="max-w-3xl mx-auto mb-4">
            <PasarelaVentasConCausa />
          </div>
          <div className="max-w-3xl mx-auto mb-8">
            <BotonNaranjaDesplegable
              titulo="🛍️ Regístrate, ve el catálogo completo y descubre recomendaciones de Compra y Venta"
              abierto={ventasResumenAbierto}
              onClick={() => setVentasResumenAbierto((v) => !v)}
            >
              <div className="space-y-4">
                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-2">Si algo te gustó y deseas apartarlo o comprarlo, regístralo aquí</p>
                  <FormularioVentasConCausa />
                </div>

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

                {/* Recomendaciones de Compra/Venta/Compra-Venta DCUATES —
                    muestran el nombre de cada liga (columna "NOMBRE ...");
                    si esa columna no existe o está vacía en una fila, se
                    numeran solas como "Recomendación 1, 2...". */}
                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-1">Recomendaciones de Compra</p>
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
                </div>

                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-1">Recomendaciones de Venta</p>
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
                </div>

                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-1">Compra-Venta DCUATES</p>
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
                </div>
              </div>
            </BotonNaranjaDesplegable>
          </div>


                  </div>
                  <div id="publicidad" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#17472d] text-white p-4 sm:p-6">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="publicidad" titulo="Publicidad gratuita para tu negocio" texto="Registra tu negocio y aparece en el mapa de DCUATES" />
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
                </div>
              )}
              regalos={(
                <div id="retos-regalos" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#0f2d1e] p-3 sm:p-4">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="retos-regalos" titulo="Retos, regalos y reconocimientos" texto="Porque todo lo bueno merece ser compartido y reconocido" />
                  <p className="text-white font-black uppercase text-xs sm:text-sm tracking-wide mb-3 px-1 text-center">
                    🔎 Retos, Regalos y Reconocimientos DCUATES
                    <span className="block normal-case font-bold text-emerald-100">Porque todo lo bueno merece ser compartido y reconocido, envíanos tus propuestas.</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <BotonesRetosRegalos indices={[0, 1]} />
                    <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center min-h-[180px]">
                      {galeriaRetos.length > 0 ? (
                        <Carrusel
                          items={galeriaRetos}
                          renderItem={(item) => (
                            <img src={resolverSrcImagen(item.img)} alt={item.nombre} loading="lazy" className="w-full aspect-square object-cover" />
                          )}
                        />
                      ) : (
                        <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-wide text-center px-4">
                          Sube fotos a la columna "RETOSGALERIA" en Baserow para verlas aquí
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              gratitud={(
                <div className="flex flex-col gap-4 min-w-0">
                  <div className="rounded-2xl bg-[#0f2d1e] p-3 sm:p-4">
                    <BotonesRetosRegalos indices={[2]} />
                  </div>
                  <BotonesNaranjasSeccion modales={["patrocinadores-alianzas"]} onAbrir={(id) => setModalProyecto(id)} />
                </div>
              )}
              nosotros={(
                <div className="flex flex-col gap-4 min-w-0 lg:grid lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="sr-only">
                Juntos hacemos una mejor comunidad ⭐ 😊
              </h1>
              <p className="text-sm sm:text-base text-slate-900 leading-relaxed text-justify font-bold mt-3">
                <strong className="font-black">DCUATES</strong> impulsa proyectos, <strong className="font-black">PERSONAS, ORGANIZACIONES Y EMPRENDIMIENTOS</strong> que <strong className="font-black">BENEFICIAN a las FAMILIAS</strong>: <strong className="font-black">PUBLICIDAD GRATUITA</strong> para tu negocio, préstamo de <strong className="font-black">LIBROS</strong> y materiales <strong className="font-black">EDUCATIVOS</strong>, apoyo a <strong className="font-black">MASCOTAS Y GRUPOS VULNERABLES</strong>, y <strong className="font-black">ALIANZAS GANAR-GANAR</strong> que generan apoyos y beneficios mutuos y comunitarios. Suma con tu valiosa colaboración o con tu invaluable <strong className="font-black">APOYO VOLUNTARIO</strong> para lograr nuestros objetivos de forma más efectiva, y forjar <strong className="font-black">LA CADENA DE VALOR Y DE VALORES</strong> que nos liberará de nuestras limitaciones para ser mejores, Y ASÍ MEJORAR NUESTRO ENTORNO Y NUESTRO MUNDO !!!
              </p>
              <img
                src="/images/bibliobici-movil.png"
                alt="Bibliobici móvil DCUATES: la lectura que llega hasta tu colonia"
                loading="lazy"
                className="mt-4 w-full max-h-[560px] rounded-2xl object-cover shadow-lg border-4 border-white"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>

            {/* QUIÉNES SOMOS — justo debajo de JUNTOS, resumido con "Mostrar más" */}
            <div id="quienes-somos" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="quienes-somos" titulo="Quiénes somos" texto="Conoce a DCUATES y su comunidad" />
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">✅</span> Quiénes Somos
              </span>
              <div>
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
            </div>

            {/* NUESTRA MISIÓN — mismo formato que Quiénes Somos, justo debajo */}
            <div className="rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">🎯</span> Nuestra Misión
              </span>
              <div>
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
            </div>

            {/* CÓMO PODEMOS SUMAR — mismo formato, justo debajo de Misión.
                Sin truncar: el texto se ve siempre completo. */}
            <div className="rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">🤝</span> Cómo Podemos Sumar
              </span>
              <div>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">{COMO_SUMAR.intro}</p>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium pt-2">{COMO_SUMAR.ventajas}</p>
                <p className="text-sm sm:text-base font-bold text-emerald-100 pt-2">{COMO_SUMAR.cierre}</p>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setTimeout(() => irASeccion("donaciones"), 50)}
                  className="rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 px-6 sm:px-8 uppercase tracking-wide text-sm sm:text-lg shadow-lg transition-all hover:scale-105"
                >
                  Ir a Apoyo Voluntario 🙏
                </button>
              </div>
            </div>

                </div>
              )}
              causas={(
              <>
              <div id="donaciones" className="relative scroll-mt-48 md:scroll-mt-36 flex flex-col gap-y-6 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6 lg:items-start text-[#0f2d1e]">
<BotonCompartir variante="circulo" className="absolute top-2 right-2 z-10" hash="donaciones" titulo="Apoyo Voluntario" texto="Tu tiempo, tu talento o tus recursos cambian vidas" />
                <div className="lg:order-1 min-w-0">
{/* Bloque 1: intro + CTA — fila 1 en escritorio (col. izquierda) */}
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🟢 Apoyo Voluntario
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              TU APORTACIÓN IMPULSA A LA COMUNIDAD
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-bold">
              Cada donativo, del formato que decidas, nos ayuda a sostener y hacer crecer los proyectos que benefician a los negocios y familias latinas en conjunto con DCUATES Y CONEXIONES CON CAUSA ♥
            </p>
            <p className="text-lg sm:text-xl font-black uppercase text-center text-white bg-[#e65100] border-4 border-[#0f2d1e] rounded-2xl py-4 px-5 shadow-md leading-snug">
              ¡Tu apoyo hoy es el cambio que nuestra comunidad necesita — súmate ahora! ♥
            </p>
          </div>

                          </div>
                <div className="lg:order-3 min-w-0">
{/* Bloque 3: transparencia — fila 2 en escritorio (col. izquierda), justo antes del video en móvil */}
          <div>
            <div className="h-full rounded-2xl bg-emerald-200 border-2 border-emerald-500/40 p-5 sm:p-6 text-base sm:text-lg font-black text-emerald-900 leading-relaxed flex items-start gap-3 shadow-sm">
              <span className="text-2xl">💡</span>
              <p className="text-justify uppercase tracking-wide">
                Rendimos cuentas de cómo se usa cada aportación con total transparencia. Parte de la utilidad de nuestros proyectos y de lo que los amigos y la comunidad suman se destina al apoyo de causas sociales como esta gran causa y ejemplo de vida y de lo que se puede lograr con la suma de voluntades, talentos y corazones solidarios ♥
              </p>
            </div>
          </div>

                          </div>
                <div className="lg:order-4 min-w-0">
{/* Bloque 4: flecha + video de Chuy — fila 2 en escritorio (col. derecha), justo después de la transparencia en móvil.
              col-start-6 (en vez de 7) para que la flecha quede pegada al cuadro de transparencia, sin columna vacía de por medio;
              col-span-7 (en vez de 6) le da más ancho al video, y por lo tanto también más alto. */}
          <div id="chuy-video" className="scroll-mt-48 flex flex-col  items-center gap-2 ">
            {/* Flecha con relleno naranja: apunta hacia abajo en móvil y hacia la derecha en escritorio */}
            <div className="flex justify-center items-center shrink-0" aria-hidden="true">
              <svg
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                className="w-14 h-24 sm:w-16 sm:h-28 rotate-90  drop-shadow-md"
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

            <div className="w-full relative">
              <BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="chuy-video" titulo="Video de Chuy, el Sapo Soñador" texto="Conoce la vida y obra de nuestro amigo y maestro de vida" />
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
                <div className="lg:order-2 min-w-0">
{/* Bloque 2: selecciona tu tipo de aportación + botones — fila 1 en escritorio (col. derecha) */}
          <div className="space-y-3">
            <p className="text-xl sm:text-2xl font-black uppercase tracking-wide text-[#0f2d1e] mb-4 block leading-tight">
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

                </div>
              </div>
              <div className="mt-8 text-[#0f2d1e]">
          {/* Pasarela de mascotas, personas y cosas extraviadas */}
          <div id="extraviados-registro" className="relative scroll-mt-48 md:scroll-mt-36 mt-8 max-w-5xl mx-auto">
<BotonCompartir variante="circulo" className="absolute top-2 right-2 z-10" hash="extraviados-registro" titulo="Mascotas, personas y cosas extraviadas" texto="Ayúdanos a difundir y a encontrar" />
            <div className="text-center mb-6 space-y-2">
              <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-base sm:text-xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
                🔎 Mascotas, Personas y Cosas Extraviadas
              </span>
              <p className="text-sm sm:text-base text-slate-700 font-bold max-w-xl mx-auto">
                Ayuda a la comunidad reconociendo estos casos, o repórtanos uno nuevo.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <PasarelaExtraviados />
            </div>
            <div className="max-w-3xl mx-auto mt-4">
              <BotonNaranjaDesplegable
                titulo="🔎 Reporta un caso, ve más casos y consulta apoyos para mascotas, personas y objetos"
                abierto={extraviadosResumenAbierto}
                onClick={() => setExtraviadosResumenAbierto((v) => !v)}
              >
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    💡 Antes de reportar, revisa el carrusel de arriba — si tu caso ya aparece, evitamos duplicados y llegamos más rápido a quien lo necesita.
                  </p>
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

                  {/* Apoyo a Causa Animal / Personas Extraviadas / Cosas y Casos. */}
                  <div>
                    <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">🐾 Apoyo a Causa Animal — la prevención es la mejor ayuda</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
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
                  </div>

                  <div>
                    <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">🧑‍🤝‍🧑 Apoyo a Personas Extraviadas</p>
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
                  </div>

                  <div>
                    <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">📦 Apoyo Cosas y Casos</p>
                    <p>Recursos de apoyo para objetos extraviados y otros casos de la comunidad.</p>
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
                  </div>
                </div>
              </BotonNaranjaDesplegable>
            </div>
          </div>
        
              </div>
              </>
              )}
            />
          </div>
        </div>
      </section>


      {/* Accesos rápidos: Avisos y Beneficios · Compartir Más · Inicio */}
      <BarraAccionesFinal onAbrirComparte={() => setModalFormulario("comparte")} />

      <div className="mt-[1.5cm] mb-[0.5cm]">

        <BarraPatrocinadores />
      </div>

      {/* HISTORIAS Y REFLEXIONES DCUATES — movida aquí (antes vivía dentro
          del hero); ahora como barra horizontal de 1-2 videos de alto, con
          scroll lateral para ver más. Sigue tomando sus videos de las
          columnas "NOMBRE VIDPORT" / "VIDPORT" en Baserow. */}
      <section id="historias-reflexiones" className="relative scroll-mt-48 md:scroll-mt-36 bg-[#0f2d1e] py-6 px-4 border-b-4 border-[#0f2d1e]">
        <BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="historias-reflexiones" titulo="Historias y reflexiones que inspiran" texto="Videos y reflexiones de nuestra comunidad" />
        <div className="mx-auto max-w-6xl">
          <p className="text-white font-black uppercase text-xs sm:text-sm tracking-wide mb-2 px-1 text-center">
            Historias y reflexiones DCUATES que INSPIRAN 💡
            <br className="sm:hidden" />
            <span className="block sm:inline sm:ml-1">Dales clic para ampliarlos y disfrutarlos 🎥 🍿 😊</span>
          </p>
          <div
            ref={carruselHistorias.scrollRef}
            onPointerDown={carruselHistorias.onPointerDown}
            className="flex gap-2 sm:gap-3 overflow-x-auto pb-1"
          >
            {videosPortadaFinal.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setVideoEnGrande(v.video)}
                className="group relative rounded-xl overflow-hidden border-2 border-white/10 hover:border-[#e65100] transition-colors bg-black/30 text-left w-40 sm:w-56 shrink-0"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <MiniaturaVideo video={v.video} nombre={v.nombre} />
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

      {/* FOOTER */}
      <footer className="bg-[#e8f5e9] text-[#0f2d1e] py-12 px-4 text-center space-y-8 border-t-4 border-[#0f2d1e]">

        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f2d1e] font-black text-white text-lg shrink-0">DC</span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wide text-[#e65100] -mt-0.5">¡Comparte y Gana!</span>
          </div>
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
          <a href="#quienes-somos" className="hover:text-[#0f2d1e] transition-colors">👋 Quiénes Somos</a>
          <a href="#inicio" className="hover:text-[#0f2d1e] transition-colors">🌱 Proyectos</a>
          <a href="#publicidad" className="hover:text-[#0f2d1e] transition-colors">📣 Publicidad</a>
          <a href="#donaciones" className="hover:text-[#0f2d1e] transition-colors">💚 Donaciones</a>
          <button
            onClick={() => setShowMapaSitio(true)}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            🗺️ Mapa del Sitio
          </button>
          <button
            onClick={() => irASeccion("solicitudes")}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            📝 Registra tu Solicitud
          </button>
          <button
            onClick={() => setShowFAQ(true)}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            ❓ Preguntas Frecuentes
          </button>
          <button
            onClick={() => setModalFormulario("sugerencias")}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            💬 Sugerencias y Quejas
          </button>
          <button
            onClick={() => setShowPrivacy(true)}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            🔒 Aviso de Privacidad
          </button>
          <button
            onClick={() => setShowTerminos(true)}
            className="underline underline-offset-4 hover:text-[#0f2d1e] bg-transparent border-none cursor-pointer font-bold transition-colors"
          >
            📜 Términos y Condiciones
          </button>
          <button
            onClick={() => setShowSeguridad(true)}
            className="underline underline-offset-4 text-[#b3261e] hover:text-[#7f1d17] bg-transparent border-none cursor-pointer font-black transition-colors"
          >
            ⚠️ Aviso de Seguridad
          </button>
          <button
            onClick={() => setShowEscudo(true)}
            className="underline underline-offset-4 text-[#0b6e5f] hover:text-[#074a40] bg-transparent border-none cursor-pointer font-black transition-colors"
          >
            🛡️ Escudo de Seguridad
          </button>
        </nav>

        <p className="text-sm sm:text-base text-[#0f2d1e] pt-4 border-t border-[#0f2d1e]/30 max-w-md sm:max-w-lg mx-auto font-black">
          © {new Date().getFullYear()} DCUATES, un programa de CONEXIONES CON CAUSA ♥<br />
          Todos los derechos reservados
        </p>
      </footer>

      {/* VISOR DE VIDEO EN GRANDE — global: lo usan el carrusel superior y el de Historias */}
      {videoEnGrande && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setVideoEnGrande(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl aspect-video bg-black">
              <IframeVideo video={videoEnGrande} className="w-full h-full" />
            </div>
          
            <div className="mt-3 flex justify-end">
              <BotonCerrar claro onClick={() => setVideoEnGrande(null)} label="Cerrar video" />
            </div>
</div>
        </div>
      )}


      {/* AVISO DE PRIVACIDAD INTEGRAL Y TÉRMINOS Y CONDICIONES */}
      {showPrivacy && (
        <ModalLegal documento={AVISO_PRIVACIDAD_INTEGRAL} emoji="🔒" degradado="linear-gradient(135deg,#17472d 0%,#1B6F8A 100%)" onCerrar={() => setShowPrivacy(false)} />
      )}
      {showTerminos && (
        <ModalLegal documento={TERMINOS_CONDICIONES} emoji="📜" degradado="linear-gradient(135deg,#7A5AD8 0%,#1B6F8A 100%)" onCerrar={() => setShowTerminos(false)} />
      )}
      {showSeguridad && <ModalAvisoSeguridad onCerrar={() => setShowSeguridad(false)} />}
      {showEscudo && <ModalEscudoSeguridad onCerrar={() => setShowEscudo(false)} />}

      {/* MODAL ÚNICO DE PROYECTO — se abre al dar clic en cualquiera de los
          12 botones naranjas de portada. Su contenido lo arma ContenidoModalProyecto. */}
      {modalProyecto && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setModalProyecto(null)}>
          <div
            className="bg-[#e8f5e9] text-slate-900 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {categoriaAbierta && (
            <div className="mb-2">
              {(
                <button
                  type="button"
                  onClick={() => setModalProyecto(null)}
                  className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-emerald-800 hover:text-[#0f2d1e] transition-colors flex items-center gap-1"
                >
                  <span aria-hidden="true">←</span> Volver a {(CATEGORIAS_PROYECTOS.find((c) => c.id === categoriaAbierta) || {}).titulo}
                </button>
              )}
            </div>
            )}
            <div className="overflow-y-auto pr-1">
              {/* Logo del proyecto, grande y visible al abrir su ventana.
                  Usa la misma imagen del botón (BOTONES_PORTADA); para
                  Historias, Cupones y Patrocinadores, LOGOS_EXTRA_MODAL. */}
              {(() => {
                const logo = (BOTONES_PORTADA.find((b) => b.modal === modalProyecto) || {}).img || LOGOS_EXTRA_MODAL[modalProyecto];
                return logo ? (
                  <div className="flex justify-center pb-3">
                    <img
                      src={logo}
                      alt=""
                      className="max-h-36 sm:max-h-44 w-auto object-contain drop-shadow-md"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ) : null;
              })()}
              <ContenidoModalProyecto id={modalProyecto} onCerrar={() => setModalProyecto(null)} />
            </div>
            <div className="pt-3 flex items-center justify-between gap-3 shrink-0">
              <BotonCompartir
                variante="pastilla"
                hash={`proyecto-${modalProyecto}`}
                titulo={tituloProyecto(modalProyecto)}
                texto={RESUMEN_PROYECTO[modalProyecto] || ""}
              />
              <BotonCerrar onClick={() => setModalProyecto(null)} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PREGUNTAS FRECUENTES */}
      {showFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setShowFAQ(false)}>
          <div
            className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold uppercase tracking-tight border-b pb-3 mb-4 text-emerald-800 font-heading">
              Preguntas Frecuentes ❓💬
            </h3>
            <div className="overflow-y-auto space-y-3 pr-2">
              {FAQ_ITEMS.map((f, i) => (
                <details key={i} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 group">
                  <summary className="cursor-pointer list-none font-bold text-sm sm:text-base text-[#0f2d1e] flex items-center justify-between gap-3">
                    {f.pregunta}
                    <span className="text-emerald-700 group-open:rotate-45 transition-transform text-xl leading-none shrink-0">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">{f.respuesta}</p>
                </details>
              ))}
            </div>
            <button
              onClick={() => setShowFAQ(false)}
              className="mt-6 w-full rounded-xl bg-emerald-700 text-white font-black py-3.5 text-center transition-colors hover:bg-emerald-800 uppercase text-xs tracking-wider font-heading"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DEL MAPA DE SITIO */}
      {showMapaSitio && (
        <ModalMapaSitio
          onCerrar={() => setShowMapaSitio(false)}
          onAbrirProyecto={(id) => setModalProyecto(id)}
          onAbrirFAQ={() => setShowFAQ(true)}
          onAbrirSugerencias={() => setModalFormulario("sugerencias")}
        />
      )}

      {/* MODAL DE CATEGORÍA — portada simplificada de 4 botones */}
      {categoriaAbierta && (
        <ModalCategoria
          categoria={CATEGORIAS_PROYECTOS.find((c) => c.id === categoriaAbierta)}
          onCerrar={() => setCategoriaAbierta(null)}
          onAbrirProyecto={(id) => setModalProyecto(id)}
        />
      )}

      {/* MODAL DE FORMULARIO REUTILIZABLE — Sugerencias y Quejas / Conocer y
          Compartir Más. Ambos arman un mensaje de WhatsApp, sin backend. */}
      {modalFormulario === "sugerencias" && (
        <ModalFormularioWhatsApp
          titulo="Sugerencias y Quejas"
          emoji="💬"
          degradado={DEGRADADO_SUGERENCIAS}
          suave="#e3f3f8"
          invitacion="Tu voz mejora esta comunidad. Cuéntanos qué te gustó, qué falló o qué podríamos hacer mejor; cada mensaje lo leemos con atención."
          cierre="Gracias por ayudarnos a mejorar. ¡Juntos lo hacemos mejor! 💬"
          opciones={["Sugerencia", "Queja", "Reporte de error en la página", "Otro"]}
          placeholder="Escribe aquí tu mensaje..."
          etiquetaBoton="Enviar por WhatsApp"
          onCerrar={() => setModalFormulario(null)}
        />
      )}
      {modalFormulario === "comparte" && (
        <ModalCompartirMas onCerrar={() => setModalFormulario(null)} />
      )}

      {/* VENTANA DE DUDAS — la abre el botón flotante de WhatsApp */}
      {showDudas && (
        <ModalDudas
          onCerrar={() => setShowDudas(false)}
          onBuscarEnPagina={() => { setBusquedaAbierta(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        />
      )}

    </div>
  );
}
