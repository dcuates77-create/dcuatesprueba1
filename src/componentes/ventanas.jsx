// =========================================================================
// src/componentes/ventanas.jsx — Ventanas emergentes (proyectos, dudas, mapa del sitio, compartir)
// =========================================================================
import React, { useState, useEffect } from "react";
import { LogoMarca } from "./encabezado.jsx";
import { BotonCerrar, CasillaAcepto, ErrorAcepto, VentanaMarca, abrirLegal, useAceptacion } from "./legal.jsx";
import { Carrusel, FlechaBlanca, PasarelaVentasConCausa, TarjetaCarrusel } from "./media.jsx";
import { PATROCINADORES_ALIANZAS_ITEMS } from "../datos/cintas.js";
import { MAPA_SITIO_EXTRA } from "../datos/config.js";
import { FAQ_ITEMS } from "../datos/legal.js";
import { TODOS_LOS_PROYECTOS } from "../datos/listas.js";
import { BASEROW_GALLERY_URL, BIENESTAR_GALERIA_ITEMS, BOTONES_PORTADA, CUPONES_PROMOS_ITEMS, DEGRADADO_AVISOS, DEGRADADO_COMPARTIR, DEGRADADO_DUDAS, DEGRADADO_SUGERENCIAS, EMOJIS_INTERESES, GALERIAS_PROYECTOS, HISTORIAS_DCUATES_ITEMS, INTERESES_BENEFICIOS, NOTICIAS_GALERIA_ITEMS, OPCIONES_APORTACION, normalizarBusqueda } from "../datos/proyectos.js";
import { enlaceWhatsApp, galeriaDesdeColumna, irASeccion, useFilasEnlaces } from "../utilidades/baserow.js";
import { registrar } from "../analitica";

