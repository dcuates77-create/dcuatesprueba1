// MICRO-ACCIONES (e53) — ventana con TODAS las micro-acciones + el botón para abrirla.
// Se abre desde: Inicio (botón bajo AGENDA PLUS), menú inferior → Proyectos → «Micro-acciones», el botón flotante
// «¿Necesitas algo?» → «¿Qué necesitas hoy?», y desde la sección Súmate (las tarjetas «con formulario»).
// Evento: dcuates:abrir-micro (detail opcional: "recomienda" | "negocio" | "meta" para abrir ese formulario). Hash: #micro-acciones.
// Los textos de cada micro-acción viven en src/datos/vistaSeccion.js (cierre.micro.items).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { VISTA } from "./datos/vistaSeccion.js";
import { MENSAJE_INVITACION, URL_SITIO, WHATSAPP_NUMERO } from "./datos/config.js";
import { irASeccion } from "./utilidades/baserow.js";
import FormMini from "./FormMini.jsx";
import { cargarEspacios } from "./utilidades/hojaPublica.js";
import BotonCompartir from "./BotonCompartir.jsx";

export const abrirMicro = (cual) => window.dispatchEvent(new CustomEvent("dcuates:abrir-micro", { detail: cual || "" }));

// Formularios cortos de las micro-acciones que piden datos (llegan a la pestaña «Mensajes» de tu hoja).
export const FORMULARIOS_MICRO = {
  recomienda: {
    tipo: "Recomienda", perfil: "Labor social", boton: "Enviar mi recomendación",
    gracias: "¡Gracias por recomendar! 💚 Vamos a conocer su labor.",
    wa: "¡Hola DCUATES! Quiero recomendar a alguien que hace labor social en nuestra comunidad.",
    campos: [
      { k: "cat", etiqueta: "¿Qué es?", tipo: "opciones", opciones: ["Negocio", "Organización", "Persona"], req: true },
      { k: "quien", etiqueta: "¿A quién recomiendas?", ph: "Nombre del negocio, organización o persona", max: 90, req: true },
      { k: "labor", etiqueta: "¿Qué labor hace por la comunidad?", tipo: "area", ph: "Cuéntanos en pocas palabras", max: 450, req: true },
      { k: "donde", etiqueta: "¿Dónde la encontramos? (colonia, redes o teléfono)", max: 140 },
      { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60 },
      { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30 }
    ]
  },
  negocio: {
    tipo: "Alianza", perfil: "Negocio que quiere sumar", boton: "Quiero platicar",
    gracias: "¡Gracias! 🤝 Te escribiremos para platicar y armar proyectos juntos.",
    wa: "¡Hola DCUATES! Tengo o conozco un negocio que quiere SUMAR y generar beneficios y apoyos mutuos y comunitarios. Quiero platicar para armar proyectos.",
    campos: [
      { k: "negocio", etiqueta: "Nombre del negocio", max: 90, req: true },
      { k: "giro", etiqueta: "¿A qué se dedica?", max: 120 },
      { k: "idea", etiqueta: "¿Qué te gustaría lograr o aportar?", tipo: "area", ph: "Ej. descuentos para vecinos, donar, difundir causas…", max: 450 },
      { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60, req: true },
      { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30, req: true }
    ]
  },
  meta: {
    tipo: "Micro-acción", perfil: "Propuesta de la comunidad", boton: "Enviar mi propuesta",
    gracias: "¡Gracias por proponer! 💡 Si la elegimos, la verás en esta lista.",
    wa: "¡Hola DCUATES! Quiero proponer una micro-acción para nuestra comunidad.",
    campos: [
      { k: "idea", etiqueta: "Tu micro-acción", tipo: "area", ph: "Algo sencillo, de pocos minutos, que apoye a ti y a nuestra comunidad", max: 450, req: true },
      { k: "para", etiqueta: "¿A quién ayuda o qué logra?", max: 140 },
      { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60 },
      { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30 }
    ]
  }
};

