import React from "react";
import { FormularioSolicitud } from "../formularios.jsx";
import { BotonesNaranjasSeccion } from "../media.jsx";
import { enlaceWhatsApp } from "../../utilidades/baserow.js";
import BotonCompartir from "../../BotonCompartir";

export function PestanaBeneficios({ setBusquedaAbierta, setModalProyecto, setShowFAQ, setSolicitudExpandida, solicitudExpandida }) {
  return (
    (
                <div className="flex flex-col gap-4 min-w-0">
                  <BotonesNaranjasSeccion modales={["cupones-promos"]} onAbrir={(id) => setModalProyecto(id)} />
<div id="solicitudes" className="relative mt-3 scroll-mt-40 sm:scroll-mt-36 rounded-2xl overflow-hidden border-4 border-[#0f2d1e]/30 shadow-lg bg-white">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="solicitudes" titulo="Registra tu solicitud" texto="Cuéntanos qué necesitas y te contactamos por WhatsApp" />
                <div className="bg-[#e65100] px-3 py-2">
                  <p className="text-white font-black uppercase text-xs sm:text-sm tracking-wide text-center">
                    📝 Registra tu Solicitud
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed text-center">
                    Cuéntanos qué necesitas con el siguiente formulario. En cuanto lo revisemos, te contactamos directo por WhatsApp para darle seguimiento.
                  </p>

                  {/* Accesos rápidos — para quien llega directo desde
                      WhatsApp sin conocer el resto de la página, un vistazo
                      rápido de qué más hay antes de llenar el formulario. */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => setModalProyecto("libros")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">📚 Libros</button>
                    <button type="button" onClick={() => setModalProyecto("ecatepets")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">🐾 Mascotas</button>
                    <button type="button" onClick={() => setModalProyecto("asesorias")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">🎓 Asesorías</button>
                    <button type="button" onClick={() => setModalProyecto("donaciones")} className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors">💚 Apoyo Voluntario</button>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="rounded-full bg-amber-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-amber-200 transition-colors"
                    >
                      🏆 Ver Logros
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFAQ(true)}
                      className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors"
                    >
                      ❓ Preguntas Frecuentes
                    </button>
                    <button
                      type="button"
                      onClick={() => setBusquedaAbierta(true)}
                      className="rounded-full bg-emerald-100 text-[#0f2d1e] text-[11px] font-black uppercase px-3 py-1.5 hover:bg-emerald-200 transition-colors"
                    >
                      🔍 Buscar
                    </button>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-100">
                    <div
                      className="overflow-hidden transition-[max-height] duration-300"
                      style={{ maxHeight: solicitudExpandida ? 2000 : 210 }}
                      onClick={() => { if (!solicitudExpandida) setSolicitudExpandida(true); }}
                      onFocus={() => setSolicitudExpandida(true)}
                    >
                      <FormularioSolicitud />
                    </div>
                    {!solicitudExpandida && (
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-white/95 via-white/70 to-transparent pb-2 pt-8">
                        <button
                          type="button"
                          onClick={() => setSolicitudExpandida(true)}
                          className="rounded-full bg-[#e65100] hover:bg-[#bf360c] text-white font-black uppercase text-[10px] sm:text-[11px] tracking-wide px-4 py-1.5 shadow-md transition-colors"
                        >
                          ✍️ Toca para completar tu registro
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500 font-medium mb-2">¿Prefieres contarnos directo?</p>
                    <a
                      href={enlaceWhatsApp("¡Hola DCUATES! Quiero registrar una solicitud de apoyo.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-[#25d366] hover:bg-[#1da851] text-white font-black uppercase text-xs px-4 py-2.5 transition-colors"
                    >
                      💬 Escríbenos por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
                </div>
              )
  );
}
