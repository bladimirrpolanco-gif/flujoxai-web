'use client';

export function AdPlaceholder({ width = '100%', height = '250px' }: { width?: string, height?: string }) {
  return (
    <div 
      className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 overflow-hidden relative"
      style={{ width, height }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest absolute top-2 left-2 opacity-50">Publicidad</span>
      <span className="text-sm font-medium">Espacio para Anuncio</span>
      <span className="text-xs opacity-60 mt-1 text-center px-4">
        (Inserta aquí el código de Google AdSense)
      </span>
    </div>
  );
}
