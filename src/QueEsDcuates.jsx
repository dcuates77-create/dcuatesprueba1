// «¿QUÉ ES DCUATES?» (e86a) — MAQUETA visual móvil para revisión. Complemento de «Quiero conocer DCUATES».
// 7 apartados navegables; las tarjetas tienen «Conoce más» (hoja con la explicación ampliada). No registra, no envía, no enlaza a otras secciones.
// Todo el texto está en src/datos/queEsDcuates.js. Fotos opcionales: /images/que-es/<clave>.webp (si no existe, se ve una ilustración).
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { abrirTablon } from "./Tablon.jsx";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { abrirAsistente } from "./AsistentePagina.jsx";
import { FRASES, APARTADOS, VISION, ACCIONES, FUNDAMENTOS, RELACION, IDENTIDAD, MOTIVOS, DIMENSIONES, FORMAS, FUTURO, PERSONAS, PUERTA1, ATAJOS1, PUENTE, PUERTA2, ATAJOS2, AMBAS, CULTIVAR, TEJER, CULTIVAR_TEJER_NOTA, CADENA, CIERRE } from "./datos/queEsDcuates.js";

export const abrirQueEs = (n) => window.dispatchEvent(new CustomEvent("dcuates:que-es", { detail: typeof n === "number" ? n : -1 }));
const HASH = "#que-es-dcuates";

function Foto({ k, e, c }) {
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
      <Foto k={it.k || it.v.toLowerCase()} e={it.e} c={it.c} />
      <div className="qe-card-t">
        <b style={{ color: it.c }}>{letra ? <i className="qe-letra" style={{ background: it.c }}>{it.l}</i> : null}{it.v || it.t}</b>
        <span>{it.corto}</span>
        <button type="button" className="qe-mas" style={{ color: it.c, borderColor: it.c }} onClick={() => onMas(it)}>Conoce más ›</button>
      </div>
    </div>
  );
}

