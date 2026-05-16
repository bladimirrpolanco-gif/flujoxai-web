import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WebChatWidget } from "@/components/web-chat-widget";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flujobot - Automatización Empresarial con Inteligencia Artificial",
  description: "Potencia tu negocio con agentes de IA especializados en WhatsApp, Instagram y procesos empresariales.",
  keywords: ["automatización con IA", "chatbots WhatsApp", "inteligencia artificial empresarial", "automatización de procesos", "agentes IA", "República Dominicana", "Flujobot"],
  authors: [{ name: "Flujobot" }],
  openGraph: {
    title: "Flujobot - Automatización Empresarial con IA",
    description: "Agentes de IA que atienden tu negocio 24/7.",
    url: "https://flujobot.flujoxai.com",
    siteName: "Flujobot",
    locale: "es_DO",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flujobot - IA para tu Negocio",
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
          <WebChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
