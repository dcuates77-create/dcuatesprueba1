// Enlaces de negocios CUATE con vista previa (e79):  dcuates.com/n/<slug>
// Lee el negocio de la hoja «NegociosCUATE» (vía Apps Script) para poner su nombre, eslogan y logo en la vista previa de
// WhatsApp/Facebook, y después abre la página en #negocio-<slug>. Si la hoja no responde, entrega una vista previa genérica.
const SITIO = "dcuates.com";
const SCRIPT = "https://script.google.com/macros/s/AKfycbxngMxuH03w0rI7AyJHRap9QCVf_Xs5roypGXnnkSGr_22SyfxWAVAiH614r1eGC2DW2g/exec";
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default async function handler(req, res) {
  const slug = String((req.query && req.query.slug) || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);
  if (!slug) { res.statusCode = 302; res.setHeader("Location", "/"); return res.end(); }

  let n = null;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch(`${SCRIPT}?a=negocio&slug=${encodeURIComponent(slug)}`, { signal: ctl.signal, redirect: "follow" });
    clearTimeout(t);
    const j = await r.json();
    if (j && j.ok && j.negocio) n = j.negocio;
  } catch (e) { /* vista previa genérica */ }

  const host = (req.headers["x-forwarded-host"] || req.headers.host || SITIO).split(",")[0];
  const origen = `https://${host}`;
  const titulo = n ? `${n.n} | DCUATES` : "Negocio CUATE | DCUATES";
  const texto = n ? (n.e ? `${n.e}. ` : "") + (n.d || "Negocio de la red CUATE de DCUATES.").slice(0, 150) : "Un negocio de la red CUATE de DCUATES: comunidad de apoyo mutuo.";
  const imagen = n && /^https:\/\//.test(n.logo || "") ? n.logo : origen + "/images/og/logo.jpg";
  const destino = `/?origen=negocio-${slug}#negocio-${slug}`;
  const canonica = `${origen}/n/${slug}`;

  const html = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(texto)}">
<link rel="canonical" href="${esc(canonica)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DCUATES">
<meta property="og:locale" content="es_MX">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(texto)}">
<meta property="og:url" content="${esc(canonica)}">
<meta property="og:image" content="${esc(imagen)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(texto)}">
<meta name="twitter:image" content="${esc(imagen)}">
<meta http-equiv="refresh" content="0;url=${esc(destino)}">
<script>location.replace(${JSON.stringify(destino)});</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:2rem">
<p>Abriendo <b>${esc(n ? n.n : "el negocio")}</b>…</p>
<p><a href="${esc(destino)}">Toca aquí si no se abre solo</a></p>
</body>
</html>`;
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  res.end(html);
}
