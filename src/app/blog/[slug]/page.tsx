import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Bot, Calendar, ChevronRight, Tag, Share2 } from 'lucide-react';

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, seo_keywords')
    .eq('slug', slug)
    .single();

  if (!post) {
    return { title: 'Artículo no encontrado | FlujoXAI' };
  }

  return {
    title: `${post.title} | FlujoXAI`,
    description: post.excerpt,
    keywords: post.seo_keywords,
    openGraph: {
      title: post.title,
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
    .select('id, title, slug, published_at, excerpt')
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
                src={`https://picsum.photos/seed/${post.slug}-hero/1200/600`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido del artículo */}
            <div
              className="
                prose prose-neutral dark:prose-invert max-w-none
                prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/80
                prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-a:font-medium prose-a:no-underline
                prose-strong:text-foreground prose-strong:font-bold
                prose-ul:space-y-2 prose-ol:space-y-2
                prose-li:text-foreground/80 prose-li:leading-relaxed
                prose-img:rounded-[16px] prose-img:shadow-sm
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:dark:bg-blue-900/20 prose-blockquote:py-1 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Compartir */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Comparte este artículo
              </p>
              <div className="flex gap-3">
                {[
                  { label: 'LinkedIn', color: 'bg-[#0077b5]', href: `https://www.linkedin.com/sharing/share-offsite/?url=https://flujoxai.com/blog/${post.slug}` },
                  { label: 'Twitter / X', color: 'bg-black', href: `https://twitter.com/intent/tweet?url=https://flujoxai.com/blog/${post.slug}&text=${encodeURIComponent(post.title)}` },
                  { label: 'WhatsApp', color: 'bg-[#25d366]', href: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + 'https://flujoxai.com/blog/' + post.slug)}` },
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
                          src={`https://picsum.photos/seed/${p.slug}-thumb/200/150`}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-1">Automatización</p>
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
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 group cursor-pointer hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">{cat}</span>
                    <span className="text-[11px] text-muted-foreground font-bold">{Math.floor(Math.random() * 8) + 1}</span>
                  </div>
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
                  <span
                    key={tag}
                    className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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

      <Footer />
    </main>
  );
}
