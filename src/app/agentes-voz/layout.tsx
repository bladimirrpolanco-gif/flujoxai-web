import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentes de Voz con IA | FlujoxAI",
  description:
    "Agentes de voz con inteligencia artificial que contestan llamadas, agendan citas y hacen seguimiento a leads por teléfono, 24/7 y sin intervención humana.",
  keywords: [
    "agentes de voz",
    "ia por telefono",
    "voz ia",
    "atencion telefonica automatizada",
    "agente de llamadas ia",
    "FlujoxAI voz",
  ],
  openGraph: {
    title: "Agentes de Voz con IA — FlujoxAI",
    description:
      "Contesta, llama y agenda por teléfono con inteligencia artificial, 24/7.",
    url: "https://flujoxai.com/agentes-voz",
    siteName: "FlujoxAI",
  },
};

export default function AgentesVozLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
