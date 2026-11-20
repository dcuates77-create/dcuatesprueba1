// ASISTENTE «ARMA TU PÁGINA CUATE» (e85c) — plantilla paso a paso: eliges tu giro, se llenan textos de ejemplo que puedes editar,
// ves una vista previa en vivo y lo envías para revisión. Llega a la hoja «NegociosCUATE» como «En revisión» (NO se publica sola).
// Logo, portada y fotos se mandan después por WhatsApp con el folio. Se abre con abrirAsistente() (evento dcuates:asistente) o con #arma-tu-pagina.
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { GIROS, giroPorId } from "./datos/giros.js";
import { categoriaDe } from "./datos/negocios.js";
import { GOOGLE_SHEETS_URL, WHATSAPP_NUMERO } from "./datos/config.js";
import { nuevoId } from "./utilidades/pedidos.js";
import { texto, useTextos, estadoAlta } from "./utilidades/tema.js";

export const abrirAsistente = () => window.dispatchEvent(new CustomEvent("dcuates:asistente"));
const LLAVE = "dc_asistente";
const VACIO = { giro: "", nombre: "", es: "", d: "", o: "", h: "", col: "", ent: "Estado de México", pa: "México", wa: "", resp: "", pt: "", pd: "", ok: false };
const leer = () => { try { const o = JSON.parse(localStorage.getItem(LLAVE) || "null"); return o && typeof o === "object" ? { ...VACIO, ...o, ok: false } : VACIO; } catch (e) { return VACIO; } };
const guardar = (f) => { try { localStorage.setItem(LLAVE, JSON.stringify(f)); } catch (e) { /* sin almacenamiento */ } };
const soloDigitos = (t) => String(t || "").replace(/\D/g, "");
const waValido = (t) => { const d = soloDigitos(t); return d.length === 10 || (d.length >= 11 && d.length <= 13); };
const slugDe = (n) => String(n || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

export default function AsistentePagina() {
  useTextos();
  const [folioC, setFolioC] = useState("");
  const [resC, setResC] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [abierto, setAbierto] = useState(() => typeof window !== "undefined" && window.location.hash === "#arma-tu-pagina");
  const [f, setF] = useState(leer);
  const [tocado, setTocado] = useState({});
  const [hp, setHp] = useState("");
  const [hecho, setHecho] = useState(null);
  const [err, setErr] = useState("");
  const enviando = useRef(false);
  useEffect(() => {
    const quitar = () => { try { history.replaceState(history.state, "", window.location.pathname + window.location.search); } catch (x) { /* sin historial */ } };
    if (window.location.hash === "#arma-tu-pagina") quitar();
    const al = () => { if (window.location.hash === "#arma-tu-pagina") { setAbierto(true); quitar(); } };
    const ev = () => setAbierto(true);
    window.addEventListener("hashchange", al);
    window.addEventListener("dcuates:asistente", ev);
    return () => { window.removeEventListener("hashchange", al); window.removeEventListener("dcuates:asistente", ev); };
  }, []);
  const cerrar = () => setAbierto(false);
  const oculta = useAtras(abierto, cerrar);
  useEffect(() => { if (abierto) registrar("asistente_abrir"); }, [abierto]);
  if (!abierto) return null;

  const cambiar = (k, v) => { setTocado((t) => ({ ...t, [k]: true })); setF((x) => { const n = { ...x, [k]: v }; guardar(n); return n; }); };
  const aplicarGiro = (id, forzar) => {
    const g = giroPorId(id);
    setF((x) => {
      const n = { ...x, giro: id };
      if (g) {
        const poner = (k, v) => { if (forzar || !tocado[k] || !x[k]) n[k] = v; };
        poner("es", g.es); poner("d", g.d); poner("o", g.o.join("\n")); poner("h", g.h); poner("pt", g.pt); poner("pd", g.pd);
      }
      guardar(n); return n;
    });
    if (forzar) setTocado({});
    registrar("asistente_giro", { giro: id });
  };
  const g = giroPorId(f.giro);
  const cat = g ? categoriaDe(g.c) : null;
  const lineas = String(f.o || "").split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 8);
  const faltan = [];
  if (!f.giro) faltan.push("tu giro");
  if (f.nombre.trim().length < 3) faltan.push("el nombre de tu emprendimiento");
  if (!f.col.trim()) faltan.push("tu colonia o municipio");
  if (!waValido(f.wa)) faltan.push("tu WhatsApp (10 dígitos)");
  if (f.resp.trim().length < 2) faltan.push("tu nombre");
  if (!f.ok) faltan.push("aceptar el Aviso de Privacidad");

  const enviar = () => {
    if (enviando.current) return;
    if (faltan.length) { setErr("Falta: " + faltan.join(", ") + "."); return; }
    setErr(""); enviando.current = true;
    const folio = "ALT-" + new Date().getFullYear() + "-" + nuevoId().slice(0, 3);
    const cuerpo = { Tipo: "NegocioAlta", Folio: folio, Nombre: f.nombre.trim().slice(0, 80), Giro: g ? g.c : "SERVICIOS VARIOS", GiroNombre: g ? g.n : "", Eslogan: f.es.trim().slice(0, 120), Descripcion: f.d.trim().slice(0, 700),
      Ofrece: lineas.join(" | ").slice(0, 600), Horario: f.h.trim().slice(0, 120), Colonia: f.col.trim().slice(0, 60), Entidad: f.ent.trim().slice(0, 60), Pais: f.pa.trim().slice(0, 60),
      Whatsapp: soloDigitos(f.wa).slice(-13), Responsable: f.resp.trim().slice(0, 60), PromoTitulo: f.pt.trim().slice(0, 80), PromoTexto: f.pd.trim().slice(0, 200), Web: hp };
    try {
      if (!/^(localhost|127\.|\[::1\])/.test(window.location.hostname)) fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", keepalive: true, body: new URLSearchParams(cuerpo) }).catch(() => {});
    } catch (e) { /* el folio igual se muestra y la persona puede escribir por WhatsApp */ }
    registrar("asistente_enviar", { giro: f.giro });
    try { localStorage.removeItem(LLAVE); } catch (e) { /* sin almacenamiento */ }
    setHecho({ folio, nombre: f.nombre.trim(), slug: slugDe(f.nombre) });
  };
  const msgWa = hecho ? texto("wa_asistente", "¡Hola DCUATES! Armé mi Página CUATE «{nombre}» con el asistente (folio {folio}). Te mando por aquí mi logo, mi portada y mis fotos.", { nombre: hecho.nombre, folio: hecho.folio }) : "";
  const abrirWa = () => window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msgWa)}`, "_blank", "noopener,noreferrer");
  const consultar = async () => {
    const f = folioC.trim().toUpperCase();
    if (!/^ALT-\d{4}-[A-Z0-9]{3}$/.test(f)) { setResC({ t: "Escribe tu folio completo, con este formato: ALT-2026-K7M." }); return; }
    setBuscando(true);
    const r = await estadoAlta(f);
    setBuscando(false);
    if (r.ok && r.estado === "aprobado") setResC({ t: "✅ ¡Tu página ya está publicada!", slug: r.slug });
    else if (r.ok && r.estado === "pausa") setResC({ t: "⏸️ Tu página está en pausa. Escríbenos por WhatsApp para saber qué falta." });
    else if (r.ok) setResC({ t: "🕒 Tu página está en revisión. Si aún no mandas tu logo y fotos por WhatsApp, mándalos con tu folio para agilizarla." });
    else if (r.motivo === "espera") setResC({ t: "Hay muchas consultas en este momento. Intenta de nuevo en un minuto." });
    else setResC({ t: "No encontramos ese folio. Revisa que esté bien escrito o escríbenos por WhatsApp." });
  };
  const empezarOtra = () => { setHecho(null); setF(VACIO); setTocado({}); enviando.current = false; };

  return createPortal(
    <div className="as-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Arma tu Página CUATE" data-testid="asistente">
      <style>{CSS}</style>
      <div className="as-caja">
        <div className="as-bar">
          <button type="button" className="as-x" onClick={cerrar} aria-label="Cerrar">✕</button>
          <b>🧩 Arma tu Página CUATE</b>
        </div>
        {hecho ? (
          <div className="as-ok" data-testid="asistente-listo">
            <h2>🎉 ¡Listo, recibimos tu Página CUATE!</h2>
            <p>Tu folio es <b className="as-folio" data-testid="asistente-folio">{hecho.folio}</b>. Quedó <b>en revisión</b>: DCUATES la revisa y, si todo está bien, la publica en <b>dcuates.com/n/{hecho.slug || "tu-emprendimiento"}</b> (la dirección final se confirma al publicarla).</p>
            <p><b>Siguiente paso:</b> manda por WhatsApp tu logo, tu portada y tus fotos con tu folio. Ya dejamos el mensaje listo.</p>
            <button type="button" className="as-b as-wa" data-testid="asistente-wa" onClick={abrirWa}>📲 Mandar mis imágenes por WhatsApp</button>
            <p className="as-n">Si no se abre WhatsApp, copia este mensaje y envíalo: <i>{msgWa}</i></p>
            <button type="button" className="as-b" onClick={cerrar}>Cerrar</button>
            <button type="button" className="as-l" onClick={empezarOtra}>Armar otra página</button>
          </div>
        ) : (
          <div className="as-cuerpo">
            <p className="as-intro">{texto("asistente_intro", "Elige tu giro, ajusta los textos de ejemplo a tu estilo y envíalo. Tu página nunca se publica sola: la revisa DCUATES. Después mandas tu logo y fotos por WhatsApp.")}</p>
            <details className="as-seg" data-testid="asistente-seguimiento">
              <summary>🔎 ¿Ya enviaste tu página? Consulta tu folio</summary>
              <div className="as-segc">
                <input className="as-i" value={folioC} maxLength={16} onChange={(e) => { setFolioC(e.target.value.toUpperCase()); setResC(null); }} placeholder="Ej. ALT-2026-K7M" data-testid="asistente-folio-input" />
                <button type="button" className="as-b" data-testid="asistente-consultar" disabled={buscando} onClick={consultar}>{buscando ? "Buscando…" : "Consultar estado"}</button>
                {resC && <p className="as-res" role="status" data-testid="asistente-estado">{resC.t}{resC.slug && <> <a href={"/n/" + resC.slug} data-testid="asistente-ver">Abrir mi página</a></>}</p>}
              </div>
            </details>

            <h3>1 · ¿Cuál es tu giro?</h3>
            <select className="as-i" value={f.giro} onChange={(e) => aplicarGiro(e.target.value, false)} aria-label="Giro" data-testid="asistente-giro">
              <option value="">Elige tu giro…</option>
              {GIROS.map((x) => <option key={x.id} value={x.id}>{x.e} {x.n}</option>)}
            </select>
            {g && <button type="button" className="as-l" data-testid="asistente-reponer" onClick={() => aplicarGiro(f.giro, true)}>↺ Volver a poner los textos de ejemplo de este giro</button>}

            <h3>2 · Tus datos</h3>
            <label className="as-e">Nombre de tu emprendimiento *</label>
            <input className="as-i" value={f.nombre} maxLength={80} onChange={(e) => cambiar("nombre", e.target.value)} placeholder="Ej. Pasteles Doña Lupe" data-testid="asistente-nombre" />
            <label className="as-e">Eslogan (una frase corta)</label>
            <input className="as-i" value={f.es} maxLength={120} onChange={(e) => cambiar("es", e.target.value)} />
            <label className="as-e">Descripción</label>
            <textarea className="as-i" rows={4} value={f.d} maxLength={700} onChange={(e) => cambiar("d", e.target.value)} data-testid="asistente-desc" />
            <label className="as-e">Qué ofreces (una cosa por renglón)</label>
            <textarea className="as-i" rows={4} value={f.o} onChange={(e) => cambiar("o", e.target.value)} data-testid="asistente-ofrece" />
            <label className="as-e">Horario</label>
            <input className="as-i" value={f.h} maxLength={120} onChange={(e) => cambiar("h", e.target.value)} />
            <label className="as-e">Colonia o municipio *</label>
            <input className="as-i" value={f.col} maxLength={60} onChange={(e) => cambiar("col", e.target.value)} placeholder="Ej. Jardines de Morelos" data-testid="asistente-col" />
            <div className="as-2">
              <div><label className="as-e">Entidad (estado)</label><input className="as-i" value={f.ent} maxLength={60} onChange={(e) => cambiar("ent", e.target.value)} /></div>
              <div><label className="as-e">País</label><input className="as-i" value={f.pa} maxLength={60} onChange={(e) => cambiar("pa", e.target.value)} /></div>
            </div>
            <label className="as-e">Tu WhatsApp (10 dígitos) *</label>
            <input className="as-i" inputMode="tel" value={f.wa} maxLength={20} onChange={(e) => cambiar("wa", e.target.value)} placeholder="Ej. 5512345678" data-testid="asistente-wa-num" />
            <label className="as-e">Tu nombre *</label>
            <input className="as-i" value={f.resp} maxLength={60} onChange={(e) => cambiar("resp", e.target.value)} placeholder="Quién nos atiende" data-testid="asistente-resp" />

            <h3>3 · Promoción para los Cuates (opcional)</h3>
            <p className="as-n">Con una promoción tu página puede ser <b>gratuita</b>. Si prefieres no ponerla, la dejamos de aportación voluntaria y lo platicamos por WhatsApp.</p>
            <input className="as-i" value={f.pt} maxLength={80} onChange={(e) => cambiar("pt", e.target.value)} placeholder="Título. Ej. Postre de cortesía" />
            <textarea className="as-i" rows={2} value={f.pd} maxLength={200} onChange={(e) => cambiar("pd", e.target.value)} placeholder="Texto de la promoción" />

            <h3>4 · Así se verá</h3>
            <div className="as-prev" data-testid="asistente-prev" style={cat ? { borderColor: cat.color } : undefined}>
              <div className="as-ph" style={{ background: cat ? cat.color : "#1F7A46" }}>{cat ? cat.e + " " + cat.nombre : "Elige tu giro"}</div>
              <h4>{f.nombre.trim() || "Nombre de tu emprendimiento"}</h4>
              {f.es && <p className="as-pe">{f.es}</p>}
              {f.d && <p>{f.d}</p>}
              {lineas.length > 0 && <ul>{lineas.map((l) => <li key={l}>{l}</li>)}</ul>}
              {f.h && <p>🕒 {f.h}</p>}
              {f.col && <p>📍 {f.col}{f.ent && f.ent !== "Estado de México" ? ", " + f.ent : ""}{f.pa && f.pa !== "México" ? ", " + f.pa : ""}</p>}
              {f.pt && <p className="as-pp">🎁 <b>{f.pt}</b>{f.pd ? " — " + f.pd : ""}</p>}
              <p className="as-pw">💬 Escríbenos por WhatsApp</p>
            </div>

            <input className="as-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="web" />
            <label className="as-ck"><input type="checkbox" checked={f.ok} onChange={(e) => setF((x) => ({ ...x, ok: e.target.checked }))} data-testid="asistente-aviso" /> Acepto el Aviso de Privacidad de DCUATES y que revisen mi información antes de publicarla.</label>
            {err && <p className="as-err" role="alert" data-testid="asistente-error">{err}</p>}
            <button type="button" className="as-b" data-testid="asistente-enviar" onClick={enviar}>Enviar para revisión</button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.as-fondo{position:fixed;inset:0;z-index:96;background:var(--dc-fondo,#FBF7EC);font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;display:flex;justify-content:center;overflow-y:auto}
.as-caja{width:100%;max-width:560px;padding:0 12px 40px;box-sizing:border-box}
.as-bar{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:8px;margin:0 -12px;background:var(--dc-verde,#1F7A46);color:#fff;padding:8px 10px}
.as-bar b{flex:1;font-size:17px;font-weight:900}
.as-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--dc-verde,#1F7A46);font-size:19px;font-weight:900;cursor:pointer}
.as-intro{font-size:15px;font-weight:700;line-height:1.45}
.as-cuerpo h3{margin:18px 0 6px;font-size:17px;font-weight:900;color:var(--dc-verde,#1F7A46)}
.as-e{display:block;margin:10px 0 3px;font-size:14px;font-weight:900}
.as-i{width:100%;box-sizing:border-box;min-height:46px;padding:8px 10px;border:3px solid #0f2d1e;border-radius:12px;background:#fff;font:inherit;font-size:16px;font-weight:700;color:#0f2d1e}
.as-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.as-n{font-size:13.5px;font-weight:700;line-height:1.4;margin:4px 0 8px}
.as-l{background:none;border:0;color:var(--dc-verde,#1F7A46);font-weight:900;font-size:14px;text-decoration:underline;padding:10px 0;min-height:44px;cursor:pointer}
.as-prev{border:4px solid var(--dc-verde,#1F7A46);border-radius:16px;background:#fff;overflow:hidden;padding-bottom:6px}
.as-ph{color:#fff;font-weight:900;font-size:14px;padding:6px 12px}
.as-prev h4{margin:10px 12px 2px;font-size:20px;font-weight:900}
.as-prev p,.as-prev ul{margin:4px 12px;font-size:14.5px;font-weight:700;line-height:1.4}
.as-prev ul{padding-left:28px;list-style:disc}.as-pe{font-style:italic;color:#475569}
.as-pp{background:#FFF7D6;border-radius:10px;padding:6px 8px}.as-pw{background:#25D366;color:#fff;border-radius:10px;padding:8px;text-align:center}
.as-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.as-ck{display:flex;gap:8px;align-items:flex-start;margin:14px 0 6px;font-size:14px;font-weight:700;line-height:1.4}
.as-ck input{width:22px;height:22px;flex:none;margin-top:1px}
.as-err{margin:8px 0;padding:10px 12px;border:3px solid #b42318;border-radius:12px;background:#fff0ee;color:#7a1a10;font-weight:900;font-size:14px}
.as-b{display:block;width:100%;min-height:52px;margin:10px 0;border:4px solid #0f2d1e;border-radius:14px;background:var(--dc-verde,#1F7A46);color:#fff;font:inherit;font-size:17px;font-weight:900;cursor:pointer}
.as-wa{background:#25D366;color:#0f2d1e}
.as-ok{padding-top:14px}.as-ok h2{font-size:22px;font-weight:900;margin:0 0 8px}.as-ok p{font-size:15px;font-weight:700;line-height:1.45}
.as-seg{margin:8px 0;border:3px solid var(--dc-verde,#1F7A46);border-radius:12px;background:#fff}.as-seg summary{min-height:48px;display:flex;align-items:center;padding:0 12px;font-weight:900;font-size:15px;cursor:pointer}.as-segc{padding:0 12px 10px}.as-res{margin:6px 0 0;font-weight:900;font-size:15px;line-height:1.4}.as-res a{color:var(--dc-verde,#1F7A46)}
.as-folio{background:#FFF7D6;border:2px dashed #b8860b;border-radius:8px;padding:1px 8px;white-space:nowrap}
`;
