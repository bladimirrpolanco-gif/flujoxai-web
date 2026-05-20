"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Zap, Workflow, ArrowRight, ArrowLeft, CheckCircle2, 
  MessageSquare, Cpu, Sparkles, Building2, Utensils, 
  Hotel, Stethoscope, GraduationCap, Users, Calendar, 
  Mail, ShoppingBag, PieChart, Activity, Plug, Timer, Target
} from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/metrics";

type NivelSolucion = "basico" | "empresarial" | "ia_avanzada";

interface DiagnosticoData {
  tipoNegocio: string;
  problema: string;
  volumen: string;
  herramientas: string[];
  nivelSolucion: NivelSolucion | null;
  lead: {
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
  };
}

export default function DiagnosticoPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState("Analizando necesidades...");
  const [errorMsg, setErrorMsg] = useState("");

  const [data, setData] = useState<DiagnosticoData>({
    tipoNegocio: "",
    problema: "",
    volumen: "",
    herramientas: [],
    nivelSolucion: null,
    lead: { nombre: "", email: "", telefono: "", empresa: "" }
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleToggleHerramienta = (tool: string) => {
    setData(prev => {
      const isSelected = prev.herramientas.includes(tool);
      if (tool === "Ninguna") {
        return { ...prev, herramientas: ["Ninguna"] };
      }
      let nuevas = isSelected 
        ? prev.herramientas.filter(t => t !== tool)
        : [...prev.herramientas.filter(t => t !== "Ninguna"), tool];
      return { ...prev, herramientas: nuevas };
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

    // Efecto psicológico de carga
    const frases = [
      "Analizando necesidades del sector...",
      "Calculando volumen de operaciones...",
      "Estructurando arquitectura de IA...",
      "Generando diagnóstico personalizado..."
    ];
    
    for (let i = 0; i < frases.length; i++) {
      setAnalyzeText(frases[i]);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error en el servidor");
      trackEvent("diagnostico_completado", { solucion: data.nivelSolucion });
      setStep(8); // Pantalla de Resultados
    } catch (err: any) {
      setErrorMsg("Hubo un error al procesar la solicitud. Intenta nuevamente.");
      setStep(6);
    } finally {
      setAnalyzing(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿A qué se dedica tu empresa?</h2>
        <p className="text-muted-foreground">Personalizaremos el diagnóstico según tu sector.</p>
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
          { id: "Otro", icon: Bot }
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Qué deseas mejorar en tu negocio?</h2>
        <p className="text-muted-foreground">Selecciona tu objetivo principal para enfocarnos en resultados.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: "Responder clientes automáticamente", icon: MessageSquare },
          { id: "Generar más leads", icon: Target },
          { id: "Automatizar WhatsApp", icon: Bot },
          { id: "Reducir trabajo manual", icon: Timer },
          { id: "Agendar citas", icon: Calendar },
          { id: "Seguimiento de clientes", icon: Users },
          { id: "Integrar sistemas", icon: Plug },
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

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Cuántos clientes o mensajes reciben al mes?</h2>
        <p className="text-muted-foreground">Nos ayuda a calcular la complejidad y capacidad requerida del sistema.</p>
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

  const renderStep4 = () => {
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
          <p className="text-muted-foreground">Selecciona dónde invierte tiempo manualmente tu equipo de {data.tipoNegocio ? data.tipoNegocio.toLowerCase() : "trabajo"}.</p>
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
        <div className="flex justify-between items-center pt-4 border-t border-border/50">
          <button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button>
          <button onClick={nextStep} disabled={data.herramientas.length === 0} className="btn-primary-glow bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">Siguiente <ArrowRight className="w-4 h-4"/></button>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">¿Qué nivel de solución necesitas?</h2>
        <p className="text-muted-foreground">Selecciona la base tecnológica que impulsará tus resultados.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { id: "basico", title: "Chatbot Inteligente", desc: "Atención automática 24/7, captura de leads y WhatsApp integrado.", icon: MessageSquare, c: "from-blue-500 to-cyan-400" },
          { id: "empresarial", title: "Automatización Empresarial", desc: "Conexión entre aplicaciones, eliminación de tareas manuales y automatización de flujos.", icon: Workflow, c: "from-violet-500 to-purple-400" },
          { id: "ia_avanzada", title: "IA Avanzada Empresarial", desc: "Agentes IA inteligentes, seguimiento automático, procesos complejos e integraciones profundas.", icon: Cpu, c: "from-amber-500 to-orange-400" }
        ].map(opt => {
          const isSel = data.nivelSolucion === opt.id;
          return (
            <div key={opt.id} onClick={() => { setData({ ...data, nivelSolucion: opt.id as NivelSolucion }); setTimeout(nextStep, 300); }}
              className={`cursor-pointer rounded-3xl p-6 flex flex-col transition-all duration-300 border ${isSel ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]' : 'border-border/50 glass hover:border-primary/40 hover:bg-white/5'}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.c} flex items-center justify-center mb-5`}><opt.icon className="w-6 h-6 text-white"/></div>
              <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{opt.desc}</p>
            </div>
          )
        })}
      </div>
      <div className="flex justify-start"><button onClick={prevStep} className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Atrás</button></div>
    </div>
  );

  const renderStep6 = () => (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold text-foreground">Tu diagnóstico está casi listo</h2>
        <p className="text-muted-foreground">Ingresa tus datos corporativos para generar el análisis completo y enviarlo a tu correo.</p>
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
          <button type="submit" className="btn-primary-glow bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-primary/90">Generar Diagnóstico <Sparkles className="w-4 h-4"/></button>
        </div>
      </form>
    </div>
  );

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in duration-300">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        <Bot className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-2xl font-bold text-foreground text-center min-h-[40px]">{analyzeText}</h3>
      <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-[progress_3s_ease-in-out_forwards]"></div>
      </div>
    </div>
  );

  const renderResults = () => {
    let precio = "RD$15,000 – RD$35,000";
    let ahorros = "20–40 horas mensuales";
    let titleSolucion = "Chatbot Inteligente para WhatsApp";

    if (data.nivelSolucion === "empresarial") {
      precio = "RD$35,000 – RD$80,000";
      ahorros = "50–100 horas mensuales";
      titleSolucion = "Sistema de Automatización Empresarial";
    } else if (data.nivelSolucion === "ia_avanzada") {
      precio = "RD$80,000 – RD$250,000+";
      ahorros = "100+ horas y eliminación de errores";
      titleSolucion = "Agente de IA y Arquitectura Avanzada";
    }

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
              <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">Solución Recomendada</p>
              <h3 className="text-xl font-bold text-foreground">{titleSolucion}</h3>
            </div>
            <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-lg border border-border/50 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Inversión Estimada</p>
              <p className="text-lg font-black text-emerald-500">{precio}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-semibold">50% INICIO / 50% ENTREGA</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4 text-primary"/> Beneficios Proyectados</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Timer className="w-4 h-4"/></div><div><p className="font-bold text-sm">Ahorro Operativo</p><p className="text-xs text-muted-foreground">{ahorros} en trabajo manual</p></div></li>
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Zap className="w-4 h-4"/></div><div><p className="font-bold text-sm">Tiempo de Respuesta</p><p className="text-xs text-muted-foreground">Menos de 1 minuto, 24/7</p></div></li>
                  <li className="flex items-start gap-3"><div className="mt-0.5 p-1 bg-primary/10 text-primary rounded"><Workflow className="w-4 h-4"/></div><div><p className="font-bold text-sm">Mejora Operativa</p><p className="text-xs text-muted-foreground">Centralización de procesos</p></div></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2"><Building2 className="w-4 h-4 text-primary"/> Perfil Analizado</h4>
                <div className="bg-background/50 rounded-xl p-4 border border-border/50 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Industria:</span> <span className="font-semibold text-foreground">{data.tipoNegocio}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Volumen:</span> <span className="font-semibold text-foreground">{data.volumen} msjs/mes</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Objetivo:</span> <span className="font-semibold text-foreground text-right max-w-[150px] truncate">{data.problema}</span></div>
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
              <p className="text-[10px] text-muted-foreground mt-3 text-center">* La API se cobra por consumo (tokens). El Servidor VPS es un pago anual directo al proveedor.</p>
              
              <div className="mt-4 bg-primary/5 rounded-lg p-3 border border-primary/20">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Incluye 1 mes de Garantía y Calibración gratuita.</p>
                <p className="text-xs text-muted-foreground mt-1 ml-6">Luego del primer mes, ofrecemos planes de Mantenimiento y Soporte Opcional para cuidar tu sistema.</p>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-amber-500/90 font-medium">
                Cada solución es 100% personalizada según los procesos, integraciones y nivel de automatización específico requerido por tu empresa.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-5 pt-4">
          <p className="text-sm text-muted-foreground">Un especialista ya está revisando tu perfil y te contactará en breve.</p>
          <a
            href={`https://wa.me/18492597719?text=${encodeURIComponent(`¡Hola! Acabo de hacer el diagnóstico inteligente para mi empresa *${data.lead.empresa}* y me gustaría iniciar. Mi solución recomendada es: ${titleSolucion}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl text-sm font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all shadow-xl shadow-[#25D366]/20"
          >
            Hablar por WhatsApp Inmediatamente
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
        
        {step < 7 && (
          <div className="flex flex-col items-center justify-center mb-10">
            <Link href="/" className="flex items-center gap-2.5 group mb-8">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg"><Bot className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-black text-xl tracking-tight text-foreground">Flujo<span className="gradient-text">xAI</span></span>
            </Link>
            
            <div className="w-full max-w-xl">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest px-1">
                <span>Inicio</span><span>Análisis</span><span>Solución</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary"
                  initial={{ width: "16%" }}
                  animate={{ width: `${(step / 6) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto">
          {analyzing ? renderLoader() : (
            <AnimatePresence mode="wait">
              {step === 1 && <motion.div key="1" exit={{opacity:0}}>{renderStep1()}</motion.div>}
              {step === 2 && <motion.div key="2" exit={{opacity:0}}>{renderStep2()}</motion.div>}
              {step === 3 && <motion.div key="3" exit={{opacity:0}}>{renderStep3()}</motion.div>}
              {step === 4 && <motion.div key="4" exit={{opacity:0}}>{renderStep4()}</motion.div>}
              {step === 5 && <motion.div key="5" exit={{opacity:0}}>{renderStep5()}</motion.div>}
              {step === 6 && <motion.div key="6" exit={{opacity:0}}>{renderStep6()}</motion.div>}
              {step === 8 && <motion.div key="8" exit={{opacity:0}}>{renderResults()}</motion.div>}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
