// CALENDARIO Y UTILERÍAS: eventos de Google Calendar (vía /api/calendario), recordatorios, clima y horarios.
import { useEffect, useState } from "react";
import { CLIMA_LUGAR } from "../datos/config.js";

const TZ = "America/Mexico_City";
const pad = (n) => String(n).padStart(2, "0");

// ---------- eventos ----------
let cache = null, promesa = null, cargadoEn = 0;
export const estadoCal = { ok: null, motivo: "" };
const subs = new Set();

const aFecha = (t, todo) => { if (!t) return null; if (todo || /^\d{4}-\d{2}-\d{2}$/.test(t)) { const [y, m, d] = t.slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); } return new Date(t); };
const normalizar = (e) => {
  const inicio = aFecha(e.inicio, e.todoElDia), fin = aFecha(e.fin, e.todoElDia) || inicio;
  if (!inicio || isNaN(inicio)) return null;
  return { id: e.id, fecha: String(e.inicio).slice(0, 10), titulo: e.titulo, info: e.info || "", lugar: e.lugar || "", enlace: e.enlace || "", inicio, fin, todoElDia: !!e.todoElDia, origen: "calendario" };
};
export function recargarCalendario(forzar) {
  if (promesa && !forzar && Date.now() - cargadoEn < 120000) return promesa;
  cargadoEn = Date.now();
  promesa = (async () => {
    try {
      const r = await fetch("/api/calendario");
      const j = await r.json();
      estadoCal.ok = !!j.ok; estadoCal.motivo = j.motivo || "";
      cache = (j.eventos || []).map(normalizar).filter(Boolean);
    } catch (e) { estadoCal.ok = false; estadoCal.motivo = "sin-conexion"; cache = cache || []; }
    subs.forEach((f) => f());
  })();
  return promesa;
}
export function useCalendario() {
  const [ev, setEv] = useState(cache || []);
  useEffect(() => { const f = () => setEv(cache || []); subs.add(f); recargarCalendario(); return () => { subs.delete(f); }; }, []);
  return ev;
}
// Suma los eventos de la página (datos/agenda.js y Baserow) con los del calendario, sin repetir.
export function mezclarAgenda(base, cal) {
  const vistos = new Set(); const out = [];
  [...(cal || []), ...(base || [])].forEach((e) => {
    const k = (e.fecha || "") + "|" + String(e.titulo || "").toLowerCase().trim();
    if (vistos.has(k)) return; vistos.add(k); out.push(e);
  });
  return out.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)) || (a.inicio && b.inicio ? a.inicio - b.inicio : 0));
}
// Convierte cualquier evento (con o sin hora) a la forma con fechas reales.
export function conFechas(e) {
  if (e.inicio instanceof Date) return e;
  const inicio = aFecha(e.fecha, true);
  return { ...e, inicio, fin: inicio, todoElDia: true };
}
export const proximos = (lista, ahora = new Date()) => (lista || []).map(conFechas).filter((e) => e.inicio && !isNaN(e.inicio) && (e.todoElDia ? new Date(e.fin.getTime() + (e.origen === "calendario" ? 0 : 86400000)) > ahora : e.fin > ahora)).sort((a, b) => a.inicio - b.inicio);

const f1 = new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short", timeZone: TZ });
const f2 = new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });
export const fechaLinda = (e) => { const s = f1.format(e.inicio).replace(".", ""); return e.todoElDia ? s : s + " · " + f2.format(e.inicio).replace(/\./g, ""); };
export const horaLinda = (d) => f2.format(d).replace(/\./g, "");

