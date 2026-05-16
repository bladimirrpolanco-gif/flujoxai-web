"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, CheckCircle2, Zap, Clock, Users } from "lucide-react";
import Link from "next/link";

const CONVERSATION: { role: "bot" | "user"; text: string; delay: number }[] = [
  { role: "bot",  text: "¡Hola! 👋 Soy el asistente de Flujobot. ¿En qué puedo ayudarte hoy?", delay: 800 },
  { role: "user", text: "Hola, tengo una clínica y quiero automatizar las citas.", delay: 2200 },
  { role: "bot",  text: "¡Perfecto! 🏥 Para clínicas implementamos agendamiento automático 24/7, recordatorios por WhatsApp y captación de nuevos pacientes. Todo sin intervención humana.", delay: 4000 },
  { role: "user", text: "¿Y cuánto tiempo tarda la implementación?", delay: 6800 },
  { role: "bot",  text: "⚡ En promedio 5 días hábiles. Integramos el sistema con tu calendario actual y lo configuramos para tu clínica específicamente.", delay: 8600 },
  { role: "user", text: "Me interesa. ¿Cómo agendo una llamada?", delay: 11400 },
  { role: "bot",  text: "¡Excelente! ✅ Déjame tu nombre y teléfono y un especialista te contacta en menos de 24 horas. También puedes ir directo a nuestro formulario en el sitio web. 🚀", delay: 13200 },
  { role: "user", text: "Soy Dr. Ramírez, mi número es 809-555-0192.", delay: 16000 },
  { role: "bot",  text: "¡Perfecto Dr. Ramírez! 🙌 Ya quedó registrado. Te contactaremos hoy mismo. ¡Hasta pronto!", delay: 17800 },
];

const TOTAL_DURATION = 21000;

interface Message {
  role: "bot" | "user";
  text: string;
}

export function ChatbotSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      setMessages([]);
      setIsTyping(false);

      CONVERSATION.forEach((msg, i) => {
        if (msg.role === "bot") {
          timeouts.push(setTimeout(() => setIsTyping(true), msg.delay - 700));
        }
        timeouts.push(setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, { role: msg.role, text: msg.text }]);
        }, msg.delay));
      });
    };

    run();
    const interval = setInterval(run, TOTAL_DURATION);
    return () => { timeouts.forEach(clearTimeout); clearInterval(interval); };
  }, []);

  return (
    <section id="simulador" className="py-24 bg-muted/20 relative">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Así habla tu <span className="text-primary">Agente IA</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Una conversación real con un cliente. El bot entiende, responde y captura el lead — todo en segundos, sin que tú hagas nada.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { icon: Clock,        text: "Responde en menos de 1 segundo" },
                { icon: Users,        text: "Captura el lead automáticamente" },
                { icon: Zap,          text: "Disponible 24/7 sin descanso" },
                { icon: CheckCircle2, text: "Se adapta a cualquier tipo de negocio" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-foreground/80">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            <Link href="#contacto">
              <button className="mt-2 inline-flex items-center gap-2 h-12 px-8 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Quiero uno para mi negocio
              </button>
            </Link>
          </div>

          {/* Right — animated WhatsApp chat */}
          <div className="mx-auto w-full max-w-[380px]">
            <div className="border-[8px] border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-card overflow-hidden shadow-2xl flex flex-col h-[580px]">

              {/* Header */}
              <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-none">IA Flujobot</p>
                  <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                    En línea
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#e5ddd5] dark:bg-zinc-950"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23b3a99c' fill-opacity='0.25'/%3E%3C/svg%3E")` }}
              >
                <div className="flex justify-center">
                  <span className="bg-black/5 dark:bg-white/10 text-[11px] text-zinc-700 dark:text-zinc-300 rounded-lg px-3 py-1">Hoy</span>
                </div>

                <AnimatePresence>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                        m.role === "user"
                          ? "bg-[#dcf8c6] dark:bg-emerald-800 text-zinc-900 dark:text-white rounded-tr-none"
                          : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none"
                      }`}>
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input — locked/decorative */}
              <div className="bg-[#f0f0f0] dark:bg-zinc-900 px-3 py-2 flex-shrink-0 border-t border-border/50">
                <div className="flex gap-2 items-center opacity-50 pointer-events-none">
                  <div className="flex-1 bg-white dark:bg-zinc-800 rounded-full px-4 py-2.5 text-sm text-zinc-400">
                    Escribe un mensaje...
                  </div>
                  <div className="rounded-full p-2.5 bg-[#075E54]">
                    <svg className="h-4 w-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
