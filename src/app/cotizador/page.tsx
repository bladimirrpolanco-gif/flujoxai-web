"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Zap, Workflow, ArrowRight, ArrowLeft, CheckCircle2, 
  MessageSquare, Cpu, Sparkles, Building2, Utensils, 
  Hotel, Stethoscope, GraduationCap, Users, Calendar, 
  ShoppingBag, PieChart, Activity, Target, Timer,
  Globe, Smartphone, Palette, CreditCard, LayoutDashboard,
  Languages, Lock
} from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/metrics";

type CategoriaServicio = "automatizacion" | "web" | "app";

interface DiagnosticoData {
  categoriaServicio: CategoriaServicio | null;
  tipoNegocio: string;
  problema: string;
  volumen: string;
  herramientas: string[];
  funcionalidades: string[];
  tieneDiseno: string;
  lead: {
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
  };
}

export default function DiagnosticoPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState("Iniciando análisis del ecosistema...");
  const [errorMsg, setErrorMsg] = useState("");

  const [data, setData] = useState<DiagnosticoData>({
    categoriaServicio: null,
    tipoNegocio: "",
    problema: "",
    volumen: "",
    herramientas: [],
    funcionalidades: [],
    tieneDiseno: "",
    lead: { nombre: "", email: "", telefono: "", empresa: "" }
  });

  const getStepsFlow = () => {
    if (data.categoriaServicio === "automatizacion") {
      return ["servicio", "industria", "problema", "volumen", "herramientas", "datos", "resultados"];
    } else if (data.categoriaServicio === "web" || data.categoriaServicio === "app") {
      return ["servicio", "industria", "funcionalidades", "diseno", "datos", "resultados"];
    }
    return ["servicio"];
  };

  const flow = getStepsFlow();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStepName = flow[currentStepIndex];

  const nextStep = () => setCurrentStepIndex(i => i + 1);
  const prevStep = () => setCurrentStepIndex(i => i - 1);

  const handleToggleHerramienta = (tool: string) => {
    setData(prev => {
      const isSelected = prev.herramientas.includes(tool);
      if (tool === "Ninguna") return { ...prev, herramientas: ["Ninguna"] };
      let nuevas = isSelected 
        ? prev.herramientas.filter(t => t !== tool)
        : [...prev.herramientas.filter(t => t !== "Ninguna"), tool];
      return { ...prev, herramientas: nuevas };
    });
  };

  const handleToggleFuncionalidad = (func: string) => {
    setData(prev => {
      const isSelected = prev.funcionalidades.includes(func);
      if (func === "Ninguna, busco algo informativo") return { ...prev, funcionalidades: ["Ninguna, busco algo informativo"] };
      let nuevas = isSelected 
        ? prev.funcionalidades.filter(t => t !== func)
        : [...prev.funcionalidades.filter(t => t !== "Ninguna, busco algo informativo"), func];
      return { ...prev, funcionalidades: nuevas };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, lead: { ...prev.lead, [name]: value } }));
  };

  const procesarDiagnostico = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.lead.nombre || !data.lead.email || !data.lead.telefono) {
      setErrorMsg("Por favor, completa los campos requeridos.");
      return;
    }

    setErrorMsg("");
    setAnalyzing(true);

    const frasesAut = [
      "Analizando volumen de interacciones...", 
      "Calculando impacto en horas operativas...", 
      "Diseñando arquitectura de IA necesaria...", 
      "Evaluando complejidad de integraciones...",
      "Generando diagnóstico inteligente..."
    ];

    const frasesWeb = [
      "Evaluando requerimientos del sistema...", 
      "Estructurando mapa del sitio y módulos...", 
      "Definiendo stack tecnológico...", 
      "Calculando tiempos de desarrollo...",
      "Generando propuesta de proyecto..."
    ];

    const frases = data.categoriaServicio === "automatizacion" ? frasesAut : frasesWeb;
    
    for (let i = 0; i < frases.length; i++) {
      setAnalyzeText(frases[i]);
      await new Promise(r => setTimeout(r, 1200));
    }

    try {
      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error en el servidor");
      trackEvent("diagnostico_completado", { solucion: data.categoriaServicio });
      nextStep(); // Va a resultados
    } catch (err: any) {
      setErrorMsg("Hubo un error al procesar la solicitud. Intenta nuevamente.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Vistas de Pasos
  const renderServicio = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Qué tipo de proyecto tienes en mente?</h2>
        <p className="text-muted-foreground">Selecciona el área principal para iniciar el análisis inteligente.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { id: "automatizacion", title: "Chatbots y Automatización", desc: "IA en WhatsApp, ahorro de tiempo y procesos automáticos.", icon: Bot, c: "from-blue-500 to-cyan-400" },
          { id: "web", title: "Páginas Web / E-commerce", desc: "Presencia digital profesional, ventas online y landing pages.", icon: Globe, c: "from-emerald-500 to-teal-400" },
          { id: "app", title: "Aplicaciones Móviles", desc: "Desarrollo de Apps iOS/Android y plataformas a medida.", icon: Smartphone, c: "from-violet-500 to-purple-400" }
        ].map(opt => {
          const isSel = data.categoriaServicio === opt.id;
          return (
            <div key={opt.id} onClick={() => { setData({ ...data, categoriaServicio: opt.id as CategoriaServicio }); setTimeout(nextStep, 300); }}
              className={`cursor-pointer rounded-3xl p-6 flex flex-col transition-all duration-300 border ${isSel ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 hover:bg-white/5'}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.c} flex items-center justify-center mb-5`}><opt.icon className="w-6 h-6 text-white"/></div>
              <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{opt.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderIndustria = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿A qué se dedica tu empresa?</h2>
        <p className="text-muted-foreground">Personalizaremos el análisis según tu sector.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: "Restaurante", icon: Utensils },
          { id: "Hotel", icon: Hotel },
          { id: "Clínica", icon: Stethoscope },
          { id: "Bienes Raíces", icon: Building2 },
          { id: "E-commerce", icon: ShoppingBag },
          { id: "Servicios", icon: Users },
          { id: "Educación", icon: GraduationCap },
          { id: "Otro", icon: Sparkles }
        ].map(opt => {
          const isSel = data.tipoNegocio === opt.id;
          return (
            <div key={opt.id} onClick={() => { setData({ ...data, tipoNegocio: opt.id }); setTimeout(nextStep, 300); }}
              className={`cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 border shadow-sm hover:shadow-md ${isSel ? 'border-primary bg-primary/10 text-primary scale-105' : 'border-border/50 glass hover:border-primary/40 text-foreground/80'}`}>
              <opt.icon className="w-8 h-8" />
              <span className="font-semibold text-sm">{opt.id}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-start"><button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button></div>
    </div>
  );

  const renderProblema = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Qué deseas mejorar en tu negocio?</h2>
        <p className="text-muted-foreground">Selecciona tu objetivo principal para que el algoritmo proponga la solución correcta.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: "Responder clientes automáticamente", icon: MessageSquare },
          { id: "Generar más leads", icon: Target },
          { id: "Automatizar WhatsApp", icon: Bot },
          { id: "Reducir trabajo manual", icon: Timer },
          { id: "Agendar citas", icon: Calendar },
          { id: "Seguimiento de clientes", icon: Users },
          { id: "Integrar sistemas", icon: Workflow },
          { id: "Automatizar ventas", icon: PieChart }
        ].map(opt => {
          const isSel = data.problema === opt.id;
          return (
            <div key={opt.id} onClick={() => { setData({ ...data, problema: opt.id }); setTimeout(nextStep, 300); }}
              className={`cursor-pointer rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 border ${isSel ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 text-foreground/80'}`}>
              <div className="p-3 bg-background rounded-xl shadow-sm"><opt.icon className="w-5 h-5" /></div>
              <span className="font-semibold">{opt.id}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-start"><button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button></div>
    </div>
  );

  const renderVolumen = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Cuántos mensajes o leads reciben al mes?</h2>
        <p className="text-muted-foreground">El algoritmo calculará la potencia de procesamiento requerida.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {["0–100", "100–500", "500–2000", "+2000"].map(opt => {
          const isSel = data.volumen === opt;
          return (
            <div key={opt} onClick={() => { setData({ ...data, volumen: opt }); setTimeout(nextStep, 300); }}
              className={`cursor-pointer rounded-2xl p-5 text-center transition-all duration-300 border ${isSel ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 text-foreground/80'}`}>
              <span className="font-bold text-lg">{opt} interacciones / mes</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-start"><button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button></div>
    </div>
  );

  const renderHerramientas = () => {
    const herramientasPorIndustria: Record<string, string[]> = {
      "Restaurante": ["WhatsApp", "Instagram", "Google Sheets", "Sistema de POS", "Menú Digital", "Ninguna"],
      "Hotel": ["WhatsApp", "Motor Reservas", "Google Calendar", "Excel/Sheets", "TripAdvisor", "Ninguna"],
      "Clínica": ["WhatsApp", "Google Calendar", "Software Médico", "Excel", "Recordatorios SMS", "Ninguna"],
      "Bienes Raíces": ["WhatsApp", "CRM Inmobiliario", "Facebook Ads", "Excel", "Portales Inmob.", "Ninguna"],
      "E-commerce": ["Shopify/Woo", "WhatsApp", "Meta Ads", "Email Marketing", "Pasarela Pagos", "Ninguna"],
      "Servicios": ["WhatsApp", "Google Calendar", "CRM", "Zoom / Meet", "Facturación", "Ninguna"],
      "Educación": ["Plataforma LMS", "WhatsApp", "Google Sheets", "Zoom", "Email", "Ninguna"],
      "Otro": ["WhatsApp", "Google Sheets", "CRM", "Calendarios", "Meta Ads", "Ninguna"]
    };

    const opciones = herramientasPorIndustria[data.tipoNegocio] || herramientasPorIndustria["Otro"];

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-foreground">¿Qué herramientas utilizan actualmente?</h2>
          <p className="text-muted-foreground">Analizaremos la viabilidad de integración. <br/><span className="text-primary font-bold text-xs uppercase tracking-wider">(Selecciona las necesarias y haz clic en Siguiente)</span></p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {opciones.map(opt => {
            const isSel = data.herramientas.includes(opt);
            return (
              <div key={opt} onClick={() => handleToggleHerramienta(opt)}
                className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-300 border ${isSel ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 text-foreground/80'}`}>
                <span className="font-semibold text-sm">{opt}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border/50 sticky bottom-0 bg-background/95 backdrop-blur py-4 z-10">
          <button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button>
          <button onClick={nextStep} disabled={data.herramientas.length === 0} className="btn-primary-glow bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:animate-none animate-pulse hover:animate-none">Siguiente <ArrowRight className="w-4 h-4"/></button>
        </div>
      </div>
    );
  };

  const renderFuncionalidades = () => {
    const getOpciones = () => {
      const common = [
        { id: "Múltiples Idiomas", icon: Languages },
        { id: "Ninguna, busco algo informativo", icon: Globe }
      ];

      switch(data.tipoNegocio) {
        case "Restaurante":
          return [
            { id: "Menú Digital / Pedidos", icon: ShoppingBag },
            { id: "Reserva de Mesas", icon: Calendar },
            { id: "Panel de Administración", icon: LayoutDashboard },
            { id: "Pasarela de Pagos", icon: CreditCard },
            ...common
          ];
        case "Hotel":
          return [
            { id: "Motor de Reservas", icon: Calendar },
            { id: "Panel de Administración", icon: LayoutDashboard },
            { id: "Pasarela de Pagos", icon: CreditCard },
            { id: "Área de Huéspedes", icon: Lock },
            ...common
          ];
        case "Clínica":
          return [
            { id: "Citas Médicas Online", icon: Calendar },
            { id: "Portal de Pacientes", icon: Lock },
            { id: "Panel de Administración", icon: LayoutDashboard },
            { id: "Pasarela de Pagos", icon: CreditCard },
            ...common
          ];
        case "Bienes Raíces":
          return [
            { id: "Buscador Avanzado", icon: LayoutDashboard },
            { id: "Agenda de Visitas", icon: Calendar },
            { id: "Panel de Inmuebles", icon: LayoutDashboard },
            { id: "Área de Clientes", icon: Lock },
            ...common
          ];
        case "E-commerce":
          return [
            { id: "Tienda Online / E-commerce", icon: ShoppingBag },
            { id: "Gestión de Inventario", icon: LayoutDashboard },
            { id: "Pasarela de Pagos", icon: CreditCard },
            { id: "Área de Clientes", icon: Lock },
            ...common
          ];
        case "Educación":
          return [
            { id: "Plataforma de Cursos", icon: Lock },
            { id: "Sistema de Evaluaciones", icon: LayoutDashboard },
            { id: "Pasarela de Pagos", icon: CreditCard },
            { id: "Portal de Alumnos", icon: Lock },
            ...common
          ];
        default:
          return [
            { id: "Tienda Online / E-commerce", icon: ShoppingBag },
            { id: "Sistema de Reservas", icon: Calendar },
            { id: "Panel de Administración", icon: LayoutDashboard },
            { id: "Pasarela de Pagos", icon: CreditCard },
            { id: "Área Privada de Usuarios", icon: Lock },
            ...common
          ];
      }
    };

    const opciones = getOpciones();

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-foreground">¿Qué funciones avanzadas necesitas?</h2>
          <p className="text-muted-foreground">El sistema calculará la arquitectura tecnológica necesaria. <br/><span className="text-primary font-bold text-xs uppercase tracking-wider">(Selecciona varias opciones y presiona Siguiente)</span></p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {opciones.map(opt => {
            const isSel = data.funcionalidades.includes(opt.id);
            return (
              <div key={opt.id} onClick={() => handleToggleFuncionalidad(opt.id)}
                className={`cursor-pointer rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 border ${isSel ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 text-foreground/80'}`}>
                <div className="p-2 bg-background rounded-lg shadow-sm"><opt.icon className="w-5 h-5" /></div>
                <span className="font-semibold text-sm">{opt.id}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border/50 sticky bottom-0 bg-background/95 backdrop-blur py-4 z-10">
          <button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button>
          <button onClick={nextStep} disabled={data.funcionalidades.length === 0} className="btn-primary-glow bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:animate-none animate-pulse hover:animate-none">Siguiente <ArrowRight className="w-4 h-4"/></button>
        </div>
      </div>
    );
  };

  const renderDiseno = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Cuentas con diseño de marca o Logo?</h2>
        <p className="text-muted-foreground">Esto nos ayuda a saber si necesitamos incluir diseño UI/UX en la propuesta.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        {[
          { id: "Si, tengo todo listo", icon: Palette },
          { id: "Solo tengo el logo", icon: Sparkles },
          { id: "No, necesito diseño desde cero", icon: Globe }
        ].map(opt => {
          const isSel = data.tieneDiseno === opt.id;
          return (
            <div key={opt.id} onClick={() => { setData({ ...data, tieneDiseno: opt.id }); setTimeout(nextStep, 300); }}
              className={`cursor-pointer rounded-2xl p-5 flex items-center justify-center gap-3 text-center transition-all duration-300 border ${isSel ? 'border-primary bg-primary/10 text-primary scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 text-foreground/80'}`}>
              <opt.icon className="w-5 h-5"/>
              <span className="font-bold text-lg">{opt.id}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-start"><button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button></div>
    </div>
  );

  const renderDatos = () => (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">Hemos recopilado la data</h2>
        <p className="text-muted-foreground">Ingresa tus datos corporativos para que el algoritmo finalice el análisis y genere tu diagnóstico exacto.</p>
      </div>
      <form onSubmit={procesarDiagnostico} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5"><label className="text-xs font-semibold text-foreground/80 uppercase">Nombre Completo</label><input name="nombre" required value={data.lead.nombre} onChange={handleInputChange} className="w-full h-12 rounded-xl bg-background/50 border border-border/50 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Juan Pérez" /></div>
          <div className="space-y-1.5"><label className="text-xs font-semibold text-foreground/80 uppercase">WhatsApp</label><input name="telefono" required type="tel" value={data.lead.telefono} onChange={handleInputChange} className="w-full h-12 rounded-xl bg-background/50 border border-border/50 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="+1 (809) 000-0000" /></div>
        </div>
        <div className="space-y-1.5"><label className="text-xs font-semibold text-foreground/80 uppercase">Nombre de la Empresa</label><input name="empresa" required value={data.lead.empresa} onChange={handleInputChange} className="w-full h-12 rounded-xl bg-background/50 border border-border/50 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="Mi Empresa S.R.L" /></div>
        <div className="space-y-1.5"><label className="text-xs font-semibold text-foreground/80 uppercase">Email Corporativo</label><input name="email" required type="email" value={data.lead.email} onChange={handleInputChange} className="w-full h-12 rounded-xl bg-background/50 border border-border/50 px-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all" placeholder="juan@miempresa.com" /></div>
        {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <button type="button" onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button>
          <button type="submit" className="btn-primary-glow bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-primary/90">Analizar Datos <Sparkles className="w-4 h-4"/></button>
        </div>
      </form>
    </div>
  );

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in duration-300">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer glowing rings */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute inset-2 border-[3px] border-primary/30 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-4 border-[4px] border-primary rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
        
        {data.categoriaServicio === "automatizacion" ? <Cpu className="w-10 h-10 text-primary animate-pulse relative z-10" /> : <Globe className="w-10 h-10 text-primary animate-pulse relative z-10" />}
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-extrabold text-foreground min-h-[40px] tracking-tight">{analyzeText}</h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">El algoritmo de FlujoxAI está cruzando los datos para determinar la mejor solución técnica.</p>
      </div>

      <div className="w-72 h-1.5 bg-secondary rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-primary/20 w-full animate-pulse"></div>
        <div className="h-full bg-gradient-to-r from-primary/80 to-primary animate-[progress_6s_ease-in-out_forwards] relative z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
      </div>
    </div>
  );

  const renderResultadosWeb = () => {
    let precioMin = 300;
    let precioMax = 350;
    let titleSolucion = "Landing Page / Sitio Corporativo";
    let nivel = "Bajo - Presencia Digital";
    let isApp = data.categoriaServicio === "app";

    if (!data.funcionalidades.includes("Ninguna, busco algo informativo")) {
      nivel = "Medio - Sistema Web Interactivo";
      if (data.funcionalidades.includes("Tienda Online / E-commerce")) {
        precioMin += 250; precioMax += 350;
        titleSolucion = "E-commerce Avanzado";
        nivel = "Alto - Transaccional";
      }
      if (data.funcionalidades.includes("Sistema de Reservas")) {
        precioMin += 150; precioMax += 200;
        if (titleSolucion === "Landing Page / Sitio Corporativo") titleSolucion = "Plataforma de Gestión y Reservas";
      }
      if (data.funcionalidades.includes("Panel de Administración")) {
        precioMin += 200; precioMax += 300;
        nivel = "Avanzado - Aplicación Web Completa";
      }
      if (data.funcionalidades.includes("Pasarela de Pagos")) {
        precioMin += 100; precioMax += 150;
      }
      if (data.funcionalidades.includes("Área Privada de Usuarios")) {
        precioMin += 250; precioMax += 350;
      }
    }

    if (data.tieneDiseno === "No, necesito diseño desde cero") {
      precioMin += 150; precioMax += 200;
    }

    let precioStr = `$${precioMin} - $${precioMax} USD`;

    if (isApp) {
      precioStr = "Requiere Análisis Técnico Extra";
      titleSolucion = "Desarrollo de Aplicación a Medida (App)";
      nivel = "Avanzado - Arquitectura Móvil";
    }

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 py-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Propuesta de Desarrollo Flujo<span className="text-primary">xAI</span></h2>
          <p className="text-muted-foreground text-lg">Hemos enviado una copia detallada a <strong>{data.lead.email}</strong></p>
        </div>

        <div className="glass rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
          <div className="bg-primary/10 border-b border-border/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Arquitectura Recomendada</p>
              <h3 className="text-xl font-bold text-foreground">{titleSolucion}</h3>
            </div>
            <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-lg border border-border/50 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Inversión Estimada</p>
              <p className="text-lg font-black text-emerald-500">{precioStr}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">50% INICIO / 50% ENTREGA</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4 text-primary"/> Alcance del Proyecto</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Globe className="w-4 h-4"/></div><div><p className="font-bold text-sm">Diseño Responsivo</p><p className="text-xs text-muted-foreground">Perfecto en móviles y tablets</p></div></li>
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Zap className="w-4 h-4"/></div><div><p className="font-bold text-sm">Optimización SEO</p><p className="text-xs text-muted-foreground">Lista para posicionar en Google</p></div></li>
                  {data.funcionalidades.map(func => func !== "Ninguna, busco algo informativo" && (
                    <li key={func} className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Workflow className="w-4 h-4"/></div><div><p className="font-bold text-sm">{func}</p><p className="text-xs text-muted-foreground">Módulo avanzado integrado</p></div></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Cpu className="w-4 h-4 text-primary"/> Análisis de Complejidad</h4>
                <div className="bg-background/50 rounded-xl p-4 border border-border/50 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nivel:</span> <span className="font-bold text-primary">{nivel}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Industria:</span> <span className="font-semibold text-foreground">{data.tipoNegocio}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Diseño/Logo:</span> <span className="font-semibold text-foreground text-right">{data.tieneDiseno}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-background/30 rounded-xl p-5 border border-border/50">
              <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-primary"/> Infraestructura Externa (Proveedor)</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Globe className="w-4 h-4"/> Hosting y Dominio (.com)</span>
                  <span className="font-bold text-sm">~ $40 - $80 USD / año</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center">* El alojamiento web y nombre de dominio es un pago anual directo a proveedores como Hostinger o GoDaddy.</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-5 pt-4">
          <p className="text-sm text-muted-foreground">Un asesor ya está evaluando los detalles técnicos para coordinar contigo.</p>
          <a href={"https://wa.me/18492597719?text=" + encodeURIComponent("¡Hola! Solicité un diagnóstico inteligente para Desarrollo de " + (isApp ? "App" : "Página Web") + " para mi empresa *" + data.lead.empresa + "* y me gustaría validar los requisitos de la propuesta: " + titleSolucion)}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl text-sm font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-xl shadow-[#25D366]/20"
          >
            Validar Proyecto por WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  };

  const renderResultadosAutomatizacion = () => {
    let basePrice = 250;
    let maxPrice = 500;
    let titleSolucion = "Chatbot Inteligente de Atención";
    let nivel = "Medio - Respuesta y Clasificación";
    let ahorros = "20–40 horas mensuales";

    // Modificadores por volumen
    if (data.volumen === "100–500") {
      basePrice += 150; maxPrice += 250;
    } else if (data.volumen === "500–2000") {
      basePrice += 300; maxPrice += 500;
      titleSolucion = "Asistente IA + Gestión Empresarial";
      nivel = "Alto - Procesamiento de Ventas/Citas";
      ahorros = "50–100 horas mensuales";
    } else if (data.volumen === "+2000") {
      basePrice += 600; maxPrice += 1000;
      titleSolucion = "Arquitectura Avanzada de Agentes IA";
      nivel = "Empresarial - Procesamiento Masivo";
      ahorros = "100+ horas y escalabilidad total";
    }

    // Modificadores por integraciones
    const integraciones = data.herramientas.filter(h => h !== "Ninguna" && h !== "WhatsApp");
    if (integraciones.length > 0) {
      basePrice += (integraciones.length * 50);
      maxPrice += (integraciones.length * 80);
      if (integraciones.length >= 2 && data.volumen !== "+2000") {
        titleSolucion = "Ecosistema Integrado Inteligente";
        nivel = "Alto - Integración de API Compleja";
      }
    }

    let precioStr = `$${basePrice} - $${maxPrice} USD`;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 py-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">Diagnóstico Inteligente Flujo<span className="text-primary">xAI™</span></h2>
          <p className="text-muted-foreground text-lg">Hemos enviado una copia detallada a <strong>{data.lead.email}</strong></p>
        </div>

        <div className="glass rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
          <div className="bg-primary/10 border-b border-border/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Sistema Tecnológico Calculado</p>
              <h3 className="text-xl font-bold text-foreground">{titleSolucion}</h3>
            </div>
            <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-lg border border-border/50 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Inversión Estimada</p>
              <p className="text-lg font-black text-emerald-500">{precioStr}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">50% INICIO / 50% ENTREGA</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4 text-primary"/> Beneficios Proyectados</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Timer className="w-4 h-4"/></div><div><p className="font-bold text-sm">Ahorro Operativo</p><p className="text-xs text-muted-foreground">{ahorros} en trabajo manual</p></div></li>
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Zap className="w-4 h-4"/></div><div><p className="font-bold text-sm">Tiempo de Respuesta</p><p className="text-xs text-muted-foreground">Respuestas instantáneas 24/7</p></div></li>
                  {integraciones.length > 0 && (
                    <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Workflow className="w-4 h-4"/></div><div><p className="font-bold text-sm">Sincronización Total</p><p className="text-xs text-muted-foreground">Conecta {integraciones.join(', ')}</p></div></li>
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Cpu className="w-4 h-4 text-primary"/> Análisis Computacional</h4>
                <div className="bg-background/50 rounded-xl p-4 border border-border/50 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nivel Calculado:</span> <span className="font-bold text-primary max-w-[140px] text-right">{nivel}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Flujo Analizado:</span> <span className="font-semibold text-foreground">{data.volumen} interacciones</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nodos de Red:</span> <span className="font-semibold text-foreground">{data.herramientas.length === 0 || data.herramientas.includes("Ninguna") ? 1 : data.herramientas.length} en conexión</span></div>
                </div>
              </div>
            </div>

            <div className="bg-background/30 rounded-xl p-5 border border-border/50">
              <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-primary"/> Costos Operativos (Infraestructura Externa)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Cpu className="w-4 h-4"/> Servidor VPS</span>
                  <span className="font-bold text-sm">~ $80 USD / año</span>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4"/> Consumo de API (IA)</span>
                  <span className="font-bold text-sm">~ $30 USD / mes</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center">* La API de IA se cobra por consumo de tokens. El Servidor es un pago anual a un proveedor en la nube externo.</p>
              
              <div className="mt-4 bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Incluye 1 mes de Garantía y Calibración gratuita.</p>
                <p className="text-xs text-muted-foreground mt-1 ml-6">Luego del primer mes, ofrecemos planes de Mantenimiento y Soporte Opcional para escalar y cuidar el sistema.</p>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-amber-500/90 font-medium">
                Esta cotización es un cálculo inteligente basado en tus requerimientos. El costo final y los alcances se ajustan tras la reunión técnica inicial.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-5 pt-4">
          <p className="text-sm text-muted-foreground">Un Arquitecto de Software ya tiene los detalles de tu diagnóstico.</p>
          <a
            href={"https://wa.me/18492597719?text=" + encodeURIComponent("¡Hola! Acabo de hacer el diagnóstico de mi empresa *" + data.lead.empresa + "* y el algoritmo me recomendó: " + titleSolucion + " (" + precioStr + "). Me gustaría validarlo.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl text-sm font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-xl shadow-[#25D366]/20"
          >
            Hablar con Arquitecto en WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 filter blur-[100px] animate-glow-pulse bg-primary/40" />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-5xl flex-1 flex flex-col justify-center relative z-10">
        
        {currentStepName !== "resultados" && (
          <div className="flex flex-col items-center justify-center mb-10">
            <Link href="/" className="flex items-center gap-2.5 group mb-8">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg"><Bot className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-black text-xl tracking-tight text-foreground">Flujo<span className="gradient-text">xAI</span></span>
            </Link>
            
            <div className="w-full max-w-xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest px-1">
                <span>Inicio</span><span>Análisis</span><span>Diagnóstico</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStepIndex / (flow.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto">
          {analyzing ? renderLoader() : (
            <AnimatePresence mode="wait">
              {currentStepName === "servicio" && <motion.div key="servicio" exit={{opacity:0}}>{renderServicio()}</motion.div>}
              {currentStepName === "industria" && <motion.div key="industria" exit={{opacity:0}}>{renderIndustria()}</motion.div>}
              {currentStepName === "problema" && <motion.div key="problema" exit={{opacity:0}}>{renderProblema()}</motion.div>}
              {currentStepName === "funcionalidades" && <motion.div key="funcionalidades" exit={{opacity:0}}>{renderFuncionalidades()}</motion.div>}
              {currentStepName === "volumen" && <motion.div key="volumen" exit={{opacity:0}}>{renderVolumen()}</motion.div>}
              {currentStepName === "herramientas" && <motion.div key="herramientas" exit={{opacity:0}}>{renderHerramientas()}</motion.div>}
              {currentStepName === "diseno" && <motion.div key="diseno" exit={{opacity:0}}>{renderDiseno()}</motion.div>}
              {currentStepName === "datos" && <motion.div key="datos" exit={{opacity:0}}>{renderDatos()}</motion.div>}
              {currentStepName === "resultados" && <motion.div key="resultados" exit={{opacity:0}}>
                {data.categoriaServicio === "automatizacion" ? renderResultadosAutomatizacion() : renderResultadosWeb()}
              </motion.div>}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
