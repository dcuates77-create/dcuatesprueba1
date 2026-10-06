import React from "react";
import { BotonesRetosRegalos, Carrusel } from "../media.jsx";
import { resolverSrcImagen } from "../../utilidades/baserow.js";
import BotonCompartir from "../../BotonCompartir";

export function PestanaRegalos({ galeriaRetos }) {
  return (
    (
                <div id="retos-regalos" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#0f2d1e] p-3 sm:p-4">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="retos-regalos" titulo="Retos, regalos y reconocimientos" texto="Porque todo lo bueno merece ser compartido y reconocido" />
                  <p className="text-white font-black uppercase text-xs sm:text-sm tracking-wide mb-3 px-1 text-center">
                    🔎 Retos, Regalos y Reconocimientos DCUATES
                    <span className="block normal-case font-bold text-emerald-100">Porque todo lo bueno merece ser compartido y reconocido, envíanos tus propuestas.</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <BotonesRetosRegalos indices={[0, 1]} />
                    <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center min-h-[180px]">
                      {galeriaRetos.length > 0 ? (
                        <Carrusel
                          items={galeriaRetos}
                          renderItem={(item) => (
                            <img src={resolverSrcImagen(item.img)} alt={item.nombre} loading="lazy" className="w-full aspect-square object-cover" />
                          )}
                        />
                      ) : (
                        <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-wide text-center px-4">
                          Sube fotos a la columna "RETOSGALERIA" en Baserow para verlas aquí
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
  );
}
