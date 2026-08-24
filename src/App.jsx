<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Microprueba Infallible DCUATES</title>
    <!-- Cargamos Tailwind CSS desde CDN para mantener tus estilos exactos sin depender de Vite -->
    <script src="https://jsdelivr.net"></script>
</head>
<body class="bg-[#1b4332] text-white p-4 sm:p-6 min-h-screen flex flex-col items-center justify-center font-sans antialiased">

  <div class="max-w-xl w-full bg-white text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-[#0f2d1e] shadow-2xl space-y-6">
    
    <!-- ENCABEZADO -->
    <div class="text-center space-y-1">
      <span class="inline-block bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
        Solución Definitiva: Vanilla JS Estático
      </span>
      <h1 class="text-2xl font-black uppercase text-[#0f2d1e] tracking-tight">
        Microprueba sin Compilador
      </h1>
      <p class="text-xs font-bold text-slate-500 uppercase">
        Evadiendo errores de empaquetado de Vercel y Vite
      </p>
    </div>

    <!-- 1. MÓDULO DE WHATSAPP REAL -->
    <div class="space-y-3 p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-500/20">
      <div class="flex items-center gap-2">
        <span class="text-lg">⚙️</span>
        <h2 className="text-sm font-black uppercase text-emerald-800 tracking-wide">
          1. Redirección Nativa Inmune a Errores
        </h2>
      </div>
      <p class="text-xs text-slate-600 text-justify leading-relaxed">
        Al usar un botón HTML puro con una función de JavaScript tradicional, la URL se construye de forma limpia y directa en el navegador, garantizando que jamás se impriman llaves de texto plano en la barra de direcciones.
      </p>
      
      <button
        onclick="abrirWhatsAppDirecto()"
        class="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-4 px-4 shadow-md transition-all hover:scale-[1.01] uppercase tracking-wide text-xs block cursor-pointer"
      >
        Probar Apertura Directa en wa.me
      </button>
    </div>

    <!-- 2. MÓDULO DE VIDEO NATIVO (SOLUCIÓN A YOUTUBE) -->
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="text-lg">📺</span>
        <h2 class="text-sm font-black uppercase text-[#0f2d1e] tracking-wide">
          2. Video de Portada en Formato HTML5
        </h2>
      </div>
      <p class="text-xs text-slate-600 text-justify leading-relaxed">
        Como confirmamos que los servidores de YouTube bloquean las solicitudes de origen cruzado para este reportaje, la etiqueta estándar <code class="bg-slate-200 px-1 py-0.5 rounded font-mono text-emerald-800">&lt;video&gt;</code> integrada de forma local elimina por completo el error de la cara triste.
      </p>
      
      <div class="w-full rounded-2xl border-4 border-[#00c853] bg-black overflow-hidden shadow-xl aspect-video">
        <video 
          class="w-full h-full object-cover"
          controls 
          autoplay
          muted
          loop
          playsinline
        >
          <!-- Archivo multimedia de alta velocidad para comprobar el reproductor -->
          <source src="https://mixkit.co" type="video/mp4">
          Tu navegador no soporta la reproducción de video nativo.
        </video>
      </div>
    </div>

  </div>

  <!-- SCRIPT TRADICIONAL DE JAVASCRIPT BRUTO -->
  <script>
    function abrirWhatsAppDirecto() {
      // Definición de variables en texto plano, sin interpolaciones de React
      var telefono = "525520696627";
      var mensaje = "¡Hola DCUATES! Esta es una prueba de redirección exitosa usando código estático puro.";
      
      // Construimos la URL uniendo los textos de forma nativa
      var urlFinal = "https://wa.me" + telefono + "?text=" + encodeURIComponent(mensaje);
      
      // Abrimos la pestaña forzada
      window.open(urlFinal, "_blank", "noopener,noreferrer");
    }
  </script>
</body>
</html>

