// INICIO NUEVO (e34) — portada estilo minimalista: foto + título + botón "Conoce cómo participar"
// (abre ENTRADA DCUATES en una hoja), cuadrícula de 6 secciones y el carrusel de logros.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import EntradaDcuates from "./PuertasDcuates.jsx";
import { BandaImpacto, TABS } from "./BloqueCentral.jsx";
import { useAtras } from "./atras.js";
import { Emo } from "./SeccionNueva.jsx";
import { VISTA } from "./datos/vistaSeccion.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { registrar } from "./analitica.js";

// Foto de portada: sube /public/images/portada-inicio.jpg para cambiarla; mientras no exista se usa la de respaldo.
const FOTOS = ["/images/portada-inicio.jpg", "/images/bibliobici-movil.png"];

// [id de pestaña, emoji, título, subtítulo, color]
const TILES = [
  ["nosotros", "👥", "Nosotros", "Quiénes somos", "#1B6F8A"],
  ["causas", "❤️", "Causas", "Causas y valores que nos unen", "#E5484D"],
  ["negocios", "🏪", "Negocios", "Emprendimientos que MULTIPLICAN VALOR", "#2E9E5B"],
  ["beneficios", "🎁", "Beneficios", "Conoce lo que puedes obtener", "#F07A1A"],
  
  ["gratitud", "🙏", "Gratitud", "Regalos, retos y reconocimientos", "#B7791F"],
  ["cierre", "/images/eclipse.svg", "Súmate", "Tu parte hace la diferencia", "#E65100"]
];

function Hoja({ abierta, onCerrar, titulo, children }) {
  const oculta = useAtras(abierta, onCerrar, { hub: true });
  if (!abierta) return null;
  return createPortal(
    <div className="vi-fondo" onClick={onCerrar} style={oculta ? { display: "none" } : undefined}>
      <div className="vi-hoja" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <div className="vi-hoja-cab">
          <b>{titulo}</b>
          <button type="button" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="vi-hoja-cuerpo">{children}</div>
      </div>
    </div>,
    document.body
  );
}

const ATAJOS = ["Libros", "Mascotas", "Asesorías", "Negocios", "Apoyo", "Eventos", "Voluntariado", "Donar", "Cursos", "Empleo", "Cupones", "Seguridad"];

// Atajos que avanzan solos (como carrusel); al tocar o deslizar con el dedo se detienen unos segundos.
function Atajos() {
  const ref = useRef(null);
  const pausa = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let pos = el.scrollLeft;
    let ultimo = el.scrollLeft;
    const id = setInterval(() => {
      if (el.offsetParent === null) return;
      if (Date.now() < pausa.current) { pos = el.scrollLeft; ultimo = pos; return; }
      // Si el usuario movió el carrusel a mano, partir de donde lo dejó.
      if (Math.abs(el.scrollLeft - ultimo) > 3) pos = el.scrollLeft;
      pos += 1.2;
      const mitad = el.scrollWidth / 2;
      if (mitad > 0 && pos >= mitad) pos -= mitad;
      el.scrollLeft = pos;
      ultimo = el.scrollLeft;
    }, 40);
    return () => clearInterval(id);
  }, []);
  const parar = () => { pausa.current = Date.now() + 4500; };
  const alScroll = () => {
    const el = ref.current; if (!el) return;
    const mitad = el.scrollWidth / 2;
    if (el.scrollLeft >= mitad) el.scrollLeft -= mitad;
    else if (el.scrollLeft <= 0) el.scrollLeft = mitad;
  };
  const buscar = (t) => { registrar("atajo_inicio", { q: t }); window.dispatchEvent(new CustomEvent("dcuates:buscar", { detail: { q: t, inline: true } })); };
  return (
    <div className="vi-atajos" ref={ref} onTouchStart={parar} onTouchMove={parar} onTouchEnd={parar} onPointerDown={parar} onWheel={parar} onScroll={alScroll} aria-label="Atajos de búsqueda">
      {[0, 1].map((c) => ATAJOS.map((t) => (
        <button key={c + t} type="button" tabIndex={c ? -1 : 0} aria-hidden={c ? "true" : undefined} onClick={() => buscar(t)}>{t}</button>
      )))}
    </div>
  );
}

