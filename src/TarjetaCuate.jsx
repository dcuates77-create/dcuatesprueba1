// PASE DIGITAL DEL CUATE + ZONA CUATES (e64 «tarjeta» → e65 «Pase»). Colores, lemas y avatares: src/datos/tarjeta.js.
// Datos de cada Cuate, premios y el contenido de la Zona CUATES: tu hoja (Cuates, Puntos, Premios y Contenido Club).
// Se abre con el evento dcuates:tarjeta (menú ☰ «Mi Pase Cuate», botón de Inicio, tarjeta del Club, constancia del folio) o con el enlace personal «…/#pase=PIN».
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import { registrar } from "./analitica.js";
import { WHATSAPP_NUMERO } from "./datos/config.js";
import { NARANJA_CLUB } from "./datos/club.js";
import { REGISTROS } from "./datos/registros.js";
import { abrirClubInfo, abrirClubPasos } from "./ClubDcuates.jsx";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { useTarjeta, MENSAJE_TARJETA, MENSAJE_CANJE, ESTADO_CANJE, procesarFoto, procesarFondo, pinDeEnlace, pinGuardado } from "./utilidades/tarjetaHoja.js";
import {
  TARJETA_TITULO, TARJETA_LEMA, TARJETA_LEGAL, TARJETA_PRIVACIDAD_FOTO, AVATARES_LOGO, AVATARES_EMOJI, rutaLogo, temaDe, iconoPremio, desdeTexto,
  TEXTO_CANJEAR, TEXTO_SIGUE_SUMANDO, SECCIONES_CLUB, nombreSeccion, VELOS
} from "./datos/tarjeta.js";

