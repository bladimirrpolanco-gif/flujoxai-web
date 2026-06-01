"use client";

import { motion, useInView } from "framer-motion";
import { MessageSquare, Workflow, CalendarCheck, CheckCircle2, Bot, Zap, AreaChart, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function useCounter(target: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numericMatch = value.match(/\d+/);
  const numeric = numericMatch ? parseInt(numericMatch[0]) : 0;
  const prefix = value.replace(/[\d]+.*/, "");
  const suffix = value.replace(/^[\d]*/, "");
  const count = useCounter(numeric, 2000, inView);
  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-extrabold gradient-text mb-2">{prefix}{count}{suffix}</p>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}
import { supabase } from "@/lib/supabase";

const ICON_MAP: Record<string, any> = {
  MessageSquare,
  Workflow,
  CalendarCheck,
  Bot,
  Zap,
  AreaChart,
  Sparkles
};

const stats = [
  { value: "60%", label: "Reducción en Costos" },
  { value: "3x", label: "Más Leads Capturados" },
  { value: "24/7", label: "Disponibilidad Total" },
];

const STATIC_SERVICES = [
  {
    icon: MessageSquare,
    title: "Chatbots y Agentes AI para WhatsApp",
    description: "Atiende a tus clientes 24/7 con bots y agentes AI conversacionales que entienden el contexto y responden como humanos.",
    benefits: ["Atención inmediata sin esperas", "Captura leads automáticamente", "Escalabilidad infinita"],
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Workflow,
    title: "Automatización de Procesos",
    description: "Conectamos tus herramientas (CRM, ERP, Email) para que trabajen solas. Eliminamos el trabajo manual repetitivo.",
    benefits: ["Cero errores humanos", "Integración completa", "Mayor productividad"],
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-violet-500/20",
  },
  {
    icon: CalendarCheck,
    title: "Agendamiento Inteligente",
    description: "Sistemas que sincronizan calendarios, envían recordatorios y reprograman citas sin intervención humana.",
    benefits: ["Sincronización en tiempo real", "Recordatorios automáticos", "Reduce inasistencias"],
    gradient: "from-pink-500 to-rose-400",
    glow: "shadow-pink-500/20",
  },
  {
    icon: Sparkles,
    title: "Publicidad con AI",
    description: "Optimizamos tus campañas en Meta Ads y Google Ads con IA. Creamos anuncios hiper-personalizados y aumentamos tus ventas.",
    benefits: ["Optimización de presupuestos", "Generación de anuncios con IA", "Segmentación súper precisa"],
    gradient: "from-amber-500 to-orange-400",
    glow: "shadow-amber-500/20",
  },
  {
    icon: AreaChart,
    title: "Integraciones de Sistemas",
    description: "Sincronizamos tus plataformas actuales para que la información fluya sin barreras (Stripe, HubSpot, Shopify, etc).",
    benefits: ["Flujo de datos en tiempo real", "Sin pérdida de información", "Conecta +1000 aplicaciones"],
    gradient: "from-teal-500 to-emerald-400",
    glow: "shadow-teal-500/20",
  },
];

export function Services() {
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drag to scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase
        .from('servicios')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: true });
      
      if (data && data.length > 0) {
        setDbServices(data);
      }
      setIsLoading(false);
    }
    fetchServices();
  }, []);

  // Force static services to show the full carousel with all 5 items. 
  // You can switch back to `dbServices` if you add them all to Supabase!
  const displayServices = STATIC_SERVICES;

  return (
    <section id="servicios" className="relative py-28 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(ellipse, oklch(0.65 0.22 255) 0%, transparent 70%)' }} />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4 glass px-4 py-1.5 rounded-full border border-primary/20">
            Nuestros Servicios
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Soluciones de{" "}
            <span className="gradient-text">Inteligencia Artificial</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Transformamos negocios tradicionales en empresas eficientes y completamente automatizadas.
          </p>
        </motion.div>

        {/* Service cards - Manual Scroll */}
        <div className="relative py-10 -my-10">
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-4 -mx-4 scrollbar-hide cursor-grab ${isDragging ? 'cursor-grabbing snap-none' : ''}`}
          >
            {displayServices.map((service: any, i) => {
              const Icon = service.icon || ICON_MAP[service.icono] || Bot;
              const gradient = service.gradient || (
                i === 0 ? "from-blue-500 to-cyan-400" :
                i === 1 ? "from-violet-500 to-purple-400" :
                i === 2 ? "from-pink-500 to-rose-400" :
                i === 3 ? "from-amber-500 to-orange-400" :
                "from-teal-500 to-emerald-400"
              );
              const glow = service.glow || (
                 i === 0 ? "shadow-blue-500/20" :
                 i === 1 ? "shadow-violet-500/20" :
                 i === 2 ? "shadow-pink-500/20" :
                 i === 3 ? "shadow-amber-500/20" :
                 "shadow-teal-500/20"
              );

              return (
                <div
                  key={service.id || i}
                  className={`group relative flex flex-col glass rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl ${glow} hover:shadow-2xl flex-shrink-0 w-[320px] md:w-[380px] snap-center select-none`}
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${gradient} opacity-60 rounded-full`} />

                  {/* Icon */}
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground">{service.nombre || service.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-1 leading-relaxed text-sm">{service.descripcion || service.description}</p>

                  <ul className="space-y-2.5">
                    {(service.beneficios || service.benefits).map((benefit: string, j: number) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-foreground/80">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>


        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 glass border border-white/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto hidden sm:block"
        >
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-primary mb-8 opacity-80">
            Resultados Comprobados
          </p>
          <div className="grid grid-cols-3 gap-8">
            {stats.map(({ value, label }: { value: string; label: string }, i: number) => (
              <AnimatedStat key={i} value={value} label={label} />
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
}
