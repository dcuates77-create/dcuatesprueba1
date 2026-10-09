import React, { useEffect, useRef, useState } from "react";

const N = 14;
const rr = (g, ...a) => (g.roundRect ? g.roundRect(...a) : g.rect(a[0], a[1], a[2], a[3]));
export default function Culebrita({ ctx, onFin }) {
  const cv = useRef(null);
  const est = useRef({ cuerpo: [[7, 7], [6, 7], [5, 7]], dir: [1, 0], sig: [1, 0], comida: [10, 7], emo: ctx.buenos[0], pts: 0, vivo: true });
  const [pts, setPts] = useState(0);
  const toque = useRef(null);

  const girar = (dx, dy) => {
    const s = est.current;
    if (s.dir[0] === -dx && s.dir[1] === -dy) return;
    s.sig = [dx, dy];
  };

  useEffect(() => {
    const c = cv.current, g = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth;
    c.width = W * dpr; c.height = W * dpr; g.scale(dpr, dpr);
    const T = W / N;
    const s = est.current;
    const nuevaComida = () => {
      let p;
      do { p = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; } while (s.cuerpo.some((q) => q[0] === p[0] && q[1] === p[1]));
      s.comida = p; s.emo = ctx.buenos[Math.floor(Math.random() * ctx.buenos.length)];
    };
    const dibujar = () => {
      g.fillStyle = "#f4faf6"; g.fillRect(0, 0, W, W);
      for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) if ((x + y) % 2) { g.fillStyle = "#e6f3ea"; g.fillRect(x * T, y * T, T, T); }
      s.cuerpo.forEach((p, i) => { g.fillStyle = i === 0 ? ctx.color : ctx.color + "cc"; g.beginPath(); rr(g, p[0] * T + 1, p[1] * T + 1, T - 2, T - 2, 6); g.fill(); });
      g.font = `${T * 0.8}px serif`; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(s.emo, s.comida[0] * T + T / 2, s.comida[1] * T + T / 2 + 1);
    };
    const paso = () => {
      if (!s.vivo) return;
      s.dir = s.sig;
      const h = [s.cuerpo[0][0] + s.dir[0], s.cuerpo[0][1] + s.dir[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || s.cuerpo.some((q) => q[0] === h[0] && q[1] === h[1])) {
        s.vivo = false; onFin(s.pts, `Comiste ${s.pts}. ¡Buen intento!`); return;
      }
      s.cuerpo.unshift(h);
      if (h[0] === s.comida[0] && h[1] === s.comida[1]) { s.pts++; setPts(s.pts); nuevaComida(); } else s.cuerpo.pop();
      dibujar();
    };
    dibujar();
    const id = setInterval(paso, 190);
    const tecla = (e) => {
      const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
      if (m) { e.preventDefault(); girar(m[0], m[1]); }
    };
    window.addEventListener("keydown", tecla);
    return () => { clearInterval(id); window.removeEventListener("keydown", tecla); s.vivo = false; };
  }, [ctx, onFin]);

  const ini = (e) => { const t = e.touches ? e.touches[0] : e; toque.current = [t.clientX, t.clientY]; };
  const fin = (e) => {
    if (!toque.current) return;
    const t = e.changedTouches ? e.changedTouches[0] : e;
    const dx = t.clientX - toque.current[0], dy = t.clientY - toque.current[1];
    toque.current = null;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
    if (Math.abs(dx) > Math.abs(dy)) girar(dx > 0 ? 1 : -1, 0); else girar(0, dy > 0 ? 1 : -1);
  };
  return (
    <div>
      <p className="jg-info">Comidas: <b>{pts}</b> · desliza el dedo o usa las flechas</p>
      <canvas ref={cv} className="jg-cv" style={{ aspectRatio: "1/1", touchAction: "none" }} onTouchStart={ini} onTouchEnd={fin} onMouseDown={ini} onMouseUp={fin} />
      <div className="jg-pad">
        <button type="button" onClick={() => girar(0, -1)} aria-label="Arriba">▲</button>
        <div><button type="button" onClick={() => girar(-1, 0)} aria-label="Izquierda">◀</button><button type="button" onClick={() => girar(1, 0)} aria-label="Derecha">▶</button></div>
        <button type="button" onClick={() => girar(0, 1)} aria-label="Abajo">▼</button>
      </div>
    </div>
  );
}
