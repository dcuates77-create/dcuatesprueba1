import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { BotonCerrar } from "./legal.jsx";
import { IframeVideo } from "./media.jsx";
import { LOGROS_ITEMS, TICKER_ETIQUETAS, TICKER_FRASES } from "../datos/cintas.js";
import { detectarVideo, enlaceWhatsApp, esPDF, paresBaserow, urlDesdeCeldaBaserow, useCarruselAutomatico, useFilasEnlaces } from "../utilidades/baserow.js";

export const TICKER_ITEMS = [
  { tipo: "negocio", nombre: "Taquería El Sol — 20% en tu primera visita", img: "/images/ticker-negocio-1.png", enlace: enlaceWhatsApp("¡Hola! Vi la promoción de Taquería El Sol en DCUATES.") },
  { tipo: "mascota", nombre: "Firulais — en búsqueda por la colonia centro", img: "/images/ticker-mascota-1.png", enlace: "#ecatepets" },
  { tipo: "aviso", texto: "🎉 Bazar comunitario este sábado en la plaza principal, 10am–4pm" },
  { tipo: "momento", nombre: "Entrega de libros de la Bibliobici, agosto 2026", img: "/images/ticker-momento-1.png", enlace: "#libros" },
  { tipo: "negocio", nombre: "Estética Lupita — corte + peinado con descuento", img: "/images/ticker-negocio-2.png", enlace: enlaceWhatsApp("¡Hola! Vi la promoción de Estética Lupita en DCUATES.") },
  { tipo: "mascota", nombre: "Michi — en adopción, ya vacunada y esterilizada", img: "/images/ticker-mascota-2.png", enlace: "#ecatepets" },
  { tipo: "aviso", texto: "📚 Nueva alianza con la papelería del barrio: 10% para vecinos DCUATES" },
  { tipo: "momento", nombre: "Taller de bienestar comunitario, julio 2026", img: "/images/ticker-momento-2.png", enlace: "#bienestar" }
];

// =========================================================================
// 5. SUBCOMPONENTE: BARRA TICKER INFERIOR (negocios / mascotas / avisos / momentos)
// =========================================================================
// Una sola fila del ticker — recibe el arreglo de items a mostrar y su
// propio índice (así el mismo componente sirve tanto para el ticker
// superior de frases, como para el/los ticker(s) inferior(es) de negocios).
export function FilaTicker({ items, index, onClose, mostrarCerrar }) {
  const item = items[index];
  const etiqueta = TICKER_ETIQUETAS[item.tipo];
  const esExterno = item.enlace && item.enlace.startsWith("http");

  return (
    <div className="mx-auto max-w-6xl flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1.5">

      <span className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 shrink-0 border-r border-emerald-700/50 pr-3">
        <span>{etiqueta.emoji}</span> {etiqueta.label}
      </span>

      <a
        key={index}
        href={item.enlace || "#"}
        target={esExterno ? "_blank" : undefined}
        rel={esExterno ? "noopener noreferrer" : undefined}
        className="flex-1 flex items-center gap-3 text-white overflow-hidden min-w-0"
      >
        <span className="sm:hidden text-lg shrink-0">{etiqueta.emoji}</span>
        {item.img && (
          <img
            src={item.img}
            alt=""
            loading="lazy"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-cover shrink-0 border border-white/20"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <span className="text-xs sm:text-sm font-bold truncate">
          {item.texto || item.nombre}
        </span>
      </a>

      <div className="hidden sm:flex items-center gap-1 shrink-0">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-emerald-300" : "bg-emerald-700/60"}`}
          />
        ))}
      </div>

      {mostrarCerrar && (
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white text-xl leading-none shrink-0 pl-1"
          title="Cerrar barra"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Barra de Logros y Resultados — se coloca en el encabezado, debajo de la
// barra de frases motivacionales (TickerFrases). Casi el doble de alta que
// un renglón normal de ticker, para que los resultados/impacto de los
// proyectos (transparencia y utilidad del programa) resalten más. Antes
// esta información vivía como la "segunda fila" de la barra inferior fija
// (BarraTicker) — se movió aquí y se le cambió el contenido a logros.
export function BarraLogros() {
  const [index, setIndex] = useState(0);

  const filasEnlaces = useFilasEnlaces();
  const logrosBaserow = paresBaserow(filasEnlaces, "NOMBRE LOGROS", "ENLACE LOGROS", 20);
  const itemsLogros = logrosBaserow.length > 0 ? logrosBaserow : LOGROS_ITEMS;

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % itemsLogros.length);
    }, 5000);
    return () => clearInterval(id);
  }, [itemsLogros.length]);

  const item = itemsLogros[index];
  const esExterno = item.enlace && item.enlace.startsWith("http");

  return (
    <div className="bg-[#0f2d1e] border-b-2 border-emerald-700/50">
      <a
        key={index}
        href={item.enlace || "#"}
        target={esExterno ? "_blank" : undefined}
        rel={esExterno ? "noopener noreferrer" : undefined}
        className="mx-auto max-w-6xl flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4"
      >
        <span className="hidden sm:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-300 shrink-0 border-r border-emerald-700/50 pr-4">
          🏆 Logros DCUATES
        </span>
        <span className="text-sm sm:text-base font-bold text-white flex-1 min-w-0 truncate">
          {item.texto || item.nombre}
        </span>
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {itemsLogros.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-amber-300" : "bg-emerald-700/60"}`}
            />
          ))}
        </div>
      </a>
    </div>
  );
}

