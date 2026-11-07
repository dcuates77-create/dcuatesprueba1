// api/guia.js — Acceso de administrador a la «Guía Visual» (se valida EN EL SERVIDOR).
//
// CONFIGURACIÓN (una vez): Vercel > Settings > Environment Variables:
//    GUIA_CLAVE    = la contraseña de administrador que tú elijas (obligatoria)
//    GUIA_SECRETO  = (opcional) texto largo al azar para firmar sesiones; si falta se usa GUIA_CLAVE
// y luego Redeploy. Sin GUIA_CLAVE el acceso queda cerrado (503).
//
//   POST /api/guia           {clave}  -> {ok:true, token}   (sesión de 2 horas)
//   GET  /api/guia?a=datos   Authorization: Bearer <token> -> {ok:true, guia}
import crypto from "node:crypto";
import { GUIA } from "./_guiaDatos.js";

const DURACION_MS = 2 * 60 * 60 * 1000;

function secreto() { return String(process.env.GUIA_SECRETO || process.env.GUIA_CLAVE || ""); }
function firmar(carga) { return crypto.createHmac("sha256", secreto()).update(carga).digest("base64url"); }
function iguales(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}
function crearToken() {
  const carga = Buffer.from(JSON.stringify({ r: "admin", exp: Date.now() + DURACION_MS })).toString("base64url");
  return carga + "." + firmar(carga);
}
export function tokenValido(token) {
  if (!secreto() || typeof token !== "string" || token.indexOf(".") < 1) return false;
  const [carga, firma] = token.split(".");
  if (!iguales(firma, firmar(carga))) return false;
  try { const o = JSON.parse(Buffer.from(carga, "base64url").toString("utf8")); return o.r === "admin" && o.exp > Date.now(); } catch { return false; }
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (!process.env.GUIA_CLAVE) return res.status(503).json({ ok: false, motivo: "sin-configurar" });

  if (req.method === "POST") {
    let cuerpo = req.body;
    if (typeof cuerpo === "string") { try { cuerpo = JSON.parse(cuerpo); } catch { cuerpo = {}; } }
    const clave = String((cuerpo && cuerpo.clave) || "");
    await new Promise((r) => setTimeout(r, 400)); // frena adivinar claves a ráfagas
    if (!clave || !iguales(clave, process.env.GUIA_CLAVE)) return res.status(401).json({ ok: false, motivo: "clave" });
    return res.status(200).json({ ok: true, token: crearToken() });
  }

  if (req.method === "GET") {
    const h = String(req.headers.authorization || "");
    const token = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!tokenValido(token)) return res.status(401).json({ ok: false, motivo: "sesion" });
    return res.status(200).json({ ok: true, guia: GUIA });
  }
  return res.status(405).json({ ok: false });
}
