// FONDO DE TEMPORADA: emojis muy tenues SOLO sobre el color de fondo de cada sección (no en ventanas, tarjetas ni textos).
import React from "react";
import { temporadaActual, patronSvg } from "./datos/temporada.js";

export default function Temporada() {
  const t = temporadaActual();
  return <style>{`.bc-panel,#inicio,footer{background-image:${patronSvg(t)}!important;background-size:220px 220px}`}</style>;
}
