// e83a2 — (1) Lista completa de emprendimientos CUATE DENTRO de cada Página CUATE (botón que despliega, con buscador y categorías).
//          (2) Páginas genéricas por categoría: dcuates.com/n/categoria-<nombre> (p. ej. categoria-alimentos) con una barra para elegir un negocio.
import React, { useEffect, useMemo, useState } from "react";
import { cargarDirectorio, ordenarDirectorio, categoriaDe, LISTA_CATEGORIAS, NIVELES, esOficial } from "./datos/negocios.js";
import { abrirNegocio } from "./NegocioCuate.jsx";
import { registrar } from "./analitica.js";
import { BotonFavorito, PromoDelMes, RetoVisitas, CSS_PE } from "./PiezasEmprendimientos.jsx";
import { useFavoritos } from "./utilidades/favoritos.js";
import { abiertoAhora } from "./utilidades/horario.js";

const sinAc = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
export const slugCategoria = (nombre) => "categoria-" + sinAc(nombre).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const esSlugCategoria = (s) => /^categorias?(-[a-z0-9-]+)?$/.test(String(s || ""));
export const categoriaDeSlug = (s) => LISTA_CATEGORIAS.find((c) => slugCategoria(c.nombre) === s) || null;

function useDirectorio() {
  const [d, setD] = useState({ cargando: true, items: [] });
  useEffect(() => {
    let vivo = true;
    cargarDirectorio().then((r) => { if (vivo) setD({ cargando: false, items: ordenarDirectorio(r.items || [], "destacados"), ejemplo: !!r.ejemplo }); });
    return () => { vivo = false; };
  }, []);
  return d;
}
const Tarjeta = ({ x, alElegir }) => {
  const c = categoriaDe(x.c);
  return (
    <div className="pc-w"><button type="button" className="pc-t" style={{ "--c": c.color }} data-testid="pc-negocio" onClick={() => alElegir(x)}>
      <span className="pc-l">{x.l ? <img src={x.l} alt="" loading="lazy" /> : c.e}</span>
      <span className="pc-x"><b>{x.n}</b><small>{c.nombre}{x.col ? " · " + x.col : ""}</small>{x.e && <small className="pc-e">{x.e}</small>}{x.h && abiertoAhora(x.h) === true && <em className="pe-ab" data-testid="abierto-ahora">🟢 Abierto ahora</em>}</span>
      {esOficial(x.s) ? <i>🌟</i> : NIVELES[x.niv] && NIVELES[x.niv].t ? <i>{x.niv === "P" ? "🌟" : "💛"}</i> : null}
    </button><BotonFavorito slug={x.s} nombre={x.n} clase="pe-fav pc-fv" /></div>
  );
};

