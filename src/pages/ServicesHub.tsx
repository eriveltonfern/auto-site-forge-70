import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useServices, useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ServicesHub() {
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  if (!settings) return null;

  return (
    <>
      <SEOHead
        title="Serviços de Desentupimento em Goiânia | Todos os Serviços"
        description="Conheça todos os nossos serviços de desentupimento em Goiânia. Pia, vaso, esgoto, ralo, caixa de gordura e limpa fossa. Atendimento 24h."
        canonical="https://www.desentupidoraemgoiania24h.com.br/servicos"
      />
      <Header />
      <FloatingCTA />

      <section className="hero-bg py-12">
        <div className="container text-center text-primary-foreground">
          <h1 className="text-3xl font-black md:text-4xl">Nossos Serviços</h1>
          <p className="mt-2 text-lg opacity-90">Soluções profissionais para todo tipo de entupimento</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(services || []).map((s) => (
              <ServiceCard
                key={s.slug}
                service={s}
                whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()}. Podem me ajudar?`)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="cta" size="lg" asChild>
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Solicitar Orçamento Grátis
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}