// Ayuda flotante única: "¿Necesitas algo?" abre tres opciones (¿Qué necesitas hoy?, Dudas y atención, Contacto).
// Abajo a la derecha, arriba del cintillo inferior; la flecha de subir queda encima (ver App.jsx).
import React, { useEffect, useState } from "react";
import { registrar } from "./analitica.js";

// Parpadeo con temporizador (funciona aunque el celular tenga "reducir animaciones").
function useParpadeo(activo, ms = 900) {
  const [alto, setAlto] = useState(true);
  useEffect(() => {
    if (!activo) { setAlto(true); return; }
    const t = setInterval(() => setAlto((v) => !v), ms);
    return () => clearInterval(t);
  }, [activo, ms]);
  return alto;
}

const OPCIONES = [
  { id: "hoy", ico: "?", t: "¿Qué necesitas hoy?", d: "Apoyos, libros, mascotas, negocios y servicios", bg: "#facc15", color: "#0f2d1e" },
  { id: "dudas", ico: "💬", t: "Dudas y atención", d: "Pregúntanos por WhatsApp", bg: "#25a244", color: "#fff" },
  { id: "contacto", ico: "📝", t: "Contacto", d: "Regístrate, pide apoyo y avisos", bg: "#0f4c5c", color: "#fff" }
];

export default function AyudaFlotante({ onDudas, onContacto }) {
  const [abierta, setAbierta] = useState(false);
  const alto = useParpadeo(!abierta);
  useEffect(() => {
    if (!abierta) return;
    const tecla = (e) => e.key === "Escape" && setAbierta(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierta]);

  const elegir = (id) => {
    registrar("ayuda_opcion", { id });
    setAbierta(false);
    if (id === "hoy") setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-necesitas")), 60);
    else if (id === "dudas") onDudas && onDudas();
    else onContacto && onContacto();
  };

  const base = "calc(var(--alto-ticker, 48px) + var(--alto-nav, 0px) + 8px)";
  return (
    <>
      <style>{`
.af-pill{position:fixed;right:10px;z-index:50;display:flex;align-items:center;gap:10px;min-height:54px;padding:0 6px 0 18px;transition:opacity .5s;border:0;border-radius:999px;background:#facc15;color:#0f2d1e;font:inherit;font-weight:900;font-size:13.5px;text-transform:uppercase;letter-spacing:.02em;box-shadow:0 10px 20px rgba(0,0,0,.35),inset 0 -3px 6px rgba(0,0,0,.2),inset 0 3px 4px rgba(255,255,255,.5);cursor:pointer;font-family:"Nunito",system-ui,sans-serif}
.af-pill:active{transform:scale(.96)}
.af-q{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:#0f2d1e;color:#facc15;font-size:30px;font-weight:900;line-height:1}
.af-comp{position:fixed;z-index:50;transition:opacity .5s}
.af-fondo{position:fixed;inset:0;z-index:49;background:rgba(0,0,0,.35);border:0;padding:0}
.af-menu{position:fixed;right:10px;z-index:51;display:flex;flex-direction:column;gap:8px;width:min(300px,calc(100vw - 20px))}
.af-op{display:flex;align-items:center;gap:10px;min-height:60px;padding:8px 12px;border:2px solid #fff;border-radius:16px;text-align:left;font:inherit;cursor:pointer;box-shadow:0 6px 14px rgba(0,0,0,.3);font-family:"Nunito",system-ui,sans-serif}
.af-op:active{transform:translateY(1px)}
.af-ic{flex:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.3);font-size:21px;font-weight:900}
.af-op b{display:block;font-size:15px;font-weight:900;text-transform:uppercase;line-height:1.1}
.af-op small{display:block;font-size:12px;font-weight:700;line-height:1.2;opacity:.92}
`}</style>
      {abierta && (
        <>
          <button type="button" className="af-fondo" aria-label="Cerrar" onClick={() => setAbierta(false)} />
          <div className="af-menu" style={{ bottom: `calc(${base} + 56px)` }} role="menu" aria-label="Ayuda">
            {OPCIONES.map((o) => (
              <button key={o.id} type="button" role="menuitem" className="af-op" style={{ background: o.bg, color: o.color }} onClick={() => elegir(o.id)}>
                <span className="af-ic" aria-hidden="true">{o.ico}</span>
                <span><b>{o.t}</b><small>{o.d}</small></span>
              </button>
            ))}
          </div>
        </>
      )}
      <button type="button" className="af-pill" style={{ bottom: base, opacity: abierta ? 1 : alto ? 0.88 : 0.5 }} aria-expanded={abierta} onClick={() => { if (!abierta) registrar("ayuda_abrir"); setAbierta((v) => !v); }}>
        <span>¿Necesitas algo?</span>
        <span className="af-q" aria-hidden="true">{abierta ? "×" : "?"}</span>
      </button>
    </>
  );
}

// Señal de deslizamiento lateral: abajo a la izquierda, semitransparente y parpadeante (solo en Inicio y secciones, en pantallas táctiles).
export function PistaDeslizar({ vista }) {
  const tactil = typeof matchMedia === "function" && matchMedia("(pointer:coarse)").matches;
  const visible = tactil && (vista === "inicio" || vista === "seccion");
  const alto = useParpadeo(visible, 900);
  if (!visible) return null;
  return (
    <div aria-hidden="true" style={{ position: "fixed", left: 58, bottom: "calc(var(--alto-ticker, 48px) + var(--alto-nav, 0px) + 20px)", zIndex: 48, background: "rgba(15,45,30,.85)", color: "#fff", padding: "5px 8px", borderRadius: 999, fontWeight: 900, fontSize: 14, fontFamily: "Nunito,system-ui,sans-serif", opacity: alto ? 0.85 : 0.35, transition: "opacity .5s", pointerEvents: "none", display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 18 }}>‹</span><span style={{ fontSize: 11, textTransform: "uppercase" }}>desliza</span><span style={{ fontSize: 18 }}>›</span>
    </div>
  );
}
