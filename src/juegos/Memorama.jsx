import React, { useEffect, useMemo, useState } from "react";

const barajar = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

export default function Memorama({ ctx, onFin }) {
  const cartas = useMemo(() => barajar([...ctx.pares, ...ctx.pares].map((e, i) => ({ e, i }))), [ctx]);
  const [vol, setVol] = useState([]);   // índices volteados (máx 2)
  const [ok, setOk] = useState([]);     // índices resueltos
  const [mov, setMov] = useState(0);

  useEffect(() => {
    if (vol.length !== 2) return undefined;
    const [a, b] = vol;
    const t = setTimeout(() => {
      if (cartas[a].e === cartas[b].e) setOk((o) => [...o, a, b]);
      setVol([]);
    }, cartas[a].e === cartas[b].e ? 350 : 800);
    return () => clearTimeout(t);
  }, [vol, cartas]);

  useEffect(() => {
    if (ok.length === cartas.length) { const t = setTimeout(() => onFin(Math.max(1, 30 - mov), `Lo lograste en ${mov} movimientos.`), 500); return () => clearTimeout(t); }
    return undefined;
  }, [ok, cartas, mov, onFin]);

  const tocar = (i) => {
    if (vol.length >= 2 || vol.includes(i) || ok.includes(i)) return;
    const nv = [...vol, i];
    setVol(nv);
    if (nv.length === 2) setMov((m) => m + 1);
  };
  return (
    <div>
      <p className="jg-info">Movimientos: <b>{mov}</b></p>
      <div className="jg-mem">
        {cartas.map((c, i) => {
          const abierta = vol.includes(i) || ok.includes(i);
          return (
            <button type="button" key={i} className={"jg-carta" + (abierta ? " jg-abierta" : "") + (ok.includes(i) ? " jg-ok" : "")} onClick={() => tocar(i)} aria-label={abierta ? c.e : "Carta boca abajo"}>
              <span>{abierta ? c.e : "❓"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
