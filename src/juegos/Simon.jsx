// Simón dice — repite la secuencia de luces.
import React, { useEffect, useRef, useState } from "react";

const COLS = ["#E5484D", "#2E9E5B", "#F5B800", "#1B6F8A"];
export default function Simon({ ctx, onFin }) {
  const [sec, setSec] = useState([]);
  const [luz, setLuz] = useState(-1);
  const [fase, setFase] = useState("inicio"); // inicio | muestra | tu
  const [pos, setPos] = useState(0);
  const tm = useRef([]);
  const vivo = useRef(true);
  const limpiar = () => { tm.current.forEach(clearTimeout); tm.current = []; };
  useEffect(() => { vivo.current = true; return () => { vivo.current = false; limpiar(); }; }, []);

  const muestra = (s) => {
    setFase("muestra"); setPos(0);
    s.forEach((k, i) => {
      tm.current.push(setTimeout(() => setLuz(k), 700 + i * 700));
      tm.current.push(setTimeout(() => setLuz(-1), 700 + i * 700 + 450));
    });
    tm.current.push(setTimeout(() => { if (vivo.current) setFase("tu"); }, 700 + s.length * 700));
  };
  const siguiente = (s) => { const n = [...s, Math.floor(Math.random() * 4)]; setSec(n); muestra(n); };
  const empezar = () => siguiente([]);
  const tocar = (k) => {
    if (fase !== "tu") return;
    setLuz(k); tm.current.push(setTimeout(() => setLuz(-1), 220));
    if (k !== sec[pos]) { setFase("fin"); tm.current.push(setTimeout(() => onFin(sec.length - 1, `Llegaste a ${sec.length - 1} luces.`), 600)); return; }
    if (pos + 1 === sec.length) { setFase("espera"); tm.current.push(setTimeout(() => siguiente(sec), 600)); } else setPos(pos + 1);
  };
  return (
    <div>
      <p className="jg-info">{fase === "inicio" ? "Mira las luces y repítelas en orden" : fase === "muestra" ? "Mira con atención…" : fase === "tu" ? "¡Tu turno!" : "…"} · Nivel <b>{Math.max(0, sec.length)}</b></p>
      <div className="jg-simon">
        {COLS.map((c, k) => (
          <button type="button" key={k} onClick={() => tocar(k)} style={{ background: c, opacity: luz === k ? 1 : 0.45, transform: luz === k ? "scale(1.04)" : "none" }} aria-label={`Luz ${k + 1}`}>{ctx.pares[k]}</button>
        ))}
      </div>
      {fase === "inicio" && <button type="button" className="jg-dado" onClick={empezar} style={{ marginTop: 10 }}>▶ Empezar</button>}
    </div>
  );
}
