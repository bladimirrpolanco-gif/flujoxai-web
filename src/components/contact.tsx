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
        setErrorMsg("Hubo un error al enviar tu mensaje. Intenta nuevamente.");
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
            className="bg-card p-8 rounded-3xl border shadow-lg relative overflow-hidden"
          >
            {/* Background flourish inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium leading-none">
                    Nombre Completo
                  </label>
                  <input id="nombre" name="nombre" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefono" className="text-sm font-medium leading-none">
                    Teléfono / WhatsApp
                  </label>
                  <input id="telefono" name="telefono" required type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="+1 (809) 000-0000" />
                </div>
              </div>
            
            <div className="space-y-2">
              <label htmlFor="empresa" className="text-sm font-medium leading-none">Empresa</label>
              <input id="empresa" name="empresa" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-ring focus-visible:ring-2" placeholder="Mi Empresa S.R.L" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
              <input id="email" name="email" required type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-ring focus-visible:ring-2" placeholder="juan@miempresa.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="mensaje" className="text-sm font-medium leading-none">Mensaje</label>
              <textarea id="mensaje" name="mensaje" required className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>

            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
            {success && <p className="text-sm text-green-600 font-medium">¡Gracias! Nos pondremos en contacto pronto.</p>}

            <Button type="submit" className="w-full mt-2 h-11" disabled={loading}>
              {loading ? "Enviando..." : "Solicitar Asesoría"}
            </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