export default function QueEsDcuates() {
  const [abierto, setAbierto] = useState(() => typeof window !== "undefined" && window.location.hash === HASH);
  const [ap, setAp] = useState(-1); // -1 = inicio (bienvenida y dos puertas); 0 = «Profundiza» (mapa de 7 pasos); 1..7 = apartado
  const [mas, setMas] = useState(null);
  const p2 = useRef(null);
  useEffect(() => {
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    if (window.location.hash === HASH) quitar();
    const al = () => { if (window.location.hash === HASH) { setAp(-1); setAbierto(true); quitar(); } };
    const ev = (e) => { setAp(Number.isFinite(Number(e.detail)) ? Number(e.detail) : -1); setAbierto(true); };
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:que-es", ev);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:que-es", ev); };
  }, []);
  const cerrar = () => { setAbierto(false); setMas(null); };
  const oculta = useAtras(abierto, cerrar, { hub: true });
  const ocultaMas = useAtras(!!mas, () => setMas(null));
  useEffect(() => { if (abierto) registrar("que_es_abrir"); }, [abierto]);
  useEffect(() => { if (abierto && ap) registrar("que_es_apartado", { n: ap }); }, [abierto, ap]);
  useEffect(() => { if (abierto) { const el = document.querySelector(".qe-cuerpo"); if (el) el.scrollTop = 0; } }, [ap, abierto]);
  if (!abierto) return null;

  const A = ap > 0 ? APARTADOS[ap - 1] : null;
  const ir = (n) => setAp(Math.max(-1, Math.min(7, n)));
  const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
  // Atajos a lugares REALES. El overlay se queda debajo y reaparece con «Atrás».
  const ejecutar = (acc) => {
    registrar("que_es_atajo", { acc });
    if (acc === "directorio") ev("dcuates:directorio");
    else if (acc === "tablon") abrirTablon("");
    else if (acc === "necesito") abrirRegistroPrevio("necesito", {});
    else if (acc === "ofrezco") abrirRegistroPrevio("ofrezco", {});
    else if (acc === "asistente") abrirAsistente();
    else if (acc === "causas" || acc === "club" || acc === "participar") ev("dcuates:que-es-ir", acc);
  };
  const irPuerta2 = () => { registrar("que_es_puente"); const el = p2.current; if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const Puerta = ({ d, atajos, cta, accCta, id, refP }) => (
    <section className="qe-puerta" style={{ borderColor: d.c, background: d.f }} ref={refP} data-testid={id} aria-label={d.t}>
      <div className="qe-p-h"><i style={{ background: d.c }}>{d.n}</i><b style={{ color: d.c }}>{d.e} {d.t}</b></div>
      <p className="qe-p-lema">{d.lema}</p>
      <ul className="qe-p-ej">{d.ejemplos.map((x) => <li key={x}>{x}</li>)}</ul>
      {d.beneficios && <div className="qe-chips qe-chips-s">{d.beneficios.map((m) => <span key={m}>{m}</span>)}</div>}
      <p className="qe-p-nota">{d.nota}</p>
      {d.apoyo && <p className="qe-p-nota">{d.apoyo}</p>}
      <button type="button" className="qe-p-cta" style={{ background: d.c }} onClick={() => ejecutar(accCta)} data-testid={id + "-cta"}>{cta} ›</button>
      <div className="qe-atajos">{atajos.map((a) => <button key={a.t} type="button" style={{ borderColor: d.c, color: d.c }} onClick={() => ejecutar(a.acc)} data-testid={"qe-atajo-" + a.acc}><span aria-hidden="true">{a.e}</span> {a.t}</button>)}</div>
    </section>
  );
  const abrirMas = (it) => { registrar("que_es_mas", { k: it.k || it.l }); setMas(it); };
  const Lista = ({ items, letra }) => <div className="qe-lista">{items.map((it) => <Tarjeta key={it.k || it.l} it={it} onMas={abrirMas} letra={letra} />)}</div>;
  const Pie = () => (
    <div className="qe-pie">
      {ap > 1 && <button type="button" className="qe-nav" onClick={() => ir(ap - 1)} data-testid="qe-ant">‹ {APARTADOS[ap - 2].t}</button>}
      {ap < 7 && <button type="button" className="qe-nav qe-nav-s" onClick={() => ir(ap + 1)} data-testid="qe-sig">{APARTADOS[ap].t} ›</button>}
      <button type="button" className="qe-nav qe-nav-c" onClick={() => ir(0)} data-testid="qe-central">Volver al mapa de pasos</button>
    </div>
  );

  let cuerpo;
  if (ap === -1) {
    cuerpo = (
      <>
        <div className="qe-hero" data-testid="qe-bienvenida">
          <div className="qe-personas" aria-hidden="true">{PERSONAS.map((p, i) => <span key={i}>{p}</span>)}</div>
          <h2>{FRASES.bienvenida}</h2>
          <p>{FRASES.bienvenidaTxt}</p>
          <p className="qe-p2">{FRASES.bienvenidaTxt2}</p>
        </div>
        <div className="qe-sub">Elige por dónde empezar</div>
        <Puerta d={PUERTA1} atajos={ATAJOS1} cta={PUERTA1.cta} accCta="tablon" id="qe-puerta1" />
        <div className="qe-puente" data-testid="qe-puente">
          <div className="qe-puente-l" aria-hidden="true">⌄</div>
          <h3>{PUENTE.t}</h3>
          {PUENTE.p.map((x, i) => <p key={i}>{x}</p>)}
          <b className="qe-puente-i">{PUENTE.inv}</b>
          <button type="button" className="qe-p-cta qe-puente-b" onClick={irPuerta2} data-testid="qe-puente-cta">{PUENTE.cta} ›</button>
        </div>
        <Puerta d={PUERTA2} atajos={ATAJOS2} cta={PUERTA2.cta} accCta="participar" id="qe-puerta2" refP={p2} />
        <div className="qe-ambas" data-testid="qe-ambas"><b>{AMBAS.t}</b><span>{AMBAS.p}</span></div>
        <div className="qe-sub">Nuestra visión</div>
        <div className="qe-ct">
          {[CULTIVAR, TEJER].map((x) => (
            <div key={x.t} style={{ background: x.f, borderColor: x.c }} data-testid={"qe-" + x.t.toLowerCase()}>
              <span aria-hidden="true">{x.e}</span><b style={{ color: x.c }}>{x.t}</b><em>{x.d}</em><p>{x.p}</p>
            </div>
          ))}
        </div>
        <p className="qe-ct-n">{CULTIVAR_TEJER_NOTA}</p>
        <div className="qe-frase qe-frase-g" data-testid="qe-rectora">{FRASES.cultivamos}<small>{FRASES.desarrollo}</small></div>
        <div className="qe-cadena-t" data-testid="qe-cadena-t"><b>⛓️ {CADENA.t}</b>{CADENA.p.map((x, i) => <p key={i}>{x}</p>)}<small>{CADENA.nota}</small></div>
        <div className="qe-cierre" data-testid="qe-cierre"><p>{CIERRE.p}</p><div className="qe-frase qe-frase-g">{FRASES.cultivamos}<small>{FRASES.desarrollo}</small></div><span>{CIERRE.fin}</span></div>
        <button type="button" className="qe-prof" onClick={() => ir(0)} data-testid="qe-profundiza">Profundiza: recorre los 7 pasos ›</button>
      </>
    );
  } else if (ap === 0) {
    cuerpo = (
      <>
        <div className="qe-hero">
          <div className="qe-hero-e" aria-hidden="true">🌱🤝🌳</div>
          <h2>{FRASES.compartir}</h2>
          <p>{FRASES.central}</p>
        </div>
        <div className="qe-sub">Recorre DCUATES en 7 pasos</div>
        <div className="qe-mapa">
          {APARTADOS.map((a) => (
            <button key={a.k} type="button" className="qe-ap" style={{ borderColor: a.c }} onClick={() => ir(a.n)} data-testid={"qe-ap-" + a.n}>
              <i style={{ background: a.c }}>{a.n}</i>
              <span><b style={{ color: a.c }}>{a.e} {a.t}</b><small>{a.s}</small></span>
              <em>›</em>
            </button>
          ))}
        </div>
        <div className="qe-frase">{FRASES.conectando}</div>
        <button type="button" className="qe-nav qe-nav-c" style={{ width: "100%", marginTop: 14 }} onClick={() => ir(-1)} data-testid="qe-inicio-sec">Volver al inicio de la sección</button>
      </>
    );
  } else if (ap === 1) {
    cuerpo = (
      <>
        <div className="qe-hero qe-hero-2"><div className="qe-hero-e" aria-hidden="true">🌱</div><h2>{FRASES.compartir}</h2><p>{FRASES.central}</p></div>
        <div className="qe-duo">
          <div style={{ background: "#FFF3E0" }}><b>¡Juntos!</b><span>{FRASES.mejor}</span></div>
          <div style={{ background: "#E3F2FD" }}><b>Conectando</b><span>{FRASES.conectando}</span></div>
        </div>
      </>
    );
  } else if (ap === 2) {
    cuerpo = (
      <>
        <div className="qe-d" style={{ borderColor: VISION.c }}>
          <i style={{ background: VISION.c }}>{VISION.l}</i>
          <div><b style={{ color: VISION.c }}>{VISION.v}</b><span>{VISION.corto}</span></div>
        </div>
        <div className="qe-tres">{VISION.tres.map((t) => <span key={t}>{t}</span>)}</div>
        <button type="button" className="qe-mas qe-mas-solo" style={{ color: VISION.c, borderColor: VISION.c }} onClick={() => abrirMas({ k: "d", mas: VISION.mas, c: VISION.c })}>Conoce más ›</button>
        <div className="qe-sub">CUATES: el camino en 6 acciones</div>
        <Lista items={ACCIONES} letra />
        <div className="qe-frase">{FRASES.rectora}</div>
      </>
    );
  } else if (ap === 3) {
    cuerpo = (
      <>
        <Lista items={FUNDAMENTOS} />
        <div className="qe-sub">Cómo se relacionan</div>
        <div className="qe-cadena">{RELACION.map((r, i) => (<React.Fragment key={r.t}><div><b>{r.t}</b><small>{r.d}</small></div>{i < RELACION.length - 1 && <span aria-hidden="true">→</span>}</React.Fragment>))}</div>
      </>
    );
  } else if (ap === 4) {
    cuerpo = (
      <>
        <div className="qe-frase qe-frase-t">Cada persona llega con algo distinto</div>
        <Lista items={IDENTIDAD} />
        <div className="qe-sub">Llegamos por diferentes razones…</div>
        <div className="qe-chips" aria-label="Ejemplos de motivos (ilustrativos)">{MOTIVOS.map((m) => <span key={m}>{m}</span>)}</div>
        <div className="qe-frase">{FRASES.central}</div>
      </>
    );
  } else if (ap === 5) {
    cuerpo = (<><div className="qe-frase qe-frase-t">Desarrollo integral: todas las dimensiones de la vida</div><Lista items={DIMENSIONES} /></>);
  } else if (ap === 6) {
    cuerpo = (<><div className="qe-frase qe-frase-t">Aportar, recibir, compartir y colaborar</div><Lista items={FORMAS} /><div className="qe-frase">{FRASES.compartir}</div></>);
  } else {
    cuerpo = (
      <>
        <div className="qe-hero qe-hero-2"><div className="qe-hero-e" aria-hidden="true">🌳</div><h2>{FRASES.mejor}</h2><p>El desarrollo compartido crece y se multiplica.</p></div>
        <div className="qe-sub">Lo que viene a conectarse</div>
        <div className="qe-chips" aria-label="Conexiones futuras (aún no son enlaces)">{FUTURO.map((m) => <span key={m}>{m}</span>)}</div>
        <div className="qe-frase">{FRASES.conectando}</div>
        <button type="button" className="qe-fin" onClick={cerrar} data-testid="qe-inicio">Volver al inicio</button>
      </>
    );
  }

  return createPortal(
    <div className="qe-ov" role="dialog" aria-modal="true" aria-label="¿Qué es DCUATES?" style={oculta && !mas ? { display: "none" } : undefined} data-testid="qe-overlay">
      <style>{CSS}</style>
      <header className="qe-h">
        <button type="button" className="qe-x" onClick={ap >= 0 ? () => ir(ap > 0 ? 0 : -1) : cerrar} aria-label={ap >= 0 ? "Volver" : "Cerrar"} data-testid="qe-atras">‹</button>
        <div className="qe-h-t"><b>{ap > 0 ? A.t : ap === 0 ? "PROFUNDIZA" : "¿QUÉ ES DCUATES?"}</b><small>{ap > 0 ? A.s : ap === 0 ? "Los 7 pasos para conocer DCUATES a fondo" : "COMUNIDAD · Maqueta para revisión"}</small></div>
        <button type="button" className="qe-x" onClick={cerrar} aria-label="Cerrar" data-testid="qe-cerrar">✕</button>
      </header>
      {ap > 0 && <div className="qe-prog" aria-label={"Apartado " + ap + " de 7"}>{APARTADOS.map((a) => <button key={a.k} type="button" onClick={() => ir(a.n)} aria-label={a.t} className={a.n === ap ? "on" : ""} style={a.n === ap ? { background: a.c } : undefined} />)}</div>}
      <main className="qe-cuerpo">{cuerpo}{ap > 0 && <Pie />}</main>
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
.qe-ov{position:fixed;inset:0;z-index:97;background:var(--dc-fondo,#FFF8EC);display:flex;flex-direction:column;font-family:inherit;color:#2b2b2b}
.qe-h{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--dc-verde,#08743B);color:#fff}
.qe-h-t{flex:1;min-width:0;display:flex;flex-direction:column}.qe-h-t b{font-size:17px;letter-spacing:.3px}.qe-h-t small{font-size:11px;opacity:.9}
.qe-x{width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.2);color:#fff;font-size:20px;cursor:pointer}
.qe-prog{display:flex;gap:6px;padding:8px 14px;background:#fff;border-bottom:1px solid #eee}
.qe-prog button{flex:1;height:8px;border-radius:4px;border:0;background:#ddd;cursor:pointer;padding:0}
.qe-cuerpo{flex:1;overflow-y:auto;padding:14px 14px 40px;max-width:640px;width:100%;margin:0 auto;box-sizing:border-box}
.qe-hero{text-align:center;background:linear-gradient(160deg,#FFE9C2,#FFF);border-radius:18px;padding:18px 14px;border:2px solid #F2C46D}
.qe-hero-e{font-size:40px}.qe-hero h2{margin:8px 0 6px;font-size:21px;line-height:1.2;color:#B85400}.qe-hero p{margin:0;font-size:15px;line-height:1.4}
.qe-hero-2{margin-bottom:12px}
.qe-sub{margin:18px 2px 8px;font-weight:700;font-size:15px;color:var(--dc-verde,#08743B)}
.qe-mapa{display:flex;flex-direction:column;gap:8px}
.qe-ap{display:flex;align-items:center;gap:10px;text-align:left;background:#fff;border:2px solid;border-radius:14px;padding:10px 12px;cursor:pointer;min-height:56px}
.qe-ap i{width:30px;height:30px;border-radius:50%;color:#fff;font-style:normal;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}
.qe-ap span{flex:1;display:flex;flex-direction:column}.qe-ap b{font-size:15px}.qe-ap small{font-size:12px;color:#555}.qe-ap em{font-style:normal;font-size:22px;color:#999}
.qe-frase{margin:16px 0 4px;text-align:center;font-weight:700;font-size:14px;line-height:1.35;color:#8a4b00;background:#FFF1D6;border-radius:12px;padding:10px 12px}
.qe-frase-t{margin-top:0;margin-bottom:12px;background:#E8F5E9;color:#1B5E20}
.qe-duo{display:grid;grid-template-columns:1fr;gap:8px}.qe-duo div{border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:4px}.qe-duo b{font-size:15px}.qe-duo span{font-size:14px;line-height:1.35}
.qe-d{display:flex;align-items:center;gap:12px;background:#fff;border:3px solid;border-radius:16px;padding:12px}
.qe-d i{width:54px;height:54px;border-radius:14px;color:#fff;font-style:normal;font-weight:800;font-size:32px;display:flex;align-items:center;justify-content:center;flex:none}
.qe-d div{display:flex;flex-direction:column}.qe-d b{font-size:20px}.qe-d span{font-size:14px;line-height:1.3}
.qe-tres{display:flex;flex-direction:column;gap:4px;margin:10px 0;text-align:center;font-weight:700;font-size:13px;color:#555;letter-spacing:.4px}
.qe-lista{display:flex;flex-direction:column;gap:10px}
.qe-card{display:flex;gap:10px;background:#fff;border:2px solid;border-radius:14px;padding:10px;align-items:stretch}
.qe-foto{position:relative;width:84px;min-height:84px;border-radius:12px;overflow:hidden;flex:none;display:flex;align-items:center;justify-content:center}
.qe-foto-e{font-size:34px}.qe-foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.qe-card-t{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0}.qe-card-t b{font-size:15px;display:flex;align-items:center;gap:6px;line-height:1.2}.qe-card-t span{font-size:13px;line-height:1.3;color:#444}
.qe-letra{width:24px;height:24px;border-radius:50%;color:#fff;font-style:normal;display:inline-flex;align-items:center;justify-content:center;font-size:13px;flex:none}
.qe-mas{align-self:flex-start;margin-top:2px;background:#fff;border:2px solid;border-radius:999px;padding:6px 12px;font-weight:700;font-size:13px;cursor:pointer;min-height:36px}
.qe-mas-solo{display:block;margin:0 auto}
.qe-cadena{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px}.qe-cadena div{background:#fff;border:2px solid #cfd8dc;border-radius:12px;padding:6px 10px;text-align:center;display:flex;flex-direction:column}.qe-cadena b{font-size:13px}.qe-cadena small{font-size:11px;color:#555}.qe-cadena span{color:#999}
.qe-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.qe-chips span{background:#fff;border:2px dashed #b0bec5;border-radius:999px;padding:6px 12px;font-size:13px;color:#37474f}
.qe-pie{display:flex;flex-direction:column;gap:8px;margin-top:22px}
.qe-nav{border:2px solid var(--dc-verde,#08743B);background:#fff;color:var(--dc-verde,#08743B);border-radius:12px;padding:12px;font-weight:700;font-size:14px;cursor:pointer;min-height:44px}
.qe-nav-s{background:var(--dc-verde,#08743B);color:#fff}.qe-nav-c{border-color:#bbb;color:#555}
.qe-fin{display:block;width:100%;margin-top:16px;background:var(--dc-dorado,#F2A900);border:0;border-radius:14px;padding:14px;font-weight:800;font-size:16px;cursor:pointer;color:#3b2a00}
.qe-hoja-f{position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;z-index:2}
.qe-hoja{position:relative;background:#fff;border-top:6px solid;border-radius:20px 20px 0 0;padding:18px 16px 20px;width:100%;max-width:640px;max-height:82vh;overflow-y:auto;box-sizing:border-box}
.qe-hoja h3{margin:0 34px 8px 0;font-size:19px}.qe-hoja p{font-size:15px;line-height:1.5;margin:8px 0}.qe-hoja ul{margin:8px 0;padding-left:20px;list-style:disc}.qe-hoja li{font-size:15px;line-height:1.5}
.qe-ej{background:#F1F8E9;border-radius:12px;padding:8px 12px;margin-top:10px}
.qe-hoja-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border-radius:50%;border:0;background:#eee;font-size:16px;cursor:pointer}
.qe-hoja-b{display:block;width:100%;margin-top:14px;border:0;border-radius:12px;padding:12px;color:#fff;font-weight:700;font-size:15px;cursor:pointer}
.qe-personas{display:flex;justify-content:center;gap:2px;font-size:30px;margin-bottom:4px;flex-wrap:wrap}
.qe-p2{margin-top:8px!important;font-size:14px!important;color:#444}
.qe-puerta{border:3px solid;border-radius:18px;padding:14px;margin-bottom:6px}
.qe-p-h{display:flex;align-items:center;gap:10px}.qe-p-h i{width:34px;height:34px;border-radius:50%;color:#fff;font-style:normal;font-weight:800;display:flex;align-items:center;justify-content:center;flex:none;font-size:14px}.qe-p-h b{font-size:16px;line-height:1.2}
.qe-p-lema{font-style:italic;font-size:15px;line-height:1.4;margin:10px 0 6px}
.qe-p-ej{margin:6px 0;padding-left:20px;list-style:disc}.qe-p-ej li{font-size:14px;line-height:1.45}
.qe-p-nota{font-size:13px;line-height:1.4;color:#37474f;background:rgba(255,255,255,.7);border-radius:10px;padding:8px 10px;margin:8px 0}
.qe-p-cta{display:block;width:100%;border:0;border-radius:14px;padding:14px;color:#fff;font-weight:800;font-size:15px;cursor:pointer;min-height:48px}
.qe-atajos{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.qe-atajos button{background:#fff;border:2px solid;border-radius:999px;padding:8px 12px;font-weight:700;font-size:13px;cursor:pointer;min-height:40px}
.qe-chips-s{justify-content:flex-start;margin:8px 0}.qe-chips-s span{border-style:solid;font-size:12px;padding:4px 10px}
.qe-puente{margin:10px 0;border-radius:18px;padding:16px 14px;background:linear-gradient(180deg,#E3F4F5,#FFF0DC);border:2px dashed #B8860B;text-align:center}
.qe-puente-l{font-size:26px;color:#B85400;line-height:1}.qe-puente h3{margin:4px 0 8px;font-size:17px;color:#8a4b00;line-height:1.25}.qe-puente p{font-size:14px;line-height:1.5;margin:7px 0;text-align:left}
.qe-puente-i{display:block;margin:12px 0 8px;font-size:15px;color:#0E7C86}.qe-puente-b{background:#B85400}
.qe-ambas{margin:12px 0;background:#fff;border:3px solid #8E3A9F;border-radius:18px;padding:14px;text-align:center;display:flex;flex-direction:column;gap:6px}.qe-ambas b{font-size:19px;color:#8E3A9F}.qe-ambas span{font-size:14px;line-height:1.45}
.qe-ct{display:grid;grid-template-columns:1fr;gap:10px}.qe-ct div{border:2px solid;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:2px}.qe-ct span{font-size:28px}.qe-ct b{font-size:18px}.qe-ct em{font-size:13px;font-style:normal;font-weight:700;color:#555}.qe-ct p{font-size:14px;line-height:1.45;margin:4px 0 0}
.qe-ct-n{font-size:13px;line-height:1.45;text-align:center;color:#444;margin:10px 4px}
.qe-frase-g{background:linear-gradient(120deg,#E8F5E9,#F5E8F8);color:#2b2b2b;font-size:15px}.qe-frase-g small{display:block;margin-top:4px;font-size:12px;color:#555;letter-spacing:.5px}
.qe-cadena-t{background:#fff;border:2px solid #0E7C86;border-radius:16px;padding:12px;margin:10px 0}.qe-cadena-t b{color:#0E7C86;font-size:14px}.qe-cadena-t p{font-size:14px;line-height:1.45;margin:6px 0}.qe-cadena-t small{display:block;font-size:12.5px;line-height:1.4;color:#555;margin-top:4px}
.qe-cierre{text-align:center;margin:14px 0}.qe-cierre p{font-size:15px;line-height:1.5}.qe-cierre span{font-size:13px;color:#555}
.qe-prof{display:block;width:100%;margin-top:14px;background:#fff;border:2px solid var(--dc-verde,#08743B);color:var(--dc-verde,#08743B);border-radius:14px;padding:13px;font-weight:800;font-size:15px;cursor:pointer;min-height:48px}
@media(min-width:520px){.qe-ct{grid-template-columns:1fr 1fr}}
@media(min-width:520px){.qe-duo{grid-template-columns:1fr 1fr}.qe-pie{flex-direction:row;flex-wrap:wrap}.qe-nav{flex:1}}
`;
