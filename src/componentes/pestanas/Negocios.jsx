import React from "react";
import { FormularioPublicidad, FormularioVentasConCausa } from "../formularios.jsx";
import { BotonNaranjaDesplegable, FlechaBlanca, PasarelaVentasConCausa } from "../media.jsx";
import BotonCompartir from "../../BotonCompartir";

export function PestanaNegocios({ compraVentaDcuates, recomendacionesCompra, recomendacionesVenta, setVentasResumenAbierto, ventasResumenAbierto }) {
  return (
    (
                <div className="flex flex-col gap-6 min-w-0 text-[#0f2d1e]">
                  <div id="ventas-con-causa" className="relative scroll-mt-48 md:scroll-mt-36">
<BotonCompartir variante="circulo" className="absolute top-2 right-2 z-10" hash="ventas-con-causa" titulo="Ventas con Causa" texto="Compra y apoya una causa de tu comunidad" />
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
            <span className="inline-block rounded-full bg-emerald-200 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-800 shadow-sm">
              🛍️ Ventas con Causa
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-[#0f2d1e] font-heading">
              Productos y servicios que también apoyan la comunidad
            </h2>
            <p className="text-sm sm:text-base text-slate-700 font-bold">
              Artículos y servicios de vecinos y negocios locales. Explora, cuéntanos qué te interesa o qué estás buscando, y te contactamos directo por WhatsApp.
            </p>
          </div>

          {/* Pasarela de Ventas con Causa — a la izquierda el carrusel, a la
              derecha el registro (como botón desplegable) y el acceso al
              catálogo/canal de WhatsApp. */}
          <div className="max-w-3xl mx-auto mb-4">
            <PasarelaVentasConCausa />
          </div>
          <div id="registro-ventas" className="max-w-3xl mx-auto mb-8 scroll-mt-48 md:scroll-mt-36">
            <BotonNaranjaDesplegable
              titulo="🛍️ Regístrate, ve el catálogo completo y descubre recomendaciones de Compra y Venta"
              abierto={ventasResumenAbierto}
              onClick={() => setVentasResumenAbierto((v) => !v)}
            >
              <div className="space-y-4">
                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-2">Si algo te gustó y deseas apartarlo o comprarlo, regístralo aquí</p>
                  <FormularioVentasConCausa />
                </div>

                <a
                  href="https://whatsapp.com/channel/0029Vb8gAjd1dAvyGu9Jmv1i"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left rounded-xl border-2 border-[#0f2d1e] bg-[#e65100] hover:bg-[#bf360c] p-3 shadow-sm transition-colors flex items-center justify-between gap-3"
                >
                  <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight">
                    Si quieres ver más productos y catálogos, da clic aquí !!!
                  </p>
                  <FlechaBlanca />
                </a>

                {/* Recomendaciones de Compra/Venta/Compra-Venta DCUATES —
                    muestran el nombre de cada liga (columna "NOMBRE ...");
                    si esa columna no existe o está vacía en una fila, se
                    numeran solas como "Recomendación 1, 2...". */}
                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-1">Recomendaciones de Compra</p>
                  {recomendacionesCompra.length === 0 && <p>Muy pronto encontrarás aquí recomendaciones de compra.</p>}
                  <ul className="space-y-1.5">
                    {recomendacionesCompra.map((r, i) => (
                      <li key={i}>
                        <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100]">
                          {r.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-1">Recomendaciones de Venta</p>
                  {recomendacionesVenta.length === 0 && <p>Muy pronto encontrarás aquí recomendaciones de venta.</p>}
                  <ul className="space-y-1.5">
                    {recomendacionesVenta.map((r, i) => (
                      <li key={i}>
                        <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100]">
                          {r.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-black uppercase text-[#0f2d1e] text-[11px] tracking-wide mb-1">Compra-Venta DCUATES</p>
                  {compraVentaDcuates.length === 0 && <p>Muy pronto encontrarás aquí más opciones de compra-venta DCUATES.</p>}
                  <ul className="space-y-1.5">
                    {compraVentaDcuates.map((r, i) => (
                      <li key={i}>
                        <a href={r.enlace} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#0f2d1e] hover:text-[#e65100]">
                          {r.nombre}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </BotonNaranjaDesplegable>
          </div>


                  </div>
                  <div id="publicidad" className="relative scroll-mt-48 md:scroll-mt-36 rounded-2xl bg-[#17472d] text-white p-4 sm:p-6">
<BotonCompartir variante="claro" className="absolute top-2 right-2 z-10" hash="publicidad" titulo="Publicidad gratuita para tu negocio" texto="Registra tu negocio y aparece en el mapa de DCUATES" />
          <div className="text-center space-y-2 mb-8">
            <span className="inline-block rounded-full bg-emerald-900/60 px-5 py-2 text-lg sm:text-2xl font-black uppercase tracking-wider text-emerald-400">
              📢 Publicidad Comunitaria
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-center uppercase tracking-tight text-emerald-300">
              Publica tu negocio gratis
            </h2>
            <p className="text-xs font-bold text-emerald-100/70 uppercase max-w-md mx-auto leading-relaxed">
              Comparte la información de tu negocio, sube imágenes de tus promociones y publicidad, y agrega tu página o redes sociales. Tu aportación voluntaria es bienvenida.
            </p>
          </div>
          <FormularioPublicidad />
        
                  </div>
                </div>
              )
  );
}
