// APOYO GRATUITO: ventana con teléfonos y enlaces de ayuda (psicológica, ciberdelitos, local). Se abre con el evento dcuates:abrir-apoyo.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { APOYO, CIBERNETICA, AYUDA_LOCAL, FECHA_REVISION } from "./datos/apoyo.js";

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

export default function ApoyoHost() {
  const [ab, setAb] = useState(false);
  useEffect(() => { const f = () => setAb(true); window.addEventListener("dcuates:abrir-apoyo", f); return () => window.removeEventListener("dcuates:abrir-apoyo", f); }, []);
  useAtras(ab, () => setAb(false));
  if (!ab) return null;
  const cerrar = () => setAb(false);
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
