// CÓMO FUNCIONA (e49) — hoja que cuenta, como una historia corta, para qué sirve cada uno de los 4 botones de «Tu entrada»
// y dónde encaja todo lo demás. Los textos están aquí abajo: edítalos sin tocar el código.
import React from "react";
import { registrar } from "./analitica.js";

const PASOS = [
  ["1", "PUERTAS", "#C2410C", "Dinos quién eres (vecino, voluntario, negocio…) y te llevamos paso a paso."],
  ["2", "HOY", "#E5484D", "Lo que pasa esta semana: el reto del día, el próximo evento y lo que se necesita."],
  ["3", "REGÍSTRATE", "#2E9E5B", "Pide apoyo o suma tu parte. Te respondemos por WhatsApp."],
  ["4", "EXPLORA", "#7a5ad8", "Todos los proyectos, juegos y servicios, en un solo lugar."]
];

const RESTO = [
  ["🤝", "¿Necesitas apoyo o tienes una urgencia?", "Es el botón rosa de abajo: te orientamos sin pedir datos."],
  ["🧭", "Tour DCUATES", "Un recorrido guiado para recordar cómo moverte por la página."],
  ["➕", "Agenda Plus", "Agenda, mapas, anuncios y directorio de la comunidad."],
  ["🗂️", "Las 6 secciones", "Los cuadros de más abajo (Nosotros, Causas, Negocios, Beneficios, Gratitud y Súmate) ordenan todo por tema."],
  ["🏆", "Logros", "Lo que ya hemos conseguido juntos, para que veas que sí se puede."]
];

export default function ComoFunciona({ onCerrar }) {
  const irPuertas = () => { onCerrar(); setTimeout(() => document.getElementById("vi-participar")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150); };
  const tour = () => { registrar("como_funciona_tour"); onCerrar(); setTimeout(() => window.dispatchEvent(new CustomEvent("dcuates:bienvenida")), 150); };
  return (
    <div className="cf-raiz">
      <style>{`
.cf-raiz{font-family:Nunito,system-ui,sans-serif;color:#1d2b24;padding:2px 2px 8px}
.cf-i{margin:0 0 12px;font-size:16px;line-height:1.45;font-weight:700}
.cf-p{display:flex;gap:10px;align-items:flex-start;margin:0 0 9px}
.cf-n{flex:none;width:34px;height:34px;border-radius:50%;color:#fff;font-weight:900;font-size:18px;display:flex;align-items:center;justify-content:center}
.cf-p b{display:block;font-size:15px;font-weight:900;letter-spacing:.03em}
.cf-p .cf-d{display:block;font-size:14.5px;line-height:1.35;font-weight:600}
.cf-h{margin:14px 0 8px;font-size:17px;font-weight:900;color:#0f2d1e}
.cf-ej{margin:12px 0 0;padding:10px 12px;background:#fff4d6;border-left:5px solid #B7791F;border-radius:12px;font-size:14.5px;line-height:1.45;font-weight:700}
.cf-r{display:flex;gap:10px;margin:0 0 8px;align-items:flex-start}.cf-r em{flex:none;font-style:normal;font-size:24px;width:32px;text-align:center}
.cf-r b{display:block;font-size:14.5px;font-weight:900}.cf-r .cf-d{display:block;font-size:14px;line-height:1.35;font-weight:600}
.cf-b{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.cf-b button{min-height:48px;border-radius:999px;font-weight:900;font-size:15px;font-family:inherit;cursor:pointer}
.cf-b .a{background:#0e7c4f;color:#fff;border:0}.cf-b .b{background:#fff;color:#0e7c4f;border:2px solid #0e7c4f}
`}</style>
      <p className="cf-i">Piensa en DCUATES como entrar a tu colonia: hay una puerta de entrada, un tablero con lo que pasa, una ventanilla para pedir o ayudar y un mapa para recorrerlo todo. Son los <b>4 botones</b> de «Conoce cómo participar»:</p>
      {PASOS.map(([n, t, c, d]) => (
        <div className="cf-p" key={n}>
          <span className="cf-n" style={{ background: c }} aria-hidden="true">{n}</span>
          <div><b>{t}</b><span className="cf-d">{d}</span></div>
        </div>
      ))}
      <p className="cf-ej">📖 Un ejemplo: llegas y tocas <b>1 PUERTAS</b> para decir «quiero ayudar». En <b>2 HOY</b> ves que el sábado hay una colecta. En <b>3 REGÍSTRATE</b> te apuntas y te contestamos por WhatsApp. Y si tienes curiosidad, <b>4 EXPLORA</b> te enseña todo lo demás.</p>
      <h3 className="cf-h">¿Y lo demás, dónde encaja?</h3>
      {RESTO.map(([e, t, d]) => (
        <div className="cf-r" key={t}><em aria-hidden="true">{e}</em><div><b>{t}</b><span className="cf-d">{d}</span></div></div>
      ))}
      <div className="cf-b">
        <button type="button" className="a" onClick={irPuertas}>Empezar por los 4 botones ›</button>
        <button type="button" className="b" onClick={tour}>🧭 Prefiero el Tour guiado</button>
      </div>
    </div>
  );
}
