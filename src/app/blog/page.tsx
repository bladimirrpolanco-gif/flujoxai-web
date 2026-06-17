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
      
      {/* HEADER SECTION WITH OVERLAP */}
      <div className="relative w-full isolate z-0">
        {/* Background Gradient Header */}
        <div className="absolute top-0 left-0 w-full h-[550px] bg-gradient-to-br from-blue-700 via-blue-600 to-[#1d4ed8] rounded-b-[40px] md:rounded-b-[80px] -z-10 overflow-hidden">
          {/* Decorative shapes inside gradient */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        </div>
        
        <div className="pt-36 pb-12 px-6 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 font-sans">
            Insights & <span className="font-light italic opacity-90" style={{ fontFamily: 'var(--font-playfair)' }}>Automatización</span>
          </h1>
          <p className="text-blue-100/90 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Las últimas estrategias, guías y tendencias para transformar tu negocio con Inteligencia Artificial.
          </p>
        </div>

        {/* FEATURED CARDS OVERLAPPING */}
        <div className="max-w-7xl mx-auto px-6 -mt-4 mb-20 relative z-10">
          {error ? (
             <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl text-white text-center">
                Error cargando los artículos: {error.message}
             </div>
          ) : featuredPosts.length === 0 ? (
             <div className="p-12 bg-white/10 backdrop-blur-md rounded-2xl text-white text-center border border-white/20">
                Aún no hay artículos publicados.
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {featuredPosts.map((post, idx) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                  <div className="relative h-[420px] rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/20 bg-card border border-border/50 transition-transform duration-300 group-hover:-translate-y-2">
                    {/* Placeholder Background Image using Picsum based on slug */}
                    <div className="absolute inset-0 bg-neutral-800">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                         src={`https://picsum.photos/seed/${post.slug}-feature/800/600`} 
                         alt={post.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border border-white/10">
                          {idx === 0 ? 'IA & Tech' : 'Estrategia'}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight leading-tight line-clamp-2 font-sans">
                        {post.title}
                      </h2>
                      <p className="text-neutral-200 line-clamp-2 text-sm md:text-base mb-6 font-medium opacity-90">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-white/90 text-sm font-medium">
                         <div className="w-8 h-8 rounded-full bg-blue-500/50 border border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                           <Bot className="w-4 h-4 text-white" />
                         </div>
                         <span>Equipo FlujoXAI</span>
                         <span className="w-1 h-1 rounded-full bg-white/40" />
                         <time>{new Date(post.published_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ALL ARTICLES SECTION */}
      <div className="max-w-7xl mx-auto px-6 pb-24 w-full relative z-10">
        {regularPosts.length > 0 ? (
          <>
            <div className="flex flex-col items-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black font-sans mb-8">Todos los Artículos</h3>
              
              {/* Category Pills (Visual UI placeholder like in Dribbble) */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Todos', 'Chatbots', 'Automatización', 'CRM', 'Tendencias'].map((cat, i) => (
                  <button key={cat} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-border/50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-card rounded-[24px] border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Card Image Placeholder */}
                  <div className="h-[220px] overflow-hidden bg-muted relative">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={`https://picsum.photos/seed/${post.slug}-regular/600/400`}
                       alt={post.title}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[11px] font-black text-primary uppercase tracking-widest mb-3 block">
                      Automatización
                    </span>
                    <h4 className="text-xl font-black tracking-tight mb-3 leading-tight group-hover:text-primary transition-colors font-sans">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3 text-sm mb-6 flex-1 font-medium leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground font-bold pt-5 border-t border-border/50">
                       <time>{new Date(post.published_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                       <span className="w-1 h-1 rounded-full bg-border" />
                       <span className="flex items-center gap-1">5 min lectura</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center pb-12">
             <p className="text-muted-foreground text-lg">Pronto publicaremos más artículos. ¡Mantente atento!</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
