// CONTENIDO DE «¿QUÉ ES DCUATES?» (e86a). Todo el texto de la sección vive aquí para poder revisarlo y editarlo con calma.
// Estructura: DESCUBRE (mensajes breves) y CONOCE MÁS (explicaciones ampliadas, en una hoja que se abre encima).
// Fotos: el componente busca /images/que-es/<clave>.webp; si no existe, muestra una ilustración. Basta subir la foto con ese nombre.
// Textos marcados «BORRADOR» no venían en el documento original y están propuestos para revisión.

export const FRASES = {
  bienvenida: "¡TODOS TENEMOS ALGO QUE BUSCAR, OFRECER Y COMPARTIR!",
  bienvenidaTxt: "DCUATES conecta personas, necesidades, capacidades, iniciativas y oportunidades para facilitar soluciones, generar beneficios y construir nuevas posibilidades de desarrollo personal y comunitario.",
  bienvenidaTxt2: "No todas las personas llegan buscando lo mismo. Algunas necesitan encontrar algo, pedir información o apoyo; otras desean compartir lo que saben, ofrecen, tienen o pueden aportar. Ambas motivaciones valen lo mismo y se complementan.",
  cultivamos: "CULTIVAMOS PERSONAS, TEJEMOS COMUNIDAD Y MULTIPLICAMOS POSIBILIDADES.",
  desarrollo: "DESARROLLO INTEGRAL Y COMPARTIDO",
  compartir: "¡TODOS TENEMOS ALGO QUE COMPARTIR!",
  mejor: "¡JUNTOS HACEMOS UNA MEJOR COMUNIDAD!",
  conectando: "CONECTANDO PERSONAS, IDEAS, PROYECTOS, CAUSAS Y OPORTUNIDADES",
  central: "Llegamos por diferentes razones, nos conectamos por muchas más y podemos construir juntos una mejor comunidad.",
  rectora: "DESARROLLAR es nuestra visión y lo que nos mueve; CUATES es el camino que construimos para hacerla realidad."
};

// Los 7 apartados de navegación (no confundir con las letras D + CUATES).
export const APARTADOS = [
  { n: 1, k: "descubre", t: "DESCUBRE", s: "Razón de ser", c: "#3E7D1E", e: "🌱" },
  { n: 2, k: "comprende", t: "COMPRENDE", s: "Visión y camino", c: "#0E7C86", e: "🧭" },
  { n: 3, k: "conecta", t: "CONECTA", s: "Cultura, cadena y ecosistema", c: "#B85400", e: "🔗" },
  { n: 4, k: "identificate", t: "IDENTIFÍCATE", s: "Intereses, capacidades y circunstancias", c: "#8E3A9F", e: "🪞" },
  { n: 5, k: "explora", t: "EXPLORA", s: "Dimensiones del desarrollo integral", c: "#2F7D3A", e: "📚" },
  { n: 6, k: "participa", t: "PARTICIPA", s: "Aportar, recibir, compartir, colaborar", c: "#1F65A8", e: "🤝" },
  { n: 7, k: "crece", t: "CRECE Y MULTIPLICA", s: "Desarrollo compartido", c: "#A84A00", e: "🌳" }
];

// D = visión; CUATES = camino (seis acciones).
export const VISION = {
  l: "D", v: "DESARROLLAR", c: "#D9730D",
  corto: "Desarrollo Integral y Compartido: nuestra visión y propósito.",
  tres: ["CRECER DESDE DENTRO.", "CONSTRUIR HACIA FUERA.", "CRECER CON LOS DEMÁS."],
  mas: {
    t: "D — DESARROLLAR",
    p: [
      "Desarrollarnos es crecer desde nuestras capacidades y compartir ese crecimiento con los demás.",
      "Es una visión integral: no se trata solo de tener más, sino de ser, aprender, convivir y aportar mejor, en todas las dimensiones de la vida.",
      "Y es compartida: nuestro desarrollo es más fuerte cuando se conecta con el de otras personas, organizaciones e iniciativas."
    ]
  }
};

