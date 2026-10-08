// Tarjeta "Agenda" (muestra el día de hoy) + ventana con calendario del mes.
// Las fechas con actividad llevan un punto; al tocarlas se abre su información.
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const clave = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export function normalizarAgenda(filas = [], fijos = []) {
  const deBaserow = filas
    .filter((f) => f && f["AGENDA FECHA"] && f["AGENDA TITULO"])
    .map((f) => ({
      fecha: String(f["AGENDA FECHA"]).trim().slice(0, 10),
      titulo: String(f["AGENDA TITULO"]).trim(),
      info: f["AGENDA INFO"] ? String(f["AGENDA INFO"]).trim() : "",
      enlace: f["AGENDA ENLACE"] ? String(f["AGENDA ENLACE"]).trim() : ""
    }));
  return [...fijos, ...deBaserow].filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.fecha));
}

export default function BloqueAgenda({ eventos = [], color = "#2E9E5B" }) {
  const hoy = new Date();
  const [abierta, setAbierta] = useState(false);
  const [mes, setMes] = useState({ y: hoy.getFullYear(), m: hoy.getMonth() });
  const [sel, setSel] = useState(clave(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));

  const porFecha = useMemo(() => {
    const o = {};
    eventos.forEach((e) => { (o[e.fecha] = o[e.fecha] || []).push(e); });
    return o;
  }, [eventos]);

  const hoyClave = clave(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const proximos = eventos.filter((e) => e.fecha >= hoyClave).length;
  const primerDia = new Date(mes.y, mes.m, 1).getDay();
  const diasMes = new Date(mes.y, mes.m + 1, 0).getDate();
  const celdas = [...Array(primerDia).fill(null), ...Array.from({ length: diasMes }, (_, i) => i + 1)];
  const mover = (n) => setMes(({ y, m }) => { const d = new Date(y, m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const delDia = porFecha[sel] || [];
  const delMes = eventos.filter((e) => e.fecha.startsWith(`${mes.y}-${String(mes.m + 1).padStart(2, "0")}`)).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const bonita = (f) => { const [y, m, d] = f.split("-").map(Number); return `${DIAS[new Date(y, m - 1, d).getDay()]} ${d} de ${MESES[m - 1]}`; };

  return (
    <>
      <article className="bc-ficha bc-mini bc-agenda-card" style={{ borderColor: color }}>
        <div className="ag-hoy" aria-hidden="true">
          <span className="ag-hoy-m" style={{ background: color }}>{MESES[hoy.getMonth()].slice(0, 3).toUpperCase()}</span>
          <span className="ag-hoy-d">{hoy.getDate()}</span>
        </div>
        <h3>AGENDA COMUNITARIA</h3>
        <p>{DIAS[hoy.getDay()]}{proximos > 0 ? ` · ${proximos} próxima${proximos > 1 ? "s" : ""}` : ""}</p>
        <div className="bc-ficha-btns">
          <button type="button" onClick={() => setAbierta(true)} style={{ background: color }}>📅 Ver</button>
        </div>
      </article>

      {abierta && createPortal(
        <div className="ag-fondo" role="dialog" aria-modal="true" aria-label="Agenda comunitaria" onClick={(e) => { if (e.target === e.currentTarget) setAbierta(false); }}>
          <div className="ag-caja">
            <div className="ag-cab">
              <button type="button" className="ag-nav" onClick={() => mover(-1)} aria-label="Mes anterior">‹</button>
              <b>{MESES[mes.m]} {mes.y}</b>
              <button type="button" className="ag-nav" onClick={() => mover(1)} aria-label="Mes siguiente">›</button>
              <button type="button" className="ag-x" onClick={() => setAbierta(false)} aria-label="Cerrar">✕</button>
            </div>
            <div className="ag-rejilla">
              {["D","L","M","M","J","V","S"].map((d, i) => <span key={i} className="ag-dn">{d}</span>)}
              {celdas.map((d, i) => {
                if (!d) return <span key={i} />;
                const k = clave(mes.y, mes.m, d);
                const hay = !!porFecha[k];
                return (
                  <button type="button" key={i} onClick={() => setSel(k)}
                    className={"ag-d" + (k === hoyClave ? " ag-hoyc" : "") + (k === sel ? " ag-sel" : "") + (hay ? " ag-hay" : "")}
                    style={k === sel ? { background: color, color: "#fff" } : undefined}
                    aria-label={`${d} de ${MESES[mes.m]}${hay ? ", con actividad" : ""}`}>
                    {d}{hay && <i style={{ background: k === sel ? "#fff" : color }} />}
                  </button>
                );
              })}
            </div>
            <div className="ag-info">
              <p className="ag-fecha">{bonita(sel)}</p>
              {delDia.length === 0 && <p className="ag-vacio">Sin actividades este día. Las fechas con punto sí tienen.</p>}
              {delDia.map((e, i) => (
                <div className="ag-ev" key={i}>
                  <b>{e.titulo}</b>
                  {e.info && <p>{e.info}</p>}
                  {e.enlace && <a href={e.enlace} target="_blank" rel="noopener noreferrer">Más información ›</a>}
                </div>
              ))}
              {delMes.length > 0 && (
                <div className="ag-mes">
                  <p className="ag-fecha">Este mes</p>
                  {delMes.map((e, i) => (
                    <button type="button" key={i} onClick={() => setSel(e.fecha)}>{Number(e.fecha.slice(8))} · {e.titulo}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <style>{CSS}</style>
        </div>,
        document.body
      )}
    </>
  );
}

const CSS = `
.ag-fondo{position:fixed;inset:0;z-index:90;background:rgba(15,25,20,.6);display:flex;align-items:flex-end;justify-content:center;font-family:inherit}
.ag-caja{width:100%;max-width:460px;max-height:92vh;overflow:auto;background:#fff;border-radius:22px 22px 0 0;padding:14px 14px 22px;color:#1f2a37}
@media(min-width:640px){.ag-fondo{align-items:center}.ag-caja{border-radius:22px}}
.ag-cab{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.ag-cab b{flex:1;text-align:center;font-size:17px;font-weight:900;text-transform:capitalize}
.ag-nav,.ag-x{width:42px;height:42px;border:0;border-radius:12px;background:#eef2f0;font-size:22px;font-weight:900;cursor:pointer;color:#1f2a37}
.ag-x{font-size:16px;background:#fde8e8}
.ag-rejilla{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.ag-dn{text-align:center;font-size:12px;font-weight:900;color:#6b7785;padding:4px 0}
.ag-d{position:relative;aspect-ratio:1;border:2px solid transparent;border-radius:12px;background:#f4f7f5;font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;color:#1f2a37}
.ag-d i{position:absolute;left:50%;bottom:5px;width:7px;height:7px;margin-left:-3.5px;border-radius:50%}
.ag-hay{font-weight:900}
.ag-hoyc{border-color:#1f2a37}
.ag-info{margin-top:12px}
.ag-fecha{margin:0 0 6px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#6b7785}
.ag-vacio{margin:0 0 8px;font-size:14px;font-weight:700;color:#6b7785}
.ag-ev{background:#f4f7f5;border-radius:14px;padding:10px 12px;margin-bottom:8px}
.ag-ev b{font-size:15px;font-weight:900}
.ag-ev p{margin:4px 0 0;font-size:14px;font-weight:600;line-height:1.35}
.ag-ev a{display:inline-block;margin-top:6px;font-weight:900;font-size:14px;color:#1B6F8A}
.ag-mes{margin-top:10px}
.ag-mes button{display:block;width:100%;text-align:left;border:0;background:none;padding:8px 2px;border-top:1px solid #e5ebe8;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer;color:#1f2a37}
`;
