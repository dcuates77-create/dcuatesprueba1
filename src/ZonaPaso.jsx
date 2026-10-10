// "TU SIGUIENTE PASO" — al final de cada ventana de la zona pública, un botón lleva a la tarjeta que sigue.
import React, { createContext, useContext } from "react";

export const PasoCtx = createContext(null);
const SIGUIENTE = {
  empieza: ["juegos", "🎉 Ahora juega y diviértete"],
  juegos: ["aprende", "🧠 Descubre algo nuevo jugando"],
  aprende: ["gana", "🏆 Gira y gana cupones"],
  gana: ["propon", "💡 Recomienda algo y suma Semillas"],
  propon: ["causa", "🛍️ Dona, compra o vende con causa"],
  causa: ["info", "📌 Conoce la información clave"],
  info: [null, "🤝 Colabora: conoce la zona de aliados"]
};

export function SiguientePaso({ actual }) {
  const ctx = useContext(PasoCtx);
  const sig = SIGUIENTE[actual];
  if (!ctx || !sig) return null;
  return (
    <div className="sp-next">
      <p>Tu siguiente paso</p>
      <button type="button" onClick={() => ctx.irA(sig[0])}>{sig[1]} ›</button>
    </div>
  );
}
