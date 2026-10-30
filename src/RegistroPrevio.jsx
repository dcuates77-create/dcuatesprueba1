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
import { WHATSAPP_NUMERO as WHATS_NUM } from "./datos/config.js";

export const abrirRegistroPrevio = (id, opciones = {}) =>
  window.dispatchEvent(new CustomEvent("dcuates:registro-previo", { detail: { id, ...opciones } }));

export default function RegistroPrevio() {
  const [act, setAct] = useState(null);
  const cerrar = () => setAct(null);
  const oculta = useAtras(!!act, cerrar);
  useEffect(() => {
    const abre = (e) => {
      const d = e && e.detail;
      const o = typeof d === "string" ? { id: d } : d || {};
      if (!REGISTROS[o.id]) return;
      registrar("registro_previo_abierto", { id: o.id });
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
          <b>{base.e} {base.titulo}</b>
          <BotonCompartir hash="registros" titulo={base.titulo + " — DCUATES"} texto="Regístrate y participa en DCUATES" variante="circulo" />
          <button type="button" className="rp-x" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>
        <p className="rp-i">{base.intro}</p>
        <FormMini key={act.id + (act.perfil || "")} cfg={cfg} clave={"rp-" + act.id} valores={act.valores || null} />
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
.rp-i{margin:0 0 4px;font-size:14.5px;font-weight:700;line-height:1.35}
.rp-s{margin:12px 0 0;font-size:13px;font-weight:700;color:#4a5b52}
.rp-s button{border:0;background:none;color:#128c7e;font:inherit;font-weight:900;text-decoration:underline;cursor:pointer;min-height:36px}
`;
