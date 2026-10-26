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
        "DCUATES no recaba, almacena ni trata bajo ninguna circunstancia datos personales sensibles (como ideología, religión, política, estado de salud o datos financieros).",
        "Estadísticas de uso: para saber qué secciones se usan más y mejorar el sitio, contamos visitas y toques en botones de forma anónima, con herramientas que no usan cookies de seguimiento ni guardan su nombre, teléfono o identidad."
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

// Preguntas frecuentes — agrupadas por tema (acordeón). Para agregar una nueva, copia un bloque { tema, pregunta, respuesta }
// y colócalo junto a las de su mismo tema. Los temas y su orden están en FAQ_TEMAS.
export const FAQ_TEMAS = [{"id": "Empezar", "titulo": "🌱 Empezar"}, {"id": "Apoyos", "titulo": "🤝 Apoyos y solicitudes"}, {"id": "Negocios", "titulo": "🏪 Negocios y anuncios"}, {"id": "Voluntariado", "titulo": "🙋 Voluntariado, donaciones y comunidad"}, {"id": "Privacidad", "titulo": "🔒 Privacidad y seguridad"}, {"id": "Técnicos", "titulo": "🛠️ Problemas técnicos y ayuda"}];

export const FAQ_ITEMS = [
  { tema: "Empezar", pregunta: "¿Qué es DCUATES?", respuesta: "Es una comunidad ciudadana y autónoma de Jardines de Morelos, Ecatepec, que une personas, negocios y organizaciones para sumar apoyos: libros, asesorías, mascotas, publicidad gratuita, voluntariado y más. En la sección «Nosotros» puedes leer nuestro Manifiesto." },
  { tema: "Empezar", pregunta: "¿Cómo funciona la página? ¿Por dónde empiezo?", respuesta: "En Inicio, toca «❓ Cómo funciona» (junto a «Conoce cómo participar»). Ahí se explican los 4 botones: 1 Puertas (dinos quién eres), 2 Hoy (lo de la semana), 3 Regístrate (pide o suma) y 4 Explora (todo lo que hay). También puedes usar el Tour DCUATES." },
  { tema: "Empezar", pregunta: "¿Cómo busco algo en la página?", respuesta: "Escribe una palabra (por ejemplo «libros», «mascota» o «negocio») en el buscador de Inicio y toca Buscar, o usa la lupa del menú de arriba. Si no encuentras nada, cuéntanos qué buscabas desde el botón ¿Necesitas algo?; así mejoramos el buscador." },
  { tema: "Empezar", pregunta: "¿Puedo instalar DCUATES en mi teléfono?", respuesta: "Sí. Si tu navegador lo permite, verás la opción «Instalar app» en Inicio (en «Tu entrada a DCUATES») o en el menú del navegador (Agregar a pantalla de inicio). Así se abre como una aplicación." },
  { tema: "Empezar", pregunta: "¿Cómo hago más grande la letra o veo mejor?", respuesta: "En Inicio, dentro de «Conoce cómo participar», toca el botón A+ para agrandar la letra. También puedes abrir «Explora» y buscar «Para leer mejor», que tiene más opciones de lectura." },
  { tema: "Empezar", pregunta: "¿Qué pasa si no tengo internet?", respuesta: "La página muestra un aviso de «Sin conexión» y una pantalla amable. Lo que ya cargaste puede seguir visible, pero los formularios y los enlaces necesitan internet; cuando regrese la señal, el aviso desaparece." },
  { tema: "Apoyos", pregunta: "¿Cómo pido un apoyo?", respuesta: "Toca «Regístrate» (botón 3 de «Conoce cómo participar») y elige «Registra tu solicitud»; también está en «Beneficios». Cuéntanos qué necesitas y te respondemos por WhatsApp." },
  { tema: "Apoyos", pregunta: "¿Cuánto tardan en responder mi solicitud?", respuesta: "Te respondemos por WhatsApp en máximo 24 horas. Si pasado ese tiempo no has recibido respuesta, escríbenos por el botón ¿Necesitas algo? y dinos tu nombre y la fecha en que enviaste tu solicitud." },
  { tema: "Apoyos", pregunta: "¿Qué tipos de apoyo puedo pedir?", respuesta: "Al registrar tu solicitud eliges el tipo de apoyo (por ejemplo libros, asesorías, mascotas, cursos o talleres, empleo o capacitación, cupones o promociones y trueque solidario). Si lo tuyo no aparece, elige «Otro» y cuéntanos el detalle." },
  { tema: "Apoyos", pregunta: "Tengo una urgencia o necesito ayuda emocional, ¿qué hago?", respuesta: "Toca «¿Necesitas apoyo o tienes una urgencia?» en Inicio: te orientamos sin pedirte datos. Si hay peligro inmediato, llama al 911. Para apoyo emocional puedes llamar a la Línea de la Vida (800 911 2000) o a SAPTEL (55 5259 8121)." },
  { tema: "Apoyos", pregunta: "¿Tengo que vivir en Jardines de Morelos para participar?", respuesta: "DCUATES nace en Jardines de Morelos, Ecatepec, y ahí se concentra la mayor parte de sus apoyos. Si vives en otra zona, escríbenos por WhatsApp y vemos cómo orientarte o sumarte." },
  { tema: "Apoyos", pregunta: "¿Cómo me entero de las noticias y actividades nuevas?", respuesta: "Sigue nuestras redes sociales (Facebook, Instagram, YouTube y TikTok), revisa «Agenda Plus» en la barra de abajo (agenda, tablero de anuncios y mapas) y mira «Cosas que pasan esta semana» en Inicio." },
  { tema: "Negocios", pregunta: "¿Cómo publico mi negocio o servicio?", respuesta: "Entra a la sección «Negocios», toca «Ventas con causa y publicidad» y llena el formulario; también puedes tocar «Registra tu negocio gratis» en «Regístrate». Si prefieres, escríbenos directo por WhatsApp." },
  { tema: "Negocios", pregunta: "¿Necesito ser un negocio formal para participar?", respuesta: "No. DCUATES está abierto a negocios formales, informales, personas y organizaciones de la comunidad; lo importante es la intención de sumar y beneficiar a la zona." },
  { tema: "Negocios", pregunta: "¿Cuánto cuesta anunciarme?", respuesta: "La publicidad comunitaria es gratuita. Las aportaciones voluntarias solo ayudan a que la plataforma llegue a más familias." },
  { tema: "Negocios", pregunta: "¿Cómo publico un anuncio en el Tablero?", respuesta: "Abre «Agenda Plus» (barra de abajo), entra al Tablero y toca publicar un anuncio: elige el tipo, escribe título y texto, y deja un contacto. Lo revisamos y, si cumple las reglas del tablero, lo publicamos." },
  { tema: "Negocios", pregunta: "Vi un anuncio sospechoso, ¿cómo lo reporto?", respuesta: "En el Tablero, cada anuncio (que no sea de ejemplo) tiene el enlace «🚩 Reportar este anuncio». Tócalo y se abre WhatsApp con el mensaje listo para que nos avises." },
  { tema: "Negocios", pregunta: "¿Qué son las «ventas con causa»?", respuesta: "Son productos o servicios que ofreces o compras en la comunidad y que además apoyan una causa. Puedes ofrecer lo tuyo o ver lo disponible en «Negocios» → «Ventas con causa»." },
  { tema: "Negocios", pregunta: "¿Qué son los servicios y promociones especiales?", respuesta: "Además de los apoyos comunitarios gratuitos, DCUATES y Conexiones con Causa ofrecen coaching, consultoría y asesoría para personas, negocios y organizaciones, y promociones especiales con aliados. Toca «Servicios y promociones especiales» en el botón ¿Necesitas algo? (abajo a la derecha), o escríbenos por WhatsApp para recibir informes." },
  { tema: "Voluntariado", pregunta: "¿Cómo puedo apoyar como voluntario o con una donación?", respuesta: "En «Causas y valores» abre «Apoyo voluntario, donativos y casos», o toca «Quiero ser voluntario» / «Quiero donar» en «Súmate». Puedes elegir entre aportación económica, en especie, trueque solidario o labor voluntaria; cada opción te conecta directo por WhatsApp." },
  { tema: "Voluntariado", pregunta: "¿Cómo dono o presto un libro?", respuesta: "En «Súmate», dentro de «Micro-acciones», toca «Dona o presta un libro»: se abre WhatsApp con el mensaje «Quiero donar un libro». Ahí coordinamos contigo cómo entregarlo." },
  { tema: "Voluntariado", pregunta: "¿Cómo reporto una mascota, persona o cosa extraviada?", respuesta: "Entra a «Causas y valores», abre «Apoyo voluntario, donativos y casos» y toca «Reporta un caso» (también está en «Regístrate»). Te contactamos directo por WhatsApp. Si es una mascota, también puedes escribir «mascotas» en el buscador de Inicio para ver Ecatepets." },
  { tema: "Voluntariado", pregunta: "¿Qué es el Muro de gratitud?", respuesta: "Es un espacio donde cualquiera puede dejar un mensaje de agradecimiento para alguien de la comunidad. Lo encuentras en la sección «Gratitud», o desde «Súmate» → «Deja un agradecimiento en el Muro»." },
  { tema: "Voluntariado", pregunta: "¿Cómo invito a un vecino?", respuesta: "En «Súmate» → «Micro-acciones» toca «Invita a un vecino», o usa «Invita a un vecino» al final de Inicio. Se abre WhatsApp con la invitación lista para mandar a quien tú elijas." },
  { tema: "Voluntariado", pregunta: "¿Para qué sirve «Tu opinión cuenta»?", respuesta: "Para decirnos cómo te fue en la página y qué mejorarías. Es anónima; la encuentras en «Contacto» y en «Súmate» → «Cuéntanos tu opinión»." },
  { tema: "Privacidad", pregunta: "¿DCUATES tiene algún costo para participar?", respuesta: "No. Todos los proyectos (libros, publicidad, Ecatepets, asesorías, etc.) son gratuitos. Las aportaciones voluntarias solo ayudan a que la plataforma llegue a más familias." },
  { tema: "Privacidad", pregunta: "¿Qué pasa con mis datos si lleno un formulario?", respuesta: "Solo se usan para la difusión comunitaria del proyecto que elegiste y para contactarte. Puedes ver el detalle completo en nuestro Aviso de Privacidad, en el pie de página." },
  { tema: "Privacidad", pregunta: "¿Cómo piden o borran mis datos?", respuesta: "Escríbenos a dcuates77@gmail.com o por WhatsApp pidiendo la rectificación o eliminación de tus datos. Está explicado en el Aviso de Privacidad." },
  { tema: "Privacidad", pregunta: "¿Usan cookies o me rastrean?", respuesta: "Para saber qué secciones se usan más contamos visitas y toques de forma anónima, con herramientas que no usan cookies de seguimiento ni guardan tu nombre, teléfono o identidad." },
  { tema: "Privacidad", pregunta: "¿Cómo evito fraudes o estafas?", respuesta: "Revisa el «Escudo de seguridad» y el «Aviso de seguridad» (en el menú y el pie de página). Regla básica: DCUATES no te pide dinero por adelantado ni claves; si alguien lo hace a nombre de DCUATES, repórtalo." },
  { tema: "Técnicos", pregunta: "Algo no funciona, ¿qué hago?", respuesta: "Toca el botón ¿Necesitas algo? (abajo a la derecha) y elige «Algo no funciona»: se abre WhatsApp con los datos básicos de tu teléfono para que podamos revisar el problema." },
  { tema: "Técnicos", pregunta: "Envié un formulario y no se abrió WhatsApp", respuesta: "Después de enviar, busca el texto «¿No se abrió WhatsApp? Tócalo aquí» y toca el enlace. Verifica también que tengas WhatsApp instalado." },
  { tema: "Técnicos", pregunta: "Veo la página vieja o algo raro después de una actualización", respuesta: "Cierra la página por completo y vuelve a abrirla (o recárgala una vez). A veces el teléfono guarda la versión anterior unos minutos." },
  { tema: "Técnicos", pregunta: "¿Dónde dejo una sugerencia o una queja?", respuesta: "En el menú «Más» (o el pie de página) abre «Sugerencias y quejas», o entra a «Regístrate» y toca «Sugerencias y quejas». También puedes escribirnos desde «Contacto»." }
];
