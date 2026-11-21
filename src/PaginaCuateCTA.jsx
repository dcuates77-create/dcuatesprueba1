// BOTONES «TU PÁGINA CUATE» (e80) — se reutilizan en Ganar-Ganar, Tengo un negocio, Servicios especiales, Club y al pie de cada Página CUATE.
// Dos modalidades de alta (las dos llegan a «Registros» como Borrador de Página CUATE y las apruebas tú):
//   TU PÁGINA GRATUITA: con apoyo a causas (aportación voluntaria sobre lo que ayudemos a vender y conectar), o aliado / patrocinador / multiplicador; antes decía GRATUITO. Antes: con promociones para los Cuates, o aliado / patrocinador / altruista.
//   TU PÁGINA DE APORTACIÓN VOLUNTARIA: sin promociones por ahora; el acuerdo se platica por WhatsApp.
import React from "react";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { abrirAsistente } from "./AsistentePagina.jsx";
import { texto, useTextos } from "./utilidades/tema.js";

export const abrirDirectorio = () => window.dispatchEvent(new CustomEvent("dcuates:directorio"));
export const abrirRegistroPagina = (mod) => { registrar("pagina_registro", { mod }); abrirRegistroPrevio("pagina", { valores: { mod } }); };

export default function PaginaCuateCTA({ compacto = false, directorio = false }) {
  useTextos();
  return (
    <section className={"pc-cta" + (compacto ? " pc-c" : "")} data-testid="pagina-cta">
      <style>{CSS}</style>
      <h3>{texto("cta_titulo", "🏪 TU PÁGINA CUATE CON BENEFICIOS PARA TI Y TUS CLIENTES")}</h3>
      {!compacto && <p>{texto("cta_intro", "Tu emprendimiento con página propia: tu WhatsApp, tus promociones, tu Pase y el Club DCUATES. Elige cómo quieres empezar:")}</p>}
      <button type="button" className="pc-b pc-a" data-testid="cta-asistente" onClick={() => { registrar("pagina_asistente"); abrirAsistente(); }}>
        <b>🧩 ARMA TU PÁGINA PASO A PASO</b>
        <span>{texto("cta_asist_d", "SI YA TIENES TU FOLIO APROBADO, INGRESA LOS DATOS DE TU PÁGINA: elige tu giro, usa textos de ejemplo, mira cómo se verá y envíala para revisión")}</span>
      </button>
      <button type="button" className="pc-b pc-g" onClick={() => abrirRegistroPagina("Gratuita")}>
        <b>{texto("cta_gratis_t", "TU PÁGINA GRATUITA")}</b>
        <span>{texto("cta_gratis_d", "Es gratuita si APOYAS o deseas APOYAR CAUSAS con una aportación voluntaria de lo que te podamos AYUDAR A VENDER Y CONECTAR a través de la página y nuestros distintos espacios publicitarios; o si eres ALIADO, PATROCINADOR o un VALIOSO ELEMENTO MULTIPLICADOR PARA NUESTRAS COMUNIDADES. REGÍSTRATE Y CONTÁCTANOS PARA LOGRAR LOS MEJORES ACUERDOS GANAR-GANAR PARA TODOS. ¡¡¡REGÍSTRATE AQUÍ!!!")}</span>
      </button>
      <button type="button" className="pc-b pc-v" onClick={() => abrirRegistroPagina("Aportación voluntaria")}>
        <b>{texto("cta_vol_t", "TU PÁGINA DE APORTACIÓN VOLUNTARIA")}</b>
        <span>{texto("cta_vol_d", "si no tienes promociones o algún beneficio para los CUATES de la comunidad. Tú decides el valor de lo que podría ayudar a CRECER TU EMPRENDIMIENTO. ¡¡¡REGÍSTRATE AQUÍ!!!")}</span>
      </button>
      {directorio && <button type="button" className="pc-d" onClick={() => { registrar("pagina_directorio"); abrirDirectorio(); }}>🔎 Ver emprendimientos CUATE</button>}
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
.pc-a{background:#0E7490}.pc-g{background:var(--dc-verde,#1F7A46)}.pc-v{background:var(--dc-dorado,#B7791F)}
.pc-d{min-height:46px;border:2px solid #7a4a00;border-radius:14px;background:#fff;color:#7a4a00;font:inherit;font-size:14px;font-weight:900;cursor:pointer}
.pc-c{margin:0;background:#fff}
`;
