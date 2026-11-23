// «¿QUÉ ES DCUATES?» (e87) — MAQUETA para revisión. Complemento de «Quiero conocer DCUATES» (que no se toca).
// Nivel 1: ventana de menú (botones con leyenda, estilo EXPLORA). Nivel 2: pantallas con vista (logo con D naranja, foto, tarjetas).
// Todo el texto vive en src/datos/queEsDcuates.js. Fotos: public/images/que-es/<clave>.webp (reemplazables).
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { abrirTablon } from "./Tablon.jsx";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { abrirAsistente } from "./AsistentePagina.jsx";
import { abrirPuerta } from "./PuertasDcuates.jsx";
import BotonCompartir from "./BotonCompartir.jsx";
import { ejecutar as ejecutarAccion } from "./datos/secciones.js";
import { expandirBusqueda } from "./datos/sinonimos.js";
import { puertaPorId } from "./datos/puertas.js";
import { LogoDcuates } from "./componentes/LogoDcuates.jsx";
import { FRASES, APARTADOS, VISION, ACCIONES, FUNDAMENTOS, RELACION, IDENTIDAD, MOTIVOS, DIMENSIONES, FORMAS, FUTURO, PUERTA1, ATAJOS1, PUENTE, PUERTA2, ATAJOS2, ATAJOS1_MAS, ATAJOS2_MAS, PUERTA_A_ENTRADA, CLAVES_BUSCADOR, AMBAS, CULTIVAR, TEJER, CULTIVAR_TEJER_NOTA, CADENA, CIERRE, POR_QUE, ACCIONES_PASO } from "./datos/queEsDcuates.js";

