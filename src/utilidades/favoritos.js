// FAVORITOS (e84b): la persona guarda emprendimientos con ♥. Se queda en el celular (localStorage), sin pedir datos.
import { useEffect, useState } from "react";
const K = "dc_fav";
export const leerFavoritos = () => {
  try { const v = JSON.parse(localStorage.getItem(K) || "[]"); return Array.isArray(v) ? v.filter((s) => typeof s === "string").slice(0, 200) : []; } catch (e) { return []; }
};
export function alternarFavorito(slug) {
  const s = String(slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!s) return false;
  const a = leerFavoritos(); const i = a.indexOf(s);
  if (i >= 0) a.splice(i, 1); else a.unshift(s);
  try { localStorage.setItem(K, JSON.stringify(a)); } catch (e) { /* sin almacenamiento */ }
  window.dispatchEvent(new CustomEvent("dcuates:favoritos"));
  return i < 0;
}
export function useFavoritos() {
  const [lista, setLista] = useState(leerFavoritos);
  useEffect(() => {
    const al = () => setLista(leerFavoritos());
    window.addEventListener("dcuates:favoritos", al);
    return () => window.removeEventListener("dcuates:favoritos", al);
  }, []);
  return lista;
}
