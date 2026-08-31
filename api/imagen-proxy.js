// api/imagen-proxy.js
//
// "Puente" para imágenes: en vez de que el navegador de cada visitante
// pida la foto directo a Amazon S3 (donde Baserow las guarda), se la pide
// a ESTA función, y esta función se la pide a S3 por su cuenta y se la
// entrega ya lista. Esto evita cualquier problema de bloqueadores de
// anuncios, restricciones de origen, o reglas de S3 que solo permitan
// peticiones "servidor a servidor" en vez de navegador a S3 directo.
//
// USO en el código de la página:
//   <img src={`/api/imagen-proxy?url=${encodeURIComponent(item.img)}`} />
//
// Por seguridad, solo deja pasar imágenes que vengan de dominios de
// almacenamiento de Baserow — así nadie puede usar esta función para
// "disfrazar" cualquier otra dirección de internet.

const DOMINIOS_PERMITIDOS = [
  "s3.amazonaws.com",
  "baserow.io",
  "amazonaws.com" // cubre variantes como baserow-backend-production....s3.amazonaws.com
];

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Falta el parámetro 'url'." });
  }

  let destino;
  try {
    destino = new URL(url);
  } catch {
    return res.status(400).json({ error: "URL inválida." });
  }

  const permitido = DOMINIOS_PERMITIDOS.some((dominio) => destino.hostname.endsWith(dominio));
  if (!permitido) {
    return res.status(403).json({ error: "Dominio no permitido para este puente de imágenes." });
  }

  try {
    const respuesta = await fetch(destino.toString());
    if (!respuesta.ok) {
      return res.status(respuesta.status).json({ error: "No se pudo obtener la imagen desde el origen." });
    }

    const tipo = respuesta.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await respuesta.arrayBuffer());

    res.setHeader("Content-Type", tipo);
    // Cache largo: las fotos de un producto no cambian a cada rato.
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).json({ error: "No se pudo conectar con el origen de la imagen.", detalle: String(err) });
  }
}
