// e97 — VITRINAS: colecciones por tema, proyecto o actividad (talleres, comida, artesanías, temporada…).
// Reúnen imágenes de la pestaña «Reels» y páginas CUATE con la(s) etiqueta(s) del filtro de la vitrina (pestaña «Vitrinas» de la hoja).
// Se abre con abrirVitrina("slug"), con el enlace https://dcuates.com/#vitrina-slug o desde la lista del Directorio.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MarcaVentana } from "./componentes/LogoDcuates.jsx";
import { useAtras } from "./atras.js";
import { pedir } from "./datos/negocios.js";
import { abrirNegocio } from "./NegocioCuate.jsx";
import { enlaceOk } from "./BloqueAnuncios.jsx";
import { registrar } from "./analitica.js";
import { URL_SITIO } from "./datos/config.js";

export const abrirVitrina = (slug) => { try { window.dispatchEvent(new CustomEvent("dcuates:vitrina", { detail: slug })); } catch (e) { /* sin eventos */ } };
const slugDeHash = () => { const h = decodeURIComponent((typeof window !== "undefined" && window.location.hash) || ""); return /^#vitrina-[a-z0-9-]{1,60}$/.test(h) ? h.slice("#vitrina-".length) : ""; };
const limpia = (x) => String(x || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);

// Contenedor que se desplaza a los lados y avisa que hay más: degradado + flecha ›/‹ que aparece solo cuando hay contenido oculto.
export function DesplazaH({ className = "", children, etiqueta = "Desplazar" }) {
  const ref = useRef(null);
  const [lados, setLados] = useState({ izq: false, der: false });
  const medir = () => { const e = ref.current; if (!e) return; const n = { izq: e.scrollLeft > 6, der: e.scrollLeft + e.clientWidth < e.scrollWidth - 6 }; setLados((v) => (v.izq === n.izq && v.der === n.der ? v : n)); };
  useLayoutEffect(() => {
    medir(); const e = ref.current; if (!e) return undefined;
    let ro = null; try { ro = new ResizeObserver(medir); ro.observe(e); Array.from(e.children).forEach((c) => ro.observe(c)); } catch (x) { /* sin ResizeObserver */ }
    window.addEventListener("resize", medir);
    return () => { window.removeEventListener("resize", medir); if (ro) ro.disconnect(); };
  });
  const ir = (d) => { const e = ref.current; if (e) e.scrollBy({ left: d * Math.max(120, e.clientWidth * 0.75), behavior: "smooth" }); };
  return (
    <div className="dh">
      <style>{CSS}</style>
      <div className={"dh-in " + className} ref={ref} onScroll={medir} tabIndex={0} aria-label={etiqueta}>{children}</div>
      {lados.izq && <button type="button" className="dh-f dh-i" onClick={() => ir(-1)} aria-label="Ver anteriores" data-testid="dh-izq">‹</button>}
      {lados.der && <button type="button" className="dh-f dh-d" onClick={() => ir(1)} aria-label="Ver más a la derecha" data-testid="dh-der">›</button>}
    </div>
  );
}

// Vitrinas por tema para el Directorio: barra de botones (con indicador de desplazamiento) y, debajo, un reel con las imágenes de la
// vitrina seleccionada (al inicio, la primera). Al tocar una imagen o «Ver toda la vitrina» se abre la ventana completa.
export function ListaVitrinas() {
  const [items, setItems] = useState([]);
  const [sel, setSel] = useState("");
  const [datos, setDatos] = useState({});
  useEffect(() => { let vivo = true; pedir("a=vitrinas").then((j) => { if (vivo && j && j.ok && Array.isArray(j.items)) { setItems(j.items); if (j.items[0]) setSel(j.items[0].s); } }).catch(() => {}); return () => { vivo = false; }; }, []);
  useEffect(() => {
    if (!sel || datos[sel]) return undefined;
    let vivo = true;
    pedir("a=vitrina&slug=" + encodeURIComponent(sel)).then((j) => { if (vivo) setDatos((d) => ({ ...d, [sel]: j && j.ok ? { ok: true, it: j.it || [], ng: j.ng || [] } : { ok: false } })); }).catch(() => { if (vivo) setDatos((d) => ({ ...d, [sel]: { ok: false } })); });
    return () => { vivo = false; };
  }, [sel, datos]);
  if (!items.length) return null;
  const actual = items.find((v) => v.s === sel) || items[0];
  const d = datos[actual.s];
  return (
    <div className="vt-lista" data-testid="vitrinas-lista">
      <style>{CSS}</style>
      <b>🛍️ Vitrinas por tema</b>
      <DesplazaH className="vt-chips" etiqueta="Vitrinas por tema">
        {items.map((v) => <button key={v.s} type="button" className={"vt-chip" + (v.s === actual.s ? " on" : "")} aria-pressed={v.s === actual.s} data-testid="vitrina-chip" onClick={() => { registrar("vitrina_chip", { s: v.s }); setSel(v.s); }}>{v.e ? v.e + " " : ""}{v.t}</button>)}
      </DesplazaH>
      <div className="vt-reel" data-testid="vitrina-reel">
        {!d && <p className="vt-rm" role="status">Cargando…</p>}
        {d && d.ok && d.it.length > 0 && (
          <DesplazaH className="vt-rl" etiqueta={"Imágenes de " + actual.t}>
            {d.it.map((x, i) => (
              <button key={i} type="button" className="vt-ri" data-testid="vitrina-reel-item" onClick={() => { registrar("vitrina_abrir", { s: actual.s }); abrirVitrina(actual.s); }} aria-label={(x.t || "Producto") + ". Abrir vitrina " + actual.t}>
                <img src={x.u} alt="" loading="lazy" decoding="async" />
                {(x.t || x.p) && <span>{x.t && <b>{x.t}</b>}{x.p && <em>{x.p}</em>}</span>}
              </button>
            ))}
          </DesplazaH>
        )}
        {d && d.ok && d.it.length === 0 && <p className="vt-rm">Pronto habrá imágenes en esta vitrina. 💛</p>}
        {d && !d.ok && <p className="vt-rm">No pudimos cargar esta vitrina.</p>}
        <button type="button" className="vt-ver" data-testid="vitrina-ver-toda" onClick={() => { registrar("vitrina_abrir", { s: actual.s }); abrirVitrina(actual.s); }}>Ver toda la vitrina «{actual.t}» ›</button>
      </div>
    </div>
  );
}

export default function Vitrina() {
  const [slug, setSlug] = useState("");
  const [est, setEst] = useState({ cargando: false });
  useEffect(() => {
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    const al = () => { const s = slugDeHash(); if (s) { setSlug(s); quitar(); } };
    if (slugDeHash()) { setSlug(slugDeHash()); quitar(); }
    const ir = (e) => { const s = limpia(e && e.detail); if (s) setSlug(s); };
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:vitrina", ir);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:vitrina", ir); };
  }, []);
  const cerrar = () => setSlug("");
  const oculta = useAtras(!!slug, cerrar);
  useEffect(() => {
    if (!slug) return undefined;
    let vivo = true; setEst({ cargando: true });
    pedir("a=vitrina&slug=" + encodeURIComponent(slug))
      .then((j) => { if (vivo) setEst(j && j.ok ? { cargando: false, ok: true, v: j.v, it: j.it || [], ng: j.ng || [] } : { cargando: false, ok: false, motivo: (j && j.motivo) || "error" }); if (j && j.ok) registrar("vitrina_ver", { s: slug }); })
      .catch(() => { if (vivo) setEst({ cargando: false, ok: false, motivo: "sin-conexion" }); });
    return () => { vivo = false; };
  }, [slug]);
  if (!slug) return null;
  const url = `${URL_SITIO}/#vitrina-${slug}`;
  const compartir = () => {
    const t = `${est.v ? est.v.t : "Vitrina"} · DCUATES`;
    try { if (navigator.share) { navigator.share({ title: t, text: t, url }); return; } } catch (e) { /* sin compartir */ }
    window.open("https://wa.me/?text=" + encodeURIComponent(`${t} ${url}`), "_blank", "noopener,noreferrer");
  };
  const v = est.v;
  return createPortal(
    <div className="vt-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={v ? v.t : "Vitrina"} data-testid="vitrina">
      <style>{CSS}</style>
      <div className="vt-caja">
        <div style={{ background: "#fff", padding: "8px 14px 4px" }}><MarcaVentana /></div>
        <div className="vt-bar">
          <button type="button" className="vt-x" onClick={cerrar} aria-label="Cerrar">✕</button>
          <b>{v ? `${v.e ? v.e + " " : ""}${v.t}` : "🛍️ Vitrina"}</b>
          <button type="button" className="vt-x" onClick={compartir} aria-label="Compartir esta vitrina" data-testid="vitrina-compartir">📤</button>
        </div>
        {est.cargando && <p className="vt-p">Cargando…</p>}
        {!est.cargando && !est.ok && <p className="vt-p" data-testid="vitrina-vacia">{est.motivo === "no-encontrado" ? "Esta vitrina no está disponible por ahora." : "No pudimos cargar la vitrina. Revisa tu conexión e intenta de nuevo."}</p>}
        {est.ok && (
          <>
            {v.x && <p className="vt-p">{v.x}</p>}
            {est.it.length > 0 && (
              <ul className="vt-g" data-testid="vitrina-items">
                {est.it.map((x, i) => (
                  <li key={i} className="vt-c" data-testid="vitrina-item">
                    <img src={x.u} alt={x.t || ""} loading="lazy" decoding="async" />
                    <div className="vt-t">
                      {x.t && <b>{x.t}</b>}
                      {x.p && <em>{x.p}</em>}
                      <button type="button" className="vt-org" onClick={() => { registrar("vitrina_pagina", { s: x.s }); abrirNegocio(x.s); }}>🏪 {x.g || "Ver página"}</button>
                      {enlaceOk(x.l) && <a className="vt-bt" href={x.l} {...(/^https:/i.test(x.l) ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => registrar("vitrina_enlace", { s: x.s })}>{x.b || "Ver más"}</a>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {est.ng.length > 0 && (
              <section data-testid="vitrina-paginas">
                <h3 className="vt-h">Emprendimientos de esta vitrina</h3>
                <ul className="vt-pg">
                  {est.ng.map((p) => (
                    <li key={p.s}><button type="button" className="vt-p2" onClick={() => { registrar("vitrina_pagina", { s: p.s }); abrirNegocio(p.s); }}>
                      {p.l && enlaceOk(p.l) ? <img src={p.l} alt="" loading="lazy" /> : <span className="vt-lg" aria-hidden="true">🏪</span>}
                      <span><b>{p.n}</b>{p.e && <small>{p.e}</small>}</span>
                    </button></li>
                  ))}
                </ul>
              </section>
            )}
            {est.it.length === 0 && est.ng.length === 0 && <p className="vt-p" data-testid="vitrina-sin-nada">Pronto habrá productos y emprendimientos en esta vitrina. 💛</p>}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.vt-lista{margin:8px 0 10px;display:flex;flex-direction:column;gap:6px}.vt-lista>b{font-size:15px;font-weight:900;color:#0f2d1e}
.dh{position:relative;min-width:0}
.dh-in{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:thin;scrollbar-color:#B7791F #efe9d4;-webkit-overflow-scrolling:touch}
.dh-in::-webkit-scrollbar{height:6px}.dh-in::-webkit-scrollbar-thumb{background:#B7791F;border-radius:6px}.dh-in::-webkit-scrollbar-track{background:#efe9d4;border-radius:6px}
.dh-f{position:absolute;top:0;bottom:12px;width:40px;border:0;color:#7a4a00;font-size:30px;font-weight:900;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.dh-d{right:0;background:linear-gradient(90deg,rgba(251,247,236,0),rgba(251,247,236,.96) 55%)}.dh-i{left:0;background:linear-gradient(270deg,rgba(251,247,236,0),rgba(251,247,236,.96) 55%)}
.vt-chip{flex:none;min-height:44px;padding:0 14px;border:2px solid var(--dc-verde,#1F7A46);border-radius:999px;background:#fff;color:var(--dc-verde,#1F7A46);font:900 14.5px Nunito,system-ui,sans-serif;cursor:pointer;white-space:nowrap}
.vt-chip.on{background:var(--dc-verde,#1F7A46);color:#fff}
.vt-reel{display:flex;flex-direction:column;gap:2px}
.vt-ri{flex:none;width:132px;display:flex;flex-direction:column;border:2px solid #e3dcc6;border-radius:14px;background:#fff;overflow:hidden;padding:0;font:inherit;color:#0f2d1e;text-align:left;cursor:pointer}
.vt-ri img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#efe9d4}
.vt-ri span{display:flex;flex-direction:column;gap:1px;padding:5px 7px 7px}.vt-ri b{font-size:12.5px;font-weight:900;line-height:1.2;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.vt-ri em{font-style:normal;font-size:13px;font-weight:900;color:var(--dc-verde,#1F7A46)}
.vt-rm{margin:6px 2px;font-size:13px;font-weight:800;color:#4a5b52}
.vt-ver{min-height:44px;border:0;background:none;color:var(--dc-verde,#1F7A46);font:900 14px Nunito,system-ui,sans-serif;text-align:left;text-decoration:underline;cursor:pointer;padding:0 2px}
.vt-fondo{position:fixed;inset:0;z-index:79;background:var(--dc-fondo,#FBF7EC);font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.vt-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding:0 12px 40px}
.vt-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;margin:0 -12px;background:var(--dc-verde,#1F7A46);color:#fff;padding:8px 10px}.vt-bar b{flex:1;font-size:17px;font-weight:900;line-height:1.2;overflow-wrap:anywhere}
.vt-x{flex:none;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--dc-verde,#1F7A46);font-size:19px;font-weight:900;cursor:pointer}
.vt-p{margin:12px 2px;font-size:15px;font-weight:700;line-height:1.45}
.vt-g{list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.vt-c{min-width:0;display:flex;flex-direction:column;border:2px solid #e3dcc6;border-radius:14px;background:#fff;overflow:hidden}
.vt-c img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#efe9d4}
.vt-t{display:flex;flex-direction:column;gap:4px;padding:8px 9px 10px}.vt-t b{font-size:14px;font-weight:900;line-height:1.25;overflow-wrap:anywhere}.vt-t em{font-style:normal;font-size:14.5px;font-weight:900;color:var(--dc-verde,#1F7A46)}
.vt-org{min-height:36px;padding:0 6px;border:0;background:#eef6f0;border-radius:10px;color:#0f2d1e;font:800 12.5px Nunito,system-ui,sans-serif;text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vt-bt{min-height:40px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--dc-verde,#1F7A46);color:#fff;font-size:13.5px;font-weight:900;text-decoration:none;text-align:center}
.vt-h{margin:18px 2px 8px;font-size:17px;font-weight:900}
.vt-pg{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.vt-p2{width:100%;min-height:56px;display:flex;align-items:center;gap:10px;padding:8px 10px;border:2px solid #e3dcc6;border-radius:14px;background:#fff;text-align:left;font-family:inherit;color:#0f2d1e;cursor:pointer}
.vt-p2 img,.vt-lg{flex:none;width:44px;height:44px;border-radius:12px;object-fit:cover;background:#efe9d4;display:flex;align-items:center;justify-content:center;font-size:22px}
.vt-p2 span:last-child{display:flex;flex-direction:column;min-width:0}.vt-p2 b{font-size:15px;font-weight:900}.vt-p2 small{font-size:12.5px;font-weight:700;color:#5a6b62}
`;
