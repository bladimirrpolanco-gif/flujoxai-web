import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Bloquear acceso si no hay sesión válida
  if (!user) {
    redirect('/admin/login');
  }

  // Fetch leads
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (leadsError) console.error('Error fetching leads:', leadsError);

  // Fetch services
  const { data: servicios, error: sError } = await supabase
    .from('servicios')
    .select('*');

  if (sError) console.error('Error fetching services:', sError);

  // Fetch knowledge base
  const { data: knowledge } = await supabase
    .from('conocimiento_bot')
    .select('*');

  // Fetch conversations history
  const { data: chats, error: cError } = await supabase
    .from('conversaciones')
    .select('*');

  if (cError) console.error('Error fetching chats:', cError);

  return <AdminDashboard 
    user={user} 
    leads={leads ?? []} 
    servicios={servicios ?? []} 
    knowledge={knowledge ?? []} 
    chats={chats ?? []}
  />;
}
