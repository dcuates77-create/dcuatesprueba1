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

// Avatares dibujados (sin fotos): mujer con cola de caballo y hombre con gorra.
function Avatar({ quien, t }) {
  return (
    <svg className="pe-av" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill={t.f1} />
      <path d="M8 64c2-13 13-17 24-17s22 4 24 17z" fill={t.c2} />
      {quien === "mujer" ? (
        <>
          <path d="M44 22c9 1 12 11 6 19 1-6-1-11-6-14z" fill="#6b3f1d" />
          <circle cx="32" cy="34" r="13" fill="#F2C6A0" />
          <path d="M18 33c-1-11 6-18 14-18s15 6 14 17c-3-6-8-9-14-9s-11 3-14 10z" fill="#6b3f1d" />
          <circle cx="44.500" cy="23" r="2.600" fill={t.c1} />
        </>
      ) : (
        <>
          <circle cx="32" cy="35" r="13" fill="#E3AE80" />
          <path d="M18 30c0-10 6-15 14-15s14 5 14 15z" fill={t.c1} />
          <path d="M40 29h14c-1 4-7 6-14 4z" fill={t.c1} />
          <path d="M22 31h20" stroke={t.c2} strokeWidth="2" />
        </>
      )}
      <circle cx="27.500" cy="36" r="1.500" fill="#3b2a1a" /><circle cx="36.500" cy="36" r="1.500" fill="#3b2a1a" />
      <path d="M28 41c2.500 2.500 5.500 2.500 8 0" fill="none" stroke="#3b2a1a" strokeWidth="1.600" strokeLinecap="round" />
    </svg>
  );
}
// Pase de ejemplo más grande (portada del Club): foto dibujada, nombre, chip y lema.
export function PaseEjemplo({ id = "vecino", quien = "mujer", nombre = "Ana Pérez", num = "VEC-0001", pts = 100 }) {
  const t = TEMAS[id] || TEMAS.vecino;
  return (
    <span className="pe" aria-hidden="true" style={{ background: "linear-gradient(135deg," + t.f1 + "," + t.f2 + ")", borderColor: t.c2 }}>
      <span className="pe-f" style={{ borderColor: "#fff", boxShadow: "0 0 0 2px " + t.c2 }}><Avatar quien={quien} t={t} /></span>
      <span className="pe-t">
        <b style={{ color: t.c1 }}>{nombre}</b>
        <span className="pe-chip" style={{ background: t.c2 }}>{t.icono} {t.rotulo}</span>
        <em style={{ color: t.c1 }}>{t.lemas[0]}</em>
        <small style={{ color: t.c1 }}>{num} · ✦ {pts} pts · ejemplo</small>
      </span>
    </span>
  );
}
export const CSS_PASEEJ = `
.pe{display:flex;align-items:center;gap:10px;border:2px solid;border-radius:16px;padding:8px 10px;min-width:0;box-shadow:0 3px 0 rgba(0,0,0,.15);text-align:left}
.pe-f{flex:none;width:62px;height:62px;border-radius:50%;border:3px solid;overflow:hidden;display:block}
.pe-av{width:100%;height:100%;display:block}
.pe-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;align-items:flex-start}
.pe-t b{font-size:16px;font-weight:900;line-height:1.1}
.pe-chip{color:#fff;font-size:10.5px;font-weight:900;border-radius:12px;padding:2px 8px;letter-spacing:.02em}
.pe-t em{font-size:11.5px;font-weight:700;line-height:1.2}
.pe-t small{font-size:10px;font-weight:800;opacity:.8}
`;

