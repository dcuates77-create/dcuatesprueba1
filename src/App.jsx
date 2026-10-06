'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Flame,
  Heart,
  Inbox,
  Lightbulb,
  Menu,
  MoreHorizontal,
  Plus,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  Wind,
  X,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

// 1. Ajuste Sistémico de 6 Pestañas Unificadas
const navItems = [
  { id: 'focus', label: 'Enfoque', icon: Target },
  { id: 'agenda', label: 'Agenda', icon: CalendarDays },
  { id: 'finance', label: 'Finanzas y Hábitos', icon: CircleDollarSign },
  { id: 'wellbeing', label: 'Bienestar (Diarios)', icon: Heart },
  { id: 'extras', label: 'Desconexión y Ocio', icon: BookOpen },
  { id: 'control', label: 'Control', icon: Settings2 },
]

// 2. Personalización de tus Prioridades Reales de la Semana
const initialTasks = [
  { title: 'Terminar y lanzar página DCUATES', tag: 'A) Lanzamiento Crítico', done: false },
  { title: 'Diseño de invitaciones y contenidos de atención y captación de usuarios', tag: 'B) Estrategia de Primer Orden', done: false },
  { title: 'Armar estrategias de seguimiento, control y mejora', tag: 'C) Gestión Sistémica', done: false },
  { title: 'Organizar y adaptar cuestiones personales para generar una agenda equilibrada', tag: 'D) Estilo de Vida', done: false },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState('focus')
  const [energy, setEnergy] = useState('Alta')
  const [taskState, setTaskState] = useState(initialTasks)
  const [inboxOpen, setInboxOpen] = useState(false)
  const [breathing, setBreathing] = useState(false)
  const [breathSeconds, setBreathSeconds] = useState(60)

  const today = useMemo(() => new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()), [])

  const toggleTask = (index: number) => {
    setTaskState((current) => current.map((task, taskIndex) => taskIndex === index ? { ...task, done: !task.done } : task))
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#17221d] selection:bg-[#d6e8dd]">
      <div className="mx-auto flex min-h-screen max-w-[1500px]">
        {/* Barra lateral escritorio */}
        <aside className="hidden w-[230px] shrink-0 flex-col border-r border-[#e3e9e4] bg-[#f7f8f6] px-5 py-7 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="grid size-9 place-items-center rounded-xl bg-[#143d31] text-white shadow-sm"><Sparkles className="size-4" /></div>
            <div><p className="text-sm font-black tracking-tight">ZAREM</p><p className="text-[10px] uppercase tracking-[0.18em] text-[#7d8b83]">Personal OS</p></div>
          </div>
          <nav className="mt-12 flex flex-col gap-1" aria-label="Navegación principal">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = activeTab === item.id
              return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active ? 'bg-white font-semibold text-[#143d31] shadow-[0_2px_12px_rgba(30,60,42,0.06)]' : 'text-[#718078] hover:bg-white/70 hover:text-[#143d31]'}`}><Icon className="size-[17px]" /><span>{item.label}</span>{active && <span className="ml-auto size-1.5 rounded-full bg-[#e18d55]" />}</button>
            })}
          </nav>
          <div className="mt-auto rounded-2xl bg-[#e8f0e9] p-4"><Wind className="size-5 text-[#3f7c63]" /><p className="mt-3 text-xs font-semibold text-[#28513f]">Un día a la vez.</p><p className="mt-1 text-[11px] leading-relaxed text-[#668273]">Tu claridad es un espacio que se construye de forma integral.</p></div>
        </aside>

        {/* Contenido Principal */}
        <section className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-7 lg:px-12 lg:pb-10 lg:pt-10">
          <header className="flex items-start justify-between gap-4">
            <div><div className="flex items-center gap-2 text-xs font-medium capitalize text-[#8a958e]"><span>{today}</span><span className="size-1 rounded-full bg-[#e18d55]" /><span>Buenos días</span></div><h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#173228] sm:text-3xl">Hola, Alex <span className="text-[#e18d55]">.</span></h1><p className="mt-1 text-sm text-[#7d8b83]">Espacio integral para lo que importa hoy en ZAREM.</p></div>
            <div className="flex items-center gap-2"><button className="hidden size-10 place-items-center rounded-xl border border-[#e2e8e2] bg-white text-[#7d8b83] hover:text-[#143d31] sm:grid" aria-label="Abrir menú"><Menu className="size-4" /></button><div className="grid size-10 place-items-center rounded-xl bg-[#dfebe2] text-sm font-bold text-[#3c6e56]">AS</div></div>
          </header>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-[#dce8de] bg-[#eaf3ec] p-5 sm:p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><Flame className="size-4 fill-[#e18d55] text-[#e18d55]" /><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#63806d]">Racha de hábitos</span></div><p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#214b39]">12 días <span className="text-sm font-medium tracking-normal text-[#6b8777]">en movimiento</span></p></div><div className="flex gap-2">{days.map((day, i) => <div key={day} className="flex flex-col items-center gap-1.5"><span className={`grid size-7 place-items-center rounded-full text-[10px] font-bold ${i < 5 ? 'bg-[#3f7c63] text-white' : 'border border-[#bdd4c3] text-[#71917e]'}`}>{i < 5 ? <Check className="size-3" /> : day}</span><span className="text-[9px] text-[#789283]">{day}</span></div>)}</div></div></div>
            <div className="rounded-2xl border border-[#e3e9e4] bg-white p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Zap className="size-4 text-[#e18d55]" /><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#829087]">Tu energía (Sistémica)</span></div><span className="text-[10px] text-[#a0aaa4]">Hoy</span></div><div className="mt-4 flex gap-1.5">{['Alta', 'Media', 'Baja'].map((level) => <button key={level} onClick={() => setEnergy(level)} className={`flex-1 rounded-lg py-2 text-[11px] font-semibold transition ${energy === level ? 'bg-[#173f32] text-white' : 'bg-[#f4f6f3] text-[#8b978f] hover:bg-[#eaf0eb]'}`}>{level}</button>)}</div></div>
          </div>

          <div className="mt-8 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9aa39d]">Vista de hoy</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">{navItems.find((item) => item.id === activeTab)?.label}</h2></div><button className="flex items-center gap-1 text-xs font-semibold text-[#527964] hover:text-[#173f32]">Personalizar <MoreHorizontal className="size-4" /></button></div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            {/* Lista de tus 4 prioridades */}
            <section className="rounded-2xl border border-[#e3e9e4] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Prioridades del día</h3><p className="mt-1 text-xs text-[#89958d]">Pequeños pasos, grandes avances.</p></div><span className="rounded-full bg-[#f2f6f2] px-2.5 py-1 text-[10px] font-bold text-[#648171]">{taskState.filter((task) => task.done).length}/{taskState.length} LISTAS</span></div><div className="mt-6 flex flex-col gap-3">{taskState.map((task, index) => <div key={task.title} className={`group flex items-center gap-3 rounded-xl border p-3 transition ${task.done ? 'border-transparent bg-[#f7faf7]' : 'border-[#edf0ed]'}`}><button onClick={() => toggleTask(index)} className={`grid size-5 shrink-0 place-items-center rounded-md border transition ${task.done ? 'border-[#3f7c63] bg-[#3f7c63] text-white' : 'border-[#cbd7ce] text-transparent hover:border-[#3f7c63]'}`} aria-label={`Marcar ${task.title}`}><Check className="size-3" /></button><div className="min-w-0 flex-1"><p className={`text-sm font-medium ${task.done ? 'text-[#99a69d] line-through' : 'text-[#293a31]'}`}>{task.title}</p><p className="mt-1 text-[10px] text-[#98a49c]">{task.tag}</p></div><ChevronRight className="size-4 text-[#c2ccc5] transition group-hover:translate-x-0.5" /></div>)}</div><button className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#5d836d]"><Plus className="size-4" />Añadir prioridad</button></section>

            <section className="rounded-2xl bg-[#173f32] p-5 text-white sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#99bcaa]">Próximo Bloque</p><h3 className="mt-2 text-lg font-semibold">Revisión de DCUATES</h3></div><span className="grid size-9 place-items-center rounded-xl bg-white/10"><Clock3 className="size-4 text-[#c0deca]" /></span></div><div className="mt-7 flex items-end justify-between"><div><p className="text-3xl font-semibold tracking-[-0.06em]">18:00</p><p className="mt-1 text-xs text-[#a9c7b5]">Estrategia y Captación</p></div><button className="grid size-9 place-items-center rounded-full bg-[#dcecdf] text-[#173f32] hover:bg-white" aria-label="Abrir calendario"><ArrowUpRight className="size-4" /></button></div><div className="mt-6 h-1 rounded-full bg-white/15"><div className="h-full w-[45%] rounded-full bg-[#e4a276]" /></div><p className="mt-2 text-[10px] text-[#9ebbad]">Planificado en Agenda</p></section>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3"><MiniCard icon={<TrendingUp className="size-4" />} label="Balance Finanzas" value="Hojas listas" note="Monitoreo desde Google Sheets" accent="green" /><MiniCard icon={<Heart className="size-4" />} label="Diarios Activos" value="Bienestar" note="Gratitud, Vida y Abundancia" accent="orange" /><MiniCard icon={<Lightbulb className="size-4" />} label="Ideas y Proyectos" value="Enfoque" note="Banco de ideas centralizado" accent="blue" /></div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><section className="rounded-2xl border border-[#e3e9e4] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9aa39d]">Proyectos en Curso</p><h3 className="mt-1 font-semibold">Lanzamientos</h3></div><button className="text-xs font-semibold text-[#5d836d]">Ver tablero</button></div><div className="mt-5 flex flex-col gap-4"><ProjectRow title="Lanzar página DCUATES" progress={85} color="bg-[#3f7c63]" meta="Estrategia A" /><ProjectRow title="Contenidos de Captación" progress={40} color="bg-[#e18d55]" meta="Estrategia B" /><ProjectRow title="Agenda Equilibrada" progress={60} color="bg-[#7795a5]" meta="Emanación Personal" /></div></section><section className="rounded-2xl border border-[#e3e9e4] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9aa39d]">Una pausa consciente</p><h3 className="mt-1 font-semibold">¿Cómo estás llegando?</h3></div><Sparkles className="size-4 text-[#e18d55]" /></div><p className="mt-5 text-sm leading-relaxed text-[#6f7e75]">Antes de continuar, toma un momento para notar tu nivel de enfoque y energía actual en ZAREM.</p><button onClick={() => { setBreathing(true); setBreathSeconds(60) }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0f5f0] py-3 text-xs font-bold text-[#427259] transition hover:bg-[#e3eee5]"><Wind className="size-4" />Pausa de Respiración · 1 min</button></section></div>
        </section>
      </div>

      {/* Menú inferior móvil */}
      <nav className="fixed inset-x-3 bottom-3 z-20 flex justify-around rounded-2xl border border-[#e0e8e1] bg-white/95 p-2 shadow-[0_8px_30px_rgba(31,62,43,0.12)] backdrop-blur lg:hidden" aria-label="Navegación móvil">{navItems.map((item) => { const Icon = item.icon; const active = activeTab === item.id; return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-semibold ${active ? 'bg-[#e9f2ea] text-[#28553f]' : 'text-[#94a099]'}`}><Icon className="size-4" /><span className="truncate">{item.label}</span></button> })}</nav>

      {/* Botón flotante de Captura Rápida (Inbox) */}
      <button onClick={() => setInboxOpen(true)} className="fixed bottom-24 right-5 z-30 grid size-14 place-items-center rounded-full bg-[#e18d55] text-white shadow-[0_8px_22px_rgba(185,105,58,0.32)] transition hover:scale-105 hover:bg-[#d37d48] lg:bottom-8 lg:right-8" aria-label="Abrir captura rápida"><Inbox className="size-5" /></button>

      {/* Formulario Desplegable Universal para Google Sheets */}
      {inboxOpen && <div className="fixed inset-0 z-40 flex items-end justify-end bg-[#173f32]/15 p-4 backdrop-blur-[2px] sm:items-center sm:p-8"><div className="w-full max-w-md rounded-3xl border border-[#dfe8e0] bg-[#fbfcfa] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#e18d55]">Captura Rápida Universitaria</p><h2 className="mt-2 text-xl font-semibold">Saca algo de tu cabeza en 3s.</h2></div><button onClick={() => setInboxOpen(false)} className="grid size-8 place-items-center rounded-full bg-[#f0f3f0] text-[#819087]" aria-label="Cerrar captura"><X className="size-4" /></button></div><div className="mt-6 flex flex-col gap-3"><input type="text" placeholder="Concepto o Tarea..." className="rounded-xl border border-[#e0e7e1] bg-white px-4 py-3 text-sm outline-none ring-[#a8cbb1] placeholder:text-[#a8b2ac] focus:ring-2" /><textarea placeholder="Detalle, monto $, ideas o contexto libre..." rows={3} className="resize-none rounded-xl border border-[#e0e7e1] bg-white px-4 py-3 text-sm outline-none ring-[#a8cbb1] placeholder:text-[#a8b2ac] focus:ring-2" /><select className="rounded-xl border border-[#e0e7e1] bg-white px-4 py-3 text-sm text-[#607069] outline-none"><option>Destino: 🎯 Enfoque y Tareas</option><option>Destino: 📅 Agenda Unificada</option><option>Destino: 💸 Finanzas y Gastos</option><option>Destino: 🌿 Bienestar y Diarios</option><option>Destino: ☕ Desconexión y Notas</option></select></div><Button onClick={() => setInboxOpen(false)} className="mt-5 w-full rounded-xl bg-[#173f32] py-5 text-sm hover:bg-[#28553f]">Guardar en mi Hoja de Cálculo <ArrowUpRight data-icon="inline-end" /></Button><p className="mt-3 text-center text-[10px] text-[#9aa59e]">Los datos se enviarán de forma sistémica a Google Sheets</p></div></div>}

      {/* Temporizador de Pausa Consciente */}
      {breathing && <div className="fixed inset-0 z-50 grid place-items-center bg-[#143d31]/75 p-6 backdrop-blur-sm"><div className="w-full max-w-sm rounded-3xl bg-[#f6faf5] p-7 text-center"><button onClick={() => setBreathing(false)} className="ml-auto grid size-8 place-items-center rounded-full bg-[#e7efe8] text-[#74907d]" aria-label="Cerrar pausa"><X className="size-4" /></button><div className="mx-auto mt-4 grid size-36 place-items-center rounded-full border border-[#b8d5be] bg-[#dfefe1] text-[#376b50] shadow-[0_0_0_18px_rgba(223,239,225,0.45)]"><div><Wind className="mx-auto size-7" /><p className="mt-2 text-2xl font-semibold">{breathSeconds}s</p></div></div><h2 className="mt-8 text-xl font-semibold">Respira con calma</h2><p className="mt-2 text-sm text-[#7c8d82]">Inhala suavemente. Exhala más lento.</p><button onClick={() => { setBreathing(false); setBreathSeconds(60) }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173f32] py-3 text-sm font-semibold text-white"><Check className="size-4" />Listo por ahora</button></div></div>}
    </main>
  )
}

function MiniCard({ icon, label, value, note, accent }) {
  const styles = { green: 'bg-[#e8f2e9] text-[#4d7e5e]', orange: 'bg-[#f9eee5] text-[#b77448]', blue: 'bg-[#e9f0f3] text-[#5f7c8a]' }
  return <div className="rounded-2xl border border-[#e3e9e4] bg-white p-5"><div className="flex items-center gap-2"><span className={`grid size-8 place-items-center rounded-lg ${styles[accent]}`}>{icon}</span><span className="text-xs font-semibold text-[#839088]">{label}</span></div><p className="mt-4 text-2xl font-semibold tracking-[-0.05em]">{value}</p><p className="mt-1 text-[10px] text-[#9ba59f]">{note}</p></div>
}

function ProjectRow({ title, progress, color, meta }) {
  return <div><div className="flex items-center justify-between"><span className="text-sm font-medium">{title}</span><span className="text-[10px] font-bold text-[#89978e]">{progress}%</span></div><div className="mt-2 h-1.5 rounded-full bg-[#edf2ed]"><div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} /></div><p className="mt-1.5 text-[10px] text-[#a0aaa4]">{meta}</p></div>
}
