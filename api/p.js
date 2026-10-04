// Enlaces cortos con vista previa para compartir (WhatsApp, Facebook, etc.).
//
//   dcuates.com/libros  ->  muestra título + descripción + imagen del proyecto
//                           al pegarlo en WhatsApp/Facebook, y al abrirlo lleva
//                           directo a esa ventana de la página.
//
// Por qué hace falta: WhatsApp y Facebook NO ejecutan la página, solo leen las
// etiquetas del HTML inicial. Esta función entrega esas etiquetas ya listas y
// después redirige a la página real (#proyecto-<id>, #<pestaña>...).
//
// Para agregar un enlace nuevo: suma una línea en ENLACES y el mismo nombre en
// vercel.json (lista "alias"). Después de editar, haz commit.

const SITIO = "dcuates.com";
const IMAGEN_BASE = "/images/logo-circular.png";

const ENLACES = {
  // Proyectos (abren su ventana: #proyecto-<id>)
  libros: { hash: "proyecto-libros", titulo: "Préstamo gratuito de libros", texto: "Pide prestado un libro sin costo o dona los que ya leíste. Hagamos una comunidad que lee.", img: "/images/bb.png" },
  bienestar: { hash: "proyecto-bienestar", titulo: "Bienestar y recreación", texto: "Talleres, cursos y actividades para cuidar tu cuerpo y tu mente, en tu colonia.", img: "/images/Bienestar.png" },
  asesorias: { hash: "proyecto-asesorias", titulo: "Asesorías gratuitas", texto: "Orientación educativa, laboral y de negocio sin costo, con voluntarios de tu comunidad.", img: "/images/Asesorías.png" },
  ecatepets: { hash: "proyecto-ecatepets", titulo: "Ecatepets: mascotas que buscan hogar", texto: "Adopta, reporta una mascota extraviada o ayuda a un peludito. Cada patita cuenta.", img: "/images/Ecatepets.png" },
  mascotas: { alias: "ecatepets" },
  circulo: { hash: "proyecto-circulo-confianza", titulo: "Círculo de Confianza", texto: "Una red vecinal de apoyos y recomendaciones de personas y servicios en los que sí se puede confiar.", img: "/images/Círculo.png" },
  publicidad: { hash: "proyecto-publicidad-tarjeta", titulo: "Publicidad gratuita para tu negocio", texto: "Registra tu negocio y que más vecinos te conozcan. Sin costo.", img: "/images/Publicidad2.png" },
  recomienda: { hash: "proyecto-recomienda-evalua-gana", titulo: "Recomienda, evalúa y gana", texto: "Comparte tu experiencia con negocios y servicios locales, y ayuda a otros a elegir mejor.", img: "/images/Recomienda.png" },
  alianzas: { hash: "proyecto-alianzas-tarjeta", titulo: "Alianzas solidarias", texto: "Alianzas ganar-ganar entre negocios y comunidad. Descubre cómo sumarte.", img: "/images/Alianzas.png" },
  bazar: { hash: "proyecto-bazares", titulo: "Bazar y comercio local", texto: "Compra, vende o intercambia de forma segura entre vecinos.", img: "/images/Bazar.png" },
  ventas: { hash: "proyecto-ventas-con-causa", titulo: "Ventas con causa", texto: "Compra productos y servicios locales que además apoyan una causa.", img: "/images/VentasConCausa.png" },
  apoyo: { hash: "proyecto-donaciones", titulo: "Apoyo voluntario", texto: "Tu tiempo, tu talento o tus recursos pueden cambiar vidas. Conoce cómo sumarte.", img: "/images/ApoyoVoluntario.png" },
  donar: { alias: "apoyo" },
  noticias: { hash: "proyecto-noticias", titulo: "Noticias de barrio", texto: "Lo que pasa en tu colonia: eventos, convocatorias y buenas noticias.", img: "/images/Noticias.png" },
  // Pestañas
  nosotros: { hash: "nosotros", titulo: "Nosotros · DCUATES", texto: "Juntos hacemos una mejor comunidad. Conoce quiénes somos y cómo puedes sumar." },
  beneficios: { hash: "beneficios", titulo: "Beneficios para tu comunidad", texto: "Libros, asesorías, bienestar y apoyo para tus mascotas, todo gratis." },
  causas: { hash: "causas", titulo: "Causas que cambian vidas", texto: "Cada proyecto es una forma concreta de apoyar a alguien de tu comunidad." },
  negocios: { hash: "negocios", titulo: "Negocios locales aliados", texto: "Compra local, crece en comunidad. Encuentra negocios aliados o registra el tuyo gratis." },
  valores: { hash: "valores", titulo: "Los valores que nos unen", texto: "Confianza, alianzas y buenas noticias del barrio." },
  regalos: { hash: "regalos", titulo: "Retos y regalos DCUATES", texto: "Retos que nos hacen mejores y regalos para quienes participan." },
  gratitud: { hash: "gratitud", titulo: "Gratitud", texto: "Reconocemos a quienes hacen el bien en nuestra comunidad." },
  // Otras secciones
  solicitud: { hash: "solicitudes", titulo: "Registra tu solicitud", texto: "Cuéntanos qué necesitas y te contactamos por WhatsApp." },
  mapa: { hash: "mapa-negocios", titulo: "Mapa de negocios locales", texto: "Encuentra comercios aliados cerca de ti en Jardines de Morelos." },
  historias: { hash: "historias-reflexiones", titulo: "Historias que inspiran", texto: "Videos y reflexiones de nuestra comunidad." }
};

const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default function handler(req, res) {
  let id = String((req.query && req.query.id) || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  let e = ENLACES[id];
  if (e && e.alias) { id = e.alias; e = ENLACES[id]; }

  // Si el enlace no existe, manda a la portada.
  if (!e) {
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }

  const host = (req.headers["x-forwarded-host"] || req.headers.host || SITIO).split(",")[0];
  const origen = `https://${host}`;
  const titulo = `${e.titulo} | DCUATES`;
  const imagen = origen + (e.img || IMAGEN_BASE);
  const destino = `/?origen=enlace-${id}#${e.hash}`;
  const canonica = `${origen}/${id}`;

  const html = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(e.texto)}">
<link rel="canonical" href="${esc(canonica)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="DCUATES">
<meta property="og:locale" content="es_MX">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(e.texto)}">
<meta property="og:url" content="${esc(canonica)}">
<meta property="og:image" content="${esc(imagen)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(e.texto)}">
<meta name="twitter:image" content="${esc(imagen)}">
<meta http-equiv="refresh" content="0;url=${esc(destino)}">
<script>location.replace(${JSON.stringify(destino)});</script>
</head>
<body style="font-family:sans-serif;text-align:center;padding:2rem">
<p>Abriendo <b>${esc(e.titulo)}</b>…</p>
<p><a href="${esc(destino)}">Toca aquí si no se abre solo</a></p>
</body>
</html>`;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(html);
}
