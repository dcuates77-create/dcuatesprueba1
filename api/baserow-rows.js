// api/baserow-rows.js
//
// Función serverless de Vercel (no requiere Next.js: cualquier archivo
// dentro de la carpeta /api en la raíz del proyecto se despliega solo).
//
// QUÉ HACE: recibe una petición del navegador con un "table" (el ID de tu
// tabla en Baserow), y desde AQUÍ (en el servidor, nunca en el navegador
// del visitante) llama a la API real de Baserow usando tu token secreto.
// Así el token jamás queda expuesto en el código de la página.
//
// -------------------------------------------------------------------
// CONFIGURACIÓN NECESARIA (una sola vez):
// -------------------------------------------------------------------
// 1) En Baserow: entra a la configuración de tu cuenta > "Tokens de API" >
//    crea un token nuevo. Dale permiso de SOLO LECTURA (Read) sobre la
//    base de datos donde están tus tablas de "Ventas con Causa" y
//    "Extraviados". Copia ese token (solo se muestra una vez).
//
// 2) En Vercel: entra a tu proyecto > Settings > Environment Variables >
//    agrega una variable nueva:
//        Nombre:  BASEROW_API_TOKEN
//        Valor:   (pega aquí el token que copiaste de Baserow)
//    Guarda, y vuelve a desplegar el proyecto (Vercel > Deployments >
//    "Redeploy") para que la variable quede activa.
//
// 3) Necesito el ID de cada tabla (no la URL de la galería pública, sino
//    el ID interno de la tabla). Se ve fácil: abre la tabla en Baserow,
//    ve a su documentación de API automática (ícono "i" o "API" en la
//    barra superior de la tabla) — ahí Baserow te muestra ejemplos con
//    la URL completa, algo como:
//      https://api.baserow.io/api/database/rows/table/123456/?...
//    El número (123456 en el ejemplo) es el Table ID. Pásamelo y lo
//    conecto en la página (BASEROW_TABLE_ID_VENTAS_CON_CAUSA y
//    BASEROW_TABLE_ID_EXTRAVIADOS en el archivo principal).
// -------------------------------------------------------------------

export default async function handler(req, res) {
  // Cache corto (5 min) para no golpear la API de Baserow en cada visita.
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const { table } = req.query;
  const token = process.env.BASEROW_API_TOKEN;

  if (!table) {
    return res.status(400).json({ error: "Falta el parámetro 'table' (ID de la tabla en Baserow)." });
  }
  if (!token) {
    // Esto es normal ANTES de configurar la variable de entorno en Vercel:
    // el carrusel simplemente seguirá mostrando sus datos de ejemplo.
    return res.status(500).json({ error: "BASEROW_API_TOKEN no está configurado en Vercel todavía." });
  }

  try {
    const respuesta = await fetch(
      `https://api.baserow.io/api/database/rows/table/${table}/?user_field_names=true&size=50`,
      { headers: { Authorization: `Token ${token}` } }
    );

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      return res.status(502).json({ error: "Baserow respondió con error.", detalle });
    }

    const datos = await respuesta.json();

    // Mapeo defensivo: probamos varios nombres de columna comunes, para no
    // depender de que en Baserow se llamen exactamente igual. Ajusta o
    // agrega nombres aquí si tus columnas se llaman distinto.
    const items = (datos.results || []).map((fila, i) => {
      const nombre = fila["Nombre"] || fila["Name"] || fila["Título"] || fila["Titulo"] || "";
      const tipo = fila["Tipo"] || fila["Categoría"] || fila["Categoria"] || "";
      const descripcion = fila["Descripción"] || fila["Descripcion"] || fila["Detalle"] || "";
      const imagenCampo = fila["Imagen"] || fila["Foto"] || fila["Portada"] || fila["Cover"];
      // Los campos de archivo/imagen en Baserow vienen como un arreglo de
      // objetos con una propiedad "url" — tomamos la primera si existe.
      const img = Array.isArray(imagenCampo) && imagenCampo[0] ? imagenCampo[0].url : (imagenCampo || "");

      return { id: fila.id || `fila-${i}`, tipo, nombre, descripcion, img };
    });

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: "No se pudo conectar con Baserow.", detalle: String(err) });
  }
};
