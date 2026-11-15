// PANEL DEL DUEÑO (e81) — se abre desde «Soy el dueño» al pie de cada Página CUATE. Se entra con el PIN del negocio (columna «PIN edición»).
//  · Mi ficha: el dueño PROPONE cambios (no se publican solos: llegan a la pestaña «CambiosNegocios» y tú los apruebas).
//  · Canjear promo: confirma el Pase de un Cuate, registra el uso de la promoción y, si corresponde, suma puntos.
//  · Mis números: visitas, WhatsApp, llamadas, Club, canjes y Cuates referidos por mes.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { GOOGLE_SHEETS_URL } from "./datos/config.js";

export const abrirPanelNegocio = (slug) => window.dispatchEvent(new CustomEvent("dcuates:panel-negocio", { detail: slug }));

// clave → [rótulo, tipo ("t" texto · "a" párrafo · "l" lista (una por renglón)), ayuda, solo nivel Impulsor/Patrocinador]
const GRUPOS = [
  ["Tu negocio", [["e", "Eslogan", "t"], ["d", "Descripción", "a"], ["of", "Qué ofreces (un renglón por cada uno)", "l"], ["h", "Horario", "t"], ["dir", "Dirección", "t"], ["col", "Colonia o municipio", "t"]]],
  ["Contacto", [["wa", "WhatsApp (10 dígitos)", "t"], ["tel", "Teléfono", "t"], ["mapa", "Enlace de Google Maps (https://…)", "t"], ["web", "Sitio web (https://…)", "t"], ["fb", "Facebook (https://…)", "t"], ["ig", "Instagram (https://…)", "t"]]],
  ["Promoción para los Cuates", [["ofT", "Título de la promoción", "t"], ["ofD", "Detalle", "a"], ["ofV", "Vence (dd/mm/aaaa, opcional)", "t"]]],
  ["Tu Pase del negocio", [["rec", "Ofrezco", "t"], ["nec", "Necesito", "t"], ["com", "Comparto", "t"]]],
  ["Imágenes, videos y catálogo", [["logo", "Enlace del logo (https://…)", "t"], ["portada", "Enlace de la portada (https://…)", "t"], ["gal", "Imágenes y videos: un enlace por renglón (YouTube o imagen)", "l", true], ["ct", "Catálogo: un renglón por producto → Nombre ~ Precio ~ Descripción", "l", true]]]
];
const aTexto = (k, tipo, v) => (tipo === "l" ? String(v || "").split("|").map((x) => x.trim()).filter(Boolean).join("\n") : String(v || ""));
const deTexto = (tipo, v) => (tipo === "l" ? String(v || "").split("\n").map((x) => x.trim()).filter(Boolean).join(" | ") : String(v || "").trim());
const pedir = async (qs) => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
  try { return await (await fetch(`${GOOGLE_SHEETS_URL}?${qs}`, { signal: ctl.signal })).json(); } finally { clearTimeout(t); }
};
const MOTIVOS = { clave: "El PIN no es correcto. Revísalo con quien te lo entregó.", bloqueado: "Demasiados intentos. Espera unos 15 minutos y vuelve a intentarlo.", "sin-hoja": "Esta página todavía no tiene PIN. Pídelo por WhatsApp a DCUATES." };

