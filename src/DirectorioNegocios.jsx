// DIRECTORIO «NEGOCIOS CUATE» (e80) — lista de todas las Páginas CUATE aprobadas, con buscador y filtros por categoría y colonia.
// Se abre con abrirDirectorio() (evento dcuates:directorio) o con el enlace #negocios-cuate. Cada tarjeta abre la Página CUATE del negocio.
import React, { useEffect, useMemo, useState } from "react";
import { MarcaVentana, LogoDcuates } from "./componentes/LogoDcuates.jsx";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { ListaVitrinas, DesplazaH } from "./Vitrina.jsx"; // e97/e98
import { registrar } from "./analitica.js";
import { cargarDirectorio, ordenarDirectorio, ORDENES, categoriaDe, claveCategoria, NIVELES, esOficial } from "./datos/negocios.js";
import { abrirNegocio } from "./NegocioCuate.jsx";
import PaginaCuateCTA from "./PaginaCuateCTA.jsx";
import { URL_SITIO } from "./datos/config.js";
import { eventoNegocio } from "./utilidades/negocioStats.js";
import { BotonFavorito, PromoDelMes, RetoVisitas, Estrellas, CSS_PE } from "./PiezasEmprendimientos.jsx";
import { useFavoritos } from "./utilidades/favoritos.js";
import { abiertoAhora } from "./utilidades/horario.js";

