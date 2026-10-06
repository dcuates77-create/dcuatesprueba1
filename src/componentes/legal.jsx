import React, { useState } from "react";
import { LogoMarca } from "./encabezado.jsx";
import BotonCompartir from "../BotonCompartir";

export function BotonCerrar({ onClick, label = "Cerrar", claro = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`shrink-0 h-11 w-11 flex items-center justify-center rounded-full text-2xl leading-none font-black shadow-lg transition-colors ${claro ? "bg-white text-[#0f2d1e] hover:bg-emerald-100" : "bg-[#0f2d1e] text-white hover:bg-emerald-800"}`}
    >
      ×
    </button>
  );
}

// Ventana con presencia de marca: encabezado de color con el logo, una
// invitación que introduce el contenido, el contenido (children), una frase
// de cierre y la cruz de cerrar abajo a la derecha. La usan Avisos y
// Beneficios, Compartir Más, Sugerencias y Dudas.
export function VentanaMarca({ degradado, suave, emoji, titulo, invitacion, cierre, compartir, onCerrar, children, ancho = "max-w-md", capa = "z-50" }) {
  return (
    <div className={`fixed inset-0 ${capa} flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm`} onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`bg-white text-slate-900 rounded-3xl ${ancho} w-full max-h-[92vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-5 pt-5 pb-7 text-white text-center" style={{ background: degradado }}>
          {compartir && (
            <BotonCompartir
              variante="claro"
              className="absolute top-3 right-3 z-10"
              hash={compartir.hash}
              titulo={compartir.titulo}
              texto={compartir.texto}
            />
          )}
          <div className="flex justify-center"><LogoMarca tam={68} /></div>
          <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-white/90">DCUATES · ¡Comparte y Gana!</p>
          <h3 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
            <span aria-hidden="true">{emoji} </span>{titulo}
          </h3>
        </div>
        <div className="-mt-3 rounded-t-3xl bg-white px-5 pt-5 pb-5">
          {invitacion && (
            <p className="rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed font-semibold text-slate-800 mb-4" style={{ background: suave }}>
              {invitacion}
            </p>
          )}
          {children}
          {cierre && (
            <p className="mt-5 text-center text-sm font-black italic leading-snug text-[#0f2d1e]">
              {cierre}
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <BotonCerrar onClick={onCerrar} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Aceptación del Aviso de Privacidad y los Términos (todos los formularios) -----
// useAceptacion() lleva el estado de la casilla; CasillaAcepto la dibuja y
// ErrorAcepto muestra el mensaje rojo DEBAJO del botón de enviar. Los enlaces
// abren las ventanas legales del pie de página (las escucha App()).
export function useAceptacion() {
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState(false);
  return {
    acepta,
    error,
    cambiar: (v) => { setAcepta(v); if (v) setError(false); },
    // true = puede continuar; false = se bloquea todo el envío
    validar: () => { if (!acepta) { setError(true); return false; } return true; },
    reiniciar: () => { setAcepta(false); setError(false); }
  };
}

export function abrirLegal(cual) {
  window.dispatchEvent(new CustomEvent("dcuates:abrir-legal", { detail: cual }));
}

export function CasillaAcepto({ ac, id = "acepta_terminos_privacidad" }) {
  return (
    <>
    <div className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${ac.error ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
      <input
        type="checkbox"
        id={id}
        checked={ac.acepta}
        onChange={(e) => ac.cambiar(e.target.checked)}
        aria-describedby={ac.error ? `${id}_error` : undefined}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[#e65100]"
      />
      <label htmlFor={id} className="text-xs sm:text-[13px] leading-snug font-semibold text-slate-800">
        He leído y acepto el{" "}
        <button type="button" onClick={(ev) => { ev.preventDefault(); abrirLegal("privacidad"); }} className="font-black text-[#1B6F8A] underline underline-offset-2">Aviso de Privacidad</button>
        {" "}y los{" "}
        <button type="button" onClick={(ev) => { ev.preventDefault(); abrirLegal("terminos"); }} className="font-black text-[#1B6F8A] underline underline-offset-2">Términos y Condiciones</button>
        {" "}de la Comunidad.
      </label>
    </div>
    <button
      type="button"
      onClick={() => abrirLegal("escudo")}
      className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-teal-300 bg-teal-50 hover:bg-teal-100 px-3 py-2 text-[11px] sm:text-xs font-black uppercase text-[#0b6e5f] leading-tight text-center transition-colors"
    >
      <span aria-hidden="true">🛡️</span> Escudo de Seguridad: así identificas el espacio seguro de DCUATES
    </button>
    </>
  );
}

export function ErrorAcepto({ ac, id = "acepta_terminos_privacidad" }) {
  if (!ac.error) return null;
  return (
    <p id={`${id}_error`} role="alert" className="mt-2 text-sm text-red-600 font-black text-center">
      Debes aceptar el Aviso de Privacidad y los Términos y Condiciones para continuar
    </p>
  );
}
