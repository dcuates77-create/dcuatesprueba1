// e96 — AGENDA de una Página CUATE: fechas de eventos, talleres, promociones por tiempo limitado, horarios de cita, avisos y cierres.
//  · Las citas se piden SOLO por WhatsApp con un mensaje ya escrito (no se guarda ningún dato de la persona).
//  · «Añadir a mi calendario» baja un archivo .ics (o abre Google Calendar).
//  · Los eventos que el dueño marca «visible» y tú apruebas también salen en la Agenda general de DCUATES (lo hace el script).
import React from "react";
import { VerMas } from "./PerfilCuate.jsx";
import { enlaceOk, enlaceSeguro } from "./BloqueAnuncios.jsx";
import { bajarIcs, enlaceGoogle } from "./utilidades/calendario.js";

const TIPOS = { ev: ["📅", "Evento"], ta: ["🎓", "Taller"], pr: ["🎟️", "Promoción"], ci: ["🕒", "Citas"], av: ["📣", "Aviso"], ce: ["⛔", "Cierre"] };
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const partes = (iso) => { const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null; };
const hora12 = (h) => { const m = String(h || "").match(/^(\d{1,2}):(\d{2})$/); if (!m) return ""; let x = +m[1]; const ap = x >= 12 ? "pm" : "am"; x = x % 12 || 12; return `${x}:${m[2]} ${ap}`; };
export const fechaTexto = (iso) => { const p = partes(iso); if (!p) return ""; const dt = new Date(p.y, p.m, p.d); return `${DIA[dt.getDay()]} ${p.d} de ${MES[p.m]}`; };
const aFecha = (iso, h) => { const p = partes(iso); if (!p) return null; const m = String(h || "").match(/^(\d{1,2}):(\d{2})$/); return m ? new Date(p.y, p.m, p.d, +m[1], +m[2]) : new Date(p.y, p.m, p.d); };
export const eventoIcs = (a, org = "") => {
  const ini = aFecha(a.f, a.h); if (!ini) return null;
  const fin = a.hf ? aFecha(a.f, a.hf) : (a.h ? new Date(ini.getTime() + 3600000) : ini);
  return { id: "neg-" + a.f + "-" + a.t.slice(0, 20), fecha: a.f, titulo: a.t, info: [org ? "Organiza: " + org : "", a.d, a.c].filter(Boolean).join(" · "), lugar: a.l || "", inicio: ini, fin, todoElDia: !a.h };
};
// Mismo formato que la hoja (vista previa del panel):  Tipo ~ Fecha ~ Hora ~ Hora fin ~ Título ~ Detalle ~ Lugar ~ Costo ~ Botón ~ Enlace ~ ¿Visible en DCUATES?
export function leerAgenda(texto, max = 15) {
  const lim = (x, n) => String(x == null ? "" : x).replace(/\s+/g, " ").trim().slice(0, n);
  const sa = (x) => String(x || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const hh = (x) => { const t = String(x || "").trim().toLowerCase(), m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?|am|pm)?$/); if (!m) return ""; let h = +m[1]; const mi = +(m[2] || 0), ap = m[3] ? m[3][0] : ""; if (ap === "p" && h < 12) h += 12; if (ap === "a" && h === 12) h = 0; return h < 24 && mi < 60 ? String(h).padStart(2, "0") + ":" + String(mi).padStart(2, "0") : ""; };
  return String(texto || "").split("|").map((r) => {
    const p = r.split("~"), tp = sa(p[0]);
    const k = /^(taller|curso)/.test(tp) ? "ta" : /^promo/.test(tp) ? "pr" : /^cita/.test(tp) ? "ci" : /^aviso/.test(tp) ? "av" : /^(cierre|cerrado)/.test(tp) ? "ce" : "ev";
    const fs = String(p[1] || "").trim(), m2 = fs.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/), m1 = fs.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const f = m1 ? m1[0] : m2 ? `${m2[3]}-${("0" + m2[2]).slice(-2)}-${("0" + m2[1]).slice(-2)}` : "";
    const u = enlaceSeguro(p[9]);
    return { k, f, h: hh(p[2]), hf: hh(p[3]), t: lim(p[4], 90), d: lim(p[5], 400), l: lim(p[6], 120), c: lim(p[7], 40), b: lim(p[8], 30), u, vd: sa(p[10]) === "si" };
  }).filter((a) => a.t && (a.f || a.k === "ci" || a.k === "av")).filter((a) => { const d = aFecha(a.f, ""); return !d || d >= hoy; })
    .sort((a, b) => (a.f || "9999").localeCompare(b.f || "9999") || (a.h || "").localeCompare(b.h || "")).slice(0, max);
}

const urlWa = (wa, texto) => "https://wa.me/" + String(wa || "").replace(/\D/g, "") + "?text=" + encodeURIComponent(texto);

