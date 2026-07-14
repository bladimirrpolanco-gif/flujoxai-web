import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase-admin';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rate limit en memoria (persistente por proceso)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10;        // Máximo de solicitudes por ventana
const WINDOW_MS = 60 * 1000; // Ventana de 1 minuto

// Límites para evitar abuso de tokens de OpenAI
const MAX_MESSAGES = 20;           // Máximo de mensajes en el historial
const MAX_MESSAGE_LENGTH = 1000;   // Máximo de caracteres por mensaje

export async function POST(req: NextRequest) {
  try {
    // Usar IP real (primer valor si hay múltiples proxies)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > WINDOW_MS) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    if (userLimit.count >= LIMIT) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, espera un minuto.' },
        { status: 429 }
      );
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    const body = await req.json();
    const { businessType = 'General' } = body;

    // Validar y sanitizar el historial de mensajes
    let messages: { role: string; content: string }[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    // Limitar cantidad de mensajes para evitar consumo excesivo de tokens
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }

    // Limitar longitud de cada mensaje
    messages = messages.filter(m => m && typeof m.content === 'string').map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

    // Obtener contexto dinámico de Supabase
    const { data: knowledge } = await supabaseAdmin
      .from('conocimiento_bot')
      .select('valor')
      .eq('clave', 'base_knowledge')
      .single();

    const dynamicContext = knowledge?.valor || '';

    const SYSTEM_PROMPT = `Eres el Asistente Virtual Inteligente de Flujobot (una agencia de soluciones de automatización con Inteligencia Artificial ubicada en Santo Domingo Este, República Dominicana). 
Tu objetivo es atender a los clientes de forma amable, profesional y concisa, resolviendo sus dudas sobre nuestros servicios.

CONOCIMIENTO BASE ESPECÍFICO:
${dynamicContext}

PAUTAS:
1. Sé conciso y directo (máximo 3 oraciones).
2. Usa emojis ocasionalmente (estilo WhatsApp).
3. Si alguien pregunta por precios u horarios, consulta el CONOCIMIENTO BASE de arriba.
4. Actualmente estás actuando para el sector: ${businessType}. Adapta tus ejemplos.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages as any,
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? 'No pude generar una respuesta.';

    // Registrar conversación en Supabase
    const sessionId = req.headers.get('x-session-id') || 'web-session';
    const lastUserMessage = messages[messages.length - 1]?.content;

    if (lastUserMessage) {
      await supabaseAdmin.from('conversaciones').insert([
        { sesion_id: sessionId, remitente: 'usuario', mensaje: lastUserMessage, metadata: { businessType } },
        { sesion_id: sessionId, remitente: 'bot', mensaje: reply, metadata: { businessType } }
      ]).select();
    }

    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud.' },
      { status: 500 }
    );
  }
}
