// =========================================================================
// src/datos/regalos.js — Tableros de REGALOS (música, pelis, páginas, libros)
// Cada tema tiene 20 botones. Los textos de abajo son EJEMPLOS: cámbialos aquí,
// o mejor desde Baserow (tabla ENLACES), una fila por botón con las columnas:
//   REGALO TEMA (musica | pelis | paginas | libros) · REGALO TITULO ·
//   REGALO INFO · REGALO ENLACE (opcional) · REGALO EMOJI (opcional)
// Los de Baserow reemplazan, en orden, a los primeros botones de ese tema.
// "modo" cambia cómo corren las luces: recorrido | azar | barrido | reversa.
// =========================================================================
export const FRASE_REGALOS = "Lo mejor de la vida se disfruta cuando se comparte. ¡Gracias por jugar con nosotros! ✨";

const hacer = (tema, tipo, titulos, emojis) =>
  titulos.map((t, i) => ({
    titulo: t,
    emoji: emojis[i],
    info: `${tipo}: ${t}. Recomendación de la comunidad DCUATES. (Ejemplo: cambia este texto en src/datos/regalos.js o en Baserow.)`,
    enlace: ""
  }));

export const REGALOS_TEMAS = [
  { id: "musica", nombre: "MÚSICA DCUATES", emoji: "🎵", color: "#7A5AD8", modo: "recorrido",
    items: hacer("musica", "Playlist", ["Cumbia", "Salsa", "Rock", "Baladas", "Boleros", "Mariachi", "Jazz", "Clásica", "Infantil", "Reggae", "Pop", "Hip hop", "Corridos", "Trova", "Instrumental", "Para meditar", "Para estudiar", "Para bailar", "Para cocinar", "Para el camino"], ["🎶", "💃", "🎸", "💞", "🌹", "🎺", "🎷", "🎻", "🧸", "🌴", "🎤", "🧢", "🤠", "🪕", "🎹", "🧘", "📖", "🕺", "🍳", "🚌"]) },
  { id: "pelis", nombre: "PELIS DCUATES", emoji: "🎬", color: "#E5484D", modo: "azar",
    items: hacer("pelis", "Recomendación", ["Comedia", "Drama", "Acción", "Animación", "Familiares", "Documentales", "Mexicanas", "Clásicas", "Aventura", "Misterio", "Ciencia ficción", "Musicales", "Biografías", "Superación", "Para reír", "Para llorar", "Para pensar", "Con mensaje", "Cortometrajes", "Series cortas"], ["😂", "🎭", "💥", "🎨", "👨‍👩‍👧", "🌎", "🇲🇽", "🎞️", "🧭", "🕵️", "🚀", "🎶", "📜", "💪", "🤣", "😢", "🧠", "💌", "🎥", "📺"]) },
  { id: "paginas", nombre: "PÁGINAS DCUATES", emoji: "🌐", color: "#1B6F8A", modo: "barrido",
    items: hacer("paginas", "Página", ["Aprender gratis", "Empleo", "Salud", "Cocina", "Manualidades", "Mascotas", "Finanzas", "Emprender", "Idiomas", "Tecnología", "Arte", "Ciencia", "Historia", "Juegos de mente", "Trámites", "Apoyos y becas", "Bienestar", "Naturaleza", "Cursos en línea", "Herramientas útiles"], ["🎓", "💼", "🩺", "🍲", "✂️", "🐶", "💰", "🚀", "🗣️", "💻", "🖼️", "🔬", "🏛️", "🧩", "📝", "🎒", "🧘", "🌳", "🖥️", "🧰"]) },
  { id: "libros", nombre: "LIBROS Y + DCUATES", emoji: "📚", color: "#2E9E5B", modo: "reversa",
    items: hacer("libros", "Lectura", ["Novela", "Cuento", "Poesía", "Superación", "Infantiles", "Juveniles", "Historia de México", "Ciencia", "Cocina", "Salud", "Emprendimiento", "Finanzas", "Educación", "Valores", "Biografías", "Audiolibros", "Cómics", "Revistas", "Material escolar", "Libros gratis (PDF)"], ["📖", "🌙", "✒️", "🌟", "🦄", "🎒", "🇲🇽", "🔭", "🍰", "🍎", "💡", "💰", "🏫", "💛", "👤", "🎧", "🦸", "📰", "✏️", "💾"]) }
];
