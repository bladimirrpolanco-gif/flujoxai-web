"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { trackEvent } from "@/lib/metrics";
import { ArrowRight, Bot, Workflow, Zap, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AutomationDiagram } from "./automation-diagram";

const features = [
  { icon: Bot,      title: "Agentes IA",           desc: "Chatbots y asistentes inteligentes que atienden a tus clientes 24/7 sin intervención humana.", gradient: "from-blue-500 to-cyan-400" },
  { icon: Workflow, title: "Automatización",        desc: "Eliminamos el trabajo manual conectando tus sistemas para que operen solos y sin errores.",    gradient: "from-violet-500 to-purple-400" },
  { icon: Zap,      title: "Integraciones",         desc: "CRM, WhatsApp, email y más trabajando en sincronía para potenciar tu negocio completo.",       gradient: "from-pink-500 to-rose-400" },
];

function MagneticButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - left, y: e.clientY - top });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const headlineWords = "Automatiza tu Empresa con Inteligencia Artificial".split(" ");

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-background pt-28 md:pt-40 pb-20 md:pb-32 hero-grid">
      
      {/* Interactive Cursor Glow */}
      <motion.div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.05), transparent 40%)`
        }}
      />

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, oklch(0.65 0.22 255) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-15 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, oklch(0.62 0.25 300) 0%, transparent 70%)', animationDelay: '1.5s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[55%_45%] lg:items-center gap-12 lg:gap-8 max-w-5xl lg:max-w-7xl mx-auto">
          
          {/* Left Column (Text content) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-8 glass border border-border/50 text-foreground/80 hover:border-primary/30 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-foreground/80">Automatización empresarial con IA — chatbots, procesos e integraciones</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </motion.div>

          {/* Headline with Typing Effect */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-syne tracking-tight mb-6 leading-[1.05] perspective-1000">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  type: "spring",
                  damping: 12
                }}
                className={`inline-block mr-[0.2em] last:mr-0 ${i > 2 ? 'text-[#2563EB] transition-all duration-300' : 'text-foreground'}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed mx-auto lg:mx-0"
          >
            Diseñamos{" "}
            <span className="text-foreground font-medium">chatbots inteligentes</span>,
            {" "}automatizamos procesos y conectamos tus herramientas para que tu negocio opere solo, sin errores y sin parar.
          </motion.p>

          {/* CTAs with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center lg:justify-start"
          >
            <MagneticButton>
              <Link href="/cotizador">
                <button 
                  onClick={() => trackEvent('click_cta', { cta: 'Cotizar Proyecto (Hero)' })}
                  className="group relative inline-flex items-center gap-3 h-14 px-10 rounded-2xl text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 btn-primary-glow"
                >
                  <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Cotizar Proyecto
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link href="#contacto">
                <button 
                  onClick={() => trackEvent('click_cta', { cta: 'Agendar Asesoria (Hero)' })}
                  className="group inline-flex items-center gap-3 h-14 px-10 rounded-2xl text-base font-semibold glass hover:bg-muted/10 transition-all duration-300 border border-border/50 hover:border-primary/40 text-foreground"
                >
                  Agendar Asesoría
                  <div className="relative h-4 w-4">
                    <ArrowRight className="absolute inset-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Social proof line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16 flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground"
          >
            <div className="flex -space-x-2.5">
              {[
                { c: 'bg-blue-600', l: 'A' },
                { c: 'bg-indigo-600', l: 'M' },
                { c: 'bg-violet-600', l: 'P' },
                { c: 'bg-sky-600', l: 'R' }
              ].map((user, i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${user.c} border-2 border-background flex items-center justify-center text-white text-[10px] font-black`}>
                  {user.l}
                </div>
              ))}
            </div>
            <span><strong className="text-foreground">+50</strong> negocios ya automatizados en <span className="text-primary font-medium">República Dominicana</span></span>
          </motion.div>

          </div>

          {/* Right Column (Diagram) */}
          <div className="flex items-center justify-center lg:justify-end w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full max-w-lg lg:max-w-full"
            >
              <AutomationDiagram showCard={false} className="transform scale-[0.8] sm:scale-90 lg:scale-[0.85] xl:scale-100 origin-center lg:origin-center" />
            </motion.div>
          </div>

        </div>

        {/* Feature cards with Hover Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col items-center text-center p-8 glass rounded-3xl border border-border/50 hover:border-primary/20 transition-all duration-500"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              
              {/* Subtle card glow */}
              <div className="absolute inset-0 rounded-3xl bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 -z-10" />
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}

