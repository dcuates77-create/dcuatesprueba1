import React, { useEffect, useRef, useState } from "react";

const rr = (g, ...a) => (g.roundRect ? g.roundRect(...a) : g.rect(a[0], a[1], a[2], a[3]));
export default function Papalote({ ctx, onFin }) {
  const cv = useRef(null);
  const [pts, setPts] = useState(0);
  const toca = useRef(() => {});

  useEffect(() => {
    const c = cv.current, g = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth, H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr; g.scale(dpr, dpr);
    const s = { y: H / 2, v: 0, obs: [], t: 0, pts: 0, vivo: true, ini: false };
    const HUECO = 130;
    const nuevo = () => s.obs.push({ x: W + 20, h: 50 + Math.random() * (H - HUECO - 100), ok: false });
    nuevo();
    toca.current = () => { s.ini = true; s.v = -6.2; };
    let raf = 0;
    const bucle = () => {
      if (!s.vivo) return;
      if (s.ini) { s.v += 0.34; s.y += s.v; s.t++; if (s.t % 95 === 0) nuevo(); s.obs.forEach((o) => { o.x -= 2.4; }); }
      s.obs = s.obs.filter((o) => o.x > -60);
      g.fillStyle = "#cfeaff"; g.fillRect(0, 0, W, H);
      g.fillStyle = "#e9f6ff"; g.fillRect(0, H - 30, W, 30);
      s.obs.forEach((o) => {
        g.fillStyle = ctx.color; g.beginPath(); rr(g, o.x, 0, 46, o.h, 8); g.fill();
        g.beginPath(); rr(g, o.x, o.h + HUECO, 46, H, 8); g.fill();
        g.font = "22px serif"; g.textAlign = "center"; g.fillText("☁️", o.x + 23, o.h - 8); g.fillText("☁️", o.x + 23, o.h + HUECO + 26);
        if (!o.ok && o.x + 46 < 70) { o.ok = true; s.pts++; setPts(s.pts); }
        if (70 + 14 > o.x && 70 - 14 < o.x + 46 && (s.y - 14 < o.h || s.y + 14 > o.h + HUECO)) s.vivo = false;
      });
      if (s.y > H - 30 || s.y < -10) s.vivo = false;
      g.font = "34px serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.save(); g.translate(70, s.y); g.rotate(Math.max(-0.5, Math.min(0.8, s.v / 12))); g.fillText(ctx.heroe, 0, 0); g.restore();
      if (!s.ini) { g.fillStyle = "#1f2a37"; g.font = "bold 16px sans-serif"; g.fillText("Toca para empezar a volar", W / 2, H / 2 + 60); }
      if (!s.vivo) { onFin(s.pts, `Pasaste ${s.pts} nubes. ¡Sigue volando!`); return; }
      raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);
    const tecla = (e) => { if (e.code === "Space") { e.preventDefault(); toca.current(); } };
    window.addEventListener("keydown", tecla);
    return () => { s.vivo = false; cancelAnimationFrame(raf); window.removeEventListener("keydown", tecla); };
  }, [ctx, onFin]);

  return (
    <div>
      <p className="jg-info">Nubes: <b>{pts}</b> · toca la pantalla para subir</p>
      <canvas ref={cv} className="jg-cv" style={{ height: 360, touchAction: "manipulation" }} onPointerDown={(e) => { e.preventDefault(); toca.current(); }} />
    </div>
  );
}
