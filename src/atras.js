// BOTÓN "ATRÁS" DEL CELULAR — cada ventana abierta (modal, tablero, ventana de zona) agrega una entrada
// al historial; al dar "Atrás" se cierra la ventana de arriba en lugar de salirse de la página.
// Uso:  useAtras(estaAbierta, () => cerrarla());
import { useEffect, useRef } from "react";

let seq = 0;
let pila = []; // { id, vivo, cerrar }
let pend = { abre: [], cierra: [] };
let programado = false;
const navegador = typeof window !== "undefined" && typeof history !== "undefined";

const idActual = () => { try { return (history.state && history.state.dcAtras) || 0; } catch (e) { return 0; } };

function flush() {
  programado = false;
  const { abre, cierra } = pend;
  pend = { abre: [], cierra: [] };
  const cierres = new Set(cierra);
  const nuevas = abre.filter((e) => !cierres.has(e.id));
  pila.forEach((e) => { if (cierres.has(e.id)) e.vivo = false; });
  let atras = 0;
  while (pila.length && !pila[pila.length - 1].vivo) { pila.pop(); atras++; }
  try {
    for (const e of nuevas) {
      if (atras > 0) { history.replaceState({ ...(history.state || {}), dcAtras: e.id }, ""); atras--; }
      else history.pushState({ ...(history.state || {}), dcAtras: e.id }, "");
      pila.push(e);
    }
    if (atras > 0) history.go(-atras);
  } catch (err) { /* el historial nunca debe romper la página */ }
}
const programar = () => { if (programado) return; programado = true; Promise.resolve().then(flush); };

if (navegador) {
  window.addEventListener("popstate", () => {
    const cur = idActual();
    const cerrar = [];
    while (pila.length && pila[pila.length - 1].id > cur) cerrar.push(pila.pop());
    cerrar.forEach((e) => { if (e.vivo) { e.vivo = false; try { e.cerrar(); } catch (err) {} } });
    // si quedó una entrada "muerta" arriba, se salta
    let extra = 0;
    while (pila.length && !pila[pila.length - 1].vivo) { pila.pop(); extra++; }
    if (extra) { try { history.go(-extra); } catch (err) {} }
  });
}

export function useAtras(abierta, cerrar) {
  const ref = useRef(cerrar);
  ref.current = cerrar;
  useEffect(() => {
    if (!navegador || !abierta) return undefined;
    const e = { id: ++seq, vivo: true, cerrar: () => ref.current && ref.current() };
    pend.abre.push(e); programar();
    return () => { pend.cierra.push(e.id); programar(); };
  }, [abierta]);
}
