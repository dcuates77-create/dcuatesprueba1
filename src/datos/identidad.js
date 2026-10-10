// =========================================================================
// src/datos/identidad.js — Un mismo emoji y color por proyecto, en toda la Zona.
// Así la gente reconoce el proyecto aunque lo vea en un cupón, un juego o la agenda.
// La clave es el id del proyecto (el mismo que abre su ventana).
// =========================================================================
export const IDENTIDAD = {
  libros: { emoji: "📚", color: "#2E9E5B", nombre: "Préstamo de libros" },
  ecatepets: { emoji: "🐾", color: "#E5484D", nombre: "Ecatepets" },
  donaciones: { emoji: "🙋", color: "#0E7490", nombre: "Apoyo voluntario" },
  asesorias: { emoji: "🎓", color: "#1B6F8A", nombre: "Asesorías gratuitas" },
  "circulo-confianza": { emoji: "🤝", color: "#7a5ad8", nombre: "Círculo de Confianza" },
  "ventas-con-causa": { emoji: "🛍️", color: "#BE185D", nombre: "Ventas con causa" },
  "cupones-promos": { emoji: "🏷️", color: "#F07A1A", nombre: "Cupones y promos" },
  "publicidad-tarjeta": { emoji: "📣", color: "#C2410C", nombre: "Publicidad gratuita" },
  bazares: { emoji: "🧺", color: "#B7791F", nombre: "Bazar y comercio" },
  noticias: { emoji: "📰", color: "#475569", nombre: "Noticias de barrio" },
  bienestar: { emoji: "🧘", color: "#0F766E", nombre: "Bienestar y recreación" },
  "recomienda-evalua-gana": { emoji: "👍", color: "#4F46E5", nombre: "Recomienda, evalúa y gana" },
  "alianzas-tarjeta": { emoji: "🏪", color: "#9A3412", nombre: "Alianzas solidarias" }
};
export const identidad = (id) => IDENTIDAD[id] || { emoji: "✨", color: "#1B6F8A", nombre: "DCUATES" };