const sinAc = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function DirectorioNegocios() {
  const [abierto, setAbierto] = useState(() => typeof window !== "undefined" && window.location.hash === "#negocios-cuate");
  const [est, setEst] = useState({ cargando: true, items: [] });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [col, setCol] = useState("");
  const [pais, setPais] = useState("");
  const [ent, setEnt] = useState("");
  const [soloV, setSoloV] = useState(false);
  const [soloFav, setSoloFav] = useState(false);
  const [ahora, setAhora] = useState(false);
  const favs = useFavoritos();
  const [fil, setFil] = useState(false);
  const [orden, setOrden] = useState("destacados");
  const [lim, setLim] = useState(12); // e99: «Ver más»
  const [miCol, setMiCol] = useState(() => { try { return localStorage.getItem("dc_mi_colonia") || ""; } catch (x) { return ""; } });
  const [enfoque, setEnfoque] = useState(false);
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
  // País → Entidad → Colonia (e85a). Vacío en la hoja = México / Estado de México. Los selectores solo aparecen si hay más de un valor.
  const paisDe = (i) => (i.pa || "").trim() || "México";
  const entDe = (i) => (i.en || "").trim() || "Estado de México";
  const unicos = (arr) => [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  const paises = useMemo(() => unicos(est.items.map(paisDe)), [est.items]);
  const entidades = useMemo(() => unicos(est.items.filter((i) => !pais || paisDe(i) === pais).map(entDe)), [est.items, pais]);
  const cols = useMemo(() => unicos(est.items.filter((i) => (!pais || paisDe(i) === pais) && (!ent || entDe(i) === ent)).map((i) => (i.col || "").trim())), [est.items, pais, ent]);
  const ordenados = useMemo(() => ordenarDirectorio(est.items, orden), [est.items, orden]);
  const lista = ordenados.filter((i) => {
    if (cat && claveCategoria(i.c) !== cat) return false;
    if (pais && paisDe(i) !== pais) return false;
    if (ent && entDe(i) !== ent) return false;
    if (col && (i.col || "").trim() !== col) return false;
    if (soloV && !i.v) return false;
    if (soloFav && !favs.includes(i.s)) return false;
    if (ahora && abiertoAhora(i.h) !== true) return false;
    if (q.trim()) { const t = sinAc([i.n, i.e, i.c, i.col, i.en, i.pa].join(" ")); if (!sinAc(q).split(/\s+/).filter(Boolean).every((w) => t.includes(w))) return false; }
    return true;
  });
  useEffect(() => { setLim(12); }, [q, cat, col, pais, ent, soloV, soloFav, ahora, orden]);
  const sugerencias = useMemo(() => {
    const v = [...new Set([...est.items.map((i) => categoriaDe(i.c).nombre), ...est.items.map((i) => (i.col || "").trim())].filter(Boolean))];
    return v.slice(0, 6);
  }, [est.items]);
  const guardarCol = (c) => { try { if (c) localStorage.setItem("dc_mi_colonia", c); else localStorage.removeItem("dc_mi_colonia"); } catch (x) { /* sin almacenamiento */ } setMiCol(c); };
  const nAbiertos = useMemo(() => est.items.filter((i) => abiertoAhora(i.h) === true).length, [est.items]);
  const nombres = useMemo(() => Object.fromEntries(est.items.map((i) => [i.s, i.n])), [est.items]);
  if (!abierto) return null;
  const compartir = () => {
    registrar("directorio_compartir");
    const url = `${URL_SITIO}/emprendimientos`; // e98: enlace corto con vista previa propia (api/p.js)
    const texto = "Emprendimientos CUATE: emprendimientos de tu comunidad con beneficios para Cuates.";
    if (navigator.share) { navigator.share({ title: "Emprendimientos CUATE", text: texto, url }).catch(() => {}); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`, "_blank", "noopener");
  };
  const compartirUno = (i) => {
    registrar("directorio_compartir_uno", { s: i.s });
    const url = `${URL_SITIO}/n/${i.s}`; // enlace corto con vista previa propia (api/n.js)
    const texto = `${i.n}: emprendimiento CUATE de tu comunidad.`;
    if (navigator.share) { navigator.share({ title: i.n, text: texto, url }).catch(() => {}); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`, "_blank", "noopener");
  };
  const nFiltros = [cat, pais, ent, col, soloV, soloFav, ahora].filter(Boolean).length;
  const limpiar = () => { setQ(""); setCat(""); setCol(""); setPais(""); setEnt(""); setSoloV(false); setSoloFav(false); setAhora(false); };
  return createPortal(
    <div className="dn-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Emprendimientos CUATE" data-testid="directorio">
      <style>{CSS}</style>
      <div className="dn-caja">
        <div style={{ background: "#fff", padding: "8px 14px 4px" }}><MarcaVentana /></div>
        <div className="dn-bar">
          <button type="button" className="dn-x" onClick={cerrar} aria-label="Cerrar">✕</button>
          <b>🏪 Emprendimientos CUATE</b>
          <button type="button" className="dn-x" onClick={compartir} aria-label="Compartir">📤</button>
        </div>
        <p className="dn-p">Emprendimientos de tu comunidad con beneficios para los Cuates. Muestra tu Pase y aprovecha sus promociones. 💛</p>
        <ListaVitrinas />
        {est.ejemplo && <p className="dn-ej">EJEMPLOS ilustrativos · así se verá el directorio</p>}
        {!est.cargando && (
          <details className="dn-tira" data-testid="dir-tira">
            <summary>🎟️ Promo del mes y 🎯 Reto de visitas</summary>
            <PromoDelMes items={est.items} abrir={(s) => { eventoNegocio(s, "directorio"); abrirNegocio(s); }} />
            <RetoVisitas nombres={nombres} />
          </details>
        )}
        <div className="dn-f">
          <input type="search" className="dn-q" placeholder="🔎 Busca un emprendimiento, giro o colonia" value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setEnfoque(true)} onBlur={() => setTimeout(() => setEnfoque(false), 200)} aria-label="Buscar" data-testid="dir-q" />
        </div>
        {enfoque && !q.trim() && sugerencias.length > 0 && (
          <div className="dn-sug" data-testid="dir-sugerencias"><small>Prueba buscar:</small>{sugerencias.map((x) => <button type="button" key={x} onMouseDown={(e) => e.preventDefault()} onClick={() => { setQ(x); registrar("directorio_sugerencia", { q: x }); }}>{x}</button>)}</div>
        )}
        <button type="button" className={"dn-acc" + (fil ? " on" : "")} aria-expanded={fil} aria-controls="dn-filtros" data-testid="dir-filtros-btn" onClick={() => { setFil(!fil); registrar("directorio_filtros", { abre: !fil }); }}>
          <span>⚙️ Filtros y orden{nFiltros > 0 && <i className="dn-n">{nFiltros} activo{nFiltros === 1 ? "" : "s"}</i>}</span><span aria-hidden="true">{fil ? "▲" : "▼"}</span>
        </button>
        {fil && (
          <div className="dn-acc-c" id="dn-filtros" data-testid="dir-filtros">
            <div className="dn-f">
          {paises.length > 1 && (
            <select className="dn-s" value={pais} onChange={(e) => { setPais(e.target.value); setEnt(""); setCol(""); }} aria-label="País" data-testid="dir-pais">
              <option value="">Todos los países</option>
              {paises.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
          {entidades.length > 1 && (
            <select className="dn-s" value={ent} onChange={(e) => { setEnt(e.target.value); setCol(""); }} aria-label="Entidad o estado" data-testid="dir-entidad">
              <option value="">Todas las entidades</option>
              {entidades.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
          <select className="dn-s" value={col} onChange={(e) => setCol(e.target.value)} aria-label="Colonia o municipio">
            <option value="">Todas las colonias</option>
            {cols.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {col && col !== miCol && <button type="button" className="dn-lk" data-testid="dir-guardar-col" onClick={() => guardarCol(col)}>📍 Guardar «{col}» como mi colonia</button>}
          {miCol && <button type="button" className="dn-lk" onClick={() => { guardarCol(""); if (col === miCol) setCol(""); }}>Quitar mi colonia guardada</button>}
          <select className="dn-s" value={orden} onChange={(e) => { setOrden(e.target.value); registrar("directorio_orden", { o: e.target.value }); }} aria-label="Ordenar por" data-testid="dir-orden">
            {ORDENES.map(([k, t]) => <option key={k} value={k}>Orden: {t}</option>)}
          </select>
            </div>
        <DesplazaH className="dn-chips" etiqueta="Categorías">
          <button type="button" className={"dn-chip" + (cat === "" ? " on" : "")} onClick={() => setCat("")}>Todas ({est.items.length})</button>
          {miCol && <button type="button" className={"dn-chip" + (col === miCol ? " on" : "")} aria-pressed={col === miCol} data-testid="chip-micol" onClick={() => { setCol(col === miCol ? "" : miCol); setPais(""); setEnt(""); registrar("directorio_mi_colonia"); }}>📍 Mi colonia ({miCol})</button>}
          {est.items.some((i) => i.v) && <button type="button" className={"dn-chip" + (soloV ? " on" : "")} aria-pressed={soloV} onClick={() => setSoloV(!soloV)}>✅ Solo verificados</button>}
          {favs.length > 0 && <button type="button" className={"dn-chip" + (soloFav ? " on" : "")} aria-pressed={soloFav} data-testid="chip-fav" onClick={() => setSoloFav(!soloFav)}>♥ Mis favoritos ({favs.length})</button>}
          {nAbiertos > 0 && <button type="button" className={"dn-chip" + (ahora ? " on" : "")} aria-pressed={ahora} data-testid="chip-abierto" onClick={() => setAhora(!ahora)}>🟢 Abierto ahora ({nAbiertos})</button>}
          {cats.map((c) => <button type="button" key={c.k} className={"dn-chip" + (cat === c.k ? " on" : "")} onClick={() => setCat(cat === c.k ? "" : c.k)}>{categoriaDe(c.k).e} {c.k} ({c.n})</button>)}
        </DesplazaH>
          </div>
        )}

        {est.cargando && <p className="dn-m" role="status">Cargando…</p>}
        {!est.cargando && <p className="dn-m" role="status" data-testid="dir-cuenta">{lista.length} {lista.length === 1 ? "emprendimiento" : "emprendimientos"}{(q || cat || col || pais || ent || soloV || soloFav || ahora) && <> · <button type="button" className="dn-lk" onClick={limpiar}>Quitar filtros</button></>}</p>}
        <div className="dn-lista">
          {lista.slice(0, lim).map((i) => {
            const c = categoriaDe(i.c); const nv = NIVELES[i.niv];
            return (
              <div key={i.s} className="dn-w"><button type="button" className="dn-card" style={{ "--c": c.color }} onClick={() => { registrar("directorio_clic", { s: i.s }); eventoNegocio(i.s, "directorio"); abrirNegocio(i.s); }}>
                <span className="dn-lg">{i.l ? <img src={i.l} alt="" loading="lazy" /> : c.e}</span>
                <span className="dn-t">
                  <b>{i.n}</b>
                  {i.e && <small>{i.e}</small>}
                  <span className="dn-m2"><i>{c.e} {c.nombre}</i>{i.col && <i>📍 {i.col}</i>}{i.v && <i className="dn-vr">✅ Verificado</i>}{i.of && <i className="dn-of">🎟️ Oferta</i>}<Estrellas rp={i.rp} rn={i.rn} />{i.h && abiertoAhora(i.h) === true && <i className="pe-ab" data-testid="abierto-ahora">🟢 Abierto ahora</i>}{esOficial(i.s) ? <i className="dn-nv">🌟 OFICIAL DCUATES</i> : nv && nv.t && <i className="dn-nv">{nv.t}</i>}</span>
                </span>
              </button>
              <BotonFavorito slug={i.s} nombre={i.n} clase="pe-fav dn-fv" />
              <button type="button" className="dn-sh" aria-label={"Compartir " + i.n} data-testid="dir-card-compartir" onClick={() => compartirUno(i)}>📤</button>
              </div>
            );
          })}
        </div>
        {lista.length > lim && <button type="button" className="dn-mas" data-testid="dir-ver-mas" onClick={() => { setLim(lim + 12); registrar("directorio_ver_mas"); }}>Ver más ({lista.length - lim} restantes)</button>}
        {!est.cargando && lista.length === 0 && <p className="dn-m">No encontramos emprendimientos con esos filtros.</p>}
        <PaginaCuateCTA />
        <a className="dn-fin" href="/" data-testid="directorio-logo-pie" aria-label="DCUATES Comunidad: ir a la página principal"><LogoDcuates alto={64} /><em>Juntos construimos una mejor comunidad</em></a>
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.dn-fondo{position:fixed;inset:0;z-index:79;background:var(--dc-fondo,#FBF7EC);font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.dn-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding:0 12px 40px;background:var(--dc-fondo,#FBF7EC)}
.dn-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;margin:0 -12px;background:var(--dc-verde,#1F7A46);color:#fff;padding:8px 10px}
.dn-bar b{flex:1;font-size:17px;font-weight:900}
.dn-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--dc-verde,#1F7A46);font-size:19px;font-weight:900;cursor:pointer}
.dn-p{margin:12px 0 6px;font-size:14px;font-weight:700;line-height:1.4}
.dn-ej{margin:0 -12px 8px;padding:6px 12px;background:#FFF4D6;color:#8a5a0c;font-size:12.5px;font-weight:900;text-align:center}
.dn-f{display:flex;flex-direction:column;gap:8px;margin:8px 0}
.dn-q,.dn-s{min-height:46px;border:2px solid #cfc8b0;border-radius:12px;background:#fff;padding:0 12px;font:inherit;font-size:15px;font-weight:700;color:#0f2d1e;width:100%;box-sizing:border-box}
.dn-chips{padding:2px 0 8px;gap:6px}
.dn-acc{width:100%;min-height:48px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 14px;margin:2px 0 6px;border:2px solid var(--dc-verde,#1F7A46);border-radius:14px;background:#fff;color:var(--dc-verde,#1F7A46);font:inherit;font-size:15px;font-weight:900;cursor:pointer}.dn-acc.on{background:#eef6f0}
.dn-n{margin-left:8px;padding:2px 9px;border-radius:999px;background:var(--dc-verde,#1F7A46);color:#fff;font-style:normal;font-size:12px}
.dn-acc-c{margin:0 0 8px;padding:8px 10px 2px;border:2px solid #e3dcc6;border-radius:14px;background:#fff}
.dn-fin{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:16px;padding:14px 8px 8px;text-decoration:none;color:#4a5b52}.dn-fin em{font-style:normal;font-size:13px;font-weight:800;text-align:center}
.dn-chip{flex:none;min-height:38px;padding:0 12px;border:2px solid var(--dc-verde,#1F7A46);border-radius:999px;background:#fff;color:var(--dc-verde,#1F7A46);font:inherit;font-size:12.5px;font-weight:900;cursor:pointer;white-space:nowrap}
.dn-chip.on{background:var(--dc-verde,#1F7A46);color:#fff}
.dn-m{margin:4px 0 8px;font-size:13px;font-weight:800;color:#4a5b52}
.dn-lk{border:0;background:none;color:var(--dc-verde,#1F7A46);font:inherit;font-weight:900;text-decoration:underline;cursor:pointer;min-height:32px}
.dn-lista{display:flex;flex-direction:column;gap:8px}
.dn-card{display:flex;align-items:center;gap:10px;width:100%;padding:10px;border:2px solid var(--c);border-radius:16px;background:#fff;color:inherit;font:inherit;text-align:left;cursor:pointer}
.dn-lg{flex:none;width:56px;height:56px;border-radius:50%;background:#f1ecdc;display:flex;align-items:center;justify-content:center;font-size:28px;overflow:hidden}
.dn-lg img{width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box;background:#fff}
.dn-sh{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;border:1.5px solid #cfd8d2;background:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.dn-sh:focus-visible{outline:3px solid #FFD54F}
.dn-mas{display:block;width:100%;min-height:48px;margin:10px 0;border:2px solid var(--dc-verde,#1F7A46);border-radius:14px;background:#fff;color:var(--dc-verde,#1F7A46);font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.dn-tira{margin:6px 0;border:1.5px solid #e0d8c4;border-radius:14px;background:#fffdf5;padding:0 8px}.dn-tira>summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-weight:900;font-size:13.5px;color:#0B6E78;list-style:none}.dn-tira>summary::-webkit-details-marker{display:none}.dn-tira[open]>summary{border-bottom:1px solid #eee3c8;margin-bottom:6px}
.dn-sug{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 8px}.dn-sug small{font-weight:800;color:#555}.dn-sug button{border:1.5px solid #cfd8d2;background:#fff;border-radius:999px;min-height:36px;padding:0 12px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}
.dn-w{position:relative}.dn-w .dn-card{padding-right:60px;padding-bottom:42px}.dn-fv{position:absolute;top:8px;right:8px}
${CSS_PE}
.dn-t{display:flex;flex-direction:column;gap:2px;min-width:0}
.dn-t b{font-size:15.5px;font-weight:900;line-height:1.15}
.dn-t small{font-size:12.5px;font-weight:700;color:#4a5b52;line-height:1.3}
.dn-m2{display:flex;flex-wrap:wrap;gap:4px;margin-top:2px}
.dn-m2 i{font-style:normal;font-size:11.5px;font-weight:800;color:var(--c);background:#f6f2e4;border-radius:999px;padding:2px 8px}
.dn-m2 .dn-vr{color:#0b6b32;background:#DDF3E4}.dn-m2 .dn-of{color:#8a5a0c;background:#FFF4D6}.dn-m2 .dn-nv{color:#7a4a00;background:#FFE9A8}
`;
