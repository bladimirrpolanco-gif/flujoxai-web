import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple memory-based rate limit
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10; // Max requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    // Reset if window passed
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

    const { messages, businessType = 'General' } = await req.json();

    // Fetch dynamic knowledge from Supabase
    const { data: knowledge } = await supabase
      .from('conocimiento_bot')
      .select('valor')
      .eq('clave', 'base_knowledge')
      .single();

    const dynamicContext = knowledge?.valor || '';

    const SYSTEM_PROMPT = `Eres el Asistente Virtual Inteligente de FlujoXAI (una agencia de soluciones de automatización con Inteligencia Artificial ubicada en Santo Domingo Este, República Dominicana). 
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
        ...messages,
      ],
      max_tokens: 200,
      temperature: 0.7,
    });



    const reply = completion.choices[0]?.message?.content ?? 'No pude generar una respuesta.';

    // Record conversation in Supabase for history tab
    const sessionId = req.headers.get('x-session-id') || 'demo-session';
    
    // Last user message
    const lastUserMessage = messages[messages.length - 1]?.content;

    if (lastUserMessage) {
      await supabase.from('conversaciones').insert([
        { sesion_id: sessionId, remitente: 'usuario', mensaje: lastUserMessage, metadata: { businessType } },
        { sesion_id: sessionId, remitente: 'bot', mensaje: reply, metadata: { businessType } }
      ]).select();
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud.' },
      { status: 500 }
    );
  }
}
