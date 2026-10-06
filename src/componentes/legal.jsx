// =========================================================================
// src/componentes/legal.jsx — Consentimiento, Aviso/Escudo de Seguridad y ventanas legales
// =========================================================================
import React, { useState } from "react";
import { LogoMarca } from "./encabezado.jsx";
import { WA_OFICIAL_TXT, WA_OFICIAL_URL } from "../datos/proyectos.js";
import { DEGRADADO_ESCUDO, DEGRADADO_SEGURIDAD } from "../datos/seguridad.js";
import BotonCompartir from "../BotonCompartir";

// Botón de cierre (×) redondo. Todas las ventanas lo llevan ABAJO A LA DERECHA.
export function BotonCerrar({ onClick, label = "Cerrar", claro = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`shrink-0 h-11 w-11 flex items-center justify-center rounded-full text-2xl leading-none font-black shadow-lg transition-colors ${claro ? "bg-white text-[#0f2d1e] hover:bg-emerald-100" : "bg-[#0f2d1e] text-white hover:bg-emerald-800"}`}
    >
      ×
    </button>
  );
}

// Ventana con presencia de marca: encabezado de color con el logo, una
// invitación que introduce el contenido, el contenido (children), una frase
// de cierre y la cruz de cerrar abajo a la derecha. La usan Avisos y
// Beneficios, Compartir Más, Sugerencias y Dudas.
export function VentanaMarca({ degradado, suave, emoji, titulo, invitacion, cierre, compartir, onCerrar, children, ancho = "max-w-md", capa = "z-50" }) {
  return (
    <div className={`fixed inset-0 ${capa} flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm`} onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`bg-white text-slate-900 rounded-3xl ${ancho} w-full max-h-[92vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-5 pt-5 pb-7 text-white text-center" style={{ background: degradado }}>
          {compartir && (
            <BotonCompartir
              variante="claro"
              className="absolute top-3 right-3 z-10"
              hash={compartir.hash}
              titulo={compartir.titulo}
              texto={compartir.texto}
            />
          )}
          <div className="flex justify-center"><LogoMarca tam={68} /></div>
          <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-white/90">DCUATES · ¡Comparte y Gana!</p>
          <h3 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
            <span aria-hidden="true">{emoji} </span>{titulo}
          </h3>
        </div>
        <div className="-mt-3 rounded-t-3xl bg-white px-5 pt-5 pb-5">
          {invitacion && (
            <p className="rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed font-semibold text-slate-800 mb-4" style={{ background: suave }}>
              {invitacion}
            </p>
          )}
          {children}
          {cierre && (
            <p className="mt-5 text-center text-sm font-black italic leading-snug text-[#0f2d1e]">
              {cierre}
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <BotonCerrar onClick={onCerrar} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ----- Aceptación del Aviso de Privacidad y los Términos (todos los formularios) -----
// useAceptacion() lleva el estado de la casilla; CasillaAcepto la dibuja y
// ErrorAcepto muestra el mensaje rojo DEBAJO del botón de enviar. Los enlaces
// abren las ventanas legales del pie de página (las escucha App()).
export function useAceptacion() {
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState(false);
  return {
    acepta,
    error,
    cambiar: (v) => { setAcepta(v); if (v) setError(false); },
    // true = puede continuar; false = se bloquea todo el envío
    validar: () => { if (!acepta) { setError(true); return false; } return true; },
    reiniciar: () => { setAcepta(false); setError(false); }
  };
}

export function abrirLegal(cual) {
  window.dispatchEvent(new CustomEvent("dcuates:abrir-legal", { detail: cual }));
}

export function CasillaAcepto({ ac, id = "acepta_terminos_privacidad" }) {
  return (
    <>
    <div className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${ac.error ? "border-red-500 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
      <input
        type="checkbox"
        id={id}
        checked={ac.acepta}
        onChange={(e) => ac.cambiar(e.target.checked)}
        aria-describedby={ac.error ? `${id}_error` : undefined}
        className="mt-0.5 h-5 w-5 shrink-0 accent-[#e65100]"
      />
      <label htmlFor={id} className="text-xs sm:text-[13px] leading-snug font-semibold text-slate-800">
        He leído y acepto el{" "}
        <button type="button" onClick={(ev) => { ev.preventDefault(); abrirLegal("privacidad"); }} className="font-black text-[#1B6F8A] underline underline-offset-2">Aviso de Privacidad</button>
        {" "}y los{" "}
        <button type="button" onClick={(ev) => { ev.preventDefault(); abrirLegal("terminos"); }} className="font-black text-[#1B6F8A] underline underline-offset-2">Términos y Condiciones</button>
        {" "}de la Comunidad.
      </label>
    </div>
    <button
      type="button"
      onClick={() => abrirLegal("escudo")}
      className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-teal-300 bg-teal-50 hover:bg-teal-100 px-3 py-2 text-[11px] sm:text-xs font-black uppercase text-[#0b6e5f] leading-tight text-center transition-colors"
    >
      <span aria-hidden="true">🛡️</span> Escudo de Seguridad: así identificas el espacio seguro de DCUATES
    </button>
    </>
  );
}

export function EnlaceWAOficial() {
  return (
    <a href={WA_OFICIAL_URL} target="_blank" rel="noopener noreferrer" className="font-black text-[#0b6e5f] underline underline-offset-2">{WA_OFICIAL_TXT}</a>
  );
}

export function TarjetaSeguridad({ emoji, titulo, color, fondo, children }) {
  return (
    <section className="rounded-2xl border-2 p-4" style={{ borderColor: color, background: fondo }}>
      <h4 className="flex items-start gap-2 text-[15px] sm:text-base font-black uppercase leading-tight mb-2" style={{ color }}>
        <span className="text-xl leading-none" aria-hidden="true">{emoji}</span>
        <span>{titulo}</span>
      </h4>
      <div className="text-sm text-slate-800 leading-relaxed font-medium space-y-2">{children}</div>
    </section>
  );
}

export function ListaSeguridad({ items, color }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="font-black shrink-0" style={{ color }} aria-hidden="true">✔</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function ModalAvisoSeguridad({ onCerrar }) {
  return (
    <VentanaMarca
      degradado={DEGRADADO_SEGURIDAD}
      suave="#fff1ec"
      emoji="⚠️"
      titulo="Aviso de Seguridad de la Comunidad"
      invitacion="En DCUATES la confianza mutua es nuestro activo más valioso. Como plataforma de vinculación independiente, operamos bajo un protocolo de seguridad estricto para blindar tanto la integridad de la plataforma como la seguridad física y económica de todos nuestros miembros. Al interactuar en dcuates.com o mediante nuestros canales, aceptas respetar los siguientes pilares de protección comunitaria:"
      cierre="¡CUIDARNOS ENTRE TODOS FORTALECE NUESTRA CONFIANZA Y NUESTRO BIENESTAR! 💚"
      compartir={{ hash: "seguridad", titulo: "Aviso de Seguridad de la Comunidad DCUATES", texto: "Cuidémonos entre todos: conoce los canales oficiales y las reglas de seguridad" }}
      onCerrar={onCerrar}
      ancho="max-w-2xl"
      capa="z-[80]"
    >
      <div className="space-y-4 text-left">
        <TarjetaSeguridad emoji="🔐" titulo="1. Canales oficiales únicos (prevención de suplantación de identidad)" color="#1B6F8A" fondo="#eef7fa">
          <p>Para evitar fraudes o contacto por parte de terceras personas ajenas al proyecto, se establece que:</p>
          <ListaSeguridad color="#1B6F8A" items={[
            <>El único canal digital automatizado de recepción de solicitudes es el portal web <b className="font-black">dcuates.com</b>.</>,
            <>El único medio de seguimiento y atención personalizada es nuestra línea oficial de WhatsApp: <EnlaceWAOficial />.</>
          ]} />
          <p className="font-black text-[#b3261e]">🚨 Cualquier comunicación recibida fuera de estos canales oficiales no pertenece a DCUATES y debe ser reportada inmediatamente por motivos de seguridad.</p>
        </TarjetaSeguridad>

        <TarjetaSeguridad emoji="💳" titulo="2. Protocolo de Ventas con Causa y aportaciones (cuenta única)" color="#1f7a4d" fondo="#eefaf3">
          <p>Para garantizar el uso transparente de los recursos y la autosustentabilidad de la cooperativa, todas las transacciones comerciales o de apoyo financiero se rigen bajo las siguientes reglas:</p>
          <ListaSeguridad color="#1f7a4d" items={[
            "No manejamos cobradores, gestores ni voluntarios en la calle autorizados para recibir dinero en efectivo.",
            <>Los pagos correspondientes a nuestras "Ventas con Causa" se realizarán única y exclusivamente mediante transferencia electrónica a la Cuenta CLABE oficial a nombre de: <b className="font-black">Abel Meraz Alvarado</b>.</>,
            "Jamás solicitaremos números confidenciales de tarjetas de crédito o débito, contraseñas bancarias, ni códigos de verificación vía SMS. Si alguien te pide estos datos a nombre de DCUATES, se trata de un intento de fraude."
          ]} />
        </TarjetaSeguridad>

        <TarjetaSeguridad emoji="🤝" titulo="3. Reglas de seguridad física para intercambios comunitarios" color="#c2410c" fondo="#fff4ec">
          <p>Dado que DCUATES funge como un puente de vinculación vecinal para coordinar apoyos materiales, trueques o transacciones, cada usuario asume la responsabilidad de su propia seguridad física al interactuar con terceros. Es obligatorio seguir estas pautas en cada encuentro presencial:</p>
          <ListaSeguridad color="#c2410c" items={[
            "Queda estrictamente prohibido citar a personas desconocidas en domicilios particulares o lugares aislados.",
            "Las entregas de apoyos materiales, ventas, trueques o reuniones de coordinación deben realizarse siempre en lugares públicos, concurridos y con vigilancia (como plazas comerciales, parques principales, estaciones de transporte público o fuera de oficinas de gobierno) a la luz del día.",
            "Es requisito indispensable asistir acompañado o, en su defecto, avisar previamente a alguien de confianza sobre con quién te reunirás, la hora y compartir sus datos de localización."
          ]} />
        </TarjetaSeguridad>

        <TarjetaSeguridad emoji="📵" titulo="4. Protección e interacciones digitales" color="#6d3fc8" fondo="#f5f0ff">
          <p>No caigas en trampas ni comprometas tu privacidad. El equipo oficial nunca te solicitará contraseñas, claves bancarias ni códigos de verificación vía SMS, así como tampoco enviará enlaces extraños para validar tus datos o perfil. Los medios y contactos oficiales de comunicación serán estrictamente los citados en el punto 1 de este documento.</p>
        </TarjetaSeguridad>

        <TarjetaSeguridad emoji="🚫" titulo="5. Política de moderación y baneo definitivo" color="#b3261e" fondo="#fff0ee">
          <p>Mantenemos una tolerancia cero frente a conductas maliciosas. DCUATES se reserva el derecho de eliminar de forma inmediata de su base de datos (Google Sheets) y bloquear de sus canales de atención a cualquier usuario que:</p>
          <ListaSeguridad color="#b3261e" items={[
            "Proporcione datos de contacto falsos, duplicados o inactivos.",
            "Utilice el chat de vinculación para realizar acoso, amenazas, spam comercial o proselitismo político/religioso.",
            "Intente utilizar la confianza comunitaria para esquemas de préstamos de dinero, fraudes o actividades ilícitas."
          ]} />
        </TarjetaSeguridad>

        <p className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 px-4 py-3 text-sm font-black text-[#0f2d1e] leading-snug text-center">
          🤲 Ayúdanos a MANTENER SEGURA NUESTRA COMUNIDAD. Si notas algo raro, repórtalo en nuestros canales oficiales y en los medios de prevención y protección correspondientes.
        </p>
        <button
          type="button"
          onClick={() => { onCerrar(); abrirLegal("escudo"); }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-300 px-3 py-2.5 text-xs font-black uppercase text-[#0b6e5f] transition-colors"
        >
          <span aria-hidden="true">🛡️</span> Ver el Escudo de Seguridad (resumen rápido)
        </button>
        <p className="text-xs font-black text-slate-500">Fecha de última actualización: Octubre de 2026.</p>
      </div>
    </VentanaMarca>
  );
}

export function ModalEscudoSeguridad({ onCerrar }) {
  return (
    <VentanaMarca
      degradado={DEGRADADO_ESCUDO}
      suave="#e6f6f2"
      emoji="🛡️"
      titulo="Escudo de Seguridad"
      invitacion="¿Cómo identificar el espacio seguro de DCUATES? Ante cualquier intento malintencionado o de fraude... recuerda que la identidad de nuestra comunidad está blindada:"
      cierre="¡¡¡ CUIDARNOS ENTRE TODOS FORTALECE NUESTRA CONFIANZA Y NUESTRO BIENESTAR !!! 💚"
      compartir={{ hash: "escudo", titulo: "Escudo de Seguridad DCUATES", texto: "Así identificas el espacio seguro de nuestra comunidad" }}
      onCerrar={onCerrar}
      ancho="max-w-xl"
      capa="z-[80]"
    >
      <div className="space-y-4 text-left">
        <TarjetaSeguridad emoji="1️⃣" titulo="Atención única y cuentas transparentes" color="#1B6F8A" fondo="#eef7fa">
          <p>Las dudas, registros y solicitudes se atienden únicamente a través de la página oficial <b className="font-black">dcuates.com</b> o mediante nuestro canal único de WhatsApp <EnlaceWAOficial />. Asimismo, todas las aportaciones por ventas con causa se reciben de forma exclusiva a nombre del titular <b className="font-black">Abel Meraz Alvarado</b>.</p>
        </TarjetaSeguridad>
        <TarjetaSeguridad emoji="2️⃣" titulo="Ventas y apoyos seguros" color="#c2410c" fondo="#fff4ec">
          <p>Si coordinas una venta, trueque o apoyo en físico con otro miembro, la regla de oro es reunirse únicamente en <b className="font-black">lugares públicos y concurridos a la luz del día</b>, acudiendo preferentemente acompañado o avisando a alguien de confianza con quién te reunirás y compartiendo sus datos de localización.</p>
        </TarjetaSeguridad>
        <TarjetaSeguridad emoji="3️⃣" titulo="Protección e interacciones digitales" color="#6d3fc8" fondo="#f5f0ff">
          <p>No caigas en trampas ni comprometas tu privacidad. El equipo oficial nunca te solicitará contraseñas, claves bancarias ni códigos de verificación vía SMS, así como tampoco enviará enlaces extraños para validar tus datos o perfil. Los medios y contactos oficiales de comunicación serán los citados en el punto 1.</p>
        </TarjetaSeguridad>
        <p className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 px-4 py-3 text-sm font-black text-[#0f2d1e] leading-snug text-center">
          🤲 Ayúdanos a MANTENER SEGURA NUESTRA COMUNIDAD. Si notas algo raro, repórtalo en nuestros canales oficiales y en los medios de prevención y protección correspondientes.
        </p>
        <button
          type="button"
          onClick={() => { onCerrar(); abrirLegal("seguridad"); }}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#b3261e] hover:bg-[#8f1d17] text-white px-3 py-3 text-xs sm:text-sm font-black uppercase leading-tight text-center shadow-md transition-colors"
        >
          <span aria-hidden="true">⚠️</span> Te invitamos a revisar el Aviso de Seguridad completo, para NUESTRA PROTECCIÓN
        </button>
      </div>
    </VentanaMarca>
  );
}

export function ErrorAcepto({ ac, id = "acepta_terminos_privacidad" }) {
  if (!ac.error) return null;
  return (
    <p id={`${id}_error`} role="alert" className="mt-2 text-sm text-red-600 font-black text-center">
      Debes aceptar el Aviso de Privacidad y los Términos y Condiciones para continuar
    </p>
  );
}

// Ventana con texto legal largo (Aviso de Privacidad / Términos y Condiciones).
export function ModalLegal({ documento, emoji, degradado, onCerrar }) {
  return (
    <VentanaMarca
      degradado={degradado}
      suave="#f1f5f9"
      emoji={emoji}
      titulo={documento.titulo}
      invitacion={documento.intro}
      onCerrar={onCerrar}
      ancho="max-w-2xl"
      capa="z-[80]"
    >
      <div className="space-y-5 text-sm text-slate-700 leading-relaxed text-left font-medium">
        {documento.secciones.map((sec, i) => (
          <section key={i}>
            <h4 className="text-[15px] font-black text-[#0f2d1e] mb-1.5">{sec.titulo}</h4>
            {(sec.parrafos || []).map((t, j) => <p key={j} className="mb-2">{t}</p>)}
            {sec.lista && (
              <ul className="list-disc pl-5 space-y-1.5 mb-2">
                {sec.lista.map((it, j) => (
                  <li key={j}>
                    {typeof it === "string" ? it : (<><b className="font-black text-[#0f2d1e]">{it.b}</b> {it.t}</>)}
                  </li>
                ))}
              </ul>
            )}
            {(sec.despues || []).map((t, j) => <p key={j} className="mb-2">{t}</p>)}
          </section>
        ))}
        <p className="text-xs font-black text-slate-500 pt-1">{documento.fecha}</p>
      </div>
    </VentanaMarca>
  );
}
