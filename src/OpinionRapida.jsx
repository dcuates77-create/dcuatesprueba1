// TU OPINIÓN CUENTA (e43) — valoración rápida y anónima; se guarda en la hoja de Google (Tipo "Opinión").
import React, { useState } from "react";
import { GOOGLE_SHEETS_URL } from "./datos/config.js";
import { registrar } from "./analitica.js";

const CARAS = [["😍", "Me encantó"], ["🙂", "Bien"], ["😐", "Regular"], ["🙁", "Mal"], ["😡", "Muy mal"]];

export default function OpinionRapida() {
  const [cara, setCara] = useState(null);
  const [texto, setTexto] = useState("");
  const [ok, setOk] = useState(false);
  const enviar = async () => {
    if (cara === null) return;
    const d = new URLSearchParams({ Tipo: "Opinión", Nombre: "Anónimo", Contacto: "", Mensaje: `${CARAS[cara][0]} ${CARAS[cara][1]}${texto.trim() ? " — " + texto.trim() : ""}`, Estado: "Recibido", Fecha: new Date().toLocaleString("es-MX") });
    try { await fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", body: d }); } catch (e) { /* sin conexión: se ignora */ }
    registrar("opinion_enviada", { v: cara + 1 });
    setOk(true);
  };
  return (
    <section aria-label="Tu opinión cuenta" style={{ background: "#fff", borderRadius: 22, margin: "14px 16px", padding: "14px 14px 16px", boxShadow: "0 4px 14px rgba(15,45,30,.12)", textAlign: "center", fontFamily: "Nunito,system-ui,sans-serif" }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: "#0f2d1e" }}>⭐ Tu opinión cuenta</h2>
      {ok ? (
        <p style={{ margin: "10px 0 0", fontSize: 16, fontWeight: 800, color: "#0e7c4f" }}>¡Gracias! Tu opinión nos ayuda a mejorar. 💚</p>
      ) : (
        <>
          <p style={{ margin: "0 0 10px", fontSize: 14.5, fontWeight: 700, color: "#3d5a4a" }}>¿Cómo te fue en esta página? (es anónimo)</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            {CARAS.map(([e, t], i) => (
              <button key={e} type="button" aria-label={t} aria-pressed={cara === i} onClick={() => setCara(i)} style={{ width: 52, height: 52, fontSize: 30, borderRadius: "50%", border: cara === i ? "3px solid #0e7c4f" : "2px solid #cfe5d6", background: cara === i ? "#e3f3e9" : "#fff", cursor: "pointer" }}>{e}</button>
            ))}
          </div>
          {cara !== null && (
            <>
              <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={2} maxLength={300} placeholder="¿Qué mejorarías? (opcional)" style={{ width: "100%", boxSizing: "border-box", marginTop: 10, borderRadius: 12, border: "2px solid #cbd5e1", padding: 8, font: "inherit", fontWeight: 700 }} />
              <button type="button" onClick={enviar} style={{ marginTop: 8, minHeight: 46, padding: "0 22px", border: 0, borderRadius: 999, background: "#0e7c4f", color: "#fff", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>Enviar opinión</button>
            </>
          )}
        </>
      )}
    </section>
  );
}
