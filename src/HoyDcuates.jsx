// HOY EN DCUATES — panel que une la página: reto del día, próximo evento, una necesidad abierta y "Seguías en…".
// También exporta QueSigue (pie "Tu siguiente paso" dentro de cada ventana de proyecto).
import React, { useMemo, useState } from "react";
import BotonCompartir from "./BotonCompartir.jsx";
import { useAtras } from "./atras.js";
import { abrirAcceso } from "./Tablero.jsx";
import { abrirLogros } from "./Extras.jsx";
import { identidad } from "./datos/identidad.js";
import { tarjetasHoy, ejecutar } from "./datos/secciones.js";
import { RETOS_DIA, NECESIDADES_BASE, retosDesdeZona, necesidadesDesdeZona, agendaDesdeZona } from "./datos/zona.js";

const baja = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const abrirZona = (id) => window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: id }));
const hoyLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function guardarUltimo(t, id, n) { try { localStorage.setItem("dc_ultimo", JSON.stringify({ t, id, n })); } catch (e) {} try { window.dispatchEvent(new Event("dcuates:ultimo")); } catch (e) {} }
const leerUltimo = () => { try { return JSON.parse(localStorage.getItem("dc_ultimo") || "null"); } catch (e) { return null; } };

export const NOMBRE_ZONA = { empieza: "👋 Empieza aquí", juegos: "🎉 Juega y diviértete", aprende: "🧠 Juega y aprende", gana: "🏆 Juega y gana", propon: "💡 Recomienda y gana", causa: "🛍️ Dona, compra y vende con causa", info: "📌 Info clave", negocio: "🏪 Tengo un negocio" };

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

