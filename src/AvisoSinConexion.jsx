// AVISO DE SIN CONEXIÓN (e48) — franja amable cuando el teléfono pierde la señal; desaparece sola al volver.
import React, { useEffect, useState } from "react";

export default function AvisoSinConexion() {
  const [sin, setSin] = useState(() => typeof navigator !== "undefined" && navigator.onLine === false);
  useEffect(() => {
    const off = () => setSin(true);
    const on = () => setSin(false);
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    return () => { window.removeEventListener("offline", off); window.removeEventListener("online", on); };
  }, []);
  if (!sin) return null;
  return (
    <div role="status" aria-live="polite" style={{ position: "fixed", left: 10, right: 10, top: 10, zIndex: 80, background: "#0f2d1e", color: "#fff", borderRadius: 16, padding: "10px 14px", fontFamily: "Nunito, system-ui, sans-serif", fontSize: 14, fontWeight: 800, lineHeight: 1.3, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,.35)" }}>
      📡 Sin conexión por ahora. Puedes seguir viendo lo que ya cargó; cuando vuelva la señal se actualiza solo.
    </div>
  );
}
