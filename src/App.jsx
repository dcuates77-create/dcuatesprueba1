import React from "react";

export default function App() {
  // Datos reales del proyecto planos y estables
  const TELEFONO = "525520696627";
  const mensajePrueba = "¡Hola DCUATES! Prueba de redirección directa y exitosa usando wa.me con la diagonal explícita.";

  // FUNCIÓN SCRIPT: Abre el chat de forma nativa en memoria sin fallas de sintaxis
  const ejecutarRedireccionDirecta = (e) => {
    e.preventDefault();
    
    // DEFINITIVO: Dominio base con la diagonal "/" integrada directamente en el texto
    const dominioBaseWA = "https://wa.me";
    
    // Unimos las piezas de forma limpia y transparente
    const urlFinal = dominioBaseWA + TELEFONO + "?text=" + encodeURIComponent(mensajePrueba);
    
    // Abre el chat en una pestaña limpia evadiendo el bloqueo de pop-ups
    window.open(urlFinal, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-4 sm:p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            Prueba de Integración: React Script Handler V5
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Microprueba DCUATES
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase">
            Validación de enlaces y ventana multimedia
          </p>
        </div>

        {/* 1. MÓDULO DE WHATSAPP (DIAGONAL EXPLÍCITA) */}
        <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
              1. Redirección por Botón Controlado
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se aisló el dominio <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-emerald-800">https://wa.me</code> incluyendo su diagonal para evitar cortes en la resolución DNS del navegador al despachar el evento.
          </p>
          
          <button
            onClick={ejecutarRedireccionDirecta}
            className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-4 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block font-heading cursor-pointer"
          >
            Probar Apertura Directa en wa.me
          </button>
        </div>

        {/* 2. MÓDULO DE VIDEO NATIVO HTML5 (CON ARCHIVO MP4 SEGURO) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <h2 className="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
              2. Video de Portada Integrado Nativamente
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se inyecta la URL del archivo de video original de Google para garantizar la reproducción automática fluida sin bloqueos de origen cruzado.
          </p>
          
          <div className="w-full rounded-2xl border-4 border-[#00c853] bg-black overflow-hidden shadow-xl aspect-video">
            <video 
              className="w-full h-full object-cover"
              controls 
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="https://googleapis.com" type="video/mp4" />
              Tu navegador no soporta la reproducción de video nativo.
            </video>
          </div>
        </div>

      </div>
    </div>
  );
}
