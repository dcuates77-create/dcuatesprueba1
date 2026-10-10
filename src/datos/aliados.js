// =========================================================================
// src/datos/aliados.js — ZONA DE ALIADOS, PATROCINADORES, VOLUNTARIOS Y AMIGOS
// ⚠️ CANDADO SENCILLO (etapa de prueba): estas claves viven en el código, así que
// cualquiera con conocimientos técnicos podría verlas. Sirve para ocultar
// contenido NO sensible mientras pruebas. NO pongas aquí datos personales ni
// información confidencial. Más adelante se cambia a clave verificada en servidor.
// Cambia las claves por las tuyas antes de compartirlas.
// =========================================================================
export const PERFILES = {
  aliado: { nombre: "Aliado", emoji: "🏪", color: "#C2410C", clave: "aliado2026" },
  patrocinador: { nombre: "Patrocinador", emoji: "🌟", color: "#B7791F", clave: "patro2026" },
  voluntario: { nombre: "Voluntario", emoji: "🙋", color: "#2E9E5B", clave: "volun2026" },
  amigo: { nombre: "Amigo", emoji: "💛", color: "#1B6F8A", clave: "amigo2026" }
};

// Beneficios particulares por perfil (edítalos con tus acuerdos reales).
export const BENEFICIOS = {
  aliado: ["Aparecer en Cupones y Promos y en la ruleta de Juega y gana.", "Kit de difusión listo para compartir en tus redes.", "Prioridad en la agenda de reuniones de negocios."],
  patrocinador: ["Mención como patrocinador en la página y la barra de agradecimientos.", "Reporte de impacto de lo que su apoyo hizo posible.", "Reconocimiento digital para compartir."],
  voluntario: ["Constancia de participación por tus horas.", "Acceso a capacitaciones y actividades abiertas.", "Reconocimiento en el cuadro de honor (con tu permiso)."],
  amigo: ["Invitaciones a tertulias, jornadas y eventos de la comunidad.", "Material para invitar a otros y sumar Semillas.", "Canal directo con la administración."]
};

// Cada tarjeta indica qué perfiles pueden abrirla ("todos" = cualquiera con clave).
export const TARJETAS_ALIADOS = [
  { id: "beneficios", emoji: "🎁", titulo: "MIS BENEFICIOS", texto: "Lo que DCUATES tiene para ti según tu perfil.", color: "#C2410C", perfiles: "todos" },
  { id: "ofrece", emoji: "🏷️", titulo: "OFRECE A LA COMUNIDAD", texto: "Comparte un cupón, descuento o regalo para los demás.", color: "#E5484D", perfiles: ["aliado", "patrocinador", "amigo"] },
  { id: "admin", emoji: "📨", titulo: "HABLA CON LA ADMINISTRACIÓN", texto: "Consultas, acuerdos y gestiones particulares.", color: "#1B6F8A", perfiles: "todos" },
  { id: "impacto", emoji: "📊", titulo: "REPORTE DE IMPACTO", texto: "Lo que hemos logrado juntos y cómo se aprovecha tu apoyo.", color: "#B7791F", perfiles: ["patrocinador", "aliado"] },
  { id: "voluntarios", emoji: "🙋", titulo: "VOLUNTARIADO", texto: "Actividades abiertas, registro de horas y constancia.", color: "#2E9E5B", perfiles: ["voluntario"] },
  { id: "reuniones", emoji: "📅", titulo: "REUNIONES Y AGENDA", texto: "Próximas fechas de la comunidad y reuniones.", color: "#7a5ad8", perfiles: "todos" },
  { id: "difusion", emoji: "📣", titulo: "KIT DE DIFUSIÓN", texto: "Mensajes listos para compartir y sumar a más gente.", color: "#0E7490", perfiles: "todos" }
];

export const ACTIVIDADES_VOLUNTARIOS = [
  { titulo: "Tertulia literaria", info: "Apoyo con lectura y organización del espacio." },
  { titulo: "Jornada de adopción de peluditos", info: "Orientación a visitantes y acompañamiento." },
  { titulo: "Entrega de libros y materiales", info: "Registro y préstamo de libros." }
];
export const MENSAJES_DIFUSION = [
  "Conoce DCUATES: una comunidad que genera proyectos sociales, cultiva amistades y apoya a personas, grupos y causas. dcuates.com",
  "Juega, participa y suma Semillas en la ZONA DE CUATES 🎮🌱 dcuates.com",
  "Pide un libro prestado, ayuda a un peludito o descubre descuentos de negocios locales en dcuates.com 💛"
];
