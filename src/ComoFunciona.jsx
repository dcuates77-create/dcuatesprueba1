// CÓMO FUNCIONA (e49) — hoja que cuenta, como una historia corta, para qué sirve cada uno de los 4 botones de «Tu entrada»
// y dónde encaja todo lo demás. Los textos están aquí abajo: edítalos sin tocar el código.
import React, { useState } from "react";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { abrirTablon } from "./Tablon.jsx";

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

// Dos ejemplos con su ciclo completo: OFREZCO (dar) y NECESITO (pedir). Cada caso cuenta la historia en 5 pasos. Edítalos aquí.
const CICLO = ["Registras", "Recibes tu folio", "Lo revisamos", "Te conectamos", "Recibes y agradeces"];
const EJEMPLOS = {
  ofrezco: {
    color: "#1F7A46", reg: "ofrezco", boton: "🎁 Probar OFREZCO",
    casos: [
      { id: "producto", t: "Un producto o servicio", hist: "Rosa tiene una cuna que ya no usa y Memo sabe arreglar bicicletas.",
        pasos: ["Rosa toca OFREZCO, elige «Producto», escribe «Cuna en buen estado» y su WhatsApp.", "Le sale un folio (OFR-…) y nos llega el aviso por correo.", "Revisamos y, con su permiso, la cuna aparece en «Lo que hay hoy» sin su nombre ni teléfono.", "Una vecina toca «Me interesa»; DCUATES le avisa a Rosa y las pone en contacto.", "La cuna cambia de casa. La vecina agradece en el Muro de gratitud y suma Semillas."] },
      { id: "mascota", t: "Una mascota", hist: "Lupe rescató una gatita y busca hogar para ella.",
        pasos: ["Lupe entra a Ecatepets → «Dar en adopción» y cuenta cómo es la gatita.", "Recibe su folio (ECA-…).", "Verificamos y publicamos la adopción en «Adopciones».", "Una familia toca «Me interesa» y coordinamos la visita.", "La gatita encuentra hogar y se cuenta en Historias DCUATES."] },
      { id: "ayuda", t: "Mi tiempo o conocimiento", hist: "Don Raúl es contador y quiere orientar gratis a quien lo necesite.",
        pasos: ["Don Raúl toca REGÍSTRATE → «Ser asesor voluntario».", "Recibe su folio (ASV-…).", "Lo sumamos a las asesorías.", "Cuando alguien pide asesoría, lo contactamos con su permiso.", "Se agradece su apoyo y puede ser propuesto para un reconocimiento."] }
    ]
  },
  necesito: {
    color: "#B7791F", reg: "necesito", boton: "🙏 Probar NECESITO",
    casos: [
      { id: "recomendacion", t: "Una recomendación", hist: "Ana necesita un plomero de confianza en su colonia.",
        pasos: ["Ana toca NECESITO, elige «Recomendación» y escribe «Busco plomero, zona norte».", "Le sale su folio (NEC-…).", "Lo publicamos (si lo autoriza) y también buscamos en el directorio de negocios aliados.", "Alguien recomienda a un plomero y DCUATES les pasa el contacto.", "Ana resuelve su problema y agradece. Reto: «por cada recomendación recibida, da dos»."] },
      { id: "mascota", t: "Una mascota extraviada o apoyo animal", hist: "A Pedro se le perdió su perrito.",
        pasos: ["Pedro toca «Reportar un caso» (si es urgente, también llama al 911 en caso de personas).", "Folio EXT-… y aviso inmediato por correo.", "Difundimos el caso en Extraviados.", "Una vecina lo vio y avisa; DCUATES conecta a ambos.", "El perrito vuelve a casa. Pedro agradece en el Muro."] },
      { id: "producto", t: "Un producto o servicio", hist: "Marta busca una silla de ruedas prestada para su mamá.",
        pasos: ["Marta toca NECESITO → «Producto» → «Silla de ruedas prestada».", "Folio NEC-… en su pantalla.", "Se publica en «Lo que hay hoy» con su permiso (sin nombre ni teléfono).", "Alguien toca «Me interesa» en una oferta parecida y las conectamos.", "Marta la recibe, la devuelve cuando termina y agradece."] }
    ]
  }
};

