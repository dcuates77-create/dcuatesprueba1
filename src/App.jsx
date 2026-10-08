import React, { useState, useEffect, lazy, Suspense } from "react";
import { BarraLogros, BarraPatrocinadores, BarraTicker, TickerFrases } from "./componentes/barras.jsx";
import { BarraAccionesFinal, BotonNecesidades, SiteHeader } from "./componentes/encabezado.jsx";
import { BotonCerrar } from "./componentes/legal.jsx";
import { IframeVideo, MiniaturaVideo } from "./componentes/media.jsx";
import { PestanaBeneficios } from "./componentes/pestanas/Beneficios.jsx";
import { PestanaCausas } from "./componentes/pestanas/Causas.jsx";
import { PestanaGratitud } from "./componentes/pestanas/Gratitud.jsx";
import { PestanaNegocios } from "./componentes/pestanas/Negocios.jsx";
import { PestanaNosotros } from "./componentes/pestanas/Nosotros.jsx";
import { PestanaRegalos } from "./componentes/pestanas/Regalos.jsx";
import { PestanaValores } from "./componentes/pestanas/Valores.jsx";
import { LOGROS_ITEMS, LOGROS_FIJOS, RECOMENDACIONES_ESTRELLA } from "./datos/cintas.js";
import { MAPA_NEGOCIOS_EMBED_URL, REDES_SOCIALES, VERSION_BUILD, WHATSAPP_NUMERO, YOUTUBE_VIDEO_ID } from "./datos/config.js";
import { AVISO_PRIVACIDAD_INTEGRAL, FAQ_ITEMS, TERMINOS_CONDICIONES } from "./datos/legal.js";
import { TODOS_LOS_PROYECTOS } from "./datos/listas.js";
import { BOTONES_PORTADA, CATEGORIAS_PROYECTOS, DEGRADADO_SUGERENCIAS, LOGOS_EXTRA_MODAL, RESUMEN_PROYECTO } from "./datos/proyectos.js";
import { detectarVideo, esPDF, galeriaDesdeColumna, irASeccion, paresBaserow, primerosValores, resolverSrcImagen, tituloProyecto, urlDesdeCeldaBaserow, useCarruselAutomatico, useFilasEnlaces } from "./utilidades/baserow.js";
import BloqueCentral, { CarruselFinal } from "./BloqueCentral";
import BotonCompartir from "./BotonCompartir";
import { iniciarAnalitica, registrar } from "./analitica";
import { iniciarPWA } from "./pwa";

