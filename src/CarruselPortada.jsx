import React, { useState, useEffect, useRef } from "react";

// =========================================================================
// CARRUSEL DE PORTADA — DCUATES (CLON8)
// Va al inicio de cada pestaña. Es una TIRA con varios cuadros a la vez
// (2 en celular, 3 en tableta, 4 en PC); cada imagen, video (miniatura) o PDF
// se ve COMPLETO (sin recortes). Avanza solo, un cuadro cada 3 segundos, en
// ciclo continuo. Al tocarlo o deslizarlo a mano se pausa 6 s y luego sigue.
//
// El movimiento lo hace el propio código (animación por cuadros) y no depende
// de "scroll suave" del navegador, así que corre igual en celular y en PC, aun
// con "reducir animaciones" (en ese caso el cambio es instantáneo).
//
// items: [{ id, tipo: "imagen" | "video" | "pdf", nombre?, img?, url?,
//           media?, onClick? }]
//   imagen -> img
//   video  -> media (miniatura) + onClick (abre el visor grande)
//   pdf    -> url (se abre en pestaña nueva)
// Si no hay items y se pasa "fallback", se muestra esa imagen sola.
// =========================================================================

const INTERVALO_MS = 3000;
const ANIMACION_MS = 600;
const REANUDAR_MS = 6000;

function animarScroll(el, destino, ms, alTerminar) {
  const inicio = el.scrollLeft;
  const delta = destino - inicio;
  if (ms <= 0 || Math.abs(delta) < 1) {
    el.scrollLeft = destino;
    alTerminar && alTerminar();
    return null;
  }
  const t0 = performance.now();
  const id = { cancelado: false };
  const paso = (ahora) => {
    if (id.cancelado) return;
    const k = Math.min(1, (ahora - t0) / ms);
    const suave = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;   // ease-in-out
    el.scrollLeft = inicio + delta * suave;
    if (k < 1) requestAnimationFrame(paso);
    else alTerminar && alTerminar();
  };
  requestAnimationFrame(paso);
  return id;
}

