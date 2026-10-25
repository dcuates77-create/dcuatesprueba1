// «COSAS QUE PASAN ESTA SEMANA» (e49) — carrusel con los eventos de los próximos 7 días (Google Calendar + agenda de la zona).
// Si no hay ninguno, no se muestra nada. Al tocar un evento se abre la Agenda (clima, recordatorios, cuenta regresiva).
import React, { useMemo } from "react";
import { proximos, fechaLinda } from "./utilidades/calendario.js";
import { agendaDesdeZona } from "./datos/zona.js";
import { registrar } from "./analitica.js";

export default function CosasSemana({ agenda = [], filasZona = [] }) {
  const lista = useMemo(() => {
    const limite = Date.now() + 7 * 86400000;
    let base = [];
    try { base = proximos([...agenda, ...agendaDesdeZona(filasZona)]); } catch (e) { base = []; }
    const vistos = new Set();
    return base
      .filter((e) => e.inicio && e.inicio.getTime() <= limite)
      .sort((a, b) => a.inicio - b.inicio)
      .filter((e) => { const k = e.inicio.getTime() + "|" + String(e.titulo || "").toLowerCase().trim(); if (vistos.has(k)) return false; vistos.add(k); return true; })
      .slice(0, 8);
  }, [agenda, filasZona]);
  if (!lista.length) return null;
  return (
    <section className="cs-sec" aria-label="Cosas que pasan esta semana">
      <style>{`
.cs-sec{margin:0 0 14px}
.cs-h{margin:0 0 8px;padding:0 4px;font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:20px;color:#0f2d1e}
.cs-tira{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;-webkit-overflow-scrolling:touch}
.cs-c{flex:none;scroll-snap-align:start;width:200px;min-height:104px;text-align:left;background:#fff;border:2px solid #cfe5d6;border-left:7px solid #1B6F8A;border-radius:16px;padding:10px 12px;font-family:inherit;cursor:pointer;box-shadow:0 3px 8px rgba(15,45,30,.12);display:flex;flex-direction:column;gap:4px}
.cs-c small{display:block;font-size:12.5px;font-weight:900;color:#1B6F8A}.cs-c small::first-letter{text-transform:uppercase}
.cs-c b{font-size:15px;font-weight:900;line-height:1.2;color:#0f2d1e;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.cs-c em{font-style:normal;font-size:12.5px;font-weight:700;color:#4a5f53}
`}</style>
      <h2 className="cs-h">📅 Cosas que pasan esta semana</h2>
      <div className="cs-tira">
        {lista.map((e, i) => (
          <button key={i} type="button" className="cs-c" onClick={() => { registrar("semana_evento"); window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: "info:agenda" })); }}>
            <small>{fechaLinda(e)}</small>
            <b>{e.titulo}</b>
            {e.lugar && <em>📍 {e.lugar}</em>}
          </button>
        ))}
      </div>
    </section>
  );
}
