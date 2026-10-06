import React from "react";
import { BotonesNaranjasSeccion } from "../media.jsx";
import { BotonVerdeInfo } from "../ventanas.jsx";
import { FAQ_ITEMS } from "../../datos/legal.js";
import BotonCompartir from "../../BotonCompartir";

export function PestanaValores({ infoAbierta, librosLinks, musicaLinks, recomendacionesComunidad, recomendacionesDcuates, setInfoAbierta, setModalProyecto, videosLinks }) {
  return (
    (
                <div className="flex flex-col gap-4 min-w-0">
                  <BotonesNaranjasSeccion modales={["historias-dcuates"]} onAbrir={(id) => setModalProyecto(id)} />
                  <div id="recursos" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#0f2d1e] p-4">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="recursos" titulo="Más recursos e información de valor" texto="Recomendaciones, música, libros, películas y preguntas frecuentes" />
          <p className="text-white font-black uppercase text-sm sm:text-base tracking-wide text-center mb-3">
            🔎 Más recursos e información de valor
          </p>
            {/* Recomendaciones / Música-Libros-Pelis / Preguntas Frecuentes,
                en fila horizontal debajo del video (antes eran una columna
                al lado del video). */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
              <BotonVerdeInfo
                titulo="Recomendaciones ⭐⭐⭐⭐⭐"
                abierto={infoAbierta === "recomendaciones"}
                onClick={() => setInfoAbierta((v) => (v === "recomendaciones" ? null : "recomendaciones"))}
              >
                <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide">Recomendaciones DCUATES</p>
                <ul className="space-y-1">
                  {recomendacionesDcuates.map((r, i) => (
                    <li key={i}>
                      <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                        {r.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide pt-2">Recomendaciones de la Comunidad</p>
                <ul className="space-y-1">
                  {recomendacionesComunidad.map((r, i) => (
                    <li key={i}>
                      <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                        {r.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="pt-2 font-black uppercase text-emerald-300">Si necesitas alguna recomendación en especial, contáctanos !!!</p>
              </BotonVerdeInfo>

              <BotonVerdeInfo
                titulo="Música, Libros, Pelis y Más... 🎵📚🎬"
                abierto={infoAbierta === "recursos"}
                onClick={() => setInfoAbierta((v) => (v === "recursos" ? null : "recursos"))}
              >
                <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide">🎵 Música</p>
                <ul className="space-y-1">
                  {musicaLinks.map((enlace, i) => (
                    <li key={i}>
                      <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                        Música {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide pt-2">📚 Libros</p>
                <ul className="space-y-1">
                  {librosLinks.map((enlace, i) => (
                    <li key={i}>
                      <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                        Libro {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="font-black uppercase text-emerald-300 text-[11px] tracking-wide pt-2">🎬 Películas y Más</p>
                <ul className="space-y-1">
                  {videosLinks.map((enlace, i) => (
                    <li key={i}>
                      <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-emerald-300">
                        Recurso {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </BotonVerdeInfo>

              <BotonVerdeInfo
                titulo="Preguntas Frecuentes ❓💬"
                abierto={infoAbierta === "faq"}
                onClick={() => setInfoAbierta((v) => (v === "faq" ? null : "faq"))}
              >
                <div className="space-y-2">
                  {FAQ_ITEMS.map((f, i) => (
                    <details open key={i} className="rounded-lg bg-emerald-900/40 px-3 py-2">
                      <summary className="cursor-pointer text-xs sm:text-sm font-bold">{f.pregunta}</summary>
                      <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed">{f.respuesta}</p>
                    </details>
                  ))}
                </div>
              </BotonVerdeInfo>
            </div>
        
                  </div>
                </div>
              )
  );
}
