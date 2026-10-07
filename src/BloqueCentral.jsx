import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import CarruselPortada from "./CarruselPortada";
import TiraAuto from "./TiraAuto";
import BotonCompartir from "./BotonCompartir";
import { registrar } from "./analitica";

// =========================================================================
// BLOQUE CENTRAL INTERACTIVO — DCUATES (CLON8) · FASE 5
// Estructura única de 7 pestañas. Cada pestaña recibe desde App.jsx, en su
// prop (nosotros, beneficios, causas, valores, negocios, regalos, gratitud),
// el mismo JSX de siempre con sus estados. Orden dentro de cada pestaña:
// portada o mapa -> texto -> fichas -> proyectos -> contenido -> botones.
// Responsivo: celular primero; en tableta y PC el bloque se ensancha, las
// pestañas caben todas sin deslizar y los carruseles pasan a rejillas.
// Pestañas y barra de avance FIJAS (sticky) pegadas bajo las barras de anuncios
// mientras se baja por el contenido; al quedar fijas se compactan (solo el
// ícono, y la pestaña activa con su nombre).
// Sin Tailwind: el CSS propio va al final (clases "bc-").
// =========================================================================

const TABS = [
  {
    id: "nosotros", label: "Nosotros", emoji: "🏠", color: "#1B6F8A", pastel: "#E3F3F8",
    boton: "#1B6F8A",
    cover: { slogan: "Juntos hacemos una mejor comunidad ⭐" }, slot: "nosotros",
    banda: { titulo: "Lo que hemos logrado juntos" }
  },
  {
    id: "beneficios", label: "Beneficios", emoji: "🎁", color: "#F07A1A", pastel: "#FFF1E1",
    boton: "#D1530A",
    cat: "beneficios-comunitarios", cover: {}, ver: true, slot: "beneficios",
    banda: { titulo: "Beneficios que ya se sienten en el barrio" },
    invitacion: { titulo: "Beneficios que sí llegan a tu puerta", texto: "Libros, asesorías, bienestar y apoyo para tus mascotas, todo gratis. Toca uno y descubre cómo usarlo." },
    wa: "¡Hola DCUATES! Quiero conocer los beneficios comunitarios disponibles."
  },
  {
    id: "causas", label: "Causas", emoji: "❤️", color: "#E5484D", pastel: "#FFE9EB",
    boton: "#CF3338",
    cat: "apoya-causas", cover: { slogan: "Apoyo Voluntario: tu ayuda cambia vidas" }, slot: "causas",
    banda: { titulo: "Lo que tu ayuda ya ha logrado" },
    invitacion: { titulo: "Tu ayuda cambia vidas", texto: "Cada proyecto es una forma concreta de apoyar a alguien de tu comunidad. Elige el que te mueva y conoce cómo sumarte." }
  },
  {
    id: "negocios", label: "Negocios", emoji: "🗺️", color: "#2E9E5B", pastel: "#E4F6EB",
    boton: "#23804A",
    cat: "alianzas-y-negocios", cover: { slogan: "Negocios locales aliados" }, ocultarSinItems: true, mapa: true, fichas: true, ver: true, slot: "negocios",
    texto: "Encuentra comercios aliados en Jardines de Morelos o registra el tuyo gratis.",
    banda: { titulo: "Comunidad que mueve el barrio" },
    invitacion: { titulo: "Compra local, crece en comunidad", texto: "Alianzas que mueven la economía del barrio. Descubre cómo participar." },
    wa: "¡Hola DCUATES! Quiero registrar mi negocio."
  },
  {
    id: "valores", label: "Valores", emoji: "✨", color: "#7A5AD8", pastel: "#EFEAFE",
    boton: "#6A47C9",
    cat: "sumando-valores", cover: {}, ver: true, slot: "valores",
    banda: { titulo: "Valores que se multiplican" },
    invitacion: { titulo: "Los valores que nos unen", texto: "Confianza, alianzas y buenas noticias del barrio. Entra y mira cómo los vivimos." },
    wa: "¡Hola DCUATES! Quiero saber más sobre sus valores y alianzas."
  },
  {
    id: "regalos", label: "Regalos", emoji: "🎉", color: "#D6336C", pastel: "#FDE8F1", boton: "#C2255C",
    cover: { slogan: "Retos y regalos que nos motivan" }, slot: "regalos",
    texto: "Porque todo lo bueno merece ser compartido. Envíanos tus propuestas de retos y regalos."
  },
  {
    id: "gratitud", label: "Gratitud", emoji: "🙏", color: "#B7791F", pastel: "#FFF4D6", boton: "#92610F",
    cover: { slogan: "Gracias por hacer el bien" }, slot: "gratitud",
    texto: "Reconocemos a quienes hacen el bien en nuestra comunidad. Cuéntanos a quién quieres agradecer."
  }
];

// ids de secciones que ahora viven dentro de una pestaña: los enlaces
// (#donaciones, irASeccion("chuy-video")…) abren la pestaña correcta.
const ID_A_TAB = {
  donaciones: "causas",
  "chuy-video": "causas",
  "extraviados-registro": "causas",
  "quienes-somos": "nosotros",
  solicitudes: "beneficios",
  recursos: "valores",
  "mapa-negocios": "negocios",
  "ventas-con-causa": "negocios",
  "registro-ventas": "negocios",
  "registro-extraviados": "causas",
  publicidad: "negocios",
  "retos-regalos": "regalos"
};


