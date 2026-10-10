// RED DE CONFIANZA (3er nivel) — actividades INDIVIDUALES por invitación. Todo se guarda en el celular de cada persona.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TiraAuto from "./TiraAuto.jsx";
import BotonCompartir from "./BotonCompartir.jsx";
import { GOOGLE_SHEETS_URL, WHATSAPP_NUMERO } from "./datos/config.js";
import { IDENTIDAD, identidad } from "./datos/identidad.js";
import { CLAVE_RED, INSIGNIAS, LIBRO_MES, METAS_SEMANA, guardarJSON, hoyISO, leerInsignias, leerJSON, otorgar, semanaClave } from "./datos/red.js";
import { leerSemillas, nivelDe, sumarSemillas } from "./datos/juegos.js";
import { CasillaAcepto, useAceptacion } from "./componentes/legal.jsx";

const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;
const dentro = () => { try { return sessionStorage.getItem("dc_red") === "1"; } catch (e) { return false; } };
const marcar = (v) => { try { v ? sessionStorage.setItem("dc_red", "1") : sessionStorage.removeItem("dc_red"); } catch (e) {} };
const sumar = (n) => sumarSemillas(n);

const TARJETAS = [
  { id: "pasaporte", emoji: "🧭", titulo: "MI PASAPORTE DCUATES", texto: "Sella cada proyecto que conoces.", color: "#1B6F8A" },
  { id: "lectura", emoji: "📖", titulo: "MI RUTA DE LECTURA", texto: "Un libro del mes y tu reflexión.", color: "#2E9E5B" },
  { id: "diario", emoji: "💛", titulo: "MI DIARIO DE GRATITUD", texto: "Una línea al día y tu racha.", color: "#B7791F" },
  { id: "reto", emoji: "🎯", titulo: "MI RETO SEMANAL", texto: "Elige una meta y cúmplela.", color: "#E5484D" },
  { id: "mentor", emoji: "🧑‍🏫", titulo: "MENTOR A LA DISTANCIA", texto: "Deja un consejo que ayude a otros.", color: "#7a5ad8" },
  { id: "embajador", emoji: "🔗", titulo: "MI ENLACE DE EMBAJADOR", texto: "Invita con tu enlace personal.", color: "#0E7490" },
  { id: "insignias", emoji: "🏅", titulo: "MIS INSIGNIAS Y NIVEL", texto: "Todo lo que has logrado.", color: "#C2410C" }
];

const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
function Acceso({ onCerrar, onEntrar }) {
  const [clave, setClave] = useState(""); const [error, setError] = useState("");
  const entrar = (e) => { e.preventDefault(); if (clave.trim().toLowerCase() === CLAVE_RED.toLowerCase()) onEntrar(); else setError("Esa clave no es válida. Pídela por WhatsApp."); };
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Acceso a la Red de confianza" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🌳 Red de confianza</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Este espacio es por invitación para quienes ya participan de forma constante. Escribe la clave que te compartimos.</p>
        <form className="pr-form" onSubmit={entrar}>
          <label>Tu clave<input value={clave} onChange={(e) => { setClave(e.target.value); setError(""); }} autoComplete="off" autoCapitalize="none" /></label>
          {error && <p className="pr-err" role="alert">{error}</p>}
          <button type="submit" className="pr-enviar">🔓 Entrar</button>
        </form>
        <a className="in-btn in-sec2" href={wa("Hola, me gustaría recibir una invitación para la Red de confianza de DCUATES.")} target="_blank" rel="noopener noreferrer">💬 Pedir mi invitación por WhatsApp</a>
      </div>
    </div>
  );
}