// e55 — reto «recomienda de confianza y pide dos», eventos y espacios.
const RESP = { k: "resp", etiqueta: "Confirmación de responsabilidad", tipo: "opciones", opciones: ["Sí, soy responsable de los términos"], req: true };
FORMULARIOS_MICRO.dos = {
  tipo: "Recomendación de confianza", perfil: "Reto: recomienda y pide dos", boton: "Enviar y pedir mis dos",
  gracias: "¡Gracias por recomendar! 💚 Te escribiremos por WhatsApp con dos recomendaciones de lo que necesitas.",
  wa: "¡Hola DCUATES! Quiero hacer una recomendación de confianza y pedir dos recomendaciones de lo que necesito.",
  campos: [
    { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60, req: true },
    { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30, req: true },
    { k: "cat", etiqueta: "¿Qué recomiendas?", tipo: "opciones", opciones: ["Negocio", "Organización", "Persona"], req: true },
    { k: "quien", etiqueta: "¿A quién recomiendas?", ph: "Nombre del negocio, organización o persona", max: 90, req: true },
    { k: "porque", etiqueta: "¿Por qué la recomiendas?", tipo: "area", ph: "Cuéntanos tu buena experiencia", max: 400, req: true },
    { k: "suc", etiqueta: "Contacto de la persona recomendada", ph: "Teléfono, red social o colonia", max: 120 },
    { k: "perm", etiqueta: "¿Te dio permiso para publicar su recomendación?", tipo: "opciones", opciones: ["Sí", "Aún no"] },
    { k: "necesito", etiqueta: "Qué necesitas o te interesa (te damos dos recomendaciones)", tipo: "area", ph: "Ej. Busco quien arregle una lavadora y un curso de inglés para mi hijo", max: 400, req: true }
  ]
};
FORMULARIOS_MICRO.evento = {
  tipo: "Evento", perfil: "Propuesta de evento", boton: "Enviar mi evento",
  gracias: "¡Gracias! 📅 Lo revisamos y, si lo aprobamos, lo verás en la Agenda.",
  wa: "¡Hola DCUATES! Quiero proponer un evento o actividad para la Agenda de la comunidad.",
  campos: [
    { k: "titulo", etiqueta: "Título del evento", max: 100, req: true },
    { k: "fecha", etiqueta: "Fecha", tipo: "fecha", req: true },
    { k: "hora", etiqueta: "Hora de inicio", tipo: "hora" },
    { k: "lugar", etiqueta: "Lugar", max: 140, req: true },
    { k: "org", etiqueta: "Quién organiza", max: 100 },
    { k: "desc", etiqueta: "Descripción", tipo: "area", ph: "De qué trata, a quién va dirigido, si tiene costo", max: 350 },
    { k: "enlace", etiqueta: "Enlace", ph: "Página o red social (si hay)", max: 160 },
    { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60, req: true },
    { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30, req: true },
    RESP
  ]
};
FORMULARIOS_MICRO.espacio = {
  tipo: "Espacio", perfil: "Ofrece un espacio", boton: "Ofrecer mi espacio",
  gracias: "¡Gracias por ofrecer tu espacio! 🏛️ Te escribiremos para acordar los detalles.",
  wa: "¡Hola DCUATES! Quiero ofrecer un espacio para actividades de la red.",
  campos: [
    { k: "esp", etiqueta: "Nombre del espacio", max: 100, req: true },
    { k: "tipoe", etiqueta: "Tipo de espacio", tipo: "opciones", opciones: ["Café o local", "Salón o centro", "Casa o patio", "Galería o foro", "Otro"] },
    { k: "zona", etiqueta: "Colonia o zona", max: 100, req: true },
    { k: "cap", etiqueta: "Capacidad (personas)", max: 20 },
    { k: "horarios", etiqueta: "Días y horarios disponibles", tipo: "area", max: 250 },
    { k: "permite", etiqueta: "Qué actividades permite", tipo: "area", ph: "Cafés literarios, pláticas, presentaciones de producto, exposiciones, talleres…", max: 300 },
    { k: "cond", etiqueta: "Condiciones o cuota", tipo: "area", ph: "Gratis, aportación, reglas, limpieza, aforo…", max: 300 },
    { k: "publ", etiqueta: "¿Podemos publicarlo en la página?", tipo: "opciones", opciones: ["Sí", "No"], req: true },
    { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60, req: true },
    { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30, req: true },
    RESP
  ]
};
FORMULARIOS_MICRO.usar = {
  tipo: "Solicitud de espacio", perfil: "Busca un espacio", boton: "Enviar mi solicitud",
  gracias: "¡Gracias! 🎤 Buscaremos un espacio y te escribimos por WhatsApp.",
  wa: "¡Hola DCUATES! Busco un espacio para una actividad de la red.",
  campos: [
    { k: "act", etiqueta: "¿Qué actividad quieres hacer?", ph: "Ej. Café literario, conferencia, presentación de mi producto", max: 140, req: true },
    { k: "tipoa", etiqueta: "Tipo de actividad", tipo: "opciones", opciones: ["Café literario", "Plática o conferencia", "Presentación de producto", "Exposición o galería", "Taller", "Reunión de negocios", "Otra"] },
    { k: "fecha", etiqueta: "Fecha tentativa", tipo: "fecha" },
    { k: "dur", etiqueta: "Duración", ph: "Ej. 2 horas", max: 40 },
    { k: "asis", etiqueta: "Asistentes aproximados", max: 20 },
    { k: "necesita", etiqueta: "Qué necesitas del espacio", tipo: "area", ph: "Sillas, proyector, mesas, acceso para personas mayores…", max: 300 },
    { k: "nombre", etiqueta: "Tu nombre", campo: "Nombre", max: 60, req: true },
    { k: "contacto", etiqueta: "Tu WhatsApp", campo: "Contacto", max: 30, req: true },
    RESP
  ]
};

