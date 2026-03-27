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
        title="Áreas Atendidas | Desentupidora em Goiânia - Todos os Bairros"
        description="Confira todos os bairros e setores atendidos pela nossa equipe de desentupimento em Goiânia. Atendimento rápido 24h."
        canonical="https://desentupidoras.goiania.br/areas-atendidas"
      />
      <Header />
      <FloatingCTA />

      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-[url('https://desentupidoras.goiania.br/wp-content/uploads/2025/07/fundo-desentupidora-1-scaled.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center text-white">
            <nav className="mb-4 text-sm opacity-70">
              <Link to="/" className="hover:underline">Início</Link>
              <span className="mx-2">»</span>
              <span>Onde Atendemos</span>
            </nav>
            <h1 className="text-3xl font-black md:text-5xl">
              Onde Atendemos em Goiânia
            </h1>
            <p className="mt-3 opacity-90">
              Atendemos {neighborhoods?.length || 0} bairros e setores em Goiânia com rapidez e qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Neighborhoods listing */}
      <section className="py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-8 max-w-3xl text-center"
          >
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-3xl">
              Bairros e Setores Atendidos
            </h2>
            <p className="text-muted-foreground">
              Clique no nome do seu bairro para mais informações sobre nosso atendimento na sua região.
            </p>
          </motion.div>

          {neighborhoods && neighborhoods.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {neighborhoods.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.01 }}
                >
                  <Link
                    to={`/${n.slug}`}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {n.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum bairro cadastrado ainda.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-14">
        <div className="container text-center text-primary-foreground">
          <h2 className="text-2xl font-bold mb-3">Não encontrou sua região?</h2>
          <p className="mb-6 opacity-90 max-w-lg mx-auto">
            Entre em contato conosco e verifique a disponibilidade de atendimento na sua localidade.
          </p>
          <Button variant="whatsapp" size="lg" asChild className="px-8 rounded-full">
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
