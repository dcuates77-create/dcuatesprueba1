// SECCIÓN NUEVA (e35) — piezas del formato minimalista: portada, tarjetas (con tarjetas anidadas) y banda final.
import React, { useEffect, useRef, useState } from "react";

// Emoji o imagen: si el "emoji" empieza con "/" es una imagen (por ejemplo el eclipse de Súmate).
export function Emo({ e }) {
  if (typeof e === "string" && e.startsWith("/")) return <img className="emo-img" src={e} alt="" />;
  return e;
}

// Portada ya diseñada (trae título y logo): se muestra completa, y el texto y el botón van debajo.
export function HeroBanner({ tab, portada, titulo, texto, boton, onBoton }) {
  return (
    <section className="sn-banner" style={{ "--tc": tab.boton || tab.color }} aria-label={titulo}>
      <h2 className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{titulo}</h2>
      <img className="sn-banner-img" src={portada} alt={titulo} />
      {texto && (
        <div className="sn-banner-t">
          {texto && <p>{texto}</p>}
        </div>
      )}
    </section>
  );
}

export function Hero({ tab, foto, titulo, texto, boton, onBoton }) {
  const [fallo, setFallo] = useState(!foto);
  useEffect(() => { setFallo(!foto); }, [foto]);
  return (
    <section className="sn-hero" style={{ "--tc": tab.boton || tab.color, background: `linear-gradient(135deg, ${tab.boton || tab.color}, ${tab.color})` }} aria-label={titulo}>
      {!fallo && <img className="sn-foto" src={foto} alt="" onError={() => setFallo(true)} />}
      {fallo && <span className="sn-gran" aria-hidden="true"><Emo e={tab.emoji} /></span>}
      <div className="sn-vela" aria-hidden="true" />
      <div className="sn-hero-t">
        <h2>{titulo}</h2>
        <p>{texto}</p>
        {boton && <button type="button" className="sn-cta-b" onClick={onBoton}>{boton} <span aria-hidden="true">→</span></button>}
      </div>
    </section>
  );
}

// Tarjeta: si tiene "children" es ANIDADA (se despliega ahí mismo); si no, ejecuta onClick.
export function Tarjeta({ n, ico, t, d, onClick, children }) {
  const anidada = children != null;
  const [ab, setAb] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!anidada) return undefined;
    const tiene = (id) => { try { return !!(id && ref.current && ref.current.querySelector("#" + (window.CSS && CSS.escape ? CSS.escape(id) : id))); } catch (e) { return false; } };
    const revisar = (id) => { if (tiene(id)) setAb(true); };
    revisar(window.__dcDestino);
    revisar(decodeURIComponent((window.location.hash || "").replace("#", "")));
    const alHash = () => revisar(decodeURIComponent(window.location.hash.replace("#", "")));
    const alEvento = (e) => revisar(e.detail);
    const alClic = (e) => { const a = e.target?.closest?.('a[href^="#"]'); if (a) revisar(decodeURIComponent(a.getAttribute("href").slice(1))); };
    window.addEventListener("hashchange", alHash);
    window.addEventListener("dcuates:abrir-seccion", alEvento);
    document.addEventListener("click", alClic, true);
    return () => {
      window.removeEventListener("hashchange", alHash);
      window.removeEventListener("dcuates:abrir-seccion", alEvento);
      document.removeEventListener("click", alClic, true);
    };
  }, [anidada]);
  return (
    <div className={"sn-t" + (ab ? " sn-ab" : "")} ref={ref}>
      <button type="button" className="sn-fila" aria-expanded={anidada ? ab : undefined} onClick={() => (anidada ? setAb((v) => !v) : onClick && onClick())}>
        <span className={"sn-ico " + (n % 2 ? "sn-ico2" : "sn-ico1")} aria-hidden="true">{ico}</span>
        <span className="sn-tx"><b>{t}</b>{d && <small>{d}</small>}</span>
        <span className="sn-fl" aria-hidden="true">{anidada ? (ab ? "⌃" : "⌄") : "→"}</span>
      </button>
      {anidada && <div className="sn-cont" style={ab ? undefined : { display: "none" }}>{children}</div>}
    </div>
  );
}

export function BandaFinal({ tab, titulo, desc, onClick }) {
  return (
    <button type="button" className="sn-banda" onClick={onClick} style={{ background: tab.pastel, borderColor: tab.color, "--tc": tab.boton || tab.color }}>
      <span className="sn-banda-e" aria-hidden="true">🌿</span>
      <span className="sn-tx"><b>{titulo}</b>{desc && <small>{desc}</small>}</span>
      <span className="sn-banda-go" aria-hidden="true">→</span>
    </button>
  );
}

