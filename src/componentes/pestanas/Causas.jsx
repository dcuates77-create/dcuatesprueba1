import React from "react";
import { BotonNaranjaDesplegable, FlechaBlanca, PasarelaExtraviados } from "../media.jsx";
import { YOUTUBE_VIDEO_ID } from "../../datos/config.js";
import { enlaceWhatsApp } from "../../utilidades/baserow.js";
import BotonCompartir from "../../BotonCompartir";

export function PestanaCausas({ apoyoCausaAnimalLinks, apoyoCosasCasosLinks, apoyoPersonasExtraviadasLinks, extraviadosResumenAbierto, setExtraviadosResumenAbierto }) {
  return (
    (
              <>
              <div id="donaciones" className="relative scroll-mt-48 md:scroll-mt-36 flex flex-col gap-y-6 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6 lg:items-start text-[#0f2d1e]">
<BotonCompartir variante="circulo" className="absolute top-2 right-2 z-10" hash="donaciones" titulo="Apoyo Voluntario" texto="Tu tiempo, tu talento o tus recursos cambian vidas" />
                <div className="lg:order-1 min-w-0">
{/* Bloque 1: intro + CTA — fila 1 en escritorio (col. izquierda) */}
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🟢 Apoyo Voluntario
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              TU APORTACIÓN IMPULSA A LA COMUNIDAD
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed text-justify font-bold">
              Cada donativo, del formato que decidas, nos ayuda a sostener y hacer crecer los proyectos que benefician a los negocios y familias latinas en conjunto con DCUATES Y CONEXIONES CON CAUSA ♥
            </p>
            <p className="text-lg sm:text-xl font-black uppercase text-center text-white bg-[#e65100] border-4 border-[#0f2d1e] rounded-2xl py-4 px-5 shadow-md leading-snug">
              ¡Tu apoyo hoy es el cambio que nuestra comunidad necesita — súmate ahora! ♥
            </p>
          </div>

                          </div>
                <div className="lg:order-3 min-w-0">
{/* Bloque 3: transparencia — fila 2 en escritorio (col. izquierda), justo antes del video en móvil */}
          <div>
            <div className="h-full rounded-2xl bg-emerald-200 border-2 border-emerald-500/40 p-5 sm:p-6 text-base sm:text-lg font-black text-emerald-900 leading-relaxed flex items-start gap-3 shadow-sm">
              <span className="text-2xl">💡</span>
              <p className="text-justify uppercase tracking-wide">
                Rendimos cuentas de cómo se usa cada aportación con total transparencia. Parte de la utilidad de nuestros proyectos y de lo que los amigos y la comunidad suman se destina al apoyo de causas sociales como esta gran causa y ejemplo de vida y de lo que se puede lograr con la suma de voluntades, talentos y corazones solidarios ♥
              </p>
            </div>
          </div>

                          </div>
                <div className="lg:order-4 min-w-0">
{/* Bloque 4: flecha + video de Chuy — fila 2 en escritorio (col. derecha), justo después de la transparencia en móvil.
              col-start-6 (en vez de 7) para que la flecha quede pegada al cuadro de transparencia, sin columna vacía de por medio;
              col-span-7 (en vez de 6) le da más ancho al video, y por lo tanto también más alto. */}
          <div id="chuy-video" className="scroll-mt-48 flex flex-col  items-center gap-2 ">
            {/* Flecha con relleno naranja: apunta hacia abajo en móvil y hacia la derecha en escritorio */}
            <div className="flex justify-center items-center shrink-0" aria-hidden="true">
              <svg
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                className="w-14 h-24 sm:w-16 sm:h-28 rotate-90  drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 22 H58 V4 L96 30 L58 56 V38 H4 Z"
                  fill="#e65100"
                  stroke="#0f2d1e"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="w-full relative">
              <BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="chuy-video" titulo="Video de Chuy, el Sapo Soñador" texto="Conoce la vida y obra de nuestro amigo y maestro de vida" />
              <div className="rounded-2xl overflow-hidden border-4 border-[#0f2d1e] shadow-lg bg-black aspect-[4/3] sm:aspect-[16/10]">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
                  title="Video de Chuy — DCUATES"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <a
                href="https://chuytrujillo.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block cursor-pointer rounded-2xl border-4 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-sm sm:text-base px-4 py-3.5 shadow-md transition-all hover:scale-[1.01] text-justify leading-snug"
              >
                Conoce la vida y obra de nuestro amigo y maestro de vida, Chuy, el Sapo Soñador aquí: https://chuytrujillo.blogspot.com/
              </a>
            </div>
          </div>

                          </div>
                <div className="lg:order-2 min-w-0">
{/* Bloque 2: selecciona tu tipo de aportación + botones — fila 1 en escritorio (col. derecha) */}
          <div className="space-y-3">
            <p className="text-xl sm:text-2xl font-black uppercase tracking-wide text-[#0f2d1e] mb-4 block leading-tight">
              Selecciona el tipo de aportación que te agrade más:
            </p>
            {[
              { t: "Aportación Económica", d: "Solicita los datos bancarios de manera directa y segura.", m: "¡Hola DCUATES! Deseo realizar una Aportación Económica. ¿Me podrías proporcionar los datos seguros?" },
              { t: "Aportación en Especie", d: "Apoya donando herramientas, materiales o insumos útiles.", m: "¡Hola DCUATES! Quiero realizar una Aportación en Especie. ¿Qué tipo de herramientas o insumos se requieren actualmente?" },
              { t: "Trueque Solidario", d: "Intercambia productos o servicios de valor equivalente.", m: "¡Hola DCUATES! Me interesa el Trueque Solidario. Tengo productos/servicios para intercambiar a favor de la causa." },
              { t: "Labor Voluntaria", d: "Dona tu valioso tiempo y conocimientos para crecer juntos.", m: "¡Hola DCUATES! Quiero sumarme con Labor Voluntaria aportando mi tiempo y conocimientos comunitarios." }
            ].map((opc) => (
              <a
                key={opc.t}
                href={enlaceWhatsApp(opc.m)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left rounded-2xl border-4 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-4 sm:p-5 shadow-md transition-all hover:scale-[1.01] group duration-200 block"
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">{opc.t}</p>
                    <p className="text-sm sm:text-base font-bold text-[#0f2d1e] uppercase tracking-wide leading-snug pt-1">{opc.d}</p>
                  </div>
                  <svg
                    viewBox="0 0 100 60"
                    preserveAspectRatio="none"
                    className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 opacity-90 group-hover:opacity-100 transition-all drop-shadow"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 22 H58 V4 L96 30 L58 56 V38 H4 Z" fill="#ffffff" stroke="#0f2d1e" strokeWidth="6" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

                </div>
              </div>
              <div className="mt-8 text-[#0f2d1e]">
          {/* Pasarela de mascotas, personas y cosas extraviadas */}
          <div id="extraviados-registro" className="relative scroll-mt-48 md:scroll-mt-36 mt-8 max-w-5xl mx-auto">
<BotonCompartir variante="circulo" className="absolute top-2 right-2 z-10" hash="extraviados-registro" titulo="Mascotas, personas y cosas extraviadas" texto="Ayúdanos a difundir y a encontrar" />
            <div className="text-center mb-6 space-y-2">
              <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-base sm:text-xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
                🔎 Mascotas, Personas y Cosas Extraviadas
              </span>
              <p className="text-sm sm:text-base text-slate-700 font-bold max-w-xl mx-auto">
                Ayuda a la comunidad reconociendo estos casos, o repórtanos uno nuevo.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <PasarelaExtraviados />
            </div>
            <div id="registro-extraviados" className="max-w-3xl mx-auto mt-4 scroll-mt-48 md:scroll-mt-36">
              <BotonNaranjaDesplegable
                titulo="🔎 Reporta un caso, ve más casos y consulta apoyos para mascotas, personas y objetos"
                abierto={extraviadosResumenAbierto}
                onClick={() => setExtraviadosResumenAbierto((v) => !v)}
              >
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    💡 Antes de reportar, revisa el carrusel de arriba — si tu caso ya aparece, evitamos duplicados y llegamos más rápido a quien lo necesita.
                  </p>
                  <a
                    href="https://whatsapp.com/channel/0029Vb6OjCQGk1FkkmvSzP3S"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
                  >
                    <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
                      Ver Más Casos e Información de Valor
                    </p>
                    <FlechaBlanca />
                  </a>
                  <a
                    href={enlaceWhatsApp("¡Hola DCUATES! Quiero reportar un caso de mascota, persona o cosa extraviada.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
                  >
                    <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
                      Reportar un Caso por WhatsApp
                    </p>
                    <FlechaBlanca />
                  </a>

                  {/* Apoyo a Causa Animal / Personas Extraviadas / Cosas y Casos. */}
                  <div>
                    <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">🐾 Apoyo a Causa Animal — la prevención es la mejor ayuda</p>
                    <ul className="list-disc pl-4 space-y-1 mt-1">
                      <li>Esteriliza a tu mascota: es la forma más efectiva de evitar camadas no deseadas y abandono.</li>
                      <li>Coloca collar con placa o microchip, por si se extravía.</li>
                      <li>Vacunas y desparasitación al día — previenen enfermedades que también afectan a otros animales.</li>
                      <li>Si ves un animal en la calle, no lo alimentes con lo que comemos nosotros; ofrece agua y contacta a un refugio o veterinario cercano.</li>
                      <li>Adoptar, en vez de comprar, ayuda a que menos animales terminen en situación de calle.</li>
                    </ul>
                    <p className="pt-2 font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">Más Información de Apoyo</p>
                    {apoyoCausaAnimalLinks.length === 0 && <p>Muy pronto encontrarás aquí más recursos de apoyo a causa animal.</p>}
                    <ul className="space-y-1.5">
                      {apoyoCausaAnimalLinks.map((enlace, i) => (
                        <li key={i}>
                          <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100] break-words">
                            Apoyo {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">🧑‍🤝‍🧑 Apoyo a Personas Extraviadas</p>
                    <p>Recursos, protocolos y contactos de apoyo para casos de personas extraviadas.</p>
                    {apoyoPersonasExtraviadasLinks.length === 0 && <p>Muy pronto encontrarás aquí más recursos de apoyo.</p>}
                    <ul className="space-y-1.5">
                      {apoyoPersonasExtraviadasLinks.map((enlace, i) => (
                        <li key={i}>
                          <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100] break-words">
                            Apoyo {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide">📦 Apoyo Cosas y Casos</p>
                    <p>Recursos de apoyo para objetos extraviados y otros casos de la comunidad.</p>
                    {apoyoCosasCasosLinks.length === 0 && <p>Muy pronto encontrarás aquí más recursos de apoyo.</p>}
                    <ul className="space-y-1.5">
                      {apoyoCosasCasosLinks.map((enlace, i) => (
                        <li key={i}>
                          <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100] break-words">
                            Apoyo {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </BotonNaranjaDesplegable>
            </div>
          </div>
        
              </div>
              </>
              )
  );
}
