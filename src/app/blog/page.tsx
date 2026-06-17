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
        {/* Background Gradient Header - Dribbble style proportion */}
        <div className="absolute top-0 left-0 w-full h-[450px] md:h-[480px] bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] rounded-b-[40px] md:rounded-b-[80px] -z-10 overflow-hidden">
          {/* Decorative subtle shapes */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        </div>
        
        {/* Centered Text exactly like Dribbble */}
        <div className="pt-32 md:pt-40 pb-[120px] px-6 max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Insights & <span className="font-light italic opacity-90" style={{ fontFamily: 'var(--font-playfair)' }}>Automatización</span>
          </h1>
          <p className="text-blue-50/90 text-sm md:text-base font-medium">
            Las últimas estrategias, guías y tendencias para transformar tu negocio con Inteligencia Artificial.
          </p>
        </div>

        {/* FEATURED CARDS OVERLAPPING - Exactly 50% overlap */}
        <div className="max-w-[1100px] mx-auto px-6 -mt-[140px] md:-mt-[160px] mb-20 relative z-10">
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
                  <div className="relative h-[340px] md:h-[380px] rounded-[32px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-card transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:-translate-y-2">
                    {/* Background Image */}
                    <div className="absolute inset-0 bg-neutral-800">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                         src={`https://picsum.photos/seed/${post.slug}-feature/800/600`} 
                         alt={post.title}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                       {/* Dark gradient for text readability like Dribbble */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                    </div>
                    
                    {/* Content inside the card */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                      <h2 className="text-2xl md:text-3xl font-sans font-bold text-white mb-3 tracking-tight leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-neutral-200/90 line-clamp-2 text-sm mb-6 font-medium">
                        {post.excerpt}
                      </p>
                      
                      {/* Footer of the card: Author on left, Category Pill on right */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2.5 text-white/90 text-xs font-semibold">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Bot className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span>Equipo FlujoXAI</span>
                          <span className="w-1 h-1 rounded-full bg-white/40 mx-1" />
                          <time>{new Date(post.published_at).toLocaleDateString('es-DO', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                        </div>
                        
                        {/* Dribbble style category pill at bottom right */}
                        <div className="bg-white text-black px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide">
                          {idx === 0 ? 'IA & Tech' : 'Estrategia'}
                        </div>
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
      <div className="max-w-[1100px] mx-auto px-6 pb-24 w-full relative z-10">
        {regularPosts.length > 0 ? (
          <>
            <div className="flex flex-col items-center mb-12">
              <h3 className="text-3xl md:text-[32px] font-sans font-bold text-foreground mb-8">Todos los Artículos</h3>
              
              {/* Clean Dribbble Style Category Nav */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10">
                {['Todos', 'Chatbots', 'Automatización', 'CRM', 'Tendencias'].map((cat, i) => (
                  <button 
                    key={cat} 
                    className={`text-sm font-semibold transition-all ${
                      i === 0 
                        ? 'bg-blue-600 text-white px-5 py-2 rounded-full shadow-md' 
                        : 'text-muted-foreground hover:text-foreground py-2'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {regularPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-card rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                  {/* Card Image Placeholder */}
                  <div className="h-[200px] overflow-hidden bg-muted relative rounded-[24px] m-2 mb-0">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img 
                       src={`https://picsum.photos/seed/${post.slug}-regular/600/400`}
                       alt={post.title}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-3 block">
                      Automatización
                    </span>
                    <h4 className="text-[22px] font-bold tracking-tight mb-3 leading-snug group-hover:text-blue-600 transition-colors font-sans">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-2 text-[14px] mb-6 flex-1 font-medium leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
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
