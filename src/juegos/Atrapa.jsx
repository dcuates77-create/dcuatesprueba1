import React, { useEffect, useRef, useState } from "react";

export default function Atrapa({ ctx, onFin }) {
  const cv = useRef(null);
  const [pts, setPts] = useState(0);
  const [vidas, setVidas] = useState(3);

  useEffect(() => {
    const c = cv.current, g = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr; g.scale(dpr, dpr);
    const s = { x: W / 2, cosas: [], t: 0, pts: 0, vidas: 3, vivo: true };
    const mover = (e) => { const r = c.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; s.x = Math.max(28, Math.min(W - 28, p.clientX - r.left)); };
    c.addEventListener("pointermove", mover); c.addEventListener("pointerdown", mover);
    c.addEventListener("touchmove", mover, { passive: true });
    let raf = 0;
    const bucle = () => {
      if (!s.vivo) return;
      s.t++;
      const dificultad = 1 + s.pts / 25;
      if (s.t % Math.max(18, Math.round(44 - s.pts * 0.6)) === 0) {
        const malo = Math.random() < 0.22;
        s.cosas.push({ x: 20 + Math.random() * (W - 40), y: -20, v: (2 + Math.random() * 1.4) * dificultad, malo, e: malo ? ctx.malo : ctx.buenos[Math.floor(Math.random() * ctx.buenos.length)] });
      }
      g.fillStyle = "#fff8e6"; g.fillRect(0, 0, W, H);
      g.font = "32px serif"; g.textAlign = "center"; g.textBaseline = "middle";
      s.cosas.forEach((o) => { o.y += o.v; g.fillText(o.e, o.x, o.y); });
      g.fillText("🧺", s.x, H - 34);
      s.cosas = s.cosas.filter((o) => {
        if (o.y > H - 58 && o.y < H - 14 && Math.abs(o.x - s.x) < 34) {
          if (o.malo) { s.vidas--; setVidas(s.vidas); } else { s.pts++; setPts(s.pts); }
          return false;
        }
        if (o.y > H + 10) return false;
        return true;
      });
      if (s.vidas <= 0) { s.vivo = false; onFin(s.pts, `Atrapaste ${s.pts}. ¡Muy bien!`); return; }
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);
    return () => { s.vivo = false; cancelAnimationFrame(raf); c.removeEventListener("pointermove", mover); c.removeEventListener("pointerdown", mover); c.removeEventListener("touchmove", mover); };
  }, [ctx, onFin]);

  return (
    <div>
      <p className="jg-info">Atrapados: <b>{pts}</b> · Vidas: {"❤️".repeat(Math.max(0, vidas))} · esquiva {ctx.malo}</p>
      <canvas ref={cv} className="jg-cv" style={{ height: 380, touchAction: "none" }} />
    </div>
  );
}
