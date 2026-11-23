"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

type Product = {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  features: string[];
  href: string;
  domain: string;
  audience: string;
  accent: string;
  badge?: string;
};

// Plataformas propias de FlujoxAI. Para añadir otra: su logo en public/productos/ y una entrada aquí.
const PRODUCTS: Product[] = [
  {
    name: "Flujobot",
    logo: "/productos/flujobot.svg",
    tagline: "Agente IA para WhatsApp",
    description: "Atiende tu WhatsApp 24/7: responde a tus clientes, agenda citas y captura cada contacto mientras tú duermes.",
    features: ["Respuestas al instante", "Citas y seguimiento", "Para cualquier negocio"],
    href: "https://flujobot.flujoxai.com/es",
    domain: "flujobot.flujoxai.com",
    audience: "Negocios",
    accent: "#25D366",
  },
  {
    name: "DespachIA",
    logo: "/productos/despachia.svg",
    tagline: "Pedidos por WhatsApp para colmados",
    description: "El chatbot toma el pedido por WhatsApp, lo pasa al panel del colmado y el ticket sale impreso solo.",
    features: ["Pedidos sin errores", "Catálogo y precios propios", "Impresión automática"],
    href: "https://despachia.flujoxai.com",
    domain: "despachia.flujoxai.com",
    audience: "Colmados",
    accent: "#15803d",
  },
  {
    name: "Clipper",
    logo: "/productos/clipper.svg",
    tagline: "De video largo a clips virales",
    description: "Sube un video o pega un link y recibe clips verticales con subtítulos, listos para Reels, TikTok y Shorts.",
    features: ["Elige los mejores momentos", "Subtítulos automáticos", "Formato vertical 9:16"],
    href: "https://clipper.flujoxai.com",
    domain: "clipper.flujoxai.com",
    audience: "Creadores",
    accent: "#FF5A36",
  },
  {
    name: "TravIA",
    logo: "/productos/travia.svg",
    tagline: "Plataforma para agencias de viajes",
    description: "Clientes, reservas, cobros en RD$ y US$ e itinerarios en una sola cuenta, con un asistente que cotiza desde WhatsApp.",
    features: ["Reservas y cobros", "Itinerarios por enlace", "Asistente de cotización"],
    href: "https://travia.flujoxai.com",
    domain: "travia.flujoxai.com",
    audience: "Agencias de viajes",
    accent: "#0e6b6b",
    badge: "Lista de espera",
  },
];

export function Products() {
  return (
    <section id="productos" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(ellipse, rgba(8, 119, 249, 0.22) 0%, transparent 70%)" }} />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
            Nuestros Productos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Plataformas hechas por{" "}
            <span className="gradient-text">FlujoxAI</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Además de proyectos a la medida, creamos nuestras propias plataformas listas para usar en República Dominicana.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative flex flex-col glass rounded-3xl p-7 md:p-8 border border-white/10 hover:border-white/25 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute top-0 left-6 right-6 h-px opacity-70 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />

              <div className="flex items-start gap-4 mb-5">
                <Image
                  src={p.logo}
                  alt={`Logo de ${p.name}`}
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 rounded-2xl shadow-lg ring-1 ring-white/15 flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                    {p.badge && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border border-amber-400/40 text-amber-500">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-primary">{p.tagline}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-1">{p.description}</p>

              <ul className="space-y-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-5 border-t border-white/10 text-xs">
                <span className="text-muted-foreground">Para: <b className="text-foreground/80 font-semibold">{p.audience}</b></span>
                <span className="font-mono text-muted-foreground group-hover:text-foreground transition-colors">{p.domain}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
