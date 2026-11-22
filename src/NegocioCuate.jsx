// MINI PÁGINA DE UN NEGOCIO CUATE (e79) — se abre con dcuates.com/n/<slug> (→ #negocio-<slug>) o con abrirNegocio("slug").
// Una sola plantilla para todos los negocios; el contenido viene de la hoja «NegociosCUATE» (ver src/datos/negocios.js).
// Bloques: portada · contacto · qué ofrece · Pase del emprendimiento · (Patrocinador: galería · oferta · Club · Red CUATE).
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { cargarNegocio, categoriaDe, NIVELES, esOficial, diasHasta, textoCuenta } from "./datos/negocios.js";
import PaginaCuateCTA from "./PaginaCuateCTA.jsx";
import ReelNegocio from "./ReelNegocio.jsx";
import { ImagenSegura, useImagenSegura } from "./componentes/MediaInteligente.jsx";
import { ListaNegocios, PaginaCategoria, esSlugCategoria, categoriaDeSlug } from "./PaginaCategoria.jsx";
import { abrirPanelNegocio } from "./PanelNegocio.jsx";
import { abrirTablon } from "./Tablon.jsx";
import { BotonFavorito, Estrellas } from "./PiezasEmprendimientos.jsx";
import Resenas from "./Resenas.jsx";
import { registrarVisita } from "./utilidades/reto.js";
import { eventoNegocio } from "./utilidades/negocioStats.js";
import { registrarPedido, confirmarPedido, descartarPedido, pedidoPendiente, paseGuardado } from "./utilidades/pedidos.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";
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

function AvisoPedido({ slug, negocio, refresco }) {
  const [, f] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const [pase, setPase] = useState(paseGuardado());
  const [monto, setMonto] = useState("");
  const [listo, setListo] = useState(null);
  useEffect(() => { setListo(null); setAbierto(false); setMonto(""); }, [refresco]);
  const p = pedidoPendiente(slug);
  if (listo) {
    return (
      <div className="ng-av ng-av-ok" data-testid="aviso-pedido-gracias" role="status">
        <b>🎉 ¡Gracias por confirmar!</b>
        <p>Para recibir tu sorpresa, manda tu comprobante o una foto de lo que recibiste a DCUATES.</p>
        <a className="ng-av-b" href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Hola DCUATES, confirmo mi compra (pedido " + listo.id + ") en " + negocio + ": " + listo.p + ". Te envío mi comprobante.")}`} target="_blank" rel="noopener noreferrer">📲 Enviar comprobante por WhatsApp</a>
      </div>
    );
  }
  if (!p || refresco < 0) return null;
  return (
    <div className="ng-av" data-testid="aviso-pedido" role="status">
      <b>🛍️ Registramos tu pedido: {p.p}</b>
      <p>Cuando se concrete, confírmalo aquí y recibe sorpresas 🎁 (también quien te vende).</p>
      {!abierto ? (
        <div className="ng-av-r">
          <button type="button" className="ng-av-b" onClick={() => { if (!pase) setPase(paseGuardado()); setAbierto(true); }}>✅ Ya se concretó</button>
          <button type="button" className="ng-av-b2" onClick={() => { descartarPedido(p.id); f((x) => x + 1); }}>No lo compré</button>
        </div>
      ) : (
        <form className="ng-av-f" onSubmit={(e) => { e.preventDefault(); confirmarPedido(p.id, pase.trim(), monto.trim()); setListo(p); }}>
          <label htmlFor="ng-av-pase">Tu número de Pase (opcional, para tus puntos)</label>
          <input id="ng-av-pase" type="text" autoCapitalize="characters" maxLength={12} value={pase} onChange={(e) => setPase(e.target.value.toUpperCase())} />
          <label htmlFor="ng-av-monto">¿Cuánto pagaste? (opcional)</label>
          <input id="ng-av-monto" type="text" inputMode="decimal" maxLength={9} value={monto} onChange={(e) => setMonto(e.target.value)} />
          <button type="submit" className="ng-av-b">Confirmar compra</button>
        </form>
      )}
    </div>
  );
}

