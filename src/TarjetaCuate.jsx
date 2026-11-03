// TARJETA DIGITAL DEL CUATE (e64). Colores, lemas y avatares: src/datos/tarjeta.js · datos de cada Cuate y premios: tu hoja (Cuates, Puntos, Premios).
// Se abre con el evento dcuates:tarjeta (menú ☰ «Mi tarjeta Cuate», botón del Club y constancia del folio).
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { NARANJA_CLUB } from "./datos/club.js";
import { abrirClubInfo } from "./ClubDcuates.jsx";
import { useTarjeta, MENSAJE_TARJETA, procesarFoto } from "./utilidades/tarjetaHoja.js";
import {
  TARJETA_TITULO, TARJETA_LEMA, TARJETA_LEGAL, TARJETA_PRIVACIDAD_FOTO, AVATARES_LOGO, AVATARES_EMOJI, rutaLogo, temaDe, iconoPremio, desdeTexto
} from "./datos/tarjeta.js";

const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;
const MAXNOM = 28;

function Silueta({ tipo }) {
  const C = (children) => <svg className="tj-sil" viewBox="0 0 400 70" preserveAspectRatio="xMidYMax slice" aria-hidden="true">{children}</svg>;
  if (tipo === "casas") return C([0, 1, 2, 3, 4, 5].map((i) => <g key={i}><polygon points={`${i * 70 + 10},40 ${i * 70 + 35},16 ${i * 70 + 60},40`} /><rect x={i * 70 + 15} y="40" width="40" height="30" /></g>));
  if (tipo === "ciudad") return C([40, 60, 35, 70, 50, 65, 30, 55].map((h, i) => <rect key={i} x={i * 50 + 4} y={70 - h} width="38" height={h} />));
  if (tipo === "gente") return C([0, 1, 2, 3, 4].map((i) => <g key={i}><circle cx={40 + i * 80} cy="26" r="11" /><rect x={26 + i * 80} y="40" width="28" height="30" rx="13" /></g>));
  const h = (x, y, s, k) => <path key={k} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -8 C-8 -24 -34 -12 0 22 C34 -12 8 -24 0 -8Z" />;
  if (tipo === "corazon") return C([h(200, 36, 1.9, 1), h(110, 48, 0.9, 2), h(290, 48, 0.9, 3)]);
  if (tipo === "corazones") return C([h(60, 44, 1, 1), h(150, 36, 1.5, 2), h(250, 40, 1.2, 3), h(340, 46, 0.9, 4)]);
  return C(<g><polygon points="90,30 200,6 310,30" /><rect x="96" y="32" width="208" height="6" /><rect x="106" y="40" width="14" height="24" /><rect x="136" y="40" width="14" height="24" /><rect x="166" y="40" width="14" height="24" /><rect x="196" y="40" width="14" height="24" /><rect x="226" y="40" width="14" height="24" /><rect x="256" y="40" width="14" height="24" /><rect x="286" y="40" width="14" height="24" /><rect x="90" y="64" width="220" height="6" /></g>);
}

function Avatar({ prefs, tema, tam = 104 }) {
  const av = prefs.av || "";
  const estilo = { width: tam, height: tam, fontSize: tam * 0.52 };
  let cont;
  if (av === "foto" && prefs.foto) cont = <img src={prefs.foto} alt="Tu foto" />;
  else if (av.indexOf("l:") === 0) { const l = AVATARES_LOGO.find((x) => "l:" + x.id === av); cont = <img src={rutaLogo(av.slice(2))} alt={l ? l.nombre : "Logo"} />; }
  else cont = <span aria-hidden="true">{av.indexOf("e:") === 0 ? av.slice(2) : tema.icono}</span>;
  return <div className="tj-av" style={estilo}>{cont}</div>;
}

