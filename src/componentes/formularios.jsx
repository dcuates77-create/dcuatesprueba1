// =========================================================================
// src/componentes/formularios.jsx — Formularios de Publicidad, Ventas con Causa y Solicitudes
// =========================================================================
import React, { useState } from "react";
import { LogoMarca } from "./encabezado.jsx";
import { CasillaAcepto, ErrorAcepto, useAceptacion } from "./legal.jsx";
import { GOOGLE_SHEETS_URL } from "../datos/config.js";
import { TIPOS_DE_APOYO } from "../datos/proyectos.js";
import { enlaceWhatsApp, irASeccion } from "../utilidades/baserow.js";
import { registrar } from "../analitica";

// =========================================================================
// 4. SUBCOMPONENTE: FORMULARIO DE PUBLICIDAD
// =========================================================================
export function FormularioPublicidad() {
  const ac = useAceptacion();
  const [expandido, setExpandido] = useState(true);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [canal1, setCanal1] = useState("");
  const [canal2, setCanal2] = useState("");
  const [canal3, setCanal3] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ac.validar()) return;
    registrar("formulario_enviado", { form: "publicidad" });
    const fecha = new Date().toLocaleString();

    // Apps Script (doPost) lee e.parameter.X, así que se envía como
    // application/x-www-form-urlencoded — NO como JSON.
    const datosFormulario = new URLSearchParams({
      Nombre: contacto,
      Negocio: nombre,
      Giro: categoria,
      Telefono: telefono,
      Fecha: fecha
    });

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: datosFormulario
      });
    } catch (err) {
      console.error("Error guardando respaldo en Sheets:", err);
    }

    const mensaje = `¡Hola DCUATES!\n\nSolicito el registro de publicidad para mi negocio:\n• Contacto: ${contacto}\n• Negocio: ${nombre}\n• Categoría: ${categoria}\n• Teléfono: ${telefono}\n• Enlace 1: ${canal1 || "No especificado"}\n• Enlace 2: ${canal2 || "No especificado"}\n• Canal 3: ${canal3 || "No especificado"}\n\nA continuación adjunto mis imágenes promocionales.`;
    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener,noreferrer');

    // Limpiar el formulario para dejarlo listo para un nuevo registro
    setContacto("");
    setTelefono("");
    setNombre("");
    setCategoria("");
    setCanal1("");
    setCanal2("");
    setCanal3("");
    ac.reiniciar();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-slate-800 border-4 border-[#0f2d1e] p-6 rounded-3xl space-y-4 shadow-xl">
      {/* Se ve solo el nombre de contacto; el resto se despliega en cuanto
          se toca este campo o cualquier parte del formulario. */}
      <div>
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Nombre de contacto</label>
        <input
          type="text"
          value={contacto}
          onChange={e => setContacto(e.target.value)}
          onFocus={() => setExpandido(true)}
          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium"
          placeholder="Ej. Juan Pérez"
        />
      </div>

      {!expandido && (
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="w-full rounded-xl border-2 border-dashed border-[#e65100] text-[#e65100] hover:bg-orange-50 font-black uppercase tracking-wide text-[11px] sm:text-xs py-3 transition-colors"
        >
          ✍️ Toca para continuar con tu registro
        </button>
      )}

      <div
        className="overflow-hidden transition-[max-height] duration-300 space-y-4"
        style={{ maxHeight: expandido ? 2000 : 0 }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Teléfono</label>
            <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. 5512345678" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Nombre del negocio</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Taquería El Sol" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Giro / Categoría</label>
            <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. Restaurante, Salón, Tienda" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800">ENLACES Y REDES DIGITALES</label>
          {/* Ayuda contextual: por qué pedimos esto y qué pasa si no se tiene. */}
          <p className="text-[11px] text-slate-500 font-medium italic">
            💡 No es necesario tener los tres — con uno solo (o ninguno) también puedes registrarte; solo ayuda a que te encuentren más rápido.
          </p>
          <input type="text" value={canal1} onChange={e => setCanal1(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="1. Página principal o Correo Electrónico" />
          <input type="text" value={canal2} onChange={e => setCanal2(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="2. Perfil o Página de Facebook (Opcional)" />
          <input type="text" value={canal3} onChange={e => setCanal3(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="3. Cualquier otra Red Social (Opcional)" />
        </div>
        <CasillaAcepto ac={ac} id="acepta_terminos_privacidad_publicidad" />
        <button type="submit" className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs transition-all mt-2 shadow-md font-heading">
          Enviar registro
        </button>
        <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_publicidad" />
      </div>
    </form>
  );
}

// =========================================================================
// 4B. SUBCOMPONENTE: FORMULARIO DE VENTAS CON CAUSA
// =========================================================================
export function FormularioVentasConCausa() {
  const ac = useAceptacion();
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [meInteresa, setMeInteresa] = useState("");
  const [estoyBuscando, setEstoyBuscando] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ac.validar()) return;
    const fecha = new Date().toLocaleString();

    // Mismo patrón que FormularioPublicidad: se envía como
    // application/x-www-form-urlencoded al Apps Script (doPost).
    // Nota: el Apps Script necesita distinguir estos registros de los de
    // Publicidad — por eso se agrega el campo "Tipo". Si el Sheet actual
    // no lo contempla, conviene sumar una columna "Tipo" (o una pestaña
    // aparte) en la hoja de cálculo para que no se mezclen los datos.
    const datosFormulario = new URLSearchParams({
      Tipo: "VentasConCausa",
      Nombre: contacto,
      Telefono: telefono,
      MeInteresa: meInteresa,
      EstoyBuscando: estoyBuscando,
      Fecha: fecha
    });

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        body: datosFormulario
      });
    } catch (err) {
      console.error("Error guardando respaldo en Sheets:", err);
    }

    const mensaje = `¡Hola DCUATES!\n\nEsto es lo que me interesa de Ventas con Causa:\n• Contacto: ${contacto}\n• Teléfono: ${telefono}\n• Me interesa: ${meInteresa || "No especificado"}\n• Estoy buscando: ${estoyBuscando || "No especificado"}`;
    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener,noreferrer');

    setContacto("");
    setTelefono("");
    setMeInteresa("");
    setEstoyBuscando("");
    ac.reiniciar();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white text-slate-800 border-4 border-[#0f2d1e] p-6 rounded-3xl space-y-4 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Nombre de contacto</label>
          <input type="text" value={contacto} onChange={e => setContacto(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. María López" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Teléfono</label>
          <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium" placeholder="Ej. 5512345678" />
        </div>
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 mb-1">¿Qué artículo o servicio te interesa? (nombre y/o clave)</label>
        <textarea value={meInteresa} onChange={e => setMeInteresa(e.target.value)} rows={2} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium resize-none" placeholder="Ej. Me interesan las artesanías bordadas" />
      </div>
      <div>
        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 mb-1">¿Qué estás buscando?</label>
        <textarea value={estoyBuscando} onChange={e => setEstoyBuscando(e.target.value)} rows={2} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium resize-none" placeholder="Ej. Busco quién pueda hacer reparaciones de bicicletas" />
      </div>
      <CasillaAcepto ac={ac} id="acepta_terminos_privacidad_ventas" />
      <button type="submit" className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs transition-all mt-2 shadow-md font-heading">
        Enviar registro
      </button>
      <ErrorAcepto ac={ac} id="acepta_terminos_privacidad_ventas" />
    </form>
  );
}

export function FormularioSolicitud() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [colonia, setColonia] = useState("");
  const [tipo, setTipo] = useState(TIPOS_DE_APOYO[0]);
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enlaceRespaldo, setEnlaceRespaldo] = useState("");
  const ac = useAceptacion();

  const claseCampo = "w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors font-medium";
  const claseEtiqueta = "block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 mb-1";

  const enviar = (e) => {
    e.preventDefault();
    // Sin aceptar el Aviso de Privacidad y los Términos: se detiene TODO (no se
    // guarda en Google Sheets ni se abre WhatsApp).
    if (!ac.validar()) return;
    const tel = telefono.replace(/\D/g, "");
    if (!nombre.trim()) return setError("Escribe tu nombre.");
    if (tel.length < 10) return setError("Escribe tu número de WhatsApp a 10 dígitos.");
    if (!detalle.trim()) return setError("Cuéntanos brevemente qué necesitas.");
    setError("");

    registrar("formulario_enviado", { form: "solicitud" });

    // 1) Registro en Google Sheets (sin esperar respuesta, para no perder el
    //    permiso del navegador de abrir WhatsApp).
    try {
      fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        body: new URLSearchParams({
          Tipo: "Solicitud",
          Nombre: nombre.trim(),
          Telefono: tel,
          Colonia: colonia.trim(),
          TipoApoyo: tipo,
          Detalle: detalle.trim(),
          AceptaTerminos: "Sí (Aviso y Términos, oct-2026)",
          Fecha: new Date().toLocaleString()
        })
      }).catch(() => {});
    } catch (err) {
      console.error("Error guardando la solicitud en Sheets:", err);
    }

    // 2) Aviso por WhatsApp, en paralelo.
    const mensaje = `¡Hola DCUATES!\n\nRegistré una solicitud en la página:\n• Nombre: ${nombre.trim()}\n• WhatsApp: ${tel}\n• Colonia: ${colonia.trim() || "No especificada"}\n• Tipo de apoyo: ${tipo}\n• Detalle: ${detalle.trim()}`;
    const enlace = enlaceWhatsApp(mensaje);
    setEnlaceRespaldo(enlace);
    window.open(enlace, "_blank", "noopener,noreferrer");

    setEnviado(true);
    setTimeout(() => irASeccion("solicitudes"), 150);
  };

  if (enviado) {
    return (
      <div className="text-center py-6 px-4">
        <div className="flex justify-center"><LogoMarca tam={88} /></div>
        <p className="mt-4 text-lg font-black text-[#0f2d1e] leading-snug">¡Tu solicitud quedó registrada!</p>
        <p className="mt-2 text-base font-bold text-slate-700">En la primera oportunidad atenderemos tu solicitud…</p>
        <p className="mt-3 text-xl font-black text-[#e65100] uppercase tracking-wide">¡Gracias y saludos!</p>
        <p className="mt-4 text-[11px] text-slate-500 font-medium">
          ¿No se abrió WhatsApp?{" "}
          <a href={enlaceRespaldo} target="_blank" rel="noopener noreferrer" className="font-black text-[#128c7e] underline">Tócalo aquí</a>
        </p>
        <button
          type="button"
          onClick={() => { setEnviado(false); setNombre(""); setTelefono(""); setColonia(""); setDetalle(""); setTipo(TIPOS_DE_APOYO[0]); ac.reiniciar(); }}
          className="mt-4 rounded-full border-2 border-[#0f2d1e] px-4 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#0f2d1e] hover:bg-emerald-50 transition-colors"
        >
          Registrar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="space-y-3 p-4" noValidate>
      <div>
        <label className={claseEtiqueta} htmlFor="sol-nombre">Nombre</label>
        <input id="sol-nombre" type="text" value={nombre} onChange={(e) => { setNombre(e.target.value); if (error) setError(""); }} className={claseCampo} placeholder="Ej. María López" autoComplete="name" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={claseEtiqueta} htmlFor="sol-tel">WhatsApp</label>
          <input id="sol-tel" type="tel" inputMode="tel" value={telefono} onChange={(e) => { setTelefono(e.target.value); if (error) setError(""); }} className={claseCampo} placeholder="Ej. 5512345678" autoComplete="tel" />
        </div>
        <div>
          <label className={claseEtiqueta} htmlFor="sol-colonia">Colonia</label>
          <input id="sol-colonia" type="text" value={colonia} onChange={(e) => setColonia(e.target.value)} className={claseCampo} placeholder="Ej. Jardines de Morelos" />
        </div>
      </div>
      <div>
        <label className={claseEtiqueta} htmlFor="sol-tipo">Tipo de apoyo</label>
        <select id="sol-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className={claseCampo}>
          {TIPOS_DE_APOYO.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className={claseEtiqueta} htmlFor="sol-detalle">¿Qué necesitas?</label>
        <textarea id="sol-detalle" rows={4} value={detalle} onChange={(e) => { setDetalle(e.target.value); if (error) setError(""); }} className={claseCampo} placeholder="Cuéntanos con detalle cómo podemos apoyarte…" />
      </div>
      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
      <CasillaAcepto ac={ac} />
      <button type="submit" className="w-full rounded-xl bg-[#e65100] hover:bg-[#bf360c] text-white font-black py-3.5 uppercase tracking-wider text-xs sm:text-sm transition-colors shadow-md">
        Enviar mi solicitud
      </button>
      <ErrorAcepto ac={ac} />
    </form>
  );
}
