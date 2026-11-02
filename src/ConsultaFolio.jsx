// CONSULTA TU FOLIO (e60) — la persona escribe su folio (ej. OFR-1101-AB7) y ve en qué va su registro.
// Lee la hoja con el Apps Script (doGet ?a=folio): solo trae Proyecto, Estado, fechas y la «Respuesta pública» que tú escribas en «Registros».
// Nunca trae nombre, teléfono ni el detalle. Se abre con abrirConsultaFolio() o el evento dcuates:consulta-folio.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { consultarFolio } from "./utilidades/hojaPublica.js";
import { registrar } from "./analitica.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { modalidadPorNombre, NARANJA_CLUB } from "./datos/club.js";

export const abrirConsultaFolio = () => window.dispatchEvent(new CustomEvent("dcuates:consulta-folio"));

export function BotonFolio() {
  return (
    <>
      <button type="button" className="cfo-btn" onClick={() => { registrar("folio_abrir"); abrirConsultaFolio(); }}>🔎 Consulta tu folio <small>¿En qué va mi registro?</small></button>
      <style>{`.cfo-btn{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px;width:100%;min-height:48px;margin:6px 0 0;padding:6px 12px;border:2px dashed #0f2d1e;border-radius:14px;background:transparent;color:#0f2d1e;font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}.cfo-btn small{font-size:12.5px;font-weight:700;color:#4a5b52}`}</style>
    </>
  );
}

// Texto amable según el Estado de la hoja (si escribes otro estado, se muestra tal cual).
const esClub = (res, f) => /^CLB-/.test(String(f).trim().toUpperCase());
const AMABLE = (e) => {
  const x = String(e || "").toLowerCase();
  if (/^(recibid|nuev)/.test(x)) return "Lo recibimos. En las próximas 24 horas lo revisamos y en la primera oportunidad lo atendemos.";
  if (/(proceso|seguimiento|revis)/.test(x)) return "Ya lo estamos atendiendo.";
  if (/(atendid|cerrad|resuelt|entregad|complet)/.test(x)) return "¡Listo, ya fue atendido! Gracias por sumar con DCUATES.";
  return "";
};

