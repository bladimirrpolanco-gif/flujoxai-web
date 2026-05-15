import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// This is the endpoint that Meta/WhatsApp calls when a message is received
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('📱 WhatsApp Webhook Received:', JSON.stringify(body, null, 2));

    // 1. Verify token (if necessary for Meta)
    // 2. Extract message and sender info
    // 3. Process with AI Brain (reuse /api/chat logic)
    // 4. Send response via official API
    // 5. Store in 'conversaciones' table

    // Placeholder log in DB for verification
    await supabase.from('notificaciones').insert([{
      tipo: 'whatsapp',
      destinatario: 'webhook_receiver',
      estado: 'mensaje_recibido',
      metadata: { raw_body: body }
    }]);

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in WhatsApp Webhook:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// Meta requires a GET request to verify the webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'flujoxai_secret_token') {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}
