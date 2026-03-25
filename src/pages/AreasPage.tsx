import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AreasPage() {
  const { data: settings } = useSiteSettings();

  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities_with_neighborhoods"],
    queryFn: async () => {
      const { data: citiesData, error: citiesError } = await supabase
        .from("cities")
        .select("*")
        .eq("status", "published")
        .order("name");
      if (citiesError) throw citiesError;

      const { data: neighborhoods, error: nError } = await supabase
        .from("neighborhoods")
        .select("id, name, slug, city_id")
        .eq("status", "published")
        .order("name");
      if (nError) throw nError;

      return (citiesData || []).map((city) => ({
        ...city,
        neighborhoods: (neighborhoods || []).filter((n) => n.city_id === city.id),
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading || !settings) return null;

  const totalNeighborhoods = cities?.reduce((sum, c) => sum + c.neighborhoods.length, 0) || 0;

  return (
    <>
      <SEOHead
        title="Áreas Atendidas | Desentupidora em Goiânia e Região"
        description="Confira todas as cidades e setores atendidos pela nossa equipe de desentupimento. Atendimento rápido 24h em Goiânia e região metropolitana."
        canonical="https://desentupidoras.goiania.br/areas-atendidas"
      />
      <Header />
      <FloatingCTA />

      {/* Hero */}
      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <span>Áreas Atendidas</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl lg:text-5xl">
            Áreas Atendidas
          </h1>
          <p className="mt-3 max-w-2xl opacity-90">
            Atendemos {cities?.length || 0} cidades e {totalNeighborhoods} setores com rapidez e qualidade. Encontre sua localidade abaixo.
          </p>
        </div>
      </section>

      {/* Cities listing */}
      <section className="py-12">
        <div className="container space-y-10">
          {cities && cities.length > 0 ? (
            cities.map((city, idx) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border bg-card shadow-sm overflow-hidden"
              >
                {/* City header */}
                <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-accent shrink-0" />
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{city.name}</h2>
                      <span className="text-xs text-muted-foreground">
                        {city.neighborhoods.length} {city.neighborhoods.length === 1 ? "setor" : "setores"} cadastrados
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/${city.slug}`}
                    className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors"
                  >
                    Ver cidade <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Neighborhoods grid */}
                {city.neighborhoods.length > 0 ? (
                  <div className="grid gap-2 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {city.neighborhoods.map((n) => (
                      <Link
                        key={n.id}
                        to={`/${city.slug}/${n.slug}`}
                        className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors"
                      >
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                        {n.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">Nenhum setor cadastrado ainda.</p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">Nenhuma cidade cadastrada ainda.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Não encontrou sua região?</h2>
          <p className="mb-6 text-muted-foreground max-w-lg mx-auto">
            Entre em contato conosco e verifique a disponibilidade de atendimento na sua localidade.
          </p>
          <Button variant="cta" size="lg" asChild>
            <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Falar no WhatsApp
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
