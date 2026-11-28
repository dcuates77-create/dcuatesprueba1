// PANEL DEL DUEÑO (e81) — se abre desde «Soy el dueño» al pie de cada Página CUATE. Se entra con el PIN del emprendimiento (columna «PIN edición»).
//  · Mi ficha: el dueño PROPONE cambios (no se publican solos: llegan a la pestaña «CambiosNegocios» y tú los apruebas).
//  · Canjear promo: confirma el Pase de un Cuate, registra el uso de la promoción y, si corresponde, suma puntos.
//  · Mis números: visitas, WhatsApp, llamadas, Club, canjes y Cuates referidos por mes.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { GOOGLE_SHEETS_URL, URL_SITIO } from "./datos/config.js";
import { Anuncios, leerAnuncios } from "./BloqueAnuncios.jsx"; // e95: anuncios y vista previa
import { VerMas } from "./PerfilCuate.jsx";
import { AgendaNegocio, leerAgenda } from "./AgendaCuate.jsx"; // e96

export const abrirPanelNegocio = (slug) => window.dispatchEvent(new CustomEvent("dcuates:panel-negocio", { detail: slug }));

// clave → [rótulo, tipo ("t" texto · "a" párrafo · "l" lista (una por renglón)), ayuda, solo nivel Impulsor/Patrocinador]
const GRUPOS = [
  ["Tu emprendimiento", [["e", "Eslogan", "t"], ["d", "Descripción", "a"], ["of", "Qué ofreces (un renglón por cada uno)", "l"], ["h", "Horario", "t"], ["dir", "Dirección", "t"], ["col", "Colonia o municipio", "t"]]],
  ["Contacto", [["wa", "WhatsApp (10 dígitos)", "t"], ["tel", "Teléfono", "t"], ["mapa", "Enlace de Google Maps (https://…)", "t"], ["web", "Sitio web (https://…)", "t"], ["fb", "Facebook (https://…)", "t"], ["ig", "Instagram (https://…)", "t"]]],
  ["Promoción para los Cuates", [["ofT", "Título de la promoción", "t"], ["ofD", "Detalle", "a"], ["ofV", "Vence (dd/mm/aaaa, opcional)", "t"], ["pr", "Más promociones (Impulsor: 2 · Patrocinador: 4). Un renglón por promoción → Título ~ Detalle ~ Vence (dd/mm/aaaa, opcional)", "l", true]]],
  ["Anuncios con botones (Gratuito: 1 · Impulsor: 3 · Patrocinador: 6)", [["an", "Un renglón por anuncio → Título ~ Texto ~ Imagen (https, opcional) ~ Botón 1 ~ Enlace 1 ~ Botón 2 ~ Enlace 2 ~ Vence (dd/mm/aaaa, opcional). El enlace puede ser https://…, un WhatsApp de 10 dígitos, tel:… o mailto:…", "l"]]],
  ["Agenda: fechas, citas y avisos (Básico: 3 · Impulsor: 8 · Patrocinador: 15)", [["fe", "Un renglón por fecha → Tipo (Evento, Taller, Promoción, Cita, Aviso o Cierre) ~ Fecha (dd/mm/aaaa) ~ Hora (ej. 5:00 pm) ~ Hora fin ~ Título ~ Detalle ~ Lugar o modalidad ~ Costo ~ Botón ~ Enlace (opcional) ~ ¿Visible en DCUATES? (Sí/No). Las citas piden la fecha solo si quieres. Los eventos «Sí» salen en la Agenda general solo si DCUATES los aprueba.", "l"]]],
  ["Tu Pase del emprendimiento", [["rec", "Ofrezco", "t"], ["nec", "Necesito", "t"], ["com", "Comparto", "t"]]],
  ["Imágenes, videos y catálogo", [["logo", "Enlace del logo (https://…)", "t"], ["portada", "Enlace de la portada (https://…)", "t"], ["gal", "Imágenes y videos: un enlace por renglón (YouTube o imagen)", "l", true], ["ct", "Catálogo: un renglón por producto → Nombre ~ Precio ~ Descripción", "l", true], ["cc", "Enlace de tu catálogo completo (https://…)", "t", true]]]
];
// e94: largo máximo de cada campo (el mismo que acepta la hoja) para mostrar el contador «escritos / permitidos».
const MAXIMO = { e: 120, d: 1200, of: 600, h: 160, dir: 200, col: 60, ofT: 90, ofD: 600, pr: 2800, rec: 200, nec: 200, com: 200, ct: 4500, gal: 1200, an: 3500, fe: 3500 };
const idsOv = (x) => [...new Set(String(x || "").toUpperCase().split(/[,|\s]+/).map((u) => u.replace(/[^A-Z0-9-]/g, "")).filter(Boolean))];
const ETIQ_E = { d: "Disponible", u: "Últimas piezas", x: "Agotado" };
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
  const [vista, setVista] = useState(false);
  const [num, setNum] = useState("");
  const [cj, setCj] = useState(null);
  const [ped, setPed] = useState(null);
  const [montos, setMontos] = useState({});
  const [vp, setVp] = useState(null); // e102: productos de Ventas DCUATES {lista, cupo}
  const [ov, setOv] = useState([]);   // ids que este vendedor ofrece
  const cargarPedidos = async () => { try { const j = await pedir(`a=negocio_pedidos&slug=${encodeURIComponent(slug)}&k=${encodeURIComponent(pin.trim())}`); setPed(j && j.ok ? j : { pedidos: [], pts: 0, tiene: false, error: true }); } catch (x) { setPed({ pedidos: [], pts: 0, tiene: false, error: true }); } };
  const confirmarVenta = async (id) => {
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams({ Tipo: "NegocioPedidoConfirma", Rol: "V", Id: id, Slug: slug, K: pin.trim(), Monto: (montos[id] || "").trim() }) }); } catch (x) { /* se confirma abajo */ }
    registrar("negocio_venta_confirmada", { s: slug });
    await new Promise((r) => setTimeout(r, 2500)); cargarPedidos();
  };
  const marcarInv = async (id, estado) => {
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams({ Tipo: "NegocioInventario", Slug: slug, K: pin.trim(), Id: id, Estado: estado }) }); } catch (x) { /* se confirma abajo */ }
    registrar("negocio_inventario", { s: slug, e: estado });
    await new Promise((r) => setTimeout(r, 2500)); cargarPedidos();
  };
  useEffect(() => { if (paso === "panel" && tab === "pedidos" && !ped) cargarPedidos(); }, [paso, tab]); // eslint-disable-line
  useEffect(() => {
    const ab = (e) => { const s = String((e && e.detail) || "").toLowerCase().replace(/[^a-z0-9-]/g, ""); if (!s) return; setSlug(s); setPin(""); setPaso("pin"); setError(""); setD(null); setTab("ficha"); setEnvio(""); setNum(""); setCj(null); setPed(null); setMontos({}); setVp(null); setOv([]); };
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
        setD(j); setV(f); setOv(idsOv((j.campos || {}).ov)); setPaso("panel");
        pedir("a=ventas_productos").then((r) => { if (r && r.ok) setVp({ lista: r.lista || [], cupo: r.cupo || 12 }); }).catch(() => {});
        return;
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
    if (vp && vp.lista.length && ov.join(", ") !== idsOv((d.campos || {}).ov).join(", ")) cambios.ov = ov.join(", ");
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
      if (!j || !j.ok) { setCj({ t: "err", m: j && j.motivo === "ya" ? "Este Pase ya canjeó hoy en tu emprendimiento." : j && j.motivo === "limite" ? "Llegaste al límite de canjes de hoy. Escríbele a DCUATES." : "No pudimos registrar. Inténtalo de nuevo." }); return; }
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
            <p>Escribe el <b>PIN de tu emprendimiento</b> (te lo entrega DCUATES). Solo tú puedes proponer cambios y confirmar Pases.</p>
            <label htmlFor="pn-pin">PIN del emprendimiento</label>
            <input id="pn-pin" type="password" autoComplete="off" autoCapitalize="characters" maxLength={12} value={pin} onChange={(e) => setPin(e.target.value)} />
            {error && <p className="pn-err" role="alert">{error}</p>}
            <button type="submit" className="pn-b pn-b1" disabled={paso === "carga"}>{paso === "carga" ? "Entrando…" : "Entrar"}</button>
          </form>
        )}
        {paso === "panel" && d && (
          <>
            <div className="pn-tabs" role="tablist" aria-label="Panel del emprendimiento">
              {[["ficha", "✏️ Mi ficha"], ["pedidos", "🛒 Pedidos"], ["canje", "🎟️ Canjear promo"], ["numeros", "📊 Mis números"]].map(([id, t]) => <button type="button" role="tab" key={id} aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{t}</button>)}
            </div>
            {tab === "ficha" && (
              <div className="pn-f">
                <p>Tus cambios <b>no se publican solos</b>: DCUATES los revisa y, al aprobarlos, aparecen en tu página.</p>
                <button type="button" className="pn-b pn-comp" data-testid="pn-compartir" onClick={() => {
                  const url = `${URL_SITIO}/n/${slug}`, txt = `¡Conoce mi página en DCUATES! ${(d && d.negocio && d.negocio.n) || ""}`.trim();
                  registrar("panel_compartir", { s: slug });
                  if (navigator.share) { navigator.share({ title: txt, text: txt, url }).catch(() => {}); return; }
                  window.open(`https://wa.me/?text=${encodeURIComponent(txt + " " + url)}`, "_blank", "noopener");
                }}>📤 Compartir mi página</button>
                {d.pendiente && <p className="pn-aviso" data-testid="pn-pendiente">⏳ Ya tienes un cambio en revisión. Si envías otro, lo reemplaza.</p>}
                {GRUPOS.map(([titulo, cs]) => {
                  const campos = cs.filter(([, , , alto]) => !alto || nivelAlto);
                  const bloqueados = cs.filter(([, , , alto]) => alto && !nivelAlto);
                  return (
                    <fieldset key={titulo}><legend>{titulo}</legend>
                      {campos.map(([c, r, tipo]) => (
                        <div key={c} className="pn-c"><label htmlFor={"pn-" + c}>{r}</label>
                          {tipo === "t" ? <input id={"pn-" + c} type="text" value={v[c] || ""} maxLength={MAXIMO[c] || undefined} onChange={(e) => set(c, e.target.value)} /> : <textarea id={"pn-" + c} rows={tipo === "a" ? (c === "d" ? 6 : 4) : 5} value={v[c] || ""} maxLength={MAXIMO[c] || undefined} onChange={(e) => set(c, e.target.value)} />}
                          {MAXIMO[c] && <small className={"pn-cu" + ((v[c] || "").length > MAXIMO[c] * 0.9 ? " pn-cu-ya" : "")} data-testid={"pn-cuenta-" + c}>{(v[c] || "").length} / {MAXIMO[c]} caracteres</small>}
                        </div>
                      ))}
                      {bloqueados.length > 0 && <p className="pn-nota">🔒 Galería, catálogo y promociones extra son para emprendimientos Impulsor o Patrocinador.</p>}
                    </fieldset>
                  );
                })}
                {vp && vp.lista.length > 0 && (
                  <fieldset data-testid="pn-ventas"><legend>🛒 Productos de Ventas DCUATES que ofrezco</legend>
                    <p className="pn-nota">Elige los productos que quieres ofrecer en tu página. Cuando alguien los pida, DCUATES lo registra y lo aparta. Puedes elegir hasta <b>{vp.cupo}</b> (el mismo máximo para todos). Se publican cuando DCUATES apruebe tus cambios.</p>
                    <small className={"pn-cu" + (ov.length >= vp.cupo ? " pn-cu-ya" : "")} data-testid="pn-ventas-cuenta">{ov.length} / {vp.cupo} elegidos</small>
                    {vp.lista.map((x) => {
                      const on = ov.includes(x.i), lleno = !on && ov.length >= vp.cupo;
                      return (
                        <label key={x.i} className={"pn-vz" + (lleno ? " pn-vz-no" : "")} data-testid={"pn-vp-" + x.i}>
                          <input type="checkbox" checked={on} disabled={lleno} onChange={() => { setOv((o) => (o.includes(x.i) ? o.filter((y) => y !== x.i) : [...o, x.i])); setEnvio(""); }} />
                          <span><b>{x.n}</b>{x.p ? <em> · {x.p}</em> : null}<small className={"pn-e pn-e-" + x.e}>{ETIQ_E[x.e] || ""}</small></span>
                        </label>
                      );
                    })}
                  </fieldset>
                )}
                {envio === "sin" && <p className="pn-aviso">No cambiaste nada todavía.</p>}
                {envio === "ok" && <p className="pn-ok" role="status" data-testid="pn-enviado">✅ Recibimos tus cambios. Los revisamos y aparecen en tu página en cuanto los aprobemos.</p>}
                {envio === "falla" && <p className="pn-err" role="alert">No pudimos confirmar el envío. Revisa tu conexión y vuelve a intentarlo.</p>}
                <button type="button" className="pn-b" onClick={() => { setVista(true); registrar("panel_vista_previa", { s: slug }); }} data-testid="pn-vista-btn">👁️ Ver cómo quedará (vista previa)</button>
                <button type="button" className="pn-b pn-b1" onClick={enviar} disabled={envio === "enviando" || envio === "ok"} data-testid="pn-enviar">{envio === "enviando" ? "Enviando…" : envio === "ok" ? "✅ Enviado · en revisión" : "Enviar para revisión"}</button>
              </div>
            )}
            {tab === "pedidos" && (
              <div className="pn-f" data-testid="pn-pedidos">
                <p>Aquí aparecen los pedidos que llegan desde tu catálogo. Cuando uno se concrete, confírmalo: DCUATES lo valida{ped && ped.tiene ? <> y recibes <b>{ped.pts} puntos</b> y sorpresas</> : " y recibes sorpresas"}.</p>
                {ped && !ped.tiene && <p className="pn-aviso">Para ganar puntos, pide a DCUATES registrar tu número de Pase en tu emprendimiento.</p>}
                {!ped && <p className="pn-aviso">Cargando…</p>}
                {ped && ped.error && <p className="pn-err" role="alert">No pudimos cargar tus pedidos. Inténtalo de nuevo.</p>}
                {ped && !ped.error && !ped.pedidos.length && <p className="pn-aviso">Todavía no hay pedidos. Cuando alguien toque «Pedir» en tu catálogo, aparecerá aquí.</p>}
                {ped && ped.pedidos.map((x) => (
                  <div className="pn-mes" key={x.id} data-testid="pn-pedido">
                    <b>{x.p}{x.pr ? ` · ${x.pr}` : ""}</b>
                    <p>Pedido {x.id} · {x.f}{x.cm ? ` · Comprador: ${x.cm}` : ""}</p>
                    {x.ip && (
                      <div className="pn-inv" data-testid="pn-inv">
                        <p><b>Producto de Ventas DCUATES ({x.ip})</b> · Estado: <b data-testid="pn-inv-estado">{x.iv || "Pedido"}</b></p>
                        {!/cancelado/i.test(x.iv) && (
                          <div className="pn-inv-b">
                            {["Apartado", "Vendido", "Entregado", "Cancelado"].filter((e) => e.toLowerCase() !== String(x.iv || "").toLowerCase()).map((e) => <button type="button" key={e} className="pn-b" data-testid={"pn-inv-" + e} onClick={() => marcarInv(x.id, e)}>{e === "Apartado" ? "📌 Apartado" : e === "Vendido" ? "💰 Vendido" : e === "Entregado" ? "📦 Entregado" : "✖ Cancelar"}</button>)}
                          </div>
                        )}
                      </div>
                    )}
                    {/entregados/i.test(x.e) ? <p className="pn-ok">🎁 Puntos entregados</p> : /rechazado/i.test(x.e) ? <p className="pn-aviso">No validado por DCUATES</p> : x.cv ? <p className="pn-ok">✔ Ya lo confirmaste{x.cc ? " (el comprador también)" : ""}. DCUATES lo está validando.</p> : (
                      <div className="pn-conf">
                        <label htmlFor={"pn-m-" + x.id}>Monto cobrado (opcional)</label>
                        <input id={"pn-m-" + x.id} type="text" inputMode="decimal" maxLength={9} value={montos[x.id] || ""} onChange={(e) => setMontos((o) => ({ ...o, [x.id]: e.target.value }))} />
                        <button type="button" className="pn-b pn-b1" onClick={() => confirmarVenta(x.id)}>✅ Se concretó{x.cc ? " (el comprador ya confirmó)" : ""}</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {tab === "canje" && (
              <div className="pn-f">
                <p>Cuando un Cuate te muestre su Pase, escribe su número para confirmar que está activo{d.negocio.ofT ? <> y registrar su promoción: <b>{d.negocio.ofT}</b></> : ""}.</p>
                <label htmlFor="pn-num">Número del Pase</label>
                <input id="pn-num" type="text" autoCapitalize="characters" maxLength={12} placeholder="Ej. VEC100A" value={num} onChange={(e) => { setNum(e.target.value.toUpperCase()); setCj(null); }} />
                <button type="button" className="pn-b" onClick={() => verificar(false)} disabled={cj && cj.t === "carga"}>Verificar Pase</button>
                {cj && cj.t === "err" && <p className="pn-err" role="alert">{cj.m}</p>}
                {cj && cj.t === "ya" && <p className="pn-aviso" role="status">✅ Pase válido: {cj.nombre}. Pero ya canjeó hoy en tu emprendimiento.</p>}
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
      {vista && paso === "panel" && d && (() => {
        const pr = String(v.pr || "").split("\n").map((x) => x.split("~").map((y) => y.trim())).filter((q) => q[0]);
        const of = String(v.of || "").split("\n").map((x) => x.trim()).filter(Boolean);
        const an = leerAnuncios(String(v.an || "").split("\n").map((x) => x.trim()).filter(Boolean).join(" | "), 6);
        const fe = leerAgenda(String(v.fe || "").split("\n").map((x) => x.trim()).filter(Boolean).join(" | "), 15);
        const limF = (d.negocio && /^(p|patrocinador)/i.test(String(d.negocio.niv || ""))) ? 15 : nivelAlto ? 8 : 3;
        const lim = (d.negocio && /^(p|patrocinador)/i.test(String(d.negocio.niv || ""))) ? 6 : nivelAlto ? 3 : 1;
        return (
          <div className="pn-vp" role="dialog" aria-modal="true" aria-label="Vista previa de tu página" data-testid="pn-vista">
            <div className="pn-bar"><button type="button" className="pn-x" onClick={() => setVista(false)} aria-label="Volver a editar">←</button><b>👁️ Así se verá (vista previa)</b></div>
            <div className="pn-vc" style={{ "--c": "#1F7A46" }}>
              <p className="pn-aviso">Es solo una vista previa: todavía no se envió nada. La imagen y el diseño final los acomoda DCUATES.</p>
              <div className="pn-vt"><h1>{d.negocio.n}</h1>{v.e && <p className="pn-ve">{v.e}</p>}{v.h && <p>🕒 {v.h}</p>}{v.dir && <p>📍 {v.dir}</p>}</div>
              {v.d && <section className="ng-s"><VerMas className="pn-vd" lineas={5}>{v.d}</VerMas></section>}
              {of.length > 0 && <section className="ng-s"><h2>Qué ofrece</h2><ul>{of.map((x) => <li key={x}>{x}</li>)}</ul></section>}
              {(v.ofT || pr.length > 0) && (
                <section className="ng-s"><h2>🎟️ Promociones para Cuates</h2>
                  {v.ofT && <div className="pn-vpr"><b>{v.ofT}</b>{v.ofD && <p>{v.ofD}</p>}{v.ofV && <small>Vence: {v.ofV}</small>}</div>}
                  {pr.map((q, i) => <div className="pn-vpr" key={i}><b>{q[0]}</b>{q[1] && <p>{q[1]}</p>}{q[2] && <small>Vence: {q[2]}</small>}</div>)}
                </section>
              )}
              <AgendaNegocio items={fe.slice(0, limF)} wa={v.wa} nombre={d.negocio.n} />
              {fe.length > limF && <p className="pn-aviso">Escribiste {fe.length} fechas; tu nivel muestra solo {limF}.</p>}
              <Anuncios items={an.slice(0, lim)} />
              {an.length > lim && <p className="pn-aviso">Escribiste {an.length} anuncios; tu nivel muestra solo {lim}. Los demás no se publicarán.</p>}
              <button type="button" className="pn-b pn-b1" onClick={() => setVista(false)}>← Volver a editar</button>
            </div>
          </div>
        );
      })()}
    </div>,
    document.body
  );
}

const CSS = `
.pn-vz{display:flex;gap:10px;align-items:flex-start;padding:8px 6px;border:1.5px solid #d5ddd8;border-radius:12px;margin:6px 0;background:#fff;min-height:48px;cursor:pointer}
.pn-f .pn-vz input{width:24px;min-height:24px;height:24px;padding:0;flex:0 0 24px;margin-top:2px}.pn-vz-no{opacity:.5}
.pn-vz b{font-size:14px}.pn-vz em{font-style:normal;color:#0A6A32;font-weight:800;font-size:13px}.pn-e{display:inline-block;margin-left:8px;font-size:11px;font-weight:900;padding:1px 8px;border-radius:999px;background:#E3F4E8;color:#0A6A32}.pn-e-u{background:#FFF1C9;color:#8A5A00}.pn-e-x{background:#F3D9D9;color:#9A1C1C}
.pn-inv{margin-top:6px;padding:8px;border-radius:10px;background:#F4F8FF;border:1px solid #cfe0f5}.pn-inv p{margin:0 0 6px;font-size:13px}.pn-inv-b{display:flex;flex-wrap:wrap;gap:6px}.pn-inv-b .pn-b{flex:1 1 44%;min-height:44px;font-size:13px;margin:0}

.pn-fondo{position:fixed;inset:0;z-index:85;background:var(--dc-fondo,#FBF7EC);font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center}
.pn-caja{width:100%;max-width:560px;height:100%;overflow-y:auto;overscroll-behavior:contain;padding-bottom:40px}
.pn-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;background:#7a4a00;color:#fff;padding:8px 10px}
.pn-bar b{flex:1;font-size:16px;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pn-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#7a4a00;font-size:19px;font-weight:900;cursor:pointer}
.pn-cu{display:block;margin-top:2px;font-size:12px;font-weight:700;color:#6b6b5a;text-align:right}.pn-cu-ya{color:#8a1c1c;font-weight:900}.pn-comp{margin:2px 0 8px;width:100%}
.pn-vp{position:absolute;inset:0;z-index:5;background:var(--dc-fondo,#FBF7EC);overflow-y:auto;max-width:560px;margin:0 auto;display:flex;flex-direction:column}
.pn-vc{display:flex;flex-direction:column;gap:10px;padding:12px 14px 40px}.pn-vc .ng-s{padding:0}.pn-vc h2{margin:0;font-size:18px;font-weight:900}.pn-vc ul{margin:6px 0 0;padding-left:20px;font-weight:700}
.pn-vt h1{margin:0;font-size:22px;font-weight:900}.pn-vt p{margin:3px 0;font-weight:800;font-size:14px}.pn-vt .pn-ve{color:#1F7A46;font-size:15px}
.pn-vpr{border:3px dashed #B7791F;border-radius:14px;background:#FFF4D6;padding:10px 12px;margin-top:8px}.pn-vpr p{margin:4px 0}.pn-vpr small{font-weight:800;color:#6b6b5a}
.pn-vd{font-size:15px;font-weight:700;line-height:1.45}
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
.pn-conf{display:flex;flex-direction:column;gap:6px;margin-top:6px}.pn-mes p{margin:2px 0}
.pn-mes{background:#fff;border:2px solid #e3dcc6;border-radius:14px;padding:10px 12px}.pn-mes ul{list-style:none;margin:6px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px}
.pn-mes li{display:flex;justify-content:space-between;font-size:13.5px;font-weight:700}
`;
