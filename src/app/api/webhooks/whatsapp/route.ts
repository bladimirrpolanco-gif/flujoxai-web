import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

/**
 * Verifica la firma HMAC-SHA256 que Meta envía en el header X-Hub-Signature-256.
 * Esto garantiza que el mensaje proviene realmente de Meta y no de un atacante.
 */
function verifyMetaSignature(rawBody: string, signature: string | null): boolean {
  if (!APP_SECRET || !signature) return false;
  const expected = 'sha256=' + crypto
    .createHmac('sha256', APP_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex');
  // Comparación de tiempo constante para evitar timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Meta llama a este endpoint cuando recibe un mensaje de WhatsApp
export async function POST(req: NextRequest) {
  try {
    if (!APP_SECRET) {
      return new NextResponse('Webhook not configured', { status: 503 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    if (!verifyMetaSignature(rawBody, signature)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // 1. Extraer info del mensaje y remitente
    // 2. Procesar con IA (/api/chat)
    // 3. Responder vía API oficial de Meta
    // 4. Guardar en tabla 'conversaciones'

    await supabaseAdmin.from('notificaciones').insert([{
      tipo: 'whatsapp',
      destinatario: 'webhook_receiver',
      estado: 'mensaje_recibido',
      metadata: { entry_count: body?.entry?.length ?? 0 }
    }]);

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// Meta requiere una solicitud GET para verificar el webhook
export async function GET(req: NextRequest) {
  if (!VERIFY_TOKEN) {
    return new NextResponse('Webhook not configured', { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}
