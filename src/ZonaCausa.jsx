// DONA, COMPRA Y VENDE CON CAUSA — necesidades para donar, catálogo de Ventas con Causa y formulario para ofrecer.
import React, { useState } from "react";
import { GOOGLE_SHEETS_URL, WHATSAPP_NUMERO } from "./datos/config.js";
import { BASEROW_TABLE_ID_VENTAS_CON_CAUSA, VENTAS_CON_CAUSA_ITEMS } from "./datos/proyectos.js";
import { NECESIDADES_BASE } from "./datos/zona.js";
import { sumarSemillas } from "./datos/juegos.js";
import { CasillaAcepto, abrirLegal, useAceptacion } from "./componentes/legal.jsx";
import { useCatalogoBaserow } from "./utilidades/baserow.js";

const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;

export default function ZonaCausa({ onCerrar, necesidades, onAbrirProyecto = () => {}, alSumar }) {
  const [pest, setPest] = useState("dona");
  const lista = necesidades && necesidades.length ? necesidades : NECESIDADES_BASE;
  const catalogo = useCatalogoBaserow(BASEROW_TABLE_ID_VENTAS_CON_CAUSA, VENTAS_CON_CAUSA_ITEMS);
  const [nombre, setNombre] = useState("");
  const [oferta, setOferta] = useState("");
  const [contacto, setContacto] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const ac = useAceptacion();

  const enviar = async (e) => {
    e.preventDefault();
    if (oferta.trim().length < 8) { setError("Cuéntanos qué ofreces (una frase corta basta)."); return; }
    if (contacto.trim().length < 6) { setError("Déjanos un WhatsApp o correo para contactarte."); return; }
    if (!ac.validar()) return;
    setError("");
    const datos = new URLSearchParams({ Tipo: "Ofrece con causa", Nombre: nombre || "Sin nombre", Contacto: contacto, Mensaje: oferta, Estado: "Recibido", Fecha: new Date().toLocaleString("es-MX") });
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: datos }); } catch (err) { console.error("No se pudo guardar:", err); }
    const t = sumarSemillas(2); alSumar && alSumar(t);
    setEnviado(true); ac.reiniciar();
  };
  const abrir = (id) => { onCerrar(); setTimeout(() => onAbrirProyecto(id), 100); };
  const pestanas = [["dona", "🎁 Dona"], ["compra", "🛍️ Compra"], ["vende", "🏷️ Vende u ofrece"]];

  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Dona, compra y vende con causa" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🛍️ Dona, compra y vende con causa</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Cada compra, donativo o servicio con causa mueve algo bueno en la comunidad.</p>
        <div className="zj-chips">
          {pestanas.map(([id, t]) => <button type="button" key={id} className={"zj-chip" + (pest === id ? " zj-on" : "")} onClick={() => setPest(id)} aria-pressed={pest === id}>{t}</button>)}
        </div>

        {pest === "dona" && (
          <div className="ca-lista">
            <p className="pr-nota">Esto es lo que más se necesita. Cuéntanos qué quieres donar y coordinamos la entrega.</p>
            {lista.map((n, i) => (
              <div className="ag-ev" key={i}>
                <b>{n.emoji} {n.titulo}</b>
                {n.info && <p>{n.info}</p>}
                <div className="ca-btns">
                  <a href={wa(`Hola, quiero donar: ${n.titulo}. ¿Cómo coordinamos la entrega?`)} target="_blank" rel="noopener noreferrer">💬 Quiero donar</a>
                  {n.proyecto && <button type="button" onClick={() => abrir(n.proyecto)}>Ver proyecto ›</button>}
                </div>
              </div>
            ))}
            <p className="pr-nota">Para donativos en dinero: solo por transferencia a la cuenta oficial. Nunca des datos bancarios por mensaje. <button type="button" className="zj-link" onClick={() => abrirLegal("escudo")}>Ver Escudo de seguridad</button></p>
          </div>
        )}

        {pest === "compra" && (
          <div className="ca-lista">
            <p className="pr-nota">Artículos y servicios de Ventas con Causa. Pregunta por WhatsApp; los pagos son solo por transferencia.</p>
            {catalogo.slice(0, 12).map((it, i) => (
              <div className="ag-ev" key={it.id || i}>
                <b>{it.nombre}</b>
                <p>{[it.tipo, it.precio ? `$${it.precio} MXN` : "", it.proveedor ? `Proveedor: ${it.proveedor}` : ""].filter(Boolean).join(" · ")}</p>
                {it.descripcion && <p>{it.descripcion}</p>}
                <div className="ca-btns"><a href={wa(`Hola, me interesa: ${it.nombre} (Ventas con Causa DCUATES).`)} target="_blank" rel="noopener noreferrer">💬 Me interesa</a></div>
              </div>
            ))}
            <button type="button" className="in-btn" onClick={() => abrir("ventas-con-causa")}>Ver catálogo completo ›</button>
          </div>
        )}

        {pest === "vende" && (enviado ? (
          <div className="zj-resp zj-bien">
            <p className="zj-bien-e">✅</p>
            <p><b>¡Gracias! Quedó como “Recibido”.</b></p>
            <p>Revisaremos tu oferta y te contactaremos. Sumaste 2 Semillas 🌱</p>
            <button type="button" onClick={() => { setEnviado(false); setOferta(""); }}>Ofrecer otra cosa</button>
          </div>
        ) : (
          <form className="pr-form" onSubmit={enviar}>
            <p className="pr-nota">¿Vendes productos, ofreces un servicio o tienes algo para donar? Cuéntanos y parte de lo que vendes puede apoyar a la comunidad.</p>
            <label>Tu nombre o el de tu negocio (opcional)<input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Pan casero Lupita" /></label>
            <label>¿Qué ofreces?<textarea rows={4} value={oferta} onChange={(e) => setOferta(e.target.value)} placeholder="Ej. Pasteles por encargo; destino el 10% a Ecatepets." /></label>
            <label>WhatsApp o correo<input value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Para contactarte" inputMode="text" /></label>
            <CasillaAcepto ac={ac} id="acepta_causa" />
            {error && <p className="pr-err" role="alert">{error}</p>}
            <button type="submit" className="pr-enviar">🏷️ Enviar mi oferta</button>
          </form>
        ))}
      </div>
    </div>
  );
}