// Vista del Pase completo (como «Mi Pase», en miniatura) con foto de ejemplo. Si la foto falta, usa el avatar dibujado.
export function PaseCompleto({ id = "vecino", quien = "mujer", foto, nombre = "Ana Pérez", num = "VEC100A", pts = 100, inclinar = 0 }) {
  const t = TEMAS[id] || TEMAS.vecino;
  const [falla, setFalla] = React.useState(false);
  return (
    <span className="pc" aria-hidden="true" style={{ background: "linear-gradient(160deg," + t.f1 + "," + t.f2 + ")", borderColor: t.c2, transform: "rotate(" + inclinar + "deg)" }}>
      <span className="pc-top"><img src="/images/logo-circular.webp" alt="" width="16" height="16" /><b>DCUATES</b><i>¡COMPARTE Y GANA!</i></span>
      <span className="pc-per">
        <span className="pc-f" style={{ boxShadow: "0 0 0 2px " + t.c2 }}>
          {foto && !falla ? <img src={foto} alt="" onError={() => setFalla(true)} /> : <Avatar quien={quien} t={t} />}
        </span>
        <span className="pc-n">
          <b style={{ color: t.c1 }}>{nombre}</b>
          <span className="pe-chip" style={{ background: t.c2 }}>{t.icono} {t.rotulo}</span>
        </span>
      </span>
      <em style={{ color: t.c1 }}>{t.lemas[0]}</em>
      <small style={{ color: t.c1 }}>No. de Cuate <u>{num}</u> · Cuate desde nov 2026</small>
      <span className="pc-pan" style={{ background: t.c1 }}>PANEL DE PUNTOS & PROYECTOS</span>
      <span className="pc-pts"><span style={{ color: "#E8A800" }}>✦</span> <b>{pts}</b> <span>Puntos DCUATES</span></span>
      <span className="pc-bar"><span style={{ background: t.c2 }} /></span>
      <span className="pc-prem">🎁 Revisa por qué PREMIOS puedes cambiar tus puntos</span>
    </span>
  );
}
export const CSS_PASECOMPLETO = `
.pc{display:flex;flex-direction:column;gap:3px;width:100%;border:2px solid;border-radius:14px;padding:6px 6px 7px;box-shadow:0 5px 12px rgba(0,0,0,.28);text-align:left;min-width:0;box-sizing:border-box}
.pc-top{display:flex;align-items:center;gap:3px;border-radius:8px;background:rgba(255,255,255,.7);padding:2px 4px}
.pc-top b{font-size:9px;font-weight:900;color:#0B6E2E;letter-spacing:.02em}.pc-top i{font-style:normal;font-size:6px;font-weight:900;color:#E65100;line-height:1}
.pc-per{display:flex;align-items:center;gap:5px;min-width:0}
.pc-f{flex:none;width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid #fff;display:block;background:#fff}
.pc-f img,.pc-f svg{width:100%;height:100%;object-fit:cover;display:block}
.pc-n{display:flex;flex-direction:column;gap:2px;min-width:0;align-items:flex-start}
.pc-n b{font-size:12.5px;font-weight:900;line-height:1.05}
.pc-n .pe-chip{font-size:7px;padding:1px 5px;border-radius:8px}
.pc em{font-style:italic;font-size:8.5px;font-weight:700;line-height:1.15}
.pc small{font-size:6.5px;font-weight:800;opacity:.85;line-height:1.2}.pc small u{text-decoration:none;background:rgba(255,255,255,.7);border-radius:3px;padding:0 2px}
.pc-pan{color:#fff;font-size:6.5px;font-weight:900;letter-spacing:.04em;border-radius:6px 6px 0 0;padding:3px 5px}
.pc-pts{display:flex;align-items:baseline;gap:3px;background:#fff;padding:2px 5px 0}.pc-pts b{font-size:19px;font-weight:900;color:#0f2d1e;line-height:1}.pc-pts span:last-child{font-size:8px;font-weight:800;color:#0f2d1e}
.pc-bar{display:block;background:#fff;padding:0 5px 3px}.pc-bar span{display:block;height:5px;border-radius:3px;width:100%}
.pc-prem{font-size:7px;font-weight:800;color:#1b5e20;background:#e9f6ec;border:1px solid #9bd0a9;border-radius:6px;padding:2px 4px;line-height:1.2}
`;
