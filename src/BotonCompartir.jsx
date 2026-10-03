import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// =========================================================================
// BOTÓN DE COMPARTIR — DCUATES (CLON8)
// Un solo botón para compartir cualquier cosa de la página que tenga "#":
// secciones, formularios, el mapa, cada pestaña y cada proyecto.
//
//   <BotonCompartir hash="solicitudes" titulo="Registra tu solicitud"
//                   texto="Cuéntanos qué necesitas" variante="circulo" />
//
// - hash: lo que va después del "#" (ej. "solicitudes", "causas",
//   "proyecto-libros"). Quien abra el enlace llega directo a ese lugar.
// - Al tocarlo se abre una hoja con WhatsApp, Facebook, X, Telegram y
//   "Copiar enlace" (y "Más opciones…" si el celular lo permite).
// - variante: "circulo" (verde), "claro" (blanco, para fondos oscuros),
//   "flotante" (sobre el mapa), "pastilla" (con texto) o "bloque" (ancho).
// =========================================================================

export function enlaceDe(hash) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}${hash ? "#" + hash : ""}`;
}

function IconoCompartir() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}

export default function BotonCompartir({ hash = "", titulo = "DCUATES", texto = "", variante = "circulo", etiqueta = "Compartir", className = "" }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Estilos propios, una sola vez en toda la página.
  useEffect(() => {
    if (document.getElementById("cb-css")) return;
    const st = document.createElement("style");
    st.id = "cb-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }, []);

  const url = enlaceDe(hash);
  const mensaje = `✨ ${titulo}${texto ? " — " + texto : ""}. Conócelo en DCUATES:`;
  const enc = encodeURIComponent;
  const opciones = [
    { id: "wa", emoji: "💬", nombre: "WhatsApp", href: `https://wa.me/?text=${enc(mensaje + " " + url)}` },
    { id: "fb", emoji: "📘", nombre: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(mensaje)}` },
    { id: "x", emoji: "✖️", nombre: "X (Twitter)", href: `https://twitter.com/intent/tweet?text=${enc(mensaje)}&url=${enc(url)}` },
    { id: "tg", emoji: "✈️", nombre: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(mensaje)}` }
  ];
  const puedeNativo = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch { /* sin permiso */ }
      document.body.removeChild(t);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2200);
  };
  const nativo = () => navigator.share({ title: titulo, text: mensaje, url }).catch(() => {});

  const clase = `cb-btn cb-${variante} ${className}`.trim();
  const contenidoBoton = variante === "pastilla" || variante === "bloque"
    ? <><IconoCompartir /><span>{etiqueta}</span></>
    : <IconoCompartir />;

  return (
    <>
      <button
        type="button"
        className={clase}
        onClick={(e) => { e.stopPropagation(); setAbierto(true); }}
        aria-label={`Compartir: ${titulo}`}
        title="Compartir"
      >
        {contenidoBoton}
      </button>

      {abierto && typeof document !== "undefined" && createPortal(
        <div className="cb-velo" onClick={(e) => { e.stopPropagation(); setAbierto(false); }} role="dialog" aria-modal="true" aria-label="Compartir">
          <div className="cb-hoja" onClick={(e) => e.stopPropagation()}>
            <p className="cb-t">Compartir</p>
            <p className="cb-s">{titulo}</p>
            <div className="cb-grid">
              {opciones.map((o) => (
                <a key={o.id} className="cb-op" href={o.href} target="_blank" rel="noopener noreferrer" onClick={() => setAbierto(false)}>
                  <span aria-hidden="true">{o.emoji}</span> {o.nombre}
                </a>
              ))}
            </div>
            <button type="button" className="cb-op cb-copiar" onClick={copiar}>
              <span aria-hidden="true">🔗</span> {copiado ? "¡Enlace copiado!" : "Copiar enlace"}
            </button>
            {puedeNativo && (
              <button type="button" className="cb-op cb-mas" onClick={nativo}>
                <span aria-hidden="true">📲</span> Más opciones…
              </button>
            )}
            <p className="cb-url">{url}</p>
            <div className="cb-pie">
              <button type="button" className="cb-x" onClick={() => setAbierto(false)} aria-label="Cerrar" title="Cerrar">×</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

const CSS = `
.cb-btn{border:0;cursor:pointer;font-family:"Nunito",ui-rounded,system-ui,sans-serif;display:inline-grid;place-items:center;transition:transform .12s}
.cb-btn:hover{transform:scale(1.07)}
.cb-btn:focus-visible{outline:3px solid #1f2a37;outline-offset:2px}
.cb-circulo{width:34px;height:34px;border-radius:50%;background:#25d366;color:#fff;box-shadow:0 3px 8px rgba(0,0,0,.22)}
.cb-claro{width:34px;height:34px;border-radius:50%;background:#fff;color:#0f2d1e;box-shadow:0 3px 8px rgba(0,0,0,.28)}
.cb-flotante{width:40px;height:40px;border-radius:50%;background:#fff;color:#0f2d1e;box-shadow:0 4px 12px rgba(0,0,0,.35)}
.cb-pastilla{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border-radius:99px;background:#25d366;color:#fff;font-weight:900;font-size:13px;text-transform:uppercase;letter-spacing:.03em;box-shadow:0 4px 10px rgba(0,0,0,.2)}
.cb-bloque{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:48px;padding:10px 16px;border-radius:14px;background:rgba(255,255,255,.75);color:#1f2a37;font-weight:900;font-size:15px;border:2px solid rgba(31,42,55,.14)}
.cb-velo{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.5);padding:12px;font-family:"Nunito",ui-rounded,system-ui,sans-serif}
.cb-hoja{width:100%;max-width:380px;background:#fff;color:#1f2a37;border-radius:20px;padding:18px;box-shadow:0 20px 50px rgba(0,0,0,.35);display:flex;flex-direction:column;gap:10px;max-height:calc(100dvh - 24px);overflow-y:auto}
.cb-hoja *{box-sizing:border-box;font-family:inherit}
.cb-t{margin:0;font-size:20px;font-weight:900}
.cb-s{margin:0;font-size:14px;font-weight:700;color:#5b6675;line-height:1.3}
.cb-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cb-op{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:8px 10px;border:2px solid rgba(31,42,55,.12);border-radius:14px;background:#f4f6f8;color:#1f2a37;font-weight:900;font-size:14px;text-decoration:none;cursor:pointer}
.cb-op:hover{background:#e9edf1}
.cb-copiar{width:100%}
.cb-mas{width:100%}
.cb-url{margin:0;font-size:11px;font-weight:700;color:#8a94a1;word-break:break-all}
.cb-pie{display:flex;justify-content:flex-end}
.cb-x{width:44px;height:44px;border:0;border-radius:50%;background:#0f2d1e;color:#fff;font-size:26px;line-height:1;font-weight:900;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,.25)}
@media (min-width:640px){.cb-velo{align-items:center}}
`;
