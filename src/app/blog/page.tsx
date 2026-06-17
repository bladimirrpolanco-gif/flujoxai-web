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

  const heroPost = posts?.[0];
  const gridPosts = posts?.slice(1) || [];

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* ── HERO HEADER ── */}
      <section
        className="w-full pt-32 pb-20 px-6 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-blue-200 text-sm font-semibold tracking-wide mb-6 border border-white/20 backdrop-blur-md">
            Blog & Recursos
          </span>
          <h1 className="font-sans font-bold tracking-tight leading-[1.1] mb-6 text-4xl md:text-5xl lg:text-7xl">
            Insights &{' '}
            <span
              className="font-light italic"
              style={{ fontFamily: 'var(--font-playfair)', opacity: 0.9 }}
            >
              Automatización
            </span>
          </h1>
          <p className="text-blue-100/90 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Las últimas estrategias, guías prácticas y casos de éxito para transformar tu negocio usando Inteligencia Artificial y automatización.
          </p>
        </div>
      </section>

      {/* ── CONTENEDOR PRINCIPAL DEL BLOG ── */}
      <section className="w-full max-w-[1200px] mx-auto px-6 mt-16 mb-10">
        
        {error ? (
          <div className="p-6 rounded-2xl bg-red-50 text-red-700 text-center border border-red-200 mb-12">
            Error cargando los artículos: {error.message}
          </div>
        ) : !heroPost ? (
          <div className="p-16 rounded-3xl text-center text-muted-foreground border border-dashed border-border bg-muted/30">
            <Bot className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Aún no hay artículos publicados</h3>
            <p>Vuelve pronto para leer nuestro contenido.</p>
          </div>
        ) : (
          <>
            {/* ── 1. ARTÍCULO PRINCIPAL (HERO POST) ── */}
            <div className="mb-20">
              <h2 className="font-sans font-bold text-2xl text-foreground mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Lo más reciente
              </h2>
              
              <Link href={`/blog/${heroPost.slug}`} className="group block">
                <div
                  className="flex flex-col lg:flex-row bg-white dark:bg-card border border-border rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.06)' }}
                >
                  {/* Imagen (Izquierda en PC, Arriba en Móvil) */}
                  <div className="relative w-full lg:w-3/5 h-[280px] sm:h-[400px] lg:h-[460px] bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={heroPost.cover_image || `https://picsum.photos/seed/${heroPost.slug}-hero/1200/800`}
                      alt={heroPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Contenido (Derecha en PC, Abajo en Móvil) */}
                  <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center w-full lg:w-2/5">
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[13px] font-bold px-4 py-1.5 rounded-full tracking-wide w-fit mb-6">
                      Destacado
                    </span>
                    <h2 className="font-sans font-extrabold text-foreground tracking-tight leading-[1.15] text-3xl sm:text-4xl lg:text-[2.75rem] mb-6 group-hover:text-blue-600 transition-colors">
                      {heroPost.title}
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-8 font-medium leading-relaxed line-clamp-3">
                      {heroPost.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold mt-auto pt-8 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground">Equipo FlujoXAI</span>
                        <time className="text-xs font-medium">
                          {new Date(heroPost.published_at).toLocaleDateString('es-DO', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* ── 2. MENÚ DE CATEGORÍAS ── */}
            <div className="flex flex-col items-center mb-16 relative">
              {/* Línea decorativa */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-border -z-10" />
              
              <div className="bg-background px-4">
                <div className="flex flex-wrap justify-center gap-1 bg-neutral-100 dark:bg-neutral-900/80 p-1.5 rounded-[2rem] border border-border/60 shadow-sm backdrop-blur-md">
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
            </div>

            {/* ── 3. GRID DE ARTÍCULOS RECIENTES ── */}
            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    key={post.id}
                    className="group flex flex-col h-full bg-card rounded-[28px] overflow-hidden transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-border/50"
                    style={{ boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)' }}
                  >
                    {/* Imagen */}
                    <div className="h-[220px] overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image || `https://picsum.photos/seed/${post.slug}-regular/600/400`}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-7 flex flex-col flex-grow bg-white dark:bg-card border-x border-b border-border/40 rounded-b-[28px]">
                      <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 block">
                        Automatización
                      </span>
                      <h3 className="text-[22px] font-bold tracking-tight leading-snug mb-4 group-hover:text-blue-600 transition-colors font-sans">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2 mb-6 font-medium flex-grow">
                        {post.excerpt}
                      </p>
                      
                      <time className="text-xs font-semibold text-muted-foreground mt-auto pt-5 border-t border-border/50">
                        {new Date(post.published_at).toLocaleDateString('es-DO', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Pronto publicaremos más artículos. ¡Mantente atento!
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── 4. CTA FINAL (NEWSLETTER/CONTACTO) ── */}
      <section className="w-full px-6 py-24 bg-neutral-50 dark:bg-neutral-900/20 border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-[40px] p-10 md:p-16 text-center border border-border shadow-2xl shadow-blue-900/5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-foreground mb-4">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya están ahorrando cientos de horas al mes delegando tareas repetitivas a la Inteligencia Artificial.
          </p>
          <Link 
            href="/#contact"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Hablar con un Experto
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
