// TABLERO — ventana con introducción y botones grandes (toca en cualquier parte del botón para abrir su contenido).
// Lo abre cada botón de CAMINO DCUATES. Incluye siempre el botón REGÍSTRATE Y PARTICIPA.
import React from "react";
import { createPortal } from "react-dom";
import BotonCompartir from "./BotonCompartir.jsx";

export const abrirAcceso = (tipo) => window.dispatchEvent(new CustomEvent("dcuates:abrir-acceso", { detail: tipo }));
export const abrirTablero = (id) => window.dispatchEvent(new CustomEvent("dcuates:abrir-tablero", { detail: id }));
export const IDS_TABLERO = ["conoce", "participa", "colabora", "crece"];

export default function Tablero({ paso, emoji, titulo, intro, color = "#1B6F8A", sub = null, tarjetas = [], hash, onCerrar, onRegistros }) {
  return createPortal(
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja tb-caja">
        <div className="zj-cab" style={{ borderBottom: `4px solid ${color}`, paddingBottom: 6 }}>
          <b>{emoji} {titulo}</b>
          {hash && <BotonCompartir hash={hash} titulo={titulo} texto={intro} variante="circulo" />}
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        {paso && <p className="tb-paso" style={{ color }}>{paso}</p>}
        <p className="tb-intro">{intro}</p>
        {sub}
        <div className="tb-grid">
          {tarjetas.map((c) => (
            <button type="button" key={c.id} className={"tb-card" + (c.bloq ? " tb-bloq" : "")} style={{ "--c": c.color || color }} onClick={c.onClick}>
              <span className="tb-e" aria-hidden="true">{c.bloq ? "🔒" : c.emoji}</span>
              <b>{c.t}</b>
              <small>{c.d}</small>
            </button>
          ))}
          <button type="button" className="tb-card tb-reg" style={{ "--c": "#2E9E5B" }} onClick={onRegistros}>
            <span className="tb-e" aria-hidden="true">📝</span>
            <b>REGÍSTRATE Y PARTICIPA</b>
            <small>Solicitudes, negocio, ventas con causa, reportes, voluntariado y sugerencias</small>
          </button>
        </div>
      </div>
      <style>{`
.tb-caja{max-width:520px}
.tb-paso{margin:2px 0 0;font-size:11px;font-weight:900;letter-spacing:.12em;text-align:center}
.tb-intro{margin:6px 2px 10px;font-size:14.5px;font-weight:700;line-height:1.35;color:#3a4654;text-align:center}
.tb-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
.tb-card{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-height:112px;padding:10px;border:2px solid var(--c);border-bottom-width:6px;border-radius:16px;background:#fff;font-family:inherit;color:#1f2a37;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .12s}
.tb-card:active{transform:translateY(3px);background:#f4f6f5}
.tb-e{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:var(--c);font-size:22px}
.tb-card b{font-size:13.5px;font-weight:900;line-height:1.15}
.tb-card small{font-size:11.5px;font-weight:700;line-height:1.25;color:#5b6675}
.tb-bloq{opacity:.85}
.tb-reg{grid-column:1/-1;min-height:84px;background:#eafaf0}
`}</style>
    </div>,
    document.body
  );
}
