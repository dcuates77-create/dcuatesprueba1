import React, { useState, useEffect, useRef, useCallback } from "react";

// =========================================================================
// BANNER DE AVISOS — DCUATES (CLON8)
// Carrusel superior (~16 % de la altura de la pantalla), siempre visible
// arriba de las pestañas. Se desplaza solo, suave y en ciclo continuo.
//
// Cada item: { id, tipo: "imagen" | "video" | "pdf" | "texto",
//              titulo, subtitulo?, img?, media?, url?, onClick? }
//  - imagen: img = ruta de la foto.
//  - video:  media = elemento React con la miniatura (ej. <MiniaturaVideo/>)
//            y onClick = abre el video en grande.
//  - pdf:    url = link del PDF (se abre en pestaña nueva).
// El botón flotante "¿Qué necesitas hoy?" queda encima de la esquina
// superior derecha, por eso el texto va abajo a la izquierda y los
// controles abajo a la derecha.
// =========================================================================

const INTERVALO_MS = 4500;
const REANUDAR_MS = 6000;

export default function BannerAvisos({ items = [] }) {
  const pistaRef = useRef(null);
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const temporizador = useRef(null);
  const n = items.length;
  // Con más de un aviso se agrega una copia del primero al final: al llegar
  // a ella se salta (sin animación) al verdadero primero, y el ciclo nunca
  // "rebobina" hacia atrás.
  const lista = n > 1 ? [...items, { ...items[0], id: `${items[0].id}-copia`, copia: true }] : items;

  const reducirMovimiento =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const irA = useCallback((i, suave = true) => {
    const pista = pistaRef.current;
    const hijo = pista?.children[i];
    if (!pista || !hijo) return;
    pista.scrollTo({ left: hijo.offsetLeft - pista.offsetLeft, behavior: suave ? "smooth" : "auto" });
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Avance automático
  useEffect(() => {
    if (pausado || n <= 1 || reducirMovimiento) return;
    const id = setInterval(() => {
      setActual((i) => {
        const sig = i + 1;
        irA(sig);
        return sig;
      });
    }, INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado, n, irA, reducirMovimiento]);

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

  // Si el usuario desliza a mano, sincroniza el índice con lo que se ve.
  const alDeslizar = () => {
    const pista = pistaRef.current;
    if (!pista || !pista.children[0]) return;
    const ancho = pista.children[0].offsetWidth + 10;
    const i = Math.round(pista.scrollLeft / ancho);
    if (i !== actual) setActual(i);
  };

  const pausarUnRato = () => {
    setPausado(true);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setPausado(false), REANUDAR_MS);
  };

  const mover = (delta) => {
    pausarUnRato();
    const dest = (actual + delta + n) % n;
    setActual(dest);
    irA(dest);
  };

  if (n === 0) return null;
  const puntoActivo = n > 1 ? actual % n : 0;

  return (
    <section className="ba-root" aria-roledescription="carrusel" aria-label="Avisos y novedades DCUATES">
      <style>{CSS}</style>
      <div className="ba-pista" ref={pistaRef} onScroll={alDeslizar} onPointerDown={pausarUnRato}>
        {lista.map((it, i) => (
          <Diapositiva key={it.id || i} item={it} oculta={!!it.copia} />
        ))}
      </div>

      {n > 1 && (
        <>
          <div className="ba-puntos" aria-hidden="true">
            {items.map((it, i) => (
              <span key={it.id || i} className={i === puntoActivo ? "on" : ""} />
            ))}
          </div>
          <div className="ba-flechas">
            <button type="button" onClick={() => mover(-1)} aria-label="Aviso anterior">‹</button>
            <button type="button" onClick={() => mover(1)} aria-label="Aviso siguiente">›</button>
          </div>
        </>
      )}
    </section>
  );
}

function Diapositiva({ item, oculta }) {
  const [fallo, setFallo] = useState(false);
  const esPdf = item.tipo === "pdf";
  const contenido = (
    <>
      {item.media ? (
        <div className="ba-media">{item.media}</div>
      ) : item.img && !fallo ? (
        <img className="ba-img" src={item.img} alt="" loading="lazy" onError={() => setFallo(true)} />
      ) : (
        <span className="ba-fondo-emoji" aria-hidden="true">{esPdf ? "📄" : item.tipo === "video" ? "▶️" : "📣"}</span>
      )}
      {item.tipo === "video" && <span className="ba-play" aria-hidden="true">▶</span>}
      {esPdf && <span className="ba-etq">PDF</span>}
      <div className="ba-texto">
        <strong>{item.titulo}</strong>
        {item.subtitulo && <span>{item.subtitulo}</span>}
      </div>
    </>
  );

  const props = { className: "ba-slide", "aria-hidden": oculta || undefined, tabIndex: oculta ? -1 : undefined };
  if (esPdf && item.url) {
    return <a {...props} href={item.url} target="_blank" rel="noopener noreferrer">{contenido}</a>;
  }
  if (item.onClick) {
    return <button type="button" {...props} onClick={item.onClick}>{contenido}</button>;
  }
  return <div {...props}>{contenido}</div>;
}

const CSS = `
.ba-root{position:relative;font-family:"Nunito",ui-rounded,system-ui,sans-serif;width:100%}
.ba-root *{box-sizing:border-box;font-family:inherit}
.ba-pista{display:flex;gap:10px;height:clamp(120px,16dvh,170px);overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;border-radius:16px}
.ba-pista::-webkit-scrollbar{display:none}
.ba-slide{position:relative;flex:0 0 100%;scroll-snap-align:start;border:0;padding:0;border-radius:16px;overflow:hidden;display:block;text-align:left;color:#fff;text-decoration:none;cursor:pointer;background:linear-gradient(135deg,#2E9E5B,#1B6F8A);box-shadow:0 6px 16px rgba(31,42,55,.15)}
div.ba-slide{cursor:default}
.ba-img,.ba-media{position:absolute;inset:0;width:100%;height:100%}
.ba-img{object-fit:cover}
.ba-media>*{width:100%;height:100%;object-fit:cover}
.ba-fondo-emoji{position:absolute;right:18%;top:26%;font-size:48px;opacity:.9}
.ba-play{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:rgba(240,122,26,.92);display:grid;place-items:center;font-size:18px;box-shadow:0 4px 10px rgba(0,0,0,.3)}
.ba-etq{position:absolute;left:10px;top:10px;background:#E5484D;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:900}
.ba-texto{position:absolute;left:0;right:88px;bottom:0;padding:26px 12px 10px;display:flex;flex-direction:column;gap:1px;background:linear-gradient(transparent,rgba(0,0,0,.68));min-height:60%;justify-content:flex-end}
.ba-texto strong{font-size:16px;font-weight:900;line-height:1.15;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ba-texto span{font-size:13px;font-weight:700;opacity:.92;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.ba-flechas{position:absolute;right:8px;bottom:8px;display:flex;gap:6px}
.ba-flechas button{width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.88);color:#1f2a37;font-size:22px;font-weight:900;line-height:1;cursor:pointer}
.ba-puntos{position:absolute;left:12px;top:10px;display:flex;gap:5px}
.ba-puntos span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.55);transition:width .25s,background .25s}
.ba-puntos span.on{width:18px;border-radius:99px;background:#fff}
.ba-root button:focus-visible,.ba-root a:focus-visible{outline:3px solid #fff;outline-offset:-3px}
@media (prefers-reduced-motion:reduce){.ba-puntos span{transition:none}}
`;
