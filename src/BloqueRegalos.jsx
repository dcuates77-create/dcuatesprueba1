// Barra de REGALOS: 4 tarjetas (Música, Pelis, Páginas, Libros). Cada una abre
// un tablero luminoso de 20 botones: ¡JUGAR! hace correr las luces y PARAR elige
// un regalo al azar; también se puede tocar directamente el botón que guste.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FRASE_REGALOS, REGALOS_TEMAS } from "./datos/regalos.js";

const COLORES = ["#FF4D6D","#FF8A00","#FFC400","#7ED321","#00C2A8","#00A3FF","#7A5AD8","#E040FB","#FF6B6B","#FFB300"];

export function normalizarRegalos(filas = []) {
  const por = {};
  filas.forEach((f) => {
    const t = f && f["REGALO TEMA"] && String(f["REGALO TEMA"]).trim().toLowerCase().replace("á", "a").replace("ú", "u");
    if (!t || !f["REGALO TITULO"]) return;
    (por[t] = por[t] || []).push({
      titulo: String(f["REGALO TITULO"]).trim(),
      info: f["REGALO INFO"] ? String(f["REGALO INFO"]).trim() : "",
      enlace: f["REGALO ENLACE"] ? String(f["REGALO ENLACE"]).trim() : "",
      emoji: f["REGALO EMOJI"] ? String(f["REGALO EMOJI"]).trim() : ""
    });
  });
  return REGALOS_TEMAS.map((t) => {
    const nuevos = por[t.id] || [];
    const items = t.items.map((d, i) => (nuevos[i] ? { ...d, ...nuevos[i], emoji: nuevos[i].emoji || d.emoji } : d));
    return { ...t, items };
  });
}

