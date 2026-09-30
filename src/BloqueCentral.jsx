import React, { useState, useEffect, useRef } from "react";

// =========================================================================
// BLOQUE CENTRAL INTERACTIVO — DCUATES (CLON8)
// Reemplaza SOLO la cuadrícula de 4 categorías + el mapa de negocios.
// No usa Tailwind: todo el CSS va en el <style> de abajo (clases "bc-"),
// así no choca con el resto de tu App.jsx.
// =========================================================================

const TABS = [
  {
    id: "beneficios", cat: "beneficios-comunitarios", label: "Beneficios", emoji: "🎁",
    color: "#F07A1A", pastel: "#FFF1E1",
    texto: "Libros prestados, asesorías, bienestar y apoyo para tus mascotas. Todo gratis y cerca de ti.",
    wa: "¡Hola DCUATES! Quiero conocer los beneficios comunitarios disponibles."
  },
  {
    id: "causas", cat: "apoya-causas", label: "Causas", emoji: "❤️",
    color: "#E5484D", pastel: "#FFE9EB",
    texto: "Aporta tiempo, dinero o talento a causas que cambian vidas. Cada ayuda cuenta.",
    wa: "¡Hola DCUATES! Quiero apoyar una causa. ¿Cómo puedo sumarme?"
  },
  {
    id: "valores", cat: "sumando-valores", label: "Valores", emoji: "✨",
    color: "#7A5AD8", pastel: "#EFEAFE",
    texto: "Confianza, alianzas y buenas noticias del barrio: así se fortalece nuestra comunidad.",
    wa: "¡Hola DCUATES! Quiero saber más sobre sus valores y alianzas."
  },
  {
    id: "negocios", cat: "alianzas-y-negocios", label: "Negocios", emoji: "🗺️",
    color: "#2E9E5B", pastel: "#E4F6EB",
    texto: "Encuentra comercios aliados en Jardines de Morelos o registra el tuyo gratis.",
    wa: "¡Hola DCUATES! Quiero registrar mi negocio."
  }
];

// Fichas de EJEMPLO — reemplázalas con tus negocios reales (o pásalas por la
// prop "negocios"). tel = número con lada, sin "+" (ej. 525512345678).
const NEGOCIOS_EJEMPLO = [
  { nombre: "Taquería El Sol", giro: "Comida", emoji: "🌮", color: "#F07A1A", zona: "Jardines de Morelos", promo: "20% en tu primera visita" },
  { nombre: "Estética Lupita", giro: "Belleza", emoji: "💇", color: "#E5484D", zona: "Jardines de Morelos", promo: "Corte + peinado con descuento" },
  { nombre: "Panadería Café Sol", giro: "Panadería", emoji: "🥐", color: "#C58A1B", zona: "Jardines de Morelos", promo: "Aliado de la Bibliobici" },
  { nombre: "Papelería del Barrio", giro: "Papelería", emoji: "📚", color: "#3B82C4", zona: "Jardines de Morelos", promo: "10% para vecinos DCUATES" }
];

