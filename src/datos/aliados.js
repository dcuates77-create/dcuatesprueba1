// =========================================================================
// src/datos/aliados.js — ZONA DE ALIADOS, PATROCINADORES, VOLUNTARIOS Y AMIGOS
// (e63) Las CLAVES y el CONTENIDO por perfil (beneficios, actividades de voluntarios, kit de difusión) ya NO están aquí:
// viven en tu hoja de Google, pestañas «Claves» y «Zonas», y el Apps Script solo los entrega con la clave correcta.
// Aquí quedan únicamente los nombres, emojis y colores de los perfiles y los títulos de las tarjetas (nada secreto).
// =========================================================================
export const PERFILES = {
  aliado: { nombre: "Aliado", emoji: "🏪", color: "#C2410C" },
  patrocinador: { nombre: "Patrocinador", emoji: "🌟", color: "#B7791F" },
  voluntario: { nombre: "Voluntario", emoji: "🙋", color: "#2E9E5B" },
  amigo: { nombre: "Amigo", emoji: "💛", color: "#1B6F8A" }
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

