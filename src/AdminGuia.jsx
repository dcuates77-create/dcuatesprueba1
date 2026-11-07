// src/AdminGuia.jsx — Zona de administración (e70): «Guía Visual» en PDF, vista móvil. NO es pública.
//  /admin/login        -> formulario de clave (se valida en el servidor: api/guia.js)
//  /admin/guia-visual  -> con sesión activa muestra la guía; sin sesión redirige a la landing "/"
//  cualquier otra /admin/... -> landing "/"
// El contenido de la guía solo llega del servidor con un token válido; sin token no se renderiza nada.
import React, { useEffect, useState } from "react";

const LLAVE = "dcuates_guia_tk";
const leerToken = () => { try { return sessionStorage.getItem(LLAVE) || ""; } catch { return ""; } };
const guardarToken = (t) => { try { t ? sessionStorage.setItem(LLAVE, t) : sessionStorage.removeItem(LLAVE); } catch {} };
const irALanding = () => window.location.replace("/");

const CSS = `
.gv{--nar:#e66d24;--nar2:#cf5a14;--vd1:#e4f8e7;--vd2:#cdeed4;--tx:#152c1e;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--tx);background:#eef1ee;min-height:100vh;padding:0 0 40px}
.gv *{box-sizing:border-box}
.gv-barra{position:sticky;top:0;z-index:5;background:#152c1e;color:#fff;display:flex;gap:8px;align-items:center;padding:10px 12px;flex-wrap:wrap}
.gv-barra b{flex:1 1 140px;font-size:14px}
.gv-btn{min-height:44px;padding:0 16px;border-radius:12px;border:0;font-weight:700;font-size:15px;cursor:pointer;background:var(--nar);color:#fff}
.gv-btn.sec{background:transparent;border:2px solid #fff}
.gv-pagina{max-width:430px;margin:22px auto 0;padding:0 12px}
.gv-etiqueta{display:inline-block;background:#152c1e;color:#fff;font-weight:800;font-size:12px;letter-spacing:.03em;padding:7px 10px;border-radius:8px 8px 0 0}
.gv-tel{width:100%;max-width:390px;border:3px solid #152c1e;border-radius:0 18px 18px 18px;overflow:hidden;background:var(--vd1);padding:18px 16px}
.gv-tel.alt{background:var(--vd2)}
.gv-nota{font-size:12px;color:#44584b;margin:8px 2px 0}
.gv h1,.gv h2,.gv h3,.gv p{margin:0}
.gv-hero{text-align:center}
.gv-hero img.logo{width:96px;height:96px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px #0003}
.gv-video{position:relative;margin:14px auto 0;border-radius:14px;overflow:hidden;border:3px solid #fff;aspect-ratio:16/9;background:#000}
.gv-video img{width:100%;height:100%;object-fit:cover;display:block}
.gv-video span{position:absolute;inset:0;margin:auto;width:56px;height:56px;border-radius:50%;background:var(--nar);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px}
.gv-video small{position:absolute;left:0;right:0;bottom:0;background:#000a;color:#fff;font-size:11px;padding:4px}
.gv-t1{font-size:38px;font-weight:900;letter-spacing:.04em;margin-top:16px}
.gv-t2{font-size:26px;font-weight:800;color:#1f6b3a;margin-top:4px}
.gv-t3{display:inline-block;margin-top:10px;background:var(--nar);color:#fff;font-weight:800;font-size:16px;padding:9px 14px;border-radius:12px}
.gv-card{background:#fff;border-radius:14px;padding:12px;margin-top:10px;border:2px solid #fff;box-shadow:0 1px 4px #0002}
.gv-card:first-of-type{margin-top:12px}
.gv-card h3{font-size:17px}
.gv-card p{font-size:13px;margin:4px 0 8px;line-height:1.35}
.gv-o{display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;width:100%;border:0;border-radius:12px;background:var(--nar);color:#fff;font-weight:800;font-size:15px;text-decoration:none;font-family:inherit}
.gv-h2{font-size:20px;font-weight:900;margin-bottom:4px}
.gv-campo{margin-top:10px}
.gv-campo label{display:block;font-size:13px;font-weight:700;margin-bottom:4px}
.gv-campo div{background:#fff;border:2px solid #9fc9ab;border-radius:10px;min-height:44px;padding:11px 12px;font-size:14px;color:#6b7f72}
.gv-destino{margin-top:10px;font-size:11px;word-break:break-all;background:#fff;border:1px dashed #1f6b3a;border-radius:8px;padding:6px 8px}
.gv-fila{display:grid;grid-template-columns:96px 1fr;gap:10px;align-items:center;margin-top:8px}
.gv-fila small{font-size:12px;font-weight:700}
.gv-var{margin-top:12px;background:#fff;border-radius:12px;padding:10px}
.gv-var h3{font-size:14px}
.gv-celda{position:relative}
.gv-b{display:flex;align-items:center;justify-content:center;min-height:44px;width:100%;border-radius:12px;font-weight:800;font-size:14px;border:2px solid var(--nar);font-family:inherit;transition:none}
.gv-b.solido{background:var(--nar);color:#fff}
.gv-b.contorno{background:#fff;color:var(--nar2)}
.gv-b.suave{background:#ffe9c8;color:#8a3d0c;border-color:#f1b77a}
.gv-b.hover{filter:brightness(1.08);box-shadow:0 5px 12px #e66d2466}
.gv-b.activo{transform:scale(.95);filter:brightness(.9)}
.gv-dedo{position:absolute;width:42px;height:42px;border-radius:50%;background:rgba(21,44,30,.30);border:2px solid rgba(21,44,30,.55);left:calc(78% - 21px);top:calc(50% - 4px);pointer-events:none}
.gv-b.activo + .gv-dedo{width:52px;height:52px;left:calc(78% - 26px);background:rgba(21,44,30,.42)}
.gv-login{max-width:360px;margin:60px auto;padding:0 16px}
.gv-login form{background:#fff;border-radius:16px;padding:18px;box-shadow:0 2px 10px #0002}
.gv-login input{width:100%;min-height:48px;border:2px solid #9fc9ab;border-radius:10px;padding:0 12px;font-size:16px;margin:10px 0}
.gv-err{color:#b00020;font-size:14px;margin-bottom:8px}
@media print{
  @page{size:A4 portrait;margin:10mm}
  html,body{background:#fff !important}
  .gv,.gv *{-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important}
  .gv{background:#fff;padding:0;min-height:0}
  .gv-barra{display:none !important}
  .gv-pagina{max-width:none;margin:0;padding:0;page-break-after:always;break-after:page;page-break-inside:avoid;break-inside:avoid;display:flex;flex-direction:column;align-items:center}
  .gv-pagina:last-of-type{page-break-after:auto;break-after:auto}
  .gv-tel{box-shadow:none}
  .gv-pagina>*{zoom:1.3}
}
`;

