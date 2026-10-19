// INICIO NUEVO (e34) — portada estilo minimalista: foto + título + botón "Conoce cómo participar"
// (abre ENTRADA DCUATES en una hoja), cuadrícula de 6 secciones y el carrusel de logros.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EntradaDcuates from "./PuertasDcuates.jsx";
import { BandaImpacto, TABS } from "./BloqueCentral.jsx";
import { useAtras } from "./atras.js";

// Foto de portada: sube /public/images/portada-inicio.jpg para cambiarla; mientras no exista se usa la de respaldo.
const FOTOS = ["/images/portada-inicio.jpg", "/images/bibliobici-movil.png"];

// [id de pestaña, emoji, título, subtítulo, color]
const TILES = [
  ["nosotros", "👥", "Nosotros", "Quiénes somos", "#1B6F8A"],
  ["causas", "❤️", "Causas", "Proyectos que generan cambio", "#E5484D"],
  ["negocios", "🏪", "Negocios", "Emprendimientos locales", "#2E9E5B"],
  ["beneficios", "🎁", "Beneficios", "Conoce lo que puedes obtener", "#F07A1A"],
  ["valores", "✨", "Valores", "Lo que nos guía", "#7A5AD8"],
  ["regalos", "🎉", "Regalos y gratitud", "Reconocemos tu apoyo", "#D6336C"]
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

export default function InicioNuevo({ onIr, logros = [], cargando = false, entrada = {} }) {
  const [hoja, setHoja] = useState(false);
  const [foto, setFoto] = useState(0);
  useEffect(() => {
    if (document.getElementById("vi-font")) return;
    const l = document.createElement("link");
    l.id = "vi-font"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap";
    document.head.appendChild(l);
  }, []);
  useEffect(() => {
    const abrir = () => setHoja(true);
    window.addEventListener("dcuates:abrir-entrada", abrir);
    return () => window.removeEventListener("dcuates:abrir-entrada", abrir);
  }, []);
  const src = FOTOS[foto];
  const tabNosotros = TABS[0];
  return (
    <div className="vi-root">
      <style>{CSS}</style>
      <section className="vi-hero" aria-label="Bienvenida">
        {src && <img className="vi-foto" src={src} alt="" onError={() => setFoto((f) => f + 1)} />}
        <div className="vi-vela" aria-hidden="true" />
        <div className="vi-hero-t">
          <h1>Juntos hacemos comunidad</h1>
          <p>Personas, ideas y recursos para impulsar proyectos que generan un impacto real en sus territorios.</p>
          <button type="button" className="vi-cta" onClick={() => setHoja(true)}>
            Conoce cómo participar <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <nav className="vi-grid" aria-label="Secciones de DCUATES">
        {TILES.map(([id, e, t, s, c]) => (
          <button key={id} type="button" className="vi-tile" onClick={() => onIr(id)}>
            <span className="vi-ico" style={{ background: c }} aria-hidden="true">{e}</span>
            <b>{t}</b>
            <small>{s}</small>
          </button>
        ))}
      </nav>

      <div className="vi-logros bc-root" style={{ "--tc": "#17472d" }}>
        <BandaImpacto logros={logros} cargando={cargando} tab={{ ...tabNosotros, banda: { titulo: "Nuestra comunidad en cifras" } }} />
      </div>

      <Hoja abierta={hoja} onCerrar={() => setHoja(false)} titulo="🌱 ENTRADA DCUATES">
        <div style={{ "--tc": "#1B6F8A" }}>
          <EntradaDcuates {...entrada} />
        </div>
      </Hoja>
    </div>
  );
}

const CSS = `
.vi-root{background:#fbf7ec;color:#0f2d1e;font-family:"Nunito",ui-rounded,system-ui,sans-serif;padding:12px 12px 20px;border-radius:0 0 24px 24px}
.vi-root *{font-family:inherit}
.vi-hero{position:relative;overflow:hidden;border-radius:28px 28px 44px 28px;min-height:330px;background:linear-gradient(135deg,#1f6b45,#3f9d6a);box-shadow:0 8px 22px rgba(15,45,30,.22)}
.vi-foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.vi-vela{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(10,40,25,.55) 55%,rgba(10,40,25,.86) 100%)}
.vi-hero-t{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:330px;padding:22px 18px 20px;color:#fff}
.vi-hero-t h1{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:34px;line-height:1.05;margin:0 0 8px;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.vi-hero-t p{margin:0 0 14px;font-size:15px;line-height:1.35;font-weight:600;max-width:30em;text-shadow:0 1px 4px rgba(0,0,0,.45)}
.vi-cta{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;background:#0e7c4f;color:#fff;font-weight:900;font-size:15px;padding:12px 18px;min-height:48px;box-shadow:0 4px 0 #0a5a39,0 6px 14px rgba(0,0,0,.3);cursor:pointer}
.vi-cta:active{transform:translateY(2px);box-shadow:0 2px 0 #0a5a39}
.vi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0 14px}
.vi-tile{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;border:1.5px solid rgba(15,45,30,.12);border-radius:20px;background:#fff;padding:12px 6px 12px;min-height:128px;box-shadow:0 3px 0 rgba(15,45,30,.08),0 6px 12px rgba(15,45,30,.08);cursor:pointer;color:#0f2d1e}
.vi-tile:active{transform:translateY(2px)}
.vi-ico{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;font-size:24px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18)}
.vi-tile b{font-size:14px;line-height:1.1;font-weight:900}
.vi-tile small{font-size:11px;line-height:1.2;font-weight:700;color:#3d5a4a}
.vi-logros .bc-banda{margin:0}
.vi-fondo{position:fixed;inset:0;z-index:52;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}
.vi-hoja{width:100%;max-width:640px;max-height:90dvh;display:flex;flex-direction:column;background:#fbf7ec;border-radius:26px 26px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.35);animation:vi-sube .28s ease-out}
.vi-hoja-cab{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;font-weight:900;font-size:15px;letter-spacing:.02em;color:#0f2d1e;border-bottom:1px solid rgba(15,45,30,.12)}
.vi-hoja-cab button{border:0;border-radius:50%;width:40px;height:40px;background:#0f2d1e;color:#fff;font-size:18px;font-weight:900;cursor:pointer}
.vi-hoja-cuerpo{overflow-y:auto;padding:10px 12px 22px;overscroll-behavior:contain}
@keyframes vi-sube{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}
@media (min-width:768px){.vi-hero,.vi-hero-t{min-height:420px}.vi-hero-t h1{font-size:46px}.vi-hero-t{padding:32px 30px}.vi-fondo{align-items:center}.vi-hoja{border-radius:26px;max-height:86dvh}}
@media (prefers-reduced-motion:reduce){.vi-hoja{animation:none}}
`;
