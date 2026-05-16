import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Flujobot',
  description: 'Panel de administración de Flujobot',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {children}
    </div>
  );
}
