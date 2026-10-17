// api/calendario.mjs — Lee los próximos eventos del calendario público de Google (DCUATES.COM).
// Variables en Vercel (Production y Preview): GOOGLE_CALENDAR_API_KEY y GOOGLE_CALENDAR_ID.
// La clave NUNCA sale de aquí: la página solo recibe la lista de eventos.
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const key = process.env.GOOGLE_CALENDAR_API_KEY;
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!key || !id) {
    res.status(200).json({ ok: false, motivo: "sin-configurar", eventos: [] });
    return;
  }
  try {
    const desde = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
    const hasta = new Date(Date.now() + 150 * 24 * 3600 * 1000).toISOString();
    const p = new URLSearchParams({
      key, timeMin: desde, timeMax: hasta, singleEvents: "true", orderBy: "startTime",
      maxResults: "60", timeZone: "America/Mexico_City"
    });
    const r = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id)}/events?${p.toString()}`);
    if (!r.ok) {
      res.status(200).json({ ok: false, motivo: "google-" + r.status, eventos: [] });
      return;
    }
    const j = await r.json();
    const limpio = (t, n) => String(t || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
    const eventos = (j.items || [])
      .filter((e) => e && e.status !== "cancelled" && e.start)
      .map((e) => ({
        id: e.id,
        titulo: limpio(e.summary, 120) || "Evento DCUATES",
        info: limpio(e.description, 280),
        lugar: limpio(e.location, 140),
        inicio: e.start.dateTime || e.start.date,
        fin: (e.end && (e.end.dateTime || e.end.date)) || e.start.dateTime || e.start.date,
        todoElDia: !e.start.dateTime,
        enlace: e.htmlLink || ""
      }));
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
    res.status(200).json({ ok: true, eventos });
  } catch (err) {
    res.status(200).json({ ok: false, motivo: "error", eventos: [] });
  }
}
