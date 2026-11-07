// api/_guiaDatos.js  (el guion bajo evita que Vercel lo publique como función)
// Contenido de la «Guía Visual» (maqueta técnica). Solo lo entrega api/guia.js con sesión de administrador válida.
export const WHATSAPP_NEGOCIOS = "525540476247"; // WhatsApp Business de DCUATES

export const GUIA = {
  whatsapp: WHATSAPP_NEGOCIOS,
  titulo: "Guía Visual DCUATES · vista móvil",
  pantallas: [
    {
      id: "p1", etiqueta: "PANTALLA 1: SECCIÓN DE BIENVENIDA (HERO)",
      titulos: ["DCUATES", "COMUNIDAD", "ALIANZAS GANAR-GANAR"],
      video: "Video de bienvenida (apilado bajo el logo)",
      notas: "Logo circular, video apilado en una sola columna y los tres títulos principales."
    },
    {
      id: "p2", etiqueta: "PANTALLA 2: CATÁLOGO DE INICIATIVAS (BLOQUE DE 4)",
      iniciativas: [
        { icono: "🚲", t: "Bibliobici", d: "Libros que llegan en bicicleta a los puntos Amigos de la comunidad.", b: "Pedir un libro" },
        { icono: "🐾", t: "Ecatepets", d: "Adopta, reporta una mascota extraviada o ayuda a un hogar temporal.", b: "Ver mascotas" },
        { icono: "🤝", t: "Donaciones alternativas", d: "Datos bancarios ocultos: la donación se coordina por WhatsApp.", b: "Donar por WhatsApp" },
        { icono: "💚", t: "Inclusión social", d: "Actividades y apoyos para que nadie se quede fuera de la comunidad.", b: "Quiero participar" }
      ],
      notas: "Una sola columna vertical. En Donaciones no se muestran datos bancarios; el botón deriva a WhatsApp."
    },
    {
      id: "p3", etiqueta: "PANTALLA 3: FORMULARIO DE REGISTRO (APOYO AL EMPRENDIMIENTO)",
      titulo: "Registra tu micro-negocio",
      campos: [
        { n: "Nombre del negocio", ph: "Ej. Taquería Doña Rosa" },
        { n: "Giro", ph: "Comida, servicios, comercio…" },
        { n: "Zona o colonia", ph: "Ej. Jardines de Morelos" },
        { n: "WhatsApp de contacto", ph: "10 dígitos" }
      ],
      boton: "Enviar por WhatsApp",
      mensaje: "¡Hola DCUATES! Quiero registrar mi micro-negocio en Apoyo al emprendimiento.",
      notas: "El botón abre directamente el chat de WhatsApp Business de DCUATES con el mensaje ya escrito."
    },
    {
      id: "p4", etiqueta: "PANTALLA 4: MATRIZ DE INTERACCIÓN DE BOTONES",
      variantes: [
        { k: "solido", n: "Variante A · Sólido", t: "Quiero participar" },
        { k: "contorno", n: "Variante B · Contorno", t: "Conocer más" },
        { k: "suave", n: "Variante C · Suave", t: "Ver detalles" }
      ],
      estados: [
        { k: "normal", n: "Normal" },
        { k: "hover", n: "Hover (toque sostenido)" },
        { k: "activo", n: "Click / Active (scale-95)" }
      ],
      notas: "En Hover y Click/Active, el círculo semitransparente simula el toque del dedo."
    }
  ]
};
