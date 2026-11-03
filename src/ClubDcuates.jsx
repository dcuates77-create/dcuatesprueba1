// CLUB DCUATES · «Sé NUESTRO CUATE» (e61). Textos y modalidades: src/datos/club.js
//  - ClubTarjeta (default): tarjeta de Inicio con un botón por modalidad.
//  - BotonClubPuerta: botón «Únete al Club como … CUATE» dentro de cada puerta (no sensible).
//  - ClubInfo: ventana «Qué incluye ser Cuate» (evento dcuates:club-info).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { MODALIDADES, CLUB_TITULO, CLUB_LEMA, CLUB_REGLAS, NARANJA_CLUB, MODALIDAD_DE_PUERTA, modalidadPorId } from "./datos/club.js";

export const abrirClubInfo = () => window.dispatchEvent(new CustomEvent("dcuates:club-info"));
export const abrirTarjeta = () => window.dispatchEvent(new CustomEvent("dcuates:tarjeta"));
const unirse = (m, desde) => { registrar("club_unirse", { m: m.id, desde }); abrirRegistroPrevio("club", { valores: { mod: m.nombre } }); };

export default function ClubTarjeta() {
  return (
    <section className="clb-sec" aria-label="Únete al Club DCUATES">
      <style>{CSS}</style>
      <h2 className="clb-t">🧡 {CLUB_TITULO}</h2>
      <p className="clb-l">· {CLUB_LEMA} ·</p>
      <div className="clb-g">
        {MODALIDADES.map((m) => (
          <button key={m.id} type="button" className="clb-b" onClick={() => unirse(m, "inicio")}>
            <span aria-hidden="true">{m.e}</span><b>{m.boton}</b>
          </button>
        ))}
      </div>
      <button type="button" className="clb-i" onClick={() => { registrar("club_info", { desde: "inicio" }); abrirClubInfo(); }}>🎁 ¿Qué incluye ser Cuate?</button>
      <button type="button" className="clb-tj" onClick={() => { registrar("tarjeta_desde", { desde: "inicio" }); abrirTarjeta(); }}>💳 Ya soy Cuate: abrir mi tarjeta</button>
    </section>
  );
}

export function BotonClubPuerta({ puertaId, ir }) {
  const m = modalidadPorId(MODALIDAD_DE_PUERTA[puertaId]);
  if (!m) return null;
  return (
    <>
      <style>{CSS}</style>
      <button type="button" className="clb-p" onClick={() => { registrar("club_unirse", { m: m.id, desde: "puerta" }); ir({ reg: { id: "club", valores: { mod: m.nombre } } }); }}>
        🧡 Únete al Club como {m.nombre}
      </button>
    </>
  );
}

