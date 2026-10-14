// PUERTAS DCUATES — entrada de NOSOTROS: ¿Cómo quieres participar hoy? Cada puerta abre su guía con su propio camino.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import BotonCompartir from "./BotonCompartir.jsx";
import CaminoDcuates from "./CaminoDcuates.jsx";
import { useAtras } from "./atras.js";
import { abrirDespues } from "./Extras.jsx";
import { ejecutar } from "./datos/secciones.js";
import { PUERTAS, PUERTAS_BASE, PUERTAS_MAS, puertaPorId } from "./datos/puertas.js";

const lee = (k, d = null) => { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } };
const guarda = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
// Orden de latido en el sentido de las manecillas del reloj: 2 columnas (celular) y 4 columnas (pantalla ancha)
const RANGO2 = [0, 1, 7, 2, 6, 3, 5, 4];
const RANGO4 = [0, 1, 2, 3, 7, 6, 5, 4];

function Guia({ p, onCerrar, onAbrirProyecto, modo, setModo }) {
  const m = p.modos[Math.min(modo, p.modos.length - 1)];
  const grupos = m.grupos || [];
  const des = m.desarrollo || p.desarrollo;
  const aviso = m.aviso || p.aviso;
  const ir = (a) => abrirDespues(onCerrar, () => ejecutar(a, onAbrirProyecto));
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label={p.titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja" style={{ "--pc": p.c }}>
        <div className="zj-cab"><b>{p.e} {p.titulo}</b>
          {!p.sensible && <BotonCompartir hash={"puerta-" + p.id} titulo={p.titulo + " — DCUATES"} texto={"Entra a DCUATES por tu puerta: " + p.titulo} variante="circulo" />}
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">{p.intro}</p>
        {p.modos.length > 1 && (
          <div className="pu-modos" role="tablist">
            {p.modos.map((x, i) => <button type="button" role="tab" aria-selected={i === modo} key={x.n} className={i === modo ? "pu-on" : ""} onClick={() => setModo(i)} style={i === modo ? { background: p.c } : { color: p.c, borderColor: p.c }}>{x.n}</button>)}
          </div>
        )}
        {m.vender && <p className="pu-nota">💡 {m.nota.replace("💡 ", "")}</p>}
        <p className="zj-et">🧭 Tu camino</p>
        <ol className="pu-pasos">
          {m.pasos.map(([e, t, d, a], i) => (
            <li key={t}><button type="button" onClick={() => ir(a)} style={{ borderColor: p.c }}>
              <span className="pu-n" style={{ color: p.c }}>PASO {i + 1}</span><span className="pu-pe">{e}</span><b>{t}</b><small>{d}</small></button></li>
          ))}
        </ol>
        {grupos.map(([titulo, items]) => (
          <div key={titulo}>
            <p className="zj-et">{titulo}</p>
            <div className="zj-col">{items.map(([t, a, c]) => <button type="button" key={t} style={{ background: c || p.c }} onClick={() => ir(a)}>{t}</button>)}</div>
          </div>
        ))}
        {des && des.length > 0 && <>
          <p className="zj-et">🚧 Ideas y proyectos en desarrollo</p>
          <div className="pu-des">{des.map(([e, t, d]) => <div className="ag-ev" key={t}><b>{e} {t}</b><p>{d}</p></div>)}</div>
          <div className="zj-col"><button type="button" onClick={() => ir({ chat: `¡Hola DCUATES! Me gustaría participar o proponer algo en «${p.titulo}»: ___` })} style={{ background: "#334155" }}>🙌 Quiero participar o proponer algo</button></div>
        </>}
        {aviso && <p className="pu-aviso">{aviso}</p>}
        {m.vender && <p className="pu-aviso">{m.nota}</p>}
        <p className="zj-et">¿Prefieres platicarlo?</p>
        <div className="zj-col"><button type="button" onClick={() => ir({ chat: `¡Hola DCUATES! Entré por la puerta «${p.titulo}» y me gustaría que me orienten. Mi nombre es: ___` })} style={{ background: "#25a244" }}>💬 Escríbenos por WhatsApp</button></div>
        <p className="pu-sig">{p.sensible ? "🔒 Esta puerta no guarda tu elección ni te pide datos." : "👣 Siguiente paso: toca el que dice «TE TOCA» en tu camino, en la página."}</p>
      </div>
    </div>
  );
}

