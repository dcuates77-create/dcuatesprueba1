// TABLERO CONOCE — introducción y las 6 secciones (sin Nosotros) como lista de tarjetas.
import React, { useEffect, useState } from "react";
import { useAtras } from "./atras.js";
import Tablero, { abrirAcceso } from "./Tablero.jsx";

// Las 6 secciones (sin Nosotros). Tocar una abre su pestaña en el menú de secciones y baja a ella.
const SECCIONES = [
  { id: "beneficios", emoji: "🎁", t: "Beneficios", d: "Libros, Bienestar, Asesorías, Ecatepets, Círculo…", color: "#C2410C" },
  { id: "causas", emoji: "❤️", t: "Causas y valores", d: "Apoyo voluntario, Noticias de barrio, Círculo de Confianza…", color: "#D1343B" },
  { id: "negocios", emoji: "🗺️", t: "Negocios", d: "Emprendimientos que multiplican valor: publicidad, alianzas, ventas con causa…", color: "#1F7A46" },
  { id: "gratitud", emoji: "🙏", t: "Gratitud", d: "Regalos, retos, juegos y reconocimientos", color: "#92610F" },
  { id: "cierre", emoji: "/images/eclipse.svg", t: "Súmate", d: "Tu parte hace la diferencia", color: "#E65100" }
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
      lleno
      tarjetas={tarjetas}
      onCerrar={cerrar}
      onRegistros={() => { cerrar(); abrirAcceso("registros"); }}
    />
  );
}