export default function CarruselPortada({ items = [], tab, slogan, fallback }) {
  const pistaRef = useRef(null);
  const indiceRef = useRef(0);
  const animRef = useRef(null);
  const reanudarRef = useRef(null);
  const ignorarScrollHasta = useRef(0);
  const [pausado, setPausado] = useState(false);
  const [desborda, setDesborda] = useState(false);
  const [respaldoRoto, setRespaldoRoto] = useState(false);
  useEffect(() => { setRespaldoRoto(false); }, [fallback]);

  // Sin contenido ni imagen de respaldo que exista, el carrusel no se muestra
  // (así no queda una tarjeta vacía con solo un emoji).
  const base = items.length > 0
    ? items
    : fallback && !respaldoRoto
      ? [{ id: "respaldo", tipo: "imagen", img: fallback, alFallar: () => setRespaldoRoto(true) }]
      : [];
  const n = base.length;
  const lista = desborda ? [...base, ...base] : base;

  const reducirMovimiento =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ¿Los cuadros no caben en el ancho? Solo entonces hay movimiento.
  useEffect(() => {
    const medir = () => {
      const pista = pistaRef.current;
      if (!pista || n === 0) return setDesborda(false);
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

  useEffect(() => () => {
    clearTimeout(reanudarRef.current);
    if (animRef.current) animRef.current.cancelado = true;
  }, []);

  // Cuando cambia el contenido, vuelve al primer cuadro.
  useEffect(() => {
    indiceRef.current = 0;
    if (pistaRef.current) pistaRef.current.scrollLeft = 0;
  }, [n]);

  const posicionDe = (i) => {
    const pista = pistaRef.current;
    const hijo = pista?.children[i];
    if (!pista || !hijo) return null;
    return hijo.getBoundingClientRect().left - pista.getBoundingClientRect().left + pista.scrollLeft;
  };

  // Avance automático, un cuadro cada 3 s.
  useEffect(() => {
    if (!desborda || pausado) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      const pista = pistaRef.current;
      if (!pista) return;
      const sig = indiceRef.current + 1;
      const destino = posicionDe(sig);
      if (destino == null) return;
      indiceRef.current = sig;
      ignorarScrollHasta.current = Date.now() + ANIMACION_MS + 400;
      pista.style.scrollSnapType = "none";
      if (animRef.current) animRef.current.cancelado = true;
      animRef.current = animarScroll(pista, destino, reducirMovimiento ? 0 : ANIMACION_MS, () => {
        // Al entrar a la segunda tanda (copias idénticas) salta, sin que se note, a la primera.
        if (indiceRef.current >= n) {
          const ancho = posicionDe(n) - posicionDe(0);
          pista.scrollLeft = pista.scrollLeft - ancho;
          indiceRef.current -= n;
        }
        pista.style.scrollSnapType = "";
      });
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [desborda, pausado, n, reducirMovimiento]);

  // Si el usuario desliza a mano, se sincroniza el índice y se pausa un rato.
  const alDeslizar = () => {
    const pista = pistaRef.current;
    if (!pista || Date.now() < ignorarScrollHasta.current) return;
    let mejor = 0, dist = Infinity;
    for (let i = 0; i < pista.children.length; i++) {
      const d = Math.abs(posicionDe(i) - pista.scrollLeft);
      if (d < dist) { dist = d; mejor = i; }
    }
    indiceRef.current = mejor;
  };

  const pausarUnRato = () => {
    if (animRef.current) animRef.current.cancelado = true;
    const pista = pistaRef.current;
    if (pista) pista.style.scrollSnapType = "";
    setPausado(true);
    clearTimeout(reanudarRef.current);
    reanudarRef.current = setTimeout(() => setPausado(false), REANUDAR_MS);
  };

  if (n === 0) return null;

  return (
    <section className="cp-root" aria-roledescription={desborda ? "carrusel" : undefined} aria-label={`Imágenes y videos de ${tab.label}`}>
      <style>{CSS}</style>
      {slogan && <p className="cp-titulo" style={{ color: tab.color }}>{slogan}</p>}
      <div
        className={`cp-pista${desborda ? "" : " cp-centrado"}`}
        ref={pistaRef}
        onScroll={alDeslizar}
        onPointerDown={pausarUnRato}
        onTouchStart={pausarUnRato}
      >
        {lista.map((it, i) => (
          <Cuadro key={`${it.id || i}-${i}`} item={it} tab={tab} copia={i >= n} solo={n === 1} />
        ))}
      </div>
    </section>
  );
}

function Cuadro({ item, tab, copia, solo }) {
  const [fallo, setFallo] = useState(false);
  const esPdf = item.tipo === "pdf";
  const esVideo = item.tipo === "video";
  const area = (
    <div className="cp-area">
      {item.media ? (
        <div className="cp-media">{item.media}</div>
      ) : item.img && !fallo ? (
        <img className="cp-img" src={item.img} alt="" loading="lazy" onError={() => { setFallo(true); item.alFallar && item.alFallar(); }} />
      ) : (
        <span className="cp-emoji" aria-hidden="true">{esPdf ? "📄" : tab.emoji}</span>
      )}
      {esVideo && <span className="cp-play" aria-hidden="true">▶</span>}
      {esPdf && <span className="cp-etq">PDF</span>}
    </div>
  );
  const contenido = (
    <>
      {area}
      {item.nombre ? <span className="cp-nombre">{item.nombre}</span> : null}
    </>
  );
  const props = {
    className: `cp-cuadro${solo ? " cp-solo" : ""}`,
    "aria-hidden": copia || undefined,
    tabIndex: copia ? -1 : undefined
  };
  if (esPdf && item.url) {
    return <a {...props} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.nombre || "Abrir PDF"}>{contenido}</a>;
  }
  if (item.onClick) {
    return <button type="button" {...props} onClick={item.onClick} aria-label={item.nombre || "Ver video"}>{contenido}</button>;
  }
  return <div {...props}>{contenido}</div>;
}

const CSS = `
.cp-root{font-family:"Nunito",ui-rounded,system-ui,sans-serif;margin-bottom:12px}
.cp-root *{box-sizing:border-box;font-family:inherit}
.cp-titulo{margin:0 2px 8px;font-size:18px;font-weight:900;line-height:1.2}
.cp-pista{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;padding:2px 2px 8px}
.cp-pista::-webkit-scrollbar{display:none}
.cp-pista.cp-centrado{justify-content:center}
.cp-cuadro{flex:0 0 calc((100% - 10px) / 2);scroll-snap-align:start;border:0;padding:0;background:#fff;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;color:#1f2a37;text-align:left;text-decoration:none;cursor:default;box-shadow:0 4px 12px rgba(31,42,55,.12)}
.cp-cuadro.cp-solo{flex:0 1 min(100%,420px)}
button.cp-cuadro,a.cp-cuadro{cursor:pointer}
.cp-area{position:relative;width:100%;aspect-ratio:4/3;background:#f3f5f7;display:grid;place-items:center;overflow:hidden}
.cp-img,.cp-media{position:absolute;inset:0;width:100%;height:100%}
.cp-img{object-fit:contain;padding:4px}
.cp-media{background:#0b1a12}
.cp-media>*{width:100%;height:100%;object-fit:contain}
.cp-emoji{font-size:48px}
.cp-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:rgba(230,81,0,.93);display:grid;place-items:center;font-size:17px;color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.35)}
.cp-etq{position:absolute;left:8px;top:8px;background:#E5484D;color:#fff;border-radius:8px;padding:1px 8px;font-size:11px;font-weight:900}
.cp-nombre{padding:6px 9px 8px;font-size:12px;font-weight:900;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cp-root button:focus-visible,.cp-root a:focus-visible{outline:3px solid #1f2a37;outline-offset:2px}
@media (min-width:768px){
  .cp-cuadro{flex-basis:calc((100% - 20px) / 3)}
  .cp-titulo{font-size:21px}
  .cp-nombre{font-size:13px}
}
@media (min-width:1100px){
  .cp-cuadro{flex-basis:calc((100% - 30px) / 4)}
}
`;
