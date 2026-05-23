"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/metrics";


export function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get("nombre") as string,
      telefono: formData.get("telefono") as string,
      empresa: formData.get("empresa") as string,
      email: formData.get("email") as string,
      mensaje: formData.get("mensaje") as string,
    };

    const { error } = await supabase.from('leads').insert([data]);

    setLoading(false);
    
    if (error) {
        console.error("Error inserting lead:", error);
        setErrorMsg("Error: " + (error.message || error.details || JSON.stringify(error)));
    } else {
        trackEvent('lead_generado', { 
            empresa: data.empresa,
            nombre: data.nombre 
        });

        // Trigger Phase 7 Notification
        import('@/lib/notifications').then(({ sendLeadNotification }) => {
            sendLeadNotification(data);
        });

        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
    }



  };

  return (
    <section id="contacto" className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Comienza tu <br/>
              <span className="text-primary">Transformación</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Déjanos tus datos y un especialista analizará cómo la Inteligencia Artificial puede revolucionar tu empresa sin compromiso.
            </p>
            
            <div className="p-6 bg-card rounded-2xl border shadow-sm mt-8 hidden md:block">
                <h4 className="font-semibold text-foreground mb-2">Lo que obtendrás:</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Auditoría gratuita de procesos</li>
                    <li>Demostración personalizada</li>
                    <li>Plan de implementación técnico</li>
                </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass p-8 rounded-[2rem] border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          >
            {/* Background flourish inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none filter blur-xl" />

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">
                    Nombre Completo
                  </label>
                  <input 
                    id="nombre" 
                    name="nombre" 
                    required 
                    className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
                    placeholder="Juan Pérez" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">
                    Teléfono / WhatsApp
                  </label>
                  <input 
                    id="telefono" 
                    name="telefono" 
                    required 
                    type="tel" 
                    className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
                    placeholder="+1 (809) 000-0000" 
                  />
                </div>
              </div>
            
            <div className="space-y-2">
              <label htmlFor="empresa" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">Empresa (Opcional)</label>
              <input 
                id="empresa" 
                name="empresa" 
                className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
                placeholder="Mi Empresa S.R.L" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">Email Corporativo</label>
              <input 
                id="email" 
                name="email" 
                required 
                type="email" 
                className="flex h-11 w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner" 
                placeholder="juan@miempresa.com" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mensaje" className="text-xs font-semibold text-foreground/80 tracking-wider uppercase">Mensaje / Requerimientos</label>
              <textarea 
                id="mensaje" 
                name="mensaje" 
                required 
                className="flex min-h-[100px] w-full rounded-xl border border-white/10 dark:border-white/5 bg-background/30 backdrop-blur-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 shadow-inner resize-none" 
                placeholder="¿Qué procesos te gustaría automatizar en tu empresa?"
              />
            </div>

            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
            {success && <p className="text-sm text-emerald-400 font-semibold tracking-wide">¡Gracias! Tu solicitud ha sido enviada con éxito.</p>}

            <button 
              type="submit" 
              className="w-full mt-4 h-12 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 shadow-lg shadow-primary/20 btn-primary-glow flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : "Solicitar Asesoría Gratuita"}
            </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
