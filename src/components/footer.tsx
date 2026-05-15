import Link from "next/link";
import { Bot, Mail, MapPin, ArrowRight } from "lucide-react";

const SERVICES = [
  { label: "Agentes IA para WhatsApp",    href: "#servicios" },
  { label: "Automatización de Procesos",  href: "#servicios" },
  { label: "Integraciones CRM & ERP",     href: "#servicios" },
  { label: "Agendamiento Inteligente",    href: "#servicios" },
];

const COMPANY = [
  { label: "Inicio",                href: "/" },
  { label: "Servicios",             href: "#servicios" },
  { label: "Contacto",              href: "#contacto" },
  { label: "Política de Privacidad",href: "/privacidad" },
  { label: "Términos de Servicio",  href: "/terminos"  },
];

export function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-zinc-400 overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* CTA Banner */}
      <div className="border-b border-zinc-800/60">
        <div className="container max-w-6xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
              ¿Listo para automatizar tu negocio?
            </h3>
            <p className="text-zinc-400 text-sm">Agenda una llamada gratuita y te mostramos cómo funciona.</p>
          </div>
          <Link href="#contacto">
            <button className="flex items-center gap-2 h-12 px-8 rounded-2xl font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex-shrink-0">
              Hablar con un Experto
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Flujo<span className="text-primary">XAI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Automatizamos empresas con Inteligencia Artificial. Chatbots, procesos e integraciones que trabajan 24/7 por ti.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:antonio@flujoxai.com" className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5" />
                antonio@flujoxai.com
              </a>
              <span className="flex items-center gap-2 text-zinc-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                Piantini, Santo Domingo, RD
              </span>
            </div>
          </div>

          {/* Spacer on desktop */}
          <div className="hidden md:block" />

          {/* Services */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Servicios</h4>
            <ul className="flex flex-col gap-3">
              {SERVICES.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="h-px w-3 bg-zinc-700 group-hover:bg-primary group-hover:w-4 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Empresa</h4>
            <ul className="flex flex-col gap-3">
              {COMPANY.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 group">
                    <span className="h-px w-3 bg-zinc-700 group-hover:bg-primary group-hover:w-4 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="container max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} FlujoXAI — Antonio Polanco Ramírez · RNC 402-34117-048</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Todos los sistemas operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
