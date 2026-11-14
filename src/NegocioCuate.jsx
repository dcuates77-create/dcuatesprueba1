// MINI PÁGINA DE UN NEGOCIO CUATE (e79) — se abre con dcuates.com/n/<slug> (→ #negocio-<slug>) o con abrirNegocio("slug").
// Una sola plantilla para todos los negocios; el contenido viene de la hoja «NegociosCUATE» (ver src/datos/negocios.js).
// Bloques: portada · contacto · qué ofrece · Pase del negocio · (Patrocinador: galería · oferta · Club · Red CUATE).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { cargarNegocio, categoriaDe } from "./datos/negocios.js";
import { URL_SITIO } from "./datos/config.js";

export const abrirNegocio = (slug) => { try { window.dispatchEvent(new CustomEvent("dcuates:negocio", { detail: slug })); } catch (e) { /* sin eventos */ } };

const slugDeHash = () => {
  const h = decodeURIComponent((typeof window !== "undefined" && window.location.hash) || "");
  return /^#negocio-[a-z0-9-]{1,60}$/.test(h) ? h.slice("#negocio-".length) : "";
};
// Quien llega por la página de un negocio queda ligado a él al registrarse en el Club (mismo mecanismo ?inv= de e58).
const recordarCodigo = (cod) => {
  try {
    if (!cod) return;
    const v = JSON.parse(localStorage.getItem("dc_inv") || "null");
    if (v && v.c && Date.now() - v.t < 60 * 86400000) return; // ya traía una invitación: se respeta
    localStorage.setItem("dc_inv", JSON.stringify({ c: cod, t: Date.now() }));
  } catch (e) { /* sin almacenamiento */ }
};
const telHref = (t) => { const d = String(t || "").replace(/\D/g, ""); return d ? `tel:+${d.length === 10 ? "52" + d : d}` : ""; };

