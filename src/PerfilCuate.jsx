// BLOQUES DE PERFIL PARA LA PÁGINA CUATE (e92) — para profesionales, centros, talleres, cursos y aliados.
// Todo es OPCIONAL: si la hoja no trae el dato, el bloque no aparece. Los datos llegan desde «NegociosCUATE» (ver script e92).
//   BloquesPerfil: Próximo evento · Servicios · Qué atiendo · Modalidades · Cómo trabajo · Sobre mí (y centro)
//   BloqueFAQ:     Preguntas frecuentes
import React from "react";
import { ImagenSegura } from "./componentes/MediaInteligente.jsx";
import { diasHasta, textoCuenta } from "./datos/negocios.js";

const fechaLarga = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  if (!m) return "";
  try {
    const t = new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return t.charAt(0).toUpperCase() + t.slice(1);
  } catch (e) { return iso; }
};
const soloDigitos = (x) => String(x || "").replace(/\D/g, "");

export function BloquesPerfil({ n, clic, abrirOtro }) {
  const ev = n.ev && n.ev.t ? n.ev : null;
  const sv = n.sv || [], at = n.at || [], md = n.md || [], co = n.co || [];
  const tienePerfil = n.pn || n.pt || (n.pcr && n.pcr.length) || n.ce;
  if (!ev && !sv.length && !at.length && !md.length && !co.length && !tienePerfil) return null;
  const cuenta = ev && ev.f ? textoCuenta(diasHasta(ev.f)) : "";
  const urlRegistro = ev
    ? (ev.r || (n.wa ? `https://wa.me/${soloDigitos(n.wa)}?text=${encodeURIComponent("¡Hola! Vi su página en DCUATES y quiero registrarme a: " + ev.t + (ev.f ? " (" + fechaLarga(ev.f) + ")" : "") + ".")}` : ""))
    : "";
  return (
    <>
      <style>{CSS_PERFIL}</style>
      {ev && (
        <section className="pf-ev" data-testid="perfil-evento">
          <span className="pf-ev-tag">● PRÓXIMO EVENTO</span>
          <div className="pf-ev-cab">
            {ev.im && <div className="pf-ev-im"><ImagenSegura src={ev.im} alt={ev.t} icono="🎟️" /></div>}
            <div className="pf-ev-tt">
              {ev.et && <small>{ev.et}</small>}
              <h2>{ev.t}</h2>
              {ev.l && <em>{ev.l}</em>}
            </div>
          </div>
          {ev.pq && <p className="pf-ev-pq"><b>Para quién:</b> {ev.pq}</p>}
          {ev.tx && <p className="pf-ev-tx">{ev.tx}</p>}
          {ev.inc && ev.inc.length > 0 && (
            <>
              <h3>¿Qué te vas a llevar?</h3>
              <ul className="pf-ck">{ev.inc.map((x) => <li key={x}>{x}</li>)}</ul>
            </>
          )}
          <div className="pf-dt">
            {ev.f && <div><small>FECHA</small><b>{fechaLarga(ev.f)}</b></div>}
            {ev.h && <div><small>HORA</small><b>{ev.h}</b></div>}
            {ev.m && <div><small>MODALIDAD</small><b>{ev.m}</b></div>}
            {ev.c && <div><small>COSTO</small><b>{ev.c}</b></div>}
          </div>
          {cuenta && <p className="pf-cd">⏳ {cuenta}</p>}
          {urlRegistro && (
            <a className="pf-bt" href={urlRegistro} target="_blank" rel="noopener noreferrer" data-testid="perfil-evento-registro" onClick={() => clic && clic("evento")}>
              {ev.b || "Registrarme"} →
            </a>
          )}
          {ev.nota && <p className="pf-nota">{ev.nota}</p>}
        </section>
      )}

      {sv.length > 0 && (
        <section className="ng-s" data-testid="perfil-servicios">
          <h2>Servicios y actividades</h2>
          <div className="pf-g">
            {sv.map((s, i) => (
              <div className="pf-c" key={s.t + i}>
                <i>{String(i + 1).padStart(2, "0")}</i>
                <b>{s.t}</b>
                {s.d && <p>{s.d}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {at.length > 0 && (
        <section className="ng-s" data-testid="perfil-atiende">
          <h2>Qué atiendo</h2>
          <div className="pf-chips">{at.map((x) => <span key={x}>{x}</span>)}</div>
        </section>
      )}

      {md.length > 0 && (
        <section className="ng-s" data-testid="perfil-modalidades">
          <h2>¿Cómo te atiendo?</h2>
          <div className="pf-md">
            {md.map((m, i) => (
              <div className={"pf-m" + (i === 0 ? " pf-m1" : "")} key={m.t + i}>
                <b>{m.t}</b>{m.d && <p>{m.d}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {co.length > 0 && (
        <section className="ng-s" data-testid="perfil-como">
          <h2>Cómo trabajo</h2>
          <div className="pf-co">
            {co.map((x, i) => <div key={x.t + i}><b>{x.t}</b>{x.d && <p>{x.d}</p>}</div>)}
          </div>
        </section>
      )}

      {tienePerfil && (
        <section className="ng-s" data-testid="perfil-sobre">
          <h2>{n.pn ? "Sobre mí" : "Sobre nosotros"}</h2>
          <div className="pf-pf">
            {n.pf && <div className="pf-foto"><ImagenSegura src={n.pf} alt={n.pn || ""} icono="🙂" /></div>}
            <div className="pf-tx">
              {n.pn && <b className="pf-nom">{n.pn}</b>}
              {n.pc && <small className="pf-car">{n.pc}</small>}
              {(n.pp || []).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          {n.pcr && n.pcr.length > 0 && (
            <div className="pf-cr">
              <h3>Formación y trayectoria</h3>
              <ul>{n.pcr.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
          {n.ce && (
            <div className="pf-ce" data-testid="perfil-centro">
              <small>FORMO PARTE DE</small>
              <b>{n.ce}</b>
              {n.cen && <p>{n.cen}</p>}
              {n.cs && abrirOtro && <button type="button" className="ng-b" onClick={() => abrirOtro(n.cs)}>Conoce {n.ce} →</button>}
            </div>
          )}
        </section>
      )}
    </>
  );
}

export function BloqueFAQ({ n }) {
  const fq = n.fq || [];
  if (!fq.length) return null;
  return (
    <section className="ng-s" data-testid="perfil-faq">
      <style>{CSS_PERFIL}</style>
      <h2>Preguntas frecuentes</h2>
      {fq.map((f, i) => (
        <details key={f.t + i} className="ng-gd"><summary>{f.t}</summary>{f.d && <p>{f.d}</p>}</details>
      ))}
    </section>
  );
}

const CSS_PERFIL = `
.pf-ev{position:relative;margin:22px 14px 0;padding:18px 14px 14px;border:2px solid var(--c);border-radius:18px;background:#fff;overflow:hidden}
.pf-ev-tag{position:absolute;top:-1px;left:12px;background:var(--c);color:#fff;font-size:11px;font-weight:900;letter-spacing:.05em;padding:4px 10px;border-radius:0 0 10px 10px}
.pf-ev-cab{display:flex;gap:12px;align-items:flex-start;margin-top:8px}
.pf-ev-im{flex:0 0 38%;max-width:150px;aspect-ratio:3/4;border-radius:12px;overflow:hidden;background:#f1ecdc;display:flex;align-items:center;justify-content:center;font-size:36px}
.pf-ev-im img{width:100%;height:100%;object-fit:cover}
.pf-ev-tt{flex:1;min-width:0}.pf-ev-tt small{display:block;font-size:11px;font-weight:900;letter-spacing:.06em;color:var(--c)}
.pf-ev-tt h2{margin:2px 0 4px;font-size:21px;line-height:1.15;font-weight:900;overflow-wrap:anywhere}
.pf-ev-tt em{display:block;font-size:14px;font-weight:700;color:var(--c)}
.pf-ev-pq,.pf-ev-tx{margin:10px 0 0;font-size:14.5px;font-weight:700;line-height:1.45}
.pf-ev h3,.pf-cr h3{margin:12px 0 4px;font-size:15px;font-weight:900}
.pf-ck{margin:0;padding:0;list-style:none}.pf-ck li{position:relative;padding-left:22px;margin:4px 0;font-size:14px;font-weight:700;line-height:1.4}.pf-ck li:before{content:"✓";position:absolute;left:0;color:var(--c);font-weight:900}
.pf-dt{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.pf-dt div{border:2px solid #e3dcc6;border-radius:12px;padding:8px 10px;background:#FBF7EC;min-width:0}.pf-dt small{display:block;font-size:10.5px;font-weight:900;letter-spacing:.06em;color:#6b6b5a}.pf-dt b{font-size:14px;font-weight:900;line-height:1.25;overflow-wrap:anywhere}
.pf-cd{margin:10px 0 0;font-size:14px;font-weight:900;color:#8a1c1c}
.pf-bt{display:flex;align-items:center;justify-content:center;min-height:52px;margin-top:12px;border-radius:14px;background:var(--c);color:#fff;font-size:16px;font-weight:900;text-decoration:none}
.pf-nota{margin:8px 0 0;font-size:13px;font-weight:700;color:#4a5b52;line-height:1.4}
.pf-g{display:grid;grid-template-columns:1fr;gap:8px}
.pf-c{border:2px solid #e3dcc6;border-radius:14px;padding:10px 12px;background:#fff}.pf-c i{display:block;font-style:normal;font-size:12px;font-weight:900;color:var(--c);opacity:.8}.pf-c b{display:block;font-size:15.5px;font-weight:900}.pf-c p{margin:4px 0 0;font-size:13.5px;font-weight:700;line-height:1.4;color:#33433a}
.pf-chips{display:flex;flex-wrap:wrap;gap:6px}.pf-chips span{padding:6px 12px;border-radius:999px;background:#fff;border:2px solid var(--c);color:var(--c);font-size:13.5px;font-weight:900}
.pf-md{display:grid;gap:8px}.pf-m{border:2px solid #e3dcc6;border-radius:14px;padding:10px 12px;background:#fff}.pf-m1{background:var(--c);border-color:var(--c);color:#fff}.pf-m b{font-size:15.5px;font-weight:900}.pf-m p{margin:4px 0 0;font-size:13.5px;font-weight:700;line-height:1.4}
.pf-co{display:grid;gap:10px}.pf-co div{border-top:2px solid var(--c);padding-top:6px}.pf-co b{font-size:15px;font-weight:900}.pf-co p{margin:3px 0 0;font-size:14px;font-weight:700;line-height:1.45;color:#33433a}
.pf-pf{display:flex;flex-direction:column;gap:10px}
.pf-foto{width:100%;max-width:300px;aspect-ratio:4/5;border-radius:18px;overflow:hidden;background:#f1ecdc;display:flex;align-items:center;justify-content:center;font-size:56px;align-self:center}.pf-foto img{width:100%;height:100%;object-fit:cover}
.pf-nom{display:block;font-size:19px;font-weight:900}.pf-car{display:block;margin-bottom:6px;font-size:13.5px;font-weight:900;color:var(--c)}
.pf-tx p{margin:0 0 8px;font-size:14.5px;font-weight:700;line-height:1.5}
.pf-cr{margin-top:6px;padding:12px;border-radius:16px;background:var(--c);color:#fff}.pf-cr h3{margin:0 0 4px;color:#fff}.pf-cr ul{margin:0;padding-left:18px}.pf-cr li{font-size:13.5px;font-weight:700;line-height:1.45}
.pf-ce{margin-top:12px;padding:12px;border:2px dashed var(--c);border-radius:16px;background:#fff;display:flex;flex-direction:column;gap:6px}.pf-ce small{font-size:11px;font-weight:900;letter-spacing:.06em;color:var(--c)}.pf-ce b{font-size:16.5px;font-weight:900}.pf-ce p{margin:0;font-size:14px;font-weight:700;line-height:1.4}
`;
