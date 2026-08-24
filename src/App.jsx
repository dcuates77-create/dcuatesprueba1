import React from "react";

export default function App() {
  // Datos reales del proyecto planos y estables
  const TELEFONO = "525520696627";
  const mensajePrueba = "¡Hola DCUATES! Prueba de redirección directa y exitosa usando wa.me en React.";

  // FUNCIÓN SCRIPT: Abre el chat de forma nativa en memoria
  const ejecutarRedireccionDirecta = (e) => {
    e.preventDefault();
    
    // Corregido: Se añadió la diagonal "/" crucial después de wa.me
    const urlFinal = "https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(mensajePrueba);
    
    // Abre el chat en una pestaña limpia evadiendo el bloqueo de pop-ups
    window.open(urlFinal, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-4 sm:p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            Prueba de Integración: React Script Handler V3
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Microprueba DCUATES
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase">
            Validación de enlaces y ventana multimedia
          </p>
        </div>

        {/* 1. MÓDULO DE WHATSAPP (DIAGONAL CORREGIDA) */}
        <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
              1. Redirección por Botón Controlado
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se corrigió la estructura de la URL añadiendo la diagonal reglamentaria después del dominio corto de Meta para que el navegador resuelva el enlace sin errores.
          </p>
          
          <button
            onClick={ejecutarRedireccionDirecta}
            className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-4 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block font-heading cursor-pointer"
          >
            Probar Apertura Directa en wa.me
          </button>
        </div>

        {/* 2. MÓDULO DE VIDEO NATIVO HTML5 (SIN BLOQUEOS DE YOUTUBE) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <h2 className="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
              2. Video de Portada Integrado Nativamente
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Para evitar las restricciones de privacidad de canales externos, la etiqueta nativa <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-emerald-800">&lt;video&gt;</code> despliega el contenido de forma directa y fluida.
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
              {/* Archivo multimedia testigo que carga inmediatamente en Vercel */}
              <source src="https://elements.envato.com/es/love-and-pigeons-TF4JUHA?utm_campaign=elements_mixkit_cs_video_item_page_31JULY2024&utm_medium=referral&utm_source=mixkit" type="video/mp4" />
              Tu navegador no soporta la reproducción de video nativo.
            </video>
          </div>
        </div>

      </div>
    </div>
  );
}
