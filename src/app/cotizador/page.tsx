"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Zap, 
  Workflow, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  DollarSign, 
  HelpCircle, 
  MessageSquare, 
  Cpu, 
  Sparkles,
  Server,
  Key
} from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/metrics";

type OptionType = "chatbot_crm" | "chatbot_full" | "solo_automatizacion";
type AutoType = "ninguna" | "simples" | "complejas";

interface LeadData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
}

export default function Cotizador() {
  const [step, setStep] = useState(1);
  const [solucion, setSolucion] = useState<OptionType | null>(null);
  const [automatizacion, setAutomatizacion] = useState<AutoType | null>(null);
  const [lead, setLead] = useState<LeadData>({
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = () => {
    if (step === 1 && !solucion) return;
    if (step === 2 && !automatizacion) return;
    
    trackEvent("cotizador_paso_completado", { paso: step, solucion, automatizacion });
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSelectSolucion = (val: OptionType) => {
    setSolucion(val);
    trackEvent("cotizador_seleccion_solucion", { solucion: val });
  };

  const handleSelectAutomatizacion = (val: AutoType) => {
    setAutomatizacion(val);
    trackEvent("cotizador_seleccion_automatizacion", { automatizacion: val });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  // Lógica de cálculo matemática del presupuesto
  const calcularPresupuesto = () => {
    let costoDesarrolloRD = 0;
    let costoDesarrolloUSD = 0;
    let requiereInfraestructura = false;

    // 1. Chatbot Base
    if (solucion === "chatbot_crm") {
      costoDesarrolloRD = 10000;
      requiereInfraestructura = true;
    } else if (solucion === "chatbot_full") {
      costoDesarrolloRD = 20000;
      requiereInfraestructura = true;
    }

    // 2. Automatizaciones Premium
    if (automatizacion === "simples") {
      costoDesarrolloUSD = 300;
    } else if (automatizacion === "complejas") {
      costoDesarrolloUSD = 400;
    }

    return {
      costoDesarrolloRD,
      costoDesarrolloUSD,
      requiereInfraestructura
    };
  };

  const { costoDesarrolloRD, costoDesarrolloUSD, requiereInfraestructura } = calcularPresupuesto();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.nombre || !lead.email || !lead.telefono) {
      setErrorMsg("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solucion,
          automatizacion,
          costoDesarrolloRD,
          costoDesarrolloUSD,
          lead,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar tu cotización.");
      }

      trackEvent("cotizacion_solicitada", { 
        nombre: lead.nombre, 
        empresa: lead.empresa,
        desarrolloRD: costoDesarrolloRD,
        desarrolloUSD: costoDesarrolloUSD
      });

      setStep(4);
    } catch (err: any) {
      console.error("Error submitting quote:", err);
      setErrorMsg(err.message || "Error de red. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Paso 1: Selección de Solución
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          ¿Qué tipo de solución estás buscando?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Selecciona la base tecnológica que requiere tu empresa para arrancar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {[
          {
            id: "chatbot_crm",
            title: "Chatbot + CRM Inteligente",
            price: "RD$ 10,000",
            term: "Pago Único",
            desc: "Asistente inteligente en WhatsApp que responde preguntas de clientes y registra leads en un CRM automáticamente.",
            features: ["Conexión a WhatsApp", "CRM Integrado", "1 mes de garantía"],
            icon: MessageSquare,
            gradient: "from-blue-500 to-cyan-400"
          },
          {
            id: "chatbot_full",
            title: "Agente AI / Chatbot Full",
            price: "RD$ 20,000",
            term: "Pago Único",
            desc: "Agente autónomo sumamente avanzado capaz de calificar prospectos detalladamente, agendar citas y realizar flujos complejos.",
            features: ["Agente inteligente 100% autónomo", "Agendamiento automático", "1 mes de garantía"],
            icon: Bot,
            gradient: "from-violet-500 to-purple-400"
          },
          {
            id: "solo_automatizacion",
            title: "Solo Automatización",
            price: "Desde $300 USD",
            term: "Pago Único",
            desc: "Para conectar tus aplicaciones actuales (Emails, Calendarios, CRM, Bases de datos) y erradicar tareas repetitivas.",
            features: ["Sincronización multisistema", "Cero trabajo manual", "Reportes en tiempo real"],
            icon: Workflow,
            gradient: "from-teal-500 to-emerald-400"
          }
        ].map((opt) => {
          const Icon = opt.icon;
          const isSelected = solucion === opt.id;
          return (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              onClick={() => handleSelectSolucion(opt.id as OptionType)}
              className={`relative flex flex-col rounded-3xl p-6 border cursor-pointer transition-all duration-300 select-none ${
                isSelected 
                  ? "bg-primary/10 border-primary shadow-xl shadow-primary/5" 
                  : "glass border-white/10 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              )}
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center mb-5`}>
                <Icon className="h-5.5 w-5.5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{opt.title}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl font-extrabold text-foreground">{opt.price}</span>
                <span className="text-xs text-muted-foreground">/ {opt.term}</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed mb-5 flex-1">{opt.desc}</p>
              <ul className="space-y-2 border-t border-white/5 pt-4">
                {opt.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6 border-t border-white/5">
        <button
          onClick={handleNext}
          disabled={!solucion}
          className="inline-flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Siguiente paso
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  // Paso 2: Selección de Automatizaciones
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          ¿Deseas automatizar procesos o integrar herramientas?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Conectamos tus sistemas para que tus datos fluyan automáticamente y sin errores manuales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {[
          {
            id: "ninguna",
            title: "No, solo el chatbot",
            price: "+$0 USD",
            term: "Sin cargos extra",
            desc: "Deseo únicamente el chatbot conversacional seleccionado en el paso anterior. No requiero integraciones complejas de software.",
            features: ["Operación estándar", "Sin costos adicionales", "Excelente para empezar"],
            icon: MessageSquare,
            gradient: "from-zinc-500 to-zinc-400"
          },
          {
            id: "simples",
            title: "Automatización Simple",
            price: "+$300 USD",
            term: "Pago Único",
            desc: "Ideal para conectar de 2 a 3 herramientas comerciales comunes. Ejemplo: Enviar nuevos prospectos de WhatsApp a Google Sheets y disparar correos de confirmación.",
            features: ["Conexión de 2-3 herramientas", "Sheets, Email o Calendarios", "Eliminación de flujos manuales simples"],
            icon: Zap,
            gradient: "from-blue-500 to-violet-400"
          },
          {
            id: "complejas",
            title: "Integración Multisistema",
            price: "+$400 USD",
            term: "Pago Único",
            desc: "Servicio premium para conectar múltiples herramientas de negocio complejas en sincronía. Conectamos CRM, ERP, bases de datos y WhatsApp en flujos avanzados.",
            features: ["Integración multisistema", "CRM, ERP, Bases de Datos, Shopify", "Flujos inteligentes con filtros y lógica"],
            icon: Cpu,
            gradient: "from-pink-500 to-rose-400"
          }
        ].map((opt) => {
          const Icon = opt.icon;
          const isSelected = automatizacion === opt.id;
          return (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              onClick={() => handleSelectAutomatizacion(opt.id as AutoType)}
              className={`relative flex flex-col rounded-3xl p-6 border cursor-pointer transition-all duration-300 select-none ${
                isSelected 
                  ? "bg-primary/10 border-primary shadow-xl shadow-primary/5" 
                  : "glass border-white/10 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              )}
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center mb-5`}>
                <Icon className="h-5.5 w-5.5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{opt.title}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xl font-extrabold text-foreground">{opt.price}</span>
                <span className="text-xs text-muted-foreground">/ {opt.term}</span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed mb-5 flex-1">{opt.desc}</p>
              <ul className="space-y-2 border-t border-white/5 pt-4">
                {opt.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6 border-t border-white/5">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold border border-white/10 hover:border-white/20 hover:bg-white/5 text-foreground transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>

        <button
          onClick={handleNext}
          disabled={!automatizacion}
          className="inline-flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Siguiente paso
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  // Paso 3: Captura de Datos
  const renderStep3 = () => (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
          ¡Listo! Solo unos datos para calcular tu presupuesto
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Ingresa tus datos de contacto para enviarte la propuesta formal a tu correo de inmediato.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">
              Nombre Completo
            </label>
            <input 
              id="nombre" 
              name="nombre" 
              required 
              value={lead.nombre}
              onChange={handleInputChange}
              className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
              placeholder="Juan Pérez" 
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="telefono" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">
              WhatsApp / Teléfono
            </label>
            <input 
              id="telefono" 
              name="telefono" 
              required 
              type="tel"
              value={lead.telefono}
              onChange={handleInputChange}
              className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
              placeholder="+1 (809) 000-0000" 
            />
          </div>
        </div>
      
        <div className="space-y-1.5">
          <label htmlFor="empresa" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">Nombre de tu Empresa (Opcional)</label>
          <input 
            id="empresa" 
            name="empresa" 
            value={lead.empresa}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
            placeholder="Mi Empresa S.R.L" 
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">Email Corporativo</label>
          <input 
            id="email" 
            name="email" 
            required 
            type="email"
            value={lead.email}
            onChange={handleInputChange}
            className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
            placeholder="juan@miempresa.com" 
          />
        </div>

        {errorMsg && <p className="text-sm text-destructive font-medium">{errorMsg}</p>}

        <div className="flex justify-between pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-bold border border-white/10 hover:border-white/20 hover:bg-white/5 text-foreground transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer min-w-[160px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Calculando...
              </>
            ) : (
              <>
                Calcular Presupuesto
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Paso 4: Pantalla de Éxito / Resultados
  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto space-y-8 text-center py-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          ¡Presupuesto Estimado Generado!
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Hemos enviado una copia formal de esta propuesta a tu correo electrónico **{lead.email}**.
        </p>
      </div>

      {/* Quote card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl text-left"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground tracking-wider uppercase font-semibold">Resumen de Propuesta</p>
            <h4 className="font-bold text-foreground mt-0.5">{lead.empresa || "Tu Proyecto"}</h4>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            1 Mes de Garantía
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Desglose de Desarrollo */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground/80 tracking-wide uppercase">Costo de Desarrollo (Pago Único)</h4>
            <div className="space-y-2.5">
              {costoDesarrolloRD > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    {solucion === "chatbot_crm" ? "Chatbot WhatsApp + CRM Inteligente" : "Chatbot Full / Agente AI Autónomo"}
                  </span>
                  <span className="font-bold text-foreground">RD$ {costoDesarrolloRD.toLocaleString()}</span>
                </div>
              )}

              {costoDesarrolloUSD > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-violet-400" />
                    {automatizacion === "simples" ? "Automatización Simple (2-3 herramientas)" : "Integración Multisistema Completa"}
                  </span>
                  <span className="font-bold text-foreground">${costoDesarrolloUSD} USD</span>
                </div>
              )}

              {solucion === "solo_automatizacion" && costoDesarrolloUSD === 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-emerald-400" />
                    Automatización de Procesos (A evaluar)
                  </span>
                  <span className="font-bold text-foreground">A evaluar</span>
                </div>
              )}
            </div>
          </div>

          {/* Desglose de Infraestructura (Transparente para el cliente) */}
          {requiereInfraestructura && (
            <div className="space-y-3 border-t border-white/5 pt-5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground/80 tracking-wide uppercase">Infraestructura Propia del Cliente</h4>
                <div className="group relative">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-black text-[10px] text-zinc-400 leading-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-xl z-50">
                    Costo cobrado por los proveedores directamente (OpenAI, DigitalOcean/VPS). Te ayudamos a configurarlo todo de forma independiente.
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Server className="h-4 w-4 text-amber-500" />
                    Servidor VPS (Alojamiento autónomo)
                  </span>
                  <span className="font-semibold text-foreground">$80 USD / mes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Key className="h-4 w-4 text-rose-400" />
                    Consumo API de Inteligencia Artificial
                  </span>
                  <span className="font-semibold text-foreground">~$30 USD / mes (aprox)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer de la Cotización */}
        <div className="bg-white/2 p-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>Mantenimiento & Soporte continuo con FlujoXAI es **100% opcional**.</p>
          <p className="font-semibold text-foreground">Propuesta válida por 30 días</p>
        </div>
      </motion.div>

      {/* CTA Final */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-foreground">¿Te interesa agendar la llamada técnica de inicio?</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Agenda una reunión gratuita de 15 minutos para programar la entrega de tu chatbot o automatización.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <a
            href="https://wa.me/18492597719?text=%C2%A1Hola%21%20Ya%20tengo%20mi%20presupuesto%20autom%C3%A1tico%20de%20FlujoxAI%20y%20me%20gustar%C3%ADa%20coordinar%20el%20inicio%20%F0%9F%A4%96"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-2xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            Confirmar por WhatsApp
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          
          <Link
            href="/#contacto"
            className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            Agendar Llamada en la Web
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col py-16">
      
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 filter blur-[80px] animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, oklch(0.65 0.22 255) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[5%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10 filter blur-[80px] animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, oklch(0.62 0.25 300) 0%, transparent 70%)', animationDelay: '2s' }} />
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-4xl flex-1 flex flex-col justify-center relative z-10">
        
        {/* Logo de cabecera */}
        <div className="flex flex-col items-center justify-center mb-10 space-y-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tight text-foreground">
              Flujo<span className="gradient-text">xAI</span>
            </span>
          </Link>
        </div>

        {/* Card contenedor principal */}
        <div className="glass rounded-[2rem] border border-white/10 dark:border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-3xl min-h-[460px] flex flex-col justify-between">
          
          {/* Barra de progreso de pasos */}
          {step < 4 && (
            <div className="mb-10">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground mb-3">
                <span className={step >= 1 ? "text-primary" : ""}>1. Solución</span>
                <span className={step >= 2 ? "text-primary" : ""}>2. Automatización</span>
                <span className={step >= 3 ? "text-primary" : ""}>3. Datos de Contacto</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  initial={{ width: "33.3%" }}
                  animate={{ 
                    width: step === 1 ? "33.3%" : step === 2 ? "66.6%" : "100%" 
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          {/* Cuerpo interactivo del Cotizador */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Volver a inicio */}
        <div className="mt-8 text-center text-xs">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a la página principal
          </Link>
        </div>

      </div>
    </div>
  );
}
