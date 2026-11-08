// GRATITUD en DOS ventanas festivas y compactas (e70), como «Lo que compartimos»:
//   1) «Gracias y reconocimientos» → las formas de REGISTRAR (dar las gracias, proponer un reconocimiento, mencionar a alguien) + ejemplos.
//   2) «Muro de gratitud»          → el MURO como tal: lo que la comunidad ya publicó.
// Se abren con el evento dcuates:abrir-gratitud ("registrar" | "muro"), o con abrirGratitud("registrar"|"muro").
// El Muro sigue leyendo tu hoja de Google (pestaña «Registros»: Sección «Muro de gratitud», Permiso = Sí y ¿Publicar? = Sí)
// y, opcionalmente, las columnas MURO … de Baserow. Nada de esto cambió en las hojas.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { cargarPublicados } from "./utilidades/hojaPublica.js";
import { AGRADECIMIENTOS, EJEMPLOS_GRACIAS, EJEMPLOS_RECONOCIMIENTOS, SECCION_MURO } from "./datos/gratitud.js";

export const abrirGratitud = (cual = "registrar") => window.dispatchEvent(new CustomEvent("dcuates:abrir-gratitud", { detail: cual }));
const COLORES = ["#FFF4D6", "#FDE8F1", "#E3F3E9", "#E6F0FA", "#F3EFFF"];
const aprobado = (v) => v === true || /^(true|s[ií]|1|x)$/i.test(String(v || "").trim());