// Imagen a un lado y botones al otro (como el cierre de cada sección).
function BloqueLado({ img, titulo, texto, botones = [], sinBorde = false }) {
  const [fallo, setFallo] = useState(false);
  return (
    <section className={"vi-llama" + (sinBorde ? " vi-sinb" : "")} aria-label={titulo}>
      <div className="vi-llama-t">
        <h2>{titulo}</h2>
        <p>{texto}</p>
      </div>
      <div className="vi-lado">
        {img && !fallo && <img className="vi-llama-img" src={img} alt="" loading="lazy" onError={() => setFallo(true)} />}
        <div className="vi-lado-b">
          {botones.map(([t, f, k], i) => (
            <button key={t + i} type="button" className={k === "ir" ? "vi-l1" : k === "mas" ? "vi-l3" : "vi-l2"} onClick={f}>{t}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function InicioNuevo({ onIr, logros = [], cargando = false, entrada = {} }) {
  const [foto, setFoto] = useState(0);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    if (document.getElementById("vi-font")) return;
    const l = document.createElement("link");
    l.id = "vi-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap";
    document.head.appendChild(l);
  }, []);
  useEffect(() => {
    const abrir = () => document.getElementById("vi-participar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.addEventListener("dcuates:abrir-entrada", abrir);
    return () => { window.removeEventListener("dcuates:abrir-entrada", abrir); };
  }, []);
  const src = FOTOS[foto];
  const tabNosotros = TABS[0];
  return (
    <div className="vi-root">
      <style>{CSS}</style>
      <section className="vi-hero" aria-label="Bienvenida">
        {src && <img className="vi-foto" src={src} alt="Conectando: más oportunidades para crecer, aprender y compartir" onError={() => setFoto((f) => f + 1)} />}
        {!src && <div className="vi-sinfoto" aria-hidden="true" />}
        <div className="vi-hero-t">
          <h1>Juntos hacemos comunidad</h1>
          <p>Personas, ideas y recursos para impulsar proyectos que generan un impacto real en sus territorios.</p>
        </div>
      </section>

      <form className="vi-busca" role="search" onSubmit={(e) => { e.preventDefault(); const q = (e.currentTarget.elements.q.value || "").trim(); registrar("buscar_inicio", { q: q.slice(0, 30) }); if (q) window.dispatchEvent(new CustomEvent("dcuates:buscar", { detail: { q, inline: true } })); }}>
        <span aria-hidden="true">🔍</span>
        <input name="q" type="search" placeholder="¿Qué buscas?" aria-label="Buscar en DCUATES" enterKeyHint="search" />
        <button type="submit">Buscar</button>
      </form>
      <Atajos />
      <div id="vi-resultados" />

      <section id="vi-participar" className="vi-part" aria-label="Conoce cómo participar" style={{ "--tc": "#17472d" }}>
        <h2 className="vi-h2">🌱 Conoce cómo participar</h2>
        <p className="vi-h2p">Elige por dónde empezar: cada puerta te lleva paso a paso.</p>
        <EntradaDcuates {...entrada} />
      </section>

      <nav className="vi-grid" aria-label="Secciones de DCUATES">
        {TILES.map(([id, e, t, s, c]) => (
          <button key={id} type="button" className="vi-tile" onClick={() => { registrar("inicio_vista_previa", { id }); setPrev(id); }}>
            <span className="vi-ico" style={{ background: c }} aria-hidden="true"><Emo e={e} /></span>
            <b>{t}</b>
            <small>{s}</small>
          </button>
        ))}
      </nav>

      <div className="vi-logros bc-root" style={{ "--tc": "#17472d" }}>
        <BandaImpacto logros={logros} cargando={cargando} tab={{ ...tabNosotros, banda: { titulo: "NUESTROS LOGROS" } }} />
      </div>

      <BloqueLado
        img="/images/inicio-llama.jpg"
        titulo="Conoce DCUATES y las oportunidades para SUMAR"
        texto="Somos una comunidad que teje confianza, suma voluntades y cosecha logros. Descubre qué es DCUATES, lo que te brinda y cómo puedes sumarte."
        botones={[["Qué es DCUATES", () => onIr("nosotros")], ["Lo que te brindamos", () => onIr("beneficios")], ["Nuestras causas", () => onIr("causas")], ["Apoyos para tu emprendimiento", () => onIr("negocios")], ["Cómo sumarte", () => onIr("cierre")]]}
      />

      <Hoja abierta={!!prev} onCerrar={() => setPrev(null)} titulo="Vista previa">
        {prev && (() => {
          const t = TABS.find((x) => x.id === prev);
          const sm = (VISTA[prev] || {}).sumar || {};
          const acc = (a) => {
            if (!a) return;
            const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
            if (a.acceso) { setPrev(null); setTimeout(() => ev("dcuates:abrir-acceso", a.acceso), 150); }
            else if (a.proy) { entrada.onAbrirProyecto && entrada.onAbrirProyecto(a.proy); }
            else if (a.zona) { setPrev(null); setTimeout(() => ev("dcuates:abrir-zona", a.zona), 150); }
            else if (a.wa) window.open("https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(a.wa), "_blank", "noopener");
            else if (a.tab) { setPrev(null); onIr(a.tab); }
          };
          return (
            <div>
              <div className="vi-chips" role="tablist" aria-label="Elige un proyecto">
                {TILES.map(([id, e, tt, , c]) => (
                  <button key={id} type="button" role="tab" aria-selected={id === prev} aria-label={tt} onClick={() => setPrev(id)} className={id === prev ? "vi-ch-on" : ""} style={id === prev ? { background: c } : undefined}><Emo e={e} /></button>
                ))}
              </div>
              <BloqueLado
                img={sm.img}
                titulo={sm.titulo || t?.label}
                texto={sm.texto || t?.texto}
                botones={[
                  ["Ir a la sección ›", () => { setPrev(null); onIr(prev); }, "ir"],
                  ...(sm.botones || []).map((b) => [b.t, () => acc(b.a)]),
                  ["Ver los demás proyectos", () => { setPrev(null); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-tablero", { detail: "conoce" })), 150); }, "mas"]
                ]}
                sinBorde
              />
            </div>
          );
        })()}
      </Hoja>
    </div>
  );
}

const CSS = `
.vi-root{background:#fbf7ec;color:#0f2d1e;font-family:"Nunito",ui-rounded,system-ui,sans-serif;padding:12px 12px 20px;border-radius:0 0 24px 24px}
.vi-root *{font-family:inherit}
.vi-hero{position:relative;overflow:hidden;border-radius:26px;background:#14532d;box-shadow:0 8px 22px rgba(15,45,30,.22)}
.vi-foto{display:block;width:100%;height:auto}
.vi-sinfoto{height:150px;background:linear-gradient(135deg,#1f6b45,#3f9d6a)}
.vi-hero-t{position:relative;display:flex;flex-direction:column;padding:16px 16px 18px;color:#fff;background:linear-gradient(180deg,#14532d,#0f3d22)}
.vi-hero-t h1{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:30px;line-height:1.05;margin:0 0 8px}
.vi-hero-t p{margin:0 0 14px;font-size:15px;line-height:1.35;font-weight:600;max-width:30em}
.vi-cta{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;background:#0e7c4f;color:#fff;font-weight:900;font-size:15px;padding:12px 18px;min-height:48px;box-shadow:0 4px 0 #0a5a39,0 6px 14px rgba(0,0,0,.3);cursor:pointer}
.vi-cta:active{transform:translateY(2px);box-shadow:0 2px 0 #0a5a39}
.vi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0 14px}
.vi-tile{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;border:1.5px solid rgba(15,45,30,.12);border-radius:20px;background:#fff;padding:12px 6px 12px;min-height:136px;box-shadow:0 3px 0 rgba(15,45,30,.08),0 6px 12px rgba(15,45,30,.08);cursor:pointer;color:#0f2d1e}
.vi-tile:active{transform:translateY(2px)}
.vi-ico .emo-img{width:1.35em;height:1.35em}
.vi-ico{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;font-size:24px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18)}
.vi-tile b{font-size:15.5px;line-height:1.1;font-weight:900}
.vi-tile small{font-size:13px;line-height:1.2;font-weight:700;color:#2f4d3f}
.vi-logros .bc-banda{margin:0}
.vi-fondo{position:fixed;inset:0;z-index:52;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}
.vi-sigue{display:flex;align-items:center;gap:12px;width:100%;margin:14px 0 0;border:2px solid #0e7c4f;border-radius:16px;background:#e3f3e9;padding:10px 14px;min-height:54px;color:#0f2d1e;font:inherit;text-align:left;cursor:pointer}
.vi-sigue>span:nth-child(2){flex:1;display:flex;flex-direction:column}
.vi-sigue small{font-size:13px;font-weight:900;letter-spacing:.04em;color:#0e7c4f}
.vi-sigue b{font-size:17px;font-weight:900}
.vi-sigue>span:first-child,.vi-sigue>span:last-child{font-size:20px;font-weight:900;color:#0e7c4f}
.vi-llama{margin:16px 0 6px;border:2px solid #0e7c4f;border-radius:22px;background:#fff;overflow:hidden;box-shadow:0 4px 0 rgba(15,45,30,.08),0 8px 16px rgba(15,45,30,.1)}
.vi-llama-img{display:block;width:46%;max-height:300px;object-fit:contain;border-radius:14px;align-self:flex-start;background:#fbf7ec}
.vi-lado{display:flex;gap:10px;align-items:center;padding:0 12px 14px}
.vi-lado-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}
.vi-sinb{border:0;box-shadow:none;margin:6px 0 0}
.vi-chips{display:flex;gap:6px;justify-content:center;margin:0 0 6px;flex-wrap:wrap}
.vi-chips button{width:44px;height:44px;border-radius:50%;border:2px solid #cfe5d6;background:#fff;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.vi-chips .vi-ch-on{border-color:transparent;box-shadow:0 2px 6px rgba(0,0,0,.25)}
.vi-llama-t{padding:12px 16px 16px;text-align:center}
.vi-llama-t h2{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:24px;line-height:1.15;margin:0 0 6px;color:#0f4a2f}
.vi-llama-t p{margin:0 0 12px;font-size:15.5px;line-height:1.4;font-weight:700;color:#2f4d3f}
.vi-lado-b button{display:block;width:100%;min-height:48px;padding:8px 10px;border-radius:999px;font:inherit;font-weight:900;font-size:14.5px;line-height:1.15;cursor:pointer}
.vi-l1{border:0;background:#0e7c4f;color:#fff}.vi-l2{border:2px solid #0e7c4f;background:#fff;color:#0e7c4f}.vi-l3{border:0;background:#E65100;color:#fff}
.vi-busca{display:flex;align-items:center;gap:8px;margin:14px 0 8px;background:#fff;border:2px solid #17472d;border-radius:999px;padding:4px 4px 4px 14px;box-shadow:0 3px 10px rgba(15,45,30,.15)}
.vi-busca input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:15.5px;font-weight:700;color:#0f2d1e;min-height:42px}
.vi-busca button{border:0;border-radius:999px;min-height:42px;padding:0 16px;background:#E65100;color:#fff;font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}
.vi-atajos{display:flex;gap:6px;overflow-x:auto;padding:0 0 6px;margin-bottom:4px;scrollbar-width:none}
.vi-atajos button{flex:0 0 auto;min-height:38px;padding:0 14px;border:2px solid #17472d;border-radius:999px;background:#fff;color:#17472d;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.vi-part{margin:6px 0 16px;background:#17472d;border:2px solid rgba(255,255,255,.35);border-radius:22px;padding:14px 10px 12px;box-shadow:0 6px 16px rgba(0,0,0,.2)}
.vi-part .pu-sec{background:transparent;border:0;box-shadow:none;margin:0;padding:4px 0 0}
.vi-part .pu-grid .en-d:nth-child(3){background:#9BE3B4 !important}
.vi-part .pu-grid .en-d:nth-child(3) b,.vi-part .pu-grid .en-d:nth-child(3) small{color:#0f2d1e !important}
.vi-part .pu-dif[style*="15, 76, 92"],.vi-part .pu-dif[style*="0f4c5c"]{background:#F8B4D0 !important}
.vi-part .pu-dif[style*="15, 76, 92"] b,.vi-part .pu-dif[style*="15, 76, 92"] small,.vi-part .pu-dif[style*="0f4c5c"] b,.vi-part .pu-dif[style*="0f4c5c"] small{color:#4a0f2a !important}
.vi-part .ap-btn{background:#B7791F !important}
.vi-h2{margin:0 0 4px;font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:22px;color:#fff;text-align:center}
.vi-h2p{margin:0 0 10px;font-size:14px;font-weight:700;color:#35564a;text-align:center;line-height:1.35}
.vi-part .vi-h2p{color:#e6f4ea}
.vi-lista{margin:10px 0;padding:0;list-style:none;display:grid;gap:6px}
.vi-lista li{background:#fff;border-radius:12px;padding:9px 12px;font-weight:800;font-size:14px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.vi-lista a{color:#0e7c4f}
.vi-lg-b{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.vi-lg-b button{min-height:48px;border:0;border-radius:14px;background:#0e7c4f;color:#fff;font:inherit;font-weight:900;cursor:pointer}
.vi-hoja{width:100%;max-width:640px;max-height:90dvh;display:flex;flex-direction:column;background:#fbf7ec;border-radius:26px 26px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.35);animation:vi-sube .28s ease-out}
.vi-hoja-cab{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;font-weight:900;font-size:15px;letter-spacing:.02em;color:#0f2d1e;border-bottom:1px solid rgba(15,45,30,.12)}
.vi-hoja-cab button{border:0;border-radius:50%;width:40px;height:40px;background:#0f2d1e;color:#fff;font-size:18px;font-weight:900;cursor:pointer}
.vi-hoja-cuerpo{overflow-y:auto;padding:10px 12px 22px;overscroll-behavior:contain}
@keyframes vi-sube{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}
@media (min-width:768px){.vi-hero-t h1{font-size:42px}.vi-hero-t{padding:26px 30px}.vi-fondo{align-items:center}.vi-hoja{border-radius:26px;max-height:86dvh}}
@media (prefers-reduced-motion:reduce){.vi-hoja{animation:none}}
`;