function Boton({ v, e, t }) {
  const conDedo = e === "hover" || e === "activo";
  return (
    <div className="gv-celda">
      <button type="button" className={`gv-b ${v} ${e}`} tabIndex={-1} data-testid={`gv-btn-${v}-${e}`}>{t}</button>
      {conDedo && <span className="gv-dedo" data-testid={`gv-dedo-${v}-${e}`} aria-hidden="true" />}
    </div>
  );
}

function Pantalla({ p, i }) {
  const alt = i % 2 === 1;
  return (
    <section className="gv-pagina" data-testid={`gv-${p.id}`}>
      <div className="gv-etiqueta">{p.etiqueta}</div>
      <div className={`gv-tel${alt ? " alt" : ""}`}>
        {p.id === "p1" && (
          <div className="gv-hero">
            <img className="logo" src="/images/logo-circular.png" alt="Logo DCUATES" />
            <div className="gv-video"><img src="/images/portada-inicio.jpg" alt="" /><span>▶</span><small>{p.video}</small></div>
            <h1 className="gv-t1">{p.titulos[0]}</h1>
            <h2 className="gv-t2">{p.titulos[1]}</h2>
            <h3 className="gv-t3">{p.titulos[2]}</h3>
          </div>
        )}
        {p.id === "p2" && (
          <div>
            <h2 className="gv-h2">Iniciativas de la comunidad</h2>
            {p.iniciativas.map((x) => (
              <div className="gv-card" key={x.t}><h3>{x.icono} {x.t}</h3><p>{x.d}</p><button type="button" className="gv-o" tabIndex={-1}>{x.b}</button></div>
            ))}
          </div>
        )}
        {p.id === "p3" && (
          <div>
            <h2 className="gv-h2">{p.titulo}</h2>
            {p.campos.map((c) => (<div className="gv-campo" key={c.n}><label>{c.n}</label><div>{c.ph}</div></div>))}
            <a className="gv-o" style={{ marginTop: 14 }} data-testid="gv-wa" href={`https://wa.me/${p.waNumero}?text=${encodeURIComponent(p.mensaje)}`} target="_blank" rel="noopener noreferrer">💬 {p.boton}</a>
            <div className="gv-destino">Destino: wa.me/{p.waNumero}?text=… (WhatsApp Business DCUATES)</div>
          </div>
        )}
        {p.id === "p4" && (
          <div>
            <h2 className="gv-h2">Botón naranja: 3 variantes × 3 estados</h2>
            {p.variantes.map((v) => (
              <div className="gv-var" key={v.k}>
                <h3>{v.n}</h3>
                {p.estados.map((s) => (<div className="gv-fila" key={s.k}><small>{s.n}</small><Boton v={v.k} e={s.k} t={v.t} /></div>))}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="gv-nota">{p.notas}</p>
    </section>
  );
}

export default function AdminGuia() {
  const ruta = window.location.pathname.replace(/\/+$/, "");
  const [guia, setGuia] = useState(null);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement("meta"); m.name = "robots"; document.head.appendChild(m); }
    m.content = "noindex, nofollow";
    document.title = "Administración · DCUATES";
  }, []);

  useEffect(() => {
    if (ruta !== "/admin/guia-visual") { if (ruta !== "/admin/login") irALanding(); return; }
    const tk = leerToken();
    if (!tk) { irALanding(); return; }
    let vivo = true;
    fetch("/api/guia", { headers: { Authorization: `Bearer ${tk}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => { if (vivo && d && d.ok) { const g = d.guia; g.pantallas.forEach((p) => { if (p.id === "p3") p.waNumero = d.guia.whatsapp; }); setGuia(g); } else irALanding(); })
      .catch(() => { guardarToken(""); irALanding(); });
    return () => { vivo = false; };
  }, [ruta]);

  async function entrar(ev) {
    ev.preventDefault(); setError(""); setEnviando(true);
    try {
      const r = await fetch("/api/guia", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clave }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok && d.token) { guardarToken(d.token); window.location.replace("/admin/guia-visual"); return; }
      setError(r.status === 503 ? "El acceso aún no está configurado en el servidor." : "Clave incorrecta.");
    } catch { setError("No se pudo conectar. Intenta de nuevo."); }
    setEnviando(false);
  }

  if (ruta === "/admin/login") {
    return (
      <div className="gv"><style>{CSS}</style>
        <div className="gv-login"><form onSubmit={entrar}>
          <h1 style={{ fontSize: 20 }}>Administración DCUATES</h1>
          <input type="password" autoComplete="current-password" placeholder="Clave de administrador" value={clave} onChange={(e) => setClave(e.target.value)} data-testid="gv-clave" aria-label="Clave de administrador" />
          {error && <div className="gv-err" role="alert" data-testid="gv-error">{error}</div>}
          <button className="gv-btn" style={{ width: "100%" }} disabled={enviando || !clave} data-testid="gv-entrar">{enviando ? "Verificando…" : "Entrar"}</button>
        </form></div>
      </div>
    );
  }
  if (!guia) return null;
  return (
    <div className="gv" data-testid="gv-raiz"><style>{CSS}</style>
      <div className="gv-barra">
        <b>{guia.titulo}</b>
        <button className="gv-btn" onClick={() => window.print()} data-testid="gv-imprimir">Imprimir / Guardar PDF</button>
        <button className="gv-btn sec" onClick={() => { guardarToken(""); irALanding(); }} data-testid="gv-salir">Salir</button>
      </div>
      {guia.pantallas.map((p, i) => <Pantalla key={p.id} p={p} i={i} />)}
    </div>
  );
}
