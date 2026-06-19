'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback si el navegador no soporta Web Share API
      navigator.clipboard.writeText(url);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-5 py-2.5 rounded-full transition-all shadow-md shadow-blue-600/20"
    >
      <Share2 className="w-3.5 h-3.5" />
      Compartir Artículo
    </button>
  );
}
