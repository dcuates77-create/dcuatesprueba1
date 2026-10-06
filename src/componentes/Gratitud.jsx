import React from "react";
import { BotonesNaranjasSeccion, BotonesRetosRegalos } from "../media.jsx";

export function PestanaGratitud({ setModalProyecto }) {
  return (
    (
                <div className="flex flex-col gap-4 min-w-0">
                  <div className="rounded-2xl bg-[#0f2d1e] p-3 sm:p-4">
                    <BotonesRetosRegalos indices={[2]} />
                  </div>
                  <BotonesNaranjasSeccion modales={["patrocinadores-alianzas"]} onAbrir={(id) => setModalProyecto(id)} />
                </div>
              )
  );
}
