// REGISTRO PREVIO (e56) — ventana única que abre el formulario corto de cualquier proyecto o sección clave.
// Se monta UNA vez en App. Se abre con abrirRegistroPrevio("ecatepets") o con el evento dcuates:registro-previo
// (detail: "id" o { id, valores: { campo: "valor" }, perfil: "texto" }). Los registros viven en src/datos/registros.js.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import FormMini from "./FormMini.jsx";
import BotonCompartir from "./BotonCompartir.jsx";
import { REGISTROS } from "./datos/registros.js";
import { registrar } from "./analitica.js";
import { abrirTablon } from "./Tablon.jsx";
import { WHATSAPP_NUMERO as WHATS_NUM } from "./datos/config.js";

// e58 — si la persona llega con un enlace ?inv=CODIGO (invitación o difusión), se recuerda 60 días para ligar su registro con quien la invitó.
try {
  const c = new URLSearchParams(window.location.search).get("inv");
  if (c && /^[A-Z]{3}-\d{4}-[A-Z0-9]{3}$/.test(c.toUpperCase())) localStorage.setItem("dc_inv", JSON.stringify({ c: c.toUpperCase(), t: Date.now() }));
} catch (e) { /* sin almacenamiento */ }

export const abrirRegistroPrevio = (id, opciones = {}) =>
  window.dispatchEvent(new CustomEvent("dcuates:registro-previo", { detail: { id, ...opciones } }));