export default function NegocioCuate() {
  const [slug, setSlug] = useState(slugDeHash);
  const [verPed, setVerPed] = useState(0);
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
  // Mientras la página está abierta la dirección es dcuates.com/n/<slug>: al refrescar se vuelve a abrir (Vercel la redirige). Al cerrar se regresa a la principal.
  // (con una pausa: primero debe quedar registrada la entrada de «Atrás», para no ensuciar la entrada original)
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (slug) { if (window.location.pathname !== "/n/" + slug) history.replaceState(history.state, "", "/n/" + slug); }
        else if (/^\/n\//.test(window.location.pathname)) history.replaceState(history.state, "", "/");
      } catch (x) { /* sin historial */ }
    }, slug ? 60 : 250);
    return () => clearTimeout(id);
  }, [slug]);
  useEffect(() => {
    if (!slug) return undefined;
    let vivo = true;
    if (esSlugCategoria(slug)) { setEst({ cargando: false, ok: false, categoria: true }); return () => { vivo = false; }; }
    setEst({ cargando: true });
    cargarNegocio(slug).then((r) => {
      if (!vivo) return;
      setEst({ cargando: false, ...r });
      if (r.ok) { recordarCodigo(r.negocio.cod); registrar("negocio_abrir", { s: slug }); eventoNegocio(slug, "visita"); registrarVisita(slug); }
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
  const portadaOk = useImagenSegura(est.ok && est.negocio ? est.negocio.portada : ""); // e89: sin «imagen rota»
  if (!slug) return null;
  const esCat = esSlugCategoria(slug);
  const catPag = esCat ? categoriaDeSlug(slug) : null;
  const n = est.ok ? est.negocio : null;
  const cat = categoriaDe(n && n.c);
  const url = `${URL_SITIO}/n/${slug}`;
  const compartir = () => {
    registrar("negocio_compartir", { s: slug }); eventoNegocio(slug, "compartir");
    const texto = n ? `${n.n}${n.e ? " — " + n.e : ""}. Emprendimiento CUATE en DCUATES:` : "Emprendimiento CUATE en DCUATES:";
    if (navigator.share) { navigator.share({ title: n ? n.n : "DCUATES", text: texto, url }).catch(() => {}); return; }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto + " " + url)}`, "_blank", "noopener");
  };
  const urlPedido = (c, id) => `https://wa.me/${n.wa}?text=${encodeURIComponent("¡Hola! Vi su página en DCUATES y quiero pedir: " + c.n + (c.p ? " (" + c.p + ")" : "") + "." + (id ? " Pedido " + id : ""))}`;
  const clic = (que) => { registrar("negocio_clic", { s: slug, q: que }); eventoNegocio(slug, que); };
  return createPortal(
    <div className="ng-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label={n ? n.n : "Emprendimiento CUATE"} data-testid="negocio">
      <style>{CSS}</style>
      <div className="ng-caja" style={{ "--c": cat.color }}>
        <div className="ng-bar">
          <button type="button" className="ng-x" onClick={cerrar} aria-label="Cerrar">✕</button>
          <b>{n ? n.n : esCat ? (catPag ? catPag.nombre : "Emprendimientos CUATE") : "Emprendimiento CUATE"}</b>
          {n && <BotonFavorito slug={slug} nombre={n.n} clase="ng-sh ng-fv" />}
          {n && <button type="button" className="ng-sh" onClick={compartir} aria-label="Compartir">📤</button>}
        </div>
        {esCat && <PaginaCategoria slug={slug} />}
        {est.cargando && !esCat && <p className="ng-msg" role="status">Cargando…</p>}
        {!est.cargando && !est.ok && !esCat && (
          <div className="ng-msg">
            <p><b>{est.motivo === "no-encontrado" ? "No encontramos esta página." : "No pudimos cargar esta página ahora."}</b></p>
            <p>{est.motivo === "no-encontrado" ? "Puede que el enlace esté mal escrito o que el emprendimiento aún no esté publicado." : "Revisa tu conexión e inténtalo de nuevo."}</p>
            <button type="button" className="ng-b ng-b1" onClick={cerrar}>Ir a DCUATES</button>
          </div>
        )}
        {n && (
          <>
            {est.ejemplo && <p className="ng-ej">EJEMPLO ilustrativo · así se vería tu página</p>}
            <div className="ng-portada" style={portadaOk ? { backgroundImage: `url("${portadaOk}")` } : undefined}>
              <span className="ng-cat">{cat.e} {cat.nombre.toUpperCase()}</span>
              {esOficial(n.s) ? <span className="ng-pat">🌟 OFICIAL DCUATES</span> : NIVELES[n.niv] && NIVELES[n.niv].t && <span className="ng-pat">{NIVELES[n.niv].t}</span>}
            </div>
            <div className="ng-id">
              <div className="ng-logo">{n.logo ? <ImagenSegura src={n.logo} alt="" icono={cat.e} /> : <span aria-hidden="true">{cat.e}</span>}</div>
              <h1>{n.n}</h1>
              {n.e && <p className="ng-esl">{n.e}</p>}
              {n.v && <p className="ng-ver" data-testid="negocio-verificado">✅ CUATE VERIFICADO <small>Lo revisó DCUATES</small></p>}
            </div>
            <div className="ng-acc">
              {n.wa && <a className="ng-b ng-wa" href={`https://wa.me/${n.wa}?text=${encodeURIComponent("¡Hola! Vi su página en DCUATES.")}`} target="_blank" rel="noopener noreferrer" onClick={() => clic("wa")}>💬 WhatsApp</a>}
              {n.tel && <a className="ng-b" href={telHref(n.tel)} onClick={() => clic("tel")}>📞 Llamar</a>}
              {n.ag && <a className="ng-b" data-testid="negocio-agenda" href={n.ag} target="_blank" rel="noopener noreferrer" onClick={() => registrar("negocio_clic", { s: slug, q: "agenda" })}>📅 Agendar cita</a>}
              {(n.mapa || n.dir) && <a className="ng-b" href={n.mapa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.dir + " " + n.n)}`} target="_blank" rel="noopener noreferrer" onClick={() => clic("mapa")}>📍 Cómo llegar</a>}
            </div>
            {(n.web || n.fb || n.ig) && (
              <div className="ng-soc" data-testid="negocio-ligas">
                {n.web && <a className="ng-sw" href={n.web} target="_blank" rel="noopener noreferrer" onClick={() => clic("web")}><span aria-hidden="true">🌐</span> Sitio web</a>}
                {n.fb && <a className="ng-sf" href={n.fb} target="_blank" rel="noopener noreferrer" onClick={() => clic("fb")}><span aria-hidden="true">📘</span> Facebook</a>}
                {n.ig && <a className="ng-si" href={n.ig} target="_blank" rel="noopener noreferrer" onClick={() => clic("ig")}><span aria-hidden="true">📸</span> Instagram</a>}
              </div>
            )}
            {n.gal && n.gal.length > 0 && <ReelNegocio items={n.gal} nombre={n.n} />}
            {n.d && <section className="ng-s"><p className="ng-d">{n.d}</p></section>}
            {n.of && n.of.length > 0 && (
              <section className="ng-s"><h2>Qué ofrece</h2><ul className="ng-l">{n.of.map((x) => <li key={x}>{x}</li>)}</ul></section>
            )}
            {(n.ga || n.gd || n.gp) && (
              <section className="ng-s" data-testid="negocio-guia">
                <h2>🩺 Guía de atención</h2>
                {[["Antes de tu cita", "🗓️", n.ga], ["Durante la consulta", "🤝", n.gd], ["Después y seguimiento", "💬", n.gp]].filter((g) => g[2]).map(([t, e, x]) => (
                  <details key={t} className="ng-gd"><summary>{e} {t}</summary><p>{x}</p></details>
                ))}
              </section>
            )}
            {n.ct && n.ct.length > 0 && (
              <section className="ng-s" data-testid="negocio-catalogo">
                <h2>Catálogo</h2>
                <AvisoPedido slug={slug} negocio={n.n} refresco={verPed} />
                <ul className="ng-ct">
                  {n.ct.map((c, i) => (
                    <li key={i}>
                      <div><b>{c.n}</b>{c.d && <small>{c.d}</small>}</div>
                      {c.p && <span className="ng-pr">{c.p}</span>}
                      {n.wa && <a className="ng-pd" href={urlPedido(c)} target="_blank" rel="noopener noreferrer" onClick={(e) => { const id = registrarPedido(slug, n.n, c.n, c.p); e.currentTarget.href = urlPedido(c, id); setVerPed((x) => x + 1); clic("pedido"); }} aria-label={`Pedir ${c.n} por WhatsApp`}>Pedir</a>}
                    </li>
                  ))}
                </ul>
                {n.cc && <a className="ng-cc" href={n.cc} target="_blank" rel="noopener noreferrer" onClick={() => clic("catalogo")} data-testid="negocio-catalogo-completo">📖 Ver catálogo completo</a>}
              </section>
            )}
            {(n.h || n.dir) && (
              <section className="ng-s ng-dat">{n.h && <p>🕒 {n.h}</p>}{n.dir && <p>📍 {n.dir}</p>}</section>
            )}
            {n.ofT && (
              <section className="ng-oferta" data-testid="negocio-oferta">
                <span>🎟️ OFERTA PARA CUATES</span><b>{n.ofT}</b>{n.ofD && <p>{n.ofD}</p>}{n.ofV && textoCuenta(diasHasta(n.ofV)) && <p className="ng-cd" data-testid="oferta-cuenta">⏳ {textoCuenta(diasHasta(n.ofV))}</p>}
              </section>
            )}
            {(n.rec || n.nec || n.com) && (
              <section className="ng-pase" data-testid="negocio-pase">
                <header><span>PASE CUATE · {cat.nombre.toUpperCase()}</span><b>{n.n}</b></header>
                {n.rec && <p><i>🎁 OFREZCO</i>{n.rec}</p>}
                {n.nec && <p><i>🙋 NECESITO</i>{n.nec}</p>}
                {n.com && <p><i>🤝 COMPARTO</i>{n.com}</p>}
              </section>
            )}
            {n.club && (
              <section className="ng-club" data-testid="negocio-club">
                <h2>🧡 Con {n.n} ganas más</h2>
                <p>Únete gratis al Club DCUATES: suma puntos, recibe beneficios y apoya a los emprendimientos de tu comunidad.</p>
                <button type="button" className="ng-b ng-b1" onClick={() => { registrar("negocio_club", { s: slug }); eventoNegocio(slug, "club"); recordarCodigo(n.cod); abrirRegistroPrevio("club", {}); }}>ÚNETE AL CLUB →</button>
                <button type="button" className="ng-b" onClick={() => { registrar("negocio_pase", { s: slug }); eventoNegocio(slug, "pase"); window.dispatchEvent(new Event("dcuates:tarjeta")); }}>💳 Ya soy Cuate: abrir mi Pase</button>
              </section>
            )}
            <Resenas slug={slug} nombre={n.n} ejemplo={!!est.ejemplo} />
            {n.red && n.red.length > 0 && (
              <section className="ng-s" data-testid="negocio-red">
                <h2>Más de la red CUATE</h2>
                <div className="ng-red">
                  {n.red.map((r) => {
                    const c = categoriaDe(r.c);
                    return (
                      <button type="button" key={r.s} className="ng-rd" style={{ "--c": c.color }} onClick={() => { registrar("negocio_red", { de: slug, a: r.s }); eventoNegocio(slug, "red"); abrirNegocio(r.s); }}>
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
              <ListaNegocios actual={slug} />
              <div className="ng-qt" data-testid="negocio-quieres"><p>¿Quieres también…?</p>
                <button type="button" className="ng-b" onClick={() => { registrar("negocio_quieres", { s: slug, f: "catalogo" }); cerrar(); setTimeout(() => abrirTablon("Otros"), 150); }}>🗂️ Catálogo CUATES</button>
                <button type="button" className="ng-b" onClick={() => { registrar("negocio_quieres", { s: slug, f: "emp" }); cerrar(); setTimeout(() => abrirTablon("Emprendimientos"), 150); }}>🏪 Emprendimientos CUATE</button>
              </div>
              <PaginaCuateCTA compacto />
              <button type="button" className="ng-b ng-dueno" onClick={() => abrirPanelNegocio(slug)}>🔑 Soy el dueño: administrar mi página</button>
            </section>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.ng-fondo{position:fixed;inset:0;z-index:80;background:var(--dc-fondo,#FBF7EC);font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.ng-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding-bottom:40px;background:var(--dc-fondo,#FBF7EC)}
.ng-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;background:var(--c);color:#fff;padding:8px 10px}
.ng-bar b{flex:1;font-size:16px;font-weight:900;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ng-x,.ng-sh{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--c);font-size:19px;font-weight:900;cursor:pointer}
.ng-msg{padding:24px 16px;text-align:center;font-size:15px;font-weight:700}
.ng-ej{margin:0;padding:6px 12px;background:#FFF4D6;color:#8a5a0c;font-size:12.5px;font-weight:900;text-align:center}
.ng-portada{position:relative;height:150px;background:linear-gradient(135deg,var(--c),#0f2d1e) center/cover;display:flex;align-items:flex-start;justify-content:space-between;gap:6px;padding:10px}
.ng-portada{flex-wrap:wrap;align-content:flex-start}
.ng-cat,.ng-pat{background:rgba(255,255,255,.93);color:var(--c);font-size:11.5px;font-weight:900;padding:4px 10px;border-radius:999px}
.ng-pat{color:#8a5a0c}
.ng-id{margin:-44px 14px 0;position:relative;text-align:center}
.ng-logo{width:88px;height:88px;margin:0 auto;border-radius:50%;background:#fff;border:4px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:42px}
.ng-logo img{width:100%;height:100%;object-fit:contain;padding:5px;box-sizing:border-box;background:#fff}
.ng-id h1{margin:8px 0 2px;font-size:22px;font-weight:900;line-height:1.15}
.ng-esl{margin:0;font-size:14.5px;font-weight:800;color:var(--c)}
.ng-acc{display:flex;flex-wrap:wrap;gap:8px;margin:14px 14px 4px}
.ng-fv{font-size:22px}.ng-fv.on{color:#C62828}.ng-cd{font-weight:900;color:#8a1c1c}
.ng-qt{display:flex;flex-direction:column;gap:6px;margin:10px 0}.ng-qt p{margin:0;font-size:14px;font-weight:900}
.ng-b{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 16px;border:2px solid var(--c);border-radius:14px;background:#fff;color:var(--c);font:inherit;font-size:14.5px;font-weight:900;text-decoration:none;cursor:pointer;flex:1 1 auto;text-align:center}
.ng-b1{background:var(--c);color:#fff}
.ng-wa{background:#128c4a;border-color:#128c4a;color:#fff}
.ng-ver{margin:6px 0 0;font-size:13px;font-weight:900;color:#0b6b32}.ng-ver small{font-weight:700;color:#4a5b52;font-size:11.5px;margin-left:4px}
.ng-ct{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px}
.ng-ct li{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border:2px solid #e3dcc6;border-radius:12px}
.ng-ct li>div{flex:1;min-width:0;display:flex;flex-direction:column}.ng-ct b{font-size:14.5px;font-weight:900}.ng-ct small{font-size:12px;font-weight:700;color:#4a5b52}
.ng-pr{font-size:14px;font-weight:900;color:var(--c);white-space:nowrap}
.ng-pd{min-height:44px;min-width:60px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:#128c4a;color:#fff;font-weight:900;font-size:13.5px;text-decoration:none;padding:0 10px}
.ng-dueno{border-style:dashed;font-size:13.5px}
.ng-gd{margin:0 0 6px;border:2px solid var(--c);border-radius:12px;background:#fff}.ng-gd summary{min-height:46px;display:flex;align-items:center;padding:0 12px;font-weight:900;font-size:15px;cursor:pointer}.ng-gd p{margin:0;padding:0 12px 12px;font-size:14.5px;font-weight:700;line-height:1.5;white-space:pre-line}.ng-s{margin:14px 14px 0}.ng-s h2{margin:0 0 6px;font-size:16px;font-weight:900;color:var(--c)}
.ng-d{margin:0;font-size:15px;font-weight:700;line-height:1.45}
.ng-l{margin:0;padding-left:20px;list-style:disc}.ng-l li{font-size:14.5px;font-weight:700;line-height:1.5}
.ng-dat p{margin:2px 0;font-size:14px;font-weight:800}
.ng-gal{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x mandatory}.ng-gal img{height:150px;width:auto;border-radius:12px;scroll-snap-align:start}
.ng-oferta{margin:14px;padding:12px 14px;border:3px dashed var(--dc-dorado,#B7791F);border-radius:16px;background:#FFF4D6}
.ng-oferta span{display:block;font-size:11.5px;font-weight:900;color:#8a5a0c}.ng-oferta b{display:block;font-size:18px;font-weight:900;margin:2px 0}.ng-oferta p{margin:2px 0 0;font-size:14px;font-weight:700}
.ng-pase{margin:14px;border-radius:18px;overflow:hidden;background:linear-gradient(160deg,var(--c),#0f2d1e);color:#fff;padding:0 0 8px;box-shadow:0 4px 14px rgba(0,0,0,.22)}
.ng-pase header{padding:10px 14px;background:rgba(0,0,0,.18)}.ng-pase header span{display:block;font-size:11px;font-weight:900;letter-spacing:.06em;opacity:.9}.ng-pase header b{font-size:17px;font-weight:900}
.ng-pase p{margin:8px 14px 0;font-size:14px;font-weight:700;line-height:1.35}.ng-pase i{display:block;font-style:normal;font-size:11px;font-weight:900;opacity:.85;letter-spacing:.05em}
.ng-club{margin:14px;padding:14px;border-radius:18px;background:#fff;border:2px solid var(--c);display:flex;flex-direction:column;gap:8px}
.ng-club h2{margin:0;font-size:17px;font-weight:900;color:var(--c)}.ng-club p{margin:0;font-size:14px;font-weight:700;line-height:1.4}
.ng-av{display:flex;flex-direction:column;gap:8px;margin:0 0 12px;padding:12px;border-radius:14px;background:#E6F6EC;border:2px solid #2E8B57;color:#0f2d1e}
.ng-av p{margin:0;font-size:13.5px;font-weight:700;line-height:1.4}.ng-av b{font-size:15px;font-weight:900}
.ng-av-r{display:flex;flex-direction:column;gap:6px}
.ng-av-f{display:flex;flex-direction:column;gap:6px}.ng-av-f label{font-size:12.5px;font-weight:900}
.ng-av-f input{min-height:46px;border:2px solid #9fcfb3;border-radius:12px;padding:6px 12px;font:inherit;font-size:15px;font-weight:700;width:100%;box-sizing:border-box}
.ng-av-b{display:flex;align-items:center;justify-content:center;min-height:50px;border:0;border-radius:14px;background:#08743B;color:#fff;font:inherit;font-size:15px;font-weight:900;text-decoration:none;cursor:pointer}
.ng-av-b2{min-height:44px;border:2px solid #2E8B57;border-radius:14px;background:#fff;color:#08743B;font:inherit;font-size:14px;font-weight:900;cursor:pointer}
.ng-soc{display:flex;flex-direction:column;gap:8px;padding:12px 14px 0}
.ng-soc a{display:flex;align-items:center;justify-content:center;gap:10px;min-height:54px;border-radius:14px;font-size:17px;font-weight:900;text-decoration:none;color:#fff;box-shadow:0 2px 0 rgba(0,0,0,.18)}
.ng-soc a span{font-size:22px}
.ng-sw{background:#0f4c5c}.ng-sf{background:#1877f2}.ng-si{background:linear-gradient(45deg,#f09433,#dc2743 55%,#bc1888)}
.ng-cc{display:flex;align-items:center;justify-content:center;gap:8px;min-height:54px;margin-top:12px;border-radius:14px;background:#FFD54A;border:3px solid #B8860B;color:#3b2a00;font-size:17px;font-weight:900;text-decoration:none}
.ng-red{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}
.ng-rd{flex:0 0 132px;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:8px;border:2px solid var(--c);border-radius:14px;background:#fff;color:#0f2d1e;font:inherit;cursor:pointer}
.ng-rl{width:44px;height:44px;border-radius:50%;background:#f1ecdc;display:flex;align-items:center;justify-content:center;font-size:22px;overflow:hidden}.ng-rl img{width:100%;height:100%;object-fit:cover}
.ng-rd b{font-size:13px;font-weight:900;line-height:1.15}.ng-rd small{font-size:11.5px;font-weight:800;color:var(--c)}
.ng-pie{margin:18px 14px 0;padding-top:12px;border-top:2px solid #e3dcc6;text-align:center;display:flex;flex-direction:column;gap:8px}
.ng-pie p{margin:0;font-size:13px;font-weight:700;color:#4a5b52}
.ng-redes{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.ng-redes a{color:var(--c);font-weight:900;font-size:14px;min-height:36px;display:inline-flex;align-items:center}
@media (prefers-reduced-motion:no-preference){.ng-caja{animation:ngin .22s ease-out}@keyframes ngin{from{opacity:.4;translate:0 14px}to{opacity:1;translate:0 0}}}
`;