function Pasaporte({ onAbrirProyecto, cerrar }) {
  const [sellos, setSellos] = useState(() => leerJSON("dc_pasaporte", []));
  const ids = Object.keys(IDENTIDAD);
  const sellar = (id) => {
    if (sellos.includes(id)) return;
    const n = [...sellos, id]; setSellos(n); guardarJSON("dc_pasaporte", n); sumar(1);
    otorgar("primer-sello"); if (n.length >= ids.length) otorgar("pasaporte");
  };
  return (
    <div className="rd-lista">
      <p className="pr-nota">Llevas <b>{sellos.length} de {ids.length}</b> sellos. Abre cada proyecto, conócelo y sella tu pasaporte (+1 Semilla por sello).</p>
      <div className="rd-barra"><i style={{ width: `${(sellos.length / ids.length) * 100}%` }} /></div>
      {ids.map((id) => { const d = identidad(id); const ok = sellos.includes(id); return (
        <div className="ag-ev rd-fila" key={id} style={{ borderLeft: `6px solid ${d.color}` }}>
          <b>{d.emoji} {d.nombre}</b>
          <div className="ca-btns">
            <button type="button" style={{ background: d.color }} onClick={() => { cerrar(); setTimeout(() => onAbrirProyecto(id), 100); }}>Conocer ›</button>
            <button type="button" className={ok ? "rd-ok" : ""} onClick={() => sellar(id)} disabled={ok}>{ok ? "✅ Sellado" : "📮 Sellar"}</button>
          </div>
        </div>); })}
    </div>
  );
}

function Lectura() {
  const mes = hoyISO().slice(0, 7);
  const [nota, setNota] = useState(() => leerJSON("dc_lectura_" + mes, { nota: "", fin: false }));
  const guardar = (n) => { setNota(n); guardarJSON("dc_lectura_" + mes, n); };
  return (
    <div className="rd-lista">
      <div className="ag-ev"><b>📖 Libro del mes: {LIBRO_MES.titulo}</b><p>{LIBRO_MES.info}</p><a href={LIBRO_MES.enlace} target="_blank" rel="noopener noreferrer">Leer gratis ›</a></div>
      <p className="zj-et">Para reflexionar</p>
      <p className="zj-p">{LIBRO_MES.pregunta}</p>
      <textarea className="rd-area" rows={4} value={nota.nota} onChange={(e) => guardar({ ...nota, nota: e.target.value })} placeholder="Tu nota personal (se guarda solo en tu celular)" />
      {nota.fin ? <p className="gn-nota">¡Libro terminado este mes! 📚</p>
        : <button type="button" className="in-btn" onClick={() => { guardar({ ...nota, fin: true }); sumar(2); otorgar("lector"); }}>✅ Ya terminé el libro (+2 Semillas)</button>}
    </div>
  );
}

