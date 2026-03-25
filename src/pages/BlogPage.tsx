import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog_posts_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <SEOHead
        title="Blog | Dicas de Desentupimento e Manutenção"
        description="Confira dicas, novidades e artigos sobre desentupimento, manutenção hidráulica e cuidados com encanamentos."
      />
      <Header />
      <FloatingCTA />

      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <span>Blog</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Blog</h1>
          <p className="mt-2 opacity-90">Dicas, novidades e artigos sobre desentupimento e manutenção.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum artigo publicado ainda.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                  {post.featured_image && (
                    <img src={post.featured_image} alt={post.title} className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
                  )}
                  <div className="p-5">
                    {post.category && (
                      <span className="mb-2 inline-block rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">{post.category}</span>
                    )}
                    <h2 className="mb-2 font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">{post.title}</h2>
                    {post.summary && <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{post.summary}</p>}
                    {post.published_at && (
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
