//  DIRECTORIO «NEGOCIOS CUATE» (e80) — lista de todas las Páginas CUATE aprobadas, con buscador y filtros por categoría y colonia.
// Se abre con abrirDirectorio() (evento dcuates:directorio) o con el enlace #negocios-cuate. Cada tarjeta abre la Página CUATE del negocio.
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { cargarDirectorio, ordenarDirectorio, ORDENES, categoriaDe, claveCategoria, NIVELES, esOficial } from "./datos/negocios.js";
import { abrirNegocio } from "./NegocioCuate.jsx";
import PaginaCuateCTA from "./PaginaCuateCTA.jsx";
import { URL_SITIO } from "./datos/config.js";
import { eventoNegocio } from "./utilidades/negocioStats.js";

const sinAc = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function DirectorioNegocios() {
  const [abierto, setAbierto] = useState(() => typeof window !== "undefined" && window.location.hash === "#negocios-cuate");
  const [est, setEst] = useState({ cargando: true, items: [] });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [col, setCol] = useState("");
  const [soloV, setSoloV] = useState(false);
  const [orden, setOrden] = useState("destacados");
  useEffect(() => {
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    if (window.location.hash === "#negocios-cuate") quitar();
    const al = () => { if (window.location.hash === "#negocios-cuate") { setAbierto(true); quitar(); } };
    const ev = () => setAbierto(true);
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:directorio", ev);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:directorio", ev); };
  }, []);
  const cerrar = () => setAbierto(false);
  const oculta = useAtras(abierto, cerrar);
  useEffect(() => {
    if (!abierto) return undefined;
    let vivo = true;
    registrar("directorio_abrir");
    cargarDirectorio().then((r) => { if (vivo) setEst({ cargando: false, items: r.items || [], ejemplo: !!r.ejemplo }); });
    return () => { vivo = false; };
  }, [abierto]);
  const cats = useMemo(() => {
    const m = {}; est.items.forEach((i) => { const k = claveCategoria(i.c); m[k] = (m[k] || 0) + 1; });
    return Object.keys(m).sort((a, b) => a.localeCompare(b, "es")).map((k) => ({ k, n: m[k] }));
  }, [est.items]);
  const cols = useMemo(() => [...new Set(est.items.map((i) => (i.col || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")), [est.items]);
  const ordenados = useMemo(() => ordenarDirectorio(est.items, orden), [est.items, orden]);
  const lista = ordenados.filter((i) => {
    if (cat && claveCategoria(i.c) !== cat) return false;
    if (col && (i.col || "").trim() !== col) return false;
    if (soloV && !i.v) return false;
    if (q.trim()) { const t = sinAc([i.n, i.e, i.c, i.col].join(" ")); if (!sinAc(q).split(/\s+/).filter(Boolean).every((w) => t.includes(w))) return false; }
    return true;
  });
  if (!abierto) return null;
  const compartir = () => {
    registrar("directorio_compartir");
    const url = `${URL_SITIO}/?origen=directorio#negocios-cuate`;
    const texto = "Negocios CUATE: negocios de tu comunidad con beneficios para Cuates.";
    if (navigator.share) { navigator.share({ title: "Negocios CUATE", text: texto, url }).catch(() => {}); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`, "_blank", "noopener");
  };
  const limpiar = () => { setQ(""); setCat(""); setCol(""); setSoloV(false); };
  return createPortal(
    <div className="dn-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Negocios CUATE" data-testid="directorio">
      <style>{CSS}</style>
      <div className="dn-caja">
        <div className="dn-bar">
          <button type="button" className="dn-x" onClick={cerrar} aria-label="Cerrar">✕</button>
          <b>🏪 Negocios CUATE</b>
          <button type="button" className="dn-x" onClick={compartir} aria-label="Compartir">📤</button>
        </div>
        <p className="dn-p">Negocios de tu comunidad con beneficios para los Cuates. Muestra tu Pase y aprovecha sus promociones. 💛</p>
        {est.ejemplo && <p className="dn-ej">EJEMPLOS ilustrativos · así se verá el directorio</p>}
        <div className="dn-f">
          <input type="search" className="dn-q" placeholder="🔎 Busca un negocio, giro o colonia" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
          <select className="dn-s" value={col} onChange={(e) => setCol(e.target.value)} aria-label="Colonia o municipio">
            <option value="">Todas las colonias</option>
            {cols.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="dn-s" value={orden} onChange={(e) => { setOrden(e.target.value); registrar("directorio_orden", { o: e.target.value }); }} aria-label="Ordenar por" data-testid="dir-orden">
            {ORDENES.map(([k, t]) => <option key={k} value={k}>Orden: {t}</option>)}
          </select>
        </div>
        <div className="dn-chips" role="group" aria-label="Categorías">
          <button type="button" className={"dn-chip" + (cat === "" ? " on" : "")} onClick={() => setCat("")}>Todas ({est.items.length})</button>
          {est.items.some((i) => i.v) && <button type="button" className={"dn-chip" + (soloV ? " on" : "")} aria-pressed={soloV} onClick={() => setSoloV(!soloV)}>✅ Solo verificados</button>}
          {cats.map((c) => <button type="button" key={c.k} className={"dn-chip" + (cat === c.k ? " on" : "")} onClick={() => setCat(cat === c.k ? "" : c.k)}>{categoriaDe(c.k).e} {c.k} ({c.n})</button>)}
        </div>
        {est.cargando && <p className="dn-m" role="status">Cargando…</p>}
        {!est.cargando && <p className="dn-m" role="status" data-testid="dir-cuenta">{lista.length} {lista.length === 1 ? "negocio" : "negocios"}{(q || cat || col || soloV) && <> · <button type="button" className="dn-lk" onClick={limpiar}>Quitar filtros</button></>}</p>}
        <div className="dn-lista">
          {lista.map((i) => {
            const c = categoriaDe(i.c); const nv = NIVELES[i.niv];
            return (
              <button type="button" key={i.s} className="dn-card" style={{ "--c": c.color }} onClick={() => { registrar("directorio_clic", { s: i.s }); eventoNegocio(i.s, "directorio"); abrirNegocio(i.s); }}>
                <span className="dn-lg">{i.l ? <img src={i.l} alt="" loading="lazy" /> : c.e}</span>
                <span className="dn-t">
                  <b>{i.n}</b>
                  {i.e && <small>{i.e}</small>}
                  <span className="dn-m2"><i>{c.e} {c.nombre}</i>{i.col && <i>📍 {i.col}</i>}{i.v && <i className="dn-vr">✅ Verificado</i>}{i.of && <i className="dn-of">🎟️ Oferta</i>}{esOficial(i.s) ? <i className="dn-nv">🌟 OFICIAL DCUATES</i> : nv && nv.t && <i className="dn-nv">{nv.t}</i>}</span>
                </span>
              </button>
            );
          })}
        </div>
        {!est.cargando && lista.length === 0 && <p className="dn-m">No encontramos negocios con esos filtros.</p>}
        <PaginaCuateCTA />
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.dn-fondo{position:fixed;inset:0;z-index:79;background:#fbf7ec;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.dn-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding:0 12px 40px;background:#fbf7ec}
.dn-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;margin:0 -12px;background:#1F7A46;color:#fff;padding:8px 10px}
.dn-bar b{flex:1;font-size:17px;font-weight:900}
.dn-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#1F7A46;font-size:19px;font-weight:900;cursor:pointer}
.dn-p{margin:12px 0 6px;font-size:14px;font-weight:700;line-height:1.4}
.dn-ej{margin:0 -12px 8px;padding:6px 12px;background:#FFF4D6;color:#8a5a0c;font-size:12.5px;font-weight:900;text-align:center}
.dn-f{display:flex;flex-direction:column;gap:8px;margin:8px 0}
.dn-q,.dn-s{min-height:46px;border:2px solid #cfc8b0;border-radius:12px;background:#fff;padding:0 12px;font:inherit;font-size:15px;font-weight:700;color:#0f2d1e;width:100%;box-sizing:border-box}
.dn-chips{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px}
.dn-chip{flex:none;min-height:38px;padding:0 12px;border:2px solid #1F7A46;border-radius:999px;background:#fff;color:#1F7A46;font:inherit;font-size:12.5px;font-weight:900;cursor:pointer;white-space:nowrap}
.dn-chip.on{background:#1F7A46;color:#fff}
.dn-m{margin:4px 0 8px;font-size:13px;font-weight:800;color:#4a5b52}
.dn-lk{border:0;background:none;color:#1F7A46;font:inherit;font-weight:900;text-decoration:underline;cursor:pointer;min-height:32px}
.dn-lista{display:flex;flex-direction:column;gap:8px}
.dn-card{display:flex;align-items:center;gap:10px;width:100%;padding:10px;border:2px solid var(--c);border-radius:16px;background:#fff;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dn-lg{flex:none;width:56px;height:56px;border-radius:50%;background:#f1ecdc;display:flex;align-items:center;justify-content:center;font-size:28px;overflow:hidden}
.dn-lg img{width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box;background:#fff}
.dn-t{display:flex;flex-direction:column;gap:2px;min-width:0}
.dn-t b{font-size:15.5px;font-weight:900;line-height:1.15}
.dn-t small{font-size:12.5px;font-weight:700;color:#4a5b52;line-height:1.3}
.dn-m2{display:flex;flex-wrap:wrap;gap:4px;margin-top:2px}
.dn-m2 i{font-style:normal;font-size:11.5px;font-weight:800;color:var(--c);background:#f6f2e4;border-radius:999px;padding:2px 8px}
.dn-m2 .dn-vr{color:#0b6b32;background:#DDF3E4}.dn-m2 .dn-of{color:#8a5a0c;background:#FFF4D6}.dn-m2 .dn-nv{color:#7a4a00;background:#FFE9A8}
`;
