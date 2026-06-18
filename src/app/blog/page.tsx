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

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  const activeCategory = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : 'Todos';

  // 1. Los 2 más recientes SIEMPRE se quedan fijos arriba.
  const featuredPosts = posts?.slice(0, 2) || [];

  // 2. El grid de abajo:
  // - Si es "Todos", mostramos del 3ro en adelante (para no repetir los de arriba).
  // - Si es una categoría específica, buscamos en TODOS los artículos para que no falte ninguno.
  const gridPosts = activeCategory === 'Todos'
    ? (posts?.slice(2) || [])
    : (posts || []).filter(p => p.category === activeCategory);

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
      <section className="w-full max-w-[1300px] mx-auto px-6 mt-16 mb-10">
        
        {error ? (
          <div className="p-6 rounded-2xl bg-red-50 text-red-700 text-center border border-red-200 mb-12">
            Error cargando los artículos: {error.message}
          </div>
        ) : featuredPosts.length === 0 ? (
          <div className="p-16 rounded-3xl text-center text-muted-foreground border border-dashed border-border bg-muted/30">
            <Bot className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Aún no hay artículos publicados</h3>
            <p>Vuelve pronto para leer nuestro contenido.</p>
          </div>
        ) : (
          <>
            {/* ── 1. SECCIÓN SUPERIOR: DESTACADOS + SIDEBAR ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 mb-20 items-start">
              
              {/* IZQUIERDA: ARTÍCULOS DESTACADOS (2 COLUMNAS) */}
              <div className="lg:col-span-2">
                <h2 className="font-sans font-bold text-2xl text-foreground mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Lo más reciente
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {featuredPosts.map((post, idx) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
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
                            {post.category || 'Automatización'}
                          </span>
                        </div>
                      </div>
                    </div>
                  {/* Destello de fondo */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-30" />
                  <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20" />
                  
                  <div className="relative z-10 flex flex-col flex-grow">
                    <span className="text-blue-300 text-xs font-black tracking-widest uppercase mb-3">Servicios Premium</span>
                    <h3 className="text-2xl font-bold mb-4 leading-tight">¿Listo para automatizar tu empresa?</h3>
                    <p className="text-blue-100/80 text-sm mb-8 leading-relaxed">
                      No pierdas más tiempo en tareas manuales. Implementa agentes de IA y multiplica tus ventas hoy mismo.
                    </p>
                    
                    <div className="mt-auto">
                      <Link 
                        href="/#contact" 
                        className="flex items-center justify-center w-full bg-white hover:bg-blue-50 text-blue-900 font-bold py-3.5 px-4 rounded-xl transition-colors"
                      >
                        Cotizar Gratis
                      </Link>
                    </div>
                  </div>
                </div>

              </aside>
            </div>

            {/* ── 2. ARTÍCULOS RESTANTES ── */}
            <div className="mb-20">
              <h2 className="font-sans font-bold text-2xl text-foreground mb-8">
                {activeCategory === 'Todos' ? 'Más artículos' : `Artículos sobre ${activeCategory}`}
              </h2>
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
                        {post.category || 'Automatización'}
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
            </div>
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
/ /   F i x   V e r c e l   d e p l o y   t r i g g e r  
 