export default function NegocioCuate() {
  const [slug, setSlug] = useState(slugDeHash);
  const [est, setEst] = useState({ cargando: true });
  useEffect(() => {
    // El «#negocio-…» se lee una vez y se quita de la dirección: así «Atrás» y «Cerrar» no vuelven a abrir la página.
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    const al = () => { const s = slugDeHash(); if (s) { setSlug(s); quitar(); } };
    if (slugDeHash()) quitar();
    // Abrir otro negocio sin tocar el historial (así la ventana no se cierra sola): desde la Red o desde cualquier botón.
    const ir = (e) => {
      const s = String((e && e.detail) || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
      if (!s) return;
      setSlug(s);
    };
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:negocio", ir);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:negocio", ir); };
  }, []);
  const cerrar = () => setSlug("");
  const oculta = useAtras(!!slug, cerrar);
  useEffect(() => {
    if (!slug) return undefined;
    let vivo = true;
    setEst({ cargando: true });
    cargarNegocio(slug).then((r) => {
      if (!vivo) return;
      setEst({ cargando: false, ...r });
      if (r.ok) { recordarCodigo(r.negocio.cod); registrar("negocio_abrir", { s: slug }); }
      else registrar("negocio_no_encontrado", { s: slug });
    });
    return () => { vivo = false; };
  }, [slug]);
  useEffect(() => {
    if (!slug) return undefined;
    const ant = document.title;
    if (est.ok) document.title = `${est.negocio.n} | DCUATES`;
    const caja = document.querySelector(".ng-caja"); if (caja) caja.scrollTop = 0;
    return () => { document.title = ant; };
  }, [slug, est]);
  if (!slug) return null;
  const n = est.ok ? est.negocio : null;
  const cat = categoriaDe(n && n.c);
  const url = `${URL_SITIO}/n/${slug}`;
  const compartir = () => {
    registrar("negocio_compartir", { s: slug });
    const texto = n ? `${n.n}${n.e ? " — " + n.e : ""}. Negocio CUATE en DCUATES:` : "Negocio CUATE en DCUATES:";
    if (navigator.share) { navigator.share({ title: n ? n.n : "DCUATES", text: texto, url }).catch(() => {}); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`, "_blank", "noopener");
  };
  const clic = (que) => registrar("negocio_clic", { s: slug, q: que });
  return createPortal(
    <div className="ng-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={n ? n.n : "Negocio CUATE"} data-testid="negocio">
      <style>{CSS}</style>
      <div className="ng-caja" style={{ "--c": cat.color }}>
        <div className="ng-bar">
          <button type="button" className="ng-x" onClick={cerrar} aria-label="Cerrar">✕</button>
          <b>{n ? n.n : "Negocio CUATE"}</b>
          {n && <button type="button" className="ng-sh" onClick={compartir} aria-label="Compartir">📤</button>}
        </div>
        {est.cargando && <p className="ng-msg" role="status">Cargando…</p>}
        {!est.cargando && !est.ok && (
          <div className="ng-msg">
            <p><b>{est.motivo === "no-encontrado" ? "No encontramos esta página." : "No pudimos cargar esta página ahora."}</b></p>
            <p>{est.motivo === "no-encontrado" ? "Puede que el enlace esté mal escrito o que el negocio aún no esté publicado." : "Revisa tu conexión e inténtalo de nuevo."}</p>
            <button type="button" className="ng-b ng-b1" onClick={cerrar}>Ir a DCUATES</button>
          </div>
        )}
        {n && (
          <>
            {est.ejemplo && <p className="ng-ej">EJEMPLO ilustrativo · así se vería tu página</p>}
            <div className="ng-portada" style={n.portada ? { backgroundImage: `url("${n.portada}")` } : undefined}>
              <span className="ng-cat">{cat.e} {cat.nombre.toUpperCase()}</span>
              {n.patro && <span className="ng-pat">🌟 CUATE PATROCINADOR</span>}
            </div>
            <div className="ng-id">
              <div className="ng-logo">{n.logo ? <img src={n.logo} alt="" loading="lazy" /> : <span aria-hidden="true">{cat.e}</span>}</div>
              <h1>{n.n}</h1>
              {n.e && <p className="ng-esl">{n.e}</p>}
            </div>
            <div className="ng-acc">
              {n.wa && <a className="ng-b ng-wa" href={`https://wa.me/${n.wa}?text=${encodeURIComponent("¡Hola! Vi su página en DCUATES.")}`} target="_blank" rel="noopener noreferrer" onClick={() => clic("wa")}>💬 WhatsApp</a>}
              {n.tel && <a className="ng-b" href={telHref(n.tel)} onClick={() => clic("tel")}>📞 Llamar</a>}
              {(n.mapa || n.dir) && <a className="ng-b" href={n.mapa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.dir + " " + n.n)}`} target="_blank" rel="noopener noreferrer" onClick={() => clic("mapa")}>📍 Cómo llegar</a>}
            </div>
            {n.d && <section className="ng-s"><p className="ng-d">{n.d}</p></section>}
            {n.of && n.of.length > 0 && (
              <section className="ng-s"><h2>Qué ofrece</h2><ul className="ng-l">{n.of.map((x) => <li key={x}>{x}</li>)}</ul></section>
            )}
            {(n.h || n.dir) && (
              <section className="ng-s ng-dat">{n.h && <p>🕒 {n.h}</p>}{n.dir && <p>📍 {n.dir}</p>}</section>
            )}
            {n.gal && n.gal.length > 0 && (
              <section className="ng-s"><h2>Galería</h2><div className="ng-gal">{n.gal.map((g) => <img key={g} src={g} alt="" loading="lazy" />)}</div></section>
            )}
            {n.ofT && (
              <section className="ng-oferta" data-testid="negocio-oferta">
                <span>🎟️ OFERTA PARA CUATES</span><b>{n.ofT}</b>{n.ofD && <p>{n.ofD}</p>}
              </section>
            )}
            {(n.rec || n.nec || n.com) && (
              <section className="ng-pase" data-testid="negocio-pase">
                <header><span>PASE CUATE · {cat.nombre.toUpperCase()}</span><b>{n.n}</b></header>
                {n.rec && <p><i>🎁 RECIBO</i>{n.rec}</p>}
                {n.nec && <p><i>🙋 NECESITO</i>{n.nec}</p>}
                {n.com && <p><i>🤝 COMPARTO</i>{n.com}</p>}
              </section>
            )}
            {n.club && (
              <section className="ng-club" data-testid="negocio-club">
                <h2>🧡 Con {n.n} ganas más</h2>
                <p>Únete gratis al Club DCUATES: suma puntos, recibe beneficios y apoya a los negocios de tu comunidad.</p>
                <button type="button" className="ng-b ng-b1" onClick={() => { registrar("negocio_club", { s: slug }); recordarCodigo(n.cod); abrirRegistroPrevio("club", {}); }}>ÚNETE AL CLUB →</button>
                <button type="button" className="ng-b" onClick={() => { registrar("negocio_pase", { s: slug }); window.dispatchEvent(new Event("dcuates:tarjeta")); }}>💳 Ya soy Cuate: abrir mi Pase</button>
              </section>
            )}
            {n.red && n.red.length > 0 && (
              <section className="ng-s" data-testid="negocio-red">
                <h2>Más de la red CUATE</h2>
                <div className="ng-red">
                  {n.red.map((r) => {
                    const c = categoriaDe(r.c);
                    return (
                      <button type="button" key={r.s} className="ng-rd" style={{ "--c": c.color }} onClick={() => { registrar("negocio_red", { de: slug, a: r.s }); abrirNegocio(r.s); }}>
                        <span className="ng-rl">{r.l ? <img src={r.l} alt="" loading="lazy" /> : c.e}</span>
                        <b>{r.n}</b><small>{c.nombre}</small>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
            <section className="ng-pie">
              <p>🌐 Esta página es parte de la red <b>CUATE</b> de DCUATES, comunidad de apoyo mutuo.</p>
              <div className="ng-redes">
                {n.web && <a href={n.web} target="_blank" rel="noopener noreferrer" onClick={() => clic("web")}>🌐 Sitio</a>}
                {n.fb && <a href={n.fb} target="_blank" rel="noopener noreferrer" onClick={() => clic("fb")}>Facebook</a>}
                {n.ig && <a href={n.ig} target="_blank" rel="noopener noreferrer" onClick={() => clic("ig")}>Instagram</a>}
              </div>
              <button type="button" className="ng-b" onClick={() => { registrar("negocio_quiero", { s: slug }); abrirRegistroPrevio("alianza", {}); }}>🏪 ¿Quieres una página así para tu negocio?</button>
            </section>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.ng-fondo{position:fixed;inset:0;z-index:80;background:#fbf7ec;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.ng-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding-bottom:40px;background:#fbf7ec}
.ng-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;background:var(--c);color:#fff;padding:8px 10px}
.ng-bar b{flex:1;font-size:16px;font-weight:900;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ng-x,.ng-sh{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--c);font-size:19px;font-weight:900;cursor:pointer}
.ng-msg{padding:24px 16px;text-align:center;font-size:15px;font-weight:700}
.ng-ej{margin:0;padding:6px 12px;background:#FFF4D6;color:#8a5a0c;font-size:12.5px;font-weight:900;text-align:center}
.ng-portada{position:relative;height:150px;background:linear-gradient(135deg,var(--c),#0f2d1e) center/cover;display:flex;align-items:flex-start;justify-content:space-between;gap:6px;padding:10px}
.ng-cat,.ng-pat{background:rgba(255,255,255,.93);color:var(--c);font-size:11.5px;font-weight:900;padding:4px 10px;border-radius:999px}
.ng-pat{color:#8a5a0c}
.ng-id{margin:-44px 14px 0;position:relative;text-align:center}
.ng-logo{width:88px;height:88px;margin:0 auto;border-radius:50%;background:#fff;border:4px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:42px}
.ng-logo img{width:100%;height:100%;object-fit:cover}
.ng-id h1{margin:8px 0 2px;font-size:22px;font-weight:900;line-height:1.15}
.ng-esl{margin:0;font-size:14.5px;font-weight:800;color:var(--c)}
.ng-acc{display:flex;flex-wrap:wrap;gap:8px;margin:14px 14px 4px}
.ng-b{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 16px;border:2px solid var(--c);border-radius:14px;background:#fff;color:var(--c);font:inherit;font-size:14.5px;font-weight:900;text-decoration:none;cursor:pointer;flex:1 1 auto;text-align:center}
.ng-b1{background:var(--c);color:#fff}
.ng-wa{background:#128c4a;border-color:#128c4a;color:#fff}
.ng-s{margin:14px 14px 0}.ng-s h2{margin:0 0 6px;font-size:16px;font-weight:900;color:var(--c)}
.ng-d{margin:0;font-size:15px;font-weight:700;line-height:1.45}
.ng-l{margin:0;padding-left:20px;list-style:disc}.ng-l li{font-size:14.5px;font-weight:700;line-height:1.5}
.ng-dat p{margin:2px 0;font-size:14px;font-weight:800}
.ng-gal{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x mandatory}.ng-gal img{height:150px;width:auto;border-radius:12px;scroll-snap-align:start}
.ng-oferta{margin:14px;padding:12px 14px;border:3px dashed #B7791F;border-radius:16px;background:#FFF4D6}
.ng-oferta span{display:block;font-size:11.5px;font-weight:900;color:#8a5a0c}.ng-oferta b{display:block;font-size:18px;font-weight:900;margin:2px 0}.ng-oferta p{margin:2px 0 0;font-size:14px;font-weight:700}
.ng-pase{margin:14px;border-radius:18px;overflow:hidden;background:linear-gradient(160deg,var(--c),#0f2d1e);color:#fff;padding:0 0 8px;box-shadow:0 4px 14px rgba(0,0,0,.22)}
.ng-pase header{padding:10px 14px;background:rgba(0,0,0,.18)}.ng-pase header span{display:block;font-size:11px;font-weight:900;letter-spacing:.06em;opacity:.9}.ng-pase header b{font-size:17px;font-weight:900}
.ng-pase p{margin:8px 14px 0;font-size:14px;font-weight:700;line-height:1.35}.ng-pase i{display:block;font-style:normal;font-size:11px;font-weight:900;opacity:.85;letter-spacing:.05em}
.ng-club{margin:14px;padding:14px;border-radius:18px;background:#fff;border:2px solid var(--c);display:flex;flex-direction:column;gap:8px}
.ng-club h2{margin:0;font-size:17px;font-weight:900;color:var(--c)}.ng-club p{margin:0;font-size:14px;font-weight:700;line-height:1.4}
.ng-red{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}
.ng-rd{flex:0 0 132px;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px;border:2px solid var(--c);border-radius:14px;background:#fff;color:#0f2d1e;font:inherit;cursor:pointer}
.ng-rl{width:44px;height:44px;border-radius:50%;background:#f1ecdc;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden}.ng-rl img{width:100%;height:100%;object-fit:cover}
.ng-rd b{font-size:13px;font-weight:900;line-height:1.15}.ng-rd small{font-size:11.5px;font-weight:800;color:var(--c)}
.ng-pie{margin:18px 14px 0;padding-top:12px;border-top:2px solid #e3dcc6;text-align:center;display:flex;flex-direction:column;gap:8px}
.ng-pie p{margin:0;font-size:13px;font-weight:700;color:#4a5b52}
.ng-redes{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.ng-redes a{color:var(--c);font-weight:900;font-size:14px;min-height:36px;display:inline-flex;align-items:center}
@media (prefers-reduced-motion:no-preference){.ng-caja{animation:ngin .22s ease-out}@keyframes ngin{from{opacity:.4;translate:0 14px}to{opacity:1;translate:0 0}}}
`;