export const ACCIONES = [
  { l: "C", v: "CONOCER", c: "#2A74B0", e: "👀", corto: "Reconocer quiénes somos y quiénes nos rodean.",
    mas: { t: "C — CONOCER", p: ["Todo comienza por mirarnos y mirar a quienes nos rodean: vecinas y vecinos, familias, negocios, organizaciones, causas y proyectos.", "Conocer es reconocer lo que cada quien es, sabe, necesita y puede ofrecer, sin prejuicios y con curiosidad."], ej: ["¿Quiénes viven y trabajan cerca de mí?", "¿Qué iniciativas ya existen en mi comunidad?"] } },
  { l: "U", v: "UBICAR", c: "#4E8F2A", e: "📍", corto: "Identificar necesidades, recursos y posibilidades.",
    mas: { t: "U — UBICAR", p: ["Ubicar es identificar con claridad qué necesitamos, con qué contamos y qué posibilidades se abren.", "Cuando ponemos las cosas en su lugar —necesidades, recursos, oportunidades— es más fácil actuar y pedir o dar ayuda a tiempo."], ej: ["¿Qué necesito hoy y qué me sobra?", "¿Qué recursos hay a mi alrededor?"] } },
  { l: "A", v: "APORTAR", c: "#E07410", e: "🎁", corto: "Compartir lo que somos, sabemos y podemos ofrecer.",
    mas: { t: "A — APORTAR", p: ["Todas las personas tenemos algo valioso: tiempo, conocimientos, oficios, productos, servicios, escucha, ideas, contactos.", "Aportar es compartirlo, en la medida y la forma en que cada quien puede. Lo pequeño también suma."], ej: ["Enseñar lo que sé", "Ofrecer mi producto o servicio", "Acompañar una causa"] } },
  { l: "T", v: "TEJER", c: "#8E3A9F", e: "🧵", corto: "Crear vínculos y redes de confianza. (BORRADOR)",
    mas: { t: "T — TEJER (BORRADOR)", p: ["Tejer es crear vínculos: conectar personas, organizaciones e iniciativas para que se conozcan, se apoyen y se vuelvan una red.", "Una red tejida con confianza resiste mejor las dificultades y multiplica lo que cada quien aporta."], ej: ["Presentar a dos personas que pueden ayudarse", "Sumar a un vecino a una iniciativa"] } },
  { l: "E", v: "ENCONTRAR", c: "#0E7C86", e: "🔎", corto: "Descubrir coincidencias, oportunidades y soluciones. (BORRADOR)",
    mas: { t: "E — ENCONTRAR (BORRADOR)", p: ["Cuando conocemos, ubicamos, aportamos y tejemos, aparecen las coincidencias: lo que alguien necesita y otra persona puede ofrecer.", "Encontrar es descubrir esas oportunidades y soluciones que, solas, no habríamos visto."], ej: ["Quien busca un servicio encuentra a quien lo ofrece", "Quien quiere ayudar encuentra dónde hacerlo"] } },
  { l: "S", v: "SUMAR", c: "#C2185B", e: "➕", corto: "Unir esfuerzos para multiplicar resultados. (BORRADOR)",
    mas: { t: "S — SUMAR (BORRADOR)", p: ["Sumar es unir esfuerzos, recursos y voluntades para lograr juntos lo que no se logra por separado.", "Cada aportación se multiplica cuando se suma a otras: así crece el bienestar de todas y todos."], ej: ["Una causa que logra su meta entre muchos", "Un proyecto que crece con aliados"] } }
];

