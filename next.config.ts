import type { NextConfig } from "next";

// Content-Security-Policy: limita desde dónde se pueden cargar scripts, frames, etc.
// Permite AdSense (Google) y Supabase, que el sitio usa.
const supabaseOrigin = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.gstatic.com https://*.doubleclick.net https://*.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} ${supabaseOrigin.replace("https://", "wss://")} https://*.google.com https://*.googlesyndication.com https://*.doubleclick.net https://*.adtrafficquality.google`,
  "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://www.youtube.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Fuerza HTTPS por 2 años (incluye subdominios)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
  // Evita que el navegador renderice la página dentro de un iframe ajeno (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Evita que el navegador haga MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // El filtro XSS antiguo de los navegadores causa más problemas de los que evita: se desactiva (recomendación OWASP)
  { key: "X-XSS-Protection", value: "0" },
  // Controla cuánta info del referrer se envía
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restringe el uso de APIs sensibles del navegador
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // El panel admin y las APIs nunca se cachean ni se indexan
      {
        source: "/(admin|api)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
