"use client";

import { BrandIcon } from "./brand-icon";

const TOOLS = [
  { slug: "whatsapp",      label: "WhatsApp",      color: "bg-[#25D366]" },
  { slug: "gmail",         label: "Gmail",         color: "bg-[#EA4335]" },
  { slug: "telegram",      label: "Telegram",      color: "bg-[#26A5E4]" },
  { slug: "stripe",        label: "Stripe",        color: "bg-[#635BFF]" },
  { slug: "hubspot",       label: "HubSpot",       color: "bg-[#FF7A59]" },
  { slug: "notion",        label: "Notion",        color: "bg-[#000000]" },
  { slug: "shopify",       label: "Shopify",       color: "bg-[#7AB55C]" },
  { slug: "airtable",      label: "Airtable",      color: "bg-[#18BFFF]" },
  { slug: "meta",          label: "Meta",          color: "bg-[#0468FF]" },
  { slug: "make",          label: "Make",          color: "bg-[#EA178C]" },
  { slug: "googlesheets",  label: "Google Sheets", color: "bg-[#34A853]" },
  { slug: "zapier",        label: "Zapier",        color: "bg-[#FF4F00]" },
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
            <ToolChip key={i} slug={tool.slug} label={tool.label} color={tool.color} />
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex gap-6 animate-marquee whitespace-nowrap absolute top-0 left-0" aria-hidden>
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <ToolChip key={i} slug={tool.slug} label={tool.label} color={tool.color} />
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

function ToolChip({ slug, label, color }: { slug: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5 glass border border-border/50 rounded-2xl px-4 py-2.5 flex-shrink-0">
      <div className={`h-7 w-7 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
        <BrandIcon slug={slug} className="h-4 w-4" />
      </div>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}
