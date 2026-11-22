// MEDIA INTELIGENTE (e89): muestra un medio (video o imagen) de cualquier origen sin mostrar nunca el ícono de «imagen rota».
// Uso: <MediaInteligente medio={claseMedio(url)} nombre="…" activo onActivar />  ·  <ImagenSegura src="…" />  ·  useImagenSegura(url)
import React, { useEffect, useState } from "react";
import { imgDirecta } from "../utilidades/medios.js";

// Devuelve la imagen solo si de verdad carga (si no, "" para que se vea el degradado de la marca).
export function useImagenSegura(url) {
  const [ok, setOk] = useState("");
  useEffect(() => {
    const u = imgDirecta(url); setOk("");
    if (!u) return undefined;
    let vivo = true; const im = new Image();
    im.onload = () => { if (vivo) setOk(u); };
    im.onerror = () => { if (vivo) setOk(""); };
    im.src = u;
    return () => { vivo = false; };
  }, [url]);
  return ok;
}

export function ImagenSegura({ src, alt = "", icono = "🖼️", className = "", ...resto }) {
  const [mal, setMal] = useState(false);
  useEffect(() => setMal(false), [src]);
  const u = imgDirecta(src);
  if (!u || mal) return <span className={"mi-vacio " + className} aria-hidden="true">{icono}</span>;
  return <img src={u} alt={alt} loading="lazy" className={className} onError={() => setMal(true)} {...resto} />;
}

function Vacio({ icono = "🎬", texto, nota }) {
  return <div className="mi-vacio-c" role="img" aria-label={texto}><span aria-hidden="true">{icono}</span><b>{texto}</b>{nota && <small>{nota}</small>}</div>;
}

export default function MediaInteligente({ medio, nombre = "", activo = false, onActivar, onPausa }) {
  const [mal, setMal] = useState(false);
  useEffect(() => setMal(false), [medio && (medio.id || medio.u)]);
  if (!medio) return null;
  const t = medio.t;
  if (mal) return <Vacio icono={t === "img" ? "🖼️" : "🎬"} texto={t === "img" ? "Imagen no disponible" : "Video no disponible"} />;
  if (t === "pagina") return <Vacio texto="Video no disponible" nota="Se requiere el enlace directo del archivo .mp4" />;
  if (t === "img") return <img src={medio.u} alt="" loading="lazy" onError={() => setMal(true)} />;
  if (t === "mp4") return <video controls playsInline preload="metadata" src={medio.u} onPlay={onActivar} onPause={onPausa} onError={() => setMal(true)} aria-label={`Video de ${nombre}`} />;
  if (t === "social") {
    return (
      <a className="mi-social" href={medio.u} target="_blank" rel="noopener noreferrer" aria-label={`Ver video en ${medio.red}`}>
        <span aria-hidden="true">▶</span><b>Ver en {medio.red}</b><small>Se abre en una ventana nueva</small>
      </a>
    );
  }
  // vimeo y drive: se cargan al tocar (no gastan datos antes)
  const src = t === "vimeo" ? `https://player.vimeo.com/video/${medio.id}?autoplay=1&playsinline=1` : `https://drive.google.com/file/d/${medio.id}/preview`;
  if (activo) return <iframe title={`${t === "vimeo" ? "Video" : "Archivo"} de ${nombre}`} src={src} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />;
  return (
    <button type="button" className="mi-play" onClick={onActivar} aria-label={`${t === "vimeo" ? "Ver video" : "Abrir archivo"} de ${nombre}`}>
      {t === "drive" && <ImagenPoster id={medio.id} />}
      <span aria-hidden="true">{t === "vimeo" ? "▶" : "▶"}</span>
    </button>
  );
}

function ImagenPoster({ id }) {
  const [mal, setMal] = useState(false);
  if (mal) return null;
  return <img src={`https://drive.google.com/thumbnail?id=${id}&sz=w800`} alt="" loading="lazy" onError={() => setMal(true)} />;
}

export const CSS_MEDIA = `
.mi-vacio{display:flex;align-items:center;justify-content:center;font-size:30px;opacity:.7}
.mi-vacio-c{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center;padding:10px;box-sizing:border-box;background:linear-gradient(135deg,var(--c,var(--dc-verde,#1F7A46)),#0f2d1e);color:#fff}
.mi-vacio-c span{font-size:34px}.mi-vacio-c b{font-size:14px}.mi-vacio-c small{font-size:11px;opacity:.85;max-width:240px}
.mi-social{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;width:100%;height:100%;text-decoration:none;color:#fff;background:linear-gradient(135deg,#1b1b2f,var(--c,var(--dc-verde,#1F7A46)));text-align:center;padding:10px;box-sizing:border-box}
.mi-social span{width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;padding-left:4px}
.mi-social b{font-size:15px}.mi-social small{font-size:11px;opacity:.85}
.mi-play{all:unset;cursor:pointer;display:block;width:100%;height:100%;position:relative;background:linear-gradient(135deg,var(--c,var(--dc-verde,#1F7A46)),#0f2d1e)}
.mi-play img{width:100%;height:100%;object-fit:cover;display:block}
.mi-play span{position:absolute;inset:0;margin:auto;width:64px;height:64px;border-radius:50%;background:rgba(0,0,0,.65);color:#fff;font-size:28px;display:flex;align-items:center;justify-content:center;padding-left:4px;box-shadow:0 2px 10px rgba(0,0,0,.4)}
.mi-play:focus-visible{outline:3px solid #FFD54F;outline-offset:-3px}
`;
