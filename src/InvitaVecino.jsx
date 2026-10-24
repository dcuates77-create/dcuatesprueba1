// INVITA A UN VECINO (e48) — abre WhatsApp con un mensaje listo para mandar a quien tú elijas.
// El texto vive en src/datos/config.js (MENSAJE_INVITACION). El enlace lleva ?origen=invitacion para medir cuántos llegan así.
import React from "react";
import { MENSAJE_INVITACION, URL_SITIO } from "./datos/config.js";
import { registrar } from "./analitica.js";

export default function InvitaVecino() {
  const invitar = () => {
    registrar("invitar_vecino");
    const texto = `${MENSAJE_INVITACION} ${URL_SITIO}/?origen=invitacion`;
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank", "noopener");
  };
  return (
    <section aria-label="Invita a un vecino" style={{ background: "#fff", borderRadius: 22, margin: "14px 16px", padding: "14px 14px 16px", boxShadow: "0 4px 14px rgba(15,45,30,.12)", textAlign: "center", fontFamily: "Nunito, system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0f2d1e" }}>💚 Invita a un vecino</h2>
      <p style={{ margin: "0 0 10px", fontSize: 14.5, fontWeight: 700, color: "#3d5a4a" }}>Entre más vecinos sumemos, más apoyos llegan. Mándale la invitación por WhatsApp.</p>
      <button type="button" onClick={invitar} style={{ minHeight: 48, padding: "0 22px", border: 0, borderRadius: 999, background: "#25a244", color: "#fff", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>Invitar por WhatsApp</button>
    </section>
  );
}
