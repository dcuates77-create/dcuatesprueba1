import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import CarruselPortada from "./CarruselPortada";

// =========================================================================
// BLOQUE CENTRAL INTERACTIVO — DCUATES (CLON8) · FASE 3
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
    cover: { slogan: "Juntos hacemos una mejor comunidad ⭐" }, slot: "nosotros"
  },
  {
    id: "beneficios", label: "Beneficios", emoji: "🎁", color: "#F07A1A", pastel: "#FFF1E1",
    cat: "beneficios-comunitarios", cover: {}, ver: true, slot: "beneficios",
    texto: "Libros prestados, asesorías, bienestar y apoyo para tus mascotas. Todo gratis y cerca de ti.",
    wa: "¡Hola DCUATES! Quiero conocer los beneficios comunitarios disponibles."
  },
  {
    id: "causas", label: "Causas", emoji: "❤️", color: "#E5484D", pastel: "#FFE9EB",
    cat: "apoya-causas", cover: { slogan: "Apoyo Voluntario: tu ayuda cambia vidas" }, slot: "causas", tituloChips: "Proyectos para apoyar"
  },
  {
    id: "valores", label: "Valores", emoji: "✨", color: "#7A5AD8", pastel: "#EFEAFE",
    cat: "sumando-valores", cover: {}, ver: true, slot: "valores",
    texto: "Confianza, alianzas y buenas noticias del barrio: así se fortalece nuestra comunidad.",
    wa: "¡Hola DCUATES! Quiero saber más sobre sus valores y alianzas."
  },
  {
    id: "negocios", label: "Negocios", emoji: "🗺️", color: "#2E9E5B", pastel: "#E4F6EB",
    cat: "alianzas-y-negocios", mapa: true, fichas: true, ver: true, slot: "negocios",
    texto: "Encuentra comercios aliados en Jardines de Morelos o registra el tuyo gratis.",
    wa: "¡Hola DCUATES! Quiero registrar mi negocio."
  },
  {
    id: "regalos", label: "Regalos", emoji: "🎉", color: "#D6336C", pastel: "#FDE8F1",
    cover: { slogan: "Retos y regalos que nos motivan" }, slot: "regalos",
    texto: "Porque todo lo bueno merece ser compartido. Envíanos tus propuestas de retos y regalos."
  },
  {
    id: "gratitud", label: "Gratitud", emoji: "🙏", color: "#B7791F", pastel: "#FFF4D6",
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
  publicidad: "negocios",
  "retos-regalos": "regalos"
};

// Fichas de EJEMPLO — reemplázalas con tus negocios reales (o usa la prop
// "negocios"). tel = número con lada, sin "+" (ej. 525512345678).
const NEGOCIOS_EJEMPLO = [
  { nombre: "Taquería El Sol", giro: "Comida", emoji: "🌮", color: "#F07A1A", zona: "Jardines de Morelos", promo: "20% en tu primera visita" },
  { nombre: "Estética Lupita", giro: "Belleza", emoji: "💇", color: "#E5484D", zona: "Jardines de Morelos", promo: "Corte + peinado con descuento" },
  { nombre: "Panadería Café Sol", giro: "Panadería", emoji: "🥐", color: "#C58A1B", zona: "Jardines de Morelos", promo: "Aliado de la Bibliobici" },
  { nombre: "Papelería del Barrio", giro: "Papelería", emoji: "📚", color: "#3B82C4", zona: "Jardines de Morelos", promo: "10% para vecinos DCUATES" }
];

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
    <div className="bc-map">
      <iframe src={url} title="Mapa de negocios locales DCUATES" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
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

