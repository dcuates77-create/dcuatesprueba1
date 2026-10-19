// AGENDA PLUS: ventana con 4 botones — Agenda-Calendario, Mapas de la zona, Tablero de anuncios y Directorio PLUS.
// Se abre con el evento dcuates:abrir-plus (detail opcional: "mapas" | "tablero" | "directorio") o con el hash #plus.
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { GOOGLE_SHEETS_URL, WHATSAPP_NUMERO } from "./datos/config.js";
import { CasillaAcepto, ErrorAcepto, useAceptacion } from "./componentes/legal.jsx";
import { LogoMarca } from "./componentes/encabezado.jsx";
import { registrar } from "./analitica";
import {
  ANUNCIOS_EJEMPLO, DIRECTORIOS_CLAVE, DIRECTORIO_AREAS, DIRECTORIO_EJEMPLO, MAPAS, REGLAS_TABLERO, TIPOS_ANUNCIO, tipoAnuncio
} from "./datos/plus.js";

export const abrirPlus = (cual) => window.dispatchEvent(new CustomEvent("dcuates:abrir-plus", { detail: cual || "" }));
const wa = (txt, tel) => "https://wa.me/" + (tel ? (tel.length === 10 ? "52" + tel : tel) : WHATSAPP_NUMERO) + "?text=" + encodeURIComponent(txt);
const COL = ["#2E9E5B", "#1B6F8A", "#7a5ad8", "#C2410C", "#C2255C"];

/* ---------- Botón grande (Nosotros y demás secciones) ---------- */
export function BotonPlus() {
  return (
    <>
      <button type="button" className="ap-btn" onClick={() => abrirPlus()}>
        <span className="ap-btn-e" aria-hidden="true">+</span>
        <span className="ap-btn-t"><b>AGENDA PLUS</b><small>Agenda · Mapas · Tablero · Directorio</small></span>
      </button>
      <style>{`.ap-btn{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;min-height:58px;padding:8px 14px;border:2px solid #fff;border-radius:16px;background:#14532d;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}.ap-btn:active{filter:brightness(.92)}.ap-btn-e{flex:none;width:34px;height:34px;border-radius:50%;background:#fff;color:#14532d;font-size:28px;font-weight:900;line-height:32px;text-align:center}.ap-btn-t{display:flex;flex-direction:column}.ap-btn-t b{font-size:17px;font-weight:900;letter-spacing:.04em;color:#fff}.ap-btn-t small{font-size:12.5px;font-weight:700;opacity:.95;color:#fff}`}</style>
    </>
  );
}

/* ---------- Ventana base ---------- */
function Caja({ titulo, hash, onCerrar, children, hub }) {
  const oculta = useAtras(true, onCerrar, hub ? { hub: true } : undefined);
  if (oculta) return null;
  return createPortal(
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>{titulo}</b>
          {hash && <BotonCompartir hash={hash} titulo={titulo} texto="Mira esto en DCUATES" variante="circulo" />}
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        {children}
      </div>
      <style>{CSS}</style>
    </div>, document.body);
}

/* ---------- Mapas ---------- */
function Mapas({ onCerrar }) {
  const [abierto, setAbierto] = useState("");
  // Al abrir un mapa se sube a su título; al cerrarlo se regresa a la lista de mapas (con el mapa cerrado al centro).
  const ir = (id, bloque) => setTimeout(() => { const e = document.getElementById(id); if (e && e.scrollIntoView) e.scrollIntoView({ block: bloque, behavior: "smooth" }); }, 80);
  const alternar = (m, ab) => { setAbierto(ab ? "" : m.id); ir("ap-m-" + m.id, ab ? "center" : "start"); };
  return (
    <Caja titulo="🗺️ Mapas de la zona" hash="mapas" onCerrar={onCerrar}>
      <p className="zj-p">Toca una zona y su mapa se abre aquí mismo. Puedes moverlo, acercarlo o abrirlo en Google Maps.</p>
      {MAPAS.map((m, i) => {
        const ab = abierto === m.id;
        return (
          <div className="ap-card" id={"ap-m-" + m.id} key={m.id} style={{ borderColor: COL[i % COL.length] }}>
            <button type="button" className="ap-cab" style={{ background: COL[i % COL.length] }} onClick={() => alternar(m, ab)} aria-expanded={ab}>
              <span><b>📍 {m.t}</b><small>{m.nota}</small></span><i>{ab ? "−" : "+"}</i>
            </button>
            {ab && (
              <div className="ap-cuerpo">
                <iframe className="ap-mapa" title={"Mapa de " + m.t} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={"https://www.google.com/maps?q=" + encodeURIComponent(m.q) + "&hl=es&output=embed"} />
                <a className="ap-link" href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(m.q)} target="_blank" rel="noopener noreferrer">↗️ Abrir en Google Maps</a>
                <button type="button" className="ap-volver" onClick={() => alternar(m, true)}>⬆️ Cerrar este mapa y ver los demás</button>
              </div>
            )}
          </div>
        );
      })}
      <p className="ap-peq">Los mapas son de Google Maps. Al abrir uno, Google puede usar sus propias cookies.</p>
    </Caja>
  );
}

