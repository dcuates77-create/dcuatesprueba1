// INVITA A UN VECINO (e48) — abre WhatsApp con un mensaje listo para mandar a quien tú elijas.
// El texto vive en src/datos/config.js (MENSAJE_INVITACION). El enlace lleva ?origen=invitacion para medir cuántos llegan así.
import React from "react";
import { MENSAJE_INVITACION, URL_SITIO } from "./datos/config.js";
import { registrar } from "./analitica.js";
import { abrirRegistroPrevio } from "./RegistroPrevio.jsx";

export default function InvitaVecino() {
  const invitar = () => {
    registrar("invitar_vecino");
    const texto = `${MENSAJE_INVITACION} ${URL_SITIO}/?origen=invitacion`;
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank", "noopener");
  };
  return (
    <section aria-label="Invita a tu comunidad" style={{ background: "#fff", borderRadius: 22, margin: "14px 16px", padding: "14px 14px 16px", boxShadow: "0 4px 14px rgba(15,45,30,.12)", textAlign: "center", fontFamily: "Nunito, system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0f2d1e" }}>💚 Invita a tu comunidad</h2>
      <p style={{ margin: "0 0 10px", fontSize: 14.5, fontWeight: 700, color: "#3d5a4a" }}>Invita a un vecino, amigo o familiar. Entre más personas sumemos, más apoyos llegan. Te damos tu enlace con código: así sabemos que viene de ti. No pedimos sus datos.</p>
      <button type="button" onClick={() => { registrar("invitar_vecino", { desde: "tarjeta" }); abrirRegistroPrevio("invitar"); }} style={{ minHeight: 48, padding: "0 22px", border: 0, borderRadius: 999, background: "#25a244", color: "#fff", fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>Registrar mi invitación</button>
      <button type="button" onClick={invitar} style={{ display: "block", margin: "8px auto 0", minHeight: 44, border: 0, background: "none", color: "#128c7e", fontWeight: 800, fontSize: 13.5, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}>Solo compartir por WhatsApp, sin registrarme</button>
    </section>
  );
}
