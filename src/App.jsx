import React from "react";

export default function App() {
  // Datos reales del proyecto planos y estables
  const TELEFONO = "525520696627";
  const VIDEO_ID = "SUnE27QnnyI"; // Video de Chuy el Sapo Soñador
  const mensajePrueba = "¡Hola DCUATES! Prueba de redirección directa usando wa.me en React mediante un Script Handler sin llaves rotas.";

  // FUNCIÓN SCRIPT: Genera y despacha el enlace de forma nativa en memoria
  const ejecutarRedireccionDirecta = (e) => {
    e.preventDefault();
    
    // Al unir los strings con '+' evitamos que Vite confunda las llaves con texto estático plano
    const urlFinal = "https://wa.me" + TELEFONO + "?text=" + encodeURIComponent(mensajePrueba);
    
    // Abre el chat en una pestaña limpia evadiendo el bloqueo de pop-ups
    window.open(urlFinal, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-4 sm:p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            Prueba de Integración: React Script Handler
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Microprueba DCUATES
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase">
            Validación de enlaces y ventana multimedia
          </p>
        </div>

        {/* 1. MÓDULO DE WHATSAPP (CONCATENACIÓN PURA) */}
        <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
              1. Redirección por Botón Controlado
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se eliminaron los acentos graves y llaves dentro del HTML. Al delegar la URL a la función de JavaScript e invocarla con <code className="bg-slate-200 px-1 py-0.5 rounded text-emerald-700 font-mono">onClick</code>, se garantiza que el navegador procese el enlace de manera directa.
          </p>
          
          <button
            onClick={ejecutarRedireccionDirecta}
            className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-4 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block font-heading cursor-pointer"
          >
            Probar Apertura Directa en wa.me
          </button>
        </div>

        {/* 2. MÓDULO DE VIDEO (EMBED DE YOUTUBE) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <h2 className="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
              2. Reproductor de Portada (Chuy el Sapo Soñador)
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se integra el reproductor iframe configurado con la URL limpia concatenada directamente en JSX para evitar conflictos en los servidores CDN de Vercel.
          </p>
          
          <div className="w-full rounded-2xl border-4 border-[#00c853] bg-black overflow-hidden shadow-xl aspect-video relative">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={"https://youtube.com" + VIDEO_ID}
              title="CHUY EL SAPO SOÑADOR - DCUATES"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
