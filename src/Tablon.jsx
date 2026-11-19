// TABLÓN «LO QUE COMPARTIMOS» (e57) — el COMPARTIMOS: lo que la comunidad OFREZCO / NECESITO, adopciones y libros, publicado desde tu hoja.
// Cómo llega algo aquí:
//   1) Alguien lo registra (Ofrezco, Necesito, Ecatepets, Libros) y autoriza publicarlo → cae en la pestaña «Registros» de tu hoja.
//   2) Tú lo revisas y escribes «Sí» en la columna «¿Publicar?» (puedes pulir «Título público» y «Texto público»).
//   3) El Apps Script (doGet ?a=publicados) lo entrega SIN nombre ni teléfono y aparece aquí en minutos.
// Se abre con abrirTablon("Ofrezco") (filtro opcional) o con el evento dcuates:abrir-tablon.
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAtras } from "./atras.js";
import BotonCompartir from "./BotonCompartir.jsx";
import { cargarPublicados } from "./utilidades/hojaPublica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";
import { registrar } from "./analitica.js";
import { ejecutar } from "./datos/secciones.js";
import { CATALOGO_DCUATES, GRUPOS_CATALOGO } from "./datos/catalogoDcuates.js";
import { abrirNegocio } from "./NegocioCuate.jsx";
import { abrirDirectorio } from "./PaginaCuateCTA.jsx";
import { ListaNegocios } from "./PaginaCategoria.jsx";

export const abrirTablon = (filtro = "") => window.dispatchEvent(new CustomEvent("dcuates:abrir-tablon", { detail: filtro }));

const FILTROS = [["", "Todo"], ["Ofrezco", "🎁 Ofrezco"], ["Necesito", "🙏 Necesito"], ["Otros", "🗂️ Catálogo CUATES"], ["Emprendimientos", "🏪 Emprendimientos CUATE"], ["Adopciones", "🐾 Adopciones"], ["Extraviados", "🔎 Extraviados"], ["Libros", "📚 Libros"], ["Recomendaciones", "⭐ Recomendaciones"]];
const COLOR = { Ofrezco: "#1F7A46", Necesito: "#B7791F", Adopciones: "#8a4fbf", Extraviados: "#C2410C", Libros: "#1B6F8A", Emprendimientos: "#0B6E66", Recomendaciones: "#B45309", Otros: "#5b4bb5" };
// «Otros»: lo que ofrece la página misma (e59). a = acción de src/datos/secciones.js · f = filtro del tablón
const DE_LA_PAGINA = [
  ["🎮", "Juegos y Semillas", "Juega, aprende y suma Semillas para canjear.", { z: "juegos" }],
  ["📌", "Clasificados y avisos", "Publica o consulta avisos de la comunidad (Agenda).", { plus: 1 }],
  ["⭐", "Recomendaciones públicas", "Lo que la comunidad recomienda, para todo mundo.", null, "Recomendaciones"],
  ["🛍️", "Compra, vende y dona con causa", "Productos y servicios que apoyan una causa.", { z: "causa" }],
  ["🏆", "Gana cupones", "Participa y obtén beneficios.", { z: "gana" }]
];

export function BotonTablon({ filtro = "", texto, sub }) {
  return (
    <>
      <button type="button" className="tb-btn" onClick={() => abrirTablon(filtro)}>
        <span className="tb-btn-e" aria-hidden="true">🧺</span>
        <span className="tb-btn-t"><b>{texto || "LO QUE COMPARTIMOS"}</b><small>{sub || "Lo que la comunidad ofrece y necesita"}</small></span>
      </button>
      <style>{`.tb-btn{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;min-height:58px;padding:8px 14px;border:2px solid #fff;border-radius:16px;background:#B7791F;color:#fff;font-family:inherit;text-align:left;cursor:pointer;box-shadow:0 5px 12px rgba(0,0,0,.25)}.tb-btn:active{filter:brightness(.92)}.tb-btn-e{flex:none;width:34px;height:34px;border-radius:50%;background:#fff;font-size:20px;line-height:34px;text-align:center}.tb-btn-t{display:flex;flex-direction:column}.tb-btn-t b{font-size:17px;font-weight:900;letter-spacing:.04em;color:#fff}.tb-btn-t small{font-size:12.5px;font-weight:700;color:#fff}`}</style>
    </>
  );
}

