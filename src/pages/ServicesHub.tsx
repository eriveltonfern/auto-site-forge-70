import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { services } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/data/siteData";
import { MessageCircle } from "lucide-react";

export default function ServicesHub() {
  return (
    <>
      <SEOHead
        title="Serviços de Desentupimento em Goiânia | Todos os Serviços"
        description="Conheça todos os nossos serviços de desentupimento em Goiânia. Pia, vaso, esgoto, ralo, caixa de gordura e limpa fossa. Atendimento 24h."
        canonical="https://desentupidoras.goiania.br/servicos"
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
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((s) => (
              <Link
                key={s.slug}
                to={`/servicos/${s.slug}`}
                className="group flex gap-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <span className="text-4xl">{s.icon}</span>
                <div className="flex-1">
                  <h2 className="mb-1 font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors">{s.name}</h2>
                  <p className="mb-3 text-sm text-muted-foreground">{s.shortDescription}</p>
                  <ul className="space-y-1">
                    {s.problems.slice(0, 3).map((p, i) => (
                      <li key={i} className="text-xs text-muted-foreground">✓ {p}</li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="cta" size="lg" asChild>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
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