export const abrirPuerta = (id) => window.dispatchEvent(new CustomEvent("dcuates:abrir-puerta", { detail: id }));
export const elegirPuerta = () => window.dispatchEvent(new CustomEvent("dcuates:elegir-puerta"));
const avisa = () => window.dispatchEvent(new CustomEvent("dcuates:puerta-cambio"));
const leerPuerta = () => { const id = lee("dc_puerta"); return id && puertaPorId(id) ? id : null; };
const leerModo = (id) => parseInt(lee("dc_modo_" + id, "0"), 10) || 0;
function usaPuerta() {
  const [, tic] = useState(0);
  useEffect(() => { const f = () => tic((x) => x + 1); window.addEventListener("dcuates:puerta-cambio", f); return () => window.removeEventListener("dcuates:puerta-cambio", f); }, []);
  return leerPuerta();
}

// Se monta UNA vez en App: abre la guía de cualquier puerta y el selector (desde cualquier sección).
export function PuertasHost({ onAbrirProyecto = () => {} }) {
  const [abierta, setAbierta] = useState(null);
  const [selector, setSelector] = useState(false);
  const [, tic] = useState(0);
  useAtras(!!abierta, () => setAbierta(null));
  useAtras(selector, () => setSelector(false));
  useEffect(() => {
    const h = () => { try { const m = window.location.hash.match(/^#puerta-([a-z]+)$/); if (m && puertaPorId(m[1])) setAbierta(m[1]); } catch (e) {} };
    h();
    const o = (e) => { const p = puertaPorId(e.detail); if (!p) return; if (!p.sensible && !p.efimera) { guarda("dc_puerta", p.id); avisa(); } setSelector(false); setAbierta(p.id); };
    const s = () => setSelector(true);
    window.addEventListener("hashchange", h); window.addEventListener("dcuates:abrir-puerta", o); window.addEventListener("dcuates:elegir-puerta", s);
    return () => { window.removeEventListener("hashchange", h); window.removeEventListener("dcuates:abrir-puerta", o); window.removeEventListener("dcuates:elegir-puerta", s); };
  }, []);
  const cerrarGuia = () => { setAbierta(null); try { if (/^#puerta-/.test(window.location.hash)) history.replaceState(null, "", window.location.pathname + window.location.search); } catch (e) {} };
  const p = abierta ? puertaPorId(abierta) : null;
  const lista = [...PUERTAS_BASE, "dificil", ...PUERTAS_MAS].map(puertaPorId);
  return (
    <>
      {p && createPortal(<Guia p={p} onCerrar={cerrarGuia} onAbrirProyecto={onAbrirProyecto} modo={Math.min(leerModo(p.id), p.modos.length - 1)} setModo={(i) => { guarda("dc_modo_" + p.id, String(i)); tic((x) => x + 1); avisa(); }} />, document.body)}
      {selector && createPortal(
        <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Elige tu puerta" onClick={(e) => { if (e.target === e.currentTarget) setSelector(false); }}>
          <div className="zj-caja">
            <div className="zj-cab"><b>🚪 ¿Cuál es tu puerta?</b><button type="button" className="zj-x" onClick={() => setSelector(false)} aria-label="Cerrar">✕</button></div>
            <p className="zj-p">Elige cómo quieres participar y te guiamos paso a paso. Puedes cambiarla cuando quieras.</p>
            <div className="zj-col">{lista.map((x) => <button type="button" key={x.id} style={{ background: x.c }} onClick={() => abrirPuerta(x.id)}>{x.e} {x.t}</button>)}
              <button type="button" style={{ background: "#BE185D" }} onClick={() => abrirPuerta("invitado")}>💌 Me invitaron</button></div>
          </div>
        </div>, document.body)}
    </>
  );
}

// Franja compacta para las demás secciones
export function PuertaFranja() {
  const id = usaPuerta();
  const p = id ? puertaPorId(id) : null;
  return (
    <section className="pf-sec" aria-label="Tu puerta">
      <style>{`.pf-sec{max-width:72rem;margin:10px auto 0;padding:8px 10px;border-radius:18px;background:var(--tc,#1B6F8A);border:2px solid rgba(255,255,255,.35);display:flex;align-items:center;gap:8px;color:#fff}.pf-e{font-size:24px;flex:none}.pf-t{flex:1;min-width:0;display:flex;flex-direction:column;font-size:12px;font-weight:800}.pf-t b{font-size:14px;font-weight:900;line-height:1.15}.pf-sec button{flex:none;min-height:40px;padding:4px 8px;border:2px solid #fff;border-radius:12px;background:rgba(255,255,255,.18);color:#fff;font-family:inherit;font-size:13px;font-weight:900;cursor:pointer}`}</style>
      <span className="pf-e">{p ? p.e : "🚪"}</span>
      <span className="pf-t">{p ? <><small>Tu puerta:</small><b>{p.t}</b></> : <b>¿Cuál es tu puerta?</b>}</span>
      {p && <button type="button" onClick={() => abrirPuerta(p.id)}>Mi guía</button>}
      <button type="button" onClick={elegirPuerta}>{p ? "Cambiar" : "Elígela"}</button>
    </section>
  );
}

export default function PuertasDcuates({ onAbrirProyecto = () => {} }) {
  const puerta = usaPuerta();
  const [cambiando, setCambiando] = useState(false);
  const [mas, setMas] = useState(false);
  const actual = puerta ? puertaPorId(puerta) : null;
  const colapsada = !!actual && !cambiando;
  const elegir = (id) => { setCambiando(false); abrirPuerta(id); };
  const botones = (ids, rango) => ids.map((id, i) => {
    const p = puertaPorId(id);
    return (
      <button type="button" key={id} className="pu-d" style={{ background: p.c }} onClick={() => elegir(id)}>
        <span className="pu-e" style={{ "--r": rango ? RANGO2[i] : 0, "--rd": rango ? RANGO4[i] : 0 }}>{p.e}</span>
        <b>{p.t}</b>
      </button>
    );
  });
  const dif = puertaPorId("dificil");
  const modoAct = actual ? Math.min(leerModo(actual.id), actual.modos.length - 1) : 0;
  return (
    <section className="pu-sec" id="camino-dcuates" aria-label="Elige tu puerta">
      {!colapsada && <>
        <p className="pu-q">¿Cómo quieres participar hoy?</p>
        <p className="pu-q2">Elige tu puerta y te guiamos paso a paso</p>
        <div className="pu-grid">{botones(PUERTAS_BASE, true)}</div>
        <button type="button" className="pu-dif" style={{ background: dif.c }} onClick={() => elegir("dificil")}>
          <span className="pu-e2">{dif.e}</span><span><b>{dif.t}</b><small>Siempre visible · sin pedir datos</small></span>
        </button>
        <button type="button" className="pu-mas" aria-expanded={mas} onClick={() => setMas((v) => !v)}>{mas ? "➖ Ver menos puertas" : "➕ VER 4 PUERTAS MÁS"}</button>
        {mas && <div className="pu-grid pu-grid2">{botones(PUERTAS_MAS, false)}</div>}
        <div className="pu-chips">
          <button type="button" onClick={() => ejecutar({ z: "info" }, onAbrirProyecto)}>🚨 Tengo una urgencia</button>
          <button type="button" onClick={() => ejecutar({ z: "empieza" }, onAbrirProyecto)}>👀 Solo vengo a conocer</button>
          <button type="button" onClick={() => elegir("invitado")}>💌 Me invitaron</button>
        </div>
      </>}
      {colapsada && <>
        <div className="pu-franja">
          <span className="pu-fe">{actual.e}</span>
          <span className="pu-ft"><small>Entraste como:</small><b>{actual.t}</b></span>
          <button type="button" onClick={() => abrirPuerta(actual.id)}>Mi guía</button>
          <button type="button" onClick={() => setCambiando(true)}>Cambiar</button>
        </div>
        <CaminoDcuates key={actual.id + modoAct} seccion={"p_" + actual.id + "_" + modoAct} pasos={actual.modos[modoAct].pasos} titulo={"TU CAMINO · " + actual.t.toUpperCase()} sinSoy menu={{}} onAbrirProyecto={onAbrirProyecto} />
        <button type="button" className="pu-ayuda" onClick={() => elegir("dificil")}>🤍 ¿Necesitas apoyo o quieres apoyar a alguien?</button>
      </>}
      <style>{`
.pu-sec{max-width:72rem;margin:12px auto 6px;padding:14px 12px 12px;border-radius:20px;background:var(--tc,#1B6F8A);border:2px solid rgba(255,255,255,.35);box-shadow:0 6px 16px rgba(0,0,0,.18);color:#fff}
.pu-q{margin:0;text-align:center;font-size:19px;font-weight:900;letter-spacing:.01em}
.pu-q2{margin:2px 0 10px;text-align:center;font-size:13px;font-weight:700;opacity:.95}
.pu-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.pu-grid2{margin-top:8px}
.pu-d{min-height:84px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:3px;padding:8px 10px;border:2px solid #fff;border-radius:16px;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}
.pu-d:active{filter:brightness(.92)}
.pu-d b{font-size:14.5px;font-weight:900;line-height:1.12;color:#fff}
.pu-e{display:inline-block;font-size:28px;line-height:1.1;animation:pu-latido 4.8s ease-in-out infinite;animation-delay:calc(var(--r) * .6s)}
@keyframes pu-latido{0%{transform:scale(1);filter:none}4%{transform:scale(1.45);filter:drop-shadow(0 0 7px #ffd84d)}12%{transform:scale(1);filter:none}100%{transform:scale(1);filter:none}}
.pu-dif{width:100%;margin-top:8px;display:flex;align-items:center;gap:10px;min-height:64px;padding:8px 12px;border:2px solid #fff;border-radius:16px;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}
.pu-dif b{display:block;font-size:14.5px;font-weight:900;line-height:1.15;color:#fff}
.pu-dif small{display:block;margin-top:2px;font-size:12px;font-weight:700;opacity:.95}
.pu-e2{font-size:28px;flex:none}
.pu-mas{width:100%;margin-top:10px;min-height:50px;border:2px solid #fff;border-radius:16px;background:#F5C518;color:#111;font-family:inherit;font-size:15px;font-weight:900;letter-spacing:.03em;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}
.pu-franja{display:flex;align-items:center;gap:8px;padding:8px 10px;border:2px solid rgba(255,255,255,.85);border-radius:16px}
.pu-fe{font-size:26px;flex:none}
.pu-ft{flex:1;min-width:0;display:flex;flex-direction:column}
.pu-ft small{font-size:11.5px;font-weight:800;opacity:.9}
.pu-ft b{font-size:14px;font-weight:900;line-height:1.15;color:#fff}
.pu-franja button{flex:none;min-height:40px;padding:4px 10px;border:2px solid #fff;border-radius:12px;background:rgba(255,255,255,.18);color:#fff;font-family:inherit;font-size:13px;font-weight:900;cursor:pointer}
.pu-sec .cm-sec{margin:10px 0 0;padding:10px 0 4px;background:transparent;border:0;box-shadow:none}
.pu-ayuda{width:100%;margin-top:8px;min-height:44px;border:2px solid rgba(255,255,255,.8);border-radius:14px;background:transparent;color:#fff;font-family:inherit;font-size:13.5px;font-weight:900;cursor:pointer}
.pu-modos{display:flex;gap:6px;margin:2px 0 4px}
.pu-modos button{flex:1;min-height:46px;padding:4px 6px;border:2px solid;border-radius:14px;background:#fff;font-family:inherit;font-size:14px;font-weight:900;line-height:1.1;cursor:pointer}
.pu-modos .pu-on{color:#fff!important}
.pu-pasos{list-style:none;margin:0 0 4px;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.pu-pasos button{width:100%;height:100%;min-height:104px;display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:8px 9px;border:2px solid;border-left-width:7px;border-radius:14px;background:#fff;font-family:inherit;color:#1f2a37;text-align:left;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.15)}
.pu-n{font-size:11px;font-weight:900;letter-spacing:.06em}
.pu-pe{font-size:24px;line-height:1.1}
.pu-pasos b{font-size:13.5px;font-weight:900;line-height:1.1}
.pu-pasos small{font-size:11.5px;font-weight:700;line-height:1.15;color:#4a5564}
.pu-nota,.pu-aviso{margin:8px 2px;padding:8px 10px;border-radius:12px;background:#fff4d6;font-size:12.5px;font-weight:700;line-height:1.35;color:#5b4300}
.pu-des{display:flex;flex-direction:column;gap:6px}
.pu-sig{margin:12px 2px 0;font-size:12.5px;font-weight:700;color:#6b7785;text-align:center}
@media(min-width:640px){.pu-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.pu-e{animation-delay:calc(var(--rd) * .6s)}.pu-pasos{grid-template-columns:repeat(4,minmax(0,1fr))}}

.pu-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.pu-chips button{flex:1 1 auto;min-height:42px;padding:4px 10px;border:2px solid rgba(255,255,255,.85);border-radius:999px;background:rgba(255,255,255,.16);color:#fff;font-family:inherit;font-size:13px;font-weight:900;cursor:pointer}
`}</style>
    </section>
  );
}