function Acceso({ entrar, aviso, cerrar }) {
  const [n, setN] = useState("");
  const [k, setK] = useState("");
  const [msg, setMsg] = useState(aviso || "");
  const [ocupado, setOcupado] = useState(false);
  const enviar = async (e) => {
    e.preventDefault();
    if (ocupado) return;
    setOcupado(true); setMsg("");
    const r = await entrar(n, k);
    setOcupado(false);
    if (!r.ok) setMsg(MENSAJE_TARJETA[r.motivo] || MENSAJE_TARJETA.red);
    else registrar("tarjeta_entrar", {});
  };
  return (
    <div className="tj-acc">
      <div className="tj-acc-c">💳</div>
      <h2>Mi tarjeta Cuate</h2>
      <p>Escribe el <b>número de Cuate</b> y el <b>código</b> que te mandó DCUATES por WhatsApp cuando te aprobaron en el Club.</p>
      <form onSubmit={enviar}>
        <label>Número de Cuate<input value={n} onChange={(e) => setN(e.target.value)} placeholder="VEC100A" maxLength={12} autoCapitalize="characters" autoComplete="off" inputMode="text" aria-label="Número de Cuate" /></label>
        <label>Código<input value={k} onChange={(e) => setK(e.target.value)} placeholder="K7M2QX" maxLength={12} autoCapitalize="characters" autoComplete="off" aria-label="Código personal" type="password" /></label>
        <button type="submit" disabled={ocupado}>{ocupado ? "Revisando…" : "Abrir mi tarjeta"}</button>
      </form>
      {msg && <p className="tj-err" role="alert">{msg}</p>}
      <button type="button" className="tj-lnk" onClick={() => window.open(wa("¡Hola DCUATES! Ya me registré en el Club y quiero mi número de Cuate y mi código. Mi folio es: ___"), "_blank", "noopener")}>📲 Pedir mi número y código por WhatsApp</button>
      <button type="button" className="tj-lnk" onClick={() => { cerrar(); setTimeout(abrirClubInfo, 80); }}>🧡 Aún no soy Cuate: unirme al Club</button>
    </div>
  );
}

function Configuracion({ tarjeta, tema, lemas, prefs, guardarPrefs, salir, cerrar }) {
  const [nom, setNom] = useState(prefs.nombre || "");
  const [err, setErr] = useState("");
  const [seguro, setSeguro] = useState(false);
  const archivo = useRef(null);
  const aviso = () => setErr("No se pudo guardar en este celular (poco espacio o modo privado).");
  const elegir = (av) => { setErr(""); if (!guardarPrefs({ av })) aviso(); };
  const foto = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setErr("");
    const d = await procesarFoto(f);
    if (!d) { setErr("No pude usar esa imagen. Prueba con otra foto."); return; }
    if (!guardarPrefs({ foto: d, av: "foto" })) aviso();
  };
  return (
    <div className="tj-cfg-f" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div className="tj-cfg" role="dialog" aria-modal="true" aria-label="Configurar mi tarjeta">
        <div className="tj-cfg-h"><b>⚙️ Mi tarjeta</b><button type="button" onClick={cerrar} aria-label="Cerrar configuración">✕</button></div>
        <label className="tj-fl">Nombre en la tarjeta
          <input value={nom} maxLength={MAXNOM} placeholder={tarjeta.nombre || "Tu nombre"} onChange={(e) => setNom(e.target.value)} onBlur={() => guardarPrefs({ nombre: nom.trim() })} />
        </label>
        <p className="tj-sm">Solo se ve en tu celular. Déjalo vacío para usar el que registraste.</p>

        <p className="tj-fl">Tu imagen</p>
        <div className="tj-grid">
          <button type="button" className="tj-op tj-foto" onClick={() => archivo.current && archivo.current.click()} aria-label="Usar una foto de mi celular">📷<small>Mi foto</small></button>
          {prefs.foto && <button type="button" className={"tj-op" + (prefs.av === "foto" ? " on" : "")} aria-pressed={prefs.av === "foto"} onClick={() => elegir("foto")} aria-label="Mi foto guardada"><img src={prefs.foto} alt="" /></button>}
          <button type="button" className={"tj-op" + (!prefs.av ? " on" : "")} aria-pressed={!prefs.av} onClick={() => elegir("")} aria-label="Avatar de mi perfil"><span>{tema.icono}</span></button>
          {AVATARES_LOGO.map((l) => <button type="button" key={l.id} className={"tj-op" + (prefs.av === "l:" + l.id ? " on" : "")} aria-pressed={prefs.av === "l:" + l.id} aria-label={l.nombre} onClick={() => elegir("l:" + l.id)}><img src={rutaLogo(l.id)} alt="" loading="lazy" /></button>)}
          {AVATARES_EMOJI.map((x) => <button type="button" key={x} className={"tj-op" + (prefs.av === "e:" + x ? " on" : "")} aria-pressed={prefs.av === "e:" + x} aria-label={"Avatar " + x} onClick={() => elegir("e:" + x)}><span>{x}</span></button>)}
        </div>
        <input ref={archivo} type="file" accept="image/*" hidden onChange={foto} data-testid="tj-archivo" />
        <p className="tj-sm">{TARJETA_PRIVACIDAD_FOTO}</p>

        <p className="tj-fl">Tu lema</p>
        <div className="tj-lemas" role="radiogroup" aria-label="Lema">
          {lemas.map((l, i) => <button type="button" key={l} role="radio" aria-checked={(prefs.lema || 0) === i} className={"tj-lm" + ((prefs.lema || 0) === i ? " on" : "")} onClick={() => guardarPrefs({ lema: i })}>{l}</button>)}
        </div>

        <label className="tj-chk"><input type="checkbox" checked={!!prefs.oculto} onChange={(e) => guardarPrefs({ oculto: e.target.checked })} /> Ocultar mis puntos en pantalla</label>
        {err && <p className="tj-err" role="alert">{err}</p>}
        <button type="button" className="tj-listo" onClick={() => { if (nom.trim() !== (prefs.nombre || "")) guardarPrefs({ nombre: nom.trim() }); cerrar(); }}>Listo</button>
        <button type="button" className="tj-salir" onClick={() => { if (!seguro) { setSeguro(true); return; } salir(); cerrar(); }}>{seguro ? "¿Seguro? Toca otra vez para salir de este celular" : "Salir de este celular"}</button>
        <p className="tj-sm">Al salir se borran tu código, tu foto y tus gustos de este celular. Para volver a entrar necesitas tu número y tu código.</p>
      </div>
    </div>
  );
}

