// INICIO v2 (e71) — portada rediseñada: se activa con ?v=2 (y se recuerda en este celular; ?v=1 regresa a la anterior).
// Conserva el cintillo, el encabezado y la barra inferior (viven fuera de aquí). Todos los botones llevan a lo mismo que antes.
import React, { useEffect, useState } from "react";
import EntradaDcuates, { elegirPuerta, abrirVentanaEntrada, abrirTour } from "./PuertasDcuates.jsx";
import { BandaImpacto, TABS } from "./BloqueCentral.jsx";
import { Hoja, Atajos, CSS as CSS_VI } from "./InicioNuevo.jsx";
import { proximos, fechaLinda } from "./utilidades/calendario.js";
import { agendaDesdeZona } from "./datos/zona.js";
import { ANUNCIOS_EJEMPLO, tipoAnuncio } from "./datos/plus.js";
import { NOTICIAS_GALERIA_ITEMS, CUPONES_PROMOS_ITEMS } from "./datos/proyectos.js";
import { abrirLegal } from "./componentes/legal.jsx";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { ACTIVIDADES_FIJAS } from "./datos/actividadesFijas.js";
import ClubTarjeta from "./ClubDcuates.jsx";
import ComoFunciona from "./ComoFunciona.jsx";
import { abrirTablon } from "./Tablon.jsx";
import { abrirPlus } from "./AgendaPlus.jsx";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { ejecutar } from "./datos/secciones.js";
import { irASeccion } from "./utilidades/baserow.js";
import { registrar } from "./analitica.js";

const FOTOS = ["/images/portada-inicio.webp", "/images/bibliobici-movil.webp"];
const FOTO_CLUB = "/images/cuate/dcuates.webp";

// Íconos de trazo grueso, un solo estilo. Cada uno es un trazo simple de 24×24.
const TRAZOS = {
  gente: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 010 5.5M18 14c2 .6 3 2.4 3 5",
  corazon: "M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z",
  tienda: "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0M10 20v-5h4v5",
  mano: "M3 12l4-4 4 2 3-2 4 3 3-1M5 15l3 3c1 1 2 1 3 0l1-1 2 2c1 1 2 1 3 0l3-3M7 8l4 4",
  puerta: "M6 21V4h12v17M4 21h16M14 12.5v.5",
  brujula: "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z",
  agenda: "M5 6h14v14H5zM5 10h14M9 3v4M15 3v4",
  sol: "M12 16a4 4 0 100-8 4 4 0 000 8zM12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4",
  cohete: "M12 3c3 2 5 5 5 9l-2 3H9l-2-3c0-4 2-7 5-9zM9 15l-3 4 4-1M15 15l3 4-4-1M12 10v.5",
  libro: "M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14",
  regalo: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0",
  video: "M4 6h12v12H4zM16 10l5-3v10l-5-3",
  alianza: "M3 12l5-4 4 2 4-2 5 4-5 5-3-2-3 2zM8 8l-5 4",
  estrella: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  ayuda: "M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1-1.5 2.2M12 16.5v.5",
  dar: "M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11zM12 9v5M9.5 11.5h5",
  mas: "M12 5v14M5 12h14",
  flecha: "M9 6l6 6-6 6",
  perinola: "M12 2v3M9.5 3.5h5M5.5 10c0-3 3-5 6.500-5s6.500 2 6.500 5l-6.500 11zM5.5 10h13M9 10l3.500 11M15 10l-3.500 11",
  premio: "M12 14a5 5 0 100-10 5 5 0 000 10zM8.5 13.5L7 21l5-3 5 3-1.5-7.5",
  llave: "M8 15a4 4 0 110-8 4 4 0 010 8zM11 11h10M17 11v3M20 11v2",
  escudo: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  carita: "M12 21a9 9 0 100-18 9 9 0 000 18zM8.5 14c1 1.5 2.2 2 3.5 2s2.5-.5 3.5-2M9 9.5v.5M15 9.5v.5"
};
function Ico({ n, c = "#08743B", s = 26 }) {
  return (
    <svg className="v2-i" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={TRAZOS[n]} /></svg>
  );
}

