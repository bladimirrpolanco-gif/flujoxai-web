import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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

  // Si no está publicado y alguien intenta acceder (opcional: proteger si no hay admin logueado)
  const isPublished = post.published_at && new Date(post.published_at) <= new Date();
  if (!isPublished) {
    // Si quisieras ocultarlo incluso de acceso directo si no está publicado:
    // notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-24 pb-16 px-6">
      <article className="max-w-3xl mx-auto">
        <header className="mb-10 pb-8 border-b border-neutral-800">
          <Link href="/blog" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-6 transition-colors">
            ← Volver al blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {post.title}
          </h1>
          {post.published_at && (
            <time className="text-neutral-500" dateTime={post.published_at}>
              Publicado el {new Date(post.published_at).toLocaleDateString('es-DO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
        </header>
        
        {/* En un futuro puedes usar una librería como 'react-markdown' o 'marked' si decides escribir en Markdown. 
            Por ahora renderizamos el HTML si el contenido es rico, o texto plano si es texto simple. */}
        <div 
          className="prose prose-invert prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
