// FORMULARIO MINI (e53) — un formulario corto y reutilizable. Guarda en tu hoja de Google (pestaña «Mensajes») y ofrece
// además enviar lo mismo por WhatsApp. Se usa en la ventana de Micro-acciones y en las menciones del Muro de gratitud.
//
// e56: si cfg trae «folio» (letras, ej. "ECA") es un REGISTRO PREVIO: valida WhatsApp de 10 dígitos, genera un folio (ECA-1030-K7Q),
//      lo guarda en «Mensajes» y «Registros», el script avisa por correo y la persona puede avisar también por WhatsApp (botón secundario).
//      cfg.proyecto = nombre del proyecto para la pestaña «Registros». Prop «valores» = respuestas iniciales (ej. { tipo: "Económica" }).
// cfg = { tipo, perfil, boton, gracias, campos: [{ k, etiqueta, ph, max, req, tipo: "texto"|"area"|"opciones"|"fecha"|"hora", opciones: [], campo: "Nombre"|"Contacto" }], wa }
//  - Los campos con «campo» van a la columna Nombre o Contacto; los demás se juntan en la columna Mensaje («Etiqueta: valor»).
//  - Nunca bloquea: si no hay internet, el mensaje se puede mandar por WhatsApp.
import React, { useState } from "react";
import { guardarEnHoja, registrar } from "./analitica.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";

const LETRAS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const nuevoFolio = (pref) => {
  const d = new Date(); const dd = String(d.getDate()).padStart(2, "0"), mm = String(d.getMonth() + 1).padStart(2, "0");
  let r = ""; for (let i = 0; i < 3; i++) r += LETRAS[Math.floor(Math.random() * LETRAS.length)];
  return `${pref}-${mm}${dd}-${r}`;
};
const digitos = (t) => String(t || "").replace(/\D/g, "");

