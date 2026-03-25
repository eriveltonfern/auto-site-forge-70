import { useParams, Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Tag, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import NotFound from "./NotFound";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: settings } = useSiteSettings();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["blog_related", post?.category, post?.id],
    queryFn: async () => {
      let q = supabase
        .from("blog_posts")
        .select("id, title, slug, summary, featured_image, published_at, category")
        .eq("status", "published")
        .neq("id", post!.id)
        .order("published_at", { ascending: false })
        .limit(3);
      if (post?.category) q = q.eq("category", post.category);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: !!post?.id,
  });

  if (isLoading || !settings) return null;
  if (!post) return <NotFound />;

  const seoTitle = post.seo_title || `${post.title} | Blog`;
  const seoDesc = post.meta_description || post.summary || "";
  const readingTime = post.content ? Math.max(1, Math.round(post.content.split(/\s+/).length / 200)) : 1;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://desentupidoras.goiania.br/blog/${post.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: seoDesc,
          image: post.featured_image || undefined,
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at,
        }}
      />
      <Header />
      <FloatingCTA />

      {/* Hero */}
      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <Link to="/blog" className="hover:underline">Blog</Link> {" > "}
            <span className="line-clamp-1">{post.title}</span>
          </nav>
          <h1 className="text-2xl font-black leading-tight md:text-4xl lg:text-5xl max-w-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm opacity-80">
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {readingTime} min de leitura
            </span>
            {post.category && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" /> {post.category}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-8">
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-xl object-cover shadow-md"
                style={{ maxHeight: 480 }}
              />
            )}

            {post.content && (
              <div className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground space-y-4">
                {post.content.split("\n").map((paragraph, i) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return <br key={i} className="block h-2" />;
                  if (trimmed.startsWith("### ")) return <h3 key={i} className="mt-8 mb-3 text-lg font-bold text-foreground">{trimmed.slice(4)}</h3>;
                  if (trimmed.startsWith("## ")) return <h2 key={i} className="mt-10 mb-4 text-xl font-bold text-foreground">{trimmed.slice(3)}</h2>;
                  if (trimmed.startsWith("# ")) return <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-foreground">{trimmed.slice(2)}</h2>;
                  if (trimmed.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-muted-foreground leading-relaxed">{trimmed.slice(2)}</li>;
                  return <p key={i} className="text-muted-foreground leading-relaxed">{trimmed}</p>;
                })}
              </div>
            )}

            {/* CTA inline */}
            <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 text-center md:p-8">
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">Precisa de ajuda profissional?</h3>
              <p className="mb-4 text-muted-foreground">Entre em contato agora mesmo e resolva seu problema com rapidez e garantia.</p>
              <Button variant="cta" size="lg" asChild>
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Falar no WhatsApp
                </a>
              </Button>
            </div>

            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
              <ArrowLeft className="h-4 w-4" /> Voltar para o Blog
            </Link>
          </article>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-28 space-y-6">
              <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Precisa de ajuda?</h3>
                <p className="mb-4 text-sm text-muted-foreground">Orçamento grátis e sem compromisso</p>
                <Button variant="whatsapp" size="lg" asChild className="w-full">
                  <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </a>
                </Button>
              </div>

              {relatedPosts && relatedPosts.length > 0 && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="mb-4 font-display text-sm font-bold text-foreground">Artigos Relacionados</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.id} to={`/blog/${rp.slug}`} className="group block">
                        {rp.featured_image && (
                          <img src={rp.featured_image} alt={rp.title} className="mb-2 h-24 w-full rounded-lg object-cover" />
                        )}
                        <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {rp.title}
                        </h4>
                        {rp.published_at && (
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(rp.published_at), "dd/MM/yyyy")}
                          </time>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
