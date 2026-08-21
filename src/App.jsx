import React, { useState, useEffect } from "react";

// =========================================================================
// 1. CONFIGURACIÓN CENTRALIZADA DE VARIABLES, REDES Y HOJA DE CÁLCULO
// =========================================================================
const WHATSAPP_NUMERO = "525520696627";
const GOOGLE_SHEETS_URL = "https://google.com";

const REDES_SOCIALES = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "http://youtube.com",
  tiktok: "https://tiktok.com"
};

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Proyectos", href: "#iniciativas" },
  { label: "Nuevos", href: "#nuevos-proyectos" },
  { label: "Alianzas", href: "#alianzas" },
  { label: "Publicidad", href: "#publicidad" }
];

// Bloque 1: Iniciativas Base de DCUATES
const INICIATIVAS_PRINCIPALES = [
  {
    id: "libros",
    titulo: "Préstamo de Libros",
    intro: "Educación al alcance de todos.",
    descripcion: "Fomentamos la lectura en la comunidad ofreciendo un catálogo accesible de materiales educativos para estudiantes y familias.",
    icono: "📖"
  },
  {
    id: "ecatepets",
    titulo: "Ecatepets",
    intro: "Por el bienestar de nuestras mascotas.",
    descripcion: "Iniciativa dedicada al cuidado, concientización, rescate and apoyo para los animales de compañía en nuestro municipio.",
    icono: "🐾"
  },
  {
    id: "emprendimiento",
    titulo: "Apoyo al Emprendimiento",
    intro: "Publicidad comunitaria gratuita.",
    descripcion: "Difunde tu negocio, promociones and servicios sin costo. Con tu aportación voluntaria nos ayudas a mantener la plataforma viva.",
    icono: "📢"
  }
];

// Bloque 2: Los 4 Proyectos Nuevos Solicitados para el apartado adicional
const NUEVOS_PROYECTOS = [
  {
    id: "asesorias",
    titulo: "Asesorías Personales y de Negocios",
    intro: "Orientación profesional sin barreras.",
    descripcion: "Asesoramiento gratuito and de aportación voluntaria para impulsar tus metas personales o regularizar tu modelo de negocio.",
    icono: "💡"
  },
  {
    id: "bazares",
    titulo: "Bazares, Mercados y Tianguis",
    intro: "Comercio local seguro y de barrio de confianza.",
    descripcion: "Ventas caseras and de calle basadas en la confianza mutua para reactivar la economía de nuestras familias de forma directa.",
    icono: "🏪"
  },
  {
    id: "noticias",
    titulo: "Noticias y Agenda Cultural",
    intro: "El pulso social de nuestra comunidad.",
    descripcion: "Mantente al día con los eventos culturales, convocatorias comunitarias and acontecimientos sociales más relevantes de la zona.",
    icono: "📰"
  },
  {
    id: "bienestar",
    titulo: "Bienestar, Cultura y Recreación",
    intro: "Espacios sanos para convivir.",
    descripcion: "Actividades recreativas and talleres enfocados en el desarrollo integral, la salud mental and el esparcimiento familiar.",
    icono: "✨"
  }
];

