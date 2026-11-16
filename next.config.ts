import type { NextConfig } from "next";

const securityHeaders = [
  // Evita que el navegador renderice la página dentro de un iframe (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Evita que el navegador haga MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Activa el filtro XSS del navegador (legacy, pero útil)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Controla cuánta info del referrer se envía
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restringe el uso de APIs sensibles del navegador
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // DNS prefetch para rendimiento
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La calculadora de WhatsApp API se eliminó: los enlaces viejos van al cotizador
      { source: "/calculadora-whatsapp-api", destination: "/cotizador", permanent: true },
      { source: "/calculadora-whatsapp-api-real.html", destination: "/cotizador", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
