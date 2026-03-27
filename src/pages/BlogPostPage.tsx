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
import { MessageCircle } from "lucide-react";
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
        .limit(4);
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

      {/* Article — reference style: breadcrumb, clean title, content */}
      <article className="py-10 md:py-16">
        <div className="container mx-auto max-w-3xl">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            <span className="mx-2">»</span>
            <Link to="/blog" className="hover:text-accent transition-colors">Blog</Link>
            <span className="mx-2">»</span>
            <span className="text-foreground">{post.title}</span>
          </nav>

          {/* Title */}
          <h1 className="mb-8 text-2xl font-black leading-tight text-foreground md:text-4xl">
            {post.title}
          </h1>

          {/* Featured image */}
          {post.featured_image && !post.content?.includes(post.featured_image) && (
            <figure className="mb-8">
              <OptimizedImage
                src={post.featured_image}
                alt={post.title}
                className="w-full rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </figure>
          )}

          {/* Content */}
          {post.content && (
            <div className="space-y-5">
              {post.content.split("\n").map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return <br key={i} className="block h-2" />;
                if (trimmed.startsWith("### ")) return <h3 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">{trimmed.slice(4)}</h3>;
                if (trimmed.startsWith("## ")) return <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-foreground">{trimmed.slice(3)}</h2>;
                if (trimmed.startsWith("# ")) return <h2 key={i} className="mt-10 mb-4 text-3xl font-bold text-foreground">{trimmed.slice(2)}</h2>;
                if (trimmed.startsWith("![")) {
                  const match = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                  if (match) {
                    return (
                      <figure key={i} className="my-8">
                        <OptimizedImage src={match[2]} alt={match[1]} className="w-full rounded-lg object-cover" sizes="(max-width: 768px) 100vw, 768px" />
                      </figure>
                    );
                  }
                }
                if (trimmed.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-muted-foreground leading-relaxed">{trimmed.slice(2)}</li>;
                return <p key={i} className="text-muted-foreground leading-relaxed text-base">{trimmed}</p>;
              })}
            </div>
          )}

          {/* CTA */}
          <div className="my-12 rounded-xl hero-bg p-8 text-center text-primary-foreground">
            <h3 className="mb-2 font-display text-xl font-bold">Precisa de ajuda profissional?</h3>
            <p className="mb-4 opacity-90">Entre em contato agora mesmo e resolva seu problema com rapidez e garantia.</p>
            <Button variant="whatsapp" size="lg" asChild className="px-8 rounded-full">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-black text-foreground">Posts relacionados</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                    {rp.featured_image && (
                      <OptimizedImage src={rp.featured_image} alt={rp.title} className="h-48 w-full object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                    )}
                    <div className="p-4">
                      <h4 className="font-display font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {rp.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}
