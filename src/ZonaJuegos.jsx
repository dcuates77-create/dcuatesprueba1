// ZONA DCUATES — tarjetas de juego y participación (etapa 11).
//  👋 EMPIEZA AQUÍ · 🎉 JUEGA Y DIVIÉRTETE · 🧠 JUEGA Y APRENDE · 🏆 JUEGA Y GANA
//  💡 RECOMIENDA Y GANA · 🛍️ DONA, COMPRA Y VENDE CON CAUSA · 📌 INFO CLAVE   (Semillas y nivel en el chip del encabezado)
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import TiraAuto from "./TiraAuto.jsx";
import BotonCompartir from "./BotonCompartir.jsx";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { LOGROS_ITEMS } from "./datos/cintas.js";
import { juegosActivosDesdeZona, necesidadesDesdeZona, palabrasDesdeZona, premiosDesdeZona, telefonosDesdeZona, temasDesdeZona, agendaDesdeZona, RETOS_DIA, retosDesdeZona } from "./datos/zona.js";
import { CONTEXTOS, guardarPref, guardarRecord, leerPref, leerRecord, leerSemillas, nivelDe, normalizarJuegos, sumarSemillas } from "./datos/juegos.js";

const COMPONENTES = {
  memorama: lazy(() => import("./juegos/Memorama.jsx")),
  bloques: lazy(() => import("./juegos/Bloques.jsx")),
  cometacos: lazy(() => import("./juegos/ComeTacos.jsx")),
  fusiona: lazy(() => import("./juegos/Fusiona.jsx")),
  papalote: lazy(() => import("./juegos/Papalote.jsx")),
  atrapa: lazy(() => import("./juegos/Atrapa.jsx")),
  escaleras: lazy(() => import("./juegos/Escaleras.jsx")),
  gato: lazy(() => import("./juegos/Gato.jsx")),
  simon: lazy(() => import("./juegos/Simon.jsx"))
};
const VentanaAprende = lazy(() => import("./ZonaAprende.jsx"));
const VentanaGana = lazy(() => import("./ZonaGana.jsx"));
const VentanaPropon = lazy(() => import("./ZonaPropon.jsx"));
const VentanaInfo = lazy(() => import("./ZonaInfo.jsx"));
const VentanaCausa = lazy(() => import("./ZonaCausa.jsx"));
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
  ["🤲", "Solidaridad", "Nadie es tan pobre que no pueda dar, ni tan rico que no necesite recibir."],
  ["😊", "Alegría", "Una sonrisa compartida vale más que muchas palabras."],
  ["🌼", "Recuerdo", "Recordar con cariño a quienes ya no están es una forma de mantenerlos cerca."]
];

