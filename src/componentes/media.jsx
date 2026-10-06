// =========================================================================
// src/componentes/media.jsx — Carruseles, videos y botones desplegables
// =========================================================================
import React, { useState, useEffect } from "react";
import { RETOS_REGALOS_ITEMS } from "../datos/listas.js";
import { BASEROW_TABLE_ID_EXTRAVIADOS, BASEROW_TABLE_ID_VENTAS_CON_CAUSA, EXTRAVIADOS_ITEMS, VENTAS_CON_CAUSA_ITEMS } from "../datos/proyectos.js";
import { resolverSrcImagen, useCatalogoBaserow } from "../utilidades/baserow.js";

// Los 3 botones naranjas de Retos/Regalos/Reconocimiento se despliegan
// (uno a la vez) mostrando ejemplos y un botón inferior para que el público
// mande su propia propuesta por WhatsApp. Edita "ejemplos" en el arreglo de arriba.
// Botones naranjas de portada (Historias, Cupones, Patrocinadores): cada
// uno vive ahora dentro de su pestaña. "modales" elige cuáles mostrar.
export function BotonesNaranjasSeccion({ modales, onAbrir }) {
  const todos = [
                    { t: "HISTORIAS DCUATES", modal: "historias-dcuates", img: "/images/HistoriasDCUATES.png", puntos: ["TESTIMONIOS REALES", "HISTORIAS CON CAUSA", "INSPIRACIÓN COMUNITARIA"] },
                    { t: "CUPONES, PROMOS Y MÁS", modal: "cupones-promos", img: "/images/CuponesPromos.png", puntos: ["DESCUENTOS EXCLUSIVOS", "PROMOCIONES LOCALES", "SE ACTUALIZA CADA MES"] },
                    { t: "PATROCINADORES Y ALIANZAS DCUATES", modal: "patrocinadores-alianzas", img: "/images/PatrocinadoresAlianzas.png", puntos: ["NEGOCIOS ALIADOS", "ORGANIZACIONES QUE APOYAN", "¡GRACIAS POR SUMAR!"] }
  ];
  const lista = todos.filter((b) => modales.includes(b.modal));
  return (
    <div className={lista.length === 1 ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 gap-3"}>
      {lista.map((btn, idx) => (
        <div key={idx} className={lista.length === 1 ? "w-full max-w-md" : "w-full"}>
                    <button
                      type="button"
                      onClick={() => onAbrir(btn.modal)}
                      className="flex flex-col rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-md transition-all hover:scale-[1.02] overflow-hidden font-heading text-left w-full"
                    >
                      <div className="px-2 pt-3 pb-1 text-center border-b border-white/20">
                        <h4 className="uppercase font-black leading-tight text-sm sm:text-base lg:text-lg">
                          {btn.t}
                        </h4>
                      </div>
                      <div className="flex flex-1 items-center gap-2 px-2 py-2">
                        <div className="w-2/5 h-full flex items-center justify-center">
                          <img
                            src={btn.img}
                            alt=""
                            loading="lazy"
                            className="max-h-16 sm:max-h-20 w-auto object-contain drop-shadow"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <ul className="w-3/5 space-y-1 text-left text-[10px] sm:text-xs font-bold leading-snug">
                          {btn.puntos.map((p, i) => <li key={i}>* {p}</li>)}
                        </ul>
                      </div>
                    </button>
        </div>
      ))}
    </div>
  );
}

export function BotonesRetosRegalos({ indices }) {
  const [abierto, setAbierto] = useState(null);
  return (
    <div className="flex flex-col gap-2">
      {RETOS_REGALOS_ITEMS.map((item, i) => {
        if (indices && !indices.includes(i)) return null;
        const activo = true;
        return (
          <div key={i} className="rounded-xl overflow-hidden">
            <div
              className="w-full flex items-center justify-between gap-2 bg-[#e65100] text-white font-black uppercase text-xs sm:text-sm leading-tight px-4 py-3.5 transition-colors text-left"
            >
              <span>{item.titulo}</span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-xl" aria-hidden="true">{item.icono}</span>
              </span>
            </div>
            {activo && (
              <div className="bg-[#fff8f1] border-2 border-t-0 border-[#e65100] rounded-b-xl p-3 space-y-2">
                <p className="text-[#0f2d1e] text-[11px] sm:text-xs font-black leading-snug">{item.intro}</p>
                <ul className="space-y-1.5">
                  {item.ejemplos.map((ej, j) => (
                    <li key={j} className="text-[#0f2d1e] text-[11px] sm:text-xs font-semibold leading-snug bg-white rounded-lg border border-[#e65100]/20 px-2.5 py-1.5">
                      {ej}
                    </li>
                  ))}
                </ul>
                <a
                  href={item.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center rounded-full bg-[#17472d] hover:bg-[#0f2d1e] text-white font-black uppercase text-[11px] sm:text-xs tracking-wide px-4 py-2.5 transition-colors"
                >
                  {item.cta}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// =========================================================================
// 4C. SUBCOMPONENTE GENÉRICO: CARRUSEL AUTOMÁTICO (con pausa y flechas manuales)
// =========================================================================
// Reutilizable: gira solo de derecha a izquierda cada "intervaloMs", se
// puede pausar/reanudar, y se puede navegar manualmente con las flechas o
// los puntos (al usar cualquier control manual, se pausa solo, para no
// pelear con quien lo está viendo). "renderItem" decide cómo se ve cada
// tarjeta — así el mismo carrusel sirve para Extraviados, Ventas con
// Causa, o cualquier otra pasarela futura.
// Flecha blanca reutilizable — el mismo diseño usado en los botones
// naranjas de "Apoyo Voluntario", ahora reutilizado en otros botones que
// invitan a dar clic (Ver Más Actividades, catálogos, Ecatepets, etc.).
export function FlechaBlanca() {
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 opacity-90 drop-shadow"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 22 H58 V4 L96 30 L58 56 V38 H4 Z" fill="#ffffff" stroke="#0f2d1e" strokeWidth="6" strokeLinejoin="round" />
    </svg>
  );
}

// Botón naranja desplegable reutilizable: el título siempre se ve, y al
// dar clic se abre suavemente el contenido de abajo (misma animación tipo
// "pergamino" que los botones verdes). Se usa en Ventas con Causa y en
// Apoyo a Causas.
// Antes era un acordeón (se abría al tocar). Ahora el contenido se ve
// siempre completo, para evitar clics: solo queda el título como encabezado.
export function BotonNaranjaDesplegable({ titulo, children }) {
  return (
    <div className="rounded-xl border-2 border-[#0f2d1e] overflow-hidden shadow-sm">
      <div className="w-full text-left bg-[#e65100] p-3">
        <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">{titulo}</p>
      </div>
      <div className="p-3 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export function Carrusel({ items, renderItem, intervaloMs = 4000 }) {
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervaloMs);
    return () => clearInterval(id);
  }, [pausado, items.length, intervaloMs]);

  // Precarga en segundo plano todas las fotos del carrusel apenas
  // llegan (o cambian) los items, para que ya estén en caché del
  // navegador cuando el carrusel las quiera mostrar (evita el
  // parpadeo/foto en blanco en la primera visita al sitio).
  useEffect(() => {
    items.forEach((item) => {
      if (item.img) {
        const imgPrecarga = new Image();
        imgPrecarga.src = resolverSrcImagen(item.img);
      }
    });
  }, [items]);

  const anterior = () => { setIndex((i) => (i - 1 + items.length) % items.length); setPausado(true); };
  const siguiente = () => { setIndex((i) => (i + 1) % items.length); setPausado(true); };

  const item = items[index];

  return (
    <div className="rounded-2xl border-4 border-[#0f2d1e] bg-white overflow-hidden shadow-md">
      <div className="relative flex items-center">

        <button
          onClick={anterior}
          aria-label="Anterior"
          className="absolute left-2 z-10 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/90 border-2 border-[#0f2d1e] text-[#0f2d1e] font-black shadow-md hover:bg-emerald-50 transition-colors"
        >
          ‹
        </button>

        {renderItem(item)}

        <button
          onClick={siguiente}
          aria-label="Siguiente"
          className="absolute right-2 z-10 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/90 border-2 border-[#0f2d1e] text-[#0f2d1e] font-black shadow-md hover:bg-emerald-50 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-3 border-t border-[#0f2d1e]/10 bg-emerald-50/60">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setPausado(true); }}
            aria-label={`Ir al elemento ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-emerald-700" : "bg-emerald-700/30"}`}
          />
        ))}
        <button
          onClick={() => setPausado((p) => !p)}
          className="ml-3 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
        >
          {pausado ? "▶ Reanudar" : "❚❚ Pausar"}
        </button>
      </div>
    </div>
  );
}

export function TarjetaCarrusel({ item, etiqueta, mostrarDetallesVenta = false }) {
  const srcImagen = resolverSrcImagen(item.img);

  return (
    <div className="w-full grid sm:grid-cols-2">
      <div className="aspect-video sm:aspect-square bg-emerald-100">
        <img
          key={item.id || srcImagen}
          src={srcImagen}
          alt={item.nombre}
          loading="lazy"
          className="w-full h-full object-contain"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <div className="p-5 flex flex-col justify-center gap-2">
        <span className="inline-block w-fit rounded-full bg-emerald-200 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-800">
          {etiqueta}
        </span>
        <p className="text-lg sm:text-xl font-black text-[#0f2d1e] uppercase leading-tight">{item.nombre}</p>
        {item.codigo && (
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Código: {item.codigo}</p>
        )}
        <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.descripcion}</p>
        {mostrarDetallesVenta && (
          <div className="mt-1 space-y-1">
            {item.precio && (
              <p className="text-base font-black text-[#0f2d1e]">
                ${item.precio} <span className="font-medium text-xs text-slate-600">MXN</span>
              </p>
            )}
            {item.proveedor && (
              <p className="text-xs font-bold text-slate-600">Proveedor: {item.proveedor}</p>
            )}
            {item.notas && (
              <p className="text-xs text-slate-500 italic">{item.notas}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Arma el iframe correcto según la plataforma detectada por detectarVideo().
export function IframeVideo({ video, className }) {
  if (video.plataforma === "tiktok") {
    return (
      <iframe
        className={className}
        src={`https://www.tiktok.com/embed/v2/${video.id}`}
        title="Video de TikTok"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }
  if (video.plataforma === "facebook") {
    return (
      <iframe
        className={className}
        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=false&autoplay=true`}
        title="Video de Facebook"
        allow="autoplay; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  if (video.plataforma === "vimeo") {
    return (
      <iframe
        className={className}
        src={`https://player.vimeo.com/video/${video.id}?autoplay=1`}
        title="Video de Vimeo"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <iframe
      className={className}
      src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
      title="Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

// Miniatura de un video: para YouTube usamos su miniatura pública real; para
// TikTok, Facebook y Vimeo no hay una URL de miniatura simple sin hacer una
// petición aparte, así que mostramos una tarjeta con su logo — igual de
// clicable.
export function MiniaturaVideo({ video, nombre }) {
  if (video.plataforma === "tiktok") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#111] to-[#000]">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
        </svg>
        <span className="text-white text-[9px] font-black uppercase tracking-wide">Ver en TikTok</span>
      </div>
    );
  }
  if (video.plataforma === "facebook") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#1a3a6e] to-[#0d1f3d]">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
        <span className="text-white text-[9px] font-black uppercase tracking-wide">Ver en Facebook</span>
      </div>
    );
  }
  if (video.plataforma === "vimeo") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-[#0a1e26] to-[#062832]">
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881-.646-2.361-1.291-4.729-1.937-7.089-.717-2.588-1.488-3.881-2.309-3.881-.178 0-.806.378-1.878 1.132l-1.116-1.436c1.191-1.049 2.371-2.089 3.554-3.131 1.601-1.379 2.798-2.101 3.598-2.174 1.884-.183 3.044 1.11 3.479 3.881.472 2.994.798 4.858.977 5.593.539 2.442 1.132 3.667 1.777 3.667.502 0 1.256-.796 2.257-2.394 1.005-1.596 1.545-2.807 1.622-3.639.147-1.379-.401-2.077-1.625-2.077-.578 0-1.174.132-1.786.396 1.191-3.9 3.462-5.79 6.809-5.687 2.478.074 3.65 1.677 3.517 4.788z" />
        </svg>
        <span className="text-white text-[9px] font-black uppercase tracking-wide">Ver en Vimeo</span>
      </div>
    );
  }
  return (
    <img
      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
      alt={nombre}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
    />
  );
}

export function PasarelaExtraviados() {
  const items = useCatalogoBaserow(BASEROW_TABLE_ID_EXTRAVIADOS, EXTRAVIADOS_ITEMS);
  return (
    <Carrusel
      items={items}
      renderItem={(item) => (
        <TarjetaCarrusel item={item} etiqueta={item.tipo ? `${item.tipo} extraviad${item.tipo === "Persona" ? "a" : "o"}` : ""} />
      )}
    />
  );
}

export function PasarelaVentasConCausa() {
  const items = useCatalogoBaserow(BASEROW_TABLE_ID_VENTAS_CON_CAUSA, VENTAS_CON_CAUSA_ITEMS);
  return (
    <Carrusel
      items={items}
      renderItem={(item) => (
        <TarjetaCarrusel item={item} etiqueta={item.tipo} mostrarDetallesVenta />
      )}
    />
  );
}
