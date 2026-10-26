// ÁREA RESERVADA (e50) — convenios, contratos e información por perfil.
// CÓMO FUNCIONA
//  • Solo TÚ (con ?admin=1 en ese teléfono) ves el índice completo: Contacto → «🔐 Área reservada».
//  • Cada elemento tiene su enlace propio:  https://dcuates.com/#reservado-ID   (ID = el campo «id» de abajo).
//    Quien recibe ese enlace ve ÚNICAMENTE ese elemento, dentro de la página de DCUATES (con su logo).
//  • Si pones «clave», la persona debe escribirla para ver el contenido.
// ADVERTENCIA HONESTA: todo lo escrito en este archivo viaja dentro del código público de la página. El enlace
// y la clave sirven para ORDENAR y para que no sea visible a simple vista, pero NO son seguridad real.
// Para algo realmente confidencial (datos personales, montos, contratos firmados) NO lo escribas aquí:
// ponlo en tus bases (Baserow/Drive privado) y comparte solo el enlace «enlace» con su propio permiso.
// Para agregar un elemento: copia un bloque de «items» y cambia id, perfil, tipo, t, d, texto, enlace, clave.
export const RESERVADO = {
  titulo: "Área reservada",
  perfiles: [
    { id: "aliados", ico: "🤝", t: "Aliados y convenios" },
    { id: "negocios", ico: "🏪", t: "Negocios" },
    { id: "voluntarios", ico: "🙋", t: "Voluntarios y asesores" },
    { id: "administracion", ico: "📋", t: "Administración" }
  ],
  items: [
    {
      id: "ejemplo-convenio",
      perfil: "aliados",
      tipo: "Convenio",
      t: "Ejemplo de convenio con aliado",
      d: "Borra o cambia este ejemplo.",
      texto: "Aquí va el resumen del convenio: qué ofrece cada parte, vigencia y a quién contactar.",
      enlace: "",
      clave: ""
    },
    {
      id: "ejemplo-negocios",
      perfil: "negocios",
      tipo: "Información",
      t: "Ejemplo: guía para negocios aliados",
      d: "Borra o cambia este ejemplo.",
      texto: "Aquí va la información para negocios: beneficios, requisitos y pasos.",
      enlace: "",
      clave: ""
    }
  ]
};
