import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recursos Gratuitos | Plantillas n8n — FlujoxAI",
  description:
    "Descarga plantillas JSON de n8n listas para usar: chatbots de WhatsApp, automatizaciones de CRM, agentes de IA y mucho más. Gratis para tu negocio.",
  keywords: [
    "plantillas n8n",
    "n8n templates",
    "automatización whatsapp",
    "workflows n8n gratis",
    "json n8n",
    "automatización empresarial",
    "FlujoxAI recursos",
  ],
  openGraph: {
    title: "Plantillas n8n Gratis — FlujoxAI Recursos",
    description:
      "Workflows de n8n listos para importar: WhatsApp, CRM, IA y más.",
    url: "https://flujoxai.com/recursos",
    siteName: "FlujoxAI",
  },
};

export default function RecursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