function Registrar({ cerrar }) {
  const [ej, setEj] = useState(false);
  const ir = (q, extra = {}) => { abrirRegistroPrevio("gratitud", { valores: { q }, ...extra }); };
  return (
    <>
      <p className="gv-i">Cuéntanos a quién quieres agradecer o reconocer. Lo revisamos y, si nos autorizas, lo publicamos en el Muro, sin tu teléfono.</p>
      <div className="gv-acc">
        <button type="button" data-testid="gr-gracias" onClick={() => { registrar("gratitud_gracias"); ir("Dar las gracias a alguien"); }}>💛 Dar las gracias</button>
        <button type="button" data-testid="gr-reconocer" className="gv-r" onClick={() => { registrar("gratitud_reconocer"); ir("Proponer un reconocimiento"); }}>🏆 Proponer un reconocimiento</button>
      </div>
      <button type="button" className="gv-link" aria-expanded={ej} data-testid="gr-ejemplos-btn" onClick={() => { registrar("muro_ejemplos"); setEj((v) => !v); }}>{ej ? "Ocultar ejemplos" : "👀 Ver ejemplos"}</button>
      {ej && (
        <div className="gv-ej" data-testid="muro-ejemplos">
          <p><b>Reconocimientos que podemos entregar:</b></p>
          <ul>{EJEMPLOS_RECONOCIMIENTOS.map((x) => <li key={x}>{x}</li>)}</ul>
          <p><b>Ejemplos de «gracias»:</b></p>
          <ul>{EJEMPLOS_GRACIAS.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
      <h4 className="gv-h">🎈 Menciona a alguien en particular</h4>
      <div className="gv-chips" data-testid="gr-generales">
        {AGRADECIMIENTOS.map((g, i) => (
          <button key={g.id} type="button" className="gv-chip" style={{ background: COLORES[i % COLORES.length] }} onClick={() => { registrar("muro_mencion_abrir", { g: g.id }); abrirRegistroPrevio("gratitud", { perfil: g.perfil, valores: { q: "Dar las gracias a alguien" } }); }}>
            <span aria-hidden="true">{g.ico}</span><span>{g.t}</span>
          </button>
        ))}
      </div>
      <button type="button" className="gv-link" onClick={() => { cerrar(); setTimeout(() => abrirGratitud("muro"), 150); }}>🗣️ Ir al Muro de gratitud</button>
    </>
  );
}

function Muro({ filas, cerrar }) {
  const [hoja, setHoja] = useState(null);
  useEffect(() => { let vivo = true; cargarPublicados().then((l) => { if (vivo) setHoja((l || []).filter((x) => x.sec === SECCION_MURO)); }); return () => { vivo = false; }; }, []);
  const usaAprob = filas.some((f) => f && Object.prototype.hasOwnProperty.call(f, "MURO APROBADO"));
  const deBaserow = filas.filter((f) => f && f["MURO MENSAJE"] && String(f["MURO MENSAJE"]).trim() !== "" && (!usaAprob || aprobado(f["MURO APROBADO"])))
    .map((f) => ({ msg: String(f["MURO MENSAJE"]).trim(), de: (f["MURO DE"] && String(f["MURO DE"]).trim()) || "Alguien de la comunidad", para: (f["MURO PARA"] && String(f["MURO PARA"]).trim()) || "", tipo: "" }));
  const deHoja = (hoja || []).map((x) => ({ msg: x.d || "", de: x.f || "Alguien de la comunidad", para: x.t || "", tipo: x.cat || "" })).filter((m) => m.msg);
  const lista = [...deHoja, ...deBaserow].slice(0, 30);
  const wa = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent("¡Hola DCUATES! Quiero dejar un mensaje de gratitud en el Muro.\n\nPara: \nMensaje: \nMi nombre (o ‘anónimo’): ");
  return (
    <>
      <p className="gv-i">Lo que la comunidad agradece y reconoce. Revisamos cada mensaje antes de publicarlo.</p>
      {hoja === null && deBaserow.length === 0 ? <p className="gv-v">Cargando…</p> : lista.length === 0 ? (
        <p className="gv-v" data-testid="muro-vacio">Aquí aparecerán los gracias y reconocimientos de la comunidad. ¡Sé la primera persona en dejar el tuyo! 💛</p>
      ) : (
        <ul className="gv-lista" data-testid="muro-lista">
          {lista.map((m, i) => (
            <li key={i} className="gv-n" style={{ background: COLORES[i % COLORES.length] }}>
              {m.tipo ? <small className="gv-tipo">🏅 {m.tipo}</small> : null}
              <p>“{m.msg}”</p>
              <small>{m.para ? `Para ${m.para} · ` : ""}De {m.de}</small>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="gv-b" data-testid="muro-dejar" onClick={() => { registrar("muro_dejar_mensaje"); abrirRegistroPrevio("gratitud"); }}>💛 Deja un gracias o propón un reconocimiento</button>
      <small className="gv-nota">¿Prefieres escribirnos directo? <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => registrar("muro_dejar_wa")}>Por WhatsApp</a></small>
    </>
  );
}

export default function GratitudVentanas({ filas = [] }) {
  const [cual, setCual] = useState("");
  const cerrar = () => setCual("");
  const oculta = useAtras(!!cual, cerrar, { hub: true });
  useEffect(() => {
    const abre = (e) => { setCual(e.detail === "muro" ? "muro" : "registrar"); registrar("gratitud_ventana", { v: e.detail }); };
    window.addEventListener("dcuates:abrir-gratitud", abre);
    return () => window.removeEventListener("dcuates:abrir-gratitud", abre);
  }, []);
  if (!cual) return null;
  const esMuro = cual === "muro";
  const titulo = esMuro ? "Muro de gratitud" : "Gracias y reconocimientos";
  return createPortal(
    <div className="gv-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      <div className="gv-caja" data-testid={esMuro ? "ventana-muro" : "ventana-registrar"}>
        <div className="gv-cab">
          <b>{esMuro ? "🗣️" : "💛"} {titulo}</b>
          <BotonCompartir hash={esMuro ? "muro-gratitud" : "gratitud"} titulo={titulo + " — DCUATES"} texto="Gratitud en DCUATES" variante="circulo" />
          <button type="button" className="gv-x" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="gv-guirnalda" aria-hidden="true">🎉 🎈 💛 🌟 🎊 🎈 💛 🎉</div>
        {esMuro ? <Muro filas={filas} cerrar={cerrar} /> : <Registrar cerrar={cerrar} />}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.gv-fondo{position:fixed;inset:0;z-index:94;background:rgba(40,20,40,.62);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.gv-caja{background:#fffaf0 radial-gradient(circle at 12% 8%,#ffe3f0 0 3px,transparent 4px) 0 0/46px 46px;width:100%;max-width:560px;max-height:92dvh;overflow-y:auto;overscroll-behavior:contain;border-radius:24px 24px 0 0;padding:0 12px 22px;color:#0f2d1e}
@media(min-width:640px){.gv-fondo{align-items:center}.gv-caja{border-radius:22px;max-height:86dvh}}
.gv-cab{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#B7791F,#D9468F);color:#fff;margin:0 -12px 0;padding:12px;border-radius:24px 24px 0 0}
.gv-cab b{flex:1;font-size:18px;font-weight:900}
.gv-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#B7791F;font-size:20px;font-weight:900;cursor:pointer}
.gv-guirnalda{text-align:center;font-size:17px;letter-spacing:2px;margin:0 -12px 8px;padding:4px 0;background:#fff0c9;overflow:hidden;white-space:nowrap}
.gv-i{margin:0 0 8px;font-size:14px;font-weight:700;line-height:1.35}
.gv-acc{display:grid;gap:8px;margin-bottom:6px}
.gv-acc button,.gv-b{min-height:48px;border:0;border-radius:14px;background:#B7791F;color:#fff;font:inherit;font-weight:900;font-size:15px;cursor:pointer;padding:8px 12px;line-height:1.2;width:100%}
.gv-acc .gv-r{background:#D9468F}
.gv-link{display:block;margin:6px auto;min-height:44px;padding:0 14px;border-radius:999px;border:2px solid #B7791F;background:#fff;color:#8a5a0c;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.gv-ej{margin:0 0 8px;padding:8px 12px;background:#FFF4D6;border-radius:12px}
.gv-ej p{margin:4px 0;font-size:14px}.gv-ej ul{margin:0 0 4px;padding-left:18px}.gv-ej li{font-size:13.5px;font-weight:700;line-height:1.35;margin:2px 0;color:#2f4d3f}
.gv-h{margin:10px 0 6px;font-size:15.5px;font-weight:900}
.gv-chips{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}
.gv-chip{display:flex;align-items:center;gap:6px;min-height:52px;padding:6px 8px;border:0;border-radius:12px;font:inherit;font-size:12.5px;font-weight:800;line-height:1.2;text-align:left;color:#0f2d1e;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.12)}
.gv-chip span:first-child{font-size:20px}
.gv-v{text-align:center;font-weight:800;font-size:14px;padding:18px 8px;border:2px dashed #D9468F;border-radius:14px;background:#fff0f7;margin:0 0 10px}
.gv-lista{list-style:none;margin:0 0 10px;padding:0;display:grid;gap:8px}
.gv-n{border-radius:14px;padding:9px 12px;box-shadow:0 1px 4px rgba(0,0,0,.12)}
.gv-n p{margin:0 0 3px;font-size:15px;font-weight:800;line-height:1.35}
.gv-n small{font-size:13px;font-weight:800;color:#5a4a16}.gv-tipo{display:block;margin-bottom:2px}
.gv-nota{display:block;text-align:center;margin-top:8px;font-weight:700;color:#5b6b62}.gv-nota a{color:#128c7e;font-weight:900}
`;
