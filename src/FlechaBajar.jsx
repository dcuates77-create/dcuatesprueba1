// FLECHA ↓ (e49) — pareja de la flecha ↑ «Subir»: aparece arriba a la derecha, DEBAJO del encabezado
// (no tapa sus iconos), solo mientras la persona está cerca del inicio de la página. Al tocarla baja una pantalla.
import React, { useEffect, useState } from "react";

export default function FlechaBajar() {
  const [arriba, setArriba] = useState(true);
  const [top, setTop] = useState(120);
  const [latido, setLatido] = useState(false);
  useEffect(() => {
    const medir = () => {
      setArriba(window.scrollY < 120 && document.documentElement.scrollHeight > window.innerHeight * 1.5);
      const enc = document.getElementById("encabezado-fijo");
      if (enc) setTop(Math.round(enc.getBoundingClientRect().bottom) + 10);
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    const t = setInterval(medir, 1500);
    return () => { window.removeEventListener("scroll", medir); window.removeEventListener("resize", medir); clearInterval(t); };
  }, []);
  const quieto = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (!arriba || quieto) return;
    const t = setInterval(() => setLatido((v) => !v), 900);
    return () => clearInterval(t);
  }, [arriba, quieto]);
  if (!arriba) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollBy({ top: Math.round(window.innerHeight * 0.8), behavior: quieto ? "auto" : "smooth" })}
      aria-label="Bajar para ver más"
      title="Desliza hacia abajo"
      data-flecha-bajar
      className="fixed right-3 sm:right-6 z-30 h-12 w-12 flex items-center justify-center rounded-full bg-[#0f2d1e] text-white shadow-lg border-2 border-white/40"
      style={{ top, transform: latido ? "translateY(5px)" : "none", transition: "transform .6s ease" }}
    >
      <span className="text-2xl leading-none font-black" aria-hidden="true">↓</span>
    </button>
  );
}
