import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

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
    return {
      title: 'Artículo no encontrado | FlujoXAI',
    };
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

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <article className="flex-1 pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-full max-w-lg h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <header className="mb-14 pb-8 border-b border-border text-center md:text-left">
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 mb-8 transition-colors group">
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Volver a todos los artículos
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 font-sans leading-[1.1] text-foreground">
              {post.title}
            </h1>
            
            {post.published_at && (
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium">
                <time dateTime={post.published_at} className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {new Date(post.published_at).toLocaleDateString('es-DO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Equipo FlujoXAI
                </span>
              </div>
            )}
          </header>
          
          <div 
            className="prose prose-neutral dark:prose-invert max-w-none 
                       prose-headings:font-sans prose-headings:font-black 
                       prose-headings:tracking-tight
                       prose-a:text-primary hover:prose-a:text-primary/80 
                       prose-p:leading-relaxed prose-p:text-lg
                       prose-img:rounded-2xl prose-img:border prose-img:border-border prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      
      <Footer />
    </main>
  );
}
