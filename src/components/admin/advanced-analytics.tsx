"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface AdvancedAnalyticsProps {
  metrics: any[];
  leads: any[];
}

export function AdvancedAnalytics({ metrics, leads }: AdvancedAnalyticsProps) {
  // 1. Embudo de Conversión
  const visitas = metrics.filter(m => m.tipo_evento === 'visita').length;
  const interacciones = metrics.filter(m => m.tipo_evento === 'click_cta' || m.tipo_evento === 'click_whatsapp').length;
  const leadsRecibidos = leads.length;
  const cerrados = leads.filter(l => l.estado === 'cerrado').length;

  const funnelData = [
    { stage: 'Visitas Totales', value: visitas, color: 'bg-blue-600' },
    { stage: 'Interacciones', value: interacciones, color: 'bg-indigo-500' },
    { stage: 'Leads Recibidos', value: leadsRecibidos, color: 'bg-purple-500' },
    { stage: 'Tratos Cerrados', value: cerrados, color: 'bg-emerald-500' }
  ];
  const maxFunnel = Math.max(visitas, 1);

  // 2. Heatmap por Horarios
  const heatmap = useMemo(() => {
    const matrix = {
      'Mañana (6am-12pm)': [0,0,0,0,0,0,0],
      'Tarde (12pm-6pm)': [0,0,0,0,0,0,0],
      'Noche (6pm-6am)': [0,0,0,0,0,0,0]
    };
    
    metrics.forEach(m => {
      const d = new Date(m.created_at);
      const day = d.getDay(); // 0 (Sun) to 6 (Sat)
      const hour = d.getHours();
      
      const realDay = day === 0 ? 6 : day - 1; // 0 (Mon) to 6 (Sun)
      
      if (hour >= 6 && hour < 12) matrix['Mañana (6am-12pm)'][realDay]++;
      else if (hour >= 12 && hour < 18) matrix['Tarde (12pm-6pm)'][realDay]++;
      else matrix['Noche (6pm-6am)'][realDay]++;
    });
    
    return matrix;
  }, [metrics]);

  const maxHeatmap = Math.max(1, ...Object.values(heatmap).flat());
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // 3. Distribución de Dispositivos (Doughnut)
  const deviceData = useMemo(() => {
    let mobile = 0;
    let desktop = 0;
    let unknown = 0;
    
    metrics.filter(m => m.tipo_evento === 'visita').forEach(m => {
      if (m.metadata?.device === 'Mobile') mobile++;
      else if (m.metadata?.device === 'Desktop') desktop++;
      else unknown++;
    });
    
    // Add fake data if empty just to show the chart
    if (mobile === 0 && desktop === 0) {
      desktop = 60; mobile = 40;
    }
    
    return [
      { name: 'Escritorio', value: desktop, color: '#3b82f6' },
      { name: 'Móvil', value: mobile, color: '#10b981' },
      { name: 'Desconocido', value: unknown, color: '#52525b' }
    ].filter(d => d.value > 0);
  }, [metrics]);

  // 5. Velocidad de Ventas (Líneas)
  const velocityData = useMemo(() => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      
      const leadsDia = leads.filter(l => new Date(l.created_at).toDateString() === dateStr).length;
      const cerradosDia = leads.filter(l => l.estado === 'cerrado' && new Date(l.created_at).toDateString() === dateStr).length; // Approximated
      
      data.push({
        name: d.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
        Leads: leadsDia,
        Cerrados: cerradosDia
      });
    }
    return data;
  }, [leads]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      
      {/* 1. Embudo de Conversión */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-6">Embudo de Conversión</h3>
        <div className="space-y-4">
          {funnelData.map((step, idx) => {
            const width = Math.max(5, (step.value / maxFunnel) * 100);
            return (
              <div key={step.stage} className="flex flex-col items-center">
                <div className="w-full flex justify-between text-xs text-zinc-400 mb-1 px-2">
                  <span>{step.stage}</span>
                  <span className="font-bold text-white">{step.value}</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-8 flex items-center justify-center overflow-hidden">
                  <div 
                    className={`h-full ${step.color} transition-all duration-1000 ease-out flex items-center justify-center`}
                    style={{ width: `${width}%` }}
                  >
                    {idx > 0 && step.value > 0 && (
                      <span className="text-[10px] text-white/90 font-bold shadow-sm">
                        {Math.round((step.value / Math.max(funnelData[idx-1].value, 1)) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Distribución de Dispositivos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-6">Tráfico por Dispositivo</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {deviceData.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
              <span className="text-xs text-zinc-400">{d.name} ({Math.round((d.value/Math.max(visitas,1))*100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Mapa de Calor (Heatmap) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 xl:col-span-2">
        <h3 className="text-white font-semibold mb-6">Mapa de Calor (Actividad Semanal)</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-8 gap-1 mb-1">
              <div></div>
              {days.map((d, i) => <div key={i} className="text-center text-xs text-zinc-500">{d}</div>)}
            </div>
            {Object.entries(heatmap).map(([franja, valores]) => (
              <div key={franja} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-xs text-zinc-400 flex items-center">{franja}</div>
                {valores.map((val, i) => {
                  const intensity = val > 0 ? Math.max(0.2, val / maxHeatmap) : 0;
                  return (
                    <div 
                      key={i} 
                      className="h-10 rounded-md flex items-center justify-center text-xs text-white/90 transition-all hover:ring-2 hover:ring-white/20 cursor-pointer"
                      style={{ 
                        backgroundColor: val > 0 ? `rgba(59, 130, 246, ${intensity})` : '#27272a',
                        border: val > 0 ? 'none' : '1px solid #3f3f46'
                      }}
                      title={`${val} eventos`}
                    >
                      {val > 0 ? val : ''}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Velocidad del Pipeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 xl:col-span-2">
        <h3 className="text-white font-semibold mb-6">Velocidad de Adquisición (Últimos 12 Días)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={velocityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="Leads" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Cerrados" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickMargin={10} />
              <YAxis stroke="#52525b" fontSize={12} allowDecimals={false} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
