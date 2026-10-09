// Gato — tres en raya contra la computadora.
import React, { useEffect, useRef, useState } from "react";

const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const ganador = (t) => { for (const [a, b, c] of LINEAS) if (t[a] && t[a] === t[b] && t[a] === t[c]) return t[a]; return t.every(Boolean) ? "empate" : null; };
function jugadaCompu(t) {
  const libres = t.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
  const prueba = (mark) => libres.find((i) => { const c = t.slice(); c[i] = mark; return ganador(c) === mark; });
  const w = prueba("O"); if (w !== undefined) return w;
  const b = prueba("X"); if (b !== undefined) return b;
  if (!t[4]) return 4;
  const esq = [0, 2, 6, 8].filter((i) => !t[i]); if (esq.length && Math.random() < 0.7) return esq[Math.floor(Math.random() * esq.length)];
  return libres[Math.floor(Math.random() * libres.length)];
}
export default function Gato({ ctx, onFin }) {
  const [t, setT] = useState(Array(9).fill(null));
  const [turno, setTurno] = useState("X");
  const cierre = useRef(false);
  const fin = (g) => {
    if (cierre.current) return; cierre.current = true;
    setTimeout(() => (g === "X" ? onFin(12, "¡Ganaste!") : g === "empate" ? onFin(6, "Empate. ¡Buen partido!") : onFin(2, "Ganó la computadora. ¡Revancha!")), 700);
  };
  const tocar = (i) => {
    if (t[i] || turno !== "X" || cierre.current) return;
    const n = t.slice(); n[i] = "X"; setT(n);
    const g = ganador(n); if (g) return fin(g);
    setTurno("O");
    setTimeout(() => {
      const m = n.slice(); m[jugadaCompu(n)] = "O"; setT(m);
      const g2 = ganador(m); if (g2) return fin(g2);
      setTurno("X");
    }, 550);
  };
  useEffect(() => () => { cierre.current = true; }, []);
  return (
    <div>
      <p className="jg-info">Tú {ctx.buenos[0]} contra la compu {ctx.malo} · alinea 3</p>
      <div className="jg-gato">
        {t.map((v, i) => <button type="button" key={i} onClick={() => tocar(i)} aria-label={v ? (v === "X" ? "Tuya" : "Compu") : "Casilla libre"}>{v === "X" ? ctx.buenos[0] : v === "O" ? ctx.malo : ""}</button>)}
      </div>
    </div>
  );
}
