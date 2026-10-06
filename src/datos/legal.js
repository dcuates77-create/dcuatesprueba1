// =========================================================================
// src/datos/legal.js — Textos legales y Preguntas Frecuentes
// Solo datos: aquí se cambian textos sin tocar la lógica de la página.
// =========================================================================

// =========================================================================
// TEXTOS LEGALES — Aviso de Privacidad Integral y Términos y Condiciones.
// IMPORTANTE: llena los datos del responsable en DATOS_LEGALES (nombre,
// domicilio y correo). Edita solo lo que está entre comillas. El resto del texto es el de tus documentos oficiales.
// =========================================================================
export const DATOS_LEGALES = {
  nombre: "ABEL MERAZ ALVARADO",
  colonia: "Jardines de Morelos, Sección Ríos",
  municipio: "Ecatepec de Morelos",
  cp: "55070", // si lo dejas vacío ("") el Aviso omite el código postal
  estado: "México",
  correo: "dcuates77@gmail.com"
};

// Cada sección: titulo, parrafos (antes), lista (viñetas; texto o {b, t}),
// despues (párrafos después de la lista).
export const AVISO_PRIVACIDAD_INTEGRAL = {
  titulo: "Aviso de Privacidad Integral (Fase de Lanzamiento)",
  secciones: [
    {
      titulo: "1. Responsable del tratamiento de sus datos personales",
      parrafos: [
        `El Responsable del tratamiento de sus datos personales es ${DATOS_LEGALES.nombre}, operando bajo el nombre comercial DCUATES y a través del sitio web dcuates.com. Para efectos del presente aviso y la protección de los datos de nuestros usuarios, se señala como domicilio general de atención, correspondencia y solicitudes relativas a la privacidad el ubicado en la Colonia ${DATOS_LEGALES.colonia}, Municipio o Alcaldía ${DATOS_LEGALES.municipio}${DATOS_LEGALES.cp ? `, C.P. ${DATOS_LEGALES.cp}` : ""}, en el Estado de ${DATOS_LEGALES.estado}, México. Usted puede ponerse en contacto directo con el responsable a través del correo electrónico exclusivo: ${DATOS_LEGALES.correo}.`
      ]
    },
    {
      titulo: "2. Datos personales que se recabarán",
      parrafos: [
        "Para permitir su interacción, el uso de las ventanas de registro y el alta de iniciativas en nuestra plataforma, recabaremos únicamente los siguientes datos de identificación y contacto a través de nuestros formularios web:"
      ],
      lista: [
        "Nombre completo (o alias del usuario).",
        "Número de teléfono celular (WhatsApp).",
        "Colonia de residencia.",
        "Tipo de apoyo solicitado o requerido.",
        "Descripción detallada de la necesidad o aportación."
      ],
      despues: [
        "DCUATES no recaba, almacena ni trata bajo ninguna circunstancia datos personales sensibles (como ideología, religión, política, estado de salud o datos financieros)."
      ]
    },
    {
      titulo: "3. Finalidades del tratamiento",
      parrafos: [
        "Los datos personales recabados serán utilizados exclusivamente para las siguientes finalidades primarias, las cuales son estrictamente necesarias para el servicio solicitado dentro de la plataforma:"
      ],
      lista: [
        "Gestionar su registro, cuenta y participación dentro de la plataforma de proyectos comunitarios.",
        "Almacenar de forma segura su solicitud en nuestra base de datos interna (alojada en Google Sheets) para dar seguimiento a su caso.",
        "Establecer comunicación directa con usted a través de la aplicación WhatsApp para validar, confirmar o coordinar el apoyo solicitado.",
        "Brindar soporte técnico y atender reportes de la comunidad."
      ],
      despues: [
        "Finalidades secundarias: No utilizaremos sus datos para fines publicitarios masivos ajenos a la comunidad, ni los venderemos o cederemos a terceros. Cualquier boletín informativo interno de la plataforma requerirá su autorización previa."
      ]
    },
    {
      titulo: "4. Transferencia de datos personales",
      parrafos: [
        "Le informamos que sus datos personales no serán compartidos, transferidos ni tratados por personas, empresas o entidades terceras, salvo por las excepciones estrictas previstas en el artículo 37 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) o por requerimientos judiciales de las autoridades competentes."
      ]
    },
    {
      titulo: "5. Derechos ARCO y Revocación del Consentimiento",
      parrafos: [
        "Usted tiene en todo momento el derecho de Acceder a sus datos, Rectificarlos si son incorrectos o están desactualizados, Cancelar su registro para que sean borrados por completo de nuestra base de datos de Google Sheets, u Oponerse al uso de los mismos para fines específicos (Derechos ARCO).",
        `Para ejercer estos derechos o revocar el consentimiento que nos ha otorgado, deberá enviar una solicitud por escrito al correo electrónico: ${DATOS_LEGALES.correo}. Su solicitud deberá contener su nombre completo, el número de WhatsApp con el que se registró y la descripción clara del derecho que desea ejercer. Le responderemos y ejecutaremos la acción en un plazo máximo de 20 días hábiles.`
      ]
    },
    {
      titulo: "6. Tecnologías de Análisis y Rendimiento (Vercel Analytics)",
      parrafos: [
        "Le informamos que este sitio web utiliza la herramienta de medición integrada de nuestro proveedor de alojamiento (Vercel Analytics). Esta tecnología recopila exclusivamente datos estadísticos y de rendimiento de forma totalmente anónima (tales como el país de origen del visitante, tipo de navegador, sistema operativo y velocidad de carga de la página). Esta herramienta no utiliza cookies de rastreo, no recopila datos que permitan identificar personalmente al usuario ni realiza un seguimiento de sus hábitos de navegación fuera de este sitio web. Debido a su naturaleza puramente técnica y estadística, no genera archivos de rastreo en su dispositivo."
      ]
    },
    {
      titulo: "7. Modificaciones por formalización legal",
      parrafos: [
        "Este aviso de privacidad es de carácter temporal y sufrirá modificaciones y actualizaciones una vez que el proyecto DCUATES culmine su proceso de transición hacia una figura jurídica colectiva (Sociedad Cooperativa). Las actualizaciones estarán siempre disponibles para su consulta en esta misma sección del sitio web."
      ]
    }
  ],
  fecha: "Fecha de última actualización: Octubre de 2026."
};

