// JUEGA Y APRENDE / DESCUBRE — 4 temas (Música, Pelis, Páginas, Libros) x 4 juegos
// (Tablero luminoso, Ruleta, Lotería, Galleta de la suerte). Mismo contenido, distinto juego.
import React, { useEffect, useRef, useState } from "react";
import { FRASE_REGALOS } from "./datos/regalos.js";
import { guardarPref, leerPref, sumarSemillas } from "./datos/juegos.js";

const COLORES = ["#FF4D6D", "#FF8A00", "#FFC400", "#7ED321", "#00C2A8", "#00A3FF", "#7A5AD8", "#E040FB", "#FF6B6B", "#FFB300"];
const TIPOS = [
  { id: "tablero", emoji: "🎰", nombre: "Tablero" },
  { id: "ruleta", emoji: "🎡", nombre: "Ruleta" },
  { id: "loteria", emoji: "🃏", nombre: "Lotería" },
  { id: "galleta", emoji: "🥠", nombre: "Galleta" }
];

function Tablero({ tema, alElegir, elegido }) {
  const N = tema.items.length;
  const [luz, setLuz] = useState(-1);
  const [fase, setFase] = useState("reposo");
  const luzRef = useRef(-1);
  const timer = useRef(null);
  const poner = (i) => { luzRef.current = i; setLuz(i); };
  useEffect(() => () => clearTimeout(timer.current), []);
  const paso = (l) => (tema.modo === "azar" ? (l + 1 + Math.floor(Math.random() * (N - 1))) % N : tema.modo === "reversa" ? (l - 1 + N) % N : (l + 1) % N);
  const jugar = () => {
    setFase("corre");
    const ciclo = () => { poner(paso(luzRef.current < 0 ? 0 : luzRef.current)); timer.current = setTimeout(ciclo, 85); };
    ciclo();
  };
  const frenar = () => {
    clearTimeout(timer.current); setFase("frena");
    const total = 13 + Math.floor(Math.random() * 7);
    const ruta = []; let l = luzRef.current < 0 ? 0 : luzRef.current;
    for (let i = 0; i < total; i++) { l = paso(l); ruta.push(l); }
    let i = 0;
    const ciclo = () => {
      poner(ruta[i]); i++;
      if (i >= ruta.length) { setFase("reposo"); alElegir(ruta[ruta.length - 1]); return; }
      timer.current = setTimeout(ciclo, 90 + Math.pow(i / total, 2.2) * 420);
    };
    ciclo();
  };
  return (
    <div>
      <div className="rg-tablero">
        {tema.items.map((d, i) => (
          <button type="button" key={i} onClick={() => { clearTimeout(timer.current); setFase("reposo"); poner(i); alElegir(i); }}
            className={"rg-b" + (luz === i ? " rg-on" : "") + (elegido === i ? " rg-sel" : "")}
            style={{ "--k": COLORES[i % COLORES.length], animationDelay: (i % 10) * 0.18 + "s" }} aria-label={d.titulo}>
            <span className="rg-e">{d.emoji}</span><span className="rg-t">{d.titulo}</span>
          </button>
        ))}
      </div>
      <div className="rg-acciones">
        {fase === "corre"
          ? <button type="button" className="rg-parar" onClick={frenar}>✋ PARAR</button>
          : <button type="button" className="rg-jugar" onClick={jugar} disabled={fase === "frena"} style={{ background: tema.color }}>🎲 ¡JUGAR!</button>}
      </div>
    </div>
  );
}

