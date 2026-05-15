"use client";

import { useState } from 'react';
import { Bot, Link2, CheckCircle2, AlertCircle, RefreshCw, Smartphone, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhatsAppSetup() {
  const [status, setStatus] = useState<'idle' | 'linking' | 'linked'>('idle');

  const handleLinkMeta = () => {
    setStatus('linking');
    // Simulation of Meta SDK Flow
    setTimeout(() => {
      setStatus('linked');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 border-t-4 border-t-emerald-500">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
            <Smartphone className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Conexión Oficial WhatsApp</h3>
            <p className="text-sm text-zinc-500">Vincula tu número mediante el sistema oficial de Meta.</p>
          </div>
        </div>

        {status === 'idle' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Paso 1</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">Cuenta Meta Business</h4>
                <p className="text-xs text-zinc-500">Necesitas una cuenta verificada en Meta for Developers.</p>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Paso 2</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">Número de Teléfono</h4>
                <p className="text-xs text-zinc-500">Un número que no haya sido usado en el WhatsApp normal.</p>
              </div>
            </div>

            <div className="bg-zinc-800/20 border border-zinc-700 rounded-2xl p-6 text-center">
              <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                Al hacer clic en el botón, se abrirá una ventana oficial de Facebook para que selecciones tu empresa y número.
              </p>
              <Button 
                onClick={handleLinkMeta}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white px-8 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-blue-600/20"
              >
                <Link2 className="h-5 w-5" />
                Continuar con Facebook
              </Button>
            </div>
          </div>
        )}

        {status === 'linking' && (
          <div className="py-12 text-center space-y-4">
            <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin mx-auto" />
            <h4 className="text-white font-bold">Conectando con Meta...</h4>
            <p className="text-sm text-zinc-500">Por favor, completa el registro en la ventana emergente.</p>
          </div>
        )}

        {status === 'linked' && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-6">
              <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-emerald-400 font-bold mb-1">WhatsApp Conectado</h4>
                <p className="text-xs text-zinc-400">Tu número +1 (809) 555-0123 está activo y respondiendo con la IA.</p>
              </div>
              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={() => setStatus('idle')}>
                Desconectar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="h-5 w-5 text-blue-400" />
                  <h5 className="text-white font-bold text-sm">Credenciales Meta</h5>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Phone Number ID</p>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-xs text-blue-300">123456789012345</code>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">WABA ID</p>
                    <code className="bg-zinc-800 px-2 py-1 rounded text-xs text-blue-300">987654321098765</code>
                  </div>
                </div>
              </div>

               <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="h-5 w-5 text-emerald-400" />
                  <h5 className="text-white font-bold text-sm">Estado de Webhook</h5>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Recepción de Mensajes</span>
                    <span className="text-emerald-500 font-bold">ACTIVO</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Envío de Plantillas</span>
                    <span className="text-emerald-500 font-bold">ACTIVO</span>
                   </div>
                   <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Verificación de Token</span>
                    <span className="text-emerald-500 font-bold">VÁLIDO</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-zinc-800/10 border border-zinc-800 rounded-2xl p-6">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-blue-400" /> Notas Importantes
        </h4>
        <ul className="text-xs text-zinc-500 space-y-3 list-disc pl-4">
          <li>El número vinculado se convertirá en una cuenta de negocios y no podrá usarse en la app móvil personal de WhatsApp.</li>
          <li>Meta cobra cargos por conversación que se facturarán directamente a tu cuenta de Facebook Business.</li>
          <li>Cada cliente de tu plataforma podrá ver esta pantalla para vincular su propia línea de atención.</li>
        </ul>
      </div>
    </div>
  );
}