export default function BloqueCentral({
  categorias = [],          // CATEGORIAS_PROYECTOS
  proyectos = [],           // BOTONES_PORTADA
  mapaUrl,                  // MAPA_NEGOCIOS_EMBED_URL
  whatsappNumero,           // WHATSAPP_NUMERO
  negocios = NEGOCIOS_EJEMPLO,
  portadas = {},            // respaldo local por pestaña
  portadasItems = {},       // { idPestaña: [cuadros] } imágenes, videos y PDFs
  nosotros = null, beneficios = null, causas = null, valores = null,
  negociosSeccion = null, regalos = null, gratitud = null,   // JSX de cada pestaña (viene de App.jsx)
  onAbrirCategoria = () => {},
  onAbrirProyecto = () => {}
}) {
  const [idx, setIdx] = useState(0);
  const rootRef = useRef(null);
  const barraRef = useRef(null);
  const fijaRef = useRef(null);
  const altoNormal = useRef(0);
  const [pegado, setPegado] = useState(false);
  const [compensa, setCompensa] = useState(0);
  const tab = TABS[idx];
  const cat = categorias.find((c) => c.id === tab.cat) || {};
  const pct = Math.round(((idx + 1) / TABS.length) * 100);
  const wa = (m) => `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(m)}`;
  const slots = { nosotros, beneficios, causas, valores, negocios: negociosSeccion, regalos, gratitud };
  const imgs = { ...PORTADAS_BASE, ...portadas };

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
  // variables CSS: sirven para pegar las pestañas justo debajo de las barras
  // de anuncios y para que los enlaces internos no queden tapados.
  useEffect(() => {
    const raiz = document.documentElement;
    const encabezado = document.getElementById("encabezado-fijo");
    const medir = () => {
      const h = encabezado ? Math.round(encabezado.getBoundingClientRect().height) : 0;
      const t = fijaRef.current ? Math.round(fijaRef.current.getBoundingClientRect().height) : 0;
      raiz.style.setProperty("--alto-header", `${h}px`);
      raiz.style.setProperty("--alto-fijo", `${h + t}px`);
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

  // ¿Las pestañas ya quedaron pegadas arriba? Entonces se compactan.
  useEffect(() => {
    let pendiente = false;
    const revisar = () => {
      pendiente = false;
      const fija = fijaRef.current;
      const raiz = rootRef.current;
      if (!fija || !raiz) return;
      const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-header")) || 0;
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
    // Si el usuario ya bajó por el contenido, regresa al inicio del bloque.
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-header")) || 0;
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
          {tab.mapa ? (
            <MapaLocal url={mapaUrl} color={tab.color} />
          ) : tab.cover ? (
            <CarruselPortada items={portadasItems[tab.id] || []} tab={tab} slogan={textoPortada} fallback={imgs[tab.id]} />
          ) : tab.encabezado ? (
            <div className="bc-head" style={{ color: tab.color }}>
              <span aria-hidden="true">{tab.emoji}</span>
              <div><b>{tab.label}</b><small>{cat.slogan}</small></div>
            </div>
          ) : null}

          {tab.texto && <p className="bc-text">{tab.texto}</p>}

          {tab.fichas && (
            <div className="bc-snap bc-fichas" aria-label="Comercios aliados">
              {negocios.map((n) => (
                <article className="bc-ficha" key={n.nombre}>
                  <span className="bc-ficha-ico" style={{ background: n.color }} aria-hidden="true">{n.emoji}</span>
                  <h3>{n.nombre}</h3>
                  <p>{n.giro} · {n.zona}</p>
                  {n.promo && <p className="bc-promo">{n.promo}</p>}
                  <div className="bc-ficha-btns">
                    <a href={n.tel ? `https://wa.me/${n.tel}` : wa(`¡Hola! Vi ${n.nombre} en DCUATES.`)} target="_blank" rel="noopener noreferrer" style={{ background: "#25d366" }}>WhatsApp</a>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${n.nombre} ${n.zona} Ecatepec`)}`} target="_blank" rel="noopener noreferrer" style={{ background: tab.color }}>Cómo llegar</a>
                  </div>
                </article>
              ))}
              <article className="bc-ficha bc-ficha-cta" style={{ borderColor: tab.color }}>
                <span className="bc-ficha-ico" style={{ background: tab.color }} aria-hidden="true">💼</span>
                <h3>Registra tu negocio gratis</h3>
                <p>Aparece en el mapa y en esta lista.</p>
                <div className="bc-ficha-btns">
                  <button type="button" onClick={() => onAbrirProyecto("publicidad-tarjeta")} style={{ background: "#F07A1A" }}>Empezar ›</button>
                </div>
              </article>
            </div>
          )}

          {chips.length > 0 && (
            <>
              <h3 className="bc-sub">{tab.tituloChips || "Proyectos incluidos"}</h3>
              <div className="bc-snap" aria-label="Proyectos de esta sección">
                {chips.map((p) => (
                  <button key={p.modal} type="button" className="bc-chip" onClick={() => onAbrirProyecto(p.modal)}>
                    <Logo src={p.img} emoji={tab.emoji} />
                    <span>{bonito(p.t)}</span>
                  </button>
                ))}
              </div>
            </>
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

          <div className="bc-nav">
            <button type="button" disabled={idx === 0} onClick={() => cambiar(idx - 1)}>‹ {idx > 0 ? TABS[idx - 1].label : "Anterior"}</button>
            <button type="button" disabled={idx === TABS.length - 1} onClick={() => cambiar(idx + 1)}>{idx < TABS.length - 1 ? TABS[idx + 1].label : "Siguiente"} ›</button>
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
.bc-root{scroll-margin-top:calc(var(--alto-header,160px) + 8px)}
/* Los enlaces internos (#donaciones, #solicitudes…) no deben quedar tapados por el encabezado y las pestañas fijas. */
[class*="scroll-mt-"]{scroll-margin-top:calc(var(--alto-fijo,200px) + 8px) !important}
.bc-shell{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(31,42,55,.10)}
.bc-fija{position:sticky;top:var(--alto-header,0px);z-index:30;background:#fff;border-radius:16px 16px 0 0;transition:box-shadow .2s}
.bc-fija.bc-pegado{border-radius:0;box-shadow:0 6px 12px rgba(15,45,30,.22)}
.bc-pegado .bc-tabs{padding:4px 6px 2px;gap:4px;justify-content:center}
.bc-pegado .bc-tab{flex:0 0 auto;flex-direction:row;justify-content:center;gap:6px;min-height:44px;padding:4px 8px;font-size:12px}
.bc-pegado .bc-tab[aria-selected="false"] .bc-tab-t{display:none}
.bc-pegado .bc-ico{width:26px;height:26px;font-size:15px}
.bc-pegado .bc-prog{padding:0 12px 5px}
.bc-pegado .bc-track{height:4px}
.bc-pegado .bc-prog-txt{display:none}
.bc-tabs{display:flex;gap:6px;padding:8px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;overscroll-behavior-x:contain}
.bc-tabs::-webkit-scrollbar{display:none}
.bc-tab{flex:0 0 84px;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:64px;padding:8px 4px;border:0;border-radius:14px;background:#f4f6f8;color:var(--ink);font-family:inherit;font-weight:800;font-size:13px;cursor:pointer;transition:background .2s,color .2s}
.bc-tab:hover{background:#e9edf1}
.bc-ico{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:17px;line-height:1;transition:background .2s}
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
.bc-sub{margin:10px 2px 6px;font-size:15px;font-weight:900}
.bc-slot{margin-top:14px;min-width:0}
.bc-snap{display:flex;gap:12px;margin:8px calc(var(--pad) * -1) 0;padding:4px var(--pad) 12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--pad);-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none}
.bc-snap::-webkit-scrollbar{display:none}
.bc-sub + .bc-snap{margin-top:0}
.bc-chip{flex:0 0 132px;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px;border:0;border-radius:16px;background:#fff;box-shadow:0 4px 12px rgba(31,42,55,.08);font-family:inherit;font-weight:800;font-size:13px;line-height:1.2;text-align:center;color:var(--ink);cursor:pointer;transition:transform .15s}
.bc-chip:hover{transform:translateY(-2px)}
.bc-chip img{width:56px;height:56px;object-fit:contain}
.bc-chip-emoji{width:56px;height:56px;display:grid;place-items:center;font-size:34px}
.bc-ficha{flex:0 0 min(78%,250px);scroll-snap-align:start;background:#fff;border-radius:16px;padding:14px;box-shadow:0 4px 12px rgba(31,42,55,.08);border:2px solid transparent;display:flex;flex-direction:column;gap:4px}
.bc-ficha h3{margin:6px 0 0;font-size:16px;font-weight:900;line-height:1.2}
.bc-ficha p{margin:0;font-size:13px;font-weight:700;color:#5b6675}
.bc-ficha .bc-promo{color:var(--ink);background:#fff7d6;border-radius:8px;padding:4px 8px;margin-top:4px}
.bc-ficha-ico{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:24px}
.bc-ficha-btns{display:flex;gap:6px;margin-top:auto;padding-top:10px}
.bc-ficha-btns a,.bc-ficha-btns button{flex:1;min-height:40px;display:grid;place-items:center;border:0;border-radius:12px;color:#fff;font-family:inherit;font-weight:900;font-size:13px;text-decoration:none;cursor:pointer}
.bc-ficha-cta{border-style:dashed}
.bc-map{position:relative;margin:calc(var(--pad) * -1) calc(var(--pad) * -1) 14px;height:280px;background:#dfe7e2}
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

/* ---- TABLETA (>= 768 px): las 7 pestañas caben sin deslizar ---- */
@media (min-width:768px){
  .bc-root{--pad:24px}
  .bc-tabs{overflow:visible;padding:12px 12px 8px;gap:8px}
  .bc-tab{flex:1 1 0;min-height:76px;font-size:15px;gap:6px}
  .bc-pegado .bc-tab{flex:1 1 0;min-height:48px;font-size:14px}
  .bc-pegado .bc-tab[aria-selected="false"] .bc-tab-t{display:inline}
  .bc-ico{width:36px;height:36px;font-size:20px}
  .bc-prog{padding:2px 20px 10px}
      .bc-text{font-size:18px;-webkit-line-clamp:4}
  .bc-sub{font-size:17px}
  .bc-map{height:380px}
  .bc-snap{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));overflow:visible;margin:8px 0 0;padding:4px 0 12px}
  .bc-snap.bc-fichas{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}
  .bc-chip,.bc-ficha{flex:none}
  .bc-actions{grid-template-columns:1fr 1fr}
  .bc-btn{font-size:16px}
}
/* ---- PC (>= 1100 px) ---- */
@media (min-width:1100px){
  .bc-root{--pad:32px}
    .bc-map{height:460px}
  .bc-text{font-size:19px}
}
@media (prefers-reduced-motion:reduce){.bc-panel{animation:none}.bc-fill,.bc-tab,.bc-chip{transition:none}}
`;
