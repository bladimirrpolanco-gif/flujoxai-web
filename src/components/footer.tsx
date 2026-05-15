import Link from "next/link";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-12 md:py-16">
      <div className="container grid gap-8 md:grid-cols-4 px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl inline-block">
              Flujo<span className="text-primary">XAI</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Especialistas en automatización empresarial con Inteligencia Artificial. Transformamos visitantes en leads y optimizamos tus procesos.
          </p>
        </div>
        <div className="grid gap-4">
          <h3 className="font-semibold text-foreground">Servicios</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li><Link href="#servicios" className="hover:text-foreground">Chatbots para WhatsApp</Link></li>
            <li><Link href="#servicios" className="hover:text-foreground">Automatización Empresarial</Link></li>
            <li><Link href="#servicios" className="hover:text-foreground">Integraciones CRM</Link></li>
          </ul>
        </div>
        <div className="grid gap-4">
          <h3 className="font-semibold text-foreground">Empresa</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li><Link href="#contacto" className="hover:text-foreground">Contacto</Link></li>
            <li><Link href="/privacidad" className="hover:text-foreground">Política de Privacidad</Link></li>
            <li><Link href="/terminos" className="hover:text-foreground">Términos de Servicio</Link></li>
          </ul>
        </div>
        <div className="grid gap-4">
          <h3 className="font-semibold text-foreground">Contacto</h3>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>antonio@flujoxai.com</li>
            <li>Piantini, Santo Domingo, República Dominicana</li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 border-t pt-8 px-4 md:px-6">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} FlujoXAI. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
