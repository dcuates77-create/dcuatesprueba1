// Ayuda flotante única: "¿Necesitas algo?" abre tres opciones (¿Qué necesitas hoy?, Dudas y atención, Contacto).
// Abajo a la derecha, arriba del cintillo inferior; la flecha de subir queda encima (ver App.jsx).
import React, { useEffect, useState } from "react";

const OPCIONES = [
  { id: "hoy", ico: "?", t: "¿Qué necesitas hoy?", d: "Apoyos, libros, mascotas, negocios y servicios", bg: "#facc15", color: "#0f2d1e" },
  { id: "dudas", ico: "💬", t: "Dudas y atención", d: "Pregúntanos por WhatsApp", bg: "#25a244", color: "#fff" },
  { id: "contacto", ico: "📝", t: "Contacto", d: "Regístrate, pide apoyo y avisos", bg: "#0f4c5c", color: "#fff" }
];

export default function AyudaFlotante({ onDudas, onContacto }) {
  const [abierta, setAbierta] = useState(false);
  useEffect(() => {
    if (!abierta) return;
    const tecla = (e) => e.key === "Escape" && setAbierta(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierta]);

  const elegir = (id) => {
    setAbierta(false);
    if (id === "hoy") setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-necesitas")), 60);
    else if (id === "dudas") onDudas && onDudas();
    else onContacto && onContacto();
  };

  const base = "calc(var(--alto-ticker, 48px) + var(--alto-nav, 0px) + 8px)";
  return (
    <>
      <style>{`
.af-pill{position:fixed;right:10px;z-index:50;display:flex;align-items:center;gap:8px;min-height:48px;padding:0 16px 0 8px;border:0;border-radius:999px;background:#facc15;color:#0f2d1e;font:inherit;font-weight:900;font-size:13.5px;text-transform:uppercase;letter-spacing:.02em;box-shadow:0 10px 20px rgba(0,0,0,.35),inset 0 -3px 6px rgba(0,0,0,.2),inset 0 3px 4px rgba(255,255,255,.5);cursor:pointer;font-family:"Nunito",system-ui,sans-serif}
.af-pill:active{transform:scale(.96)}
.af-q{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#0f2d1e;color:#facc15;font-size:20px;font-weight:900}
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
      <button type="button" className="af-pill" style={{ bottom: base }} aria-expanded={abierta} onClick={() => setAbierta((v) => !v)}>
        <span className="af-q" aria-hidden="true">{abierta ? "×" : "?"}</span>
        <span>¿Necesitas algo?</span>
      </button>
    </>
  );
}

// Pista de deslizamiento lateral: aparece unos segundos al entrar a Inicio o a una sección (máx. 3 veces por pantalla).
export function PistaDeslizar({ vista }) {
  const [txt, setTxt] = useState("");
  useEffect(() => {
    if (vista !== "inicio" && vista !== "seccion") { setTxt(""); return; }
    let veces = 0;
    const clave = "dc_pista_" + vista;
    try { veces = parseInt(localStorage.getItem(clave) || "0", 10) || 0; } catch {}
    const tactil = typeof matchMedia === "function" && matchMedia("(pointer:coarse)").matches;
    if (veces >= 3 || !tactil) return;
    try { localStorage.setItem(clave, String(veces + 1)); } catch {}
    setTxt(vista === "inicio" ? "Desliza el dedo ‹ para ver las secciones" : "‹ Desliza para cambiar de sección ›");
    const t = setTimeout(() => setTxt(""), 5200);
    return () => clearTimeout(t);
  }, [vista]);
  if (!txt) return null;
  return (
    <div role="status" style={{ position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: "calc(var(--alto-ticker, 48px) + var(--alto-nav, 0px) + 74px)", zIndex: 48, background: "rgba(15,45,30,.92)", color: "#fff", padding: "9px 16px", borderRadius: 999, fontWeight: 900, fontSize: 13.5, fontFamily: "Nunito,system-ui,sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,.35)", whiteSpace: "nowrap", pointerEvents: "none" }}>{txt}</div>
  );
}