export default function TarjetaCuate() {
  const [abierto, setAbierto] = useState(false);
  const [cfg, setCfg] = useState(false);
  const [dot, setDot] = useState(0);
  const [verMovs, setVerMovs] = useState(false);
  const carr = useRef(null);
  const cerrar = () => { setAbierto(false); setCfg(false); };
  const oculta = useAtras(abierto, cerrar, { hub: true });
  const { tarjeta, cargando, sinConexion, aviso, prefs, entrar, salir, guardarPrefs } = useTarjeta(abierto);
  useEffect(() => {
    const abre = () => { setCfg(false); setVerMovs(false); setDot(0); setAbierto(true); registrar("tarjeta_abrir", {}); };
    window.addEventListener("dcuates:tarjeta", abre);
    return () => window.removeEventListener("dcuates:tarjeta", abre);
  }, []);
  if (!abierto) return null;

  const { id: perfilId, tema } = temaDe(tarjeta && tarjeta.perfil, tarjeta && tarjeta.numero);
  const vars = { "--c1": tema.c1, "--c2": tema.c2, "--f1": tema.f1, "--f2": tema.f2 };
  const premios = (tarjeta && tarjeta.premios) || [];
  const puntos = tarjeta ? tarjeta.puntos : 0;
  const siguiente = premios.find((p) => p.p > puntos);
  const canjeables = premios.filter((p) => p.p <= puntos).length;
  const pct = !premios.length ? 0 : siguiente ? Math.max(4, Math.min(100, Math.round((puntos / siguiente.p) * 100))) : 100;
  const lema = tema.lemas[Math.min(prefs.lema || 0, tema.lemas.length - 1)] || tema.lemas[0];
  const nombre = (prefs.nombre || (tarjeta && tarjeta.nombre) || "Cuate").slice(0, MAXNOM);
  const desde = tarjeta ? desdeTexto(tarjeta.desde) : "";
  const alScroll = (e) => { const el = e.currentTarget, w = (el.firstChild && el.firstChild.getBoundingClientRect().width) || 150; setDot(Math.max(0, Math.min(premios.length - 1, Math.round(el.scrollLeft / (w + 10))))); };

  return createPortal(
    <div className="tj-fondo" style={{ ...(tarjeta ? vars : { "--c1": "#7a2e00", "--c2": NARANJA_CLUB, "--f1": "#FFF3E6", "--f2": "#FFD3A8" }), ...(oculta ? { display: "none" } : {}) }} role="dialog" aria-modal="true" aria-label="Mi tarjeta Cuate">
      <style>{CSS}</style>
      <div className="tj-wrap">
        <button type="button" className="tj-volver" onClick={cerrar} aria-label="Cerrar mi tarjeta">← Volver al sitio</button>
        {cargando && !tarjeta && <p className="tj-carga" role="status">Abriendo tu tarjeta…</p>}
        {!tarjeta && !cargando && <Acceso entrar={entrar} aviso={aviso} cerrar={cerrar} />}
        {tarjeta && (
          <>
            {sinConexion && <p className="tj-offline" role="status">Sin conexión: mostramos lo último que viste. Tus puntos pueden haber cambiado.</p>}
            <header className="tj-cab">
              <img src={rutaLogo("dcuates")} alt="DCUATES.com Comunidad" width="66" height="66" />
              <div><div className="tj-tit">{TARJETA_TITULO}</div><div className="tj-sub">{TARJETA_LEMA}</div></div>
            </header>
            <section className="tj-id" aria-label="Datos del Cuate">
              <Avatar prefs={prefs} tema={tema} />
              <div className="tj-id-d">
                <div className="tj-nom" data-testid="tj-nombre">{nombre}</div>
                <div className="tj-ins"><span aria-hidden="true">{tema.icono}</span> {tema.rotulo}</div>
                <div className="tj-lema">{lema}</div>
              </div>
            </section>
            <p className="tj-num">No. de Cuate <b data-testid="tj-numero">{tarjeta.numero}</b>{desde ? <> · Cuate desde {desde}</> : null}</p>

            <section className="tj-panel" aria-label="Panel de puntos y proyectos">
              <div className="tj-ph"><span>PANEL DE PUNTOS &amp; PROYECTOS</span><button type="button" onClick={() => setCfg(true)} aria-label="Configurar mi tarjeta">⚙️</button></div>
              <div className="tj-pb">
                <div className="tj-pts"><span className="tj-est" aria-hidden="true">✦</span><b data-testid="tj-puntos">{prefs.oculto ? "•••" : puntos}</b> <span>Puntos DCUATES</span></div>
                <div className="tj-barra" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={prefs.oculto ? 0 : pct} aria-label="Avance al próximo premio"><i style={{ width: (prefs.oculto ? 0 : pct) + "%" }} /></div>
                {!prefs.oculto && canjeables > 0 && <p className="tj-ok">🎁 Ya puedes canjear {canjeables} {canjeables === 1 ? "premio" : "premios"}</p>}
                <p className="tj-prox">{!premios.length ? "Pronto habrá premios para canjear" : siguiente ? <>PRÓXIMO PREMIO: <b>{siguiente.p} pts</b></> : "Alcanzaste el nivel más alto de premios"}</p>
              </div>
            </section>

            {premios.length > 0 && (
              <section aria-label="Premios">
                <h3 className="tj-h3">🎁 Canjea tus puntos</h3>
                <div className="tj-car" ref={carr} onScroll={alScroll}>
                  {premios.map((p) => {
                    const alcanza = puntos >= p.p;
                    return (
                      <article key={p.n} className="tj-pr">
                        <div className="tj-pr-i" aria-hidden="true">{iconoPremio(p.n)}</div>
                        <b>{p.n}</b>
                        <small>{p.p} pts</small>
                        {p.d && <em>{p.d}</em>}
                        {alcanza
                          ? <button type="button" className="tj-canje" onClick={() => { registrar("tarjeta_canje", { p: p.p }); window.open(wa(`¡Hola DCUATES! Soy el Cuate ${tarjeta.numero} y quiero canjear «${p.n}» (${p.p} pts).`), "_blank", "noopener"); }}>[ CANJEAR ]</button>
                          : <button type="button" className="tj-canje" disabled>{`[ FALTAN ${p.p - puntos} ]`}</button>}
                      </article>
                    );
                  })}
                </div>
                {premios.length > 1 && <div className="tj-dots" aria-hidden="true">{premios.map((p, i) => <i key={p.n} className={i === dot ? "on" : ""} />)}</div>}
                <p className="tj-sm tj-c">Al tocar «Canjear» se abre WhatsApp con tu mensaje listo; DCUATES te confirma y descuenta los puntos.</p>
              </section>
            )}

            {tarjeta.movs && tarjeta.movs.length > 0 && (
              <section className="tj-movs">
                <button type="button" className="tj-lnk" aria-expanded={verMovs} onClick={() => setVerMovs(!verMovs)}>🧾 Mis movimientos {verMovs ? "▲" : "▼"}</button>
                {verMovs && <ul>{tarjeta.movs.map((m, i) => <li key={i}><span>{m.f}</span><span>{m.c}</span><b className={m.p < 0 ? "neg" : "pos"}>{m.p > 0 ? "+" : ""}{m.p}</b></li>)}</ul>}
              </section>
            )}

            <div className="tj-pie">
              <button type="button" onClick={() => setCfg(true)}>⚙️ Configurar</button>
              <button type="button" onClick={() => { cerrar(); setTimeout(abrirClubInfo, 80); }}>🧡 Mi Club</button>
              <button type="button" onClick={cerrar}>🏠 Sitio</button>
            </div>
            <p className="tj-legal">{TARJETA_LEGAL}</p>
            <div className="tj-silw" data-perfil={perfilId}><Silueta tipo={tema.silueta} /></div>
            {cfg && <Configuracion tarjeta={tarjeta} tema={tema} lemas={tema.lemas} prefs={prefs} guardarPrefs={guardarPrefs} salir={salir} cerrar={() => setCfg(false)} />}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.tj-fondo{position:fixed;inset:0;z-index:97;overflow-y:auto;background:radial-gradient(circle at 92% 6%,rgba(255,255,255,.7),transparent 38%),linear-gradient(180deg,var(--f1),var(--f2));font-family:Nunito,system-ui,sans-serif;color:#0f2d1e;-webkit-overflow-scrolling:touch}
.tj-wrap{max-width:440px;margin:0 auto;padding:8px 12px 0;min-height:100%;position:relative}
.tj-volver{min-height:44px;padding:0 14px;border:0;border-radius:22px;background:rgba(255,255,255,.75);color:var(--c1);font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}
.tj-carga{text-align:center;font-weight:800;margin:40px 0}
.tj-offline{margin:8px 0;padding:8px 10px;border-radius:12px;background:#fff3cd;color:#664d03;font-size:13px;font-weight:800}
.tj-cab{display:flex;align-items:center;gap:10px;margin:8px 0 4px;padding:8px 12px;border-radius:26px;background:rgba(255,255,255,.62)}
.tj-cab img{width:66px;height:66px;border-radius:50%;flex:none}
.tj-tit{font-size:36px;font-weight:900;color:var(--c1);line-height:1;letter-spacing:.01em}
.tj-sub{font-size:16px;font-weight:900;color:#E65100;line-height:1.2}
.tj-id{display:flex;align-items:center;gap:12px;margin:8px 0 2px;padding:12px;border-radius:24px;background:rgba(255,255,255,.7);box-shadow:0 4px 14px rgba(0,0,0,.08)}
.tj-av{flex:none;border-radius:50%;border:4px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.2);overflow:hidden;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,var(--f1),var(--f2))}
.tj-av img{width:100%;height:100%;object-fit:cover}
.tj-id-d{flex:1;min-width:0}
.tj-nom{font-size:24px;font-weight:900;color:var(--c1);line-height:1.1;overflow-wrap:anywhere}
.tj-ins{display:inline-block;margin:6px 0 4px;padding:5px 11px;border-radius:16px;background:var(--c2);color:#fff;font-size:12.5px;font-weight:900;letter-spacing:.02em}
.tj-lema{font-size:14.5px;font-weight:800;font-style:italic;color:var(--c1);line-height:1.25}
.tj-num{margin:6px 2px 8px;text-align:center;font-size:13px;font-weight:800;color:var(--c1)}
.tj-num b{font-family:ui-monospace,Menlo,monospace;font-size:14px;letter-spacing:.06em;background:rgba(255,255,255,.75);padding:2px 8px;border-radius:8px}
.tj-panel{border-radius:20px;overflow:hidden;box-shadow:0 5px 16px rgba(0,0,0,.14);background:#fff}
.tj-ph{display:flex;align-items:center;background:var(--c1);color:#fff;padding:0 4px 0 14px;min-height:46px;font-size:12.5px;font-weight:900;letter-spacing:.03em}
.tj-ph span{flex:1}.tj-ph button{width:46px;height:46px;border:0;background:none;font-size:22px;cursor:pointer;filter:grayscale(1) brightness(3)}
.tj-pb{padding:10px 14px 12px}
.tj-pts{display:flex;align-items:baseline;gap:8px;font-weight:800;font-size:16px}
.tj-pts b{font-size:42px;font-weight:900;line-height:1;color:var(--c1)}
.tj-est{color:#f4b400;font-size:30px}
.tj-barra{height:15px;border-radius:9px;background:#e3e6e4;overflow:hidden;margin:8px 0 6px}
.tj-barra i{display:block;height:100%;border-radius:9px;background:var(--c2);transition:width .6s}
.tj-ok{margin:0 0 4px;font-size:14px;font-weight:900;color:#0e7c4f}
.tj-prox{margin:0;text-align:right;font-size:12.5px;font-weight:800;color:#33443b}
.tj-h3{margin:14px 2px 6px;font-size:16px;font-weight:900;color:var(--c1)}
.tj-car{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;scrollbar-width:none}
.tj-car::-webkit-scrollbar{display:none}
.tj-pr{flex:0 0 150px;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;padding:12px 8px;border-radius:18px;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.1)}
.tj-pr-i{font-size:40px;line-height:1}.tj-pr b{font-size:15px;font-weight:900;line-height:1.15}.tj-pr small{font-weight:800;color:var(--c2);font-size:13px}.tj-pr em{font-style:normal;font-size:11.5px;font-weight:600;color:#4a5b52;line-height:1.25}
.tj-canje{margin-top:auto;min-height:44px;width:100%;border:2px solid var(--c1);border-radius:12px;background:#fff;color:var(--c1);font:inherit;font-weight:900;font-size:13px;letter-spacing:.03em;cursor:pointer}
.tj-canje:disabled{border-color:#c4cbc7;color:#7a8680;cursor:default}
.tj-pr .tj-canje:not(:disabled){background:var(--c1);color:#fff}
.tj-dots{display:flex;justify-content:center;gap:7px;margin:2px 0 4px}.tj-dots i{width:9px;height:9px;border-radius:50%;background:rgba(0,0,0,.2)}.tj-dots i.on{background:var(--c1)}
.tj-sm{margin:4px 2px;font-size:12px;font-weight:700;color:#4a5b52;line-height:1.3}.tj-c{text-align:center}
.tj-movs ul{list-style:none;margin:4px 0 0;padding:8px 10px;border-radius:14px;background:rgba(255,255,255,.8);font-size:13px;font-weight:700}
.tj-movs li{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #e3e6e4}.tj-movs li:last-child{border:0}.tj-movs li span:first-child{color:#5b6b62;min-width:74px}.tj-movs li span:nth-child(2){flex:1}.tj-movs .pos{color:#0e7c4f}.tj-movs .neg{color:#b42318}
.tj-lnk{display:block;width:100%;min-height:44px;margin:4px 0;border:0;background:none;color:var(--c1);font:inherit;font-weight:900;font-size:14.5px;text-decoration:underline;cursor:pointer}
.tj-pie{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 8px}
.tj-pie button{min-height:50px;border:0;border-radius:14px;background:rgba(255,255,255,.85);color:var(--c1);font:inherit;font-weight:900;font-size:13.5px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.1)}
.tj-legal{margin:6px 4px 0;text-align:center;font-size:11.5px;font-weight:700;color:#33443b;line-height:1.3}
.tj-silw{margin:6px -12px 0;height:62px;overflow:hidden;color:var(--c2);opacity:.28}.tj-sil{display:block;width:100%;height:100%;fill:currentColor}
.tj-acc{margin:14px 0;padding:18px 16px;border-radius:24px;background:rgba(255,255,255,.85);text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.1)}
.tj-acc-c{font-size:44px}.tj-acc h2{margin:2px 0 6px;font-size:24px;font-weight:900;color:var(--c1)}.tj-acc p{margin:0 0 10px;font-size:14.5px;font-weight:700;line-height:1.35}
.tj-acc form{display:flex;flex-direction:column;gap:10px;text-align:left}.tj-acc label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:900;color:var(--c1)}
.tj-acc input{min-height:50px;border:2px solid #cbd5e1;border-radius:12px;padding:0 12px;font:inherit;font-size:19px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;background:#fff;color:#0f2d1e}
.tj-acc input:focus,.tj-cfg input:focus{outline:3px solid #ffd84d;border-color:var(--c2)}
.tj-acc form button{min-height:52px;border:0;border-radius:14px;background:var(--c2);color:#fff;font:inherit;font-weight:900;font-size:16px;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.25)}
.tj-acc form button:disabled{opacity:.6}
.tj-err{margin:8px 0 0!important;color:#b42318;font-weight:800!important;font-size:14px!important}
.tj-cfg-f{position:fixed;inset:0;z-index:98;background:rgba(15,25,20,.6);display:flex;align-items:flex-end;justify-content:center}
.tj-cfg{background:#fbf7ec;width:100%;max-width:460px;max-height:92dvh;overflow-y:auto;border-radius:24px 24px 0 0;padding:0 14px 22px}
@media(min-width:640px){.tj-cfg-f{align-items:center}.tj-cfg{border-radius:22px}}
.tj-cfg-h{position:sticky;top:0;z-index:1;display:flex;align-items:center;background:var(--c1);color:#fff;margin:0 -14px 10px;padding:10px 12px 10px 16px;border-radius:24px 24px 0 0}
.tj-cfg-h b{flex:1;font-size:17px;font-weight:900}.tj-cfg-h button{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:var(--c1);font-size:20px;font-weight:900;cursor:pointer}
.tj-fl{display:block;margin:10px 0 4px;font-size:14px;font-weight:900;color:var(--c1)}
.tj-cfg input[type=text],.tj-cfg label input:not([type]){width:100%;box-sizing:border-box;min-height:48px;border:2px solid #cbd5e1;border-radius:12px;padding:0 12px;font:inherit;font-size:17px;font-weight:800;background:#fff;color:#0f2d1e;margin-top:4px}
.tj-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}
.tj-op{aspect-ratio:1;min-height:48px;padding:0;border:2px solid #d6dcd8;border-radius:50%;background:#fff;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:26px;cursor:pointer}
.tj-op img{width:100%;height:100%;object-fit:cover}.tj-op.on{border:3px solid var(--c2);box-shadow:0 0 0 3px #ffd84d}
.tj-foto{border-style:dashed;font-size:22px}.tj-foto small{font-size:10px;font-weight:900;line-height:1}
.tj-lemas{display:flex;flex-direction:column;gap:6px}
.tj-lm{min-height:46px;padding:6px 12px;border:2px solid #d6dcd8;border-radius:12px;background:#fff;text-align:left;font:inherit;font-style:italic;font-weight:800;font-size:14px;color:#0f2d1e;cursor:pointer}
.tj-lm.on{border-color:var(--c2);background:var(--f1)}
.tj-chk{display:flex;align-items:center;gap:10px;min-height:48px;margin-top:8px;font-weight:800;font-size:14.5px}.tj-chk input{width:24px;height:24px;margin:0}
.tj-listo{width:100%;min-height:52px;margin-top:10px;border:0;border-radius:14px;background:var(--c2);color:#fff;font:inherit;font-weight:900;font-size:16px;cursor:pointer}
.tj-salir{width:100%;min-height:46px;margin-top:10px;border:2px solid #b42318;border-radius:14px;background:#fff;color:#b42318;font:inherit;font-weight:900;font-size:13.5px;cursor:pointer}
`;
