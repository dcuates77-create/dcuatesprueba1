import React, { useState, useEffect, useRef, useCallback } from "react";

// =========================================================================
// CARRUSEL SUPERIOR DE VIDEOS — DCUATES (CLON8)
// Es el carrusel de "Retos, Regalos y Reconocimientos" (Baserow:
// NOMBRE RETOSVID / RETOSVID), ahora arriba de las pestañas.
// - Tira de miniaturas (2 visibles en celular, 4 en tableta, 5 en PC),
//   alto ≈ 15 % de la pantalla en celular.
// - Se desplaza solo, suave y en CICLO continuo (sin rebobinar).
// - Al tocarlo o deslizarlo a mano se pausa y se reanuda a los 6 s.
// - Cada item: { id, tipo: "video" | "imagen" | "pdf", nombre,
//                media?, img?, url?, onClick? }
//     video  -> media = <MiniaturaVideo/>, onClick abre el visor grande
//     imagen -> img, onClick abre la foto en grande
//     pdf    -> url (se abre en pestaña nueva)
// =========================================================================

const INTERVALO_MS = 3500;
const REANUDAR_MS = 6000;

export default function CarruselVideos({ items = [] }) {
  const pistaRef = useRef(null);
  const temporizador = useRef(null);
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [desborda, setDesborda] = useState(false);
  const n = items.length;
  const lista = desborda ? [...items, ...items.map((it) => ({ ...it, id: `${it.id}-c`, copia: true }))] : items;

  const reducirMovimiento =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ¿Las miniaturas no caben en el ancho? Solo entonces hay ciclo/copias.
  useEffect(() => {
    const medir = () => {
      const pista = pistaRef.current;
      if (!pista || n === 0) return;
      const ultimo = pista.children[n - 1];
      const primero = pista.children[0];
      if (!ultimo || !primero) return;
      const ancho = ultimo.offsetLeft + ultimo.offsetWidth - primero.offsetLeft;
      setDesborda(ancho > pista.clientWidth + 4);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [n]);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const irA = useCallback((i, suave = true) => {
    const pista = pistaRef.current;
    const hijo = pista?.children[i];
    if (!pista || !hijo) return;
    pista.scrollTo({ left: hijo.offsetLeft, behavior: suave ? "smooth" : "auto" });
  }, []);

  // Avance automático, una miniatura a la vez.
  useEffect(() => {
    if (!desborda || pausado || reducirMovimiento) return;
    const id = setInterval(() => {
      setActual((i) => {
        const sig = i + 1;
        irA(sig);
        return sig;
      });
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [desborda, pausado, irA, reducirMovimiento]);

  // Al entrar a la segunda tanda (copias), salta sin animación a la
  // primera: como son idénticas, el salto no se nota.
  useEffect(() => {
    if (!desborda || actual < n) return;
    const t = setTimeout(() => {
      const pista = pistaRef.current;
      if (!pista || !pista.children[n]) return;
      const ancho = pista.children[n].offsetLeft - pista.children[0].offsetLeft;
      pista.style.scrollSnapType = "none";
      pista.scrollLeft -= ancho;
      pista.style.scrollSnapType = "";
      setActual((i) => i - n);
    }, 750);
    return () => clearTimeout(t);
  }, [actual, n, desborda]);

  // Si se desliza a mano, sincroniza el índice.
  const alDeslizar = () => {
    const pista = pistaRef.current;
    if (!pista) return;
    let mejor = 0, dist = Infinity;
    for (let i = 0; i < pista.children.length; i++) {
      const d = Math.abs(pista.children[i].offsetLeft - pista.scrollLeft);
      if (d < dist) { dist = d; mejor = i; }
    }
    if (mejor !== actual) setActual(mejor);
  };

  const pausarUnRato = () => {
    setPausado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setPausado(false), REANUDAR_MS);
  };

  if (n === 0) return null;

  return (
    <section className="cv-root" aria-roledescription="carrusel" aria-label="Retos, regalos y reconocimientos DCUATES">
      <style>{CSS}</style>
      <div className="cv-pista" ref={pistaRef} onScroll={alDeslizar} onPointerDown={pausarUnRato}>
        {lista.map((it, i) => (
          <Tarjeta key={it.id || i} item={it} copia={!!it.copia} />
        ))}
      </div>
    </section>
  );
}

function Tarjeta({ item, copia }) {
  const [fallo, setFallo] = useState(false);
  const esPdf = item.tipo === "pdf";
  const contenido = (
    <>
      <div className="cv-thumb">
        {item.media ? (
          item.media
        ) : item.img && !fallo ? (
          <img src={item.img} alt="" loading="lazy" onError={() => setFallo(true)} />
        ) : (
          <span className="cv-emoji" aria-hidden="true">{esPdf ? "📄" : "🖼️"}</span>
        )}
        {item.tipo === "video" && <span className="cv-play" aria-hidden="true">▶</span>}
        {esPdf && <span className="cv-etq">PDF</span>}
      </div>
      <span className="cv-cap">{item.nombre}</span>
    </>
  );
  const props = { className: "cv-card", "aria-hidden": copia || undefined, tabIndex: copia ? -1 : undefined };
  if (esPdf && item.url) {
    return <a {...props} href={item.url} target="_blank" rel="noopener noreferrer">{contenido}</a>;
  }
  return <button type="button" {...props} onClick={item.onClick}>{contenido}</button>;
}

const CSS = `
.cv-root{font-family:"Nunito",ui-rounded,system-ui,sans-serif;width:100%}
.cv-root *{box-sizing:border-box;font-family:inherit}
.cv-pista{position:relative;display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;padding:2px 2px 6px}
.cv-pista::-webkit-scrollbar{display:none}
.cv-card{flex:0 0 calc((100% - 10px) / 2);scroll-snap-align:start;border:2px solid rgba(255,255,255,.12);border-radius:16px;overflow:hidden;background:#0f2d1e;color:#fff;padding:0;text-align:left;text-decoration:none;cursor:pointer;display:flex;flex-direction:column;box-shadow:0 4px 12px rgba(31,42,55,.18);transition:border-color .2s}
.cv-card:hover{border-color:#e65100}
.cv-thumb{position:relative;aspect-ratio:16/9;width:100%;overflow:hidden;background:#000}
.cv-thumb>:first-child{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cv-emoji{display:grid;place-items:center;font-size:34px;background:linear-gradient(135deg,#17472d,#2E9E5B)}
.cv-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:36px;height:36px;border-radius:50%;background:rgba(230,81,0,.92);display:grid;place-items:center;font-size:14px;box-shadow:0 3px 8px rgba(0,0,0,.35)}
.cv-etq{position:absolute;left:8px;top:8px;background:#E5484D;border-radius:8px;padding:1px 7px;font-size:11px;font-weight:900}
.cv-cap{padding:5px 8px 6px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.01em;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cv-root button:focus-visible,.cv-root a:focus-visible{outline:3px solid #e65100;outline-offset:2px}
@media (min-width:768px){.cv-card{flex-basis:calc((100% - 30px) / 4)}.cv-cap{font-size:12px}}
@media (min-width:1024px){.cv-card{flex-basis:calc((100% - 40px) / 5)}}
`;