// Ventanas poco usadas: se descargan solo la primera vez que alguien las abre.
const cargarVentanas = () => import("./componentes/ventanasPesadas.jsx");
const ContenidoModalProyecto = lazy(() => cargarVentanas().then((m) => ({ default: m.ContenidoModalProyecto })));
const ModalAccesoRapido = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalAccesoRapido })));
const ModalAvisoSeguridad = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalAvisoSeguridad })));
const ModalCategoria = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalCategoria })));
const ModalCompartirMas = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalCompartirMas })));
const ModalDudas = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalDudas })));
const ModalEscudoSeguridad = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalEscudoSeguridad })));
const ModalFormularioWhatsApp = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalFormularioWhatsApp })));
const ModalLegal = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalLegal })));
const ModalMapaSitio = lazy(() => cargarVentanas().then((m) => ({ default: m.ModalMapaSitio })));

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
  // Ventana de los botones Beneficios / Registros (null = cerrada)
  const [accesoAbierto, setAccesoAbierto] = useState(null);
  // Los botones de Registros pueden pedir que se despliegue un registro (Ventas con causa / Extraviados).
  useEffect(() => {
    const alPedir = (e) => {
      if (e.detail === "ventas") setVentasResumenAbierto(true);
      else if (e.detail === "extraviados") setExtraviadosResumenAbierto(true);
    };
    window.addEventListener("dcuates:abrir-registro", alPedir);
    return () => window.removeEventListener("dcuates:abrir-registro", alPedir);
  }, []);
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
  const logrosBanda = [
    ...(logrosBaserow.length > 0
      ? logrosBaserow.map((l) => ({ texto: l.nombre, enlace: l.enlace }))
      : LOGROS_ITEMS),
    ...LOGROS_FIJOS
  ];

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
              onAcceso={(t) => (t === "proyectos" ? setShowMapaSitio(true) : setAccesoAbierto(t))}
              beneficios={<PestanaBeneficios setBusquedaAbierta={setBusquedaAbierta} setModalProyecto={setModalProyecto} setShowFAQ={setShowFAQ} setSolicitudExpandida={setSolicitudExpandida} solicitudExpandida={solicitudExpandida} />}
              valores={<PestanaValores infoAbierta={infoAbierta} librosLinks={librosLinks} musicaLinks={musicaLinks} recomendacionesComunidad={recomendacionesComunidad} recomendacionesDcuates={recomendacionesDcuates} setInfoAbierta={setInfoAbierta} setModalProyecto={setModalProyecto} videosLinks={videosLinks} />}
              negociosSeccion={<PestanaNegocios compraVentaDcuates={compraVentaDcuates} recomendacionesCompra={recomendacionesCompra} recomendacionesVenta={recomendacionesVenta} setVentasResumenAbierto={setVentasResumenAbierto} ventasResumenAbierto={ventasResumenAbierto} />}
              regalos={<PestanaRegalos galeriaRetos={galeriaRetos} />}
              gratitud={<PestanaGratitud setModalProyecto={setModalProyecto} />}
              nosotros={<PestanaNosotros  />}
              causas={<PestanaCausas apoyoCausaAnimalLinks={apoyoCausaAnimalLinks} apoyoCosasCasosLinks={apoyoCosasCasosLinks} apoyoPersonasExtraviadasLinks={apoyoPersonasExtraviadasLinks} extraviadosResumenAbierto={extraviadosResumenAbierto} setExtraviadosResumenAbierto={setExtraviadosResumenAbierto} />}
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

      {/* Portada de la pestaña abierta, al final y en sentido contrario a los videos */}
      <CarruselFinal portadasItems={portadasItems} categorias={CATEGORIAS_PROYECTOS} cargando={!baserowListo} />

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
        <Suspense fallback={null}><ModalLegal documento={AVISO_PRIVACIDAD_INTEGRAL} emoji="🔒" degradado="linear-gradient(135deg,#17472d 0%,#1B6F8A 100%)" onCerrar={() => setShowPrivacy(false)} /></Suspense>
      )}
      {showTerminos && (
        <Suspense fallback={null}><ModalLegal documento={TERMINOS_CONDICIONES} emoji="📜" degradado="linear-gradient(135deg,#7A5AD8 0%,#1B6F8A 100%)" onCerrar={() => setShowTerminos(false)} /></Suspense>
      )}
      {showSeguridad && <Suspense fallback={null}><ModalAvisoSeguridad onCerrar={() => setShowSeguridad(false)} /></Suspense>}
      {showEscudo && <Suspense fallback={null}><ModalEscudoSeguridad onCerrar={() => setShowEscudo(false)} /></Suspense>}

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
              <Suspense fallback={null}><ContenidoModalProyecto id={modalProyecto} onCerrar={() => setModalProyecto(null)} /></Suspense>
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

      {/* VENTANA DE LOS BOTONES BENEFICIOS / REGISTROS */}
      {accesoAbierto && (
        <Suspense fallback={null}>
          <ModalAccesoRapido
            tipo={accesoAbierto}
            onCerrar={() => setAccesoAbierto(null)}
            onAbrirProyecto={(id) => setModalProyecto(id)}
            onAccion={(a) => setModalFormulario(a)}
          />
        </Suspense>
      )}

      {/* MODAL DEL MAPA DE SITIO */}
      {showMapaSitio && (
        <Suspense fallback={null}><ModalMapaSitio
          onCerrar={() => setShowMapaSitio(false)}
          onAbrirProyecto={(id) => setModalProyecto(id)}
          onAbrirFAQ={() => setShowFAQ(true)}
          onAbrirSugerencias={() => setModalFormulario("sugerencias")}
        /></Suspense>
      )}

      {/* MODAL DE CATEGORÍA — portada simplificada de 4 botones */}
      {categoriaAbierta && (
        <Suspense fallback={null}><ModalCategoria
          categoria={CATEGORIAS_PROYECTOS.find((c) => c.id === categoriaAbierta)}
          onCerrar={() => setCategoriaAbierta(null)}
          onAbrirProyecto={(id) => setModalProyecto(id)}
        /></Suspense>
      )}

      {/* MODAL DE FORMULARIO REUTILIZABLE — Sugerencias y Quejas / Conocer y
          Compartir Más. Ambos arman un mensaje de WhatsApp, sin backend. */}
      {modalFormulario === "sugerencias" && (
        <Suspense fallback={null}><ModalFormularioWhatsApp
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
        /></Suspense>
      )}
      {modalFormulario === "comparte" && (
        <Suspense fallback={null}><ModalCompartirMas onCerrar={() => setModalFormulario(null)} /></Suspense>
      )}

      {/* VENTANA DE DUDAS — la abre el botón flotante de WhatsApp */}
      {showDudas && (
        <Suspense fallback={null}><ModalDudas
          onCerrar={() => setShowDudas(false)}
          onBuscarEnPagina={() => { setBusquedaAbierta(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        /></Suspense>
      )}

    </div>
  );
}
