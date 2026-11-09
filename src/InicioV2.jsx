// INICIO v2 (e71) — portada rediseñada: se activa con ?v=2 (y se recuerda en este celular; ?v=1 regresa a la anterior).
// Conserva el cintillo, el encabezado y la barra inferior (viven fuera de aquí). Todos los botones llevan a lo mismo que antes.
import React, { useEffect, useState } from "react";
import EntradaDcuates, { elegirPuerta, abrirVentanaEntrada, abrirTour } from "./PuertasDcuates.jsx";
import { BandaImpacto, TABS } from "./BloqueCentral.jsx";
import { Hoja, Atajos, CSS as CSS_VI } from "./InicioNuevo.jsx";
import CosasSemana from "./CosasSemana.jsx";
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

export default function InicioV2({ onIr, logros = [], cargando = false, entrada = {}, portadas = {} }) {
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
  return (
    <div className="vi-root v2-root">
      <style>{CSS_VI}</style>
      <style>{CSS}</style>
      <HeroFade fotos={fotosHero} />

      <button type="button" className="v2-bigb" onClick={abre("participar")}>
        <span className="v2-bi" style={{ background: C.azul.f }}><Ico n="puerta" c={C.azul.i} s={30} /></span>
        <span className="v2-bt"><b>¿CÓMO PUEDO PARTICIPAR?</b><small>Empieza aquí: es fácil y gratis</small></span>
        <span className="v2-ver">Ver más ›</span>
      </button>

      <div className="v2-tres">
        {[
          ["conocer", "Quiero conocer DCUATES", "Todos ganamos", "azul", "carita", "gente"],
          ["causas", "Causas y Beneficios", "Apoya y gana", "naranja", "corazon", "regalo"],
          ["negocios", "Negocios, alianzas y patrocinios", "Crecemos juntos", "verde", "tienda", "alianza"]
        ].map(([k, t, s, fam, ic]) => (
          <button key={k} type="button" className="v2-card" style={{ background: C[fam].f, borderColor: C[fam].b }} onClick={abre(k)}>
            <span className="v2-ci"><Ico n={ic} c={C[fam].i} s={42} /></span>
            <b>{t}</b>
            <small style={{ color: C[fam].t }}>{s}</small>
            <span className="v2-go" aria-hidden="true"><Ico n="flecha" c="#fff" s={18} /></span>
          </button>
        ))}
      </div>

      <button type="button" className="v2-bigb" onClick={() => { registrar("v2_tarjeta", { k: "compartimos" }); abrirTablon(""); }}>
        <span className="v2-bi" style={{ background: C.verde.f }}><Ico n="mano" c={C.verde.i} s={30} /></span>
        <span className="v2-bt"><b>COMPARTIMOS</b><small style={{ color: C.naranja.t }}>Lo que hay y se recomienda</small></span>
        <span className="v2-ver">Ver más ›</span>
      </button>
      <Atajos />
      <div id="vi-resultados" />

      <section className="v2-reg" aria-label="Registra aquí tu información">
        <div className="v2-reg-t"><span className="v2-reg-i"><Ico n="mas" c="#fff" s={22} /></span><b>Registra aquí tu información</b></div>
        <div className="v2-reg-g">
          {[
            ["ofrezco", "OFREZCO", "Algo para compartir", "verde", "regalo", () => abrirRegistroPrevio("ofrezco", {})],
            ["necesito", "NECESITO", "Algo que me hace falta", "naranja", "ayuda", () => abrirRegistroPrevio("necesito", {})],
            ["registros", "REGISTROS", "Otras opciones", "azul", "agenda", () => ev("dcuates:abrir-acceso", "registros")]
          ].map(([k, t, s, fam, ic, f]) => (
            <button key={k} type="button" className="v2-rb" style={{ background: C[fam].f, borderColor: C[fam].b }} onClick={() => { registrar("v2_tarjeta", { k }); f(); }}>
              <Ico n={ic} c={C[fam].i} s={36} /><b>{t}</b><small style={{ color: C[fam].t }}>{s}</small>
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="v2-club" onClick={abre("club")} aria-label="Club DCUATES: únete aquí">
        <img src={fotoClub} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <span className="v2-club-vel" aria-hidden="true" />
        <span className="v2-club-t">
          <b>CLUB DCUATES</b>
          <em>Conecta, participa y gana beneficios</em>
          <span>· Forma parte de la comunidad</span>
          <span>· Acumula puntos y obtén premios</span>
          <span>· Accede a contenidos exclusivos</span>
          <span className="v2-ver v2-club-b">Únete aquí ›</span>
        </span>
        <strong className="v2-club-p">¡Ser Cuate tiene premio!</strong>
      </button>

      <div className="vi-logros bc-root" style={{ "--tc": "#08743B" }}>
        <BandaImpacto logros={logros} cargando={cargando} tab={{ ...tabNosotros, banda: { titulo: "LO QUE HEMOS LOGRADO JUNTOS" } }} />
      </div>

      <section className="v2-act" aria-label="Actividades DCUATES">
        <h2>Actividades DCUATES</h2>
        <CosasSemana agenda={entrada.agenda} filasZona={entrada.filasZona} />
      </section>

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
.v2-bigb{display:flex;align-items:center;gap:10px;width:100%;min-height:66px;padding:8px 10px;background:#fff;border:2px solid #d7e8bd;border-radius:18px;text-align:left;cursor:pointer;color:#0f3b22}
.v2-bigb:active,.v2-card:active,.v2-rb:active,.v2-club:active{transform:scale(.97)}
.v2-bi{flex:none;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.v2-bt{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.1}
.v2-bt b{font-size:19px;font-weight:900;letter-spacing:.3px}
.v2-bt small{font-size:12.5px;font-weight:700;color:#6a4310;margin-top:2px}
.v2-ver{flex:none;background:#08743B;color:#fff;font-weight:900;font-size:13.5px;border-radius:22px;min-height:44px;padding:0 12px;display:flex;align-items:center}
.v2-tres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.v2-card{display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;min-height:158px;padding:10px 6px;border:2px solid;border-radius:18px;cursor:pointer;color:#0f3b22;min-width:0}
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
.v2-club{position:relative;display:block;width:100%;height:210px;padding:0;border-radius:20px;overflow:hidden;background:#FFFBEA;border:2px solid #e3dcae;text-align:left;cursor:pointer;flex:none;color:#0f3b22}
.v2-club img{position:absolute;right:0;top:0;width:62%;height:100%;object-fit:cover;-webkit-mask-image:linear-gradient(to left,#000 62%,transparent);mask-image:linear-gradient(to left,#000 62%,transparent)}
.v2-club-vel{position:absolute;inset:0;background:linear-gradient(to right,rgba(255,251,234,.98) 0%,rgba(255,251,234,.94) 52%,rgba(255,251,234,.55) 68%,rgba(255,251,234,0) 90%)}
.v2-club-t{position:relative;display:flex;flex-direction:column;gap:4px;width:64%;height:100%;box-sizing:border-box;padding:12px}
.v2-club-t b{font-size:21px;font-weight:900;line-height:1}
.v2-club-t em{font-style:normal;font-size:12.5px;font-weight:800;color:#1e4a2c;line-height:1.2}
.v2-club-t>span:not(.v2-ver){font-size:12px;font-weight:700}
.v2-club-b{margin-top:auto;align-self:flex-start}
.v2-club-p{position:absolute;right:12px;top:12px;width:96px;text-align:right;font-size:16px;font-weight:900;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.65);line-height:1.1}
.v2-act{background:#fff;border:2px solid #efe6c8;border-radius:18px;padding:10px 6px}
.v2-act h2{margin:0 0 6px 6px;font-size:20px;font-weight:900;color:#08743B}
.v2-act .cs-sec,.v2-act section{margin-top:0}
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
