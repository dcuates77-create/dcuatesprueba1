// MURO DE GRATITUD (e43) — mensajes de agradecimiento de la comunidad, alimentados desde Baserow.
// Tabla ENLACES, una fila por mensaje, con estas columnas:
//   MURO MENSAJE  (obligatoria: el texto de gratitud)
//   MURO DE       (quién agradece; opcional, si está vacío sale "Alguien de la comunidad")
//   MURO PARA     (a quién se agradece; opcional)
//   MURO APROBADO (casilla, opcional): si existe, solo se publican los mensajes con la casilla marcada
// Tú revisas y apruebas: solo sale lo que tú capturas en Baserow (no se publica nada automáticamente).
import React, { useState } from "react";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { registrar } from "./analitica.js";
import FormMini from "./FormMini.jsx";
import { AGRADECIMIENTOS, AGRADECIMIENTOS_INTRO, AGRADECIMIENTOS_TITULO } from "./datos/gratitud.js";

// AGRADECIMIENTOS GENERALES (e53): un «gracias» de DCUATES a cada grupo y, debajo, una mención particular (llega a tu hoja, pestaña «Mensajes», Tipo «Gratitud»).
function Generales() {
  const [ab, setAb] = useState(null);
  return (
    <section className="mg-gen" aria-label={AGRADECIMIENTOS_TITULO}>
      <h3 className="mg-gt">💛 {AGRADECIMIENTOS_TITULO}</h3>
      <p className="mg-gi">{AGRADECIMIENTOS_INTRO}</p>
      <ul className="mg-gl">
        {AGRADECIMIENTOS.map((g, i) => {
          const abierto = ab === g.id;
          const cfg = {
            tipo: "Gratitud", perfil: g.perfil, boton: "Enviar mi mención",
            gracias: "¡Gracias por agradecer! 💛 Lo revisamos y, si quieres, lo publicamos en el Muro.",
            wa: `¡Hola DCUATES! Quiero hacer una mención de gratitud (${g.perfil}).`,
            campos: [
              { k: "para", etiqueta: "¿A quién quieres agradecer?", ph: "Nombre de la persona, negocio u organización", max: 90, req: true },
              { k: "porque", etiqueta: "¿Por qué le agradeces?", tipo: "area", ph: "Cuéntanos qué hizo y cómo te ayudó", max: 450, req: true },
              { k: "nombre", etiqueta: "Tu nombre (o escribe «anónimo»)", campo: "Nombre", max: 60 },
              { k: "contacto", etiqueta: "Tu WhatsApp, por si necesitamos confirmar", campo: "Contacto", max: 30 }
            ]
          };
          return (
            <li key={g.id} className="mg-g" style={{ background: COLORES[i % COLORES.length] }}>
              <p className="mg-gt2"><span aria-hidden="true">{g.ico}</span> {g.t}</p>
              <p className="mg-gd">{g.d}</p>
              <button type="button" className="mg-gb" aria-expanded={abierto} onClick={() => { registrar("muro_mencion_abrir", { g: g.id }); setAb(abierto ? null : g.id); }}>{abierto ? "Cerrar" : "💛 Hacer una mención particular"}</button>
              {abierto && <FormMini key={g.id} cfg={cfg} clave={"mg-" + g.id} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const COLORES = ["#FFF4D6", "#FDE8F1", "#E3F3E9", "#E6F0FA", "#F3EFFF"];

// Casilla de aprobación: si creas la columna MURO APROBADO (tipo casilla/Boolean) en Baserow,
// solo salen los mensajes con la casilla marcada. Si la columna no existe, salen todos.
const aprobado = (v) => v === true || /^(true|s[ií]|1|x)$/i.test(String(v || "").trim());

export default function MuroGratitud({ filas = [] }) {
  const usaAprobacion = filas.some((f) => f && Object.prototype.hasOwnProperty.call(f, "MURO APROBADO"));
  const lista = filas
    .filter((f) => f && f["MURO MENSAJE"] && String(f["MURO MENSAJE"]).trim() !== "" && (!usaAprobacion || aprobado(f["MURO APROBADO"])))
    .slice(0, 30)
    .map((f) => ({
      msg: String(f["MURO MENSAJE"]).trim(),
      de: (f["MURO DE"] && String(f["MURO DE"]).trim()) || "Alguien de la comunidad",
      para: (f["MURO PARA"] && String(f["MURO PARA"]).trim()) || ""
    }));
  const wa = "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent("¡Hola DCUATES! Quiero dejar un mensaje de gratitud en el Muro.\n\nPara: \nMensaje: \nMi nombre (o ‘anónimo’): ");
  return (
    <div className="mg-raiz" id="muro-gratitud">
      <style>{CSS}</style>
      <Generales />
      {lista.length === 0 ? (
        <p className="mg-vacio">Aquí aparecerán los mensajes de gratitud de la comunidad. ¡Sé la primera persona en dejar el tuyo! 💛</p>
      ) : (
        <ul className="mg-lista">
          {lista.map((m, i) => (
            <li key={i} className="mg-n" style={{ background: COLORES[i % COLORES.length] }}>
              <p>“{m.msg}”</p>
              <small>{m.para ? `Para ${m.para} · ` : ""}De {m.de}</small>
            </li>
          ))}
        </ul>
      )}
      <a className="mg-b" onClick={() => registrar("muro_dejar_mensaje")} href={wa} target="_blank" rel="noopener noreferrer">💛 Dejar un mensaje de gratitud</a>
      <small className="mg-nota">Revisamos cada mensaje antes de publicarlo.</small>
    </div>
  );
}

const CSS = `
.mg-raiz{padding:4px 0}
.mg-gen{margin:0 0 14px}
.mg-gt{margin:0 0 4px;font-size:18px;font-weight:900;color:#0f2d1e}
.mg-gi{margin:0 0 10px;font-size:14.5px;font-weight:700;line-height:1.4;color:#3d5a4a}
.mg-gl{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.mg-g{border-radius:14px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.mg-gt2{margin:0 0 3px;font-size:15.5px;font-weight:900;line-height:1.25;color:#0f2d1e}
.mg-gd{margin:0 0 8px;font-size:14.5px;font-weight:700;line-height:1.4;color:#2f4d3f}
.mg-gb{min-height:44px;padding:0 16px;border-radius:999px;border:2px solid #B7791F;background:#fff;color:#8a5a0c;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.mg-vacio{margin:6px 2px 12px;font-size:15px;font-weight:700;color:#3d5a4a;line-height:1.4}
.mg-lista{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:8px}
.mg-n{border-radius:14px;padding:10px 12px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
.mg-n p{margin:0 0 4px;font-size:15.5px;font-weight:800;line-height:1.35;color:#0f2d1e}
.mg-n small{font-size:13px;font-weight:800;color:#5a4a16}
.mg-b{display:block;text-align:center;min-height:48px;line-height:48px;border-radius:999px;background:#B7791F;color:#fff;font-weight:900;text-decoration:none;font-size:15px}
.mg-nota{display:block;text-align:center;margin-top:6px;font-weight:700;color:#5b6b62}
`;
