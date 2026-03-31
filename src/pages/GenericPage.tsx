import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Page = Tables<"pages">;

export default function GenericPage({ page }: { page: Page }) {
  const { data: settings } = useSiteSettings();

  if (!settings) return null;

  const seoTitle = page.seo_title || page.title;
  const seoDesc = page.meta_description || "";
  const whatsappUrl = getWhatsAppUrl(settings);

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://www.desentupidoraemgoiania24h.com.br/${page.slug}`}
      />
      <Header />
      <FloatingCTA />

      <article className="py-10 md:py-16">
        <div className="container mx-auto max-w-3xl">
          <h1 className="mb-8 text-2xl font-black leading-tight text-foreground md:text-4xl">
            {page.h1 || page.title}
          </h1>

          {page.featured_image && (
            <figure className="mb-8">
              <OptimizedImage
                src={page.featured_image}
                alt={page.title}
                className="w-full rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </figure>
          )}

          {page.content && (
            <div className="space-y-5">
              {page.content.split("\n").map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return <br key={i} className="block h-2" />;
                if (trimmed.startsWith("### ")) return <h3 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">{trimmed.slice(4)}</h3>;
                if (trimmed.startsWith("## ")) return <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-foreground">{trimmed.slice(3)}</h2>;
                if (trimmed.startsWith("# ")) return <h2 key={i} className="mt-10 mb-4 text-3xl font-bold text-foreground">{trimmed.slice(2)}</h2>;
                if (trimmed.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-muted-foreground leading-relaxed">{trimmed.slice(2)}</li>;
                return <p key={i} className="text-muted-foreground leading-relaxed text-base">{trimmed}</p>;
              })}
            </div>
          )}

          <div className="my-12 rounded-xl hero-bg p-8 text-center text-primary-foreground">
            <h3 className="mb-2 font-display text-xl font-bold">Precisa de ajuda profissional?</h3>
            <p className="mb-4 opacity-90">Entre em contato agora mesmo e resolva seu problema com rapidez e garantia.</p>
            <Button variant="whatsapp" size="lg" asChild className="px-8 rounded-full">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
