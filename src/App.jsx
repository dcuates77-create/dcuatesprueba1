import React, { useState, useEffect, lazy, Suspense } from "react";
import { BarraLogros, BarraPatrocinadores, BarraTicker, TickerFrases } from "./componentes/barras.jsx";
import { BarraAccionesFinal, BotonNecesidades, SiteHeader } from "./componentes/encabezado.jsx";
import { BotonCerrar } from "./componentes/legal.jsx";
import { IframeVideo, MiniaturaVideo } from "./componentes/media.jsx";
import { PestanaBeneficios } from "./componentes/pestanas/Beneficios.jsx";
import { PestanaCausas } from "./componentes/pestanas/Causas.jsx";
import { PestanaGratitud } from "./componentes/pestanas/Gratitud.jsx";
import { PestanaNegocios } from "./componentes/pestanas/Negocios.jsx";
import { PestanaNosotros, PNQuienes, PNMision, PNSumar } from "./componentes/pestanas/Nosotros.jsx";
import { PestanaRegalos } from "./componentes/pestanas/Regalos.jsx";
import { PestanaValores } from "./componentes/pestanas/Valores.jsx";
import { AGENDA_EVENTOS } from "./datos/agenda.js";
import { normalizarAgenda } from "./BloqueAgenda.jsx";
import { normalizarRegalos } from "./BloqueRegalos.jsx";
import { LOGROS_ITEMS, LOGROS_FIJOS, RECOMENDACIONES_ESTRELLA } from "./datos/cintas.js";
import { MAPA_NEGOCIOS_EMBED_URL, REDES_SOCIALES, VERSION_BUILD, WHATSAPP_NUMERO, YOUTUBE_VIDEO_ID } from "./datos/config.js";
import { LINEAS_AYUDA_VIDEO, PALABRAS_VIDEO_AYUDA } from "./datos/apoyo.js";
import { AVISO_PRIVACIDAD_INTEGRAL, FAQ_ITEMS, TERMINOS_CONDICIONES } from "./datos/legal.js";
import { TODOS_LOS_PROYECTOS } from "./datos/listas.js";
import { BOTONES_PORTADA, CATEGORIAS_PROYECTOS, DEGRADADO_SUGERENCIAS, LOGOS_EXTRA_MODAL, RESUMEN_PROYECTO } from "./datos/proyectos.js";
import { detectarVideo, esPDF, galeriaDesdeColumna, irASeccion, paresBaserow, primerosValores, resolverSrcImagen, tituloProyecto, urlDesdeCeldaBaserow, useCarruselAutomatico, useFilasEnlaces, useFilasZona } from "./utilidades/baserow.js";
import BloqueCentral, { CarruselFinal, TABS as TABS_BC, ID_A_TAB } from "./BloqueCentral";
import InicioNuevo from "./InicioNuevo.jsx";
import MuroGratitud from "./MuroGratitud.jsx";
import OpinionRapida from "./OpinionRapida.jsx";
import InvitaVecino from "./InvitaVecino.jsx";
import FlechaBajar from "./FlechaBajar.jsx";
import AvisoSinConexion from "./AvisoSinConexion.jsx";
import AyudaFlotante, { PistaDeslizar } from "./AyudaFlotante.jsx";
import NavInferior from "./NavInferior.jsx";
import ZonaJuegos from "./ZonaJuegos.jsx";
import ZonaAliados from "./ZonaAliados.jsx";
import ZonaRed from "./ZonaRed.jsx";
import CaminoDcuates from "./CaminoDcuates.jsx";
import EntradaDcuates, { PuertasHost, PuertaFranja } from "./PuertasDcuates.jsx";
import Temporada from "./Temporada.jsx";
import PrimeraVisita from "./PrimeraVisita.jsx";
import { LeerVoz, aplicarAccesibilidad } from "./accesibilidad.jsx";
import ApoyoHost from "./ZonaApoyo.jsx";
import AgendaHost from "./ZonaAgenda.jsx";
import { useCalendario, mezclarAgenda } from "./utilidades/calendario.js";
import { aplicarLetra, leerLetra } from "./tamanoLetra.js";
import TableroConoce from "./TableroConoce.jsx";
import HoyDcuates, { QueSigue, guardarUltimo, BotonRegistrate } from "./HoyDcuates.jsx";
import InstalarApp from "./InstalarApp.jsx";
import PlusHost, { BotonPlus } from "./AgendaPlus.jsx";
import { normalizarAnuncios, normalizarDirectorio } from "./datos/plus.js";
import Extras from "./Extras.jsx";
import { identidad } from "./datos/identidad.js";
import { useAtras } from "./atras.js";
import { normalizarPremios } from "./datos/zona.js";
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
// 2. COMPONENTE PRINCIPAL (INICIO DEL RENDERIZADO) CLON12
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
      else if (e.detail === "faq") setShowFAQ(true);
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
  useEffect(() => {
    const f = (e) => { if (e.detail === "mapa") setShowMapaSitio(true); else if (e.detail) setAccesoAbierto(e.detail); };
    window.addEventListener("dcuates:abrir-acceso", f);
    return () => window.removeEventListener("dcuates:abrir-acceso", f);
  }, []);
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
  useEffect(() => { if (modalProyecto) { const d = identidad(modalProyecto); guardarUltimo("proyecto", modalProyecto, `${d.emoji} ${d.nombre}`); } }, [modalProyecto]);
  // Analítica: cuenta visitas y registra qué proyectos se abren.
  useEffect(() => { iniciarAnalitica(); iniciarPWA(); aplicarLetra(leerLetra()); aplicarAccesibilidad(); }, []);
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
  // VISTAS (e34): "inicio" (portada nueva) · "seccion" (pestañas de proyectos) · "contacto" (registro + colofón).
  // Las tres quedan montadas; solo se muestra una (así los enlaces #… y los eventos siguen funcionando).
  const [vista, setVista] = useState("inicio");
  const irVista = (v) => { setVista(v); window.scrollTo({ top: 0, behavior: "auto" }); };
  useAtras(vista !== "inicio", () => setVista("inicio"));
  useEffect(() => {
    // Si un enlace/evento apunta a algo que vive en otra vista, se cambia a esa vista.
    const vistaDeId = (id) => {
      if (!id) return null;
      if (TABS_BC.some((t) => t.id === id) || ID_A_TAB[id]) return "seccion";
      const el = document.getElementById(id);
      const c = el && el.closest("[data-vista]");
      return c ? c.getAttribute("data-vista") : null;
    };
    const ir = (id) => { const v = vistaDeId(id); if (v) setVista(v); };
    const alHash = () => ir(decodeURIComponent(window.location.hash.replace("#", "")));
    const alEvento = (e) => ir(e.detail);
    const alClic = (e) => {
      const a = e.target?.closest?.('a[href^="#"]');
      if (a) ir(decodeURIComponent(a.getAttribute("href").slice(1)));
    };
    const alVista = (e) => irVista(e.detail);
    setTimeout(alHash, 0);
    window.addEventListener("hashchange", alHash);
    window.addEventListener("dcuates:abrir-seccion", alEvento);
    window.addEventListener("dcuates:vista", alVista);
    document.addEventListener("click", alClic, true);
    return () => {
      window.removeEventListener("hashchange", alHash);
      window.removeEventListener("dcuates:abrir-seccion", alEvento);
      window.removeEventListener("dcuates:vista", alVista);
      document.removeEventListener("click", alClic, true);
    };
  }, []);
  const [mostrarSubir, setMostrarSubir] = useState(false);
  const [progresoLectura, setProgresoLectura] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const pct = alto > 0 ? Math.min(100, Math.max(0, (window.scrollY / alto) * 100)) : 0;
      setProgresoLectura(pct);
      setMostrarSubir(window.scrollY > 300);
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
  // Botón "Atrás" del celular: cierra la ventana de arriba en vez de salir de la página.
  useAtras(!!modalProyecto, () => setModalProyecto(null));
  useAtras(!!accesoAbierto, () => setAccesoAbierto(null));
  useAtras(showMapaSitio, () => setShowMapaSitio(false));
  useAtras(!!categoriaAbierta, () => setCategoriaAbierta(null));
  useAtras(showFAQ, () => setShowFAQ(false));
  useAtras(showDudas, () => setShowDudas(false));
  useAtras(!!modalFormulario, () => setModalFormulario(null));
  useAtras(showPrivacy, () => setShowPrivacy(false));
  useAtras(showTerminos, () => setShowTerminos(false));
  useAtras(showSeguridad, () => setShowSeguridad(false));
  useAtras(showEscudo, () => setShowEscudo(false));
  useAtras(busquedaAbierta, () => setBusquedaAbierta(false));
  useAtras(!!videoEnGrande, () => setVideoEnGrande(null));
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
  const filasZona = useFilasZona();
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
  ["nosotros", "beneficios", "causas", "valores", "negocios", "regalos", "gratitud", "cierre"].forEach((id) => {
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
        onClick: () => setVideoEnGrande({ ...v.video, nombre: v.nombre })
      }));
    portadasItems[id] = [...archivos, ...videos];
  });
  portadasItems.causas = [...(portadasItems.causas || []), ...(portadasItems.valores || [])]; // VALORES se unió a CAUSAS
  portadasItems.gratitud = [...(portadasItems.regalos || []), ...(portadasItems.gratitud || [])]; // REGALOS se unió a GRATITUD
  portadasItems.causas = [
    ...portadasItems.causas,
    ...videosRetos.map((v, i) => ({
      id: `causas-retos-${i}`,
      tipo: "video",
      nombre: v.nombre,
      media: <MiniaturaVideo video={v.video} nombre={v.nombre} />,
      onClick: () => setVideoEnGrande({ ...v.video, nombre: v.nombre })
    }))
  ];

  // Logros para la banda de impacto: los de Baserow ("NOMBRE LOGROS" /
  // "ENLACE LOGROS") o, si no hay, los ejemplos LOGROS_ITEMS (los mismos de
  // la barra de logros de arriba).
  const eventosCalendario = useCalendario();
  const agendaEventos = mezclarAgenda(normalizarAgenda(filasEnlaces, eventosCalendario.length > 0 ? [] : AGENDA_EVENTOS), eventosCalendario);
  const juegosRegalos = normalizarRegalos(filasEnlaces);
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
        horario: textoDe(f, "NEGOCIO HORARIO"),
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

  // Carruseles que ahora viven al final de REGALOS (historias) y de GRATITUD (patrocinadores).
  // Colofón: marca, redes, avisos y créditos (va al final de Súmate y de Contacto)
  const colofon = (
    <footer className="bg-[#e8f5e9] text-[#0f2d1e] pt-12 pb-28 px-4 text-center space-y-8 border-t-4 border-[#0f2d1e]">

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
  );

  const historiasFinal = (
      <div className="rounded-2xl overflow-hidden mt-4">
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
                onClick={() => setVideoEnGrande({ ...v.video, nombre: v.nombre })}
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
      </div>
  );
  const finalesSecciones = {
    gratitud: (
      <>
        {historiasFinal}
        <div id="patrocinadores" className="mt-4 rounded-2xl overflow-hidden"><BarraPatrocinadores /></div>
      </>
    )
  };

  return (
    <div className="min-h-screen bg-[#17472d] font-sans antialiased text-slate-900 selection:bg-emerald-500/30 relative pb-44 sm:pb-40">

      {/* Barra de progreso de lectura — línea delgada pegada arriba de todo */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-black/10">
        <div
          className="h-full bg-[#e65100] transition-[width] duration-150"
          style={{ width: `${progresoLectura}%` }}
        />
      </div>

      {/* Barra Ticker Inferior Fija — combina negocios, mascotas, avisos y momentos */}
      <BarraTicker />
      <NavInferior vista={vista} onVista={irVista} onPlus={() => window.dispatchEvent(new CustomEvent("dcuates:abrir-plus"))} onProyectos={() => window.dispatchEvent(new CustomEvent("dcuates:abrir-tablero", { detail: "conoce" }))} onLogros={() => window.dispatchEvent(new CustomEvent("dcuates:abrir-logros"))} />

      {/* Ayuda flotante única: ¿Necesitas algo? → ¿Qué necesitas hoy? · Dudas y atención · Contacto */}
      <BotonNecesidades
        sinBoton
        onAbrirProyecto={(id) => setModalProyecto(id)}
        onAccionEspecial={(accion) => setModalFormulario(accion)}
        onAbrirFAQ={() => setShowFAQ(true)}
      />
      <PistaDeslizar vista={vista} />
      <AvisoSinConexion />
      <FlechaBajar />
      <AyudaFlotante
        onDudas={() => { registrar("dudas_abrir"); setShowDudas(true); }}
        onContacto={() => irVista("contacto")}
      />

      {/* Flecha "Subir" — abajo a la derecha, arriba de la barra inferior; aparece después de bajar un poco. */}
      {mostrarSubir && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Subir al inicio de la página"
          title="Subir al menú"
          className="fixed right-3 sm:right-6 z-50 h-12 w-12 flex items-center justify-center rounded-full bg-[#0f2d1e] text-white shadow-lg border-2 border-white/40 hover:bg-emerald-800 transition-colors"
          style={{ bottom: "calc(var(--alto-ticker, 48px) + var(--alto-nav, 0px) + 66px)" }}
        >
          <span className="text-2xl leading-none font-black" aria-hidden="true">↑</span>
        </button>
      )}

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

      {/* VISTA 1 · INICIO (portada nueva) */}
      <div data-vista="inicio" style={vista === "inicio" ? undefined : { display: "none" }}>
        <InicioNuevo
          onIr={(id) => { irVista("seccion"); window.dispatchEvent(new CustomEvent("dcuates:abrir-seccion", { detail: id })); }}
          logros={logrosBanda}
          cargando={!baserowListo}
          entrada={{ agenda: agendaEventos, filasZona, negocios: negociosBaserow, onAbrirProyecto: (id) => setModalProyecto(id) }}
        />
        <InvitaVecino />
      </div>

      {/* VISTA 2 · PROYECTOS (pestañas) */}
      <div data-vista="seccion" style={vista === "seccion" ? undefined : { display: "none" }}>
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
              agenda={agendaEventos}
              cargando={!baserowListo}
              negocios={negociosBaserow}
              onAbrirCategoria={(id) => setCategoriaAbierta(id)}
              onAbrirProyecto={(id) => setModalProyecto(id)}
              onAcceso={(t) => (t === "proyectos" ? setShowMapaSitio(true) : setAccesoAbierto(t))}
              accesosSlot={(tabId) => tabId === "nosotros" ? <EntradaDcuates key="pu" agenda={agendaEventos} filasZona={filasZona} negocios={negociosBaserow} onAbrirProyecto={(id) => setModalProyecto(id)} /> : <><PuertaFranja key={"pf" + tabId} /><CaminoDcuates key={"c" + tabId} seccion={tabId} compacto menu={{}} onAbrirProyecto={(id) => setModalProyecto(id)} /><HoyDcuates key={"h" + tabId} seccion={tabId} negocios={negociosBaserow} agenda={agendaEventos} filasZona={filasZona} onAbrirProyecto={(id) => setModalProyecto(id)} /><BotonRegistrate /><BotonPlus key={"plus" + tabId} /></>}
              beneficios={<PestanaBeneficios setBusquedaAbierta={setBusquedaAbierta} setModalProyecto={setModalProyecto} setShowFAQ={setShowFAQ} setSolicitudExpandida={setSolicitudExpandida} solicitudExpandida={solicitudExpandida} />}
              valores={<PestanaValores infoAbierta={infoAbierta} librosLinks={librosLinks} musicaLinks={musicaLinks} recomendacionesComunidad={recomendacionesComunidad} recomendacionesDcuates={recomendacionesDcuates} setInfoAbierta={setInfoAbierta} setModalProyecto={setModalProyecto} videosLinks={videosLinks} />}
              negociosSeccion={<PestanaNegocios compraVentaDcuates={compraVentaDcuates} recomendacionesCompra={recomendacionesCompra} recomendacionesVenta={recomendacionesVenta} setVentasResumenAbierto={setVentasResumenAbierto} ventasResumenAbierto={ventasResumenAbierto} />}
              regalos={<PestanaRegalos galeriaRetos={galeriaRetos} />}
              gratitud={<PestanaGratitud setModalProyecto={setModalProyecto} />}
              nosotros={<PestanaNosotros  />}
              finales={finalesSecciones}
              colofon={colofon}
              muro={<MuroGratitud filas={filasEnlaces} />}
              partes={{ qs: <PNQuienes />, mision: <PNMision />, sumar: <PNSumar /> }}
              causas={<PestanaCausas apoyoCausaAnimalLinks={apoyoCausaAnimalLinks} apoyoCosasCasosLinks={apoyoCosasCasosLinks} apoyoPersonasExtraviadasLinks={apoyoPersonasExtraviadasLinks} extraviadosResumenAbierto={extraviadosResumenAbierto} setExtraviadosResumenAbierto={setExtraviadosResumenAbierto} />}
            />
          </div>
        </div>
      </section>
      </div>

      {/* Accesos rápidos: Avisos y Beneficios · Compartir Más · Inicio */}
      <TableroConoce />
      <Extras logros={logrosBanda} />
      <PuertasHost onAbrirProyecto={(id) => setModalProyecto(id)} />
      <Temporada />
      <PrimeraVisita />
      <LeerVoz />
      <ApoyoHost onAbrirProyecto={(id) => setModalProyecto(id)} />
      <AgendaHost agenda={agendaEventos} negocios={negociosBaserow} />
      <PlusHost anuncios={normalizarAnuncios(filasEnlaces)} directorio={normalizarDirectorio(filasEnlaces)} />
      <ZonaJuegos
        onAbrirProyecto={(id) => setModalProyecto(id)}
        filas={filasEnlaces}
        filasZona={filasZona}
        temasAprende={juegosRegalos}
        premios={normalizarPremios(filasEnlaces)}
        agenda={agendaEventos}
        menu={{ mapa: () => setShowMapaSitio(true), faq: () => setShowFAQ(true), sugerencias: () => setModalFormulario("sugerencias") }}
      />
      <ZonaAliados agenda={agendaEventos} />
      <ZonaRed onAbrirProyecto={(id) => setModalProyecto(id)} />

      {/* VISTA 3 · CONTACTO: registros y colofón (accesos, patrocinadores, historias, créditos) */}
      <div data-vista="contacto" id="contacto" style={vista === "contacto" ? undefined : { display: "none" }}>
        <section aria-label="Contacto y registro" className="px-4 pt-5 pb-5 border-b-4 border-[#0f2d1e]" style={{ background: "#fbf7ec" }}>
          <div className="mx-auto max-w-2xl md:max-w-4xl">
            <h2 className="text-center font-black uppercase text-xl sm:text-2xl leading-tight" style={{ color: "#0f2d1e" }}>Contacto y registro</h2>
            <p className="text-center text-sm font-semibold mt-1" style={{ color: "#475569" }}>Regístrate, pide apoyo o escríbenos. Aquí también está todo lo demás: privacidad, seguridad, preguntas y créditos.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["📝", "Regístrate o participa", "#2E9E5B", () => setAccesoAbierto("registros")],
                ["💛", "Para ti", "#E65100", () => setAccesoAbierto("beneficios")],
                ["🛡️", "Escudo de seguridad", "#0f4c5c", () => setShowEscudo(true)],
                ["❓", "Preguntas frecuentes", "#1B6F8A", () => setShowFAQ(true)],
                ["🗺️", "Mapa del sitio", "#7A5AD8", () => setShowMapaSitio(true)],
                ["💬", "Dudas y atención por WhatsApp", "#25a244", () => { registrar("dudas_abrir"); setShowDudas(true); }]
              ].map(([e, t, c, f]) => (
                <button key={t} type="button" onClick={f} style={{ background: c }} className="min-h-[88px] rounded-2xl text-white shadow-md border-b-4 border-black/25 px-2 py-3 flex flex-col items-center justify-center gap-1 text-center font-black uppercase text-[12px] leading-tight active:translate-y-0.5 transition-transform">
                  <span className="text-3xl leading-none" aria-hidden="true">{e}</span>
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      <InvitaVecino />
      <OpinionRapida />
      <BarraAccionesFinal onAbrirComparte={() => setModalFormulario("comparte")} onInicio={() => irVista("inicio")} />

      {/* Portada de la pestaña abierta, al final y en sentido contrario a los videos */}
      <CarruselFinal portadasItems={portadasItems} categorias={CATEGORIAS_PROYECTOS} cargando={!baserowListo} />

      {/* FOOTER */}
      {colofon}
      </div>


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
            {PALABRAS_VIDEO_AYUDA.test(videoEnGrande.nombre || "") && (
              <div role="note" aria-label="Líneas de ayuda" className="mt-3 rounded-2xl bg-white p-3 text-[#0f2d1e]">
                <p className="text-sm font-black leading-snug">💚 Si tú o alguien cercano necesita hablar con alguien, hay ayuda gratuita:</p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {LINEAS_AYUDA_VIDEO.map(([nombre, marcar, mostrar, nota]) => (
                    <a key={nombre} href={`tel:${marcar}`} onClick={() => registrar("linea_ayuda_video", { linea: nombre })} className="flex min-h-[52px] flex-col justify-center rounded-xl bg-[#0e7c4f] px-3 py-2 text-white no-underline">
                      <b className="text-sm font-black uppercase leading-tight">📞 {nombre} · {mostrar}</b>
                      <span className="text-xs font-bold opacity-95">{nota}</span>
                    </a>
                  ))}
                </div>
                <p className="mt-2 text-xs font-bold text-slate-600">En una emergencia llama al 911.</p>
              </div>
            )}
          
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
            style={{ borderTop: `8px solid ${identidad(modalProyecto).color}` }}
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
              <QueSigue id={modalProyecto} onIr={(id) => setModalProyecto(id)} onCerrar={() => setModalProyecto(null)} />
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
