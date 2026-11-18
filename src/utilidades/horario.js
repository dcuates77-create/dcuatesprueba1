// «Abierto ahora» (e84b): lee el texto libre de la columna «Horario» y dice si está abierto a esta hora (hora del celular).
// Devuelve true (abierto), false (cerrado) o null (no se pudo leer: no se afirma nada).
// Entiende: «Lun a Vie 9:00–19:00 · Sáb 9:00–14:00», «Lunes a sábado de 9 a 18 h», «Todos los días 8am-8pm», «24 horas», «10:00-14:00 y 16:00-20:00».
const DIAS = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
const sa = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[–—−]/g, "-");
const idxDia = (t) => DIAS.indexOf(t.slice(0, 3));
const diasDe = (seg) => {
  if (/todos los dias|diario|cada dia|lunes a domingo|lun a dom/.test(seg)) return [0, 1, 2, 3, 4, 5, 6];
  if (/fines? de semana/.test(seg)) return [0, 6];
  const m = [...seg.matchAll(/\b(lun|mar|mie|jue|vie|sab|dom)[a-z]*\b/g)];
  if (!m.length) return null;
  const out = new Set();
  for (let k = 0; k < m.length; k++) {
    const d = idxDia(m[k][1]);
    out.add(d);
    const ent = k > 0 ? seg.slice(m[k - 1].index + m[k - 1][0].length, m[k].index) : "";
    if (k > 0 && /^\s*(a|al|-|hasta)\s*$/.test(ent)) { let x = idxDia(m[k - 1][1]); while (x !== d) { x = (x + 1) % 7; out.add(x); } }
  }
  return [...out];
};
const hm = (h, mi, ap) => { let x = Number(h); if (ap && /p/.test(ap) && x < 12) x += 12; if (ap && /a/.test(ap) && x === 12) x = 0; return x * 60 + (Number(mi) || 0); };
const rangos = (seg) => {
  const out = [];
  if (/24 ?(h|horas|hrs)/.test(seg)) return [[0, 1440]];
  const re = /(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?\s*(?:h|hrs)?\s*(?:-|a|al|hasta)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/g;
  let m;
  while ((m = re.exec(seg))) {
    const a1 = m[3] ? m[3].replace(/\./g, "") : "", a2 = m[6] ? m[6].replace(/\./g, "") : "";
    // «9 a 6pm»: si solo el final trae am/pm, el inicio lo hereda cuando es menor que el final
    const ap1 = a1 || (a2 === "pm" && Number(m[1]) < Number(m[4]) && Number(m[4]) <= 12 ? "pm" : "");
    const ini = hm(m[1], m[2], ap1);
    const fin = hm(m[4], m[5], a2);
    if (ini > 1440 || fin > 1440 || Number(m[1]) > 24 || Number(m[4]) > 24) continue;
    out.push([ini, fin]);
  }
  return out;
};
export function abiertoAhora(texto, fecha = new Date()) {
  const t = sa(texto);
  if (!t.trim()) return null;
  const segs = t.split(/[;·|\n]|,(?=\s*(?:lun|mar|mie|jue|vie|sab|dom|todos|diario|fin))/);
  const dia = fecha.getDay(), min = fecha.getHours() * 60 + fecha.getMinutes();
  let leido = false, abierto = false;
  for (const seg of segs) {
    const rs = rangos(seg);
    if (!rs.length) continue;
    const ds = diasDe(seg) || [0, 1, 2, 3, 4, 5, 6];
    leido = true;
    for (const [a, b] of rs) {
      if (b > a) { if (ds.includes(dia) && min >= a && min < b) abierto = true; }
      else if (b < a) { // cruza la medianoche
        if (ds.includes(dia) && min >= a) abierto = true;
        if (ds.includes((dia + 6) % 7) && min < b) abierto = true;
      }
    }
  }
  return leido ? abierto : null;
}
