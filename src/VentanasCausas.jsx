// VENTANAS DE CAUSAS (e91): «Apoyo voluntario», «Casos de éxito» y «Ecatepets · bienestar animal» ya no son partes de la
// pestaña CAUSAS (que ahora solo trae botones): cada una abre su propia ventana, con el formato estándar (logo, compartir, cerrar).
// Evento: dcuates:causa-vent  (detail: "apoyo" | "exito" | "animal").  Enlaces: #donaciones · #chuy-video · #extraviados-registro.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import BotonCompartir from "./BotonCompartir.jsx";
import CarruselPortada from "./CarruselPortada";
import { LogoDcuates } from "./componentes/LogoDcuates.jsx";
import { BloqueApoyo, BloqueExito, BloqueAnimal } from "./componentes/pestanas/CausasBloques.jsx";
import { registrar } from "./analitica.js";

const VENT = {
  apoyo: { t: "Apoyo voluntario", e: "🙏", c: "#0E7490", hash: "donaciones", txt: "Tu tiempo, tu talento o tus recursos cambian vidas" },
  exito: { t: "Casos de éxito", e: "🌟", c: "#2E9E5B", hash: "chuy-video", txt: "Mira una causa que sí se logró: Chuy, el Sapo Soñador" },
  animal: { t: "Ecatepets · Bienestar animal", e: "🐾", c: "#E5484D", hash: "extraviados-registro", txt: "Ayúdanos a difundir y a encontrar mascotas, personas y cosas" }
};
const HASH_A_VENT = { donaciones: "apoyo", "chuy-video": "exito", "extraviados-registro": "animal", "registro-extraviados": "animal" };
const TAB_CAUSAS = { id: "causas", label: "Causas", emoji: "❤️", color: "#E5484D", pastel: "#FFE9EB", boton: "#C2410C" };

export function abrirCausaVent(v) { window.dispatchEvent(new CustomEvent("dcuates:causa-vent", { detail: v })); }

export default function VentanasCausas({ reelItems = [], cargando = false, animalProps = {} }) {
  const [v, setV] = useState(null);
  const oculta = useAtras(!!v, () => setV(null), { hub: true });
  useEffect(() => {
    const alEvento = (e) => { if (VENT[e.detail]) { registrar("causa_ventana", { v: e.detail }); setV(e.detail); } };
    const alHash = () => {
      const id = decodeURIComponent(window.location.hash.replace("#", ""));
      if (HASH_A_VENT[id]) { setV(HASH_A_VENT[id]); try { window.history.replaceState(null, "", window.location.pathname + window.location.search); } catch (x) { /* nada */ } }
    };
    alHash();
    window.addEventListener("dcuates:causa-vent", alEvento);
    window.addEventListener("hashchange", alHash);
    return () => { window.removeEventListener("dcuates:causa-vent", alEvento); window.removeEventListener("hashchange", alHash); };
  }, []);
  if (!v) return null;
  const d = VENT[v];
  const otras = Object.keys(VENT).filter((k) => k !== v);
  return createPortal(
    <div className="ve-ov" role="dialog" aria-modal="true" aria-label={d.t} style={oculta ? { display: "none" } : undefined} data-testid={"causa-vent-" + v}>
      <style>{CSS}</style>
      <header className="ve-h">
        <LogoDcuates alto={30} />
        <span className="ve-s" />
        <BotonCompartir key={v} variante="circulo" hash={d.hash} titulo={d.t + " — DCUATES"} texto={d.txt} />
        <button type="button" className="ve-x" onClick={() => setV(null)} aria-label="Cerrar" data-testid="causa-vent-cerrar">✕</button>
      </header>
      <div className="ve-cuerpo">
        <h2 className="ve-t" style={{ borderColor: d.c }}><span aria-hidden="true">{d.e}</span> {d.t}</h2>
        {v === "apoyo" && <BloqueApoyo />}
        {v === "exito" && <BloqueExito />}
        {v === "animal" && (
          <>
            <p className="ve-intro">Apoyo en la búsqueda de mascotas extraviadas, y fomento de la adopción y el cuidado animal responsable en conjunto con los vecinos de DCUATES.</p>
            <button type="button" className="ve-proy" onClick={() => { setV(null); setTimeout(() => { window.location.hash = "#proyecto-ecatepets"; }, 200); }} data-testid="causa-vent-proyecto">🐾 Conoce el proyecto Ecatepets <i>›</i></button>
            {(cargando || reelItems.length > 0) && (
              <div className="ve-reel" id="reel-videos" data-testid="reel-causas">
                <CarruselPortada items={reelItems} tab={TAB_CAUSAS} slogan="🎥 Videos que inspiran" reel cargando={cargando} />
              </div>
            )}
            <BloqueAnimal {...animalProps} />
          </>
        )}
        <div className="ve-mas" data-testid="causa-vent-mas">
          <b>Más en Causas</b>
          {otras.map((k) => (
            <button key={k} type="button" onClick={() => { setV(k); registrar("causa_ventana", { v: k }); }} style={{ borderColor: VENT[k].c, color: VENT[k].c }} data-testid={"causa-vent-ir-" + k}><span aria-hidden="true">{VENT[k].e}</span> {VENT[k].t} <i>›</i></button>
          ))}
          <button type="button" className="ve-fin" onClick={() => setV(null)}>⌂ Volver a Causas</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.ve-ov{position:fixed;inset:0;z-index:96;background:#FBF6EC;display:flex;flex-direction:column;font-family:inherit;color:#2b2b2b}
.ve-h{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border-bottom:1px solid #e7e0d0}.ve-s{flex:1}
.ve-x{width:40px;height:40px;border-radius:50%;border:0;background:#eceff1;color:#333;font-size:18px;cursor:pointer;flex:none}
.ve-cuerpo{flex:1;overflow-y:auto;padding:12px 14px 40px;max-width:560px;width:100%;margin:0 auto;box-sizing:border-box;display:flex;flex-direction:column;gap:12px}
.ve-cuerpo *{max-width:100%;box-sizing:border-box}.ve-cuerpo a,.ve-cuerpo p{overflow-wrap:anywhere;word-break:break-word}
.ve-t{margin:0;font-size:22px;font-weight:900;color:#0f2d1e;border-bottom:4px solid;padding-bottom:6px}
.ve-intro{margin:0;font-size:15px;font-weight:700;line-height:1.35;color:#334}
.ve-proy{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:8px;min-height:48px;padding:8px 14px;border-radius:14px;background:#E5484D;color:#fff;font-weight:900;font-size:15px}.ve-proy i{margin-left:auto;font-style:normal;font-size:22px}
.ve-reel{border-radius:16px;overflow:hidden}
.ve-mas{display:flex;flex-direction:column;gap:8px;margin-top:6px;padding-top:12px;border-top:2px dashed #d9cfb6}.ve-mas>b{font-size:13px;text-transform:uppercase;letter-spacing:.8px;color:#555}
.ve-mas button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:8px;min-height:48px;padding:8px 14px;border:2px solid;border-radius:14px;background:#fff;font-weight:800;font-size:15px}.ve-mas button i{margin-left:auto;font-style:normal;font-size:20px}
.ve-mas .ve-fin{justify-content:center;border-color:#0f2d1e;color:#0f2d1e}
.ve-x:focus-visible,.ve-mas button:focus-visible,.ve-proy:focus-visible{outline:3px solid #FFD54F;outline-offset:2px}
`;
