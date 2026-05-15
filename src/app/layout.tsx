import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlujoXAI - Automatización Empresarial con Inteligencia Artificial",
  description: "Diseñamos chatbots inteligentes, automatizamos procesos y conectamos tus herramientas con IA. Soluciones para empresas en República Dominicana y Latinoamérica.",
  keywords: ["automatización con IA", "chatbots WhatsApp", "inteligencia artificial empresarial", "automatización de procesos", "agentes IA", "República Dominicana", "FlujoXAI"],
  authors: [{ name: "FlujoXAI" }],
  openGraph: {
    title: "FlujoXAI - Automatización Empresarial con IA",
    description: "Chatbots inteligentes, automatización de procesos e integraciones para que tu negocio opere solo.",
    url: "https://flujoxai.com",
    siteName: "FlujoXAI",
    locale: "es_DO",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlujoXAI - IA para tu Negocio",
    description: "Chatbots y automatización de procesos con Inteligencia Artificial.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${font.className} antialiased selection:bg-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
