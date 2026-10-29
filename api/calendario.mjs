// api/calendario.mjs — Lee los próximos eventos de uno o VARIOS calendarios públicos de Google (e53).
// Variables en Vercel (Production y Preview):
//   GOOGLE_CALENDAR_API_KEY  → tu clave de la API de Google Calendar (la misma de siempre).
//   GOOGLE_CALENDAR_ID       → el calendario principal (DCUATES.COM). Para sumar OTROS calendarios públicos sepáralos con comas
//                              y, si quieres, ponles nombre después de «::».  Ejemplo:
//                              dcuates@group.calendar.google.com, ecatepets@gmail.com::Ecatepets, escuela@gmail.com::Escuela Primaria
//   Tercer dato opcional (e55): el TIPO. «fechas» = fechas especiales (festivos, fases de la luna…): salen en la sección
//   «Fechas especiales» de la Agenda y NO se mezclan con los eventos. Sin tipo (o «eventos») = eventos normales. Ejemplo:
//   dcuates@group.calendar.google.com, es.mexican#holiday@group.v.calendar.google.com::Festivos::fechas
//   Los eventos de los calendarios adicionales llevan «Fuente: nombre» al inicio de su descripción.
// La clave NUNCA sale de aquí: la página solo recibe la lista de eventos. Cada calendario adicional debe ser PÚBLICO.
// Si uno falla (por ejemplo, dejó de ser público), los demás siguen funcionando.
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const key = process.env.GOOGLE_CALENDAR_API_KEY;
  const crudo = process.env.GOOGLE_CALENDAR_ID;
  if (!key || !crudo) {
    res.status(200).json({ ok: false, motivo: "sin-configurar", eventos: [] });
    return;
  }
  const fuentes = String(crudo)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((x, i) => { const [id, nom, tipo] = x.split("::"); return { id: id.trim(), nombre: String(nom || "").trim(), tipo: /^fechas?$/i.test(String(tipo || "").trim()) ? "fechas" : "eventos", principal: i === 0 }; });
  const limpio = (t, n) => String(t || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
  const desde = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
  const hasta = new Date(Date.now() + 150 * 24 * 3600 * 1000).toISOString();
  const leer = async (f) => {
    const p = new URLSearchParams({ key, timeMin: desde, timeMax: hasta, singleEvents: "true", orderBy: "startTime", maxResults: "60", timeZone: "America/Mexico_City" });
    const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(f.id)}/events?${p.toString()}`);
    if (!r.ok) throw new Error("google-" + r.status);
    const j = await r.json();
    return (j.items || [])
      .filter((e) => e && e.status !== "cancelled" && e.start)
      .map((e) => {
        const info = limpio(e.description, 260);
        return {
          id: f.id + ":" + e.id,
          titulo: limpio(e.summary, 120) || "Evento DCUATES",
          info: f.nombre && !f.principal ? ("Fuente: " + f.nombre + (info ? " · " + info : "")).slice(0, 300) : info,
          lugar: limpio(e.location, 140),
          inicio: e.start.dateTime || e.start.date,
          fin: (e.end && (e.end.dateTime || e.end.date)) || e.start.dateTime || e.start.date,
          todoElDia: !e.start.dateTime,
          tipo: f.tipo,
          fuente: f.nombre || (f.principal ? "DCUATES" : ""),
          enlace: e.htmlLink || ""
        };
      });
  };
  try {
    const rs = await Promise.allSettled(fuentes.map(leer));
    const buenos = rs.filter((x) => x.status === "fulfilled");
    if (!buenos.length) {
      const m = rs[0] && rs[0].reason && rs[0].reason.message ? rs[0].reason.message : "error";
      res.status(200).json({ ok: false, motivo: m, eventos: [] });
      return;
    }
    // Se juntan y se ordenan por fecha; se quitan repetidos (mismo título y mismo inicio).
    const vistos = new Set();
    const eventos = buenos
      .flatMap((x) => x.value)
      .filter((e) => { const k = String(e.inicio) + "|" + e.titulo.toLowerCase(); if (vistos.has(k)) return false; vistos.add(k); return true; })
      .sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)))
      .slice(0, 120);
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    // «calendarios»: lista pública (los calendarios deben ser públicos de todos modos) para el calendario completo y los filtros.
    const calendarios = fuentes.map((f, i) => ({ id: f.id, nombre: f.nombre || (f.principal ? "DCUATES" : "Calendario " + (i + 1)), tipo: f.tipo, principal: f.principal, ok: rs[i].status === "fulfilled" }));
    res.status(200).json({ ok: true, eventos, fuentes: fuentes.length, fallidas: rs.length - buenos.length, calendarios });
  } catch (err) {
    res.status(200).json({ ok: false, motivo: "error", eventos: [] });
  }
}
