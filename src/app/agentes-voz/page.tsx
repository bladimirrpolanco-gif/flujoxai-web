"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, PhoneIncoming, PhoneOutgoing, CalendarClock,
  Mic, Users2, FileBarChart, Check, X, Headset,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Contact } from "@/components/contact";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SectionFAQ } from "@/components/section-faq";
import { VoiceCallDemo } from "@/components/voice-call-demo";
import { trackEvent } from "@/lib/metrics";

const CAPACIDADES = [
  {
    icon: PhoneIncoming,
    title: "Contesta llamadas entrantes",
    desc: "Responde cada llamada al instante, sin tonos de espera ni buzón de voz, así lleguen varias al mismo tiempo.",
  },
  {
    icon: PhoneOutgoing,
    title: "Hace llamadas salientes",
    desc: "Da seguimiento a leads, confirma citas o recupera clientes inactivos llamando por ti.",
  },
  {
    icon: CalendarClock,
    title: "Agenda por teléfono",
    desc: "Ofrece horarios disponibles, agenda la cita y la confirma en tu calendario, todo en la misma llamada.",
  },
  {
    icon: Mic,
    title: "Conversación natural",
    desc: "Entiende interrupciones, cambios de tema y preguntas fuera de guion, como una conversación real.",
  },
  {
    icon: Users2,
    title: "Transfiere a un humano",
    desc: "Si la llamada lo requiere, la pasa a tu equipo con el contexto completo de lo ya conversado.",
  },
  {
    icon: FileBarChart,
    title: "Reporta cada llamada",
    desc: "Transcripción, resultado y datos del cliente quedan registrados automáticamente en tu CRM.",
  },
];

const USOS = [
  {
    title: "Atención y soporte entrante",
    desc: "Tu línea nunca suena ocupada. El agente resuelve dudas frecuentes y escala lo que no puede resolver.",
  },
  {
    title: "Ventas y llamadas salientes",
    desc: "Llama a tus leads para calificarlos, dar seguimiento o reactivar clientes que dejaron de responder.",
  },
  {
    title: "Agendamiento de citas",
    desc: "Confirma, reprograma o recuerda citas por teléfono sin que nadie de tu equipo tenga que llamar.",
  },
];

const PASOS = [
  {
    n: "01",
    title: "Conectamos tu línea",
    desc: "Tu número de teléfono actual, sin cambiarlo ni portarlo.",
  },
  {
    n: "02",
    title: "Definimos el guion y tono",
    desc: "Cómo debe saludar, qué preguntar y cuándo transferir a una persona.",
  },
  {
    n: "03",
    title: "El agente contesta o llama",
    desc: "Atiende entrantes o marca salientes según el objetivo de tu negocio.",
  },
  {
    n: "04",
    title: "Tú supervisas cada llamada",
    desc: "Transcripción y resultado de cada llamada disponibles en tu panel.",
  },
];

const FAQ_VOZ = [
  {
    q: "¿Qué pasa si el agente no puede resolver algo en la llamada?",
    a: "Transfiere la llamada a un miembro de tu equipo junto con el contexto de lo ya conversado, para que el cliente no tenga que repetir nada.",
  },
  {
    q: "¿El agente suena robótico?",
    a: "Está diseñado para sonar natural y mantener una conversación fluida, con pausas y tono conversacional — no lee un guion palabra por palabra.",
  },
  {
    q: "¿Necesito cambiar mi número de teléfono?",
    a: "No. El agente se conecta a la línea que ya usas, tanto para llamadas entrantes como salientes.",
  },
  {
    q: "¿Puede hacer llamadas salientes, no solo contestar?",
    a: "Sí. Se usa para seguimiento de leads, confirmación de citas, recordatorios y recuperación de clientes inactivos.",
  },
  {
    q: "¿Cuánto tiempo toma implementarlo?",
    a: "Depende de la complejidad del guion y las integraciones necesarias. Normalmente entre 1 y 3 semanas.",
  },
];

