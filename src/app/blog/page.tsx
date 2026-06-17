import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Blog | FlujoXAI',
  description: 'Descubre los mejores artículos sobre automatización, IA y desarrollo web para potenciar tu negocio.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogIndexPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, published_at')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Nuestro Blog
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Recursos, guías y estrategias para transformar tu negocio con tecnología y automatización.
          </p>
        </header>

        {error ? (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
            Error cargando los artículos: {error.message || JSON.stringify(error)}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center text-neutral-500 py-12">
            No hay artículos publicados todavía. ¡Vuelve pronto!
          </div>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="group relative bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 transition-all hover:border-blue-500/50 hover:bg-neutral-900"
              >
                <div className="flex flex-col gap-3">
                  <time className="text-sm text-neutral-500" dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('es-DO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0"></span>
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="text-neutral-400 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="pt-4 flex items-center text-blue-400 text-sm font-medium">
                    Leer artículo <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
