// HOY EN DCUATES — panel que une la página: reto del día, próximo evento, una necesidad abierta y "Seguías en…".
// También exporta QueSigue (pie "Tu siguiente paso" dentro de cada ventana de proyecto).
import React, { useEffect, useMemo, useState } from "react";
import { identidad } from "./datos/identidad.js";
import { RETOS_DIA, NECESIDADES_BASE, retosDesdeZona, necesidadesDesdeZona, agendaDesdeZona } from "./datos/zona.js";

const baja = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const abrirZona = (id) => { baja("zona-publica"); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: id })), 450); };
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
      <button type="button" style={{ background: "#E5484D" }} onClick={() => { onCerrar(); setTimeout(() => baja("zona-publica"), 120); }}>🎮 Participa: juega y gana en la Zona pública ›</button>
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
  const [ult, setUlt] = useState(leerUltimo);
  useEffect(() => { const f = () => setUlt(leerUltimo()); window.addEventListener("dcuates:ultimo", f); return () => window.removeEventListener("dcuates:ultimo", f); }, []);
  const fechaTxt = (f) => { const [, m, d] = f.split("-"); return `${Number(d)} ${MESES[Number(m) - 1]}`; };
  const abrirUlt = () => { if (!ult) return; if (ult.t === "proyecto") onAbrirProyecto(ult.id); else abrirZona(ult.id); };
  return (
    <section className="hy-sec" aria-label="Hoy en DCUATES">
      <h2 className="hy-tit">☀️ HOY EN DCUATES</h2>
      <div className="hy-grid">
        <button type="button" className="hy-c" style={{ "--c": "#2E9E5B" }} onClick={() => abrirZona("empieza")}>
          <span className="hy-e">🎯</span><small>RETO DEL DÍA {hecho ? "· ✅ cumplido" : ""}</small><b>{reto}</b>
        </button>
        {evento ? (
          <button type="button" className="hy-c" style={{ "--c": "#1B6F8A" }} onClick={() => abrirZona("info")}>
            <span className="hy-e">📅</span><small>PRÓXIMO EVENTO · {fechaTxt(evento.fecha)}</small><b>{evento.titulo}</b>
          </button>
        ) : (
          <button type="button" className="hy-c" style={{ "--c": "#1B6F8A" }} onClick={() => abrirZona("info")}>
            <span className="hy-e">📅</span><small>AGENDA</small><b>Mira lo que viene en la comunidad</b>
          </button>
        )}
        {nec && (
          <button type="button" className="hy-c" style={{ "--c": identidad(nec.proyecto).color }} onClick={() => (nec.proyecto && identidad(nec.proyecto).nombre !== "DCUATES" ? onAbrirProyecto(nec.proyecto) : abrirZona("causa"))}>
            <span className="hy-e">{nec.emoji}</span><small>SE NECESITA HOY</small><b>{nec.titulo}</b>
          </button>
        )}
        {ult && (
          <button type="button" className="hy-c hy-ult" style={{ "--c": "#7a5ad8" }} onClick={abrirUlt}>
            <span className="hy-e">↩️</span><small>SEGUÍAS EN…</small><b>{ult.n}</b>
          </button>
        )}
      </div>
      <style>{`
.hy-sec{max-width:72rem;margin:14px auto 6px;padding:12px 14px;border-radius:20px;background:#fffbea;border:2px solid #f3e3a6}
.hy-tit{margin:0 0 8px;font-size:17px;font-weight:900;text-align:center;color:#92610F}
.hy-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hy-c{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 10px 10px;min-height:96px;border:2px solid var(--c);border-left-width:7px;border-radius:14px;background:#fff;font-family:inherit;color:#1f2a37;text-align:left;cursor:pointer}
.hy-c:active{background:#f4f6f5}
.hy-e{font-size:24px;line-height:1}
.hy-c small{font-size:9.5px;font-weight:900;letter-spacing:.05em;color:var(--c)}
.hy-c b{font-size:13px;line-height:1.2;font-weight:800}
@media(min-width:640px){.hy-grid{grid-template-columns:repeat(4,1fr)}}
.hy-sigue{margin:14px 0 4px;padding:10px;border-radius:14px;background:#fff;border:2px dashed #b8c4bd;display:flex;flex-direction:column;gap:6px}
.hy-sigue p{margin:0;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#6b7785;text-align:center}
.hy-sigue button{min-height:46px;border:0;border-radius:12px;padding:8px 12px;color:#fff;font-family:inherit;font-size:13.5px;font-weight:900;cursor:pointer}
`}</style>
    </section>
  );
}
