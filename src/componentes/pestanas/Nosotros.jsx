import React from "react";
import { COMO_SUMAR, MISION_VISION, QUIENES_SOMOS } from "../../datos/proyectos.js";
import { irASeccion } from "../../utilidades/baserow.js";
import BotonCompartir from "../../BotonCompartir";

// Partes de NOSOTROS (e35): cada una se muestra dentro de una tarjeta anidada.
export function PNQuienes() {
  return (
    <div className="flex flex-col gap-4 min-w-0">
            <div>
              <h1 className="sr-only">
                Juntos hacemos una mejor comunidad ⭐ 😊
              </h1>
              <h2 className="mt-3 text-center text-lg sm:text-2xl font-black uppercase leading-tight text-[#14532d]">
                TEJIENDO CONFIANZA, SUMANDO VOLUNTADES, COSECHANDO LOGROS !!!
              </h2>
              <p className="text-sm sm:text-base text-slate-900 leading-relaxed text-justify font-bold mt-3">
                DESDE HACE 19 AÑOS, <strong className="font-black">CONEXIONES CON CAUSA</strong>, <strong className="font-black">LA BIBLIOBICI</strong> Y <strong className="font-black">DCUATES</strong> CONECTAN, TEJEN E IMPULSAN <strong className="font-black">PROYECTOS, PERSONAS, ORGANIZACIONES Y EMPRENDIMIENTOS</strong> que <strong className="font-black">BENEFICIAN</strong> a las <strong className="font-black">FAMILIAS</strong>: <strong className="font-black">PUBLICIDAD GRATUITA</strong> para tu negocio, préstamo de <strong className="font-black">LIBROS</strong> y materiales <strong className="font-black">EDUCATIVOS</strong>, apoyo a <strong className="font-black">MASCOTAS Y GRUPOS VULNERABLES</strong>, y <strong className="font-black">ALIANZAS GANAR-GANAR</strong> que generan apoyos y beneficios mutuos y comunitarios. <strong className="font-black">SÚMATE</strong> con <strong className="font-black">TU VALIOSA COLABORACIÓN Y TU INVALUABLE APOYO VOLUNTARIO</strong> para lograr nuestros objetivos de forma más efectiva, y forjar <strong className="font-black">LA CADENA DE VALOR Y DE VALORES</strong> que nos liberará de nuestras limitaciones para <strong className="font-black">SER MEJORES, Y MEJORAR TAMBIÉN NUESTRO ENTORNO Y NUESTRO MUNDO</strong> !!!
              </p>
            </div>

            {/* QUIÉNES SOMOS — justo debajo de JUNTOS, resumido con "Mostrar más" */}
            <div id="quienes-somos" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="quienes-somos" titulo="Quiénes somos" texto="Conoce a DCUATES y su comunidad" />
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">✅</span> Quiénes Somos
              </span>
              <div>
                <img
                  src="/images/bibliobici-movil.webp"
                  alt="Bibliobici móvil DCUATES: la lectura que llega hasta tu colonia"
                  loading="lazy"
                  className="float-right ml-3 mb-2 w-[46%] max-w-[260px] rounded-xl object-cover shadow-lg border-2 border-white/70"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">
                  {QUIENES_SOMOS.idea}
                </p>
                <div className="grid gap-2 text-left pt-3 clear-both">
                  {QUIENES_SOMOS.objetivos.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 bg-emerald-900/40 rounded-xl px-3 py-2">
                      <span className="h-2 w-2 mt-1.5 rounded-full bg-[#00c853] flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-bold text-emerald-100 uppercase leading-snug">{obj}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/80 italic leading-relaxed pt-3">
                  {QUIENES_SOMOS.filosofia}
                </p>
                <p className="text-sm sm:text-base font-black uppercase text-white bg-[#0f2d1e]/60 border-2 border-emerald-500/40 rounded-2xl py-4 px-4 mt-3 leading-snug">
                  {QUIENES_SOMOS.colofon}
                  <span className="block mt-2 text-emerald-300 tracking-wide">{QUIENES_SOMOS.firma}</span>
                </p>
              </div>
            </div>

    </div>
  );
}
export function PNMision() {
  return (
    <div className="flex flex-col gap-4 min-w-0">
            {/* NUESTRA MISIÓN — mismo formato que Quiénes Somos, justo debajo */}
            <div className="rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">🎯</span> Nuestra Misión
              </span>
              <div>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">
                  <strong>Misión:</strong> {MISION_VISION.mision}
                </p>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium pt-2">
                  <strong>Visión:</strong> {MISION_VISION.vision}
                </p>
                <p className="text-xs sm:text-sm text-emerald-200/80 italic leading-relaxed pt-3">
                  <strong className="not-italic">Filosofía:</strong> {MISION_VISION.filosofia}
                </p>
                <p className="text-sm sm:text-base font-black uppercase text-white bg-[#0f2d1e]/60 border-2 border-emerald-500/40 rounded-2xl py-4 px-4 mt-3 leading-snug">
                  Mucha gente pequeña, en lugares pequeños, haciendo cosas pequeñas, puede cambiar el mundo (Eduardo Galeano)
                </p>
              </div>
            </div>

    </div>
  );
}
export function PNSumar() {
  return (
    <div className="flex flex-col gap-4 min-w-0">
            {/* CÓMO PODEMOS SUMAR — mismo formato, justo debajo de Misión.
                Sin truncar: el texto se ve siempre completo. */}
            <div className="rounded-2xl bg-[#17472d] text-white p-4 sm:p-5">
              <span className="flex items-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-wider text-emerald-400 mb-2">
                <span className="text-3xl sm:text-4xl">🤝</span> Cómo Podemos Sumar
              </span>
              <div>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">{COMO_SUMAR.intro}</p>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium pt-2">{COMO_SUMAR.ventajas}</p>
                <p className="text-sm sm:text-base font-bold text-emerald-100 pt-2">{COMO_SUMAR.cierre}</p>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setTimeout(() => irASeccion("donaciones"), 50)}
                  className="rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 px-6 sm:px-8 uppercase tracking-wide text-sm sm:text-lg shadow-lg transition-all hover:scale-105"
                >
                  Ir a Apoyo Voluntario 🙏
                </button>
              </div>
            </div>

    </div>
  );
}
export function PestanaNosotros() {
  return (
    <div className="flex flex-col gap-4 min-w-0">
      <PNQuienes />
      <PNMision />
      <PNSumar />
    </div>
  );
}
