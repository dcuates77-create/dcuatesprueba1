// TENGO UN NEGOCIO — ventana con el mismo formato que "Empieza aquí" (Soy vecino), pero con lo que le sirve a un emprendedor.
import React from "react";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { identidad } from "./datos/identidad.js";
import { abrirAcceso } from "./Tablero.jsx";
import { abrirServicios, abrirLogros, abrirDespues } from "./Extras.jsx";

const zona = (id) => window.dispatchEvent(new CustomEvent("dcuates:abrir-zona", { detail: id }));

export default function Negocio({ onCerrar, onAbrirProyecto }) {
  const proy = (id, t, color) => ({ t, color: color || identidad(id).color, f: () => { onCerrar(); onAbrirProyecto(id); } });
  const GRUPOS = [
    ["📣 Dar a conocer mi negocio", [
      proy("publicidad-tarjeta", "📣 Publicidad gratuita para mi negocio"),
      { t: "🗺️ Registrar mi negocio en el mapa", color: "#1F7A46", f: () => abrirDespues(onCerrar, () => abrirAcceso("registros")) },
      proy("recomienda-evalua-gana", "👍 Que me recomienden y me evalúen con confianza")
    ]],
    ["🏷️ Atraer más clientes de mi zona", [
      proy("cupones-promos", "🏷️ Ofrecer cupones y promociones"),
      proy("ventas-con-causa", "🛍️ Vender mi producto o servicio con causa"),
      proy("bazares", "🧺 Participar en un bazar comunitario"),
      proy("noticias", "📰 Anunciar una novedad o evento en Noticias de barrio")
    ]],
    ["🤝 Crecer con aliados", [
      proy("alianzas-tarjeta", "🏪 Alianzas solidarias ganar-ganar"),
      proy("circulo-confianza", "🤝 Proveedores y apoyos de confianza"),
      proy("patrocinadores-alianzas", "🌟 Patrocinar o aliarme con DCUATES", "#B7791F")
    ]],
    ["🎓 Aprender y recibir apoyo", [
      proy("asesorias", "🎓 Asesorías gratuitas para emprender"),
      { t: "💼 Servicios y promociones especiales", color: "#7a5ad8", f: () => abrirDespues(onCerrar, abrirServicios) },
      { t: "📅 Reuniones y agenda de la comunidad", color: "#1B6F8A", f: () => abrirDespues(onCerrar, () => zona("info:agenda")) },
      { t: "🏆 Sé parte de nuestros logros", color: "#C2410C", f: () => abrirDespues(onCerrar, abrirLogros) }
    ]]
  ];
  const wa = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("¡Hola DCUATES! Tengo un negocio y me gustaría saber cómo pueden apoyarme. Mi negocio es: ___ · Estoy en la colonia: ___")}`;
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Tengo un negocio" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🏪 Tengo un negocio</b>
          <BotonCompartir hash="negocio" titulo="Tengo un negocio — DCUATES" texto="Publicidad gratuita, cupones, alianzas y más para negocios locales" variante="circulo" />
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Tu negocio crece más cuando la comunidad lo conoce y confía en él. Elige por dónde quieres empezar: todo es de apoyo mutuo y sin costo de inicio. 💛</p>
        {GRUPOS.map(([titulo, items]) => (
          <div key={titulo}>
            <p className="zj-et">{titulo}</p>
            <div className="zj-col">
              {items.map((i) => <button type="button" key={i.t} style={{ background: i.color }} onClick={i.f}>{i.t}</button>)}
            </div>
          </div>
        ))}
        <p className="zj-et">¿Prefieres platicarlo?</p>
        <div className="zj-col"><a className="in-btn" href={wa} target="_blank" rel="noopener noreferrer" style={{ background: "#25a244" }}>💬 Cuéntanos de tu negocio por WhatsApp</a></div>
      </div>
    </div>
  );
}