export const TERMINOS_CONDICIONES = {
  titulo: "Términos y Condiciones de la Comunidad (DCUATES)",
  intro: "Bienvenido a DCUATES (dcuates.com). Al utilizar nuestra plataforma, registrar tus datos o publicar una solicitud de apoyo, aceptas cumplir de manera íntegra con las siguientes reglas, normas de convivencia y condiciones de servicio. Si no estás de acuerdo con alguna de ellas, te pedimos amablemente que te abstengas de utilizar el sitio.",
  secciones: [
    {
      titulo: "1. Naturaleza de la Plataforma",
      parrafos: [
        "DCUATES es una iniciativa de carácter social e independiente. Nuestro único objetivo es servir como un puente de vinculación directa entre personas que necesitan un apoyo comunitario y personas o colectivos dispuestos a brindarlo de forma voluntaria. DCUATES no es una empresa de servicios, no es una casa de beneficencia con fondos propios, ni actúa como intermediario legal en los acuerdos alcanzados entre los usuarios."
      ]
    },
    {
      titulo: "2. Proyectos e Iniciativas Permitidas",
      parrafos: [
        "La plataforma está diseñada exclusivamente para albergar solicitudes y proyectos que generen un impacto positivo, colaborativo o solidario en la comunidad. Los tipos de proyectos bienvenidos incluyen:"
      ],
      lista: [
        { b: "Educación y Cultura:", t: "Solicitudes o donaciones de libros, materiales didácticos, asesorías escolares y talleres gratuitos." },
        { b: "Apoyo Social y Comunitario:", t: "Iniciativas de mejora barrial, recolección de víveres, ropa en buen estado o voluntariados locales." },
        { b: "Cuidado Animal y Ambiental:", t: "Proyectos de rescate de mascotas, campañas de esterilización comunitaria, reforestación o reciclaje local." },
        { b: "Herramientas de Trabajo:", t: "Solicitudes de colaboración mutua para proyectos de emprendimiento social o solidario." }
      ]
    },
    {
      titulo: "3. Contenido y Proyectos Estrictamente Prohibidos",
      parrafos: [
        "Para garantizar un espacio seguro y confiable, queda estrictamente prohibida la publicación de cualquier solicitud o contenido que involucre:"
      ],
      lista: [
        { b: "Fines de Lucro Exclusivos:", t: "Venta directa de productos comerciales, publicidad de empresas privadas que no tengan un esquema de donación o beneficio social claro, o esquemas de negocio multinivel." },
        { b: "Proselitismo Político o Religioso:", t: "Campañas de partidos políticos, promoción de candidatos, propaganda ideológica o religiosa de cualquier índole." },
        { b: "Contenido Ilícito o Peligroso:", t: "Solicitud o intercambio de armas, sustancias prohibidas, medicamentos controlados o actividades penadas por las leyes mexicanas." },
        { b: "Conductas de Odio o Discriminación:", t: "Mensajes que promuevan la violencia, el racismo, el sexismo, la intolerancia o que vulneren la dignidad de las personas." },
        { b: "Fraudes y Préstamos:", t: "Solicitudes de dinero en efectivo directo de procedencia dudosa, esquemas de tandas, pirámides financieras o solicitud de datos bancarios confidenciales." }
      ],
      despues: [
        "Cualquier registro que infrinja estas normas será eliminado inmediatamente de la base de datos de Google Sheets sin previo aviso y no se le dará seguimiento por WhatsApp."
      ]
    },
    {
      titulo: "4. Responsabilidad de los Usuarios",
      lista: [
        { b: "Veracidad de la Información:", t: "Al registrarte, garantizas que los datos proporcionados (Nombre, WhatsApp, Colonia) son reales y te pertenecen." },
        { b: "Uso del Canal de WhatsApp:", t: "Entiendes que al presionar el botón de confirmación, inicias un chat de WhatsApp de forma voluntaria. Te comprometes a mantener una comunicación respetuosa, clara y cordial con el administrador y con otros miembros de la comunidad con los que te vincules." },
        { b: "Seguridad Física:", t: "Dado que la plataforma facilita que personas de la misma zona se apoyen (por ejemplo, para entregar libros o materiales), cada usuario es enteramente responsable de su propia seguridad física. Recomendamos realizar cualquier entrega o encuentro exclusivamente en lugares públicos, concurridos y de preferencia a la luz del día." }
      ]
    },
    {
      titulo: "5. Deslinde de Responsabilidad de la Plataforma (Límites Legales)",
      lista: [
        "DCUATES no se hace responsable por la calidad, entrega, veracidad o resultado de los apoyos coordinados entre los usuarios.",
        "No garantizamos que todas las solicitudes registradas reciban apoyo, ya que esto depende enteramente de la participación voluntaria de la comunidad.",
        "El administrador de la página no se hace responsable de los daños, pérdidas, malentendidos o conflictos derivados de las interacciones generadas fuera del sitio web (chats privados de WhatsApp, llamadas o reuniones físicas)."
      ]
    },
    {
      titulo: "6. Modificaciones",
      parrafos: [
        "Nos reservamos el derecho de actualizar estas normas en cualquier momento para adaptarlas al crecimiento de la comunidad o a futuras regulaciones legales. Al continuar usando la página tras una actualización, aceptas los nuevos términos establecidos."
      ]
    }
  ],
  fecha: "Fecha de actualización: Octubre de 2026."
};

