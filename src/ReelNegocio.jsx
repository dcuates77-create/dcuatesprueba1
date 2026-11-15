// REEL DE IMÁGENES Y VIDEOS de una Página CUATE (e81). Cada elemento es { t: "img", u } | { t: "yt", id } | { t: "mp4", u } (o un texto = imagen).
// Los videos de YouTube se cargan solo cuando la persona toca el cuadro (no gastan datos antes). El carrusel avanza solo cada 5 s
// si no hay un video en marcha, se detiene al tocarlo y no se mueve si la persona prefiere menos movimiento.
import React, { useEffect, useRef, useState } from "react";

const norm = (x) => (typeof x === "string" ? { t: "img", u: x } : x);

export default function ReelNegocio({ items, nombre = "", alAbrirVideo }) {
  const lista = (items || []).map(norm).filter((m) => m && (m.u || m.id));
  const pista = useRef(null);
  const [idx, setIdx] = useState(0);
  const [activo, setActivo] = useState(-1); // video en marcha
  const [pausa, setPausa] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducido = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ir = (i) => { const el = pista.current; if (!el || !el.children[i]) return; el.scrollTo({ left: el.children[i].offsetLeft - el.offsetLeft - 6, behavior: reducido ? "auto" : "smooth" }); setIdx(i); };
  const alScroll = () => {
    const el = pista.current; if (!el || !el.children.length) return;
    const w = el.children[0].getBoundingClientRect().width + 8;
    setIdx(Math.max(0, Math.min(lista.length - 1, Math.round(el.scrollLeft / w))));
  };
  useEffect(() => {
    const el = pista.current; if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const o = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    o.observe(el); return () => o.disconnect();
  }, [lista.length]);
  useEffect(() => {
    if (reducido || pausa || activo >= 0 || !visible || lista.length < 2) return undefined;
    const t = setInterval(() => ir((idx + 1) % lista.length), 5000);
    return () => clearInterval(t);
  }); // eslint-disable-line react-hooks/exhaustive-deps
  if (!lista.length) return null;
  return (
    <div className="rl" data-testid="negocio-reel" onPointerDown={() => setPausa(true)} onFocus={() => setPausa(true)}>
      <style>{CSS}</style>
      <div className="rl-pista" ref={pista} onScroll={alScroll} tabIndex={0} aria-label={`Imágenes y videos de ${nombre}`}>
        {lista.map((m, i) => (
          <div className="rl-it" key={i} data-tipo={m.t}>
            {m.t === "yt" ? (
              activo === i ? (
                <iframe title={`Video de ${nombre}`} src={`https://www.youtube-nocookie.com/embed/${m.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
              ) : (
                <button type="button" className="rl-play" onClick={() => { setActivo(i); alAbrirVideo && alAbrirVideo(); }} aria-label={`Ver video ${i + 1} de ${nombre}`}>
                  <img src={`https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`} alt="" loading="lazy" /><span aria-hidden="true">▶</span>
                </button>
              )
            ) : m.t === "mp4" ? (
              <video controls playsInline preload="metadata" src={m.u} onPlay={() => { setActivo(i); alAbrirVideo && alAbrirVideo(); }} onPause={() => setActivo(-1)} aria-label={`Video de ${nombre}`} />
            ) : (
              <img src={m.u} alt="" loading="lazy" />
            )}
          </div>
        ))}
      </div>
      {lista.length > 1 && (
        <div className="rl-pts" role="group" aria-label="Elegir imagen o video">
          {lista.map((m, i) => <button type="button" key={i} className={i === idx ? "on" : ""} aria-label={`Ir al elemento ${i + 1}`} aria-current={i === idx} onClick={() => { setPausa(true); ir(i); }} />)}
        </div>
      )}
    </div>
  );
}

const CSS = `
.rl{margin:14px 0 0}
.rl-pista{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 14px 4px;scrollbar-width:none}
.rl-pista::-webkit-scrollbar{display:none}
.rl-it{flex:0 0 88%;aspect-ratio:16/9;scroll-snap-align:center;border-radius:14px;overflow:hidden;background:#0f2d1e;position:relative}
.rl-it img,.rl-it video,.rl-it iframe{width:100%;height:100%;object-fit:cover;border:0;display:block}
.rl-it[data-tipo=mp4] video{object-fit:contain;background:#000}
.rl-play{all:unset;cursor:pointer;display:block;width:100%;height:100%;position:relative}
.rl-play span{position:absolute;inset:0;margin:auto;width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:28px;display:flex;align-items:center;justify-content:center;padding-left:4px;box-sizing:border-box}
.rl-play:focus-visible{outline:3px solid #FFD54F;outline-offset:-3px}
.rl-pts{display:flex;justify-content:center;gap:2px;margin-top:2px}
.rl-pts button{width:28px;height:28px;border:0;background:none;cursor:pointer;position:relative}
.rl-pts button::after{content:"";position:absolute;inset:0;margin:auto;width:9px;height:9px;border-radius:50%;background:#c9c2a8}
.rl-pts button.on::after{background:var(--c,#1F7A46);width:12px;height:12px}
`;
