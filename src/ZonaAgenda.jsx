// AGENDA Y UTILERÍAS: próximos eventos (Google Calendar), cuenta regresiva, clima, horarios de atención 24 h y recordatorios.
// Se abre con el evento dcuates:abrir-agenda (la agenda de HOY, EXPLORA e Info clave lo usan).
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { CALENDARIO_AGREGAR, CALENDARIO_ID_PUBLICO, CLIMA_LUGAR, WHATSAPP_NUMERO } from "./datos/config.js";
import {
  alternarRecordatorio, atencion24h, bajarIcs, cargarClima, claveEvento, consejoClima, cuenta, enlaceGoogle, estadoCal,
  fechaLinda, leerRecordatorios, marcarAvisado, pendientesDeAviso, proximos, quitarRecordatorio, recargarCalendario, textoAtencion, tieneRecordatorio
} from "./utilidades/calendario.js";

export const abrirAgenda = () => window.dispatchEvent(new CustomEvent("dcuates:abrir-agenda"));
const COL = ["#2E9E5B", "#1B6F8A", "#7a5ad8", "#C2410C", "#C2255C"];
const dos = (n) => String(n).padStart(2, "0");

function useReloj(activo) {
  const [ahora, setAhora] = useState(new Date());
  useEffect(() => { if (!activo) return undefined; const id = setInterval(() => setAhora(new Date()), 1000); return () => clearInterval(id); }, [activo]);
  return ahora;
}
function useRecordatorios() {
  const [, f] = useState(0);
  useEffect(() => { const g = () => f((x) => x + 1); window.addEventListener("dcuates:recordatorios", g); return () => window.removeEventListener("dcuates:recordatorios", g); }, []);
  return leerRecordatorios();
}

function Cuenta({ lista }) {
  const ahora = useReloj(true);
  const [sel, setSel] = useState(0);
  if (!lista.length) return <p className="ag3-vacio">Aún no hay eventos próximos para contar. Vuelve pronto.</p>;
  const e = lista[Math.min(sel, lista.length - 1)];
  const enCurso = !e.todoElDia && e.inicio <= ahora && ahora < e.fin;
  const hoyTodo = e.todoElDia && e.inicio.toDateString() === ahora.toDateString();
  const c = cuenta(e.inicio, ahora);
  return (
    <div>
      <select className="ag3-sel" value={sel} onChange={(x) => setSel(+x.target.value)} aria-label="Elige el evento para la cuenta regresiva">
        {lista.slice(0, 12).map((x, i) => <option key={claveEvento(x) + i} value={i}>{fechaLinda(x)} · {x.titulo}</option>)}
      </select>
      {enCurso || hoyTodo
        ? <p className="ag3-ya">🎉 ¡{enCurso ? "Está sucediendo ahora" : "Es hoy"}!</p>
        : <div className="ag3-reloj" role="timer" aria-live="off">{[["días", c.d], ["horas", c.h], ["min", c.m], ["seg", c.s]].map(([t, v]) => <div key={t}><b>{dos(v)}</b><small>{t}</small></div>)}</div>}
      <p className="ag3-ev">{e.titulo}</p>
    </div>
  );
}

