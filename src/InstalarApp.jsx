// Botón "Instalar DCUATES como app": Android/PC usan el aviso del navegador; iPhone y otros ven los pasos.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { esIOS, instalarApp, puedeInstalar, suscribirPWA, yaInstalada } from "./pwa.js";
import { useAtras } from "./atras.js";

export default function InstalarApp() {
  const [, forzar] = useState(0);
  const [guia, setGuia] = useState(false);
  useAtras(guia, () => setGuia(false));
  useEffect(() => suscribirPWA(() => forzar((n) => n + 1)), []);
  if (yaInstalada()) return null;
  const tocar = async () => { if (puedeInstalar()) { await instalarApp(); forzar((n) => n + 1); } else setGuia(true); };
  const ios = esIOS();
  return (
    <>
      <button type="button" className="ia-btn" onClick={tocar}>📲 Instalar DCUATES como app</button>
      {guia && createPortal(
        <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Instalar DCUATES" onClick={(e) => { if (e.target === e.currentTarget) setGuia(false); }}>
          <div className="zj-caja">
            <div className="zj-cab"><b>📲 Instalar DCUATES</b><button type="button" className="zj-x" onClick={() => setGuia(false)} aria-label="Cerrar">✕</button></div>
            <p className="zj-p">Tendrás el ícono en tu pantalla de inicio y se abrirá como una app, sin barra del navegador.</p>
            {ios ? (
              <ol className="ia-pasos"><li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (cuadro con flecha hacia arriba).</li><li>Elige <b>«Agregar a inicio»</b> y confirma.</li></ol>
            ) : (
              <ol className="ia-pasos"><li><b>Android (Chrome):</b> toca los tres puntos ⋮ y elige <b>«Instalar app»</b> o <b>«Agregar a la pantalla principal»</b>.</li><li><b>PC (Chrome o Edge):</b> en la barra de direcciones toca el ícono de instalar ⊕ y confirma.</li><li><b>iPhone:</b> en Safari, Compartir → <b>«Agregar a inicio»</b>.</li></ol>
            )}
          </div>
        </div>, document.body)}
      <style>{`
.ia-btn{display:block;width:100%;margin-top:10px;min-height:48px;border:2px solid rgba(255,255,255,.9);border-radius:14px;background:rgba(255,255,255,.14);color:#fff;font-family:inherit;font-size:15px;font-weight:900;cursor:pointer}
.ia-pasos{margin:8px 0 4px;padding-left:20px;font-size:15px;font-weight:700;line-height:1.4;display:flex;flex-direction:column;gap:8px;color:#1f2a37}
`}</style>
    </>
  );
}
