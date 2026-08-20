import { useState, useEffect, useRef } from "react";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/abelzarem/",
  youtube: "https://www.youtube.com/@abelmeraz",
  instagram: "https://www.instagram.com/abel.zarem",
  tiktok: "https://www.tiktok.com/@dcuates",
};

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#publicidad", label: "Publicidad" },
  { href: "#alianzas", label: "Alianzas" },
  { href: "#donaciones", label: "Donaciones" },
];

const PROJECTS = [
  {
    id: "bibliobici",
    tag: "Educación y desarrollo",
    title: "LA BIBLIOBICI Y AMIGOS",
    icon: "book",
    desc: "Préstamo gratuito de libros y materiales educativos para el desarrollo personal y social. La lectura que llega hasta tu colonia para fortalecer a la **COMUNIDAD**.",
    points: ["Préstamo sin costo", "Materiales para todas la edades", "Fomento a la lectura"],
    cta: "Quiero participar",
    href: "#alianzas",
  },
  {
    id: "ecatepets",
    tag: "Bienestar animal",
    title: "ECATEPETS",
    icon: "paw",
    desc: "Apoyo en la búsqueda de mascotas extraviadas, y fomento de la adopción y el cuidado animal responsable en conjunto con los vecinos de **DCUATES**.",
    points: ["Difusión de extravíos", "Adopción responsable", "Cuidado y concientización"],
    cta: "Sumarme a la causa",
    href: "#alianzas",
  },
  {
    id: "alianzas-card",
    tag: "Crecimiento conjunto",
    title: "ALIANZAS GANAR-GANAR",
    icon: "handshake",
    desc: "Emprendedores, organizaciones y particulares que desean hacer sinergia para crecer juntos y robustecer el tejido social de la **COMUNIDAD**.",
    points: ["Colaboración mutua", "Red de contactos", "Impacto comunitario"],
    cta: "Generar alianza",
    href: "#alianzas",
  },
  {
    id: "publicidad",
    tag: "Proyecto principal",
    title: "PUBLICIDAD COMUNITARIA",
    icon: "megaphone",
    desc: "Difunde tu negocio, promociones y servicios de forma gratuita. Con aportación voluntaria ayudas a que la plataforma de **DCUATES** llegue a más familias.",
    points: ["Registro gratuito", "Comparte promociones e imágenes", "Más clientes de tu zona"],
    cta: "Publicar mi negocio",
    href: "#publicidad",
  },
];

const WHATSAPP_NUMBER = "525520696627";
const WHATSAPP_MESSAGE = "Hola DCUATES, quiero registrar mi negocio o conocer más sobre los proyectos";

