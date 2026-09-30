"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Brain, MessageSquare, Calendar, Database,
  UserCheck, Zap, Check, X, Bot, Clock, Workflow, ShieldCheck,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Contact } from "@/components/contact";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SectionFAQ } from "@/components/section-faq";
import { AgentDecisionDemo } from "@/components/agent-decision-demo";
import { trackEvent } from "@/lib/metrics";

const CAPACIDADES = [
  {
    icon: Brain,
    title: "Entiende el contexto",
    desc: "Recuerda la conversación completa, no responde con guiones fijos. Entiende intención, tono y sigue el hilo aunque el cliente cambie de tema.",
  },
  {
    icon: MessageSquare,
    title: "Atiende en varios canales",
    desc: "WhatsApp, Instagram, web y más, desde una sola base de conocimiento entrenada con la información real de tu negocio.",
  },
  {
    icon: UserCheck,
    title: "Califica y captura leads",
    desc: "Identifica clientes con intención de compra, recopila sus datos y los prioriza automáticamente en tu pipeline.",
  },
  {
    icon: Calendar,
    title: "Agenda por sí solo",
    desc: "Conecta con tu calendario para agendar, confirmar o reprogramar citas sin que nadie de tu equipo intervenga.",
  },
  {
    icon: Database,
    title: "Conectado a tu CRM",
    desc: "Cada conversación, lead y resultado queda registrado en tu sistema — sin hojas de cálculo ni copiar y pegar.",
  },
  {
    icon: Zap,
    title: "Escala sin límites",
    desc: "Atiende una conversación o mil al mismo tiempo, con la misma calidad de respuesta y sin tiempos de espera.",
  },
];

const CASOS_USO = [
  "Clínicas y consultorios",
  "Restaurantes",
  "Inmobiliarias",
  "E-commerce",
  "Despachos legales",
  "Salones de belleza",
];

const PASOS = [
  {
    n: "01",
    title: "Conectamos tus canales",
    desc: "WhatsApp Business, Instagram, tu web — donde ya reciben mensajes tus clientes.",
  },
  {
    n: "02",
    title: "Entrenamos al agente",
    desc: "Con la información real de tu negocio: servicios, precios, preguntas frecuentes y tono de voz.",
  },
  {
    n: "03",
    title: "El agente atiende y califica",
    desc: "Responde 24/7, resuelve dudas, captura datos y agenda — como lo haría tu mejor vendedor.",
  },
  {
    n: "04",
    title: "Tú supervisas todo",
    desc: "Desde tu panel ves cada conversación, lead generado y resultado en tiempo real.",
  },
];

const FAQ_AGENTES = [
  {
    q: "¿En qué se diferencia un Agente de IA de un chatbot normal?",
    a: "Un chatbot tradicional sigue un árbol de respuestas fijo (\"si el cliente escribe X, responde Y\"). Un Agente de IA de FlujoxAI entiende el lenguaje natural, mantiene el contexto de toda la conversación y decide qué hacer — responder, pedir un dato, agendar una cita o escalar a un humano — según la situación real, no un guion.",
  },
  {
    q: "¿El agente puede equivocarse o inventar información?",
    a: "El agente responde únicamente con la información que le entrenamos sobre tu negocio. Cuando una pregunta está fuera de esa base de conocimiento, lo indica y transfiere la conversación a un humano en vez de inventar una respuesta.",
  },
  {
    q: "¿Necesito cambiar de WhatsApp o número de teléfono?",
    a: "No. El agente se conecta a tu WhatsApp Business (o el canal que uses) sin que cambies de número ni pierdas tu historial de conversaciones.",
  },
  {
    q: "¿Cuánto tiempo toma tenerlo funcionando?",
    a: "Un agente básico para un solo canal está listo en 72 horas. Si necesita integraciones adicionales (CRM, calendario, sistemas internos), puede tomar hasta 2 semanas.",
  },
  {
    q: "¿Puedo probarlo antes de contratar?",
    a: "Sí, más abajo en esta misma página puedes conversar en tiempo real con un agente de demostración.",
  },
];

