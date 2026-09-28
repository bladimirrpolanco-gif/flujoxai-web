import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentes de IA para tu Negocio | FlujoxAI",
  description:
    "Agentes de inteligencia artificial que atienden, califican y convierten clientes 24/7 en WhatsApp, Instagram y tu web. Con memoria, contexto y conexión a tu CRM.",
  keywords: [
    "agentes de ia",
    "agentes ai",
    "chatbot whatsapp",
    "asistente virtual con ia",
    "automatización de atención al cliente",
    "FlujoxAI agentes",
  ],
  openGraph: {
    title: "Agentes de IA que atienden tu negocio 24/7 — FlujoxAI",
    description:
      "Agentes conversacionales con IA que responden, califican leads y agendan citas sin intervención humana.",
    url: "https://flujoxai.com/agentes-ia",
    siteName: "FlujoxAI",
  },
};

export default function AgentesIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
