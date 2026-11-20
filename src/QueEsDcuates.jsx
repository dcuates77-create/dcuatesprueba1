// «¿QUÉ ES DCUATES?» (e86a) — MAQUETA visual móvil para revisión. Complemento de «Quiero conocer DCUATES».
// 7 apartados navegables; las tarjetas tienen «Conoce más» (hoja con la explicación ampliada). No registra, no envía, no enlaza a otras secciones.
// Todo el texto está en src/datos/queEsDcuates.js. Fotos opcionales: /images/que-es/<clave>.webp (si no existe, se ve una ilustración).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { FRASES, APARTADOS, VISION, ACCIONES, FUNDAMENTOS, RELACION, IDENTIDAD, MOTIVOS, DIMENSIONES, FORMAS, FUTURO } from "./datos/queEsDcuates.js";

export const abrirQueEs = (n) => window.dispatchEvent(new CustomEvent("dcuates:que-es", { detail: n || 0 }));
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
  const [ap, setAp] = useState(0); // 0 = vista central; 1..7 = apartado
  const [mas, setMas] = useState(null);
  useEffect(() => {
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    if (window.location.hash === HASH) quitar();
    const al = () => { if (window.location.hash === HASH) { setAp(0); setAbierto(true); quitar(); } };
    const ev = (e) => { setAp(Number(e.detail) || 0); setAbierto(true); };
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:que-es", ev);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:que-es", ev); };
  }, []);
  const cerrar = () => { setAbierto(false); setMas(null); };
  const oculta = useAtras(abierto, cerrar);
  const ocultaMas = useAtras(!!mas, () => setMas(null));
  useEffect(() => { if (abierto) registrar("que_es_abrir"); }, [abierto]);
  useEffect(() => { if (abierto && ap) registrar("que_es_apartado", { n: ap }); }, [abierto, ap]);
  useEffect(() => { if (abierto) { const el = document.querySelector(".qe-cuerpo"); if (el) el.scrollTop = 0; } }, [ap, abierto]);
  if (!abierto) return null;

  const A = APARTADOS[ap - 1];
  const ir = (n) => setAp(Math.max(0, Math.min(7, n)));
  const abrirMas = (it) => { registrar("que_es_mas", { k: it.k || it.l }); setMas(it); };
  const Lista = ({ items, letra }) => <div className="qe-lista">{items.map((it) => <Tarjeta key={it.k || it.l} it={it} onMas={abrirMas} letra={letra} />)}</div>;
  const Pie = () => (
    <div className="qe-pie">
      {ap > 1 && <button type="button" className="qe-nav" onClick={() => ir(ap - 1)} data-testid="qe-ant">‹ {APARTADOS[ap - 2].t}</button>}
      {ap < 7 && <button type="button" className="qe-nav qe-nav-s" onClick={() => ir(ap + 1)} data-testid="qe-sig">{APARTADOS[ap].t} ›</button>}
      <button type="button" className="qe-nav qe-nav-c" onClick={() => ir(0)} data-testid="qe-central">Volver a la vista central</button>
    </div>
  );

  let cuerpo;
  if (ap === 0) {
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
    <div className="qe-ov" role="dialog" aria-modal="true" aria-label="¿Qué es DCUATES?" style={oculta ? { display: "none" } : undefined} data-testid="qe-overlay">
      <style>{CSS}</style>
      <header className="qe-h">
        <button type="button" className="qe-x" onClick={ap ? () => ir(0) : cerrar} aria-label={ap ? "Volver a la vista central" : "Cerrar"} data-testid="qe-atras">‹</button>
        <div className="qe-h-t"><b>{ap ? A.t : "¿QUÉ ES DCUATES?"}</b><small>{ap ? A.s : "COMUNIDAD · Maqueta para revisión"}</small></div>
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
@media(min-width:520px){.qe-duo{grid-template-columns:1fr 1fr}.qe-pie{flex-direction:row;flex-wrap:wrap}.qe-nav{flex:1}}
`;
