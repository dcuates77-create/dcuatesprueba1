// CON DCUATES TODOS GANAMOS (e60) — los tres verbos de la comunidad: COMPARTIMOS · OFREZCO · NECESITO.
// CON y la primera letra de cada verbo van en naranja (el color del logo y del Club DCUATES, e61) para que se asocien.
// Se usa en Inicio y dentro de cada puerta (menos las de apoyo o urgencia). Los textos se editan aquí.
// onElegir(k) es opcional: k = "compartimos" | "ofrezco" | "necesito". Sin él, abre directo el tablón o el registro.
import React from "react";
import { abrirTablon } from "./Tablon.jsx";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { registrar } from "./analitica.js";

export const NARANJA_CLUB = "#E65100";
const VERBOS = [
  ["compartimos", "COMPARTIMOS", "🤝", "lo que hay y se recomienda"],
  ["ofrezco", "OFREZCO", "🎁", "lo que puedo dar o hacer"],
  ["necesito", "NECESITO", "🙏", "lo que me hace falta"]
];

export default function ConDcuates({ perfil = "", onElegir, compacto = false }) {
  const elegir = (k) => {
    registrar("con_boton", { k, desde: compacto ? "puerta" : "inicio" });
    if (onElegir) { onElegir(k); return; }
    if (k === "compartimos") abrirTablon("");
    else abrirRegistroPrevio(k, perfil ? { perfil } : {});
  };
  return (
    <section className={"con-sec" + (compacto ? " con-c" : "")} aria-label="Con DCUATES todos ganamos">
      <style>{CSS}</style>
      <h2 className="con-t"><span className="con-n">CON</span> DCUATES TODOS GANAMOS</h2>
      <p className="con-e">
        <span className="con-n">C</span>ompartimos <span className="con-n">·</span> <span className="con-n">O</span>frezco <span className="con-n">·</span> <span className="con-n">N</span>ecesito
      </p>
      <div className="con-g">
        {VERBOS.map(([k, t, e, s]) => (
          <button key={k} type="button" className="con-b" onClick={() => elegir(k)}>
            <span className="con-e2" aria-hidden="true">{e}</span>
            <b><span className="con-n">{t.charAt(0)}</span>{t.slice(1)}</b>
            <small>{s}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
const CSS = `
.con-sec{margin:14px 0 6px;padding:12px 10px 12px;border:2px solid ${NARANJA_CLUB};border-radius:20px;background:#fff;box-shadow:0 4px 0 rgba(230,81,0,.18);text-align:center;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e}
.con-t{margin:0 0 2px;font-size:20px;font-weight:900;letter-spacing:.02em;line-height:1.1}
.con-n{color:${NARANJA_CLUB};font-weight:900}
.con-e{margin:0 0 10px;font-size:15px;font-weight:800;color:#2f4d3f}
.con-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.con-b{display:flex;flex-direction:column;align-items:center;gap:2px;min-height:112px;padding:10px 4px;border:2px solid #0f2d1e;border-radius:16px;background:#fbf7ec;color:#0f2d1e;font:inherit;cursor:pointer;box-shadow:0 3px 0 rgba(15,45,30,.25)}
.con-b:active{transform:translateY(2px);box-shadow:none}
.con-b b{font-size:14px;font-weight:900;letter-spacing:.01em}.con-b b .con-n{font-size:20px}
.con-b small{font-size:12.5px;font-weight:700;line-height:1.2;color:#3d5a4a}
.con-e2{font-size:26px;line-height:1}
.con-c{margin:0 0 8px;padding:8px 6px;border-width:2px}
.con-c .con-t{font-size:15px}.con-c .con-e{display:none}.con-c .con-b{min-height:84px;padding:6px 2px}.con-c .con-b small{font-size:11.5px}
`;
