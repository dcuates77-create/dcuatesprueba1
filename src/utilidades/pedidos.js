// Pedidos del catálogo (e82c). Al tocar «Pedir» se registra el pedido en tu hoja («PedidosCatalogo») y se abre el WhatsApp del negocio.
// El pedido queda también en este teléfono (14 días) para poder confirmar después «se concretó» y recibir sorpresas.
// Nunca se envían datos personales: solo negocio, producto, número de Pase (si la persona lo tiene guardado) y el monto que ella misma escriba.
import { GOOGLE_SHEETS_URL, esAdmin } from "../datos/config.js";

const LLAVE = "dc_pedidos", DIAS = 14;
export const leerPedidos = () => { try { const a = JSON.parse(localStorage.getItem(LLAVE) || "[]"); return (Array.isArray(a) ? a : []).filter((x) => x && x.id && Date.now() - x.t < DIAS * 864e5); } catch (e) { return []; } };
const guardar = (a) => { try { localStorage.setItem(LLAVE, JSON.stringify(a.slice(-20))); } catch (e) { /* sin almacenamiento */ } };
export const enviar = (obj) => {
  try {
    if (typeof window === "undefined" || /^(localhost|127\.|\[::1\])/.test(window.location.hostname) || esAdmin()) return;
    fetch(GOOGLE_SHEETS_URL, { method: "POST", mode: "no-cors", keepalive: true, body: new URLSearchParams(obj) }).catch(() => {});
  } catch (e) { /* nunca rompe la página */ }
};
export const paseGuardado = () => { try { const o = JSON.parse(localStorage.getItem("dc_tarjeta") || "null"); return o && o.n ? String(o.n) : ""; } catch (e) { return ""; } };
export function nuevoId() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s = "";
  try { const b = new Uint8Array(8); crypto.getRandomValues(b); b.forEach((x) => { s += A[x % A.length]; }); } catch (e) { for (let i = 0; i < 8; i++) s += A[Math.floor(Math.random() * A.length)]; }
  return s;
}
export function registrarPedido(slug, negocio, producto, precio, prod) {
  const id = nuevoId();
  guardar([...leerPedidos(), { id, s: slug, n: negocio, p: producto, pr: precio || "", t: Date.now(), c: 0, d: 0 }]);
  enviar({ Tipo: "NegocioPedido", Slug: slug, Id: id, Producto: producto, Precio: precio || "", Pase: paseGuardado(), ...(prod ? { Prod: prod } : {}) });
  return id;
}
const marcar = (id, campos) => guardar(leerPedidos().map((x) => (x.id === id ? { ...x, ...campos } : x)));
export function confirmarPedido(id, pase, monto) { enviar({ Tipo: "NegocioPedidoConfirma", Rol: "C", Id: id, Pase: pase || "", Monto: monto || "" }); marcar(id, { c: 1 }); }
export const descartarPedido = (id) => marcar(id, { d: 1 });
// Pedido pendiente de confirmar para este negocio (el más reciente).
export const pedidoPendiente = (slug) => leerPedidos().filter((x) => x.s === slug && !x.c && !x.d).slice(-1)[0] || null;
