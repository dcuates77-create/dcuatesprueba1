// BARRA INFERIOR (e34): Inicio · Proyectos · Agenda Plus · Contacto
import React, { useLayoutEffect, useRef } from "react";

const ITEMS = [
  ["inicio", "🏠", "Inicio"],
  ["seccion", "🌱", "Proyectos"],
  ["plus", "+", "Agenda Plus"],
  ["contacto", "💬", "Contacto"]
];

export default function NavInferior({ vista, onVista, onPlus }) {
  const ref = useRef(null);
  // Publica su alto (--alto-nav) para que el ticker y los botones flotantes queden encima.
  useLayoutEffect(() => {
    const raiz = document.documentElement;
    const medir = () => raiz.style.setProperty("--alto-nav", `${Math.round(ref.current?.getBoundingClientRect().height || 0)}px`);
    medir();
    let ro;
    if (typeof ResizeObserver !== "undefined" && ref.current) { ro = new ResizeObserver(medir); ro.observe(ref.current); }
    window.addEventListener("resize", medir);
    return () => { ro?.disconnect(); window.removeEventListener("resize", medir); raiz.style.setProperty("--alto-nav", "0px"); };
  }, []);
  return (
    <nav ref={ref} className="ni-barra" aria-label="Navegación principal">
      <style>{CSS}</style>
      {ITEMS.map(([id, e, t]) => {
        const activo = id === vista;
        const esPlus = id === "plus";
        return (
          <button
            key={id} type="button"
            className={"ni-b" + (activo ? " ni-act" : "") + (esPlus ? " ni-plus" : "")}
            aria-current={activo ? "page" : undefined}
            onClick={() => (esPlus ? onPlus() : onVista(id))}
          >
            <span className="ni-e" aria-hidden="true">{e}</span>
            <span className="ni-t">{t}</span>
          </button>
        );
      })}
    </nav>
  );
}

const CSS = `
.ni-barra{position:fixed;left:0;right:0;bottom:0;z-index:41;display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-top:2px solid #cfe5d6;box-shadow:0 -4px 14px rgba(0,0,0,.18);padding:4px 4px calc(4px + env(safe-area-inset-bottom,0px))}
.ni-b{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;border:0;background:transparent;min-height:50px;border-radius:14px;color:#3d5a4a;font-weight:800;cursor:pointer;font-family:"Nunito",ui-rounded,system-ui,sans-serif}
.ni-e{font-size:21px;line-height:1}
.ni-t{font-size:11px;line-height:1.1;font-weight:900}
.ni-act{background:#e3f3e9;color:#0e7c4f}
.ni-plus .ni-e{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#0e7c4f;color:#fff;font-size:20px;font-weight:900;margin-top:-14px;border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.3)}
.ni-plus{color:#0e7c4f}
.ni-b:active{transform:translateY(1px)}
@media (min-width:768px){.ni-barra{left:50%;right:auto;width:560px;transform:translateX(-50%);border-radius:18px 18px 0 0}}
`;