// Colores de cada familia (se mantienen en toda la página).
const C = {
  verde: { f: "#E9F6D5", b: "#cfe5b0", t: "#26531f", i: "#2C8A2E" },
  naranja: { f: "#FFF0D9", b: "#f5d9ac", t: "#6a4310", i: "#E06A12" },
  azul: { f: "#DCE8FF", b: "#bcd0f7", t: "#1f3f87", i: "#2B5BD7" }
};

function HeroFade({ fotos }) {
  const [i, setI] = useState(0);
  const lista = fotos.length ? fotos : FOTOS;
  useEffect(() => {
    if (lista.length < 2) return undefined;
    const id = setInterval(() => setI((x) => (x + 1) % lista.length), 5500);
    return () => clearInterval(id);
  }, [lista.length]);
  return (
    <section className="v2-hero" aria-label="Bienvenida">
      {lista.map((s, k) => (
        <img key={s} className="v2-hero-i" style={{ opacity: k === i % lista.length ? 1 : 0 }} src={s} alt={k === 0 ? "Conectando: más oportunidades para crecer, aprender y compartir" : ""} aria-hidden={k === 0 ? undefined : "true"} onError={(e) => { e.currentTarget.style.display = "none"; }} />
      ))}
    </section>
  );
}

// Botón grande de lista dentro de una ventana: [ícono, título, subtítulo, familia, acción] (+ botón extra opcional).
function Fila({ n, t, s, fam, f, extra }) {
  const c = C[fam];
  return (
    <div className="v2-fila">
      <button type="button" className="v2-fb" style={{ background: c.f, borderColor: c.b }} onClick={f}>
        <span className="v2-fi" style={{ background: "#fff" }}><Ico n={n} c={c.i} s={28} /></span>
        <span className="v2-ft"><b>{t}</b><small style={{ color: c.t }}>{s}</small></span>
        <Ico n="flecha" c={c.i} s={22} />
      </button>
      {extra && <button type="button" className="v2-fx" style={{ background: "#fff", borderColor: c.b, color: c.t }} onClick={extra.f}><Ico n={extra.n} c={c.i} s={20} />{extra.t}</button>}
    </div>
  );
}

// ACTIVIDADES DCUATES (antes «Hoy»): cuatro pestañas con lo real; si no hay nada, muestra ejemplos marcados.
const PEST = [["eventos", "Eventos", "verde"], ["avisos", "Avisos", "verde"], ["promos", "Promos", "naranja"], ["convoc", "Convocatorias", "azul"]];
function Actividades({ agenda = [], filasZona = [], anuncios = [] }) {
  const [tab, setTab] = useState("eventos");
  const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
  const ejemplos = (tipo) => (NOTICIAS_GALERIA_ITEMS || []).filter((x) => x.tipo === tipo).map((x) => ({ t: x.nombre, l1: x.descripcion, img: x.img, ejemplo: true }));
  let eventos = [];
  try { eventos = proximos([...agenda, ...agendaDesdeZona(filasZona)]).slice(0, 3).map((e) => ({ t: e.titulo, l1: fechaLinda(e), l2: e.lugar || "", ejemplo: false })); } catch (e) { eventos = []; }
  const avisosReales = (anuncios || []).slice(0, 3).map((a) => ({ t: a.titulo, l1: a.texto, ejemplo: false, ic: tipoAnuncio(a.tipo)[1] }));
  const fijas = (ACTIVIDADES_FIJAS || []).map((a) => ({ t: a.titulo, l1: a.cuando, l2: a.lugar, ejemplo: !!a.ejemplo }));
  const evAll = [...eventos, ...fijas].slice(0, 4);
  const datos = {
    eventos: evAll.length ? evAll : ejemplos("Evento"),
    avisos: avisosReales.length ? avisosReales : [...ejemplos("Aviso"), ...ANUNCIOS_EJEMPLO.slice(0, 1).map((a) => ({ t: a.titulo, l1: a.texto, ejemplo: true }))].slice(0, 2),
    promos: (CUPONES_PROMOS_ITEMS || []).slice(0, 3).map((x) => ({ t: x.nombre, l1: x.descripcion, img: x.img, ejemplo: true })),
    convoc: ejemplos("Convocatoria")
  };
  const lista = datos[tab] || [];
  const abre = () => { registrar("v2_actividad", { tab }); if (tab === "eventos") ev("dcuates:abrir-zona", "info:agenda"); else if (tab === "promos") ev("dcuates:abrir-zona", "gana"); else abrirPlus("tablero"); };
  return (
    <section className="v2-act" aria-label="Actividades DCUATES">
      <div className="v2-act-h">
        <Ico n="agenda" c="#08743B" s={30} />
        <h2>Actividades DCUATES</h2>
        <button type="button" className="v2-ver" onClick={() => { registrar("v2_actividad", { tab: "todo" }); abrirPlus("tablero"); }}>Ver todo ›</button>
      </div>
      <div className="v2-tabs" role="tablist" aria-label="Tipo de actividad">
        {PEST.map(([k, t, fam]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "v2-tab on" : "v2-tab"} style={tab === k ? undefined : { background: C[fam].f }} onClick={() => setTab(k)}>{t}</button>
        ))}
      </div>
      {lista.length === 0 && <p className="v2-p">Pronto verás aquí lo nuevo.</p>}
      {lista.map((x, i) => (
        <button key={tab + i} type="button" className="v2-it" onClick={abre}>
          <span className="v2-it-i"><Ico n={tab === "avisos" ? "ayuda" : "agenda"} c="#08743B" s={40} />{x.img && <img src={x.img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}</span>
          <span className="v2-it-t">
            <b>{x.t}{x.ejemplo && <em> (ejemplo)</em>}</b>
            {x.l1 && <span>{x.l1}</span>}
            {x.l2 && <span>📍 {x.l2}</span>}
          </span>
        </button>
      ))}
    </section>
  );
}

