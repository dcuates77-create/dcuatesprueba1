import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Zona de administración (e70): carga aparte y solo si la ruta empieza con /admin. El visitante común nunca la descarga.
const AdminGuia = lazy(() => import("./AdminGuia.jsx"));
const enAdmin = /^\/admin(\/|$)/.test(window.location.pathname);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {enAdmin ? <Suspense fallback={null}><AdminGuia /></Suspense> : <App />}
  </React.StrictMode>
);