export default function PanelNegocio() {
  const [slug, setSlug] = useState("");
  const cerrar = () => setSlug("");
  const oculta = useAtras(!!slug, cerrar);
  const [pin, setPin] = useState("");
  const [paso, setPaso] = useState("pin"); // pin | carga | panel
  const [error, setError] = useState("");
  const [d, setD] = useState(null);
  const [v, setV] = useState({});
  const [tab, setTab] = useState("ficha");
  const [envio, setEnvio] = useState("");
  const [num, setNum] = useState("");
  const [cj, setCj] = useState(null);
  useEffect(() => {
    const ab = (e) => { const s = String((e && e.detail) || "").toLowerCase().replace(/[^a-z0-9-]/g, ""); if (!s) return; setSlug(s); setPin(""); setPaso("pin"); setError(""); setD(null); setTab("ficha"); setEnvio(""); setNum(""); setCj(null); };
    window.addEventListener("dcuates:panel-negocio", ab);
    return () => window.removeEventListener("dcuates:panel-negocio", ab);
  }, []);
  const entrar = async (e) => {
    if (e) e.preventDefault();
    const k = pin.trim();
    if (k.length < 4) { setError("Escribe tu PIN."); return; }
    setError(""); setPaso("carga");
    try {
      const j = await pedir(`a=negocio_pin&slug=${encodeURIComponent(slug)}&k=${encodeURIComponent(k)}`);
      if (j && j.ok) {
        registrar("negocio_panel_entrar", { s: slug });
        const f = {}; GRUPOS.forEach(([, cs]) => cs.forEach(([c, , tipo]) => { f[c] = aTexto(c, tipo, (j.campos || {})[c]); }));
        setD(j); setV(f); setPaso("panel"); return;
      }
      setError(MOTIVOS[j && j.motivo] || "No pudimos entrar. Inténtalo de nuevo."); setPaso("pin");
    } catch (x) { setError("Sin conexión con el servidor. Inténtalo de nuevo en un momento."); setPaso("pin"); }
  };
  const nivelAlto = d && /^(i|p)$|impulsor|patrocinador/i.test(String((d.negocio && d.negocio.niv) || "").trim());
  const enviar = async () => {
    const cambios = {};
    GRUPOS.forEach(([, cs]) => cs.forEach(([c, , tipo]) => {
      const nuevo = deTexto(tipo, v[c]), viejo = deTexto(tipo, aTexto(c, tipo, (d.campos || {})[c]));
      if (nuevo !== viejo) cambios[c] = nuevo;
    }));
    if (!Object.keys(cambios).length) { setEnvio("sin"); return; }
    setEnvio("enviando");
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams({ Tipo: "NegocioCambio", Slug: slug, K: pin.trim(), C: JSON.stringify(cambios) }) }); } catch (x) { /* se confirma abajo */ }
    registrar("negocio_panel_enviar", { s: slug });
    await new Promise((r) => setTimeout(r, 2500));
    try {
      const j = await pedir(`a=negocio_pin&slug=${encodeURIComponent(slug)}&k=${encodeURIComponent(pin.trim())}`);
      if (j && j.ok && j.pendiente) { setD(j); setEnvio("ok"); return; }
    } catch (x) { /* abajo */ }
    setEnvio("falla");
  };
  const verificar = async (reg) => {
    const n = num.trim();
    if (n.length < 5) { setCj({ t: "err", m: "Escribe el número del Pase (ej. VEC100A)." }); return; }
    setCj({ t: "carga" });
    try {
      const j = await pedir(`a=negocio_canje&slug=${encodeURIComponent(slug)}&k=${encodeURIComponent(pin.trim())}&n=${encodeURIComponent(n)}${reg ? "&reg=1" : ""}`);
      if (!j || !j.ok) { setCj({ t: "err", m: j && j.motivo === "ya" ? "Este Pase ya canjeó hoy en tu negocio." : j && j.motivo === "limite" ? "Llegaste al límite de canjes de hoy. Escríbele a DCUATES." : "No pudimos registrar. Inténtalo de nuevo." }); return; }
      if (j.registrado) { registrar("negocio_canje", { s: slug }); setCj({ t: "hecho", nombre: j.nombre, puntos: j.puntos }); return; }
      if (!j.valido) { setCj({ t: "err", m: "No encontramos ese Pase o no está activo." }); return; }
      setCj({ t: j.ya ? "ya" : "valido", nombre: j.nombre, perfil: j.perfil });
    } catch (x) { setCj({ t: "err", m: "Sin conexión. Inténtalo de nuevo." }); }
  };
  if (!slug) return null;
  const set = (c, x) => { setV((o) => ({ ...o, [c]: x })); setEnvio(""); };
  return createPortal(
    <div className="pn-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Administrar mi Página CUATE" data-testid="panel-negocio">
      <style>{CSS}</style>
      <div className="pn-caja">
        <div className="pn-bar"><button type="button" className="pn-x" onClick={cerrar} aria-label="Cerrar">✕</button><b>🔑 {d ? d.negocio.n : "Administrar mi página"}</b></div>
        {paso !== "panel" && (
          <form className="pn-f" onSubmit={entrar}>
            <p>Escribe el <b>PIN de tu negocio</b> (te lo entrega DCUATES). Solo tú puedes proponer cambios y confirmar Pases.</p>
            <label htmlFor="pn-pin">PIN del negocio</label>
            <input id="pn-pin" type="password" autoComplete="off" autoCapitalize="characters" maxLength={12} value={pin} onChange={(e) => setPin(e.target.value)} />
            {error && <p className="pn-err" role="alert">{error}</p>}
            <button type="submit" className="pn-b pn-b1" disabled={paso === "carga"}>{paso === "carga" ? "Entrando…" : "Entrar"}</button>
          </form>
        )}
        {paso === "panel" && d && (
          <>
            <div className="pn-tabs" role="tablist" aria-label="Panel del negocio">
              {[["ficha", "✏️ Mi ficha"], ["canje", "🎟️ Canjear promo"], ["numeros", "📊 Mis números"]].map(([id, t]) => <button type="button" role="tab" key={id} aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{t}</button>)}
            </div>
            {tab === "ficha" && (
              <div className="pn-f">
                <p>Tus cambios <b>no se publican solos</b>: DCUATES los revisa y, al aprobarlos, aparecen en tu página.</p>
                {d.pendiente && <p className="pn-aviso" data-testid="pn-pendiente">⏳ Ya tienes un cambio en revisión. Si envías otro, lo reemplaza.</p>}
                {GRUPOS.map(([titulo, cs]) => {
                  const campos = cs.filter(([, , , alto]) => !alto || nivelAlto);
                  const bloqueados = cs.filter(([, , , alto]) => alto && !nivelAlto);
                  return (
                    <fieldset key={titulo}><legend>{titulo}</legend>
                      {campos.map(([c, r, tipo]) => (
                        <div key={c} className="pn-c"><label htmlFor={"pn-" + c}>{r}</label>
                          {tipo === "t" ? <input id={"pn-" + c} type="text" value={v[c] || ""} onChange={(e) => set(c, e.target.value)} /> : <textarea id={"pn-" + c} rows={tipo === "a" ? 3 : 4} value={v[c] || ""} onChange={(e) => set(c, e.target.value)} />}
                        </div>
                      ))}
                      {bloqueados.length > 0 && <p className="pn-nota">🔒 Galería y catálogo son para negocios Impulsor o Patrocinador.</p>}
                    </fieldset>
                  );
                })}
                {envio === "sin" && <p className="pn-aviso">No cambiaste nada todavía.</p>}
                {envio === "ok" && <p className="pn-ok" role="status" data-testid="pn-enviado">✅ Recibimos tus cambios. Los revisamos y aparecen en tu página en cuanto los aprobemos.</p>}
                {envio === "falla" && <p className="pn-err" role="alert">No pudimos confirmar el envío. Revisa tu conexión y vuelve a intentarlo.</p>}
                <button type="button" className="pn-b pn-b1" onClick={enviar} disabled={envio === "enviando"}>{envio === "enviando" ? "Enviando…" : "Enviar para revisión"}</button>
              </div>
            )}
            {tab === "canje" && (
              <div className="pn-f">
                <p>Cuando un Cuate te muestre su Pase, escribe su número para confirmar que está activo{d.negocio.ofT ? <> y registrar su promoción: <b>{d.negocio.ofT}</b></> : ""}.</p>
                <label htmlFor="pn-num">Número del Pase</label>
                <input id="pn-num" type="text" autoCapitalize="characters" maxLength={12} placeholder="Ej. VEC100A" value={num} onChange={(e) => { setNum(e.target.value.toUpperCase()); setCj(null); }} />
                <button type="button" className="pn-b" onClick={() => verificar(false)} disabled={cj && cj.t === "carga"}>Verificar Pase</button>
                {cj && cj.t === "err" && <p className="pn-err" role="alert">{cj.m}</p>}
                {cj && cj.t === "ya" && <p className="pn-aviso" role="status">✅ Pase válido: {cj.nombre}. Pero ya canjeó hoy en tu negocio.</p>}
                {cj && cj.t === "valido" && (
                  <div role="status" data-testid="pn-valido"><p className="pn-ok">✅ Pase válido: <b>{cj.nombre}</b>{cj.perfil ? ` · ${cj.perfil}` : ""}</p>
                    <button type="button" className="pn-b pn-b1" onClick={() => verificar(true)}>Registrar canje{d.pts > 0 ? ` (+${d.pts} puntos para ${cj.nombre})` : ""}</button></div>
                )}
                {cj && cj.t === "hecho" && <p className="pn-ok" role="status" data-testid="pn-canje-hecho">🎉 Canje registrado para {cj.nombre}{cj.puntos > 0 ? `: ganó ${cj.puntos} puntos` : ""}.</p>}
              </div>
            )}
            {tab === "numeros" && (
              <div className="pn-f" data-testid="pn-numeros">
                <p>Así le va a tu Página CUATE. Se actualiza cada noche.</p>
                {(!d.stats || !d.stats.length) && <p className="pn-aviso">Todavía no hay números de este mes. ¡Comparte tu enlace!</p>}
                {(d.stats || []).map((s) => (
                  <div className="pn-mes" key={s.mes}><b>{s.mes}</b>
                    <ul>{[["👀 Visitas", s.vis], ["💬 WhatsApp", s.wa], ["📞 Llamadas", s.tel], ["📍 Cómo llegar", s.mapa], ["🧡 Quisieron el Club", s.club], ["📤 Compartieron", s.comp], ["🎟️ Canjes", s.can], ["🤝 Cuates referidos", s.ref]].map(([t, n]) => <li key={t}><span>{t}</span><b>{n}</b></li>)}</ul></div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.pn-fondo{position:fixed;inset:0;z-index:85;background:#fbf7ec;font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.pn-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding-bottom:40px}
.pn-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;background:#7a4a00;color:#fff;padding:8px 10px}
.pn-bar b{flex:1;font-size:16px;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pn-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#7a4a00;font-size:19px;font-weight:900;cursor:pointer}
.pn-tabs{display:flex;gap:6px;padding:10px 12px 0;overflow-x:auto}
.pn-tabs button{flex:1 0 auto;min-height:44px;padding:0 12px;border:2px solid #7a4a00;border-radius:12px;background:#fff;color:#7a4a00;font:inherit;font-size:13.5px;font-weight:900;cursor:pointer;white-space:nowrap}
.pn-tabs button.on{background:#7a4a00;color:#fff}
.pn-f{display:flex;flex-direction:column;gap:10px;padding:14px 14px 0}
.pn-f p{margin:0;font-size:14px;font-weight:700;line-height:1.4}
.pn-f label,.pn-f legend{font-size:13px;font-weight:900}
.pn-f input,.pn-f textarea{width:100%;box-sizing:border-box;min-height:46px;border:2px solid #cfc8b0;border-radius:12px;background:#fff;padding:8px 12px;font:inherit;font-size:15px;font-weight:700;color:#0f2d1e}
.pn-f fieldset{border:2px solid #e3dcc6;border-radius:14px;padding:8px 10px 10px;margin:0;display:flex;flex-direction:column;gap:8px}
.pn-c{display:flex;flex-direction:column;gap:3px}
.pn-b{min-height:50px;border:2px solid #7a4a00;border-radius:14px;background:#fff;color:#7a4a00;font:inherit;font-size:15px;font-weight:900;cursor:pointer;padding:0 14px}
.pn-b1{background:#7a4a00;color:#fff}.pn-b:disabled{opacity:.6}
.pn-err{color:#9b1c1c!important;font-weight:900!important}.pn-ok{color:#0b6b32!important;font-weight:900!important}.pn-aviso{background:#FFF4D6;border-radius:10px;padding:8px 10px;color:#8a5a0c!important;font-weight:800!important}
.pn-nota{font-size:12.5px!important;color:#4a5b52}
.pn-mes{background:#fff;border:2px solid #e3dcc6;border-radius:14px;padding:10px 12px}.pn-mes ul{list-style:none;margin:6px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px}
.pn-mes li{display:flex;justify-content:space-between;font-size:13.5px;font-weight:700}
`;
