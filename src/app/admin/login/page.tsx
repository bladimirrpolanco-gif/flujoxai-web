"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Bot, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const supabase = createBrowserClient(
    'https://whomyggjgyuxfljuvmqa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob215Z2dqZ3l1eGZsanV2bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQyMjksImV4cCI6MjA5NDM0MDIyOX0.8Up0YHdMAa4b4O2JDgmWOAaiOSTXzcpuAdPHOjhUNxQ'
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetEmail = email.trim();
    const targetEmailLower = targetEmail.toLowerCase();
    const isMainAdmin = targetEmailLower === 'flujoxai@gmail.com' || targetEmailLower === 'soporte@flujoxai.com';

    try {
      // 1. Intentar iniciar sesión normalmente
      const { error: authError } = await supabase.auth.signInWithPassword({ email: targetEmail, password });

      if (authError) {
        // 2. Si falla y es el correo principal, intentamos con la cuenta administrativa de respaldo
        if (isMainAdmin) {
          console.log("Fallo con correo principal. Intentando con cuenta admin@flujoxai.com...");
          const backupEmail = 'admin@flujoxai.com';
          
          const { error: backupAuthError } = await supabase.auth.signInWithPassword({ 
            email: backupEmail, 
            password 
          });

          if (!backupAuthError) {
            router.push('/admin');
            router.refresh();
            return;
          }

          // 3. Si la cuenta de respaldo tampoco inicia (ej. no existe aún), la creamos automáticamente
          console.log("Registrando cuenta administrativa de respaldo...");
          const { error: backupSignUpError } = await supabase.auth.signUp({
            email: backupEmail,
            password,
            options: {
              data: {
                nombre: "Administrador FlujoxAI",
                rol: "admin"
              }
            }
          });

          if (!backupSignUpError) {
            // 4. Iniciar sesión con la cuenta recién registrada
            const { error: finalSignInError } = await supabase.auth.signInWithPassword({
              email: backupEmail,
              password
            });

            if (!finalSignInError) {
              router.push('/admin');
              router.refresh();
              return;
            }
          }
        }
        
        setError(`Credenciales inválidas. Verifica tu email y contraseña.`);
        setLoading(false);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setError(`Ocurrió un error inesperado: ${err.message || err}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">Flujobot</h1>
              <p className="text-zinc-400 text-xs">Panel de Administración</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Iniciar Sesión</h2>
          <p className="text-zinc-400 text-sm mb-6">Accede al panel de control de Flujobot.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flujobot.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm pr-12 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verificando...</>
              ) : (
                'Entrar al Panel'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Acceso restringido al equipo de Flujobot
          </p>
        </div>
      </div>
    </div>
  );
}
