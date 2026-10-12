// TABLERO CONOCE — introducción y las 6 secciones (sin Nosotros) como lista de tarjetas.
import React, { useEffect, useState } from "react";
import { useAtras } from "./atras.js";
import Tablero, { abrirAcceso } from "./Tablero.jsx";

// Las 6 secciones (sin Nosotros). Tocar una abre su pestaña en el menú de secciones y baja a ella.
const SECCIONES = [
  { id: "beneficios", emoji: "🎁", t: "Beneficios", d: "Libros, Bienestar, Asesorías, Ecatepets, Círculo…", color: "#C2410C" },
  { id: "causas", emoji: "❤️", t: "Causas", d: "Apoyo voluntario, Libros, Ecatepets…", color: "#D1343B" },
  { id: "negocios", emoji: "🗺️", t: "Negocios", d: "Publicidad gratuita, Alianzas, Ventas con causa…", color: "#1F7A46" },
  { id: "valores", emoji: "✨", t: "Valores", d: "Noticias de barrio, Alianzas, Círculo de Confianza…", color: "#6D4BC8" },
  { id: "regalos", emoji: "🎉", t: "Regalos", d: "Juegos, retos y cupones", color: "#C2255C" },
  { id: "gratitud", emoji: "🙏", t: "Gratitud", d: "Reconocimientos y agradecimientos", color: "#92610F" }
];

export default function TableroConoce() {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    const oir = (e) => { if (e.detail === "conoce") setAbierto(true); };
    window.addEventListener("dcuates:abrir-tablero", oir);
    return () => window.removeEventListener("dcuates:abrir-tablero", oir);
  }, []);
  useAtras(abierto, () => setAbierto(false));
  if (!abierto) return null;
  const cerrar = () => setAbierto(false);
  const ir = (id) => {
    cerrar();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("dcuates:abrir-seccion", { detail: id }));
      setTimeout(() => document.getElementById("mapa-negocios")?.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    }, 150);
  };
  const tarjetas = SECCIONES.map((s) => ({ ...s, onClick: () => ir(s.id) }));
  return (
    <Tablero
      paso="PASO 1 · CONOCE" emoji="🧭" titulo="CONOCE DCUATES" color="#1B6F8A" hash="zona-conoce"
      intro="Aquí empieza todo. Elige una sección para ver sus proyectos y beneficios. Toca cualquier tarjeta para entrar."
      lista
      tarjetas={tarjetas}
      onCerrar={cerrar}
      onRegistros={() => { cerrar(); abrirAcceso("registros"); }}
    />
  );
}