export default function HoyDcuates({ agenda = [], filasZona = [], onAbrirProyecto = () => {}, fijo = false, seccion = "nosotros", negocios = [] }) {
  const hoy = hoyLocal();
  const dia = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const retos = useMemo(() => { const r = retosDesdeZona(filasZona); return r.length ? r : RETOS_DIA; }, [filasZona]);
  const reto = retos[dia % retos.length];
  let hecho = false; try { hecho = localStorage.getItem("dc_reto") === hoy; } catch (e) {}
  const evento = useMemo(() => [...agenda, ...agendaDesdeZona(filasZona)].filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))[0], [agenda, filasZona, hoy]);
  const necesidades = useMemo(() => { const z = necesidadesDesdeZona(filasZona); return z.length ? z : NECESIDADES_BASE; }, [filasZona]);
  const nec = necesidades.length ? necesidades[dia % necesidades.length] : null;
  const propias = seccion !== "nosotros" ? tarjetasHoy(seccion, { retos, nec, negocios, evento }) : null;
  const corto = (t, n = 34) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
  const fechaTxt = (f) => { const [, m, d] = f.split("-"); return `${Number(d)} ${MESES[Number(m) - 1]}`; };
  const [abiertoSel, setAbierto] = useState(false);
  const abierto = fijo || abiertoSel;
  const [nuevo, setNuevo] = useState(() => { try { return localStorage.getItem("dc_hoy_visto") !== hoy; } catch (e) { return false; } });
  const alTocar = () => { setAbierto((v) => !v); if (nuevo) { try { localStorage.setItem("dc_hoy_visto", hoy); } catch (e) {} setNuevo(false); } };
  const faltan = evento ? Math.round((new Date(evento.fecha + "T00:00:00") - new Date(hoy + "T00:00:00")) / 86400000) : null;
  const cuando = faltan === null ? "" : faltan === 0 ? "¡Es hoy!" : faltan === 1 ? "Mañana" : `Faltan ${faltan} días`;
  return (
    <section className="hy-sec" id="hoy-dcuates" aria-label="Hoy en DCUATES">
      <span className="hy-comp"><BotonCompartir hash="hoy-dcuates" titulo="Hoy en DCUATES" texto="El reto del día, los eventos y lo que se necesita hoy en la comunidad" variante="claro" /></span>
      <button type="button" className={"hy-franja" + (fijo ? " hy-fija" : "")} aria-expanded={abierto} onClick={fijo ? undefined : alTocar} disabled={false}>
        <span className="hy-fe">☀️{nuevo && !fijo && <i className="hy-nuevo">NUEVO</i>}</span>
        <span className="hy-ft"><b>HOY EN DCUATES</b><small>{fijo ? "Lo que pasa hoy en la comunidad" : abierto ? "Toca para cerrar" : (propias ? `Esta semana: ${corto(propias[0].t)}` : evento ? `${cuando}: ${evento.titulo}` : "Reto, evento y lo que se necesita hoy")}</small></span>
        {!fijo && <span className={"hy-fl" + (abierto ? " hy-fl-on" : "")} aria-hidden="true">▾</span>}
      </button>
      {abierto && (
      <div className="hy-grid">
        {propias ? propias.map((c, i) => (
          <button type="button" key={c.et} className="hy-c" style={{ "--c": c.c }} onClick={() => ejecutar(c.a, onAbrirProyecto)}>
            <span className="hy-e pz-e" style={{ "--d": `${[2.4, 3, 4.2][i]}s`, "--dd": `${[2.4, 3, 3.6][i]}s` }}>{c.e}</span><small>{c.et}</small><b style={c.t.length > 42 ? { fontSize: 13.5 } : undefined}>{c.t}</b>
            {c.s && <em className="hy-sub">{c.s}</em>}
          </button>
        )) : <>
        <button type="button" className="hy-c" style={{ "--c": "#2E9E5B" }} onClick={() => abrirZona("empieza")}>
          <span className="hy-e pz-e" style={{ "--d": "2.4s", "--dd": "2.4s" }}>🎯</span><small>RETO DEL DÍA {hecho ? "· ✅ cumplido" : ""}</small><b>{reto}</b>
        </button>
        <button type="button" className="hy-c" style={{ "--c": "#1B6F8A" }} onClick={() => abrirZona("info:agenda")}>
          <span className="hy-e pz-e" style={{ "--d": "3s", "--dd": "3s" }}>📅</span>
          <small>{evento ? `PRÓXIMO EVENTO · ${fechaTxt(evento.fecha)}` : "AGENDA"}</small><b>{evento ? evento.titulo : "Mira lo que viene en la comunidad"}</b>
        </button>
        <button type="button" className="hy-c" style={{ "--c": nec ? identidad(nec.proyecto).color : "#E5484D" }} onClick={() => (nec && nec.proyecto && identidad(nec.proyecto).nombre !== "DCUATES" ? onAbrirProyecto(nec.proyecto) : abrirZona("causa"))}>
          <span className="hy-e pz-e" style={{ "--d": "4.2s", "--dd": "3.6s" }}>{nec ? nec.emoji : "🎁"}</span><small>SE NECESITA HOY</small><b>{nec ? nec.titulo : "Mira cómo ayudar"}</b>
          <em className="hy-sub">También: croquetas, difusión y…</em>
        </button>
</>}
        <button type="button" className="hy-c" style={{ "--c": "#7a5ad8" }} onClick={abrirLogros}>
          <span className="hy-e pz-e" style={{ "--d": "3.6s", "--dd": "4.2s" }}>🏆</span><small>ÚNETE</small><b>SÉ PARTE DE NUESTROS LOGROS</b>
        </button>
      </div>
      )}
      <style>{`
.hy-comp{position:absolute;top:26px;right:14px;z-index:4}
.hy-sec{position:relative;max-width:72rem;margin:10px auto 6px;padding:10px 10px 10px;border-radius:20px;background:color-mix(in srgb,var(--tc,#1B6F8A) 62%,#000);border:2px solid rgba(255,255,255,.3);box-shadow:0 6px 16px rgba(0,0,0,.18)}
.hy-tit{margin:0 38px 10px;font-size:19px;font-weight:900;text-align:center;color:#ffe9a8;letter-spacing:.02em}
.hy-franja{width:100%;display:flex;align-items:center;gap:10px;min-height:68px;padding:8px 54px 8px 10px;border:2px solid rgba(255,255,255,.85);border-bottom-width:6px;border-radius:18px;background:transparent;font-family:inherit;text-align:left;cursor:pointer;color:#fff}
.hy-fe{position:relative;font-size:26px;line-height:1;flex:none}
.hy-ft{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.hy-ft b{display:block;white-space:nowrap;font-size:15px;font-weight:900;color:#ffe9a8;letter-spacing:.02em}
.hy-ft small{display:block;font-size:12.5px;font-weight:700;line-height:1.25;color:#fff}
.hy-nuevo{position:absolute;top:-8px;left:-6px;padding:1px 5px;border-radius:99px;background:#E5484D;color:#fff;font-size:9px;font-weight:900;line-height:1.2;font-style:normal;letter-spacing:0}
.hy-fija{cursor:default}
.hy-fl{font-size:20px;font-weight:900;color:#ffe9a8;transition:transform .2s}.hy-fl-on{transform:rotate(180deg)}
.hy-grid{margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
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

export function BotonRegistrate() {
  return (
    <div className="rp-wrap">
      <button type="button" className="rp-btn" onClick={() => abrirAcceso("registros")}>
        <span className="rp-e" aria-hidden="true">📝</span>
        <span className="rp-t"><b>REGÍSTRATE Y PARTICIPA</b><small>Pide o suma: ayuda, negocio, voluntariado</small></span>
      </button>
      <span className="rp-comp"><BotonCompartir hash="registrate" titulo="Regístrate y participa en DCUATES" texto="Cuéntanos qué necesitas o qué puedes ofrecer a la comunidad" variante="claro" /></span>
      <style>{`
.rp-wrap{position:relative}
.rp-comp{position:absolute;top:50%;right:10px;margin-top:-18px;z-index:3}
.rp-btn{width:100%;display:flex;align-items:center;gap:12px;min-height:76px;margin:10px 0 0;padding:8px 56px 8px 14px;border:2px solid #fff;border-bottom-width:6px;border-radius:18px;background:#1F7A46;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}
.rp-e{width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:14px;background:#fff;font-size:24px}
.rp-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.rp-t b{display:block;white-space:normal;overflow:visible;text-overflow:clip;font-size:16px;font-weight:900}.rp-t small{display:block;white-space:normal;overflow:visible;text-overflow:clip;font-size:12.5px;font-weight:700;line-height:1.2;color:#e3f6ea}
`}</style>
    </div>
  );
}
