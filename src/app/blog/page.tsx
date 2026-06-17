import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Bot } from 'lucide-react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog | FlujoXAI',
  description: 'Descubre los mejores artículos sobre automatización, IA y desarrollo web para potenciar tu negocio.',
};

export default async function BlogIndexPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const featuredPosts = posts?.slice(0, 2) || [];
  const regularPosts = posts?.slice(2) || [];

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* ── HERO AZUL ── */}
      {/* El fondo azul ocupa solo esta sección. Las tarjetas vienen DESPUÉS. */}
      <section
        className="w-full pt-32 pb-16 px-6 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
        }}
      >
        <h1 className="font-sans font-bold tracking-tight leading-[1.1] mb-4 text-4xl md:text-5xl lg:text-6xl">
          Insights &{' '}
          <span
            className="font-light italic"
            style={{ fontFamily: 'var(--font-playfair)', opacity: 0.9 }}
          >
            Automatización
          </span>
        </h1>
        <p className="text-blue-100 text-base md:text-lg max-w-xl mx-auto font-medium">
          Las últimas estrategias, guías y tendencias para transformar tu negocio con Inteligencia Artificial.
        </p>
      </section>

      {/* ── CONTENEDOR PRINCIPAL DEL BLOG ── */}
      <section className="w-full max-w-[1100px] mx-auto px-6 mt-12 mb-10">
        
        {/* Encabezado de la sección y Filtros */}
        <div className="flex flex-col items-center mb-14">
          <div className="text-center mb-10">
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-foreground mb-4 tracking-tight">
              Explora Nuestro Blog
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Encuentra artículos, guías y casos de éxito sobre cómo la automatización y la IA pueden transformar tu negocio.
            </p>
          </div>

          {/* Menú de Categorías (Estilo Segmented Control Premium) */}
          <div className="flex flex-wrap justify-center gap-1 bg-neutral-100 dark:bg-neutral-900/50 p-1.5 rounded-[2rem] border border-border/60 shadow-sm">
            {['Todos', 'Chatbots', 'Automatización', 'CRM', 'Tendencias'].map((cat, i) => (
              <button
                key={cat}
                className={`text-[15px] font-medium px-6 py-2.5 rounded-full transition-all duration-300 ${
                  i === 0
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARJETAS DESTACADAS ── */}
      <section className="w-full max-w-[1100px] mx-auto px-6 mt-12 mb-16">
        {error ? (
          <div className="p-6 rounded-2xl bg-red-50 text-red-700 text-center border border-red-200">
            Error cargando los artículos: {error.message}
          </div>
        ) : featuredPosts.length === 0 ? (
          <div className="p-12 rounded-2xl text-center text-muted-foreground border border-border">
            Aún no hay artículos publicados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {featuredPosts.map((post, idx) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block h-full">
                <div
                  className="flex flex-col h-full bg-white dark:bg-card border border-border rounded-[28px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}
                >
                  {/* Imagen (Arriba) */}
                  <div className="relative h-[200px] sm:h-[240px] w-full bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image || `https://picsum.photos/seed/${post.slug}-feature/800/600`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Contenido (Abajo) */}
                  <div className="p-7 flex flex-col flex-grow">
                    <h2 className="font-sans font-bold text-foreground tracking-tight leading-snug line-clamp-2 text-xl md:text-2xl mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm mb-6 font-medium flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Pie de tarjeta: autor izquierda, categoría derecha */}
                    <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>Equipo FlujoXAI</span>
                        <span className="mx-1 opacity-50">·</span>
                        <time>
                          {new Date(post.published_at).toLocaleDateString('es-DO', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                        {idx === 0 ? 'IA & Tech' : 'Estrategia'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── TODOS LOS ARTÍCULOS (Grid secundario) ── */}
      <section className="w-full max-w-[1100px] mx-auto px-6 pb-24">
        {/* Grid de tarjetas regulares (si las hay) */}
        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {regularPosts.map((post) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.id}
                className="group flex flex-col bg-card rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {/* Imagen */}
                <div className="h-[200px] overflow-hidden bg-muted rounded-[20px] m-2 mb-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover_image || `https://picsum.photos/seed/${post.slug}-regular/600/400`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">
                    Automatización
                  </span>
                  <h3 className="text-[20px] font-bold tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors font-sans">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Pronto publicaremos más artículos. ¡Mantente atento!
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
