// Come-tacos — laberinto: come todo lo que puedas y esquiva las alertas.
import React, { useEffect, useRef, useState } from "react";

const MAPA = [
  "###############",
  "#o.....#.....o#",
  "#.##.#.#.#.##.#",
  "#.............#",
  "#.##.#####.##.#",
  "#....#...#....#",
  "####.#...#.####",
  "#....G.G.G....#",
  "####.#...#.####",
  "#....#...#....#",
  "#.##.#####.##.#",
  "#......P......#",
  "#.##.#.#.#.##.#",
  "#o....###....o#",
  "###############"
];
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export default function ComeTacos({ ctx, onFin }) {
  const cv = useRef(null);
  const [pts, setPts] = useState(0);
  const [vidas, setVidas] = useState(3);
  const acc = useRef({});
  const toque = useRef(null);

  useEffect(() => {
    const c = cv.current, g = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const N = MAPA.length, W = c.clientWidth, T = W / N;
    c.width = W * dpr; c.height = W * dpr; c.style.height = W + "px"; g.scale(dpr, dpr);
    const m = MAPA.map((f) => f.split("").map((ch) => (ch === "#" ? 1 : ch === "." ? 2 : ch === "o" ? 3 : 0)));
    let total = 0; m.forEach((f) => f.forEach((v) => { if (v >= 2) total++; }));
    const inicio = []; const ini = { p: null };
    MAPA.forEach((f, y) => f.split("").forEach((ch, x) => { if (ch === "P") ini.p = [x, y]; if (ch === "G") inicio.push([x, y]); }));
    const s = { p: [...ini.p], dir: [0, 0], sig: [0, 0], g: inicio.map((q) => ({ x: q[0], y: q[1], d: [0, -1] })), pts: 0, comidos: 0, vidas: 3, susto: 0, vivo: true, t: 0 };
    const libre = (x, y) => y >= 0 && y < N && x >= 0 && x < N && m[y][x] !== 1;
    const girar = (dx, dy) => { s.sig = [dx, dy]; };
    acc.current = { girar };
    const perder = () => {
      s.vidas--; setVidas(s.vidas);
      if (s.vidas <= 0) { s.vivo = false; onFin(s.pts, `Comiste ${s.comidos}. ¡Sigue intentando!`); return; }
      s.p = [...ini.p]; s.dir = [0, 0]; s.sig = [0, 0];
      s.g.forEach((q, i) => { q.x = inicio[i][0]; q.y = inicio[i][1]; });
    };
    const choque = () => {
      s.g.forEach((q, i) => {
        if (q.x === s.p[0] && q.y === s.p[1]) {
          if (s.susto > 0) { s.pts += 5; setPts(s.pts); q.x = inicio[i][0]; q.y = inicio[i][1]; } else perder();
        }
      });
    };
    const pasoJugador = () => {
      if (libre(s.p[0] + s.sig[0], s.p[1] + s.sig[1]) && (s.sig[0] || s.sig[1])) s.dir = s.sig;
      const nx = s.p[0] + s.dir[0], ny = s.p[1] + s.dir[1];
      if (libre(nx, ny)) { s.p = [nx, ny]; }
      const v = m[s.p[1]][s.p[0]];
      if (v >= 2) { m[s.p[1]][s.p[0]] = 0; s.pts += v === 3 ? 3 : 1; s.comidos++; setPts(s.pts); if (v === 3) s.susto = 28; if (s.comidos >= total) { s.vivo = false; onFin(s.pts + 20, "¡Limpiaste todo el laberinto!"); return; } }
      choque();
    };
    const pasoMalos = () => {
      s.g.forEach((q) => {
        const opc = DIRS.filter((d) => libre(q.x + d[0], q.y + d[1]) && !(d[0] === -q.d[0] && d[1] === -q.d[1]));
        const lista = opc.length ? opc : DIRS.filter((d) => libre(q.x + d[0], q.y + d[1]));
        let d;
        if (Math.random() < 0.55) {
          const f = s.susto > 0 ? -1 : 1;
          d = lista.slice().sort((a, b) => f * ((Math.abs(q.x + a[0] - s.p[0]) + Math.abs(q.y + a[1] - s.p[1])) - (Math.abs(q.x + b[0] - s.p[0]) + Math.abs(q.y + b[1] - s.p[1]))))[0];
        } else d = lista[Math.floor(Math.random() * lista.length)];
        if (d) { q.d = d; q.x += d[0]; q.y += d[1]; }
      });
      choque();
    };
    const dibujar = () => {
      g.fillStyle = "#16213a"; g.fillRect(0, 0, W, W);
      g.font = `${T * 0.78}px serif`; g.textAlign = "center"; g.textBaseline = "middle";
      m.forEach((f, y) => f.forEach((v, x) => {
        if (v === 1) { g.fillStyle = ctx.color; g.beginPath(); (g.roundRect ? g.roundRect(x * T + 1, y * T + 1, T - 2, T - 2, 5) : g.rect(x * T + 1, y * T + 1, T - 2, T - 2)); g.fill(); }
        else if (v === 2) { g.fillStyle = "#ffe08a"; g.beginPath(); g.arc(x * T + T / 2, y * T + T / 2, T * 0.12, 0, 7); g.fill(); }
        else if (v === 3) g.fillText("🌶️", x * T + T / 2, y * T + T / 2 + 1);
      }));
      g.fillText(ctx.heroe, s.p[0] * T + T / 2, s.p[1] * T + T / 2 + 1);
      s.g.forEach((q) => { g.globalAlpha = s.susto > 0 && s.susto < 8 && s.t % 2 ? 0.4 : 1; g.fillText(s.susto > 0 ? "😵" : ctx.malo, q.x * T + T / 2, q.y * T + T / 2 + 1); g.globalAlpha = 1; });
    };
    dibujar();
    const id = setInterval(() => { if (!s.vivo) return; s.t++; pasoJugador(); if (s.vivo && s.t % 2 === 0) pasoMalos(); if (s.susto > 0) s.susto--; dibujar(); }, 210);
    const tecla = (e) => {
      const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
      if (d) { e.preventDefault(); girar(d[0], d[1]); }
    };
    window.addEventListener("keydown", tecla);
    return () => { s.vivo = false; clearInterval(id); window.removeEventListener("keydown", tecla); };
  }, [ctx, onFin]);

  const ini = (e) => { const t = e.touches ? e.touches[0] : e; toque.current = [t.clientX, t.clientY]; };
  const fin = (e) => {
    if (!toque.current) return;
    const t = e.changedTouches ? e.changedTouches[0] : e;
    const dx = t.clientX - toque.current[0], dy = t.clientY - toque.current[1]; toque.current = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    if (Math.abs(dx) > Math.abs(dy)) acc.current.girar(dx > 0 ? 1 : -1, 0); else acc.current.girar(0, dy > 0 ? 1 : -1);
  };
  const g = (dx, dy) => () => acc.current.girar(dx, dy);
  return (
    <div>
      <p className="jg-info">Puntos: <b>{pts}</b> · Vidas: {"❤️".repeat(Math.max(0, vidas))} · 🌶️ asusta a {ctx.malo}</p>
      <canvas ref={cv} className="jg-cv" style={{ touchAction: "none" }} onTouchStart={ini} onTouchEnd={fin} onMouseDown={ini} onMouseUp={fin} />
      <div className="jg-pad">
        <button type="button" onClick={g(0, -1)} aria-label="Arriba">▲</button>
        <div><button type="button" onClick={g(-1, 0)} aria-label="Izquierda">◀</button><button type="button" onClick={g(1, 0)} aria-label="Derecha">▶</button></div>
        <button type="button" onClick={g(0, 1)} aria-label="Abajo">▼</button>
      </div>
    </div>
  );
}
