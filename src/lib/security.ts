import "server-only";

/**
 * Utilidades de seguridad para las rutas del servidor:
 * - rateLimit: límite de peticiones por IP (ventana deslizante en memoria).
 *   En Vercel cada instancia tiene su propia memoria, así que esto frena
 *   abusos simples; para un límite global, activa también una regla de
 *   "Rate Limiting" en Vercel Firewall.
 * - isAllowedOrigin: protección CSRF para las rutas API (POST desde otro sitio).
 * - logSecurityEvent: registro estructurado de actividad sospechosa (visible en
 *   los logs de Vercel, filtrando por "[SECURITY]").
 */

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for") || "";
  return (fwd.split(",")[0] || headers.get("x-real-ip") || "unknown").trim();
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) || { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (!b.hits.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return true;
}

const ALLOWED_HOSTS = new Set(
  [
    "flujoxai.com",
    "www.flujoxai.com",
    ...(process.env.EXTRA_ALLOWED_HOSTS || "").split(",").map((h) => h.trim()).filter(Boolean),
  ]
);

export function isAllowedOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  if (!origin) return false; // los navegadores siempre envían Origin en POST con fetch
  try {
    const { hostname } = new URL(origin);
    if (ALLOWED_HOSTS.has(hostname)) return true;
    if (process.env.NODE_ENV !== "production" && hostname === "localhost") return true;
    if (process.env.VERCEL_ENV === "preview" && hostname.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

export function logSecurityEvent(event: string, details: Record<string, unknown> = {}) {
  console.warn(`[SECURITY] ${event}`, JSON.stringify({ at: new Date().toISOString(), ...details }));
}

// ---- Validación de entradas ----
export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i;
export const PHONE_RE = /^[+\d][\d\s().-]{6,24}$/;

export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // quita caracteres de control (excepto saltos de línea y tabulaciones)
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function cleanList(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((v) => cleanText(v, maxLen)).filter(Boolean);
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
