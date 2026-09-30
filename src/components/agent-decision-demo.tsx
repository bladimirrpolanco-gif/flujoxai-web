"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Calendar, UserPlus, MessageSquareText } from "lucide-react";

type Step = "message" | "thinking" | "result";

interface Scenario {
  incoming: string;
  outcomeIcon: typeof CheckCircle2;
  outcomeLabel: string;
  outcomeDetail: string;
}

const SCENARIOS: Scenario[] = [
  {
    incoming: "Hola, ¿tienen turno para mañana en la tarde?",
    outcomeIcon: Calendar,
    outcomeLabel: "Cita agendada",
    outcomeDetail: "Mañana 3:00 PM · confirmación enviada",
  },
  {
    incoming: "Quiero saber precios para mi negocio",
    outcomeIcon: UserPlus,
    outcomeLabel: "Lead calificado",
    outcomeDetail: "Datos capturados · agregado al CRM",
  },
  {
    incoming: "¿El servicio funciona fuera de mi país?",
    outcomeIcon: MessageSquareText,
    outcomeLabel: "Consulta resuelta",
    outcomeDetail: "Respondida con base de conocimiento",
  },
];

const STEP_DURATIONS = { message: 1400, thinking: 1600, result: 2600 };

export function AgentDecisionDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState<Step>("message");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    setStep("message");
    timers.push(setTimeout(() => setStep("thinking"), STEP_DURATIONS.message));
    timers.push(setTimeout(() => setStep("result"), STEP_DURATIONS.message + STEP_DURATIONS.thinking));
    timers.push(setTimeout(() => {
      setScenarioIdx((i) => (i + 1) % SCENARIOS.length);
    }, STEP_DURATIONS.message + STEP_DURATIONS.thinking + STEP_DURATIONS.result));

    return () => timers.forEach(clearTimeout);
  }, [scenarioIdx]);

  const scenario = SCENARIOS[scenarioIdx];
  const OutcomeIcon = scenario.outcomeIcon;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Ambient glow, distinct from the WhatsApp-style demo used elsewhere */}
      <div className="absolute -inset-8 bg-gradient-to-br from-[#0877f9]/20 via-transparent to-transparent blur-3xl -z-10" />

      <div className="glass border border-border/50 rounded-[2rem] p-6 md:p-8 min-h-[360px] flex flex-col justify-center relative overflow-hidden">

        {/* Step indicator dots */}
        <div className="absolute top-6 right-6 flex gap-1.5">
          {(["message", "thinking", "result"] as Step[]).map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "message" && (
            <motion.div
              key={`message-${scenarioIdx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Mensaje entrante
              </span>
              <div className="glass border border-border/50 rounded-2xl rounded-tl-sm px-5 py-4 text-foreground text-[15px] leading-relaxed">
                {scenario.incoming}
              </div>
            </motion.div>
          )}

          {step === "thinking" && (
            <motion.div
              key={`thinking-${scenarioIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#0877f9] to-[#0565E8] flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground">
                Analizando intención y contexto…
              </span>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key={`result-${scenarioIdx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center gap-3 py-4"
            >
              <div className="h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <OutcomeIcon className="h-7 w-7 text-emerald-400" />
              </div>
              <p className="font-bold text-lg text-foreground">{scenario.outcomeLabel}</p>
              <p className="text-sm text-muted-foreground">{scenario.outcomeDetail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
