import React from "react";

export default function App() {
  return (
    <div style={{ backgroundColor: "#111827", color: "white", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      
      <h1 style={{ fontWeight: "900", marginBottom: "30px" }}>🧪 PRUEBA SIN FILTROS INTERNOS</h1>

      {/* 📽️ ENLACE DIRECTO DE TEXTO (AQUÍ NO USAMOS IFRAME NI VENTANAS INTERNAS) */}
      <div style={{ marginBottom: "40px" }}>
        <h2>1. CLIC PARA ABRIR VIDEO EN PESTAÑA NUEVA</h2>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", backgroundColor: "#312e81", color: "#c7d2fe", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", marginTop: "10px" }}
        >
          📺 VER REPORTAJE DE CHUY EN YOUTUBE
        </a>
      </div>

      {/* 💬 ENLACE ALTERNATIVO CORTO DE WHATSAPP (SIN LA PALABRA "API") */}
      <div>
        <h2>2. CLIC PARA ABRIR CHAT COMUNITARIO</h2>
        <a
          href="https://wa.me"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", backgroundColor: "#047857", color: "white", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontWeight: "700", marginTop: "10px" }}
        >
          🚀 PROBAR ENLACE CORTO WHATSAPP
        </a>
      </div>

    </div>
  );
}

