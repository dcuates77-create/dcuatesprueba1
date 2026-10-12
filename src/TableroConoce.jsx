// TABLERO CONOCE — introducción, proyectos, Para ti (beneficios) y Mapa del sitio, todo como botones.
import React, { useEffect, useState } from "react";
import { useAtras } from "./atras.js";
import Tablero, { abrirAcceso } from "./Tablero.jsx";
import { IDENTIDAD } from "./datos/identidad.js";
import { RESUMEN_PROYECTO } from "./datos/proyectos.js";

const ORDEN = ["libros", "asesorias", "bienestar", "ecatepets", "circulo-confianza", "publicidad-tarjeta", "recomienda-evalua-gana", "alianzas-tarjeta", "bazares", "ventas-con-causa", "donaciones", "noticias", "cupones-promos"];

export default function TableroConoce({ onAbrirProyecto = () => {}, onMapa = () => {} }) {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    const oir = (e) => { if (e.detail === "conoce") setAbierto(true); };
    window.addEventListener("dcuates:abrir-tablero", oir);
    return () => window.removeEventListener("dcuates:abrir-tablero", oir);
  }, []);
  useAtras(abierto, () => setAbierto(false));
  if (!abierto) return null;
  const cerrar = () => setAbierto(false);
  const tarjetas = [
    { id: "mapa", emoji: "🧭", t: "Mapa del sitio", d: "Todos los proyectos y secciones en un solo lugar", color: "#1B6F8A", onClick: () => { cerrar(); onMapa(); } },
    { id: "parati", emoji: "💛", t: "Para ti", d: "Los beneficios que puedes recibir hoy", color: "#E65100", onClick: () => { cerrar(); abrirAcceso("beneficios"); } },
    ...ORDEN.map((id) => ({ id, emoji: IDENTIDAD[id].emoji, t: IDENTIDAD[id].nombre, d: RESUMEN_PROYECTO[id] || "Descuentos en negocios locales", color: IDENTIDAD[id].color, onClick: () => { cerrar(); onAbrirProyecto(id); } }))
  ];
  return (
    <Tablero
      paso="PASO 1 · CONOCE" emoji="🧭" titulo="CONOCE DCUATES" color="#1B6F8A" hash="zona-conoce"
      intro="Aquí empieza todo. Conoce quiénes somos y los proyectos con los que puedes recibir apoyo, ofrecer el tuyo o sumarte a la comunidad. Toca cualquier botón para entrar."
      tarjetas={tarjetas}
      onCerrar={cerrar}
      onRegistros={() => { cerrar(); abrirAcceso("registros"); }}
    />
  );
}
