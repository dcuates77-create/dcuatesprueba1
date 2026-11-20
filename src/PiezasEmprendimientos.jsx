// e84b — piezas compartidas por las listas de emprendimientos: ♥ favorito, promoción del mes y reto de visitas.
import React from "react";
import { alternarFavorito, useFavoritos } from "./utilidades/favoritos.js";
import { useReto, META_RETO, marcarReclamado } from "./utilidades/reto.js";
import { promoDelMes, diasHasta, textoCuenta, diasFinDeMes, categoriaDe } from "./datos/negocios.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { registrar } from "./analitica.js";

export function BotonFavorito({ slug, nombre = "", clase = "pe-fav" }) {
  const fav = useFavoritos().includes(slug);
  return (
    <button type="button" className={clase + (fav ? " on" : "")} aria-pressed={fav} data-testid="btn-fav"
      aria-label={fav ? `Quitar ${nombre} de mis favoritos` : `Guardar ${nombre} en mis favoritos`}
      onClick={(e) => { e.stopPropagation(); const on = alternarFavorito(slug); registrar("negocio_favorito", { s: slug, on }); }}>
      {fav ? "♥" : "♡"}
    </button>
  );
}

export const Estrellas = ({ rp, rn }) => (rn > 0 ? <i className="pe-st" data-testid="estrellas" aria-label={`${rp} de 5 estrellas, ${rn} opiniones`}>★ {Number(rp).toFixed(1)} · {rn}</i> : null);

export function PromoDelMes({ items, abrir }) {
  const p = promoDelMes(items);
  if (!p) return null;
  const n = p.ov ? diasHasta(p.ov) : diasFinDeMes();
  const c = categoriaDe(p.c);
  return (
    <button type="button" className="pe-promo" data-testid="promo-mes" onClick={() => { registrar("promo_mes_clic", { s: p.s }); abrir(p.s); }}>
      <span className="pe-pm-k">⭐ PROMOCIÓN DEL MES</span>
      <b>{p.n}</b>
      <span className="pe-pm-t">🎟️ {p.ot}</span>
      <small>{c.e} {c.nombre}{n != null && n >= 0 ? " · ⏳ " + textoCuenta(n) : ""}</small>
    </button>
  );
}

export function RetoVisitas({ nombres = {} }) {
  const x = useReto();
  const n = Math.min(x.v.length, META_RETO);
  const listo = x.v.length >= META_RETO;
  const reclamar = () => {
    registrar("reto_visitas_reclamar", { n: x.v.length });
    if (!x.r) marcarReclamado();
    abrirRegistroPrevio("retovisitas", { valores: { vis: x.v.map((s) => nombres[s] || s).join(", ").slice(0, 300) } });
  };
  return (
    <section className="pe-reto" data-testid="reto-visitas" aria-label="Reto del mes">
      <style>{CSS_PE}</style>
      <b>🧭 Reto del mes: visita {META_RETO} emprendimientos CUATE</b>
      <div className="pe-pasos" aria-hidden="true">{Array.from({ length: META_RETO }, (_, i) => <i key={i} className={i < n ? "on" : ""}>{i < n ? "✓" : i + 1}</i>)}</div>
      <p>{listo ? (x.r ? "¡Reto cumplido! Ya mandaste tu reclamo este mes." : "¡Lo lograste! Reclama tus puntos.") : `Llevas ${n} de ${META_RETO}. Abre la página de cada emprendimiento y gana puntos en tu Pase.`}</p>
      {listo && <button type="button" onClick={reclamar}>{x.r ? "Enviar mi reclamo de nuevo" : "🎁 Reclamar mis puntos"}</button>}
    </section>
  );
}

export const CSS_PE = `
.pe-fav{flex:none;width:44px;height:44px;border:2px solid #d8d2bd;border-radius:50%;background:#fff;color:#8a5a5a;font-size:22px;line-height:1;cursor:pointer}
.pe-fav.on{color:#C62828;border-color:#C62828;background:#FDECEC}
.pe-promo{display:flex;flex-direction:column;gap:2px;width:100%;box-sizing:border-box;margin:0 0 10px;padding:10px 12px;border:2px solid var(--dc-dorado,#B7791F);border-radius:14px;background:linear-gradient(135deg,#FFF4D6,#FFE9B0);color:#4a2f00;font:inherit;text-align:left;cursor:pointer}
.pe-pm-k{font-size:12px;font-weight:900;letter-spacing:.04em;color:#8a5a00}.pe-promo b{font-size:17px;font-weight:900}.pe-pm-t{font-size:14.5px;font-weight:800}.pe-promo small{font-size:12.5px;font-weight:800}
.pe-reto{margin:0 0 10px;padding:10px 12px;border:2px solid #1B6F8A;border-radius:14px;background:#E6F2F7;color:#0f2d3a}
.pe-reto b{font-size:15px;font-weight:900}.pe-reto p{margin:4px 0;font-size:13.5px;font-weight:700}
.pe-pasos{display:flex;gap:8px;margin:6px 0}.pe-pasos i{width:34px;height:34px;border-radius:50%;border:2px solid #1B6F8A;background:#fff;color:#1B6F8A;display:flex;align-items:center;justify-content:center;font-style:normal;font-weight:900}.pe-pasos i.on{background:#1B6F8A;color:#fff}
.pe-reto button{min-height:46px;width:100%;border:0;border-radius:12px;background:#1B6F8A;color:#fff;font:inherit;font-weight:900;font-size:15px;cursor:pointer}
.pe-st{display:inline-block;font-size:12px;font-weight:900;font-style:normal;border-radius:10px;padding:1px 8px;background:#FFF1C9;color:#7a4b00}
.pe-ab{display:inline-block;font-size:11.5px;font-weight:900;font-style:normal;border-radius:10px;padding:1px 8px;background:#DDF3E4;color:#14532d}
`;
