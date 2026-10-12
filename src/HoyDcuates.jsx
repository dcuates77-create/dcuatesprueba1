// HOY EN DCUATES — panel que une la página: reto del día, próximo evento, una necesidad abierta y "Seguías en…".
// También exporta QueSigue (pie "Tu siguiente paso" dentro de cada ventana de proyecto).
import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { useAtras } from "./atras.js";
import { identidad } from "./datos/identidad.js";
import { RETOS_DIA, NECESIDADES_BASE, retosDesdeZona, necesidadesDesdeZona, agendaDesdeZona } from "./datos/zona.js";

const baja = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const abrirZona = (id) => window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: id }));
const hoyLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function guardarUltimo(t, id, n) { try { localStorage.setItem("dc_ultimo", JSON.stringify({ t, id, n })); } catch (e) {} try { window.dispatchEvent(new Event("dcuates:ultimo")); } catch (e) {} }
const leerUltimo = () => { try { return JSON.parse(localStorage.getItem("dc_ultimo") || "null"); } catch (e) { return null; } };

export const NOMBRE_ZONA = { empieza: "👋 Empieza aquí", juegos: "🎉 Juega y diviértete", aprende: "🧠 Juega y aprende", gana: "🏆 Juega y gana", propon: "💡 Recomienda y gana", causa: "🛍️ Dona, compra y vende con causa", info: "📌 Info clave" };

const CICLO = ["libros", "asesorias", "bienestar", "noticias", "recomienda-evalua-gana", "circulo-confianza", "alianzas-tarjeta", "publicidad-tarjeta", "bazares", "ventas-con-causa", "ecatepets", "donaciones"];

