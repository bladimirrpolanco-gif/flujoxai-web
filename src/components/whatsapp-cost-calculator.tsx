"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Moon,
  SunMedium,
  Sparkles,
  Zap,
  MessageSquare,
  Gauge,
  BadgeInfo,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { trackEvent } from "@/lib/metrics";

const DEFAULTS = {
  marketing: 5000,
  utility: 8000,
  service: 12000,
  agent: 3000,
  tokens: 22500,
  exchangeRate: 60,
};

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDOP(value: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatInt(value: number) {
  return new Intl.NumberFormat("es-DO").format(value);
}

type SliderFieldProps = {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  rateLabel: string;
  color: string;
  badge?: string;
  onChange: (value: number) => void;
  dark: boolean;
  highlight?: boolean;
};

function SliderField({
  label,
  description,
  value,
  min,
  max,
  step,
  rateLabel,
  color,
  badge,
  onChange,
  dark,
  highlight,
}: SliderFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        highlight
          ? dark
            ? "border-[#25D366]/30 bg-[#25D366]/5"
            : "border-emerald-200 bg-emerald-50/70"
          : dark
            ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
            : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-5 w-5 rounded-md flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: color }}
            >
              {label.slice(0, 1)}
            </span>
            <span className="font-semibold text-[13px]">{label}</span>
            {badge ? (
              <span className="rounded-full bg-[#25D366] px-2 py-0.5 text-[9px] font-bold text-white">
                {badge}
              </span>
            ) : null}
          </div>
          <p className={`mt-1 text-[11px] leading-tight ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
            {description}
          </p>
        </div>
        <div
          className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[11px] ${
            dark ? "border-zinc-700 bg-zinc-950 text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"
          }`}
        >
          {rateLabel}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-6 flex-1">
          <div className={`absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full ${dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
          <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${pct}%`, background: color }} />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="relative h-6 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-300 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
            style={{ accentColor: color }}
          />
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
          className={`w-[96px] rounded-xl border px-3 py-2 font-mono text-[13px] font-medium focus:outline-none focus:ring-2 ${
            dark ? "border-zinc-700 bg-zinc-950 text-zinc-100 focus:ring-[#25D366]/30" : "border-zinc-200 bg-white text-zinc-900 focus:ring-[#25D366]/20"
          }`}
        />
      </div>
    </div>
  );
}

function MetricRow({
  label,
  count,
  value,
  dark,
  highlight = false,
  alert = false,
}: {
  label: string;
  count: string;
  value: string;
  dark: boolean;
  highlight?: boolean;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className={`truncate text-[11px] ${dark ? "text-zinc-400" : "text-zinc-600"}`}>{label}</div>
        <div className={`truncate font-mono text-[10px] ${dark ? "text-zinc-600" : "text-zinc-500"}`}>{count}</div>
      </div>
      <div className={`font-mono text-[12px] font-medium ${highlight ? "text-[#25D366]" : alert ? "text-amber-500" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  pct,
  color,
  dark,
  exchangeRate,
  isOct = false,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
  dark: boolean;
  exchangeRate: number;
  isOct?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className={`text-[11px] font-bold tracking-wide ${isOct ? "text-amber-500" : "text-[#25D366]"}`}>{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold">{formatUSD(value)}</span>
          <span className={`text-[11px] ${dark ? "text-zinc-500" : "text-zinc-500"}`}>{formatDOP(value * exchangeRate)}</span>
        </div>
      </div>
      <div className={`h-3 overflow-hidden rounded-full ${dark ? "bg-zinc-800" : "bg-zinc-100"}`}>
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, pct)}%`, background: color, boxShadow: `0 0 12px ${color}66` }} />
      </div>
    </div>
  );
}

function TipCard({
  icon,
  title,
  desc,
  dark,
}: {
  icon: string;
  title: string;
  desc: string;
  dark: boolean;
}) {
  return (
    <div className={`flex gap-3 rounded-2xl border p-3.5 transition-colors ${dark ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700" : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"}`}>
      <span className="mt-0.5 text-[16px] leading-none">{icon}</span>
      <div>
        <div className="text-[12.5px] font-medium leading-tight">{title}</div>
        <div className={`mt-1 text-[11px] leading-snug ${dark ? "text-zinc-400" : "text-zinc-600"}`}>{desc}</div>
      </div>
    </div>
  );
}

