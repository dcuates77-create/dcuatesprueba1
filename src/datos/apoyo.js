// DIRECTORIO DE APOYO (editable). Cada fila: [emoji, nombre, teléfono para marcar | "", teléfono a mostrar, nota/horario, enlace | ""]
// Fuentes: Directorio de apoyo psicológico UAM 2026 (defensoria.uam.mx), SSEM Estado de México (comunicado 897, 2025) y
// directorios públicos. Los números pueden cambiar: verifícalos cada cierto tiempo. NO agregues números sin confirmarlos.
export const FECHA_REVISION = "oct 2026";

export const CIBERNETICA = [
  ["🛡️", "Policía Cibernética · Estado de México", "7222758333", "722 275 8333", "Correo: cibernetica.edomex@ssedomex.gob.mx", "mailto:cibernetica.edomex@ssedomex.gob.mx"],
  ["🛡️", "Policía Cibernética · CDMX", "5552425100,5086", "55 5242 5100 ext. 5086", "Verifica la extensión al llamar", ""],
  ["🛡️", "Guardia Nacional (denuncia)", "088", "088", "Denuncia de delitos, incluidos los cibernéticos", ""],
  ["🕵️", "Denuncia anónima", "089", "089", "24 horas, sin dar tu nombre", ""]
];

// Ayuda en Ecatepec / Estado de México (agrega aquí los números del municipio cuando los confirmes)
export const AYUDA_LOCAL = [
  ["🚨", "Emergencias", "911", "911", "Policía, bomberos y ambulancias", ""],
  ["👨‍👩‍👧", "SOS DIF Estado de México", "8007102496", "800 710 2496", "Sin costo · lunes a viernes 9:00 a 20:00 · también 800 221 3109", ""],
  ["🧠", "IMSAMA · salud mental, adicciones y violencia (Edomex)", "7226893202", "(722) 689 3202", "Más información en imsama.edomex.gob.mx", "https://imsama.edomex.gob.mx"],
  ["🛡️", "Consejo Ciudadano · Línea de Seguridad", "5555335533", "55 5533 5533", "24 horas", ""]
];

export const APOYO = [
  ["Apoyo emocional · 24 horas", [
    ["💚", "Línea de la Vida", "8009112000", "800 911 2000", "24 horas · apoyo emocional y adicciones", ""],
    ["💚", "SAPTEL", "5552598121", "55 5259 8121", "24 horas · saptel.org.mx", "https://www.saptel.org.mx"],
    ["🧠", "Instituto Nacional de Psiquiatría", "5541605372", "55 4160 5372", "24 horas", ""],
    ["🧑‍🎓", "Centros de Integración Juvenil", "5552121212", "55 5212 1212", "24 horas · también WhatsApp 55 4555 1212", ""],
    ["🌐", "Línea UNAM (en línea)", "", "misalud.unam.mx", "Atención en línea las 24 horas", "https://misalud.unam.mx"]
  ]],
  ["Universidades", [
    ["🎓", "UNAM · Psicología a distancia", "5550250855", "55 5025 0855", "Lunes a viernes 8:00 a 18:00", ""],
    ["🎓", "UAM · Línea UAM", "5525558092", "55 2555 8092", "Lunes a viernes 9:00 a 17:00 · también 55 5804 6444 y 55 3942 0339", "https://lineauam.uam.mx/lineauam_chat.htm"]
  ]],
  ["Gobierno y salud pública", [
    ["🏥", "IMSS · salud mental", "8002222668", "800 2222 668, opción 4", "Lunes a viernes 8:00 a 20:00", ""],
    ["📞", "Locatel (CDMX)", "5556581111", "55 5658 1111", "24 horas · o marca *765", ""],
    ["👨‍👩‍👧", "SOS DIF Estado de México", "8007102496", "800 710 2496", "Sin costo · lunes a viernes 9:00 a 20:00", ""]
  ]],
  ["Violencia y refugio", [
    ["💜", "Línea Mujeres CDMX", "5556581111", "55 5658 1111, opción 3", "24 horas", ""],
    ["🏠", "Red Nacional de Refugios", "8008224460", "800 822 4460", "Sin costo · 24 horas", ""]
  ]]
];

// AYUDA CAUSA ANIMAL. Teléfonos de fuentes periodísticas de 2023 (UnoTV, adn40): VERIFÍCALOS cada cierto tiempo.
// Falta agregar el Centro de Control Canino de Ecatepec cuando tengas su teléfono confirmado.
export const ANIMAL_SUGERENCIAS = [
  ["🔎", "Se perdió mi mascota", "#2E9E5B", [
    "Busca de inmediato en tu calle y colonia, y pregunta a vecinos, tiendas y veterinarias.",
    "Repórtala en DCUATES para difundirla (botón de abajo).",
    "Haz un cartel con foto clara, nombre, señas y tu WhatsApp; compártelo en los grupos de tu colonia.",
    "Pregunta en el Centro de Control Canino del municipio y revisa fotos de animales encontrados."]],
  ["🏠", "Encontré un animal o quiero adoptar", "#7a5ad8", [
    "Revisa si tiene collar o placa, y toma fotos para difundirlo en DCUATES como «encontrado».",
    "Pregunta por su familia antes de darlo en adopción.",
    "Para adoptar: piensa en tiempo, gastos, vacunas y esterilización. Una adopción es para toda la vida."]],
  ["🆘", "Animal herido o en riesgo (rescate)", "#C2410C", [
    "Si hay peligro para personas o tráfico, llama al 911.",
    "Acércate con calma, no lo muevas bruscamente y no le des medicinas ni comida si está grave.",
    "Llama cuanto antes a una veterinaria. Un animal herido puede morder aunque sea manso: cuídate."]],
  ["⚖️", "Maltrato o abandono", "#C2255C", [
    "Guarda pruebas: fotos o videos con fecha y lugar, sin ponerte en riesgo.",
    "Denuncia con los teléfonos de abajo; la denuncia anónima es el 089.",
    "Describe la especie, el lugar exacto y lo que viste."]]
];
export const ANIMAL_TELEFONOS = [
  ["🚨", "Emergencias", "911", "911", "Peligro inmediato", ""],
  ["🕵️", "Denuncia anónima", "089", "089", "24 horas", ""],
  ["⚖️", "Fiscalía General de Justicia del Edomex", "7222261600", "722 226 1600", "Lesiones, envenenamiento, muerte o tortura de animales", ""],
  ["🌿", "PROPAEM (Edomex)", "7222135456", "722 213 5456", "Especies exóticas, comercio y exhibición con fines de lucro · también 55 5366 8253", "http://tramitesyservicios.edomex.gob.mx/dencma/"],
  ["🦉", "Profepa (fauna silvestre)", "8007763372", "800 776 3372", "Fauna silvestre, cacería y tráfico ilegal", ""],
  ["🐕", "Brigada de Vigilancia Animal (CDMX)", "5552089898", "55 5208 9898", "Rescates y asesoría en la Ciudad de México", ""],
  ["🛡️", "Consejo Ciudadano (CDMX)", "5555335533", "55 5533 5533", "24 horas · abuso contra perros y gatos · también *5533", ""],
  ["📋", "PAOT (CDMX)", "5552650780", "55 5265 0780", "Cualquier maltrato animal en la CDMX", ""]
];
