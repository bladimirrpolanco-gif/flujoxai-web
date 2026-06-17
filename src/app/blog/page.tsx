import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Blog | FlujoXAI',
  description: 'Descubre los mejores artículos sobre automatización, IA y desarrollo web para potenciar tu negocio.',
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <header className="mb-20 text-center">
            <h1 className="font-sans mb-6 leading-[0.95] perspective-1000 text-[clamp(2.5rem,4.5vw,4.5rem)]">
              <span className="block text-foreground font-black tracking-tight">
                Insights &
              </span>
              <span className="block text-[#2563EB] italic font-light tracking-normal mt-2 md:mt-3 whitespace-nowrap text-[0.85em] md:text-[0.9em]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Automatización
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Estrategias, guías y casos de uso para transformar tu negocio con Inteligencia Artificial.
            </p>
          </header>

          {error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-600 dark:text-red-400 text-center shadow-sm">
              Error cargando los artículos: {error.message || JSON.stringify(error)}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-20 bg-card/50 border border-border rounded-3xl backdrop-blur-sm shadow-sm">
              <span className="block text-4xl mb-4">✍️</span>
              <p className="text-lg">No hay artículos publicados todavía.</p>
              <p className="text-sm mt-2 opacity-70">¡Vuelve pronto para leer contenido increíble!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group block h-full">
                  <article className="flex flex-col h-full bg-card/60 border border-border rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:bg-card/80 backdrop-blur-md">
                    <time className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block" dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString('es-DO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors font-syne leading-tight">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-8 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center text-primary text-sm font-bold uppercase tracking-wider">
                      Leer más 
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
