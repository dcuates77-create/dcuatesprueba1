// MINI PASE (e73): miniatura de ejemplo de cada Pase Cuate (colores y símbolo de src/datos/tarjeta.js). Solo decorativa.
import React from "react";
import { TEMAS } from "./datos/tarjeta.js";

const CORTO = { vecino: "VECINO", aliado: "ALIAD@", voluntario: "VOLUNTARI@", patrocinador: "PATROCINADOR/A", padrino: "PADRINO/MADRINA", organizacion: "ORGANIZACIÓN" };
const NUM = { vecino: "VEC", aliado: "ALI", voluntario: "VOL", patrocinador: "PAT", padrino: "PAD", organizacion: "ORG" };

export default function MiniPase({ id = "vecino", grande = false }) {
  const t = TEMAS[id] || TEMAS.vecino;
  return (
    <span className={"mp" + (grande ? " mp-g" : "")} aria-hidden="true" style={{ background: "linear-gradient(135deg," + t.f1 + "," + t.f2 + ")", borderColor: t.c2 }}>
      <span className="mp-h" style={{ background: "linear-gradient(90deg," + t.c1 + "," + t.c2 + ")" }}>CUATE</span>
      <span className="mp-i">{t.icono}</span>
      <span className="mp-t" style={{ color: t.c1 }}>{CORTO[id]}</span>
      <span className="mp-n" style={{ color: t.c1 }}>{NUM[id]}-0001 · ejemplo</span>
    </span>
  );
}
export const CSS_MINIPASE = `
.mp{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:1px;border:2px solid;border-radius:10px;overflow:hidden;min-width:0;width:100%;box-shadow:0 2px 0 rgba(0,0,0,.18);text-align:center}
.mp-h{align-self:stretch;color:#fff;font-size:8px;font-weight:900;letter-spacing:.14em;line-height:1.5}
.mp-i{font-size:22px;line-height:1.1}
.mp-t{font-size:10px;font-weight:900;line-height:1.1;padding:0 2px;overflow-wrap:anywhere}
.mp-n{font-size:7.5px;font-weight:800;opacity:.75;line-height:1.3;padding-bottom:2px}
.mp-g .mp-i{font-size:30px}.mp-g .mp-t{font-size:12px}.mp-g .mp-n{font-size:9px}.mp-g .mp-h{font-size:10px}
`;
