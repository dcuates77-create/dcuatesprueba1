import React, { useState, useEffect, useRef, cloneElement } from "react";

// =========================================================================
// TIRA AUTOMÁTICA — DCUATES (CLON8)
// Una fila de tarjetas que se desliza sola, UN CUADRO cada 2 segundos, en
// ciclo continuo, con flechas ‹ › y un degradado a la derecha que avisa que
// hay más. Si todas las tarjetas caben en pantalla, no se mueve ni muestra
// flechas. Al tocarla o deslizarla a mano se pausa 6 s y luego sigue.
// El movimiento lo hace el propio código (no depende del "scroll suave" del
// navegador), así que corre igual en celular y en PC.
//
//   <TiraAuto intervalo={2000} fondo="#FFF1E1" etiqueta="Proyectos">
//     <div>…tarjeta…</div> <div>…tarjeta…</div>
//   </TiraAuto>
// Cada tarjeta debe traer su propio ancho (ej. width:158px).
// =========================================================================

const REANUDAR_MS = 6000;
const ANIMACION_MS = 500;

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
    el.scrollLeft = inicio + delta * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    if (k < 1) requestAnimationFrame(paso);
    else alTerminar && alTerminar();
  };
  requestAnimationFrame(paso);
  return id;
}

export default function TiraAuto({ children, intervalo = 2000, etiqueta = "Carrusel", fondo = "#fff" }) {
  const items = React.Children.toArray(children);
  const n = items.length;
  const pistaRef = useRef(null);
  const indiceRef = useRef(0);
  const animRef = useRef(null);
  const reanudarRef = useRef(null);
  const ignorarHasta = useRef(0);
  const [pausado, setPausado] = useState(false);          // pausa temporal (al tocar)
  const [pausaManual, setPausaManual] = useState(false);   // pausa elegida con el botón
  const [desborda, setDesborda] = useState(false);

  const reducir = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const lista = desborda
    ? [...items, ...items.map((el, i) => cloneElement(el, {
        key: `copia-${i}`,
        "aria-hidden": true,
        ref: (nodo) => { if (nodo) nodo.setAttribute("inert", ""); }
      }))]
    : items;

  // ¿Las tarjetas no caben en el ancho? Solo entonces hay movimiento y flechas.
  useEffect(() => {
    const medir = () => {
      const pista = pistaRef.current;
      if (!pista || n === 0) return setDesborda(false);
      const ultimo = pista.children[n - 1];
      const primero = pista.children[0];
      if (!ultimo || !primero) return;
      setDesborda(ultimo.offsetLeft + ultimo.offsetWidth - primero.offsetLeft > pista.clientWidth + 4);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [n]);

  useEffect(() => () => {
    clearTimeout(reanudarRef.current);
    if (animRef.current) animRef.current.cancelado = true;
  }, []);

  const posicionDe = (i) => {
    const pista = pistaRef.current;
    const hijo = pista?.children[i];
    if (!pista || !hijo) return null;
    return hijo.getBoundingClientRect().left - pista.getBoundingClientRect().left + pista.scrollLeft;
  };

  const irPor = (delta) => {
    const pista = pistaRef.current;
    if (!pista || n === 0 || !desborda) return;
    // Retroceder desde el primero: se salta (sin que se note) a la segunda tanda.
    if (delta < 0 && indiceRef.current <= 0) {
      const ancho = posicionDe(n) - posicionDe(0);
      pista.style.scrollSnapType = "none";
      pista.scrollLeft += ancho;
      indiceRef.current += n;
    }
    const sig = indiceRef.current + delta;
    const destino = posicionDe(sig);
    if (destino == null) return;
    indiceRef.current = sig;
    ignorarHasta.current = Date.now() + ANIMACION_MS + 400;
    pista.style.scrollSnapType = "none";
    if (animRef.current) animRef.current.cancelado = true;
    animRef.current = animarScroll(pista, destino, reducir ? 0 : ANIMACION_MS, () => {
      if (indiceRef.current >= n) {
        pista.scrollLeft -= posicionDe(n) - posicionDe(0);
        indiceRef.current -= n;
      }
      pista.style.scrollSnapType = "";
    });
  };

  // Avance automático: un cuadro cada "intervalo" ms.
  useEffect(() => {
    if (!desborda || pausado || pausaManual) return;
    const id = setInterval(() => { if (!document.hidden) irPor(1); }, intervalo);
    return () => clearInterval(id);
  }, [desborda, pausado, pausaManual, intervalo, n]);

  const pausarUnRato = () => {
    if (animRef.current) animRef.current.cancelado = true;
    if (pistaRef.current) pistaRef.current.style.scrollSnapType = "";
    setPausado(true);
    clearTimeout(reanudarRef.current);
    reanudarRef.current = setTimeout(() => setPausado(false), REANUDAR_MS);
  };

  const alDeslizar = () => {
    const pista = pistaRef.current;
    if (!pista || Date.now() < ignorarHasta.current) return;
    let mejor = 0, dist = Infinity;
    for (let i = 0; i < pista.children.length; i++) {
      const d = Math.abs(posicionDe(i) - pista.scrollLeft);
      if (d < dist) { dist = d; mejor = i; }
    }
    indiceRef.current = mejor;
  };

  const flecha = (delta) => () => { pausarUnRato(); irPor(delta); };

  return (
    <div className="ta-root" style={{ "--ta-fondo": fondo }} role="group" aria-roledescription={desborda ? "carrusel" : undefined} aria-label={etiqueta}>
      <style>{CSS}</style>
      <div
        className={`ta-pista${desborda ? "" : " ta-centrado"}`}
        ref={pistaRef}
        onScroll={alDeslizar}
        onPointerDown={pausarUnRato}
        onTouchStart={pausarUnRato}
      >
        {lista}
      </div>
      {desborda && (
        <>
          <span className="ta-borde" aria-hidden="true" />
          <button type="button" className="ta-flecha ta-prev" onClick={flecha(-1)} aria-label="Anterior">‹</button>
          <button type="button" className="ta-flecha ta-next" onClick={flecha(1)} aria-label="Siguiente">›</button>
        </>
      )}
      {desborda && (
        <div className="ta-pie">
          <button type="button" className="ta-pausa" onClick={() => setPausaManual((v) => !v)} aria-pressed={pausaManual}>
            {pausaManual ? "▶ Reanudar" : "❚❚ Pausar"}
          </button>
        </div>
      )}
    </div>
  );
}

const CSS = `
.ta-root{position:relative}
.ta-pista{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;padding:6px 2px 12px}
.ta-pista::-webkit-scrollbar{display:none}
.ta-pista.ta-centrado{justify-content:center}
.ta-pista>*{scroll-snap-align:start;flex:0 0 auto}
.ta-borde{position:absolute;top:0;bottom:0;right:0;width:46px;pointer-events:none;background:linear-gradient(to left,var(--ta-fondo),transparent)}
.ta-flecha{position:absolute;top:calc(50% - 16px);transform:translateY(-50%);z-index:3;width:38px;height:38px;border:0;border-radius:50%;background:#fff;color:#1f2a37;font-family:inherit;font-size:26px;font-weight:900;line-height:1;display:grid;place-items:center;padding:0 0 3px;box-shadow:0 4px 12px rgba(0,0,0,.28);cursor:pointer}
.ta-flecha:hover{background:#f1f5f2}
.ta-pie{display:flex;justify-content:flex-end;margin-top:-4px}
.ta-pausa{border:0;border-radius:99px;background:rgba(31,42,55,.09);color:#1f2a37;font-family:inherit;font-weight:800;font-size:12px;padding:6px 14px;min-height:32px;cursor:pointer}
.ta-pausa:hover{background:rgba(31,42,55,.16)}
.ta-pausa:focus-visible{outline:3px solid #1f2a37;outline-offset:2px}
.ta-prev{left:-8px}
.ta-next{right:-8px}
.ta-flecha:focus-visible{outline:3px solid #1f2a37;outline-offset:2px}
`;
