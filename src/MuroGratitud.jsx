// MURO DE GRATITUD Y RECONOCIMIENTOS (e43, fusionado en e68).
// Qué se ve aquí:
//   1) Un botón para dejar un «gracias» o proponer un reconocimiento (registro con folio GRA-…) y otro para ver ejemplos.
//   2) Los «gracias» generales de DCUATES a cada grupo.
//   3) Los mensajes PUBLICADOS: salen de tu hoja de Google, pestaña «Registros», filas con Sección = «Muro de gratitud»,
//      Permiso de publicar = Sí y ¿Publicar? = Sí (ese «Sí» es tu visto bueno). Se entrega sin teléfono ni nombre de contacto.
//   4) (Opcional, como antes) mensajes capturados a mano en Baserow, tabla ENLACES:
//      MURO MENSAJE (obligatoria) · MURO DE · MURO PARA · MURO APROBADO (casilla opcional).
import React, { useEffect, useState } from "react";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { cargarPublicados } from "./utilidades/hojaPublica.js";
import { AGRADECIMIENTOS, AGRADECIMIENTOS_INTRO, AGRADECIMIENTOS_TITULO, EJEMPLOS_GRACIAS, EJEMPLOS_RECONOCIMIENTOS, SECCION_MURO } from "./datos/gratitud.js";

const COLORES = ["#FFF4D6", "#FDE8F1", "#E3F3E9", "#E6F0FA", "#F3EFFF"];

