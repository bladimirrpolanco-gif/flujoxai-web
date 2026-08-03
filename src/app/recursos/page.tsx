"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Download,
  Copy,
  Check,
  Search,
  Bot,
  MessageSquare,
  Zap,
  Database,
  ShoppingCart,
  BarChart3,
  Mail,
  Bell,
  FileText,
  Instagram,
  ChevronRight,
  Package,
  Star,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Loader2,
  Globe,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/* ─────────────────────────────────────────
   PLANTILLAS REALES — GitHub raw URLs
   Fuente: github.com/enescingoz/awesome-n8n-templates
   Licencia: MIT
──────────────────────────────────────────── */
const BASE = "https://raw.githubusercontent.com/enescingoz/awesome-n8n-templates/main";

const templates = [
  {
    id: 1,
    title: "Building Your First WhatsApp Chatbot",
    description:
      "Workflow completo para construir tu primer chatbot de WhatsApp con n8n. Conecta el trigger de WhatsApp Business, procesa mensajes y responde automáticamente.",
    category: "WhatsApp",
    difficulty: "Básico",
    tags: ["WhatsApp", "Chatbot", "Trigger"],
    icon: MessageSquare,
    color: "from-emerald-500/20 to-green-500/10",
    borderColor: "border-emerald-500/30",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    stars: 4.8,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/WhatsApp/Building%20Your%20First%20WhatsApp%20Chatbot.json",
    rawUrl: `${BASE}/WhatsApp/Building%20Your%20First%20WhatsApp%20Chatbot.json`,
    fileName: "building-your-first-whatsapp-chatbot.json",
  },
  {
    id: 2,
    title: "WhatsApp RAG Chatbot con OpenAI",
    description:
      "Chatbot de WhatsApp con Retrieval-Augmented Generation (RAG) usando OpenAI. Responde preguntas de clientes basándose en tu base de conocimiento empresarial.",
    category: "WhatsApp",
    difficulty: "Avanzado",
    tags: ["WhatsApp", "RAG", "OpenAI", "IA"],
    icon: Bot,
    color: "from-violet-500/20 to-purple-500/10",
    borderColor: "border-violet-500/30",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    iconBg: "bg-violet-500/15 text-violet-400",
    stars: 4.9,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/WhatsApp/Complete%20business%20WhatsApp%20AI-Powered%20RAG%20Chatbot%20using%20OpenAI.json",
    rawUrl: `${BASE}/WhatsApp/Complete%20business%20WhatsApp%20AI-Powered%20RAG%20Chatbot%20using%20OpenAI.json`,
    fileName: "whatsapp-rag-chatbot-openai.json",
  },
  {
    id: 3,
    title: "Respond to WhatsApp with AI Like a Pro",
    description:
      "Responde mensajes de WhatsApp con IA de manera profesional. Incluye manejo de contexto, detección de intención y respuestas personalizadas para ventas.",
    category: "WhatsApp",
    difficulty: "Intermedio",
    tags: ["WhatsApp", "IA", "Ventas", "Automatización"],
    icon: Zap,
    color: "from-cyan-500/20 to-teal-500/10",
    borderColor: "border-cyan-500/30",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    iconBg: "bg-cyan-500/15 text-cyan-400",
    stars: 4.9,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/WhatsApp/Respond%20to%20WhatsApp%20Messages%20with%20AI%20Like%20a%20Pro!.json",
    rawUrl: `${BASE}/WhatsApp/Respond%20to%20WhatsApp%20Messages%20with%20AI%20Like%20a%20Pro!.json`,
    fileName: "respond-whatsapp-ai-pro.json",
  },
  {
    id: 4,
    title: "Automate Sales Meeting Prep con AI + APIFY → WhatsApp",
    description:
      "Automatiza la preparación de reuniones de ventas con IA y APIFY. Investiga a los prospectos, genera resúmenes y los envía por WhatsApp antes de la reunión.",
    category: "WhatsApp",
    difficulty: "Avanzado",
    tags: ["WhatsApp", "Ventas", "APIFY", "IA"],
    icon: BarChart3,
    color: "from-amber-500/20 to-yellow-500/10",
    borderColor: "border-amber-500/30",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    iconBg: "bg-amber-500/15 text-amber-400",
    stars: 4.7,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/WhatsApp/Automate%20Sales%20Meeting%20Prep%20with%20AI%20%26%20APIFY%20Sent%20To%20WhatsApp.json",
    rawUrl: `${BASE}/WhatsApp/Automate%20Sales%20Meeting%20Prep%20with%20AI%20%26%20APIFY%20Sent%20To%20WhatsApp.json`,
    fileName: "sales-meeting-prep-ai-whatsapp.json",
  },
  {
    id: 5,
    title: "AI Agent — Google Calendar Assistant",
    description:
      "Agente de IA para gestionar tu Google Calendar con lenguaje natural usando OpenAI. Crea, edita y consulta eventos con comandos en texto plano.",
    category: "IA",
    difficulty: "Intermedio",
    tags: ["IA", "Google Calendar", "OpenAI", "Agente"],
    icon: Bot,
    color: "from-blue-500/20 to-indigo-500/10",
    borderColor: "border-blue-500/30",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    iconBg: "bg-blue-500/15 text-blue-400",
    stars: 4.8,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI%20Agent%20_%20Google%20calendar%20assistant%20using%20OpenAI.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI%20Agent%20_%20Google%20calendar%20assistant%20using%20OpenAI.json`,
    fileName: "ai-agent-google-calendar-openai.json",
  },
  {
    id: 6,
    title: "AI Customer Feedback Sentiment Analysis",
    description:
      "Analiza automáticamente el sentimiento de los comentarios de clientes con IA. Clasifica reseñas, tickets y feedback en positivo, neutro o negativo.",
    category: "IA",
    difficulty: "Básico",
    tags: ["IA", "Sentiment", "CRM", "Clientes"],
    icon: Database,
    color: "from-rose-500/20 to-pink-500/10",
    borderColor: "border-rose-500/30",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    iconBg: "bg-rose-500/15 text-rose-400",
    stars: 4.6,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI%20Customer%20feedback%20sentiment%20analysis.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI%20Customer%20feedback%20sentiment%20analysis.json`,
    fileName: "ai-customer-feedback-sentiment.json",
  },
  {
    id: 7,
    title: "AI-Powered Email Automation — Summarize & Respond with RAG",
    description:
      "Automatización inteligente de correos: resume emails entrantes con IA y genera respuestas automáticas usando RAG con tu base de conocimiento.",
    category: "Email",
    difficulty: "Avanzado",
    tags: ["Email", "RAG", "OpenAI", "Automatización"],
    icon: Mail,
    color: "from-indigo-500/20 to-blue-500/10",
    borderColor: "border-indigo-500/30",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    iconBg: "bg-indigo-500/15 text-indigo-400",
    stars: 4.8,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI-Powered%20Email%20Automation%20for%20Business_%20Summarize%20%26%20Respond%20with%20RAG.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI-Powered%20Email%20Automation%20for%20Business_%20Summarize%20%26%20Respond%20with%20RAG.json`,
    fileName: "ai-email-automation-rag.json",
  },
  {
    id: 8,
    title: "AI-Powered Social Media Amplifier",
    description:
      "Amplifica tu contenido en redes sociales con IA. Genera variaciones del post original optimizadas para cada plataforma: Instagram, LinkedIn, Twitter.",
    category: "Social Media",
    difficulty: "Intermedio",
    tags: ["Redes Sociales", "IA", "Contenido", "Marketing"],
    icon: Instagram,
    color: "from-pink-500/20 to-fuchsia-500/10",
    borderColor: "border-pink-500/30",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    iconBg: "bg-pink-500/15 text-pink-400",
    stars: 4.7,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI-Powered%20Social%20Media%20Amplifier.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI-Powered%20Social%20Media%20Amplifier.json`,
    fileName: "ai-social-media-amplifier.json",
  },
  {
    id: 9,
    title: "AI WooCommerce Support Agent",
    description:
      "Agente de soporte con IA para tiendas WooCommerce. Responde preguntas de clientes sobre productos, pedidos y envíos consultando tu tienda en tiempo real.",
    category: "E-commerce",
    difficulty: "Avanzado",
    tags: ["WooCommerce", "IA", "Soporte", "E-commerce"],
    icon: ShoppingCart,
    color: "from-orange-500/20 to-amber-500/10",
    borderColor: "border-orange-500/30",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    iconBg: "bg-orange-500/15 text-orange-400",
    stars: 4.8,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI-powered%20WooCommerce%20Support-Agent.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI-powered%20WooCommerce%20Support-Agent.json`,
    fileName: "ai-woocommerce-support-agent.json",
  },
  {
    id: 10,
    title: "AI Voice Chat — OpenAI + Gemini + ElevenLabs",
    description:
      "Chat de voz con IA usando OpenAI, Google Gemini y ElevenLabs. Convierte texto a voz y voz a texto con memoria de conversación para una experiencia natural.",
    category: "IA",
    difficulty: "Avanzado",
    tags: ["Voz", "OpenAI", "ElevenLabs", "Gemini"],
    icon: Sparkles,
    color: "from-purple-500/20 to-violet-500/10",
    borderColor: "border-purple-500/30",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    iconBg: "bg-purple-500/15 text-purple-400",
    stars: 4.9,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI%20Voice%20Chat%20using%20Webhook%2C%20Memory%20Manager%2C%20OpenAI%2C%20Google%20Gemini%20%26%20ElevenLabs.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI%20Voice%20Chat%20using%20Webhook%2C%20Memory%20Manager%2C%20OpenAI%2C%20Google%20Gemini%20%26%20ElevenLabs.json`,
    fileName: "ai-voice-chat-openai-gemini-elevenlabs.json",
  },
  {
    id: 11,
    title: "AI Blog Writer Pipeline con Ollama",
    description:
      "Pipeline completo para generar artículos de blog con IA local usando Ollama. Investiga el tema, genera el outline, escribe y optimiza el contenido automáticamente.",
    category: "Contenido",
    difficulty: "Intermedio",
    tags: ["Blog", "Ollama", "IA Local", "Contenido"],
    icon: FileText,
    color: "from-teal-500/20 to-cyan-500/10",
    borderColor: "border-teal-500/30",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    iconBg: "bg-teal-500/15 text-teal-400",
    stars: 4.6,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI%20Blog%20Writer%20Pipeline%20with%20Ollama.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI%20Blog%20Writer%20Pipeline%20with%20Ollama.json`,
    fileName: "ai-blog-writer-ollama.json",
  },
  {
    id: 12,
    title: "AI HR — CV Analysis & Candidate Evaluation",
    description:
      "Automatiza el análisis de CVs y evaluación de candidatos con IA. Extrae información clave, puntúa candidatos según criterios y genera reportes automáticamente.",
    category: "IA",
    difficulty: "Intermedio",
    tags: ["RRHH", "IA", "CVs", "Evaluación"],
    icon: Database,
    color: "from-green-500/20 to-emerald-500/10",
    borderColor: "border-green-500/30",
    badgeColor: "bg-green-500/15 text-green-400 border-green-500/30",
    iconBg: "bg-green-500/15 text-green-400",
    stars: 4.7,
    sourceUrl: "https://github.com/enescingoz/awesome-n8n-templates/blob/main/OpenAI_and_LLMs/AI%20Automated%20HR%20Workflow%20for%20CV%20Analysis%20and%20Candidate%20Evaluation.json",
    rawUrl: `${BASE}/OpenAI_and_LLMs/AI%20Automated%20HR%20Workflow%20for%20CV%20Analysis%20and%20Candidate%20Evaluation.json`,
    fileName: "ai-hr-cv-analysis-evaluation.json",
  },
];

const categories = ["Todos", "WhatsApp", "IA", "Email", "Social Media", "E-commerce", "Contenido", "Otro"];
const difficulties = ["Todos", "Básico", "Intermedio", "Avanzado"];

const iconMap: Record<string, any> = {
  Bot, MessageSquare, Mail, Zap, Database, ShoppingCart, BarChart3, Instagram, FileText, Sparkles
};

/* ─────────────────────────────────────────
   TOAST
──────────────────────────────────────────── */
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-2xl shadow-emerald-500/30"
        >
          <Check className="h-4 w-4" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   TEMPLATE CARD
──────────────────────────────────────────── */
function TemplateCard({
  template,
  onToast,
}: {
  template: any;
  onToast: (msg: string) => void;
}) {
  const Icon = template.icon;
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = async () => {
    setCopying(true);
    try {
      let text = "";
      if (template.json_content) {
        text = template.json_content;
      } else {
        const res = await fetch(template.rawUrl);
        text = await res.text();
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onToast(`¡JSON de "${template.title}" copiado!`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onToast("Error al copiar. Intenta de nuevo.");
    } finally {
      setCopying(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let text = "";
      if (template.json_content) {
        text = template.json_content;
      } else {
        const res = await fetch(template.rawUrl);
        text = await res.text();
      }
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = template.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      onToast(`¡Descargando "${template.fileName}"!`);
      setTimeout(() => setDownloaded(false), 2500);
    } catch {
      onToast("Error al descargar. Intenta de nuevo.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-2xl border ${template.borderColor} bg-card/60 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col`}
    >
      {/* Top shimmer line */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${template.color.replace("/20", "/60").replace("/10", "/40")}`} />

      {/* Header */}
      <div className={`p-5 bg-gradient-to-br ${template.color}`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${template.iconBg} ring-1 ring-white/10`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${template.badgeColor}`}>
              {template.category}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              {template.difficulty}
            </span>
          </div>
        </div>
        <h3 className="text-base font-bold text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors">
          {template.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>

      {/* Stars + source */}
      <div className="flex items-center justify-between px-5 py-3 border-y border-border/40 bg-muted/20">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{template.stars}</span>
          <span>· Comunidad FlujoxAI</span>
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5">
        {template.tags?.map((tag: string) => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40">
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 mt-auto flex items-center gap-2.5">
        {/* Copy */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          disabled={copying || copying}
          className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-bold transition-all duration-200 border ${
            copied
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-muted/50 hover:bg-muted text-foreground border-border/50 hover:border-border"
          } disabled:opacity-70`}
        >
          {copying ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copying ? "Copiando..." : copied ? "¡Copiado!" : "Copiar JSON"}
        </motion.button>

        {/* Download */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={downloading}
          className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-bold transition-all duration-200 border ${
            downloaded
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
          } disabled:opacity-70`}
        >
          {downloading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : downloaded ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {downloading ? "Descargando..." : downloaded ? "¡Listo!" : "Descargar .json"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────── */
export default function RecursosPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeDifficulty, setActiveDifficulty] = useState("Todos");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [allTemplates, setAllTemplates] = useState<any[]>(templates);

  useEffect(() => {
    const fetchCustomTemplates = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase.from('custom_templates').select('*').order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        const mappedData = data.map(dbT => ({
          ...dbT,
          icon: iconMap[dbT.icon] || Bot,
          color: "from-violet-500/20 to-purple-500/10",
          borderColor: "border-violet-500/30",
          badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
          iconBg: "bg-violet-500/15 text-violet-400",
          stars: 5.0,
          fileName: `plantilla-${dbT.title.replace(/\s+/g, '-').toLowerCase()}.json`
        }));
        setAllTemplates([...mappedData, ...templates]);
      }
    };
    fetchCustomTemplates();
  }, []);

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2800);
  };

  const filtered = allTemplates.filter((t) => {
    const matchSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "Todos" || t.category === activeCategory;
    const matchDiff = activeDifficulty === "Todos" || t.difficulty === activeDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toast message={toast.message} show={toast.show} />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[200px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
          >
            <Package className="h-4 w-4" />
            Recursos Gratuitos · FlujoxAI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight"
          >
            Plantillas <span className="gradient-text">n8n</span>
            <br />
            reales de la comunidad
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Descubre y descarga los mejores workflows de n8n creados y validados por nuestra comunidad. Importa directamente en tu instancia de n8n de manera sencilla y rápida. <strong className="text-foreground">100% gratis.</strong>
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-8 text-sm"
          >
            {[
              { value: allTemplates.length, label: "Plantillas", suffix: "" },
              { value: categories.length - 1, label: "Categorías", suffix: "" },
              { value: "+10k", label: "Usuarios", suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-foreground">{stat.value}{stat.suffix}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-4 px-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="relative max-w-md mx-auto md:mx-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/50 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat)}
                className={`h-8 px-4 rounded-full text-xs font-bold transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </motion.button>
            ))}
            <div className="w-px h-8 bg-border/40 mx-1" />
            {difficulties.map((diff) => (
              <motion.button
                key={diff}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveDifficulty(diff)}
                className={`h-8 px-4 rounded-full text-xs font-bold transition-all duration-200 border ${
                  activeDifficulty === diff
                    ? "bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/20"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
                }`}
              >
                {diff}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> plantillas encontradas
            </p>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio
            </Link>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">No se encontraron plantillas</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((template) => (
                  <TemplateCard key={template.id} template={template} onToast={showToast} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-primary/20 p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
                <Sparkles className="h-4 w-4" />
                ¿Necesitas algo más complejo?
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                Creamos tu workflow
                <br />
                <span className="gradient-text">completamente a medida</span>
              </h2>
              <p className="text-muted-foreground mb-7 max-w-xl mx-auto">
                Estas plantillas son el punto de partida. Si necesitas una automatización
                personalizada para tu negocio, nuestro equipo te construye exactamente lo que necesitas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <ChevronRight className="h-4 w-4" />
                  Cotizar mi automatización
                </Link>
                <a
                  href="https://wa.me/18492597719?text=Hola%2C%20me%20interesa%20una%20automatizaci%C3%B3n%20con%20n8n%20personalizada%20%F0%9F%A4%96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold text-sm transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
