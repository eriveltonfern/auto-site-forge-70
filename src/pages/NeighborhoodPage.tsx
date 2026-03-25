import { useParams, Link } from "react-router-dom";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useNeighborhoodBySlug, useServices, useSiteSettings, getWhatsAppUrl, getPhoneUrl, generateNeighborhoodContent } from "@/hooks/useSiteData";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Clock, CheckCircle } from "lucide-react";
import NotFound from "./NotFound";

export default function NeighborhoodPage() {
  const { neighborhoodSlug } = useParams();
  const { data: result, isLoading } = useNeighborhoodBySlug(neighborhoodSlug || "");
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  if (isLoading || !settings) return null;
  if (!result) return <NotFound />;

  const neighborhood = result;
  const city = result.cities;

  const seo = {
    title: neighborhood.seo_title || generateNeighborhoodContent(neighborhood.name, city.name).title,
    metaDescription: neighborhood.meta_description || generateNeighborhoodContent(neighborhood.name, city.name).metaDescription,
    h1: neighborhood.h1 || generateNeighborhoodContent(neighborhood.name, city.name).h1,
    intro: neighborhood.base_content || generateNeighborhoodContent(neighborhood.name, city.name).intro,
    responseTime: generateNeighborhoodContent(neighborhood.name, city.name).responseTime,
  };

  const faqs = [
    { question: `Vocês atendem o ${neighborhood.name}?`, answer: `Sim! Temos equipes disponíveis para atendimento imediato no ${neighborhood.name}, ${city.name}.` },
    { question: `Quanto tempo para chegar no ${neighborhood.name}?`, answer: seo.responseTime },
    { question: `Qual o preço do desentupimento no ${neighborhood.name}?`, answer: `O valor varia conforme o serviço. Fazemos orçamento gratuito e sem compromisso pelo WhatsApp.` },
  ];

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.metaDescription}
        canonical={`https://desentupidoras.goiania.br/${city.slug}/${neighborhood.slug}`}
        structuredData={getFAQSchema(faqs)}
      />
      <Header />
      <FloatingCTA />

      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <Link to={`/${city.slug}`} className="hover:underline">{city.name}</Link> {" > "}
            <span>{neighborhood.name}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{seo.h1}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm opacity-90">
            <Clock className="h-4 w-4" /> {seo.responseTime}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <a href={getWhatsAppUrl(settings, `Olá! Preciso de desentupimento no ${neighborhood.name}, ${city.name}.`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a href={getPhoneUrl(settings)}>
                <Phone className="h-5 w-5" /> Ligar
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="mb-3 text-xl font-bold text-foreground">Desentupidora no {neighborhood.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{seo.intro}</p>
            </div>

            {services && services.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-foreground">Serviços mais solicitados no {neighborhood.name}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <Link key={s.slug} to={`/servicos/${s.slug}`}
                      className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm hover:border-accent">
                      <span className="text-2xl">{s.icon || "🔧"}</span>
                      <span className="font-display text-sm font-bold text-foreground">{s.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
                    <h3 className="mb-2 font-display text-sm font-bold text-foreground">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link to={`/${city.slug}`} className="text-sm font-medium text-accent hover:underline">
                ← Ver todos os bairros de {city.name}
              </Link>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-xl border bg-card p-6 shadow-sm text-center">
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">Atendimento no {neighborhood.name}</h3>
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-accent">
                <Clock className="h-4 w-4" /> {seo.responseTime}
              </div>
              <div className="flex flex-col gap-3">
                <Button variant="whatsapp" size="lg" asChild className="w-full">
                  <a href={getWhatsAppUrl(settings, `Preciso de desentupimento no ${neighborhood.name}, ${city.name}.`)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </a>
                </Button>
                <Button variant="default" size="lg" asChild className="w-full">
                  <a href={getPhoneUrl(settings)}>
                    <Phone className="h-5 w-5" /> Ligar
                  </a>
                </Button>
              </div>
              <div className="mt-4 space-y-2 text-left text-xs text-muted-foreground">
                {["Orçamento grátis", "Sem taxa de visita", "Atendimento 24h", "Garantia no serviço"].map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-accent" /> {d}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
