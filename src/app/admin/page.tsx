import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();


  const supabase = createServerClient(
    'https://whomyggjgyuxfljuvmqa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob215Z2dqZ3l1eGZsanV2bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQyMjksImV4cCI6MjA5NDM0MDIyOX0.8Up0YHdMAa4b4O2JDgmWOAaiOSTXzcpuAdPHOjhUNxQ',
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

  if (!user) redirect('/admin/login');

  const activeUser = user;

  // Fetch leads
  const { data: leads, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  
  if (leadsError) console.error("❌ Error fetching leads:", leadsError);
  console.log("📊 Diagnostic - Leads count:", leads?.length || 0);


  // Fetch services
  const { data: servicios, error: sError } = await supabase
    .from('servicios')
    .select('*');
    // .order('created_at', { ascending: true });

  
  if (sError) console.error("❌ Error fetching services:", sError);

  // Fetch knowledge base
  const { data: knowledge } = await supabase
    .from('conocimiento_bot')
    .select('*');

  // Fetch conversations history
  const { data: chats, error: cError } = await supabase
    .from('conversaciones')
    .select('*');
    // .order('created_at', { ascending: false });


  if (cError) console.error("❌ Error fetching chats:", cError);


  return <AdminDashboard 
    user={activeUser} 
    leads={leads ?? []} 
    servicios={servicios ?? []} 
    knowledge={knowledge ?? []} 
    chats={chats ?? []}
  />;


}


