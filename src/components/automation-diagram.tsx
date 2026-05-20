"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu, CheckCircle2, ArrowRight, Bot, Workflow, Target, MonitorSmartphone, Users, Sparkles } from "lucide-react";
import { BrandIcon } from "./brand-icon";

const OUTPUT_NODES = [
  { slug: "hubspot",        label: "CRM",          sub: "Lead registrado",  from: "from-[#FF7A59]", to: "to-[#ff9b82]",  glow: "shadow-[#FF7A59]/40",  border: "border-[#FF7A59]/30"  },
  { slug: "googlecalendar", label: "Calendario",   sub: "Cita agendada",    from: "from-[#4285F4]", to: "to-[#6ba3ff]",  glow: "shadow-[#4285F4]/40",  border: "border-[#4285F4]/30"  },
  { slug: "gmail",          label: "Notificación", sub: "Email enviado",    from: "from-[#EA4335]", to: "to-[#ff6f63]",  glow: "shadow-[#EA4335]/40",  border: "border-[#EA4335]/30"  },
];

const HERO_NODES = [
  { icon: Bot,               label: "Chatbots",      sub: "IA Conversacional", from: "from-blue-500",    to: "to-cyan-400",   glow: "shadow-blue-500/40",   x: 20, y: 20, type: "in",  delay: 0 },
  { icon: Workflow,          label: "Integraciones", sub: "APIs & Sistemas",   from: "from-purple-500",  to: "to-pink-500",   glow: "shadow-purple-500/40", x: 80, y: 20, type: "in",  delay: 0.2 },
  { icon: Users,             label: "CRM IA",        sub: "Gestión de Leads",  from: "from-rose-500",    to: "to-red-400",    glow: "shadow-rose-500/40",   x: 85, y: 50, type: "out", delay: 0 },
  { icon: MonitorSmartphone, label: "Web & App",     sub: "Desarrollo",        from: "from-emerald-500", to: "to-green-400",  glow: "shadow-emerald-500/40",x: 80, y: 80, type: "out", delay: 0.2 },
  { icon: Target,            label: "Publicidad",    sub: "Campañas con IA",   from: "from-orange-500",  to: "to-amber-400",  glow: "shadow-orange-500/40", x: 20, y: 80, type: "out", delay: 0.4 },
  { icon: Sparkles,          label: "Agentes IA",    sub: "Automatización",    from: "from-indigo-500",  to: "to-blue-500",   glow: "shadow-indigo-500/40", x: 15, y: 50, type: "out", delay: 0.6 },
];

export function AutomationDiagram({ className, showCard = true, layout = "horizontal" }: { className?: string; showCard?: boolean; layout?: "horizontal" | "hero" }) {
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

  const horizontalContent = (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 overflow-visible w-full">
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
  );

  const heroContent = (
    <div className="relative w-full h-[550px] overflow-visible">
      {/* SVG Connectors Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {HERO_NODES.map((n, i) => {
          const isInput = n.type === "in";
          const x1 = isInput ? n.x : 50;
          const y1 = isInput ? n.y : 50;
          const x2 = isInput ? 50 : n.x;
          const y2 = isInput ? 50 : n.y;
          const pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
          
          return (
            <g key={`path-${i}`}>
              <path d={pathD} fill="none" stroke="currentColor" className="text-border/30" strokeWidth="0.2" vectorEffect="non-scaling-stroke" strokeDasharray="1 3" />
              <motion.path 
                d={pathD} 
                fill="none" 
                stroke="currentColor" 
                className="text-primary/70" 
                strokeWidth="1.2" 
                vectorEffect="non-scaling-stroke" 
                initial={{ pathLength: 0, opacity: 0 }} 
                animate={{ 
                  pathLength: (isInput ? phase >= 1 : phase >= 3) ? 1 : 0,
                  opacity: (isInput ? phase >= 1 : phase >= 3) ? 1 : 0
                }} 
                transition={{ duration: 1.5, delay: isInput ? n.delay : n.delay, ease: "easeInOut" }} 
              />
            </g>
          );
        })}
      </svg>

      {/* Center IA Node */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: '50%', top: '50%' }}>
        <div className="relative">
          <motion.div 
            className="absolute -inset-8 bg-primary/20 rounded-full blur-2xl"
            animate={{ scale: phase === 2 ? [1, 1.2, 1] : 1, opacity: phase === 2 ? [0.4, 0.8, 0.4] : 0.1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <MainNode 
            icon={Cpu} 
            label="FlujoxAI" 
            sub={phase >= 2 ? "Analizando..." : "En espera"} 
            gradient="from-blue-600 to-blue-400" 
            glow="shadow-blue-600/50 shadow-2xl" 
            active={true} 
            pulsing={phase === 2} 
            processing={phase === 2} 
          />
        </div>
      </div>

      {/* Surrounding Nodes */}
      {HERO_NODES.map((n, i) => {
        const isInput = n.type === "in";
        const isActive = isInput ? phase >= 1 : phase >= 3;
        
        return (
          <motion.div 
            key={`node-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10" 
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: isActive ? 1 : 0.85, opacity: isActive ? 1 : 0.4 }}
            transition={{ duration: 0.8, delay: isActive ? n.delay : 0 }}
          >
            <MainNode 
              icon={n.icon}
              label={n.label} 
              sub={n.sub} 
              gradient={n.from + " " + n.to} 
              glow={n.glow} 
              active={true} 
            />
          </motion.div>
        );
      })}
    </div>
  );

  const content = (
    <>
      {layout === "hero" ? heroContent : horizontalContent}

      {showCard && (
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
      )}
    </>
  );

  if (!showCard) {
    return <div className={`w-full flex justify-center ${className || ""}`}>{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`glass border border-border/50 rounded-3xl p-8 pb-4 md:p-12 md:pb-6 max-w-4xl mx-auto w-full ${className || ""}`}
    >
      {content}
    </motion.div>
  );
}

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
      <div className="text-center mt-1">
        <p className="text-[15px] font-extrabold text-foreground leading-tight">{label}</p>
        <p className="text-[13px] font-medium text-foreground/70 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function FlowConnector({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center mx-2 md:mx-4 rotate-90 md:rotate-0 flex-shrink-0 my-4 md:my-0">
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
