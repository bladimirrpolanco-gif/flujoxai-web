import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Bot } from 'lucide-react';

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

      {/* ── TARJETAS DESTACADAS (van DEBAJO del fondo azul) ── */}
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
              <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                <div
                  className="relative h-[340px] md:h-[380px] rounded-[28px] overflow-hidden transition-all duration-300 hover:-translate-y-2"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18)' }}
                >
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0 bg-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${post.slug}-feature/800/600`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Degradado oscuro de abajo hacia arriba */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                  </div>

                  {/* Contenido dentro de la tarjeta */}
                  <div className="absolute inset-0 p-7 flex flex-col justify-end">
                    <h2 className="font-sans font-bold text-white tracking-tight leading-snug line-clamp-2 text-2xl md:text-3xl mb-3">
                      {post.title}
                    </h2>
                    <p className="text-neutral-200/90 line-clamp-2 text-sm mb-5 font-medium">
                      {post.excerpt}
                    </p>

                    {/* Pie de tarjeta: autor izquierda, categoría derecha */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 text-white" />
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
                      <span className="bg-white text-black text-[11px] font-bold px-4 py-1.5 rounded-full tracking-wide">
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

      {/* ── TODOS LOS ARTÍCULOS ── */}
      <section className="w-full max-w-[1100px] mx-auto px-6 pb-24">
        {regularPosts.length > 0 ? (
          <>
            {/* Título + filtros de categoría */}
            <div className="flex flex-col items-center mb-10">
              <h2 className="font-sans font-bold text-3xl text-foreground mb-8">
                Todos los Artículos
              </h2>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {['Todos', 'Chatbots', 'Automatización', 'CRM', 'Tendencias'].map((cat, i) => (
                  <button
                    key={cat}
                    className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                      i === 0
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de tarjetas */}
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
                      src={`https://picsum.photos/seed/${post.slug}-regular/600/400`}
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
          </>
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
