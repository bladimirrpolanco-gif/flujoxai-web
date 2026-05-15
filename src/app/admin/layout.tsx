import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | FlujoXAI',
  description: 'Panel de administración de FlujoXAI',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {children}
    </div>
  );
}
