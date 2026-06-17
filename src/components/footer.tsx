import Link from "next/link";
import { Bot, Mail, MapPin, ArrowRight } from "lucide-react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
}

const SERVICES = [
  { label: "Agentes IA para WhatsApp",    href: "#servicios" },
  { label: "Automatización de Procesos",  href: "#servicios" },
  { label: "Integraciones CRM & ERP",     href: "#servicios" },
  { label: "Agendamiento Inteligente",    href: "#servicios" },
];

const COMPANY = [
  { label: "Inicio",                href: "/" },
  { label: "Servicios",             href: "#servicios" },
  { label: "Blog",                  href: "/blog" },
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
                Flujo<span className="text-primary">xAI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Automatizamos empresas con Inteligencia Artificial. Chatbots, procesos e integraciones que trabajan 24/7 por ti.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:soporte@flujoxai.com" className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5">
                  <Mail className="h-4 w-4" />
                </div>
                soporte@flujoxai.com
              </a>
              <span className="flex items-center gap-2 text-zinc-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                Piantini, Santo Domingo, RD
              </span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { href: "https://instagram.com/flujoxai", icon: <InstagramIcon />, label: "Instagram" },
                { href: "https://facebook.com/flujoxai", icon: <FacebookIcon />,  label: "Facebook"  },
                { href: "https://tiktok.com/@flujoxai",  icon: <TikTokIcon />,    label: "TikTok"    },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-xl bg-zinc-800 hover:bg-primary text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Producto */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Producto</h4>
            <ul className="flex flex-col gap-3">
              {/* <li>
                <a 
                  href="https://flujobot.flujoxai.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 group"
                >
                  <span className="h-px w-3 bg-zinc-700 group-hover:bg-primary group-hover:w-4 transition-all" />
                  Flujobot
                </a>
              </li> */}
              <li>
                <Link href="/cotizador" className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="h-px w-3 bg-zinc-700 group-hover:bg-primary group-hover:w-4 transition-all" />
                  Cotizador Automático
                </Link>
              </li>
            </ul>
          </div>

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
          <p>&copy; {new Date().getFullYear()} FlujoxAI — Antonio Polanco Ramírez · RNC 402-34117-048</p>
        </div>
      </div>
    </footer>
  );
}