export default function AgentesVozPage() {
  useEffect(() => {
    trackEvent('visita', { path: '/agentes-voz' });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">

        {/* HERO */}
        <section className="relative overflow-hidden bg-background pt-32 md:pt-44 pb-20 hero-grid">
          <div className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] bg-[#0877f9]/25 rounded-full blur-[120px] pointer-events-none z-0" />

          <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8 glass border border-border/50 text-foreground/80"
            >
              <Headset className="h-3.5 w-3.5 text-primary" />
              <span>Agentes de Voz</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[clamp(2.25rem,5vw,4rem)] font-black tracking-tight text-foreground leading-[1.05] mb-6"
            >
              Tu teléfono, atendido por{" "}
              <span className="gradient-text">IA que habla</span>{" "}
              como tu mejor agente
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Contesta llamadas, agenda citas y da seguimiento a tus clientes por teléfono — sin líneas ocupadas,
              sin horario de oficina y sin que tu equipo tenga que levantar el teléfono.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/cotizador">
                <button
                  onClick={() => trackEvent('click_cta', { cta: 'Cotizar Proyecto (Agentes Voz Hero)' })}
                  className="group inline-flex items-center gap-3 h-14 px-8 rounded-2xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 btn-primary-glow"
                >
                  <Sparkles className="w-5 h-5" />
                  Cotizar mi Agente de Voz
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </Link>
              <Link href="#contacto">
                <button
                  onClick={() => trackEvent('click_cta', { cta: 'Agendar Asesoria (Agentes Voz Hero)' })}
                  className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl text-base font-semibold glass border border-border/50 hover:border-primary/40 text-foreground transition-all duration-300"
                >
                  Agendar Asesoría
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CALL CENTER vs AGENTE DE VOZ */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14 max-w-2xl mx-auto"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
                La diferencia
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tu línea, sin horario y sin espera
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass border border-border/50 rounded-3xl p-8"
              >
                <h3 className="font-bold text-lg text-muted-foreground mb-5">Atención telefónica tradicional</h3>
                <ul className="space-y-4">
                  {[
                    "Solo contesta en horario de oficina",
                    "Se satura con varias llamadas a la vez",
                    "Depende de turnos y disponibilidad del equipo",
                    "Requiere entrenar y repetir el guion a cada persona",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass border border-primary/30 rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />
                <h3 className="font-bold text-lg text-foreground mb-5">Agente de Voz FlujoxAI</h3>
                <ul className="space-y-4">
                  {[
                    "Contesta 24 horas, todos los días",
                    "Atiende varias llamadas al mismo tiempo",
                    "Mismo tono y calidad en cada llamada",
                    "Se ajusta al instante si cambia el guion",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CAPACIDADES */}
        <section className="py-24 bg-muted/10">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14 max-w-2xl mx-auto"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
                Capacidades
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Todo lo que hace tu Agente de Voz
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
              {CAPACIDADES.map((cap, i) => {
                const spanClass =
                  i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2" :
                  i === 1 ? "col-span-2 lg:col-span-2" :
                  "col-span-1 lg:col-span-1";
                const isFeatured = i === 0;
                return (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`glass border rounded-3xl p-6 md:p-7 hover:border-primary/30 transition-colors flex flex-col ${spanClass} ${
                      isFeatured ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent justify-center" : "border-border/50 justify-start"
                    }`}
                  >
                    <div className={`rounded-xl bg-gradient-to-br from-[#0877f9] to-[#0565E8] flex items-center justify-center mb-5 ${isFeatured ? "h-14 w-14" : "h-11 w-11"}`}>
                      <cap.icon className={isFeatured ? "h-7 w-7 text-white" : "h-5 w-5 text-white"} />
                    </div>
                    <h3 className={`font-bold text-foreground mb-2 ${isFeatured ? "text-2xl" : "text-base"}`}>{cap.title}</h3>
                    <p className={`text-muted-foreground leading-relaxed ${isFeatured ? "text-base" : "text-sm"}`}>{cap.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DEMO: LLAMADA EN VIVO */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary glass px-4 py-1.5 rounded-full border border-primary/20">
                  Así suena
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                  Una llamada real, <span className="gradient-text">de principio a fin</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  El cliente llama, conversa con naturalidad y cuelga con su cita agendada — sin que nadie de tu
                  equipo haya tocado el teléfono.
                </p>

                <Link href="/cotizador">
                  <button
                    onClick={() => trackEvent('click_cta', { cta: 'Cotizar Proyecto (Agentes Voz Demo)' })}
                    className="mt-2 inline-flex items-center gap-2 h-12 px-8 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Quiero uno para mi negocio
                  </button>
                </Link>
              </div>

              <VoiceCallDemo />
            </div>
          </div>
        </section>

        {/* CASOS DE USO */}
        <section className="py-24 bg-muted/10">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14 max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tres formas de usar tu Agente de Voz
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {USOS.map((uso, i) => (
                <motion.div
                  key={uso.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="glass border border-border/50 rounded-3xl p-7"
                >
                  <span className="text-4xl font-black text-primary/15 leading-none">{i + 1}</span>
                  <h3 className="font-bold text-lg text-foreground mt-3 mb-2">{uso.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{uso.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 max-w-2xl mx-auto"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
                Implementación
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Cómo ponemos tu agente a contestar
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PASOS.map((paso, i) => (
                <motion.div
                  key={paso.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative"
                >
                  <span className="text-5xl font-black text-primary/15 leading-none">{paso.n}</span>
                  <h3 className="font-bold text-foreground mt-2 mb-2">{paso.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{paso.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <SectionFAQ
          eyebrow="Preguntas"
          title={<>Preguntas sobre tu <span className="gradient-text">Agente de Voz</span></>}
          items={FAQ_VOZ}
        />

        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