// Lista desplegable dentro de una Página CUATE
export function ListaNegocios({ actual = "", siempre = false }) {
  const [abiertaX, setAbierta] = useState(false);
  const abierta = siempre || abiertaX;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [soloFav, setSoloFav] = useState(false);
  const [ahora, setAhora] = useState(false);
  const favs = useFavoritos();
  const d = useDirectorio();
  const lista = useMemo(() => d.items.filter((x) => x.s !== actual && (!cat || categoriaDe(x.c).nombre === cat) && (!soloFav || favs.includes(x.s)) && (!ahora || abiertoAhora(x.h) === true) && (!q.trim() || sinAc(x.n + " " + x.e + " " + x.col + " " + categoriaDe(x.c).nombre).includes(sinAc(q.trim())))), [d.items, actual, cat, q, soloFav, ahora, favs]);
  const nAb = useMemo(() => d.items.filter((x) => abiertoAhora(x.h) === true).length, [d.items]);
  const nombres = useMemo(() => Object.fromEntries(d.items.map((x) => [x.s, x.n])), [d.items]);
  const cats = useMemo(() => { const m = new Set(d.items.map((x) => categoriaDe(x.c).nombre)); return LISTA_CATEGORIAS.filter((c) => m.has(c.nombre)); }, [d.items]);
  return (
    <section className="pc-caja" data-testid="lista-negocios">
      {!siempre && <button type="button" className="pc-abrir" aria-expanded={abierta} onClick={() => { setAbierta(!abierta); if (!abierta) registrar("negocio_lista_abrir", { s: actual }); }}>
        {abierta ? "▲ Ocultar emprendimientos CUATE" : `🔎 Ver todos los emprendimientos CUATE${d.items.length ? " (" + d.items.length + ")" : ""}`}
      </button>}
      {abierta && (
        <div className="pc-cuerpo">
          {!d.cargando && <PromoDelMes items={d.items} abrir={(x) => abrirNegocio(x)} />}
          {!d.cargando && <RetoVisitas nombres={nombres} />}
          <input className="pc-q" type="search" placeholder="Buscar emprendimiento, giro o colonia…" aria-label="Buscar emprendimiento" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="pc-chips" role="tablist" aria-label="Categorías">
            <button type="button" role="tab" aria-selected={!cat} className={!cat ? "on" : ""} onClick={() => setCat("")}>Todas</button>
            {favs.length > 0 && <button type="button" aria-pressed={soloFav} className={soloFav ? "on" : ""} data-testid="chip-fav" onClick={() => setSoloFav(!soloFav)}>♥ Favoritos ({favs.length})</button>}
            {nAb > 0 && <button type="button" aria-pressed={ahora} className={ahora ? "on" : ""} data-testid="chip-abierto" onClick={() => setAhora(!ahora)}>🟢 Abierto ahora ({nAb})</button>}
            {cats.map((c) => <button type="button" key={c.k} role="tab" aria-selected={cat === c.nombre} className={cat === c.nombre ? "on" : ""} onClick={() => setCat(c.nombre)}>{c.e} {c.nombre}</button>)}
          </div>
          {d.cargando && <p className="pc-m">Cargando…</p>}
          {!d.cargando && lista.length === 0 && <p className="pc-m">No hay emprendimientos con ese filtro.</p>}
          <div className="pc-lista">{lista.map((x) => <Tarjeta key={x.s} x={x} alElegir={(n) => abrirNegocio(n.s)} />)}</div>
        </div>
      )}
      <style>{CSS}</style>
    </section>
  );
}

// Página genérica de una categoría (o «categorias» = todas)
export function PaginaCategoria({ slug }) {
  const d = useDirectorio();
  const cat = categoriaDeSlug(slug);
  const [sel, setSel] = useState("");
  const lista = d.items.filter((x) => !cat || categoriaDe(x.c).nombre === cat.nombre);
  const x = lista.find((y) => y.s === sel) || null;
  useEffect(() => { setSel(""); registrar("categoria_abrir", { s: slug }); }, [slug]);
  const c = cat || { e: "🌐", nombre: "Todas las categorías", color: "#1F7A46" };
  return (
    <div className="pc-pag" style={{ "--c": c.color }} data-testid="pagina-categoria">
      <style>{CSS}</style>
      <div className="pc-hero"><span aria-hidden="true">{c.e}</span><h1>{cat ? `Emprendimientos CUATE · ${c.nombre}` : "Emprendimientos CUATE por categoría"}</h1>
        <p>{cat ? "Elige un emprendimiento de la barra para ver su ficha. Son páginas CUATE de la comunidad (las marcadas como ejemplo muestran cómo se vería la tuya)." : "Elige una categoría para ver sus emprendimientos."}</p></div>
      {cat && (
        <>
          <p className="pc-et">Emprendimientos de esta categoría{d.items.length ? ` (${lista.length})` : ""}</p>
          <div className="pc-barra" data-testid="pc-barra" role="tablist" aria-label="Emprendimientos de la categoría">
            {d.cargando && <span className="pc-m">Cargando…</span>}
            {lista.map((y) => <button type="button" key={y.s} role="tab" aria-selected={sel === y.s} className={sel === y.s ? "on" : ""} onClick={() => setSel(y.s)}>{y.n}</button>)}
          </div>
          {!d.cargando && lista.length === 0 && <p className="pc-m">Aún no hay emprendimientos en esta categoría. ¡Puede ser el tuyo!</p>}
          {x && (
            <article className="pc-ficha" data-testid="pc-ficha">
              <h2>{x.n}</h2>{x.e && <p className="pc-e">{x.e}</p>}
              <p><small>{c.e} {c.nombre}{x.col ? " · " + x.col : ""}</small></p>
              <button type="button" className="pc-abrir" onClick={() => abrirNegocio(x.s)}>Abrir su página completa</button>
            </article>
          )}
        </>
      )}
      <p className="pc-et">{cat ? "Otras categorías" : "Categorías"}</p>
      <div className="pc-chips pc-cats">
        {LISTA_CATEGORIAS.filter((k) => !cat || k.nombre !== cat.nombre).map((k) => <button type="button" key={k.k} onClick={() => abrirNegocio(slugCategoria(k.nombre))}>{k.e} {k.nombre}</button>)}
      </div>
    </div>
  );
}

