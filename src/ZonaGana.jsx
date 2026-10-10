// JUEGA Y GANA — ruleta y tragamonedas con premios de aliados, Semillas y retos.
// 3 giros al día (guardados en el celular). Los cupones ganados se guardan en "Mis premios".
import BotonCompartir from "./BotonCompartir.jsx";
import { SiguientePaso } from "./ZonaPaso.jsx";
import React, { useEffect, useRef, useState } from "react";
import { GIROS_POR_DIA } from "./datos/zona.js";
import { sumarSemillas } from "./datos/juegos.js";

const hoy = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const leerGiros = () => { try { const [d, n] = (localStorage.getItem("dc_giros") || "").split("|"); return d === hoy() ? parseInt(n, 10) || 0 : 0; } catch { return 0; } };
const guardarGiros = (n) => { try { localStorage.setItem("dc_giros", `${hoy()}|${n}`); } catch { /* nada */ } };
const leerPremios = () => { try { return JSON.parse(localStorage.getItem("dc_premios") || "[]"); } catch { return []; } };
const guardarPremio = (p) => { try { localStorage.setItem("dc_premios", JSON.stringify([{ ...p, fecha: hoy() }, ...leerPremios()].slice(0, 12))); } catch { /* nada */ } };
const COLORES = ["#FF4D6D", "#FFC400", "#00C2A8", "#7A5AD8", "#FF8A00", "#00A3FF", "#7ED321", "#E040FB"];
const SIMBOLOS = { cupon: "🏷️", semillas: "🌱", frase: "💛", reto: "⭐" };
const OTROS = ["🎁", "🍀", "🔔", "🌟"];

function elegirPremio(premios) {
  // Más peso a Semillas, frase y reto; los cupones salen menos para que valgan.
  const pesos = premios.map((p) => (p.tipo === "cupon" ? 1 : 1.6));
  let r = Math.random() * pesos.reduce((a, b) => a + b, 0);
  for (let i = 0; i < premios.length; i++) { r -= pesos[i]; if (r <= 0) return i; }
  return 0;
}

