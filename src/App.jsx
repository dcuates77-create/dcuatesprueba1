import React from "react";

export default function App() {
  return (
    <div style={{ backgroundColor: "#111827", color: "white", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      
      <h1 style={{ fontWeight: "900", marginBottom: "10px", textTransform: "uppercase" }}>
        🧪 Micro Prueba Definitiva - DCUATES
      </h1>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "40px" }}>
        Validación síncrona de video incrustado y enlace directo corto
      </p>

      {/* 📽️ REPRODUCTOR INDESTRUCTIBLE DEL REPORTAJE DE CHUY EL SAPO SOÑADOR */}
      <div style={{ maxWidth: "560px", margin: "0 auto 40px auto", border: "4px solid #057857", borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9", backgroundColor: "black" }}>
        <iframe
          style={{ width: "100%", height: "100%", border: "0" }}
          src="https://youtube.com"
          title="CHUY EL SAPO SOÑADOR"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 💬 BOTÓN CORTO DE WHATSAPP DIRECTO HACIA TU TELÉFONO CENTRAL */}
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "14px", color: "#f59e0b", marginBottom: "10px" }}>
          DESTINO VERIFICADO: <strong>525520696627</strong>
        </p>
        <a
          href="https://wa.me."
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", backgroundColor: "#e65100", color: "white", fontWeight: "900", padding: "15px 30px", borderRadius: "12px", textDecoration: "none", textTransform: "uppercase", fontSize: "14px" }}
        >
          🚀 PROBAR WHATSAPP CORTO NOW
        </a>
      </div>

    </div>
  );
}