/* ---------- Tablero de anuncios ---------- */
function Tablero({ onCerrar, anuncios }) {
  const lista = anuncios.length ? anuncios : ANUNCIOS_EJEMPLO;
  const [filtro, setFiltro] = useState("todos");
  const [tipo, setTipo] = useState("renta");
  const [tit, setTit] = useState(""); const [txt, setTxt] = useState(""); const [con, setCon] = useState("");
  const ac = useAceptacion();
  const [enviado, setEnviado] = useState(false);
  const [enlace, setEnlace] = useState("");
  const vistos = lista.filter((a) => filtro === "todos" || a.tipo === filtro);
  const listo = tit.trim().length > 2 && txt.trim().length > 5;
  const nombreTipo = (TIPOS_ANUNCIO.find((x) => x[0] === tipo) || TIPOS_ANUNCIO[4])[2];
  const mensaje = "Hola DCUATES, quiero publicar un anuncio en el Tablero.\nTipo: " + nombreTipo + "\nTítulo: " + tit.trim() + "\nAnuncio: " + txt.trim() + (con.trim() ? "\nContacto: " + con.trim() : "");
  // Envío: valida la casilla de aceptación, guarda en Google Sheets (Tipo "Anuncio"), abre WhatsApp y muestra el acuse.
  const enviar = (e) => {
    e.preventDefault();
    if (!listo) return;
    if (!ac.validar()) return;
    registrar("formulario_enviado", { form: "anuncio" });
    try {
      fetch(GOOGLE_SHEETS_URL, {
        method: "POST", mode: "no-cors", keepalive: true,
        body: new URLSearchParams({ Tipo: "Anuncio", TipoApoyo: nombreTipo, Nombre: con.trim(), Detalle: tit.trim() + " — " + txt.trim(), AceptaTerminos: "Sí (Aviso y Términos, oct-2026)", Fecha: new Date().toLocaleString() })
      }).catch(() => {});
    } catch (err) {}
    const url = wa(mensaje);
    setEnlace(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setEnviado(true);
    setTimeout(() => { const el = document.getElementById("ap-acuse"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: "smooth" }); }, 80);
  };
  const otro = () => { setEnviado(false); setTipo("renta"); setTit(""); setTxt(""); setCon(""); ac.reiniciar(); };
  return (
    <Caja titulo="📌 Tablero de anuncios" hash="tablero" onCerrar={onCerrar}>
      <p className="zj-p">Anuncios de la comunidad: rentas, felicitaciones, recomendaciones, eventos de la zona y avisos.</p>
      <div className="ap-chips" role="tablist" aria-label="Filtrar anuncios">
        <button type="button" className={filtro === "todos" ? "on" : ""} onClick={() => setFiltro("todos")}>Todos</button>
        {TIPOS_ANUNCIO.map((x) => <button type="button" key={x[0]} className={filtro === x[0] ? "on" : ""} onClick={() => setFiltro(x[0])}>{x[1]} {x[2].split(" ")[0]}</button>)}
      </div>
      {vistos.length === 0 && <p className="ap-vacio">No hay anuncios de este tipo por ahora.</p>}
      {vistos.map((a, i) => {
        const T = tipoAnuncio(a.tipo);
        return (
          <article className="ap-anu" key={a.titulo + i} style={{ borderLeftColor: COL[i % COL.length] }}>
            <small>{T[1]} {T[2]}{a.ejemplo ? " · EJEMPLO" : ""}</small>
            <b>{a.titulo}</b>
            {a.texto && <p>{a.texto}</p>}
            {a.tel && <a className="ap-link" href={wa("Hola, vi su anuncio en el Tablero DCUATES: " + a.titulo, a.tel)} target="_blank" rel="noopener noreferrer">💬 Escribir por WhatsApp</a>}
          </article>
        );
      })}
      <p className="zj-et">📝 Registra tu anuncio</p>
      {enviado ? (
        <div className="ap-form ap-ok" id="ap-acuse" role="status">
          <div style={{ display: "flex", justifyContent: "center" }}><LogoMarca tam={84} /></div>
          <p style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.25 }}>¡Tu anuncio quedó registrado!</p>
          <p style={{ fontWeight: 700 }}>Lo revisaremos y, si cumple las reglas del tablero, lo publicaremos en la primera oportunidad.</p>
          <p className="g">¡Gracias y saludos!</p>
          <p className="ap-peq">¿No se abrió WhatsApp? <a href={enlace} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 900, color: "#128c7e", textDecoration: "underline" }}>Tócalo aquí</a></p>
          <button type="button" className="ap-volver" onClick={otro}>📝 Registrar otro anuncio</button>
        </div>
      ) : (
      <form className="ap-form" onSubmit={enviar} noValidate>
        <p className="ap-peq" style={{ marginTop: 0 }}>Puedes publicar: {TIPOS_ANUNCIO.map((x) => x[1] + " " + x[2].toLowerCase()).join(", ")} y todo lo que no esté en los demás servicios con registro.</p>
        <label>Tipo de anuncio
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>{TIPOS_ANUNCIO.map((x) => <option key={x[0]} value={x[0]}>{x[1]} {x[2]}</option>)}</select></label>
        <label>Título
          <input value={tit} onChange={(e) => setTit(e.target.value)} maxLength={80} placeholder="Ej. Se renta cuarto en Jardines" /></label>
        <label>Tu anuncio
          <textarea value={txt} onChange={(e) => setTxt(e.target.value)} maxLength={400} rows={4} placeholder="Describe lo que quieres publicar" /></label>
        <label>Cómo te contactan (opcional)
          <input value={con} onChange={(e) => setCon(e.target.value)} maxLength={80} placeholder="WhatsApp o nombre" /></label>
        <CasillaAcepto ac={ac} id="acepta_anuncio" />
        <button type="submit" className={"ap-enviar" + (listo ? "" : " off")} style={{ border: 0, width: "100%", fontFamily: "inherit", cursor: "pointer" }}>{listo ? "📲 Enviar por WhatsApp para revisión" : "Escribe el título y tu anuncio para enviarlo"}</button>
        <ErrorAcepto ac={ac} id="acepta_anuncio" />
        <ul className="ap-reglas">{REGLAS_TABLERO.map((r) => <li key={r}>{r}</li>)}</ul>
      </form>
      )}
    </Caja>
  );
}