// Portada de cada pestaña. Primero se usa la que subas a Baserow (columnas
// "PORTADA NOSOTROS", "PORTADA BENEFICIOS", etc. en la tabla ENLACES); si no
// hay, la imagen local /public/images/portada-<pestaña>.png; y si tampoco
// existe, un degradado de color con el emoji de la pestaña.
const PORTADAS_BASE = {
  nosotros: "/images/bibliobici-movil.png",
  beneficios: "/images/bibliobici-movil.png",
  causas: "/images/portada-causas.png",
  valores: "/images/portada-valores.png",
  regalos: "/images/portada-regalos.png",
  gratitud: "/images/portada-gratitud.png"
};

const MENORES = /^(de|del|y|con|a|el|la|los|las|en)$/i;
const bonito = (s) =>
  s.toLowerCase().split(" ").map((w, i) => (i && MENORES.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");

function Logo({ src, emoji }) {
  const [fallo, setFallo] = useState(!src);
  useEffect(() => { setFallo(!src); }, [src]);
  return fallo ? (
    <span className="bc-chip-emoji" aria-hidden="true">{emoji}</span>
  ) : (
    <img src={src} alt="" loading="lazy" onError={() => setFallo(true)} />
  );
}

// Mapa con bloqueo: en celular una capa transparente deja pasar el scroll
// de la página con un dedo; con DOS dedos (o tocando el aviso) se activa.
// Se vuelve a bloquear solo al hacer scroll en la página o a los 8 s.
function MapaLocal({ url, color }) {
  const [tactil] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (!activo) return;
    const bloquear = () => setActivo(false);
    const t = setTimeout(bloquear, 8000);
    window.addEventListener("scroll", bloquear, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", bloquear); };
  }, [activo]);

  return (
    <div className="bc-map" id="mapa-local">
      <iframe src={url} title="Mapa de negocios locales DCUATES" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      <BotonCompartir variante="flotante" className="bc-map-share" hash="mapa-negocios" titulo="Mapa de negocios locales" texto="Descubre los comercios aliados de Jardines de Morelos" />
      {tactil && !activo && (
        <div className="bc-map-lock" onTouchStart={(e) => { if (e.touches.length >= 2) setActivo(true); }}>
          <button type="button" className="bc-pill" onClick={() => setActivo(true)}>✌️ Dos dedos para mover el mapa</button>
        </div>
      )}
      {tactil && activo && (
        <button type="button" className="bc-pill bc-pill-on" style={{ background: color }} onClick={() => setActivo(false)}>
          🔓 Mapa activo · toca para bloquear
        </button>
      )}
    </div>
  );
}

// ---- Banda de impacto: toma los números de los LOGROS (Baserow "NOMBRE LOGROS"
// o, si no hay, los ejemplos del código) y los muestra como cifras que
// cuentan hacia arriba. Solo se usan los logros que traen un número.
const EMOJI_INICIAL = /^(\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|\p{Emoji_Modifier})*)\s*/u;

// Pasa a minúsculas (con la primera en mayúscula) los textos escritos casi
// todo en MAYÚSCULAS, para que las etiquetas de las cifras se lean con calma.
function enFrase(t) {
  const letras = t.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  const mayus = letras.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "");
  const base = letras.length && mayus.length / letras.length > 0.35 ? t.toLowerCase() : t;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

const SEGUNDO_NUMERO = /,?\s+y\s+m[aá]s de\s+(\d[\d.,]*)\s+(.+)$/i;

// Un logro puede dar una o dos cifras:
//  "Más de 200 libros FÍSICOS DONADOS …, y más de 2500 COMPARTIDOS EN FORMATO DIGITAL"
//  -> 200 "Libros físicos donados …" y 2,500 "Libros compartidos en formato digital".
// Un texto entre paréntesis al final se muestra aparte, en letra pequeña.
function parsearLogros(item) {
  const texto = String((item && (item.texto || item.nombre)) || "").trim();
  if (!texto) return [];
  const mE = texto.match(EMOJI_INICIAL);
  const emoji = mE ? mE[1] : "✨";
  let resto = (mE ? texto.slice(mE[0].length) : texto).replace(/^m[aá]s de\s+/i, "");

  let nota = "";
  const mp = resto.match(/\(([^)]*)\)\s*$/);
  if (mp) { nota = mp[1].trim(); resto = resto.slice(0, mp.index).trim(); }

  let valor = null, prefijo = "", etiqueta = "", segundo = null;
  const mm = resto.match(/mill[oó]n de pesos\s*(.*)$/i);
  if (mm) {
    valor = 1000000; prefijo = "$";
    etiqueta = ("pesos gestionados " + (mm[1] || "")).trim();
  } else {
    const m2 = resto.match(SEGUNDO_NUMERO);
    if (m2) {
      segundo = { valor: parseInt(m2[1].replace(/[.,]/g, ""), 10), etiqueta: m2[2].trim() };
      resto = resto.slice(0, m2.index).trim();
    }
    const m = resto.match(/^(\d[\d.,]*)\s+(.+)$/);
    if (m) { valor = parseInt(m[1].replace(/[.,]/g, ""), 10); etiqueta = m[2]; }
  }
  if (!valor || !isFinite(valor)) return [];

  const salida = [{ emoji, valor, prefijo, etiqueta: enFrase(etiqueta), nota: nota ? enFrase(nota) : "", enlace: item.enlace }];
  if (segundo && isFinite(segundo.valor)) {
    const sustantivo = etiqueta.split(/\s+/)[0].toLowerCase();
    const resto2 = segundo.etiqueta.toLowerCase();
    salida.push({
      emoji: /digital/i.test(resto2) ? "💻" : emoji,
      valor: segundo.valor, prefijo: "",
      etiqueta: enFrase(`${sustantivo} ${resto2}`), nota: "", enlace: item.enlace
    });
  }
  return salida;
}