function Ejemplos({ onCerrar }) {
  const [lado, setLado] = useState("ofrezco");
  const [caso, setCaso] = useState("producto");
  const E = EJEMPLOS[lado];
  const c = E.casos.find((x) => x.id === caso) || E.casos[0];
  const cambiaLado = (l) => { setLado(l); setCaso("producto"); registrar("como_funciona_ejemplo", { lado: l }); };
  return (
    <section className="cf-ejs" aria-label="Dos ejemplos">
      <h3 className="cf-h">📖 Dos ejemplos: ofrecer y pedir</h3>
      <p className="cf-i" style={{ fontSize: 14.5 }}>En DCUATES todo gira en tres verbos: <b>OFREZCO</b>, <b>NECESITO</b> y <b>RECIBO</b> (lo que ya hay disponible para ti).</p>
      <div className="cf-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={lado === "ofrezco"} className={lado === "ofrezco" ? "on o" : ""} onClick={() => cambiaLado("ofrezco")}>🎁 OFREZCO</button>
        <button type="button" role="tab" aria-selected={lado === "necesito"} className={lado === "necesito" ? "on n" : ""} onClick={() => cambiaLado("necesito")}>🙏 NECESITO</button>
      </div>
      <div className="cf-casos">
        {E.casos.map((x) => <button key={x.id} type="button" className={x.id === c.id ? "on" : ""} onClick={() => setCaso(x.id)}>{x.t}</button>)}
      </div>
      <p className="cf-hist" style={{ borderLeftColor: E.color }}>{c.hist}</p>
      <ol className="cf-ciclo">
        {c.pasos.map((p, i) => (
          <li key={i}><span style={{ background: E.color }}>{i + 1}</span><div><b>{CICLO[i]}</b><small>{p}</small></div></li>
        ))}
      </ol>
      <div className="cf-b">
        <button type="button" className="a" style={{ background: E.color }} onClick={() => { onCerrar(); setTimeout(() => abrirRegistroPrevio(E.reg), 150); }}>{E.boton}</button>
        <button type="button" className="b" onClick={() => { onCerrar(); setTimeout(() => abrirTablon(), 150); }}>🧺 RECIBO: ver lo que hay hoy</button>
      </div>
    </section>
  );
}

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
.cf-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 8px}
.cf-tabs button{min-height:46px;border:2px solid #0f2d1e;border-radius:12px;background:#fff;font:inherit;font-weight:900;font-size:15px;color:#0f2d1e;cursor:pointer}
.cf-tabs .on.o{background:#1F7A46;color:#fff;border-color:#1F7A46}.cf-tabs .on.n{background:#B7791F;color:#fff;border-color:#B7791F}
.cf-casos{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px}
.cf-casos button{flex:none;min-height:40px;padding:0 12px;border:2px solid #cfc7aa;border-radius:20px;background:#fff;font:inherit;font-weight:800;font-size:13px;color:#0f2d1e;cursor:pointer}
.cf-casos button.on{background:#0f2d1e;color:#fff;border-color:#0f2d1e}
.cf-hist{margin:6px 0 8px;padding:8px 10px;background:#fff4d6;border-left:5px solid #B7791F;border-radius:10px;font-size:14.5px;font-weight:800;line-height:1.35}
.cf-ciclo{list-style:none;margin:0;padding:0}
.cf-ciclo li{display:flex;gap:10px;margin:0 0 8px;align-items:flex-start}
.cf-ciclo li span{flex:none;width:28px;height:28px;border-radius:50%;color:#fff;font-weight:900;font-size:15px;display:flex;align-items:center;justify-content:center;margin-top:2px}
.cf-ciclo b{display:block;font-size:14.5px;font-weight:900}.cf-ciclo small{display:block;font-size:14px;line-height:1.35;font-weight:600;color:#1d2b24}
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
      <Ejemplos onCerrar={onCerrar} />
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