function racha(fechas) {
  const set = new Set(fechas); let n = 0; const d = new Date();
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  while (set.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function Diario() {
  const [lista, setLista] = useState(() => leerJSON("dc_diario", []));
  const [texto, setTexto] = useState("");
  const hoy = hoyISO(); const yaHoy = lista.some((x) => x.f === hoy);
  const r = racha(lista.map((x) => x.f));
  const anotar = () => {
    if (texto.trim().length < 3 || yaHoy) return;
    const n = [{ f: hoy, t: texto.trim() }, ...lista].slice(0, 90); setLista(n); guardarJSON("dc_diario", n); setTexto(""); sumar(1);
    const rr = racha(n.map((x) => x.f)); if (rr >= 3) otorgar("gratitud3"); if (rr >= 7) otorgar("gratitud7");
  };
  return (
    <div className="rd-lista">
      <p className="zj-p">🔥 Racha: <b>{r} {r === 1 ? "día" : "días"}</b></p>
      {yaHoy ? <p className="gn-nota">¡Hoy ya diste gracias! Vuelve mañana 💛</p> : (
        <>
          <label className="rd-lab">Hoy agradezco…<input value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={140} placeholder="Una línea basta" /></label>
          <button type="button" className="pr-enviar" onClick={anotar}>💛 Guardar mi gratitud (+1 Semilla)</button>
        </>)}
      <p className="zj-et">Mis últimos días</p>
      {lista.length === 0 && <p className="ag-vacio">Aún no escribes ninguno.</p>}
      {lista.slice(0, 7).map((x) => <div className="ag-ev" key={x.f}><b>{x.f}</b><p>{x.t}</p></div>)}
    </div>
  );
}

function Reto() {
  const sem = semanaClave();
  const [est, setEst] = useState(() => leerJSON("dc_reto_sem", {}));
  const cur = est.sem === sem ? est : { sem, meta: null, dias: [], premio: false };
  const meta = METAS_SEMANA.find((m) => m.id === cur.meta);
  const guardar = (n) => { setEst(n); guardarJSON("dc_reto_sem", n); };
  const DIAS = ["L", "M", "M", "J", "V", "S", "D"];
  const alternar = (i) => {
    const dias = cur.dias.includes(i) ? cur.dias.filter((x) => x !== i) : [...cur.dias, i];
    let premio = cur.premio;
    if (meta && dias.length >= meta.dias && !premio) { premio = true; sumar(3); otorgar("reto-semana"); }
    guardar({ ...cur, dias, premio });
  };
  return (
    <div className="rd-lista">
      {!meta ? (
        <>
          <p className="zj-p">Elige UNA meta para esta semana:</p>
          {METAS_SEMANA.map((m) => <button type="button" key={m.id} className="in-btn" onClick={() => guardar({ ...cur, meta: m.id })}>{m.emoji} {m.texto} · {m.dias} días</button>)}
        </>
      ) : (
        <>
          <div className="ag-ev"><b>{meta.emoji} {meta.texto}</b><p>Meta: {meta.dias} días esta semana. Llevas {cur.dias.length}.</p></div>
          <div className="rd-dias">{DIAS.map((d, i) => <button type="button" key={i} className={cur.dias.includes(i) ? "rd-on" : ""} onClick={() => alternar(i)} aria-pressed={cur.dias.includes(i)}>{d}</button>)}</div>
          {cur.premio && <p className="gn-nota">🎉 ¡Meta cumplida! +3 Semillas e insignia “Constante”.</p>}
          <button type="button" className="zj-link" onClick={() => guardar({ sem, meta: null, dias: [], premio: false })}>Cambiar de meta</button>
        </>
      )}
    </div>
  );
}

function Mentor() {
  const [tema, setTema] = useState(""); const [texto, setTexto] = useState(""); const [contacto, setContacto] = useState("");
  const [ok, setOk] = useState(false); const [error, setError] = useState(""); const ac = useAceptacion();
  const enviar = async (e) => {
    e.preventDefault();
    if (texto.trim().length < 15) { setError("Escribe un consejo de al menos una o dos frases."); return; }
    if (!ac.validar()) return; setError("");
    const d = new URLSearchParams({ Tipo: "Consejo mentor", Perfil: "Red de confianza", Nombre: tema || "Sin tema", Contacto: contacto, Mensaje: texto, Estado: "Recibido", Fecha: new Date().toLocaleString("es-MX") });
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: d }); } catch (err) { console.error(err); }
    sumar(2); otorgar("mentor"); setOk(true); ac.reiniciar();
  };
  if (ok) return <div className="zj-resp zj-bien"><p className="zj-bien-e">🌟</p><p><b>¡Gracias por compartir tu experiencia!</b></p><p>Lo revisaremos y, con tu permiso, lo publicaremos. +2 Semillas.</p><button type="button" onClick={() => { setOk(false); setTexto(""); }}>Compartir otro</button></div>;
  return (
    <form className="pr-form" onSubmit={enviar}>
      <p className="pr-nota">Tu oficio, tu experiencia o lo que aprendiste puede ayudar a alguien. Deja un consejo corto, sin datos personales de terceros.</p>
      <label>Tema o oficio<input value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej. Cómo ahorrar en la cocina" /></label>
      <label>Tu consejo<textarea rows={5} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Cuéntalo con tus palabras" /></label>
      <label>WhatsApp o correo (opcional)<input value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Solo si quieres que te contactemos" /></label>
      <CasillaAcepto ac={ac} id="acepta_mentor" />
      {error && <p className="pr-err" role="alert">{error}</p>}
      <button type="submit" className="pr-enviar">🧑‍🏫 Enviar mi consejo</button>
    </form>
  );
}

