"use client";

import { Navbar } from "@/components/navbar";

import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Contact } from "@/components/contact";
import { ChatbotSimulator } from "@/components/chatbot";
import { AutomationFlow } from "@/components/automation-flow";
import { IntegrationsHub } from "@/components/integrations-hub";
import { ScrollToTop } from "@/components/scroll-to-top";
import { WhatsAppButton } from "@/components/whatsapp-button";

import { useEffect } from "react";
import { trackEvent } from "@/lib/metrics";

export default function Home() {
  useEffect(() => {
    trackEvent('visita', { path: '/' });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">

      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <AutomationFlow />
        <IntegrationsHub />
        <ChatbotSimulator />
        <Contact />

      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  );
}