// Ticker SUPERIOR — frases de solidaridad y llamados a sumarse. No es fijo
// (queda fijo junto con el encabezado, dentro del mismo contenedor "sticky"
// en el render principal): vive pegado debajo de él, visible siempre.
export function TickerFrases() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Frases desde Baserow (sin tocar código): crea en la tabla ENLACES 2
  // columnas de texto — "FRASE TICKER" y "ENLACE FRASE TICKER" — una fila
  // por frase. En cuanto haya al menos una fila con esas 2 columnas
  // llenas, sustituyen a las frases de ejemplo de abajo.
  const filasEnlaces = useFilasEnlaces();
  const frasesBaserow = paresBaserow(filasEnlaces, "FRASE TICKER", "ENLACE FRASE TICKER", 20).map((f) => ({
    tipo: "frase",
    texto: f.nombre,
    enlace: f.enlace
  }));
  const itemsFrases = frasesBaserow.length > 0 ? frasesBaserow : TICKER_FRASES;

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % itemsFrases.length);
    }, 5000);
    return () => clearInterval(id);
  }, [visible, itemsFrases.length]);

  if (!visible) return null;

  return (
    <div className="bg-[#0f2d1e] border-b-2 border-emerald-700/50">
      <FilaTicker items={itemsFrases} index={index} onClose={() => setVisible(false)} mostrarCerrar={true} />
    </div>
  );
}