/* ---------- Directorio PLUS ---------- */
function Directorio({ onCerrar, directorio }) {
  const lista = directorio.length ? directorio : DIRECTORIO_EJEMPLO;
  const [area, setArea] = useState("todas");
  const vistos = lista.filter((d) => area === "todas" || d.area === area);
  return (
    <Caja titulo="📖 Directorio PLUS" hash="directorio" onCerrar={onCerrar}>
      <p className="zj-p">Recomendaciones de la comunidad por áreas. El público está abierto; los demás directorios se abren con clave.</p>
      <p className="zj-et">🌐 Directorio público</p>
      <div className="ap-chips" role="tablist" aria-label="Filtrar por área">
        <button type="button" className={area === "todas" ? "on" : ""} onClick={() => setArea("todas")}>Todas</button>
        {DIRECTORIO_AREAS.map((x) => <button type="button" key={x[0]} className={area === x[0] ? "on" : ""} onClick={() => setArea(x[0])}>{x[1]} {x[2].split(" ")[0]}</button>)}
      </div>
      {vistos.length === 0 && <p className="ap-vacio">Aún no hay recomendaciones en esta área.</p>}
      {vistos.map((d, i) => {
        const A = DIRECTORIO_AREAS.find((x) => x[0] === d.area) || ["otros", "📌", "Otros"];
        return (
          <article className="ap-anu" key={d.nombre + i} style={{ borderLeftColor: COL[i % COL.length] }}>
            <small>{A[1]} {A[2]}{d.ejemplo ? " · EJEMPLO" : ""}</small>
            <b>{d.nombre}</b>
            {d.detalle && <p>{d.detalle}</p>}
            {d.tel && <a className="ap-link" href={wa("Hola, vi su recomendación en el Directorio DCUATES: " + d.nombre, d.tel)} target="_blank" rel="noopener noreferrer">💬 Escribir por WhatsApp</a>}
          </article>
        );
      })}
      <a className="ap-enviar" style={{ background: "#14532d", color: "#fff" }} href={wa("Hola DCUATES, quiero recomendar un servicio o negocio para el Directorio PLUS:\nÁrea: \nNombre: \nPor qué lo recomiendo: ")} target="_blank" rel="noopener noreferrer">➕ Recomendar algo para el directorio público</a>
      <p className="zj-et">🔒 Directorios con clave</p>
      <p className="ap-peq" style={{ marginTop: 0 }}>Para círculos de confianza, aliados, patrocinadores, amigos y familia. Los tipos de directorio se definirán pronto.</p>
      {DIRECTORIOS_CLAVE.map((x) => (
        <div className="ap-lock" key={x.id}>
          <span aria-hidden="true">🔒</span>
          <span><b>{x.t}</b><small>{x.d} Próximamente podrás entrar con tu clave.</small></span>
          <a href={wa("Hola DCUATES, quiero solicitar acceso al " + x.t + ".")} target="_blank" rel="noopener noreferrer">Solicitar clave</a>
        </div>
      ))}
    </Caja>
  );
}