export function BotonMicro() {
  return (
    <>
      <button type="button" className="ma-btn" onClick={() => { registrar("micro_abrir", { desde: "inicio" }); abrirMicro(); }}>
        <span className="ma-btn-e" aria-hidden="true">⚡</span>
        <span className="ma-btn-t"><b>MICRO-ACCIONES</b><small>Pequeñas acciones de pocos minutos que suman</small></span>
      </button>
      <style>{`.ma-btn{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;min-height:58px;padding:8px 14px;border:2px solid #fff;border-radius:16px;background:#E65100;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}.ma-btn:active{filter:brightness(.92)}.ma-btn-e{flex:none;width:34px;height:34px;border-radius:50%;background:#fff;font-size:20px;line-height:34px;text-align:center}.ma-btn-t{display:flex;flex-direction:column}.ma-btn-t b{font-size:17px;font-weight:900;letter-spacing:.04em;color:#fff}.ma-btn-t small{font-size:12.5px;font-weight:700;opacity:.95;color:#fff}`}</style>
    </>
  );
}

export default function MicroAcciones() {
  const [abierta, setAbierta] = useState(false);
  const [forma, setForma] = useState(null);
  const [espacios, setEspacios] = useState([]);
  useEffect(() => { if (abierta) cargarEspacios().then((x) => setEspacios(Array.isArray(x) ? x : [])); }, [abierta]);
  const cerrar = () => {
    setAbierta(false); setForma(null);
    setTimeout(() => { try { if (/^#micro-acciones$/.test(window.location.hash)) history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (e) { /* ignorar */ } }, 250);
  };
  const oculta = useAtras(abierta, cerrar);
  useEffect(() => {
    const abre = (e) => { const f = e && e.detail; setForma(f && FORMULARIOS_MICRO[f] ? f : null); setAbierta(true); };
    const hash = () => { if (/^#micro-acciones$/.test(window.location.hash)) abre(null); };
    hash();
    window.addEventListener("dcuates:abrir-micro", abre);
    window.addEventListener("hashchange", hash);
    return () => { window.removeEventListener("dcuates:abrir-micro", abre); window.removeEventListener("hashchange", hash); };
  }, []);
  // Al abrir un formulario concreto, se baja hasta él.
  useEffect(() => {
    if (abierta && forma) setTimeout(() => document.getElementById("ma-f-" + forma)?.scrollIntoView({ block: "center", behavior: "smooth" }), 120);
  }, [abierta, forma]);
  if (!abierta) return null;
  const cfg = (VISTA.cierre && VISTA.cierre.micro) || { titulo: "Micro-acciones", intro: "", items: [] };
  const ejecutar = (a) => {
    if (!a) return;
    if (a.micro) { setForma((f) => (f === a.micro ? null : a.micro)); return; }
    if (a.invitar) { registrar("invitar_vecino", { desde: "micro" }); window.open("https://wa.me/?text=" + encodeURIComponent(`${MENSAJE_INVITACION} ${URL_SITIO}/?origen=invitacion`), "_blank", "noopener"); return; }
    if (a.compartir) {
      registrar("compartir", { desde: "micro" });
      const url = `${URL_SITIO}/?origen=compartir`;
      if (navigator.share) navigator.share({ title: "DCUATES", text: MENSAJE_INVITACION, url }).catch(() => {});
      else window.open("https://wa.me/?text=" + encodeURIComponent(`${MENSAJE_INVITACION} ${url}`), "_blank", "noopener");
      return;
    }
    if (a.wa) { window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(a.wa)}`, "_blank", "noopener"); return; }
    if (a.ir) { cerrar(); setTimeout(() => irASeccion(a.ir), 300); }
  };
  return createPortal(
    <div className="ma-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Micro-acciones" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      <div className="ma-caja">
        <div className="ma-cab">
          <b>⚡ Micro-acciones</b>
          <BotonCompartir hash="micro-acciones" titulo="Micro-acciones — DCUATES" texto="Pequeñas acciones de pocos minutos que suman a nuestra comunidad" variante="circulo" />
          <button type="button" className="ma-x" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>
        <p className="ma-i">{cfg.intro || "Toca la que puedas hacer ahora. Cada una suma."}</p>
        <div className="ma-lista">
          {cfg.items.map((x) => {
            const form = x.a && x.a.micro ? FORMULARIOS_MICRO[x.a.micro] : null;
            const ab = form && forma === x.a.micro;
            return (
              <div key={x.t} id={form ? "ma-f-" + x.a.micro : undefined} className={"ma-it" + (x.meta ? " ma-meta" : "") + (ab ? " ma-ab" : "")}>
                <button type="button" className="ma-fila" aria-expanded={form ? ab : undefined} onClick={() => { registrar("micro_tocar", { id: x.a && x.a.micro ? x.a.micro : x.t.slice(0, 24) }); ejecutar(x.a); }}>
                  <span className="ma-e" aria-hidden="true">{x.ico}</span>
                  <span className="ma-tx">
                    <span className="ma-min" aria-label={x.min + (x.min === 1 ? " minuto" : " minutos")}>⏱ {x.min} min</span>
                    <b>{x.t}</b>{x.d && <small>{x.d}</small>}
                  </span>
                  {form && <span className="ma-fl" aria-hidden="true">{ab ? "⌃" : "⌄"}</span>}
                </button>
                {ab && <div className="ma-form"><FormMini key={x.a.micro} cfg={form} clave={"ma-" + x.a.micro} /></div>}
              </div>
            );
          })}
        </div>
        {espacios.length > 0 && (
          <div className="ma-esp">
            <p className="ma-et">🏛️ Espacios de la red que se prestan</p>
            {espacios.slice(0, 20).map((x) => (
              <div className="ma-ec" key={x.id || x.nombre}>
                <b>{x.nombre}</b>
                <small>{[x.tipo, x.zona, x.cap ? "Capacidad: " + x.cap : ""].filter(Boolean).join(" · ")}</small>
                {x.permite && <small>Permite: {x.permite}</small>}
                {x.cond && <small>Condiciones: {x.cond}</small>}
                <button type="button" onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`¡Hola DCUATES! Me interesa usar el espacio «${x.nombre}» para una actividad. Mi nombre es: ___`)}`, "_blank", "noopener")}>Quiero usarlo</button>
              </div>
            ))}
            <small className="ma-resp">Quien ofrece y quien usa un espacio es responsable de los términos que acuerden. DCUATES solo conecta.</small>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.ma-esp{margin-top:12px;display:flex;flex-direction:column;gap:8px}.ma-et{margin:0;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#6b7785}
.ma-ec{display:flex;flex-direction:column;gap:3px;padding:10px;border:2px solid #cbd5e1;border-radius:14px;background:#fff}.ma-ec b{font-size:14.5px;font-weight:900;color:#0f2d1e}.ma-ec small{font-size:13px;font-weight:700;color:#4a5564;line-height:1.3}
.ma-ec button{align-self:flex-start;min-height:44px;padding:0 16px;margin-top:4px;border:0;border-radius:999px;background:#25a244;color:#fff;font:inherit;font-weight:900;font-size:14px;cursor:pointer}.ma-resp{font-size:12.5px;font-weight:700;color:#5b6b62}
.ma-fondo{position:fixed;inset:0;z-index:76;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.ma-caja{background:#fbf7ec;width:100%;max-width:560px;max-height:92dvh;overflow-y:auto;overscroll-behavior:contain;border-radius:24px 24px 0 0;padding:0 12px 22px;color:#0f2d1e}
@media(min-width:640px){.ma-fondo{align-items:center}.ma-caja{border-radius:22px;max-height:86dvh}}
.ma-cab{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:8px;background:#E65100;color:#fff;margin:0 -12px 10px;padding:12px 12px;border-radius:24px 24px 0 0}
.ma-cab b{flex:1;font-size:17px;font-weight:900}
.ma-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#BF360C;font-size:20px;font-weight:900;cursor:pointer}
.ma-i{margin:0 2px 10px;font-size:15px;font-weight:700;line-height:1.4;color:#2f4d3f}
.ma-lista{display:flex;flex-direction:column;gap:8px}
.ma-it{background:#fff;border:2px solid #f1d9b8;border-radius:16px;box-shadow:0 2px 6px rgba(15,45,30,.1);overflow:hidden}
.ma-meta{border-color:#E65100;background:linear-gradient(135deg,#fff4d6,#ffe9c8)}
.ma-fila{display:flex;align-items:flex-start;gap:10px;width:100%;text-align:left;background:transparent;border:0;padding:10px;min-height:64px;cursor:pointer;font-family:inherit;color:#0f2d1e}
.ma-fila:active{transform:translateY(1px)}
.ma-e{flex:none;font-size:30px;line-height:1;width:40px;text-align:center;padding-top:20px}
.ma-tx{flex:1;min-width:0;display:flex;flex-direction:column}
.ma-tx b{font-size:14.5px;font-weight:900;line-height:1.2}
.ma-tx small{font-size:12.5px;font-weight:700;color:#4a5f53;line-height:1.3;margin-top:2px}
.ma-min{align-self:flex-start;margin-bottom:4px;background:#BF360C;color:#fff;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:900;white-space:nowrap}
.ma-fl{flex:none;font-size:20px;font-weight:900;color:#BF360C;padding-top:22px}
.ma-form{padding:0 12px 12px;border-top:1px dashed #f1d9b8;background:#fffaf0}
`;
