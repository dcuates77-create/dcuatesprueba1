// ZONA DCUATES — tarjetas de juego y participación (piloto, etapa 10).
//  🎉 JUEGA Y DIVIÉRTETE  → marco de juego con 5 juegos y botones al pie
//  👋 EMPIEZA AQUÍ        → primeros pasos de 1 clic
//  🏅 TU CAMINO           → Semillas y nivel (guardados en el celular)
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import TiraAuto from "./TiraAuto.jsx";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { CONTEXTOS, guardarPref, guardarRecord, leerPref, leerRecord, leerSemillas, nivelDe, normalizarJuegos, sumarSemillas } from "./datos/juegos.js";

const COMPONENTES = {
  memorama: lazy(() => import("./juegos/Memorama.jsx")),
  culebrita: lazy(() => import("./juegos/Culebrita.jsx")),
  papalote: lazy(() => import("./juegos/Papalote.jsx")),
  atrapa: lazy(() => import("./juegos/Atrapa.jsx")),
  escaleras: lazy(() => import("./juegos/Escaleras.jsx"))
};
const SIGUIENTE_PASO = { nosotros: ["asesorias", "Conoce las asesorías gratuitas"], beneficios: ["libros", "Pide un libro prestado"], causas: ["ecatepets", "Conoce a los peluditos de Ecatepets"], negocios: ["cupones-promos", "Mira los cupones de negocios locales"] };

function Marco({ juegos, onCerrar, onAbrirProyecto, alSumar }) {
  const [juego, setJuego] = useState(() => { const g = leerPref("juego", "memorama"); return juegos.some((j) => j.id === g) ? g : juegos[0].id; });
  const [ctxId, setCtxId] = useState(() => leerPref("ctx", "nosotros"));
  const [ronda, setRonda] = useState(0);
  const [res, setRes] = useState(null);
  const [semillas, setSemillas] = useState(leerSemillas());
  const ctx = useMemo(() => CONTEXTOS.find((c) => c.id === ctxId) || CONTEXTOS[0], [ctxId]);
  const Juego = COMPONENTES[juego];

  const token = `${juego}-${ctx.id}-${ronda}`;
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const datosRef = useRef({});
  datosRef.current = { juego, ctx, alSumar };
  // onFin estable por partida: ignora avisos tardíos de una partida ya cerrada.
  const terminar = useMemo(() => (pts, texto) => {
    if (tokenRef.current !== token) return;
    const { juego: jg, ctx: cx, alSumar: sumarFn } = datosRef.current;
    const antes = leerRecord(jg);
    guardarRecord(jg, pts);
    const ganadas = 1 + Math.min(4, Math.floor(pts / 6));
    const total = sumarSemillas(ganadas);
    setSemillas(total); sumarFn && sumarFn(total);
    setRes({ pts, texto, ganadas, record: pts > antes && pts > 0, meta: cx.meta });
  }, [token]);

  const elegirJuego = (id) => { setJuego(id); guardarPref("juego", id); setRes(null); setRonda((r) => r + 1); };
  const elegirCtx = (id) => { setCtxId(id); guardarPref("ctx", id); setRes(null); setRonda((r) => r + 1); };
  const niv = nivelDe(semillas);
  const paso = SIGUIENTE_PASO[ctx.id];

  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Juega y diviértete" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab">
          <b>🎉 Juega y diviértete</b>
          <span className="zj-sem" title="Tus Semillas">{niv.emoji} {semillas}</span>
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="zj-juego" style={{ "--c": ctx.color }}>
          <Suspense fallback={<p className="jg-info">Cargando…</p>}>
            {Juego && <Juego key={`${juego}-${ctx.id}-${ronda}`} ctx={ctx} onFin={terminar} />}
          </Suspense>
          {res && (
            <div className="zj-res">
              <p className="zj-res-t">{res.meta}</p>
              <p>{res.texto}</p>
              <p className="zj-res-s">+{res.ganadas} 🌱 Semillas{res.record ? " · ¡Nuevo récord!" : ""}</p>
              <div className="zj-res-b">
                <button type="button" onClick={() => { setRes(null); setRonda((r) => r + 1); }} style={{ background: ctx.color }}>🔁 Jugar otra vez</button>
                {paso && <button type="button" className="zj-sig" onClick={() => { onCerrar(); onAbrirProyecto(paso[0]); }}>👉 Tu siguiente paso: {paso[1]}</button>}
              </div>
            </div>
          )}
        </div>
        <p className="zj-et">¿Cómo quieres jugar?</p>
        <div className="zj-chips">
          {juegos.map((j) => (
            <button type="button" key={j.id} className={"zj-chip" + (j.id === juego ? " zj-on" : "")} onClick={() => elegirJuego(j.id)} aria-pressed={j.id === juego}>
              <span>{j.emoji}</span>{j.nombre}
            </button>
          ))}
        </div>
        <p className="zj-et">¿De qué quieres jugar?</p>
        <div className="zj-chips">
          {CONTEXTOS.map((c) => (
            <button type="button" key={c.id} className={"zj-chip" + (c.id === ctxId ? " zj-on" : "")} style={c.id === ctxId ? { background: c.color, borderColor: c.color, color: "#fff" } : { borderColor: c.color }} onClick={() => elegirCtx(c.id)} aria-pressed={c.id === ctxId}>
              <span>{c.emoji}</span>{c.nombre}
            </button>
          ))}
        </div>
        <p className="zj-rec">Tu récord en este juego: <b>{leerRecord(juego)}</b></p>
      </div>
    </div>
  );
}

