import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    <main className="relative h-screen w-full bg-background">
      <div className="pointer-events-none fixed left-4 top-4 z-50">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#0877f9] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(8,119,249,0.35)] transition-colors hover:bg-[#0565E8]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a inicio
        </Link>
      </div>
      <iframe
        src="/calculadora-whatsapp-api-real.html"
        title="Calculadora de costo de WhatsApp API"
        className="h-full w-full border-0"
      />
    </main>
  );
}
