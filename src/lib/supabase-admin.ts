import 'server-only';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Evitamos lanzar un error directamente en la evaluación del módulo para no romper el build de Vercel.
if (!supabaseUrl) {
  console.warn('⚠️ Missing env: NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceRoleKey) {
  console.warn('⚠️ Missing env: SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://missing-url.supabase.co',
  serviceRoleKey || 'missing-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
