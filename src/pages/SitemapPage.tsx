import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { SEOHead } from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/useSiteData";

interface SitemapSection {
  title: string;
  links: { label: string; url: string }[];
}

export default function SitemapPage() {
  const { data: settings } = useSiteSettings();
  const [sections, setSections] = useState<SitemapSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [servicesRes, citiesRes, neighborhoodsRes, blogRes, pagesRes] = await Promise.all([
        supabase.from("services").select("name, slug").eq("status", "published").order("sort_order"),
        supabase.from("cities").select("name, slug").eq("status", "published").order("name"),
        supabase.from("neighborhoods").select("name, slug").eq("status", "published").order("name"),
        supabase.from("blog_posts").select("title, slug").eq("status", "published").order("published_at", { ascending: false }),
        supabase.from("pages").select("title, slug").eq("status", "published").order("title"),
      ]);

      const services = servicesRes.data || [];
      const cities = citiesRes.data || [];
      const neighborhoods = neighborhoodsRes.data || [];
      const blog = blogRes.data || [];
      const pages = pagesRes.data || [];

      const result: SitemapSection[] = [
        {
          title: "Páginas Principais",
          links: [
            { label: "Início", url: "/" },
            { label: "Serviços", url: "/servicos" },
            { label: "Áreas Atendidas", url: "/areas-atendidas" },
            { label: "Blog", url: "/blog" },
            { label: "Sobre", url: "/sobre" },
            { label: "Contato", url: "/contato" },
          ],
        },
      ];

      if (services.length > 0) {
        result.push({
          title: "Serviços",
          links: services.map((s) => ({ label: s.name, url: `/servicos/${s.slug}` })),
        });
      }

      if (cities.length > 0) {
        result.push({
          title: "Cidades Atendidas",
          links: cities.map((c) => ({ label: c.name, url: `/${c.slug}` })),
        });
      }

      if (neighborhoods.length > 0) {
        result.push({
          title: "Setores / Bairros",
          links: neighborhoods.map((n) => ({ label: n.name, url: `/${n.slug}` })),
        });
      }

      if (blog.length > 0) {
        result.push({
          title: "Blog",
          links: blog.map((p) => ({ label: p.title, url: `/blog/${p.slug}` })),
        });
      }

      if (pages.length > 0) {
        result.push({
          title: "Páginas",
          links: pages.map((p) => ({ label: p.title, url: `/${p.slug}` })),
        });
      }

      // Service + Neighborhood combos
      if (services.length > 0 && neighborhoods.length > 0) {
        const combos: { label: string; url: string }[] = [];
        for (const s of services) {
          for (const n of neighborhoods) {
            combos.push({
              label: `${s.name} - ${n.name}`,
              url: `/${s.slug}-${n.slug}`,
            });
          }
        }
        result.push({ title: "Serviços por Setor", links: combos });
      }

      setSections(result);
      setLoading(false);
    }
    load();
  }, []);

  const companyName = settings?.company_name || "Desentupidora Goiânia";

  return (
    <>
      <SEOHead
        title={`Mapa do Site - ${companyName}`}
        description={`Mapa completo do site ${companyName}. Encontre todos os serviços, áreas atendidas, posts do blog e páginas.`}
        canonicalUrl="/sitemap"
      />
      <Header />

      <main className="min-h-screen bg-background pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
            Mapa do Site
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => (
                <div key={section.title} className="bg-card rounded-lg border border-border p-5">
                  <h2 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">
                    {section.title}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({section.links.length})
                    </span>
                  </h2>
                  <ul className="space-y-1 max-h-[400px] overflow-y-auto">
                    {section.links.map((link) => (
                      <li key={link.url}>
                        <Link
                          to={link.url}
                          className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingCTA />
    </>
  );
}