const wa = (t) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(t)}`;
const MAXNOM = 28;
const TABLEROS = ["conoce", "participa", "colabora", "crece"];
const EVENTOS_OK = ["club-info", "consulta-folio"];

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
  const [k, setK] = useState("");
  const [ver, setVer] = useState(false);
  const [msg, setMsg] = useState(aviso || "");
  const [ocupado, setOcupado] = useState(false);
  const enviar = async (e) => {
    e.preventDefault();
    if (ocupado) return;
    setOcupado(true); setMsg("");
    const r = await entrar(k);
    setOcupado(false);
    if (!r.ok) setMsg(MENSAJE_TARJETA[r.motivo] || MENSAJE_TARJETA.red);
    else registrar("tarjeta_entrar", {});
  };
  return (
    <div className="tj-acc">
      <div className="tj-acc-c">💳</div>
      <h2>Mi Pase Cuate</h2>
      <p>Escribe el <b>PIN</b> que te mandó DCUATES por WhatsApp cuando te aprobaron en el Club. Solo la primera vez: después se queda guardado en tu celular.</p>
      <form onSubmit={enviar}>
        <label>Tu PIN
          <span className="tj-pinfila">
            <input name="pin" value={k} onChange={(e) => setK(e.target.value)} placeholder="K7M2QX" maxLength={20} autoCapitalize="characters" autoComplete="current-password" autoCorrect="off" spellCheck={false} aria-label="PIN" type={ver ? "text" : "password"} />
            <button type="button" className="tj-ojo" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar PIN" : "Mostrar PIN"}>{ver ? "🙈" : "👁"}</button>
          </span>
        </label>
        <button type="submit" disabled={ocupado}>{ocupado ? "Revisando…" : "Abrir mi Pase"}</button>
      </form>
      {msg && <p className="tj-err" role="alert">{msg}</p>}
      <button type="button" className="tj-lnk" onClick={() => window.open(wa("¡Hola DCUATES! Ya soy Cuate pero perdí mi PIN. Mi nombre es ___ y mi número de Cuate es ___."), "_blank", "noopener")}>📲 No tengo o perdí mi PIN: pedirlo por WhatsApp</button>
      <button type="button" className="tj-lnk" onClick={() => abrirClubPasos()}>🧡 Aún no soy Cuate: ¿cómo me uno? (3 pasos)</button>
    </div>
  );
}

function Configuracion({ tarjeta, tema, lemas, prefs, guardarPrefs, salir, cerrar }) {
  const [nom, setNom] = useState(prefs.nombre || "");
  const [err, setErr] = useState("");
  const [seguro, setSeguro] = useState(false);
  const [verPin, setVerPin] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const archivo = useRef(null);
  const archivoFondo = useRef(null);
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
  const fondo = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setErr("");
    const d = await procesarFondo(f);
    if (!d) { setErr("No pude usar esa imagen. Prueba con otra foto."); return; }
    if (!guardarPrefs({ fondo: d, velo: prefs.velo || "medio" })) aviso();
  };
  const pin = pinGuardado();
  const copiar = async () => { try { await navigator.clipboard.writeText(pin); setCopiado(true); setTimeout(() => setCopiado(false), 1800); } catch (e) { setVerPin(true); } };
  return (
    <div className="tj-cfg-f" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <div className="tj-cfg" role="dialog" aria-modal="true" aria-label="Configurar mi Pase">
        <div className="tj-cfg-h"><b>⚙️ Mi Pase</b><button type="button" onClick={cerrar} aria-label="Cerrar configuración">✕</button></div>
        <label className="tj-fl">Nombre en el Pase
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

        <p className="tj-fl">Fondo de mi Pase</p>
        <div className="tj-fondos">
          <button type="button" className="tj-bt" onClick={() => archivoFondo.current && archivoFondo.current.click()} aria-label="Elegir una foto de fondo">🖼️ {prefs.fondo ? "Cambiar foto de fondo" : "Elegir foto de fondo"}</button>
          {prefs.fondo && <button type="button" className="tj-bt tj-bt2" onClick={() => guardarPrefs({ fondo: null, velo: null })}>Quitar fondo</button>}
        </div>
        <input ref={archivoFondo} type="file" accept="image/*" hidden onChange={fondo} data-testid="tj-archivo-fondo" />
        {prefs.fondo && (
          <div className="tj-velos" role="radiogroup" aria-label="Claridad del fondo">
            <span>Claridad:</span>
            {VELOS.map((v) => <button type="button" key={v.id} role="radio" aria-checked={(prefs.velo || "medio") === v.id} className={(prefs.velo || "medio") === v.id ? "on" : ""} onClick={() => guardarPrefs({ velo: v.id })}>{v.t}</button>)}
          </div>
        )}
        <p className="tj-sm">Usa una foto que te guste; el Pase le pone un velo claro para que el texto se lea. También se queda solo en tu celular.</p>

        <p className="tj-fl">Tu lema</p>
        <div className="tj-lemas" role="radiogroup" aria-label="Lema">
          {lemas.map((l, i) => <button type="button" key={l} role="radio" aria-checked={(prefs.lema || 0) === i} className={"tj-lm" + ((prefs.lema || 0) === i ? " on" : "")} onClick={() => guardarPrefs({ lema: i })}>{l}</button>)}
        </div>

        <label className="tj-chk"><input type="checkbox" checked={!!prefs.oculto} onChange={(e) => guardarPrefs({ oculto: e.target.checked })} /> Ocultar mis puntos en pantalla</label>

        {pin && (
          <>
            <p className="tj-fl">Mi PIN</p>
            <div className="tj-pinbox">
              <b data-testid="tj-pin">{verPin ? pin : "••••••"}</b>
              <button type="button" onClick={() => setVerPin(!verPin)} aria-label={verPin ? "Ocultar mi PIN" : "Ver mi PIN"}>{verPin ? "🙈" : "👁"}</button>
              <button type="button" onClick={copiar} aria-label="Copiar mi PIN">{copiado ? "✅" : "📋"}</button>
            </div>
            <p className="tj-sm">Anótalo en un lugar seguro por si cambias de celular. No lo compartas.</p>
          </>
        )}
        {err && <p className="tj-err" role="alert">{err}</p>}
        <button type="button" className="tj-listo" onClick={() => { if (nom.trim() !== (prefs.nombre || "")) guardarPrefs({ nombre: nom.trim() }); cerrar(); }}>Listo</button>
        <button type="button" className="tj-salir" onClick={() => { if (!seguro) { setSeguro(true); return; } salir(); cerrar(); }}>{seguro ? "¿Seguro? Toca otra vez para salir de este celular" : "Salir de este celular"}</button>
        <p className="tj-sm">Al salir se borran tu PIN, tu foto, tu fondo y tus gustos de este celular. Para volver a entrar necesitas tu PIN (o tu enlace personal).</p>
      </div>
    </div>
  );
}

// Una tarjeta de la Zona CUATES (viene de la hoja)
function ItemClub({ it, ir }) {
  const accion = it.a || it.e;
  const lista = !it.t;
  if (lista) return <li className="tj-it-l"><span aria-hidden="true">{it.ic || "✅"}</span><span>{it.x}</span></li>;
  return (
    <article className="tj-it">
      <div className="tj-it-i" aria-hidden="true">{it.ic || "✨"}</div>
      <div className="tj-it-c">
        <b>{it.t}</b>
        {it.x && <p>{it.x}</p>}
        {accion && <button type="button" onClick={() => ir(it)}>Abrir ›</button>}
      </div>
    </article>
  );
}

export default function TarjetaCuate({ onAbrirProyecto }) {
  const [abierto, setAbierto] = useState(false);
  const [cfg, setCfg] = useState(false);
  const [dot, setDot] = useState(0);
  const [verMovs, setVerMovs] = useState(false);
  const [vista, setVista] = useState("pase");
  const [entrando, setEntrando] = useState(false);
  const [avisoEnlace, setAvisoEnlace] = useState("");
  const [conf, setConf] = useState(null);      // premio que se va a pedir (ventana de confirmación)
  const [canjeando, setCanjeando] = useState(false);
  const [resCanje, setResCanje] = useState(null); // { ok, premio, folio } o { ok:false, mensaje }
  const carr = useRef(null);
  const premiosRef = useRef(null);
  const pinEntrante = useRef("");
  const cerrar = () => { setAbierto(false); setCfg(false); };
  const oculta = useAtras(abierto, cerrar, { hub: true });
  const { tarjeta, cargando, sinConexion, aviso, prefs, entrar, salir, guardarPrefs, canjear } = useTarjeta(abierto);

  useEffect(() => {
    const abre = () => { setCfg(false); setVerMovs(false); setDot(0); setVista("pase"); setAvisoEnlace(""); setConf(null); setResCanje(null); setAbierto(true); registrar("tarjeta_abrir", {}); };
    // Enlace personal: «…/#pase=PIN». Se guarda el PIN y se quita del enlace.
    const alEnlace = () => {
      const p = pinDeEnlace();
      if (!p) return;
      try { history.replaceState(history.state, "", location.pathname + location.search); } catch (e) { /* nada */ }
      pinEntrante.current = p;
      abre();
    };
    alEnlace();
    window.addEventListener("dcuates:tarjeta", abre);
    window.addEventListener("hashchange", alEnlace);
    return () => { window.removeEventListener("dcuates:tarjeta", abre); window.removeEventListener("hashchange", alEnlace); };
  }, []);

  // Si llegó con enlace personal, entra solo con ese PIN (aunque ya hubiera otro guardado).
  useEffect(() => {
    if (!abierto || !pinEntrante.current) return;
    const p = pinEntrante.current; pinEntrante.current = "";
    let vivo = true;
    setEntrando(true);
    (async () => {
      const r = await entrar(p);
      if (!vivo) return;
      setEntrando(false);
      if (r.ok) registrar("tarjeta_enlace", {}); else setAvisoEnlace(MENSAJE_TARJETA[r.motivo] || MENSAJE_TARJETA.red);
    })();
    return () => { vivo = false; };
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!abierto) return null;

  const { id: perfilId, tema } = temaDe(tarjeta && tarjeta.perfil, tarjeta && tarjeta.numero);
  const vars = { "--c1": tema.c1, "--c2": tema.c2, "--f1": tema.f1, "--f2": tema.f2 };
  const premios = (tarjeta && tarjeta.premios) || [];
  const puntos = tarjeta ? tarjeta.puntos : 0;
  const apartados = tarjeta ? Number(tarjeta.comprometidos) || 0 : 0;   // puntos de canjes pedidos y aún no entregados
  const disp = Math.max(0, puntos - apartados);
  const canjes = (tarjeta && tarjeta.canjes) || [];
  const enProceso = (n) => canjes.some((c) => c.n === n && (c.e === "pendiente" || c.e === "listo"));
  const siguiente = premios.find((p) => p.p > disp);
  const canjeables = premios.filter((p) => p.p <= disp && p.x !== 0 && p.l !== 0 && !enProceso(p.n)).length;
  const pct = !premios.length ? 0 : siguiente ? Math.max(4, Math.min(100, Math.round((disp / siguiente.p) * 100))) : 100;
  const pedir = async () => {
    if (!conf || canjeando) return;
    setCanjeando(true);
    const r = await canjear(conf.n);
    setCanjeando(false);
    registrar("canje_pedir", { ok: r.ok, m: r.motivo || "" });
    if (r.ok) setResCanje({ ok: true, premio: conf.n, folio: r.canje.f, p: conf.p });
    else setResCanje({ ok: false, premio: conf.n, mensaje: MENSAJE_CANJE[r.motivo] || MENSAJE_CANJE.red });
    setConf(null);
  };
  const lema = tema.lemas[Math.min(prefs.lema || 0, tema.lemas.length - 1)] || tema.lemas[0];
  const nombre = (prefs.nombre || (tarjeta && tarjeta.nombre) || "Cuate").slice(0, MAXNOM);
  const desde = tarjeta ? desdeTexto(tarjeta.desde) : "";
  const alScroll = (e) => { const el = e.currentTarget, w = (el.firstChild && el.firstChild.getBoundingClientRect().width) || 150; setDot(Math.max(0, Math.min(premios.length - 1, Math.round(el.scrollLeft / (w + 10))))); };
  const contenido = (tarjeta && tarjeta.contenido) || [];
  const idsSec = [];
  contenido.forEach((x) => { if (idsSec.indexOf(x.s) < 0) idsSec.push(x.s); });
  const orden = SECCIONES_CLUB.map((s) => s.id).filter((id) => idsSec.indexOf(id) >= 0).concat(idsSec.filter((id) => !SECCIONES_CLUB.some((s) => s.id === id)));
  const vistaOk = vista === "pase" || orden.indexOf(vista) >= 0 ? vista : "pase";
  const velo = (VELOS.find((v) => v.id === (prefs.velo || "medio")) || VELOS[1]).a;

  // Lo que hace el botón «Abrir» de cada elemento de la Zona CUATES (el destino lo escribes en la hoja, columna «Abre» o «Enlace»)
  const ir = (it) => {
    registrar("zona_cuates_abrir", { s: it.s });
    const a = String(it.a || "");
    const [tipo, ...resto] = a.split(":"); const val = resto.join(":").trim();
    if (tipo === "proyecto" && val && onAbrirProyecto) { onAbrirProyecto(val); return; }
    if (tipo === "registro" && REGISTROS[val]) { abrirRegistroPrevio(val); return; }
    if (tipo === "micro") { window.dispatchEvent(new CustomEvent("dcuates:abrir-micro")); return; }
    if (tipo === "tablero" && TABLEROS.indexOf(val) >= 0) { window.dispatchEvent(new CustomEvent("dcuates:abrir-tablero", { detail: val })); return; }
    if (tipo === "evento" && EVENTOS_OK.indexOf(val) >= 0) { window.dispatchEvent(new CustomEvent("dcuates:" + val)); return; }
    if (/^https?:\/\//i.test(it.e || "")) window.open(it.e, "_blank", "noopener");
  };

  return createPortal(
    <div className="tj-fondo" style={{ ...(tarjeta ? vars : { "--c1": "#7a2e00", "--c2": NARANJA_CLUB, "--f1": "#FFF3E6", "--f2": "#FFD3A8" }), ...(oculta ? { display: "none" } : {}) }} role="dialog" aria-modal="true" aria-label="Mi Pase Cuate">
      <style>{CSS}</style>
      {tarjeta && prefs.fondo && <><div className="tj-bg" data-testid="tj-bg" style={{ backgroundImage: `url(${prefs.fondo})` }} /><div className="tj-velo" style={{ background: `rgba(255,255,255,${velo})` }} /></>}
      <div className="tj-scroll">
        <div className="tj-wrap">
          <button type="button" className="tj-volver" onClick={cerrar} aria-label="Cerrar mi Pase">← Volver al sitio</button>
          {(cargando || entrando) && !tarjeta && <p className="tj-carga" role="status">Abriendo tu Pase…</p>}
          {!tarjeta && !cargando && !entrando && <Acceso entrar={entrar} aviso={avisoEnlace || aviso} cerrar={cerrar} />}
          {tarjeta && (
            <>
              {sinConexion && <p className="tj-offline" role="status">Sin conexión: mostramos lo último que viste. Tus puntos pueden haber cambiado.</p>}
              <header className="tj-cab">
                <img src={rutaLogo("dcuates")} alt="DCUATES.com Comunidad" width="66" height="66" />
                <div><div className="tj-tit">{TARJETA_TITULO}</div><div className="tj-sub">{TARJETA_LEMA}</div></div>
              </header>
              <div className="tj-tabs" role="tablist" aria-label="Zona CUATES">
                <button type="button" role="tab" aria-selected={vistaOk === "pase"} className={vistaOk === "pase" ? "on" : ""} onClick={() => setVista("pase")}>💳 Mi Pase</button>
                {orden.map((id) => { const n = nombreSeccion(id); return <button type="button" role="tab" key={id} aria-selected={vistaOk === id} className={vistaOk === id ? "on" : ""} onClick={() => { setVista(id); registrar("zona_cuates_tab", { s: id }); }}>{n.ic} {n.t}</button>; })}
              </div>

              {vistaOk === "pase" && (
                <>
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
                    <div className="tj-ph"><span>PANEL DE PUNTOS &amp; PROYECTOS</span><button type="button" onClick={() => setCfg(true)} aria-label="Configurar mi Pase">⚙️</button></div>
                    <div className="tj-pb">
                      <div className="tj-pts"><span className="tj-est" aria-hidden="true">✦</span><b data-testid="tj-puntos">{prefs.oculto ? "•••" : puntos}</b> <span>Puntos DCUATES</span></div>
                      {!prefs.oculto && apartados > 0 && <p className="tj-apart" data-testid="tj-apartados">🕓 {apartados} pts apartados en canjes por entregar · Disponibles: <b>{disp}</b></p>}
                      <div className="tj-barra" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={prefs.oculto ? 0 : pct} aria-label="Avance al próximo premio"><i style={{ width: (prefs.oculto ? 0 : pct) + "%" }} /></div>
                      {!prefs.oculto && canjeables > 0 && <button type="button" className="tj-ok" onClick={() => premiosRef.current && premiosRef.current.scrollIntoView({ behavior: "smooth", block: "start" })}>🎁 {TEXTO_CANJEAR}</button>}
                      <p className="tj-prox">{!premios.length ? "Pronto habrá premios para canjear" : siguiente ? <>PRÓXIMO PREMIO: <b>{siguiente.p} pts</b></> : TEXTO_SIGUE_SUMANDO}</p>
                    </div>
                  </section>

                  {premios.length > 0 && (
                    <section aria-label="Premios" ref={premiosRef}>
                      <h3 className="tj-h3">🎁 Canjea tus puntos</h3>
                      <div className="tj-car" ref={carr} onScroll={alScroll}>
                        {premios.map((p) => {
                          const alcanza = disp >= p.p, proceso = enProceso(p.n);
                          const estado = proceso ? "EN PROCESO" : p.x === 0 ? "AGOTADO" : p.l === 0 ? "YA LO CANJEASTE" : "";
                          return (
                            <article key={p.n} className="tj-pr">
                              <div className="tj-pr-i" aria-hidden="true">{iconoPremio(p.n)}</div>
                              <b>{p.n}</b>
                              <small>{p.p} pts</small>
                              {p.d && <em>{p.d}</em>}
                              {p.x !== null && p.x !== undefined && p.x > 0 && p.x <= 10 && <em className="tj-quedan">Quedan {p.x}</em>}
                              {estado
                                ? <button type="button" className="tj-canje" disabled>{`[ ${estado} ]`}</button>
                                : alcanza
                                  ? <button type="button" className="tj-canje" onClick={() => { setResCanje(null); setConf(p); }}>[ CANJEAR ]</button>
                                  : <button type="button" className="tj-canje" disabled>{`[ FALTAN ${p.p - disp} ]`}</button>}
                            </article>
                          );
                        })}
                      </div>
                      {premios.length > 1 && <div className="tj-dots" aria-hidden="true">{premios.map((p, i) => <i key={p.n} className={i === dot ? "on" : ""} />)}</div>}
                      {resCanje && resCanje.ok && (
                        <div className="tj-res tj-res-ok" role="status" data-testid="tj-canje-ok">
                          <b>✅ ¡Listo! Pediste «{resCanje.premio}»</b>
                          <p>Tu canje es el <b>{resCanje.folio}</b>. Te avisamos cuando esté listo para entregarse; tus {resCanje.p} puntos se descuentan hasta ese momento.</p>
                          <button type="button" onClick={() => window.open(wa(`¡Hola DCUATES! Soy el Cuate ${tarjeta.numero}. Pedí el canje ${resCanje.folio}: «${resCanje.premio}».`), "_blank", "noopener")}>📲 Avisar también por WhatsApp (opcional)</button>
                        </div>
                      )}
                      {resCanje && !resCanje.ok && <p className="tj-err" role="alert" data-testid="tj-canje-err">{resCanje.mensaje}</p>}
                      <p className="tj-sm tj-c">Al pedir un premio, tus puntos quedan apartados; DCUATES te avisa y los descuenta cuando te lo entrega. Los puntos no caducan.</p>
                    </section>
                  )}

                  {canjes.length > 0 && (
                    <section className="tj-canjes" aria-label="Mis canjes">
                      <h3 className="tj-h3">📦 Mis canjes</h3>
                      <ul>
                        {canjes.map((c) => { const e = ESTADO_CANJE[c.e] || ESTADO_CANJE.pendiente; return (
                          <li key={c.f} className={"tj-cj tj-cj-" + c.e}><span aria-hidden="true">{e.ic}</span><span><b>{c.n}</b><small>{c.f} · {c.p} pts · {e.t}{c.e === "entregado" && c.g ? " el " + c.g : ""}</small></span></li>
                        ); })}
                      </ul>
                    </section>
                  )}

                  {tarjeta.movs && tarjeta.movs.length > 0 && (
                    <section className="tj-movs">
                      <button type="button" className="tj-lnk" aria-expanded={verMovs} onClick={() => setVerMovs(!verMovs)}>🧾 Mis movimientos {verMovs ? "▲" : "▼"}</button>
                      {verMovs && <ul>{tarjeta.movs.map((m, i) => <li key={i}><span>{m.f}</span><span>{m.c}</span><b className={m.p < 0 ? "neg" : "pos"}>{m.p > 0 ? "+" : ""}{m.p}</b></li>)}</ul>}
                    </section>
                  )}
                </>
              )}

              {vistaOk !== "pase" && (
                <section className="tj-zona" aria-label={nombreSeccion(vistaOk).t}>
                  <h3 className="tj-h3">{nombreSeccion(vistaOk).ic} {nombreSeccion(vistaOk).t}</h3>
                  {contenido.filter((x) => x.s === vistaOk && !x.t).length > 0 && <ul className="tj-lista">{contenido.filter((x) => x.s === vistaOk && !x.t).map((x, i) => <ItemClub key={"l" + i} it={x} ir={ir} />)}</ul>}
                  {contenido.filter((x) => x.s === vistaOk && x.t).map((x, i) => <ItemClub key={"c" + i} it={x} ir={ir} />)}
                </section>
              )}

              <div className="tj-pie">
                <button type="button" onClick={() => setCfg(true)}>⚙️ Configurar</button>
                <button type="button" onClick={() => { cerrar(); setTimeout(abrirClubInfo, 80); }}>🧡 Mi Club</button>
                <button type="button" onClick={cerrar}>🏠 Sitio</button>
              </div>
              <p className="tj-legal">{TARJETA_LEGAL}</p>
              <div className="tj-silw" data-perfil={perfilId}><Silueta tipo={tema.silueta} /></div>
              {conf && (
                <div className="tj-cfg-f" onClick={(e) => { if (e.target === e.currentTarget && !canjeando) setConf(null); }}>
                  <div className="tj-cfg" role="dialog" aria-modal="true" aria-label="Confirmar canje" data-testid="tj-confirmar">
                    <div className="tj-cfg-h"><b>🎁 Pedir mi premio</b><button type="button" onClick={() => !canjeando && setConf(null)} aria-label="Cancelar">✕</button></div>
                    <p className="tj-conf-t">«{conf.n}»</p>
                    <p className="tj-sm">Costo: <b>{conf.p} puntos</b>. Tienes {disp} disponibles.</p>
                    <p className="tj-sm">No se descuentan ahora: se descuentan cuando te lo entreguemos. Mientras tanto quedan apartados y no puedes gastarlos en otro premio.</p>
                    <button type="button" className="tj-listo" onClick={pedir} disabled={canjeando}>{canjeando ? "Enviando…" : "Sí, pedir este premio"}</button>
                    <button type="button" className="tj-salir" onClick={() => setConf(null)} disabled={canjeando}>Ahora no</button>
                  </div>
                </div>
              )}
              {cfg && <Configuracion tarjeta={tarjeta} tema={tema} lemas={tema.lemas} prefs={prefs} guardarPrefs={guardarPrefs} salir={salir} cerrar={() => setCfg(false)} />}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

const CSS = `
.tj-fondo{position:fixed;inset:0;z-index:97;overflow:hidden;background:radial-gradient(circle at 92% 6%,rgba(255,255,255,.7),transparent 38%),linear-gradient(180deg,var(--f1),var(--f2));font-family:Nunito,system-ui,sans-serif;color:#0f2d1e}
.tj-bg{position:absolute;inset:0;background-size:cover;background-position:center}
.tj-velo{position:absolute;inset:0}
.tj-scroll{position:absolute;inset:0;overflow-y:auto;-webkit-overflow-scrolling:touch}
.tj-wrap{max-width:440px;margin:0 auto;padding:8px 12px 0;min-height:100%;position:relative}
.tj-volver{min-height:44px;padding:0 14px;border:0;border-radius:22px;background:rgba(255,255,255,.75);color:var(--c1);font:inherit;font-weight:900;font-size:14.5px;cursor:pointer}
.tj-carga{text-align:center;font-weight:800;margin:40px 0}
.tj-offline{margin:8px 0;padding:8px 10px;border-radius:12px;background:#fff3cd;color:#664d03;font-size:13px;font-weight:800}
.tj-cab{display:flex;align-items:center;gap:10px;margin:8px 0 4px;padding:8px 12px;border-radius:26px;background:rgba(255,255,255,.62)}
.tj-cab img{width:66px;height:66px;border-radius:50%;flex:none}
.tj-tit{font-size:36px;font-weight:900;color:var(--c1);line-height:1;letter-spacing:.01em}
.tj-sub{font-size:16px;font-weight:900;color:#E65100;line-height:1.2}
.tj-tabs{display:flex;gap:6px;overflow-x:auto;padding:4px 0 6px;scrollbar-width:none}
.tj-tabs::-webkit-scrollbar{display:none}
.tj-tabs button{flex:none;min-height:44px;padding:0 13px;border:2px solid var(--c1);border-radius:22px;background:rgba(255,255,255,.8);color:var(--c1);font:inherit;font-weight:900;font-size:13.5px;cursor:pointer;white-space:nowrap}
.tj-tabs button.on{background:var(--c1);color:#fff}
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
.tj-ok{display:block;width:100%;min-height:44px;margin:0 0 4px;padding:6px 8px;border:2px solid #0e7c4f;border-radius:12px;background:#e8f6ee;font:inherit;font-size:14px;font-weight:900;color:#0e7c4f;text-align:left;cursor:pointer}
.tj-prox{margin:0;text-align:right;font-size:12.5px;font-weight:800;color:#33443b}
.tj-h3{margin:14px 2px 6px;font-size:16px;font-weight:900;color:var(--c1)}
.tj-car{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;scrollbar-width:none}
.tj-car::-webkit-scrollbar{display:none}
.tj-pr{flex:0 0 150px;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;padding:12px 8px;border-radius:18px;background:#fff;box-shadow:0 3px 10px rgba(0,0,0,.1)}
.tj-pr-i{font-size:40px;line-height:1}.tj-pr b{font-size:15px;font-weight:900;line-height:1.15}.tj-pr small{font-weight:800;color:var(--c2);font-size:13px}.tj-pr em{font-style:normal;font-size:11.5px;font-weight:600;color:#4a5b52;line-height:1.25}
.tj-apart{margin:4px 0 2px;font-size:13px;font-weight:800;color:#7a4a00;background:#fff3cd;border-radius:10px;padding:5px 9px}
.tj-quedan{color:#b42318!important;font-weight:800!important}
.tj-res{margin:8px 0;padding:10px 12px;border-radius:14px;font-size:13.5px;font-weight:700;line-height:1.35}
.tj-res-ok{background:#e8f6ee;border:2px solid #0e7c4f;color:#0f2d1e}.tj-res>b{display:block;font-size:15px}.tj-res p{margin:4px 0 6px}.tj-res p b{display:inline;font-size:inherit}
.tj-res button{min-height:44px;width:100%;border:2px solid #0e7c4f;border-radius:12px;background:#fff;color:#0e7c4f;font:inherit;font-weight:900;font-size:13.5px;cursor:pointer}
.tj-conf-t{margin:8px 2px 2px;font-size:20px;font-weight:900;color:var(--c1);text-align:center}
.tj-canjes ul{list-style:none;margin:0 0 6px;padding:0}
.tj-cj{display:flex;gap:10px;align-items:flex-start;margin:0 0 6px;padding:9px 11px;border-radius:14px;background:rgba(255,255,255,.88);box-shadow:0 2px 8px rgba(0,0,0,.08)}
.tj-cj>span:first-child{font-size:22px;flex:none}.tj-cj b{display:block;font-size:14.5px;font-weight:900;line-height:1.2}.tj-cj small{display:block;font-size:12px;font-weight:700;color:#4a5b52}
.tj-cj-cancelado{opacity:.65}
.tj-canje{margin-top:auto;min-height:44px;width:100%;border:2px solid var(--c1);border-radius:12px;background:#fff;color:var(--c1);font:inherit;font-weight:900;font-size:13px;letter-spacing:.03em;cursor:pointer}
.tj-canje:disabled{border-color:#c4cbc7;color:#7a8680;cursor:default}
.tj-pr .tj-canje:not(:disabled){background:var(--c1);color:#fff}
.tj-dots{display:flex;justify-content:center;gap:7px;margin:2px 0 4px}.tj-dots i{width:9px;height:9px;border-radius:50%;background:rgba(0,0,0,.2)}.tj-dots i.on{background:var(--c1)}
.tj-sm{margin:4px 2px;font-size:12px;font-weight:700;color:#4a5b52;line-height:1.3}.tj-c{text-align:center}
.tj-movs ul{list-style:none;margin:4px 0 0;padding:8px 10px;border-radius:14px;background:rgba(255,255,255,.8);font-size:13px;font-weight:700}
.tj-movs li{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #e3e6e4}.tj-movs li:last-child{border:0}.tj-movs li span:first-child{color:#5b6b62;min-width:74px}.tj-movs li span:nth-child(2){flex:1}.tj-movs .pos{color:#0e7c4f}.tj-movs .neg{color:#b42318}
.tj-zona{margin:4px 0}
.tj-lista{list-style:none;margin:0 0 8px;padding:10px 12px;border-radius:18px;background:rgba(255,255,255,.88);box-shadow:0 3px 10px rgba(0,0,0,.08)}
.tj-it-l{display:flex;gap:8px;padding:6px 0;font-size:14.5px;font-weight:700;line-height:1.3}.tj-it-l span:first-child{flex:none}
.tj-it{display:flex;gap:10px;align-items:flex-start;margin:0 0 8px;padding:12px;border-radius:18px;background:rgba(255,255,255,.9);box-shadow:0 3px 10px rgba(0,0,0,.1)}
.tj-it-i{flex:none;width:46px;height:46px;border-radius:50%;background:linear-gradient(145deg,var(--f1),var(--f2));display:flex;align-items:center;justify-content:center;font-size:24px}
.tj-it-c{flex:1;min-width:0}.tj-it-c b{display:block;font-size:15.5px;font-weight:900;color:var(--c1);line-height:1.2}.tj-it-c p{margin:3px 0 0;font-size:13.5px;font-weight:600;line-height:1.3;color:#33443b}
.tj-it-c button{margin-top:6px;min-height:44px;padding:0 16px;border:0;border-radius:12px;background:var(--c2);color:#fff;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.tj-lnk{display:block;width:100%;min-height:44px;margin:4px 0;border:0;background:none;color:var(--c1);font:inherit;font-weight:900;font-size:14.5px;text-decoration:underline;cursor:pointer}
.tj-pie{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 8px}
.tj-pie button{min-height:50px;border:0;border-radius:14px;background:rgba(255,255,255,.85);color:var(--c1);font:inherit;font-weight:900;font-size:13.5px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.1)}
.tj-legal{margin:6px 4px 0;text-align:center;font-size:11.5px;font-weight:700;color:#33443b;line-height:1.3}
.tj-silw{margin:6px -12px 0;height:62px;overflow:hidden;color:var(--c2);opacity:.28}.tj-sil{display:block;width:100%;height:100%;fill:currentColor}
.tj-acc{margin:14px 0;padding:18px 16px;border-radius:24px;background:rgba(255,255,255,.85);text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.1)}
.tj-acc-c{font-size:44px}.tj-acc h2{margin:2px 0 6px;font-size:24px;font-weight:900;color:var(--c1)}.tj-acc p{margin:0 0 10px;font-size:14.5px;font-weight:700;line-height:1.35}
.tj-acc form{display:flex;flex-direction:column;gap:10px;text-align:left}.tj-acc label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:900;color:var(--c1)}
.tj-pinfila{display:flex;gap:6px}.tj-pinfila input{flex:1;min-width:0}.tj-ojo{flex:none;width:52px;min-height:50px;border:2px solid #cbd5e1;border-radius:12px;background:#fff;font-size:22px;cursor:pointer}
.tj-acc input{min-height:50px;border:2px solid #cbd5e1;border-radius:12px;padding:0 12px;font:inherit;font-size:19px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;background:#fff;color:#0f2d1e}
.tj-acc input:focus,.tj-cfg input:focus{outline:3px solid #ffd84d;border-color:var(--c2)}
.tj-acc form > button{min-height:52px;border:0;border-radius:14px;background:var(--c2);color:#fff;font:inherit;font-weight:900;font-size:16px;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.25)}
.tj-acc form > button:disabled{opacity:.6}
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
.tj-fondos{display:flex;flex-wrap:wrap;gap:8px}
.tj-bt{min-height:48px;padding:0 14px;border:2px solid var(--c2);border-radius:14px;background:#fff;color:var(--c1);font:inherit;font-weight:900;font-size:14px;cursor:pointer}.tj-bt2{border-color:#b9c2bd;color:#4a5b52}
.tj-velos{display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap;font-weight:800;font-size:13.5px}
.tj-velos button{min-height:44px;padding:0 14px;border:2px solid #d6dcd8;border-radius:22px;background:#fff;font:inherit;font-weight:900;font-size:13.5px;cursor:pointer}.tj-velos button.on{border-color:var(--c2);background:var(--f1)}
.tj-lemas{display:flex;flex-direction:column;gap:6px}
.tj-lm{min-height:46px;padding:6px 12px;border:2px solid #d6dcd8;border-radius:12px;background:#fff;text-align:left;font:inherit;font-style:italic;font-weight:800;font-size:14px;color:#0f2d1e;cursor:pointer}
.tj-lm.on{border-color:var(--c2);background:var(--f1)}
.tj-chk{display:flex;align-items:center;gap:10px;min-height:48px;margin-top:8px;font-weight:800;font-size:14.5px}.tj-chk input{width:24px;height:24px;margin:0}
.tj-pinbox{display:flex;align-items:center;gap:8px}.tj-pinbox b{flex:1;font-family:ui-monospace,Menlo,monospace;font-size:20px;letter-spacing:.14em;padding:10px 12px;border-radius:12px;background:#fff;border:2px solid #d6dcd8}
.tj-pinbox button{width:48px;min-height:48px;border:2px solid #d6dcd8;border-radius:12px;background:#fff;font-size:20px;cursor:pointer}
.tj-listo{width:100%;min-height:52px;margin-top:10px;border:0;border-radius:14px;background:var(--c2);color:#fff;font:inherit;font-weight:900;font-size:16px;cursor:pointer}
.tj-salir{width:100%;min-height:46px;margin-top:10px;border:2px solid #b42318;border-radius:14px;background:#fff;color:#b42318;font:inherit;font-weight:900;font-size:13.5px;cursor:pointer}
`;