// e61 — Club DCUATES: textos según el Estado (En revisión → Cuate). Si escribes otro estado se muestra tal cual.
const AMABLE_CLUB = (e) => {
  const x = String(e || "").toLowerCase();
  if (/^cuate|aprobad|activ/.test(x)) return "cuate";
  if (/(pausa|baja|no aprob|rechaz)/.test(x)) return "Por ahora tu registro al Club no quedó activo. Escríbenos por WhatsApp y lo platicamos.";
  return "Recibimos tu registro al Club. Lo estamos revisando; cuando DCUATES lo apruebe aquí verás que ya eres Cuate y tu constancia.";
};
function ConstanciaClub({ res, folio }) {
  const m = modalidadPorNombre(res.perfil);
  return (
    <div className="cfo-cons">
      <b>🧡 ¡Ya eres Cuate DCUATES!</b>
      <p>{res.perfil || "Cuate"}</p>
      <p>Folio {folio}{res.respondido ? <> · desde el {res.respondido}</> : res.fecha ? <> · registro del {res.fecha}</> : null}</p>
      {m && <><p className="cfo-h">Lo que puede incluir:</p><ul>{m.puedeIncluir.map((x) => <li key={x}>{x}</li>)}</ul></>}
      <small>Constancia comunitaria: no es un documento oficial ni una credencial. Tómale captura si quieres conservarla.</small>
    </div>
  );
}
export default function ConsultaFolio() {
  const [abierto, setAbierto] = useState(false);
  const [f, setF] = useState("");
  const [res, setRes] = useState(null);
  const [cargando, setCargando] = useState(false);
  const cerrar = () => { setAbierto(false); setRes(null); };
  const oculta = useAtras(abierto, cerrar, { hub: true });
  useEffect(() => {
    const abre = () => { setF(""); setRes(null); setAbierto(true); };
    window.addEventListener("dcuates:consulta-folio", abre);
    return () => window.removeEventListener("dcuates:consulta-folio", abre);
  }, []);
  if (!abierto) return null;
  const buscar = async (e) => {
    e.preventDefault();
    const q = f.trim().toUpperCase();
    if (!/^[A-Z]{3}-\d{4}-[A-Z0-9]{3}$/.test(q)) { setRes({ formato: true }); return; }
    setCargando(true); setRes(null);
    registrar("folio_consulta", { p: q.slice(0, 3) });
    const r = await consultarFolio(q);
    setCargando(false); setRes(r);
  };
  const aviso = `¡Hola DCUATES! Quiero saber en qué va mi registro${f.trim() ? " " + f.trim().toUpperCase() : ""}.`;
  return createPortal(
    <div className="cfo-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Consulta tu folio" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      <div className="cfo-caja">
        <div className="cfo-cab"><b>🔎 Consulta tu folio</b><button type="button" onClick={cerrar} aria-label="Cerrar">✕</button></div>
        <p className="cfo-i">Escribe el folio que te dimos al registrarte (por ejemplo <b>OFR-1101-AB7</b>).</p>
        <form onSubmit={buscar}>
          <input value={f} onChange={(e) => { setF(e.target.value); setRes(null); }} placeholder="Ej. OFR-1101-AB7" maxLength={14} autoComplete="off" autoCapitalize="characters" aria-label="Tu folio" />
          <button type="submit" disabled={cargando}>{cargando ? "Buscando…" : "Consultar"}</button>
        </form>
        {res && res.formato && <p className="cfo-m cfo-e">Ese folio no tiene el formato correcto. Son tres letras, cuatro números y tres caracteres (ej. OFR-1101-AB7).</p>}
        {res && res.encontrado && (
          <div className="cfo-ok" role="status">
            <p><b>{res.proyecto || "Tu registro"}</b></p>
            <p>Estado: <strong>{res.estado || "Recibido"}</strong>{res.fecha ? <> · registrado el {res.fecha}</> : null}{res.respondido ? <> · respuesta el {res.respondido}</> : null}</p>
            {esClub(res, f) ? (AMABLE_CLUB(res.estado) === "cuate" ? <ConstanciaClub res={res} folio={f.trim().toUpperCase()} /> : <p>{AMABLE_CLUB(res.estado)}</p>) : (AMABLE(res.estado) && <p>{AMABLE(res.estado)}</p>)}
            {res.respuesta ? <p className="cfo-r">💬 {res.respuesta}</p> : null}
          </div>
        )}
        {res && res.encontrado === false && !res.formato && !res.error && <p className="cfo-m cfo-e">No encontramos ese folio. Revisa que esté completo o escríbenos por WhatsApp.</p>}
        {res && res.ocupado && <p className="cfo-m cfo-e">Hay muchas consultas en este momento. Intenta de nuevo en un minuto.</p>}
        {res && res.error && <p className="cfo-m cfo-e">No pudimos consultar ahorita. Intenta más tarde o escríbenos por WhatsApp.</p>}
        <button type="button" className="cfo-wa" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(aviso)}`, "_blank", "noopener")}>📲 Preguntar por WhatsApp</button>
        <small className="cfo-n">Por tu privacidad, aquí solo mostramos el estado de tu registro: nunca tu nombre, teléfono ni lo que escribiste.</small>
      </div>
    </div>,
    document.body
  );
}
const CSS = `
.cfo-fondo{position:fixed;inset:0;z-index:96;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.cfo-caja{background:#fbf7ec;width:100%;max-width:520px;max-height:90dvh;overflow-y:auto;border-radius:24px 24px 0 0;padding:0 14px 20px;color:#0f2d1e}
@media(min-width:640px){.cfo-fondo{align-items:center}.cfo-caja{border-radius:22px}}
.cfo-cab{display:flex;align-items:center;gap:8px;background:#0f4c5c;color:#fff;margin:0 -14px 10px;padding:12px 14px;border-radius:24px 24px 0 0}
.cfo-cab b{flex:1;font-size:18px;font-weight:900}.cfo-cab button{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#0f4c5c;font-size:20px;font-weight:900;cursor:pointer}
.cfo-i{margin:0 0 8px;font-size:14.5px;font-weight:700;line-height:1.35}
.cfo-caja form{display:flex;gap:8px;margin-bottom:8px}
.cfo-caja input{flex:1;min-width:0;min-height:48px;border:2px solid #cbd5e1;border-radius:12px;padding:0 12px;font:inherit;font-size:17px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;background:#fff;color:#0f2d1e}
.cfo-caja input:focus{outline:3px solid #ffd84d;border-color:#0e7c4f}
.cfo-caja form button{min-height:48px;padding:0 16px;border:0;border-radius:12px;background:#0e7c4f;color:#fff;font:inherit;font-weight:900;font-size:15px;cursor:pointer}
.cfo-m{margin:6px 0;font-size:14px;font-weight:800}.cfo-e{color:#b42318}
.cfo-ok{margin:8px 0;padding:10px 12px;background:#e3f3e9;border-radius:14px}.cfo-ok p{margin:0 0 4px;font-size:14.5px;font-weight:700;line-height:1.35}.cfo-r{background:#fff;border-radius:10px;padding:8px}
.cfo-cons{margin:6px 0;padding:10px;border:2px solid ${NARANJA_CLUB};border-radius:14px;background:#fff4ea}.cfo-cons b{font-size:16px;color:${NARANJA_CLUB}}.cfo-cons p{margin:4px 0}.cfo-cons ul{margin:0 0 6px;padding-left:18px;font-size:13.5px}.cfo-cons small{font-size:12px;color:#5b6b62}.cfo-h{font-weight:900!important}
.cfo-wa{display:block;width:100%;min-height:48px;margin:10px 0 6px;border:2px solid #128c7e;border-radius:999px;background:#fff;color:#128c7e;font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}
.cfo-n{display:block;font-size:12px;font-weight:700;color:#5b6b62;line-height:1.35}
`;
