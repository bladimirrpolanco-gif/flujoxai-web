import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt gratis: Auditor de Skills de IA | FlujoxAI",
  description:
    "Copia este prompt y pídele a Claude, ChatGPT o Codex que revise un skill antes de instalarlo: detecta descargas ocultas, robo de contraseñas y envío de datos.",
  keywords: [
    "skills maliciosas",
    "auditar skill claude",
    "seguridad agentes de ia",
    "prompt ciberseguridad",
    "claude code skills",
    "FlujoxAI prompts",
  ],
  openGraph: {
    title: "Auditor de Skills de IA — Prompt gratis de FlujoxAI",
    description:
      "Revisa si un skill es seguro ANTES de instalarlo. Copia el prompt y pégalo en tu IA.",
    url: "https://flujoxai.com/prompts/auditor-skills",
    siteName: "FlujoxAI",
  },
};

export default function AuditorSkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