export const FUNDAMENTOS = [
  { k: "cultura", t: "CULTURA CUATES", e: "🤝", c: "#B85400", corto: "La manera en que nos relacionamos.",
    mas: { t: "Cultura CUATES", p: ["La cultura CUATES es la manera en que nos relacionamos: con respeto, generosidad y confianza."], lista: ["Valorar a las personas", "Respetar las diferencias", "Compartir con generosidad", "Cultivar la confianza", "Procurar la reciprocidad", "Construir en colaboración", "Multiplicar el bienestar"] } },
  { k: "cadena", t: "CADENA DE VALORES Y APOYOS MUTUOS", e: "⛓️", c: "#0E7C86", corto: "Compartir y multiplicar valor.",
    mas: { t: "Cadena de Valores y Apoyos Mutuos", p: ["Cuando una persona da y otra recibe, y esa otra a su vez da a alguien más, se forma una cadena que multiplica el bien.", "Así avanza la cadena:"], lista: ["Reconocer valores", "Generar confianza", "Compartir y apoyarnos", "Crear valor y beneficios", "Multiplicar oportunidades"] } },
  { k: "ecosistema", t: "ECOSISTEMA DCUATES", e: "🌐", c: "#2F7D3A", corto: "Todo se conecta y evoluciona.",
    mas: { t: "Ecosistema DCUATES", p: ["Un ecosistema es un conjunto de elementos que se relacionan, se complementan y cambian con el tiempo.", "En DCUATES interactúan:"], lista: ["Personas", "Organizaciones", "Iniciativas", "Recursos", "Relaciones", "Oportunidades"] } }
];

export const RELACION = [
  { t: "Visión", d: "D — DESARROLLAR" },
  { t: "Camino", d: "CUATES" },
  { t: "Cultura", d: "Cómo nos relacionamos" },
  { t: "Cadena", d: "Valores y apoyos mutuos" },
  { t: "Ecosistema", d: "Todo conectado" }
];

export const IDENTIDAD = [
  { k: "intereses", t: "Intereses", e: "⭐", c: "#D9730D", corto: "Lo que nos mueve, nos gusta y queremos aprender.",
    mas: { t: "Intereses", p: ["Lo que nos apasiona, nos gusta o queremos aprender: música, deporte, oficios, mascotas, lectura, tecnología, cocina…", "Los intereses nos acercan a otras personas con quienes compartirlos."] } },
  { k: "capacidades", t: "Capacidades", e: "🛠️", c: "#0E7C86", corto: "Lo que sabemos, hacemos y podemos ofrecer.",
    mas: { t: "Capacidades", p: ["Conocimientos, oficios, habilidades, experiencia, tiempo y talento. Todas las personas tenemos capacidades, aunque a veces no las veamos.", "Reconocerlas es el primer paso para aportarlas."] } },
  { k: "circunstancias", t: "Circunstancias", e: "🧡", c: "#B3261E", corto: "El momento y las condiciones en que vivimos.",
    mas: { t: "Circunstancias", p: ["Nuestro momento de vida, nuestra situación, nuestras necesidades y también nuestras oportunidades.", "Hay etapas para aportar y etapas para recibir apoyo; ambas son parte de una comunidad sana."] } }
];

// Motivos de acercamiento: ejemplos ilustrativos (NO son un formulario, buscador ni navegación).
export const MOTIVOS = ["Una necesidad", "Un interés", "Un beneficio", "Un producto", "Un servicio", "Una causa", "Un proyecto", "Aprender", "Colaborar"];

export const DIMENSIONES = [
  { k: "salud", t: "Salud y Bienestar", e: "💚", c: "#C2185B", corto: "Cuidarnos física, emocional y socialmente.",
    mas: { t: "Salud y Bienestar", p: ["Cuidar el cuerpo, la mente y las emociones, y apoyarnos en la prevención, el descanso, la actividad física y el acompañamiento."] } },
  { k: "educacion", t: "Educación y Aprendizaje", e: "📖", c: "#2F7D3A", corto: "Aprender y enseñar a lo largo de la vida.",
    mas: { t: "Educación y Aprendizaje", p: ["Aprender en todas las etapas y compartir lo que sabemos: lectura, oficios, habilidades, tutorías, talleres."] } },
  { k: "trabajo", t: "Trabajo y Economía", e: "💼", c: "#B85400", corto: "Oportunidades para generar ingresos y crecer.",
    mas: { t: "Trabajo y Economía", p: ["Emprendimientos, empleo, oficios, comercio local y economía solidaria que fortalecen a las familias y a la comunidad."] } },
  { k: "cultura", t: "Cultura y Recreación", e: "🎭", c: "#8E3A9F", corto: "Expresarnos, divertirnos y celebrar.",
    mas: { t: "Cultura y Recreación", p: ["Tradiciones, arte, deporte, juego y convivencia que dan identidad y alegría."] } },
  { k: "entorno", t: "Entorno y Medio Ambiente", e: "🌎", c: "#2F7D3A", corto: "Cuidar el lugar donde vivimos.",
    mas: { t: "Entorno y Medio Ambiente", p: ["Espacios limpios y seguros, cuidado del agua y de la naturaleza, reciclaje y respeto por los animales."] } },
  { k: "convivencia", t: "Convivencia y Valores", e: "🫶", c: "#C2185B", corto: "Vivir juntos con respeto y confianza.",
    mas: { t: "Convivencia y Valores", p: ["Respeto, solidaridad, confianza y reciprocidad para resolver diferencias y construir acuerdos."] } }
];

