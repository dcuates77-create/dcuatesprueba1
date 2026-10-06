'use client'

import React, { useState } from 'react'

// Iconos simulados sencillos para evitar errores de librerías faltantes
const Icons = {
  House: () => <span>🏠</span>,
  Gift: () => <span>🎁</span>,
  Heart: () => <span>❤️</span>,
  Store: () => <span>🏪</span>,
  Sparkles: () => <span>✨</span>,
  Package: () => <span>📦</span>,
  HandHeart: () => <span>🤝</span>,
}

const categories = [
  { name: 'Nosotros', icon: <Icons.House />, color: 'bg-[#27809a]', description: 'Juntos hacemos una mejor comunidad', body: 'DCUATES impulsa proyectos, personas, organizaciones y emprendimientos que benefician a las familias. Suma con tu colaboración, comparte tu talento y hagamos crecer la cadena de valor y de valores.' },
  { name: 'Beneficios', icon: <Icons.Gift />, color: 'bg-[#ee7d19]', description: 'Beneficios que llegan a todos', body: 'Conecta con oportunidades, recursos y personas que desean aportar. Encuentra alianzas estratégicas para hacer crecer tu impacto.' },
  { name: 'Causas', icon: <Icons.Heart />, color: 'bg-[#e64c54]', description: 'Apoyamos lo que importa', body: 'Cada causa encuentra aliados para convertir buenas intenciones en acciones reales. Encuentra el apoyo que necesitas.' },
  { name: 'Negocios', icon: <Icons.Store />, color: 'bg-[#38a267]', description: 'Impulsa lo local', body: 'Descubre negocios que comparten, colaboran y generan valor para sus clientes y su entorno.' },
  { name: 'Valores', icon: <Icons.Sparkles />, color: 'bg-[#7b5bd6]', description: 'La forma en que sumamos', body: 'Solidaridad, confianza y reciprocidad guían cada conexión dentro de nuestra comunidad.' },
  { name: 'Regalos', icon: <Icons.Package />, color: 'bg-[#d63e7a]', description: 'Dar también es celebrar', body: 'Comparte un detalle, una oportunidad o un recurso con quien más lo necesita.' },
  { name: 'Gratitud', icon: <Icons.HandHeart />, color: 'bg-[#b27a1b]', description: 'Reconocemos tu apoyo', body: 'Celebramos a las personas que hacen posible que más ayuda siga circulando.' }
]

const impact = [
  ['2,000+', 'Recomendaciones'],
  ['1,000+', 'Libros prestados'],
  ['500+', 'Donaciones'],
  ['200+', 'Libros físicos']
]

export default function App() {
  const [active, setActive] = useState(0)
  const currentCategory = categories[active]

  return (
    <main className="min-h-screen bg-[#eff8f5] text-[#17372d] pb-24 font-sans">
      {/* Cabecera / Hero */}
      <header className="bg-[#17372d] text-white text-center py-3 text-xs sm:text-sm font-medium px-4 shadow-sm">
        ✨ ¡Comparte tu talento, tiempo o recursos — cada aportación suma!
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Identidad */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-emerald-100/50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-[#17372d] font-black px-3 py-1.5 rounded-xl text-lg shadow-sm tracking-wider">
              D
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-[#17372d] m-0 leading-none">DCUATES</h1>
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">¡Comparte y Gana!</span>
            </div>
          </div>
          <div className="relative flex-1 max-w-[160px] ml-4">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-emerald-50/50 border border-emerald-100 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#27809a]"
            />
          </div>
        </div>

        {/* Carrusel / Tabs de Categorías */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none snap-x mask-linear">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={`flex flex-col items-center justify-center min-w-[72px] h-20 rounded-2xl transition-all duration-300 snap-center shadow-sm ${
                active === idx 
                  ? `\${cat.color} text-white scale-105 ring-2 ring-offset-2 ring-emerald-600` 
                  : 'bg-white text-slate-600 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-xl mb-1">{cat.icon}</div>
              <span className="text-[10px] font-bold tracking-tight">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Contenido Central Dinámico */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-emerald-100/30 mb-6 transition-all duration-300">
          <span className={`inline-block text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 ${currentCategory.color}`}>
            {currentCategory.name}
          </span>
          <h2 className="text-2xl font-black text-[#17372d] mb-2 leading-tight">
            {currentCategory.description}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {currentCategory.body}
          </p>
          
          <div className="rounded-2xl overflow-hidden shadow-sm border border-emerald-100">
            <img 
              src="https://unsplash.com" 
              alt="Comunidad" 
              className="w-full h-44 object-cover"
            />
          </div>
        </div>

        {/* Bloque de Impacto */}
        <div className="bg-[#17372d] text-white rounded-3xl p-6 shadow-lg mb-8">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block mb-1">Nuestro Impacto</span>
          <h3 className="text-xl font-black mb-6">Lo que logramos juntos</h3>
          <div className="grid grid-cols-2 gap-4">
            {impact.map((item, idx) => (
              <div key={idx} className="bg-emerald-900/30 p-4 rounded-2xl border border-emerald-800/30">
                <div className="text-2xl font-black text-amber-400 mb-0.5">{item[0]}</div>
                <div className="text-xs text-emerald-100/90 font-medium">{item[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones Flotantes Permanentes (UX Limpio) */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-2.5 z-50">
        <button className="bg-amber-400 text-[#17372d] font-bold text-xs py-2 px-4 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5 hover:scale-105 transition-transform">
          ❓ ¿Qué necesitas hoy?
        </button>
        <button className="bg-[#25D366] text-white p-3 rounded-full shadow-lg flex items-center justify-center self-end hover:scale-110 transition-transform">
          💬
        </button>
      </div>
    </main>
  )
}
