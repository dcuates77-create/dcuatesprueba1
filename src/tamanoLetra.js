// TAMAÑO DE LETRA (A+): 3 niveles que se recuerdan en el teléfono. Usa el zoom del navegador sobre toda la página.
const NIV = [1, 1.15, 1.25];
export const NOMBRES_LETRA = ["Normal", "Grande", "Muy grande"];
export const leerLetra = () => { try { const n = parseInt(localStorage.getItem("dc_letra") || "0", 10); return n >= 0 && n < NIV.length ? n : 0; } catch (e) { return 0; } };
export function aplicarLetra(n) { try { document.body.style.zoom = NIV[n] === 1 ? "" : String(NIV[n]); document.body.classList.toggle("dc-letra-xl", n === 2); } catch (e) {} }
export function ciclarLetra() {
  const n = (leerLetra() + 1) % NIV.length;
  try { localStorage.setItem("dc_letra", String(n)); } catch (e) {}
  aplicarLetra(n);
  window.dispatchEvent(new CustomEvent("dcuates:letra"));
  return n;
}
