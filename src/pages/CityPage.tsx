import { useParams, Link } from "react-router-dom";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { getCityBySlug, generateCityContent, getWhatsAppUrl, getPhoneUrl, services, SITE_CONFIG } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, MapPin, CheckCircle } from "lucide-react";
import NotFound from "./NotFound";

const cityFaq = (city: string) => [
  { question: `Vocês atendem em ${city}?`, answer: `Sim! Temos equipes disponíveis em ${city} e em todos os bairros da cidade.` },
  { question: `Qual o tempo de atendimento em ${city}?`, answer: `Em média, chegamos em 20 a 40 minutos na região de ${city}.` },
  { question: `Quanto custa o desentupimento em ${city}?`, answer: `O valor depende do tipo de serviço. Fazemos orçamento gratuito pelo WhatsApp.` },
];

export default function CityPage() {
  const { citySlug } = useParams();
  const city = getCityBySlug(citySlug || "");

  if (!city) return <NotFound />;

  const seo = generateCityContent(city.name);
  const faqs = cityFaq(city.name);

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.metaDescription}
        canonical={`https://${SITE_CONFIG.domain}/${city.slug}`}
        structuredData={getFAQSchema(faqs)}
      />
      <Header />
      <FloatingCTA />

      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <span>{city.name}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">{seo.h1}</h1>
          <p className="mt-2 opacity-90">{seo.intro.slice(0, 120)}...</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <a href={getWhatsAppUrl(`Olá! Preciso de desentupimento em ${city.name}.`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a href={getPhoneUrl()}>
                <Phone className="h-5 w-5" /> Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="mb-3 text-xl font-bold text-foreground">Desentupidora em {city.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{seo.intro}</p>
              <p className="mt-3 text-muted-foreground leading-relaxed">{seo.whyUs}</p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">Serviços disponíveis em {city.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <Link key={s.slug} to={`/servicos/${s.slug}`}
                    className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm hover:border-accent">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">em {city.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">Bairros atendidos em {city.name}</h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {city.neighborhoods.map((n) => (
                  <Link key={n.slug} to={`/${city.slug}/${n.slug}`}
                    className="flex items-center gap-2 rounded-lg border bg-card p-3 transition-all hover:shadow-sm hover:border-accent">
                    <MapPin className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-foreground">{n.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes - {city.name}</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
                    <h3 className="mb-2 font-display text-sm font-bold text-foreground">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-28 rounded-xl border bg-card p-6 shadow-sm text-center">
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">Atendimento em {city.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">Equipe disponível 24h para {city.name} e região</p>
              <div className="flex flex-col gap-3">
                <Button variant="whatsapp" size="lg" asChild className="w-full">
                  <a href={getWhatsAppUrl(`Olá! Preciso de desentupimento em ${city.name}.`)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                  </a>
                </Button>
                <Button variant="default" size="lg" asChild className="w-full">
                  <a href={getPhoneUrl()}>
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