export const FORMAS = [
  { k: "compartir", t: "Compartir", e: "🎁", c: "#1F65A8", corto: "Dar a conocer lo que tienes y sabes.",
    mas: { t: "Compartir", p: ["Ofrecer algo que tienes, sabes o haces: un objeto, un conocimiento, un servicio, una recomendación.", "También es compartir lo que necesitas, para que otras personas puedan ayudarte."] } },
  { k: "colaborar", t: "Colaborar", e: "🧩", c: "#0E7C86", corto: "Trabajar con otros por un objetivo común.",
    mas: { t: "Colaborar", p: ["Sumar nuestras capacidades con las de otras personas, organizaciones o iniciativas para lograr algo juntos."] } },
  { k: "voluntariado", t: "Voluntariado", e: "💙", c: "#8E3A9F", corto: "Dar tiempo y talento por una causa.",
    mas: { t: "Voluntariado", p: ["Dedicar tiempo, talento o energía a una causa o a una persona, de manera libre y generosa."] } }
];

// Conexiones futuras con el resto del sitio (solo conceptual en esta etapa: NO son enlaces).
export const FUTURO = ["Negocios", "Beneficios", "Causas", "Bibliobici", "Causa Animal", "Alianzas Solidarias", "Voluntariado", "Club DCUATES", "Círculo de Confianza", "Proyectos e iniciativas"];

// ===== e86b: DOS PUERTAS (texto tomado del documento «Mejoras a ¿Qué es DCUATES?») =====
export const PERSONAS = ["👵", "🧑‍🔧", "👩‍🍳", "🧒", "🧑‍🏫", "👨‍🌾", "👩‍💻", "🧓"];

export const PUERTA1 = {
  n: "01", t: "QUIERO BUSCAR / SOLICITAR", e: "🔎", c: "#0E7C86", f: "#E3F4F5",
  lema: "Tengo una necesidad, busco algo o quiero encontrar nuevas posibilidades.",
  ejemplos: ["Productos, servicios y negocios", "Promociones, descuentos y beneficios", "Información y orientación", "Apoyo y acompañamiento", "Personas, organizaciones e iniciativas que puedan ayudar", "Oportunidades de aprendizaje, colaboración o desarrollo"],
  cta: "ENCUENTRA LO QUE BUSCAS",
  nota: "Pedir o recibir apoyo no depende de que ofrezcas algo a cambio, participes en actividades o demuestres antes alguna capacidad."
};
// Atajos REALES (solo lo que ya existe). acc = acción que ejecuta el componente.
export const ATAJOS1 = [
  { t: "Directorio de negocios CUATE", e: "🏪", acc: "directorio" },
  { t: "Lo que hay en el Tablón", e: "📋", acc: "tablon" },
  { t: "Causas y Beneficios", e: "💛", acc: "causas" },
  { t: "Necesito algo", e: "🙋", acc: "necesito" }
];

export const PUENTE = {
  t: "¿Y SI PODEMOS IR MÁS ALLÁ DE ENCONTRAR LO QUE BUSCAMOS?",
  p: [
    "Buscar o solicitar algo puede ser el comienzo de una gran conexión.",
    "Tal vez, además de encontrar lo que necesitas, descubras que tienes conocimientos, experiencias, capacidades o recursos que pueden ser valiosos para otras personas.",
    "Cuando compartimos, colaboramos y nos apoyamos, las oportunidades se multiplican: lo que alguien necesita puede encontrar respuesta en lo que otro ofrece, y quienes ayudan también pueden encontrar respaldo, beneficios y nuevas posibilidades para desarrollarse.",
    "No se trata de dar algo a cambio de lo que recibes, sino de descubrir todo lo que podemos generar cuando decidimos sumar juntos."
  ],
  inv: "¿TE GUSTARÍA DESCUBRIR ESA OTRA POSIBILIDAD?",
  cta: "CONOCE LA PUERTA 02: QUIERO SUMAR / MULTIPLICAR"
};