// Qué logros conviene mostrar en cada pestaña (por el enlace que traen); lo
// que falte se completa con los demás, en su orden.
const LOGROS_PREFERIDOS = {
  beneficios: ["#libros", "#libros", "#libros", "#asesorias"],
  causas: ["#donaciones", "#donaciones", "#ecatepets", "#circulo-confianza"],
  valores: ["#circulo-confianza", "#bazares", "#asesorias", "#bienestar"],
  negocios: ["#bazares", "#circulo-confianza", "#iniciativas", "#donaciones"]
};

function elegirLogros(todos, tabId) {
  const elegidos = [];
  (LOGROS_PREFERIDOS[tabId] || []).forEach((h) => {
    const f = todos.find((l) => l.enlace === h && !elegidos.includes(l));
    if (f) elegidos.push(f);
  });
  for (const l of todos) {
    if (elegidos.length >= 4) break;
    if (!elegidos.includes(l)) elegidos.push(l);
  }
  return elegidos.slice(0, 4);
}

function Contador({ valor, prefijo }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducir = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, iniciado = false;
    const correr = () => {
      if (iniciado) return;
      iniciado = true;
      if (reducir) { setN(valor); return; }
      const t0 = performance.now(), dur = 1500;
      const paso = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        setN(Math.round(valor * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
    };
    if (typeof IntersectionObserver === "undefined") { setN(valor); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { correr(); obs.disconnect(); } }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [valor]);
  return <span ref={ref}>{prefijo}{n.toLocaleString("es-MX")}+</span>;
}

function BandaImpacto({ logros, cargando, tab }) {
  if (cargando) {
    return (
      <section className="bc-banda" aria-hidden="true">
        <div className="bc-banda-g">
          {[0, 1, 2, 3].map((i) => <div key={i} className="bc-stat bc-esq" style={{ minHeight: 96 }} />)}
        </div>
      </section>
    );
  }
  const lista = elegirLogros(logros.flatMap(parsearLogros), tab.id);
  if (lista.length < 2) return null;
  return (
    <section className="bc-banda" aria-label={tab.banda.titulo} style={{ "--c": tab.color }}>
      <p className="bc-banda-t"><span aria-hidden="true">🌱</span> {tab.banda.titulo}</p>
      <div className="bc-banda-g">
        {lista.map((l, i) => (
          <div className="bc-stat" key={i}>
            <span className="bc-stat-e" aria-hidden="true">{l.emoji}</span>
            <b className="bc-stat-n"><Contador valor={l.valor} prefijo={l.prefijo} /></b>
            <span className="bc-stat-l">{l.etiqueta}</span>
            {l.nota && <span className="bc-stat-nota">{l.nota}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function BloqueCentral({
  categorias = [],          // CATEGORIAS_PROYECTOS
  proyectos = [],           // BOTONES_PORTADA
  mapaUrl,                  // MAPA_NEGOCIOS_EMBED_URL
  whatsappNumero,           // WHATSAPP_NUMERO
  negocios = [],            // [{ nombre, giro, zona, promo, tel, emoji, logo, color }] (de Baserow, columnas NEGOCIO …)
  portadas = {},            // respaldo local por pestaña
  portadasItems = {},       // { idPestaña: [cuadros] } imágenes, videos y PDFs
  nosotros = null, beneficios = null, causas = null, valores = null,
  negociosSeccion = null, regalos = null, gratitud = null,   // JSX de cada pestaña (viene de App.jsx)
  resumenes = {},           // { idProyecto: "una línea" } para las tarjetas
  logros = [],              // [{ texto, enlace }] para la banda de impacto
  cargando = false,         // true mientras Baserow aún no responde (muestra esqueletos)
  onAbrirCategoria = () => {},
  onAbrirProyecto = () => {},
  onAcceso = () => {}
}) {
  const [idx, setIdx] = useState(0);
  const rootRef = useRef(null);
  const barraRef = useRef(null);
  const fijaRef = useRef(null);
  const altoNormal = useRef(0);
  const encabezadoOculto = useRef(false);
  const [pegado, setPegado] = useState(false);
  const [compensa, setCompensa] = useState(0);
  const tab = TABS[idx];
  const cat = categorias.find((c) => c.id === tab.cat) || {};
  const pct = Math.round(((idx + 1) / TABS.length) * 100);
  const wa = (m) => `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(m)}`;
  const slots = { nosotros, beneficios, causas, valores, negocios: negociosSeccion, regalos, gratitud };
  const imgs = { ...PORTADAS_BASE, ...portadas };

  // Avisa qué pestaña está abierta (la usa el carrusel del final de la página).
  useEffect(() => {
    window.__dcuatesTab = tab.id;
    window.dispatchEvent(new CustomEvent("dcuates:tab-activa", { detail: tab.id }));
  }, [tab.id]);

  // Fuente redondeada (Nunito), una sola vez.
  useEffect(() => {
    if (document.getElementById("bc-font")) return;
    const l = document.createElement("link");
    l.id = "bc-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap";
    document.head.appendChild(l);
  }, []);

  // Abrir la pestaña que contiene un id (enlaces, menú, buscador, irASeccion).
  useEffect(() => {
    const abrirId = (id) => {
      const destino = TABS.findIndex((t) => t.id === id);
      const porId = TABS.findIndex((t) => t.id === ID_A_TAB[id]);
      const i = destino >= 0 ? destino : porId;
      if (i < 0) return false;
      setIdx(i);
      return true;
    };
    const desdeHash = (retraso) => {
      const id = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!id || !abrirId(id)) return;
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), retraso);
    };
    const alEvento = (e) => abrirId(e.detail);
    const alHash = () => desdeHash(200);
    // Clic en cualquier enlace "#algo" (menú, botones): si ese id vive en
    // una pestaña, la abre y baja hasta él — incluso si el hash ya era el mismo.
    const alClic = (e) => {
      const a = e.target?.closest?.('a[href^="#"]');
      const id = a && decodeURIComponent(a.getAttribute("href").slice(1));
      if (!id || !abrirId(id)) return;
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    };
    desdeHash(500);
    window.addEventListener("dcuates:abrir-seccion", alEvento);
    window.addEventListener("hashchange", alHash);
    document.addEventListener("click", alClic);
    return () => {
      window.removeEventListener("dcuates:abrir-seccion", alEvento);
      window.removeEventListener("hashchange", alHash);
      document.removeEventListener("click", alClic);
    };
  }, []);

  // Mantiene visible la pestaña activa en la barra deslizable.
  useEffect(() => {
    barraRef.current?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [idx]);

  // Mide el encabezado fijo (y las pestañas fijas) y publica sus alturas como
  // variables CSS: --alto-header-real (alto del encabezado), --alto-header
  // (dónde se pegan las pestañas: 0 si el encabezado está escondido) y
  // --alto-fijo (encabezado + pestañas, para que los enlaces internos no
  // queden tapados).
  useEffect(() => {
    const raiz = document.documentElement;
    const encabezado = document.getElementById("encabezado-fijo");
    const medir = () => {
      const real = encabezado ? Math.round(encabezado.offsetHeight) : 0;
      const t = fijaRef.current ? Math.round(fijaRef.current.offsetHeight) : 0;
      raiz.style.setProperty("--alto-header-real", `${real}px`);
      raiz.style.setProperty("--alto-fijo", `${real + t}px`);
      raiz.style.setProperty("--alto-header", encabezadoOculto.current ? "0px" : `${real}px`);
    };
    medir();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(medir);
      if (encabezado) ro.observe(encabezado);
      if (fijaRef.current) ro.observe(fijaRef.current);
    }
    window.addEventListener("resize", medir);
    return () => { ro?.disconnect(); window.removeEventListener("resize", medir); };
  }, []);

  // Encabezado más bajo: al bajar por la página el logo y las barras de
  // anuncios se esconden hacia arriba (las pestañas se quedan fijas); al subir
  // un poco, vuelven a aparecer. Arriba de todo y con el menú abierto siempre se ve.
  useEffect(() => {
    const raiz = document.documentElement;
    const encabezado = document.getElementById("encabezado-fijo");
    if (!encabezado) return;
    let ultimaY = window.scrollY;
    let pendiente = false;
    const aplicar = (oculto) => {
      if (encabezadoOculto.current === oculto) return;
      encabezadoOculto.current = oculto;
      encabezado.dataset.oculto = oculto ? "1" : "0";
      const real = parseFloat(getComputedStyle(raiz).getPropertyValue("--alto-header-real")) || encabezado.offsetHeight;
      raiz.style.setProperty("--alto-header", oculto ? "0px" : `${real}px`);
    };
    const revisar = () => {
      pendiente = false;
      const y = window.scrollY;
      const delta = y - ultimaY;
      const menuAbierto = encabezado.querySelector('[aria-expanded="true"]');
      if (y < 140 || menuAbierto) aplicar(false);
      else if (delta > 10) aplicar(true);
      else if (delta < -10) aplicar(false);
      if (Math.abs(delta) > 10 || y < 140) ultimaY = y;
    };
    const alScroll = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); } };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScroll);
      aplicar(false);
    };
  }, []);

  // ¿Las pestañas ya quedaron pegadas arriba? Entonces se compactan.
  useEffect(() => {
    let pendiente = false;
    const revisar = () => {
      pendiente = false;
      const fija = fijaRef.current;
      const raiz = rootRef.current;
      if (!fija || !raiz) return;
      const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-header-real")) || 0;
      const topFija = fija.getBoundingClientRect().top;
      const finBloque = raiz.getBoundingClientRect().bottom;
      setPegado(topFija <= h + 1 && finBloque > h + 120);
    };
    const alScroll = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); } };
    revisar();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => { window.removeEventListener("scroll", alScroll); window.removeEventListener("resize", alScroll); };
  }, []);

  // Al compactarse la barra, el contenido de abajo no debe dar un salto: se
  // reserva el espacio que ocupaba la barra normal.
  useLayoutEffect(() => {
    const fija = fijaRef.current;
    if (!fija) return;
    if (!pegado) {
      altoNormal.current = fija.offsetHeight;
      setCompensa(0);
    } else {
      setCompensa(Math.max(0, altoNormal.current - fija.offsetHeight));
    }
  }, [pegado, idx]);

  const cambiar = (i) => {
    setIdx(i);
    registrar("pestana", { id: TABS[i].id });
    // Si el usuario ya bajó por el contenido, regresa al inicio del bloque.
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-header-real")) || 0;
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < h) rootRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chips = (cat.proyectos || [])
    .map((id) => proyectos.find((p) => p.modal === id))
    .filter(Boolean);

  const textoPortada = tab.cover?.slogan || cat.slogan || tab.label;

  return (
    <section id="mapa-negocios" ref={rootRef} className="bc-root" aria-label="Explora DCUATES">
      <style>{CSS}</style>
      <div className="bc-shell">
        <div
          className={`bc-fija${pegado ? " bc-pegado" : ""}`}
          ref={fijaRef}
          style={compensa ? { marginBottom: compensa } : undefined}
        >
          <div className="bc-tabs" role="tablist" ref={barraRef}>
            {TABS.map((t, i) => (
              <button
                key={t.id} type="button" role="tab" id={`bc-tab-${t.id}`}
                aria-selected={i === idx} aria-controls="bc-panel" aria-label={t.label}
                className="bc-tab" onClick={() => cambiar(i)}
                style={i === idx ? { background: t.color, color: "#fff" } : undefined}
              >
                <span className="bc-ico" style={{ background: i === idx ? "#fff" : t.color }} aria-hidden="true">{t.emoji}</span>
                <span className="bc-tab-t">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="bc-prog" role="progressbar" aria-valuemin={1} aria-valuemax={TABS.length} aria-valuenow={idx + 1} aria-label="Sección actual">
            <div className="bc-track"><div className="bc-fill" style={{ width: `${pct}%`, background: tab.color }} /></div>
            <div className="bc-prog-txt"><span>{pct}%</span><b>{idx + 1} / {TABS.length}</b></div>
          </div>
        </div>

        <div className="bc-panel" id="bc-panel" role="tabpanel" aria-labelledby={`bc-tab-${tab.id}`} key={tab.id} style={{ background: tab.pastel }}>
          {/* La portada (imágenes, videos, PDF) va arriba solo en CAUSAS; en las demás
              pestañas se muestra al final de la página (ver CarruselFinal). */}
          {/* La frase de portada de cada pestaña va arriba de todo, en mayúsculas. */}
          {textoPortada && <p className="bc-frase" style={{ color: tab.color }}>{textoPortada}</p>}

          {tab.id === "causas" && tab.cover && (cargando || !tab.ocultarSinItems || (portadasItems[tab.id] || []).length > 0 || imgs[tab.id]) && (
            <CarruselPortada items={portadasItems[tab.id] || []} tab={tab} fallback={imgs[tab.id]} cargando={cargando} />
          )}

          <nav className="bc-accesos" aria-label="Accesos rápidos">
            <button type="button" className="bc-acc bc-acc-ben" onClick={() => onAcceso("beneficios")}>
              <span className="bc-acc-e" aria-hidden="true">🤲</span><span className="bc-acc-t">Para ti</span>
            </button>
            <button type="button" className="bc-acc bc-acc-reg" onClick={() => onAcceso("registros")}>
              <span className="bc-acc-e" aria-hidden="true">📝</span><span className="bc-acc-t">Registros</span>
            </button>
            <button type="button" className="bc-acc bc-acc-pro" onClick={() => onAcceso("proyectos")}>
              <span className="bc-acc-e" aria-hidden="true">🧭</span><span className="bc-acc-t">Proyectos</span>
            </button>
            <button
              type="button"
              className="bc-acc bc-acc-largo"
              onClick={() => document.getElementById("bc-detalle")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <span className="bc-mano bc-mano-2" aria-hidden="true">👇</span>
              <span className="bc-acc-t">Lo que somos y lo que hacemos</span>
              <span className="bc-mano" aria-hidden="true">👇</span>
            </button>
          </nav>
          <div id="bc-detalle" className="bc-ancla" aria-hidden="true" />

          {tab.texto && <p className="bc-text">{tab.texto}</p>}

          {tab.banda && <BandaImpacto logros={logros} cargando={cargando} tab={tab} />}

          {tab.fichas && (
            <div className="bc-snap bc-fichas" aria-label="Comercios aliados">
              {negocios.map((n) => (
                <article className="bc-ficha" key={n.nombre}>
                  <BotonCompartir variante="circulo" className="bc-ficha-share" hash="mapa-negocios" titulo={n.nombre} texto={n.promo || `${n.giro} en ${n.zona}`} />
                  {n.logo
                    ? <img className="bc-ficha-logo" src={n.logo} alt="" loading="lazy" />
                    : <span className="bc-ficha-ico" style={{ background: n.color }} aria-hidden="true">{n.emoji}</span>}
                  <h3>{n.nombre}</h3>
                  <p>{n.giro} · {n.zona}</p>
                  {n.promo && <p className="bc-promo">{n.promo}</p>}
                  <div className="bc-ficha-btns">
                    <a href={n.tel ? `https://wa.me/${n.tel}` : wa(`¡Hola! Vi ${n.nombre} en DCUATES.`)} target="_blank" rel="noopener noreferrer" style={{ background: "#25d366" }}>WhatsApp</a>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${n.nombre} ${n.zona} Ecatepec`)}`} target="_blank" rel="noopener noreferrer" style={{ background: tab.boton || tab.color }}>Cómo llegar</a>
                  </div>
                </article>
              ))}
              <article className="bc-ficha bc-ficha-cta" style={{ borderColor: tab.color }}>
                <span className="bc-ficha-ico" style={{ background: tab.boton || tab.color }} aria-hidden="true">💼</span>
                <h3>REGISTRA TU NEGOCIO GRATIS</h3>
                <p>Aparece en el mapa y en esta lista.</p>
                <div className="bc-ficha-btns">
                  <button type="button" onClick={() => document.getElementById("publicidad")?.scrollIntoView({ behavior: "smooth", block: "start" })} style={{ background: "#D1530A" }}>Empezar ›</button>
                </div>
              </article>
            </div>
          )}

          {tab.mapa && <MapaLocal url={mapaUrl} color={tab.color} />}

          {chips.length > 0 && (
            <section className="bc-proyectos" style={{ "--c": tab.boton || tab.color }} aria-label="Proyectos de esta sección">
              <h3 className="bc-inv-t" style={{ color: tab.boton || tab.color }}>{tab.invitacion?.titulo || "Conoce los proyectos"}</h3>
              {tab.invitacion?.texto && <p className="bc-inv-p">{tab.invitacion.texto}</p>}
              <p className="bc-hint">👇 Toca un proyecto para entrar</p>
              <TiraAuto intervalo={2000} etiqueta="Proyectos de esta sección" fondo={tab.pastel}>
                {chips.map((p) => {
                  const nombre = bonito(p.t);
                  return (
                    <div className="bc-card" key={p.modal}>
                      <button type="button" className="bc-chip" onClick={() => onAbrirProyecto(p.modal)} aria-label={`Entrar a ${nombre}`}>
                        <Logo src={p.img} emoji={tab.emoji} />
                        <span className="bc-chip-n">{nombre}</span>
                        {resumenes[p.modal] && <span className="bc-chip-d">{resumenes[p.modal]}</span>}
                        <span className="bc-chip-go">Entrar ›</span>
                      </button>
                      <BotonCompartir variante="circulo" className="bc-share" hash={`proyecto-${p.modal}`} titulo={nombre} texto={resumenes[p.modal] || ""} />
                    </div>
                  );
                })}
              </TiraAuto>
            </section>
          )}

          {tab.slot && <div className="bc-slot">{slots[tab.slot]}</div>}

          {(tab.ver || tab.irA || tab.wa) && (
            <div className="bc-actions">
              {tab.ver && (
                <button type="button" className="bc-btn" style={{ background: tab.color }} onClick={() => onAbrirCategoria(tab.cat)}>
                  Ver todo en {tab.label}
                </button>
              )}
              {tab.irA && (
                <button type="button" className="bc-btn" style={{ background: tab.color }}
                  onClick={() => document.getElementById(tab.irA.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                  {tab.irA.label}
                </button>
              )}
              {tab.wa && (
                <a className="bc-btn bc-btn-wa" href={wa(tab.wa)} target="_blank" rel="noopener noreferrer">💬 Preguntar por WhatsApp</a>
              )}
            </div>
          )}

          <div className="bc-compartir-seccion">
            <BotonCompartir variante="bloque" etiqueta="Compartir esta sección" hash={tab.id} titulo={tab.label} texto={tab.invitacion?.texto || tab.texto || "Conoce lo que hacemos por la comunidad"} />
          </div>

          <div className="bc-nav">
            <button type="button" disabled={idx === 0} onClick={() => cambiar(idx - 1)}>‹ {idx > 0 ? TABS[idx - 1].label : "Anterior"}</button>
            <button type="button" onClick={() => cambiar(idx < TABS.length - 1 ? idx + 1 : 0)}>{idx < TABS.length - 1 ? TABS[idx + 1].label : "Volver a " + TABS[0].label + " (inicio)"} {idx < TABS.length - 1 ? "›" : "↺"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.bc-root{--ink:#1f2a37;--pad:16px;font-family:"Nunito","Varela Round",ui-rounded,system-ui,sans-serif;color:var(--ink);width:100%;margin:0 auto;box-sizing:border-box;scroll-margin-top:192px}
.bc-root *{font-family:inherit}
@media (min-width:768px){.bc-root{scroll-margin-top:144px}}
.bc-root{scroll-margin-top:calc(var(--alto-header-real,160px) + 8px)}
/* Encabezado más bajo: se esconde hacia arriba al bajar y reaparece al subir. */
#encabezado-fijo{transition:transform .3s ease}
#encabezado-fijo[data-oculto="1"]{transform:translateY(-102%)}
/* Los enlaces internos (#donaciones, #solicitudes…) no deben quedar tapados por el encabezado y las pestañas fijas. */
[class*="scroll-mt-"]{scroll-margin-top:calc(var(--alto-fijo,200px) + 8px) !important}
.bc-shell{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(31,42,55,.10)}
.bc-fija{position:sticky;top:var(--alto-header,0px);z-index:30;background:#fff;border-radius:16px 16px 0 0;transition:box-shadow .2s,top .3s ease}
.bc-fija.bc-pegado{border-radius:0;box-shadow:0 6px 12px rgba(15,45,30,.22)}
.bc-pegado .bc-tabs{padding:4px 6px 2px;gap:4px;justify-content:center}
.bc-pegado .bc-tab{flex:0 0 auto;flex-direction:row;justify-content:center;gap:6px;min-height:44px;padding:4px 8px;font-size:12px}
.bc-pegado .bc-tab[aria-selected="false"] .bc-tab-t{display:none}
.bc-pegado .bc-ico{width:30px;height:30px;font-size:17px}
.bc-pegado .bc-prog{padding:0 12px 5px}
.bc-pegado .bc-track{height:4px}
.bc-pegado .bc-prog-txt{display:none}
.bc-tabs{display:flex;gap:6px;padding:8px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;overscroll-behavior-x:contain}
.bc-tabs::-webkit-scrollbar{display:none}
.bc-tab{flex:0 0 88px;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:5px;min-height:72px;padding:8px 4px;border:0;border-radius:14px;background:#f4f6f8;color:var(--ink);font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;transition:background .2s,color .2s}
.bc-tab:hover{background:#e9edf1}
.bc-ico{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:22px;line-height:1;transition:background .2s}
.bc-prog{padding:2px 14px 8px}
.bc-track{height:6px;border-radius:99px;background:#e8ecef;overflow:hidden}
.bc-fill{height:100%;border-radius:99px;transition:width .45s ease,background .3s}
.bc-prog-txt{display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-top:4px;color:#5b6675}
.bc-prog-txt b{color:var(--ink)}
.bc-panel{padding:var(--pad);border-radius:0 0 16px 16px;overflow:hidden;animation:bc-in .25s ease}
@keyframes bc-in{from{opacity:.4}to{opacity:1}}
.bc-head{display:flex;align-items:center;gap:10px;margin:0 2px 4px;font-size:30px}
.bc-head div{display:flex;flex-direction:column;line-height:1.1}
.bc-head b{font-size:20px;font-weight:900}
.bc-head small{font-size:13px;font-weight:800;color:#5b6675}
.bc-text{margin:0 2px 4px;font-size:16px;line-height:1.5;font-weight:600;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bc-accesos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0 4px}
.bc-acc{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:62px;padding:8px 4px;border:0;border-radius:16px;color:#fff;font-family:inherit;cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.22);transition:transform .12s,box-shadow .12s;-webkit-tap-highlight-color:transparent}
.bc-acc:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.22)}
.bc-acc-e{font-size:22px;line-height:1}
.bc-acc-t{font-size:12px;font-weight:900;letter-spacing:.02em;text-transform:uppercase;line-height:1.1;text-align:center}
.bc-acc-ben{background:#e65100}
.bc-acc-reg{background:#2E9E5B}
.bc-acc-pro{background:#1B6F8A}
.bc-acc-largo{grid-column:1/-1;flex-direction:row;gap:10px;min-height:54px;background:#17472d}
.bc-acc-largo .bc-acc-t{font-size:13px;color:#FFD84D;letter-spacing:.03em}
.bc-mano{font-size:26px;line-height:1;display:inline-block;animation:bc-mano 1.1s ease-in-out infinite}
@keyframes bc-mano{0%,100%{transform:translateY(-4px)}50%{transform:translateY(6px)}}
.bc-ancla{height:0;scroll-margin-top:190px}
.bc-frase{margin:2px 2px 12px;font-size:18px;font-weight:900;line-height:1.2;text-transform:uppercase;letter-spacing:.01em}
.bc-mano-2{animation-delay:.55s}
.bc-sub{margin:10px 2px 6px;font-size:15px;font-weight:900}
.bc-slot{margin-top:14px;min-width:0}
.bc-snap{display:flex;gap:12px;margin:8px calc(var(--pad) * -1) 0;padding:4px var(--pad) 12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--pad);-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none}
.bc-snap::-webkit-scrollbar{display:none}
.bc-sub + .bc-snap{margin-top:0}
.bc-ficha{position:relative;flex:0 0 min(78%,250px);scroll-snap-align:start;background:#fff;border-radius:16px;padding:14px;box-shadow:0 4px 12px rgba(31,42,55,.08);border:2px solid transparent;display:flex;flex-direction:column;gap:4px}
.bc-ficha h3{margin:6px 0 0;font-size:16px;font-weight:900;line-height:1.2}
.bc-ficha p{margin:0;font-size:13px;font-weight:700;color:#5b6675}
.bc-ficha .bc-promo{color:var(--ink);background:#fff7d6;border-radius:8px;padding:4px 8px;margin-top:4px}
.bc-ficha-ico{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:24px}
.bc-ficha-btns{display:flex;gap:6px;margin-top:auto;padding-top:10px}
.bc-ficha-btns a,.bc-ficha-btns button{flex:1;min-height:40px;display:grid;place-items:center;border:0;border-radius:12px;color:#fff;font-family:inherit;font-weight:900;font-size:13px;text-decoration:none;cursor:pointer}
.bc-ficha-cta{border-style:dashed}
.bc-map{position:relative;margin:0 0 14px;height:280px;background:#dfe7e2;border-radius:16px;overflow:hidden;box-shadow:0 6px 16px rgba(31,42,55,.12)}
.bc-map iframe{width:100%;height:100%;border:0;display:block}
.bc-map-lock{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding:12px;touch-action:pan-x pan-y;background:rgba(255,255,255,.04)}
.bc-pill{min-height:40px;padding:8px 14px;border:0;border-radius:99px;background:rgba(31,42,55,.85);color:#fff;font-family:inherit;font-weight:800;font-size:13px;cursor:pointer}
.bc-pill-on{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);white-space:nowrap}
.bc-actions{display:grid;gap:10px;margin-top:10px}
.bc-btn{display:grid;place-items:center;min-height:48px;padding:10px 16px;border:0;border-radius:14px;color:#fff;font-family:inherit;font-weight:900;font-size:15px;text-decoration:none;cursor:pointer}
.bc-btn-wa{background:#25d366}
.bc-nav{display:flex;justify-content:space-between;gap:10px;margin-top:14px}
.bc-nav button{flex:1;min-height:44px;border:2px solid rgba(31,42,55,.12);border-radius:14px;background:rgba(255,255,255,.7);color:var(--ink);font-family:inherit;font-weight:800;font-size:14px;cursor:pointer}
.bc-nav button:disabled{opacity:.35;cursor:default}
.bc-root button:focus-visible,.bc-root a:focus-visible{outline:3px solid #1f2a37;outline-offset:2px}

/* ---- Banda de impacto ---- */
.bc-banda{margin:14px 0 6px;padding:14px;border-radius:18px;background:#0f2d1e;background:linear-gradient(135deg,#0f2d1e,#17472d);border-top:5px solid var(--c,#FFD84D);color:#fff;box-shadow:0 8px 18px rgba(15,45,30,.28)}
.bc-banda-t{margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#FFD84D}
.bc-banda-g{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.bc-stat{display:flex;flex-direction:column;gap:2px;padding:10px 11px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14)}
.bc-stat-e{font-size:22px;line-height:1}
.bc-stat-n{font-size:27px;font-weight:900;line-height:1.05;color:#FFD84D;font-variant-numeric:tabular-nums}
.bc-stat-l{font-size:12px;font-weight:700;line-height:1.25;color:#eaf6ee;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bc-stat-nota{font-size:10.5px;font-weight:700;font-style:italic;line-height:1.25;color:#bfe3cb;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bc-esq{background:linear-gradient(90deg,rgba(255,255,255,.08) 25%,rgba(255,255,255,.22) 50%,rgba(255,255,255,.08) 75%);background-size:200% 100%;animation:bc-brilla 1.3s linear infinite}
@keyframes bc-brilla{from{background-position:200% 0}to{background-position:-200% 0}}

/* ---- Invitación + tarjetas de proyecto (se ven como botones) ---- */
.bc-proyectos{margin-top:20px}
.bc-inv-t{margin:0 2px 4px;font-size:21px;font-weight:900;line-height:1.15}
.bc-inv-p{margin:0 2px 6px;font-size:15px;font-weight:700;line-height:1.45;color:#3b4654}
.bc-hint{margin:0 2px 2px;font-size:12px;font-weight:800;color:#5b6675}
.bc-card{position:relative;width:158px;display:flex}
.bc-chip{width:100%;display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px 12px;background:#fff;border:2px solid rgba(31,42,55,.08);border-bottom:6px solid var(--c);border-radius:18px;box-shadow:0 6px 14px rgba(31,42,55,.10);cursor:pointer;color:var(--ink);text-align:center;font-family:inherit;transition:transform .12s ease,border-bottom-width .12s ease,box-shadow .12s ease}
.bc-chip:hover{transform:translateY(-2px);box-shadow:0 10px 18px rgba(31,42,55,.14)}
.bc-chip:active{transform:translateY(4px);border-bottom-width:2px;box-shadow:0 2px 6px rgba(31,42,55,.12)}
.bc-chip img{width:72px;height:72px;object-fit:contain}
.bc-chip-emoji{width:72px;height:72px;display:grid;place-items:center;font-size:44px}
.bc-chip-n{font-weight:900;font-size:13px;line-height:1.15}
.bc-chip-d{font-size:11.5px;font-weight:700;color:#5b6675;line-height:1.25}
.bc-chip-go{margin-top:auto;display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 18px;border-radius:99px;background:var(--c);color:#fff;font-weight:900;font-size:13px;letter-spacing:.01em}

.bc-share{position:absolute;top:8px;right:8px;z-index:2}
.bc-ficha-share{position:absolute;top:10px;right:10px}
.bc-ficha-logo{width:44px;height:44px;border-radius:14px;object-fit:cover;background:#f3f5f7}
.bc-map-share{position:absolute;top:10px;right:10px;z-index:6}
.bc-compartir-seccion{margin-top:10px}

/* ---- TABLETA (>= 768 px): las 7 pestañas caben sin deslizar ---- */
@media (min-width:768px){
  .bc-root{--pad:24px}
  .bc-tabs{overflow:visible;padding:12px 12px 8px;gap:8px}
  .bc-tab{flex:1 1 0;min-height:84px;font-size:15px;gap:6px}
  .bc-pegado .bc-tab{flex:1 1 0;min-height:48px;font-size:14px}
  .bc-pegado .bc-tab[aria-selected="false"] .bc-tab-t{display:inline}
  .bc-ico{width:44px;height:44px;font-size:25px}
  .bc-prog{padding:2px 20px 10px}
      .bc-text{font-size:18px;-webkit-line-clamp:4}
  .bc-sub{font-size:17px}
  .bc-map{height:380px}
  .bc-chip img{width:84px;height:84px}
  .bc-chip-emoji{width:84px;height:84px;font-size:50px}
  .bc-snap{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));overflow:visible;margin:8px 0 0;padding:4px 0 12px}
  .bc-snap.bc-fichas{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}
  .bc-card{width:190px}
  .bc-ficha{flex:none}
    .bc-banda-g{grid-template-columns:repeat(4,1fr)}
  .bc-inv-t{font-size:25px}
  .bc-inv-p{font-size:17px}
  .bc-actions{grid-template-columns:1fr 1fr}
  .bc-btn{font-size:16px}
}
/* ---- PC (>= 1100 px) ---- */
@media (min-width:1100px){
  .bc-root{--pad:32px}
    .bc-map{height:460px}
  .bc-text{font-size:19px}
}
@media (prefers-reduced-motion:reduce){.bc-panel{animation:none}.bc-fill,.bc-tab,.bc-chip,#encabezado-fijo,.bc-fija{transition:none}.bc-esq{animation:none}}
`;

// -------------------------------------------------------------------------
// CarruselFinal — la portada (imágenes, videos, PDF) de la pestaña abierta,
// al final de la página, después de la barra de videos. Corre en sentido
// contrario al de los videos. En CAUSAS no aparece: ahí la portada va arriba.
// -------------------------------------------------------------------------
export function CarruselFinal({ portadasItems = {}, portadas = {}, categorias = [], cargando = false }) {
  const [id, setId] = useState(() => (typeof window !== "undefined" && window.__dcuatesTab) || "nosotros");
  useEffect(() => {
    const al = (e) => setId(e.detail);
    window.addEventListener("dcuates:tab-activa", al);
    return () => window.removeEventListener("dcuates:tab-activa", al);
  }, []);
  const tab = TABS.find((t) => t.id === id) || TABS[0];
  if (tab.id === "causas" || !tab.cover) return null;
  const cat = categorias.find((c) => c.id === tab.cat) || {};
  const imgs = { ...PORTADAS_BASE, ...portadas };
  const items = portadasItems[tab.id] || [];
  if (!cargando && items.length === 0 && !imgs[tab.id]) return null;
  const slogan = tab.cover?.slogan || cat.slogan || tab.label;
  return (
    <section className="cf-root" style={{ background: tab.pastel }} aria-label={`Portada de ${tab.label}`}>
      <style>{".cf-root>.cp-root{padding:16px 16px 6px;margin:0;max-width:72rem;margin-left:auto;margin-right:auto}"}</style>
      <CarruselPortada key={tab.id} items={items} tab={tab} slogan={slogan} fallback={imgs[tab.id]} cargando={cargando} inverso />
    </section>
  );
}
