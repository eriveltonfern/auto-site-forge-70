import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Phone } from "lucide-react";

export default function AreasPage() {
  const { data: settings } = useSiteSettings();

  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ["all_neighborhoods_areas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("id, name, slug")
        .eq("status", "published")
        .order("name");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading || !settings) return null;

  return (
    <>
      <SEOHead
        title="Onde Atendemos em Goiânia-GO | Desentupidora 24h"
        description="Confira todos os bairros e setores atendidos pela nossa equipe de desentupimento em Goiânia. Atendimento rápido 24h."
        canonical="https://desentupidoras.goiania.br/onde-atendemos"
      />
      <Header />
      <FloatingCTA />

      {/* Content — clean, no hero, reference style */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-6 text-3xl font-black text-foreground md:text-4xl">
            Onde Atendemos em Goiânia-GO
          </h1>

          <p className="mb-4 text-muted-foreground leading-relaxed">
            Se você está procurando por "<strong className="text-foreground"><Link to="/" className="text-accent underline">desentupidora perto de mim</Link></strong>" em Goiânia-GO, atendemos os principais bairros da cidade.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Estamos comprometidos em levar nossos serviços de desentupimento com qualidade e agilidade para diversas regiões.
          </p>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Não importa onde você esteja localizado na cidade, a <strong className="text-foreground">{settings.company_name}</strong> está pronta para oferecer atendimento personalizado de acordo com sua necessidade — seja em casos de urgência ou manutenção preventiva.
          </p>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Entre em contato agora mesmo pelo atendimento telefônico{" "}
            <a href={getPhoneUrl(settings)} className="font-bold text-foreground hover:text-accent transition-colors">
              {settings.phone}
            </a>.
          </p>

          <hr className="mb-10 border-border" />

          {/* Neighborhood cards grid */}
          {neighborhoods && neighborhoods.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {neighborhoods.map((n) => (
                <div key={n.id} className="border-b border-border pb-6">
                  <Link to={`/${n.slug}`} className="group">
                    <h2 className="mb-2 text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                      Desentupidora 24h na {n.name} | Empresa de Desentupimento em Goiânia
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Precisando de Desentupidora 24h na {n.name}? Problemas com esgoto ou entupimento? Solicite desentupimento urgente na {n.name} com atendimento imediato.
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum bairro cadastrado ainda.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