export function WhatsappCostCalculator() {
  const [dark, setDark] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [marketing, setMarketing] = useState(DEFAULTS.marketing);
  const [utility, setUtility] = useState(DEFAULTS.utility);
  const [service, setService] = useState(DEFAULTS.service);
  const [agent, setAgent] = useState(DEFAULTS.agent);
  const [tokens, setTokens] = useState(DEFAULTS.tokens);
  const [exchangeRate, setExchangeRate] = useState(DEFAULTS.exchangeRate);
  const [statusText, setStatusText] = useState("Resting");

  useEffect(() => {
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    void trackEvent("visita", { path: "/calculadora-whatsapp-api" });
  }, []);

  const cost = useMemo(() => {
    const tierActive = utility + service > 250000 || utility > 250000;
    const tierRate = tierActive ? 0.011 : 0.013;
    const agentCostPerMsg = (tokens / 1_000_000) * 2;

    const marketingCost = marketing * 0.0851;
    const utilityCost = utility * tierRate;
    const serviceCostNow = 0;
    const serviceCostOct = service * tierRate;
    const agentCost = agent * agentCostPerMsg;
    const totalNow = marketingCost + utilityCost + serviceCostNow + agentCost;
    const totalOct = marketingCost + utilityCost + serviceCostOct + agentCost;
    const diff = totalOct - totalNow;
    const diffPercent = totalNow > 0 ? (diff / totalNow) * 100 : 0;

    return {
      tierActive,
      tierRate,
      agentCostPerMsg,
      marketingCost,
      utilityCost,
      serviceCostNow,
      serviceCostOct,
      agentCost,
      totalNow,
      totalOct,
      diff,
      diffPercent,
    };
  }, [agent, marketing, service, tokens, utility]);

  const totalMax = Math.max(cost.totalNow, cost.totalOct, 1);

  const reset = () => {
    setMarketing(DEFAULTS.marketing);
    setUtility(DEFAULTS.utility);
    setService(DEFAULTS.service);
    setAgent(DEFAULTS.agent);
    setTokens(DEFAULTS.tokens);
    setExchangeRate(DEFAULTS.exchangeRate);
    setAdvanced(false);
    setStatusText("Restablecido");
    window.setTimeout(() => setStatusText("Resting"), 1500);
  };

  const serviceOctLabel = cost.tierActive ? "$0 hoy -> $0.011 oct" : "$0 hoy -> $0.013 oct";

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-300 ${dark ? "bg-[#0a0e0d] text-zinc-100" : "bg-[#f7fbf8] text-zinc-900"}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[35%] left-[10%] h-[760px] w-[760px] rounded-full bg-[#25D366] blur-[120px] opacity-[0.12]" />
        <div className="absolute -bottom-[25%] right-[8%] h-[580px] w-[580px] rounded-full bg-emerald-500 blur-[120px] opacity-[0.08]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-8 flex items-center justify-between sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.4)]">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-[15px]">FLUJOX AI</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${dark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-200 text-zinc-600"}`}>
                  BETA
                </span>
              </div>
              <div className={`-mt-0.5 text-[11px] ${dark ? "text-zinc-500" : "text-zinc-500"}`}>Calculadora WhatsApp RD</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`hidden sm:inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] transition-colors ${
                dark ? "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800" : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Inicio
            </Link>
            <button
              onClick={() => setDark((value) => !value)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                dark ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-800" : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
              aria-label="Cambiar tema"
            >
              {dark ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <div className="mb-8 sm:mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-bold leading-[0.95] tracking-[-0.02em] sm:text-[36px]">
              Calcula tu costo real de <span className="text-[#25D366]">WhatsApp API</span>
            </h1>
          </div>
          <p className={`max-w-[720px] text-[14px] leading-relaxed sm:text-[15px] ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
            Estimación precisa para República Dominicana con tarifas oficiales Meta 2025-2026. Compara costo actual vs. desde 1 oct 2026, cuando el servicio dentro de ventana dejará de ser gratis.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "Marketing $0.0851", hint: "Apertura" },
              { label: "Utility $0.013", hint: "Fuera de ventana" },
              { label: "Service $0 -> $0.013", hint: "Dentro de ventana 24h" },
              { label: "Agent $0.045/msg", hint: "Meta AI ~22.5k tokens" },
            ].map((item) => (
              <div
                key={item.label}
                className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] ${dark ? "border-zinc-800 bg-zinc-900/80 text-zinc-300" : "border-zinc-200 bg-white text-zinc-700"}`}
              >
                <span className="font-medium">{item.label}</span>
                <span className={`rounded px-1 py-0 text-[9px] ${dark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>{item.hint}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
          <div className={`rounded-[20px] border p-5 shadow-sm backdrop-blur-xl sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900/70" : "border-zinc-200 bg-white/90"}`}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#25D366]" />
                <h2 className="text-[14px] font-semibold">Volumen mensual</h2>
              </div>
              <button
                onClick={reset}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                  dark ? "border-zinc-800 text-zinc-400 hover:bg-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {statusText}
              </button>
            </div>

            <div className="space-y-5">
              <SliderField
                dark={dark}
                label="Marketing"
                description="Apertura de conversación, promos"
                value={marketing}
                min={0}
                max={100000}
                step={100}
                rateLabel="$0.0851"
                color="#25D366"
                onChange={setMarketing}
              />
              <SliderField
                dark={dark}
                label="Utility"
                description="Fuera de ventana 24h (notifs, OTP)"
                value={utility}
                min={0}
                max={500000}
                step={100}
                rateLabel={`$${cost.tierRate.toFixed(3)}`}
                color="#10b981"
                badge={utility > 250000 ? "Tier 250k+ activo" : undefined}
                onChange={setUtility}
              />
              <SliderField
                dark={dark}
                label="Service / Respuestas"
                description="Dentro de ventana 24h, humano o bot"
                value={service}
                min={0}
                max={500000}
                step={100}
                rateLabel={serviceOctLabel}
                color="#06b6d4"
                highlight
                onChange={setService}
              />
              <SliderField
                dark={dark}
                label="Con Meta Business Agent"
                description="Mensajes que usan AI de Meta"
                value={agent}
                min={0}
                max={100000}
                step={100}
                rateLabel={`$${cost.agentCostPerMsg.toFixed(4)}/msg`}
                color="#a855f7"
                onChange={setAgent}
              />

              <div className={`rounded-2xl border p-3.5 ${dark ? "border-zinc-700/50 bg-zinc-800/50" : "border-zinc-200 bg-zinc-50"}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                    Tokens promedio por mensaje
                  </div>
                  <span className="font-mono text-[11px]">{formatInt(tokens)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={50000}
                  step={500}
                  value={tokens}
                  onChange={(e) => setTokens(Number(e.target.value))}
                  className="h-1.5 w-full accent-violet-500"
                />
                <div className={`mt-1.5 flex justify-between text-[10px] ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  <span>5k (corto)</span>
                  <span>25k promedio</span>
                  <span>50k (largo)</span>
                </div>
                <div className={`mt-2.5 flex items-start gap-1.5 text-[11px] ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <BadgeInfo className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>
                    $2 por 1M tokens. Con {formatInt(tokens)} tokens ≈ {formatUSD(cost.agentCostPerMsg)}/msg
                  </span>
                </div>
              </div>

              <div className={`border-t pt-2 ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
                <button
                  onClick={() => setAdvanced((value) => !value)}
                  className={`flex items-center gap-1 text-[12px] ${dark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"}`}
                >
                  <span>Configuración avanzada</span>
                  <ArrowRight className={`h-3 w-3 transition-transform ${advanced ? "rotate-90" : ""}`} />
                </button>

                {advanced ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-[12px]">Tasa USD &gt; DOP</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] opacity-60">1 USD =</span>
                        <input
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(Number(e.target.value) || 60)}
                          className={`w-[80px] rounded-lg border px-2.5 py-1.5 font-mono text-[13px] focus:outline-none focus:ring-2 ${
                            dark ? "border-zinc-700 bg-zinc-950 focus:ring-[#25D366]/30" : "border-zinc-200 bg-white focus:ring-[#25D366]/20"
                          }`}
                        />
                        <span className="text-[11px]">DOP</span>
                      </div>
                    </div>
                    <div className={`rounded-lg border p-2.5 text-[11px] ${dark ? "border-amber-900/30 bg-amber-950/30 text-amber-200/70" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                      Volume tier: si utility + service &gt; 250k/mes, la tarifa baja de $0.013 a ~ $0.011. Actualmente:{" "}
                      <b>{cost.tierActive ? "ACTIVO" : "no activo"}</b> ({formatInt(utility + service)} msgs).
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className={`relative overflow-hidden rounded-[20px] border p-5 sm:p-6 ${dark ? "border-zinc-800 bg-[#121412]" : "border-zinc-200 bg-white"}`}>
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#25D366]/10 blur-2xl" />
                <div className="relative">
                  <div className="mb-1 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-widest ${dark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                      Hoy - hasta 30 sept 2026
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="mt-3">
                    <div className={`text-[12px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Total mensual</div>
                    <div className="mt-1 text-[28px] font-bold leading-none tracking-tight">{formatUSD(cost.totalNow)}</div>
                    <div className={`mt-1 text-[13px] font-medium ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{formatDOP(cost.totalNow * exchangeRate)} DOP</div>
                  </div>
                  <div className={`mt-4 space-y-2 border-t pt-4 text-[12px] ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
                    <MetricRow label="Marketing" count={`${formatInt(marketing)} x $0.0851`} value={formatDOP(cost.marketingCost * exchangeRate)} dark={dark} />
                    <MetricRow label="Utility" count={`${formatInt(utility)} x $${cost.tierRate.toFixed(3)}`} value={formatDOP(cost.utilityCost * exchangeRate)} dark={dark} />
                    <MetricRow label="Service" count={`${formatInt(service)} x $0 gratis`} value={formatDOP(cost.serviceCostNow * exchangeRate)} dark={dark} highlight />
                    <MetricRow label="Meta Agent" count={`${formatInt(agent)} x $${cost.agentCostPerMsg.toFixed(4)}`} value={formatDOP(cost.agentCost * exchangeRate)} dark={dark} />
                  </div>
                </div>
              </div>

              <div className={`relative overflow-hidden rounded-[20px] border p-5 sm:p-6 ${dark ? "border-amber-900/30 bg-zinc-900" : "border-amber-200 bg-amber-50/60"}`}>
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
                <div className="relative">
                  <div className="mb-1 flex items-center justify-between">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-widest ${dark ? "border border-amber-900/50 bg-amber-950 text-amber-300" : "border border-amber-200 bg-amber-100 text-amber-800"}`}>
                      Desde 1 oct 2026
                    </span>
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="mt-3">
                    <div className={`text-[12px] ${dark ? "text-zinc-400" : "text-zinc-600"}`}>Total mensual</div>
                    <div className="mt-1 text-[28px] font-bold leading-none tracking-tight">{formatUSD(cost.totalOct)}</div>
                    <div className={`mt-1 text-[13px] font-medium ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{formatDOP(cost.totalOct * exchangeRate)} DOP</div>
                    {cost.diff > 0 ? (
                      <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${dark ? "bg-amber-950 text-amber-300" : "bg-amber-100 text-amber-800"}`}>
                        <TrendingUp className="h-3 w-3" />
                        +{formatUSD(cost.diff)} / mes (+{cost.diffPercent.toFixed(1)}%)
                      </div>
                    ) : null}
                  </div>
                  <div className={`mt-4 space-y-2 border-t pt-4 text-[12px] ${dark ? "border-zinc-800" : "border-amber-200/60"}`}>
                    <MetricRow label="Marketing" count={`${formatInt(marketing)} x $0.0851`} value={formatDOP(cost.marketingCost * exchangeRate)} dark={dark} />
                    <MetricRow label="Utility" count={`${formatInt(utility)} x $${cost.tierRate.toFixed(3)}`} value={formatDOP(cost.utilityCost * exchangeRate)} dark={dark} />
                    <MetricRow label="Service" count={`${formatInt(service)} x $${cost.tierRate.toFixed(3)}`} value={formatDOP(cost.serviceCostOct * exchangeRate)} dark={dark} alert />
                    <MetricRow label="Meta Agent" count={`${formatInt(agent)} x $${cost.agentCostPerMsg.toFixed(4)}`} value={formatDOP(cost.agentCost * exchangeRate)} dark={dark} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-[20px] border p-5 sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900/70" : "border-zinc-200 bg-white"}`}>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[14px] font-semibold">
                  <MessageSquare className="h-4 w-4 text-[#25D366]" />
                  Comparativa visual
                </h3>
                <div className={`text-[11px] ${dark ? "text-zinc-500" : "text-zinc-500"}`}>USD / mes</div>
              </div>

              <div className="space-y-4">
                <ComparisonBar label="HOY" value={cost.totalNow} pct={(cost.totalNow / totalMax) * 100} color="#25D366" dark={dark} exchangeRate={exchangeRate} />
                <ComparisonBar label="OCT 2026" value={cost.totalOct} pct={(cost.totalOct / totalMax) * 100} color="#f59e0b" dark={dark} exchangeRate={exchangeRate} isOct />

                <div className={`mt-6 grid grid-cols-4 gap-2 text-[10px] ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                    Marketing
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Utility
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Service
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    Agent
                  </div>
                </div>

                <div className={`flex items-start gap-2.5 rounded-xl border p-3 text-[12px] leading-snug ${dark ? "border-zinc-700/50 bg-zinc-800/60 text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-700"}`}>
                  <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span>
                    Con {formatInt(service)} respuestas dentro de ventana, tu costo extra desde octubre será {formatUSD(cost.serviceCostOct)} / mes.
                    {cost.serviceCostOct > 100 ? " Considera optimizar con FEP de 72h y respuestas rápidas." : " Impacto bajo, buen manejo de ventana."}
                  </span>
                </div>
              </div>
            </div>

            <div className={`rounded-[20px] border p-5 sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900/70" : "border-zinc-200 bg-white"}`}>
              <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
                <Zap className="h-4 w-4 text-amber-400" />
                Cómo optimizar y ahorrar 30-50%
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TipCard
                  dark={dark}
                  icon="⚡"
                  title="Responde en <5 min para FEP 72h gratis"
                  desc="Si respondes rápido dentro de 24h, Meta extiende a 72h gratis de respuestas. Evita pagar utility después."
                />
                <TipCard
                  dark={dark}
                  icon="🎯"
                  title="Utility > Marketing cuando puedas"
                  desc="Utility cuesta $0.013 vs $0.0851 marketing. Usa plantilla utility para confirmaciones, no promos."
                />
                <TipCard
                  dark={dark}
                  icon="💬"
                  title="Reduce mensajes por conversación"
                  desc="Cada conversación = 1 costo de apertura. Agrupa info en 1 mensaje útil, no 3 cortos."
                />
                <TipCard
                  dark={dark}
                  icon="🤖"
                  title="Agente solo donde aporta valor"
                  desc={`A ${formatUSD(cost.agentCostPerMsg)}/msg, usa Agent solo en soporte complejo.`}
                />
                <TipCard
                  dark={dark}
                  icon="📦"
                  title="Busca el tier de 250k"
                  desc="Si pasas 250k utility+auth, baja a $0.011. Negocia volumen consolidado RD + LATAM."
                />
                <TipCard
                  dark={dark}
                  icon="🕒"
                  title="Prepárate para octubre 2026"
                  desc="Service dejará de ser gratis. Mide hoy tu % de mensajes dentro vs fuera de ventana."
                />
              </div>

              <div className={`mt-4 rounded-xl border border-dashed p-3 text-[11px] ${dark ? "border-zinc-700 text-zinc-500" : "border-zinc-300 text-zinc-500"}`}>
                <b>Nota FLUJOX:</b> Tasas oficiales Meta para RD (Rest of LATAM) a 2025. Marketing $0.0851 incluye impuestos Meta. Service $0 hasta 30 sept 2026 por promoción FEP. Meta Business Agent $2/1M tokens. Conversión DOP editable. Estimación sin IVA local ni fees de BSP.
              </div>
            </div>

            <div className={`py-2 text-center text-[11px] ${dark ? "text-zinc-600" : "text-zinc-500"}`}>
              Hecho para founders en RD • Diseño inspirado en WhatsApp Business API • FLUJOX AI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
