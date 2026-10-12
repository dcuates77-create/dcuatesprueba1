// CAMINO DCUATES — mapa de 4 pasos (Conoce → Participa → Colabora → Crece) y "Soy…" por perfil.
import React from "react";
import { identidad } from "./datos/identidad.js";
import { abrirTablero } from "./Tablero.jsx";
import BotonCompartir from "./BotonCompartir.jsx";

const baja = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const abrirZona = (id) => window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: id }));

export default function CaminoDcuates({ menu = {}, onAbrirProyecto = () => {} }) {
  const PASOS = [
    ["1", "🧭", "CONOCE", "6 secciones para explorar", "#1B6F8A", () => abrirTablero("conoce")],
    ["2", "🎮", "PARTICIPA", "Juega, aprende y gana", "#E5484D", () => abrirTablero("participa")],
    ["3", "🤝", "COLABORA", "Aliados, voluntarios y amigos", "#C2410C", () => abrirTablero("colabora")],
    ["4", "🌳", "CRECE", "Tu camino personal", "#2E9E5B", () => abrirTablero("crece")]
  ];
  const SOY = [
    ["🏘️", "Soy vecino o vecina", "#2E9E5B", () => abrirZona("empieza")],
    ["🏪", "Tengo un negocio", identidad("publicidad-tarjeta").color, () => onAbrirProyecto("publicidad-tarjeta")],
    ["🙋", "Quiero ser voluntario(a)", "#334155", () => onAbrirProyecto("donaciones")],
    ["🎁", "Quiero donar o ayudar", "#BE185D", () => abrirZona("causa")],
    ["🌟", "Quiero ser aliado o patrocinador", "#B7791F", () => window.dispatchEvent(new CustomEvent("dcuates:abrir-acceso-aliados"))]
  ];
  return (
    <section className="cm-sec" id="camino-dcuates" aria-label="Camino DCUATES">
      <span className="cm-comp"><BotonCompartir hash="camino-dcuates" titulo="Camino DCUATES" texto="Conoce, participa, colabora y crece con DCUATES" variante="claro" /></span>
      <h2 className="cm-tit">🧭 CAMINO DCUATES</h2>
      <ol className="cm-pasos">
        {PASOS.map(([n, e, t, d, c, fn], i) => (
          <li key={n}><button type="button" onClick={fn} style={{ "--c": c }}><span className="cm-e pz-e" style={{ "--d": `${[0, 0.6, 1.8, 1.2][i]}s`, "--dd": `${i * 0.6}s` }}>{e}</span><span className="cm-tx"><span className="cm-n">PASO {n}</span><b>{t}</b><small>{d}</small></span></button></li>
        ))}
      </ol>
      <p className="cm-soy">¿Cómo quieres sumarte?</p>
      <div className="cm-grid">
        {SOY.map(([e, t, c, fn]) => <button type="button" key={t} onClick={fn} style={{ background: c }}><span>{e}</span>{t}</button>)}
      </div>
      <style>{`
.cm-sec{position:relative;max-width:72rem;margin:12px auto 6px;padding:14px 12px 12px;border-radius:20px;background:var(--tc,#1B6F8A);border:2px solid rgba(255,255,255,.35);box-shadow:0 6px 16px rgba(0,0,0,.18)}
.cm-comp{position:absolute;top:8px;right:8px;z-index:4}
.cm-tit{margin:0 38px 10px;font-size:19px;font-weight:900;text-align:center;color:#fff;letter-spacing:.02em}
.cm-pasos{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 8px}
.cm-pasos button{width:100%;height:100%;min-height:96px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:8px 9px 8px 10px;border:2px solid var(--c);border-left-width:8px;border-radius:14px;background:#fff;font-family:inherit;color:#1f2a37;cursor:pointer;text-align:left;box-shadow:0 5px 12px rgba(0,0,0,.25)}
.cm-pasos button:active{background:#f4f6f5}
.cm-tx{display:flex;flex-direction:column;gap:1px;min-width:0;width:100%}
.cm-n{font-size:11.5px;font-weight:900;letter-spacing:.06em;color:var(--c)}
.cm-e{font-size:28px;line-height:1.1;flex:none}
.cm-pasos b{display:block;font-size:15.5px;font-weight:900;letter-spacing:.01em;line-height:1.1}
.cm-pasos small{display:block;font-size:12px;font-weight:700;line-height:1.15;color:#4a5564}
.cm-soy{margin:14px 0 8px;text-align:center;font-size:14.5px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#fff}
.cm-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.cm-grid button{min-height:58px;display:flex;align-items:center;gap:7px;padding:6px 10px;border:2px solid rgba(255,255,255,.9);border-radius:14px;color:#fff;font-family:inherit;font-size:15px;font-weight:900;line-height:1.15;text-align:left;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.22)}
.cm-grid button:last-child{grid-column:1/-1;justify-content:center;text-align:center}
.cm-grid span{font-size:24px}
.pz-e{display:inline-block;animation:pz-latido 4.8s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes pz-latido{0%{transform:scale(1);filter:none}4%{transform:scale(1.45);filter:drop-shadow(0 0 7px #ffd84d)}12%{transform:scale(1);filter:none}100%{transform:scale(1);filter:none}}
@media(min-width:640px){.cm-pasos{grid-template-columns:repeat(4,minmax(0,1fr))}.cm-grid{grid-template-columns:repeat(5,1fr)}.cm-grid button:last-child{grid-column:auto}.pz-e{animation-delay:var(--dd,0s)}}
`}</style>
    </section>
  );
}
