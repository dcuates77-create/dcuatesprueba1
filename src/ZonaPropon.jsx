// PROPÓN Y RECOMIENDA — buzón de alertas, recomendaciones y propuestas + atajos al menú principal.
import React, { useState } from "react";
import { GOOGLE_SHEETS_URL, WHATSAPP_NUMERO } from "./datos/config.js";
import { CasillaAcepto, abrirLegal, useAceptacion } from "./componentes/legal.jsx";
import { irASeccion } from "./utilidades/baserow.js";

const TIPOS = {
  recomienda: { emoji: "👍", nombre: "Recomienda", tipo: "Recomendacion", ph: "¿Qué negocio, persona o práctica hace bien las cosas y por qué?", nota: "Cuéntanos quién lo hace bien y qué lo distingue." },
  propon: { emoji: "💡", nombre: "Propón", tipo: "Propuesta", ph: "¿Qué actividad, mejora o proyecto te gustaría ver en DCUATES?", nota: "Tu idea puede convertirse en una actividad de la Agenda." },
  alerta: { emoji: "🚨", nombre: "Alerta", tipo: "Alerta", ph: "Describe la mala práctica (qué pasó, dónde y cuándo), sin nombres de personas.", nota: "Reporta PRÁCTICAS, no personas con nombre. Revisamos todo antes de publicar. En emergencias llama al 911; para denuncia anónima, 089." }
};

export default function ZonaPropon({ onCerrar, menu = {}, onAbrirProyecto = () => {} }) {
  const [t, setT] = useState("propon");
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");
  const [contacto, setContacto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const ac = useAceptacion();
  const cfg = TIPOS[t];

  const enviar = async (e) => {
    e.preventDefault();
    if (texto.trim().length < 8) { setError("Cuéntanos un poco más (mínimo una frase corta)."); return; }
    if (!ac.validar()) return;
    setError("");
    const datos = new URLSearchParams({ Tipo: cfg.tipo, Nombre: nombre || "Anónimo", Contacto: contacto, Mensaje: texto, Estado: "Recibido", Fecha: new Date().toLocaleString("es-MX") });
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: datos }); } catch (err) { console.error("No se pudo guardar:", err); }
    setEnviado(true); ac.reiniciar();
  };
  const ir = (fn) => () => { onCerrar(); setTimeout(fn, 150); };
  const ATAJOS = [
    ["🗺️", "Mapa del sitio", menu.mapa], ["❓", "Preguntas frecuentes", menu.faq], ["💬", "Sugerencias y quejas", menu.sugerencias],
    ["📝", "Registra tu solicitud", () => irASeccion("solicitudes")], ["📣", "Publicidad gratuita", () => irASeccion("publicidad")],
    ["🛍️", "Ventas con causa", () => irASeccion("ventas-con-causa")], ["📚", "Préstamo de libros", () => onAbrirProyecto("libros")],
    ["🐾", "Ecatepets", () => onAbrirProyecto("ecatepets")], ["🛡️", "Escudo de seguridad", () => abrirLegal("escudo")]
  ];
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Propón y recomienda" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>💡 Propón y recomienda</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Esta comunidad se construye entre todos. Cuéntanos qué te gustaría, a quién recomiendas o qué se puede mejorar.</p>
        <div className="zj-chips">
          {Object.entries(TIPOS).map(([k, v]) => <button type="button" key={k} className={"zj-chip" + (t === k ? " zj-on" : "")} onClick={() => { setT(k); setEnviado(false); setError(""); }} aria-pressed={t === k}><span>{v.emoji}</span>{v.nombre}</button>)}
        </div>
        {enviado ? (
          <div className="zj-resp zj-bien">
            <p className="zj-bien-e">✅</p>
            <p><b>¡Gracias! Quedó como “Recibido”.</b></p>
            <p>Lo revisaremos y, si procede, lo publicaremos o lo convertiremos en actividad.</p>
            <button type="button" onClick={() => { setEnviado(false); setTexto(""); }}>Enviar otro</button>
            <a href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Hola DCUATES, acabo de enviar (${cfg.nombre}) desde la página.`)}`} target="_blank" rel="noopener noreferrer">💬 Avisar por WhatsApp</a>
          </div>
        ) : (
          <form onSubmit={enviar} className="pr-form">
            <p className="pr-nota">{cfg.nota}</p>
            <label>Tu nombre o apodo (opcional)<input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Vecina de la Calle 5" /></label>
            <label>Tu mensaje<textarea rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={cfg.ph} /></label>
            <label>WhatsApp o correo para avisarte (opcional)<input value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Solo si quieres respuesta" /></label>
            <CasillaAcepto ac={ac} id="acepta_propon" />
            {error && <p className="pr-err" role="alert">{error}</p>}
            <button type="submit" className="pr-enviar">{cfg.emoji} Enviar</button>
          </form>
        )}
        <p className="zj-et">Ir directo a…</p>
        <div className="pr-atajos">
          {ATAJOS.map(([e, n, fn]) => <button type="button" key={n} onClick={ir(fn || (() => {}))}><span>{e}</span>{n}</button>)}
        </div>
      </div>
    </div>
  );
}
