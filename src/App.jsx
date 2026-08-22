import React from "react";

export default function App() {
  return (
    <div style={{ backgroundColor: "#1b4332", color: "white", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      
      <h1 style={{ fontWeight: "900", marginBottom: "10px", textTransform: "uppercase" }}>
        🚨 MICRO PRUEBA ATÓMICA DEFINITIVA
      </h1>
      <p style={{ fontSize: "14px", color: "#a7f3d0", marginBottom: "30px" }}>
        PROBANDO EL TELÉFONO DE WHATSAPP Y UN VIDEO DE LIBRE USO
      </p>

      {/* 📽️ PRUEBA 1: VIDEO ANIMADO DE LIBRE USO (PARA VERIFICAR QUE TU IFRAME SÍ FUNCIONA) */}
      <h2 style={{ fontSize: "16px", marginBottom: "15px" }}>1. PRUEBA DE VIDEO REPRODUCTOR</h2>
      <div style={{ maxWidth: "560px", margin: "0 auto 40px auto", border: "4px solid #00c853", borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9", backgroundColor: "black" }}>
        <iframe
          style={{ width: "100%", height: "100%", border: "0" }}
          src="https://youtube.com" 
          title="VIDEO ANIMADO DE PRUEBA"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 💬 PRUEBA 2: BOTÓN DE WHATSAPP DIRECTO A TU NÚMERO */}
      <h2 style={{ fontSize: "16px", marginBottom: "5px" }}>2. PRUEBA DE ENLACE A WHATSAPP</h2>
      <p style={{ fontSize: "14px", color: "#fbd58d", marginBottom: "15px" }}>
        NÚMERO CONFIGURADO: <strong>525520696627</strong>
      </p>
      
      <div style={{ marginTop: "10px" }}>
        <a
          href="https://whatsapp.com."
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", backgroundColor: "#e65100", color: "white", fontWeight: "900", padding: "15px 30px", borderRadius: "12px", textDecoration: "none", boxHighlight: "0 10px 15px -3px rgba(0,0,0,0.3)", textTransform: "uppercase" }}
        >
          🚀 CLIC AQUÍ PARA ENLAZAR WHATSAPP
        </a>
      </div>

    </div>
  );
}