function Ruleta({ tema, alElegir }) {
  const N = tema.items.length, A = 360 / N;
  const [rot, setRot] = useState(0);
  const [gira, setGira] = useState(false);
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const girar = () => {
    if (gira) return;
    const i = Math.floor(Math.random() * N);
    const centro = i * A + A / 2;
    setGira(true);
    setRot((r) => r - (r % 360) + 360 * 5 + (360 - centro));
    tm.current = setTimeout(() => { setGira(false); alElegir(i); }, 4300);
  };
  const R = 130;
  const punto = (ang, rad) => [R + rad * Math.sin((ang * Math.PI) / 180), R - rad * Math.cos((ang * Math.PI) / 180)];
  return (
    <div className="rg-ruleta-w">
      <div className="rg-flecha">▼</div>
      <svg viewBox={`0 0 ${R * 2} ${R * 2}`} className="rg-ruleta" style={{ transform: `rotate(${rot}deg)`, transition: gira ? "transform 4.2s cubic-bezier(.12,.7,.15,1)" : "none" }} role="img" aria-label={`Ruleta de ${tema.nombre}`}>
        {tema.items.map((d, i) => {
          const [x1, y1] = punto(i * A, R), [x2, y2] = punto((i + 1) * A, R);
          const [tx, ty] = punto(i * A + A / 2, R * 0.82);
          return (
            <g key={i}>
              <path d={`M${R} ${R} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} Z`} fill={COLORES[i % COLORES.length]} stroke="#fff" strokeWidth="1.5" />
              <text x={tx} y={ty} fontSize="17" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${i * A + A / 2} ${tx} ${ty})`}>{d.emoji}</text>
            </g>
          );
        })}
        <circle cx={R} cy={R} r="18" fill="#fff" stroke="#1f2a37" strokeWidth="3" />
      </svg>
      <div className="rg-acciones"><button type="button" className="rg-jugar" onClick={girar} disabled={gira} style={{ background: tema.color }}>🎡 {gira ? "Girando…" : "¡GIRAR!"}</button></div>
    </div>
  );
}

function Loteria({ tema, alElegir, elegido }) {
  const N = tema.items.length;
  const [salidas, setSalidas] = useState([]);
  const cantar = () => {
    const libres = tema.items.map((_, i) => i).filter((i) => !salidas.includes(i));
    if (!libres.length) { setSalidas([]); return; }
    const i = libres[Math.floor(Math.random() * libres.length)];
    setSalidas((s) => [...s, i]); alElegir(i);
  };
  const completa = salidas.length === N;
  return (
    <div>
      <div className="rg-lot">
        {tema.items.map((d, i) => (
          <button type="button" key={i} className={"rg-carta" + (elegido === i ? " rg-carta-on" : "")} onClick={() => { if (!salidas.includes(i)) setSalidas((s) => [...s, i]); alElegir(i); }} aria-label={d.titulo}>
            <span className="rg-carta-e">{d.emoji}</span><span className="rg-carta-t">{d.titulo}</span>
            {salidas.includes(i) && <span className="rg-frijol" aria-hidden="true">🫘</span>}
          </button>
        ))}
      </div>
      <div className="rg-acciones"><button type="button" className="rg-jugar" onClick={cantar} style={{ background: tema.color }}>{completa ? "🎉 ¡LOTERÍA! Jugar de nuevo" : "🔔 Cantar carta"}</button></div>
      <p className="jg-info">Cartas marcadas: {salidas.length} de {N}</p>
    </div>
  );
}

function Galleta({ tema, alElegir, elegido }) {
  const [fase, setFase] = useState("cerrada");
  const tm = useRef(null);
  useEffect(() => () => clearTimeout(tm.current), []);
  const romper = () => {
    if (fase === "rompiendo") return;
    setFase("rompiendo");
    tm.current = setTimeout(() => { setFase("abierta"); alElegir(Math.floor(Math.random() * tema.items.length)); }, 900);
  };
  const it = elegido != null ? tema.items[elegido] : null;
  return (
    <div className="rg-gal">
      {fase !== "abierta" && <button type="button" className={"rg-galleta" + (fase === "rompiendo" ? " rg-rompe" : "")} onClick={romper} aria-label="Romper la galleta">🥠</button>}
      {fase !== "abierta" && <p className="jg-info">{fase === "rompiendo" ? "…" : "Toca la galleta para descubrir tu suerte"}</p>}
      {fase === "abierta" && it && (
        <div className="rg-papel rg-pop"><span>🍀 Tu suerte de hoy</span><b>{it.emoji} {it.titulo}</b></div>
      )}
      {fase === "abierta" && <div className="rg-acciones"><button type="button" className="rg-jugar" onClick={() => setFase("cerrada")} style={{ background: tema.color }}>🥠 Otra galleta</button></div>}
    </div>
  );
}

export default function ZonaAprende({ temas, onCerrar }) {
  const [temaId, setTemaId] = useState(() => { const t = leerPref("aprende_tema", "musica"); return temas.some((x) => x.id === t) ? t : temas[0].id; });
  const [tipo, setTipo] = useState(() => leerPref("aprende_tipo", "tablero"));
  const [elegido, setElegido] = useState(null);
  const [vistos, setVistos] = useState(0);
  const tema = temas.find((t) => t.id === temaId) || temas[0];
  const info = useRef(null);
  const elegir = (i) => {
    setElegido(i); setVistos((v) => v + 1);
    if (vistos % 3 === 0) sumarSemillas(1);
    setTimeout(() => info.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
  };
  const cambiaTema = (id) => { setTemaId(id); guardarPref("aprende_tema", id); setElegido(null); };
  const cambiaTipo = (id) => { setTipo(id); guardarPref("aprende_tipo", id); setElegido(null); };
  const it = elegido != null ? tema.items[elegido] : null;
  const Juego = { tablero: Tablero, ruleta: Ruleta, loteria: Loteria, galleta: Galleta }[tipo];

  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Juega y aprende" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja rg-oscura">
        <div className="zj-cab">
          <b style={{ color: tema.color }}>🧠 Juega y aprende</b>
          <button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <p className="rg-invita">🎁 ¡Juega y descubre! Elige un tema y un juego. Toca para ver qué recomienda la comunidad.</p>
        <Juego key={`${tema.id}-${tipo}`} tema={tema} alElegir={elegir} elegido={elegido} />
        <div className="rg-res" ref={info}>
          <p className="ag-fecha">Tu descubrimiento de {tema.nombre.toLowerCase().replace(" dcuates", "")}</p>
          {!it && <p className="ag-vacio">Aún no eliges ninguno. ¡Anímate a jugar!</p>}
          {it && (
            <div className="ag-ev rg-pop" key={elegido}>
              <b>{it.emoji} {it.titulo}</b>
              {it.info && <p>{it.info}</p>}
              {it.enlace && <a href={it.enlace} target="_blank" rel="noopener noreferrer">Abrir ›</a>}
            </div>
          )}
        </div>
        <p className="zj-et rg-et">¿Cómo quieres jugar?</p>
        <div className="zj-chips">
          {TIPOS.map((t) => <button type="button" key={t.id} className={"zj-chip" + (t.id === tipo ? " zj-on" : "")} onClick={() => cambiaTipo(t.id)} aria-pressed={t.id === tipo}><span>{t.emoji}</span>{t.nombre}</button>)}
        </div>
        <p className="zj-et rg-et">¿De qué quieres descubrir?</p>
        <div className="zj-chips">
          {temas.map((t) => <button type="button" key={t.id} className={"zj-chip" + (t.id === temaId ? " zj-on" : "")} style={t.id === temaId ? { background: t.color, borderColor: t.color, color: "#fff" } : { borderColor: t.color }} onClick={() => cambiaTema(t.id)} aria-pressed={t.id === temaId}><span>{t.emoji}</span>{t.nombre.replace(" DCUATES", "")}</button>)}
        </div>
        <p className="rg-cierre">{FRASE_REGALOS}</p>
      </div>
    </div>
  );
}
