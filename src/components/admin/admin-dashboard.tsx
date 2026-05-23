"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import {
  Bot, Users, TrendingUp, LogOut, LayoutDashboard,
  Mail, Phone, Building2, MessageSquare, ChevronRight,
  Calendar, RefreshCw, Search, X, BarChart3, MousePointer2,
  Download, Kanban, Menu
} from 'lucide-react';
import { AdvancedAnalytics } from './advanced-analytics';

type Estado = 'nuevo' | 'contactado' | 'propuesta' | 'cerrado' | 'perdido';

interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  mensaje: string;
  created_at: string;
  estado: Estado;
  tipo?: 'lead' | 'cotizacion';
}

interface Metrica {
  id: string;
  tipo_evento: string;
  valor: number;
  metadata: any;
  created_at: string;
}

interface AdminDashboardProps {
  user: { email?: string };
  leads: Lead[];
  servicios: any[];
  knowledge: any[];
  chats: any[];
}

const PIPELINE_COLUMNS: { key: Estado; label: string; color: string; dot: string }[] = [
  { key: 'nuevo',      label: 'Nuevo',      color: 'border-t-blue-500',   dot: 'bg-blue-500'   },
  { key: 'contactado', label: 'Contactado', color: 'border-t-amber-500',  dot: 'bg-amber-500'  },
  { key: 'propuesta',  label: 'Propuesta',  color: 'border-t-purple-500', dot: 'bg-purple-500' },
  { key: 'cerrado',    label: 'Cerrado',    color: 'border-t-emerald-500',dot: 'bg-emerald-500'},
  { key: 'perdido',    label: 'Perdido',    color: 'border-t-red-500',    dot: 'bg-red-500'    },
];

const ESTADO_STYLES: Record<Estado, string> = {
  nuevo:      'bg-blue-600/20 text-blue-400',
  contactado: 'bg-amber-500/20 text-amber-400',
  propuesta:  'bg-purple-500/20 text-purple-400',
  cerrado:    'bg-emerald-600/20 text-emerald-400',
  perdido:    'bg-red-600/20 text-red-400',
};

