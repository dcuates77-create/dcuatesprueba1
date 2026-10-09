import React, { useRef, useState } from "react";

// Tablero de 5x5 (25 casillas). Escaleras suben, serpientes bajan.
const ESCALERAS = { 3: 11, 6: 17, 9: 20 };
const SERPIENTES = { 14: 5, 19: 8, 23: 12 };
const MENSAJES = { 3: "¡Confianza! Subes 🪜", 6: "¡Amistad! Subes 🪜", 9: "¡Solidaridad! Subes 🪜", 14: "Un descuido… bajas 🐍", 19: "Prisa… bajas 🐍", 23: "Falta de diálogo… bajas 🐍" };

export default function Escaleras({ ctx, onFin }) {
  const [yo, setYo] = useState(1);
  const [cpu, setCpu] = useState(1);
  const [dado, setDado] = useState(null);
  const [msg, setMsg] = useState("Toca el dado para empezar.");
  const [turno, setTurno] = useState("yo");
  const [fin, setFin] = useState(false);
  const bloqueo = useRef(false);

  const mover = (pos, d) => {
    let p = Math.min(25, pos + d);
    let nota = "";
    if (ESCALERAS[p]) { nota = MENSAJES[p]; p = ESCALERAS[p]; } else if (SERPIENTES[p]) { nota = MENSAJES[p]; p = SERPIENTES[p]; }
    return [p, nota];
  };
  const tirar = () => {
    if (bloqueo.current || fin) return;
    bloqueo.current = true;
    const d = 1 + Math.floor(Math.random() * 6);
    setDado(d);
    const [p, nota] = mover(yo, d);
    setYo(p); setMsg(`Sacaste ${d}. ${nota}`);
    if (p >= 25) { setFin(true); setTimeout(() => onFin(15, "¡Llegaste a la meta primero! 🏁"), 700); return; }
    setTurno("cpu");
    setTimeout(() => {
      const d2 = 1 + Math.floor(Math.random() * 6);
      const [p2, n2] = mover(cpu, d2);
      setCpu(p2); setDado(d2); setMsg(`La computadora sacó ${d2}. ${n2}`);
      if (p2 >= 25) { setFin(true); setTimeout(() => onFin(5, "Esta vez ganó la computadora. ¡Revancha!"), 700); return; }
      setTurno("yo"); bloqueo.current = false;
    }, 1100);
  };
  // casillas en zigzag, de abajo hacia arriba
  const casillas = [];
  for (let f = 4; f >= 0; f--) {
    const fila = [];
    for (let c = 0; c < 5; c++) fila.push(f % 2 === 0 ? f * 5 + c + 1 : f * 5 + (4 - c) + 1);
    casillas.push(...fila);
  }
  return (
    <div>
      <p className="jg-info">Tú {ctx.heroe} contra la compu 🤖 · sube con 🪜, cuidado con 🐍</p>
      <div className="jg-tab">
        {casillas.map((n) => (
          <div key={n} className={"jg-cas" + (ESCALERAS[n] ? " jg-esc" : "") + (SERPIENTES[n] ? " jg-ser" : "") + (n === 25 ? " jg-meta" : "")}>
            <small>{n === 25 ? "🏁" : n}</small>
            <span>{ESCALERAS[n] ? "🪜" : SERPIENTES[n] ? "🐍" : ""}</span>
            <b>{yo === n ? ctx.heroe : ""}{cpu === n ? "🤖" : ""}</b>
          </div>
        ))}
      </div>
      <p className="jg-msg" aria-live="polite">{msg}</p>
      <button type="button" className="jg-dado" onClick={tirar} disabled={turno !== "yo" || fin}>🎲 {dado ? dado : "Tirar"}</button>
    </div>
  );
}
