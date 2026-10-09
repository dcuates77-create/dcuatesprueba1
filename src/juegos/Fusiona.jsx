// Fusiona — desliza y une números iguales (estilo 2048).
import React, { useEffect, useRef, useState } from "react";

const vacio = () => Array.from({ length: 4 }, () => Array(4).fill(0));
const COL = { 0: "#e8edf2", 2: "#fdf0c8", 4: "#fde3a1", 8: "#ffc27a", 16: "#ff9d5c", 32: "#ff7a5c", 64: "#ff5c5c", 128: "#8fd694", 256: "#5cc77b", 512: "#3fb6a8", 1024: "#4a90e2", 2048: "#7a5ad8" };

function nuevaFicha(t) {
  const libres = [];
  t.forEach((f, y) => f.forEach((v, x) => { if (!v) libres.push([x, y]); }));
  if (!libres.length) return t;
  const [x, y] = libres[Math.floor(Math.random() * libres.length)];
  const r = t.map((f) => f.slice()); r[y][x] = Math.random() < 0.9 ? 2 : 4; return r;
}
function deslizaFila(f) {
  const a = f.filter(Boolean); let pts = 0;
  for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; pts += a[i]; a.splice(i + 1, 1); }
  while (a.length < 4) a.push(0);
  return [a, pts];
}
function mueve(t, dir) { // 0 izq, 1 der, 2 arriba, 3 abajo
  let pts = 0;
  const filas = (m) => m.map((f) => { const [r, p] = deslizaFila(f); pts += p; return r; });
  let r;
  if (dir === 0) r = filas(t);
  else if (dir === 1) r = filas(t.map((f) => f.slice().reverse())).map((f) => f.reverse());
  else {
    const tr = t[0].map((_, x) => t.map((f) => f[x]));
    const m2 = dir === 2 ? filas(tr) : filas(tr.map((f) => f.slice().reverse())).map((f) => f.reverse());
    r = m2[0].map((_, y) => m2.map((f) => f[y]));
  }
  const igual = r.every((f, y) => f.every((v, x) => v === t[y][x]));
  return { r, pts, igual };
}

export default function Fusiona({ ctx, onFin }) {
  const [t, setT] = useState(() => nuevaFicha(nuevaFicha(vacio())));
  const [pts, setPts] = useState(0);
  const fin = useRef(false);
  const toque = useRef(null);

  const jugar = (dir) => {
    if (fin.current) return;
    const { r, pts: p, igual } = mueve(t, dir);
    if (igual) return;
    const n = nuevaFicha(r);
    setT(n); setPts((v) => v + p);
    const sinMov = [0, 1, 2, 3].every((d) => mueve(n, d).igual);
    if (sinMov) {
      fin.current = true;
      const mayor = Math.max(...n.flat());
      setTimeout(() => onFin(Math.round(Math.log2(mayor) * 2), `Tu ficha mayor fue ${mayor}.`), 600);
    }
  };
  useEffect(() => {
    const tecla = (e) => { const d = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key]; if (d !== undefined) { e.preventDefault(); jugar(d); } };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  });
  const ini = (e) => { const p = e.touches ? e.touches[0] : e; toque.current = [p.clientX, p.clientY]; };
  const soltar = (e) => {
    if (!toque.current) return;
    const p = e.changedTouches ? e.changedTouches[0] : e;
    const dx = p.clientX - toque.current[0], dy = p.clientY - toque.current[1]; toque.current = null;
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return;
    if (Math.abs(dx) > Math.abs(dy)) jugar(dx > 0 ? 1 : 0); else jugar(dy > 0 ? 3 : 2);
  };
  return (
    <div>
      <p className="jg-info">Puntos: <b>{pts}</b> · desliza para unir números iguales {ctx.heroe}</p>
      <div className="jg-2048" onTouchStart={ini} onTouchEnd={soltar} onMouseDown={ini} onMouseUp={soltar} style={{ touchAction: "none" }}>
        {t.flat().map((v, i) => <div key={i} style={{ background: COL[v] || "#7a5ad8", color: v > 4 ? "#fff" : "#5b4a1f", fontSize: v >= 1024 ? 18 : v >= 128 ? 22 : 28 }}>{v || ""}</div>)}
      </div>
      <div className="jg-pad">
        <button type="button" onClick={() => jugar(2)} aria-label="Arriba">▲</button>
        <div><button type="button" onClick={() => jugar(0)} aria-label="Izquierda">◀</button><button type="button" onClick={() => jugar(1)} aria-label="Derecha">▶</button></div>
        <button type="button" onClick={() => jugar(3)} aria-label="Abajo">▼</button>
      </div>
    </div>
  );
}
