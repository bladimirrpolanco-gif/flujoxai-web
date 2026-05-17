import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad | Flujobot",
  description: "Política de privacidad y tratamiento de datos personales de Flujobot.",
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-sm text-muted-foreground">Última actualización: 23 de abril de 2026</p>
        </div>

        <div className="space-y-10 text-foreground/80 leading-relaxed">

          <Section title="1. Responsable del tratamiento">
            <p>
              Antonio Polanco Ramírez, RNC 40234117048, con domicilio en Calle Corazón de Jesús #7, Almirante II, San Luis, Santo Domingo Este, República Dominicana.
            </p>
          </Section>

          <Section title="2. Datos que procesamos">
            <p>
              A través de WhatsApp Business API, procesamos los siguientes datos cuando usted interactúa con una empresa que usa FLUJOBOT:
            </p>
            <ul>
              <li>Número de teléfono</li>
              <li>Nombre de perfil de WhatsApp</li>
              <li>Mensajes que usted envía a nuestros clientes empresariales</li>
            </ul>
            <p>No accedemos a su lista de contactos ni a mensajes con otros usuarios.</p>
          </Section>

          <Section title="3. Finalidad">
            <p>
              Automatizar respuestas de atención al cliente para las empresas que usted contacta. Solo procesamos datos bajo instrucción directa de la empresa que contrata FLUJOBOT. Actuamos como encargados del tratamiento, no como responsables de los datos de los usuarios finales.
            </p>
          </Section>

          <Section title="4. Base legal">
            <p>
              Consentimiento. Usted acepta el tratamiento al iniciar una conversación con una empresa que usa FLUJOBOT. Puede solicitar su exclusión en cualquier momento escribiendo <strong>"SALIR"</strong> al número de WhatsApp de la empresa con la que interactúa.
            </p>
          </Section>

          <Section title="5. Cumplimiento normativo">
            <p>FLUJOBOT cumple con:</p>
            <ul>
              <li>Ley 172-13 de Protección de Datos Personales de República Dominicana</li>
              <li>Reglamento General de Protección de Datos (GDPR)</li>
              <li>Política de WhatsApp Business de Meta Platforms, Inc.</li>
            </ul>
            <p>
              Los datos se alojan en servidores seguros y no se venden ni ceden a terceros bajo ninguna circunstancia.
            </p>
          </Section>

          <Section title="6. Sus derechos">
            <p>
              Usted tiene derecho a acceder, rectificar y solicitar la eliminación de sus datos. Para ejercer cualquiera de estos derechos, escríbanos a{" "}
              <a href="mailto:soporte@flujoxai.com" className="text-primary hover:underline">
                soporte@flujoxai.com
              </a>.
            </p>
            <p>También puede consultar nuestra página de eliminación de datos para instrucciones detalladas.</p>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="container max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Flujobot — Antonio Polanco Ramírez. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="text-primary font-medium">Privacidad</Link>
            <Link href="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
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