// ---------- recordatorios ----------
const ymd = (d) => d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
const utc = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
const esc = (t) => String(t || "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
export function enlaceGoogle(e) {
  const x = conFechas(e);
  const dates = x.todoElDia ? ymd(x.inicio) + "/" + ymd(new Date(x.inicio.getFullYear(), x.inicio.getMonth(), x.inicio.getDate() + 1)) : utc(x.inicio) + "/" + utc(x.fin > x.inicio ? x.fin : new Date(x.inicio.getTime() + 3600000));
  const p = new URLSearchParams({ action: "TEMPLATE", text: x.titulo, dates, details: (x.info ? x.info + "\n\n" : "") + "Evento de DCUATES · dcuates.com", location: x.lugar || "" });
  return "https://calendar.google.com/calendar/render?" + p.toString();
}
export function textoIcs(e) {
  const x = conFechas(e);
  const l = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DCUATES//Agenda//ES", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", "UID:" + (x.id || ymd(x.inicio) + "-" + encodeURIComponent(x.titulo)) + "@dcuates.com", "DTSTAMP:" + utc(new Date())];
  if (x.todoElDia) { l.push("DTSTART;VALUE=DATE:" + ymd(x.inicio)); l.push("DTEND;VALUE=DATE:" + ymd(new Date(x.inicio.getFullYear(), x.inicio.getMonth(), x.inicio.getDate() + 1))); }
  else { l.push("DTSTART:" + utc(x.inicio)); l.push("DTEND:" + utc(x.fin > x.inicio ? x.fin : new Date(x.inicio.getTime() + 3600000))); }
  l.push("SUMMARY:" + esc(x.titulo), "DESCRIPTION:" + esc((x.info ? x.info + "\n" : "") + "Evento de DCUATES · dcuates.com"));
  if (x.lugar) l.push("LOCATION:" + esc(x.lugar));
  l.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(x.titulo), "TRIGGER:-P1D", "END:VALARM", "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(x.titulo), "TRIGGER:-PT1H", "END:VALARM", "END:VEVENT", "END:VCALENDAR");
  return l.join("\r\n");
}
export function bajarIcs(e) {
  try {
    const blob = new Blob([textoIcs(e)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "DCUATES-" + String(e.titulo || "evento").replace(/[^\wáéíóúñ]+/gi, "-").slice(0, 40) + ".ics";
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  } catch (err) {}
}
const CLAVE_R = "dc_recordatorios";
export const leerRecordatorios = () => { try { return JSON.parse(localStorage.getItem(CLAVE_R) || "[]"); } catch (e) { return []; } };
const guardaR = (l) => { try { localStorage.setItem(CLAVE_R, JSON.stringify(l.slice(-30))); } catch (e) {} window.dispatchEvent(new CustomEvent("dcuates:recordatorios")); };
export const claveEvento = (e) => (e.fecha || "") + "|" + String(e.titulo || "").trim();
export const tieneRecordatorio = (e) => leerRecordatorios().some((r) => r.k === claveEvento(e));
export function alternarRecordatorio(e) {
  const l = leerRecordatorios(); const k = claveEvento(e);
  if (l.some((r) => r.k === k)) { guardaR(l.filter((r) => r.k !== k)); return false; }
  const x = conFechas(e); guardaR([...l, { k, titulo: x.titulo, inicio: x.inicio.toISOString(), todoElDia: x.todoElDia }]); return true;
}
export const quitarRecordatorio = (k) => guardaR(leerRecordatorios().filter((r) => r.k !== k));
// Recordatorios que caen en las próximas 24 h y aún no se han avisado.
export function pendientesDeAviso(ahora = new Date()) {
  let vistos = []; try { vistos = JSON.parse(sessionStorage.getItem("dc_avisados") || "[]"); } catch (e) {}
  return leerRecordatorios().filter((r) => { const t = new Date(r.inicio); return t - ahora > -3600000 && t - ahora < 24 * 3600000 && !vistos.includes(r.k); });
}
export const marcarAvisado = (k) => { try { const v = JSON.parse(sessionStorage.getItem("dc_avisados") || "[]"); v.push(k); sessionStorage.setItem("dc_avisados", JSON.stringify(v)); } catch (e) {} };

// ---------- cuenta regresiva ----------
export function cuenta(hasta, ahora = new Date()) {
  let s = Math.max(0, Math.floor((hasta - ahora) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
  return { d, h, m, s };
}

// ---------- clima (Open-Meteo, sin clave) ----------
const WMO = (c) => c === 0 ? ["☀️", "Despejado"] : c <= 2 ? ["⛅", "Parcialmente nublado"] : c === 3 ? ["☁️", "Nublado"] : c <= 48 ? ["🌫️", "Niebla"] : c <= 57 ? ["🌦️", "Llovizna"] : c <= 67 ? ["🌧️", "Lluvia"] : c <= 77 ? ["❄️", "Nieve"] : c <= 82 ? ["🌧️", "Chubascos"] : ["⛈️", "Tormenta"];
export async function cargarClima() {
  try { const g = JSON.parse(sessionStorage.getItem("dc_clima") || "null"); if (g && Date.now() - g.t < 30 * 60000) return g.d; } catch (e) {}
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${CLIMA_LUGAR.lat}&longitude=${CLIMA_LUGAR.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=${encodeURIComponent(TZ)}&forecast_days=3`;
  const r = await fetch(u); const j = await r.json();
  const dias = j.daily.time.map((t, i) => { const [e, txt] = WMO(j.daily.weather_code[i]); return { fecha: t, e, txt, max: Math.round(j.daily.temperature_2m_max[i]), min: Math.round(j.daily.temperature_2m_min[i]), lluvia: j.daily.precipitation_probability_max[i] }; });
  const [e, txt] = WMO(j.current.weather_code);
  const d = { ahora: Math.round(j.current.temperature_2m), e, txt, dias };
  try { sessionStorage.setItem("dc_clima", JSON.stringify({ t: Date.now(), d })); } catch (er) {}
  return d;
}
export function consejoClima(d) {
  const h = d.dias[0]; const c = [];
  if (h.lluvia >= 50) c.push("☂️ Hoy hay buena probabilidad de lluvia: lleva paraguas o impermeable.");
  if (h.max >= 30) c.push("🧴 Hará calor: hidrátate y protégete del sol.");
  if (h.min <= 8) c.push("🧥 Amanecerá frío: abrígate bien.");
  return c.length ? c : ["🙂 Buen día para salir. ¡Disfrútalo!"];
}

// ---------- horarios de atención (NEGOCIO HORARIO en Baserow) ----------
// Formato: "L-V 9:00-18:00; S 9:00-14:00" (L M X J V S D; X = miércoles). Varias franjas con «;».
const DIAS = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6, D: 0 };
export function parsearHorario(txt) {
  const out = [];
  String(txt || "").toUpperCase().split(/[;\n]/).forEach((parte) => {
    const m = parte.trim().match(/^([LMXJVSD](?:\s*[-–,]\s*[LMXJVSD])*)\s+(\d{1,2})(?::(\d{2}))?\s*[-–a]\s*(\d{1,2})(?::(\d{2}))?$/);
    if (!m) return;
    const letras = m[1].replace(/\s+/g, ""); const dias = new Set();
    if (/^[LMXJVSD]-[LMXJVSD]$/.test(letras)) { let d = DIAS[letras[0]]; const f = DIAS[letras[2]]; for (let i = 0; i < 8; i++) { dias.add(d); if (d === f) break; d = (d + 1) % 7; } }
    else letras.split(/[,]/).forEach((x) => x.split("-").forEach((y) => { if (y in DIAS) dias.add(DIAS[y]); }));
    const a = +m[2] * 60 + (+m[3] || 0), b = +m[4] * 60 + (+m[5] || 0);
    dias.forEach((d) => out.push({ d, a, b }));
  });
  return out;
}
// Para cada negocio con horario: estado dentro de las próximas 24 h.
export function atencion24h(negocios, ahora = new Date()) {
  const fin = new Date(ahora.getTime() + 24 * 3600000); const res = [];
  (negocios || []).forEach((n) => {
    const fr = parsearHorario(n.horario); if (!fr.length) return;
    let mejor = null;
    for (let off = -1; off <= 1; off++) {
      const dia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + off);
      fr.filter((x) => x.d === dia.getDay()).forEach((x) => {
        const ini = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 0, x.a), cie = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 0, x.b);
        if (cie <= ahora || ini >= fin) return;
        const abierto = ini <= ahora && ahora < cie;
        if (!mejor || (abierto && !mejor.abierto) || (abierto === mejor.abierto && ini < mejor.ini)) mejor = { n, ini, cie, abierto };
      });
    }
    if (mejor) res.push(mejor);
  });
  return res.sort((a, b) => (b.abierto - a.abierto) || (a.ini - b.ini));
}
export function textoAtencion(x, ahora = new Date()) {
  if (x.abierto) return "🟢 Abierto ahora · cierra a las " + horaLinda(x.cie);
  const mismo = x.ini.toDateString() === ahora.toDateString();
  return "🕘 Abre " + (mismo ? "hoy" : "mañana") + " a las " + horaLinda(x.ini) + " · cierra " + horaLinda(x.cie);
}
