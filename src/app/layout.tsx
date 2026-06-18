import type { Metadata } from "next";
import { Inter, Syne, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsSensor } from "@/components/analytics-sensor";
import { CookieBanner } from "@/components/cookie-banner";

const font = Inter({ subsets: ["latin"] });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", style: ["italic", "normal"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://flujoxai.com"),
  title: "FlujoxAI - Automatización Empresarial con Inteligencia Artificial",
  description: "Potencia tu negocio con agentes de IA especializados en WhatsApp, Instagram y procesos empresariales.",
  keywords: ["automatización con IA", "chatbot", "agente ai", "chatbots WhatsApp", "inteligencia artificial", "ia", "servicios de automatización", "FlujoxAI"],
  authors: [{ name: "FlujoxAI" }],
  openGraph: {
    title: "FlujoxAI - Automatización Empresarial con IA",
    description: "Agentes de IA que atienden tu negocio 24/7.",
    url: "https://flujoxai.com",
    siteName: "FlujoxAI",
    locale: "es_DO",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlujoxAI - IA para tu Negocio",
    description: "Chatbots y automatización de procesos con Inteligencia Artificial.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${syne.variable} ${playfair.variable}`}>
      <body className={`${font.className} antialiased selection:bg-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsSensor />
          <CookieBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
