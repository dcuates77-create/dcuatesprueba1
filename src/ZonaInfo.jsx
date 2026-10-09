// INFO CLAVE — teléfonos de emergencia, agenda, canal oficial, redes y tips de seguridad.
import React from "react";
import { REDES_SOCIALES, WHATSAPP_NUMERO } from "./datos/config.js";
import { TELEFONOS_EMERGENCIA, TELEFONOS_LOCALES, TIPS_SEGURIDAD } from "./datos/zona.js";
import { abrirLegal } from "./componentes/legal.jsx";
import { irASeccion } from "./utilidades/baserow.js";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (f) => { const [, m, d] = f.split("-").map(Number); return `${d} ${MESES[m - 1]}`; };

export default function ZonaInfo({ onCerrar, agenda = [], menu = {} }) {
  const hoy = new Date().toISOString().slice(0, 10);
  const proximos = agenda.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(0, 6);
  const tel = (t) => <a key={t.nombre} className="in-tel" href={`tel:${t.tel}`}><span>{t.emoji}</span><b>{t.nombre}</b><i>{t.mostrar || t.tel}</i><small>{t.info}</small></a>;
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Información clave" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>📌 Info clave</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Lo importante, a la mano. Guarda esta página en tu celular.</p>
        <details className="in-sec" open>
          <summary>🚨 Teléfonos de emergencia</summary>
          <div className="in-tels">{TELEFONOS_EMERGENCIA.map(tel)}{TELEFONOS_LOCALES.map(tel)}</div>
          <p className="in-nota">Toca un número para llamar. Verifica los datos locales con las autoridades.</p>
        </details>
        <details className="in-sec">
          <summary>📅 Agenda DCUATES</summary>
          {proximos.length === 0 && <p className="ag-vacio">Aún no hay actividades próximas. Vuelve pronto.</p>}
          {proximos.map((e, i) => <div className="ag-ev" key={i}><b>{fmt(e.fecha)} · {e.titulo}</b>{e.info && <p>{e.info}</p>}</div>)}
          <button type="button" className="in-btn" onClick={() => { onCerrar(); setTimeout(() => irASeccion("mapa-negocios"), 150); }}>📅 Ver el calendario completo (en Negocios)</button>
        </details>
        <details className="in-sec">
          <summary>🛡️ Canal oficial y seguridad</summary>
          <a className="in-btn" href={`https://wa.me/${WHATSAPP_NUMERO}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp oficial</a>
          <ul className="in-tips">{TIPS_SEGURIDAD.map((t) => <li key={t}>{t}</li>)}</ul>
          <button type="button" className="in-btn in-sec2" onClick={() => abrirLegal("escudo")}>🛡️ Ver el Escudo de seguridad</button>
        </details>
        <details className="in-sec">
          <summary>🔗 Nuestras redes</summary>
          <div className="in-redes">
            <a href={REDES_SOCIALES.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={REDES_SOCIALES.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={REDES_SOCIALES.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </details>
        <details className="in-sec">
          <summary>📍 Cerca de ti</summary>
          <button type="button" className="in-btn" onClick={() => { onCerrar(); setTimeout(() => irASeccion("mapa-negocios"), 150); }}>🗺️ Mapa de negocios locales</button>
          {menu.faq && <button type="button" className="in-btn in-sec2" onClick={() => { onCerrar(); setTimeout(menu.faq, 150); }}>❓ Preguntas frecuentes</button>}
        </details>
      </div>
    </div>
  );
}
