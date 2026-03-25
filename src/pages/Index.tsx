import { Link } from "react-router-dom";
import { Phone, MessageCircle, CheckCircle, Shield, Clock, Star, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEOHead, getLocalBusinessSchema, getFAQSchema } from "@/components/SEOHead";
import { useSiteSettings, useServices, useCitiesWithNeighborhoodCount, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { ServiceCard } from "@/components/ServiceCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useState } from "react";

const homeFaq = [
  { question: "Vocês atendem 24 horas?", answer: "Sim! Nosso atendimento funciona 24 horas por dia, 7 dias por semana, incluindo feriados." },
  { question: "Qual o tempo de chegada?", answer: "Em média, nossa equipe chega em 20 a 40 minutos após o chamado, dependendo da localização." },
  { question: "O orçamento é gratuito?", answer: "Sim, fazemos orçamento gratuito e sem compromisso pelo WhatsApp ou telefone." },
  { question: "Vocês emitem nota fiscal?", answer: "Sim, emitimos nota fiscal para todos os serviços realizados." },
  { question: "Atendem condomínios e empresas?", answer: "Sim, atendemos residências, condomínios, comércios e indústrias." },
];

const differentials = [
  { icon: Clock, title: "Atendimento 24h", desc: "Disponíveis a qualquer hora, inclusive feriados" },
  { icon: Shield, title: "Garantia no Serviço", desc: "Todos os serviços com garantia por escrito" },
  { icon: Star, title: "Equipe Especializada", desc: "Técnicos treinados e equipamentos modernos" },
  { icon: CheckCircle, title: "Sem Quebra-Quebra", desc: "Métodos modernos que preservam sua estrutura" },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();
  const { data: citiesData } = useCitiesWithNeighborhoodCount();

  if (!settings) return null;

  return (
    <>
      <SEOHead
        title="Desentupidora em Goiânia | Atendimento 24h - Rápido e Profissional"
        description="Desentupidora em Goiânia com atendimento 24 horas. Desentupimento de pia, vaso, esgoto, ralo e caixa de gordura. Orçamento grátis pelo WhatsApp."
        structuredData={getLocalBusinessSchema()}
      />
      <Header />
      <FloatingCTA />

      {/* HERO */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-black leading-tight md:text-5xl lg:text-6xl"
            >
              Desentupidora em Goiânia
              <span className="block text-gradient">Atendimento 24 Horas</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 text-lg opacity-90 md:text-xl"
            >
              Resolvemos qualquer entupimento com rapidez e garantia. Orçamento grátis e sem compromisso!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button variant="hero" size="lg" asChild className="w-full sm:w-auto px-8 py-6 text-lg">
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild
                className="w-full sm:w-auto border-primary-foreground/40 px-8 py-6 text-lg text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href={getPhoneUrl(settings)}>
                  <Phone className="h-5 w-5" /> {settings.phone}
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground md:text-3xl">
            Por que escolher a <span className="text-accent">{settings.company_name}</span>?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <d.icon className="mx-auto mb-3 h-10 w-10 text-accent" />
                <h3 className="mb-1 font-display text-lg font-bold text-foreground">{d.title}</h3>
                <p className="text-sm text-muted-foreground">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      {services && services.length > 0 && (
        <section className="section-alt py-16">
          <div className="container">
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">Nossos Serviços</h2>
            <p className="mb-10 text-center text-muted-foreground">Soluções completas para todo tipo de entupimento</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ServiceCard
                    service={s}
                    whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()}. Podem me ajudar?`)}
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="cta" size="lg" asChild>
                <Link to="/servicos">Ver Todos os Serviços</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* PROVAS SOCIAIS */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground md:text-3xl">O que nossos clientes dizem</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Maria Silva", loc: "Setor Bueno", text: "Chamei de madrugada e atenderam rápido. Em 30 minutos já estavam aqui. Serviço excelente!" },
              { name: "Carlos Santos", loc: "Jardim Goiás", text: "Preço justo e profissionalismo. Resolveram o entupimento do esgoto sem quebrar nada." },
              { name: "Ana Oliveira", loc: "Setor Marista", text: "Já é a terceira vez que chamo. Sempre atendem rápido e com qualidade. Super recomendo!" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-3 flex text-accent">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mb-4 text-sm text-muted-foreground italic">"{t.text}"</p>
                <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.loc}, Goiânia</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS ATENDIDAS */}
      {citiesData && citiesData.length > 0 && (
        <section className="section-alt py-16">
          <div className="container">
            <h2 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">Áreas Atendidas</h2>
            <p className="mb-10 text-center text-muted-foreground">Cobertura em toda Goiânia e região metropolitana</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {citiesData.map((c: any) => (
                <Link
                  key={c.slug}
                  to={`/${c.slug}`}
                  className="group flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-accent"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                    {c.neighborhoodCount}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-foreground group-hover:text-accent transition-colors">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.neighborhoodCount} bairros atendidos</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground md:text-3xl">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {homeFaq.map((faq, i) => (
              <div key={i} className="rounded-lg border bg-card shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left font-display font-semibold text-foreground"
                >
                  {faq.question}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="border-t px-4 py-3 text-sm text-muted-foreground">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="hero-bg py-16">
        <div className="container text-center text-primary-foreground">
          <h2 className="mb-4 text-2xl font-black md:text-4xl">Precisa de uma Desentupidora Agora?</h2>
          <p className="mb-8 text-lg opacity-90">Fale conosco e resolva seu problema em minutos!</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto px-8 py-6 text-lg">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild
              className="w-full sm:w-auto border-primary-foreground/40 px-8 py-6 text-lg text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <a href={getPhoneUrl(settings)}>
                <Phone className="h-5 w-5" /> Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <SEOHead title="" description="" structuredData={getFAQSchema(homeFaq)} />
    </>
  );
}
