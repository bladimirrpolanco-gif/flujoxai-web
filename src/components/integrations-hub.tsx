"use client";

import { BrandIcon } from "./brand-icon";

const ALL_TOOLS = [
  { slug: "gmail",        label: "Gmail",          color: "bg-[#EA4335]", glow: "shadow-[#EA4335]/40" },
  { slug: "slack",        label: "Slack",          color: "bg-[#4A154B]", glow: "shadow-[#4A154B]/40" },
  { slug: "whatsapp",     label: "WhatsApp",       color: "bg-[#25D366]", glow: "shadow-[#25D366]/40" },
  { slug: "stripe",       label: "Stripe",         color: "bg-[#635BFF]", glow: "shadow-[#635BFF]/40" },
  { slug: "googlesheets", label: "Google Sheets",  color: "bg-[#34A853]", glow: "shadow-[#34A853]/40" },
  { slug: "mysql",        label: "Base de Datos",  color: "bg-[#4479A1]", glow: "shadow-[#4479A1]/40" },
  { slug: "notion",       label: "Notion",         color: "bg-[#000000]", glow: "shadow-[#000000]/40" },
  { slug: "hubspot",      label: "HubSpot / CRM",  color: "bg-[#FF7A59]", glow: "shadow-[#FF7A59]/40" },
];

const LEFT_TOOLS  = ALL_TOOLS.slice(0, 4);
const RIGHT_TOOLS = ALL_TOOLS.slice(4);

export function IntegrationsHub() {
  const [activeLeft,  setActiveLeft]  = useState<number[]>([]);
  const [activeRight, setActiveRight] = useState<number[]>([]);
  const [hubPulse,    setHubPulse]    = useState(false);

  useEffect(() => {
    let step = 0;
    const cycle = () => {
      step = (step + 1) % 8;
      if (step === 0) { setActiveLeft([]);          setActiveRight([]); setHubPulse(false); }
      if (step === 1)   setActiveLeft([0]);
      if (step === 2)   setActiveLeft([0, 2]);
      if (step === 3) { setActiveLeft([0,1,2,3]);   setHubPulse(true); }
      if (step === 4)   setActiveRight([0]);
      if (step === 5)   setActiveRight([0,1]);
      if (step === 6)   setActiveRight([0,1,2]);
      if (step === 7)   setActiveRight([0,1,2,3]);
    };
    const id = setInterval(cycle, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-5"
          style={{ background: "radial-gradient(ellipse, oklch(0.62 0.25 300) 0%, transparent 70%)" }} />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
            Integraciones Sin Límites
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Conecta todas tus{" "}
            <span className="gradient-text">herramientas</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            FlujoXAI actúa como el cerebro central que recibe, procesa y distribuye información entre todos los sistemas de tu empresa — en tiempo real.
          </p>
        </motion.div>

        {/* Hub diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass border border-border/50 rounded-3xl p-6 md:p-12 max-w-5xl mx-auto"
        >
          {/* DESKTOP layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex flex-col gap-4 flex-shrink-0">
              {LEFT_TOOLS.map((tool, i) => (
                <ToolNode key={i} {...tool} active={activeLeft.includes(i)} side="left" />
              ))}
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              {LEFT_TOOLS.map((_, i) => (
                <HorizontalLine key={i} active={activeLeft.includes(i)} />
              ))}
            </div>
            <HubCenter hubPulse={hubPulse} />
            <div className="flex flex-col gap-4 flex-shrink-0">
              {RIGHT_TOOLS.map((_, i) => (
                <HorizontalLine key={i} active={activeRight.includes(i)} />
              ))}
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              {RIGHT_TOOLS.map((tool, i) => (
                <ToolNode key={i} {...tool} active={activeRight.includes(i)} side="right" />
              ))}
            </div>
          </div>

          {/* MOBILE layout */}
          <div className="flex md:hidden flex-col items-center gap-6">
            {/* Top tools grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {LEFT_TOOLS.map((tool, i) => (
                <ToolNode key={i} {...tool} active={activeLeft.includes(i)} side="left" />
              ))}
            </div>

            {/* Vertical connector up */}
            <div className="w-px h-6 bg-border/50 relative flex justify-center">
              <AnimatePresence>
                {hubPulse && (
                  <motion.div
                    className="absolute top-0 w-2 h-2 rounded-full bg-primary"
                    style={{ boxShadow: "0 0 6px 2px hsl(var(--primary) / 0.7)" }}
                    initial={{ top: 0 }} animate={{ top: "100%" }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Hub */}
            <HubCenter hubPulse={hubPulse} />

            {/* Vertical connector down */}
            <div className="w-px h-6 bg-border/50" />

            {/* Bottom tools grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {RIGHT_TOOLS.map((tool, i) => (
                <ToolNode key={i} {...tool} active={activeRight.includes(i)} side="left" />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-border/50 flex flex-wrap justify-center gap-2">
            {["Gmail", "Slack", "Stripe", "Google Sheets", "Notion", "MySQL", "HubSpot", "WhatsApp", "ERP", "+ más"].map((tag) => (
              <span key={tag} className="text-xs bg-muted/50 text-muted-foreground px-3 py-1 rounded-full border border-border/50">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HubCenter({ hubPulse }: { hubPulse: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0">
      <div className="relative">
        {hubPulse && (
          <>
            <motion.div className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <motion.div className="absolute inset-0 rounded-full bg-primary/10"
              animate={{ scale: [1, 2.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} />
          </>
        )}
        <motion.div
          className="absolute -inset-2 rounded-full"
          style={{ background: "conic-gradient(from 0deg, transparent 0%, oklch(0.65 0.22 255) 30%, transparent 60%)", opacity: hubPulse ? 0.6 : 0.2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center shadow-2xl shadow-primary/40">
          <Bot className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">FlujoXAI</p>
        <p className="text-xs text-primary font-medium">IA Central</p>
      </div>
    </div>
  );
}

function ToolNode({ slug, label, color, glow, active, side }: {
  slug: string; label: string; color: string; glow: string; active: boolean; side: "left" | "right";
}) {
  return (
    <motion.div
      animate={active ? { scale: 1.05 } : { scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl glass border transition-all duration-300 ${
        active ? `border-white/20 shadow-lg ${glow}` : "border-border/30 opacity-50"
      } ${side === "right" ? "md:flex-row-reverse" : ""}`}
    >
      <div className={`h-8 w-8 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
        <BrandIcon slug={slug} className="h-4 w-4" />
      </div>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

function HorizontalLine({ active }: { active: boolean }) {
  return (
    <div className="relative h-8 w-16 flex items-center">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border/40" />
      <AnimatePresence>
        {active && (
          <motion.div
            key="packet"
            className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 6px 2px hsl(var(--primary) / 0.7)" }}
            initial={{ left: "0%" }} animate={{ left: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
