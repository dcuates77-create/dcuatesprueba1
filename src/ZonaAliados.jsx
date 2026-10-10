// ZONA DE ALIADOS, PATROCINADORES, VOLUNTARIOS Y AMIGOS — barra con candado general y candado por tarjeta/perfil.
// Candado sencillo de prueba (claves en src/datos/aliados.js): no pongas aquí información confidencial.
import React, { useState } from "react";
import { createPortal } from "react-dom";
import TiraAuto from "./TiraAuto.jsx";
import BotonCompartir from "./BotonCompartir.jsx";
import { GOOGLE_SHEETS_URL, WHATSAPP_NUMERO } from "./datos/config.js";
import { LOGROS_ITEMS } from "./datos/cintas.js";
import { ACTIVIDADES_VOLUNTARIOS, BENEFICIOS, MENSAJES_DIFUSION, PERFILES, TARJETAS_ALIADOS } from "./datos/aliados.js";
import { CasillaAcepto, useAceptacion } from "./componentes/legal.jsx";

const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => { const [, m, d] = f.split("-").map(Number); return `${d} ${MESES[m - 1]}`; };
const leerPerfil = () => { try { const p = sessionStorage.getItem("dc_perfil"); return PERFILES[p] ? p : null; } catch (e) { return null; } };
const guardarPerfil = (p) => { try { p ? sessionStorage.setItem("dc_perfil", p) : sessionStorage.removeItem("dc_perfil"); } catch (e) {} };
const permitido = (t, perfil) => !!perfil && (t.perfiles === "todos" || t.perfiles.includes(perfil));

function Acceso({ onCerrar, onEntrar }) {
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const entrar = (e) => {
    e.preventDefault();
    const k = clave.trim().toLowerCase();
    const p = Object.keys(PERFILES).find((x) => PERFILES[x].clave.toLowerCase() === k);
    if (!p) { setError("Esa clave no es válida. Revísala o solicítala por WhatsApp."); return; }
    onEntrar(p);
  };
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Acceso a la zona" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🔐 Entrar a la zona</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Esta zona es para quienes ya forman parte de la red de DCUATES. Escribe la clave que te compartimos.</p>
        <form className="pr-form" onSubmit={entrar}>
          <label>Tu clave<input value={clave} onChange={(e) => { setClave(e.target.value); setError(""); }} placeholder="Ej. aliado2026" autoComplete="off" autoCapitalize="none" /></label>
          {error && <p className="pr-err" role="alert">{error}</p>}
          <button type="submit" className="pr-enviar">🔓 Entrar</button>
        </form>
        <a className="in-btn in-sec2" href={wa("Hola, quisiera solicitar acceso a la Zona de Aliados, Patrocinadores, Voluntarios y Amigos de DCUATES.")} target="_blank" rel="noopener noreferrer">💬 Solicitar mi clave por WhatsApp</a>
        <p className="pr-nota">Nunca compartas tu clave con desconocidos. DCUATES jamás te la pedirá por mensaje.</p>
      </div>
    </div>
  );
}

function Formulario({ tipo, perfil, ph, boton, etiqueta, extra, onListo }) {
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [contacto, setContacto] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const ac = useAceptacion();
  const enviar = async (e) => {
    e.preventDefault();
    if (texto.trim().length < 8) { setError("Cuéntanos un poco más (una frase corta basta)."); return; }
    if (!ac.validar()) return;
    setError("");
    const datos = new URLSearchParams({ Tipo: tipo, Perfil: PERFILES[perfil].nombre, Nombre: nombre || "Sin nombre", Contacto: contacto, Mensaje: texto, Estado: "Recibido", Fecha: new Date().toLocaleString("es-MX") });
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: datos }); } catch (err) { console.error("No se pudo guardar:", err); }
    setOk(true); ac.reiniciar(); onListo && onListo();
  };
  if (ok) return (
    <div className="zj-resp zj-bien"><p className="zj-bien-e">✅</p><p><b>¡Gracias! Quedó como “Recibido”.</b></p><p>La administración lo revisará y te responderá.</p>
      <button type="button" onClick={() => { setOk(false); setTexto(""); }}>Enviar otro</button></div>
  );
  return (
    <form className="pr-form" onSubmit={enviar}>
      {extra && <p className="pr-nota">{extra}</p>}
      <label>Tu nombre o negocio<input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Panadería Café Sol" /></label>
      <label>{etiqueta}<textarea rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={ph} /></label>
      <label>WhatsApp o correo<input value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Para responderte" /></label>
      <CasillaAcepto ac={ac} id={`acepta_zl_${tipo.replace(/\s/g, "")}`} />
      {error && <p className="pr-err" role="alert">{error}</p>}
      <button type="submit" className="pr-enviar">{boton}</button>
    </form>
  );
}

