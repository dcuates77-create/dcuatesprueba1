// PRIMERA VISITA: 3 pantallas de bienvenida, una sola vez, que se pueden saltar. Se reabre desde EXPLORA.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { elegirPuerta } from "./PuertasDcuates.jsx";
import { OpcionesLeer } from "./accesibilidad.jsx";
import BotonCompartir from "./BotonCompartir.jsx";

const PASOS = [
  ["👋", "¡Bienvenido(a) a DCUATES!", "Somos una comunidad de apoyo mutuo: libros, asesorías, mascotas, cupones y mucho más. Todo con confianza y sin costo de entrada. 💛", "opciones"],
  ["🧭", "Hoy · Regístrate · Explora", "☀️ HOY: lo que pasa esta semana.\\n📝 REGÍSTRATE: pide o suma.\\n🧭 EXPLORA: proyectos, juegos y servicios.\\n🤍 Si necesitas apoyo o tienes una urgencia, hay un botón siempre a la vista."],
  ["🚪", "Entras por una puerta", "Elige cómo quieres participar (vecino, negocio, joven, familia…) y te guiamos paso a paso. También puedes ver los PROYECTOS o ir directo a la página, sin elegir puerta."]
];
const lee = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

export default function PrimeraVisita() {
  const [paso, setPaso] = useState(-1);
  const [fallo, setFallo] = useState(false);
  const cerrar = () => { try { localStorage.setItem("dc_bienvenida", "1"); } catch (e) {} setPaso(-1); };
  useAtras(paso >= 0, cerrar);
  useEffect(() => {
    const abrir = () => { setFallo(false); setPaso(0); };
    window.addEventListener("dcuates:bienvenida", abrir);
    let t;
    try {
      const llegoPorEnlace = window.location.hash && window.location.hash.length > 1;
      if (!lee("dc_bienvenida") && !llegoPorEnlace) t = setTimeout(abrir, 2000);
    } catch (e) {}
    return () => { clearTimeout(t); window.removeEventListener("dcuates:bienvenida", abrir); };
  }, []);
  if (paso < 0) return null;
  const [e, t, d, tipo] = PASOS[paso];
  const opciones = tipo === "opciones";
  const ultimo = paso === PASOS.length - 1;
  return createPortal(
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Bienvenida" onClick={(ev) => { if (ev.target === ev.currentTarget) cerrar(); }}>
      <div className="zj-caja pv-caja">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}><p className="pv-tour" style={{ margin: 0 }}>🧭 TOUR DCUATES · {paso + 1} de {PASOS.length}</p><BotonCompartir hash="tour" titulo="TOUR DCUATES" texto="Un recorrido corto para moverte por la página" variante="circulo" /></div>
        {paso === 0 && !fallo && <img className="pv-logo" style={{ width: 72, height: 72 }} src="/images/logo-circular.png" alt="Logo DCUATES" onError={() => setFallo(true)} />}
        {(paso !== 0 || fallo) && <div className="pv-e">{e}</div>}
        <h2 className="pv-t">{t}</h2>
        <p className="pv-d">{d.split("\\n").map((l, i) => <span key={i}>{l}<br /></span>)}</p>
        {opciones && <><p className="pv-pers">🎛️ Personaliza tu navegación (opcional)</p><div style={{ marginBottom: 12 }}><OpcionesLeer /></div></>}
        <div className="pv-puntos" aria-hidden="true">{PASOS.map((_, i) => <i key={i} className={i === paso ? "on" : ""} />)}</div>
        <div className="zj-col">
          {ultimo
            ? <><button type="button" style={{ background: "#2E9E5B" }} onClick={() => { cerrar(); setTimeout(elegirPuerta, 120); }}>🚪 Elegir mi puerta</button>
              <button type="button" style={{ background: "#1B6F8A" }} onClick={() => { cerrar(); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:abrir-tablero", { detail: "conoce" })), 120); }}>📚 Ver los proyectos</button></>
            : <button type="button" style={{ background: "#2E9E5B" }} onClick={() => setPaso(paso + 1)}>Siguiente ›</button>}
          <button type="button" className="pv-sec" onClick={cerrar}>{ultimo ? "🌐 Ir a la página" : "Saltar"}</button>
        </div>
      </div>
      <style>{`.pv-pers{margin:0 0 6px;text-align:left;font-size:13px;font-weight:900;color:#14532d}.pv-tour{margin:0 0 8px;padding:5px 10px;border-radius:999px;background:#14532d;color:#fff;font-size:12.5px;font-weight:900;letter-spacing:.06em}.pv-caja{text-align:center;padding:18px 16px 18px}.pv-logo{width:96px;height:96px;object-fit:contain;margin:0 auto 6px;display:block}.pv-e{font-size:56px;line-height:1.1;margin-bottom:4px}.pv-t{margin:4px 0 6px;font-size:22px;font-weight:900;color:#14532d}.pv-d{margin:0 0 12px;font-size:15.5px;font-weight:700;line-height:1.4;text-align:left;color:#1f2a37}.pv-puntos{display:flex;gap:8px;justify-content:center;margin-bottom:8px}.pv-puntos i{width:10px;height:10px;border-radius:50%;background:#cbd5e1}.pv-puntos i.on{background:#2E9E5B;width:24px;border-radius:6px}.pv-sec{background:#eef2f1!important;color:#334155!important}`}</style>
    </div>, document.body);
}
