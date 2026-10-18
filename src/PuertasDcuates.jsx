// PUERTAS DCUATES — entrada de NOSOTROS: ¿Cómo quieres participar hoy? Cada puerta abre su guía con su propio camino.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import BotonCompartir from "./BotonCompartir.jsx";
import CaminoDcuates from "./CaminoDcuates.jsx";
import { useAtras } from "./atras.js";
import { abrirDespues } from "./Extras.jsx";
import { abrirAcceso } from "./Tablero.jsx";
import HoyDcuates from "./HoyDcuates.jsx";
import InstalarApp from "./InstalarApp.jsx";
import { BotonPlus } from "./AgendaPlus.jsx";
import { OpcionesLeer } from "./accesibilidad.jsx";
import { ciclarLetra, leerLetra, NOMBRES_LETRA } from "./tamanoLetra.js";
import { ejecutar } from "./datos/secciones.js";
import { PUERTAS, PUERTAS_BASE, PUERTAS_MAS, puertaPorId } from "./datos/puertas.js";

const lee = (k, d = null) => { try { return localStorage.getItem(k) ?? d; } catch (e) { return d; } };
const guarda = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
// Orden de latido en el sentido de las manecillas del reloj: 2 columnas (celular) y 4 columnas (pantalla ancha)
const RANGO2 = [0, 1, 7, 2, 6, 3, 5, 4];
const RANGO4 = [0, 1, 2, 3, 7, 6, 5, 4];

// Acciones que llevan a un punto de la PÁGINA cierran la ventana; las que abren otra ventana la dejan debajo
// (se oculta y reaparece al cerrar la nueva, así se regresa al punto de partida).
export const lanza = (a, cerrar, onAbrirProyecto) => {
  if (a && (a.sec || a.scroll)) abrirDespues(cerrar, () => ejecutar(a, onAbrirProyecto));
  else ejecutar(a, onAbrirProyecto);
};

