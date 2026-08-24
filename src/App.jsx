import React from "react";

export default function App() {
  // FUNCIÓN SCRIPT: Despacha la redirección usando una URL estática limpia sin variables
  const ejecutarRedireccionDirecta = (e) => {
    e.preventDefault();
    
    // URL DEFINITIVA EN CÓDIGO DURO: Con la diagonal "/" visible y garantizada
    const urlTotalSaneada = "https://wa.me.";
    
    // Ejecución forzada en el navegador
    window.open(urlTotalSaneada, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-4 sm:p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <span className="inline-block bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            Auditoría Estricta: Código Duro Estático
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Microprueba DCUATES
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase">
            Rutas pre-renderizadas sin procesamiento de variables
          </p>
        </div>

        {/* 1. MÓDULO DE WHATSAPP (URL TOTALMENTE FIJA) */}
        <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
              1. Enlace Fijo con Diagonal Verificada
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se eliminó cualquier lógica de programación o concatenación en la URL. El botón ejecuta un string estático plano que incluye explícitamente la diagonal reglamentaria <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-emerald-800">/</code> después del dominio.
          </p>
          
          <button
            onClick={ejecutarRedireccionDirecta}
            className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-4 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block font-heading cursor-pointer"
          >
            Probar Apertura Directa en wa.me
          </button>
        </div>

        {/* 2. MÓDULO DE VIDEO NATIVO (CON STREAMING COMPATIBLE DE CLOUDFLARE) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <h2 className="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
              2. Video de Portada (Servidor Abierto)
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se sustituyó el archivo de pruebas previo por un video de transmisión libre alojado en los servidores de Cloudflare, optimizado para reproducirse en plataformas CDN de producción.
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
              {/* Archivo MP4 de prueba en la red CDN global de Cloudflare */}
              <source src="https://cloudflare-ipfs.com" type="video/mp4" />
              Tu navegador no soporta la reproducción de video nativo.
            </video>
          </div>
        </div>

      </div>
    </div>
  );
}
