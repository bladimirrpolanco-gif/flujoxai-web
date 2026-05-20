"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu, Database, Calendar, Mail, CheckCircle2, ArrowRight } from "lucide-react";

import { BrandIcon } from "./brand-icon";

const OUTPUT_NODES = [
  { slug: "hubspot",        label: "CRM",          sub: "Lead registrado",  from: "from-[#FF7A59]", to: "to-[#ff9b82]",  glow: "shadow-[#FF7A59]/40",  border: "border-[#FF7A59]/30"  },
  { slug: "googlecalendar", label: "Calendario",   sub: "Cita agendada",    from: "from-[#4285F4]", to: "to-[#6ba3ff]",  glow: "shadow-[#4285F4]/40",  border: "border-[#4285F4]/30"  },
  { slug: "gmail",          label: "Notificación", sub: "Email enviado",    from: "from-[#EA4335]", to: "to-[#ff6f63]",  glow: "shadow-[#EA4335]/40",  border: "border-[#EA4335]/30"  },
];

export function AutomationFlow() {
  const [phase, setPhase] = useState(0);
  const [doneOutputs, setDoneOutputs] = useState<number[]>([]);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      setPhase(0);
      setDoneOutputs([]);
      ts.push(setTimeout(() => setPhase(1), 1800));
      ts.push(setTimeout(() => setPhase(2), 3400));
      ts.push(setTimeout(() => setPhase(3), 5200));
      ts.push(setTimeout(() => setDoneOutputs([0]),    6000));
      ts.push(setTimeout(() => setDoneOutputs([0,1]),  6800));
      ts.push(setTimeout(() => setDoneOutputs([0,1,2]),7600));
    };

    cycle();
    const id = setInterval(cycle, 13000);
    return () => { ts.forEach(clearTimeout); clearInterval(id); };
  }, []);

  return (
    <section id="automatizaciones" className="py-28 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-muted/20 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-5 -z-10"
        style={{ background: "radial-gradient(ellipse, oklch(0.65 0.22 255) 0%, transparent 70%)" }} />

      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Automatización en acción
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-syne text-foreground mb-4">
            Un mensaje que desencadena{" "}
            <span className="text-[#2563EB]">todo un flujo</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Desde que el cliente escribe hasta que la cita queda agendada — en segundos, sin intervención humana.
          </p>
        </motion.div>

        {/* Node Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass border border-border/50 rounded-3xl p-8 pb-4 md:p-12 md:pb-6 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 overflow-x-auto">

            {/* Trigger Node — WhatsApp */}
            <MainNode
              slug="whatsapp"
              label="WhatsApp"
              sub="Cliente escribe"
              gradient="from-[#25D366] to-[#1DA851]"
              glow="shadow-[#25D366]/40"
              active={phase >= 0}
              pulsing={phase === 0}
            />

            {/* Connector 1 */}
            <FlowConnector active={phase >= 1} />

            {/* AI Node */}
            <MainNode
              icon={Cpu}
              label="IA Flujobot"
              sub={phase >= 2 ? "Analizando..." : "En espera"}
              gradient="from-blue-600 to-blue-400"
              glow="shadow-blue-600/40"
              active={phase >= 2}
              pulsing={phase === 2}
              processing={phase === 2}
            />

            {/* Connector 2 */}
            <FlowConnector active={phase >= 3} />

            {/* Output Nodes */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {OUTPUT_NODES.map((node, i) => (
                <OutputNode
                  key={i}
                  slug={node.slug}
                  label={node.label}
                  sub={node.sub}
                  gradient={`${node.from} ${node.to}`}
                  border={node.border}
                  glow={node.glow}
                  visible={phase >= 3}
                  done={doneOutputs.includes(i)}
                  delay={i * 0.15}
                />
              ))}
            </div>

          </div>

          {/* Status bar */}
          <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {[
              { label: "Tiempo promedio", value: "< 3 segundos" },
              { label: "Intervención humana", value: "0%" },
              { label: "Disponibilidad", value: "24 / 7" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="font-bold text-foreground text-lg">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Sub-components ── */

function MainNode({
  icon: Icon, slug, label, sub, gradient, glow, active, pulsing, processing,
}: {
  icon?: any; slug?: string; label: string; sub: string; gradient: string; glow: string;
  active: boolean; pulsing?: boolean; processing?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[120px]">
      <div className="relative">
        {/* Pulse ring */}
        {pulsing && (
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-30`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
        {/* Spinning ring when processing */}
        {processing && (
          <motion.div
            className={`absolute -inset-1.5 rounded-2xl border-2 border-transparent bg-gradient-to-br ${gradient}`}
            style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "2px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
        <motion.div
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0.4 }}
          transition={{ duration: 0.4 }}
          className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl ${glow}`}
        >
          {slug ? <BrandIcon slug={slug} className="h-8 w-8 text-white" /> : Icon && <Icon className="h-8 w-8 text-white" />}
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function FlowConnector({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center mx-2 md:mx-4 rotate-90 md:rotate-0 flex-shrink-0">
      <div className="relative w-16 h-0.5 bg-border/50 overflow-visible flex items-center">
        {/* Static dashed base */}
        <div className="absolute inset-0 border-t-2 border-dashed border-border/30" />
        {/* Animated packet */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="packet"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary shadow-lg shadow-primary/60"
              style={{ boxShadow: "0 0 8px 2px hsl(var(--primary) / 0.6)" }}
            />
          )}
        </AnimatePresence>
        {/* Arrow */}
        <ArrowRight className={`absolute -right-3 h-4 w-4 transition-colors duration-500 ${active ? "text-primary" : "text-border"}`} />
      </div>
    </div>
  );
}

function OutputNode({
  slug, label, sub, gradient, border, glow, visible, done, delay,
}: {
  slug: string; label: string; sub: string; gradient: string; border: string; glow: string;
  visible: boolean; done: boolean; delay: number;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl glass border ${border} transition-all duration-500 ${done ? `shadow-lg ${glow}` : ""}`}
        >
          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
            <BrandIcon slug={slug} className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
          <AnimatePresence>
            {done && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