// Ticker INFERIOR fijo — anuncios de negocios, productos y servicios,
// mascotas y avisos comunitarios. Dos filas simultáneas que rotan de forma
// independiente (desfasadas a la mitad del arreglo) para mostrar el doble
// de contenido sin esperar tanto tiempo entre anuncios.
// Barra de patrocinadores/aliados — una tira ancha y deslizable de
// imágenes reducidas; al tocar una se amplía en una ventana flotante
// (mismo patrón que la barra de videos). Se alimenta de 3 columnas en la
// tabla ENLACES de Baserow: "PATROCINADORES" (Archivo/Adjunto — la
// imagen), "NOMBRE PATROCINADORES" (texto) y "ENLACE PATROCINADORES"
// (texto, opcional). Si "ENLACE PATROCINADORES" es una liga de YouTube, al
// tocar la miniatura se abre el video en grande (igual que en la barra de
// videos); si es cualquier otra liga (una web, un PDF, un documento), se
// abre en una pestaña nueva; si no hay ninguna liga, solo se amplía la
// imagen. No aparece nada en la página si todavía no hay ninguna fila con
// imagen en "PATROCINADORES".
export function BarraPatrocinadores() {
  const filasEnlaces = useFilasEnlaces();
  const [imagenEnGrande, setImagenEnGrande] = useState(null);
  const [videoEnGrande, setVideoEnGrande] = useState(null);
  const [pdfEnGrande, setPdfEnGrande] = useState(null);

  const items = filasEnlaces
    .map((f) => ({
      img: f && urlDesdeCeldaBaserow(f["PATROCINADORES"]),
      nombre: (f && f["NOMBRE PATROCINADORES"]) || "",
      enlace: (f && f["ENLACE PATROCINADORES"]) || ""
    }))
    .filter((it) => it.img)
    .slice(0, 20);

  const { scrollRef, onPointerDown } = useCarruselAutomatico(items.length);

  if (items.length === 0) return null;

  const alTocar = (item) => {
    const video = item.enlace ? detectarVideo(item.enlace) : null;
    if (video) {
      setVideoEnGrande(video);
    } else if (item.enlace && esPDF(item.enlace)) {
      setPdfEnGrande(item.enlace);
    } else if (item.enlace && item.enlace.startsWith("http")) {
      window.open(item.enlace, "_blank", "noopener,noreferrer");
    } else {
      setImagenEnGrande(item.img);
    }
  };

  return (
    <div className="bg-[#17472d] py-5 px-4 border-t-4 border-b-4 border-[#0f2d1e]">
      <div className="mx-auto max-w-6xl">
        <p className="text-emerald-300 font-black uppercase text-lg sm:text-2xl tracking-wide text-center mb-3 px-2 leading-snug">
          Muchas gracias a nuestros Patrocinadores y Amigos por su valiosa confianza y apoyo ⭐⭐⭐⭐⭐
        </p>
        <div
          ref={scrollRef}
          onPointerDown={onPointerDown}
          className="flex items-center gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory"
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => alTocar(item)}
              className="shrink-0 snap-start w-32 sm:w-40 group"
              title={item.nombre || "Ver más grande"}
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-white/10 group-hover:border-[#e65100] transition-colors bg-black/20">
                <img
                  src={item.img}
                  alt={item.nombre}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              {item.nombre && (
                <p className="text-white text-[10px] font-bold text-center mt-1 truncate">{item.nombre}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {imagenEnGrande && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setImagenEnGrande(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={imagenEnGrande} alt="" className="w-full h-auto rounded-2xl border-4 border-white/20 shadow-2xl" />
          
            <div className="mt-3 flex justify-end">
              <BotonCerrar claro onClick={() => setImagenEnGrande(null)} label="Cerrar imagen" />
            </div>
</div>
        </div>
      )}

      {videoEnGrande && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setVideoEnGrande(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl aspect-video bg-black">
              <IframeVideo video={videoEnGrande} className="w-full h-full" />
            </div>
          
            <div className="mt-3 flex justify-end">
              <BotonCerrar claro onClick={() => setVideoEnGrande(null)} label="Cerrar video" />
            </div>
</div>
        </div>
      )}

      {pdfEnGrande && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setPdfEnGrande(null)}
        >
          <div className="relative w-full max-w-3xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex-1 min-h-0 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white">
              <iframe src={pdfEnGrande} title="Documento PDF" className="w-full h-full" />
            </div>
            <a
              href={pdfEnGrande}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-8 left-0 text-white text-xs font-bold underline underline-offset-2 hover:text-[#e65100]"
            >
              Abrir en pestaña nueva
            </a>
          
            <div className="mt-3 flex justify-end">
              <BotonCerrar claro onClick={() => setPdfEnGrande(null)} label="Cerrar documento" />
            </div>
</div>
        </div>
      )}
    </div>
  );
}

export function BarraTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Anuncios desde Baserow (sin tocar código): crea en la tabla ENLACES 2
  // columnas de texto — "NOMBRE TICKER" y "ENLACE TICKER" — una fila por
  // anuncio. En cuanto haya al menos una fila con esas 2 columnas llenas,
  // sustituyen automáticamente a los anuncios de ejemplo de abajo.
  const filasEnlaces = useFilasEnlaces();
  const tickerBaserow = paresBaserow(filasEnlaces, "NOMBRE TICKER", "ENLACE TICKER", 20).map((t) => ({
    tipo: "aviso",
    texto: t.nombre,
    enlace: t.enlace
  }));
  const itemsTicker = tickerBaserow.length > 0 ? tickerBaserow : TICKER_ITEMS;

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % itemsTicker.length);
    }, 4500);
    return () => clearInterval(id);
  }, [visible, itemsTicker.length]);

  // Publica el alto real de esta barra (--alto-ticker) para que los botones
  // flotantes queden justo encima, sin importar el dispositivo.
  const barraRef = useRef(null);
  useLayoutEffect(() => {
    const raiz = document.documentElement;
    if (!visible || !barraRef.current) { raiz.style.setProperty("--alto-ticker", "0px"); return; }
    const medir = () => raiz.style.setProperty("--alto-ticker", `${Math.round(barraRef.current.getBoundingClientRect().height)}px`);
    medir();
    let ro;
    if (typeof ResizeObserver !== "undefined") { ro = new ResizeObserver(medir); ro.observe(barraRef.current); }
    window.addEventListener("resize", medir);
    return () => { ro?.disconnect(); window.removeEventListener("resize", medir); };
  }, [visible, itemsTicker.length]);

  if (!visible) return null;

  return (
    <div ref={barraRef} className="fixed bottom-0 inset-x-0 z-40 bg-[#17472d] border-t-2 border-emerald-700/50 shadow-[0_-4px_12px_rgba(0,0,0,0.25)]">
      <FilaTicker items={itemsTicker} index={index} onClose={() => setVisible(false)} mostrarCerrar={true} />
    </div>
  );
}
