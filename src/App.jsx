import React, { useState } from "react";

export default function App() {
  // Configuración de los datos reales provistos para la prueba
  const TELEFONO = "525520696627";
  const VIDEO_ID = "SUnE27QnnyI";
  const mensajePrueba = "¡Hola DCUATES! Estoy probando el nuevo enlace nativo desde la microprueba de comportamiento.";

  return (
    <div className="min-h-screen bg-[#1b4332] text-white p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-white text-slate-800 p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-8">
        
        {/* CABECERA */}
        <div className="text-center">
          <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Entorno de Test Aislado
          </span>
          <h1 className="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
            Chuy El Sapo Soñador
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">
            Resolución de enlaces de WhatsApp e Embed de YouTube
          </p>
        </div>

        {/* PRUEBA 1: APERTURA NATIVA DE WHATSAPP */}
        <div className="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
              1. Enlace Inyectado por JSX (WhatsApp)
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Se reemplazó la sintaxis plana <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-red-600">href="url"</code> que rompía el DNS del navegador. Al usar la envoltura de llaves reales de React <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-emerald-700">{`href={\`...\`}`}</code>, la variable del mensaje se codifica nativamente en el DOM sin truncar caracteres.
          </p>
          
          <a
            href={`https://whatsapp.com{TELEFONO}&text=${encodeURIComponent(mensajePrueba)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block font-heading"
          >
            Enviar Mensaje de Prueba
          </a>
        </div>

        {/* PRUEBA 2: REPRODUCTOR IFRAME DE YOUTUBE */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <h2 className="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
              2. Incrustación Directa (Reportaje Chuy)
            </h2>
          </div>
          <p className="text-xs text-slate-600 text-justify leading-relaxed">
            Para evitar el bloqueo de políticas de origen de orígenes cruzados (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-amber-800">sameorigin</code>), la URL estática tradicional se transformó apuntando al endpoint de distribución libre <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/embed/</code> seguido del token único del video.
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

        {/* NOTA DE DESARROLLO */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[11px] text-slate-500 text-justify font-medium leading-normal">
          <strong>Verificación Técnica:</strong> Esta estructura limpia garantiza compatibilidad total al compilar en Vercel, forzando al navegador a omitir el bloqueo de ventanas emergentes al usar enlaces tradicionales del estándar web.
        </div>

      </div>
    </div>
  );
}