export function ClubInfo() {
  const [abierto, setAbierto] = useState(false);
  const [sel, setSel] = useState("");
  const cerrar = () => setAbierto(false);
  const oculta = useAtras(abierto, cerrar, { hub: true });
  useEffect(() => {
    const abre = () => { setSel(""); setAbierto(true); };
    window.addEventListener("dcuates:club-info", abre);
    return () => window.removeEventListener("dcuates:club-info", abre);
  }, []);
  if (!abierto) return null;
  return createPortal(
    <div className="clb-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Qué incluye ser Cuate" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      <div className="clb-caja">
        <div className="clb-cab"><b>🧡 {CLUB_TITULO}</b><button type="button" onClick={cerrar} aria-label="Cerrar">✕</button></div>
        <p className="clb-s">{CLUB_LEMA}. Elige tu modalidad y mira lo que <i>puede incluir</i>.</p>
        <button type="button" className="clb-tj clb-tj2" onClick={() => { registrar("tarjeta_desde", { desde: "info" }); cerrar(); setTimeout(abrirTarjeta, 80); }}>💳 Ya soy Cuate: abrir mi tarjeta</button>
        {MODALIDADES.map((m) => (
          <div key={m.id} className="clb-m">
            <button type="button" className="clb-mh" aria-expanded={sel === m.id} onClick={() => setSel(sel === m.id ? "" : m.id)}>
              <span aria-hidden="true">{m.e}</span><b>{m.nombre}</b><em>{sel === m.id ? "−" : "+"}</em>
            </button>
            {sel === m.id && (
              <div className="clb-mc">
                <p>{m.quien}</p>
                <p className="clb-h">Puede incluir…</p>
                <ul>{m.puedeIncluir.map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="clb-h">Tu compromiso</p>
                <p>{m.compromiso}</p>
                <button type="button" className="clb-u" onClick={() => unirse(m, "info")}>🧡 Únete como {m.nombre}</button>
              </div>
            )}
          </div>
        ))}
        <ul className="clb-r">{CLUB_REGLAS.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </div>,
    document.body
  );
}
const CSS = `
.clb-sec{margin:12px 0 6px;padding:12px 10px;border:2px solid ${NARANJA_CLUB};border-radius:20px;background:#fff4ea;text-align:center;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;box-shadow:0 4px 0 rgba(230,81,0,.18)}
.clb-t{margin:0;font-size:19px;font-weight:900;color:${NARANJA_CLUB};line-height:1.1}
.clb-l{margin:2px 0 10px;font-size:15px;font-weight:900}
.clb-g{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.clb-b{display:flex;align-items:center;gap:6px;min-height:52px;padding:6px 8px;border:2px solid ${NARANJA_CLUB};border-radius:14px;background:#fff;color:#0f2d1e;font:inherit;font-size:13.5px;text-align:left;cursor:pointer;box-shadow:0 3px 0 rgba(230,81,0,.3)}
.clb-b span{font-size:22px}.clb-b b{font-weight:900;line-height:1.15}
.clb-b:active{transform:translateY(2px);box-shadow:none}
.clb-i{margin:10px 0 0;min-height:44px;padding:0 14px;border:0;background:none;color:${NARANJA_CLUB};font:inherit;font-weight:900;font-size:14.5px;text-decoration:underline;cursor:pointer}
.clb-tj{display:block;width:100%;min-height:48px;margin:6px 0 0;padding:0 14px;border:2px solid ${NARANJA_CLUB};border-radius:14px;background:#fff;color:${NARANJA_CLUB};font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}
.clb-tj2{margin:0 0 8px}
.clb-p{display:block;width:100%;min-height:50px;margin:0 0 8px;padding:8px 12px;border:0;border-radius:14px;background:${NARANJA_CLUB};color:#fff;font:inherit;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 3px 0 #a33a00}
.clb-fondo{position:fixed;inset:0;z-index:95;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.clb-caja{background:#fbf7ec;width:100%;max-width:560px;max-height:92dvh;overflow-y:auto;border-radius:24px 24px 0 0;padding:0 12px 22px;color:#0f2d1e}
@media(min-width:640px){.clb-fondo{align-items:center}.clb-caja{border-radius:22px}}
.clb-cab{position:sticky;top:0;display:flex;align-items:center;gap:8px;background:${NARANJA_CLUB};color:#fff;margin:0 -12px 10px;padding:12px;border-radius:24px 24px 0 0}
.clb-cab b{flex:1;font-size:17px;font-weight:900}.clb-cab button{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:${NARANJA_CLUB};font-size:20px;font-weight:900;cursor:pointer}
.clb-s{margin:0 0 8px;font-size:14.5px;font-weight:700}
.clb-m{margin:6px 0;border:2px solid #f3c9a8;border-radius:14px;background:#fff;overflow:hidden}
.clb-mh{display:flex;align-items:center;gap:8px;width:100%;min-height:50px;padding:6px 10px;border:0;background:none;font:inherit;font-size:15px;text-align:left;color:#0f2d1e;cursor:pointer}
.clb-mh span{font-size:22px}.clb-mh b{flex:1;font-weight:900}.clb-mh em{font-style:normal;font-weight:900;color:${NARANJA_CLUB};font-size:22px}
.clb-mc{padding:0 12px 12px;font-size:14px;font-weight:600;line-height:1.35}.clb-mc p{margin:0 0 6px}.clb-mc ul{margin:0 0 6px;padding-left:18px}
.clb-h{font-weight:900!important;color:${NARANJA_CLUB}}
.clb-u{width:100%;min-height:48px;border:0;border-radius:12px;background:${NARANJA_CLUB};color:#fff;font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}
.clb-r{margin:12px 0 0;padding-left:18px;font-size:12.5px;font-weight:700;color:#4a5b52;line-height:1.35}
`;
