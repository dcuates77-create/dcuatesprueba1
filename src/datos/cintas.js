// =========================================================================
// src/datos/cintas.js — Cintas, logros y recomendaciones
// Solo datos: aquí se cambian textos sin tocar la lógica de la página.
// =========================================================================
import { REDES_SOCIALES } from "./config.js";

// Enlaces del botón "⭐ Recomendaciones" — separados en 2 grupos. Los de
// "comunidad" son EJEMPLOS, edítalos con los negocios/personas reales que
// quieras recomendar (de 5 a 10 en total entre los dos grupos).
export const RECOMENDACIONES_ESTRELLA = {
  dcuates: [
    { nombre: "Facebook DCUATES", enlace: REDES_SOCIALES.facebook },
    { nombre: "Instagram DCUATES", enlace: REDES_SOCIALES.instagram },
    { nombre: "YouTube DCUATES", enlace: REDES_SOCIALES.youtube },
    { nombre: "TikTok DCUATES", enlace: REDES_SOCIALES.tiktok }
  ],
  comunidad: [
    { nombre: "Panadería Café Sol", enlace: "#" },
    { nombre: "Taquería El Sol", enlace: "#" },
    { nombre: "Refugio Animal Ecatepec", enlace: "#" }
  ]
};

export const TICKER_ETIQUETAS = {
  negocio: { emoji: "🏪", label: "Negocio Local" },
  mascota: { emoji: "🐾", label: "Ecatepets" },
  aviso: { emoji: "📢", label: "Aviso" },
  momento: { emoji: "📸", label: "Momento DCUATES" },
  frase: { emoji: "💚", label: "DCUATES" }
};

// Barra de Logros y Resultados — ejemplos FICTICIOS mientras no haya datos
// reales; reemplázalos o (mejor) aliméntalos desde Baserow sin tocar
// código: crea en la tabla ENLACES 2 columnas de texto — "NOMBRE LOGROS" y
// "ENLACE LOGROS" — una fila por logro. En cuanto haya al menos una fila
// con esas 2 columnas llenas, sustituyen automáticamente a estos ejemplos
// (ver BarraLogros más abajo).
// Mensajes fijos: se agregan SIEMPRE al final de los logros (de Baserow o de
// los ejemplos) y salen tanto en la barra de logros como en la banda.
export const LOGROS_FIJOS = [
  { texto: "🌟 19 AÑOS GENERANDO PROYECTOS SOCIALES COMUNITARIOS, Y CULTIVANDO AMISTADES, CONFIANZA Y CONEXIONES QUE HACEN MEJORES NUESTRAS VIDAS 🌟 💛 😊", enlace: "#quienes-somos" },
  { texto: "💛 19 AÑOS APOYANDO PERSONAS, GRUPOS VULNERABLES Y CAUSAS QUE GENERAN CADENA DE VALOR Y DE VALORES ♥ ♥ ♥", enlace: "#donaciones" },
  { texto: "🚀 MÁS DE 25 AÑOS IMPULSANDO Y DESARROLLANDO TALENTOS Y VIDAS QUE SON INSPIRACIÓN Y EJEMPLO PARA NUESTRAS COMUNIDADES, NUESTRO PAÍS Y EL MUNDO.", enlace: "#asesorias" }
];

export const LOGROS_ITEMS = [
  { texto: "🤝 Más de 2,000 recomendaciones y conexiones de apoyo", enlace: "#circulo-confianza" },
  { texto: "📚 Más de 1,000 libros y materiales educativos prestados", enlace: "#libros" },
  { texto: "🎁 Más de 500 libros y materiales DONADOS POR NUESTRA COMUNIDAD (MUCHAS GRACIAS POR SU VALIOSO APOYO Y CONFIANZA)", enlace: "#donaciones" },
  { texto: "📘 Más de 200 libros FÍSICOS DONADOS a quienes más los NECESITAN, y más de 2500 COMPARTIDOS EN FORMATO DIGITAL", enlace: "#libros" },
  { texto: "🎓 Más de 300 asesorías y orientación educativa y laboral gratuitas", enlace: "#asesorias" },
  { texto: "🐾 Más de 200 adopciones y apoyo a rescate de peluditos", enlace: "#ecatepets" },
  { texto: "💰 Gestión y fondeo de más de un millón de pesos en apoyos para personas y grupos vulnerables", enlace: "#donaciones" },
  { texto: "🌱 Formación y desarrollo de talento que genera cadena de valor y de valores", enlace: "#asesorias" },
  { texto: "🌟 Apoyos y sinergia con quienes también se preocupan por apoyar a nuestra comunidad", enlace: "#iniciativas" },
  { texto: "📖 Más de 100 reuniones de negocios y tertulias literarias y de sana convivencia", enlace: "#bazares" },
  { texto: "💻 Más de 500 cursos y talleres digitales para nuestro desarrollo personal y social", enlace: "#bienestar" }
];

// Ticker SUPERIOR (debajo de la barra fija de menú): frases sobre
// solidaridad y causas afines, más llamados a la acción para sumarse.
// Edítalas o agrégalas aquí — cada una puede enlazar a cualquier sección
// de la página. Si más adelante quieres alimentarlas desde Baserow, se
// puede conectar igual que las demás pasarelas (crea una tabla con
// columnas "texto" y "enlace", y pide que se conecte con useCatalogoBaserow).
export const TICKER_FRASES = [
  { tipo: "frase", texto: "“Nadie es tan rico que no necesite ayuda, ni tan pobre que no pueda ofrecerla.”", enlace: "#quienes-somos" },
  { tipo: "frase", texto: "“Solos avanzamos más rápido; juntos llegamos más lejos.” — Proverbio africano", enlace: "#donaciones" },
  { tipo: "frase", texto: "💚 ¿Ya eres parte de la RED DCUATES? Súmate hoy mismo", enlace: "#donaciones" },
  { tipo: "frase", texto: "“La solidaridad no es un acto de caridad, es un acto de justicia.” — E. Galeano", enlace: "#quienes-somos" },
  { tipo: "frase", texto: "🤝 Comparte tu talento, tiempo o recursos — cada aportación suma", enlace: "#donaciones" },
  { tipo: "frase", texto: "“El bien que haces hoy será olvidado mañana. Haz el bien de todos modos.” — Madre Teresa de Calcuta", enlace: "#quienes-somos" }
];

export const PATROCINADORES_ALIANZAS_ITEMS = [
  { id: "aliado1", tipo: "Aliado", nombre: "Panadería Café Sol", descripcion: "Aliado fundador de la Bibliobici Móvil DCUATES.", img: "/images/aliados-1.png" },
  { id: "aliado2", tipo: "Patrocinador", nombre: "Refugio Animal Ecatepec", descripcion: "Apoya activamente la difusión de Ecatepets.", img: "/images/aliados-2.png" },
  { id: "aliado3", tipo: "Aliado", nombre: "Conexiones con Causa", descripcion: "Organización impulsora del programa DCUATES.", img: "/images/aliados-3.png" }
];
