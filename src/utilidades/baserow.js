// =========================================================================
// src/utilidades/baserow.js — Lectura de Baserow y funciones de apoyo (enlaces, video, WhatsApp)
// =========================================================================
import React, { useState, useEffect, useRef } from "react";
import { WHATSAPP_NUMERO } from "../datos/config.js";
import { BASEROW_TABLE_ID_ENLACES, BOTONES_PORTADA, CACHE_ENLACES_MS } from "../datos/proyectos.js";

// Función helper para armar enlaces directos de WhatsApp de forma consistente
export function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

// Función helper para hacer scroll suave hacia una sección/registro de la
// misma página (usada por los botones que en vez de abrir WhatsApp llevan
// directo a un formulario, ej. "Publicar mi negocio" o "Extraviados y Adopciones").
export function irASeccion(id) {
  // El mapa vive dentro de la pestaña NEGOCIOS: aunque el contenedor exista
  // siempre, hay que abrir esa pestaña primero y luego bajar hasta el mapa.
  if (id === "mapa-negocios") {
    window.dispatchEvent(new CustomEvent("dcuates:abrir-seccion", { detail: id }));
    setTimeout(() => (document.getElementById("mapa-local") || document.getElementById(id))?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  // La sección vive dentro de una pestaña que está cerrada (ej. Apoyo
  // Voluntario en Causas): se le pide al bloque de pestañas que la abra y
  // después se baja hasta ella.
  window.dispatchEvent(new CustomEvent("dcuates:abrir-seccion", { detail: id }));
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
}

// Nombre "bonito" de un proyecto (para los mensajes al compartir).
export function tituloProyecto(id) {
  const base = BOTONES_PORTADA.find((b) => b.modal === id);
  if (!base) return "Un proyecto de la comunidad";
  return base.t.toLowerCase().split(" ").map((w, i) => (i && /^(de|del|y|con|a|el|la|los|las|en)$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");
}

// Tarjeta compartida por ambas pasarelas (extraviados y ventas con causa) —
// misma estructura visual, cambia solo la etiqueta y el pie de foto.
// Las fotos que vienen de Baserow (URLs de S3) pasan por nuestro propio
// "puente" (/api/imagen-proxy) para evitar bloqueos del navegador del
// visitante. Las rutas locales de marcador de posición (/images/...) se
// usan tal cual, sin pasar por el puente. La usan tanto la tarjeta como
// la precarga del carrusel, para no repetir la misma lógica dos veces.
export function resolverSrcImagen(img) {
  if (!img) return img;
  return img.startsWith("http") ? `/api/imagen-proxy?url=${encodeURIComponent(img)}` : img;
}

export let cacheEnlacesMemoria = null;

 // { datos, momento }

// Avisa a la página qué pasó con la lectura de Baserow (lo muestra el sello de
// versión al final de los accesos rápidos): sirve para detectar fallas sin
// abrir la consola del navegador.
export function reportarBaserow(estado) {
  if (typeof window === "undefined") return;
  window.__dcuatesBaserow = estado;
  window.dispatchEvent(new CustomEvent("dcuates:baserow-estado", { detail: estado }));
}

export function useFilasEnlaces() {
  const [filas, setFilas] = useState(() => cacheEnlacesMemoria ? cacheEnlacesMemoria.datos : []);

  useEffect(() => {
    if (!BASEROW_TABLE_ID_ENLACES) return;

    const ahora = Date.now();
    if (cacheEnlacesMemoria && ahora - cacheEnlacesMemoria.momento < CACHE_ENLACES_MS) {
      setFilas(cacheEnlacesMemoria.datos);
      reportarBaserow({ ok: true, filas: cacheEnlacesMemoria.datos.length });
      return;
    }
    try {
      const guardado = sessionStorage.getItem("dcuates_enlaces_cache");
      if (guardado) {
        const parseado = JSON.parse(guardado);
        if (parseado && ahora - parseado.momento < CACHE_ENLACES_MS) {
          cacheEnlacesMemoria = parseado;
          setFilas(parseado.datos);
          reportarBaserow({ ok: true, filas: parseado.datos.length });
          return;
        }
      }
    } catch (e) {
      // sessionStorage no disponible o dato corrupto — se sigue al fetch normal
    }

    let cancelado = false;
    fetch(`/api/baserow-rows?table=${encodeURIComponent(BASEROW_TABLE_ID_ENLACES)}&crudo=1`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data.items)) {
          // Ayuda para detectar fallas: abre la consola del navegador (F12).
          console.warn("[DCUATES] /api/baserow-rows no regresó filas. Respuesta:", data);
          reportarBaserow({ ok: false, mensaje: (data && (data.error || data.message)) ? String(data.error || data.message) : "respuesta sin filas" });
        }
        if (!cancelado && Array.isArray(data.items)) {
          const entrada = { datos: data.items, momento: Date.now() };
          cacheEnlacesMemoria = entrada;
          try { sessionStorage.setItem("dcuates_enlaces_cache", JSON.stringify(entrada)); } catch (e) {}
          setFilas(data.items);
          reportarBaserow({ ok: true, filas: data.items.length });
        }
      })
      .catch((e) => {
        // Sin conexión, tabla vacía, etc. — nos quedamos con los respaldos.
        console.warn("[DCUATES] No se pudo leer Baserow (/api/baserow-rows):", e);
        reportarBaserow({ ok: false, mensaje: String((e && e.message) || e) });
      });

    return () => { cancelado = true; };
  }, []);

  return filas;
}

// Toma hasta "max" valores no vacíos de una columna a lo largo de todas
// las filas (ej. las primeras 5 URLs de la columna RECMUSIC).
export function primerosValores(filas, columna, max) {
  return filas
    .map((f) => f && f[columna])
    .filter((v) => v && String(v).trim() !== "")
    .slice(0, max);
}

// Arma pares {nombre, enlace} tomando 2 columnas de la misma fila (ej.
// "Nombre Recocasa" + "RECASA"). Solo cuenta una fila si tiene enlace; si le
// falta el nombre, usa un nombre genérico numerado para no dejarlo vacío.
export function paresBaserow(filas, colNombre, colEnlace, max) {
  return filas
    .filter((f) => f && f[colEnlace] && String(f[colEnlace]).trim() !== "")
    .slice(0, max)
    .map((f, i) => ({
      nombre: (f[colNombre] && String(f[colNombre]).trim()) || `Recomendación ${i + 1}`,
      enlace: f[colEnlace]
    }));
}

// Saca la URL de una celda de Baserow sin importar si la columna es de
// texto/URL plano (un string) o de tipo Archivo/Adjunto (Baserow entrega un
// arreglo de objetos [{url, name, thumbnails...}] para ese tipo de columna,
// como es el caso de GALCULTURA y GALSALUD).
export function urlDesdeCeldaBaserow(valor) {
  if (!valor) return null;
  if (Array.isArray(valor)) {
    const primero = valor[0];
    if (!primero) return null;
    return primero.url || (primero.thumbnails && primero.thumbnails.card && primero.thumbnails.card.url) || null;
  }
  const texto = String(valor).trim();
  return texto === "" ? null : texto;
}

// Arma items de galería {img, tipo, nombre} a partir de una columna que
// trae fotos — ya sea de tipo Archivo/Adjunto (GALCULTURA, GALSALUD) o de
// texto plano con URLs.
export function galeriaDesdeColumna(filas, columna, max, etiqueta) {
  return filas
    .map((f) => f && urlDesdeCeldaBaserow(f[columna]))
    .filter(Boolean)
    .slice(0, max)
    .map((url, i) => ({
      img: url,
      tipo: etiqueta,
      nombre: `${etiqueta} ${i + 1}`
    }));
}

// Saca el ID de video de un enlace normal de YouTube (watch?v=, youtu.be/,
// o ya en formato /embed/), para poder armar el src del iframe.
export function idYoutubeDesdeUrl(url) {
  if (!url) return null;
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{6,})/);
  return m ? m[1] : null;
}

