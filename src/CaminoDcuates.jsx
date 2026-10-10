// CAMINO DCUATES — mapa de 4 pasos (Conoce → Participa → Colabora → Crece) y "Soy…" por perfil.
import React from "react";
import { identidad } from "./datos/identidad.js";

const baja = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const abrirZona = (id) => { baja("zona-publica"); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: id })), 450); };

export default function CaminoDcuates({ menu = {}, onAbrirProyecto = () => {} }) {
  const PASOS = [
    ["1", "🧭", "CONOCE", "Mira todo lo que hacemos", "#1B6F8A", () => (menu.mapa ? menu.mapa() : baja("zona-publica"))],
    ["2", "🎮", "PARTICIPA", "Juega, aprende y gana", "#E5484D", () => baja("zona-publica")],
    ["3", "🤝", "COLABORA", "Aliados, voluntarios y amigos", "#C2410C", () => baja("zona-aliados")],
    ["4", "🌳", "CRECE", "Tu camino personal", "#2E9E5B", () => baja("zona-red")]
  ];
  const SOY = [
    ["🏘️", "Soy vecino o vecina", "#2E9E5B", () => abrirZona("empieza")],
    ["🏪", "Tengo un negocio", identidad("publicidad-tarjeta").color, () => onAbrirProyecto("publicidad-tarjeta")],
    ["🙋", "Quiero ser voluntario(a)", identidad("donaciones").color, () => onAbrirProyecto("donaciones")],
    ["🎁", "Quiero donar o ayudar", "#BE185D", () => abrirZona("causa")],
    ["🌟", "Quiero ser aliado o patrocinador", "#B7791F", () => { baja("zona-aliados"); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-acceso-aliados")), 450); }]
  ];
  return (
    <section className="cm-sec" aria-label="Tu camino en DCUATES">
      <h2 className="cm-tit">🧭 TU CAMINO EN DCUATES</h2>
      <ol className="cm-pasos">
        {PASOS.map(([n, e, t, d, c, fn]) => (
          <li key={n}><button type="button" onClick={fn} style={{ "--c": c }}><span className="cm-n">{n}</span><span className="cm-e">{e}</span><b>{t}</b><small>{d}</small></button></li>
        ))}
      </ol>
      <p className="cm-soy">¿Cómo quieres sumarte?</p>
      <div className="cm-grid">
        {SOY.map(([e, t, c, fn]) => <button type="button" key={t} onClick={fn} style={{ background: c }}><span>{e}</span>{t}</button>)}
      </div>
      <style>{`
.cm-sec{max-width:72rem;margin:14px auto 6px;padding:14px 14px 12px;border-radius:20px;background:#fff;border:2px solid #e3e8e5}
.cm-tit{margin:0 0 8px;font-size:17px;font-weight:900;text-align:center;color:#1f2a37}
.cm-pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.cm-pasos button{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 3px 6px;border:2px solid var(--c);border-radius:14px;background:#fff;font-family:inherit;color:#1f2a37;cursor:pointer}
.cm-pasos button:active{background:var(--c);color:#fff}
.cm-n{position:absolute;top:-8px;left:-6px;width:20px;height:20px;border-radius:50%;background:var(--c);color:#fff;font-size:11px;font-weight:900;display:grid;place-items:center}
.cm-e{font-size:22px}
.cm-pasos b{font-size:11px;font-weight:900;letter-spacing:.03em}
.cm-pasos small{font-size:9.5px;font-weight:700;line-height:1.15;text-align:center;color:#5b6675}
.cm-soy{margin:12px 0 6px;text-align:center;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#6b7785}
.cm-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.cm-grid button{min-height:52px;display:flex;align-items:center;gap:6px;padding:6px 10px;border:0;border-radius:14px;color:#fff;font-family:inherit;font-size:13px;font-weight:900;line-height:1.15;text-align:left;cursor:pointer}
.cm-grid button:last-child{grid-column:1/-1;justify-content:center;text-align:center}
.cm-grid span{font-size:22px}
@media(min-width:640px){.cm-grid{grid-template-columns:repeat(5,1fr)}.cm-grid button:last-child{grid-column:auto}}
`}</style>
    </section>
  );
}