export default function FormMini({ cfg, onListo, clave = "form", valores = null }) {
  const [v, setV] = useState(() => ({ ...Object.fromEntries(cfg.campos.map((c) => [c.k, ""])), ...(valores || {}) }));
  const [err, setErr] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [folio, setFolio] = useState("");
  const [trampa, setTrampa] = useState("");
  const cambia = (k, val) => { setV((x) => ({ ...x, [k]: val })); setErr(""); };
  const armar = () => {
    let nombre = "", contacto = "";
    const partes = [], extras = {};
    cfg.campos.forEach((c) => {
      const val = String(v[c.k] || "").trim();
      if (!val) return;
      if (c.pub) extras[c.pub] = val; // e57: datos para el tablón público (Titulo, Texto, Categoria, Permiso)
      if (c.campo === "Nombre") nombre = val;
      else if (c.campo === "Contacto") contacto = val;
      else partes.push(`${c.etiqueta.replace(/[¿?:]/g, "").trim()}: ${val}`);
    });
    return { nombre, contacto, extras, mensaje: partes.join(" | ") };
  };
  const enviar = (e) => {
    e.preventDefault();
    const falta = cfg.campos.find((c) => c.req && !String(v[c.k] || "").trim());
    if (falta) { setErr(`Falta: ${falta.etiqueta.replace(/[¿?]/g, "").trim()}`); return; }
    const { nombre, contacto, mensaje, extras } = armar();
    if (cfg.folio && digitos(contacto).length < 10) { setErr("Escribe tu WhatsApp con 10 dígitos para poder contactarte."); return; }
    // Anti-spam: campo oculto (los robots lo llenan) y un mismo registro no se envía dos veces en 20 segundos.
    if (trampa) { setFolio(cfg.folio ? nuevoFolio(cfg.folio) : ""); setEnviado(true); return; }
    const llaveT = "dc_ult_" + (cfg.tipo || "x");
    try { const ult = parseInt(localStorage.getItem(llaveT) || "0", 10); if (Date.now() - ult < 20000) { setErr("Ya recibimos tu registro hace un momento. Espera unos segundos."); return; } localStorage.setItem(llaveT, String(Date.now())); } catch (e2) { /* sin almacenamiento */ }
    const f = cfg.folio ? nuevoFolio(cfg.folio) : "";
    setFolio(f);
    guardarEnHoja({ Tipo: cfg.tipo, Perfil: cfg.perfil || "", Nombre: nombre, Contacto: contacto, Mensaje: mensaje.slice(0, 1200), ...(f ? { Folio: f, Proyecto: cfg.proyecto || cfg.tipo, Urgente: cfg.urgente ? "Sí" : "", ...(cfg.seccion ? { Seccion: cfg.seccion } : {}), ...extras } : {}) });
    registrar("form_mini_enviado", { tipo: cfg.tipo });
    setEnviado(true);
    onListo && onListo();
  };
  const porWhatsApp = () => {
    const { nombre, contacto, mensaje } = armar();
    const t = `${cfg.wa || "¡Hola DCUATES!"}${folio ? "\nMi folio: " + folio : ""}\n\n${mensaje.replace(/ \| /g, "\n")}${nombre ? "\nMi nombre: " + nombre : ""}${contacto ? "\nContacto: " + contacto : ""}`;
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`, "_blank", "noopener");
  };
  if (enviado) {
    return (
      <div className="fm-ok" role="status">
        <style>{CSS}</style>
        <b>{cfg.gracias || "¡Gracias! Lo recibimos. 💚"}</b>
        {folio && <span className="fm-fol" aria-label={"Tu folio es " + folio}>Tu folio: <strong>{folio}</strong></span>}
        <small>{folio ? "Guarda tu folio: con él damos seguimiento a tu registro. Te contactaremos por WhatsApp." : "Lo revisamos antes de publicar cualquier cosa. Si quieres que lo veamos más rápido, también puedes mandarlo por WhatsApp."}</small>
        {cfg.urgente && <small><b>Si es una urgencia o una persona en peligro, llama al 911.</b></small>}
        <div className="fm-b"><button type="button" className="fm-w" onClick={porWhatsApp}>{folio ? "Avisar también por WhatsApp" : "Mandar también por WhatsApp"}</button></div>
      </div>
    );
  }
  return (
    <form className="fm" onSubmit={enviar} noValidate style={{ position: "relative" }}>
      <style>{CSS}</style>
      {cfg.campos.map((c) => {
        const id = `${clave}-${c.k}`;
        return (
          <div className="fm-c" key={c.k}>
            <label htmlFor={id}>{c.etiqueta}{c.req ? "" : " (opcional)"}</label>
            {c.tipo === "area" ? (
              <textarea id={id} rows={3} maxLength={c.max || 500} value={v[c.k]} onChange={(e) => cambia(c.k, e.target.value)} placeholder={c.ph || ""} />
            ) : c.tipo === "fecha" || c.tipo === "hora" ? (
              <input id={id} type={c.tipo === "fecha" ? "date" : "time"} value={v[c.k]} onChange={(e) => cambia(c.k, e.target.value)} />
            ) : c.tipo === "opciones" ? (
              <div className="fm-op" role="group" aria-label={c.etiqueta}>
                {c.opciones.map((o) => (
                  <button key={o} type="button" aria-pressed={v[c.k] === o} className={v[c.k] === o ? "on" : ""} onClick={() => cambia(c.k, v[c.k] === o ? "" : o)}>{o}</button>
                ))}
              </div>
            ) : (
              <input id={id} type="text" maxLength={c.max || 120} value={v[c.k]} onChange={(e) => cambia(c.k, e.target.value)} placeholder={c.ph || ""} autoComplete="off" inputMode={c.campo === "Contacto" ? "tel" : undefined} />
            )}
          </div>
        );
      })}
      <input type="text" name="sitio" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trampa} onChange={(e) => setTrampa(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      {err && <p className="fm-e" role="alert">{err}</p>}
      <div className="fm-b"><button type="submit" className="fm-s">{cfg.boton || "Enviar"}</button></div>
      <small className="fm-n">Usamos tus datos solo para responderte. Revisamos todo antes de publicar. Aviso de Privacidad en el pie de la página.</small>
    </form>
  );
}

const CSS = `
.fm{display:flex;flex-direction:column;gap:10px;margin:8px 0 2px;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;text-align:left}
.fm-c label{display:block;font-size:13.5px;font-weight:900;margin:0 0 3px}
.fm-c input,.fm-c textarea{width:100%;box-sizing:border-box;border:2px solid #cbd5e1;border-radius:12px;padding:10px;font:inherit;font-size:16px;font-weight:700;background:#fff;color:#0f2d1e}
.fm-c input{min-height:48px}.fm-c textarea{min-height:84px;resize:vertical}
.fm-c input:focus,.fm-c textarea:focus{outline:3px solid #ffd84d;border-color:#0e7c4f}
.fm-op{display:flex;flex-wrap:wrap;gap:6px}
.fm-op button{min-height:44px;padding:0 14px;border-radius:999px;border:2px solid #0e7c4f;background:#fff;color:#0e7c4f;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.fm-op button.on{background:#0e7c4f;color:#fff}
.fm-b{display:flex;flex-wrap:wrap;gap:8px}
.fm-s,.fm-w{min-height:48px;padding:0 20px;border-radius:999px;border:0;font:inherit;font-weight:900;font-size:15px;cursor:pointer}
.fm-s{background:#BF360C;color:#fff;box-shadow:0 3px 0 #8a2607}.fm-w{background:#25a244;color:#fff}
.fm-e{margin:0;font-size:13.5px;font-weight:900;color:#b42318}
.fm-n{display:block;font-size:12.5px;font-weight:700;color:#5b6b62;line-height:1.35}
.fm-ok{display:flex;flex-direction:column;gap:6px;background:#e3f3e9;border-radius:14px;padding:12px;margin:8px 0 2px;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e}
.fm-fol{display:inline-block;align-self:flex-start;background:#fff;border:2px dashed #0e7c4f;border-radius:10px;padding:6px 10px;font-size:15px;font-weight:800}.fm-fol strong{font-size:18px;letter-spacing:.04em}
.fm-ok b{font-size:16px}.fm-ok small{font-size:13.5px;font-weight:700;line-height:1.35}
`;
