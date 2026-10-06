import React, { useState, useEffect } from "react";
import { CasillaAcepto, ErrorAcepto, VentanaMarca, useAceptacion } from "./legal.jsx";
import { DEGRADADO_AVISOS, EMOJIS_INTERESES, INTERESES_BENEFICIOS } from "../datos/proyectos.js";
import { enlaceWhatsApp } from "../utilidades/baserow.js";
import { registrar } from "../analitica";

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