export default function ZonaGana({ premios, onCerrar, alSumar }) {
  const [modo, setModo] = useState("ruleta");
  const [giros, setGiros] = useState(leerGiros());
  const [premio, setPremio] = useState(null);
  const [gira, setGira] = useState(false);
  const [rot, setRot] = useState(0);
  const [rod, setRod] = useState(["🎁", "🎁", "🎁"]);
  const [mis, setMis] = useState(leerPremios());
  const tm = useRef([]);
  useEffect(() => () => tm.current.forEach(clearTimeout), []);
  const quedan = Math.max(0, GIROS_POR_DIA - giros);
  const sectores = premios.slice(0, 8);
  const N = sectores.length, A = 360 / N, R = 130;

  const cobrar = (i) => {
    const p = premios[i];
    const n = giros + 1; setGiros(n); guardarGiros(n);
    if (p.tipo === "semillas") { const t = sumarSemillas(p.n || 1); alSumar && alSumar(t); }
    else { const t = sumarSemillas(1); alSumar && alSumar(t); }
    if (p.tipo === "cupon") { guardarPremio({ titulo: p.titulo, info: p.info }); setMis(leerPremios()); }
    setPremio(p); setGira(false);
  };
  const girarRuleta = () => {
    if (gira || quedan <= 0) return;
    setPremio(null); setGira(true);
    // la ruleta muestra los primeros 8 premios; si sale otro, se anima hacia un sector cualquiera y se entrega el sorteado
    const i = elegirPremio(premios);
    const sector = i < N ? i : Math.floor(Math.random() * N);
    setRot((r) => r - (r % 360) + 360 * 5 + (360 - (sector * A + A / 2)));
    tm.current.push(setTimeout(() => cobrar(i), 4300));
  };
  const girarTragamonedas = () => {
    if (gira || quedan <= 0) return;
    setPremio(null); setGira(true);
    const i = elegirPremio(premios), p = premios[i];
    const s = SIMBOLOS[p.tipo];
    const final = p.tipo === "cupon" ? [s, s, s] : [s, s, OTROS[Math.floor(Math.random() * OTROS.length)]];
    const todos = ["🏷️", "🌱", "💛", "⭐", "🎁", "🍀"];
    [0, 1, 2].forEach((k) => {
      const t0 = 900 + k * 700;
      for (let t = 0; t < t0; t += 90) tm.current.push(setTimeout(() => setRod((r) => r.map((v, j) => (j === k ? todos[Math.floor(Math.random() * todos.length)] : v))), t));
      tm.current.push(setTimeout(() => setRod((r) => r.map((v, j) => (j === k ? final[k] : v))), t0));
    });
    tm.current.push(setTimeout(() => cobrar(i), 900 + 2 * 700 + 300));
  };
  const punto = (ang, rad) => [R + rad * Math.sin((ang * Math.PI) / 180), R - rad * Math.cos((ang * Math.PI) / 180)];

  return (
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Juega y gana" onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🏆 Juega y gana</b><span className="zj-sem">🎟️ {quedan}/{GIROS_POR_DIA}</span><button type="button" className="zj-x" onClick={onCerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Tienes <b>{GIROS_POR_DIA} giros al día</b>. Gana cupones de negocios aliados, Semillas 🌱, mensajes y retos amables.</p>

        {modo !== "mis" && (
          <div className="gn-area">
            {modo === "ruleta" ? (
              <div className="rg-ruleta-w">
                <div className="rg-flecha">▼</div>
                <svg viewBox={`0 0 ${R * 2} ${R * 2}`} className="rg-ruleta" style={{ transform: `rotate(${rot}deg)`, transition: gira ? "transform 4.2s cubic-bezier(.12,.7,.15,1)" : "none" }} role="img" aria-label="Ruleta de premios">
                  {sectores.map((d, i) => {
                    const [x1, y1] = punto(i * A, R), [x2, y2] = punto((i + 1) * A, R), [tx, ty] = punto(i * A + A / 2, R * 0.7);
                    return (
                      <g key={i}>
                        <path d={`M${R} ${R} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} Z`} fill={COLORES[i % COLORES.length]} stroke="#fff" strokeWidth="2" />
                        <text x={tx} y={ty} fontSize="24" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${i * A + A / 2} ${tx} ${ty})`}>{d.emoji}</text>
                      </g>
                    );
                  })}
                  <circle cx={R} cy={R} r="18" fill="#fff" stroke="#1f2a37" strokeWidth="3" />
                </svg>
              </div>
            ) : (
              <div className="gn-reels">{rod.map((v, k) => <span key={k}>{v}</span>)}</div>
            )}
            <div className="rg-acciones">
              <button type="button" className="rg-jugar" disabled={gira || quedan <= 0} onClick={modo === "ruleta" ? girarRuleta : girarTragamonedas} style={{ background: "#E5484D" }}>
                {quedan <= 0 ? "Vuelve mañana 🌅" : gira ? "Girando…" : modo === "ruleta" ? "🎡 ¡GIRAR!" : "🎰 ¡JALAR!"}
              </button>
            </div>
            {quedan <= 0 && !premio && <p className="jg-info">Ya usaste tus giros de hoy. ¡Juega en “Juega y diviértete” para sumar más Semillas!</p>}
            {premio && (
              <div className="zj-resp gn-premio">
                <p className="gn-t">{premio.emoji} ¡{premio.tipo === "cupon" ? "Ganaste un cupón" : premio.tipo === "semillas" ? "Ganaste Semillas" : premio.tipo === "reto" ? "Te toca un reto" : "Un mensaje para ti"}!</p>
                <p><b>{premio.titulo}</b></p>
                {premio.info && <p>{premio.info}</p>}
                {premio.tipo === "cupon" && <p className="gn-nota">Guardado en “Mis premios”. Muéstralo en el negocio aliado. ¡Compártelo con quien quieras: entre más lo usen, mejor para el negocio!</p>}
                {premio.tipo === "cupon" && <BotonCompartir hash="zona-publica" titulo={`Cupón: ${premio.titulo}`} texto="Gánalo tú también jugando en DCUATES" variante="pastilla" etiqueta="Compartir cupón" />}
                {premio.enlace && <a href={premio.enlace} target="_blank" rel="noopener noreferrer">Abrir ›</a>}
              </div>
            )}
          </div>
        )}

        {modo === "mis" && (
          <div className="gn-mis">
            {mis.length === 0 && <p className="ag-vacio">Aún no tienes cupones guardados. ¡Gira la ruleta!</p>}
            {mis.map((m, i) => <div className="ag-ev" key={i}><b>🏷️ {m.titulo}</b>{m.info && <p>{m.info}</p>}<p className="gn-nota">Ganado el {m.fecha}</p><BotonCompartir hash="zona-publica" titulo={`Cupón: ${m.titulo}`} texto="Gánalo tú también jugando en DCUATES" variante="pastilla" etiqueta="Compartir" /></div>)}
          </div>
        )}

        <p className="zj-et">¿Cómo quieres ganar?</p>
        <div className="zj-chips">
          {[["ruleta", "🎡", "Ruleta"], ["tragamonedas", "🎰", "Tragamonedas"], ["mis", "🎒", `Mis premios (${mis.length})`]].map(([id, e, n]) => (
            <button type="button" key={id} className={"zj-chip" + (modo === id ? " zj-on" : "")} onClick={() => { setModo(id); setPremio(null); }} aria-pressed={modo === id}><span>{e}</span>{n}</button>
          ))}
        </div>
        <p className="zj-rec">Participar es gratis. Los premios los aportan negocios aliados y patrocinadores; esto no es un sorteo.</p>
        <SiguientePaso actual="gana" />
      </div>
    </div>
  );
}