export function AdminDashboard({ user, leads }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'leads' | 'cotizaciones' | 'analytics'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [metrics, setMetrics] = useState<Metrica[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);

  const router = useRouter();

  const supabase = createBrowserClient(
    'https://whomyggjgyuxfljuvmqa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob215Z2dqZ3l1eGZsanV2bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQyMjksImV4cCI6MjA5NDM0MDIyOX0.8Up0YHdMAa4b4O2JDgmWOAaiOSTXzcpuAdPHOjhUNxQ'
  );

  // Set up real-time subscription for leads
  
  useEffect(() => {
    const channel = supabase
      .channel('realtime-leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads' },
        (payload) => {
          // Add new lead at the beginning of the list
          setLocalLeads((prev) => [payload.new as Lead, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads' },
        (payload) => {
          const updatedLead = payload.new as Lead;
          setLocalLeads((prev) => prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
          setSelectedLead((prevSelected) => prevSelected?.id === updatedLead.id ? updatedLead : prevSelected);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchMetrics = async () => {
    setIsLoadingMetrics(true);
    const { data } = await supabase
      .from('metricas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMetrics(data);
    setIsLoadingMetrics(false);
  };

  const updateLeadEstado = async (id: string, estado: Estado) => {
    await supabase.from('leads').update({ estado }).eq('id', id);
    setLocalLeads((prev) => prev.map((l) => l.id === id ? { ...l, estado } : l));
    if (selectedLead?.id === id) setSelectedLead((prev) => prev ? { ...prev, estado } : null);
  };

  const handleExportLeads = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Estado', 'Mensaje', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...localLeads.map(l => [
        `"${l.nombre}"`,
        `"${l.email}"`,
        `"${l.telefono}"`,
        `"${l.empresa || ''}"`,
        `"${l.estado ?? 'nuevo'}"`,
        `"${(l.mensaje || '').replace(/"/g, '""')}"`,
        `"${new Date(l.created_at).toLocaleString()}"`,
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `leads_flujoxai_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Separar leads de cotizaciones:
  // Las cotizaciones tienen mensaje que empieza con [AUTOMATIZACIÓN] o [DESARROLLO SOFTWARE]
  // Los leads son los del formulario de contacto normal
  const isCotizacion = (l: Lead) =>
    l.tipo === 'cotizacion' ||
    (l.mensaje?.startsWith('[AUTOMATIZACIÓN]') || l.mensaje?.startsWith('[DESARROLLO SOFTWARE]'));

  const soloLeads = localLeads.filter((l) => !isCotizacion(l));
  const soloCotizaciones = localLeads.filter((l) => isCotizacion(l));

  const filteredLeads = soloLeads.filter((l) =>
    [l.nombre, l.email, l.empresa, l.telefono].some(
      (v) => v?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredCotizaciones = soloCotizaciones.filter((l) =>
    [l.nombre, l.email, l.empresa, l.telefono].some(
      (v) => v?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalLeads = localLeads.length;
  const thisWeek = localLeads.filter((l) => {
    if (!l.created_at) return false;
    return (new Date().getTime() - new Date(l.created_at).getTime()) / (1000 * 60 * 60 * 24) <= 7;
  }).length;
  const cerrados = localLeads.filter((l) => l.estado === 'cerrado').length;
  const tasaCierre = totalLeads > 0 ? Math.round((cerrados / totalLeads) * 100) : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const TAB_TITLES: Record<string, { title: string; sub: string }> = {
    overview:      { title: 'Resumen General',         sub: 'Métricas y actividad reciente' },
    pipeline:      { title: 'Pipeline de Ventas',      sub: 'Visualiza el avance de cada registro' },
    leads:         { title: 'Leads (Formulario)',       sub: 'Contactos del formulario principal' },
    cotizaciones:  { title: 'Cotizaciones',            sub: 'Solicitudes recibidas desde el cotizador' },
    analytics:     { title: 'Analítica',              sub: 'Rendimiento del sitio y conversiones' },
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-base">FlujoXAI <span className="text-xs font-normal text-zinc-500">CRM</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview',      icon: LayoutDashboard, label: 'Resumen' },
            { id: 'pipeline',      icon: Kanban,          label: 'Pipeline' },
            { id: 'leads',         icon: Users,           label: 'Leads', badge: soloLeads.length },
            { id: 'cotizaciones',  icon: MessageSquare,   label: 'Cotizaciones', badge: soloCotizaciones.length },
            { id: 'analytics',     icon: BarChart3,       label: 'Analítica', onClick: fetchMetrics },
          ].map(({ id, icon: Icon, label, badge, onClick }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id as any); onClick?.(); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === id ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {badge !== undefined && (
                <span className="ml-auto bg-zinc-700 text-zinc-300 text-xs rounded-full px-2 py-0.5">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {user.email?.[0].toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Administrador</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-zinc-400 hover:text-white transition">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">{TAB_TITLES[activeTab]?.title}</h1>
              <p className="text-xs md:text-sm text-zinc-500">{TAB_TITLES[activeTab]?.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(activeTab === 'leads' || activeTab === 'cotizaciones') && (
              <button
                onClick={handleExportLeads}
                className="flex items-center gap-2 text-sm bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 px-3 py-1.5 rounded-lg hover:bg-emerald-600/20 transition"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            )}
            <button
              onClick={() => router.refresh()}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </button>
          </div>
        </div>

        <div className="p-8">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users className="h-5 w-5 text-blue-400" />}         label="Leads"          value={soloLeads.length}        bg="bg-blue-600/10"   sub="Formulario de contacto" />
                <StatCard icon={<MessageSquare className="h-5 w-5 text-emerald-400" />} label="Cotizaciones" value={soloCotizaciones.length}  bg="bg-emerald-600/10" sub="Desde el cotizador" />
                <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-400" />}  label="Cerrados"       value={cerrados}                bg="bg-purple-600/10"  sub="Deals ganados" />
                <StatCard icon={<Calendar className="h-5 w-5 text-orange-400" />}    label="Esta Semana"   value={thisWeek}                bg="bg-orange-600/10" sub="Últimos 7 días" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white">Leads Recientes</h2>
                    <button onClick={() => setActiveTab('leads')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                      Ver todos <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <LeadsTable leads={soloLeads.slice(0, 5)} onSelect={setSelectedLead} formatDate={formatDate} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-white">Cotizaciones Recientes</h2>
                    <button onClick={() => setActiveTab('cotizaciones')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition">
                      Ver todas <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <LeadsTable leads={soloCotizaciones.slice(0, 5)} onSelect={setSelectedLead} formatDate={formatDate} />
                </div>
              </div>
            </div>
          )}

          {/* PIPELINE KANBAN */}
          {activeTab === 'pipeline' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {PIPELINE_COLUMNS.map((col) => {
                const colLeads = localLeads.filter((l) => (l.estado ?? 'nuevo') === col.key);
                return (
                  <div key={col.key} className={`flex-shrink-0 w-64 bg-zinc-900 rounded-2xl border border-zinc-800 border-t-4 ${col.color} flex flex-col overflow-hidden`}>
                    <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                        <span className="text-sm font-bold text-white">{col.label}</span>
                      </div>
                      <span className="text-xs bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5">{colLeads.length}</span>
                    </div>
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
                      {colLeads.length === 0 && (
                        <div className="text-center py-8 text-zinc-600 text-xs">Sin cotizaciones</div>
                      )}
                      {colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 hover:border-zinc-600 rounded-xl p-3 cursor-pointer transition group"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {lead.nombre?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <span className="text-sm font-semibold text-white truncate">{lead.nombre}</span>
                          </div>
                          {lead.empresa && (
                            <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                              <Building2 className="h-3 w-3" /> {lead.empresa}
                            </p>
                          )}
                          {lead.telefono && (
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {lead.telefono}
                            </p>
                          )}
                          <p className="text-[10px] text-zinc-600 mt-2">{formatDate(lead.created_at)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LEADS TABLE (Formulario de Contacto) */}
          {activeTab === 'leads' && (
            <div className="space-y-5">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <LeadsTable leads={filteredLeads} onSelect={setSelectedLead} formatDate={formatDate} />
              {filteredLeads.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{soloLeads.length === 0 ? 'Aún no hay leads del formulario.' : 'No se encontraron resultados.'}</p>
                </div>
              )}
            </div>
          )}

          {/* COTIZACIONES TABLE (Desde el Cotizador) */}
          {activeTab === 'cotizaciones' && (
            <div className="space-y-5">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar cotizaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <LeadsTable leads={filteredCotizaciones} onSelect={setSelectedLead} formatDate={formatDate} />
              {filteredCotizaciones.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{soloCotizaciones.length === 0 ? 'Aún no hay cotizaciones registradas.' : 'No se encontraron resultados.'}</p>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<MousePointer2 className="h-5 w-5 text-blue-400" />}    label="Visitas"             value={metrics.filter(m => m.tipo_evento === 'visita').length}            bg="bg-blue-600/10"   sub="Visitas al sitio" />
                <StatCard icon={<TrendingUp className="h-5 w-5 text-purple-400" />}     label="Cotizaciones"               value={metrics.filter(m => m.tipo_evento === 'lead_generado').length}      bg="bg-purple-600/10"  sub="Formularios" />
                <StatCard icon={<Phone className="h-5 w-5 text-emerald-400" />}         label="WhatsApp"            value={metrics.filter(m => m.tipo_evento === 'click_whatsapp').length}    bg="bg-emerald-600/10" sub="Clicks WhatsApp" />
                <StatCard icon={<BarChart3 className="h-5 w-5 text-amber-400" />}       label="Clicks CTA"          value={metrics.filter(m => m.tipo_evento === 'click_cta').length}          bg="bg-amber-600/10"   sub="Clicks Botones" />
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-6">Actividad — Últimos 12 días</h3>
                {isLoadingMetrics ? (
                  <div className="h-64 flex items-center justify-center text-zinc-500 text-sm">Cargando métricas...</div>
                ) : (
                  <div className="h-64 flex items-end gap-2 px-2">
                    {[...Array(12)].map((_, i) => {
                      const day = new Date();
                      day.setDate(day.getDate() - (11 - i));
                      const count = metrics.filter(m => new Date(m.created_at).toDateString() === day.toDateString()).length;
                      const maxVal = Math.max(1, ...[...Array(12)].map((_, j) => {
                        const d = new Date(); d.setDate(d.getDate() - (11 - j));
                        return metrics.filter(m => new Date(m.created_at).toDateString() === d.toDateString()).length;
                      }));
                      return (
                        <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                          <div className="w-full bg-blue-600/30 group-hover:bg-blue-600 transition-all rounded-t-sm relative" style={{ height: `${count > 0 ? (count / maxVal) * 100 : 2}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">{count}</div>
                          </div>
                          <span className="text-[10px] text-zinc-500 uppercase">{day.toLocaleDateString('es-DO', { weekday: 'narrow' })}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Pipeline por Etapa</h3>
                  <div className="space-y-3">
                    {PIPELINE_COLUMNS.map((col) => {
                      const count = localLeads.filter(l => (l.estado ?? 'nuevo') === col.key).length;
                      const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                      return (
                        <div key={col.key} className="flex items-center gap-4">
                          <span className="text-sm text-zinc-400 w-24 capitalize">{col.label}</span>
                          <div className="flex-1 bg-zinc-800 rounded-full h-2">
                            <div className={`h-2 rounded-full ${col.dot}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-zinc-500 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4">Botones Más Clickeados (CTAs)</h3>
                  <div className="space-y-3">
                    {(() => {
                      const ctas = metrics.filter(m => m.tipo_evento === 'click_cta');
                      const counts: Record<string, number> = {};
                      ctas.forEach(c => {
                        const name = c.metadata?.cta || 'Otro CTA';
                        counts[name] = (counts[name] || 0) + 1;
                      });
                      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                      
                      if (sorted.length === 0) {
                        return <div className="text-zinc-500 text-xs text-center py-8">Aún no hay clics registrados en CTAs.</div>;
                      }
                      
                      return sorted.map(([name, count]) => {
                        const pct = ctas.length > 0 ? Math.round((count / ctas.length) * 100) : 0;
                        return (
                          <div key={name} className="flex items-center gap-4">
                            <span className="text-xs text-zinc-400 w-32 truncate" title={name}>{name}</span>
                            <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-zinc-500 w-8 text-right">{count}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* NEW ADVANCED ANALYTICS COMPONENT */}
              <AdvancedAnalytics metrics={metrics} leads={localLeads} />
            </div>
          )}

        </div>
      </main>

      {/* Lead Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h3 className="font-bold text-white text-lg">{selectedLead.nombre}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize mt-1 ${ESTADO_STYLES[selectedLead.estado ?? 'nuevo']}`}>
                  {selectedLead.estado ?? 'nuevo'}
                </span>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-zinc-500 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <DetailRow icon={<Mail className="h-4 w-4" />}     label="Email"    value={selectedLead.email} />
              <DetailRow icon={<Phone className="h-4 w-4" />}    label="Teléfono" value={selectedLead.telefono} />
              <DetailRow icon={<Building2 className="h-4 w-4" />} label="Empresa"  value={selectedLead.empresa || '—'} />
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Recibido" value={formatDate(selectedLead.created_at)} />
              {selectedLead.mensaje && (
                <div className="pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                    <MessageSquare className="h-4 w-4" /><span>Mensaje</span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed bg-zinc-800 rounded-lg px-4 py-3">{selectedLead.mensaje}</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-3 border-t border-zinc-800 pt-4">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Mover en Pipeline</p>
              <div className="grid grid-cols-5 gap-1.5">
                {PIPELINE_COLUMNS.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => updateLeadEstado(selectedLead.id, col.key)}
                    className={`py-2 rounded-lg text-[10px] font-bold capitalize transition ${
                      (selectedLead.estado ?? 'nuevo') === col.key
                        ? `${col.dot} text-white`
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 flex gap-3">
              <a href={`mailto:${selectedLead.email}`} className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-lg transition">
                Email
              </a>
              <a href={`https://wa.me/${selectedLead.telefono?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 rounded-lg transition">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, bg, sub }: { icon: React.ReactNode; label: string; value: string | number; bg: string; sub: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm font-medium text-zinc-300 mt-0.5">{label}</p>
      <p className="text-xs text-zinc-500 mt-1">{sub}</p>
    </div>
  );
}

function LeadsTable({ leads, onSelect, formatDate }: { leads: Lead[]; onSelect: (l: Lead) => void; formatDate: (d: string) => string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Nombre</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Email</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">Empresa</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Estado</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Fecha</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {leads.map((lead) => (
            <tr key={lead.id} onClick={() => onSelect(lead)} className="hover:bg-zinc-800/50 cursor-pointer transition">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-bold flex-shrink-0">
                    {lead.nombre?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <span className="text-sm font-medium text-white">{lead.nombre}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-400 hidden md:table-cell">{lead.email}</td>
              <td className="px-4 py-3 text-sm text-zinc-400 hidden lg:table-cell">{lead.empresa || '—'}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ESTADO_STYLES[lead.estado ?? 'nuevo']}`}>
                  {lead.estado ?? 'nuevo'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-500">{formatDate(lead.created_at)}</td>
              <td className="px-4 py-3 text-right"><ChevronRight className="h-4 w-4 text-zinc-600" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-zinc-500 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-200">{value}</p>
      </div>
    </div>
  );
}