function Ventana({ tarjeta, perfil, agenda, onCerrar }) {
  const P = PERFILES[perfil];
  const hoy = new Date().toISOString().slice(0, 10);
  const proximos = agenda.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 8);
  const [copiado, setCopiado] = useState(-1);
  const copiar = async (t, i) => { try { await navigator.clipboard.writeText(t); setCopiado(i); setTimeout(() => setCopiado(-1), 1500); } catch (e) {} };
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label={tarjeta.titulo} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>{tarjeta.emoji} {tarjeta.titulo}</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zl-perfil" style={{ background: P.color }}>{P.emoji} Perfil: {P.nombre}</p>
        {tarjeta.id === "beneficios" && (
          <div className="zl-lista">{BENEFICIOS[perfil].map((b, i) => <div className="ag-ev" key={i}><p>✔️ {b}</p></div>)}
            <a className="in-btn" href={wa(`Hola, soy ${P.nombre} de DCUATES y quiero conocer mis beneficios.`)} target="_blank" rel="noopener noreferrer">💬 Preguntar por mis beneficios</a></div>
        )}
        {tarjeta.id === "ofrece" && <Formulario tipo="Beneficio aliado" perfil={perfil} etiqueta="¿Qué quieres ofrecer a la comunidad?" ph="Ej. 10% en pasteles presentando el cupón DCUATES, vigente hasta diciembre." boton="🏷️ Enviar mi beneficio" extra="Tu cupón, descuento o regalo puede aparecer en Cupones y Promos y en Juega y gana. Antes lo revisamos contigo." />}
        {tarjeta.id === "admin" && <Formulario tipo="Contacto admin" perfil={perfil} etiqueta="¿En qué podemos ayudarte?" ph="Consulta, acuerdo, gestión o duda particular." boton="📨 Enviar a la administración" extra="Tu mensaje llega directo a la administración. Para urgencias usa WhatsApp." />}
        {tarjeta.id === "impacto" && (
          <div className="zl-lista">
            <p className="pr-nota">Lo que hemos logrado juntos (cifras acumuladas de la comunidad):</p>
            {LOGROS_ITEMS.slice(0, 9).map((l, i) => <div className="ag-ev" key={i}><p>{l.texto}</p></div>)}
            <a className="in-btn" href={wa(`Hola, soy ${P.nombre} y me gustaría recibir el reporte de impacto detallado.`)} target="_blank" rel="noopener noreferrer">💬 Pedir mi reporte detallado</a>
          </div>
        )}
        {tarjeta.id === "voluntarios" && (
          <div className="zl-lista">
            <p className="pr-nota">Actividades abiertas:</p>
            {ACTIVIDADES_VOLUNTARIOS.map((a, i) => <div className="ag-ev" key={i}><b>{a.titulo}</b><p>{a.info}</p><a href={wa(`Hola, quiero apoyar en: ${a.titulo}.`)} target="_blank" rel="noopener noreferrer">🙋 Me apunto ›</a></div>)}
            <p className="zj-et">Registrar mis horas</p>
            <Formulario tipo="Horas voluntario" perfil={perfil} etiqueta="¿Qué hiciste y cuántas horas?" ph="Ej. 3 horas apoyando en la tertulia del sábado." boton="🕒 Registrar horas" extra="Con tus horas podemos emitir tu constancia de participación." />
          </div>
        )}
        {tarjeta.id === "reuniones" && (
          <div className="zl-lista">
            {proximos.length === 0 && <p className="ag-vacio">Aún no hay fechas próximas. Escríbenos para proponer una reunión.</p>}
            {proximos.map((e, i) => <div className="ag-ev" key={i}><b>📅 {fmt(e.fecha)} · {e.titulo}</b>{e.info && <p>{e.info}</p>}</div>)}
            <a className="in-btn" href={wa(`Hola, soy ${P.nombre} de DCUATES y quiero proponer o confirmar una reunión.`)} target="_blank" rel="noopener noreferrer">💬 Proponer o confirmar reunión</a>
          </div>
        )}
        {tarjeta.id === "difusion" && (
          <div className="zl-lista">
            <p className="pr-nota">Copia o comparte estos mensajes. Cada persona que invites suma a la comunidad.</p>
            {MENSAJES_DIFUSION.map((m, i) => (
              <div className="ag-ev" key={i}><p>{m}</p>
                <div className="ca-btns"><button type="button" onClick={() => copiar(m, i)}>{copiado === i ? "✔️ Copiado" : "📋 Copiar"}</button><a href={wa(m)} target="_blank" rel="noopener noreferrer">💬 Compartir</a></div></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ZonaAliados({ agenda = [] }) {
  const [perfil, setPerfil] = useState(leerPerfil);
  const [pidiendo, setPidiendo] = useState(null); // id de tarjeta pendiente o "_"
  const [abierta, setAbierta] = useState(null);
  const P = perfil ? PERFILES[perfil] : null;
  const tocar = (t) => {
    if (!perfil) { setPidiendo(t.id); return; }
    if (permitido(t, perfil)) setAbierta(t.id); else setPidiendo(t.id);
  };
  const entrar = (p) => {
    guardarPerfil(p); setPerfil(p); const t = TARJETAS_ALIADOS.find((x) => x.id === pidiendo);
    setPidiendo(null); if (t && permitido(t, p)) setAbierta(t.id);
  };
  const salir = () => { guardarPerfil(null); setPerfil(null); setAbierta(null); };
  const tarjeta = TARJETAS_ALIADOS.find((t) => t.id === abierta);
  const nombresPerfiles = (t) => t.perfiles === "todos" ? "Todos los perfiles" : t.perfiles.map((p) => PERFILES[p].nombre).join(", ");

  return (
    <section className="zl-sec" id="zona-aliados" aria-label="Zona de aliados, patrocinadores, voluntarios y amigos">
      <span className="zj-comp"><BotonCompartir hash="zona-aliados" titulo="Zona de aliados, patrocinadores, voluntarios y amigos" texto="Beneficios y contacto para quienes forman parte de la red DCUATES" variante="claro" /></span>
      <h2 className="zl-tit">🔐 ZONA DE ALIADOS, PATROCINADORES, VOLUNTARIOS Y AMIGOS</h2>
      {P ? (
        <p className="zl-sub"><span style={{ background: P.color }}>{P.emoji} Perfil: {P.nombre}</span> <button type="button" onClick={salir}>Salir 🔒</button></p>
      ) : (
        <p className="zl-sub">Beneficios, reuniones y contacto directo con la administración. <button type="button" className="zl-ent" onClick={() => setPidiendo("_")}>🔑 Entrar con mi clave</button></p>
      )}
      <TiraAuto intervalo={4000} etiqueta="Zona de aliados" fondo="#fff">
        {TARJETAS_ALIADOS.map((t) => {
          const ok = permitido(t, perfil);
          return (
            <div className="zj-w" key={t.id}>
              <article className={"zj-card" + (ok ? "" : " zl-bloq")} style={{ borderColor: t.color }}>
                <span className="zj-ico" style={{ background: t.color }} aria-hidden="true">{ok ? t.emoji : "🔒"}</span>
                <h3>{t.titulo}</h3>
                <p>{ok ? t.texto : `Solo para: ${nombresPerfiles(t)}.`}</p>
                <button type="button" onClick={() => tocar(t)} style={{ background: ok ? t.color : "#6b7785" }}>{ok ? "Abrir" : "🔒 Ingresar"}</button>
              </article>
            </div>
          );
        })}
      </TiraAuto>
      {pidiendo && createPortal(<Acceso onCerrar={() => setPidiendo(null)} onEntrar={entrar} />, document.body)}
      {tarjeta && perfil && createPortal(<Ventana tarjeta={tarjeta} perfil={perfil} agenda={agenda} onCerrar={() => setAbierta(null)} />, document.body)}
      <style>{`
.zl-sec{position:relative;max-width:72rem;margin:12px auto 6px;padding:14px 16px 6px;border-radius:20px;background:linear-gradient(135deg,#1f2a37,#33415a);color:#fff}
.zl-tit{margin:0 36px;font-size:16px;font-weight:900;text-align:center;line-height:1.2}
.zl-sub{margin:6px 0 8px;text-align:center;font-size:13px;font-weight:700;color:#dbe4ef}
.zl-sub span{display:inline-block;border-radius:99px;padding:3px 10px;font-weight:900;color:#fff}
.zl-sub button{margin-left:6px;min-height:34px;border:0;border-radius:99px;padding:4px 12px;background:#fff;font-family:inherit;font-size:12.5px;font-weight:900;cursor:pointer;color:#1f2a37}
.zl-ent{background:#ffe9a8!important}
.zl-bloq{opacity:.92}
.zl-perfil{display:inline-block;margin:0 0 8px;padding:4px 12px;border-radius:99px;color:#fff;font-size:13px;font-weight:900}
.zl-lista{display:flex;flex-direction:column;gap:8px}
.ca-lista{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.ca-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ca-btns a,.ca-btns button{display:inline-grid;place-items:center;min-height:42px;padding:6px 12px;border:0;border-radius:12px;background:#2E9E5B;color:#fff;font-family:inherit;font-size:14px;font-weight:900;text-decoration:none;cursor:pointer}
.ca-btns button{background:#1f2a37}
`}</style>
    </section>
  );
}