function Icon({ name, className = "h-6 w-6" }) {
  const icons = {
    megaphone: (
      <>
        <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
        <path d="M8 6v8" />
      </>
    ),
    book: (
      <>
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </>
    ),
    paw: (
      <>
        <circle cx="11" cy="4" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
      </>
    ),
    handshake: (
      <>
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </>
    ),
    heart: <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />,
    shield: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    upload: (
      <>
        <path d="M12 3v12" />
        <path d="m17 8-5-5-5 5" />
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </>
    ),
    atsign: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
      </>
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    copy: (
      <>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    mail: (
      <>
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" />
      </>
    ),
    trending: (
      <>
        <path d="M16 7h6v6" />
        <path d="m22 7-8.5 8.5-5-5L2 17" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
    sparkles: (
      <>
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
        <path d="M20 2v4" />
        <path d="M22 4h-4" />
        <circle cx="4" cy="20" r="2" />
      </>
    ),
    imageplus: (
      <>
        <path d="M16 5h6" />
        <path d="M19 2v6" />
        <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        <circle cx="9" cy="9" r="2" />
      </>
    ),
    heartHandshake: <path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" />,
    menu: (
      <>
        <path d="M4 5h16" />
        <path d="M4 12h16" />
        <path d="M4 19h16" />
      </>
    ),
    close: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    loader: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function SocialIcon({ platform, className = "h-6 w-6" }) {
  const paths = {
    facebook: "M22 12.06C22 6.48 17.52 2 11.94 2 6.36 2 1.88 6.48 1.88 12.06c0 5.02 3.68 9.18 8.49 9.94v-7.03H7.83v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.81-.76 8.49-4.92 8.49-9.94Z",
    youtube: "M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.39 0 12 0 12s0 3.61.5 5.5a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.89.5-5.5.5-5.5s0-3.61-.5-5.5ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z",
    instagram: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.41-10.4a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z",
    tiktok: "M16.6 5.82a4.28 4.28 0 0 1-1.01-2.82h-3.3v13.4a2.52 2.52 0 0 1-2.52 2.5 2.52 2.52 0 0 1-.4-5.01v-3.36a5.85 5.85 0 1 0 6.22 5.85V9.01a7.58 7.58 0 0 0 4.41 1.41V7.12a4.28 4.28 0 0 1-3.4-1.3Z",
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={paths[platform]} />
    </svg>
  );
}

const SOCIALS = [
  { key: "facebook", label: "Facebook", href: SOCIAL_LINKS.facebook },
  { key: "youtube", label: "YouTube", href: SOCIAL_LINKS.youtube },
  { key: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram },
  { key: "smartphone", label: "TikTok", href: SOCIAL_LINKS.tiktok }
];

function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur" suppressHydrationWarning={true}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        
        {/* Logotipo Izquierda */}
        <a href="#inicio" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent font-heading text-lg font-bold text-accent-foreground">
            DC
          </span>
          <span className="font-heading text-xl font-extrabold leading-none tracking-tight text-foreground uppercase">
            DCUATES
          </span>
        </a>

        {/* Menú de Navegación de Escritorio (Desktop) */}
        <nav className="hidden items-center gap-6 text-base font-medium text-muted-foreground lg:flex">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.href} 
              href={link.href} 
              className="transition-colors hover:text-foreground font-semibold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Sección Derecha: Redes Sociales (Desktop) y Botón Hamburguesa (Móvil) */}
        <div className="flex items-center gap-4">
          
          {/* Redes Sociales fijas en Desktop (Logos SVG Directos) */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Facebook"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="YouTube"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Instagram"
            >
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://w3.org">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="TikTok"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
              </svg>
            </a>
          </div>

          {/* Botón de Hamburguesa Móvil */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL EN MODO FLOANTE (OVERLAY ABSOLUTO) */}
      {open && (
        <div className="fixed inset-x-0 top-[69px] bottom-0 z-50 flex flex-col bg-background/98 animate-in fade-in slide-in-from-top-5 duration-200 lg:hidden">
          <nav className="flex flex-col p-6 gap-5 border-t border-border/40">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-xl font-bold text-foreground border-b border-border/40 pb-3 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          {/* Bloque de Redes Sociales en el pie del menú móvil flotante */}
          <div className="mt-auto p-6 bg-secondary/30 border-t border-border/40">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">
              Síguenos en redes sociales
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24" xmlns="http://w3.org">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93c.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
              >
                <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://w3.org">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-accent"
              >
                                           <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.13 2.29 1.89 3.73 2.18l-.02 3.88c-1.63-.03-3.2-.55-4.51-1.52A7.83 7.83 0 0 1 16.43 7.5v8.32a7.83 7.83 0 0 1-3.32 6.42 7.91 7.91 0 0 1-8.73-.24 7.85 7.85 0 0 1-3.23-7.58 7.84 7.84 0 0 1 5.37-6.84V11.5a3.94 3.94 0 0 0-1.5 3.32 3.93 3.93 0 0 0 3.2 3.88 3.93 3.93 0 0 0 4.61-3.2c.04-.33.05-.66.05-.99V.02z" />
                    </svg>
            </a>
  </div>
</div>
)}
</header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:px-6 md:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
        
        {/* Columna Texto (Izquierda) */}
              <div className="order-2 flex flex-col items-start gap-5 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-lg font-bold uppercase tracking-wider text-primary shadow-sm">
            <Icon name="handshake" className="h-6 w-5 text-accent" />
            PROYECTOS COMUNITARIOS DCUATES
          </span>
          <h1 className="font-heading text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Juntos hacemos <strong>COMUNIDAD</strong>
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-foreground/80 md:text-xl mt-4">
            <strong>DCUATES</strong> impulsa proyectos que benefician a las familias: publicidad gratuita para tu
            negocio, préstamo de libros y materiales, apoyo a mascotas y <strong>ALIANZAS GANAR-GANAR</strong>.
            Súmate con tu participación o con tu apoyo voluntario.
          </p>
        </div>

        {/* Columna Imagen Corregida (Derecha) */}
        <div className="order-1 lg:order-2 w-full">
          <div className="relative w-full max-w-[550px] mx-auto overflow-hidden rounded-3xl shadow-lg">
            <img
              src="images/hero-comunidad.png"
              className="w-full h-auto block object-contain mx-auto"
              alt="Comunidad latina reunida: negocio local, préstamo de libros en bici y rescate de una mascota"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
function Projects() {
  return (
    <section id="proyectos" className="bg-section-dark text-section-dark-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-section-dark-foreground/10 px-4 py-1.5 text-base font-medium text-section-dark-foreground">
            Nuestros proyectos
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-extrabold md:text-4xl">
            Cuatro formas de sumar a la comunidad
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-section-dark-muted">
            Cada proyecto de DCUATES busca el bienestar colectivo. Conócelos, participa y comparte.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl bg-card p-6 text-card-foreground shadow-sm md:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent md:h-18 md:w-18">
                  <Icon name={p.icon} className="h-8 w-8 md:h-9 md:w-9" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {p.tag}
                  </p>
                  <h3 className="font-heading text-2xl font-bold leading-tight">{p.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-pretty text-base leading-relaxed text-foreground/80">
                {p.desc}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-base text-foreground">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
              <a
                href={p.href}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {p.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border-2 border-input bg-card px-3.5 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30";
const labelClass = "mb-1.5 block text-base font-medium text-foreground";

function BusinessRegistration() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const fileRef = useRef(null);

  function handleFiles(files) {
    if (!files) return;
    const arr = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setImages((prev) => [...prev, ...arr].slice(0, 6));
  }

  function removeImage(id) {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.id !== id);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Captura de los datos optimizados
    const bName = formData.get("businessName");
    const bCat = formData.get("category");
    const bOwner = formData.get("ownerName");
    const bPhone = formData.get("phone");
    const bAddress = formData.get("address") || "No proporcionada";
    const bMainLink = formData.get("mainLink");
    const bFacebook = formData.get("facebookLink") || "No proporcionado";
    const bOtherSocial = formData.get("otherSocialLink") || "No proporcionado";
    const bDesc = formData.get("description") || "Sin descripción adicional";

    setStatus("submitting");
    
    // Armado del mensaje automatizado para tu WhatsApp
    const mensajeWhatsApp = `Hola, DCUATES, quiero REGISTRAR MI NEGOCIO o conocer mas sobre los demas proyectos, o para atencion personal, GRACIAS!!!%0A%0A` +
      `*DETALLES DEL REGISTRO:*%0A` +
      `• *Negocio:* ${encodeURIComponent(bName)}%0A` +
      `• *Giro:* ${encodeURIComponent(bCat)}%0A` +
      `• *Propietario:* ${encodeURIComponent(bOwner)}%0A` +
      `• *WhatsApp:* ${encodeURIComponent(bPhone)}%0A` +
      `• *Dirección:* ${encodeURIComponent(bAddress)}%0A` +
      `• *Enlace principal/Correo:* ${encodeURIComponent(bMainLink)}%0A` +
      `• *Facebook:* ${encodeURIComponent(bFacebook)}%0A` +
      `• *Otra Red:* ${encodeURIComponent(bOtherSocial)}%0A` +
      `• *Descripción:* ${encodeURIComponent(bDesc)}%0A%0A` +
      `Por favor, adjunta a este chat las imágenes de tu negocio y la promoción que deseas que publiquemos para completar tu registro.`;

    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    form.reset();
    setImages([]);
    
    // Disparador dinámico nativo sin pérdida de caracteres especiales
    window.open(`https://wa.me{mensajeWhatsApp}`, '_blank');
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <Icon name="check" className="mx-auto mb-4 h-14 w-14 text-accent" />
        <h3 className="font-heading text-2xl font-bold text-foreground">¡Registro procesado!</h3>
        <p className="mx-auto mt-2 max-w-md text-pretty text-lg leading-relaxed text-foreground/80">
          Tu información ha sido recopilada. Se abrirá **WhatsApp** para que puedas enviar las imágenes promocionales de tu negocio.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Registrar otro negocio
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
      {/* Sección 1: Datos de Identidad */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="businessName" className={labelClass}>Nombre del negocio</label>
          <input id="businessName" name="businessName" required className={inputClass} placeholder="Ej. Taquería El Sol" />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>Giro / categoría</label>
          <input id="category" name="category" required className={inputClass} placeholder="Ej. Restaurante, Salón, Tienda" />
        </div>
        <div>
          <label htmlFor="ownerName" className={labelClass}>Nombre del propietario</label>
          <input id="ownerName" name="ownerName" required className={inputClass} placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Teléfono de contacto (WhatsApp)</label>
          <input id="phone" name="phone" type="tel" required className={inputClass} placeholder="Ej. 5512345678" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="address" className={labelClass}>Dirección (Física u Online)</label>
          <input id="address" name="address" className={inputClass} placeholder="Calle, número, ciudad o colonia" />
        </div>
      </div>

      {/* Sección 2: Canales Digitales de 3 Niveles (Sin Email General) */}
      <div className="mt-6 grid gap-5 border-t border-border pt-6">
        <h4 className="text-base font-bold text-primary uppercase tracking-wider">Enlaces y Redes Digitales</h4>
        
        <div>
          <label htmlFor="mainLink" className={labelClass}>1. Página principal o Correo Electrónico</label>
          <div className="relative">
            <Icon name="globe" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input id="mainLink" name="mainLink" required className={`${inputClass} pl-11`} placeholder="Página Web, Menú Digital o correo@ejemplo.com" />
          </div>
        </div>

        <div>
          <label htmlFor="facebookLink" className={labelClass}>2. Perfil o Página de Facebook (Opcional)</label>
          <div className="relative">
            <Icon name="facebook" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input id="facebookLink" name="facebookLink" className={`${inputClass} pl-11`} placeholder="Ej. ://facebook.com" />
          </div>
        </div>

        <div>
          <label htmlFor="otherSocialLink" className={labelClass}>3. Cualquier otra Red Social (Opcional)</label>
          <div className="relative">
            <Icon name="instagram" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input id="otherSocialLink" name="otherSocialLink" className={`${inputClass} pl-11`} placeholder="Instagram, TikTok, YouTube o X" />
          </div>
        </div>
      </div>

      {/* Sección 3: Descripción e Imágenes */}
      <div className="mt-5">
        <label htmlFor="description" className={labelClass}>Descripción y promociones</label>
        <textarea id="description" name="description" rows={4} className={inputClass} placeholder="Cuéntanos brevemente sobre tu negocio o qué promociones te gustaría difundir." />
      </div>

      <div className="mt-5">
        <span className={labelClass}>Imágenes del negocio (Para adjuntar luego en WhatsApp)</span>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileRef.current?.click();
            }
          }}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/50 px-4 py-8 text-center transition-colors hover:border-primary hover:bg-secondary"
        >
          <Icon name="upload" className="h-8 w-8 text-primary" />
          <p className="text-base font-medium text-foreground">Selecciona tus imágenes</p>
          <p className="text-sm text-muted-foreground">Sube hasta 6 fotos (promociones, logotipos, etc.)</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {images.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <li key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  aria-label={`Quitar ${img.name}`}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/70 text-background transition-colors hover:bg-destructive"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Icon name="loader" className="h-5 w-5 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar registro"
        )}
      </button>
    </form>
  );
}

function Publicidad() {
  return (
    <section id="publicidad" className="bg-section-light text-section-light-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-primary/15 px-4 py-1.5 text-base font-medium text-primary">
            Publicidad comunitaria
          </span>
          <h2 className="mt-4 text-balance font-heading text-3xl font-extrabold md:text-4xl">
            Publica tu negocio gratis
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/80">
            Comparte la información de tu negocio, sube imágenes de tus promociones y publicidad, y
            agrega tu página o redes sociales. Tu registro se envía directamente a nuestro formulario
            para su revisión. Es gratuito; tu aportación voluntaria es bienvenida.
          </p>
        </div>
        <BusinessRegistration />
      </div>
    </section>
  );
}

function Alianzas() {
  const benefits = [
    {
      icon: "trending",
      title: "Crecimiento conjunto",
      desc: "Sumamos esfuerzos y recursos para que todos crezcan: tú, tu organización y la comunidad.",
    },
    {
      icon: "users",
      title: "Red que impulsa",
      desc: "Conecta con emprendedores, organizaciones y personas que comparten tus valores y metas.",
    },
    {
      icon: "sparkles",
      title: "Impacto real",
      desc: "Cada alianza fortalece proyectos sociales con beneficios claros para ambas partes.",
    },
  ];
  return (
    <section id="alianzas" className="bg-section-dark text-section-dark-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-section-dark-foreground/10 px-4 py-1.5 text-base font-medium text-section-dark-foreground">
              <Icon name="handshake" className="h-5 w-5" />
              Alianzas Ganar-Ganar
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-extrabold md:text-4xl">
              Hagamos sinergia para crecer juntos
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-section-dark-muted">
              Invitamos a emprendedores, organizaciones y particulares que desean colaborar para el
              desarrollo conjunto y comunitario. Si compartes nuestra visión, sumemos fuerzas.
            </p>
            <div className="mt-8 flex flex-col gap-5">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Icon name={b.icon} className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-bold">{b.title}</h3>
                    <p className="mt-1 text-pretty text-base leading-relaxed text-section-dark-muted">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="mailto:contacto@dcuates.org?subject=Quiero%20generar%20una%20alianza%20con%20DCUATES"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-lg font-bold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
            >
              <Icon name="mail" className="h-6 w-6" />
              Quiero ser aliado
            </a>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h3 className="font-heading text-xl font-bold text-card-foreground">
              Tu marca, junto a la nuestra
            </h3>
            <p className="mt-1.5 text-base leading-relaxed text-foreground/80">
              Este espacio es para el logo de nuestros aliados. Al sumarte, tu marca se muestra aquí
              como parte de la comunidad DCUATES.
            </p>
            <div className="mt-8 flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-secondary/50 p-8 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon name="imageplus" className="h-10 w-10" />
              </span>
              <p className="text-lg font-bold text-foreground">Espacio para tu logo</p>
              <p className="text-base text-muted-foreground">
                Comparte tu logotipo al hacer tu alianza y lo colocamos aquí.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex aspect-[4/3] items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40 text-base font-medium text-muted-foreground"
                >
                  Aliado {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-base font-semibold text-foreground">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copiar ${label}`}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-border px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
      >
        {copied ? (
          <>
            <Icon name="check" className="h-4 w-4 text-accent" /> Copiado
          </>
        ) : (
          <>
            <Icon name="copy" className="h-4 w-4" /> Copiar
          </>
        )}
      </button>
    </div>
  );
}

function Donations() {
  // Función para abrir los chats de WhatsApp con mensajes personalizados y estructurados
  function handleWhatsAppDonation(tipo) {
    let mensaje = "";
    if (tipo === "economica") {
      mensaje = "¡Hola! Me gustaría realizar una aportación económica a *DCUATES*. ¿Me podrían compartir los datos de la cuenta bancaria? ¡Muchas gracias!";
    } else if (tipo === "especie") {
      mensaje = "¡Hola! Quiero apoyar a *DCUATES* con una donación en especie (materiales/insumos). ¿Me podrían indicar qué es lo que más necesitan actualmente y cómo coordinar la entrega?";
    } else if (tipo === "trueque") {
      mensaje = "¡Hola! Me interesa la economía solidaria y me gustaría proponer un trueque con productos o servicios para los proyectos de *DCUATES*. ¿Cómo podemos coordinarlo?";
    } else if (tipo === "voluntario") {
      mensaje = "¡Hola! Me entusiasman los proyectos de *DCUATES* y quiero donar mi tiempo y conocimientos como voluntario. ¿Cuáles son los perfiles o actividades donde puedo sumarme?";
    }

    // Recuerda reemplazar TUNUMERODEWHATSAPP por tu número real a 10 dígitos (ej. 5512345678)
    window.open(`https://wa.me/5520696627?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  return (
    <section id="donaciones" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Columna Izquierda: Información */}
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-base font-bold uppercase tracking-wider text-primary shadow-sm">
              <Icon name="handshake" className="h-5 w-5 text-accent" />
              APOYO VOLUNTARIO
            </span>
            <h2 className="mt-4 text-balance font-heading text-3xl font-black text-foreground md:text-4xl uppercase">
              Tu aportación impulsa a la **COMUNIDAD**
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-foreground/80">
              Cada donativo, del formato que decidas, nos ayuda a sostener y hacer crecer los proyectos 
              que benefician a los negocios y familias latinas en conjunto con **DCUATES**.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-accent/30 bg-accent/5 p-4">
              <Icon name="shield" className="mt-0.5 h-7 w-7 shrink-0 text-accent" />
              <p className="text-base leading-relaxed text-foreground">
                Parte de la utilidad de los proyectos se destina al {" "}
                <strong>apoyo de causas sociales, con total transparencia.</strong> Rendimos cuentas de cómo se usa cada aportación.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Opciones de Aportación Directas a WhatsApp */}
          <div className="lg:col-span-3 flex flex-col gap-4 justify-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Selecciona tu tipo de aportación:</h3>
            
            <button
              type="button"
              onClick={() => handleWhatsAppDonation("economica")}
              className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:bg-primary/5 group"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon name="credit-card" className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-lg text-foreground">Aportación Económica</h4>
                  <p className="text-sm text-muted-foreground">Solicita los datos bancarios de manera directa y segura.</p>
                </div>
              </div>
              <Icon name="chevron-right" className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleWhatsAppDonation("especie")}
              className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:bg-primary/5 group"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon name="package" className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-lg text-foreground">Aportación en Especie</h4>
                  <p className="text-sm text-muted-foreground">Apoya donando herramientas, materiales o insumos útiles.</p>
                </div>
              </div>
              <Icon name="chevron-right" className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleWhatsAppDonation("trueque")}
              className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:bg-primary/5 group"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon name="refresh-cw" className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-lg text-foreground">Trueque Solidario</h4>
                  <p className="text-sm text-muted-foreground">Intercambia productos o servicios de valor equivalente.</p>
                </div>
              </div>
              <Icon name="chevron-right" className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleWhatsAppDonation("voluntario")}
              className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary hover:bg-primary/5 group"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon name="users" className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-bold text-lg text-foreground">Labor Voluntaria</h4>
                  <p className="text-sm text-muted-foreground">Dona tu valioso tiempo y conocimientos para crecer juntos.</p>
                </div>
              </div>
              <Icon name="chevron-right" className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

const PRIVACY_SECTIONS = [
  {
    title: "Datos que recabamos",
    body: "Podemos recabar datos de identificación y contacto (como nombre, teléfono, correo electrónico y datos de tu negocio), así como las imágenes y enlaces que decidas compartir para su difusión. Solo recabamos los datos necesarios para las finalidades descritas.",
  },
  {
    title: "Finalidad del tratamiento",
    body: "Utilizamos tus datos para: registrar y difundir tu negocio o participación, promover nuestros proyectos comunitarios, gestionar donativos y alianzas, y ponernos en contacto contigo. No usaremos tus datos para fines distintos sin tu consentimiento.",
  },
  {
    title: "Transferencia de datos",
    body: "No compartimos tus datos personales con terceros ajenos, salvo aquellos necesarios para operar la plataforma (por ejemplo, servicios de formularios) o cuando la ley lo requiera.",
  },
  {
    title: "Derechos ARCO",
    body: "Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos (Derechos ARCO), así como a revocar tu consentimiento. Para ejercerlos, escríbenos a contacto@dcuates.org.",
  },
  {
    title: "Cambios al aviso",
    body: "Este Aviso de Privacidad puede actualizarse en cualquier momento. Cualquier cambio será publicado en esta misma página.",
  },
];

function PrivacyModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de Privacidad"
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-heading text-2xl font-extrabold text-foreground">
            Aviso de Privacidad
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar aviso de privacidad"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          <p className="text-sm text-muted-foreground">Última actualización: 2026</p>
          <div className="mt-4 flex flex-col gap-5 text-base leading-relaxed text-foreground/80">
            <p>
              <strong className="text-foreground">DCUATES</strong>
              (en adelante, "nosotros"), responsable del tratamiento de tus datos personales, hace de tu
              conocimiento el presente Aviso de Privacidad, de conformidad con la legislación aplicable
              en materia de protección de datos personales.
            </p>
            {PRIVACY_SECTIONS.map((s) => (
              <div key={s.title}>
                <h3 className="font-heading text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-1">{s.body}</p>
              </div>
            ))}
            <p className="text-sm">
              Al proporcionar tus datos y utilizar esta plataforma, aceptas los términos del presente
              Aviso de Privacidad.
            </p>
          </div>
        </div>
        <div className="border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer({ onOpenPrivacy }) {
  return (
    <footer className="bg-section-dark text-section-dark-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center md:px-6">
        <span className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-section-dark-foreground/10 font-heading text-lg font-extrabold text-section-dark-foreground">
            DC
          </span>
          <span className="font-heading text-2xl font-extrabold tracking-tight">DCUATES</span>
        </span>
        <p className="max-w-md text-pretty text-base leading-relaxed text-section-dark-muted">
          Proyectos comunitarios que impulsan a las familias. Parte de la utilidad se destina al apoyo
          de causas sociales, con total transparencia.
        </p>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ key, label, href }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-section-dark-foreground/10 text-section-dark-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <SocialIcon platform={key} className="h-8 w-8" />
            </a>
          ))}
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-2 text-base font-medium text-section-dark-muted">
          <a href="#proyectos" className="transition-colors hover:text-section-dark-foreground">Proyectos</a>
          <a href="#publicidad" className="transition-colors hover:text-section-dark-foreground">Publicidad</a>
          <a href="#donaciones" className="transition-colors hover:text-section-dark-foreground">Donaciones</a>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="cursor-pointer underline underline-offset-4 transition-colors hover:text-section-dark-foreground"
          >
            Aviso de Privacidad
          </button>
        </nav>
        <p className="text-sm text-section-dark-muted">© 2026 DCUATES. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

function WhatsAppButton() {
  const mensajeBase = "Hola, DCUATES, quiero REGISTRAR MI NEGOCIO o conocer mas sobre los demas proyectos, o para atencion personal, GRACIAS!!!";

  return (
    <a
      href={`https://wa.me{encodeURIComponent(mensajeBase)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all hover:scale-110 active:scale-95 animate-bounce duration-1000"
      title="Atención personal y dudas"
    >
      {/* Icono de WhatsApp Optimizado */}
      <svg
        className="h-8 w-8 fill-current text-white"
        viewBox="0 0 24 24"
        xmlns="http://w3.org"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

export default function App() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning={true}>
      <SiteHeader />
      <Hero />
      <Projects />
      <Alianzas />
      <Donations />
      <Publicidad />
      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />
      <WhatsAppButton />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </main>
  );
}
