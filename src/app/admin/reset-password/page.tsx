"use client";

import { useEffect, useState } from 'react';
import { supabaseBrowser as supabase } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready');
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus('ready');
    });

    const timeout = setTimeout(() => {
      setStatus((current) => (current === 'checking' ? 'invalid' : current));
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('No se pudo actualizar la contraseña. El enlace puede haber expirado, solicita uno nuevo.');
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/admin'), 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="font-bold text-white text-lg leading-none">Flujobot</h1>
            <p className="text-zinc-400 text-xs">Panel de Administración</p>
          </div>

          {status === 'checking' && (
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Verificando enlace...
            </div>
          )}

          {status === 'invalid' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Enlace inválido</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Este enlace de recuperación no es válido o ya expiró. Solicita uno nuevo desde el dashboard de Supabase o vuelve a iniciar sesión.
              </p>
              <a
                href="/admin/login"
                className="inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Volver a Iniciar Sesión
              </a>
            </>
          )}

          {status === 'ready' && !success && (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Nueva Contraseña</h2>
              <p className="text-zinc-400 text-sm mb-6">Elige una contraseña nueva para tu cuenta.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Contraseña nueva
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
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
                    <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
                  ) : (
                    'Guardar Contraseña'
                  )}
                </button>
              </form>
            </>
          )}

          {success && (
            <div className="text-center py-4">
              <p className="text-white font-medium mb-1">Contraseña actualizada</p>
              <p className="text-zinc-400 text-sm">Redirigiendo al panel...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