function Tablero({ tema, onCerrar }) {
  const N = tema.items.length;
  const [luz, setLuz] = useState(-1);
  const [fase, setFase] = useState("reposo"); // reposo | corre | frena
  const [elegido, setElegido] = useState(null);
  const luzRef = useRef(-1);
  const faseRef = useRef("reposo");
  const timer = useRef(null);
  const info = useRef(null);

  const paso = (modo, desde) => {
    const l = desde != null ? desde : (luzRef.current < 0 ? 0 : luzRef.current);
    if (modo === "azar") { let r; do { r = Math.floor(Math.random() * N); } while (r === l); return r; }
    if (modo === "barrido") { const f = Math.floor(l / 4), c = l % 4; return ((f + 1) % (N / 4)) * 4 + c + (f + 1 === N / 4 ? ((c + 1) % 4) - c : 0); }
    if (modo === "reversa") return (l - 1 + N) % N;
    return (l + 1) % N;
  };
  const poner = (i) => { luzRef.current = i; setLuz(i); };
  const parar = () => clearTimeout(timer.current);
  useEffect(() => () => parar(), []);

  const jugar = () => {
    setElegido(null); faseRef.current = "corre"; setFase("corre");
    const ciclo = () => { poner(paso(tema.modo)); timer.current = setTimeout(ciclo, 85); };
    ciclo();
  };
  const frenar = () => {
    parar(); faseRef.current = "frena"; setFase("frena");
    // se calcula de antemano el recorrido de frenado (13 a 19 pasos) y se anima con pausas crecientes
    const total = 13 + Math.floor(Math.random() * 7);
    const ruta = [];
    let l = luzRef.current < 0 ? 0 : luzRef.current;
    for (let i = 0; i < total; i++) { l = paso(tema.modo, l); ruta.push(l); }
    let i = 0;
    const ciclo = () => {
      poner(ruta[i]); i++;
      if (i >= ruta.length) {
        faseRef.current = "reposo"; setFase("reposo"); setElegido(ruta[ruta.length - 1]);
        setTimeout(() => info.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
        return;
      }
      timer.current = setTimeout(ciclo, 90 + Math.pow(i / total, 2.2) * 420);
    };
    ciclo();
  };
  const tocar = (i) => {
    parar(); faseRef.current = "reposo"; setFase("reposo"); poner(i); setElegido(i);
    setTimeout(() => info.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
  };

  const it = elegido != null ? tema.items[elegido] : null;
  return (
    <div className="rg-fondo" role="dialog" aria-modal="true" aria-label={tema.nombre} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="rg-caja">
        <div className="rg-cab">
          <b style={{ color: tema.color }}>{tema.emoji} {tema.nombre}</b>
          <button type="button" className="ag-x" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <p className="rg-invita">🎁 ¡Juega y descubre tus regalos! Toca <b>¡JUGAR!</b> y presiona <b>PARAR</b> cuando quieras, o elige directo el botón que más te guste.</p>
        <div className="rg-tablero">
          {tema.items.map((d, i) => (
            <button type="button" key={i} onClick={() => tocar(i)}
              className={"rg-b" + (luz === i ? " rg-on" : "") + (elegido === i ? " rg-sel" : "")}
              style={{ "--k": COLORES[i % COLORES.length], animationDelay: (i % 10) * 0.18 + "s" }}
              aria-label={d.titulo}>
              <span className="rg-e">{d.emoji}</span>
              <span className="rg-t">{d.titulo}</span>
            </button>
          ))}
        </div>
        <div className="rg-acciones">
          {fase === "corre"
            ? <button type="button" className="rg-parar" onClick={frenar}>✋ PARAR</button>
            : <button type="button" className="rg-jugar" onClick={jugar} disabled={fase === "frena"} style={{ background: tema.color }}>🎲 ¡JUGAR!</button>}
        </div>
        <div className="rg-res" ref={info}>
          <p className="ag-fecha">Tu regalo de {tema.nombre.toLowerCase().replace(" dcuates", "")}</p>
          {!it && <p className="ag-vacio">Aún no eliges ninguno. ¡Anímate a jugar!</p>}
          {it && (
            <div className="ag-ev rg-pop" key={elegido}>
              <b>{it.emoji} {it.titulo}</b>
              {it.info && <p>{it.info}</p>}
              {it.enlace && <a href={it.enlace} target="_blank" rel="noopener noreferrer">Abrir regalo ›</a>}
            </div>
          )}
        </div>
        <p className="rg-cierre">{FRASE_REGALOS}</p>
      </div>
      <style>{CSS}</style>
    </div>
  );
}

export default function BloqueRegalos({ tema }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <article className="bc-ficha bc-mini" style={{ borderColor: tema.color }}>
        <span className="bc-ficha-ico" style={{ background: tema.color }} aria-hidden="true">{tema.emoji}</span>
        <h3>{tema.nombre}</h3>
        <p>20 sorpresas. ¡Juega!</p>
        <div className="bc-ficha-btns">
          <button type="button" onClick={() => setAbierto(true)} style={{ background: tema.color }}>🎲 Jugar</button>
        </div>
      </article>
      {abierto && createPortal(<Tablero tema={tema} onCerrar={() => setAbierto(false)} />, document.body)}
    </>
  );
}

const CSS = `
.rg-fondo{position:fixed;inset:0;z-index:90;background:rgba(15,10,30,.7);display:flex;align-items:flex-end;justify-content:center;font-family:inherit}
.rg-caja{width:100%;max-width:480px;max-height:94vh;overflow:auto;background:linear-gradient(180deg,#1b1235,#2a1a4f);border-radius:22px 22px 0 0;padding:14px 12px 22px;color:#fff}
@media(min-width:640px){.rg-fondo{align-items:center}.rg-caja{border-radius:22px}}
.rg-cab{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.rg-cab b{flex:1;font-size:18px;font-weight:900;background:#fff;border-radius:12px;padding:6px 10px}
.rg-invita{margin:6px 2px 10px;font-size:14px;font-weight:700;line-height:1.35;color:#f3eaff}
.rg-tablero{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.rg-b{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;aspect-ratio:1/1.05;padding:3px;border:2px solid var(--k);border-radius:12px;background:rgba(255,255,255,.07);color:#fff;font-family:inherit;cursor:pointer;animation:rg-tw 2.2s ease-in-out infinite;-webkit-tap-highlight-color:transparent}
.rg-e{font-size:20px;line-height:1}
.rg-t{font-size:9.5px;font-weight:800;line-height:1.1;text-align:center;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.rg-on{background:var(--k);animation:none;transform:scale(1.1);box-shadow:0 0 14px 3px var(--k);z-index:2}
.rg-sel{background:var(--k);animation:none;transform:scale(1.08);box-shadow:0 0 18px 4px #fff;border-color:#fff;z-index:2}
@keyframes rg-tw{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 9px 1px var(--k)}}
.rg-acciones{display:flex;justify-content:center;margin:14px 0 6px}
.rg-jugar,.rg-parar{min-width:200px;min-height:54px;border:0;border-radius:99px;color:#fff;font-family:inherit;font-size:20px;font-weight:900;cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.3)}
.rg-jugar:disabled{opacity:.6}
.rg-parar{background:#e5252d;animation:rg-pulso .7s ease-in-out infinite}
@keyframes rg-pulso{50%{transform:scale(1.06)}}
.rg-res{background:#fff;color:#1f2a37;border-radius:16px;padding:12px;margin-top:8px}
.rg-pop{animation:rg-pop .4s ease-out}
@keyframes rg-pop{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}
.rg-cierre{margin:12px 4px 0;text-align:center;font-size:14px;font-weight:800;font-style:italic;color:#ffe9a8;line-height:1.35}
.ag-x{width:42px;height:42px;border:0;border-radius:12px;background:#fde8e8;font-size:16px;font-weight:900;cursor:pointer;color:#1f2a37}
.ag-fecha{margin:0 0 6px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#6b7785}
.ag-vacio{margin:0;font-size:14px;font-weight:700;color:#6b7785}
.ag-ev{background:#f4f7f5;border-radius:14px;padding:10px 12px}
.ag-ev b{font-size:16px;font-weight:900}
.ag-ev p{margin:4px 0 0;font-size:14px;font-weight:600;line-height:1.35}
.ag-ev a{display:inline-block;margin-top:8px;font-weight:900;font-size:14px;color:#1B6F8A}
@media(prefers-reduced-motion:reduce){.rg-b{animation:none}}
`;
