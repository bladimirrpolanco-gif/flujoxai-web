import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AdPlaceholder } from '@/components/ad-placeholder';
import { Bot, Calendar, ChevronRight, Tag, Share2 } from 'lucide-react';

export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, seo_keywords, meta_title, focus_keyword')
    .eq('slug', slug)
    .single();

  if (!post) {
    return { title: 'Artículo no encontrado | FlujoXAI' };
  }

  const pageTitle = post.meta_title || `${post.title} | FlujoXAI`;
  const pageKeywords = [post.focus_keyword, post.seo_keywords].filter(Boolean).join(', ');

  return {
    title: pageTitle,
    description: post.excerpt,
    keywords: pageKeywords,
    openGraph: {
      title: pageTitle,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // Cargar el artículo actual
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  // Cargar artículos recientes para el sidebar (máx 4, excluyendo el actual)
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, slug, published_at, excerpt, cover_image, category')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(4);

  const categories = ['Chatbots', 'Automatización', 'CRM', 'Tendencias', 'IA & Tech', 'Estrategia'];
  const tags = ['#InteligenciaArtificial', '#Automatización', '#ChatGPT', '#CRM', '#Negocios', '#FlujoXAI'];

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* ── HERO AZUL con título del artículo ── */}
      <section
        className="w-full pt-32 pb-16 px-6 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
        }}
      >
        {/* Categoría */}
        <span className="inline-block text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-4">
          IA & Tech
        </span>

        {/* Título del artículo */}
        <h1 className="font-sans font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.15] text-white max-w-3xl mx-auto mb-5">
          {post.title}
        </h1>

        {/* Autor + Fecha */}
        {post.published_at && (
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/90">Equipo FlujoXAI</span>
            <span className="text-white/40">·</span>
            <time className="text-sm text-blue-100">
              {new Date(post.published_at).toLocaleDateString('es-DO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        )}
      </section>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-10 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-medium">
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </nav>

        {/* Layout: Artículo + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">

          {/* ── COLUMNA IZQUIERDA: Artículo ── */}
          <article className="flex-1 min-w-0">

            {/* Imagen Hero */}
            <div className="w-full h-[280px] md:h-[380px] rounded-[20px] overflow-hidden mb-10 bg-neutral-100 dark:bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image || `https://picsum.photos/seed/${post.slug}-hero/1200/600`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido del artículo */}
            <div
              className="
                prose prose-lg prose-neutral dark:prose-invert max-w-none
                prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-[26px] prose-h2:mt-12 prose-h2:mb-5 prose-h2:leading-snug
                prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-3 prose-h3:leading-snug
                prose-p:text-[16px] prose-p:leading-[1.85] prose-p:text-foreground/80 prose-p:mb-5
                prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:font-semibold prose-a:no-underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-ul:my-5 prose-ul:space-y-2 prose-ol:my-5 prose-ol:space-y-2
                prose-li:text-[16px] prose-li:leading-[1.75] prose-li:text-foreground/80
                prose-img:rounded-[16px] prose-img:shadow-md
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:dark:bg-blue-900/20 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-foreground/90 prose-blockquote:my-8
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Compartir y Síguenos */}
            <div className="mt-12 pt-8 border-t border-border flex flex-col gap-6">
              
              {/* Compartir */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir este artículo
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + 'https://flujoxai.com/blog/' + post.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25d366] text-white text-[11px] font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://flujoxai.com/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0077b5] text-white text-[11px] font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Síguenos */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border/50">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  Síguenos en nuestras redes
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Instagram', color: 'bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888]', href: `https://www.instagram.com/flujoxai/` },
                    { label: 'Facebook', color: 'bg-[#1877f2]', href: `https://web.facebook.com/profile.php?id=61575443542288` },
                    { label: 'LinkedIn', color: 'bg-[#0077b5]', href: `https://www.linkedin.com/in/flujox-ai-0240073b4/` },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${s.color} text-white text-[11px] font-bold px-4 py-2 rounded-full transition-opacity hover:opacity-80`}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Banner publicitario al final del artículo */}
            <div className="mt-12 w-full">
              <AdPlaceholder height="150px" />
            </div>

            {/* Volver al Blog */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Volver a todos los artículos
              </Link>
            </div>
          </article>

          {/* ── COLUMNA DERECHA: Sidebar ── */}
          <aside className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 space-y-8">

            {/* Primer Anuncio (Top Sidebar) */}
            <AdPlaceholder height="250px" />

            {/* Últimas Publicaciones */}
            <div className="bg-card rounded-[20px] p-6 border border-border/60">
              <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-600 inline-block" />
                Últimas Publicaciones
              </h3>
              <div className="space-y-4">
                {recentPosts && recentPosts.length > 0 ? (
                  recentPosts.map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                      <div className="w-16 h-14 rounded-[12px] overflow-hidden bg-muted flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.cover_image || `https://picsum.photos/seed/${p.slug}-thumb/200/150`}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-1">{p.category || 'Automatización'}</p>
                        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </p>
                        <time className="text-[11px] text-muted-foreground mt-1 block">
                          {new Date(p.published_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </time>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay otros artículos aún.</p>
                )}
              </div>
            </div>

            {/* Categorías */}
            <div className="bg-card rounded-[20px] p-6 border border-border/60">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-blue-600 inline-block" />
                Categorías
              </h3>
              <div className="space-y-2">
                {categories.map((cat, i) => (
                  <Link href={`/blog?category=${cat}`} key={cat} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 group cursor-pointer hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">{cat}</span>
                    <span className="text-[11px] text-muted-foreground font-bold">{Math.floor(Math.random() * 8) + 1}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags Populares */}
            <div className="bg-card rounded-[20px] p-6 border border-border/60">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                Tags Populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    href={`/blog`}
                    key={tag}
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Segundo Anuncio (Sticky) */}
            <div className="sticky top-24">
              <AdPlaceholder height="250px" />
            </div>

            {/* CTA Card */}
            <div
              className="rounded-[20px] p-6 text-white overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
              <Bot className="w-8 h-8 mb-3 text-white/90" />
              <h4 className="font-bold text-lg leading-snug mb-2">
                ¿Listo para automatizar tu negocio?
              </h4>
              <p className="text-sm text-blue-100/90 mb-5 leading-relaxed">
                Agenda una sesión gratuita y descubre cómo la IA puede transformar tu empresa.
              </p>
              <Link
                href="/#contacto"
                className="inline-block bg-white text-blue-700 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors shadow-md"
              >
                Hablar con un Experto →
              </Link>
            </div>

          </aside>
        </div>
      </div>

      {/* ── SECCIÓN: TE PODRÍA INTERESAR ── */}
      {recentPosts && recentPosts.length > 0 && (
        <div className="w-full bg-neutral-50 dark:bg-neutral-900/30 border-t border-border mt-10 py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-2xl font-bold font-sans text-foreground mb-10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Sigue leyendo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 3).map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.id}
                  className="group flex flex-col h-full bg-white dark:bg-card border border-border rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}
                >
                  {/* Imagen */}
                  <div className="relative h-[200px] w-full bg-neutral-100 dark:bg-neutral-800 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image || `https://picsum.photos/seed/${post.slug}-feature/800/600`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Contenido */}
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3 block">
                      {post.category || 'Automatización'}
                    </span>
                    <h3 className="text-[18px] font-bold tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors font-sans">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-[14px] leading-relaxed line-clamp-2 mb-4 flex-grow">
                      {post.excerpt}
                    </p>
                    <time className="text-xs font-semibold text-muted-foreground mt-auto pt-4 border-t border-border/50">
                      {new Date(post.published_at).toLocaleDateString('es-DO', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