function Guia({ p, onCerrar, onAbrirProyecto, modo, setModo }) {
  const m = p.modos[Math.min(modo, p.modos.length - 1)];
  const grupos = m.grupos || [];
  const des = m.desarrollo || p.desarrollo;
  const aviso = m.aviso || p.aviso;
  const oculta = useAtras(true, onCerrar, { hub: true });
  const ir = (a) => lanza(a, onCerrar, onAbrirProyecto);
  return (
    <div className="zj-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={p.titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
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
        <p className="pu-sig">{p.sensible ? "🔒 Esta puerta no guarda tu elección ni te pide datos." : "↩ Al cerrar lo que abras, regresas aquí, a tu puerta."}</p>
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

// Ventana base de la ENTRADA (HOY, EXPLORA): se oculta mientras se abre otra encima y reaparece al cerrarla.
function VentanaEntrada({ titulo, onCerrar, hash, texto, children }) {
  const oculta = useAtras(true, onCerrar, { hub: true });
  return (
    <div className="zj-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>{titulo}</b>
          <BotonCompartir hash={hash} titulo={titulo + " — DCUATES"} texto={texto} variante="circulo" />
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        {children}
      </div>
    </div>
  );
}

function Selector({ onCerrar, onAbrirProyecto }) {
  const oculta = useAtras(true, onCerrar, { hub: true });
  const actual = leerPuerta();
  const lista = [...PUERTAS_BASE, "dificil", ...PUERTAS_MAS].map(puertaPorId);
  return (
    <div className="zj-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Puertas" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🚪 Puertas</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Elige cómo quieres participar y te guiamos paso a paso. Puedes cambiarla cuando quieras.</p>
        <div className="pu-chips pu-chips2">
          <button type="button" onClick={() => lanza({ z: "empieza" }, onCerrar, onAbrirProyecto)}>👀 Solo vengo a conocer</button>
          <button type="button" onClick={() => abrirPuerta("invitado")}>💌 Me invitaron</button>
        </div>
        <div className="zj-col">
          {lista.map((x) => <button type="button" key={x.id} style={{ background: x.c }} onClick={() => abrirPuerta(x.id)}>{x.e} {x.t}{actual === x.id ? "  ✅ tu puerta" : ""}</button>)}
          <button type="button" style={{ background: "#1B6F8A" }} onClick={() => lanza({ tablero: "conoce" }, onCerrar, onAbrirProyecto)}>📚 Proyectos de DCUATES</button>
          <button type="button" style={{ background: "#334155" }} onClick={onCerrar}>🌐 Ir a la página (sin elegir puerta)</button>
        </div>
        <p className="pu-sig">↩ Al cerrar una puerta regresas aquí, a la lista de puertas.</p>
      </div>
    </div>
  );
}

// Se monta UNA vez en App: abre la guía de cualquier puerta y la lista de puertas (desde cualquier sección).
export function PuertasHost({ onAbrirProyecto = () => {} }) {
  const [abierta, setAbierta] = useState(null);
  const [selector, setSelector] = useState(false);
  const [, tic] = useState(0);
  useEffect(() => {
    const h = () => { try { const m = window.location.hash.match(/^#puerta-([a-z]+)$/); if (m && puertaPorId(m[1])) setAbierta(m[1]); } catch (e) {} };
    h();
    const o = (e) => { const p = puertaPorId(e.detail); if (!p) return; if (!p.sensible && !p.efimera) { guarda("dc_puerta", p.id); avisa(); } setAbierta(p.id); };
    const s = () => setSelector(true);
    window.addEventListener("hashchange", h); window.addEventListener("dcuates:abrir-puerta", o); window.addEventListener("dcuates:elegir-puerta", s);
    return () => { window.removeEventListener("hashchange", h); window.removeEventListener("dcuates:abrir-puerta", o); window.removeEventListener("dcuates:elegir-puerta", s); };
  }, []);
  const cerrarGuia = () => { setAbierta(null); try { if (/^#puerta-/.test(window.location.hash)) history.replaceState(null, "", window.location.pathname + window.location.search); } catch (e) {} };
  const p = abierta ? puertaPorId(abierta) : null;
  return (
    <>
      {selector && createPortal(<Selector onCerrar={() => setSelector(false)} onAbrirProyecto={onAbrirProyecto} />, document.body)}
      {p && createPortal(<Guia key={p.id} p={p} onCerrar={cerrarGuia} onAbrirProyecto={onAbrirProyecto} modo={Math.min(leerModo(p.id), p.modos.length - 1)} setModo={(i) => { guarda("dc_modo_" + p.id, String(i)); tic((x) => x + 1); avisa(); }} />, document.body)}
    </>
  );
}

// Franja compacta para las demás secciones
export const abrirTour = () => window.dispatchEvent(new CustomEvent("dcuates:bienvenida"));
export function PuertaFranja() {
  const id = usaPuerta();
  const p = id ? puertaPorId(id) : null;
  return (
    <section className="pf-sec" aria-label="Tu puerta">
      <style>{`.pf-sec{max-width:72rem;margin:10px auto 0;padding:8px 10px;border-radius:18px;background:var(--tc,#1B6F8A);border:2px solid rgba(255,255,255,.35);display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:#fff}.pf-e{font-size:24px;flex:none}.pf-t{flex:1;min-width:0;display:flex;flex-direction:column;font-size:12px;font-weight:800}.pf-t b{font-size:14px;font-weight:900;line-height:1.15}.pf-sec .pf-tour{flex:1 1 100%;font-size:12.5px;min-height:36px}.pf-sec button{flex:none;min-height:40px;padding:4px 8px;border:2px solid #fff;border-radius:12px;background:rgba(255,255,255,.18);color:#fff;font-family:inherit;font-size:13px;font-weight:900;cursor:pointer}`}</style>
      <span className="pf-e">{p ? p.e : "🚪"}</span>
      <span className="pf-t">{p ? <><small>Tu puerta:</small><b>{p.t}</b></> : <b>¿Cuál es tu puerta?</b>}</span>
      {p && <button type="button" onClick={() => abrirPuerta(p.id)}>Mi guía</button>}
      <button type="button" onClick={elegirPuerta}>{p ? "Cambiar" : "Elígela"}</button>
      <button type="button" className="pf-tour" onClick={abrirTour}>🧭 TOUR DCUATES · recuerda cómo moverte</button>
    </section>
  );
}

// ENTRADA de NOSOTROS: 4 botones (Puertas · Hoy · Regístrate · Explora) + apoyo/urgencia
const RANGO_E = [0, 1, 3, 2]; // latido en el sentido de las manecillas en la cuadrícula 2×2
const EXPLORA = [
  ["Conoce todo DCUATES", [["🧭 Proyectos y Mapa del sitio", { acc: "mapa" }], ["🎁 Beneficios (Para ti)", { acc: "beneficios" }], ["🗺️ Negocios y mapa", { sec: "negocios" }]]],
  ["Participa y gana", [["🎮 Juegos y Semillas", { z: "juegos" }], ["🏆 Gana cupones", { z: "gana" }], ["💡 Recomienda y propón", { z: "propon" }], ["🛍️ Compra, vende y dona con causa", { z: "causa" }]]],
  ["Servicios, logros y agenda", [["💼 Servicios y promociones especiales", { serv: 1 }], ["🏆 Sé parte de nuestros logros", { logros: 1 }], ["➕ AGENDA PLUS (mapas, tablero, directorio)", { plus: 1 }], ["📅 Agenda, clima y recordatorios", { z: "info:agenda" }], ["📌 Info clave y teléfonos", { z: "info" }], ["💚 Apoyo psicológico gratuito", { apoyo: 1 }]]],
  ["Confianza y ayuda", [["🌟 Zona de aliados", { aliados: 1 }], ["🛡️ Escudo de seguridad", { legal: "escudo" }], ["❓ Preguntas frecuentes", { faq: 1 }], ["🧭 Tour DCUATES (ver otra vez)", { bienvenida: 1 }]]]
];
const COLOR_E = ["#2E9E5B", "#E5484D", "#C2410C", "#7a5ad8"];

// Botón A+ : cambia el tamaño de la letra (Normal → Grande → Muy grande)
function usaLetra() {
  const [n, set] = useState(leerLetra());
  useEffect(() => { const f = () => set(leerLetra()); window.addEventListener("dcuates:letra", f); return () => window.removeEventListener("dcuates:letra", f); }, []);
  return n;
}
function BotonLetra() {
  const n = usaLetra();
  return <button type="button" className="en-letra" onClick={ciclarLetra} aria-label={"Tamaño de letra: " + NOMBRES_LETRA[n] + ". Toca para cambiar"} title="Tamaño de letra">{n === 0 ? "A+" : n === 1 ? "A++" : "A−"}</button>;
}
function BotonLetraLista() {
  const n = usaLetra();
  return <div className="zj-col"><button type="button" style={{ background: "#334155" }} onClick={ciclarLetra}>🔠 Tamaño de letra: {NOMBRES_LETRA[n]} (toca para cambiar)</button></div>;
}

export default function EntradaDcuates({ onAbrirProyecto = () => {}, agenda = [], filasZona = [], negocios = [] }) {
  const puerta = usaPuerta();
  const actual = puerta ? puertaPorId(puerta) : null;
  const [ven, setVen] = useState(null); // "hoy" | "explora"
  const modoAct = actual ? Math.min(leerModo(actual.id), actual.modos.length - 1) : 0;
  const dif = puertaPorId("dificil");
  const T = [
    ["🚪", "PUERTAS", actual ? "Entraste como: " + actual.t : "Elige cómo participar", elegirPuerta],
    ["☀️", "HOY", "Lo de la semana y el próximo evento", () => setVen("hoy")],
    ["📝", "REGÍSTRATE", "Pide o suma", () => abrirAcceso("registros")],
    ["🧭", "EXPLORA", "Proyectos, juegos, servicios y más", () => setVen("explora")]
  ];
  return (
    <section className="pu-sec" id="camino-dcuates" aria-label="Tu entrada a DCUATES">
      <h2 className="en-tit">TU ENTRADA A DCUATES</h2>
      <BotonLetra />
      <p className="pu-q2">¿Por dónde quieres empezar hoy?</p>
      <div className="pu-grid">
        {T.map(([e, t, s, f], i) => (
          <button type="button" key={t} className="pu-d en-d" style={{ background: COLOR_E[i] }} onClick={f}>
            <span className="pu-e" style={{ "--r": RANGO_E[i], "--rd": RANGO_E[i] }}>{e}</span>
            <b>{t}</b><small>{s}</small>
          </button>
        ))}
      </div>
      <button type="button" className="pu-dif" style={{ background: dif.c }} onClick={() => abrirPuerta("dificil")}>
        <span className="pu-e2">{dif.e}</span><span><b>¿Necesitas apoyo o tienes una urgencia?</b><small>Sin pedir datos · aquí te orientamos</small></span>
      </button>
      <button type="button" className="pu-dif" style={{ background: "#0f4c5c", minHeight: 48 }} onClick={abrirTour}>
        <span className="pu-e2">🧭</span><span><b>TOUR DCUATES</b><small>Recuerda cómo moverte por la página</small></span>
      </button>
      {actual && <CaminoDcuates key={actual.id + modoAct} compacto seccion={"p_" + actual.id + "_" + modoAct} pasos={actual.modos[modoAct].pasos} titulo={"TU CAMINO · " + actual.t.toUpperCase()} sinSoy menu={{}} onAbrirProyecto={onAbrirProyecto} />}
      <BotonPlus />
      <InstalarApp />
      {ven === "hoy" && createPortal(
        <VentanaEntrada titulo="☀️ Hoy en DCUATES" hash="hoy" texto="Lo que pasa hoy y esta semana en DCUATES" onCerrar={() => setVen(null)}>
          <div style={{ "--tc": "#1B6F8A" }}><HoyDcuates fijo seccion="nosotros" agenda={agenda} filasZona={filasZona} negocios={negocios} onAbrirProyecto={onAbrirProyecto} /></div>
        </VentanaEntrada>, document.body)}
      {ven === "explora" && createPortal(
        <VentanaEntrada titulo="🧭 Explora DCUATES" hash="explora" texto="Proyectos, juegos, servicios y todo lo que hay en DCUATES" onCerrar={() => setVen(null)}>
          <p className="zj-p">Todo lo que hay en DCUATES, en un solo lugar. Al cerrar lo que abras, regresas aquí.</p>
          {EXPLORA.map(([titulo, items], gi) => (
            <div key={titulo}>
              <p className="zj-et">{titulo}</p>
              <div className="zj-col">{items.map(([t, a]) => <button type="button" key={t} style={{ background: COLOR_E[(gi + 1) % 4] }} onClick={() => lanza(a, () => setVen(null), onAbrirProyecto)}>{t}</button>)}</div>
            </div>
          ))}
          <p className="zj-et">Para leer mejor</p>
          <OpcionesLeer />
        </VentanaEntrada>, document.body)}
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

.en-letra{position:absolute;top:10px;right:10px;min-width:40px;height:34px;padding:0 8px;border:2px solid #fff;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;font-family:inherit;font-size:14px;font-weight:900;cursor:pointer}
.pu-sec{position:relative}
.en-tit{margin:0 44px;text-align:center;font-size:19px;font-weight:900;letter-spacing:.03em;color:#fff}
.en-d{min-height:104px}
.dc-letra-xl .pu-grid{grid-template-columns:1fr}
.dc-letra-xl .en-d b{font-size:15px}
.en-d small{font-size:11.5px;font-weight:700;line-height:1.15;opacity:.95;color:#fff}
.en-d b{font-size:16px;letter-spacing:.02em}
.pu-chips2{margin:0 0 6px}
.pu-chips2 button{background:#f0e9ff;border-color:#7a5ad8;color:#3b2a7a}
`}</style>
    </section>
  );
}