// Botón "Avisos y Beneficios" — abre una ventana de intereses y arma el
// mensaje de WhatsApp con lo que la persona seleccionó.
export function BotonRecibeBeneficios({ grande = false }) {
  const ac = useAceptacion();
  const [abierto, setAbierto] = useState(false);
  const [seleccion, setSeleccion] = useState([]);

  const alternar = (interes) => {
    setSeleccion((prev) => (prev.includes(interes) ? prev.filter((i) => i !== interes) : [...prev, interes]));
  };

  // Enlace compartido dcuates.com/#avisos: abre esta ventana.
  useEffect(() => {
    const abrirDesdeEnlace = () => setAbierto(true);
    window.addEventListener("dcuates:abrir-avisos", abrirDesdeEnlace);
    return () => window.removeEventListener("dcuates:abrir-avisos", abrirDesdeEnlace);
  }, []);

  const enviar = () => {
    if (!ac.validar()) return;
    const lista = seleccion.length > 0 ? seleccion.join(", ") : "todas las novedades";
    registrar("formulario_enviado", { form: "avisos" });
    window.open(enlaceWhatsApp(`¡Hola DCUATES! Quiero recibir información de valor sobre: ${lista}.`), "_blank", "noopener,noreferrer");
    setAbierto(false);
    setSeleccion([]);
    ac.reiniciar();
  };

  return (
    <div className={grande ? "relative h-full" : "relative"}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className={grande
          ? "w-full h-full min-h-[56px] rounded-2xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-md px-2 py-3 text-[11px] sm:text-sm font-black uppercase tracking-wide transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 text-center leading-tight"
          : "rounded-full bg-[#e65100] hover:bg-[#bf360c] text-white shadow-sm px-2.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wide transition-colors flex items-center gap-1 min-h-[30px] sm:min-h-[34px]"}
      >
        <span className={grande ? "" : "hidden sm:inline"}>Avisos y Beneficios</span>
        {!grande && <span className="sm:hidden">Avisos</span>}
        <span aria-hidden="true">💌</span>
      </button>

      {abierto && (
        <VentanaMarca
          degradado={DEGRADADO_AVISOS}
          suave="#fff3e0"
          emoji="💌"
          titulo="Avisos y Beneficios"
          invitacion="Sé de los primeros en enterarte. Elige lo que te interesa y te escribimos por WhatsApp con promociones de negocios locales, mascotas que buscan hogar, eventos del barrio y oportunidades de apoyo."
          cierre="Una comunidad bien informada es una comunidad más fuerte. ¡Qué gusto tenerte aquí! 💚"
          compartir={{ hash: "avisos", titulo: "Avisos y Beneficios", texto: "Entérate de promociones, mascotas, eventos y apoyos de tu colonia" }}
          onCerrar={() => setAbierto(false)}
        >
          <p className="text-xs font-black uppercase tracking-wide text-[#bf360c] mb-2">¿Qué te interesa recibir?</p>
          <div className="space-y-2">
            {INTERESES_BENEFICIOS.map((interes, i) => {
              const marcado = seleccion.includes(interes);
              return (
                <label
                  key={interes}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold cursor-pointer transition-colors ${marcado ? "border-[#e65100] bg-orange-50 text-[#7a2e00]" : "border-slate-200 bg-white text-slate-800 hover:border-orange-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => alternar(interes)}
                    className="h-5 w-5 shrink-0 accent-[#e65100]"
                  />
                  <span aria-hidden="true" className="text-lg">{EMOJIS_INTERESES[i % EMOJIS_INTERESES.length]}</span>
                  <span className="leading-snug">{interes}</span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-medium italic">Si no eliges ninguno, te compartimos un poco de todo.</p>
          <div className="mt-4"><CasillaAcepto ac={ac} id="acepta_terminos_privacidad_avisos" /></div>
          <button
            type="button"
            onClick={enviar}
            className="mt-3 w-full rounded-2xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 text-xs sm:text-sm uppercase tracking-wide transition-colors shadow-md"
          >
            Quiero recibir avisos por WhatsApp
          </button>
          <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_avisos" />
        </VentanaMarca>
      )}
    </div>
  );
}

// Modal de formulario reutilizable — mismo componente para "Sugerencias y
// Quejas" y para "Compartir Más". Ambos arman un mensaje de WhatsApp con la
// opción elegida + el texto libre.
export function ModalFormularioWhatsApp({ titulo, emoji = "💬", degradado = DEGRADADO_SUGERENCIAS, suave = "#e3f3f8", invitacion, cierre, descripcion, opciones, placeholder, etiquetaBoton = "Enviar por WhatsApp", onCerrar }) {
  const ac = useAceptacion();
  const [opcion, setOpcion] = useState(opciones[0]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const enviar = () => {
    if (!ac.validar()) return;
    if (!mensaje.trim()) {
      setError("Escribe un mensaje antes de enviar.");
      return;
    }
    registrar("formulario_enviado", { form: String(titulo).slice(0, 40) });
    window.open(enlaceWhatsApp(`¡Hola DCUATES! ${opcion}: ${mensaje.trim()}`), "_blank", "noopener,noreferrer");
    onCerrar();
  };

  return (
    <VentanaMarca degradado={degradado} suave={suave} emoji={emoji} titulo={titulo} invitacion={invitacion} cierre={cierre} onCerrar={onCerrar}>
      {descripcion && <p className="text-sm text-slate-700 leading-relaxed font-bold mb-3">{descripcion}</p>}
      <select
        value={opcion}
        onChange={(e) => setOpcion(e.target.value)}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-bold mb-3 text-slate-800"
      >
        {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <textarea
        value={mensaje}
        onChange={(e) => { setMensaje(e.target.value); if (error) setError(""); }}
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm mb-1 text-slate-800 focus:outline-none focus:border-emerald-600"
      />
      {error && <p className="text-xs text-red-600 font-bold mb-2">{error}</p>}
      <div className="mt-3"><CasillaAcepto ac={ac} id="acepta_terminos_privacidad_mensaje" /></div>
      <button
        type="button"
        onClick={enviar}
        className="mt-3 w-full rounded-2xl text-white font-black py-3.5 text-center transition-opacity hover:opacity-90 uppercase text-xs sm:text-sm tracking-wide shadow-md"
        style={{ background: degradado }}
      >
        {etiquetaBoton}
      </button>
      <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_mensaje" />
    </VentanaMarca>
  );
}

// Compartir Más: la persona marca una o las dos opciones y escribe en cada una.
export function ModalCompartirMas({ onCerrar }) {
  const ac = useAceptacion();
  const [quiereVer, setQuiereVer] = useState(false);
  const [textoVer, setTextoVer] = useState("");
  const [quiereCompartir, setQuiereCompartir] = useState(false);
  const [textoComp, setTextoComp] = useState("");
  const [error, setError] = useState("");

  const enviar = () => {
    if (!ac.validar()) return;
    if (!quiereVer && !quiereCompartir) {
      setError("Marca al menos una de las dos opciones.");
      return;
    }
    if ((quiereVer && !textoVer.trim()) || (quiereCompartir && !textoComp.trim())) {
      setError("Cuéntanos un poco en cada opción que marcaste.");
      return;
    }
    const partes = [];
    if (quiereVer) partes.push(`Quiero que compartan más o también sobre: ${textoVer.trim()}`);
    if (quiereCompartir) partes.push(`Quiero compartir algo: ${textoComp.trim()}`);
    registrar("formulario_enviado", { form: "compartir", opciones: quiereVer && quiereCompartir ? "ambas" : quiereVer ? "ver" : "compartir" });
    window.open(enlaceWhatsApp(`¡Hola DCUATES!\n\n${partes.join("\n\n")}`), "_blank", "noopener,noreferrer");
    onCerrar();
  };

  const tarjeta = (activa) => `rounded-2xl border-2 px-3 py-3 transition-colors ${activa ? "border-[#1B6F8A] bg-sky-50" : "border-slate-200 bg-white"}`;

  return (
    <VentanaMarca
      degradado={DEGRADADO_COMPARTIR}
      suave="#e3f3f8"
      emoji="🌟"
      titulo="Compartir Más"
      invitacion="DCUATES se construye con lo que cada quien aporta. Dinos qué te gustaría ver en la página, qué quieres compartir tú (una historia, un negocio, un talento, una causa o una buena noticia), o las dos cosas."
      cierre="Lo que TÚ COMPARTES hoy puede ser la ayuda que alguien necesita mañana; y lo que OTROS COMPARTEN puede ser de AYUDA TAMBIÉN PARA TI ;) !!! ¡GRACIAS POR COMPARTIR, TODOS SUMAMOS MÁS Y MEJOR !!! 🌟"
      compartir={{ hash: "compartir", titulo: "Compartir Más", texto: "Cuéntanos qué quieres ver y qué quieres compartir en DCUATES" }}
      onCerrar={onCerrar}
    >
      <p className="text-xs font-black uppercase tracking-wide text-[#1B6F8A] mb-2">Marca una o las dos:</p>
      <div className="space-y-2.5">
        <div className={tarjeta(quiereVer)}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={quiereVer} onChange={(e) => { setQuiereVer(e.target.checked); if (error) setError(""); }} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1B6F8A]" />
            <span className="text-sm font-black text-[#0f2d1e] leading-snug">🙋 Quiero que compartan más (o también) sobre…</span>
          </label>
          {quiereVer && (
            <textarea
              value={textoVer}
              onChange={(e) => { setTextoVer(e.target.value); if (error) setError(""); }}
              rows={3}
              placeholder="Ej. ofertas de empleo, eventos de salud, recetas…"
              className="mt-2 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#1B6F8A]"
            />
          )}
        </div>
        <div className={tarjeta(quiereCompartir)}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={quiereCompartir} onChange={(e) => { setQuiereCompartir(e.target.checked); if (error) setError(""); }} className="mt-0.5 h-5 w-5 shrink-0 accent-[#1B6F8A]" />
            <span className="text-sm font-black text-[#0f2d1e] leading-snug">🎁 Quiero compartir algo…</span>
          </label>
          {quiereCompartir && (
            <textarea
              value={textoComp}
              onChange={(e) => { setTextoComp(e.target.value); if (error) setError(""); }}
              rows={3}
              placeholder="Ej. mi negocio, una historia, un talento, una causa…"
              className="mt-2 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#1B6F8A]"
            />
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-600 font-bold mt-2">{error}</p>}
      <div className="mt-4"><CasillaAcepto ac={ac} id="acepta_terminos_privacidad_compartir" /></div>
      <button
        type="button"
        onClick={enviar}
        className="mt-3 w-full rounded-2xl text-white font-black py-3.5 uppercase text-xs sm:text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity"
        style={{ background: DEGRADADO_COMPARTIR }}
      >
        Compartir por WhatsApp
      </button>
      <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_compartir" />
    </VentanaMarca>
  );
}

// Ventana de dudas (botón flotante de WhatsApp): primero preguntas
// frecuentes y buscador; si no alcanzan, una caja para escribir la duda que
// se envía por WhatsApp y una pantalla de agradecimiento con el logo.
export function ModalDudas({ onCerrar, onBuscarEnPagina }) {
  const ac = useAceptacion();
  const [consulta, setConsulta] = useState("");
  const [abierta, setAbierta] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const q = normalizarBusqueda(consulta).trim();
  const lista = FAQ_ITEMS
    .map((f, i) => ({ ...f, i }))
    .filter((f) => !q || normalizarBusqueda(f.pregunta + " " + f.respuesta).includes(q));

  const textoWa = () => `¡Hola DCUATES! Tengo una duda o solicitud:\n\n${mensaje.trim()}`;

  const enviar = () => {
    if (!ac.validar()) return;
    if (!mensaje.trim()) {
      setError("Escribe tu duda o comentario antes de enviar.");
      return;
    }
    registrar("dudas_enviada");
    window.open(enlaceWhatsApp(textoWa()), "_blank", "noopener,noreferrer");
    setEnviado(true);
  };

  if (enviado) {
    return (
      <VentanaMarca degradado={DEGRADADO_DUDAS} suave="#e7f9ee" emoji="✅" titulo="¡Mensaje enviado!" onCerrar={onCerrar}>
        <div className="text-center py-2">
          <div className="flex justify-center"><LogoMarca tam={96} /></div>
          <p className="mt-4 text-base sm:text-lg font-black text-[#0f2d1e] leading-snug">
            En la primera oportunidad atenderemos tu solicitud…
          </p>
          <p className="mt-3 text-xl font-black text-[#128c7e] uppercase tracking-wide">¡Gracias y saludos!</p>
          <p className="mt-4 text-[11px] text-slate-500 font-medium">
            ¿No se abrió WhatsApp?{" "}
            <a href={enlaceWhatsApp(textoWa())} target="_blank" rel="noopener noreferrer" className="font-black text-[#128c7e] underline">Tócalo aquí</a>
          </p>
        </div>
      </VentanaMarca>
    );
  }

  return (
    <VentanaMarca
      degradado={DEGRADADO_DUDAS}
      suave="#e7f9ee"
      emoji="💬"
      titulo="¿En qué podemos ayudarte?"
      invitacion="Quizá tu duda ya tiene respuesta. Busca una palabra o toca una pregunta frecuente."
      onCerrar={onCerrar}
    >
      <label className="relative block">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base" aria-hidden="true">🔍</span>
        <input
          type="search"
          value={consulta}
          onChange={(e) => { setConsulta(e.target.value); setAbierta(null); }}
          placeholder="Ej. libros, mascota, negocio, donar…"
          className="w-full rounded-2xl border-2 border-slate-200 pl-10 pr-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#128c7e]"
          aria-label="Buscar en las preguntas frecuentes"
        />
      </label>

      <div className="mt-3 space-y-2">
        {lista.length === 0 && (
          <p className="rounded-xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-600 text-center">
            No encontramos esa palabra en las preguntas. Cuéntanos tu duda abajo 👇
          </p>
        )}
        {lista.map((f) => {
          const activa = abierta === f.i;
          return (
            <div key={f.i} className={`rounded-2xl border-2 transition-colors ${activa ? "border-[#128c7e] bg-emerald-50" : "border-slate-200 bg-white"}`}>
              <button
                type="button"
                onClick={() => setAbierta(activa ? null : f.i)}
                aria-expanded={activa}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm font-black text-[#0f2d1e]"
              >
                <span aria-hidden="true">❓</span>
                <span className="flex-1 leading-snug">{f.pregunta}</span>
                <span aria-hidden="true" className="text-[#128c7e]">{activa ? "−" : "+"}</span>
              </button>
              {activa && <p className="px-3 pb-3 text-sm text-slate-700 font-medium leading-relaxed">{f.respuesta}</p>}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => { onCerrar(); onBuscarEnPagina && onBuscarEnPagina(); }}
        className="mt-3 w-full rounded-2xl border-2 border-[#128c7e] text-[#0b6e5f] hover:bg-emerald-50 font-black py-2.5 text-xs uppercase tracking-wide transition-colors"
      >
        🔍 Buscar en toda la página
      </button>

      <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-4">
        <p className="text-sm font-black text-[#0f2d1e] leading-snug">
          Si no encontraste lo que buscabas, o tienes alguna duda o cuestión que podamos resolver o apoyar, coméntanos a detalle a continuación:
        </p>
        <textarea
          value={mensaje}
          onChange={(e) => { setMensaje(e.target.value); if (error) setError(""); }}
          rows={4}
          placeholder="Escribe aquí tu duda, solicitud o comentario…"
          className="mt-3 w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#128c7e]"
        />
        {error && <p className="text-xs text-red-600 font-bold mt-1">{error}</p>}
        <div className="mt-3"><CasillaAcepto ac={ac} id="acepta_terminos_privacidad_dudas" /></div>
        <button
          type="button"
          onClick={enviar}
          className="mt-3 w-full rounded-2xl text-white font-black py-3.5 uppercase text-xs sm:text-sm tracking-wide shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ background: DEGRADADO_DUDAS }}
        >
          <span aria-hidden="true">📲</span> Enviar por WhatsApp
        </button>
        <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_dudas" />
      </div>
    </VentanaMarca>
  );
}

// =========================================================================
// 4B. CONTENIDO DE LA VENTANA EMERGENTE ÚNICA DE PROYECTO
// =========================================================================
// Botón naranja de acción reutilizable dentro de los modales (WhatsApp, etc).
export function BotonModal({ href, children, variante = "principal", onClick }) {
  const base = "w-full text-center rounded-xl font-black py-3 px-4 shadow-md transition-colors uppercase tracking-wide text-xs sm:text-sm font-heading block";
  const estilos = variante === "principal"
    ? "bg-[#e65100] hover:bg-[#bf360c] text-white"
    : "border-2 border-[#0f2d1e] text-[#0f2d1e] hover:bg-[#0f2d1e] hover:text-white";
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${estilos}`}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${estilos}`}>
      {children}
    </button>
  );
}

// Versión "con candado" de BotonModal — se usa para cualquier botón que
// necesite una clave de acceso antes de mostrarse (hoy: "Únete a Nuestra
// Red de Confianza" en Círculo de Confianza). Mientras no se escriba la
// clave correcta, en vez del botón real se ve un candado con un campo de
// texto. AVISO: esto NO es seguridad real, solo filtra visitas casuales —
// la clave queda visible en el código fuente de la página.
export function BotonModalProtegido({ href, children, clave }) {
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [intento, setIntento] = useState("");
  const [error, setError] = useState(false);

  if (desbloqueado) {
    return <BotonModal href={href}>{children}</BotonModal>;
  }

  const verificar = () => {
    if (intento.trim().toLowerCase() === String(clave).toLowerCase()) {
      setDesbloqueado(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full rounded-xl border-2 border-dashed border-[#0f2d1e]/40 bg-[#0f2d1e]/5 p-3 space-y-2">
      <p className="text-xs sm:text-sm font-black uppercase text-[#0f2d1e] flex items-center gap-1.5 leading-tight">
        🔒 {children}
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={intento}
          onChange={(e) => { setIntento(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && verificar()}
          placeholder="Clave de acceso"
          className="flex-1 rounded-lg border-2 border-[#0f2d1e]/30 px-3 py-2 text-sm focus:outline-none focus:border-[#0f2d1e]"
        />
        <button
          type="button"
          onClick={verificar}
          className="shrink-0 rounded-lg bg-[#0f2d1e] hover:bg-emerald-800 text-white px-4 text-xs font-black uppercase tracking-wide transition-colors"
        >
          Entrar
        </button>
      </div>
      {error && (
        <p className="text-xs font-bold text-red-600">Clave incorrecta, intenta de nuevo.</p>
      )}
    </div>
  );
}

// Modal del Mapa de Sitio — tarjetas pequeñas con acceso directo a TODO lo
// que hay en la página (los 12 proyectos + FAQ + Sugerencias). Reutiliza
// BOTONES_PORTADA y MAPA_SITIO_EXTRA (ver arriba, cerca de
// TODOS_LOS_PROYECTOS) para no duplicar información.
export function ModalMapaSitio({ onCerrar, onAbrirProyecto, onAbrirFAQ, onAbrirSugerencias }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onCerrar}>
      <div
        className="bg-[#e8f5e9] text-slate-900 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0f2d1e] font-heading mb-3">
          🗺️ Mapa del Sitio
        </h3>
        <p className="text-xs sm:text-sm text-[#0f2d1e]/70 font-medium mb-3">
          Toca cualquier tarjeta para ir directo a esa sección, sin tener que buscarla.
        </p>
        <div className="overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BOTONES_PORTADA.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { onCerrar(); onAbrirProyecto(btn.modal); }}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-sm transition-colors p-3 text-center font-heading"
            >
              {btn.img && (
                <img
                  src={btn.img}
                  alt=""
                  loading="lazy"
                  className="max-h-10 w-auto object-contain drop-shadow"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="uppercase font-black leading-tight text-[11px] sm:text-xs">{btn.t}</span>
            </button>
          ))}
          {MAPA_SITIO_EXTRA.map((btn, idx) => (
            <button
              key={`extra-${idx}`}
              type="button"
              onClick={() => {
                onCerrar();
                if (btn.accion === "faq") onAbrirFAQ();
                else if (btn.accion === "sugerencias") onAbrirSugerencias();
                else if (btn.accion === "seguridad" || btn.accion === "escudo") abrirLegal(btn.accion);
              }}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-[#0f2d1e] text-[#0f2d1e] hover:bg-[#0f2d1e] hover:text-white shadow-sm transition-colors p-3 text-center font-heading"
            >
              <span className="text-2xl">{btn.emoji}</span>
              <span className="uppercase font-black leading-tight text-[11px] sm:text-xs">{btn.t}</span>
            </button>
          ))}
        </div>
              <div className="pt-3 flex justify-end shrink-0">
          <BotonCerrar onClick={onCerrar} />
        </div>
      </div>
    </div>
  );
}

// Modal de categoría — presentación "ad hoc" de una de las 4 categorías de
// la portada simplificada (ver CATEGORIAS_PROYECTOS arriba), con acceso
// directo a cada proyecto que agrupa. Reutiliza los mismos datos (img,
// título) de BOTONES_PORTADA para no duplicar información.
export function ModalCategoria({ categoria, onCerrar, onAbrirProyecto }) {
  if (!categoria) return null;
  const proyectosDeLaCategoria = BOTONES_PORTADA.filter((b) => categoria.proyectos.includes(b.modal));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onCerrar}>
      <div
        className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800">
            <span aria-hidden="true">{categoria.emoji}</span> {categoria.titulo}
          </span>
        </div>
        <p className="text-xs sm:text-sm italic font-black text-[#e65100] mb-2">{categoria.slogan}</p>
        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">{categoria.descripcion}</p>
        <div className="overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {proyectosDeLaCategoria.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onAbrirProyecto(btn.modal)}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white shadow-sm transition-colors p-3 text-center font-heading"
            >
              {btn.img && (
                <img
                  src={btn.img}
                  alt=""
                  loading="lazy"
                  className="max-h-10 w-auto object-contain drop-shadow"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="uppercase font-black leading-tight text-[11px] sm:text-xs">{btn.t}</span>
            </button>
          ))}
        </div>
              <div className="pt-3 flex justify-end shrink-0">
          <BotonCerrar onClick={onCerrar} />
        </div>
      </div>
    </div>
  );
}

// Botón verde desplegable — usado en la fila de "resumen rápido" junto al
// video (Nuestra Misión, Cómo Podemos Sumar, Preguntas Frecuentes, Aviso
// de Privacidad). Al dar clic se expande hacia abajo mostrando su contenido.
// Igual que el naranja: contenido siempre visible, sin acordeón.
export function BotonVerdeInfo({ titulo, children }) {
  return (
    <div className="rounded-xl bg-[#17472d] text-white shadow-md overflow-hidden">
      <div className="px-4 py-3.5">
        <span className="text-xs sm:text-sm font-black uppercase tracking-wide">{titulo}</span>
      </div>
      <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-emerald-50 leading-relaxed space-y-2 border-t border-emerald-700/40">
        {children}
      </div>
    </div>
  );
}

// Botón naranja alargado que lleva al video de Chuy (ejemplo de cómo un
// donativo cambia vidas). Se usa en Apoyo Voluntario y en Historias DCUATES.
export function BotonEjemploChuy({ onCerrar, color = "naranja" }) {
  // "verde" = verde oscuro con letras amarillas (resalta junto a los
  // botones naranja); "naranja" = el naranja de siempre.
  const estilo = color === "verde"
    ? "bg-[#0f2d1e] hover:bg-emerald-900 border-yellow-400"
    : "bg-[#e65100] hover:bg-[#bf360c] border-[#0f2d1e]";
  const letra = color === "verde" ? "text-yellow-300" : "text-white";
  return (
    <button
      type="button"
      onClick={() => { onCerrar(); setTimeout(() => irASeccion("chuy-video"), 80); }}
      className={`w-full text-left rounded-xl border-2 ${estilo} p-3 shadow-md transition-colors flex items-center justify-between gap-3`}
    >
      <p className={`text-sm sm:text-base font-black ${letra} uppercase tracking-tight leading-tight`}>
        Donativos y apoyos que cambian vidas: un gran ejemplo
      </p>
      <FlechaBlanca />
    </button>
  );
}

export function ContenidoModalProyecto({ id, onCerrar }) {
  // Se llama siempre, sin importar el "id", para respetar las reglas de
  // React sobre hooks. Las galerías de Noticias y Bienestar ahora se
  // alimentan de las columnas GALCULTURA y GALSALUD de la tabla ENLACES;
  // si vienen vacías, cada una usa su arreglo de ejemplo como respaldo.
  const filasEnlaces = useFilasEnlaces();
  const itemsNoticias = (() => {
    const desdeBaserow = galeriaDesdeColumna(filasEnlaces, "GALCULTURA", 12, "Actividad");
    return desdeBaserow.length > 0 ? desdeBaserow : NOTICIAS_GALERIA_ITEMS;
  })();
  const itemsBienestar = (() => {
    const desdeBaserow = galeriaDesdeColumna(filasEnlaces, "GALSALUD", 12, "Actividad");
    return desdeBaserow.length > 0 ? desdeBaserow : BIENESTAR_GALERIA_ITEMS;
  })();

  // Caso especial 1: Ventas con Causa — muestra el catálogo en vivo.
  if (id === "ventas-con-causa") {
    return (
      <div className="space-y-4">
        <span className="inline-block rounded-full bg-emerald-200 px-4 py-1.5 text-sm font-black uppercase tracking-wider text-emerald-800">
          🛍️ Ventas con Causa
        </span>
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e]">
          Productos y servicios que apoyan a la comunidad
        </h3>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          Explora el catálogo, cuéntanos qué te interesa o qué buscas, y te contactamos directo por WhatsApp.
        </p>
        <ul className="space-y-2">
          {["Productos y servicios locales", "Catálogo siempre actualizado", "Contacto directo por WhatsApp"].map((punto, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
              <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
              {punto}
            </li>
          ))}
        </ul>
        <PasarelaVentasConCausa />
        <p className="text-center text-xs font-bold text-emerald-800">
          <a href={BASEROW_GALLERY_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-900">
            Ver catálogo completo
          </a>
        </p>
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onCerrar();
              irASeccion("publicidad");
            }}
            className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
          >
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
              Publicar mi Producto o Servicio
            </p>
            <FlechaBlanca />
          </button>
          <a
            href={enlaceWhatsApp("¡Hola DCUATES! Me interesa un producto o servicio de Ventas con Causa, su código es: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
          >
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
              Si Te Interesa Algo, Envía su Código Aquí
            </p>
            <FlechaBlanca />
          </a>
        </div>
      </div>
    );
  }

  // Caso especial 2: Apoyo Voluntario / donaciones — muestra las 4 formas de aportar.
  if (id === "donaciones") {
    return (
      <div className="space-y-4">
        <span className="inline-block rounded-full bg-emerald-200 px-4 py-1.5 text-sm font-black uppercase tracking-wider text-emerald-800">
          🟢 Apoyo Voluntario
        </span>
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e]">
          Tu aportación impulsa a la comunidad
        </h3>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          Elige la forma de aportación que prefieras — todas te conectan directo por WhatsApp.
        </p>
        <ul className="space-y-2">
          {["Económica, en especie o trueque", "Labor voluntaria", "Total transparencia"].map((punto, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
              <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
              {punto}
            </li>
          ))}
        </ul>
        <div className="space-y-2">
          {OPCIONES_APORTACION.map((opc) => (
            <a
              key={opc.t}
              href={enlaceWhatsApp(opc.m)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors block"
            >
              <div className="flex justify-between items-center gap-3">
                <div>
                  <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">{opc.t}</p>
                  <p className="text-xs font-bold text-[#0f2d1e]/90 leading-snug pt-0.5">{opc.d}</p>
                </div>
                <svg
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                  className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 opacity-90 drop-shadow"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 22 H58 V4 L96 30 L58 56 V38 H4 Z" fill="#ffffff" stroke="#0f2d1e" strokeWidth="6" strokeLinejoin="round" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        <BotonEjemploChuy onCerrar={onCerrar} color="verde" />
      </div>
    );
  }

  // Caso especial 3: los 3 botones nuevos (Historias, Cupones/Promos,
  // Patrocinadores/Alianzas) — mismo formato: título, puntos y su carrusel.
  const CAJAS_NARANJAS_NUEVAS = {
    "historias-dcuates": { titulo: "Historias DCUATES", puntos: ["Testimonios reales", "Historias con causa", "Inspiración comunitaria"], items: HISTORIAS_DCUATES_ITEMS },
    "cupones-promos": { titulo: "Cupones, Promos y Más", puntos: ["Descuentos exclusivos", "Promociones locales", "Se actualiza cada mes"], items: CUPONES_PROMOS_ITEMS },
    "patrocinadores-alianzas": { titulo: "Patrocinadores y Alianzas DCUATES", puntos: ["Negocios aliados", "Organizaciones que apoyan", "¡Gracias por sumar!"], items: PATROCINADORES_ALIANZAS_ITEMS }
  };
  if (CAJAS_NARANJAS_NUEVAS[id]) {
    const caja = CAJAS_NARANJAS_NUEVAS[id];
    return (
      <div className="space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e]">
          {caja.titulo}
        </h3>
        <ul className="space-y-2">
          {caja.puntos.map((punto, i) => (
            <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
              <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
              {punto}
            </li>
          ))}
        </ul>
        <Carrusel
          items={caja.items}
          renderItem={(item) => <TarjetaCarrusel item={item} etiqueta={item.tipo} />}
        />
        {id === "historias-dcuates" && <BotonEjemploChuy onCerrar={onCerrar} />}
      </div>
    );
  }

  // Casos normales: busca el proyecto entre los 10 que ya tienen tarjeta.
  const proyecto = TODOS_LOS_PROYECTOS.find((p) => p.id === id);
  if (!proyecto) return null;
  const galeria = id === "noticias"
    ? { titulo: GALERIAS_PROYECTOS.noticias.titulo, items: itemsNoticias }
    : id === "bienestar"
    ? { titulo: GALERIAS_PROYECTOS.bienestar.titulo, items: itemsBienestar }
    : null;

  return (
    <div className="space-y-4">
      <p className="text-xs sm:text-sm font-black uppercase text-amber-700 tracking-wider">
        {proyecto.categoria}
      </p>
      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0f2d1e] -mt-2">
        {proyecto.titulo}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        {proyecto.descripcion}
      </p>
      <ul className="space-y-2">
        {proyecto.puntos.map((punto, i) => (
          <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
            <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
            {punto}
          </li>
        ))}
      </ul>

      {galeria && (
        <div className="pt-1 space-y-3">
          <Carrusel
            items={galeria.items}
            renderItem={(item) => <TarjetaCarrusel item={item} etiqueta={item.tipo} />}
          />
          <a
            href="https://whatsapp.com/channel/0029VbDaZp0HltYE5xSajU36"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
          >
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
              Ver Más Actividades
            </p>
            <FlechaBlanca />
          </a>
          <a
            href={proyecto.enlaceDirectoWA}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
          >
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
              Envíanos tus Recomendaciones
            </p>
            <FlechaBlanca />
          </a>
        </div>
      )}

      {!galeria && (
        <div className="pt-1 space-y-2">
          {proyecto.scrollDestino ? (
            <BotonModal
              onClick={() => {
                onCerrar();
                irASeccion(proyecto.scrollDestino);
              }}
            >
              {proyecto.textoBoton}
            </BotonModal>
          ) : (
            <BotonModal href={proyecto.enlaceDirectoWA}>{proyecto.textoBoton}</BotonModal>
          )}
          {proyecto.segundoBoton && (
            proyecto.segundoBoton.claveAcceso ? (
              <BotonModalProtegido href={proyecto.segundoBoton.enlace} clave={proyecto.segundoBoton.claveAcceso}>
                {proyecto.segundoBoton.titulo}
              </BotonModalProtegido>
            ) : (
              <BotonModal href={proyecto.segundoBoton.enlace}>{proyecto.segundoBoton.titulo}</BotonModal>
            )
          )}
        </div>
      )}
    </div>
  );
}
