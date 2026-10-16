// ACCESIBILIDAD: alto contraste, reducir movimiento y leer en voz alta. Se recuerdan en el teléfono (localStorage).
import React, { useEffect, useState } from "react";
import { ciclarLetra, leerLetra, NOMBRES_LETRA } from "./tamanoLetra.js";

const CLAVES = { contraste: "dc_contraste", quieto: "dc_quieto", voz: "dc_voz" };
const lee = (n) => { try { return localStorage.getItem(CLAVES[n]) === "1"; } catch (e) { return false; } };
export const leerOpcion = (n) => lee(n);

const CSS = `
body.dc-quieto *,body.dc-quieto *::before,body.dc-quieto *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
body.dc-contraste .dc-op{border-color:#000;color:#000}
body.dc-contraste .zj-caja{background:#fff!important;color:#000!important;border:3px solid #000!important}
body.dc-contraste .zj-caja p,body.dc-contraste .zj-caja li,body.dc-contraste .zj-caja span,body.dc-contraste .zj-caja h2,body.dc-contraste .zj-caja h3,body.dc-contraste .zj-et,body.dc-contraste .zj-p{color:#000!important;font-weight:800}
body.dc-contraste button:not(.dc-op):not(.dc-voz-btn),body.dc-contraste a{filter:brightness(.78) contrast(1.2);outline:2px solid #000;outline-offset:-2px}
body.dc-contraste .pu-sec,body.dc-contraste .bc-panel{filter:brightness(.88) contrast(1.15)}
body.dc-contraste :focus-visible{outline:4px solid #ffd400!important;outline-offset:2px}
body.dc-contraste .bc-panel{background-image:none!important}
body.dc-contraste .zj-caja .tb-lleno span,body.dc-contraste .zj-caja .tb-lleno b,body.dc-contraste .zj-caja .tb-lleno small,body.dc-contraste .zj-caja .tb-lleno i{color:#fff!important}
.dc-voz-btn{position:fixed;left:6px;bottom:calc(var(--alto-ticker,48px) + 6px);z-index:95;border:3px solid #fff;border-radius:50%;width:46px;height:46px;padding:0;background:#1d4ed8;color:#fff;font-weight:900;font-size:22px;line-height:1;box-shadow:0 4px 12px rgba(0,0,0,.35)}
.dc-voz-btn.on{background:#b91c1c}
.dc-op{display:flex;align-items:center;gap:10px;width:100%;border:2px solid #cbd5e1;border-radius:14px;padding:10px 12px;background:#fff;color:#0f172a;font-weight:800;font-size:15px;text-align:left}
.dc-op b{margin-left:auto;min-width:54px;text-align:center;border-radius:999px;padding:3px 10px;background:#e2e8f0;color:#334155;font-size:13px}
.dc-op.on{border-color:#2E9E5B;background:#ecfdf3}.dc-op.on b{background:#2E9E5B;color:#fff}
`;

export function aplicarAccesibilidad() {
  try {
    if (!document.getElementById("dc-acc-css")) { const s = document.createElement("style"); s.id = "dc-acc-css"; s.textContent = CSS; document.head.appendChild(s); }
    document.body.classList.toggle("dc-contraste", lee("contraste"));
    document.body.classList.toggle("dc-quieto", lee("quieto"));
  } catch (e) {}
}
export function cambiarOpcion(n) {
  const nuevo = !lee(n);
  try { localStorage.setItem(CLAVES[n], nuevo ? "1" : "0"); } catch (e) {}
  aplicarAccesibilidad();
  if (n === "voz") { if (nuevo) hablar("Lectura en voz alta activada. Toca el botón azul para escuchar esta pantalla."); else detener(); }
  window.dispatchEvent(new CustomEvent("dcuates:acc"));
  return nuevo;
}
function usaAcc() {
  const [, f] = useState(0);
  useEffect(() => { const g = () => f((x) => x + 1); window.addEventListener("dcuates:acc", g); window.addEventListener("dcuates:letra", g); return () => { window.removeEventListener("dcuates:acc", g); window.removeEventListener("dcuates:letra", g); }; }, []);
}

// --- voz ---
const hayVoz = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
export function detener() { try { if (hayVoz()) window.speechSynthesis.cancel(); } catch (e) {} }
export function hablar(texto) {
  if (!hayVoz()) return false;
  try {
    const ss = window.speechSynthesis; ss.cancel();
    const limpio = String(texto).replace(/[\p{Extended_Pictographic}️‍]/gu, "").replace(/\s+/g, " ").trim();
    const trozos = limpio.match(/[^.!?:;]{1,180}[.!?:;]?/g) || [limpio];
    trozos.forEach((t) => { if (!t.trim()) return; const u = new SpeechSynthesisUtterance(t.trim()); u.lang = "es-MX"; u.rate = 0.95; ss.speak(u); });
    return true;
  } catch (e) { return false; }
}
function textoVisible() {
  const cajas = Array.from(document.querySelectorAll(".zj-caja")).filter((c) => c.offsetParent !== null || getComputedStyle(c).position === "fixed");
  const vis = cajas.filter((c) => c.getClientRects().length > 0);
  const el = vis.length ? vis[vis.length - 1] : (document.getElementById("camino-dcuates") || document.body);
  return el.innerText;
}
export function LeerVoz() {
  usaAcc();
  const [hablando, setH] = useState(false);
  useEffect(() => { aplicarAccesibilidad(); }, []);
  useEffect(() => { if (!hablando) return; const id = setInterval(() => { try { if (!window.speechSynthesis.speaking) setH(false); } catch (e) { setH(false); } }, 500); return () => clearInterval(id); }, [hablando]);
  if (!leerOpcion("voz") || !hayVoz()) return null;
  return <button type="button" className={"dc-voz-btn" + (hablando ? " on" : "")} aria-label={hablando ? "Detener lectura" : "Escuchar esta pantalla"} onClick={() => { if (hablando) { detener(); setH(false); } else setH(hablar(textoVisible())); }}>{hablando ? "⏹" : "🔊"}</button>;
}

// --- opciones (se usan en la bienvenida y en EXPLORA) ---
export function OpcionesLeer() {
  usaAcc();
  const n = leerLetra();
  const Fila = ({ id, e, t }) => { const on = leerOpcion(id); return <button type="button" className={"dc-op" + (on ? " on" : "")} aria-pressed={on} onClick={() => cambiarOpcion(id)}><span>{e} {t}</span><b>{on ? "Sí" : "No"}</b></button>; };
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button type="button" className={"dc-op" + (n > 0 ? " on" : "")} onClick={ciclarLetra}><span>🔠 Letra grande</span><b>{NOMBRES_LETRA[n]}</b></button>
      <Fila id="contraste" e="◐" t="Alto contraste" />
      <Fila id="quieto" e="🐢" t="Reducir movimiento" />
      {hayVoz() && <Fila id="voz" e="🔊" t="Leer en voz alta" />}
    </div>
  );
}