const CSS = `
.pc-caja{margin:0 0 10px}.pc-abrir{display:flex;align-items:center;justify-content:center;width:100%;box-sizing:border-box;min-height:50px;padding:0 14px;border:2px solid var(--c,#1F7A46);border-radius:14px;background:#fff;color:var(--c,#1F7A46);font:inherit;font-size:15px;font-weight:900;cursor:pointer}
.pc-cuerpo{margin-top:8px}.pc-q{width:100%;box-sizing:border-box;min-height:46px;border:2px solid #cfc8b0;border-radius:12px;padding:6px 12px;font:inherit;font-size:15px;font-weight:700;background:#fff;margin-bottom:8px}
.pc-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:6px}.pc-chips button,.pc-barra button{flex:0 0 auto;min-height:44px;padding:0 14px;border:2px solid #0f2d1e;border-radius:22px;background:#fff;color:#0f2d1e;font:inherit;font-size:14px;font-weight:900;cursor:pointer}
.pc-chips button.on,.pc-barra button.on{background:#0f2d1e;color:#fff}
.pc-cats{flex-wrap:wrap;overflow:visible}
.pc-w{position:relative}.pc-w .pc-t{padding-right:60px}.pc-fv{position:absolute;top:8px;right:8px}
${CSS_PE}
.pc-lista{display:flex;flex-direction:column;gap:6px}.pc-t{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;min-height:56px;padding:8px 10px;border:2px solid var(--c);border-radius:14px;background:#fff;color:#0f2d1e;font:inherit;text-align:left;cursor:pointer}
.pc-l{flex:none;width:40px;height:40px;border-radius:10px;background:#f2efe3;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden}.pc-l img{width:100%;height:100%;object-fit:cover}
.pc-x{flex:1;min-width:0;display:flex;flex-direction:column}.pc-x b{font-size:15px;font-weight:900}.pc-x small{font-size:12.5px;font-weight:700;color:#4a5a50;overflow-wrap:anywhere}.pc-t i{font-style:normal;font-size:18px}
.pc-m{font-size:14px;font-weight:700;margin:6px 0}
.pc-pag{padding:12px 14px 20px}.pc-hero{text-align:center;padding:8px 0}.pc-hero span{font-size:44px}.pc-hero h1{margin:4px 0;font-size:20px;font-weight:900;color:var(--c)}.pc-hero p{margin:0;font-size:14px;font-weight:700}
.pc-et{margin:14px 0 6px;font-size:14px;font-weight:900;color:var(--c)}.pc-barra{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px}
.pc-ficha{margin-top:8px;padding:12px;border:2px solid var(--c);border-radius:14px;background:#fff}.pc-ficha h2{margin:0;font-size:18px;font-weight:900}.pc-e{margin:2px 0;font-size:14px;font-weight:700}
`;
