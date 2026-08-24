import React from "react";

export default function App() {
  // Datos reales provistos para la prueba de integración
  const TELEFONO = "525520696627";
  const VIDEO_ID = "SUnE27QnnyI"; // ID extraído del video de Chuy el Sapo Soñador
  const mensajePrueba = "¡Hola DCUATES! Esta es una prueba de redirección directa usando wa.me mediante un Script Handler.";

  // FUNCIÓN SCRIPT: Abre directamente la app o versión web de WhatsApp saltando la interfaz genérica
  const ejecutarRedireccionDirecta = (e) => {
    e.preventDefault();
    
    // El protocolo wa.me/telefono salta las pantallas comerciales intermedias de la web de WhatsApp
    const urlFinal = `https://wa.me{TELEFONO}?text=${encodeURIComponent(mensajePrueba)}`;
    
    // Se ejecuta abriendo una nueva pestaña limpia y segura
    window.open(urlFinal, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-4 sm:p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-1">
          <span className="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            Prueba de Integración Combinada
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Script Handler + Embed de YouTube
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase">
            Validación técnica de enlaces y ventana multimedia
          </p>
        </div>

        {/* 1. MÓDULO DE WHATSAPP (SCRIPT HANDLER) */}
        <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
              1. Redirección por Botón Controlado
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Esta sección procesa la URL en memoria empleando el subdominio directo <code className="bg-slate-200 px-1 py-0.5 rounded text-emerald-700 font-mono">wa.me</code>. Al remover el enlace del atributo <code className="bg-slate-200 px-1 py-0.5 rounded text-red-600 font-mono">href</code>, impedimos que el compilador de Vite confunda las llaves de interpolación con strings planos.
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
            Se integra el reproductor iframe configurado estrictamente con el endpoint de distribución libre <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-amber-800">/embed/</code> y el ID exacto del reportaje para restablecer el flujo en navegadores de escritorio y móviles.
          </p>
          
          <div className="w-full rounded-2xl border-4 border-[#00c853] bg-black overflow-hidden shadow-xl aspect-video relative">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://youtube.com{VIDEO_ID}`}
              title="CHUY EL SAPO SOÑADOR - DCUATES"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* 3. MÓDULO DE VIDEO ALTERNATIVO (TESTIGO) */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-lg">👁️</span>
            <h2 className="text-sm font-black uppercase text-blue-900 tracking-wide">
              3. Video de Control Testigo (Incrustación Libre)
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Este reproductor de abajo carga un video de YouTube configurado de forma pública con permisos de inserción abiertos. Sirve para corroborar que tu servidor en Vercel sí soporta iframes de video.
          </p>
          
          <div className="w-full rounded-2xl border-4 border-blue-500 bg-black overflow-hidden shadow-xl aspect-video relative">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://youtube.com"
              title="VIDEO TESTIGO DE CONTROL"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* NOTA DEL DESARROLLADOR */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-500 text-justify font-medium leading-normal">
          <strong>Validación de producción:</strong> Si tras subir esta versión a Vercel el reproductor testigo (Módulo 3) se ve bien pero el de Chuy (Módulo 2) sigue bloqueado, confirmará al 100% las restricciones de Azteca Noticias, por lo que usaremos el elemento nativo de video HTML5 en el código final.
        </div>

      </div>
    </div>
  );
}

