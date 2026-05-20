"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu, Database, Calendar, Mail, CheckCircle2, ArrowRight } from "lucide-react";

import { BrandIcon } from "./brand-icon";

import { AutomationDiagram } from "./automation-diagram";

export function AutomationFlow() {
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
        <AutomationDiagram showCard={true} />
      </div>
    </section>
  );
}

