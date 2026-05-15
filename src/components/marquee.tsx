"use client";

import { Mail, MessageSquare, Database, Calendar, Globe, FileText, CreditCard, Server, Cpu, Zap, BarChart3, Bot } from "lucide-react";

const TOOLS = [
  { icon: MessageSquare, label: "WhatsApp",      color: "bg-emerald-500" },
  { icon: Mail,          label: "Gmail",          color: "bg-red-500"     },
  { icon: MessageSquare, label: "Slack",          color: "bg-purple-500"  },
  { icon: CreditCard,    label: "Stripe",         color: "bg-indigo-500"  },
  { icon: Database,      label: "HubSpot",        color: "bg-orange-500"  },
  { icon: FileText,      label: "Notion",         color: "bg-zinc-600"    },
  { icon: Globe,         label: "Shopify",        color: "bg-green-600"   },
  { icon: Server,        label: "Salesforce",     color: "bg-blue-500"    },
  { icon: Cpu,           label: "OpenAI",         color: "bg-teal-500"    },
  { icon: Zap,           label: "Make",           color: "bg-violet-500"  },
  { icon: BarChart3,     label: "Google Sheets",  color: "bg-emerald-600" },
  { icon: Bot,           label: "Zapier",         color: "bg-orange-600"  },
];

export function Marquee() {
  return (
    <section className="py-14 border-y border-border/50 bg-muted/20 overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
        Nos integramos con las herramientas que ya usas
      </p>
      <div className="relative flex">
        {/* First strip */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <ToolChip key={i} icon={tool.icon} label={tool.label} color={tool.color} />
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap absolute top-0 left-0" aria-hidden>
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <ToolChip key={i} icon={tool.icon} label={tool.label} color={tool.color} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}

function ToolChip({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 glass border border-border/50 rounded-2xl px-4 py-2.5 flex-shrink-0">
      <div className={`h-7 w-7 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}
