// APOYO GRATUITO: ventana con teléfonos y enlaces de ayuda (psicológica, ciberdelitos, local). Se abre con el evento dcuates:abrir-apoyo.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { APOYO, CIBERNETICA, AYUDA_LOCAL, FECHA_REVISION, ANIMAL_SUGERENCIAS, ANIMAL_TELEFONOS } from "./datos/apoyo.js";
import { ejecutar } from "./datos/secciones.js";

const COL = ["#2E9E5B", "#7a5ad8", "#C2410C", "#1B6F8A", "#C2255C"];
export const abrirApoyo = () => window.dispatchEvent(new CustomEvent("dcuates:abrir-apoyo"));

export function Fila({ f, i = 0 }) {
  const [e, nombre, tel, mostrar, nota, url] = f;
  const href = tel ? "tel:" + tel : url;
  const ext = !tel && /^https?:/.test(url);
  return (
    <a className="ap-fila" style={{ background: COL[i % COL.length] }} href={href || undefined} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className="ap-e">{e}</span>
      <span className="ap-t"><b>{nombre}</b><i>{mostrar}</i>{nota && <small>{nota}</small>}</span>
    </a>
  );
}
export const ESTILO_AP = `.ap-fila{display:flex;align-items:center;gap:10px;padding:10px 12px;border:2px solid #fff;border-radius:14px;color:#fff;text-decoration:none;margin-bottom:6px;box-shadow:0 2px 6px rgba(0,0,0,.18)}.ap-e{font-size:26px;flex:none}.ap-t{display:flex;flex-direction:column;min-width:0}.ap-t b{font-size:14px;font-weight:900;line-height:1.2}.ap-t i{font-style:normal;font-size:16px;font-weight:900}.ap-t small{font-size:12px;font-weight:700;opacity:.95}body.dc-contraste .zj-caja .ap-fila,body.dc-contraste .zj-caja .ap-fila *{color:#fff!important}`;

export default function ApoyoHost({ onAbrirProyecto = () => {} }) {
  const [ab, setAb] = useState(false);
  const [vista, setVista] = useState("general");
  useEffect(() => { const f = (e) => { setVista(e.detail === "animal" ? "animal" : "general"); setAb(true); }; window.addEventListener("dcuates:abrir-apoyo", f); return () => window.removeEventListener("dcuates:abrir-apoyo", f); }, []);
  useAtras(ab, () => setAb(false));
  if (!ab) return null;
  const cerrar = () => setAb(false);
  const ir = (a) => { cerrar(); setTimeout(() => ejecutar(a, onAbrirProyecto), 100); };
  if (vista === "animal") return createPortal(
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Ayuda causa animal" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>🐾 Ayuda causa animal</b><button type="button" className="zj-x" onClick={cerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Extravío, adopción, rescate o maltrato: qué hacer y a quién llamar. Los animalitos cuentan con nosotros. 💛</p>
        <p className="ap-av">🚨 Si hay peligro inmediato para personas, llama al <b>911</b>.</p>
        {ANIMAL_SUGERENCIAS.map(([e, t, c, items]) => (
          <div key={t} className="ap-sug" style={{ background: c }}><b>{e} {t}</b><ul>{items.map((x) => <li key={x}>{x}</li>)}</ul></div>
        ))}
        <p className="zj-et">En DCUATES</p>
        <div className="zj-col">
          <button type="button" style={{ background: "#2E9E5B" }} onClick={() => ir({ p: "extraviados-registro" })}>🔎 Reportar mascota extraviada o encontrada</button>
          <button type="button" style={{ background: "#C2410C" }} onClick={() => ir({ p: "ecatepets" })}>🐾 Ecatepets: adopción y cuidado</button>
          <button type="button" style={{ background: "#7a5ad8" }} onClick={() => ir({ chat: "¡Hola DCUATES! Necesito orientación por un caso de animales (extravío / adopción / rescate / maltrato). Mi caso es: ___" })}>💬 Pedir orientación por WhatsApp</button>
        </div>
        <p className="zj-et">Teléfonos y denuncias</p>
        {ANIMAL_TELEFONOS.map((f, i) => <Fila key={f[1]} f={f} i={i} />)}
        <p className="ap-av">Teléfonos tomados de notas periodísticas de 2023 (UnoTV, adn40). Pueden haber cambiado: verifica al llamar. Para animales en la calle o amarrados, pregunta también en el Centro de Control Canino de tu municipio.</p>
      </div>
      <style>{ESTILO_AP + `.ap-av{margin:6px 0;padding:8px 10px;border-radius:12px;background:#fff4d6;font-size:13px;font-weight:700;color:#3a2a00;line-height:1.35}.ap-sug{margin-bottom:8px;padding:10px 12px;border:2px solid #fff;border-radius:14px;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18)}.ap-sug b{font-size:15px;font-weight:900}.ap-sug ul{list-style:disc;margin:6px 0 0;padding-left:18px;font-size:13.5px;font-weight:700;line-height:1.35}body.dc-contraste .zj-caja .ap-sug,body.dc-contraste .zj-caja .ap-sug *{color:#fff!important}`}</style>
    </div>, document.body);
  return createPortal(
    <div className="zj-fondo" role="dialog" aria-modal="true" aria-label="Apoyo gratuito" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div className="zj-caja">
        <div className="zj-cab"><b>💚 Apoyo gratuito</b><button type="button" className="zj-x" onClick={cerrar} aria-label="Cerrar">✕</button></div>
        <p className="zj-p">Teléfonos y enlaces de atención gratuita: apoyo emocional, universidades, gobierno, ciberdelitos y ayuda en tu zona. Toca un número para llamar. 🤍</p>
        <p className="ap-av">🚨 Si hay peligro inmediato, llama al <b>911</b>. DCUATES no sustituye atención médica, psicológica ni legal.</p>
        {APOYO.map(([t, filas]) => <div key={t}><p className="zj-et">{t}</p>{filas.map((f, i) => <Fila key={f[1] + i} f={f} i={i} />)}</div>)}
        <p className="zj-et">🛡️ Denuncia de ciberdelitos</p>{CIBERNETICA.map((f, i) => <Fila key={f[1]} f={f} i={i} />)}
        <p className="zj-et">📍 Ayuda en Ecatepec y Estado de México</p>{AYUDA_LOCAL.map((f, i) => <Fila key={f[1]} f={f} i={i + 2} />)}
        <p className="ap-av">Datos tomados de directorios públicos (UAM 2026, Secretaría de Seguridad del Estado de México). Revisión: {FECHA_REVISION}. Los números pueden cambiar: si no responden, avísanos por WhatsApp.</p>
      </div>
      <style>{ESTILO_AP + `.ap-av{margin:6px 0;padding:8px 10px;border-radius:12px;background:#fff4d6;font-size:13px;font-weight:700;color:#3a2a00;line-height:1.35}`}</style>
    </div>, document.body);
}
