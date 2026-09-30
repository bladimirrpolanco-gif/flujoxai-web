"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, CalendarCheck } from "lucide-react";

const TRANSCRIPT: { speaker: "caller" | "agent"; text: string }[] = [
  { speaker: "caller", text: "Hola, quisiera saber si tienen disponibilidad esta semana." },
  { speaker: "agent", text: "Claro, tengo espacio el jueves a las 10am o el viernes a las 3pm." },
  { speaker: "caller", text: "El viernes a las 3 está bien." },
  { speaker: "agent", text: "Perfecto, quedas agendado. Te llega la confirmación por WhatsApp." },
];

const LINE_INTERVAL = 2200;
const OUTCOME_DELAY = TRANSCRIPT.length * LINE_INTERVAL + 900;
const CYCLE_DURATION = OUTCOME_DELAY + 3200;

export function VoiceCallDemo() {
  const [cycle, setCycle] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    setVisibleLines(0);
    setShowOutcome(false);
    setSeconds(0);

    TRANSCRIPT.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), (i + 1) * LINE_INTERVAL));
    });
    timers.push(setTimeout(() => setShowOutcome(true), OUTCOME_DELAY));
    timers.push(setTimeout(() => setCycle((c) => c + 1), CYCLE_DURATION));

    const tick = setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => { timers.forEach(clearTimeout); clearInterval(tick); };
  }, [cycle]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-8 bg-gradient-to-br from-emerald-500/15 via-transparent to-[#0877f9]/15 blur-3xl -z-10" />

      <div className="glass border border-border/50 rounded-[2rem] overflow-hidden">
        {/* Call header */}
        <div className="bg-gradient-to-r from-[#0877f9] to-[#0565E8] px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm leading-none">Agente de Voz IA</p>
              <p className="text-[11px] text-white/70 mt-1">Llamada en curso</p>
            </div>
          </div>
          <span className="text-sm font-mono tabular-nums">{mm}:{ss}</span>
        </div>

        {/* Waveform */}
        <div className="flex items-center justify-center gap-1 h-16 px-6 bg-muted/20">
          {[...Array(24)].map((_, i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-primary/70"
              animate={{ height: [6, 6 + ((i * 7) % 26), 6] }}
              transition={{ duration: 0.8 + (i % 5) * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Transcript */}
        <div className="p-6 space-y-3 min-h-[190px]">
          <AnimatePresence>
            {TRANSCRIPT.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${line.speaker === "caller" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  line.speaker === "caller"
                    ? "bg-muted/40 text-foreground rounded-tl-sm"
                    : "bg-primary/10 text-foreground rounded-tr-sm"
                }`}>
                  {line.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {showOutcome && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 justify-center pt-3 border-t border-border/30 mt-4"
              >
                <CalendarCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Cita agendada por teléfono</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
