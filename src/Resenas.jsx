// e84c — Opiniones de los Cuates dentro de la página de un emprendimiento (moderadas: se publican solo con tu visto bueno).
import React, { useEffect, useState } from "react";
import { cargarResenas, enviarResena, yaOpino, comentarioValido } from "./utilidades/resenas.js";
import { registrar } from "./analitica.js";

const Estr = ({ n }) => <span aria-label={`${n} de 5`} className="rs-e">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
export default function Resenas({ slug, nombre, ejemplo }) {
  const [d, setD] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [est, setEst] = useState(0);
  const [txt, setTxt] = useState("");
  const [nom, setNom] = useState("");
  const [err, setErr] = useState("");
  const [listo, setListo] = useState(false);
  useEffect(() => { let vivo = true; setD(null); setListo(false); setAbierto(false); setEst(0); setTxt(""); cargarResenas(slug).then((r) => { if (vivo) setD(r); }); return () => { vivo = false; }; }, [slug]);
  const ya = listo || yaOpino(slug);
  const enviar = () => {
    if (!est) { setErr("Elige de 1 a 5 estrellas."); return; }
    if (!comentarioValido(txt)) { setErr("Por seguridad, no escribas enlaces, correos ni teléfonos."); return; }
    enviarResena(slug, est, txt, nom); registrar("negocio_resena", { s: slug, e: est }); setListo(true); setAbierto(false);
  };
  if (!d) return null;
  return (
    <section className="ng-s rs-caja" data-testid="resenas">
      <h2>⭐ Opiniones de los Cuates{d.n > 0 ? ` · ${Number(d.prom).toFixed(1)} (${d.n})` : ""}</h2>
      {d.n === 0 && <p className="rs-v">Aún no hay opiniones publicadas.{ejemplo ? "" : " ¡Sé la primera persona en opinar!"}</p>}
      <ul className="rs-l">{d.lista.slice(0, 5).map((x, i) => <li key={i}><Estr n={x.e} /> <b>{x.n || "Cuate"}</b>{x.c && <p>{x.c}</p>}</li>)}</ul>
      {!ejemplo && !ya && !abierto && <button type="button" className="rs-b" data-testid="resena-abrir" onClick={() => setAbierto(true)}>✍️ Dejar mi opinión</button>}
      {ya && <p className="rs-ok" data-testid="resena-gracias">{listo ? "¡Gracias! Tu opinión se publicará cuando DCUATES la revise." : "Ya dejaste tu opinión este mes. ¡Gracias!"}</p>}
      {abierto && (
        <div className="rs-f" data-testid="resena-form">
          <p><b>¿Cómo te fue con {nombre}?</b></p>
          <div className="rs-st" role="radiogroup" aria-label="Estrellas">
            {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={est === n} aria-label={`${n} estrellas`} className={n <= est ? "on" : ""} onClick={() => { setEst(n); setErr(""); }}>★</button>)}
          </div>
          <label>Tu opinión (opcional)<textarea maxLength={280} rows={3} value={txt} onChange={(e) => { setTxt(e.target.value); setErr(""); }} placeholder="¿Qué te gustó? Sin enlaces ni teléfonos." /></label>
          <label>Tu nombre o apodo (opcional)<input maxLength={30} value={nom} onChange={(e) => setNom(e.target.value)} /></label>
          <p className="rs-n">Se publica después de que DCUATES la revise. No pedimos más datos.</p>
          {err && <p className="rs-er" role="alert">{err}</p>}
          <button type="button" className="rs-b" data-testid="resena-enviar" onClick={enviar}>Enviar opinión</button>
        </div>
      )}
      <style>{`.rs-caja h2{font-size:17px}.rs-v,.rs-n{margin:4px 0;font-size:13.5px;font-weight:700;color:#4a5a50}.rs-l{list-style:none;margin:6px 0;padding:0;display:flex;flex-direction:column;gap:8px}.rs-l li{padding:8px 10px;border:1px solid #d8d2bd;border-radius:12px;background:#fff;font-size:14px}.rs-l p{margin:2px 0 0;font-weight:700}.rs-e{color:#C77700;letter-spacing:1px}
.rs-b{width:100%;min-height:48px;border:2px solid #C2185B;border-radius:12px;background:#fff;color:#C2185B;font:inherit;font-weight:900;font-size:15px;cursor:pointer}.rs-ok{margin:6px 0;font-weight:900;color:#1F7A46}
.rs-f{margin-top:8px;padding:10px;border:2px solid #C2185B;border-radius:14px;background:#FFF5F9}.rs-f label{display:block;margin:6px 0;font-size:13.5px;font-weight:800}.rs-f textarea,.rs-f input{display:block;width:100%;box-sizing:border-box;margin-top:3px;padding:8px 10px;border:2px solid #cfc8b0;border-radius:10px;font:inherit;font-size:15px;background:#fff}
.rs-st{display:flex;gap:6px}.rs-st button{width:48px;height:48px;border:2px solid #d8d2bd;border-radius:12px;background:#fff;color:#bbb;font-size:26px;cursor:pointer}.rs-st button.on{color:#C77700;border-color:#C77700;background:#FFF1C9}.rs-er{margin:4px 0;font-weight:900;color:#B3261E}`}</style>
    </section>
  );
}