/* ---------- Ventana principal (hub) ---------- */
function Principal({ onCerrar, abrirSub }) {
  const B = [
    ["📅", "Agenda-Calendario", "Eventos, cuenta regresiva, clima y recordatorios", () => window.dispatchEvent(new CustomEvent("dcuates:abrir-agenda"))],
    ["🗺️", "Mapas de la zona", "Jardines, Las Américas, Ciudad Azteca, CDMX y más", () => abrirSub("mapas")],
    ["📌", "Tablero de anuncios", "Rentas, felicitaciones, recomendaciones y eventos", () => abrirSub("tablero")],
    ["📖", "Directorio PLUS", "Recomendaciones por áreas, públicas y con clave", () => abrirSub("directorio")]
  ];
  return (
    <Caja titulo="AGENDA PLUS" hash="plus" onCerrar={onCerrar} hub>
      <p className="zj-p">Todo lo útil de la zona, en un solo lugar.</p>
      <div className="ap-grid">
        {B.map(([e, t, s, f], i) => (
          <button type="button" key={t} className="ap-op" style={{ background: COL[i % COL.length] }} onClick={f}>
            <span aria-hidden="true">{e}</span><span><b>{t}</b><small>{s}</small></span>
          </button>
        ))}
      </div>
    </Caja>
  );
}

export default function PlusHost({ anuncios = [], directorio = [] }) {
  const [ab, setAb] = useState(false);
  const [sub, setSub] = useState("");
  useEffect(() => {
    const f = (e) => { const d = e && e.detail; setAb(true); if (d === "mapas" || d === "tablero" || d === "directorio") setSub(d); };
    window.addEventListener("dcuates:abrir-plus", f);
    try { if (window.location.hash === "#plus") setAb(true); } catch (e) {}
    return () => window.removeEventListener("dcuates:abrir-plus", f);
  }, []);
  const cerrarSub = () => setSub("");
  return (
    <>
      {ab && <Principal onCerrar={() => { setAb(false); setSub(""); }} abrirSub={setSub} />}
      {ab && sub === "mapas" && <Mapas onCerrar={cerrarSub} />}
      {ab && sub === "tablero" && <Tablero onCerrar={cerrarSub} anuncios={anuncios} />}
      {ab && sub === "directorio" && <Directorio onCerrar={cerrarSub} directorio={directorio} />}
    </>
  );
}