export default function Tablon() {
  const [abierto, setAbierto] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [items, setItems] = useState(null);
  const [grupo, setGrupo] = useState(-1);
  const [q, setQ] = useState("");
  const [ver, setVer] = useState("");
  const [sub, setSub] = useState("");
  const cerrar = () => setAbierto(false);
  const oculta = useAtras(abierto, cerrar, { hub: true }); // hub: se oculta mientras hay otra ventana encima y reaparece al cerrarla
  useEffect(() => {
    const abre = (e) => { setFiltro(typeof e.detail === "string" ? e.detail : ""); setAbierto(true); registrar("tablon_abierto", {}); };
    window.addEventListener("dcuates:abrir-tablon", abre);
    return () => window.removeEventListener("dcuates:abrir-tablon", abre);
  }, []);
  useEffect(() => { if (abierto && items === null) cargarPublicados().then(setItems); }, [abierto, items]);
  if (!abierto) return null;
  const lista = (items || []).filter((x) => (filtro ? x.sec === filtro : x.sec !== "Muro de gratitud") && (filtro !== "Extraviados" || !sub || x.cat === sub));
  const irPagina = (a) => { cerrar(); setTimeout(() => ejecutar(a), 120); };
  const solicitar = (it) => {
    registrar("catalogo_solicitar", { t: it.t });
    const a = it.a;
    if (a.tablon !== undefined) { setFiltro(a.tablon); return; }
    cerrar();
    setTimeout(() => { if (a.neg) abrirNegocio(a.neg); else if (a.dir) abrirDirectorio(); else ejecutar(a); }, 150);
  };
  const norm = (x) => String(x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = CATALOGO_DCUATES.filter((x) => (grupo < 0 || x.g === grupo) && (!q.trim() || norm(x.t + " " + x.d + " " + x.car.join(" ")).includes(norm(q.trim()))));
  const ofrecer = () => abrirRegistroPrevio("ofrezco");
  const necesitar = () => abrirRegistroPrevio("necesito");
  const meInteresa = (x) => abrirRegistroPrevio("interesa", { valores: { ref: `${x.id} · ${x.t}`.slice(0, 160) } });
  return createPortal(
    <div className="tb-fondo" style={oculta ? { display: "none" } : undefined} role="dialog" aria-modal="true" aria-label="Lo que compartimos" onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}>
      <style>{CSS}</style>
      <div className="tb-caja">
        <div className="tb-cab">
          <b>🧺 Lo que compartimos</b>
          <BotonCompartir hash="lo-que-compartimos" titulo="Lo que compartimos — DCUATES" texto="Lo que la comunidad ofrece y necesita" variante="circulo" />
          <button type="button" className="tb-x" onClick={cerrar} aria-label="Cerrar">✕</button>
        </div>
        <p className="tb-i">Cosas, servicios, ayuda, adopciones y libros que alguien de la comunidad ofrece o necesita. Nadie publica su nombre ni su teléfono: DCUATES hace la conexión.</p>
        <div className="tb-acc">
          <button type="button" onClick={ofrecer}>🎁 OFREZCO algo</button>
          <button type="button" onClick={necesitar}>🙏 NECESITO algo</button>
          <button type="button" className="tb-cb" data-testid="tb-btn-catalogo" onClick={() => setFiltro("Otros")}>🗂️ CATÁLOGO CUATES<small>Todo lo que DCUATES comparte</small></button>
          <button type="button" className="tb-eb" data-testid="tb-btn-emprendimientos" onClick={() => setFiltro("Emprendimientos")}>🏪 EMPRENDIMIENTOS CUATE<small>Emprendimientos de la comunidad</small></button>
          <button type="button" className="tb-rec" onClick={() => abrirRegistroPrevio("recomendar")}>⭐ RECOMIENDO a alguien (pública o privada)</button>
        </div>
        <div className="tb-fil" role="tablist">
          {FILTROS.map(([k, t]) => <button key={k} type="button" role="tab" aria-selected={filtro === k} className={filtro === k ? "on" : ""} onClick={() => setFiltro(k)}>{t}</button>)}
        </div>
        {filtro === "Extraviados" && (
          <div className="tb-ext" data-testid="extraviados-aviso">
            <p className="tb-ea">🚨 <b>Si se trata de una persona, llama primero al 911 o a la Fiscalía.</b> DCUATES solo ayuda a difundir fichas verificadas, sin datos de menores si no hay autorización de su familia.</p>
            <div className="tb-fil" role="group" aria-label="Búsquedas y encontrados">
              {[["", "Todo"], ["Se busca", "🔎 Se busca"], ["Se encontró", "✅ Se encontró"]].map(([k, t]) => <button key={k} type="button" aria-pressed={sub === k} className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{t}</button>)}
            </div>
            <div className="tb-acc">
              <button type="button" className="tb-eb2" data-testid="ext-reportar" onClick={() => abrirRegistroPrevio("extraviado")}>🔎 Reportar un caso</button>
              <button type="button" className="tb-rec" onClick={() => irPagina({ chat: "¡Hola DCUATES! Tengo información o una foto sobre un caso de extraviados: ___" })}>💬 Hablar con DCUATES por WhatsApp</button>
            </div>
          </div>
        )}
        {items === null && <p className="tb-v">Cargando…</p>}
        {items !== null && lista.length === 0 && filtro !== "Otros" && filtro !== "Emprendimientos" && (
          <p className="tb-v">Por ahora no hay publicaciones{filtro ? " en esta sección" : ""}. ¡Sé la primera persona en sumarte: usa OFREZCO o NECESITO!</p>
        )}
        {lista.map((x) => (
          <article key={x.id} className="tb-tarj" style={{ borderLeftColor: COLOR[x.sec] || "#1F7A46" }}>
            {x.img ? <img src={x.img} alt="" loading="lazy" /> : null}
            <p className="tb-et"><span style={{ background: COLOR[x.sec] || "#1F7A46" }}>{x.sec}</span>{x.cat ? <em>{x.cat}</em> : null}</p>
            <h4>{x.t}</h4>
            {x.d ? <p className="tb-d">{x.d}</p> : null}
            {x.vence ? <p className="tb-vc">Vigente hasta {x.vence}</p> : null}
            <button type="button" className="tb-mi" onClick={() => meInteresa(x)}>{x.sec === "Extraviados" ? "📞 Tengo información" : "🙋 Me interesa"}</button>
          </article>
        ))}
        {(filtro === "" || filtro === "Otros") && (
          <div className="tb-otros" data-testid="catalogo-dcuates">
            {filtro === "" && <h3 className="tb-sec">🗂️ Catálogo CUATES</h3>}
            <p className="tb-i">Todo lo que DCUATES comparte y pone a tu disposición, con sus características y cómo solicitarlo.</p>
            <input className="tb-q" type="search" placeholder="Buscar: libros, mascotas, ventas…" aria-label="Buscar en el catálogo" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className="tb-fil" role="tablist" aria-label="Grupos del catálogo">
              {[["-1", "Todo"], ...GRUPOS_CATALOGO.map((g, i) => [String(i), g])].map(([k, t]) => <button key={k} type="button" role="tab" aria-selected={String(grupo) === k} className={String(grupo) === k ? "on" : ""} onClick={() => setGrupo(Number(k))}>{t}</button>)}
            </div>
            {cat.length === 0 && <p className="tb-v">No encontramos nada con esa búsqueda.</p>}
            {cat.map((it) => (
              <article key={it.t} className="tb-cat" data-testid="catalogo-item">
                <h4><span aria-hidden="true">{it.e}</span> {it.t}</h4>
                <p className="tb-cs"><em>{it.costo}</em></p>
                <p className="tb-d">{it.d}</p>
                {ver === it.t && <ul className="tb-car">{it.car.map((c) => <li key={c}>{c}</li>)}</ul>}
                <div className="tb-cr">
                  <button type="button" className="tb-vm" aria-expanded={ver === it.t} onClick={() => setVer(ver === it.t ? "" : it.t)}>{ver === it.t ? "Ocultar detalles" : "Ver características"}</button>
                  <button type="button" className="tb-so" onClick={() => solicitar(it)}>📝 {it.btn}</button>
                </div>
              </article>
            ))}
          </div>
        )}
        {(filtro === "" || filtro === "Emprendimientos") && (
          <div className="tb-otros" data-testid="emprendimientos-tablon">
            {filtro === "" ? <h3 className="tb-sec">🏪 Emprendimientos CUATE</h3> : <p className="tb-i">Emprendimientos de la comunidad (negocios y también proyectos sociales sin fines de lucro). Elige uno para ver su página.</p>}
            <ListaNegocios siempre />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
const CSS = `.tb-ext{margin:8px 0}.tb-ea{margin:0 0 8px;padding:10px 12px;border:2px solid #C2410C;border-radius:12px;background:#FFF1E6;font-size:13.5px;font-weight:700;color:#5a2000;line-height:1.4}.tb-eb2{background:#C2410C!important;color:#fff!important}
.tb-fondo{position:fixed;inset:0;z-index:94;background:rgba(15,25,20,.65);display:flex;align-items:flex-end;justify-content:center;font-family:Nunito,system-ui,sans-serif}
.tb-caja{background:#fbf7ec;width:100%;max-width:560px;max-height:92dvh;overflow-y:auto;overscroll-behavior:contain;border-radius:24px 24px 0 0;padding:0 12px 22px;color:#0f2d1e}
@media(min-width:640px){.tb-fondo{align-items:center}.tb-caja{border-radius:22px;max-height:86dvh}}
.tb-cab{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:8px;background:#B7791F;color:#fff;margin:0 -12px 10px;padding:12px;border-radius:24px 24px 0 0}
.tb-cab b{flex:1;font-size:18px;font-weight:900}
.tb-x{width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#B7791F;font-size:20px;font-weight:900;cursor:pointer}
.tb-i{margin:0 0 8px;font-size:14px;font-weight:700;line-height:1.35}
.tb-acc{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.tb-acc button{min-height:48px;border:0;border-radius:12px;background:#1F7A46;color:#fff;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.tb-acc button:nth-child(2){background:#B7791F}.tb-acc .tb-rec{grid-column:1/-1;background:#B45309}
.tb-acc .tb-cb,.tb-acc .tb-eb{grid-column:1/-1;background:#5b4bb5;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px}.tb-acc .tb-eb{background:#0B6E66}.tb-acc small{font-size:12px;font-weight:700;opacity:.92}
.tb-sec{margin:14px 0 6px;font-size:16px;font-weight:900;color:#5b4bb5}
.tb-fil{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px}
.tb-fil button{flex:none;min-height:40px;padding:0 12px;border:2px solid #0f2d1e;border-radius:20px;background:#fff;font:inherit;font-weight:800;font-size:13px;color:#0f2d1e;cursor:pointer}
.tb-fil button.on{background:#0f2d1e;color:#fff}
.tb-q{width:100%;box-sizing:border-box;min-height:46px;border:2px solid #cfc8b0;border-radius:12px;padding:6px 12px;font:inherit;font-size:15px;font-weight:700;margin:0 0 8px;background:#fff}
.tb-cat{background:#fff;border:1px solid #d8d2bd;border-left:6px solid #1B6F8A;border-radius:12px;padding:10px;margin:0 0 10px}
.tb-cat h4{margin:0 0 2px;font-size:16px;font-weight:900}.tb-cs{margin:0 0 4px}.tb-cs em{font-style:normal;font-size:12px;font-weight:900;background:#E6F2F7;color:#0f4c5c;border-radius:10px;padding:2px 8px}
.tb-car{margin:6px 0;padding-left:20px;font-size:13.5px;font-weight:700;line-height:1.4}
.tb-cr{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.tb-vm{min-height:44px;border:2px solid #1B6F8A;border-radius:12px;background:#fff;color:#1B6F8A;font:inherit;font-weight:900;font-size:14px;cursor:pointer}
.tb-so{min-height:48px;border:0;border-radius:12px;background:#1F7A46;color:#fff;font:inherit;font-weight:900;font-size:15px;cursor:pointer}
.tb-v{text-align:center;font-weight:800;font-size:14px;padding:18px 8px;border:2px dashed #1F7A46;border-radius:14px;background:#eef7f0}
.tb-tarj{background:#fff;border:1px solid #d8d2bd;border-left:6px solid #1F7A46;border-radius:12px;padding:10px;margin:0 0 10px}
.tb-tarj img{width:100%;max-height:170px;object-fit:cover;border-radius:8px;margin-bottom:6px}
.tb-et{margin:0 0 4px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.tb-et span{color:#fff;font-size:11px;font-weight:900;padding:2px 8px;border-radius:10px;text-transform:uppercase}
.tb-et em{font-size:12px;font-weight:800;font-style:normal;color:#4a5b52}
.tb-tarj h4{margin:0 0 4px;font-size:16px;font-weight:900}
.tb-d{margin:0 0 6px;font-size:14px;font-weight:600;line-height:1.35}
.tb-vc{margin:0 0 6px;font-size:12px;font-weight:800;color:#8a5a00}
.tb-otros{display:flex;flex-direction:column;gap:8px;margin:0 0 10px}
.tb-pag{display:flex;gap:10px;align-items:center;text-align:left;min-height:56px;padding:8px 12px;border:2px solid #5b4bb5;border-radius:14px;background:#fff;font:inherit;color:#0f2d1e;cursor:pointer}
.tb-pag>span:first-child{font-size:26px}.tb-pag b{display:block;font-size:15px;font-weight:900}.tb-pag small{display:block;font-size:12.5px;font-weight:700;color:#4a5b52}
.tb-mi{min-height:44px;border:2px solid #1F7A46;border-radius:10px;background:#fff;color:#1F7A46;font:inherit;font-weight:900;padding:0 14px;cursor:pointer}
`;
