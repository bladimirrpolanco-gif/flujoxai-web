import { supabase } from './supabase';

export type EventType = 'visita' | 'mensaje_simulador' | 'lead_generado' | 'click_whatsapp' | 'click_cta';

export async function trackEvent(tipo_evento: EventType, metadata?: any) {
  try {
    const { error } = await supabase
      .from('metricas')
      .insert([
        { tipo_evento, metadata }
      ]);
    
    if (error) console.error('Error tracking event:', error);
  } catch (err) {
    console.error('Failed to track event:', err);
  }
}
