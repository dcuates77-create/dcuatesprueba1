          {/* COLUMNA CENTRAL: Botonera con más espaciado vertical para alineación simétrica (3 columnas) */}
          <div className="lg:col-span-3 flex flex-col justify-between py-1 gap-3">
            {[
              { t: "Préstamo de Libros", h: "#libros" },
              { t: "Ecatepets Mascotas", h: "#ecatepets" },
              { t: "Alianzas Solidarias", h: "#alianzas" },
              { t: "Publicidad Gratis", h: "#publicidad" },
              { t: "Asesorías Gratuitas", h: "#asesorias" },
              { t: "Bazar y Comercio", h: "#bazares" },
              { t: "Noticias de Barrio", h: "#noticias" },
              { t: "Apoyo Voluntario", h: "#donaciones" }
            ].map((btn, idx) => (
              <a 
                key={idx}
                href={btn.h}
                className="w-full flex-1 flex items-center justify-center text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black px-4 shadow-md transition-all hover:scale-[1.02] uppercase tracking-wide text-xs sm:text-sm font-heading"
              >
                {btn.t}
              </a>
            ))}
          </div>

          {/* COLUMNA DERECHA: Logo Circular (Liga WA removida) y Video YouTube Nativo (4 columnas) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-between text-center space-y-6">
            
            {/* Logotipo Oficial */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center rounded-full overflow-hidden bg-white p-2 border-4 border-[#0f2d1e]/20 shadow-xl">
              <img 
                src="/logo-circular.png" 
                alt="Logo Oficial DCUATES.COM" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-[#e65100] font-black text-xl tracking-tight leading-none">🟢 DCUATES.COM<br/><span class="text-xs text-[#0f2d1e]/60 font-bold">APOYOS Y BENEFICIOS</span></div>';
                }}
              />
            </div>

            {/* Título engrandecido y limpio sin fondo extra */}
            <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0f2d1e] tracking-wider leading-none">
              BRINDANDO LO MEJOR !!!
            </h3>

                      {/* Ventana Multimedia con Reproductor Real de YouTube responsivo */}
            <div className="w-full rounded-2xl border-4 border-[#00c853] bg-black overflow-hidden shadow-xl aspect-video relative">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://youtube.com{YOUTUBE_VIDEO_ID}?autoplay=0&mute=0`}
                title="Reproductor de Novedades DCUATES"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

          </div>

        </div>
      </section>

      {/* SECCIÓN 1: LOS 4 PROYECTOS BASE (Restauración de la Imagen 1 con Botones WA Validados) */}
      <section id="iniciativas" className="bg-[#1b4332] text-white py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight mb-12 text-emerald-300">
            Nuestros Proyectos Originales
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {INICIATIVAS_PRINCIPALES.map((item) => (
              <div 
                id={item.id} 
                key={item.id} 
                className="rounded-3xl border-4 border-[#0f2d1e] bg-white p-6 text-slate-800 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] duration-200"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl bg-emerald-50 p-2 rounded-xl border border-emerald-800/10">{item.icono}</span>
                    <div>
                      <p className="text-xs font-black uppercase text-amber-700 tracking-wider">
                        {item.categoria}
                      </p>
                      <h3 className="text-xl font-black text-[#0f2d1e] uppercase tracking-tight leading-tight">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed text-justify mb-4 pt-2 font-medium">
                    {item.descripcion}
                  </p>
                  
                  <ul className="space-y-2 mb-6 pl-1">
                    {item.puntos.map((punto, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                        <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => window.open(`https://wa.me{WHATSAPP_NUMERO}?text=${encodeURIComponent(item.mensajeWA)}`, '_blank')}
                  className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3 px-4 shadow-md transition-colors uppercase tracking-wide text-xs sm:text-sm font-heading"
                >
                  {item.textoBoton}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: LOS 4 NUEVOS PROYECTOS SOCIALES (Transformados al Formato Unificado de Tarjetas de la Imagen 1) */}
      <section id="nuevos-proyectos" className="bg-[#e8f5e9] text-slate-800 py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight mb-3 text-[#0f2d1e]">
            Nuevos Proyectos Sociales
          </h2>
          <p className="text-center text-slate-700 mb-12 max-w-xl mx-auto text-xs sm:text-sm font-bold uppercase tracking-wide">
            Ampliamos nuestro impacto con cuatro nuevos canales comunitarios unificados.
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {NUEVOS_PROYECTOS_DATA.map((item) => (
              <div 
                id={item.id} 
                key={item.id} 
                className="rounded-3xl border-4 border-[#0f2d1e] bg-white p-6 text-slate-800 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] duration-200"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl bg-emerald-50 p-2 rounded-xl border border-emerald-800/10">{item.icono}</span>
                    <div>
                      <p className="text-xs font-black uppercase text-amber-700 tracking-wider">
                        {item.categoria}
                      </p>
                      <h3 className="text-xl font-black text-[#0f2d1e] uppercase tracking-tight leading-tight">
                        {item.titulo}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed text-justify mb-4 pt-2 font-medium">
                    {item.descripcion}
                  </p>
                  
                  <ul className="space-y-2 mb-6 pl-1">
                    {item.puntos.map((punto, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                        <span className="h-2 w-2 rounded-full bg-[#00c853] flex-shrink-0" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => window.open(`https://wa.me{WHATSAPP_NUMERO}?text=${encodeURIComponent(item.mensajeWA)}`, '_blank')}
                  className="w-full text-center rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3 px-4 shadow-md transition-colors uppercase tracking-wide text-xs sm:text-sm font-heading"
                >
                  {item.textoBoton}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* SECCIÓN: APORTE VOLUNTARIO (Restauración de la Imagen 3) */}
      <section id="donaciones" className="bg-[#e8f5e9] text-[#0f2d1e] py-16 px-4 border-b-4 border-[#0f2d1e]">
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-12 items-start">
          
          {/* Bloque Texto Izquierda */}
          <div className="md:col-span-5 space-y-4">
            <span className="inline-block rounded-full bg-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">
              🤝 Apoyo Voluntario
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-[#0f2d1e]">
              TU APORTACIÓN IMPULSA A LA **COMUNIDAD**
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify font-bold">
              Cada donativo, del formato que decidas, nos ayuda a sostener y hacer crecer los proyectos que benefician a los negocios y familias latinas en conjunto con **DCUATES**.
            </p>
            <div className="rounded-xl bg-amber-100 border-2 border-amber-500/30 p-3 text-[11px] font-bold text-amber-900 leading-tight flex items-start gap-2">
              <span>💡</span>
              <p className="text-justify uppercase">
                Parte de la utilidad de los proyectos se destina al apoyo de causas sociales, con total transparencia. Rendimos cuentas de cómo se usa cada aportación.
              </p>
            </div>
          </div>

          {/* Bloque Opciones Derecha */}
          <div className="md:col-span-7 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-[#0f2d1e] mb-2">
              Selecciona tu tipo de aportación:
            </p>
            {[
              { t: "Aportación Económica", d: "Solicita los datos bancarios de manera directa y segura.", m: "Hola DCUATES! Deseo realizar una Aportación Económica. Me podrías proporcionar los datos seguros?" },
              { t: "Aportación en Especie", d: "Apoya donando herramientas, materiales o insumos útiles.", m: "Hola DCUATES! Quiero realizar una Aportación en Especie. Qué tipo de herramientas o insumos se requieren actualmente?" },
              { t: "Trueque Solidario", d: "Intercambia productos o servicios de valor equivalente.", m: "Hola DCUATES! Me interesa el Trueque Solidario. Tengo productos/servicios para intercambiar a favor de la causa." },
              { t: "Labor Voluntaria", d: "Dona tu valioso tiempo y conocimientos para crecer juntos.", m: "Hola DCUATES! Quiero sumarme con Labor Voluntaria aportando mi tiempo y conocimientos comunitarios." }
            ].map((opc, oIdx) => (
              <button
                key={oIdx}
                onClick={() => window.open(`https://wa.me{WHATSAPP_NUMERO}?text=${encodeURIComponent(opc.m)}`, '_blank')}
                className="w-full text-left rounded-xl border-2 border-slate-200 bg-white p-3 shadow-sm hover:border-emerald-600 transition-all hover:scale-[1.005] duration-200"
              >
                <p className="text-sm font-black text-[#0f2d1e] uppercase tracking-tight">{opc.t}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-none pt-0.5">{opc.d}</p>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* SECCIÓN 4: FORMULARIO DE PUBLICIDAD */}
      <section id="publicidad" className="bg-[#1b4332] text-white py-16 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center space-y-2 mb-8">
            <span className="inline-block rounded-full bg-emerald-900/60 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
              📢 Publicidad Comunitaria
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight text-emerald-300">
              Publica tu negocio gratis
            </h2>
            <p className="text-xs font-bold text-emerald-100/70 uppercase max-w-md mx-auto leading-relaxed">
              Comparte la información de tu negocio, sube imágenes de tus promociones y publicidad, y agrega tu página o redes sociales. Tu aportación voluntaria es bienvenida.
            </p>
          </div>
          <FormularioPublicidad />
        </div>
      </section>
      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 text-center text-xs space-y-3 border-t border-emerald-950">
        <p>© {new Date().getFullYear()} DCUATES Comunidad. Todos los derechos reservados.</p>
        <div className="pt-1">
          <button 
            onClick={() => setShowPrivacy(true)}
            className="text-emerald-400 hover:text-emerald-300 font-black bg-transparent border-none cursor-pointer text-sm sm:text-base tracking-wide transition-colors"
          >
            👉 VER AVISO DE PRIVACIDAD OFICIAL 👈
          </button>
        </div>
      </footer>

      {/* MODAL DEL AVISO DE PRIVACIDAD */}
      {showPrivacy && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="text-xl font-bold uppercase tracking-tight border-b pb-3 mb-4 text-emerald-800 font-heading">
              Aviso de Privacidad Simplificado
            </h3>
            <div className="overflow-y-auto space-y-3 pr-2 text-sm text-slate-600 leading-relaxed text-justify font-medium">
              <p>
                En cumplimiento con la normativa de protección de datos, <strong>DCUATES</strong> le informa que los datos recabados in este formulario (Nombre de Negocio, Categoría y Enlaces Digitales) tienen la única y exclusiva finalidad de promover de forma comunitaria y gratuita sus actividades comerciales.
              </p>
              <p>
                Sus datos no serán vendidos, transferidos ni compartidos con terceros con fines de lucro. Al enviar la información y continuar la interacción en WhatsApp, usted acepta el tratamiento de los mismos para los fines de difusión colectiva estipulados en nuestras iniciativas de Apoyo al Emprendimiento.
              </p>
              <p>
                Usted puede solicitar la baja, rectificación o eliminación de los datos publicitados en cualquier momento poniéndose en contacto directo mediante nuestros canales oficiales de atención.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 w-full rounded-xl bg-emerald-700 text-white font-black py-3.5 text-center transition-colors hover:bg-emerald-800 uppercase text-xs tracking-wider font-heading"
            >
              Aceptar y Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// =========================================================================
// 3. SUBCOMPONENTE: SITE HEADER (ICONOS REPARADOS SIN RECORTES)
// =========================================================================
function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-800/20 bg-white/95 backdrop-blur py-3 px-4 shadow-sm text-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        
        <a href="#inicio" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2d1e] font-bold text-white text-base">DC</span>
          <span className="text-lg font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs font-black text-slate-600 lg:text-sm">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="hover:text-emerald-700 transition-colors uppercase tracking-wide">{link.label}</a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Facebook">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="Instagram">
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://w3.org">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="YouTube">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93c.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-800/20 bg-white text-emerald-800 transition-colors hover:bg-emerald-50" title="TikTok">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
            </svg>
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden font-bold text-xs bg-emerald-50 border border-emerald-800/20 px-3 py-2 rounded-lg text-emerald-950">
          {open ? "CERRAR" : "MENÚ"}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[57px] bottom-0 bg-white z-50 flex flex-col p-6 md:hidden">
          <nav className="flex flex-col gap-4 text-base font-bold">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="border-b pb-2 uppercase text-slate-800 hover:text-emerald-700">{link.label}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// =========================================================================
// 4. SUBCOMPONENTE: FORMULARIO DE PUBLICIDAD (DISEÑO ORIGINAL DE LA IMAGEN 3)
// =========================================================================
function FormularioPublicidad() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [canal1, setCanal1] = useState("");
  const [canal2, setCanal2] = useState("");
  const [canal3, setCanal3] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { nombre, categoria, canal1, canal2, canal3, fecha: new Date().toLocaleString() };

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Error guardando respaldo en Sheets:", err);
    }

    const mensaje = `¡Hola DCUATES!\n\nSolicito el registro de publicidad para mi negocio:\n• Nombre: ${nombre}\n• Categoría: ${categoria}\n• Enlace 1: ${canal1 || "No especificado"}\n• Enlace 2: ${canal2 || "No especificado"}\n• Canal 3: ${canal3 || "No especificado"}\n\nA continuación adjunto mis imágenes promocionales.`;
    window.open(`https://wa.me{WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-slate-800 border-4 border-[#0f2d1e] p-6 rounded-3xl space-y-4 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">Nombre del negocio *</label>
          <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Taquería El Sol" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">Giro / Categoría *</label>
          <input type="text" required value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Restaurante, Salón, Tienda" />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="block text-xs font-black uppercase tracking-wider text-emerald-800">ENLACES Y REDES DIGITALES</label>
        <input type="url" value={canal1} onChange={e => setCanal1(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="1. Página principal o Correo Electrónico" />
        <input type="url" value={canal2} onChange={e => setCanal2(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="2. Perfil o Página de Facebook (Opcional)" />
        <input type="text" value={canal3} onChange={e => setCanal3(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="3. Cualquier otra Red Social (Opcional)" />
      </div>

      <button type="submit" className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs transition-all mt-2 shadow-md font-heading">
        Enviar registro
      </button>
    </form>
  );
}