const MENORES = /^(de|del|y|con|a|el|la|los|las|en)$/i;
const bonito = (s) =>
  s.toLowerCase().split(" ").map((w, i) => (i && MENORES.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");

function Logo({ src, emoji }) {
  const [fallo, setFallo] = useState(!src);
  return fallo ? (
    <span className="bc-chip-emoji" aria-hidden="true">{emoji}</span>
  ) : (
    <img src={src} alt="" loading="lazy" onError={() => setFallo(true)} />
  );
}

function Portada({ src, tab, slogan }) {
  const [fallo, setFallo] = useState(!src);
  return (
    <div className="bc-cover" style={{ background: `linear-gradient(135deg, ${tab.color}, ${tab.color}99)` }}>
      {!fallo && <img src={src} alt="" loading="lazy" onError={() => setFallo(true)} />}
      {fallo && <span className="bc-cover-emoji" aria-hidden="true">{tab.emoji}</span>}
      <div className="bc-cover-txt">{slogan}</div>
    </div>
  );
}

// Mapa con bloqueo: en celular (puntero táctil) una capa transparente deja
// pasar el scroll de la página con un dedo; con DOS dedos se desbloquea el
// mapa. Se vuelve a bloquear solo al hacer scroll en la página o tras 8 s.
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
          <button type="button" className="bc-pill" onClick={() => setActivo(true)}>
            ✌️ Dos dedos para mover el mapa
          </button>
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
  proyectos = [],           // BOTONES_PORTADA (para logos y nombres)
  mapaUrl,                  // MAPA_NEGOCIOS_EMBED_URL
  whatsappNumero,           // WHATSAPP_NUMERO
  negocios = NEGOCIOS_EJEMPLO,
  portadas = { beneficios: "/images/bibliobici-movil.png" }, // { idDePestaña: "/images/x.png" }
  onAbrirCategoria = () => {},
  onAbrirProyecto = () => {}
}) {
  const [idx, setIdx] = useState(0);
  const barraRef = useRef(null);
  const tab = TABS[idx];
  const cat = categorias.find((c) => c.id === tab.cat) || {};
  const pct = ((idx + 1) / TABS.length) * 100;
  const wa = (m) => `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(m)}`;

  // Fuente redondeada (Nunito) — se inyecta una sola vez.
  useEffect(() => {
    if (document.getElementById("bc-font")) return;
    const l = document.createElement("link");
    l.id = "bc-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap";
    document.head.appendChild(l);
  }, []);

  // Si llegan con #mapa-negocios (buscador del sitio), abre la pestaña Negocios.
  useEffect(() => { if (window.location.hash === "#mapa-negocios") setIdx(3); }, []);

  // Mantiene visible la pestaña activa dentro de la barra con scroll snap.
  useEffect(() => {
    barraRef.current?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [idx]);

  const chips = (cat.proyectos || [])
    .map((id) => proyectos.find((p) => p.modal === id))
    .filter(Boolean);

  return (
    <section id="mapa-negocios" className="bc-root" aria-label="Explora DCUATES">
      <style>{CSS}</style>
      <div className="bc-shell">
        <div className="bc-tabs" role="tablist" ref={barraRef}>
          {TABS.map((t, i) => (
            <button
              key={t.id} type="button" role="tab" id={`bc-tab-${t.id}`}
              aria-selected={i === idx} aria-controls="bc-panel"
              className="bc-tab" onClick={() => setIdx(i)}
              style={i === idx ? { background: t.color, color: "#fff" } : { "--c": t.color }}
            >
              <span className="bc-ico" style={i === idx ? { background: "#fff" } : { background: t.color }} aria-hidden="true">{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="bc-prog" role="progressbar" aria-valuemin={1} aria-valuemax={TABS.length} aria-valuenow={idx + 1} aria-label="Sección actual">
          <div className="bc-track"><div className="bc-fill" style={{ width: `${pct}%`, background: tab.color }} /></div>
          <div className="bc-prog-txt"><span>{pct}%</span><b>{idx + 1} / {TABS.length}</b></div>
        </div>

        <div className="bc-panel" id="bc-panel" role="tabpanel" aria-labelledby={`bc-tab-${tab.id}`} key={tab.id} style={{ background: tab.pastel }}>
          {tab.id !== "negocios" ? (
            <Portada src={portadas[tab.id]} tab={tab} slogan={cat.slogan || tab.label} />
          ) : (
            <MapaLocal url={mapaUrl} color={tab.color} />
          )}

          <p className="bc-text">{tab.texto}</p>

          {tab.id === "negocios" && (
            <div className="bc-snap" aria-label="Comercios aliados">
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
              <h3 className="bc-sub">Proyectos incluidos</h3>
              <div className="bc-snap" aria-label="Proyectos de esta categoría">
                {chips.map((p) => (
                  <button key={p.modal} type="button" className="bc-chip" onClick={() => onAbrirProyecto(p.modal)}>
                    <Logo src={p.img} emoji={tab.emoji} />
                    <span>{bonito(p.t)}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="bc-actions">
            <button type="button" className="bc-btn" style={{ background: tab.color }} onClick={() => onAbrirCategoria(tab.cat)}>
              Ver todo en {tab.label}
            </button>
            <a className="bc-btn bc-btn-wa" href={wa(tab.wa)} target="_blank" rel="noopener noreferrer">💬 Preguntar por WhatsApp</a>
          </div>

          <div className="bc-nav">
            <button type="button" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>‹ {idx > 0 ? TABS[idx - 1].label : "Anterior"}</button>
            <button type="button" disabled={idx === TABS.length - 1} onClick={() => setIdx(idx + 1)}>{idx < TABS.length - 1 ? TABS[idx + 1].label : "Siguiente"} ›</button>
          </div>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.bc-root{--ink:#1f2a37;font-family:"Nunito","Varela Round",ui-rounded,system-ui,sans-serif;color:var(--ink);max-width:640px;margin:0 auto;padding:12px max(16px,env(safe-area-inset-left)) 12px max(16px,env(safe-area-inset-right));box-sizing:border-box}
.bc-root *{box-sizing:border-box;font-family:inherit}
.bc-shell{background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(31,42,55,.10);overflow:hidden}
.bc-tabs{display:flex;gap:6px;padding:8px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;overscroll-behavior-x:contain}
.bc-tabs::-webkit-scrollbar{display:none}
.bc-tab{flex:1 0 82px;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:64px;padding:8px 4px;border:0;border-radius:14px;background:#f4f6f8;color:var(--ink);font-weight:800;font-size:13px;cursor:pointer;transition:background .2s,color .2s}
.bc-ico{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:17px;line-height:1;transition:background .2s}
.bc-prog{padding:2px 14px 8px}
.bc-track{height:6px;border-radius:99px;background:#e8ecef;overflow:hidden}
.bc-fill{height:100%;border-radius:99px;transition:width .45s ease,background .3s}
.bc-prog-txt{display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-top:4px;color:#5b6675}
.bc-prog-txt b{color:var(--ink)}
.bc-panel{padding:16px;animation:bc-in .25s ease}
@keyframes bc-in{from{opacity:.4}to{opacity:1}}
.bc-cover{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/9;display:grid;place-items:center;box-shadow:0 6px 16px rgba(31,42,55,.12)}
.bc-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.bc-cover-emoji{font-size:64px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.2))}
.bc-cover-txt{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;color:#fff;font-weight:900;font-size:17px;line-height:1.2;background:linear-gradient(transparent,rgba(0,0,0,.6))}
.bc-text{margin:14px 2px 4px;font-size:16px;line-height:1.5;font-weight:600;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.bc-sub{margin:14px 2px 8px;font-size:15px;font-weight:900}
.bc-snap{display:flex;gap:12px;margin:12px -16px 0;padding:4px 16px 12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:16px;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none}
.bc-snap::-webkit-scrollbar{display:none}
.bc-sub + .bc-snap{margin-top:0}
.bc-chip{flex:0 0 132px;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px;border:0;border-radius:16px;background:#fff;box-shadow:0 4px 12px rgba(31,42,55,.08);font-weight:800;font-size:13px;line-height:1.2;text-align:center;color:var(--ink);cursor:pointer}
.bc-chip img{width:56px;height:56px;object-fit:contain}
.bc-chip-emoji{width:56px;height:56px;display:grid;place-items:center;font-size:34px}
.bc-ficha{flex:0 0 min(78%,250px);scroll-snap-align:start;background:#fff;border-radius:16px;padding:14px;box-shadow:0 4px 12px rgba(31,42,55,.08);border:2px solid transparent;display:flex;flex-direction:column;gap:4px}
.bc-ficha h3{margin:6px 0 0;font-size:16px;font-weight:900;line-height:1.2}
.bc-ficha p{margin:0;font-size:13px;font-weight:700;color:#5b6675}
.bc-ficha .bc-promo{color:var(--ink);background:#fff7d6;border-radius:8px;padding:4px 8px;margin-top:4px}
.bc-ficha-ico{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:24px}
.bc-ficha-btns{display:flex;gap:6px;margin-top:auto;padding-top:10px}
.bc-ficha-btns a,.bc-ficha-btns button{flex:1;min-height:40px;display:grid;place-items:center;border:0;border-radius:12px;color:#fff;font-weight:900;font-size:13px;text-decoration:none;cursor:pointer}
.bc-ficha-cta{border-style:dashed}
.bc-map{position:relative;margin:-16px -16px 0;height:280px;background:#dfe7e2}
.bc-map iframe{width:100%;height:100%;border:0;display:block}
.bc-map-lock{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding:12px;touch-action:pan-x pan-y;background:rgba(255,255,255,.04)}
.bc-pill{min-height:40px;padding:8px 14px;border:0;border-radius:99px;background:rgba(31,42,55,.85);color:#fff;font-weight:800;font-size:13px;cursor:pointer}
.bc-pill-on{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);white-space:nowrap}
.bc-actions{display:grid;gap:10px;margin-top:6px}
.bc-btn{display:grid;place-items:center;min-height:48px;padding:10px 16px;border:0;border-radius:14px;color:#fff;font-weight:900;font-size:15px;text-decoration:none;cursor:pointer}
.bc-btn-wa{background:#25d366}
.bc-nav{display:flex;justify-content:space-between;gap:10px;margin-top:14px}
.bc-nav button{flex:1;min-height:44px;border:2px solid rgba(31,42,55,.12);border-radius:14px;background:rgba(255,255,255,.7);color:var(--ink);font-weight:800;font-size:14px;cursor:pointer}
.bc-nav button:disabled{opacity:.35;cursor:default}
.bc-root button:focus-visible,.bc-root a:focus-visible{outline:3px solid #1f2a37;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.bc-panel{animation:none}.bc-fill,.bc-tab{transition:none}}
`;
