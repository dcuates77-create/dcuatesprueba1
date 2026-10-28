// ÁREA RESERVADA (e52) — vista de UN elemento por su enlace #reservado-ID (datos de tu hoja de Google, validados por el Apps Script)
// + el índice solo para administración (IndiceReservado, dentro de la pestaña «Reservado», visible con ?admin=1).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { esAdmin } from "./datos/config.js";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { pedirElemento, pedirIndice, enlaceElemento, leerClaveAdmin, guardarClaveAdmin, olvidarClaveAdmin } from "./utilidades/reservado.js";

const copiar = async (txt) => {
  try { await navigator.clipboard.writeText(txt); return true; } catch (e) { /* intenta el método antiguo */ }
  try { const a = document.createElement("textarea"); a.value = txt; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select(); const ok = document.execCommand("copy"); document.body.removeChild(a); return !!ok; } catch (e) { return false; }
};

export default function Reservado() {
  const [id, setId] = useState(null);
  const [estado, setEstado] = useState("cargando"); // cargando | ok | clave | nada | red
  const [dato, setDato] = useState(null);
  const [clave, setClave] = useState("");
  const [aviso, setAviso] = useState("");
  const cerrar = () => {
    setId(null); setDato(null); setClave(""); setAviso("");
    // Se limpia el # un instante después: el botón «atrás» propio de la página también mueve el historial.
    setTimeout(() => { try { if (/^#reservado-/.test(window.location.hash)) history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (e) { /* ignorar */ } }, 250);
  };
  const oculta = useAtras(!!id, cerrar);
  const cargar = async (elId, k) => {
    setEstado("cargando");
    const r = await pedirElemento(elId, k);
    if (r && r.ok && r.item) { setDato(r.item); setEstado("ok"); }
    else if (r && r.motivo === "clave") { setDato({ tipo: r.tipo, t: r.t }); setEstado("clave"); if (k) setAviso("Clave incorrecta"); }
    else if (r && r.motivo === "red") setEstado("red");
    else setEstado("nada");
  };
  useEffect(() => {
    const leer = () => {
      const h = decodeURIComponent(window.location.hash || "").replace("#", "");
      if (h.startsWith("reservado-") && h.length > 10) { const x = h.slice(10); setId(x); setClave(""); setAviso(""); registrar("reservado_abrir"); cargar(x); }
    };
    leer();
    window.addEventListener("hashchange", leer);
    return () => window.removeEventListener("hashchange", leer);
  }, []);
  if (!id) return null;
  const copiarEnlace = async () => { setAviso((await copiar(enlaceElemento(id))) ? "✅ Enlace copiado" : "No se pudo copiar"); setTimeout(() => setAviso(""), 2500); };
  return createPortal(
    <div className="rv-fondo" onClick={cerrar} style={oculta ? { display: "none" } : undefined}>
      <style>{CSS_RV}</style>
      <div className="rv-hoja" role="dialog" aria-modal="true" aria-label="Información compartida" onClick={(e) => e.stopPropagation()}>
        <div className="rv-cab"><b>🔐 DCUATES · Información compartida</b><button type="button" onClick={cerrar} aria-label="Cerrar">✕</button></div>
        {estado === "cargando" && <p className="rv-txt" role="status">Cargando…</p>}
        {estado === "nada" && <p className="rv-txt">Este enlace ya no está disponible. Escríbenos por WhatsApp y te ayudamos.</p>}
        {estado === "red" && <p className="rv-txt">No pudimos cargarlo. Revisa tu conexión e inténtalo de nuevo.</p>}
        {(estado === "clave" || estado === "ok") && dato && (
          <>
            {dato.tipo && <span className="rv-tipo">{dato.tipo}</span>}
            <h2 style={{ margin: "4px 0 2px", fontSize: 21, fontWeight: 900 }}>{dato.t}</h2>
            {estado === "clave" && (
              <div>
                <p className="rv-txt" style={{ margin: "8px 0 0" }}>Este contenido pide una clave.</p>
                <input className="rv-in" type="password" autoComplete="off" value={clave} onChange={(e) => { setClave(e.target.value); setAviso(""); }} placeholder="Escribe la clave" aria-label="Clave" />
                <div className="rv-b"><button type="button" className="p" onClick={() => clave.trim() && cargar(id, clave.trim())}>Ver contenido</button></div>
                {aviso && <p className="rv-av" style={{ color: "#b42318" }} role="alert">{aviso}</p>}
              </div>
            )}
            {estado === "ok" && (
              <>
                {dato.d && <p style={{ margin: "0 0 6px", fontSize: 14.5, fontWeight: 700, color: "#4a5f53" }}>{dato.d}</p>}
                {dato.version && <p className="rv-ver">Versión {dato.version}</p>}
                {dato.texto && <p className="rv-txt">{dato.texto}</p>}
                <div className="rv-b">
                  {dato.enlace && <a className="p" href={dato.enlace} target="_blank" rel="noopener noreferrer">Abrir documento ›</a>}
                  {esAdmin() && <button type="button" onClick={copiarEnlace}>Copiar enlace</button>}
                  <button type="button" onClick={() => window.open("https://wa.me/525540476247?text=" + encodeURIComponent(`¡Hola DCUATES! Vi: ${dato.t}`), "_blank", "noopener")}>Escribir a DCUATES</button>
                </div>
                {aviso && <p className="rv-av" role="status">{aviso}</p>}
              </>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// Índice para administración (se muestra dentro de la pestaña «Reservado»).
export function IndiceReservado() {
  const [clave, setClave] = useState("");
  const [lista, setLista] = useState(null);
  const [msg, setMsg] = useState("");
  const [cargando, setCargando] = useState(false);
  const entrar = async (k) => {
    setCargando(true); setMsg("");
    const r = await pedirIndice(k);
    setCargando(false);
    if (r && r.ok && Array.isArray(r.items)) { guardarClaveAdmin(k); setLista(r.items); }
    else { if (r && r.motivo === "clave") { olvidarClaveAdmin(); setMsg("Clave de administrador incorrecta."); } else if (r && r.motivo === "sin-hoja") setMsg("Falta la pestaña «Reservado» en tu hoja (mira extras/apps-script-reservado.txt)."); else setMsg("No pudimos cargar el índice. Revisa que pegaste el bloque doGet y publicaste una «Nueva versión»."); }
  };
  useEffect(() => { const k = leerClaveAdmin(); if (k) entrar(k); }, []);
  if (!esAdmin()) return <p className="rv-nota">Esta sección es solo para administración.</p>;
  const grupos = lista ? [...new Set(lista.map((x) => x.perfil || "Sin perfil"))] : [];
  // Mensaje listo (e53): saludo + título + enlace; si tiene clave, avisa que se manda aparte (con «Copiar clave»).
  const mensajeListo = (x) => `Hola 👋 De parte de DCUATES te comparto: ${x.t}\n${enlaceElemento(x.id)}${x.conClave ? "\n(Te mando la clave en otro mensaje.)" : ""}`;
  const porWA = (x) => window.open("https://wa.me/?text=" + encodeURIComponent(mensajeListo(x)), "_blank", "noopener");
  const copiarEn = async (x) => { setMsg((await copiar(enlaceElemento(x.id))) ? "✅ Enlace copiado" : "No se pudo copiar"); setTimeout(() => setMsg(""), 2500); };
  const copiarMensaje = async (x) => { setMsg((await copiar(mensajeListo(x))) ? "✅ Mensaje copiado: pégalo en WhatsApp" : "No se pudo copiar"); setTimeout(() => setMsg(""), 2800); };
  const copiarClave = async (x) => { setMsg((await copiar(x.clave)) ? "✅ Clave copiada: mándala en un mensaje aparte" : "No se pudo copiar"); setTimeout(() => setMsg(""), 2800); };
  return (
    <div className="rv-ind">
      <style>{CSS_RV}</style>
      {!lista && (
        <div>
          <p className="rv-nota">Escribe tu clave de administrador (la del Apps Script). Se guarda solo en este teléfono.</p>
          <input className="rv-in" type="password" autoComplete="off" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Clave de administrador" aria-label="Clave de administrador" />
          <div className="rv-b"><button type="button" className="p" disabled={cargando || !clave.trim()} onClick={() => entrar(clave.trim())}>{cargando ? "Cargando…" : "Entrar"}</button></div>
        </div>
      )}
      {lista && (
        <>
          <p className="rv-nota">Solo tú ves este índice. Los textos se editan en tu hoja de Google (pestaña «Reservado»). Cada elemento tiene su enlace propio: quien lo reciba verá únicamente ese elemento. «Inactivo (borrador)» = Activo en «No»: nadie lo ve con el enlace.</p>
          {lista.length === 0 && <p className="rv-nota">Aún no hay elementos. Agrega filas en la pestaña «Reservado».</p>}
          {grupos.map((g) => (
            <div key={g}>
              <h3 className="rv-per">{g} ({lista.filter((x) => (x.perfil || "Sin perfil") === g).length})</h3>
              {lista.filter((x) => (x.perfil || "Sin perfil") === g).map((x) => (
                <div className="rv-fila" key={x.id}>
                  <span className="rv-tipo">{x.tipo}{x.conClave ? " · con clave" : ""}{x.activo === false ? " · inactivo (borrador)" : ""}{x.vencido ? " · VENCIDO" : x.vence ? " · vence " + x.vence : ""}{x.version ? " · v" + x.version : ""}</span>
                  <b>{x.t}</b>{x.d && <small>{x.d}</small>}
                  <div className="rv-b">
                    <button type="button" onClick={() => window.open(enlaceElemento(x.id), "_blank", "noopener")}>Ver</button>
                    <button type="button" className="p" onClick={() => copiarEn(x)}>Copiar enlace</button>
                    <button type="button" onClick={() => copiarMensaje(x)}>Copiar mensaje</button>
                    <button type="button" onClick={() => porWA(x)}>WhatsApp</button>
                    {x.clave && <button type="button" onClick={() => copiarClave(x)}>Copiar clave</button>}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="rv-b" style={{ marginTop: 10 }}>
            <button type="button" onClick={() => entrar(leerClaveAdmin())}>↻ Actualizar</button>
            <button type="button" onClick={() => { olvidarClaveAdmin(); setLista(null); setClave(""); }}>Cerrar sesión de administración</button>
          </div>
        </>
      )}
      {msg && <p className="rv-av" role="status" style={msg.startsWith("✅") ? undefined : { color: "#b42318" }}>{msg}</p>}
    </div>
  );
}

const CSS_RV = `
.rv-fondo{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.rv-hoja{background:#fbf7ec;width:100%;max-width:640px;max-height:92vh;overflow:auto;border-radius:24px 24px 0 0;padding:0 14px 18px;color:#0f2d1e}
.rv-cab{position:sticky;top:0;background:#3b2a6b;color:#fff;margin:0 -14px 12px;padding:12px 14px;display:flex;align-items:center;gap:8px;border-radius:24px 24px 0 0}
.rv-cab b{flex:1;font-size:16px;font-weight:900}.rv-cab button{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#3b2a6b;font-size:20px;font-weight:900;cursor:pointer}
.rv-nota{font-size:13.5px;font-weight:700;line-height:1.4;background:#fff4d6;border-radius:12px;padding:8px 10px;margin:0 0 12px;color:#0f2d1e}
.rv-ind{font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;text-align:left}
.rv-per{margin:12px 0 6px;font-size:15px;font-weight:900}
.rv-fila{background:#fff;border:2px solid #d9d2f0;border-radius:14px;padding:10px;margin:0 0 8px}
.rv-fila b{display:block;font-size:15px}.rv-fila small{display:block;font-size:13px;font-weight:700;color:#4a5f53;margin:2px 0 6px}
.rv-tipo{display:inline-block;background:#3b2a6b;color:#fff;border-radius:999px;font-size:11.5px;font-weight:900;padding:2px 8px;margin-bottom:4px}
.rv-b{display:flex;flex-wrap:wrap;gap:6px}.rv-b button,.rv-b a{min-height:44px;padding:0 14px;border-radius:999px;border:2px solid #3b2a6b;background:#fff;color:#3b2a6b;font-weight:900;font-size:14px;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;text-decoration:none}
.rv-b .p{background:#3b2a6b;color:#fff}.rv-b button:disabled{opacity:.5}
.rv-txt{font-size:16px;line-height:1.5;font-weight:600;white-space:pre-line;margin:8px 0 12px}
.rv-in{width:100%;box-sizing:border-box;min-height:48px;border:2px solid #cbd5e1;border-radius:12px;padding:0 10px;font:inherit;font-size:16px;font-weight:700;margin:6px 0}
.rv-ver{margin:0 0 6px;font-size:12.5px;font-weight:900;color:#5b6b62}
.rv-av{font-size:13.5px;font-weight:900;color:#0e7c4f;margin:6px 0 0}
`;