export default function RegistroPrevio() {
  const [act, setAct] = useState(null);
  const [verEj, setVerEj] = useState(false); // e68: «Ver ejemplos»
  const [pila, setPila] = useState([]); // e58: registros por los que se pasó, para regresar con «‹» o con el botón atrás
  const cerrar = () => { if (pila.length) { setAct(pila[pila.length - 1]); setPila(pila.slice(0, -1)); } else setAct(null); };
  // e59: un relacionado puede ser un id de registro, { reg, e, t } (registro con otro nombre) o { acc, e, t } (abre una lista de la página)
  const abrirRel = (x) => {
    const id = typeof x === "string" ? x : x.reg;
    registrar("registro_relacionado", { de: act && act.id, a: id || x.acc });
    if (typeof x !== "string" && x.ev) { setAct(null); setPila([]); setTimeout(() => window.dispatchEvent(new CustomEvent(x.ev)), 80); return; }
    if (typeof x !== "string" && x.acc) { setAct(null); setPila([]); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-acceso", { detail: x.acc })), 80); return; }
    setPila([...pila, act]); setAct({ id });
  };
  const oculta = useAtras(!!act, cerrar);
  useEffect(() => {
    const abre = (e) => {
      const d = e && e.detail;
      const o = typeof d === "string" ? { id: d } : d || {};
      if (o.id === "tablon") { abrirTablon(o.filtro || ""); return; }
      if (!REGISTROS[o.id]) return;
      registrar("registro_previo_abierto", { id: o.id });
      setPila([]);
      setVerEj(false);
      setAct(o);
    };
    window.addEventListener("dcuates:registro-previo", abre);
    return () => window.removeEventListener("dcuates:registro-previo", abre);
  }, []);
  if (!act) return null;
  const base = REGISTROS[act.id];
  const cfg = { ...base, perfil: act.perfil || base.perfil || "", proyecto: act.proyecto || base.proyecto, boton: "Registrarme y recibir mi folio", gracias: "¡Listo, quedó registrado! 💚" };
  return createPortal(
    <div className="rp-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={base.titulo} onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      <div className="rp-caja">
        <div className="rp-cab">
          {pila.length > 0 && <button type="button" className="rp-x rp-v" onClick={cerrar} aria-label="Volver">‹</button>}
          <b>{base.e} {base.titulo}</b>
          <BotonCompartir hash="registros" titulo={base.titulo + " — DCUATES"} texto="Regístrate y participa en DCUATES" variante="circulo" />
          <button type="button" className="rp-x" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>
        <p className="rp-i">{base.intro}</p>
        {base.ejemplos && (
          <div className="rp-ej">
            <button type="button" className="rp-ejb" aria-expanded={verEj} onClick={() => { registrar("registro_ejemplos", { id: act.id }); setVerEj((v) => !v); }}>{verEj ? "Ocultar ejemplos" : base.ejemplos.boton}</button>
            {verEj && (
              <div data-testid="rp-ejemplos">
                <p><b>{base.ejemplos.titulo}</b></p>
                <ul>{base.ejemplos.items.map((x) => <li key={x}>{x}</li>)}</ul>
                {base.ejemplos.items2 && <><p><b>{base.ejemplos.titulo2}</b></p><ul>{base.ejemplos.items2.map((x) => <li key={x}>{x}</li>)}</ul></>}
              </div>
            )}
          </div>
        )}
        {base.atajo && <button type="button" className="rp-at" onClick={() => abrirRel(base.atajo)}>{base.atajo.e} {base.atajo.t}</button>}
        <FormMini key={act.id + (act.perfil || "")} cfg={cfg} clave={"rp-" + act.id} valores={act.valores || null} />
        {base.relacionados && base.relacionados.length > 0 && (
          <div className="rp-rel">
            <p>¿Quieres también…?</p>
            <div>{base.relacionados.map((x) => typeof x === "string" ? <button key={x} type="button" onClick={() => abrirRel(x)}>{REGISTROS[x].e} {REGISTROS[x].titulo}</button> : <button key={x.t} type="button" onClick={() => abrirRel(x)}>{x.e} {x.t}</button>)}</div>
          </div>
        )}
        {base.seccion && !base.sinTablon && <p className="rp-s"><button type="button" onClick={() => { setAct(null); setPila([]); setTimeout(() => abrirTablon(base.seccion), 60); }}>🧺 Ver lo que ya hay disponible en «{base.seccion}»</button></p>}
        <p className="rp-s">¿Prefieres escribirnos directo? <button type="button" onClick={() => { const t = `${base.wa || "¡Hola DCUATES!"}`; window.open(`https://wa.me/${WHATS_NUM}?text=${encodeURIComponent(t)}`, "_blank", "noopener"); }}>Abrir WhatsApp</button></p>
      </div>
    </div>,
    document.body
  );
}
const CSS = `
.rp-fondo{position:fixed;inset:0;z-index:95;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.rp-caja{background:#fbf7ec;width:100%;max-width:560px;max-height:92dvh;overflow-y:auto;overscroll-behavior:contain;border-radius:24px 24px 0 0;padding:0 12px 22px;color:#0f2d1e}
@media(min-width:640px){.rp-fondo{align-items:center}.rp-caja{border-radius:22px;max-height:86dvh}}
.rp-cab{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:8px;background:#1F7A46;color:#fff;margin:0 -12px 10px;padding:12px;border-radius:24px 24px 0 0}
.rp-cab b{flex:1;font-size:17px;font-weight:900;line-height:1.15}
.rp-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#1F7A46;font-size:20px;font-weight:900;cursor:pointer}
.rp-v{font-size:26px;line-height:1}
.rp-rel{margin:14px 0 0;padding:10px;background:#fff;border:2px solid #d8d2bd;border-radius:14px}.rp-rel p{margin:0 0 6px;font-size:14px;font-weight:900}.rp-rel div{display:flex;flex-wrap:wrap;gap:6px}
.rp-rel button{min-height:44px;padding:0 12px;border:2px solid #1F7A46;border-radius:22px;background:#fff;color:#1F7A46;font:inherit;font-weight:800;font-size:13px;cursor:pointer;text-align:left}
.rp-at{display:block;width:100%;min-height:52px;margin:6px 0 4px;padding:8px 12px;border:0;border-radius:14px;background:#E65100;color:#fff;font:inherit;font-weight:900;font-size:14.5px;text-align:left;cursor:pointer;box-shadow:0 3px 0 #a33a00}
.rp-ej{margin:6px 0 4px}.rp-ejb{min-height:44px;padding:0 14px;border:2px solid #B7791F;border-radius:999px;background:#fff;color:#8a5a0c;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.rp-ej div{margin-top:6px;padding:8px 12px;background:#FFF4D6;border-radius:12px}.rp-ej p{margin:4px 0;font-size:14px}.rp-ej ul{margin:0 0 4px;padding-left:18px}.rp-ej li{font-size:13.5px;font-weight:700;line-height:1.35;margin:2px 0}
.rp-i{margin:0 0 4px;font-size:14.5px;font-weight:700;line-height:1.35}
.rp-s{margin:12px 0 0;font-size:13px;font-weight:700;color:#4a5b52}
.rp-s button{border:0;background:none;color:#128c7e;font:inherit;font-weight:900;text-decoration:underline;cursor:pointer;min-height:36px}
`;
