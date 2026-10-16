// VENTANAS EXTRA (se montan una sola vez en App): SERVICIOS Y PROMOCIONES ESPECIALES y SÉ PARTE DE NUESTROS LOGROS.
// Se abren con eventos: dcuates:abrir-servicios y dcuates:abrir-logros (desde cualquier botón, tablero o lista).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { useAtras } from "./atras.js";
import { abrirAcceso } from "./Tablero.jsx";

const COLX = ["#2E9E5B", "#7a5ad8", "#C2410C", "#1B6F8A", "#C2255C", "#92610F"];
export const abrirServicios = () => window.dispatchEvent(new CustomEvent("dcuates:abrir-servicios"));
export const abrirLogros = () => window.dispatchEvent(new CustomEvent("dcuates:abrir-logros"));
// Cierra primero la ventana en la que estás (para que la nueva quede encima) y luego abre la otra.
export const abrirDespues = (cerrar, fn) => { try { cerrar && cerrar(); } catch (e) {} setTimeout(fn, 90); };

const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;

const SERV = [
  ["🎯", "Coaching personal y de equipos", "Para definir metas, tomar decisiones y avanzar con acompañamiento."],
  ["📈", "Consultoría y asesoría de negocios", "Para ordenar, promover y hacer crecer tu negocio o emprendimiento."],
  ["🏫", "Asesoría a organizaciones educativas", "Escuelas, colectivos y grupos que quieren fortalecer su labor."],
  ["🏢", "Acompañamiento a empresas y organizaciones privadas", "Desarrollo de talento, equipos y proyectos con causa."],
  ["🏛️", "Apoyo a instituciones de gobierno", "Proyectos comunitarios, vinculación y desarrollo social."],
  ["🏷️", "Promociones especiales para la comunidad", "Descuentos y beneficios de aliados y patrocinadores."]
];

export default function Extras({ logros = [] }) {
  const [serv, setServ] = useState(false);
  const [log, setLog] = useState(false);
  useAtras(serv, () => setServ(false));
  useAtras(log, () => setLog(false));
  useEffect(() => {
    const a = () => setServ(true); const b = () => setLog(true);
    window.addEventListener("dcuates:abrir-servicios", a);
    window.addEventListener("dcuates:abrir-logros", b);
    try { if (window.location.hash === "#servicios") setServ(true); if (window.location.hash === "#logros") setLog(true); } catch (e) {}
    return () => { window.removeEventListener("dcuates:abrir-servicios", a); window.removeEventListener("dcuates:abrir-logros", b); };
  }, []);
  return (
    <>
      {serv && createPortal(
        <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Servicios y promociones especiales" onClick={(e) => { if (e.target === e.currentTarget) setServ(false); }}>
          <div className="zj-caja">
            <div className="zj-cab"><b>💼 Servicios y promociones especiales</b>
              <BotonCompartir hash="servicios" titulo="Servicios y promociones especiales" texto="Coaching, consultoría, asesoría y promociones especiales de DCUATES" variante="circulo" />
              <button type="button" className="zj-x" onClick={() => setServ(false)} aria-label="Cerrar">✕</button></div>
            <p className="zj-p">Además de los apoyos comunitarios, DCUATES y Conexiones con Causa ofrecen servicios y promociones especiales para personas, negocios y organizaciones. La lista se irá completando; mientras tanto, pide informes y te orientamos.</p>
            <p className="zj-et">Algunas áreas</p>
            <div className="ex-lista">{SERV.map(([e, t, d], i) => <div className="ag-ev ex-c" style={{ background: COLX[i % COLX.length] }} key={t}><b>{e} {t}</b><p>{d}</p></div>)}</div>
            <a className="in-btn" href={wa("Hola, me interesa recibir informes de los servicios y promociones especiales de DCUATES (coaching, consultoría y asesoría). Mi nombre es: ___ · Me interesa para: ___")} target="_blank" rel="noopener noreferrer">💬 Pedir informes por WhatsApp</a>
          </div>
        </div>, document.body)}
      {log && createPortal(
        <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Sé parte de nuestros logros" onClick={(e) => { if (e.target === e.currentTarget) setLog(false); }}>
          <div className="zj-caja">
            <div className="zj-cab"><b>🏆 Sé parte de nuestros logros</b>
              <BotonCompartir hash="logros" titulo="Sé parte de nuestros logros" texto="Mira lo que hemos logrado juntos en DCUATES y súmate" variante="circulo" />
              <button type="button" className="zj-x" onClick={() => setLog(false)} aria-label="Cerrar">✕</button></div>
            <p className="zj-p ex-intro">Cada logro de esta lista lo construyó una persona que dijo «yo me sumo»: un vecino que prestó un libro, un negocio que se alió, un voluntario que dio su tiempo. 💛 <b>El siguiente logro puede llevar tu nombre.</b> Mira lo que hemos hecho juntos y toma tu lugar.</p>
            <p className="zj-et">Lo que hemos logrado juntos</p>
            <div className="ex-lista">
              {logros.map((l, i) => <div className="ag-ev ex-c" style={{ background: COLX[i % COLX.length] }} key={i}><p>{l.texto}</p></div>)}
            </div>
            <button type="button" className="in-btn" onClick={() => abrirDespues(() => setLog(false), () => abrirAcceso("registros"))}>📝 Quiero sumarme al próximo logro</button>
            <a className="in-btn ex-wa" href={wa("¡Hola DCUATES! Quiero ser parte de sus logros y sumarme a la comunidad.")} target="_blank" rel="noopener noreferrer">💬 Escribirnos por WhatsApp</a>
          </div>
        </div>, document.body)}
      <style>{`
.ex-lista{display:flex;flex-direction:column;gap:8px;margin-bottom:8px}
.ex-intro{background:#fff4d6;border-radius:14px;padding:10px 12px}
.ex-wa{background:#25a244}
.ex-c{border:2px solid #fff!important;box-shadow:0 2px 6px rgba(0,0,0,.18)}.ex-c,.ex-c b,.ex-c p{color:#fff!important}body.dc-contraste .zj-caja .ex-c p,body.dc-contraste .zj-caja .ex-c b{color:#fff!important}
`}</style>
    </>
  );
}