const CSS = `
.ap-grid{display:flex;flex-direction:column;gap:8px}
.ap-op{display:flex;align-items:center;gap:12px;min-height:68px;padding:8px 12px;border:2px solid #fff;border-radius:16px;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.2)}
.ap-op>span:first-child{font-size:28px;flex:none}.ap-op b{display:block;font-size:16px;font-weight:900;color:#fff}.ap-op small{display:block;font-size:12.5px;font-weight:700;opacity:.95;color:#fff}
.ap-card{border:2px solid;border-radius:14px;margin-bottom:8px;overflow:hidden;background:#fff}
.ap-cab{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;min-height:52px;padding:8px 12px;border:0;color:#fff;font-family:inherit;text-align:left;cursor:pointer}
.ap-cab b{display:block;font-size:16px;font-weight:900;color:#fff}.ap-cab small{display:block;font-size:12.5px;font-weight:700;color:#fff;opacity:.95}.ap-cab i{font-style:normal;font-size:24px;font-weight:900}
.ap-cuerpo{padding:8px}.ap-mapa{display:block;width:100%;height:min(62vh,420px);min-height:300px;border:0;border-radius:10px;background:#e5e7eb}
.ap-link{display:block;margin-top:8px;padding:10px;border-radius:12px;background:#eef2ff;color:#1e3a8a;font-size:14.5px;font-weight:800;text-align:center;text-decoration:none}
.ap-volver{display:block;width:100%;margin-top:8px;min-height:46px;border:2px solid #0f4c5c;border-radius:12px;background:#fff;color:#0f4c5c;font-family:inherit;font-size:14.5px;font-weight:900;cursor:pointer}
.ap-ok{text-align:center;padding:16px 8px}.ap-ok p{margin:10px 0 0;color:#0f2d1e}.ap-ok .g{font-size:20px;font-weight:900;color:#e65100;text-transform:uppercase}
.ap-peq{margin:8px 2px;font-size:13px;font-weight:600;color:#475569;line-height:1.35}
.ap-chips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}
.ap-chips button{min-height:38px;padding:4px 10px;border:2px solid #cbd5e1;border-radius:999px;background:#fff;color:#0f172a;font-family:inherit;font-size:13.5px;font-weight:800;cursor:pointer}
.ap-chips button.on{background:#0f4c5c;border-color:#0f4c5c;color:#fff}
.ap-anu{margin-bottom:8px;padding:10px 12px;border:1px solid #e2e8f0;border-left:6px solid #2E9E5B;border-radius:12px;background:#fff;color:#0f172a}
.ap-anu small{display:block;font-size:12.5px;font-weight:800;color:#475569}.ap-anu b{display:block;margin-top:2px;font-size:15.5px;font-weight:900}.ap-anu p{margin:4px 0 0;font-size:14.5px;font-weight:600;line-height:1.35;color:#1f2a37}
.ap-vacio{margin:6px 0;font-size:14px;font-weight:700;color:#334155}
.ap-form{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:14px;background:#f1f5f4;color:#0f172a}
.ap-form label{display:flex;flex-direction:column;gap:3px;font-size:14px;font-weight:800}
.ap-form input,.ap-form select,.ap-form textarea{width:100%;border:2px solid #cbd5e1;border-radius:10px;padding:8px;font:inherit;font-size:15px;font-weight:600;background:#fff;color:#0f172a}
.ap-enviar{display:block;margin-top:6px;padding:13px 10px;border-radius:14px;background:#25D366;color:#073b1c;font-size:15px;font-weight:900;text-align:center;text-decoration:none}
.ap-enviar.off{background:#e2e8f0;color:#475569}
.ap-reglas{margin:6px 0 0;padding-left:20px;list-style:disc;font-size:13px;font-weight:600;line-height:1.4;color:#334155}
.ap-lock{display:flex;align-items:center;gap:10px;margin-bottom:8px;padding:10px;border:2px dashed #94a3b8;border-radius:14px;background:#f8fafc;color:#0f172a}
.ap-lock>span:first-child{font-size:24px;flex:none}.ap-lock>span:nth-child(2){flex:1;display:flex;flex-direction:column}.ap-lock b{font-size:15px;font-weight:900}.ap-lock small{font-size:12.5px;font-weight:600;color:#475569}
.ap-lock a{flex:none;padding:8px 10px;border-radius:10px;background:#0f4c5c;color:#fff;font-size:13px;font-weight:800;text-decoration:none;text-align:center}
`;
