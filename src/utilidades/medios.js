// SOPORTE MULTIMEDIA UNIVERSAL (e89): decide cómo mostrar cada enlace de Logo, Portada y Galería.
// Una celda puede traer varios enlaces separados por «|».
// Tipos: yt · vimeo · drive · mp4 (archivo directo) · social (TikTok, Instagram, Facebook: tarjeta con botón) · pagina (enlace de página de Pexels, no de archivo) · img.

export const dividir = (x) => String(x || "").split("|").map((u) => u.trim()).filter(Boolean);

const idDrive = (u) => {
  const m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/i) || u.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]+)/i) || u.match(/lh3\.googleusercontent\.com\/d\/([\w-]+)/i);
  return m ? m[1] : "";
};

// Imagen de Drive → formato directo que no se bloquea. Cualquier otra imagen queda igual.
export const imgDirecta = (u) => {
  const url = String(u || "").trim();
  if (!/^https:\/\//i.test(url)) return "";
  const id = idDrive(url);
  return id ? "https://lh3.googleusercontent.com/d/" + id : url;
};

export function claseMedio(entrada) {
  const u = String(typeof entrada === "string" ? entrada : (entrada && (entrada.u || entrada.url)) || "").trim();
  if (!/^https?:\/\//i.test(u)) return null;
  const y = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtube-nocookie\.com\/embed\/)([\w-]{11})/i);
  if (y) return { t: "yt", id: y[1], u };
  const v = u.match(/vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d{5,})/i);
  if (v && !/player\.vimeo\.com\/external\//i.test(u)) return { t: "vimeo", id: v[1], u };
  const d = idDrive(u);
  if (d && /drive\.google\.com/i.test(u)) return { t: "drive", id: d, u };
  if (/tiktok\.com\//i.test(u)) return { t: "social", red: "TikTok", u };
  if (/instagram\.com\/(?:reel|reels|p|tv)\//i.test(u)) return { t: "social", red: "Instagram", u };
  if (/(?:facebook\.com|fb\.watch)\//i.test(u)) return { t: "social", red: "Facebook", u };
  if (/(?:^|\/\/)(?:www\.)?pexels\.com\/(?:[a-z-]+\/)?(?:video|photo)\//i.test(u)) return { t: "pagina", u };
  const sinParam = u.split(/[?#]/)[0];
  if (/\.(mp4|webm|ogg|ogv|m4v|mov)$/i.test(sinParam)) return { t: "mp4", u };
  if (/player\.vimeo\.com\/external\/|videos\.pexels\.com|cdn\.pixabay\.com\/(?:video|vimeo)\/|\/video\/upload\//i.test(u)) return { t: "mp4", u };
  return { t: "img", u: imgDirecta(u) };
}

// Normaliza lo que manda el servidor ({t:"yt",id} · {t:"mp4",u} · {t:"img",u} · {t:"u",u}) o un texto suelto.
export function aMedio(m) {
  if (!m) return null;
  if (typeof m === "string") return claseMedio(m);
  if (m.t === "yt" && m.id) return { t: "yt", id: m.id, u: "https://youtu.be/" + m.id };
  if (m.t === "mp4" && m.u) return { t: "mp4", u: m.u };
  if (m.t === "img" && m.u) return { t: "img", u: imgDirecta(m.u) };
  return claseMedio(m);
}
