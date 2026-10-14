// FONDO DE TEMPORADA: tiñe y decora con emojis suaves las ventanas y los paneles de fondo claro. Se monta una vez en App.
import React from "react";
import { temporadaActual, patronSvg } from "./datos/temporada.js";

export default function Temporada() {
  const t = temporadaActual();
  const pat = patronSvg(t);
  return (
    <style>{`
.zj-caja{background-color:${t.base}!important;background-image:${pat}!important;background-size:150px 150px}
.zj-cab{border-bottom:3px solid ${t.acento}33;padding-bottom:6px}
.bc-shell{background-image:${pat}!important;background-size:150px 150px}
.ag-ev{background:rgba(255,255,255,.82)!important}
`}</style>
  );
}
