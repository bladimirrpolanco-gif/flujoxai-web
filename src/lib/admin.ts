import type { SupabaseClient } from '@supabase/supabase-js';

export async function isAdminUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('usuarios_admin')
    .select('rol')
    .eq('user_id', userId)
    .eq('rol', 'admin')
    .maybeSingle();

  if (error) {
    return false;
  }

  if (data) {
    return true;
  }

  return false;
}
