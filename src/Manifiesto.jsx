// MANIFIESTO DCUATES (e49) — se muestra dentro de una tarjeta desplegable de NOSOTROS. El texto vive en src/datos/manifiesto.js.
import React from "react";
import { MANIFIESTO } from "./datos/manifiesto.js";

const conNegritas = (t) => t.split("**").map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <React.Fragment key={i}>{p}</React.Fragment>));

export default function Manifiesto() {
  return (
    <div className="mf-raiz" id="manifiesto">
      <style>{`
.mf-raiz{font-family:Nunito,system-ui,sans-serif;color:#2b3a32;text-align:left}
.mf-sub{margin:0 0 10px;font-size:15px;font-weight:800;color:#0f2d1e;font-style:italic}
.mf-p{background:#fff;border-radius:16px;padding:12px 12px 14px;margin:0 0 10px;box-shadow:0 2px 8px rgba(15,45,30,.1);border-left:6px solid var(--tc,#0e7c4f)}
.mf-p h4{margin:0 0 6px;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:900;line-height:1.2;color:#0f2d1e}
.mf-l{flex:none;width:28px;height:28px;border-radius:50%;background:var(--tc,#0e7c4f);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:900}
.mf-p p{margin:0;font-size:15.5px;line-height:1.5;font-weight:600}
.mf-p b{font-weight:900;color:#0f2d1e}
`}</style>
      <p className="mf-sub">{MANIFIESTO.subtitulo}</p>
      {MANIFIESTO.partes.map((p) => (
        <article className="mf-p" key={p.letra}>
          <h4><span className="mf-l" aria-hidden="true">{p.letra}</span>{p.titulo}</h4>
          <p>{conNegritas(p.texto)}</p>
        </article>
      ))}
    </div>
  );
}
