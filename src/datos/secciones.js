// =========================================================================
// src/datos/secciones.js — CAMINO y HOY distintos en cada sección (editable).
// Todo lo "de la semana" rota solo cada lunes. NOSOTROS usa el CAMINO/HOY generales.
// Acciones: {p:"id-proyecto"} abre un proyecto · {z:"empieza|juegos|aprende|gana|propon|causa|info|negocio"} abre una zona
//           {serv:1} servicios · {logros:1} logros · {acc:"beneficios|registros|mapa"} · {wa:"texto"} compartir por WhatsApp
//           {scroll:"id"} baja a un punto de la página
// =========================================================================
import { abrirServicios, abrirLogros } from "../Extras.jsx";
import { WHATSAPP_NUMERO } from "./config.js";

export function semanaActual() {
  const dia = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  return Math.floor((dia + 3) / 7); // la semana cambia cada lunes
}
export const rota = (lista, offset = 0) => lista[(semanaActual() + offset) % lista.length];

export function ejecutar(a, abrirProyecto = () => {}) {
  if (!a) return;
  const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
  if (a.p) abrirProyecto(a.p);
  else if (a.z) ev("dcuates:abrir-zona", a.z);
  else if (a.serv) abrirServicios();
  else if (a.logros) abrirLogros();
  else if (a.acc) ev("dcuates:abrir-acceso", a.acc);
  else if (a.aliados) ev("dcuates:abrir-acceso-aliados");
  else if (a.chat) window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(a.chat)}`, "_blank", "noopener,noreferrer");
  else if (a.wa) window.open(`https://wa.me/?text=${encodeURIComponent(a.wa)}`, "_blank", "noopener,noreferrer");
  else if (a.scroll) document.getElementById(a.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const INV = "¡Hola! Te comparto DCUATES, una comunidad de apoyo mutuo con libros, asesorías, mascotas, cupones y más: dcuates.com 💛";

// ---------------- CAMINO por sección (4 pasos) ----------------
export const CAMINO = {
  beneficios: [
    ["🔎", "DESCUBRE", "Mira qué beneficios hay", { acc: "beneficios" }],
    ["🙏", "PIDE", "Un libro o una asesoría", { p: "libros" }],
    ["🎁", "APROVECHA", "Cupones y promos", { p: "cupones-promos" }],
    ["📲", "COMPARTE", "Invita a un vecino", { wa: INV }]
  ],
  causas: [
    ["📰", "ENTÉRATE", "Qué se necesita hoy", { p: "noticias" }],
    ["🐾", "AYUDA", "Peluditos y casos", { p: "ecatepets" }],
    ["🎁", "DONA", "Da o ayuda con causa", { z: "causa" }],
    ["📣", "COMPARTE", "Casos y causas", { wa: "Te comparto casos y causas que necesitan apoyo en nuestra comunidad DCUATES: dcuates.com 💛" }]
  ],
  negocios: [
    ["🗺️", "CONOCE", "Mapa de negocios", { scroll: "mapa-negocios" }],
    ["📣", "ANÚNCIATE", "Publicidad gratuita", { p: "publicidad-tarjeta" }],
    ["🤝", "ALÍATE", "Alianzas ganar-ganar", { p: "alianzas-tarjeta" }],
    ["📈", "CRECE", "Servicios y promos", { serv: 1 }]
  ],
  valores: [
    ["🎓", "ENSEÑA-APRENDE", "Cursos y talleres", { p: "bienestar" }],
    ["👍", "RECOMIENDA", "Recomienda y gana", { p: "recomienda-evalua-gana" }],
    ["🤝", "CONVIVE", "Círculo de Confianza", { p: "circulo-confianza" }],
    ["✨", "INSPIRA", "Lo que ya logramos", { logros: 1 }]
  ],
  regalos: [
    ["🎮", "JUEGA", "Juegos con tu tema", { z: "juegos" }],
    ["🏆", "GANA", "Semillas y premios", { z: "gana" }],
    ["🎟️", "CANJEA", "Cupones y promos", { p: "cupones-promos" }],
    ["📲", "INVITA", "Juega con un amigo", { wa: "¡Te invito a jugar y ganar cupones en DCUATES! dcuates.com 🎮🏆" }]
  ],
  gratitud: [
    ["🏅", "RECONOCE", "Lo que se ha logrado", { logros: 1 }],
    ["💛", "AGRADECE", "Dile gracias a alguien", { wa: "Quiero agradecer públicamente a: ___ por: ___ 💛 (DCUATES)" }],
    ["📲", "COMPARTE", "Una historia que inspira", { scroll: "historias-reflexiones" }],
    ["🎉", "CELEBRA", "Agenda de la comunidad", { z: "info" }]
  ]
};

// ---------------- Listas que rotan cada semana ----------------
const TIPS_BIENESTAR = ["Toma agua y estírate 2 minutos cada hora.", "Camina 15 minutos hoy: tu ánimo lo agradece.", "Respira profundo 4 veces antes de dormir.", "Llama a alguien querido: una charla corta sana mucho.", "Apaga las pantallas 30 minutos antes de dormir.", "Escribe 3 cosas buenas de tu día.", "Lee 10 páginas de algo que te guste.", "Sonríele a un vecino: cuesta nada y cambia el día."];
const TIPS_EMPRENDER = ["Pon el nombre y el WhatsApp de tu negocio en todo lo que entregues.", "Pide a tus clientes felices que te recomienden con un vecino.", "Toma buenas fotos con luz natural: venden más.", "Ofrece una promo pequeña y clara, con fecha límite.", "Anota tus gastos: lo que no se mide no crece.", "Alíate con un negocio vecino y promociónense juntos.", "Contesta rápido: la primera respuesta gana la venta.", "Cuenta tu historia: la gente compra a quien conoce."];
const VALORES = [["💛", "Gratitud", "Dar las gracias hace mejor el día de dos personas."], ["🤝", "Confianza", "Se construye de a poquito, con palabras cumplidas."], ["🌱", "Crecer", "Lo que se cuida con paciencia, florece."], ["🤲", "Solidaridad", "Nadie es tan pobre que no pueda dar, ni tan rico que no necesite recibir."], ["😊", "Alegría", "Una sonrisa compartida vale más que muchas palabras."], ["🌟", "Esperanza", "Cada paso pequeño, repetido con otros, mueve montañas."], ["🕊️", "Respeto", "Escuchar con atención ya es una forma de cuidar."]];
const PALABRAS = [["Vecindad", "Ser vecino es cuidarnos entre todos."], ["Constancia", "Lo pequeño que se repite se vuelve grande."], ["Compartir", "Lo que se comparte se multiplica."], ["Generosidad", "Dar sin esperar es la mejor inversión."], ["Escucha", "Escuchar abre más puertas que hablar."], ["Palabra", "Una palabra cumplida vale oro."], ["Empatía", "Ponerse en los zapatos del otro lo cambia todo."]];
const GRACIAS = ["a quien te prestó un libro", "a un vecino que te ayudó sin pedir nada", "a tu maestro o maestra de la vida", "a quien cuida de tus mascotas", "a un negocio que te atendió con cariño", "a alguien que te escuchó cuando lo necesitabas", "a quien comparte su tiempo como voluntario", "a tu familia por estar ahí"];
const FRASES_GRATITUD = ["Agradecer es reconocer que no caminamos solos.", "Un gracias a tiempo vale más que un regalo tarde.", "La gratitud convierte lo que tenemos en suficiente.", "Quien agradece, atrae cosas buenas.", "Dar las gracias también es una forma de ayudar.", "Cada «gracias» fortalece a la comunidad."];
const BENEFICIOS = [["📚", "Préstamo de libros", "Pide uno gratis y devuélvelo cuando termines.", { p: "libros" }], ["🎓", "Asesorías gratuitas", "Orientación educativa y laboral para ti.", { p: "asesorias" }], ["🧘", "Bienestar y recreación", "Cursos y talleres para sentirte mejor.", { p: "bienestar" }], ["🐾", "Ecatepets", "Adopta o ayuda a un peludito.", { p: "ecatepets" }], ["🤝", "Círculo de Confianza", "Recomendaciones de servicios confiables.", { p: "circulo-confianza" }], ["🧺", "Bazar y comercio", "Compra, vende o intercambia en comunidad.", { p: "bazares" }]];
const CAUSAS = [["🙋", "Apoyo voluntario", "Tu tiempo y tus manos cambian vidas.", { p: "donaciones" }], ["📚", "Libros para quien los necesita", "Dona o comparte materiales de valor.", { p: "libros" }], ["🐾", "Peluditos en adopción", "Dale un hogar a quien no lo tiene.", { p: "ecatepets" }], ["🛍️", "Ventas con causa", "Compra algo que apoya a alguien.", { p: "ventas-con-causa" }]];
const JUEGOS = [["🧩", "Lotería DCUATES", { z: "aprende" }], ["🎯", "Juegos clásicos con tu tema", { z: "juegos" }], ["🎡", "Ruleta de la comunidad", { z: "aprende" }], ["🏆", "Gira y gana cupones", { z: "gana" }], ["🍪", "Galleta de la fortuna", { z: "aprende" }]];
const RECOMIENDA = ["Recomienda a ese vecino que hace un trabajo excelente.", "Cuéntanos qué servicio te sacó de un apuro.", "Recomienda un libro que cambió tu forma de pensar.", "Evalúa con respeto: ayudas a que otros elijan mejor.", "Un buen proveedor merece que lo conozcan más."];
const CONVIVE = ["Saluda hoy a un vecino que no conoces.", "Invita a alguien a una tertulia o taller.", "Ofrece ayuda a quien lleve algo pesado.", "Comparte una receta o un consejo con tu cuadra."];

// ---------------- Tarjetas de HOY por sección (3 + logros) ----------------
// d = { retos, nec, negocios, evento }
export function tarjetasHoy(sec, d = {}) {
  const evento = d.evento;
  const nego = d.negocios && d.negocios.length ? rota(d.negocios) : null;
  const reto = d.retos && d.retos.length ? rota(d.retos) : "Dedica 10 minutos solo para ti: toma agua, estírate y respira.";
  const [bE, bT, bD, bA] = rota(BENEFICIOS);
  const [cE, cT, cD, cA] = rota(CAUSAS);
  const [vE, vT, vD] = rota(VALORES);
  const [pT, pD] = rota(PALABRAS);
  const [jE, jT, jA] = rota(JUEGOS);
  switch (sec) {
    case "beneficios": return [
      { e: bE, et: "BENEFICIO DE LA SEMANA", t: bT, s: bD, c: "#D1530A", a: bA },
      { e: "🏷️", et: "CUPÓN DE LA SEMANA", t: "Descuentos en negocios locales", s: "Revisa las promos vigentes de tu colonia.", c: "#F07A1A", a: { p: "cupones-promos" } },
      { e: "🧘", et: "TIP DE BIENESTAR DE LA SEMANA", t: rota(TIPS_BIENESTAR), c: "#0F766E", a: { p: "bienestar" } }
    ];
    case "causas": return [
      { e: d.nec ? d.nec.emoji : "🎁", et: "SE NECESITA ESTA SEMANA", t: d.nec ? d.nec.titulo : "Mira cómo ayudar", c: "#CF3338", a: d.nec && d.nec.proyecto ? { p: d.nec.proyecto } : { z: "causa" } },
      { e: "🐾", et: "PELUDITO DE LA SEMANA", t: "Un hogar para quien lo necesita", s: "Conoce a los peluditos en adopción.", c: "#E5484D", a: { p: "ecatepets" } },
      { e: cE, et: "CAUSA DE LA SEMANA", t: cT, s: cD, c: "#BE185D", a: cA }
    ];
    case "negocios": return [
      { e: nego ? nego.emoji || "🏪" : "🏪", et: "NEGOCIO DE LA SEMANA", t: nego ? nego.nombre : "Registra el tuyo gratis", s: nego ? `${nego.giro || ""} · ${nego.zona || ""}` : "Aparece en el mapa y en la lista.", c: "#23804A", a: nego ? { scroll: "mapa-negocios" } : { z: "negocio" } },
      { e: "🏷️", et: "PROMO DE LA SEMANA", t: "Cupones y promos de tu zona", s: "Descuentos que mueven al barrio.", c: "#F07A1A", a: { p: "cupones-promos" } },
      { e: "💡", et: "TIP PARA EMPRENDEDORES DE LA SEMANA", t: rota(TIPS_EMPRENDER), c: "#1B6F8A", a: { z: "negocio" } }
    ];
    case "valores": return [
      { e: vE, et: "VALOR DE LA SEMANA", t: vT, s: vD, c: "#6A47C9", a: { p: "circulo-confianza" } },
      { e: "🔤", et: "PALABRA DE LA SEMANA", t: pT, s: pD, c: "#7a5ad8", a: { z: "empieza" } },
      { e: "👍", et: "RECOMENDACIÓN DE LA SEMANA", t: rota(RECOMIENDA), s: rota(CONVIVE), c: "#4F46E5", a: { p: "recomienda-evalua-gana" } }
    ];
    case "regalos": return [
      { e: jE, et: "JUEGO DE LA SEMANA", t: jT, c: "#E5484D", a: jA },
      { e: "🎯", et: "RETO DE LA SEMANA", t: reto, c: "#2E9E5B", a: { z: "empieza" } },
      { e: "🎟️", et: "CUPÓN O REGALO DE LA SEMANA", t: "Gira, suma Semillas y gana", s: "Cupones y regalos de aliados.", c: "#B7791F", a: { z: "gana" } }
    ];
    case "gratitud": return [
      { e: "💛", et: "GRACIAS DE LA SEMANA", t: `Da las gracias ${rota(GRACIAS)}`, c: "#92610F", a: { wa: `Quiero agradecer ${rota(GRACIAS)} 💛 (DCUATES)` } },
      { e: "🌟", et: "FRASE DE GRATITUD DE LA SEMANA", t: rota(FRASES_GRATITUD), c: "#C2255C", a: { wa: `${rota(FRASES_GRATITUD)} 💛 dcuates.com` } },
      { e: "🏅", et: "PRÓXIMO RECONOCIMIENTO", t: evento ? evento.titulo : "Mira lo que viene en la comunidad", s: evento ? "Toca para ver la agenda" : "", c: "#1B6F8A", a: { z: "info" } }
    ];
    default: return null;
  }
}

// Frase de la semana por sección (se muestra en "Mira también")
export const FRASE = {
  beneficios: ["Lo que se comparte, se multiplica.", "Pedir ayuda también es un acto de valentía.", "Un libro prestado es una puerta abierta.", "Los beneficios crecen cuando todos aportamos."],
  causas: ["Nadie es tan pobre que no pueda dar.", "Ayudar a uno puede cambiar la vida de muchos.", "Tu tiempo es el regalo que más vale.", "Una causa compartida pesa menos."],
  negocios: ["Comprar local es abrazar a tu comunidad.", "Un negocio vecino es un vecino con sueños.", "Aliarse es sumar clientes y confianza.", "Crecer juntos llega más lejos."],
  valores: ["Los valores se enseñan viviéndolos.", "La confianza se gana con hechos.", "Quien enseña, aprende dos veces.", "La amabilidad nunca pasa de moda."],
  regalos: ["Jugar también es convivir.", "Cada reto cumplido es un paso más.", "Lo mejor de ganar es compartirlo.", "Un regalo pequeño puede alegrar un día grande."],
  gratitud: FRASES_GRATITUD,
  nosotros: ["Juntos hacemos una mejor comunidad.", "19 años cultivando confianza y amistad.", "Tejiendo confianza, sumando voluntades, cosechando logros."]
};