// =========================================================================
// 2. COMPONENTE PRINCIPAL DE LA LANDING PAGE
// =========================================================================
export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 selection:bg-emerald-500/30">
      
      {/* Encabezado */}
      <SiteHeader />

      {/* SECCIÓN HERO (Fondo Verde Oscuro) */}
      <section id="inicio" className="bg-[#0f2d1e] text-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <span className="inline-block rounded-full bg-emerald-800/60 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            Juntos hacemos COMUNIDAD
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight md:text-6xl">
            DCUATES IMPULSA TU ENTORNO
          </h1>
          <p className="mx-auto max-w-3xl text-base sm:text-lg text-emerald-100/90 leading-relaxed text-justify sm:text-center">
            <strong>DCUATES</strong> impulsa proyectos, <strong>PERSONAS, ORGANIZACIONES Y EMPRENDIMIENTOS</strong> que <strong>BENEFICIAN a las FAMILIAS</strong>: <strong>PUBLICIDAD GRATUITA</strong> para tu negocio, préstamo de <strong>LIBROS</strong> y materiales <strong>EDUCATIVOS</strong>, apoyo a <strong>MASCOTAS Y GRUPOS VULNERABLES</strong>, y <strong>ALIANZAS GANAR-GANAR</strong> que generan apoyos y beneficios mutuos y comunitarios. Suma con tu valiosa colaboración o con tu invaluable <strong>APOYO VOLUNTARIO</strong> para lograr nuestros objetivos de forma más efectiva, y forjar <strong>LA CADENA DE VALOR Y DE VALORES</strong> que nos liberará de nuestras limitaciones para ser mejores, Y ASÍ MEJORAR NUESTRO ENTORNO Y NUESTRO MUNDO !!!
          </p>
        </div>
      </section>

      {/* SECCIÓN 1: INICIATIVAS BASE (Fondo Claro - Alternado) */}
      <section id="iniciativas" className="bg-slate-50 text-slate-900 py-20 px-4 border-b border-slate-200">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center uppercase tracking-tight mb-12 md:text-5xl">
            Nuestros Proyectos
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {INICIATIVAS_PRINCIPALES.map((item) => (
              <div id={item.id} key={item.id} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-600/40">
                <div className="text-4xl mb-4">{item.icono}</div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide mb-1">{item.titulo}</h3>
                <p className="text-xs font-semibold text-emerald-700 uppercase mb-3">{item.intro}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{item.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: 4 PROYECTOS NUEVOS (Fondo Verde Oscuro - Alternado) */}
      <section id="nuevos-proyectos" className="bg-[#0f2d1e] text-white py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center uppercase tracking-tight mb-4 md:text-5xl">
            Nuevos Proyectos Sociales
          </h2>
          <p className="text-center text-emerald-200/80 mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            Ampliamos nuestro impacto comunitario con cuatro nuevos canales diseñados para responder a tus necesidades directas.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {NUEVOS_PROYECTOS.map((item) => (
              <div id={item.id} key={item.id} className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-6 transition-all hover:bg-emerald-950/60">
                <div className="flex items-start gap-4">
                  <div className="text-4xl bg-emerald-900/50 p-3 rounded-xl">{item.icono}</div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold uppercase tracking-wide text-emerald-400">{item.titulo}</h3>
                    <p className="text-xs font-bold text-white/60 uppercase">{item.intro}</p>
                    <p className="text-sm text-emerald-100/80 pt-2 leading-relaxed">{item.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: ALIANZAS GANAR-GANAR (Fondo Claro - Alternado) */}
      <section id="alianzas" className="bg-slate-50 text-slate-900 py-20 px-4 border-b border-slate-200">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight md:text-5xl">
            Alianzas Ganar-Ganar
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            Hagamos sinergia. Si eres emprendedor, organización o vecino con visión de cambio, colaboremos para robustecer de forma mutua el tejido comunitario.
          </p>
          <button 
            onClick={() => {
              const msg = "Hola DCUATES! Me interesa proponer una Alianza Ganar-Ganar para trabajar en conjunto y multiplicar el impacto social.";
              window.open(`https://wa.me{WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            className="inline-block rounded-xl bg-emerald-700 text-white font-bold px-8 py-3.5 shadow-md hover:bg-emerald-800 transition-colors uppercase tracking-wide text-xs sm:text-sm"
          >
            Generar alianza vía WhatsApp
          </button>
        </div>
      </section>

      {/* SECCIÓN 4: FORMULARIO DE PUBLICIDAD (Fondo Verde Oscuro - Alternado) */}
      <section id="publicidad" className="bg-[#0f2d1e] text-white py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center uppercase tracking-tight mb-8 md:text-5xl">
            Registro de Negocios
          </h2>
          <FormularioPublicidad />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-xs space-y-2 border-t border-slate-900">
        <p>© {new Date().getFullYear()} DCUATES Comunidad. Todos los derechos reservados.</p>
        <button 
          onClick={() => setShowPrivacy(true)}
          className="text-emerald-500 hover:underline font-semibold bg-transparent border-none cursor-pointer"
        >
          Ver Aviso de Privacidad Oficial
        </button>
      </footer>
      {/* MODAL DEL AVISO DE PRIVACIDAD */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <h3 className="text-xl font-bold uppercase tracking-tight border-b pb-3 mb-4 text-emerald-800">
              Aviso de Privacidad Simplificado
            </h3>
            <div className="overflow-y-auto space-y-3 pr-2 text-sm text-slate-600 leading-relaxed text-justify">
              <p>
                En cumplimiento con la normativa de protección de datos, <strong>DCUATES</strong> le informa que los datos recabados en este formulario (Nombre de Negocio, Categoría y Enlaces Digitales) tienen la única y exclusiva finalidad de promover de forma comunitaria y gratuita sus actividades comerciales.
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
              className="mt-6 w-full rounded-xl bg-emerald-700 text-white font-bold py-3 text-center transition-colors hover:bg-emerald-800 uppercase text-xs tracking-wider"
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
// 3. SUBCOMPONENTE: SITE HEADER (MENÚ CON ENLACES REALES COMPLETADOS)
// =========================================================================
function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur py-3 px-4 shadow-sm text-slate-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        
        <a href="#inicio" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2d1e] font-bold text-white text-base">DC</span>
          <span className="text-lg font-black uppercase tracking-tight text-[#0f2d1e]">DCUATES</span>
        </a>

        <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-600 lg:text-sm">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="hover:text-emerald-700 transition-colors uppercase tracking-wide">{link.label}</a>
          ))}
        </nav>
        <div className="hidden sm:flex items-center gap-1.5 font-bold text-[11px]">
          <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" className="px-2 py-1.5 border rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors">FB</a>
          <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" className="px-2 py-1.5 border rounded-lg hover:bg-slate-100 text-slate-600 hover:text-pink-600 transition-colors">IG</a>
          <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" className="px-2 py-1.5 border rounded-lg hover:bg-slate-100 text-slate-600 hover:text-red-600 transition-colors">YT</a>
          <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" className="px-2 py-1.5 border rounded-lg hover:bg-slate-100 text-slate-600 hover:text-black transition-colors">TK</a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden font-bold text-xs bg-slate-100 px-3 py-2 rounded-lg border">
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
          <div className="mt-auto pt-6 border-t text-center space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nuestros Espacios y Canales</p>
            <div className="flex flex-wrap justify-center gap-2 font-bold text-xs">
              <a href={REDES_SOCIALES.facebook} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="px-3 py-2 border rounded-lg bg-slate-50 text-slate-700">FACEBOOK</a>
              <a href={REDES_SOCIALES.instagram} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="px-3 py-2 border rounded-lg bg-slate-50 text-slate-700">INSTAGRAM</a>
              <a href={REDES_SOCIALES.youtube} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="px-3 py-2 border rounded-lg bg-slate-50 text-slate-700">YOUTUBE</a>
              <a href={REDES_SOCIALES.tiktok} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="px-3 py-2 border rounded-lg bg-slate-50 text-slate-700">TIKTOK</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// =========================================================================
// 4. SUBCOMPONENTE: FORMULARIO DE PUBLICIDAD
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
    <form onSubmit={handleSubmit} className="bg-emerald-950/40 border border-emerald-800/50 p-6 rounded-2xl space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Nombre del Negocio / Emprendimiento *</label>
        <input type="text" required value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-emerald-900/30 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Ej. Tacos El Vecino" />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Giro o Categoría Comercial *</label>
        <input type="text" required value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-emerald-900/30 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Ej. Alimentos / Alfarería / Servicios" />
      </div>
      <div className="space-y-2 pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400">Canales y Enlaces Digitales de Contacto (3 Campos)</label>
        <input type="url" value={canal1} onChange={e => setCanal1(e.target.value)} className="w-full bg-emerald-900/30 border border-emerald-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Enlace 1: Ej. https://facebook.com" />
        <input type="url" value={canal2} onChange={e => setCanal2(e.target.value)} className="w-full bg-emerald-900/30 border border-emerald-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Enlace 2: Ej. https://instagram.com" />
        <input type="text" value={canal3} onChange={e => setCanal3(e.target.value)} className="w-full bg-emerald-900/30 border border-emerald-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" placeholder="Canal 3: Ej. Teléfono o Dirección" />
      </div>
      <button type="submit" className="w-full rounded-xl bg-emerald-600 text-white font-bold py-3 uppercase tracking-wider text-xs hover:bg-emerald-500 transition-colors mt-2 shadow-md">
        Enviar Registro y Abrir WhatsApp
      </button>
    </form>
  );
}

   

