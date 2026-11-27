// e99 · Botones del final de una sección: «ÚNETE AL CLUB» y «VOLVER A LA PÁGINA PRINCIPAL».
import React from "react";
import { registrar } from "./analitica.js";

export default function PieSeccion({ desde = "", onClub, onInicio }) {
  return (
    <div className="pie-sec" data-testid="pie-seccion">
      <style>{CSS}</style>
      <button type="button" className="pie-club" onClick={() => { registrar("pie_club", { desde }); onClub && onClub(); }} data-testid="pie-club">🧡 ÚNETE AL CLUB</button>
      <button type="button" className="pie-inicio" onClick={() => { registrar("pie_inicio", { desde }); onInicio && onInicio(); }} data-testid="pie-inicio">🏠 VOLVER A LA PÁGINA PRINCIPAL</button>
    </div>
  );
}

const CSS = `
.pie-sec{display:flex;flex-direction:column;gap:8px;margin:16px 0 6px}
.pie-sec button{all:unset;box-sizing:border-box;width:100%;min-height:50px;padding:10px 12px;border-radius:14px;text-align:center;font-weight:900;font-size:15px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px}
.pie-club{background:linear-gradient(135deg,#E8731A,#F59E0B);color:#fff;box-shadow:0 3px 8px rgba(230,81,0,.3)}
.pie-inicio{background:#fff;color:#0B6E78;border:2px solid #0B6E78!important}
.pie-sec button:active{transform:scale(.97)}.pie-sec button:focus-visible{outline:3px solid #FFD54F;outline-offset:2px}
`;
