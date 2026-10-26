// ÁREA RESERVADA (e50) — índice solo para administración + vista de un elemento por su enlace #reservado-ID.
// Los datos viven en src/datos/reservado.js (lee ahí la advertencia: no es seguridad real).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RESERVADO } from "./datos/reservado.js";
import { URL_SITIO, esAdmin } from "./datos/config.js";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";

const enlaceDe = (id) => `${URL_SITIO}/#reservado-${id}`;
const copiar = async (txt) => { try { await navigator.clipboard.writeText(txt); return true; } catch (e) { return false; } };

export function BotonReservado() {
  if (!esAdmin()) return null;
  return (
    <section aria-label="Área reservada" style={{ background: "#fff", borderRadius: 22, margin: "14px 16px", padding: "12px 14px", boxShadow: "0 4px 14px rgba(15,45,30,.12)", textAlign: "center", fontFamily: "Nunito,system-ui,sans-serif" }}>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("dcuates:abrir-reservado"))} style={{ minHeight: 48, width: "100%", border: 0, borderRadius: 999, background: "#3b2a6b", color: "#fff", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>🔐 Área reservada (solo administración)</button>
    </section>
  );
}

export default function Reservado() {
  const [vista, setVista] = useState(null); // null | {tipo:"indice"} | {tipo:"item", id}
  const [clave, setClave] = useState("");
  const [desbloq, setDesbloq] = useState(false);
  const [aviso, setAviso] = useState("");
  const cerrar = () => {
    setVista(null); setClave(""); setDesbloq(false); setAviso("");
    // Se limpia el # un instante después: el botón «atrás» propio de la página también mueve el historial.
    setTimeout(() => { try { if (/^#reservado/.test(window.location.hash)) history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (e) { /* ignorar */ } }, 250);
  };
  const oculta = useAtras(!!vista, cerrar);
  useEffect(() => {
    const leer = () => {
      const h = decodeURIComponent(window.location.hash || "").replace("#", "");
      if (h.startsWith("reservado-")) { setVista({ tipo: "item", id: h.slice(10) }); setClave(""); setDesbloq(false); registrar("reservado_abrir"); }
      else if (h === "reservado" && esAdmin()) setVista({ tipo: "indice" });
    };
    const alIndice = () => { if (esAdmin()) setVista({ tipo: "indice" }); };
    leer();
    window.addEventListener("hashchange", leer);
    window.addEventListener("dcuates:abrir-reservado", alIndice);
    return () => { window.removeEventListener("hashchange", leer); window.removeEventListener("dcuates:abrir-reservado", alIndice); };
  }, []);
  if (!vista) return null;
  const admin = esAdmin();
  const item = vista.tipo === "item" ? RESERVADO.items.find((x) => x.id === vista.id) : null;
  const visible = item && (!item.clave || desbloq);
  const copiarEnlace = async (id) => { setAviso((await copiar(enlaceDe(id))) ? "✅ Enlace copiado" : "No se pudo copiar; mantén presionado el enlace"); setTimeout(() => setAviso(""), 2500); };
  const porWA = (x) => window.open("https://wa.me/?text=" + encodeURIComponent(`DCUATES · ${x.tipo}: ${x.t}\n${enlaceDe(x.id)}`), "_blank", "noopener");
  return createPortal(
    <div className="rv-fondo" onClick={cerrar} style={oculta ? { display: "none" } : undefined}>
      <style>{`
.rv-fondo{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.rv-hoja{background:#fbf7ec;width:100%;max-width:640px;max-height:92vh;overflow:auto;border-radius:24px 24px 0 0;padding:0 14px 18px;color:#0f2d1e}
.rv-cab{position:sticky;top:0;background:#3b2a6b;color:#fff;margin:0 -14px 12px;padding:12px 14px;display:flex;align-items:center;gap:8px;border-radius:24px 24px 0 0}
.rv-cab b{flex:1;font-size:16px;font-weight:900}.rv-cab button{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#3b2a6b;font-size:20px;font-weight:900;cursor:pointer}
.rv-nota{font-size:13.5px;font-weight:700;line-height:1.4;background:#fff4d6;border-radius:12px;padding:8px 10px;margin:0 0 12px}
.rv-per{margin:12px 0 6px;font-size:15px;font-weight:900}
.rv-fila{background:#fff;border:2px solid #d9d2f0;border-radius:14px;padding:10px;margin:0 0 8px}
.rv-fila b{display:block;font-size:15px}.rv-fila small{display:block;font-size:13px;font-weight:700;color:#4a5f53;margin:2px 0 6px}
.rv-tipo{display:inline-block;background:#3b2a6b;color:#fff;border-radius:999px;font-size:11.5px;font-weight:900;padding:2px 8px;margin-bottom:4px}
.rv-b{display:flex;flex-wrap:wrap;gap:6px}.rv-b button,.rv-b a{min-height:44px;padding:0 14px;border-radius:999px;border:2px solid #3b2a6b;background:#fff;color:#3b2a6b;font-weight:900;font-size:14px;font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;text-decoration:none}
.rv-b .p{background:#3b2a6b;color:#fff}
.rv-txt{font-size:16px;line-height:1.5;font-weight:600;white-space:pre-line;margin:8px 0 12px}
.rv-in{width:100%;box-sizing:border-box;min-height:48px;border:2px solid #cbd5e1;border-radius:12px;padding:0 10px;font:inherit;font-size:16px;font-weight:700;margin:6px 0}
.rv-av{font-size:13.5px;font-weight:900;color:#0e7c4f;margin:6px 0 0}
`}</style>
      <div className="rv-hoja" role="dialog" aria-modal="true" aria-label={RESERVADO.titulo} onClick={(e) => e.stopPropagation()}>
        <div className="rv-cab"><b>🔐 {vista.tipo === "indice" ? RESERVADO.titulo : "DCUATES · Información compartida"}</b><button type="button" onClick={cerrar} aria-label="Cerrar">✕</button></div>
        {vista.tipo === "indice" && (
          <>
            <p className="rv-nota">Solo tú ves este índice. Cada elemento tiene su enlace propio: quien lo reciba verá únicamente ese elemento, dentro de la página de DCUATES. Los datos están en <b>src/datos/reservado.js</b>; para algo muy confidencial usa tus bases.</p>
            {RESERVADO.perfiles.map((p) => {
              const lista = RESERVADO.items.filter((x) => x.perfil === p.id);
              return (
                <div key={p.id}>
                  <h3 className="rv-per">{p.ico} {p.t} ({lista.length})</h3>
                  {lista.length === 0 && <p style={{ fontSize: 13.5, fontWeight: 700, color: "#4a5f53" }}>Aún no hay elementos.</p>}
                  {lista.map((x) => (
                    <div className="rv-fila" key={x.id}>
                      <span className="rv-tipo">{x.tipo}{x.clave ? " · con clave" : ""}</span>
                      <b>{x.t}</b>{x.d && <small>{x.d}</small>}
                      <div className="rv-b">
                        <button type="button" onClick={() => setVista({ tipo: "item", id: x.id })}>Ver</button>
                        <button type="button" className="p" onClick={() => copiarEnlace(x.id)}>Copiar enlace</button>
                        <button type="button" onClick={() => porWA(x)}>WhatsApp</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
            {aviso && <p className="rv-av" role="status">{aviso}</p>}
          </>
        )}
        {vista.tipo === "item" && !item && <p className="rv-txt">Este enlace ya no está disponible. Escríbenos por WhatsApp y te ayudamos.</p>}
        {item && (
          <>
            <span className="rv-tipo">{item.tipo}</span>
            <h2 style={{ margin: "4px 0 2px", fontSize: 21, fontWeight: 900 }}>{item.t}</h2>
            {item.d && <p style={{ margin: "0 0 6px", fontSize: 14.5, fontWeight: 700, color: "#4a5f53" }}>{item.d}</p>}
            {!visible && (
              <div>
                <p className="rv-txt" style={{ margin: "8px 0 0" }}>Este contenido pide una clave.</p>
                <input className="rv-in" type="password" autoComplete="off" value={clave} onChange={(e) => { setClave(e.target.value); setAviso(""); }} placeholder="Escribe la clave" aria-label="Clave" />
                <div className="rv-b"><button type="button" className="p" onClick={() => { if (clave.trim() === String(item.clave)) setDesbloq(true); else setAviso("Clave incorrecta"); }}>Ver contenido</button></div>
                {aviso && <p className="rv-av" style={{ color: "#b42318" }} role="alert">{aviso}</p>}
              </div>
            )}
            {visible && (
              <>
                {item.texto && <p className="rv-txt">{item.texto}</p>}
                <div className="rv-b">
                  {item.enlace && <a className="p" href={item.enlace} target="_blank" rel="noopener noreferrer">Abrir documento ›</a>}
                  {admin && <button type="button" onClick={() => copiarEnlace(item.id)}>Copiar enlace</button>}
                  <button type="button" onClick={() => window.open("https://wa.me/525540476247?text=" + encodeURIComponent(`¡Hola DCUATES! Vi: ${item.t}`), "_blank", "noopener")}>Escribir a DCUATES</button>
                </div>
                {aviso && <p className="rv-av" role="status">{aviso}</p>}
              </>
            )}
            {admin && vista.tipo === "item" && <div className="rv-b" style={{ marginTop: 10 }}><button type="button" onClick={() => setVista({ tipo: "indice" })}>‹ Volver al índice</button></div>}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