export function QueSigue({ id, onIr, onCerrar }) {
  const i = CICLO.indexOf(id);
  const sig = i >= 0 ? identidad(CICLO[(i + 1) % CICLO.length]) : null;
  return (
    <div className="hy-sigue">
      <p>Tu siguiente paso</p>
      {sig && <button type="button" style={{ background: sig.color }} onClick={() => onIr(CICLO[(i + 1) % CICLO.length])}>{sig.emoji} Conoce: {sig.nombre} ›</button>}
      <button type="button" style={{ background: "#E5484D" }} onClick={() => { onCerrar(); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-tablero", { detail: "participa" })), 120); }}>🎮 Participa: juega y gana en la Zona pública ›</button>
    </div>
  );
}

export default function HoyDcuates({ agenda = [], filasZona = [], onAbrirProyecto = () => {} }) {
  const hoy = hoyLocal();
  const dia = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const retos = useMemo(() => { const r = retosDesdeZona(filasZona); return r.length ? r : RETOS_DIA; }, [filasZona]);
  const reto = retos[dia % retos.length];
  let hecho = false; try { hecho = localStorage.getItem("dc_reto") === hoy; } catch (e) {}
  const evento = useMemo(() => [...agenda, ...agendaDesdeZona(filasZona)].filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))[0], [agenda, filasZona, hoy]);
  const necesidades = useMemo(() => { const z = necesidadesDesdeZona(filasZona); return z.length ? z : NECESIDADES_BASE; }, [filasZona]);
  const nec = necesidades.length ? necesidades[dia % necesidades.length] : null;
  const fechaTxt = (f) => { const [, m, d] = f.split("-"); return `${Number(d)} ${MESES[Number(m) - 1]}`; };
  const [servicios, setServicios] = useState(false);
  useAtras(servicios, () => setServicios(false));
  const SERV = [
    ["🎯", "Coaching personal y de equipos"],
    ["📈", "Consultoría y asesoría de negocios"],
    ["🏫", "Asesoría a organizaciones educativas"],
    ["🏢", "Acompañamiento a empresas y organizaciones privadas"],
    ["🏛️", "Apoyo a instituciones de gobierno"],
    ["🏷️", "Promociones especiales para la comunidad"]
  ];
  const wa = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Hola, me interesa recibir informes de los servicios y promociones especiales de DCUATES (coaching, consultoría y asesoría). Mi nombre es: ___ · Me interesa para: ___")}`;
  return (
    <section className="hy-sec" id="hoy-dcuates" aria-label="Hoy en DCUATES">
      <span className="hy-comp"><BotonCompartir hash="hoy-dcuates" titulo="Hoy en DCUATES" texto="El reto del día, los eventos y lo que se necesita hoy en la comunidad" variante="claro" /></span>
      <h2 className="hy-tit">☀️ HOY EN DCUATES</h2>
      <div className="hy-grid">
        <button type="button" className="hy-c" style={{ "--c": "#2E9E5B" }} onClick={() => abrirZona("empieza")}>
          <span className="hy-e pz-e" style={{ "--d": "2.4s", "--dd": "2.4s" }}>🎯</span><small>RETO DEL DÍA {hecho ? "· ✅ cumplido" : ""}</small><b>{reto}</b>
        </button>
        <button type="button" className="hy-c" style={{ "--c": "#1B6F8A" }} onClick={() => abrirZona("info")}>
          <span className="hy-e pz-e" style={{ "--d": "3s", "--dd": "3s" }}>📅</span>
          <small>{evento ? `PRÓXIMO EVENTO · ${fechaTxt(evento.fecha)}` : "AGENDA"}</small><b>{evento ? evento.titulo : "Mira lo que viene en la comunidad"}</b>
        </button>
        <button type="button" className="hy-c" style={{ "--c": nec ? identidad(nec.proyecto).color : "#E5484D" }} onClick={() => (nec && nec.proyecto && identidad(nec.proyecto).nombre !== "DCUATES" ? onAbrirProyecto(nec.proyecto) : abrirZona("causa"))}>
          <span className="hy-e pz-e" style={{ "--d": "4.2s", "--dd": "3.6s" }}>{nec ? nec.emoji : "🎁"}</span><small>SE NECESITA HOY</small><b>{nec ? nec.titulo : "Mira cómo ayudar"}</b>
          <em className="hy-sub">También: croquetas, difusión y…</em>
        </button>
        <button type="button" className="hy-c" style={{ "--c": "#7a5ad8" }} onClick={() => setServicios(true)}>
          <span className="hy-e pz-e" style={{ "--d": "3.6s", "--dd": "4.2s" }}>💼</span><small>NUEVO</small><b>SERVICIOS Y PROMOCIONES ESPECIALES</b>
        </button>
      </div>
      {servicios && createPortal(
        <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Servicios y promociones especiales" onClick={(e) => { if (e.target === e.currentTarget) setServicios(false); }}>
          <div className="zj-caja">
            <div className="zj-cab"><b>💼 Servicios y promociones especiales</b><button type="button" className="zj-x" onClick={() => setServicios(false)} aria-label="Cerrar">✕</button></div>
            <p className="zj-p">Además de los apoyos comunitarios, DCUATES y Conexiones con Causa ofrecen servicios y promociones especiales para personas, negocios y organizaciones. Esta lista se irá completando; mientras tanto, pide informes y te orientamos.</p>
            <p className="zj-et">Algunas áreas (por definir)</p>
            <div className="hy-serv">{SERV.map(([e, t]) => <div className="ag-ev" key={t}><b>{e} {t}</b></div>)}</div>
            <a className="in-btn" href={wa} target="_blank" rel="noopener noreferrer">💬 Pedir informes por WhatsApp</a>
          </div>
        </div>, document.body)}
      <style>{`
.hy-comp{position:absolute;top:8px;right:8px;z-index:4}
.hy-sec{position:relative;max-width:72rem;margin:10px auto 6px;padding:12px 12px 14px;border-radius:20px;background:color-mix(in srgb,var(--tc,#1B6F8A) 62%,#000);border:2px solid rgba(255,255,255,.3);box-shadow:0 6px 16px rgba(0,0,0,.18)}
.hy-tit{margin:0 38px 10px;font-size:19px;font-weight:900;text-align:center;color:#ffe9a8;letter-spacing:.02em}
.hy-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hy-c{display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:10px 10px 10px;min-height:118px;border:2px solid var(--c);border-left-width:7px;border-radius:14px;background:#fff;font-family:inherit;color:#1f2a37;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}
.hy-c:active{background:#f4f6f5}
.hy-e{font-size:30px;line-height:1.1}
.hy-c small{font-size:11.5px;font-weight:900;letter-spacing:.04em;color:var(--c)}
.hy-c b{font-size:15px;line-height:1.2;font-weight:800}
.hy-sub{font-size:12px;font-style:normal;font-weight:700;color:#5b6675;line-height:1.2}
.hy-serv{display:flex;flex-direction:column;gap:6px;margin:6px 0 10px}
.pz-e{display:inline-block;animation:pz-latido 4.8s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes pz-latido{0%{transform:scale(1);filter:none}4%{transform:scale(1.45);filter:drop-shadow(0 0 7px #ffd84d)}12%{transform:scale(1);filter:none}100%{transform:scale(1);filter:none}}
@media(min-width:640px){.hy-grid{grid-template-columns:repeat(4,1fr)}.pz-e{animation-delay:var(--dd,0s)}}
.hy-sigue{margin:14px 0 4px;padding:10px;border-radius:14px;background:#fff;border:2px dashed #b8c4bd;display:flex;flex-direction:column;gap:6px}
.hy-sigue p{margin:0;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#6b7785;text-align:center}
.hy-sigue button{min-height:46px;border:0;border-radius:12px;padding:8px 12px;color:#fff;font-family:inherit;font-size:13.5px;font-weight:900;cursor:pointer}
`}</style>
    </section>
  );
}