function Embajador() {
  const [codigo] = useState(() => { let c = null; try { c = localStorage.getItem("dc_embajador"); } catch (e) {} if (!c) { c = Math.random().toString(36).slice(2, 8).toUpperCase(); try { localStorage.setItem("dc_embajador", c); } catch (e) {} } return c; });
  const url = `${window.location.origin}/?ref=${codigo}`;
  const msg = `Te invito a conocer DCUATES, una comunidad que apoya a personas, grupos y causas: ${url}`;
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => { try { await navigator.clipboard.writeText(url); setCopiado(true); otorgar("embajador"); setTimeout(() => setCopiado(false), 1500); } catch (e) {} };
  return (
    <div className="rd-lista">
      <p className="zj-p">Este es tu enlace personal. Compártelo con quien creas que disfrutará DCUATES.</p>
      <div className="ag-ev"><b>🔗 Tu código: {codigo}</b><p style={{ wordBreak: "break-all" }}>{url}</p></div>
      <div className="ca-btns"><button type="button" onClick={copiar}>{copiado ? "✔️ Copiado" : "📋 Copiar enlace"}</button><a href={wa(msg)} onClick={() => otorgar("embajador")} target="_blank" rel="noopener noreferrer">💬 Invitar por WhatsApp</a></div>
      <p className="pr-nota">Más adelante te mostraremos cuántas personas llegaron con tu enlace.</p>
    </div>
  );
}

function Insignias() {
  const ganadas = leerInsignias(); const s = leerSemillas(); const niv = nivelDe(s);
  return (
    <div className="rd-lista">
      <div className="ag-ev"><b>{niv.emoji} Nivel {niv.nombre} · {s} 🌱</b><p>{niv.siguiente ? `Te faltan ${niv.siguiente.min - s} Semillas para ${niv.siguiente.nombre}.` : "¡Nivel máximo!"}</p></div>
      <p className="zj-et">Mis insignias ({ganadas.length} de {INSIGNIAS.length})</p>
      <div className="rd-ins">{INSIGNIAS.map((i) => <div key={i.id} className={"rd-in" + (ganadas.includes(i.id) ? " rd-on" : "")}><span>{ganadas.includes(i.id) ? i.emoji : "🔒"}</span><b>{i.nombre}</b><small>{i.info}</small></div>)}</div>
    </div>
  );
}

function Ventana({ t, onCerrar, onAbrirProyecto }) {
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label={t.titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>{t.emoji} {t.titulo}</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        {t.id === "pasaporte" && <Pasaporte onAbrirProyecto={onAbrirProyecto} cerrar={onCerrar} />}
        {t.id === "lectura" && <Lectura />}
        {t.id === "diario" && <Diario />}
        {t.id === "reto" && <Reto />}
        {t.id === "mentor" && <Mentor />}
        {t.id === "embajador" && <Embajador />}
        {t.id === "insignias" && <Insignias />}
      </div>
    </div>
  );
}