function Evento({ e, i }) {
  const [abierto, setAbierto] = useState(false);
  useRecordatorios();
  const tiene = tieneRecordatorio(e);
  return (
    <div className="ag3-card" style={{ background: COL[i % COL.length] }}>
      <button type="button" className="ag3-cab" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        <span><small>{fechaLinda(e)}</small><b>{e.titulo}</b></span><i>{abierto ? "−" : "+"}</i>
      </button>
      {abierto && (
        <div className="ag3-cuerpo">
          {e.lugar && <p>📍 {e.lugar}</p>}
          {e.info && <p>{e.info}</p>}
          <div className="ag3-bots">
            <button type="button" onClick={() => alternarRecordatorio(e)}>{tiene ? "✅ Recordatorio activo (quitar)" : "🔔 Avisarme en esta página"}</button>
            <a href={enlaceGoogle(e)} target="_blank" rel="noopener noreferrer">📅 Guardar en Google Calendar</a>
            <button type="button" onClick={() => bajarIcs(e)}>⬇️ Descargar para mi calendario (.ics)</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Clima() {
  const [d, setD] = useState(null); const [err, setErr] = useState(false);
  useEffect(() => { let vivo = true; cargarClima().then((x) => vivo && setD(x)).catch(() => vivo && setErr(true)); return () => { vivo = false; }; }, []);
  if (err) return <p className="ag3-vacio">No pudimos cargar el clima ahora. Intenta de nuevo en un momento.</p>;
  if (!d) return <p className="ag3-vacio">Cargando el clima…</p>;
  const dia = (f) => new Date(f + "T12:00:00").toLocaleDateString("es-MX", { weekday: "short" }).replace(".", "");
  return (
    <div>
      <div className="ag3-hoy"><span className="ag3-gr">{d.e}</span><span><b>{d.ahora}°C</b><small>{d.txt}</small></span></div>
      <div className="ag3-dias">{d.dias.map((x, i) => <div key={x.fecha}><small>{i === 0 ? "Hoy" : i === 1 ? "Mañana" : dia(x.fecha)}</small><span>{x.e}</span><b>{x.max}° / {x.min}°</b><small>💧 {x.lluvia ?? 0}%</small></div>)}</div>
      {consejoClima(d).map((t) => <p key={t} className="ag3-cons">{t}</p>)}
    </div>
  );
}

function Atencion({ negocios, eventos }) {
  const ahora = useReloj(false);
  const lista = useMemo(() => atencion24h(negocios, new Date()), [negocios]);
  const prox24 = eventos.filter((e) => e.inicio - ahora < 24 * 3600000 && e.fin > ahora);
  return (
    <div>
      {prox24.length > 0 && <><p className="ag3-sub">Actividades DCUATES en las próximas 24 horas</p>{prox24.map((e, i) => <div key={claveEvento(e) + i} className="ag3-fila"><b>{e.titulo}</b><small>{fechaLinda(e)}{e.lugar ? " · " + e.lugar : ""}</small></div>)}</>}
      <p className="ag3-sub">Negocios y servicios con atención</p>
      {lista.length === 0
        ? <p className="ag3-vacio">Aún no hay horarios capturados. Los negocios aliados pueden pedir que se publique el suyo por WhatsApp.</p>
        : lista.map((x) => (
          <div key={x.n.nombre} className="ag3-fila"><b>{x.n.emoji} {x.n.nombre}</b><small>{textoAtencion(x)}</small>
            {x.n.tel && <a href={"https://wa.me/" + (x.n.tel.length === 10 ? "52" + x.n.tel : x.n.tel)} target="_blank" rel="noopener noreferrer">💬 Escribirle</a>}</div>
        ))}
      <a className="ag3-link" href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Hola DCUATES, quiero que se publique el horario de atención de mi negocio: ___")}`} target="_blank" rel="noopener noreferrer">➕ Publicar el horario de mi negocio</a>
    </div>
  );
}

function Ventana({ onCerrar, agenda, negocios }) {
  useAtras(true, onCerrar);
  const [ver, setVer] = useState(false);
  const rec = useRecordatorios();
  const [, tic] = useState(0);
  useEffect(() => { recargarCalendario().then(() => tic((x) => x + 1)); }, []);
  const lista = useMemo(() => proximos(agenda), [agenda]);
  const emb = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDARIO_ID_PUBLICO)}&ctz=America%2FMexico_City&hl=es&mode=AGENDA&showTitle=0&showPrint=0&showTz=0`;
  return createPortal(
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Agenda y utilerías" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>📅 Agenda y utilerías</b>
          <BotonCompartir hash="agenda" titulo="Agenda DCUATES" texto="Mira los próximos eventos de DCUATES" variante="circulo" />
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Eventos, cuenta regresiva, clima, horarios de atención y recordatorios, en un solo lugar.</p>
        <p className="zj-et">⏳ Cuenta regresiva</p><div className="ag3-bloque"><Cuenta lista={lista} /></div>
        <p className="zj-et">📅 Próximos eventos</p>
        {lista.length === 0 ? <p className="ag3-vacio">Aún no hay eventos próximos. Vuelve pronto.</p> : lista.slice(0, 15).map((e, i) => <Evento key={claveEvento(e) + i} e={e} i={i} />)}
        <p className="ag3-estado">{estadoCal.ok ? "✅ Calendario DCUATES conectado" : "ℹ️ Mostrando los eventos de la página" + (estadoCal.motivo ? " (" + estadoCal.motivo + ")" : "")}</p>
        <div className="zj-col">
          <button type="button" style={{ background: "#334155" }} onClick={() => setVer(!ver)}>{ver ? "Ocultar el calendario completo" : "🗓️ Ver el calendario completo"}</button>
          <a className="ag3-btn" style={{ background: "#1B6F8A" }} href={CALENDARIO_AGREGAR} target="_blank" rel="noopener noreferrer">➕ Agregar el calendario DCUATES a mi Google Calendar</a>
        </div>
        {ver && <iframe className="ag3-if" title="Calendario DCUATES" src={emb} loading="lazy" />}
        <p className="zj-et">⛅ Clima · {CLIMA_LUGAR.nombre}</p><div className="ag3-bloque"><Clima /></div>
        <p className="zj-et">🕘 Horarios de atención · próximas 24 h</p><div className="ag3-bloque"><Atencion negocios={negocios} eventos={lista} /></div>
        <p className="zj-et">🔔 Mis recordatorios</p>
        <div className="ag3-bloque">{rec.length === 0 ? <p className="ag3-vacio">Toca un evento y elige «Avisarme en esta página». Te avisamos cuando abras DCUATES y falten menos de 24 horas.</p> : rec.map((r) => <div className="ag3-fila" key={r.k}><b>{r.titulo}</b><small>{fechaLinda({ inicio: new Date(r.inicio), todoElDia: r.todoElDia })}</small><button type="button" onClick={() => quitarRecordatorio(r.k)}>Quitar</button></div>)}</div>
      </div>
      <style>{`.ag3-bloque{padding:10px;border-radius:14px;background:#f1f5f4;margin-bottom:8px;color:#0f172a}.ag3-vacio{margin:4px 0;font-size:14px;font-weight:700;color:#334155}.ag3-sel{width:100%;min-height:44px;border:2px solid #cbd5e1;border-radius:12px;padding:6px 8px;font:inherit;font-weight:800;margin-bottom:8px;background:#fff;color:#0f172a}.ag3-reloj{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center}.ag3-reloj div{background:#14532d;color:#fff;border-radius:12px;padding:8px 2px}.ag3-reloj b{display:block;font-size:26px;font-weight:900;line-height:1}.ag3-reloj small{font-size:11px;font-weight:800}.ag3-ya{margin:6px 0;text-align:center;font-size:20px;font-weight:900;color:#14532d}.ag3-ev{margin:8px 0 0;text-align:center;font-weight:900}.ag3-card{border:2px solid #fff;border-radius:14px;margin-bottom:6px;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18)}.ag3-cab{width:100%;display:flex;align-items:center;gap:8px;padding:10px 12px;background:transparent;border:0;color:#fff;font:inherit;text-align:left;cursor:pointer}.ag3-cab span{flex:1;display:flex;flex-direction:column}.ag3-cab small{font-size:12px;font-weight:800;opacity:.95}.ag3-cab b{font-size:15px;font-weight:900;line-height:1.2}.ag3-cab i{font-style:normal;font-size:24px;font-weight:900}.ag3-cuerpo{padding:0 12px 12px;font-size:13.5px;font-weight:700}.ag3-cuerpo p{margin:4px 0;color:#fff}.ag3-bots{display:grid;gap:6px;margin-top:8px}.ag3-bots button,.ag3-bots a,.ag3-btn{display:block;min-height:42px;padding:9px 10px;border:2px solid #fff;border-radius:12px;background:rgba(0,0,0,.28);color:#fff;font:inherit;font-weight:900;font-size:13.5px;text-align:center;text-decoration:none;cursor:pointer}.ag3-btn{width:100%;box-sizing:border-box}.ag3-estado{margin:4px 2px 8px;font-size:12px;font-weight:700;color:#475569}.ag3-if{width:100%;height:420px;border:2px solid #cbd5e1;border-radius:12px;margin-top:8px;background:#fff}.ag3-hoy{display:flex;align-items:center;gap:12px}.ag3-gr{font-size:46px;line-height:1}.ag3-hoy b{display:block;font-size:30px;font-weight:900}.ag3-hoy small{font-size:14px;font-weight:800}.ag3-dias{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0;text-align:center}.ag3-dias div{background:#fff;border-radius:12px;padding:6px 2px;display:flex;flex-direction:column;gap:2px}.ag3-dias span{font-size:26px}.ag3-dias b{font-size:13px;font-weight:900}.ag3-dias small{font-size:11.5px;font-weight:800;color:#475569}.ag3-cons{margin:4px 0;padding:8px 10px;border-radius:12px;background:#fff4d6;font-size:13.5px;font-weight:800;color:#3a2a00}.ag3-sub{margin:8px 0 4px;font-size:12px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:#14532d}.ag3-fila{display:flex;flex-direction:column;gap:2px;padding:8px 10px;margin-bottom:6px;border-radius:12px;background:#fff;color:#0f172a}.ag3-fila b{font-size:14px;font-weight:900}.ag3-fila small{font-size:13px;font-weight:700;color:#334155}.ag3-fila a,.ag3-fila button{align-self:flex-start;margin-top:4px;padding:4px 10px;border:2px solid #2E9E5B;border-radius:10px;background:#fff;color:#14532d;font:inherit;font-weight:900;font-size:13px;text-decoration:none;cursor:pointer}.ag3-link{display:block;margin-top:6px;font-weight:900;font-size:14px;color:#1B6F8A}body.dc-contraste .zj-caja .ag3-card,body.dc-contraste .zj-caja .ag3-card *,body.dc-contraste .zj-caja .ag3-reloj *,body.dc-contraste .zj-caja .ag3-btn{color:#fff!important}`}</style>
    </div>, document.body);
}

// Se monta UNA vez en App: abre la ventana y muestra el aviso de recordatorios al entrar.
export default function AgendaHost({ agenda = [], negocios = [] }) {
  const [ab, setAb] = useState(false);
  const [aviso, setAviso] = useState(null);
  useEffect(() => {
    const f = () => setAb(true);
    window.addEventListener("dcuates:abrir-agenda", f);
    try { if (window.location.hash === "#agenda") setAb(true); } catch (e) {}
    const t = setTimeout(() => { const p = pendientesDeAviso(); if (p.length) setAviso(p[0]); }, 4500);
    return () => { window.removeEventListener("dcuates:abrir-agenda", f); clearTimeout(t); };
  }, []);
  const cerrarAviso = () => { if (aviso) marcarAvisado(aviso.k); setAviso(null); };
  const cuando = aviso ? fechaLinda({ inicio: new Date(aviso.inicio), todoElDia: aviso.todoElDia }) : "";
  return (
    <>
      {ab && <Ventana onCerrar={() => setAb(false)} agenda={agenda} negocios={negocios} />}
      {aviso && (
        <div className="ag3-toast" role="status">
          <span>🔔</span><span><b>Recuerda: {aviso.titulo}</b><small>{cuando}</small></span>
          <button type="button" onClick={() => { cerrarAviso(); setAb(true); }}>Ver</button>
          <button type="button" onClick={cerrarAviso} aria-label="Cerrar aviso">✕</button>
          <style>{`.ag3-toast{position:fixed;left:8px;right:8px;bottom:calc(var(--alto-ticker,48px) + var(--alto-nav,0px) + 64px);z-index:96;display:flex;align-items:center;gap:10px;padding:10px 12px;border:2px solid #fff;border-radius:16px;background:#14532d;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.35)}.ag3-toast>span:nth-child(2){flex:1;display:flex;flex-direction:column}.ag3-toast b{font-size:14px;font-weight:900}.ag3-toast small{font-size:12.5px;font-weight:700}.ag3-toast button{min-height:36px;padding:4px 10px;border:2px solid #fff;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font:inherit;font-weight:900;cursor:pointer}`}</style>
        </div>
      )}
    </>
  );
}
