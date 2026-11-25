// e95 — ANUNCIOS con botones editables y REELS DE PRODUCTOS de una Página CUATE.
//  · Anuncio: título, texto (con «Ver más»), imagen opcional y hasta 2 botones con texto y enlace libres (https, WhatsApp, tel, mailto).
//  · Reels de productos: carruseles con imagen, título, precio y botón con enlace propio por imagen.
// Los enlaces ya llegan validados desde el script; aquí se vuelve a validar (nunca se pinta un enlace raro).
import React from "react";
import { VerMas } from "./PerfilCuate.jsx";

export const enlaceOk = (u) => /^(https:\/\/[^\s"'<>]+|tel:\+?\d{8,15}|mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/i.test(String(u || ""));
const esWeb = (u) => /^https:/i.test(u);
const fmtFecha = (iso) => { const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : ""; };
export const diasRestantes = (iso) => { const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; const f = new Date(+m[1], +m[2] - 1, +m[3]); const h = new Date(); h.setHours(0, 0, 0, 0); return Math.round((f - h) / 86400000); };

// Mismo formato que la hoja: «Título ~ Texto ~ Imagen ~ Botón 1 ~ Enlace 1 ~ Botón 2 ~ Enlace 2 ~ Vence» separados por | (para la vista previa del panel).
export function enlaceSeguro(x) {
  const u = String(x || "").trim(); if (!u) return "";
  if (/^https:\/\/[^\s"'<>]+$/i.test(u)) return u.slice(0, 500);
  let m = u.match(/^(?:wa:|whatsapp:)?\s*\+?(\d[\d\s-]{8,16})$/i);
  if (m) { let d = m[1].replace(/\D/g, ""); if (d.length === 10) d = "52" + d; return d.length >= 11 && d.length <= 15 ? "https://wa.me/" + d : ""; }
  m = u.match(/^tel:\s*\+?([\d\s-]{8,16})$/i); if (m) return "tel:" + m[1].replace(/\D/g, "");
  m = u.match(/^mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/i); if (m) return "mailto:" + m[1];
  return "";
}
export function leerAnuncios(texto, max = 6) {
  const lim = (x, n) => String(x == null ? "" : x).replace(/\s+/g, " ").trim().slice(0, n);
  return String(texto || "").split("|").map((t) => {
    const p = t.split("~"), b = [];
    [[3, 4], [5, 6]].forEach(([a, e]) => { const u = enlaceSeguro(p[e]); if (u) b.push({ t: lim(p[a], 30) || "Ver más", u }); });
    const im = String(p[2] || "").trim();
    const f = String(p[7] || "").trim(); const m2 = f.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); const m1 = f.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const v = m1 ? m1[0] : m2 ? `${m2[3]}-${("0" + m2[2]).slice(-2)}-${("0" + m2[1]).slice(-2)}` : "";
    return { t: lim(p[0], 90), d: lim(p[1], 500), i: /^https:\/\/[^\s"'<>]+$/i.test(im) ? im : "", b, v };
  }).filter((c) => c.t).slice(0, max);
}

function Boton({ b, k, clic, ev }) {
  if (!enlaceOk(b.u)) return null;
  const web = esWeb(b.u);
  return <a className={"an-b" + (k === 0 ? " an-b1" : "")} href={b.u} {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => clic && clic(ev)}>{b.t}{web && !/wa\.me/.test(b.u) ? " ↗" : ""}</a>;
}

export function Anuncios({ items, clic }) {
  const lista = (items || []).filter((a) => a && a.t);
  if (!lista.length) return null;
  return (
    <section className="ng-s an" id="ng-anuncios" data-testid="negocio-anuncios">
      <style>{CSS}</style>
      <h2>📢 Anuncios</h2>
      <ul className="an-l">
        {lista.map((a, i) => {
          const dr = diasRestantes(a.v);
          return (
            <li className="an-c" key={i} data-testid="negocio-anuncio">
              {a.i && enlaceOk(a.i) && <img className="an-i" src={a.i} alt="" loading="lazy" decoding="async" />}
              <div className="an-t">
                {dr != null && dr >= 0 && dr <= 7 && <span className="an-pronto">⏳ {dr === 0 ? "Termina hoy" : dr === 1 ? "Termina mañana" : `Termina en ${dr} días`}</span>}
                <b>{a.t}</b>
                {a.d && <VerMas className="an-d" lineas={4}>{a.d}</VerMas>}
                {a.v && <small>Hasta el {fmtFecha(a.v)}</small>}
                {a.b && a.b.length > 0 && <div className="an-bs">{a.b.slice(0, 2).map((b, k) => <Boton key={k} b={b} k={k} clic={clic} ev="anuncio" />)}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ReelsProductos({ reels, clic }) {
  const lista = (reels || []).filter((r) => r && r.it && r.it.length);
  if (!lista.length) return null;
  return (
    <section className="ng-s an" id="ng-reels" data-testid="negocio-reels">
      <style>{CSS}</style>
      {lista.map((r, k) => (
        <div key={k} className="rp" data-testid="negocio-reel-prod">
          <h2>{lista.length === 1 ? "🛍️ " : ""}{r.n}</h2>
          <div className="rp-pista" tabIndex={0} aria-label={`Productos: ${r.n}`}>
            {r.it.map((x, i) => {
              const cuerpo = (
                <>
                  <img src={x.u} alt={x.t || ""} loading="lazy" decoding="async" />
                  {(x.t || x.p) && <span className="rp-tx">{x.t && <b>{x.t}</b>}{x.p && <em>{x.p}</em>}</span>}
                </>
              );
              return enlaceOk(x.l) ? (
                <a key={i} className="rp-it" href={x.l} {...(esWeb(x.l) ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => clic && clic("reel")} aria-label={`${x.t || "Producto"}: ${x.b || "Ver más"}`}>
                  {cuerpo}<span className="rp-bt">{x.b || "Ver más"}</span>
                </a>
              ) : <div key={i} className="rp-it">{cuerpo}</div>;
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

const CSS = `
.an-l{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:12px}
.an-c{border:2px solid var(--c,#1F7A46);border-radius:16px;background:#fff;overflow:hidden}
.an-i{display:block;width:100%;max-height:200px;object-fit:cover}
.an-t{display:flex;flex-direction:column;gap:6px;padding:10px 12px 12px}
.an-t>b{font-size:17px;font-weight:900;line-height:1.25;overflow-wrap:anywhere}
.an-d{font-size:14.5px;font-weight:700;line-height:1.45;color:#2b3a32}
.an-t small{font-size:12.5px;font-weight:800;color:#6b6b5a}
.an-pronto{align-self:flex-start;background:#FFF4D6;color:#8a5a0c;border-radius:999px;padding:3px 10px;font-size:12.5px;font-weight:900}
.an-bs{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.an-b{flex:1 1 130px;display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 12px;border:2px solid var(--c,#1F7A46);border-radius:14px;background:#fff;color:var(--c,#1F7A46);font:900 15px Nunito,system-ui,sans-serif;text-align:center;text-decoration:none}
.an-b1{background:var(--c,#1F7A46);color:#fff}
.rp{margin-bottom:14px}
.rp-pista{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 8px;scrollbar-width:thin}
.rp-it{flex:0 0 62%;max-width:230px;scroll-snap-align:start;display:flex;flex-direction:column;border:2px solid #e3dcc6;border-radius:14px;background:#fff;overflow:hidden;text-decoration:none;color:#0f2d1e}
.rp-it img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;background:#efe9d4}
.rp-tx{display:flex;flex-direction:column;gap:2px;padding:8px 10px 4px}.rp-tx b{font-size:14.5px;font-weight:900;line-height:1.25;overflow-wrap:anywhere}.rp-tx em{font-style:normal;font-size:15px;font-weight:900;color:var(--c,#1F7A46)}
.rp-bt{margin:4px 10px 10px;min-height:40px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:var(--c,#1F7A46);color:#fff;font-size:14px;font-weight:900;text-align:center;padding:0 8px}
`;
