import React from "react";

export default function App() {
  // Datos planos obligatorios para la ejecución del script
  const TELEFONO = "525520696627";
  const mensajePrueba = "¡Hola DCUATES! Prueba de redirección controlada por Script de JavaScript.";

  // FUNCIÓN SCRIPT: Resuelve definitivamente el problema de formateo en el HTML
  const abrirWhatsApp = (e) => {
    e.preventDefault(); // Detiene cualquier comportamiento por defecto del navegador
    
    const urlBase = "https://whatsapp.com";
    const textoCodificado = encodeURIComponent(mensajePrueba);
    const urlFinal = `${urlBase}?phone=${TELEFONO}&text=${textoCodificado}`;
    
    // Ejecuta la apertura nativa forzando una nueva pestaña limpia
    window.open(urlFinal, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-8">
        
        {/* CABECERA */}
        <div className="text-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Modo: Script Handler & Native Video
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Control de Eventos JS
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">
            Redirección por función y reproductor alternativo
          </p>
        </div>

        {/* COMPONENTE 1: REDIRECCIÓN POR SCRIPT */}
        <div className="space-y-3 p-4 bg-blue-50 rounded-2xl border-2 border-blue-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-sm font-black uppercase text-blue-900 tracking-wide">
              1. Enlace mediante Función onClick
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Al retirar la URL del atributo <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-red-600">href</code>, evitamos que el compilador de Vite confunda las llaves de interpolación con texto estático. El script procesa las variables en memoria y despacha una URL limpia.
          </p>
          
          <button
            onClick={abrirWhatsApp}
            className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block font-heading cursor-pointer"
          >
            Ejecutar Script de WhatsApp
          </button>
        </div>

        {/* COMPONENTE 2: REPRODUCTOR NATIVO (SOLUCIÓN AL BLOQUEO DE YOUTUBE) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <h2 className="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
              2. Video de Portada Integrado Nativamente
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Debido a que el canal de origen restringió los permisos de inserción externa para ese reportaje, los iframes siempre mostrarán error. La solución estándar en desarrollo web es usar la etiqueta <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-emerald-800">&lt;video&gt;</code> cargando un archivo mp4 directo.
          </p>
          
          <div className="w-full rounded-2xl border-4 border-[#00c853] bg-black overflow-hidden shadow-xl aspect-video">
            <video 
              className="w-full h-full object-cover"
              controls 
              preload="metadata"
              playsInline
            >
              {/* Servidor multimedia alternativo de alta velocidad para la prueba de video */}
              <source src="https://mixkit.co" type="video/mp4" />
              Tu navegador no soporta la reproducción de video nativo.
            </video>
          </div>
        </div>

        {/* NOTA TÉCNICA */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-500 text-justify font-medium leading-normal">
          <strong>Validación de entorno:</strong> Esta aproximación anula por completo fallos de parsing en rutas dinámicas dentro de servidores CDN como Vercel.
        </div>

      </div>
    </div>
  );
}