// (Texto anterior, simplificado — ya no se usa) Aviso de Privacidad — se usaba en el
// botón verde desplegable "Aviso de Privacidad" de la portada, para no
// tener el mismo texto escrito dos veces.
export const AVISO_PRIVACIDAD_PARRAFOS = [
  "En cumplimiento con la normativa de protección de datos, DCUATES le informa que los datos recabados en este formulario (Nombre de Negocio, Categoría y Enlaces Digitales) tienen la única y exclusiva finalidad de promover de forma comunitaria y gratuita sus actividades comerciales.",
  "Sus datos no serán vendidos, transferidos ni compartidos con terceros con fines de lucro. Al enviar la información y continuar la interacción en WhatsApp, usted acepta el tratamiento de los mismos para los fines de difusión colectiva estipulados en nuestras iniciativas de Apoyo al Emprendimiento.",
  "Usted puede solicitar la baja, rectificación o eliminación de los datos publicitados en cualquier momento poniéndose en contacto directo mediante nuestros canales oficiales de atención."
];

// Preguntas frecuentes — cada una se despliega al dar clic (como un
// acordeón). Para agregar una nueva, solo copia un bloque { pregunta, respuesta } más.
export const FAQ_ITEMS = [
  { pregunta: "¿DCUATES tiene algún costo para participar?", respuesta: "No. Todos los proyectos (libros, publicidad, Ecatepets, asesorías, etc.) son gratuitos. Las aportaciones voluntarias solo ayudan a que la plataforma llegue a más familias." },
  { pregunta: "¿Cómo publico mi negocio o servicio?", respuesta: "Usa el botón \"Publicidad Gratuita\" en la portada, o baja hasta la sección de Publicidad Comunitaria y llena el formulario. También puedes escribirnos directo por WhatsApp." },
  { pregunta: "¿Cómo reporto una mascota, persona o cosa extraviada?", respuesta: "Entra al botón \"Ecatepets\" o a la sección \"Ventas con Causa\" y da clic en \"Reportar un caso por WhatsApp\"; te contactamos directo." },
  { pregunta: "¿Qué pasa con mis datos si lleno un formulario?", respuesta: "Solo se usan para la difusión comunitaria del proyecto que elegiste. Puedes ver el detalle completo en nuestro Aviso de Privacidad, en el pie de página." },
  { pregunta: "¿Cómo puedo apoyar como voluntario o con una donación?", respuesta: "En el botón \"Apoyo Voluntario\" puedes elegir entre aportación económica, en especie, trueque solidario o labor voluntaria — cada opción te conecta directo por WhatsApp." },
  { pregunta: "¿Necesito ser un negocio formal para participar?", respuesta: "No. DCUATES está abierto a negocios formales, informales, personas y organizaciones de la comunidad; lo importante es la intención de sumar y beneficiar a la zona." },
  { pregunta: "¿Cómo me entero de las noticias y actividades nuevas?", respuesta: "Sigue nuestras redes sociales (Facebook, Instagram, YouTube y TikTok) y revisa el botón de \"Noticias de Barrio\" en la portada; ahí publicamos convocatorias y eventos." }
];
