// =========================================================================
// src/datos/club.js — CLUB DCUATES · «Sé NUESTRO CUATE» (e61)
// AQUÍ SE EDITA TODO lo del Club: nombres de las modalidades, a quién van, qué «puede incluir» y qué compromiso se pide.
// «puede incluir» NO es una promesa: son ideas de lo que el Club puede ofrecer según lo disponible. Quita, agrega o cambia líneas libremente.
// Reglas del Club (por ahora): sin cuotas, sin cobro en la página, sin ser «socio(a)» ni empleado(a). Si alguien quiere aportar dinero, lo platica contigo por WhatsApp.
// Para cambiar los nombres de las modalidades también hay que cambiar la lista de opciones del registro «club» en src/datos/registros.js (usa estas mismas palabras).
// =========================================================================
export const NARANJA_CLUB = "#E65100";

export const CLUB_TITULO = "ÚNETE AL CLUB DCUATES";
export const CLUB_LEMA = "Sé NUESTRO CUATE";

// id: clave interna · nombre: lo que se ve y lo que se guarda en la columna «Perfil» · boton: texto corto del botón
export const MODALIDADES = [
  {
    id: "vecino", e: "🏘️", nombre: "Vecino CUATE", boton: "Vecino CUATE",
    quien: "Personas de la comunidad que quieren participar, aprovechar y compartir.",
    puedeIncluir: [
      "Cupones y promociones de negocios aliados",
      "Préstamo gratuito de libros",
      "Talleres y cursos de la comunidad",
      "Asesorías gratuitas, cuando haya disponibilidad",
      "Aviso de actividades y noticias de la comunidad"
    ],
    compromiso: "Participar de buena fe y compartir lo que puedas: una recomendación, un dato útil, un rato."
  },
  {
    id: "voluntario", e: "🙋", nombre: "Voluntario CUATE", boton: "Voluntario CUATE",
    quien: "Personas que aportan su tiempo, talento o conocimientos.",
    puedeIncluir: [
      "Constancia de participación",
      "Reconocimiento y difusión de tu labor (solo si lo autorizas)",
      "Talleres y cursos",
      "Cupones y préstamo de libros",
      "Recomendación de tu trabajo voluntario"
    ],
    compromiso: "El tiempo o la labor que acuerdes con DCUATES y el respeto a las reglas de cada actividad."
  },
  {
    id: "padrino", e: "💛", nombre: "Padrino/Madrina CUATE", boton: "Padrino/Madrina CUATE",
    quien: "Personas que apadrinan una causa, una actividad o a una mascota con especie, tiempo o difusión.",
    puedeIncluir: [
      "Constancia de apadrinamiento",
      "Reconocimiento y difusión de tu apoyo (solo si lo autorizas)",
      "Noticias de la causa que apoyas",
      "Cupones, libros y talleres"
    ],
    compromiso: "Un apoyo en especie, en tiempo o en difusión. No hay cuotas. Si quieres aportar dinero, lo platicas con DCUATES por WhatsApp."
  },
  {
    id: "aliado", e: "🤝", nombre: "Aliad@ CUATE", boton: "Aliad@ CUATE",
    quien: "Negocios, talentos y proyectos que quieren sumar y ganar con la comunidad.",
    puedeIncluir: [
      "Publicidad gratuita y presencia en el mapa de negocios",
      "Recomendaciones y difusión de lo que ofreces",
      "Cupones o promociones para la comunidad",
      "Asesoría gratuita para tu negocio o proyecto",
      "Intercambios ganar-ganar con otros aliados"
    ],
    compromiso: "Ofrecer un beneficio real a la comunidad (un cupón, un descuento, un servicio) y tratar bien a quien llegue por DCUATES."
  },
  {
    id: "patrocinador", e: "🌟", nombre: "Patrocinador/a CUATE", boton: "Patrocinador/a CUATE",
    quien: "Personas y empresas que respaldan al Club con especie, tiempo o difusión.",
    puedeIncluir: [
      "Reconocimiento visible como patrocinador/a (solo si lo autorizas)",
      "Difusión de tu apoyo a la comunidad",
      "Constancia de patrocinio",
      "Alianzas ganar-ganar con otros Cuates"
    ],
    compromiso: "Un apoyo en especie, en tiempo o en difusión. Esta página nunca cobra ni pide datos bancarios: si quieres aportar dinero, lo platicas con DCUATES por WhatsApp."
  },
  {
    id: "organizacion", e: "🏛️", nombre: "Organización o grupo CUATE", boton: "Organización o grupo CUATE",
    quien: "Colectivos, asociaciones, escuelas, iglesias, comités o grupos de la comunidad.",
    puedeIncluir: [
      "Difusión de tus actividades en la Agenda",
      "Colaboraciones y alianzas con otros Cuates",
      "Préstamo de espacios y recursos de la red",
      "Talleres y asesorías para tu grupo",
      "Constancia de colaboración"
    ],
    compromiso: "Colaborar de buena fe y avisar de las actividades que quieras compartir con la comunidad."
  }
];

// Textos generales
export const CLUB_REGLAS = [
  "Es un club comunitario: no tiene cuotas y no te hace socio(a) ni empleado(a) de DCUATES.",
  "«Puede incluir» son ideas de lo que el Club ofrece según lo disponible; no son promesas ni derechos.",
  "Tu registro queda «En revisión». Cuando DCUATES lo apruebe, en «Consulta tu folio» verás que ya eres Cuate y tu constancia, y DCUATES te mandará por WhatsApp tu número de Cuate y tu código para abrir tu tarjeta digital.",
  "Al ser Cuate recibes 100 puntos de bienvenida, que se canjean por recursos de la comunidad (un libro digital, una recomendación, un curso o taller, un regalo sorpresa…) según lo disponible. Los puntos son un reconocimiento: no valen dinero.",
  "La constancia es un reconocimiento comunitario: no es un documento oficial ni una credencial."
];

// Puerta → modalidad que se preselecciona en su botón «Únete al Club como … CUATE».
// Las puertas de apoyo o urgencia (sensible) no llevan el botón.
export const MODALIDAD_DE_PUERTA = {
  vecino: "vecino", cliente: "vecino", joven: "vecino", familia: "vecino", mayor: "vecino", invitado: "vecino",
  negocio: "aliado", talento: "aliado",
  organizacion: "organizacion",
  patrocinador: "patrocinador",
  voluntario: "voluntario", animales: "voluntario"
};

export const modalidadPorId = (id) => MODALIDADES.find((m) => m.id === id) || null;
export const modalidadPorNombre = (n) => MODALIDADES.find((m) => m.nombre === n) || null;
