import { supabase } from './supabase';

export type NotificationType = 'email' | 'whatsapp';

export async function sendLeadNotification(leadData: {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  mensaje: string;
}) {
  console.log('🚀 Triggering lead notification:', leadData.nombre);

  // Simulation of Email Notification
  // In a real production environment, you would use:
  // await resend.emails.send({ ... })

  const notificationLog = {
    tipo: 'email',
    destinatario: 'admin@flujoxai.com',
    estado: 'enviado_simulado',
    metadata: {
      lead_name: leadData.nombre,
      lead_email: leadData.email,
      timestamp: new Date().toISOString()
    }
  };

  try {
    const { error } = await supabase
      .from('notificaciones')
      .insert([notificationLog]);

    if (error) throw error;
    
    console.log('✅ Notification logged successfully in DB');
    return { success: true };
  } catch (err) {
    console.error('❌ Error logging notification:', err);
    return { success: false, error: err };
  }
}