// Franja propia del Aviso de privacidad (e72).
function FranjaAviso() {
  return (
    <section className="v2-aviso" aria-label="Aviso de privacidad">
      <span className="v2-aviso-i"><Ico n="escudo" c="#08743B" s={34} /></span>
      <span className="v2-aviso-t"><b>Tu privacidad importa</b><small>Cuidamos tus datos: solo los usamos para lo que tú pides y nunca los vendemos.</small></span>
      <button type="button" className="v2-ver" onClick={() => { registrar("v2_aviso"); abrirLegal("privacidad"); }}>Leer aviso ›</button>
    </section>
  );
}

// Pie de página de la portada nueva.
function Pie({ onIr, abrirParticipar, abrirClub, onSugerencias }) {
  const chat = () => window.open("https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent("¡Hola DCUATES! Quiero ponerme en contacto."), "_blank", "noopener,noreferrer");
  const L = [
    ["Nuestro DCUATES", () => onIr("nosotros")],
    ["Políticas de privacidad", () => abrirLegal("privacidad")],
    ["Términos y condiciones", () => abrirLegal("terminos")],
    ["Contacto", chat],
    ["¿Cómo puedes participar?", abrirParticipar],
    ["Club DCUATES", abrirClub],
    ["Blog", () => window.open("https://chuytrujillo.blogspot.com/", "_blank", "noopener,noreferrer")],
    ["Preguntas frecuentes", () => abrirLegal("faq")],
    ["Aviso de seguridad", () => abrirLegal("seguridad")],
    ["Escudo de seguridad", () => abrirLegal("escudo")],
    ["Mapa del sitio", () => window.dispatchEvent(new CustomEvent("dcuates:abrir-acceso", { detail: "mapa" }))],
    ...(onSugerencias ? [["Sugerencias y quejas", onSugerencias]] : [])
  ];
  return (
    <footer className="v2-pie">
      <div className="v2-pie-l"><img src="/images/logo-circular.webp" alt="" width="30" height="30" /><b>DCUATES</b><span>COMUNIDAD</span></div>
      <nav className="v2-pie-n" aria-label="Información y avisos">
        {L.map(([t, f]) => <button key={t} type="button" onClick={f}>{t}</button>)}
      </nav>
      <p>© {new Date().getFullYear()} DCUATES, un programa de CONEXIONES CON CAUSA ♥</p>
    </footer>
  );
}

export default function InicioV2({ onIr, logros = [], cargando = false, entrada = {}, portadas = {}, anuncios = [], onSugerencias, variante = "2" }) {
  const [ven, setVen] = useState(null); // participar | conocer | causas | negocios | club | como
  const imgs = (k) => (portadas[k] || []).filter((x) => x && x.tipo === "imagen" && x.img).map((x) => x.img);
  const fotosHero = imgs("inicio");
  const fotoClub = imgs("club")[0] || FOTO_CLUB;
  const tabNosotros = TABS[0];
  const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
  const cierra = () => setVen(null);
  // Cierra la ventana y, un instante después, hace lo que toca (para no apilar ventanas).
  const va = (f, tag) => () => { if (tag) registrar("v2_boton", { b: tag }); setVen(null); setTimeout(f, 160); };

  useEffect(() => {
    const abrir = () => setVen("participar");
    window.addEventListener("dcuates:abrir-entrada", abrir);
    return () => window.removeEventListener("dcuates:abrir-entrada", abrir);
  }, []);

  const abre = (k) => () => { registrar("v2_tarjeta", { k }); setVen(k); };
  const tres = [
    ["conocer", "Quiero conocer DCUATES", "Todos ganamos", "azul", "carita"],
    ["causas", "Causas y Beneficios", "Apoya y gana", "naranja", "corazon"],
    ["negocios", "Negocios, alianzas y patrocinios", "Crecemos juntos", "verde", "tienda"]
  ];
  const compartir = () => { registrar("v2_tarjeta", { k: "compartimos" }); abrirTablon(""); };
  const reg3 = [
    ["ofrezco", "OFREZCO", "Algo para compartir", "verde", "regalo", () => abrirRegistroPrevio("ofrezco", {})],
    ["necesito", "NECESITO", "Algo que me hace falta", "naranja", "ayuda", () => abrirRegistroPrevio("necesito", {})],
    ["registros", "REGISTROS", "Otras opciones", "azul", "agenda", () => ev("dcuates:abrir-acceso", "registros")]
  ];
  const Ancho = ({ n, fam, t, sub, f }) => (
    <button type="button" className="v2-bigb" style={{ borderColor: C[fam].b, boxShadow: "0 4px 0 " + C[fam].b }} onClick={f}>
      <span className="v2-bi" style={{ background: C[fam].f }}><Ico n={n} c={C[fam].i} s={46} /></span>
      <span className="v2-bt"><b>{t}</b><small style={{ color: C[fam].t }}>{sub}</small></span>
      <span className="v2-fl" style={{ background: C[fam].i }}><Ico n="flecha" c="#fff" s={20} /></span>
    </button>
  );
  const registra = (
    <section className="v2-reg" aria-label="Registra aquí tu información">
      <div className="v2-reg-t"><span className="v2-reg-i"><Ico n="mas" c="#fff" s={22} /></span><b>Registra aquí tu información</b></div>
      <div className="v2-reg-g">
        {reg3.map(([k, t, s, fam, ic, f]) => (
          <button key={k} type="button" className="v2-rb" style={{ background: C[fam].f, borderColor: C[fam].b, boxShadow: "0 4px 0 " + C[fam].b }} onClick={() => { registrar("v2_tarjeta", { k }); f(); }}>
            <Ico n={ic} c={C[fam].i} s={50} /><b>{t}</b><small style={{ color: C[fam].t }}>{s}</small>
          </button>
        ))}
      </div>
    </section>
  );
  const base = (
    <>
      <Ancho n="perinola" fam="azul" t="¿CÓMO PUEDO PARTICIPAR?" sub="Empieza aquí: es fácil y gratis" f={abre("participar")} />
      <div className="v2-tres">
        {tres.map(([k, t, s, fam, ic]) => (
          <button key={k} type="button" className="v2-card" style={{ background: C[fam].f, borderColor: C[fam].b, boxShadow: "0 4px 0 " + C[fam].b }} onClick={abre(k)}>
            <span className="v2-fl v2-fl-c" style={{ background: C[fam].i }} aria-hidden="true"><Ico n="flecha" c="#fff" s={16} /></span>
            <span className="v2-ci"><Ico n={ic} c={C[fam].i} s={60} /></span>
            <b>{t}</b>
            <small style={{ color: C[fam].t }}>{s}</small>
          </button>
        ))}
      </div>
      <Ancho n="mano" fam="verde" t="COMPARTIMOS" sub="Lo que hay y se recomienda" f={compartir} />
    </>
  );
  // v3 «Mosaico»: cuadrícula grande, todo a un toque, sin pasos intermedios.
  const mosaico = (
    <section className="v3-mos" aria-label="Todo en un vistazo">
      {[
        ["perinola", "¿Cómo puedo participar?", "azul", abre("participar")],
        ["carita", "Quiero conocer DCUATES", "azul", abre("conocer")],
        ["corazon", "Causas y Beneficios", "naranja", abre("causas")],
        ["tienda", "Negocios, alianzas y patrocinios", "verde", abre("negocios")],
        ["mano", "COMPARTIMOS", "verde", compartir],
        ["regalo", "OFREZCO", "verde", reg3[0][5]],
        ["ayuda", "NECESITO", "naranja", reg3[1][5]],
        ["agenda", "REGISTROS", "azul", reg3[2][5]]
      ].map(([ic, t, fam, f]) => (
        <button key={t} type="button" className="v3-t" style={{ background: C[fam].f, borderColor: C[fam].b, boxShadow: "0 4px 0 " + C[fam].b }} onClick={f}>
          <Ico n={ic} c={C[fam].i} s={68} /><b>{t}</b>
        </button>
      ))}
    </section>
  );
  // v4 «Ruta»: recorrido guiado en cuatro pasos.
  const ruta = (
    <>
      <section className="v4-ruta" aria-label="Tu ruta en DCUATES">
        <h2>Tu ruta en DCUATES</h2>
        {[
          ["1", "Conoce", "Quiénes somos y qué hay", "azul", "carita", abre("conocer")],
          ["2", "Participa", "Cómo puedes empezar hoy", "azul", "perinola", abre("participar")],
          ["3", "Apoya", "Causas y beneficios", "naranja", "corazon", abre("causas")],
          ["4", "Crece juntos", "Negocios, alianzas y patrocinios", "verde", "tienda", abre("negocios")]
        ].map(([n, t, sub, fam, ic, f]) => (
          <button key={n} type="button" className="v4-p" onClick={f}>
            <span className="v4-n" style={{ background: C[fam].i }}>{n}</span>
            <span className="v4-c" style={{ background: C[fam].f, borderColor: C[fam].b, boxShadow: "0 4px 0 " + C[fam].b }}>
              <Ico n={ic} c={C[fam].i} s={54} />
              <span className="v2-bt"><b>{t}</b><small style={{ color: C[fam].t }}>{sub}</small></span>
              <span className="v2-fl" style={{ background: C[fam].i }}><Ico n="flecha" c="#fff" s={20} /></span>
            </span>
          </button>
        ))}
      </section>
      <Ancho n="mano" fam="verde" t="COMPARTIMOS" sub="Lo que hay y se recomienda" f={compartir} />
      {registra}
    </>
  );
  return (
    <div className="vi-root v2-root">
      <style>{CSS_VI}</style>
      <style>{CSS}</style>
      <HeroFade fotos={fotosHero} />
      {variante === "3" ? mosaico : variante === "4" ? ruta : base}
      <Atajos />
      <div id="vi-resultados" />
      {variante === "2" && registra}
      <button type="button" className="v2-club" onClick={abre("club")} aria-label="Club DCUATES: únete aquí">
        <img src={fotoClub} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <span className="v2-club-vel" aria-hidden="true" />
        <span className="v2-club-t">
          <b>CLUB DCUATES</b>
          <em>¡Ser Cuate tiene premio!</em>
          <span className="v2-fichas">
            <span><Ico n="estrella" c="#E06A12" s={30} />Puntos</span>
            <span><Ico n="premio" c="#2C8A2E" s={30} />Premios</span>
            <span><Ico n="llave" c="#2B5BD7" s={30} />Contenidos</span>
          </span>
          <span className="v2-ver v2-club-b">Únete aquí ›</span>
        </span>
        <strong className="v2-club-p">¡GRATIS!</strong>
      </button>

      <Actividades agenda={entrada.agenda} filasZona={entrada.filasZona} anuncios={anuncios} />
      <div className="vi-logros bc-root" style={{ "--tc": "#08743B" }}>
        <BandaImpacto logros={logros} cargando={cargando} tab={{ ...tabNosotros, banda: { titulo: "LO QUE HEMOS LOGRADO JUNTOS" } }} />
      </div>

      <FranjaAviso />
      <Pie onIr={onIr} abrirParticipar={() => setVen("participar")} abrirClub={() => setVen("club")} onSugerencias={onSugerencias} />

      {/* Anfitrión oculto: atiende las ventanas HOY y EXPLORA con los mismos datos de siempre. */}
      <div style={{ display: "none" }}><EntradaDcuates {...entrada} anfitrion /></div>

      <Hoja abierta={ven === "participar"} onCerrar={cierra} titulo="¿Cómo puedo participar?">
        <p className="v2-p">Elige por dónde empezar. Todo es gratis y puedes volver cuando quieras.</p>
        <Fila n="ayuda" t="Cómo funciona" s="Te lo explicamos con ejemplos" fam="azul" f={() => { registrar("como_funciona"); setVen("como"); }} />
        <Fila n="puerta" t="Puertas" s="Elige cómo quieres participar" fam="azul" f={va(elegirPuerta, "puertas")} />
        <Fila n="brujula" t="Tour DCUATES" s="Recuerda cómo moverte por la página" fam="azul" f={va(abrirTour, "tour")} />
      </Hoja>

      <Hoja abierta={ven === "como"} onCerrar={() => setVen("participar")} titulo="Cómo funciona DCUATES">
        <ComoFunciona onCerrar={() => setVen("participar")} />
      </Hoja>

      <Hoja abierta={ven === "conocer"} onCerrar={cierra} titulo="Quiero conocer DCUATES">
        <p className="v2-p">Todos ganamos: conoce la comunidad y entra a lo que más te interese.</p>
        <Fila n="gente" t="Nosotros" s="Quiénes somos" fam="azul" f={va(() => onIr("nosotros"), "nosotros")} />
        <Fila n="brujula" t="Explora" s="Proyectos, juegos, servicios y más" fam="azul" f={va(() => abrirVentanaEntrada("explora"), "explora")} />
        <Fila n="agenda" t="Agenda +" s="Eventos, avisos y convocatorias" fam="azul" f={va(() => abrirPlus(), "agenda")} extra={{ n: "sol", t: "HOY", f: va(() => abrirVentanaEntrada("hoy"), "hoy") }} />
        <Fila n="cohete" t="Súmate" s="Tu parte hace la diferencia" fam="azul" f={va(() => onIr("cierre"), "sumate")} />
      </Hoja>

      <Hoja abierta={ven === "causas"} onCerrar={cierra} titulo="Causas y Beneficios">
        <p className="v2-p">Apoya una causa y gana beneficios para ti y tu comunidad.</p>
        <Fila n="corazon" t="Causas" s="Lo que nos une" fam="naranja" f={va(() => onIr("causas"), "causas")} />
        <Fila n="regalo" t="Beneficios" s="Lo que puedes obtener" fam="naranja" f={va(() => onIr("beneficios"), "beneficios")} />
        <Fila n="video" t="Ejemplo: Chuy" s="Mira una causa que sí se logró" fam="naranja" f={va(() => irASeccion("chuy-video"), "chuy")} />
        <Fila n="dar" t="Cómo apoyar causas" s="Dona o participa" fam="naranja" f={va(() => irASeccion("donaciones"), "apoyar")} />
      </Hoja>

      <Hoja abierta={ven === "negocios"} onCerrar={cierra} titulo="Negocios, alianzas y patrocinios">
        <p className="v2-p">Todos ganamos cuando los negocios, aliados y patrocinadores suman.</p>
        <Fila n="tienda" t="Negocios" s="Emprendimientos que multiplican valor" fam="verde" f={va(() => onIr("negocios"), "negocios")} />
        <Fila n="estrella" t="Gratitud" s="Gracias, reconocimientos y muro" fam="verde" f={va(() => onIr("gratitud"), "gratitud")} />
        <Fila n="alianza" t="Alianzas" s="Zona de aliados" fam="verde" f={va(() => ejecutar({ aliados: 1 }), "alianzas")} />
        <Fila n="libro" t="Patrocinios" s="Cómo patrocinar" fam="verde" f={va(() => irASeccion("patrocinadores"), "patrocinios")} />
      </Hoja>

      <Hoja abierta={ven === "club"} onCerrar={cierra} titulo="Club DCUATES">
        <ClubTarjeta />
      </Hoja>
    </div>
  );
}

const CSS = `
.v2-root{background:#FFFBEA;padding:8px 10px 18px;display:flex;flex-direction:column;gap:12px;border-radius:0}
.v2-root button{font-family:inherit}
.v2-i{flex:none;display:block}
.v2-hero{position:relative;height:190px;border-radius:20px;overflow:hidden;background:#14532d;flex:none}
.v2-hero-i{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 1.4s ease}
.v2-bigb{display:flex;align-items:center;gap:10px;width:100%;min-height:84px;padding:8px 10px;background:#fff;border:2px solid #d7e8bd;border-radius:18px;text-align:left;cursor:pointer;color:#0f3b22}
.v2-bigb:active,.v2-card:active,.v2-rb:active,.v2-club:active{transform:scale(.97)}
.v2-bi{flex:none;width:66px;height:66px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.v2-bt{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.1}
.v2-bt b{font-size:19px;font-weight:900;letter-spacing:.3px}
.v2-bt small{font-size:12.5px;font-weight:700;color:#6a4310;margin-top:2px}
.v2-fl{flex:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.v2-fl-c{position:absolute;top:6px;right:6px;width:28px;height:28px}
.v2-card{position:relative}
.v2-ci{display:flex;margin-top:6px}
.v2-fichas{display:flex;gap:6px;margin:4px 0}
.v2-fichas span{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:1px;background:#fff;border:2px solid #efe6c8;border-radius:12px;padding:4px 2px;font-size:11px;font-weight:900;color:#0f3b22}
.v2-aviso{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #cfe5b0;border-radius:18px;padding:10px}
.v2-aviso-i{flex:none;width:52px;height:52px;border-radius:50%;background:#E9F6D5;display:flex;align-items:center;justify-content:center}
.v2-aviso-t{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.2}.v2-aviso-t b{font-size:16px;font-weight:900}.v2-aviso-t small{font-size:12px;font-weight:700;color:#2f4d3f}
.v3-mos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.v3-t{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;text-align:center;min-height:132px;padding:10px 6px;border:2px solid;border-radius:20px;cursor:pointer;color:#0f3b22;min-width:0}
.v3-t b{font-size:15px;font-weight:900;line-height:1.1;overflow-wrap:anywhere}.v3-t:active{transform:scale(.97)}
.v4-ruta{display:flex;flex-direction:column;gap:10px;position:relative}
.v4-ruta h2{margin:0 2px;font-size:20px;font-weight:900;color:#08743B}
.v4-p{display:flex;align-items:center;gap:8px;width:100%;padding:0;border:0;background:transparent;text-align:left;cursor:pointer;position:relative}
.v4-n{flex:none;width:34px;height:34px;border-radius:50%;color:#fff;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;z-index:1}
.v4-p:not(:last-child)::before{content:"";position:absolute;left:16px;top:34px;bottom:-14px;width:3px;background:#d7e8bd}
.v4-c{flex:1;min-width:0;display:flex;align-items:center;gap:10px;min-height:76px;padding:8px 10px;border:2px solid;border-radius:18px;color:#0f3b22}
.v2-ver{flex:none;background:#08743B;color:#fff;font-weight:900;font-size:13.5px;border-radius:22px;min-height:44px;padding:0 12px;display:flex;align-items:center}
.v2-tres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.v2-card{display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;min-height:172px;padding:10px 6px;border:2px solid;border-radius:18px;cursor:pointer;color:#0f3b22;min-width:0}
.v2-card b{font-size:14.5px;font-weight:900;line-height:1.1;overflow-wrap:anywhere}
.v2-card small{font-size:12px;font-weight:800;line-height:1.2}
.v2-go{margin-top:auto;width:30px;height:30px;border-radius:50%;background:#08743B;display:flex;align-items:center;justify-content:center}
.v2-reg{background:#fff;border:2px solid #efe6c8;border-radius:18px;padding:8px 8px 10px}
.v2-reg-t{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.v2-reg-t b{font-size:16.5px;font-weight:900}
.v2-reg-i{width:36px;height:36px;border-radius:50%;background:#08743B;display:flex;align-items:center;justify-content:center;flex:none}
.v2-reg-g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.v2-rb{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;min-height:116px;padding:10px 6px;border:2px solid;border-radius:16px;cursor:pointer;color:#0f3b22;min-width:0}
.v2-rb b{font-size:14px;font-weight:900;letter-spacing:.3px}
.v2-rb small{font-size:11.5px;font-weight:700;line-height:1.15}
.v2-club{position:relative;display:block;width:100%;height:230px;padding:0;border-radius:20px;overflow:hidden;background:#FFFBEA;border:2px solid #e3dcae;text-align:left;cursor:pointer;flex:none;color:#0f3b22}
.v2-club img{position:absolute;right:0;top:0;width:62%;height:100%;object-fit:cover;-webkit-mask-image:linear-gradient(to left,#000 62%,transparent);mask-image:linear-gradient(to left,#000 62%,transparent)}
.v2-club-vel{position:absolute;inset:0;background:linear-gradient(to right,rgba(255,251,234,.98) 0%,rgba(255,251,234,.94) 52%,rgba(255,251,234,.55) 68%,rgba(255,251,234,0) 90%)}
.v2-club-t{position:relative;display:flex;flex-direction:column;gap:4px;width:64%;height:100%;box-sizing:border-box;padding:12px}
.v2-club-t b{font-size:21px;font-weight:900;line-height:1}
.v2-club-t em{font-style:normal;font-size:14px;font-weight:900;color:#E06A12;line-height:1.2}
.v2-club-t>span:not(.v2-ver):not(.v2-fichas){font-size:12px;font-weight:700}
.v2-club-b{margin-top:auto;align-self:flex-start}
.v2-club-p{position:absolute;right:10px;top:10px;background:#E06A12;color:#fff;font-size:14px;font-weight:900;border-radius:20px;padding:6px 12px;transform:rotate(6deg);box-shadow:0 3px 0 #a84a08}
.v2-act{background:#fff;border:2px solid #efe6c8;border-radius:18px;padding:10px 6px}
.v2-act-h{display:flex;align-items:center;gap:8px;margin:0 2px 8px}
.v2-act-h h2{flex:1;min-width:0;margin:0;font-size:20px;font-weight:900;line-height:1.05;color:#08743B}
.v2-tabs{display:grid;grid-template-columns:1fr 1fr 1fr 1.45fr;gap:5px;margin-bottom:8px}
.v2-tab{min-height:40px;border:0;border-radius:20px;color:#0f3b22;font-size:11px;font-weight:900;cursor:pointer;padding:0 1px;white-space:nowrap}
.v2-tab.on{background:#08743B;color:#fff}
.v2-it{display:flex;gap:10px;align-items:center;width:100%;text-align:left;background:#fff;border:0;border-top:1.5px solid #efe6c8;padding:8px 2px;cursor:pointer;color:#0f3b22}
.v2-it-i{flex:none;width:92px;height:76px;border-radius:12px;background:#E9F6D5;display:flex;align-items:center;justify-content:center;overflow:hidden}
.v2-it-i{position:relative}.v2-it-i img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.v2-it-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.v2-it-t b{font-size:15.5px;font-weight:900;line-height:1.15}
.v2-it-t em{font-style:normal;font-size:11px;font-weight:700;color:#6b7c70}
.v2-it-t span{font-size:12.5px;font-weight:700;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v2-pie{background:#E9F6D5;border-radius:18px;padding:12px 10px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;margin-bottom:56px}
.v2-pie-l{display:flex;align-items:center;gap:8px}.v2-pie-l img{border-radius:50%}
.v2-pie-l b{font-size:16px;font-weight:900;color:#08743B}.v2-pie-l span{font-size:11px;font-weight:900;letter-spacing:.12em;color:#E65100}
.v2-pie-n{display:flex;flex-wrap:wrap;gap:2px 14px;justify-content:center}
.v2-pie-n button{min-height:36px;border:0;background:transparent;font-size:13px;font-weight:800;color:#1e4a2c;cursor:pointer;padding:0 2px}
.v2-pie p{margin:0;font-size:11.5px;font-weight:800;color:#1e4a2c}
.v2-p{margin:2px 2px 10px;font-size:14.5px;font-weight:700;color:#2f4d3f;line-height:1.35}
.v2-fila{display:flex;gap:8px;align-items:stretch;margin-bottom:8px}
.v2-fb{flex:1;min-width:0;display:flex;align-items:center;gap:10px;min-height:64px;padding:8px 12px;border:2px solid;border-radius:16px;text-align:left;cursor:pointer;color:#0f3b22}
.v2-fi{flex:none;width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.v2-ft{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.15}
.v2-ft b{font-size:16.5px;font-weight:900}
.v2-ft small{font-size:13px;font-weight:700}
.v2-fx{flex:none;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:64px;border:2px solid;border-radius:16px;font-size:13px;font-weight:900;cursor:pointer}
.v2-root .vi-logros{margin:0}
@media (prefers-reduced-motion:reduce){.v2-hero-i{transition:none}}
`;