// AGRADECIMIENTOS GENERALES: un «gracias» de DCUATES a cada grupo y, debajo, un botón para hacer una mención particular.
function Generales() {
  return (
    <section className="mg-gen" aria-label={AGRADECIMIENTOS_TITULO}>
      <h3 className="mg-gt">💛 {AGRADECIMIENTOS_TITULO}</h3>
      <p className="mg-gi">{AGRADECIMIENTOS_INTRO}</p>
      <ul className="mg-gl">
        {AGRADECIMIENTOS.map((g, i) => (
          <li key={g.id} className="mg-g" style={{ background: COLORES[i % COLORES.length] }}>
            <p className="mg-gt2"><span aria-hidden="true">{g.ico}</span> {g.t}</p>
            <p className="mg-gd">{g.d}</p>
            <button type="button" className="mg-gb" onClick={() => { registrar("muro_mencion_abrir", { g: g.id }); abrirRegistroPrevio("gratitud", { perfil: g.perfil, valores: { q: "Dar las gracias a alguien" } }); }}>💛 Hacer una mención particular</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Ejemplos() {
  const [ab, setAb] = useState(false);
  return (
    <div className="mg-ej">
      <button type="button" className="mg-gb" aria-expanded={ab} onClick={() => { registrar("muro_ejemplos"); setAb((v) => !v); }}>{ab ? "Ocultar ejemplos" : "👀 Ver ejemplos de reconocimientos"}</button>
      {ab && (
        <div className="mg-ejc" data-testid="muro-ejemplos">
          <p><b>Reconocimientos que podemos entregar y difundir:</b></p>
          <ul>{EJEMPLOS_RECONOCIMIENTOS.map((x) => <li key={x}>{x}</li>)}</ul>
          <p><b>Ejemplos de «gracias»:</b></p>
          <ul>{EJEMPLOS_GRACIAS.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

// Casilla de aprobación (Baserow): si existe la columna MURO APROBADO, solo salen los mensajes con la casilla marcada.
const aprobado = (v) => v === true || /^(true|s[ií]|1|x)$/i.test(String(v || "").trim());

export default function MuroGratitud({ filas = [] }) {
  const [hoja, setHoja] = useState([]);
  useEffect(() => { let vivo = true; cargarPublicados().then((l) => { if (vivo) setHoja((l || []).filter((x) => x.sec === SECCION_MURO)); }); return () => { vivo = false; }; }, []);
  const usaAprobacion = filas.some((f) => f && Object.prototype.hasOwnProperty.call(f, "MURO APROBADO"));
  const deBaserow = filas
    .filter((f) => f && f["MURO MENSAJE"] && String(f["MURO MENSAJE"]).trim() !== "" && (!usaAprobacion || aprobado(f["MURO APROBADO"])))
    .map((f) => ({
      msg: String(f["MURO MENSAJE"]).trim(),
      de: (f["MURO DE"] && String(f["MURO DE"]).trim()) || "Alguien de la comunidad",
      para: (f["MURO PARA"] && String(f["MURO PARA"]).trim()) || "",
      tipo: ""
    }));
  const deHoja = hoja.map((x) => ({ msg: x.d || "", de: x.f || "Alguien de la comunidad", para: x.t || "", tipo: x.cat || "" })).filter((m) => m.msg);
  const lista = [...deHoja, ...deBaserow].slice(0, 30);
  const wa = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent("¡Hola DCUATES! Quiero dejar un mensaje de gratitud en el Muro.\n\nPara: \nMensaje: \nMi nombre (o ‘anónimo’): ");
  return (
    <div className="mg-raiz" id="muro-gratitud">
      <style>{CSS}</style>
      <button type="button" className="mg-b" data-testid="muro-dejar" onClick={() => { registrar("muro_dejar_mensaje"); abrirRegistroPrevio("gratitud"); }}>💛 Deja un gracias o propón un reconocimiento</button>
      <Ejemplos />
      <Generales />
      <h3 className="mg-gt">🗣️ Lo que dice la comunidad</h3>
      {lista.length === 0 ? (
        <p className="mg-vacio">Aquí aparecerán los gracias y reconocimientos de la comunidad. ¡Sé la primera persona en dejar el tuyo! 💛</p>
      ) : (
        <ul className="mg-lista" data-testid="muro-lista">
          {lista.map((m, i) => (
            <li key={i} className="mg-n" style={{ background: COLORES[i % COLORES.length] }}>
              {m.tipo ? <small className="mg-tipo">🏅 {m.tipo}</small> : null}
              <p>“{m.msg}”</p>
              <small>{m.para ? `Para ${m.para} · ` : ""}De {m.de}</small>
            </li>
          ))}
        </ul>
      )}
      <small className="mg-nota">Revisamos cada mensaje antes de publicarlo. ¿Prefieres escribirnos directo? <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => registrar("muro_dejar_wa")}>Por WhatsApp</a></small>
    </div>
  );
}

const CSS = `
.mg-raiz{padding:4px 0}
.mg-gen{margin:14px 0}
.mg-gt{margin:12px 0 4px;font-size:18px;font-weight:900;color:#0f2d1e}
.mg-gi{margin:0 0 10px;font-size:14.5px;font-weight:700;line-height:1.4;color:#3d5a4a}
.mg-gl{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.mg-g{border-radius:14px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.mg-gt2{margin:0 0 3px;font-size:15.5px;font-weight:900;line-height:1.25;color:#0f2d1e}
.mg-gd{margin:0 0 8px;font-size:14.5px;font-weight:700;line-height:1.4;color:#2f4d3f}
.mg-gb{min-height:44px;padding:0 16px;border-radius:999px;border:2px solid #B7791F;background:#fff;color:#8a5a0c;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.mg-ej{margin:8px 0 0}
.mg-ejc{margin-top:6px;padding:8px 12px;background:#FFF4D6;border-radius:12px}
.mg-ejc p{margin:4px 0;font-size:14px;color:#0f2d1e}.mg-ejc ul{margin:0 0 4px;padding-left:18px}.mg-ejc li{font-size:13.5px;font-weight:700;line-height:1.35;margin:2px 0;color:#2f4d3f}
.mg-vacio{margin:6px 2px 12px;font-size:15px;font-weight:700;color:#3d5a4a;line-height:1.4}
.mg-lista{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:8px}
.mg-n{border-radius:14px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.mg-n p{margin:0 0 4px;font-size:15.5px;font-weight:800;line-height:1.35;color:#0f2d1e}
.mg-n small{font-size:13px;font-weight:800;color:#5a4a16}
.mg-tipo{display:block;margin-bottom:2px}
.mg-b{display:block;width:100%;border:0;text-align:center;min-height:48px;padding:8px 12px;line-height:1.2;border-radius:999px;background:#B7791F;color:#fff;font:inherit;font-weight:900;font-size:15px;cursor:pointer}
.mg-nota{display:block;text-align:center;margin-top:6px;font-weight:700;color:#5b6b62}
.mg-nota a{color:#128c7e;font-weight:900}
`;