const PALABRAS = [
  ["💛", "Gratitud", "Dar las gracias hoy hace mejor el día de dos personas: la tuya y la de quien las recibe."],
  ["🌟", "Esperanza", "Cada paso pequeño, repetido con otros, mueve montañas."],
  ["🤝", "Confianza", "Se construye de a poquito, con palabras cumplidas."],
  ["🌱", "Crecer", "Lo que se cuida con paciencia, florece."],
  ["🫶", "Solidaridad", "Nadie es tan pobre que no pueda dar, ni tan rico que no necesite recibir."],
  ["😊", "Alegría", "Una sonrisa compartida vale más que muchas palabras."]
];

function Empieza({ onCerrar, onAbrirProyecto, alSumar }) {
  const [vista, setVista] = useState("menu"); // menu | animo | nuevo | palabra
  const [paso, setPaso] = useState(0);
  const [animo, setAnimo] = useState(null);
  const [pal, setPal] = useState(null);
  const sumar = () => { const t = sumarSemillas(1); alSumar && alSumar(t); };
  const ir = (id) => { onCerrar(); onAbrirProyecto(id); };
  const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;
  const volver = <button type="button" className="zj-link" onClick={() => { setVista("menu"); setAnimo(null); setPal(null); setPaso(0); }}>‹ Volver</button>;
  const BIENVENIDA = [
    ["🏠", "Esto es DCUATES", "Una comunidad que genera proyectos sociales, cultiva amistades y apoya a personas, grupos y causas. Llevamos 19 años creciendo juntos."],
    ["🎮", "Juega, participa y suma", "Jugar, opinar y ayudar te da Semillas 🌱. Con ellas subes de nivel: Semilla, Brote, Árbol, Fruto y Bosque."],
    ["🧭", "Elige por dónde empezar", null]
  ];
  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Empieza aquí" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>👋 Empieza aquí</b><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        {vista === "menu" && (
          <div className="zj-menu">
            <p className="zj-p">Tres pasos de un solo clic para conocernos. ¡Cada uno suma una Semilla! 🌱</p>
            <button type="button" onClick={() => setVista("animo")}>😊 ¿Cómo estás hoy?</button>
            <button type="button" onClick={() => setVista("palabra")}>🌟 Elige tu palabra de hoy</button>
            <button type="button" onClick={() => setVista("nuevo")}>🧭 Soy nuevo: ¿por dónde empiezo?</button>
          </div>
        )}
        {vista === "animo" && (
          <div>
            {volver}
            <p className="zj-p">¿Cómo te sientes hoy?</p>
            <div className="zj-caras">
              {[["😊", "Bien"], ["😐", "Regular"], ["😟", "Con preocupación"]].map(([e, t]) => (
                <button type="button" key={e} className={animo === e ? "zj-on" : ""} onClick={() => { setAnimo(e); sumar(); }}><span>{e}</span>{t}</button>
              ))}
            </div>
            {animo === "😊" && <div className="zj-resp"><p>¡Qué gusto! Comparte esa alegría: invita a un vecino a conocer DCUATES.</p><a href={wa("¡Hola! Te invito a conocer la comunidad DCUATES: dcuates.com 💛")} target="_blank" rel="noopener noreferrer">💬 Invitar por WhatsApp</a></div>}
            {animo === "😐" && <div className="zj-resp"><p>A veces un buen libro o una charla ayudan. Mira cómo pedir uno prestado, es gratis.</p><button type="button" onClick={() => ir("libros")}>📚 Ver préstamo de libros</button></div>}
            {animo === "😟" && <div className="zj-resp"><p>Gracias por contarlo. No tienes que estar solo(a): aquí hay personas dispuestas a escucharte y orientarte.</p><button type="button" onClick={() => ir("asesorias")}>🎓 Ver asesorías gratuitas</button><a href={wa("Hola, me gustaría recibir orientación o apoyo.")} target="_blank" rel="noopener noreferrer">💬 Escribirnos por WhatsApp</a></div>}
          </div>
        )}
        {vista === "palabra" && (
          <div>
            {volver}
            <p className="zj-p">Toca la palabra que más necesitas hoy:</p>
            <div className="zj-pal">
              {PALABRAS.map((p) => <button type="button" key={p[1]} className={pal === p ? "zj-on" : ""} onClick={() => { if (!pal) sumar(); setPal(p); }}><span>{p[0]}</span>{p[1]}</button>)}
            </div>
            {pal && <div className="zj-resp"><p><b>{pal[0]} {pal[1]}.</b> {pal[2]}</p></div>}
          </div>
        )}
        {vista === "nuevo" && (
          <div>
            {volver}
            <div className="zj-resp zj-bien">
              <p className="zj-bien-e">{BIENVENIDA[paso][0]}</p>
              <p><b>{BIENVENIDA[paso][1]}</b></p>
              {BIENVENIDA[paso][2] && <p>{BIENVENIDA[paso][2]}</p>}
              {paso === 2 && (
                <div className="zj-col">
                  <button type="button" onClick={() => ir("libros")}>📚 Quiero un libro</button>
                  <button type="button" onClick={() => ir("ecatepets")}>🐾 Quiero ayudar a un peludito</button>
                  <button type="button" onClick={() => ir("cupones-promos")}>🏷️ Busco descuentos locales</button>
                </div>
              )}
            </div>
            <div className="zj-nav">
              <button type="button" disabled={paso === 0} onClick={() => setPaso((p) => p - 1)}>‹</button>
              <span>{paso + 1} / 3</span>
              <button type="button" disabled={paso === 2} onClick={() => { setPaso((p) => p + 1); if (paso === 1) sumar(); }}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ZonaJuegos({ onAbrirProyecto = () => {}, filas = [] }) {
  const [abierto, setAbierto] = useState(null); // "juegos" | "empieza"
  const [semillas, setSemillas] = useState(leerSemillas());
  const juegos = useMemo(() => normalizarJuegos(filas), [filas]);
  const niv = nivelDe(semillas);
  const falta = niv.siguiente ? niv.siguiente.min - semillas : 0;
  const cerrar = () => { setAbierto(null); setSemillas(leerSemillas()); };
  useEffect(() => { setSemillas(leerSemillas()); }, []);

  return (
    <section className="zj-sec" aria-label="Zona de juegos y participación">
      <h2 className="zj-tit">🎮 ZONA DCUATES</h2>
      <p className="zj-sub">Juega, participa y suma Semillas 🌱</p>
      <TiraAuto intervalo={3000} etiqueta="Zona DCUATES" fondo="#fff">
        <div className="zj-w">
          <article className="zj-card" style={{ borderColor: "#E5484D" }}>
            <span className="zj-ico" style={{ background: "#E5484D" }} aria-hidden="true">🎉</span>
            <h3>JUEGA Y DIVIÉRTETE</h3>
            <p>5 juegos clásicos con tu tema favorito.</p>
            <button type="button" onClick={() => setAbierto("juegos")} style={{ background: "#E5484D" }}>🎮 Jugar</button>
          </article>
        </div>
        <div className="zj-w">
          <article className="zj-card" style={{ borderColor: "#2E9E5B" }}>
            <span className="zj-ico" style={{ background: "#2E9E5B" }} aria-hidden="true">👋</span>
            <h3>EMPIEZA AQUÍ</h3>
            <p>Primeros pasos de 1 clic para conocernos.</p>
            <button type="button" onClick={() => setAbierto("empieza")} style={{ background: "#2E9E5B" }}>👋 Empezar</button>
          </article>
        </div>
        <div className="zj-w">
          <article className="zj-card" style={{ borderColor: "#B7791F" }}>
            <span className="zj-ico" style={{ background: "#B7791F" }} aria-hidden="true">{niv.emoji}</span>
            <h3>TU CAMINO: {niv.nombre.toUpperCase()}</h3>
            <p>{semillas} 🌱 Semillas{niv.siguiente ? ` · faltan ${falta} para ${niv.siguiente.nombre}` : " · ¡nivel máximo!"}</p>
            <button type="button" onClick={() => setAbierto("juegos")} style={{ background: "#B7791F" }}>🌱 Sumar</button>
          </article>
        </div>
      </TiraAuto>
      {abierto === "juegos" && createPortal(<Marco juegos={juegos} onCerrar={cerrar} onAbrirProyecto={onAbrirProyecto} alSumar={setSemillas} />, document.body)}
      {abierto === "empieza" && createPortal(<Empieza onCerrar={cerrar} onAbrirProyecto={onAbrirProyecto} alSumar={setSemillas} />, document.body)}
      <style>{CSS}</style>
    </section>
  );
}

const CSS = `
.zj-sec{max-width:72rem;margin:18px auto 6px;padding:14px 16px 6px;border-radius:20px;background:linear-gradient(135deg,#fff7e6,#ffeef2)}
.zj-tit{margin:0;font-size:20px;font-weight:900;text-align:center;color:#1f2a37}
.zj-sub{margin:2px 0 6px;text-align:center;font-size:14px;font-weight:700;color:#5b6675}
.zj-w{width:158px;display:flex}
.zj-card{flex:1;display:flex;flex-direction:column;gap:3px;padding:10px;background:#fff;border:2px solid;border-radius:16px;box-shadow:0 4px 12px rgba(31,42,55,.08)}
.zj-ico{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:22px}
.zj-card h3{margin:4px 0 0;font-size:13px;font-weight:900;line-height:1.15;color:#1f2a37}
.zj-card p{margin:0;font-size:11.5px;font-weight:700;line-height:1.25;color:#5b6675}
.zj-card>button{margin-top:auto;min-height:38px;border:0;border-radius:12px;color:#fff;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer}
.zj-card>p+button{margin-top:8px}
.zj-fondo{position:fixed;inset:0;z-index:90;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:inherit}
.zj-caja{width:100%;max-width:460px;max-height:95vh;overflow:auto;background:#fff;border-radius:22px 22px 0 0;padding:12px 12px 20px;color:#1f2a37}
@media(min-width:640px){.zj-fondo{align-items:center}.zj-caja{border-radius:22px}}
.zj-cab{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.zj-cab b{flex:1;font-size:18px;font-weight:900}
.zj-sem{background:#fff4d6;border-radius:99px;padding:6px 12px;font-weight:900;font-size:14px}
.zj-x{width:42px;height:42px;border:0;border-radius:12px;background:#fde8e8;font-size:16px;font-weight:900;cursor:pointer;color:#1f2a37}
.zj-juego{position:relative;border:3px solid var(--c);border-radius:16px;padding:8px;background:#fff;min-height:200px}
.zj-et{margin:12px 2px 4px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#6b7785}
.zj-chips{display:flex;flex-wrap:wrap;gap:6px}
.zj-chip{display:inline-flex;align-items:center;gap:5px;min-height:40px;padding:6px 12px;border:2px solid #d5dcd8;border-radius:99px;background:#fff;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer;color:#1f2a37}
.zj-chip.zj-on{background:#1f2a37;border-color:#1f2a37;color:#fff}
.zj-rec{margin:10px 2px 0;font-size:13px;font-weight:700;color:#6b7785}
.zj-res{position:absolute;inset:0;z-index:5;background:rgba(255,255,255,.96);border-radius:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:14px;text-align:center}
.zj-res p{margin:0;font-size:15px;font-weight:700}
.zj-res-t{font-size:19px!important;font-weight:900!important}
.zj-res-s{color:#B7791F;font-weight:900!important}
.zj-res-b{display:flex;flex-direction:column;gap:8px;margin-top:6px;width:100%}
.zj-res-b button{min-height:46px;border:0;border-radius:12px;color:#fff;font-family:inherit;font-weight:900;font-size:15px;cursor:pointer}
.zj-res-b .zj-sig{background:#1f2a37}
.jg-info{margin:0 0 6px;font-size:14px;font-weight:700;color:#5b6675;text-align:center}
.jg-cv{display:block;width:100%;border-radius:12px;background:#f4faf6}
.jg-mem{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.jg-carta{aspect-ratio:1;border:0;border-radius:12px;background:#e6edf0;font-size:30px;cursor:pointer;display:grid;place-items:center;transition:transform .2s}
.jg-abierta{background:#fff;box-shadow:inset 0 0 0 3px #1B6F8A}
.jg-ok{box-shadow:inset 0 0 0 3px #2E9E5B;background:#eafaf0}
.jg-pad{display:flex;flex-direction:column;align-items:center;gap:4px;margin-top:8px}
.jg-pad div{display:flex;gap:44px}
.jg-pad button{width:56px;height:46px;border:0;border-radius:12px;background:#e6edf0;font-size:20px;cursor:pointer}
.jg-tab{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}
.jg-cas{position:relative;aspect-ratio:1;border-radius:10px;background:#f1f5f2;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px}
.jg-cas small{position:absolute;top:2px;left:4px;font-size:10px;font-weight:800;color:#6b7785}
.jg-cas span{font-size:16px}.jg-cas b{font-size:20px;line-height:1}
.jg-esc{background:#e6f6ea}.jg-ser{background:#fde8e8}.jg-meta{background:#fff4d6}
.jg-msg{min-height:40px;margin:8px 0 4px;text-align:center;font-size:14px;font-weight:700}
.jg-dado{display:block;margin:0 auto;min-width:160px;min-height:50px;border:0;border-radius:99px;background:#1f2a37;color:#fff;font-family:inherit;font-size:20px;font-weight:900;cursor:pointer}
.jg-dado:disabled{opacity:.5}
.zj-p{margin:4px 2px 10px;font-size:15px;font-weight:700;line-height:1.35}
.zj-menu{display:flex;flex-direction:column;gap:8px}
.zj-menu button,.zj-resp button,.zj-resp a,.zj-col button{display:block;width:100%;min-height:50px;padding:8px 12px;border:0;border-radius:14px;background:#2E9E5B;color:#fff;font-family:inherit;font-size:15px;font-weight:900;text-align:center;text-decoration:none;cursor:pointer;margin-top:6px;display:grid;place-items:center}
.zj-link{border:0;background:none;font-family:inherit;font-size:15px;font-weight:900;color:#1B6F8A;cursor:pointer;min-height:40px}
.zj-caras,.zj-pal{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.zj-caras button,.zj-pal button{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px;border:2px solid #d5dcd8;border-radius:14px;background:#fff;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer}
.zj-caras button span,.zj-pal button span{font-size:30px}
.zj-caras .zj-on,.zj-pal .zj-on{border-color:#2E9E5B;background:#eafaf0}
.zj-resp{margin-top:12px;padding:12px;border-radius:14px;background:#f4f7f5;font-size:15px;font-weight:600;line-height:1.4}
.zj-resp p{margin:0}
.zj-bien{text-align:center}.zj-bien-e{font-size:46px!important}
.zj-nav{display:flex;justify-content:center;align-items:center;gap:16px;margin-top:10px;font-weight:900}
.zj-nav button{width:48px;height:44px;border:0;border-radius:12px;background:#1f2a37;color:#fff;font-size:22px;cursor:pointer}
.zj-nav button:disabled{opacity:.3}
`;