export default function ZonaRed({ onAbrirProyecto = () => {} }) {
  const [ok, setOk] = useState(dentro);
  const [pidiendo, setPidiendo] = useState(null);
  const [abierta, setAbierta] = useState(null);
  useEffect(() => {
    // Si llegó con ?ref=CODIGO, se guarda quién la invitó (solo en este celular).
    try { const r = new URLSearchParams(window.location.search).get("ref"); if (r && !localStorage.getItem("dc_ref")) localStorage.setItem("dc_ref", r.slice(0, 12)); } catch (e) {}
  }, []);
  const tocar = (t) => { if (ok) setAbierta(t.id); else setPidiendo(t.id); };
  const entrar = () => { marcar(true); setOk(true); const id = pidiendo; setPidiendo(null); if (id && id !== "_") setAbierta(id); };
  const salir = () => { marcar(false); setOk(false); setAbierta(null); };
  const t = TARJETAS.find((x) => x.id === abierta);
  return (
    <section className="rd-sec" id="zona-red" aria-label="Red de confianza">
      <span className="zj-comp"><BotonCompartir hash="zona-red" titulo="Red de confianza DCUATES" texto="Un espacio personal para crecer con la comunidad" variante="claro" /></span>
      <p className="rd-paso">PASO 4 · CRECE</p>
      <h2 className="rd-tit">🌳 RED DE CONFIANZA</h2>
      <p className="rd-sub">{ok ? <>Tu espacio personal para crecer. <button type="button" onClick={salir}>Salir 🔒</button></> : <>Por invitación: actividades tuyas para crecer a tu ritmo. <button type="button" className="rd-ent" onClick={() => setPidiendo("_")}>🔑 Entrar con mi clave</button></>}</p>
      <TiraAuto intervalo={4000} etiqueta="Red de confianza" fondo="#fff">
        {TARJETAS.map((c) => (
          <div className="zj-w" key={c.id}>
            <article className={"zj-card" + (ok ? "" : " zl-bloq")} style={{ borderColor: c.color }}>
              <span className="zj-ico" style={{ background: c.color }} aria-hidden="true">{ok ? c.emoji : "🔒"}</span>
              <h3>{c.titulo}</h3><p>{ok ? c.texto : "Solo con invitación."}</p>
              <button type="button" onClick={() => tocar(c)} style={{ background: ok ? c.color : "#6b7785" }}>{ok ? "Abrir" : "🔒 Ingresar"}</button>
            </article>
          </div>
        ))}
      </TiraAuto>
      {pidiendo && createPortal(<Acceso onCerrar={() => setPidiendo(null)} onEntrar={entrar} />, document.body)}
      {t && ok && createPortal(<Ventana t={t} onCerrar={() => setAbierta(null)} onAbrirProyecto={onAbrirProyecto} />, document.body)}
      <style>{`
.rd-sec{position:relative;max-width:72rem;margin:12px auto 6px;padding:14px 16px 6px;border-radius:20px;background:linear-gradient(135deg,#14532d,#166534);color:#fff}
.rd-paso{margin:0;text-align:center;font-size:11px;font-weight:900;letter-spacing:.12em;color:#bbf7d0}
.rd-tit{margin:2px 36px 0;font-size:18px;font-weight:900;text-align:center}
.rd-sub{margin:6px 0 8px;text-align:center;font-size:13px;font-weight:700;color:#dcfce7}
.rd-sub button{margin-left:6px;min-height:34px;border:0;border-radius:99px;padding:4px 12px;background:#fff;font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;color:#14532d}
.rd-ent{background:#ffe9a8!important}
.rd-lista{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.rd-barra{height:10px;border-radius:99px;background:#e3e8e5;overflow:hidden}.rd-barra i{display:block;height:100%;background:#2E9E5B}
.rd-fila b{font-size:15px}
.rd-ok{background:#eafaf0!important;color:#14532d!important}
.rd-area,.rd-lab input{width:100%;padding:10px;border:2px solid #d5dcd8;border-radius:12px;font-family:inherit;font-size:16px;color:#1f2a37}
.rd-lab{display:flex;flex-direction:column;gap:3px;font-size:13px;font-weight:900;color:#4a5560}
.rd-dias{display:grid;grid-template-columns:repeat(7,1fr);gap:5px}
.rd-dias button{min-height:46px;border:2px solid #d5dcd8;border-radius:12px;background:#fff;font-family:inherit;font-size:16px;font-weight:900;cursor:pointer;color:#1f2a37}
.rd-dias .rd-on{background:#2E9E5B;border-color:#2E9E5B;color:#fff}
.rd-ins{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.rd-in{display:flex;flex-direction:column;align-items:center;gap:1px;padding:8px 6px;border-radius:12px;background:#f1f5f2;text-align:center;opacity:.65}
.rd-in.rd-on{background:#fff4d6;opacity:1}
.rd-in span{font-size:28px}.rd-in b{font-size:12.5px}.rd-in small{font-size:11px;font-weight:600;color:#5b6675;line-height:1.2}
`}</style>
    </section>
  );
}
