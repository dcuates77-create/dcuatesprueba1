// SUBTIPOS DE UNA PUERTA (e54) — dentro de cada «Soy…» la persona elige qué la describe mejor y ve su protocolo de 3 pasos
// (qué hace, qué ofrece DCUATES, qué se espera). Puede sumarse a la red con un formulario corto (llega a tu hoja) o
// platicarlo por WhatsApp. Las puertas sensibles NO guardan la elección ni piden datos.
import React, { useEffect, useState } from "react";
import FormMini from "./FormMini.jsx";
import { subtiposDe } from "./utilidades/perfilesHoja.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";

const lee = (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
const guarda = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) { /* nada */ } };

const OTRO = "Otro tipo…";
const OTRO_FICHA = { s: OTRO, i: "", a: ["Cuéntanos con tus palabras cómo te describes.", "Dinos qué solicitas o qué puedes ofrecer.", "Te contactamos por WhatsApp y armamos tu camino."], o: "Un camino a tu medida, aunque tu perfil no esté en la lista.", e: "Que nos cuentes quién eres y qué buscas.", d: "Nombre, WhatsApp, cómo te describes y qué solicitas.", otro: true };

export default function SubtiposPuerta({ p }) {
  const [, tic] = useState(0);
  const privada = !!(p.sensible || p.efimera);
  const lista = subtiposDe(p.id);
  const [sel, setSel] = useState(() => (privada ? "" : lee("dc_sub_" + p.id)));
  const [form, setForm] = useState(false);
  useEffect(() => { const f = () => tic((x) => x + 1); window.addEventListener("dcuates:perfiles-cambio", f); return () => window.removeEventListener("dcuates:perfiles-cambio", f); }, []);
  if (!lista.length) return null;
  const actual = sel === OTRO ? OTRO_FICHA : (lista.find((x) => x.s === sel) || null);
  const elegir = (s) => { const nuevo = sel === s ? "" : s; setSel(nuevo); setForm(false); if (!privada) guarda("dc_sub_" + p.id, nuevo); };
  const wa = (x) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`¡Hola DCUATES! Entré por «${p.titulo}» y me describo como: ${x.s}. Me gustaría que me orienten con mis 3 pasos. Mi nombre es: ___`)}`;
  const otro = !!(actual && actual.otro);
  const cfg = actual && {
    tipo: "Registro de red", perfil: `${p.titulo} · ${otro ? "Otro tipo" : actual.s}`, boton: "Sumarme a la red",
    folio: "RED", proyecto: otro ? "Red · Otro tipo" : "Red · " + p.titulo,
    gracias: "¡Gracias por sumarte! 💚",
    wa: otro ? `¡Hola DCUATES! Entré por «${p.titulo}» y mi tipo de perfil no estaba en la lista.` : `¡Hola DCUATES! Quiero sumarme a la red como: ${actual.s}.`,
    campos: [
      { k: "n", etiqueta: "Tu nombre", campo: "Nombre", req: true, max: 80, ph: "Ej. Ana López" },
      { k: "c", etiqueta: "Tu WhatsApp", campo: "Contacto", req: true, max: 20, ph: "10 dígitos. Ej. 5512345678" },
      ...(otro
        ? [{ k: "d", etiqueta: "¿Cómo te describes?", tipo: "area", max: 300, req: true, ph: "Ej. Soy repartidor y conozco la colonia" },
           { k: "q", etiqueta: "¿Qué solicitas o qué puedes ofrecer?", tipo: "area", max: 400, req: true }]
        : [{ k: "o", etiqueta: "Qué puedes ofrecer", tipo: "area", max: 300, ph: "Ej. Doy clases de guitarra los sábados" },
           { k: "q", etiqueta: "Qué te hace falta o te interesa", tipo: "area", max: 300, ph: "Ej. Busco un espacio para una exposición" }]),
    ],
  };
  return (
    <div className="sb" style={{ "--pc": p.c }}>
      <style>{CSS}</style>
      <p className="zj-et">🧩 ¿Qué te describe mejor?</p>
      <div className="sb-ch" role="group" aria-label="¿Qué te describe mejor?">
        {[...lista.map((x) => x.s), OTRO].map((nom) => <button type="button" key={nom} aria-pressed={sel === nom} className={(sel === nom ? "on" : "") + (nom === OTRO ? " sb-otro" : "")} onClick={() => elegir(nom)}>{nom}</button>)}
      </div>
      {actual && (
        <div className="sb-card" role="region" aria-label={"Tu camino como " + actual.s}>
          <b className="sb-t">TU CAMINO · {actual.s}</b>
          {actual.i && <small className="sb-i">Te interesa: {actual.i}</small>}
          <ol className="sb-ol">{actual.a.filter(Boolean).map((t, i) => <li key={i}><span>PASO {i + 1}</span>{t}</li>)}</ol>
          {actual.o && <p className="sb-p"><b>DCUATES te ofrece:</b> {actual.o}</p>}
          {actual.e && <p className="sb-p"><b>Te pedimos:</b> {actual.e}</p>}
          {actual.d && !privada && <p className="sb-p"><b>Datos que pedimos:</b> {actual.d}</p>}
          {privada && <p className="sb-p">🔒 Aquí no se piden datos ni se guarda tu elección.</p>}
          {!form && (
            <div className="sb-b">
              {!privada && <button type="button" className="sb-s" onClick={() => setForm(true)}>📝 Sumarme a la red</button>}
              <a className="sb-w" href={wa(actual)} target="_blank" rel="noopener noreferrer">💬 Platicarlo por WhatsApp</a>
            </div>
          )}
          {form && cfg && <FormMini key={actual.s} cfg={cfg} clave={"sb-" + p.id} />}
        </div>
      )}
    </div>
  );
}

const CSS = `
.sb-ch{display:flex;flex-wrap:wrap;gap:6px}
.sb-ch button{min-height:44px;padding:4px 12px;border-radius:999px;border:2px solid var(--pc);background:#fff;color:var(--pc);font:inherit;font-weight:900;font-size:14px;line-height:1.1;cursor:pointer;text-align:left}
.sb-ch button.on{background:var(--pc);color:#fff}
.sb-ch .sb-otro{border-style:dashed}
.sb-card{margin-top:8px;padding:10px;border:2px solid var(--pc);border-left-width:7px;border-radius:14px;background:#fff;color:#1f2a37;display:flex;flex-direction:column;gap:6px;text-align:left}
.sb-t{font-size:14.5px;font-weight:900;line-height:1.15;color:var(--pc)}
.sb-i{font-size:13.5px;font-weight:700;color:#4a5564}
.sb-ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.sb-ol li{font-size:14.5px;font-weight:800;line-height:1.25;padding:6px 8px;border-radius:10px;background:#f3f5f7}
.sb-ol li span{display:block;font-size:12px;font-weight:900;letter-spacing:.04em;color:var(--pc)}
.sb-p{margin:0;font-size:13.5px;font-weight:700;line-height:1.3;color:#3b4654}
.sb-b{display:flex;flex-wrap:wrap;gap:8px}
.sb-s,.sb-w{min-height:48px;padding:0 16px;border-radius:999px;border:0;font:inherit;font-weight:900;font-size:14.5px;cursor:pointer;display:inline-flex;align-items:center;text-decoration:none;color:#fff}
.sb-s{background:#BF360C;box-shadow:0 3px 0 #8a2607}.sb-w{background:#25a244}
`;
