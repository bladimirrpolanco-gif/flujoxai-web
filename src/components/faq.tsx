"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda la implementación?",
    a: "En promedio entre 3 y 7 días hábiles dependiendo de la complejidad. Chatbots básicos los tenemos listos en 72 horas. Automatizaciones más complejas con integraciones múltiples pueden tomar hasta 2 semanas.",
  },
  {
    q: "¿Necesito conocimientos técnicos para usar el sistema?",
    a: "No. Nosotros nos encargamos de todo el proceso técnico. Tú solo necesitas darnos acceso a las herramientas que ya usas (WhatsApp Business, CRM, etc.) y nosotros configuramos todo. El sistema funciona solo una vez implementado.",
  },
  {
    q: "¿Funciona para cualquier tipo de negocio?",
    a: "Sí. Hemos implementado soluciones para clínicas, restaurantes, inmobiliarias, e-commerce, despachos legales, salones de belleza y muchos más. Si tu negocio recibe mensajes o tiene procesos repetitivos, lo podemos automatizar.",
  },
  {
    q: "¿Qué pasa si el bot no sabe responder algo?",
    a: "El sistema detecta cuándo una pregunta está fuera de su conocimiento y transfiere la conversación a un agente humano de manera automática. Además, puedes actualizar la base de conocimiento en cualquier momento desde el panel de administración.",
  },
  {
    q: "¿Mis datos y los de mis clientes están seguros?",
    a: "Sí. Toda la información se almacena en servidores seguros con cifrado en tránsito y en reposo. Cumplimos con la Ley 172-13 de Protección de Datos de República Dominicana y el RGPD europeo. Nunca vendemos ni cedemos datos a terceros.",
  },
  {
    q: "¿Puedo ver cómo funciona antes de contratar?",
    a: "Claro. Puedes interactuar con el agente de demostración en tiempo real que se encuentra en esta misma página. Además, en nuestra llamada de asesoría gratuita te mostraremos ejemplos prácticos de soluciones similares aplicadas a tu sector.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Preguntas <span className="gradient-text">frecuentes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Todo lo que necesitas saber antes de dar el paso.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="glass border border-border/50 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/10 transition-colors"
              >
                <span className="font-semibold text-foreground text-sm md:text-base">{faq.q}</span>
                <span className="flex-shrink-0 text-primary">
                  {open === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-6 pb-5 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
