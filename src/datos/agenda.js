// =========================================================================
// src/datos/agenda.js — Agenda comunitaria (calendario de la página)
// Fecha en formato AAAA-MM-DD. Estos son EJEMPLOS: bórralos o cámbialos.
// Si en Baserow (tabla ENLACES) hay filas con las columnas "AGENDA FECHA",
// "AGENDA TITULO", "AGENDA INFO" y (opcional) "AGENDA ENLACE", se usan esas
// y se SUMAN a estas.
// =========================================================================
import { MOSTRAR_EJEMPLOS } from "./config.js";
const AGENDA_EJEMPLO = [
  { fecha: "2026-10-11", titulo: "Taller de gratitud", info: "Un espacio para agradecer, reflexionar y compartir en comunidad.", enlace: "" },
  { fecha: "2026-10-17", titulo: "Tertulia literaria", info: "Convivencia y lectura compartida.", enlace: "" },
  { fecha: "2026-10-24", titulo: "Jornada de adopción de peluditos", info: "Ven a conocer a quienes buscan hogar.", enlace: "" }
];
export const AGENDA_EVENTOS = MOSTRAR_EJEMPLOS ? AGENDA_EJEMPLO : [];