function Empieza({ onCerrar, onAbrirProyecto, alSumar, palabras, retos }) {
  const hoyTxt = new Date().toISOString().slice(0, 10);
  const listaRetos = retos && retos.length ? retos : RETOS_DIA;
  const retoHoy = listaRetos[Math.floor(Date.now() / 86400000) % listaRetos.length];
  const [retoHecho, setRetoHecho] = useState(() => { try { return localStorage.getItem("dc_reto") === hoyTxt; } catch (e) { return false; } });
  const cumplir = () => { try { localStorage.setItem("dc_reto", hoyTxt); } catch (e) {} setRetoHecho(true); const t = sumarSemillas(1); alSumar && alSumar(t); };
  const LISTA = palabras && palabras.length ? palabras : PALABRAS;
  const [vista, setVista] = useState("menu"); // menu | animo | nuevo | palabra
  const [paso, setPaso] = useState(0);
  const [animo, setAnimo] = useState(null);
  const [pal, setPal] = useState(null);
  const [dato, setDato] = useState(null);
  const sumar = () => { const t = sumarSemillas(1); alSumar && alSumar(t); };
  const ir = (id) => { onCerrar(); onAbrirProyecto(id); };
  const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;
  const volver = <button type="button" className="zj-link" onClick={() => { setVista("menu"); setAnimo(null); setPal(null); setPaso(0); setDato(null); }}>‹ Volver</button>;
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
            <p className="zj-p">Pasos de un solo clic para conocernos. ¡Varios suman una Semilla! 🌱</p>
            <button type="button" onClick={() => setVista("reto")}>🎯 Mi reto de hoy</button>
            <button type="button" onClick={() => setVista("nuevo")}>🧭 Soy nuevo: ¿por dónde empiezo?</button>
            <button type="button" onClick={() => setVista("hacer")}>🙋 ¿Qué te gustaría hacer?</button>
            <button type="button" onClick={() => setVista("animo")}>😊 ¿Cómo estás hoy?</button>
            <button type="button" onClick={() => setVista("palabra")}>🌟 Elige tu palabra de hoy</button>
            <button type="button" onClick={() => { setDato(LOGROS_ITEMS[Math.floor(Math.random() * LOGROS_ITEMS.length)]); setVista("dato"); sumar(); }}>💡 Un dato curioso de DCUATES</button>
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
        {vista === "reto" && (
          <div>
            {volver}
            <div className="zj-resp zj-bien"><p className="zj-bien-e">🎯</p><p><b>Tu reto de hoy</b></p><p>{retoHoy}</p>
              {retoHecho ? <p className="gn-nota">¡Reto cumplido! Vuelve mañana por otro 🌱</p> : <button type="button" onClick={cumplir}>✅ ¡Lo hice! (+1 Semilla)</button>}
            </div>
          </div>
        )}
        {vista === "hacer" && (
          <div>
            {volver}
            <p className="zj-p">Cuéntanos qué te gustaría hacer:</p>
            <div className="zj-col">
              <button type="button" onClick={() => ir("libros")}>📚 Leer o aprender algo</button>
              <button type="button" onClick={() => ir("ecatepets")}>🐾 Ayudar a quien lo necesita</button>
              <button type="button" onClick={() => ir("circulo-confianza")}>🤝 Convivir y conocer gente de confianza</button>
              <button type="button" onClick={() => ir("cupones-promos")}>🏷️ Ahorrar o vender en mi colonia</button>
            </div>
          </div>
        )}
        {vista === "dato" && dato && (
          <div>
            {volver}
            <div className="zj-resp zj-bien"><p className="zj-bien-e">💡</p><p><b>{dato.texto}</b></p>
              {dato.enlace && <button type="button" onClick={() => ir(String(dato.enlace).replace("#", ""))}>Conocer más ›</button>}
            </div>
            <div className="zj-col"><button type="button" onClick={() => { setDato(LOGROS_ITEMS[Math.floor(Math.random() * LOGROS_ITEMS.length)]); }}>🔄 Otro dato</button></div>
          </div>
        )}
        {vista === "palabra" && (
          <div>
            {volver}
            <p className="zj-p">Toca la palabra que más necesitas hoy:</p>
            <div className="zj-pal">
              {LISTA.map((p) => <button type="button" key={p[1]} className={pal === p ? "zj-on" : ""} onClick={() => { if (!pal) sumar(); setPal(p); }}><span>{p[0]}</span>{p[1]}</button>)}
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

const TARJETAS = [
  { id: "empieza", color: "#2E9E5B", emoji: "👋", t: "EMPIEZA AQUÍ", p: "Primeros pasos de 1 clic para conocernos.", b: "👋 Empezar" },
  { id: "juegos", color: "#E5484D", emoji: "🎉", t: "JUEGA Y DIVIÉRTETE", p: "9 juegos clásicos con tu tema favorito.", b: "🎮 Jugar" },
  { id: "aprende", color: "#7a5ad8", emoji: "🧠", t: "JUEGA Y APRENDE", p: "Lotería, ruleta, galleta y más para descubrir.", b: "🧠 Descubrir" },
  { id: "gana", color: "#B7791F", emoji: "🏆", t: "JUEGA Y GANA", p: "Gira, suma Semillas y gana cupones.", b: "🏆 Ganar" },
  { id: "propon", color: "#1B6F8A", emoji: "💡", t: "RECOMIENDA Y GANA", p: "Recomienda, propón o avisa y suma Semillas.", b: "💡 Participar" },
  { id: "causa", color: "#BE185D", emoji: "🛍️", t: "DONA, COMPRA Y VENDE CON CAUSA", p: "Dona, compra o ofrece algo que apoye a la comunidad.", b: "🛍️ Entrar" },
  { id: "info", color: "#C2410C", emoji: "📌", t: "INFO CLAVE", p: "🚨 Teléfonos de emergencia, agenda y más. ¡Conoce lo que hay aquí!", b: "📌 Ver" }
];

export default function ZonaJuegos({ onAbrirProyecto = () => {}, filas = [], filasZona = [], temasAprende = [], premios = [], agenda = [], menu = {} }) {
  const [abierto, setAbierto] = useState(null);
  const [semillas, setSemillas] = useState(leerSemillas());
  const juegos = useMemo(() => {
    const todos = normalizarJuegos(filas); const act = juegosActivosDesdeZona(filasZona);
    const f = act ? todos.filter((j) => act.has(j.id)) : todos; return f.length ? f : todos;
  }, [filas, filasZona]);
  const temas = useMemo(() => temasDesdeZona(temasAprende, filasZona), [temasAprende, filasZona]);
  const premiosZ = useMemo(() => { const z = premiosDesdeZona(filasZona); return z.length ? [...premios, ...z] : premios; }, [premios, filasZona]);
  const agendaZ = useMemo(() => [...agenda, ...agendaDesdeZona(filasZona)], [agenda, filasZona]);
  const telefonos = useMemo(() => { const t = telefonosDesdeZona(filasZona); return t.length ? t : null; }, [filasZona]);
  const palabras = useMemo(() => palabrasDesdeZona(filasZona), [filasZona]);
  const retos = useMemo(() => retosDesdeZona(filasZona), [filasZona]);
  const necesidades = useMemo(() => necesidadesDesdeZona(filasZona), [filasZona]);
  const niv = nivelDe(semillas);
  const falta = niv.siguiente ? niv.siguiente.min - semillas : 0;
  const cerrar = () => { setAbierto(null); setSemillas(leerSemillas()); };
  useEffect(() => { setSemillas(leerSemillas()); }, []);
  const sus = <Suspense fallback={<div className="zj-fondo"><div className="zj-caja"><p className="jg-info">Cargando…</p></div></div>}>
    {abierto === "aprende" && temas.length > 0 && <VentanaAprende temas={temas} onCerrar={cerrar} />}
    {abierto === "gana" && <VentanaGana premios={premiosZ} onCerrar={cerrar} alSumar={setSemillas} />}
    {abierto === "propon" && <VentanaPropon onCerrar={cerrar} menu={menu} onAbrirProyecto={onAbrirProyecto} alSumar={setSemillas} />}
    {abierto === "causa" && <VentanaCausa onCerrar={cerrar} necesidades={necesidades} onAbrirProyecto={onAbrirProyecto} alSumar={setSemillas} />}
    {abierto === "info" && <VentanaInfo onCerrar={cerrar} agenda={agendaZ} menu={menu} telefonos={telefonos} />}
  </Suspense>;

  return (
    <section className="zj-sec" id="zona-publica" aria-label="Zona de juegos y participación">
      <span className="zj-comp"><BotonCompartir hash="zona-publica" titulo="Zona pública de CUATES" texto="Juega, aprende, gana y participa en la comunidad" variante="circulo" /></span>
      <h2 className="zj-tit">🎮 ZONA PÚBLICA DE CUATES</h2>
      <p className="zj-sub">Juega, participa y suma Semillas 🌱</p>
      <p className="zj-nivel"><span>{niv.emoji} {niv.nombre} · {semillas} 🌱</span>{niv.siguiente ? ` · faltan ${falta} para ${niv.siguiente.nombre}` : " · ¡nivel máximo!"}</p>
      <TiraAuto intervalo={3500} etiqueta="Zona DCUATES" fondo="#fff">
        {TARJETAS.map((c) => (
          <div className="zj-w" key={c.id}>
            <article className="zj-card" style={{ borderColor: c.color }}>
              <span className="zj-ico" style={{ background: c.color }} aria-hidden="true">{c.emoji}</span>
              <h3>{c.t}</h3>
              <p>{c.p}</p>
              <button type="button" onClick={() => setAbierto(c.id)} style={{ background: c.color }}>{c.b}</button>
            </article>
          </div>
        ))}
      </TiraAuto>
      {abierto === "juegos" && createPortal(<Marco juegos={juegos} onCerrar={cerrar} onAbrirProyecto={onAbrirProyecto} alSumar={setSemillas} />, document.body)}
      {abierto === "empieza" && createPortal(<Empieza onCerrar={cerrar} onAbrirProyecto={onAbrirProyecto} alSumar={setSemillas} palabras={palabras} retos={retos} />, document.body)}
      {abierto && !["juegos", "empieza"].includes(abierto) && createPortal(sus, document.body)}
      <style>{CSS}</style>
    </section>
  );
}

const CSS = `
.zj-sec{max-width:72rem;margin:18px auto 6px;padding:14px 16px 6px;border-radius:20px;background:linear-gradient(135deg,#fff7e6,#ffeef2)}
.zj-sec{position:relative}
.zj-comp{position:absolute;top:10px;right:10px;z-index:4}
.zj-tit{margin:0 36px;font-size:20px;font-weight:900;text-align:center;color:#1f2a37}
.zj-sub{margin:2px 0 6px;text-align:center;font-size:14px;font-weight:700;color:#5b6675}
.zj-nivel{margin:0 0 8px;text-align:center;font-size:12.5px;font-weight:700;color:#5b6675}.zj-nivel span{display:inline-block;background:#fff4d6;border-radius:99px;padding:3px 10px;font-weight:900;color:#1f2a37}
.zj-w{width:158px;display:flex}
.zj-card{flex:1;display:flex;flex-direction:column;gap:3px;padding:10px;background:#fff;border:2px solid;border-radius:16px;box-shadow:0 4px 12px rgba(31,42,55,.08)}
.zj-ico{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;font-size:22px}
.zj-card h3{margin:4px 0 0;font-size:13px;font-weight:900;line-height:1.15;color:#1f2a37}
.zj-card p{margin:0;font-size:11.5px;font-weight:700;line-height:1.25;color:#5b6675}
.zj-card>button{margin-top:auto;min-height:38px;border:0;border-radius:12px;color:#fff;font-family:inherit;font-weight:900;font-size:13px;cursor:pointer}
.zj-card>p+button{margin-top:8px}
.zj-fondo{position:fixed;inset:0;z-index:75;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:inherit}
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

.jg-ctl{display:flex;justify-content:center;gap:6px;margin-top:8px}
.jg-ctl button{flex:1;max-width:60px;min-height:48px;border:0;border-radius:12px;background:#e6edf0;font-size:20px;cursor:pointer}
.jg-2048{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:6px;border-radius:12px;background:#d9cfc0;max-width:280px;margin:0 auto}
.jg-2048>div{aspect-ratio:1;border-radius:8px;background:#eee4d3;display:grid;place-items:center;font-weight:900}
.jg-gato{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:260px;margin:8px auto 0}
.jg-gato button{aspect-ratio:1;border:0;border-radius:14px;background:#e6edf0;font-size:42px;cursor:pointer;display:grid;place-items:center}
.jg-simon{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:260px;margin:6px auto 0}
.jg-simon button{aspect-ratio:1.2;border:0;border-radius:18px;font-size:40px;cursor:pointer;transition:opacity .15s,transform .15s}
.rg-oscura{background:linear-gradient(180deg,#1b1235,#2a1a4f)!important;color:#fff}
.rg-oscura .zj-cab b{background:#fff;border-radius:12px;padding:6px 10px}
.rg-et{color:#d9cdf5!important}
.rg-invita{margin:6px 2px 10px;font-size:14px;font-weight:700;line-height:1.35;color:#f3eaff}
.rg-tablero{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.rg-b{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;aspect-ratio:1/1.05;padding:3px;border:2px solid var(--k);border-radius:12px;background:rgba(255,255,255,.07);color:#fff;font-family:inherit;cursor:pointer;animation:rg-tw 2.2s ease-in-out infinite;-webkit-tap-highlight-color:transparent}
.rg-e{font-size:20px;line-height:1}
.rg-t{font-size:9.5px;font-weight:800;line-height:1.1;text-align:center;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.rg-on{background:var(--k);animation:none;transform:scale(1.1);box-shadow:0 0 14px 3px var(--k);z-index:2}
.rg-sel{background:var(--k);animation:none;transform:scale(1.08);box-shadow:0 0 18px 4px #fff;border-color:#fff;z-index:2}
@keyframes rg-tw{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 9px 1px var(--k)}}
.rg-acciones{display:flex;justify-content:center;margin:14px 0 6px}
.rg-jugar,.rg-parar{min-width:200px;min-height:54px;border:0;border-radius:99px;color:#fff;font-family:inherit;font-size:20px;font-weight:900;cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.3)}
.rg-jugar:disabled{opacity:.6}
.rg-parar{background:#e5252d;animation:rg-pulso .7s ease-in-out infinite}
@keyframes rg-pulso{50%{transform:scale(1.06)}}
.rg-res{background:#fff;color:#1f2a37;border-radius:16px;padding:12px;margin-top:8px}
.rg-pop{animation:rg-pop .4s ease-out}
@keyframes rg-pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
.rg-cierre{margin:12px 4px 0;text-align:center;font-size:14px;font-weight:800;font-style:italic;color:#ffe9a8;line-height:1.35}
.rg-ruleta-w{position:relative;max-width:270px;margin:6px auto 0}
.rg-flecha{position:absolute;top:-8px;left:50%;transform:translateX(-50%);z-index:3;font-size:26px;line-height:1;color:#ffe9a8;text-shadow:0 2px 3px rgba(0,0,0,.5)}
.rg-ruleta{display:block;width:100%;border-radius:50%;box-shadow:0 0 0 5px #fff,0 6px 16px rgba(0,0,0,.35)}
.rg-lot{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.rg-carta{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;aspect-ratio:3/4;padding:2px;border:2px solid #e8c77a;border-radius:8px;background:#fff8e6;color:#1f2a37;font-family:inherit;cursor:pointer;overflow:hidden}
.rg-carta-e{font-size:22px;line-height:1}
.rg-carta-t{font-size:8.5px;font-weight:800;line-height:1.1;text-align:center;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.rg-carta-on{border-color:#e5252d;box-shadow:0 0 0 3px #e5252d}
.rg-frijol{position:absolute;inset:0;display:grid;place-items:center;font-size:30px;background:rgba(255,255,255,.55)}
.rg-gal{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 0}
.rg-galleta{border:0;background:none;font-size:110px;line-height:1;cursor:pointer;filter:drop-shadow(0 6px 6px rgba(0,0,0,.4))}
.rg-rompe{animation:rg-rompe .9s ease-in-out}
@keyframes rg-rompe{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-10deg) scale(1.1)}80%{transform:rotate(8deg) scale(1.2)}}
.rg-papel{background:#fffbe8;color:#1f2a37;border:2px dashed #c9a227;border-radius:12px;padding:16px 14px;text-align:center;display:flex;flex-direction:column;gap:6px;width:100%}
.rg-papel span{font-size:13px;font-weight:900;color:#8a6d00}.rg-papel b{font-size:19px;font-weight:900}
.rg-oscura .jg-info{color:#e6dcff}
.ag-fecha{margin:0 0 6px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#6b7785}
.ag-vacio{margin:0;font-size:14px;font-weight:700;color:#6b7785}
.ag-ev{background:#f4f7f5;border-radius:14px;padding:10px 12px;color:#1f2a37}
.ag-ev b{font-size:16px;font-weight:900}
.ag-ev p{margin:4px 0 0;font-size:14px;font-weight:600;line-height:1.35}
.ag-ev a{display:inline-block;margin-top:8px;font-weight:900;font-size:14px;color:#1B6F8A}
.gn-area{margin-top:6px}
.gn-reels{display:flex;justify-content:center;gap:8px;margin:8px 0}
.gn-reels span{width:80px;height:80px;display:grid;place-items:center;font-size:46px;background:#fff;border:3px solid #B7791F;border-radius:16px;box-shadow:inset 0 3px 8px rgba(0,0,0,.15)}
.gn-premio{background:#fff4d6!important;text-align:center}
.gn-t{font-size:18px!important;font-weight:900!important}
.gn-nota{font-size:12.5px!important;font-weight:700!important;color:#6b7785}
.gn-mis{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.pr-form{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.pr-form>label{font-size:13px;font-weight:900;color:#4a5560;display:flex;flex-direction:column;gap:3px}
.pr-form input:not([type=checkbox]),.pr-form textarea{width:100%;padding:10px;border:2px solid #d5dcd8;border-radius:12px;font-family:inherit;font-size:16px;color:#1f2a37;background:#fff}
.pr-form textarea{min-height:96px;resize:vertical}
.pr-enviar{min-height:50px;border:0;border-radius:14px;background:#1B6F8A;color:#fff;font-family:inherit;font-size:16px;font-weight:900;cursor:pointer}
.pr-enviar:disabled{opacity:.5}
.pr-nota{margin:2px 0 0;font-size:12px;font-weight:600;color:#6b7785;line-height:1.35}
.pr-err{margin:0;font-size:13px;font-weight:800;color:#c0262d}
.pr-atajos{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}
.pr-atajos button{min-height:46px;padding:6px 8px;border:2px solid #d5dcd8;border-radius:12px;background:#fff;font-family:inherit;font-size:13px;font-weight:800;cursor:pointer;color:#1f2a37}
.in-sec{border:2px solid #e3e8e5;border-radius:14px;padding:4px 12px;margin-top:8px;background:#fff}
.in-sec>summary{min-height:46px;display:flex;align-items:center;font-size:16px;font-weight:900;cursor:pointer}
.in-tels{display:flex;flex-direction:column;gap:6px;padding-bottom:8px}
.in-tel{display:grid;grid-template-columns:34px 1fr auto;grid-template-areas:"e n t" "e i i";column-gap:8px;align-items:center;padding:8px 10px;border-radius:12px;background:#fdecec;text-decoration:none;color:#1f2a37}
.in-tel span{grid-area:e;font-size:26px}.in-tel b{grid-area:n;font-size:14.5px;font-weight:900}.in-tel i{grid-area:t;font-style:normal;font-size:18px;font-weight:900;color:#c0262d}.in-tel small{grid-area:i;font-size:12px;font-weight:600;color:#5b6675}
.in-nota{margin:4px 0 8px;font-size:12.5px;font-weight:600;color:#6b7785;line-height:1.35}
.in-btn{display:grid;place-items:center;width:100%;min-height:46px;margin:6px 0;padding:6px 10px;border:0;border-radius:12px;background:#2E9E5B;color:#fff;font-family:inherit;font-size:15px;font-weight:900;text-decoration:none;cursor:pointer}
.in-sec2{background:#1B6F8A}
.in-tips{margin:4px 0 8px;padding-left:18px;font-size:13.5px;font-weight:600;line-height:1.4}
.in-redes{display:flex;flex-wrap:wrap;gap:6px;padding-bottom:8px}
.in-redes a{flex:1 1 40%;display:grid;place-items:center;min-height:44px;border-radius:12px;background:#f1f5f2;font-weight:900;font-size:14px;color:#1f2a37;text-decoration:none}
@media(prefers-reduced-motion:reduce){.rg-b,.rg-parar,.rg-rompe{animation:none}}
`;
