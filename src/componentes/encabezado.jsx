// =========================================================================
// src/componentes/encabezado.jsx — Encabezado, buscador, menú y accesos rápidos
// =========================================================================
import React, { useState, useEffect } from "react";
import { BotonCerrar, CasillaAcepto, ErrorAcepto, abrirLegal, useAceptacion } from "./legal.jsx";
import { BotonRecibeBeneficios } from "./ventanas.jsx";
import { NAV_LINKS_MAS, REDES_SOCIALES, SECCIONES_BUSCABLES, VERSION_BUILD } from "../datos/config.js";
import { FAQ_ITEMS } from "../datos/legal.js";
import { NECESIDADES_GRUPOS, TODOS_LOS_PROYECTOS } from "../datos/listas.js";
import { BOTONES_PORTADA, CATEGORIAS_PROYECTOS, normalizarBusqueda } from "../datos/proyectos.js";
import { enlaceWhatsApp, irASeccion } from "../utilidades/baserow.js";
import { registrar } from "../analitica";

export function BarraBusqueda({ onAbrirProyecto, onAbrirCategoria, onAbrirFAQ, abierta, setAbierta }) {
  const [texto, setTexto] = useState("");
  const inputRef = React.useRef(null);

  const indice = React.useMemo(() => {
    const lista = [];
    CATEGORIAS_PROYECTOS.forEach((c) => lista.push({
      t: c.titulo, tipo: "Categoría", emoji: c.emoji,
      kw: `${c.slogan} ${c.descripcion}`, accion: () => onAbrirCategoria && onAbrirCategoria(c.id)
    }));
    BOTONES_PORTADA.forEach((b) => {
      const p = TODOS_LOS_PROYECTOS.find((x) => x.id === b.modal);
      lista.push({
        t: b.t, tipo: "Proyecto", emoji: "📌",
        kw: p ? `${p.titulo} ${p.descripcion} ${(p.puntos || []).join(" ")}` : "",
        accion: () => onAbrirProyecto && onAbrirProyecto(b.modal)
      });
    });
    FAQ_ITEMS.forEach((f) => lista.push({
      t: f.pregunta, tipo: "Pregunta frecuente", emoji: "❓",
      kw: f.respuesta, accion: () => onAbrirFAQ && onAbrirFAQ()
    }));
    SECCIONES_BUSCABLES.forEach((x) => lista.push({
      t: x.t, tipo: "Sección", emoji: "📍", kw: x.kw,
      accion: () => (x.id === "seguridad" || x.id === "escudo") ? abrirLegal(x.id) : setTimeout(() => irASeccion(x.id), 60)
    }));
    return lista.map((it) => ({ ...it, _n: normalizarBusqueda(`${it.t} ${it.kw}`) }));
  }, []);

  const palabras = normalizarBusqueda(texto).split(/\s+/).filter(Boolean);
  const resultados = palabras.length && normalizarBusqueda(texto).length >= 2
    ? indice.filter((it) => palabras.every((w) => it._n.includes(w))).slice(0, 8)
    : [];

  const elegir = (it) => { setTexto(""); setAbierta(false); it.accion(); };
  const abrirBusqueda = () => {
    setAbierta(true);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  };

  // Botón pequeño (mismo tamaño y estilo que Inicio/Apoyo Voluntario/Más):
  // solo despliega la ventana de búsqueda al tocarlo, en vez de ocupar su
  // propio renglón todo el tiempo.
  if (!abierta) {
    return (
      <button
        type="button"
        onClick={abrirBusqueda}
        aria-label="Buscar en DCUATES"
        title="Buscar"
        className="flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-[#0f2d1e] transition-colors hover:bg-emerald-50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 fill-none stroke-current stroke-[2.5]" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center bg-black/50 p-4 pt-24 sm:pt-28" onClick={() => setAbierta(false)}>
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 rounded-full border-2 border-[#0f2d1e]/30 bg-white pl-3.5 pr-3.5 py-2 shadow-2xl focus-within:border-[#e65100]">
          <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 fill-none stroke-[#0f2d1e] stroke-[2.5]" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") setAbierta(false); if (e.key === "Enter" && resultados[0]) elegir(resultados[0]); }}
            placeholder="Buscar proyectos, apoyos, preguntas…"
            aria-label="Buscar en DCUATES"
            className="w-full min-w-0 bg-transparent text-sm font-bold text-[#0f2d1e] placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        {palabras.length > 0 && (
          <div className="mt-1 rounded-2xl bg-white shadow-xl border border-emerald-800/10 py-1 max-h-[60vh] overflow-y-auto">
            {resultados.length === 0 ? (
              <p className="px-4 py-3 text-xs font-bold text-slate-500">Sin resultados para “{texto}”. Prueba con otra palabra.</p>
            ) : (
              resultados.map((it, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => elegir(it)}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors flex items-start gap-2"
                >
                  <span aria-hidden="true">{it.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-black text-[#0f2d1e] leading-tight">{it.t}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-[#e65100]">{it.tipo}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <BotonCerrar claro onClick={() => setAbierta(false)} label="Cerrar búsqueda" />
        </div>
      </div>
    </div>
  );
}

export function SiteHeader({ onAbrirFAQ, onAbrirPrivacidad, onAbrirTerminos, onAbrirSeguridad, onAbrirEscudo, onAbrirProyecto, onAbrirSugerencias, onAbrirMapaSitio, onAbrirCategoria, busquedaAbierta, setBusquedaAbierta }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Colores alternados del menú (combinan con el verde, el naranja y el azul
  // turquesa que ya usa la página).
  const COLORES_MENU = ["#17472d", "#bf360c", "#1B6F8A"];
  const cerrar = () => setMenuAbierto(false);
  const claseFila = "w-full flex items-center gap-3 px-4 py-2.5 text-left uppercase tracking-wide text-[11px] sm:text-xs font-black hover:bg-emerald-50 transition-colors";
  const claseIcono = "flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-[#0f2d1e] transition-colors hover:bg-emerald-50";
  return (
    <header className="border-b border-emerald-800/20 bg-white/95 py-2 px-4 shadow-sm text-slate-900 relative">
      <div className="mx-auto flex items-center gap-3 max-w-6xl">

        {/* Logo + nombre — siempre primero, en la misma fila que las redes en móvil */}
        <div className="order-1 flex items-center gap-2 sm:gap-3 min-w-0 flex-1 md:flex-none">
        <a href="#inicio" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full overflow-hidden bg-[#0f2d1e] border-2 border-[#0f2d1e]/20 shadow-sm shrink-0">
            <img
              src="/images/logo-circular.png"
              alt="Logo DCUATES"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="font-black text-white text-2xl">DC</span>';
              }}
            />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
            <span className="text-xs sm:text-sm md:text-base font-black uppercase tracking-wide text-[#e65100] -mt-0.5">¡Comparte y Gana!</span>
          </div>
        </a>
        </div>

        {/* Íconos a la derecha, en dos filas: arriba las redes; abajo la lupa
            (bajo YouTube) y el menú de tres rayas (bajo TikTok). */}
        <div className="order-2 ml-auto flex flex-col items-end gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-3">
          <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" className="flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Facebook">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" className="flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Instagram">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" className="flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="YouTube">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" className="flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="TikTok">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
            </svg>
          </a>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Búsqueda: ícono de lupa; abre una ventana de búsqueda al tocarlo. */}
            <BarraBusqueda onAbrirProyecto={onAbrirProyecto} onAbrirCategoria={onAbrirCategoria} onAbrirFAQ={onAbrirFAQ} abierta={busquedaAbierta} setAbierta={setBusquedaAbierta} />

            {/* Menú de tres rayas — antes botón "Más". */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuAbierto((v) => !v)}
                aria-label="Abrir menú"
                aria-expanded={menuAbierto}
                title="Menú"
                className={claseIcono}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 fill-none stroke-current stroke-[2.5]" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                  <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                  <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
                </svg>
              </button>

              {menuAbierto && (
                <>
                  {/* Fondo invisible para cerrar el menú al tocar fuera */}
                  <div className="fixed inset-0 z-30" onClick={cerrar} />
                  <div className="absolute right-0 top-full mt-2 z-40 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-emerald-800/10 py-2 flex flex-col max-h-[70vh] overflow-y-auto">
                    {NAV_LINKS_MAS.map((link, i) => {
                      const color = COLORES_MENU[i % COLORES_MENU.length];
                      const contenido = (
                        <>
                          <span className="text-lg leading-none w-6 text-center shrink-0" aria-hidden="true">{link.emoji}</span>
                          <span style={{ color }}>{link.label}</span>
                        </>
                      );
                      return link.href ? (
                        <a key={link.label} href={link.href} onClick={cerrar} className={claseFila}>{contenido}</a>
                      ) : (
                        <button
                          type="button"
                          key={link.label}
                          onClick={() => {
                            cerrar();
                            if (link.action === "faq") onAbrirFAQ && onAbrirFAQ();
                            else if (link.action === "sugerencias") onAbrirSugerencias && onAbrirSugerencias();
                            else if (link.action === "mapa-sitio") onAbrirMapaSitio && onAbrirMapaSitio();
                            else if (link.modal) onAbrirProyecto && onAbrirProyecto(link.modal);
                          }}
                          className={claseFila}
                        >
                          {contenido}
                        </button>
                      );
                    })}
                    <div className="border-t border-emerald-800/10 my-1" />
                    <button
                      type="button"
                      onClick={() => { cerrar(); onAbrirPrivacidad && onAbrirPrivacidad(); }}
                      className={claseFila}
                    >
                      <span className="text-lg leading-none w-6 text-center shrink-0" aria-hidden="true">🔒</span>
                      <span style={{ color: COLORES_MENU[NAV_LINKS_MAS.length % COLORES_MENU.length] }}>Aviso de Privacidad</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { cerrar(); onAbrirTerminos && onAbrirTerminos(); }}
                      className={claseFila}
                    >
                      <span className="text-lg leading-none w-6 text-center shrink-0" aria-hidden="true">📜</span>
                      <span style={{ color: COLORES_MENU[(NAV_LINKS_MAS.length + 1) % COLORES_MENU.length] }}>Términos y Condiciones</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { cerrar(); onAbrirSeguridad && onAbrirSeguridad(); }}
                      className={claseFila}
                    >
                      <span className="text-lg leading-none w-6 text-center shrink-0" aria-hidden="true">⚠️</span>
                      <span style={{ color: "#b3261e" }}>Aviso de Seguridad</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { cerrar(); onAbrirEscudo && onAbrirEscudo(); }}
                      className={claseFila}
                    >
                      <span className="text-lg leading-none w-6 text-center shrink-0" aria-hidden="true">🛡️</span>
                      <span style={{ color: "#0b6e5f" }}>Escudo de Seguridad</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// =========================================================================
// 3B. SUBCOMPONENTE: BOTÓN FLOTANTE DE NAVEGACIÓN POR NECESIDADES
// =========================================================================
// Botón naranja parpadeante, pegado justo debajo de la barra de frases (ver
// dónde se renderiza en App(), dentro del contenedor "sticky" del
// encabezado) con menú de 2 niveles: toca el botón para ver las 4
// categorías, toca una categoría para ver sus preguntas, toca una pregunta
// para ir directo al modal/sección/WhatsApp correspondiente (ver
// NECESIDADES_GRUPOS arriba). Se autogestiona su propio estado — solo
// necesita los 2 callbacks para abrir el modal de proyecto o una acción
// especial (por ahora, solo "comparte").
export function BotonNecesidades({ onAbrirProyecto, onAccionEspecial, onAbrirFAQ }) {
  const ac = useAceptacion();
  const [abierto, setAbierto] = useState(false);
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  // Texto libre para la opción "Otro(s)" — al final de la ventana, para lo
  // que no encaje en ninguna categoría.
  const [textoOtro, setTextoOtro] = useState("");

  // Cómo se ve cada categoría (emoji y colores alternados terracota / verde).
  const ESTILO_GRUPO = {
    mascotas: { emoji: "🐾", fondo: "#d9856a" },
    negocios: { emoji: "🤝", fondo: "#7fb08f" },
    "apoyos-mutuos": { emoji: "🎁", fondo: "#7fb08f" },
    "conocer-mas": { emoji: "⭐", fondo: "#d9856a" }
  };

  const cerrarTodo = () => {
    setAbierto(false);
    setGrupoAbierto(null);
  };

  const enviarOtro = () => {
    if (!ac.validar()) return;
    if (!textoOtro.trim()) return;
    registrar("necesidad_otro");
    window.open(enlaceWhatsApp(`¡Hola DCUATES! ${textoOtro.trim()}`), "_blank", "noopener,noreferrer");
    setTextoOtro("");
    ac.reiniciar();
    cerrarTodo();
  };

  const alTocarPregunta = (p) => {
    registrar("necesidad", { tema: String(p.texto).slice(0, 50) });
    cerrarTodo();
    if (p.modal) onAbrirProyecto && onAbrirProyecto(p.modal);
    else if (p.action) onAccionEspecial && onAccionEspecial(p.action);
    else if (p.enlace) window.open(p.enlace, "_blank", "noopener,noreferrer");
  };

  const irA = (id) => {
    cerrarTodo();
    setTimeout(() => irASeccion(id), 150);
  };

  const grupo = NECESIDADES_GRUPOS.find((g) => g.id === grupoAbierto);

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="bg-yellow-400 text-[#0f2d1e] text-[10px] sm:text-xs font-black uppercase tracking-wide px-2.5 py-1.5 rounded-full shadow-lg border border-white/30 whitespace-nowrap animate-pulse">
          ¿Qué necesitas hoy?
        </span>
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-[#0f2d1e] shadow-[0_10px_20px_rgba(0,0,0,0.35),inset_0_-3px_6px_rgba(0,0,0,0.25),inset_0_3px_4px_rgba(255,255,255,0.5)] transition-transform active:scale-95"
          title="¿Qué necesitas hoy?"
          aria-label="¿Qué necesitas hoy?"
        >
          <span className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-60"></span>
          <span className="relative z-10 text-2xl font-black drop-shadow">?</span>
        </button>
      </div>

      {abierto && (
        <div
          className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-black/55 p-3"
          onClick={cerrarTodo}
        >
          <div
            className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="¿Qué necesitas hoy?"
          >
            <div className="p-5 pb-3">
              <p className="font-black uppercase text-[#0f2d1e] text-xl sm:text-2xl leading-tight">
                ¿Qué necesitas hoy? <span aria-hidden="true">😊</span>
              </p>
            </div>

            {!grupo ? (
              <div className="px-5 pb-2 space-y-3">
                {/* Las 4 categorías, como tarjetas grandes */}
                <div className="grid grid-cols-2 gap-3">
                  {NECESIDADES_GRUPOS.map((g) => {
                    const est = ESTILO_GRUPO[g.id] || { emoji: "✨", fondo: "#7fb08f" };
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setGrupoAbierto(g.id)}
                        style={{ backgroundColor: est.fondo }}
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl px-2 py-4 min-h-[118px] text-center text-white shadow-md border-b-4 border-black/20 active:translate-y-0.5 active:border-b-2 transition-all"
                      >
                        <span className="text-4xl leading-none drop-shadow" aria-hidden="true">{est.emoji}</span>
                        <span className="font-black uppercase text-[13px] sm:text-sm leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">{g.titulo}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => irA("extraviados-registro")}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-[13px] sm:text-sm leading-tight px-4 py-4 shadow-md text-center transition-colors"
                >
                  <span className="text-2xl" aria-hidden="true">🐾</span>
                  Reportar caso: mascotas, personas, cosas
                </button>
                <button
                  type="button"
                  onClick={() => irA("mapa-negocios")}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#4f9d6a] hover:bg-[#3f8657] text-white font-black uppercase text-[13px] sm:text-sm leading-tight px-4 py-4 shadow-md text-center transition-colors"
                >
                  <span className="text-2xl" aria-hidden="true">🗺️</span>
                  Ver mapa de negocios locales
                </button>
                <button
                  type="button"
                  onClick={() => { cerrarTodo(); onAbrirFAQ && onAbrirFAQ(); }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-[#0f2d1e] font-black uppercase text-xs px-4 py-3 border-2 border-emerald-200 transition-colors"
                >
                  <span aria-hidden="true">❓</span> Preguntas frecuentes
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { cerrarTodo(); abrirLegal("seguridad"); }}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-red-50 hover:bg-red-100 text-[#b3261e] font-black uppercase text-[11px] leading-tight px-2 py-3 border-2 border-red-200 text-center transition-colors"
                  >
                    <span aria-hidden="true">⚠️</span> Aviso de Seguridad
                  </button>
                  <button
                    type="button"
                    onClick={() => { cerrarTodo(); abrirLegal("escudo"); }}
                    className="flex items-center justify-center gap-1.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-[#0b6e5f] font-black uppercase text-[11px] leading-tight px-2 py-3 border-2 border-teal-200 text-center transition-colors"
                  >
                    <span aria-hidden="true">🛡️</span> Escudo de Seguridad
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 pb-2">
                {/* Preguntas de la categoría elegida */}
                <button
                  type="button"
                  onClick={() => setGrupoAbierto(null)}
                  className="mb-3 inline-flex items-center gap-1 rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-black uppercase text-[#0f2d1e] transition-colors"
                >
                  ‹ Volver
                </button>
                <p
                  className="mb-2 rounded-xl px-3 py-2 font-black uppercase text-sm"
                  style={{ backgroundColor: grupo.colorFuerte, color: grupo.colorTexto }}
                >
                  {(ESTILO_GRUPO[grupo.id] || {}).emoji} {grupo.titulo}
                </p>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {grupo.preguntas.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => alTocarPregunta(p)}
                      style={{ backgroundColor: i % 2 === 0 ? grupo.colorClaro : "#ffffff", color: grupo.colorTexto }}
                      className="w-full text-left px-4 py-3 text-sm font-bold hover:brightness-95 transition-all leading-snug"
                    >
                      {p.texto}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 pt-3 space-y-2">
              <p className="font-black uppercase text-[#0f2d1e] text-xs">Otro(s)</p>
              <textarea
                value={textoOtro}
                onChange={(e) => setTextoOtro(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Cuéntanos qué necesitas y te contactamos por WhatsApp..."
                rows={2}
                className="w-full rounded-xl border-2 border-emerald-200 px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#0f2d1e]"
              />
              <CasillaAcepto ac={ac} id="acepta_terminos_privacidad_otro" />
              <button
                type="button"
                onClick={enviarOtro}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-yellow-400 text-[#0f2d1e] font-black uppercase text-sm py-3 shadow-md hover:brightness-95 transition-all"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25d366] text-white text-sm" aria-hidden="true">💬</span>
                Enviar por WhatsApp
              </button>
              <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_otro" />
            </div>

            <div className="sticky bottom-0 flex justify-end border-t border-emerald-100 bg-white/95 p-3">
              <BotonCerrar onClick={cerrarTodo} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Botón "Recibe Beneficios" del encabezado — abre un mini formulario de
// intereses (ver INTERESES_BENEFICIOS arriba) y arma el mensaje de WhatsApp
// con lo que la persona seleccionó.
// Accesos rápidos al final de la página (arriba de la barra de videos):
// Avisos y Beneficios, Compartir Más e Inicio — antes vivían en el menú superior.
// Sello de versión + estado de Baserow (temporal, para pruebas). Se puede
// borrar junto con VERSION_BUILD cuando ya no haga falta.
export function SelloVersion() {
  const [estado, setEstado] = useState(() => (typeof window !== "undefined" && window.__dcuatesBaserow) || null);
  useEffect(() => {
    const alCambiar = (e) => setEstado(e.detail);
    window.addEventListener("dcuates:baserow-estado", alCambiar);
    return () => window.removeEventListener("dcuates:baserow-estado", alCambiar);
  }, []);
  const texto = !estado
    ? "conectando…"
    : estado.ok
      ? `✓ ${estado.filas} filas`
      : `✗ ${String(estado.mensaje).slice(0, 90)}`;
  return (
    <p className="mt-3 text-center text-[10px] font-bold text-emerald-900/60 break-words">
      Versión {VERSION_BUILD} · Baserow: {texto}
    </p>
  );
}

export function BarraAccionesFinal({ onAbrirComparte }) {
  return (
    <section aria-label="Accesos rápidos" className="bg-[#e8f5e9] px-4 py-5 sm:py-6 border-b-4 border-[#0f2d1e]">
      <div className="mx-auto max-w-2xl md:max-w-4xl xl:max-w-6xl grid grid-cols-3 gap-2 sm:gap-4 items-stretch">
        <BotonRecibeBeneficios grande />
        <button
          type="button"
          onClick={() => onAbrirComparte && onAbrirComparte()}
          className="w-full min-h-[56px] rounded-2xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-md px-2 py-3 text-[11px] sm:text-sm font-black uppercase tracking-wide transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 text-center leading-tight"
        >
          <span>Compartir Más</span>
          <span aria-hidden="true">🌟</span>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-full min-h-[56px] rounded-2xl bg-[#17472d] hover:bg-[#0f2d1e] text-white shadow-md px-2 py-3 text-[11px] sm:text-sm font-black uppercase tracking-wide transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 text-center leading-tight"
        >
          <span>Inicio</span>
          <span aria-hidden="true">🏠</span>
        </button>
      </div>
      {/* Enlace directo a la barra de videos del final de la página */}
      <div className="mx-auto max-w-2xl md:max-w-4xl xl:max-w-6xl mt-3">
        <button
          type="button"
          onClick={() => irASeccion("historias-reflexiones")}
          className="w-full min-h-[48px] rounded-2xl border-2 border-[#0f2d1e] bg-white hover:bg-emerald-50 text-[#0f2d1e] shadow-sm px-3 py-2.5 text-[11px] sm:text-sm font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-2 text-center leading-tight"
        >
          <span aria-hidden="true">🎥</span>
          <span>Mira las historias que inspiran</span>
          <span aria-hidden="true">↓</span>
        </button>
      </div>
      <SelloVersion />
    </section>
  );
}

// Logo circular de DCUATES para encabezar las ventanas (si la imagen no
// carga, se muestra "DC" en su lugar).
export function LogoMarca({ tam = 64 }) {
  const [fallo, setFallo] = useState(false);
  return (
    <span
      style={{ width: tam, height: tam }}
      className="flex items-center justify-center rounded-full overflow-hidden bg-[#0f2d1e] border-4 border-white shadow-lg shrink-0"
    >
      {fallo ? (
        <span className="text-white font-black" style={{ fontSize: tam * 0.36 }}>DC</span>
      ) : (
        <img src="/images/logo-circular.png" alt="Logo DCUATES" className="w-full h-full object-contain" onError={() => setFallo(true)} />
      )}
    </span>
  );
}
