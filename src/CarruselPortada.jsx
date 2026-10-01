import React, { useState, useEffect, useRef, useCallback } from "react";

// =========================================================================
// CARRUSEL DE PORTADA — DCUATES (CLON8)
// Reemplaza la imagen inicial de cada pestaña: muestra UN cuadro a la vez
// (imagen, video o PDF) y avanza solo cada 3 segundos, suave y en ciclo
// continuo. Al tocarlo o deslizarlo a mano se pausa 6 s. Solo avanza si está
// a la vista (no gasta batería cuando estás leyendo más abajo).
//
// items: [{ id, tipo: "imagen" | "video" | "pdf", nombre?, img?, url?,
//           media?, onClick? }]
//   imagen -> img
//   video  -> media (miniatura) + onClick (abre el visor grande)
//   pdf    -> url (se abre en pestaña nueva)
// Si no hay items se muestra una sola imagen de respaldo (fallback) o, si
// tampoco existe, un degradado con el emoji de la pestaña.
// =========================================================================

const INTERVALO_MS = 3000;
const REANUDAR_MS = 6000;

export default function CarruselPortada({ items = [], tab, slogan, fallback }) {
  const rootRef = useRef(null);
  const pistaRef = useRef(null);
  const temporizador = useRef(null);
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [visible, setVisible] = useState(true);
  const [falloFondo, setFalloFondo] = useState(!fallback);
  const n = items.length;
  // Con 2 o más cuadros se agrega una copia del primero al final: al llegar
  // a ella se salta (sin animación) al primero real y el ciclo no rebobina.
  const lista = n > 1 ? [...items, { ...items[0], id: `${items[0].id}-copia`, copia: true }] : items;

  const reducirMovimiento =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => { setFalloFondo(!fallback); }, [fallback]);
  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Cuando cambia la cantidad de cuadros, vuelve al primero.
  useEffect(() => {
    setActual(0);
    pistaRef.current?.scrollTo({ left: 0 });
  }, [n]);

  // Solo avanza cuando está a la vista.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const irA = useCallback((i, suave = true) => {
    const pista = pistaRef.current;
    const hijo = pista?.children[i];
    if (!pista || !hijo) return;
    pista.scrollTo({ left: hijo.offsetLeft, behavior: suave ? "smooth" : "auto" });
  }, []);

  // Avance automático cada 3 s.
  useEffect(() => {
    if (n <= 1 || pausado || !visible || reducirMovimiento) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setActual((i) => {
        const sig = i + 1;
        irA(sig);
        return sig;
      });
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [n, pausado, visible, irA, reducirMovimiento]);

  // Al llegar a la copia del primero, salta sin animación al primero real.
  useEffect(() => {
    if (n <= 1 || actual !== n) return;
    const t = setTimeout(() => {
      const pista = pistaRef.current;
      if (!pista) return;
      pista.style.scrollSnapType = "none";
      irA(0, false);
      pista.style.scrollSnapType = "";
      setActual(0);
    }, 650);
    return () => clearTimeout(t);
  }, [actual, n, irA]);

  // Si se desliza a mano, sincroniza el índice.
  const alDeslizar = () => {
    const pista = pistaRef.current;
    if (!pista || !pista.clientWidth) return;
    const i = Math.round(pista.scrollLeft / pista.clientWidth);
    if (i !== actual) setActual(i);
  };

  const pausarUnRato = () => {
    setPausado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setPausado(false), REANUDAR_MS);
  };

  const puntoActivo = n > 1 ? actual % n : 0;
  const nombreActual = items[puntoActivo]?.nombre;

  return (
    <section
      ref={rootRef}
      className="cp-root"
      style={{ background: `linear-gradient(135deg, ${tab.color}, ${tab.color}99)` }}
      aria-roledescription={n > 1 ? "carrusel" : undefined}
      aria-label={`Imágenes y videos de ${tab.label}`}
    >
      <style>{CSS}</style>

      {n === 0 ? (
        <>
          {!falloFondo && <img className="cp-fondo" src={fallback} alt="" loading="lazy" onError={() => setFalloFondo(true)} />}
          {falloFondo && <span className="cp-emoji" aria-hidden="true">{tab.emoji}</span>}
        </>
      ) : (
        <div className="cp-pista" ref={pistaRef} onScroll={alDeslizar} onPointerDown={pausarUnRato}>
          {lista.map((it, i) => (
            <Cuadro key={it.id || i} item={it} tab={tab} copia={!!it.copia} />
          ))}
        </div>
      )}

      <div className="cp-pie">
        <div className="cp-texto">
          <strong>{slogan}</strong>
          {nombreActual && <span>{nombreActual}</span>}
        </div>
        {n > 1 && (
          <div className="cp-puntos" aria-hidden="true">
            {items.map((it, i) => (
              <span key={it.id || i} className={i === puntoActivo ? "on" : ""} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Cuadro({ item, tab, copia }) {
  const [fallo, setFallo] = useState(false);
  const esPdf = item.tipo === "pdf";
  const esVideo = item.tipo === "video";
  const contenido = (
    <>
      {item.media ? (
        <div className="cp-media">{item.media}</div>
      ) : item.img && !fallo ? (
        <img className="cp-img" src={item.img} alt="" loading="lazy" onError={() => setFallo(true)} />
      ) : (
        <span className="cp-emoji" aria-hidden="true">{esPdf ? "📄" : tab.emoji}</span>
      )}
      {esVideo && <span className="cp-play" aria-hidden="true">▶</span>}
      {esPdf && <span className="cp-etq">PDF · toca para abrir</span>}
    </>
  );
  const props = { className: "cp-cuadro", "aria-hidden": copia || undefined, tabIndex: copia ? -1 : undefined };
  if (esPdf && item.url) {
    return <a {...props} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.nombre || "Abrir PDF"}>{contenido}</a>;
  }
  if (item.onClick) {
    return <button type="button" {...props} onClick={item.onClick} aria-label={item.nombre || "Ver video"}>{contenido}</button>;
  }
  return <div {...props}>{contenido}</div>;
}

const CSS = `
.cp-root{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/9;box-shadow:0 6px 16px rgba(31,42,55,.12);margin-bottom:14px;display:grid;place-items:center;font-family:"Nunito",ui-rounded,system-ui,sans-serif}
.cp-root *{box-sizing:border-box;font-family:inherit}
.cp-fondo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cp-pista{position:absolute;inset:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
.cp-pista::-webkit-scrollbar{display:none}
.cp-cuadro{position:relative;flex:0 0 100%;height:100%;scroll-snap-align:start;border:0;padding:0;display:block;overflow:hidden;background:transparent;color:#fff;text-decoration:none;cursor:default}
button.cp-cuadro,a.cp-cuadro{cursor:pointer}
.cp-img,.cp-media{position:absolute;inset:0;width:100%;height:100%}
.cp-img{object-fit:cover}
.cp-media>*{width:100%;height:100%;object-fit:cover}
.cp-emoji{display:grid;place-items:center;width:100%;height:100%;font-size:64px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.2))}
.cp-play{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:rgba(230,81,0,.93);display:grid;place-items:center;font-size:20px;box-shadow:0 4px 12px rgba(0,0,0,.35)}
.cp-etq{position:absolute;left:10px;top:10px;background:#E5484D;border-radius:8px;padding:2px 9px;font-size:12px;font-weight:900}
.cp-pie{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:flex-end;justify-content:space-between;gap:10px;padding:26px 14px 10px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.66));pointer-events:none}
.cp-texto{display:flex;flex-direction:column;min-width:0}
.cp-texto strong{font-size:17px;font-weight:900;line-height:1.2}
.cp-texto span{font-size:13px;font-weight:700;opacity:.92;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cp-puntos{display:flex;gap:5px;align-items:center;padding-bottom:4px}
.cp-puntos span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.55);transition:width .25s,background .25s}
.cp-puntos span.on{width:18px;border-radius:99px;background:#fff}
.cp-root button:focus-visible,.cp-root a:focus-visible{outline:3px solid #fff;outline-offset:-3px}
@media (min-width:768px){.cp-root{aspect-ratio:21/9}.cp-texto strong{font-size:22px}.cp-pie{padding:30px 20px 14px}}
@media (min-width:1100px){.cp-root{aspect-ratio:3/1}}
@media (prefers-reduced-motion:reduce){.cp-puntos span{transition:none}}
`;
