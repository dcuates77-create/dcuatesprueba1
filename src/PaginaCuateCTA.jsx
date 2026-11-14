// BOTONES «TU PÁGINA CUATE» (e80) — se reutilizan en Ganar-Ganar, Tengo un negocio, Servicios especiales, Club y al pie de cada Página CUATE.
// Dos modalidades de alta (las dos llegan a «Registros» como Borrador de Página CUATE y las apruebas tú):
//   GRATUITO: con promociones para los Cuates, o aliado / patrocinador / altruista.
//   DE APORTACIÓN VOLUNTARIA: sin promociones por ahora; el acuerdo se platica por WhatsApp.
import React from "react";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";

export const abrirDirectorio = () => window.dispatchEvent(new CustomEvent("dcuates:directorio"));
export const abrirRegistroPagina = (mod) => { registrar("pagina_registro", { mod }); abrirRegistroPrevio("pagina", { valores: { mod } }); };

export default function PaginaCuateCTA({ compacto = false, directorio = false }) {
  return (
    <section className={"pc-cta" + (compacto ? " pc-c" : "")} data-testid="pagina-cta">
      <style>{CSS}</style>
      <h3>🏪 TU PÁGINA CUATE CON BENEFICIOS PARA TUS CLIENTES</h3>
      {!compacto && <p>Tu negocio con página propia: tu WhatsApp, tus promociones, tu Pase y el Club DCUATES. Elige cómo quieres empezar:</p>}
      <button type="button" className="pc-b pc-g" onClick={() => abrirRegistroPagina("Gratuita")}>
        <b>GRATUITO</b>
        <span>si tienes una o más promociones para los CUATES, o eres CUATE aliado, patrocinador o altruista</span>
      </button>
      <button type="button" className="pc-b pc-v" onClick={() => abrirRegistroPagina("Aportación voluntaria")}>
        <b>DE APORTACIÓN VOLUNTARIA</b>
        <span>si no tienes promociones o algún beneficio para los CUATES de la comunidad. Tú decides el valor de lo que podría ayudar a CRECER TU EMPRENDIMIENTO</span>
      </button>
      {directorio && <button type="button" className="pc-d" onClick={() => { registrar("pagina_directorio"); abrirDirectorio(); }}>🔎 Ver negocios CUATE</button>}
    </section>
  );
}

const CSS = `
.pc-cta{display:flex;flex-direction:column;gap:8px;margin:10px 0;padding:12px;border-radius:18px;background:#fff8e1;border:2px solid #e8c86a;text-align:left;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e}
.pc-cta h3{margin:0;font-size:15.5px;font-weight:900;line-height:1.2;color:#7a4a00}
.pc-cta p{margin:0;font-size:13.5px;font-weight:700;line-height:1.4}
.pc-b{display:flex;flex-direction:column;gap:3px;min-height:56px;padding:10px 12px;border:0;border-radius:14px;color:#fff;font:inherit;text-align:left;cursor:pointer}
.pc-b b{font-size:15px;font-weight:900;letter-spacing:.01em}
.pc-b span{font-size:12.5px;font-weight:700;line-height:1.35;opacity:.97}
.pc-g{background:#1F7A46}.pc-v{background:#B7791F}
.pc-d{min-height:46px;border:2px solid #7a4a00;border-radius:14px;background:#fff;color:#7a4a00;font:inherit;font-size:14px;font-weight:900;cursor:pointer}
.pc-c{margin:0;background:#fff}
`;