export default function AgentesIAPage() {
  useEffect(() => {
    trackEvent('visita', { path: '/agentes-ia' });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">

        {/* HERO */}
        <section className="relative overflow-hidden bg-background pt-32 md:pt-44 pb-20 hero-grid">
          <div className="absolute top-[5%] left-[-5%] w-[500px] h-[500px] bg-[#0877f9]/35 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-[#0565E8]/10 rounded-full blur-[120px] pointer-events-none z-0" />

          <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8 glass border border-border/50 text-foreground/80"
            >
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span>Agentes de IA</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[clamp(2.25rem,5vw,4rem)] font-black tracking-tight text-foreground leading-[1.05] mb-6"
            >
              Agentes de IA que{" "}
              <span className="gradient-text">atienden, califican</span>{" "}
              y venden por ti
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              No son bots de respuestas fijas. Son agentes con memoria y contexto que entienden a tus clientes,
              resuelven sus dudas y capturan cada oportunidad de venta — 24 horas al día, en todos tus canales.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/cotizador">
                <button
                  onClick={() => trackEvent('click_cta', { cta: 'Cotizar Proyecto (Agentes IA Hero)' })}
                  className="group inline-flex items-center gap-3 h-14 px-8 rounded-2xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 btn-primary-glow"
                >
                  <Sparkles className="w-5 h-5" />
                  Cotizar mi Agente
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </Link>
              <Link href="#contacto">
                <button
                  onClick={() => trackEvent('click_cta', { cta: 'Agendar Asesoria (Agentes IA Hero)' })}
                  className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl text-base font-semibold glass border border-border/50 hover:border-primary/40 text-foreground transition-all duration-300"
                >
                  Agendar Asesoría
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CHATBOT vs AGENTE */}
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
                No es un chatbot con menú. Es un <span className="gradient-text">Agente de IA</span>
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
                <h3 className="font-bold text-lg text-muted-foreground mb-5">Chatbot tradicional</h3>
                <ul className="space-y-4">
                  {[
                    "Responde con opciones y menús fijos",
                    "No recuerda lo que se dijo antes",
                    "Se pierde si el cliente sale del guion",
                    "Solo funciona en un canal a la vez",
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
                <h3 className="font-bold text-lg text-foreground mb-5">Agente de IA FlujoxAI</h3>
                <ul className="space-y-4">
                  {[
                    "Entiende lenguaje natural, sin menús",
                    "Mantiene el contexto de toda la conversación",
                    "Se adapta y resuelve situaciones nuevas",
                    "Atiende WhatsApp, Instagram y web a la vez",
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
                Todo lo que hace tu Agente de IA
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
              {CAPACIDADES.map((cap, i) => {
                // Bento layout: primeras dos tarjetas mas grandes para romper la grilla uniforme
                const spanClass =
                  i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2" :
                  i === 1 ? "col-span-2 lg:col-span-2" :
                  "col-span-2 sm:col-span-1 lg:col-span-1";
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
                Cómo ponemos tu agente a trabajar
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

        {/* CASOS DE USO */}
        <section className="py-20 bg-muted/10">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Funciona para negocios como el tuyo
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {CASOS_USO.map((caso) => (
                <span
                  key={caso}
                  className="glass border border-border/50 rounded-full px-5 py-2.5 text-sm font-medium text-foreground"
                >
                  {caso}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO: COMO DECIDE EL AGENTE */}
        <section className="py-24 bg-muted/20">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary glass px-4 py-1.5 rounded-full border border-primary/20">
                  Motor de decisión
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                  No solo responde. <span className="gradient-text">Decide qué hacer.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cada mensaje que llega pasa por un análisis de intención en tiempo real. El agente decide si debe
                  responder, pedir un dato, agendar una cita o escalar a un humano — sin reglas rígidas, sin árboles
                  de decisión que se rompen ante lo inesperado.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    { icon: Clock, text: "Analiza y responde en segundos" },
                    { icon: Workflow, text: "Ejecuta la acción correcta, no solo texto" },
                    { icon: ShieldCheck, text: "Escala a un humano cuando no está seguro" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-foreground/80">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                <Link href="/cotizador">
                  <button
                    onClick={() => trackEvent('click_cta', { cta: 'Cotizar Proyecto (Agentes IA Demo)' })}
                    className="mt-2 inline-flex items-center gap-2 h-12 px-8 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    Quiero uno para mi negocio
                  </button>
                </Link>
              </div>

              <div className="order-1 md:order-2">
                <AgentDecisionDemo />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <SectionFAQ
          eyebrow="Preguntas"
          title={<>Preguntas sobre tu <span className="gradient-text">Agente de IA</span></>}
          items={FAQ_AGENTES}
        />

        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
