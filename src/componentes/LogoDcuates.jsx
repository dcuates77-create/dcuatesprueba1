// LOGO DCUATES COMUNIDAD (e91): tres personas + DCUATES con la D en naranja + COMUNIDAD.
// Se usa en «¿Qué es?» y, como franja pequeña (<MarcaVentana />), en el encabezado de las ventanas.
import React from "react";

export const NARANJA = "#E65100"; // el mismo naranja de «¡COMPARTE Y GANA!»

export function LogoDcuates({ alto = 34, claro = false }) {
  return (
    <span className={"lg-logo" + (claro ? " lg-claro" : "")} style={{ height: alto }} aria-label="DCUATES Comunidad" role="img">
      <style>{CSS_LOGO}</style>
      <svg viewBox="0 0 64 44" height={alto} aria-hidden="true">
        {[[10, "#2E9E5B"], [22, "#1B8A8F"], [34, "#E8731A"], [46, "#2A74B0"], [57, "#7A4FBF"]].map(([x, c], i) => (
          <g key={i} fill={c}><circle cx={x} cy={i % 2 ? 11 : 13} r="5.2" /><path d={`M${x - 7} 40 C${x - 7} ${i % 2 ? 20 : 22} ${x + 7} ${i % 2 ? 20 : 22} ${x + 7} 40 Z`} /></g>
        ))}
      </svg>
      <span className="lg-t"><b><i>D</i>CUATES</b><small>COMUNIDAD</small></span>
    </span>
  );
}

// Franja de marca para el encabezado de cualquier ventana (arriba del título).
export function MarcaVentana({ claro = false }) {
  return <div className="lg-marca" aria-hidden="false"><LogoDcuates alto={24} claro={claro} /></div>;
}

// Letra D en naranja para los títulos de texto «DCUATES».
export const DNaranja = ({ children = "CUATES" }) => <><span style={{ color: NARANJA }}>D</span>{children}</>;

const CSS_LOGO = `
.lg-logo{display:inline-flex;align-items:center;gap:7px}.lg-logo svg{width:auto}
.lg-t{display:flex;flex-direction:column;line-height:1}.lg-t b{font-size:21px;font-weight:900;color:#0B6E78;letter-spacing:.2px}.lg-t b i{color:#E65100;font-style:normal}
.lg-t small{font-size:8.5px;letter-spacing:3.2px;color:#0B6E78;margin-top:2px;font-weight:800}
.lg-claro .lg-t b,.lg-claro .lg-t small{color:#fff}
.lg-marca{display:flex;align-items:center;margin:0 0 6px;padding:0 0 4px;border-bottom:1px solid rgba(15,45,30,.12)}
.lg-marca .lg-t b{font-size:15px}.lg-marca .lg-t small{font-size:6.5px;letter-spacing:2.4px}
`;
