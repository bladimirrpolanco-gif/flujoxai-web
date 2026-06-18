'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 p-4 md:p-6 shadow-2xl transform transition-transform duration-500 ease-in-out">
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-zinc-300 flex-1">
          <p>
            Utilizamos cookies propias y de terceros, así como píxeles de seguimiento, para analizar el tráfico de nuestra web y mostrarte anuncios personalizados. Al hacer clic en "Aceptar", consientes el uso de estas tecnologías.
            {' '}
            <Link href="/privacidad" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
              Ver Política de Privacidad
            </Link>
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={acceptCookies}
            className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            Aceptar Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