// Imagen final de cada sección con llamado a SUMAR y botones de registro.
export function BloqueSumar({ tab, cfg, onAccion }) {
  const [fallo, setFallo] = useState(false);
  return (
    <section className="sn-sumar" style={{ "--tc": tab.boton || tab.color, borderColor: tab.color }} aria-label={cfg.titulo}>
      {cfg.img && !fallo && <img className="sn-sumar-img" src={cfg.img} alt="" loading="lazy" onError={() => setFallo(true)} />}
      <div className="sn-sumar-t">
        <h3>{cfg.titulo}</h3>
        <p>{cfg.texto}</p>
        <div className="sn-sumar-b">
          {(cfg.botones || []).map((b, i) => (
            <button key={b.t} type="button" className={i === 0 ? "sn-b1" : "sn-b2"} onClick={() => onAccion(b.a)}>{b.t}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

// MICRO-ACCIONES y RETO DEL MES (e49) — tarjetas con el tiempo que toma cada acción. Los textos viven en src/datos/vistaSeccion.js (cierre.micro / cierre.reto).
export function MicroAcciones({ cfg, onAccion }) {
  return (
    <section className="sn-micro" aria-label={cfg.titulo}>
      <h3 className="sn-p">{cfg.titulo}</h3>
      {cfg.intro && <p className="sn-i">{cfg.intro}</p>}
      <div className="sn-micro-l">
        {cfg.items.map((x) => (
          <button key={x.t} type="button" className={"sn-micro-i" + (x.meta ? " sn-micro-meta" : "")} onClick={() => onAccion(x.a)}>
            <span className="sn-micro-e" aria-hidden="true">{x.ico}</span>
            <span className="sn-tx">
              <span className="sn-micro-min" aria-label={x.min + (x.min === 1 ? " minuto" : " minutos")}>⏱ {x.min} min</span>
              <b>{x.t}</b>{x.d && <small>{x.d}</small>}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function RetoMes({ cfg, onAccion }) {
  return (
    <section className="sn-reto" aria-label={cfg.titulo}>
      <small className="sn-reto-k"><span aria-hidden="true">{cfg.ico}</span> {cfg.titulo.toUpperCase()}</small>
      <b className="sn-reto-t">{cfg.t}</b>
      {cfg.d && <p>{cfg.d}</p>}
      <div className="sn-reto-b">
        {cfg.botones.map((b, i) => (
          <button key={b.t} type="button" className={i === 0 ? "sn-b1" : "sn-b2"} onClick={() => onAccion(b.a)}>{b.t}</button>
        ))}
      </div>
    </section>
  );
}

export const CSS_SN = `.sn-micro{margin:6px 0 10px}.sn-micro-l{display:flex;flex-direction:column;gap:8px}
.sn-micro-i{display:flex;align-items:flex-start;gap:10px;width:100%;text-align:left;background:#fff;border:2px solid #f1d9b8;border-radius:16px;padding:10px;min-height:64px;cursor:pointer;font-family:inherit;box-shadow:0 2px 6px rgba(15,45,30,.1)}
.sn-micro-meta{border-color:#E65100;background:linear-gradient(135deg,#fff4d6,#ffe9c8)}.sn-micro-i:active{transform:translateY(1px)}.sn-micro-e{flex:none;font-size:30px;line-height:1;width:40px;text-align:center;padding-top:20px}
.sn-micro-i .sn-tx{flex:1;min-width:0;display:flex;flex-direction:column}.sn-micro-i b{font-size:14.5px;font-weight:900;color:#0f2d1e;line-height:1.2}.sn-micro-i small{font-size:12.5px;font-weight:700;color:#4a5f53;line-height:1.3;margin-top:2px}
.sn-micro-min{align-self:flex-start;margin-bottom:4px;background:var(--tc,#BF360C);color:#fff;border-radius:999px;padding:4px 9px;font-size:12px;font-weight:900;white-space:nowrap}
.sn-reto{margin:10px 0;background:linear-gradient(135deg,#fff4d6,#ffe3b8);border:3px solid #E65100;border-radius:20px;padding:14px;text-align:center;font-family:inherit}
.sn-reto-k{display:block;font-size:12.5px;font-weight:900;letter-spacing:.06em;color:#BF360C}.sn-reto-t{display:block;margin:4px 0 6px;font-size:19px;font-weight:900;line-height:1.2;color:#0f2d1e}.sn-reto p{margin:0 0 10px;font-size:14px;font-weight:700;color:#3d3a2a}.sn-reto-b{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}.sn-reto-b button{min-height:46px;padding:0 18px;border-radius:999px;font-weight:900;font-size:14.5px;cursor:pointer;font-family:inherit}
.sn-reto-b .sn-b1{background:#BF360C;color:#fff;border:0}.sn-reto-b .sn-b2{background:#fff;color:#BF360C;border:2px solid #BF360C}

.emo-img{display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.2em}
.sn-banner{margin:-6px calc(-1 * var(--pad,16px)) 14px;border-radius:0;overflow:hidden;background:#fff;box-shadow:0 6px 18px rgba(15,45,30,.2)}
.sn-banner-img{display:block;width:100%;height:auto}
.sn-banner-t{padding:14px 16px 12px;background:#fff}
.sn-banner-t p{margin:0 0 6px;font-size:18px;line-height:1.35;font-weight:800;color:#0f3d22}
.sn-sumar{margin:16px 0 8px;border:2px solid;border-radius:22px;background:#fff;overflow:hidden;box-shadow:0 4px 0 rgba(15,45,30,.08),0 8px 16px rgba(15,45,30,.1)}
.sn-sumar-img{display:block;width:100%;max-width:340px;max-height:420px;object-fit:contain;margin:12px auto 0;border-radius:16px}
.sn-sumar-t{padding:12px 16px 16px;text-align:center}
.sn-sumar-t h3{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:22px;line-height:1.15;margin:0 0 6px;color:#0f4a2f}
.sn-sumar-t p{margin:0 0 12px;font-size:14px;line-height:1.4;font-weight:700;color:#3d5a4a}
.sn-sumar-b{display:flex;flex-direction:column;gap:8px}
.sn-sumar-b button{border:0;border-radius:999px;min-height:48px;padding:10px 16px;font-weight:900;font-size:14.5px;cursor:pointer}
.sn-b1{background:#0e7c4f;color:#fff;box-shadow:0 4px 0 #0a5a39}
.sn-b2{background:#fff;color:#0f4a2f;border:2px solid #0e7c4f!important}
.sn-b1:active{transform:translateY(2px);box-shadow:0 2px 0 #0a5a39}
.sn-acc{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 6px}
.sn-acc button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:0;border-radius:18px;min-height:92px;padding:10px 8px;color:#fff;font-weight:900;font-size:13.5px;line-height:1.15;text-align:center;box-shadow:0 4px 0 rgba(0,0,0,.25);cursor:pointer}
.sn-acc button span{font-size:28px;line-height:1}
.sn-acc button:active{transform:translateY(2px)}
@media (min-width:768px){.sn-acc{grid-template-columns:repeat(3,1fr)}.sn-sumar{display:grid;grid-template-columns:auto 1fr;align-items:center}.sn-sumar-img{margin:12px}}
.sn-hero{position:relative;overflow:hidden;border-radius:26px 26px 44px 26px;min-height:250px;box-shadow:0 6px 18px rgba(15,45,30,.2);margin:2px 0 14px}
.sn-foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sn-gran{position:absolute;right:8px;top:6px;font-size:120px;opacity:.28;line-height:1}
.sn-vela{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.04) 0%,rgba(10,40,25,.5) 55%,rgba(10,40,25,.84) 100%)}
.sn-hero-t{position:relative;display:flex;flex-direction:column;justify-content:flex-end;min-height:250px;padding:18px 16px 18px;color:#fff}
.sn-hero-t h2{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:32px;line-height:1.05;margin:0 0 6px;text-shadow:0 2px 8px rgba(0,0,0,.4)}
.sn-hero-t p{margin:0 0 12px;font-size:14.5px;line-height:1.35;font-weight:700;text-shadow:0 1px 4px rgba(0,0,0,.45);max-width:34em}
.sn-cta-b{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;border:0;border-radius:999px;background:#0e7c4f;color:#fff;font-weight:900;font-size:14px;padding:10px 16px;min-height:44px;box-shadow:0 4px 0 #0a5a39,0 6px 12px rgba(0,0,0,.28);cursor:pointer}
.sn-cta-b:active{transform:translateY(2px);box-shadow:0 2px 0 #0a5a39}
.sn-p{font-family:"Fraunces",Georgia,serif;font-weight:700;font-size:25px;line-height:1.15;margin:6px 2px 4px;color:#0f4a2f}
.sn-i{margin:0 2px 12px;font-size:16px;line-height:1.4;font-weight:700;color:#2f4d3f}
.sn-lista{display:flex;flex-direction:column;gap:10px}
.sn-t{border-radius:18px;background:#fff;border:1.5px solid rgba(15,45,30,.1);box-shadow:0 3px 0 rgba(15,45,30,.07),0 6px 12px rgba(15,45,30,.07);overflow:hidden}
.sn-fila{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:0;background:transparent;padding:12px 12px;min-height:72px;cursor:pointer;color:#0f2d1e}
.sn-ico{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:50%;font-size:25px}
.sn-ico1{background:#d6e8c6}
.sn-ico2{background:#e8692c;color:#fff}
.sn-tx{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
.sn-tx b{font-size:17px;line-height:1.15;font-weight:900;color:#0f4a2f}
.sn-tx small{font-size:14.5px;line-height:1.3;font-weight:700;color:#3d5a4a}
.sn-fl{flex:0 0 auto;font-size:22px;font-weight:900;color:#0f4a2f;width:26px;text-align:center}
.sn-cont{padding:6px 10px 14px;border-top:1px dashed rgba(15,45,30,.18);background:#fbf7ec}
.sn-banda{display:flex;align-items:center;gap:12px;width:100%;margin:14px 0 6px;text-align:left;border:2px solid;border-radius:20px;padding:12px 14px;min-height:70px;cursor:pointer;color:#0f2d1e}
.sn-banda-e{font-size:30px}
.sn-banda-go{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#0f4a2f;color:#fff;font-size:18px;font-weight:900}
@media (min-width:768px){.sn-hero,.sn-hero-t{min-height:340px}.sn-hero-t h2{font-size:42px}.sn-hero-t{padding:26px 28px}.sn-lista{display:grid;grid-template-columns:1fr 1fr;align-items:start}}
`;