export const PUERTA2 = {
  n: "02", t: "QUIERO SUMAR / MULTIPLICAR", e: "🌱", c: "#B85400", f: "#FFF0DC",
  lema: "Tengo algo que ofrecer, quiero apoyar, participar o impulsar nuevas posibilidades.",
  ejemplos: ["Compartir conocimientos, experiencias, talentos y capacidades", "Dar visibilidad a negocios, productos, servicios y emprendimientos", "Impulsar proyectos e iniciativas", "Participar en causas y acciones comunitarias", "Construir alianzas y relaciones de colaboración", "Apoyar y recibir apoyo", "Conocer el Club DCUATES y las posibilidades de integración"],
  cta: "DESCUBRE CÓMO PODEMOS MULTIPLICAR",
  nota: "Sumar no es solo hacer voluntariado o dar dinero: también se aporta con conocimientos, contactos, servicios, productos, ideas, experiencias, tiempo y capacidades.",
  beneficios: ["Visibilidad", "Relaciones de confianza", "Aprendizaje", "Oportunidades", "Colaboración", "Acceso a apoyos", "Proyectos más fuertes"],
  apoyo: "Quienes contribuyen también pueden necesitar respaldo, orientación, recursos o acompañamiento. DCUATES es un espacio donde quienes apoyan encuentran también apoyo para su propio desarrollo."
};
export const ATAJOS2 = [
  { t: "Quiero ofrecer algo", e: "🎁", acc: "ofrezco" },
  { t: "Arma tu página CUATE", e: "🏪", acc: "asistente" },
  { t: "Club DCUATES", e: "🏅", acc: "club" },
  { t: "Causas y Beneficios", e: "💛", acc: "causas" }
];

export const AMBAS = {
  t: "¡Y PUEDES HACER AMBAS COSAS!",
  p: "Todos podemos necesitar, recibir, ofrecer y apoyar. Nuestras circunstancias y posibilidades cambian, y todos tenemos algo que compartir."
};

export const CULTIVAR = {
  t: "CULTIVAR", e: "🌱", c: "#2F7D3A", f: "#E8F5E9",
  d: "Alimentar y fortalecer lo interno",
  p: "Desarrollar personas, capacidades, conocimientos, talentos, experiencias, valores, emociones, confianza, bienestar y potencialidades."
};
export const TEJER = {
  t: "TEJER", e: "🧵", c: "#8E3A9F", f: "#F5E8F8",
  d: "Construir y fortalecer lo externo",
  p: "Generar relaciones, vínculos, redes, alianzas, oportunidades y estructuras de apoyo que dan unión, abrigo, protección y respaldo."
};
export const CULTIVAR_TEJER_NOTA = "Se complementan y se retroalimentan: cuando las personas crecen, la comunidad se fortalece; y cuando la comunidad se teje, cada persona encuentra dónde crecer.";

export const CADENA = {
  t: "CADENA DE VALORES Y APOYOS MUTUOS",
  p: ["Ayudamos a quien pide ayuda, sin condicionar el apoyo a que pueda dar algo a cambio.", "Y apoyamos especialmente a quienes apoyan: quienes ayudan a los demás también tienen necesidades y merecen respaldo."],
  nota: "La reciprocidad no es una deuda ni se devuelve a la misma persona: el valor sigue circulando y genera nuevas oportunidades para otras."
};

export const CIERRE = {
  p: "Puedes llegar por lo que necesitas, por lo que tienes para compartir o por lo que deseas construir. Lo importante es descubrir las posibilidades que podemos generar juntos.",
  fin: "Una comunidad donde todos podemos necesitar, recibir, aportar, apoyar y desarrollarnos."
};
