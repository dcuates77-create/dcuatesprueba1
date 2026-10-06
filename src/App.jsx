'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Heart, Gift, HandHeart, House, MapPin, Menu, MessageCircle, Package, Search, Sparkles, Store } from 'lucide-react'

const categories = [
  { name: 'Nosotros', icon: House, color: 'bg-[#27809a]', description: 'Juntos hacemos una mejor comunidad', body: 'DCUATES impulsa proyectos, personas, organizaciones y emprendimientos que benefician a las familias. Suma con tu colaboración, comparte tu talento y hagamos crecer la cadena de valor y de valores.', image: '/dcuates-community.png' },
  { name: 'Beneficios', icon: Gift, color: 'bg-[#ee7d19]', description: 'Beneficios que llegan a todos', body: 'Conecta con oportunidades, recursos y personas que desean aportar a tu bienestar y al de tu comunidad.' },
  { name: 'Causas', icon: Heart, color: 'bg-[#e64c54]', description: 'Apoyamos lo que importa', body: 'Cada causa encuentra aliados para convertir buenas intenciones en acciones que transforman vidas.' },
  { name: 'Negocios', icon: Store, color: 'bg-[#38a267]', description: 'Impulsa lo local', body: 'Descubre negocios que comparten, colaboran y generan valor para sus clientes y vecinos.' },
  { name: 'Valores', icon: Sparkles, color: 'bg-[#7b5bd6]', description: 'La forma en que sumamos', body: 'Solidaridad, confianza y reciprocidad guían cada conexión dentro de nuestra comunidad.' },
  { name: 'Regalos', icon: Package, color: 'bg-[#d63e7a]', description: 'Dar también es celebrar', body: 'Comparte un detalle, una oportunidad o un recurso con quien más lo necesita.' },
  { name: 'Gratitud', icon: HandHeart, color: 'bg-[#b27a1b]', description: 'Reconocemos tu apoyo', body: 'Celebramos a las personas que hacen posible que más ayuda siga circulando.' },
]

const impact = [
  ['2,000+', 'Recomendaciones'],
  ['1,000+', 'Libros prestados'],
  ['500+', 'Donaciones'],
  ['200+', 'Libros físicos'],
]

export default function Page() {
  const [active, setActive] = useState(0)
  const category = categories[active]
  const Icon = category.icon

  return (
    <main className="min-h-screen bg-[#eff8f5] text-[#17372d] pb-24">
      <header className="bg-[#f8fbf9] border-b border-[#dbeae3]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="DCUATES inicio">
            <div className="grid size-12 place-items-center rounded-full bg-[#f5c51e] text-[#0c3828] shadow-sm ring-4 ring-[#e7f0e9]">
              <span className="text-2xl font-black">D</span>
            </div>
            <div className="leading-none"><div className="text-2xl font-black tracking-tight text-[#0c3828]">DCUATES</div><div className="mt-1 text-[10px] font-black tracking-[0.16em] text-[#e0691e]">¡COMPARTE Y GANA!</div></div>
          </a>
          <div className="flex items-center gap-2"><div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#487365]" /><Input aria-label="Buscar en DCUATES" placeholder="Buscar en DCUATES" className="w-56 rounded-full border-[#cfe2d9] bg-white pl-10" /></div><Button variant="outline" size="icon" className="rounded-full border-[#cfe2d9] md:hidden" aria-label="Buscar"><Search /></Button><Button variant="outline" size="icon" className="rounded-full border-[#cfe2d9]" aria-label="Abrir menú"><Menu /></Button></div>
        </div>
        <div className="border-y border-[#1c5440] bg-[#0c3828] text-white"><div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 text-center text-sm font-semibold sm:px-6 lg:px-8"><span className="text-[#f5c51e]">♥</span><span>¡Comparte tu talento, tiempo o recursos — cada aportación suma!</span></div></div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white bg-white/90 p-3 shadow-[0_18px_50px_rgba(16,74,53,0.08)] sm:p-5">
          <div role="tablist" aria-label="Explora DCUATES" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {categories.map((item, index) => { const ItemIcon = item.icon; return <button key={item.name} role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`group flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl px-2 py-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27809a] sm:min-h-28 sm:text-sm ${active === index ? `${item.color} text-white shadow-md` : 'bg-[#f4f7f7] text-[#233832] hover:bg-[#e8f2ee]'}`}><span className={`grid size-10 place-items-center rounded-full ${active === index ? 'bg-white/20' : item.color} text-white`}><ItemIcon /></span><span>{item.name}</span></button> })}
          </div>
          <div className="mt-3 flex items-center gap-3 px-1"><div className="h-1.5 flex-1 rounded-full bg-[#e4ece9]"><div className="h-full rounded-full bg-[#27809a] transition-all" style={{ width: `${((active + 1) / categories.length) * 100}%` }} /></div><span className="text-xs font-bold text-[#547266]">{active + 1} / {categories.length}</span></div>

          <div role="tabpanel" aria-label={category.name} className="mt-6 grid gap-6 rounded-3xl bg-[#e4f4f7] p-5 sm:p-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div><Badge className="mb-4 rounded-full bg-[#27809a] px-3 py-1 text-white hover:bg-[#27809a]"><Icon data-icon="inline-start" /> {category.name}</Badge><h1 className="max-w-xl text-3xl font-black tracking-tight text-[#145d70] sm:text-5xl">{category.description} <span className="text-[#f5c51e]">★</span></h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#365a5d] sm:text-lg">{category.body}</p><Button className="mt-6 rounded-full bg-[#0c3828] px-6 text-white hover:bg-[#18513c]">Conoce más <span aria-hidden="true">→</span></Button></div>
            <div className="overflow-hidden rounded-[26px] border-8 border-white bg-white shadow-sm">{category.image ? <img src={category.image} alt="Personas de la comunidad compartiendo libros y apoyo" className="aspect-[4/3] w-full object-cover" /> : <div className={`grid aspect-[4/3] place-items-center ${category.color} text-white`}><Icon className="size-24 opacity-80" aria-hidden="true" /></div>}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8"><div className="rounded-[28px] bg-[#0c3828] p-5 text-white shadow-[0_18px_50px_rgba(16,74,53,0.12)] sm:p-8"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f5c51e]">Nuestro impacto</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Lo que logramos juntos</h2></div><MapPin className="text-[#8dd5bd]" aria-hidden="true" /></div><div className="grid grid-cols-2 gap-3 sm:gap-5">{impact.map(([number, label]) => <Card key={label} className="border-[#245b47] bg-[#164c39] text-white"><CardContent className="p-4 sm:p-6"><div className="text-3xl font-black tracking-tight text-[#f5c51e] sm:text-4xl">{number}</div><div className="mt-2 text-sm font-semibold text-[#f5f7e9] sm:text-base">{label}</div></CardContent></Card>)}</div></div></section>

      <div className="fixed bottom-5 right-4 z-20 flex flex-col items-end gap-3 sm:right-8"><Button className="h-12 rounded-full bg-[#f5c51e] px-5 font-black text-[#17372d] shadow-lg hover:bg-[#e6b900]" aria-label="¿Qué necesitas hoy?"><span className="mr-2 grid size-6 place-items-center rounded-full bg-[#17372d] text-sm text-white">?</span>¿Qué necesitas hoy?</Button><Button size="icon" className="size-14 rounded-full bg-[#25d366] text-white shadow-lg hover:bg-[#1db954]" aria-label="Contactar por WhatsApp"><MessageCircle className="size-7" /></Button></div>
    </main>
  )
}
