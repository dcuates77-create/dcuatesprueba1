// Bloques DCUATES — acomoda piezas que caen y completa líneas.
import React, { useEffect, useRef, useState } from "react";

const C = 10, R = 16;
const PIEZAS = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]]
];
const COLORES = ["#00A3FF", "#FFC400", "#7A5AD8", "#FF8A00", "#2E6FE0", "#2E9E5B", "#E5484D"];
const rotar = (m) => m[0].map((_, i) => m.map((f) => f[i]).reverse());
const rr = (g, ...a) => (g.roundRect ? g.roundRect(...a) : g.rect(a[0], a[1], a[2], a[3]));

export default function Bloques({ ctx, onFin }) {
  const cv = useRef(null);
  const [lineas, setLineas] = useState(0);
  const acc = useRef({});

  useEffect(() => {
    const c = cv.current, g = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth, T = W / C, H = T * R;
    c.width = W * dpr; c.height = H * dpr; c.style.height = H + "px"; g.scale(dpr, dpr);
    const s = { tab: Array.from({ length: R }, () => Array(C).fill(0)), p: null, x: 0, y: 0, k: 0, lineas: 0, piezas: 0, vivo: true, t0: 0 };
    const nueva = () => {
      const k = Math.floor(Math.random() * PIEZAS.length);
      s.p = PIEZAS[k]; s.k = k + 1; s.x = Math.floor((C - s.p[0].length) / 2); s.y = 0; s.piezas++;
      if (choca(s.p, s.x, s.y)) fin();
    };
    const choca = (p, x, y) => p.some((f, j) => f.some((v, i) => v && (x + i < 0 || x + i >= C || y + j >= R || (y + j >= 0 && s.tab[y + j][x + i]))));
    const fijar = () => {
      s.p.forEach((f, j) => f.forEach((v, i) => { if (v && s.y + j >= 0) s.tab[s.y + j][s.x + i] = s.k; }));
      let n = 0;
      for (let j = R - 1; j >= 0; j--) if (s.tab[j].every(Boolean)) { s.tab.splice(j, 1); s.tab.unshift(Array(C).fill(0)); n++; j++; }
      if (n) { s.lineas += n; setLineas(s.lineas); }
      nueva();
    };
    const fin = () => { if (!s.vivo) return; s.vivo = false; onFin(s.lineas * 4 + Math.floor(s.piezas / 5), `Completaste ${s.lineas} línea${s.lineas === 1 ? "" : "s"}.`); };
    const mover = (dx) => { if (s.vivo && !choca(s.p, s.x + dx, s.y)) s.x += dx; };
    const girar = () => { if (!s.vivo) return; const r = rotar(s.p); for (const d of [0, -1, 1, -2, 2]) if (!choca(r, s.x + d, s.y)) { s.p = r; s.x += d; return; } };
    const bajar = () => { if (!s.vivo) return; if (!choca(s.p, s.x, s.y + 1)) s.y++; else fijar(); };
    const caer = () => { if (!s.vivo) return; while (!choca(s.p, s.x, s.y + 1)) s.y++; fijar(); };
    acc.current = { mover, girar, bajar, caer };
    nueva();
    const celda = (x, y, k, a = 1) => { g.globalAlpha = a; g.fillStyle = COLORES[k - 1]; g.beginPath(); rr(g, x * T + 1, y * T + 1, T - 2, T - 2, 4); g.fill(); g.globalAlpha = 1; };
    let raf = 0, ult = performance.now(), acum = 0;
    const bucle = (t) => {
      if (!s.vivo) return;
      acum += t - ult; ult = t;
      const vel = Math.max(120, 650 - s.lineas * 25);
      if (acum > vel) { acum = 0; bajar(); }
      g.fillStyle = "#f4f7fb"; g.fillRect(0, 0, W, H);
      g.strokeStyle = "#e3e9f0"; g.lineWidth = 1;
      for (let i = 1; i < C; i++) { g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, H); g.stroke(); }
      for (let j = 1; j < R; j++) { g.beginPath(); g.moveTo(0, j * T); g.lineTo(W, j * T); g.stroke(); }
      s.tab.forEach((f, j) => f.forEach((v, i) => v && celda(i, j, v)));
      if (s.p) {
        let sy = s.y; while (!choca(s.p, s.x, sy + 1)) sy++;
        s.p.forEach((f, j) => f.forEach((v, i) => v && celda(s.x + i, sy + j, s.k, 0.18)));
        s.p.forEach((f, j) => f.forEach((v, i) => v && celda(s.x + i, s.y + j, s.k)));
      }
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);
    const tecla = (e) => {
      const m = { ArrowLeft: () => mover(-1), ArrowRight: () => mover(1), ArrowDown: bajar, ArrowUp: girar, " ": caer }[e.key];
      if (m) { e.preventDefault(); m(); }
    };
    window.addEventListener("keydown", tecla);
    return () => { s.vivo = false; cancelAnimationFrame(raf); window.removeEventListener("keydown", tecla); };
  }, [ctx, onFin]);

  const a = (k) => () => acc.current[k] && acc.current[k]();
  return (
    <div>
      <p className="jg-info">Líneas: <b>{lineas}</b> · acomoda las piezas</p>
      <canvas ref={cv} className="jg-cv" style={{ maxWidth: 230, margin: "0 auto", touchAction: "none" }} onPointerDown={() => {}} />
      <div className="jg-ctl">
        <button type="button" onClick={() => acc.current.mover(-1)} aria-label="Izquierda">◀</button>
        <button type="button" onClick={a("girar")} aria-label="Girar">⟳</button>
        <button type="button" onClick={() => acc.current.mover(1)} aria-label="Derecha">▶</button>
        <button type="button" onClick={a("bajar")} aria-label="Bajar">▼</button>
        <button type="button" onClick={a("caer")} aria-label="Caer de golpe">⤓</button>
      </div>
    </div>
  );
}
