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

// Extrae una URL de imagen sin importar si Baserow la entrega como un
// arreglo de archivos adjuntos (lo más común en un campo "Vista"/"Imagen"
// tipo archivo), como un solo objeto con "url", o como texto plano.
function extraerImagenUrl(campo) {
  if (!campo) return "";
  if (Array.isArray(campo) && campo[0]) {
    return campo[0].url || (campo[0].thumbnails && campo[0].thumbnails.tiny && campo[0].thumbnails.tiny.url) || "";
  }
  if (typeof campo === "object") {
    return campo.url || "";
  }
  if (typeof campo === "string") return campo;
  return "";
}

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

    // Modo diagnóstico opcional: agrega &debug=1 a la URL para ver, sin
    // adornos, cómo llega el campo "Vista" en la primera fila — útil si
    // las fotos siguen sin aparecer y hay que ajustar el mapeo.
    if (req.query.debug === "1" && datos.results && datos.results[0]) {
      return res.status(200).json({ vista_cruda: datos.results[0]["Vista"], fila_completa: datos.results[0] });
    }

    // Mapeo defensivo: probamos varios nombres de columna comunes, para no
    // depender de que en Baserow se llamen exactamente igual. Ajustado a
    // los nombres reales de tus tablas "Productos" y "Servicios DC"
    // (columna de foto = "Vista"). Si agregas una columna nueva en
    // Baserow, no rompe nada — simplemente se ignora. Si renombras una de
    // las columnas que SÍ usamos aquí (Nombre, Descripción/Observaciones,
    // Vista), agrega el nuevo nombre a la lista correspondiente.
    const items = (datos.results || []).map((fila, i) => {
      const nombre = fila["Nombre"] || fila["Name"] || fila["Título"] || fila["Titulo"] || "";
      const codigo = fila["Clave"] || fila["clave"] || fila["Código"] || fila["Codigo"] || "";
      const tipo = fila["Tipo"] || fila["Categoría"] || fila["Categoria"] || fila["Proveedor"] || fila["Estado"] || "";
      const descripcion = fila["Descripción"] || fila["Descripcion"] || fila["Observaciones"] || fila["Detalle"] || fila["Notas"] || "";
      const imagenCampo = fila["Vista"] || fila["Imagen"] || fila["Foto"] || fila["Portada"] || fila["Cover"];
      const img = extraerImagenUrl(imagenCampo);
      const precio = fila["Precio"] || "";
      const proveedor = fila["Proveedor"] || "";
      const notas = fila["Notas"] || "";

      return { id: fila.id || `fila-${i}`, tipo, nombre, codigo, descripcion, img, precio, proveedor, notas };
    });

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: "No se pudo conectar con Baserow.", detalle: String(err) });
  }
};