// Detecta si un enlace apunta a un PDF (por su extensión), para mostrarlo
// en el visor interno (VisorPDF/BarraPatrocinadores) en vez de abrirlo en
// una pestaña nueva. Funciona con links que terminan en ".pdf" o que
// llevan ".pdf" seguido de parámetros (ej. "...archivo.pdf?dl=1").
export function esPDF(url) {
  if (!url) return false;
  return /\.pdf(\?|#|$)/i.test(String(url));
}

// Detecta de qué plataforma es un link de video normal (el mismo que
// copiarías para compartir por WhatsApp — NO el código de incrustación) y
// saca su id, para poder armar el reproductor correcto de cada una.
// Reconoce YouTube (incluye Shorts) y TikTok. Ojo: los links cortos de
// TikTok (vm.tiktok.com/XXXX) no funcionan aquí porque no traen el id en
// la URL — hay que usar el link largo (tiktok.com/@usuario/video/123...).
// Devuelve null si no reconoce ninguna plataforma.
export function detectarVideo(url) {
  if (!url) return null;
  const idYt = idYoutubeDesdeUrl(url);
  if (idYt) return { plataforma: "youtube", id: idYt };
  const tt = String(url).match(/tiktok\.com\/(?:@[\w.-]+\/video\/|embed\/(?:v2\/)?)(\d+)/);
  if (tt) return { plataforma: "tiktok", id: tt[1] };
  const vm = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { plataforma: "vimeo", id: vm[1] };
  // Facebook no trabaja con un "id" simple como YouTube/TikTok — su
  // reproductor incrustado necesita el link completo tal cual. Ojo: los
  // links cortos "fb.watch/XXXX" sí funcionan aquí (a diferencia de los
  // cortos de TikTok), porque el reproductor de Facebook los resuelve solo.
  if (/facebook\.com|fb\.watch/.test(String(url))) {
    return { plataforma: "facebook", url: String(url) };
  }
  return null;
}

// Carrusel automático genérico y reutilizable — cada "intervaloMs" avanza
// solo al siguiente elemento (moviendo el "scrollLeft" del contenedor
// directamente, nunca scrollIntoView, para no arrastrar el scroll de la
// página). Se pausa en cuanto la persona toca/desliza a mano. Lo usan
// Patrocinadores, Historias y reflexiones, y los videos de Retos.
export function useCarruselAutomatico(cantidad, intervaloMs = 2500) {
  const scrollRef = useRef(null);
  const [indiceAuto, setIndiceAuto] = useState(0);
  const [pausado, setPausado] = useState(false);
  const temporizadorReanudar = useRef(null);
  useEffect(() => () => clearTimeout(temporizadorReanudar.current), []);
  useEffect(() => {
    if (pausado || cantidad <= 1) return;
    const id = setInterval(() => {
      setIndiceAuto((i) => (i + 1) % cantidad);
    }, intervaloMs);
    return () => clearInterval(id);
  }, [pausado, cantidad, intervaloMs]);
  useEffect(() => {
    const contenedor = scrollRef.current;
    const hijo = contenedor && contenedor.children[indiceAuto];
    if (!contenedor || !hijo) return;
    // Posición del elemento DENTRO del contenedor (con getBoundingClientRect,
    // porque offsetLeft se medía contra otro ancestro y en la columna de
    // Retos daba un número enorme: la pasarela saltaba al final y se
    // quedaba ahí).
    const izqHijo = hijo.getBoundingClientRect().left - contenedor.getBoundingClientRect().left + contenedor.scrollLeft;
    const objetivo = izqHijo - (contenedor.clientWidth - hijo.clientWidth) / 2;
    contenedor.scrollTo({ left: Math.max(0, objetivo), behavior: "smooth" });
  }, [indiceAuto]);
  // Al tocar/deslizar a mano se pausa, pero ya NO para siempre: 6 segundos
  // después de la última interacción la pasarela se reanuda sola (antes
  // se quedaba parada en el último elemento tocado).
  const alTocar = () => {
    setPausado(true);
    clearTimeout(temporizadorReanudar.current);
    temporizadorReanudar.current = setTimeout(() => setPausado(false), 6000);
  };
  return { scrollRef, onPointerDown: alTocar };
}

export function useCatalogoBaserow(tableId, itemsRespaldo) {
  const [items, setItems] = useState(itemsRespaldo);

  useEffect(() => {
    if (!tableId) return; // sin Table ID configurado: nos quedamos con el respaldo
    let cancelado = false;

    fetch(`/api/baserow-rows?table=${encodeURIComponent(tableId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelado && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch(() => {
        // Sin conexión, token aún no configurado, etc. — nos quedamos con el respaldo.
      });

    return () => { cancelado = true; };
  }, [tableId]);

  return items;
}
