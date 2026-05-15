import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Términos de Servicio | FlujoXAI",
  description: "Términos y condiciones de uso de los servicios de FlujoXAI.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Flujo<span className="text-primary">XAI</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Términos de Servicio
          </h1>
          <p className="text-sm text-muted-foreground">Última actualización: 23 de abril de 2026</p>
        </div>

        <div className="space-y-10 text-foreground/80 leading-relaxed">

          <Section title="1. Descripción del servicio">
            <p>
              FLUJOXAI es una plataforma de software que permite a empresas automatizar su atención al cliente a través de WhatsApp Business API, Instagram y Facebook Messenger, utilizando inteligencia artificial. FLUJOXAI actúa como proveedor tecnológico intermediario entre la empresa cliente y las plataformas de mensajería de Meta Platforms, Inc.
            </p>
          </Section>

          <Section title="2. Uso aceptable">
            <p>Está estrictamente prohibido usar FLUJOXAI para:</p>
            <ul>
              <li>Envío de spam o mensajes no solicitados masivos</li>
              <li>Distribución de contenido ilegal o fraudulento</li>
              <li>Discursos de odio, acoso o discriminación</li>
              <li>Violar las políticas de uso de Meta, WhatsApp Business o Instagram</li>
              <li>Suplantar identidades o inducir a error a los usuarios finales</li>
            </ul>
            <p>
              El incumplimiento de estas normas resultará en la suspensión inmediata del servicio sin derecho a reembolso.
            </p>
          </Section>

          <Section title="3. Responsabilidades del cliente">
            <p>La empresa que contrata FLUJOXAI se compromete a:</p>
            <ul>
              <li>Obtener el opt-in explícito de los usuarios finales antes de iniciar conversaciones de marketing o ventas</li>
              <li>Respetar la ventana de atención al cliente de 24 horas de WhatsApp Business</li>
              <li>Cumplir con la Ley 172-13 de Protección de Datos de República Dominicana</li>
              <li>No transmitir datos personales de usuarios a terceros sin consentimiento</li>
              <li>Informar a sus usuarios del uso de IA en las respuestas automatizadas</li>
            </ul>
          </Section>

          <Section title="4. Limitación de responsabilidad">
            <p>
              FLUJOXAI es un intermediario tecnológico. No somos responsables del contenido enviado por nuestros clientes a través de la plataforma, ni de las decisiones comerciales que estos tomen basándose en los datos procesados. La responsabilidad de FLUJOXAI se limita al correcto funcionamiento técnico de la plataforma conforme al acuerdo de nivel de servicio (SLA) correspondiente.
            </p>
          </Section>

          <Section title="5. Propiedad intelectual">
            <p>
              La plataforma FLUJOXAI, su código, diseño, marca y contenidos son propiedad de Antonio Polanco Ramírez. El cliente recibe una licencia de uso no exclusiva, intransferible y revocable durante la vigencia del contrato de servicio.
            </p>
          </Section>

          <Section title="6. Contacto">
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 space-y-3">
              {[
                { label: "Nombre",    value: "Antonio Polanco Ramírez" },
                { label: "RNC",       value: "402-34117-048" },
                { label: "Domicilio", value: "Calle Corazón de Jesús #7, Almirante II, San Luis, Santo Domingo Este, República Dominicana" },
                { label: "Email",     value: "antonio@flujoxai.com" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 text-sm">
                  <span className="font-semibold text-foreground min-w-[100px]">{label}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FlujoXAI — Antonio Polanco Ramírez. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link href="/terminos" className="text-primary font-medium">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-foreground border-l-4 border-primary pl-4">{title}</h2>
      <div className="space-y-3 pl-1 [&_ul]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-foreground/70">
        {children}
      </div>
    </section>
  );
}
