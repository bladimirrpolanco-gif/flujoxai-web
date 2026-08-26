import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de costo de WhatsApp API | FlujoxAI",
  description:
    "Calcula el costo mensual real de WhatsApp API en RD con tarifas Meta, proyección para octubre 2026 y conversión a DOP editable.",
  openGraph: {
    title: "Calculadora de costo de WhatsApp API | FlujoxAI",
    description:
      "Estimación detallada de marketing, utility, service y Meta Agent con cambio de tarifa en octubre de 2026.",
    type: "website",
  },
};

export default function WhatsAppCalculatorPage() {
  return (
    <main className="h-screen w-full bg-background">
      <iframe
        src="/calculadora-whatsapp-api-real.html"
        title="Calculadora de costo de WhatsApp API"
        className="h-full w-full border-0"
      />
    </main>
  );
}
