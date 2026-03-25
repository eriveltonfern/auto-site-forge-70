import { useParams, Link } from "react-router-dom";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useServiceBySlug, useCities, useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import NotFound from "./NotFound";

export default function ServicePage() {
  const { serviceSlug } = useParams();
  const { data: service, isLoading } = useServiceBySlug(serviceSlug || "");
  const { data: cities } = useCities();
  const { data: settings } = useSiteSettings();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (isLoading || !settings) return null;
  if (!service) return <NotFound />;

  const seoTitle = service.seo_title || `${service.name} em Goiânia | Atendimento 24h`;
  const seoDesc = service.meta_description || `Serviço profissional de ${service.name.toLowerCase()} em Goiânia e região. Atendimento 24 horas com garantia.`;
  const faq = (service.faq as { question: string; answer: string }[]) || [];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://desentupidoras.goiania.br/servicos/${service.slug}`}
        structuredData={getFAQSchema(faq)}
      />
      <Header />
      <FloatingCTA />

      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <Link to="/servicos" className="hover:underline">Serviços</Link> {" > "}
            <span>{service.name}</span>
          </nav>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {(service as any).cover_image && (
              <img
                src={(service as any).cover_image}
                alt={service.name}
                className="h-40 w-full rounded-xl object-cover md:h-48 md:w-72"
              />
            )}
            <div>
              <h1 className="text-3xl font-black md:text-4xl">{service.h1 || service.name}</h1>
              <p className="mt-2 opacity-90">{service.short_description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {service.long_description && (
              <div>
                <h2 className="mb-3 text-xl font-bold text-foreground">Sobre o serviço</h2>
                <p className="text-muted-foreground leading-relaxed">{service.long_description}</p>
              </div>
            )}

            {service.problems && service.problems.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-bold text-foreground">Problemas comuns</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {service.problems.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-bold text-foreground">Benefícios</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {faq.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-foreground">Perguntas Frequentes</h2>
                <div className="space-y-3">
                  {faq.map((f, i) => (
                    <div key={i} className="rounded-lg border bg-card shadow-sm">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between p-4 text-left font-display text-sm font-semibold text-foreground"
                      >
                        {f.question}
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaq === i && (
                        <div className="border-t px-4 py-3 text-sm text-muted-foreground">{f.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cities && cities.length > 0 && (
              <div>
                <h2 className="mb-3 text-xl font-bold text-foreground">{service.name} nas cidades</h2>
                <div className="flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <Link key={c.slug} to={`/${c.slug}`}
                      className="rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground hover:text-accent hover:border-accent transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="sticky top-28 space-y-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                <span className="mb-3 block text-5xl">{service.icon || "🔧"}</span>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Precisa desse serviço?</h3>
                <p className="mb-4 text-sm text-muted-foreground">Orçamento grátis e sem compromisso</p>
                <div className="flex flex-col gap-3">
                  <Button variant="whatsapp" size="lg" asChild className="w-full">
                    <a href={getWhatsAppUrl(settings, `Olá! Preciso de ${service.name.toLowerCase()}. Podem me ajudar?`)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" /> WhatsApp
                    </a>
                  </Button>
                  <Button variant="default" size="lg" asChild className="w-full">
                    <a href={getPhoneUrl(settings)}>
                      <Phone className="h-5 w-5" /> Ligar Agora
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