export function AgendaNegocio({ items, wa, nombre = "", clic }) {
  const lista = (items || []).filter((a) => a && a.t);
  if (!lista.length) return null;
  const fechas = lista.filter((a) => a.f && !["ci", "av", "ce"].includes(a.k));
  const citas = lista.filter((a) => a.k === "ci");
  const avisos = lista.filter((a) => a.k === "av" || a.k === "ce");
  const waOk = String(wa || "").replace(/\D/g, "").length >= 10;
  return (
    <section className="ng-s ag" id="ng-agenda" data-testid="negocio-agenda-sec">
      <style>{CSS}</style>
      <h2>📅 Agenda</h2>
      {avisos.map((a, i) => (
        <p key={i} className={"ag-av" + (a.k === "ce" ? " ag-ce" : "")} data-testid="negocio-agenda-aviso">{TIPOS[a.k][0]} <b>{a.t}</b>{a.f ? ` · ${fechaTexto(a.f)}` : ""}{a.d ? ` — ${a.d}` : ""}</p>
      ))}
      <ul className="ag-l">
        {fechas.map((a, i) => {
          const p = partes(a.f), ev = eventoIcs(a, nombre), msg = `Hola, vi en su página de DCUATES: «${a.t}» (${fechaTexto(a.f)}${a.h ? ", " + hora12(a.h) : ""}). Quisiera más información.`;
          return (
            <li className="ag-c" key={i} data-testid="negocio-agenda-item">
              <div className="ag-f" aria-hidden="true"><b>{p.d}</b><span>{MES[p.m]}</span></div>
              <div className="ag-t">
                <span className="ag-tag">{TIPOS[a.k][0]} {TIPOS[a.k][1]}</span>
                <b>{a.t}</b>
                <small>{fechaTexto(a.f)}{a.h ? ` · ${hora12(a.h)}${a.hf ? " a " + hora12(a.hf) : ""}` : ""}</small>
                {a.l && <small>📍 {a.l}</small>}
                {a.c && <small>💲 {a.c}</small>}
                {a.d && <VerMas className="ag-d" lineas={3}>{a.d}</VerMas>}
                <div className="ag-bs">
                  {a.u && enlaceOk(a.u) ? <a className="an-b an-b1" href={a.u} {...(/^https:/i.test(a.u) ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => clic && clic("agenda")}>{a.b || "Quiero ir"}</a>
                    : waOk ? <a className="an-b an-b1" href={urlWa(wa, msg)} target="_blank" rel="noopener noreferrer" onClick={() => clic && clic("agenda")}>{a.b || "💬 Quiero ir"}</a> : null}
                  {ev && <button type="button" className="an-b" data-testid="negocio-agenda-ics" onClick={() => { bajarIcs(ev); clic && clic("cal"); }}>📅 Añadir a mi calendario</button>}
                  {ev && <a className="ag-g" href={enlaceGoogle(ev)} target="_blank" rel="noopener noreferrer" onClick={() => clic && clic("cal")}>Google Calendar ↗</a>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {citas.length > 0 && (
        <div className="ag-ci" data-testid="negocio-agenda-citas">
          <h3>🕒 Agenda tu cita</h3>
          {citas.map((a, i) => {
            const msg = `Hola, vi su página en DCUATES y quisiera agendar una cita${a.f ? ` el ${fechaTexto(a.f)}${a.h ? " a las " + hora12(a.h) : ""}` : ""}. ¿Qué horarios tienen disponibles?`;
            return (
              <div className="ag-cc" key={i}>
                <b>{a.t}{a.f ? ` · ${fechaTexto(a.f)}` : ""}{a.h ? ` · ${hora12(a.h)}` : ""}</b>
                {a.d && <p>{a.d}</p>}
                {a.l && <small>📍 {a.l}</small>}
                {a.c && <small>💲 {a.c}</small>}
                {waOk && <a className="an-b an-b1" href={urlWa(wa, msg)} target="_blank" rel="noopener noreferrer" onClick={() => clic && clic("agenda")} data-testid="negocio-agenda-cita">📲 {a.b || "Agendar por WhatsApp"}</a>}
              </div>
            );
          })}
          <small className="ag-pv">Tu cita se pide por WhatsApp: DCUATES no guarda tus datos.</small>
        </div>
      )}
    </section>
  );
}

const CSS = `
.ag-av{margin:8px 0 0;padding:8px 12px;border-radius:12px;background:#FFF4D6;color:#6b4a00;font-size:14px;font-weight:700;line-height:1.35}.ag-ce{background:#fde4e4;color:#7a1c1c}
.ag-l{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:10px}
.ag-c{display:flex;gap:10px;border:2px solid var(--c,#1F7A46);border-radius:16px;background:#fff;padding:10px}
.ag-f{flex:0 0 52px;height:58px;border-radius:12px;background:var(--c,#1F7A46);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}.ag-f b{font-size:22px;font-weight:900}.ag-f span{font-size:12px;font-weight:900;text-transform:uppercase}
.ag-t{min-width:0;flex:1;display:flex;flex-direction:column;gap:3px}.ag-t>b{font-size:16.5px;font-weight:900;line-height:1.25;overflow-wrap:anywhere}.ag-t small{font-size:13px;font-weight:800;color:#4a5b52;overflow-wrap:anywhere}
.ag-tag{align-self:flex-start;border-radius:999px;background:#eef6f0;color:var(--c,#1F7A46);padding:2px 9px;font-size:12px;font-weight:900}
.ag-d{font-size:14px;font-weight:700;line-height:1.45;color:#2b3a32}
.ag-bs{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}.ag-bs .an-b{flex:1 1 140px;cursor:pointer}
.ag-g{flex:1 1 100%;text-align:center;font-size:13px;font-weight:900;color:var(--c,#1F7A46);min-height:34px;display:flex;align-items:center;justify-content:center}
.ag-ci{margin-top:12px;border:2px dashed var(--c,#1F7A46);border-radius:16px;background:#fff;padding:10px 12px;display:flex;flex-direction:column;gap:8px}.ag-ci h3{margin:0;font-size:16px;font-weight:900}
.ag-cc{display:flex;flex-direction:column;gap:4px}.ag-cc .an-b{flex:0 0 auto}.ag-cc p{margin:0;font-size:14px;font-weight:700}.ag-cc small,.ag-pv{font-size:12.5px;font-weight:800;color:#5a6b62}
`;