export const abrirQueEs = (v) => window.dispatchEvent(new CustomEvent("dcuates:que-es", { detail: typeof v === "string" ? v : "menu" }));
const HASH = "#que-es-dcuates";
// e89: cada pantalla tiene su enlace: #que-es-dcuates (menú) · #que-es-p1 · #que-es-a3 …
const vistaDeHash = () => {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/^#que-es-(dcuates|p1|p2|a[1-8])$/);
  return m ? (m[1] === "dcuates" ? "menu" : m[1]) : null;
};
const sinAc = (x) => String(x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const VISTAS = ["menu", "p1", "p2", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"];

function Hero({ h, c, e, t, sub, children }) {
  const [ok, setOk] = useState(!!h);
  return (
    <div className="qe-hero-f" style={{ background: "linear-gradient(135deg," + c + "," + c + "99)" }}>
      {ok && <img src={"/images/que-es/" + h + ".webp"} alt="" onError={() => setOk(false)} />}
      {!ok && <span className="qe-hero-e" aria-hidden="true">{e}</span>}
      <div className="qe-hero-o">{children}</div>
    </div>
  );
}

function Mini({ k, e, c }) {
  const [ok, setOk] = useState(true);
  return (
    <span className="qe-foto" style={{ background: c + "22" }}>
      <span className="qe-foto-e" aria-hidden="true">{e}</span>
      {ok && <img src={"/images/que-es/" + k + ".webp"} alt="" loading="lazy" onError={() => setOk(false)} />}
    </span>
  );
}

function Tarjeta({ it, onMas, letra }) {
  return (
    <div className="qe-card" style={{ borderColor: it.c }} data-testid={"qe-card-" + (it.k || it.l)}>
      {letra ? <i className="qe-letra-g" style={{ background: it.c }}>{it.l}</i> : <Mini k={it.k} e={it.e} c={it.c} />}
      <div className="qe-card-t">
        <b style={{ color: it.c }}>{it.v || it.t}</b>
        <span>{it.corto}</span>
        <button type="button" className="qe-mas" style={{ color: it.c, borderColor: it.c }} onClick={() => onMas(it)}>Conoce más ›</button>
      </div>
    </div>
  );
}

export default function QueEsDcuates() {
  const [abierto, setAbierto] = useState(() => !!vistaDeHash());
  const [vista, setVista] = useState(() => vistaDeHash() || "menu");
  const [busca, setBusca] = useState("");
  const [masAt, setMasAt] = useState({});
  const [mas, setMas] = useState(null);
  const p2 = useRef(null);
  useEffect(() => {
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    if (vistaDeHash()) quitar();
    const al = () => { const v = vistaDeHash(); if (v) { setVista(v); setAbierto(true); quitar(); } };
    const ev = (e) => { setVista(VISTAS.includes(e.detail) ? e.detail : "menu"); setAbierto(true); };
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:que-es", ev);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:que-es", ev); };
  }, []);
  const cerrar = () => { setAbierto(false); setMas(null); };
  const oculta = useAtras(abierto, cerrar, { hub: true });
  // e93: dentro de una opción (Quiero buscar, Descubre…) «Atrás» y ✕ regresan al MENÚ de «¿Qué es DCUATES?», no a la página principal.
  useAtras(abierto && vista !== "menu", () => { setMas(null); setVista("menu"); });
  const ocultaMas = useAtras(!!mas, () => setMas(null));
  const salirVista = () => {
    if (vista === "menu") { cerrar(); return; }
    const v0 = vista;
    try { history.back(); } catch (x) { setVista("menu"); }
    setTimeout(() => setVista((v) => (v === v0 ? "menu" : v)), 250); // por si el historial no respondió
  };
  useEffect(() => { if (abierto) registrar("que_es_abrir"); }, [abierto]);
  useEffect(() => { if (abierto) registrar("que_es_vista", { v: vista }); }, [abierto, vista]);
  useEffect(() => { if (abierto) { const el = document.querySelector(".qe-cuerpo"); if (el) el.scrollTop = 0; } }, [vista, abierto]);
  if (!abierto) return null;

  const ir = (v) => { setMas(null); setVista(v); };
  const nAp = vista[0] === "a" ? Number(vista.slice(1)) : 0;
  const A = nAp ? APARTADOS[nAp - 1] : null;
  const abrirMas = (it) => { registrar("que_es_mas", { k: it.k || it.l }); setMas(it); };
  const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
  const ejecutar = (acc) => {
    registrar("que_es_atajo", { acc });
    if (acc === "directorio") ev("dcuates:directorio");
    else if (acc === "tablon") abrirTablon("");
    else if (acc === "necesito") abrirRegistroPrevio("necesito", {});
    else if (acc === "ofrezco") abrirRegistroPrevio("ofrezco", {});
    else if (acc === "asistente") abrirAsistente();
    else if (acc === "causas" || acc === "club" || acc === "participar") ev("dcuates:que-es-ir", acc);
    else if (acc === "urgencia") abrirPuerta("dificil");
    else if (acc === "extraviados") abrirTablon("Extraviados");
    else if (acc === "puertas") ejecutarAccion({ elegir: 1 });
    else if (acc === "mapa") ejecutarAccion({ acc: "mapa" });
    else if (acc === "propon") ejecutarAccion({ z: "propon" });
    else if (acc === "aliados") ejecutarAccion({ aliados: 1 });
    else if (acc === "causa") ejecutarAccion({ z: "causa" });
    else if (acc === "folio") ev("dcuates:consulta-folio");
  };
  const Lista = ({ items, letra }) => <div className="qe-lista">{items.map((it) => <Tarjeta key={it.k || it.l} it={it} onMas={abrirMas} letra={letra} />)}</div>;
  const Sig = ({ txt }) => (
    <div className="qe-pie">
      {(ACCIONES_PASO[nAp] || []).map((a) => <button key={a.acc} type="button" className="qe-nav qe-nav-a" style={{ borderColor: A.c, color: A.c }} onClick={() => ejecutar(a.acc)} data-testid={"qe-paso-" + a.acc}><span aria-hidden="true">{a.e}</span> {a.t}</button>)}
      <button type="button" className="qe-p-cta" style={{ background: A.c }} onClick={() => ir(nAp < 8 ? "a" + (nAp + 1) : "menu")} data-testid="qe-sig">{txt || (nAp < 8 ? APARTADOS[nAp].t + " ›" : "Volver al inicio ↑")}</button>
      {nAp > 1 && <button type="button" className="qe-nav" onClick={() => ir("a" + (nAp - 1))} data-testid="qe-ant">‹ {APARTADOS[nAp - 2].t}</button>}
      <button type="button" className="qe-nav qe-nav-c" onClick={() => ir("menu")} data-testid="qe-central">Volver al menú</button>
    </div>
  );
  const Puerta = ({ d, atajos, extra, id, accCta, children }) => (
    <>
      <Hero h={d.h} c={d.c} e={d.e}><span className="qe-hero-n" style={{ background: d.c }}>PUERTA {d.n}</span><h2>{d.t}</h2></Hero>
      <section className="qe-puerta" style={{ borderColor: d.c, background: d.f }} data-testid={id}>
        <p className="qe-p-lema">{d.lema}</p>
        <ul className="qe-p-ej">{d.ejemplos.map((x) => <li key={x}>{x}</li>)}</ul>
        {d.beneficios && <div className="qe-chips qe-chips-s">{d.beneficios.map((m) => <span key={m}>{m}</span>)}</div>}
        <p className="qe-p-nota">{d.nota}</p>
        {d.apoyo && <p className="qe-p-nota">{d.apoyo}</p>}
        <button type="button" className="qe-p-cta" style={{ background: d.c }} onClick={() => ejecutar(accCta)} data-testid={id + "-cta"}>{d.cta} ›</button>
        <div className="qe-atajos">{atajos.map((a) => <button key={a.t} type="button" style={{ borderColor: d.c, color: d.c }} onClick={() => ejecutar(a.acc)} data-testid={"qe-atajo-" + a.acc}><span aria-hidden="true">{a.e}</span> {a.t}</button>)}</div>
        {extra && (
          <>
            {masAt[id] && <div className="qe-atajos" data-testid={id + "-mas"}>{extra.map((a) => <button key={a.t} type="button" style={{ borderColor: d.c, color: d.c }} onClick={() => ejecutar(a.acc)} data-testid={"qe-atajo-" + a.acc + "-x"}><span aria-hidden="true">{a.e}</span> {a.t}</button>)}</div>}
            <button type="button" className="qe-vmas" style={{ color: d.c }} onClick={() => setMasAt((m) => ({ ...m, [id]: !m[id] }))} aria-expanded={!!masAt[id]} data-testid={id + "-vermas"}>{masAt[id] ? "Ver menos atajos ▴" : "Ver más atajos ▾"}</button>
          </>
        )}
      </section>
      {children}
    </>
  );

  // Buscador (e89): palabras escritas + sinónimos del sitio; busca en los títulos, textos cortos y palabras clave de cada pantalla.
  const indice = [
    ...[PUERTA1, PUERTA2].map((d, i) => ({ v: "p" + (i + 1), t: d.t, e: d.e, d: d.l, x: [d.t, d.l, d.lema, (d.ejemplos || []).join(" "), CLAVES_BUSCADOR["p" + (i + 1)]].join(" ") })),
    ...APARTADOS.map((a) => ({ v: "a" + a.n, t: a.t, e: a.e, d: "Paso " + a.n + " de 8", x: [a.t, a.l, CLAVES_BUSCADOR["a" + a.n]].join(" ") })),
    ...[[ACCIONES, "a3"], [FUNDAMENTOS, "a4"], [IDENTIDAD, "a5"], [DIMENSIONES, "a6"], [FORMAS, "a7"]].flatMap(([lista, v]) => lista.map((it) => ({ v, t: it.t || it.v, e: it.e, d: it.corto, x: [it.t, it.v, it.corto].join(" ") })))
  ];
  const palabras = sinAc(busca).split(/[^a-z0-9ñ]+/).filter((w) => w.length > 1);
  const resultados = palabras.length ? (() => {
    const alts = expandirBusqueda(palabras);
    return indice.filter((it) => { const t = sinAc(it.x); return alts.every((lista) => lista.some((w) => t.includes(sinAc(w)))); }).slice(0, 8);
  })() : [];
  // Puerta elegida antes en «Elige tu puerta» (se guarda en el teléfono) → sugerir por dónde empezar.
  let sugerida = null;
  try {
    const id = window.localStorage.getItem("dc_puerta");
    const pu = id ? puertaPorId(id) : null;
    if (pu) { const v = PUERTA_A_ENTRADA[id] || "p1"; const d = v === "p2" ? PUERTA2 : PUERTA1; sugerida = { v, t: d.t, e: pu.e, p: pu.t }; }
  } catch (x) { /* sin almacenamiento */ }
  let cuerpo = null;
  if (vista === "p1") {
    cuerpo = (
      <Puerta d={PUERTA1} atajos={ATAJOS1} extra={ATAJOS1_MAS} id="qe-puerta1" accCta="tablon">
        <div className="qe-puente" data-testid="qe-puente">
          <div className="qe-puente-l" aria-hidden="true">⌄</div>
          <h3>{PUENTE.t}</h3>
          {PUENTE.p.map((x, i) => <p key={i}>{x}</p>)}
          <b className="qe-puente-i">{PUENTE.inv}</b>
          <button type="button" className="qe-p-cta qe-puente-b" onClick={() => ir("p2")} data-testid="qe-puente-cta">{PUENTE.cta} ›</button>
        </div>
        <button type="button" className="qe-nav qe-nav-c" style={{ width: "calc(100% - 28px)" }} onClick={() => ir("menu")} data-testid="qe-central">Volver al menú</button>
      </Puerta>
    );
  } else if (vista === "p2") {
    cuerpo = (
      <Puerta d={PUERTA2} atajos={ATAJOS2} extra={ATAJOS2_MAS} id="qe-puerta2" accCta="participar">
        <div className="qe-ambas" data-testid="qe-ambas"><b>{AMBAS.t}</b><span>{AMBAS.p}</span>
          <button type="button" className="qe-nav" onClick={() => ir("p1")} data-testid="qe-a-p1">‹ Ver la Puerta 01: Quiero buscar / solicitar</button></div>
        <div className="qe-frase qe-frase-g" data-testid="qe-rectora">{FRASES.cultivamos}<small>{FRASES.desarrollo}</small></div>
        <button type="button" className="qe-nav qe-nav-c" style={{ width: "calc(100% - 28px)" }} onClick={() => ir("menu")} data-testid="qe-central">Volver al menú</button>
      </Puerta>
    );
  } else if (nAp === 1) {
    cuerpo = (
      <>
        <Hero h="descubre" c={A.c} e={A.e}><h2>¿QUÉ ES DCUATES?</h2><small>DESARROLLO INTEGRAL Y COMPARTIDO</small></Hero>
        <p className="qe-lead">{FRASES.bienvenidaTxt}</p>
        <div className="qe-por" data-testid="qe-bienvenida"><i>?</i><div><b>¿Por qué existimos?</b><span>{POR_QUE}</span></div></div>
        <p className="qe-lead qe-lead-s">{FRASES.bienvenidaTxt2}</p>
        <div className="qe-frase">{FRASES.bienvenida}</div>
        <Sig txt="DESCUBRE EL CAMINO ↓" />
      </>
    );
  } else if (nAp === 2) {
    cuerpo = (
      <>
        <div className="qe-vis"><span className="qe-badge">NUESTRA VISIÓN</span>
          <h2 className="qe-d-t"><i>D</i> — DESARROLLAR</h2><b>Desarrollo Integral y Compartido</b></div>
        <Hero h="comprende" c={A.c} e={A.e} />
        <p className="qe-lead">Desarrollarnos es crecer desde nuestras capacidades y compartir ese crecimiento con los demás.</p>
        <div className="qe-tres">{VISION.tres.map((t) => <span key={t}>{t}</span>)}</div>
        <button type="button" className="qe-mas qe-mas-solo" style={{ color: VISION.c, borderColor: VISION.c }} onClick={() => abrirMas({ k: "d", mas: VISION.mas, c: VISION.c })}>Conoce más sobre la D ›</button>
        <div className="qe-ct">
          {[CULTIVAR, TEJER].map((x) => (
            <div key={x.t} style={{ background: x.f, borderColor: x.c }} data-testid={"qe-" + x.t.toLowerCase()}>
              <span aria-hidden="true">{x.e}</span><b style={{ color: x.c }}>{x.t}</b><em>{x.d}</em><p>{x.p}</p>
            </div>
          ))}
        </div>
        <p className="qe-ct-n">{CULTIVAR_TEJER_NOTA}</p>
        <div className="qe-frase qe-frase-g" data-testid="qe-rectora">{FRASES.cultivamos}<small>{FRASES.desarrollo}</small></div>
        <div className="qe-sub">Nuestro camino: CUATES</div>
        <div className="qe-mini">{ACCIONES.map((a) => <button key={a.l} type="button" onClick={() => ir("a3")} style={{ borderColor: a.c }}><i style={{ background: a.c }}>{a.l}</i>{a.v}<em>›</em></button>)}</div>
        <Sig />
      </>
    );
  } else if (nAp === 3) {
    cuerpo = (
      <>
        <div className="qe-vis"><h2 className="qe-d-t qe-cuates-t">EL CAMINO DE LOS <span>CUATES</span></h2><b>Cada acción abre una posibilidad para desarrollarnos juntos.</b></div>
        <Lista items={ACCIONES} letra />
        <div className="qe-frase">{FRASES.rectora}</div>
        <Sig />
      </>
    );
  } else if (nAp === 4) {
    cuerpo = (
      <>
        <Hero h="conecta" c={A.c} e={A.e}><h2>CONECTA</h2></Hero>
        <div className="qe-sub qe-sub-c">¿Qué hace posible nuestras conexiones?</div>
        <p className="qe-lead qe-lead-s">Tres elementos que se complementan y dan vida a nuestra comunidad.</p>
        <Lista items={FUNDAMENTOS} />
        <div className="qe-cadena-t" data-testid="qe-cadena-t"><b>⛓️ {CADENA.t}</b>{CADENA.p.map((x, i) => <p key={i}>{x}</p>)}<small>{CADENA.nota}</small></div>
        <div className="qe-sub">Cómo se relacionan</div>
        <div className="qe-cadena">{RELACION.map((r, i) => (<React.Fragment key={r.t}><div><b>{r.t}</b><small>{r.d}</small></div>{i < RELACION.length - 1 && <span aria-hidden="true">→</span>}</React.Fragment>))}</div>
        <Sig />
      </>
    );
  } else if (nAp === 5) {
    cuerpo = (
      <>
        <Hero h="identificate" c={A.c} e={A.e}><h2>IDENTIFÍCATE</h2></Hero>
        <p className="qe-lead">Tus intereses, capacidades y circunstancias también construyen nuestra comunidad.</p>
        <Lista items={IDENTIDAD} />
        <div className="qe-sub">Llegamos por diferentes razones…</div>
        <div className="qe-chips" aria-label="Ejemplos de motivos (ilustrativos)">{MOTIVOS.map((m) => <span key={m}>{m}</span>)}</div>
        <div className="qe-frase">{FRASES.central}</div>
        <Sig />
      </>
    );
  } else if (nAp === 6) {
    cuerpo = (
      <>
        <Hero h="explora" c={A.c} e={A.e}><h2>EXPLORA</h2></Hero>
        <p className="qe-lead">Las dimensiones del desarrollo integral:</p>
        <Lista items={DIMENSIONES} />
        <Sig />
      </>
    );
  } else if (nAp === 7) {
    cuerpo = (
      <>
        <Hero h="participa" c={A.c} e={A.e}><h2>PARTICIPA</h2></Hero>
        <p className="qe-lead">Descubre diversas formas de aportar, recibir, compartir y colaborar.</p>
        <Lista items={FORMAS} />
        <div className="qe-frase">{FRASES.compartir}</div>
        <Sig />
      </>
    );
  } else if (nAp === 8) {
    cuerpo = (
      <>
        <Hero h="crece" c={A.c} e={A.e}><h2>CRECE Y MULTIPLICA</h2></Hero>
        <p className="qe-lead">Seguimos construyendo juntos una mejor comunidad.</p>
        <div className="qe-frase qe-frase-g">{FRASES.mejor}</div>
        <div className="qe-sub">Lo que viene a conectarse</div>
        <div className="qe-chips" aria-label="Conexiones futuras (aún no son enlaces)">{FUTURO.map((m) => <span key={m}>{m}</span>)}</div>
        <div className="qe-cierre" data-testid="qe-cierre"><p>{CIERRE.p}</p><span>{CIERRE.fin}</span></div>
        <div className="qe-pie">
          <button type="button" className="qe-fin" onClick={() => ir("menu")} data-testid="qe-inicio">⌂ Volver al inicio ↑</button>
          <button type="button" className="qe-nav" onClick={() => ir("a7")} data-testid="qe-ant">‹ PARTICIPA</button>
        </div>
      </>
    );
  }

  const MENU1 = [
    { v: "p1", t: PUERTA1.t, l: PUERTA1.l, e: PUERTA1.e, c: PUERTA1.c, n: "01" },
    { v: "p2", t: PUERTA2.t, l: PUERTA2.l, e: PUERTA2.e, c: PUERTA2.c, n: "02" }
  ];
  return createPortal(
    <div className={"qe-ov" + (vista === "menu" ? " qe-ov-m" : "")} role="dialog" aria-modal="true" aria-label="¿Qué es DCUATES?" style={oculta && !mas ? { display: "none" } : undefined} data-testid="qe-overlay" onClick={(e) => { if (vista === "menu" && e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      {vista === "menu" ? (
        <div className="qe-caja" data-testid="qe-menu">
          <div className="qe-cab"><LogoDcuates alto={36} /><span className="qe-cab-s" /><BotonCompartir hash="que-es-dcuates" titulo="¿Qué es DCUATES?" texto="Conoce DCUATES: una comunidad donde todos tenemos algo que buscar, ofrecer y compartir" variante="circulo" /><button type="button" className="qe-x" onClick={cerrar} aria-label="Cerrar" data-testid="qe-cerrar">✕</button></div>
          <h2 className="qe-m-t">¿QUÉ ES <i>D</i>CUATES?</h2>
          <p className="qe-m-s">Desarrollo integral y compartido · <b>Juntos construimos una mejor comunidad</b></p>
          <p className="qe-m-p">{FRASES.bienvenida}</p>
          <div className="qe-bus" data-testid="qe-buscador">
            <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="🔍 Busca: mascota, ofrecer, urgencia, negocio…" aria-label="Buscar en ¿Qué es DCUATES?" data-testid="qe-bus-in" />
            {busca.trim() && (
              <div className="qe-bus-r" data-testid="qe-bus-res">
                {resultados.length ? resultados.map((r) => (
                  <button key={r.v + r.t} type="button" onClick={() => { registrar("que_es_buscar", { q: busca.trim().slice(0, 30) }); setBusca(""); ir(r.v); }} data-testid="qe-bus-item"><span aria-hidden="true">{r.e}</span><b>{r.t}</b><small>{r.d}</small></button>
                )) : <p>No encontramos «{busca.trim()}». Prueba con otra palabra o elige abajo.</p>}
              </div>
            )}
          </div>
          {sugerida && !busca.trim() && (
            <button type="button" className="qe-sug" onClick={() => ir(sugerida.v)} data-testid="qe-sugerida">
              <span aria-hidden="true">{sugerida.e}</span><span>Elegiste «{sugerida.p}». Te sugerimos empezar por <b>{sugerida.t}</b></span><em>›</em>
            </button>
          )}
          <div className="qe-g">Elige por dónde empezar</div>
          <div className="qe-col">
            {MENU1.map((m) => (
              <button key={m.v} type="button" style={{ background: m.c }} onClick={() => ir(m.v)} data-testid={"qe-m-" + m.v}>
                <span className="qe-m-n">{m.n}</span><span className="qe-m-e" aria-hidden="true">{m.e}</span>
                <span className="qe-m-x"><b>{m.t}</b><small>{m.l}</small></span><em>›</em>
              </button>
            ))}
          </div>
          <div className="qe-g">Conoce DCUATES paso a paso</div>
          <div className="qe-col">
            {APARTADOS.map((a) => (
              <button key={a.k} type="button" style={{ background: a.c }} onClick={() => ir("a" + a.n)} data-testid={"qe-ap-" + a.n}>
                <span className="qe-m-n">{a.n}</span><span className="qe-m-e" aria-hidden="true">{a.e}</span>
                <span className="qe-m-x"><b>{a.t}</b><small>{a.l}</small></span><em>›</em>
              </button>
            ))}
          </div>
          <div className="qe-frase qe-frase-g">{FRASES.cultivamos}<small>{FRASES.desarrollo}</small></div>
        </div>
      ) : (
        <>
          <header className="qe-h">
            <button type="button" className="qe-x qe-x-l" onClick={() => ir("menu")} aria-label="Volver al menú" data-testid="qe-atras">‹</button>
            <LogoDcuates alto={32} />
            <span className="qe-cab-s" />
            <BotonCompartir key={vista} hash={"que-es-" + vista} variante="circulo" titulo={`${A ? A.t : vista === "p1" ? PUERTA1.t : PUERTA2.t} — ¿Qué es DCUATES?`} texto="Conoce DCUATES: una comunidad donde todos tenemos algo que buscar, ofrecer y compartir" />
            <button type="button" className="qe-x qe-x-l" onClick={salirVista} aria-label="Cerrar y volver al menú" data-testid="qe-cerrar">✕</button>
          </header>
          {nAp > 0 && (
            <nav className="qe-tabs" aria-label="Pasos">
              {APARTADOS.map((a) => <button key={a.k} type="button" onClick={() => ir("a" + a.n)} className={a.n === nAp ? "on" : ""} style={{ background: a.c, opacity: a.n === nAp ? 1 : 0.35 }} aria-label={a.t} aria-current={a.n === nAp ? "step" : undefined} />)}
              <small>{nAp} de 8 · {A.t}</small>
            </nav>
          )}
          <main className="qe-cuerpo">{cuerpo}</main>
        </>
      )}
      {mas && !ocultaMas && (
        <div className="qe-hoja-f" onClick={() => setMas(null)} data-testid="qe-hoja">
          <div className="qe-hoja" onClick={(e) => e.stopPropagation()} style={{ borderTopColor: mas.c }}>
            <button type="button" className="qe-hoja-x" onClick={() => setMas(null)} aria-label="Cerrar" data-testid="qe-hoja-x">✕</button>
            <h3 style={{ color: mas.c }}>{mas.mas.t}</h3>
            {mas.mas.p.map((p, i) => <p key={i}>{p}</p>)}
            {mas.mas.lista && <ul>{mas.mas.lista.map((x) => <li key={x}>{x}</li>)}</ul>}
            {mas.mas.ej && <div className="qe-ej"><b>Por ejemplo</b><ul>{mas.mas.ej.map((x) => <li key={x}>{x}</li>)}</ul></div>}
            <button type="button" className="qe-hoja-b" style={{ background: mas.c }} onClick={() => setMas(null)}>Entendido</button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

const CSS = `
.qe-ov{position:fixed;inset:0;z-index:97;background:#FBF6EC;display:flex;flex-direction:column;font-family:inherit;color:#2b2b2b}
.qe-ov-m{background:rgba(15,25,20,.65);align-items:center;justify-content:flex-end}
.qe-logo{display:inline-flex;align-items:center;gap:7px}.qe-logo svg{width:auto}
.qe-logo-t{display:flex;flex-direction:column;line-height:1}.qe-logo-t b{font-size:21px;font-weight:900;color:#0B6E78;letter-spacing:.2px}.qe-logo-t b i{color:#E8731A;font-style:normal}.qe-logo-t small{font-size:8.5px;letter-spacing:3.2px;color:#0B6E78;margin-top:2px;font-weight:700}
.qe-caja{width:100%;max-width:460px;max-height:95vh;overflow-y:auto;background:#fff;border-radius:22px 22px 0 0;padding:12px 12px 22px;box-sizing:border-box}
@media(min-width:640px){.qe-ov-m{justify-content:center}.qe-caja{border-radius:22px}}
.qe-cab{display:flex;align-items:center;gap:8px}.qe-cab-s{flex:1}
.qe-x{width:40px;height:40px;border-radius:50%;border:0;background:#eceff1;color:#333;font-size:18px;cursor:pointer}
.qe-m-t{margin:10px 0 2px;text-align:center;font-size:26px;font-weight:900;color:#0B6E78}.qe-m-t i{color:#E8731A;font-style:normal}
.qe-m-s{margin:0;text-align:center;font-size:13px;color:#555}.qe-m-s b{color:#0B6E78}
.qe-m-p{margin:8px 0 2px;text-align:center;font-size:14px;font-weight:800;color:#B85400;line-height:1.3}
.qe-bus{margin:10px 0 2px}.qe-bus input{width:100%;box-sizing:border-box;border:2px solid #0B6E78;border-radius:999px;padding:11px 16px;font-size:16px;font-family:inherit;background:#fff;min-height:46px}
.qe-bus-r{display:flex;flex-direction:column;gap:6px;margin-top:8px}.qe-bus-r p{margin:6px;text-align:center;font-size:14px}
.qe-bus-r button{display:grid;grid-template-columns:28px 1fr;column-gap:8px;text-align:left;background:#fff;border:2px solid #e0d8c4;border-radius:12px;padding:8px 10px;cursor:pointer;font-family:inherit;min-height:44px}
.qe-bus-r button span{grid-row:1/3;font-size:20px;align-self:center}.qe-bus-r button b{font-size:14px}.qe-bus-r button small{font-size:12px;opacity:.8}
.qe-sug{display:flex;align-items:center;gap:8px;width:100%;margin-top:8px;background:#FFF7E0;border:2px dashed #E8731A;border-radius:12px;padding:8px 10px;text-align:left;font-family:inherit;font-size:13px;cursor:pointer;min-height:46px}.qe-sug>span:first-child{font-size:22px}.qe-sug em{margin-left:auto;font-style:normal;font-size:20px}
.qe-nav{box-sizing:border-box;max-width:100%}
.qe-vmas{all:unset;cursor:pointer;display:block;margin:8px auto 0;font-weight:800;font-size:13px;padding:8px 12px;min-height:30px}.qe-vmas:focus-visible{outline:3px solid #FFD54F}
.qe-g{margin:14px 2px 2px;font-weight:900;font-size:15px;color:#0B6E78;text-align:center}
.qe-col button{width:100%;margin-top:7px;border:0;border-radius:14px;padding:9px 10px;color:#fff;font-family:inherit;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer;min-height:56px;box-shadow:0 2px 6px rgba(0,0,0,.18)}
.qe-m-n{width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.28);font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex:none}
.qe-m-e{font-size:24px;flex:none}.qe-m-x{flex:1;display:flex;flex-direction:column;min-width:0}.qe-m-x b{font-size:15px;font-weight:900;line-height:1.15}.qe-m-x small{font-size:12px;line-height:1.3;opacity:.95;margin-top:2px}.qe-col em{font-style:normal;font-size:24px;opacity:.8}
.qe-h{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border-bottom:1px solid #e7e0d0}
.qe-x-l{background:#eef3f2}
.qe-tabs{display:flex;align-items:center;gap:4px;padding:7px 12px;background:#fff;flex-wrap:wrap}.qe-tabs button{flex:1;height:9px;min-width:0;border:0;border-radius:5px;padding:0;cursor:pointer}.qe-tabs small{flex-basis:100%;font-size:11px;font-weight:800;color:#0B6E78;text-align:center;margin-top:2px}
.qe-cuerpo{flex:1;overflow-y:auto;padding:0 0 40px;max-width:520px;width:100%;margin:0 auto;box-sizing:border-box}
.qe-cuerpo>*:not(.qe-hero-f){margin-left:14px;margin-right:14px}
.qe-hero-f{position:relative;height:190px;overflow:hidden;border-radius:0 0 28px 28px;margin-bottom:12px;display:flex;align-items:flex-end}
.qe-hero-f img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.qe-hero-e{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:70px;opacity:.85}
.qe-hero-o{position:relative;width:100%;padding:34px 14px 14px;background:linear-gradient(0deg,rgba(0,0,0,.62),rgba(0,0,0,0));color:#fff;display:flex;flex-direction:column;gap:3px;box-sizing:border-box}
.qe-hero-o:empty{display:none}.qe-hero-o h2{margin:0;font-size:25px;font-weight:900;line-height:1.1;text-shadow:0 1px 4px rgba(0,0,0,.5)}.qe-hero-o small{font-weight:800;letter-spacing:.5px;color:#FFD9A8;font-size:13px}
.qe-hero-n{align-self:flex-start;color:#fff;font-weight:900;font-size:12px;padding:3px 10px;border-radius:999px;letter-spacing:.5px}
.qe-lead{font-size:16px;line-height:1.5;text-align:center;margin-top:10px;margin-bottom:6px}.qe-lead-s{font-size:14px;color:#444}
.qe-por{display:flex;gap:10px;align-items:center;border-top:2px solid #eadfca;border-bottom:2px solid #eadfca;padding:12px 2px;margin-top:8px;margin-bottom:8px}.qe-por i{width:34px;height:34px;border-radius:50%;background:#F2A33A;color:#fff;font-style:normal;font-weight:900;display:flex;align-items:center;justify-content:center;flex:none;font-size:20px}.qe-por div{display:flex;flex-direction:column}.qe-por b{font-size:15px;color:#B85400}.qe-por span{font-size:14px;line-height:1.35}
.qe-vis{text-align:center;padding-top:14px}.qe-badge{display:inline-block;background:#D6EFEF;color:#0B6E78;font-weight:900;font-size:11px;letter-spacing:1px;padding:4px 12px;border-radius:999px}
.qe-d-t{margin:8px 0 2px;font-size:30px;font-weight:900;color:#0B6E78;letter-spacing:.3px}.qe-d-t i{font-style:normal;color:#E8731A;font-size:42px}.qe-vis>b{font-size:15px;line-height:1.3;color:#333;display:block;margin-bottom:10px}
.qe-cuates-t{font-size:19px;color:#2b2b2b}.qe-cuates-t span{display:block;font-size:34px;color:#E8731A;letter-spacing:2px}
.qe-tres{display:flex;flex-direction:column;gap:2px;margin:10px 0;text-align:center;font-weight:900;font-size:13px;color:#2F7D3A;letter-spacing:.4px;background:#E8F5E9;border-radius:14px;padding:10px}
.qe-sub{margin:18px 2px 8px;font-weight:900;font-size:15px;color:#0B6E78;text-align:center}.qe-sub-c{font-size:18px;margin-top:4px}
.qe-mini{display:flex;flex-direction:column;gap:6px}.qe-mini button{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid;border-radius:12px;padding:8px 12px;font-weight:800;font-size:15px;cursor:pointer;min-height:46px;text-align:left;font-family:inherit}.qe-mini i{width:28px;height:28px;border-radius:50%;color:#fff;font-style:normal;display:flex;align-items:center;justify-content:center;font-size:14px}.qe-mini em{margin-left:auto;font-style:normal;color:#999;font-size:20px}
.qe-frase{margin:16px 14px 4px;text-align:center;font-weight:800;font-size:14px;line-height:1.35;color:#8a4b00;background:#FFF1D6;border-radius:14px;padding:10px 12px}
.qe-frase-g{background:linear-gradient(120deg,#E8F5E9,#F5E8F8);color:#2b2b2b;font-size:15px}.qe-frase-g small{display:block;margin-top:4px;font-size:12px;color:#555;letter-spacing:.5px}
.qe-lista{display:flex;flex-direction:column;gap:10px;margin-top:8px}
.qe-card{display:flex;gap:10px;background:#fff;border:2px solid;border-radius:16px;padding:10px;align-items:center;box-shadow:0 2px 6px rgba(0,0,0,.06)}
.qe-letra-g{width:56px;height:56px;border-radius:50%;color:#fff;font-style:normal;font-weight:900;font-size:28px;display:flex;align-items:center;justify-content:center;flex:none}
.qe-foto{position:relative;width:64px;height:64px;border-radius:14px;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}.qe-foto-e{font-size:30px}.qe-foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.qe-card-t{display:flex;flex-direction:column;gap:3px;flex:1;min-width:0}.qe-card-t b{font-size:15px;line-height:1.2}.qe-card-t span{font-size:13px;line-height:1.3;color:#444}
.qe-mas{align-self:flex-start;background:#fff;border:2px solid;border-radius:999px;padding:5px 12px;font-weight:800;font-size:13px;cursor:pointer;min-height:34px;font-family:inherit}.qe-mas-solo{display:block;margin:6px auto}
.qe-cadena{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px}.qe-cadena div{background:#fff;border:2px solid #cfd8dc;border-radius:12px;padding:6px 10px;text-align:center;display:flex;flex-direction:column}.qe-cadena b{font-size:13px}.qe-cadena small{font-size:11px;color:#555}.qe-cadena span{color:#999}
.qe-cadena-t{background:#fff;border:2px solid #0E7C86;border-radius:16px;padding:12px;margin-top:12px}.qe-cadena-t b{color:#0E7C86;font-size:14px}.qe-cadena-t p{font-size:14px;line-height:1.45;margin:6px 0}.qe-cadena-t small{display:block;font-size:12.5px;line-height:1.4;color:#555;margin-top:4px}
.qe-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.qe-chips span{background:#fff;border:2px dashed #b0bec5;border-radius:999px;padding:6px 12px;font-size:13px;color:#37474f}.qe-chips-s{justify-content:flex-start;margin:8px 0}.qe-chips-s span{border-style:solid;font-size:12px;padding:4px 10px}
.qe-ct{display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px}.qe-ct div{border:2px solid;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:2px}.qe-ct span{font-size:28px}.qe-ct b{font-size:18px}.qe-ct em{font-size:13px;font-style:normal;font-weight:800;color:#555}.qe-ct p{font-size:14px;line-height:1.45;margin:4px 0 0}
.qe-ct-n{font-size:13px;line-height:1.45;text-align:center;color:#444;margin-top:10px;margin-bottom:0}
.qe-puerta{border:3px solid;border-radius:18px;padding:14px;margin-bottom:6px}
.qe-p-lema{font-style:italic;font-size:15px;line-height:1.4;margin:0 0 6px}
.qe-p-ej{margin:6px 0;padding-left:20px;list-style:disc}.qe-p-ej li{font-size:14px;line-height:1.45}
.qe-p-nota{font-size:13px;line-height:1.4;color:#37474f;background:rgba(255,255,255,.7);border-radius:10px;padding:8px 10px;margin:8px 0}
.qe-p-cta{display:block;width:100%;border:0;border-radius:14px;padding:14px;color:#fff;font-weight:900;font-size:15px;cursor:pointer;min-height:48px;font-family:inherit}
.qe-atajos{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.qe-atajos button{background:#fff;border:2px solid;border-radius:999px;padding:8px 12px;font-weight:800;font-size:13px;cursor:pointer;min-height:40px;font-family:inherit}
.qe-puente{margin-top:10px;margin-bottom:10px;border-radius:18px;padding:16px 14px;background:linear-gradient(180deg,#E3F4F5,#FFF0DC);border:2px dashed #B8860B;text-align:center}
.qe-puente-l{font-size:26px;color:#B85400;line-height:1}.qe-puente h3{margin:4px 0 8px;font-size:17px;color:#8a4b00;line-height:1.25}.qe-puente p{font-size:14px;line-height:1.5;margin:7px 0;text-align:left}.qe-puente-i{display:block;margin:12px 0 8px;font-size:15px;color:#0E7C86}.qe-puente-b{background:#B85400}
.qe-ambas{margin-top:12px;margin-bottom:12px;background:#fff;border:3px solid #8E3A9F;border-radius:18px;padding:14px;text-align:center;display:flex;flex-direction:column;gap:8px}.qe-ambas b{font-size:19px;color:#8E3A9F}.qe-ambas span{font-size:14px;line-height:1.45}
.qe-cierre{text-align:center;margin-top:14px;margin-bottom:14px}.qe-cierre p{font-size:15px;line-height:1.5}.qe-cierre span{font-size:13px;color:#555}
.qe-pie{display:flex;flex-direction:column;gap:8px;margin-top:22px;margin-bottom:0}
.qe-nav{border:2px solid #0E7C86;background:#fff;color:#0E7C86;border-radius:12px;padding:12px;font-weight:800;font-size:14px;cursor:pointer;min-height:44px;font-family:inherit}.qe-nav-c{border-color:#bbb;color:#555}.qe-nav-a{background:#fff}
.qe-fin{display:block;width:100%;background:#F2A900;border:0;border-radius:14px;padding:14px;font-weight:900;font-size:16px;cursor:pointer;color:#3b2a00;font-family:inherit}
.qe-hoja-f{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;z-index:2}
.qe-hoja{position:relative;background:#fff;border-top:6px solid;border-radius:20px 20px 0 0;padding:18px 16px 20px;width:100%;max-width:520px;max-height:82vh;overflow-y:auto;box-sizing:border-box}
.qe-hoja h3{margin:0 34px 8px 0;font-size:19px}.qe-hoja p{font-size:15px;line-height:1.5;margin:8px 0}.qe-hoja ul{margin:8px 0;padding-left:20px;list-style:disc}.qe-hoja li{font-size:15px;line-height:1.5}
.qe-ej{background:#F1F8E9;border-radius:12px;padding:8px 12px;margin-top:10px}
.qe-hoja-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;border:0;background:#eee;font-size:16px;cursor:pointer}
.qe-hoja-b{display:block;width:100%;margin-top:14px;border:0;border-radius:12px;padding:12px;color:#fff;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit}
@media(min-width:520px){.qe-ct{grid-template-columns:1fr 1fr}}
`;
