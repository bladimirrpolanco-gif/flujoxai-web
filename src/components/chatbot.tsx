"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Bot, Send, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/metrics';



interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'assistant',
  content: '¡Hola! 👋 Soy el asistente de FlujoXAI. ¿Te gustaría saber cómo podemos automatizar tu negocio?',
};

export function ChatbotSimulator() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('General');
  const [customBusiness, setCustomBusiness] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [sessionId] = useState(() => `sess_${Math.random().toString(36).substr(2, 9)}`);
  const scrollRef = useRef<HTMLDivElement>(null);



  const businessTypes = [
    { label: 'General', emoji: '🤖', prompt: 'un asistente general' },
    { label: 'Restaurante', emoji: '🍕', prompt: 'un asistente de restaurante que ayuda con el menú y reservas' },
    { label: 'Clínica', emoji: '🏥', prompt: 'un asistente médico para agendar citas' },
    { label: 'Inmobiliaria', emoji: '🏠', prompt: 'un asesor inmobiliario' },
    { label: 'E-commerce', emoji: '🛍️', prompt: 'un experto en ventas online' },
    { label: 'Personalizado', emoji: '✨', prompt: 'custom' },
  ];



  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: userText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    trackEvent('mensaje_simulador', { content_length: userText.length });

    try {

      // Build payload in OpenAI format (excluding initial greeting from context if needed)
      const payload = newMessages.map(({ role, content }) => ({ role, content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ 
          messages: payload,
          businessType: businessType === 'Personalizado' ? customBusiness : (businessTypes.find(b => b.label === businessType)?.prompt || 'General')
        }),
      });




      const data = await res.json();
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply ?? 'Lo siento, no pude procesar eso.',
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 2).toString(), role: 'assistant', content: '⚠️ Error de conexión. Por favor intenta de nuevo.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="simulador" className="py-24 bg-muted/20 relative">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left side — copy */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Prueba un <span className="text-primary">Agente IA Real</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Este es un ejemplo de los agentes conversacionales que construimos para nuestros clientes. Escribe como si fueras un cliente y comprueba la velocidad y precisión de la respuesta.
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-card border rounded-lg p-4 w-fit shadow-sm">
              <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              Modelo IA conectado y listo
            </div>
            <Button variant="outline" onClick={resetChat} className="gap-2 rounded-full border-border/50">
              <RotateCcw className="h-4 w-4" /> Reiniciar conversación
            </Button>

            {/* Business Type Selector */}
            <div className="pt-4 space-y-3">
              <p className="text-sm font-semibold text-foreground uppercase tracking-wider">Personaliza la Demo:</p>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type.label}
                    onClick={() => {
                      setBusinessType(type.label);
                      setShowCustomInput(type.label === 'Personalizado');
                      resetChat();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
                      businessType === type.label
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-2">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>

              {showCustomInput && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2"
                >
                  <input
                    type="text"
                    placeholder="Ej: Salón de Belleza, Taller Mecánico..."
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </motion.div>
              )}
            </div>

          </div>


          {/* Right side — WhatsApp phone mockup */}
          <div className="mx-auto w-full max-w-[380px]">
            <div className="border-[8px] border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-card overflow-hidden shadow-2xl flex flex-col h-[580px] transition-colors">

              {/* Header */}
              <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <div className="bg-white/20 p-1.5 rounded-full text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-none">IA FlujoXAI</p>
                  <p className="text-[11px] text-white/70 mt-0.5">En línea</p>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#e5ddd5] dark:bg-zinc-950 transition-colors"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23b3a99c' fill-opacity='0.25'/%3E%3C/svg%3E")`
                }}
              >
                <div className="flex justify-center">
                  <span className="bg-black/5 dark:bg-white/10 text-[11px] text-zinc-700 dark:text-zinc-300 rounded-lg px-3 py-1">Hoy</span>
                </div>

                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm
                      ${m.role === 'user'
                        ? 'bg-[#dcf8c6] dark:bg-emerald-800 text-zinc-900 dark:text-white rounded-tr-none'
                        : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="bg-[#f0f0f0] dark:bg-zinc-900 px-3 py-2 flex-shrink-0 border-t border-border/50 dark:border-zinc-700 transition-colors">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                  <input
                    className="flex-1 bg-white dark:bg-zinc-800 rounded-full px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    value={input}
                    placeholder="Escribe un mensaje..."
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="rounded-full p-2.5 bg-[#075E54] text-white disabled:opacity-50 transition-opacity flex-shrink-0 shadow-lg"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
