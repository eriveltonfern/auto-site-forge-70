import { useParams, Link } from "react-router-dom";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useNeighborhoodBySlug, useNeighborhoodsByCity, useServices, useSiteSettings, getWhatsAppUrl, getPhoneUrl, generateNeighborhoodContent } from "@/hooks/useSiteData";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, Phone, Clock, CheckCircle, Shield, DollarSign, Wrench, Lightbulb, Star, MapPin } from "lucide-react";
import NotFound from "./NotFound";

function generateNeighborhoodFaqs(name: string, cityName: string) {
  return [
    { question: `Vocês atendem o Setor ${name}?`, answer: `Sim! Temos equipes disponíveis para atendimento imediato no Setor ${name}, ${cityName}.` },
    { question: `Quanto tempo para chegar no Setor ${name}?`, answer: `Em média, nossa equipe chega em 20 a 40 minutos no Setor ${name}, dependendo do horário e condições de trânsito.` },
    { question: `Qual o preço do desentupimento no Setor ${name}?`, answer: `O valor varia conforme o serviço. Fazemos orçamento gratuito e sem compromisso pelo WhatsApp.` },
    { question: `Vocês trabalham aos finais de semana no Setor ${name}?`, answer: `Sim! Nosso atendimento no Setor ${name} funciona 24 horas, 7 dias por semana, incluindo feriados.` },
    { question: `Quais formas de pagamento são aceitas no Setor ${name}?`, answer: `Aceitamos dinheiro, PIX, cartão de débito e crédito. Parcelamos em até 12x no cartão.` },
    { question: `A desentupidora no Setor ${name} oferece garantia?`, answer: `Sim! Todos os nossos serviços possuem garantia por escrito. A garantia varia conforme o tipo de serviço realizado.` },
    { question: `Preciso estar presente durante o serviço no Setor ${name}?`, answer: `Idealmente sim, mas caso não possa, basta que alguém autorizado libere o acesso ao local.` },
    { question: `Vocês fazem orçamento gratuito no Setor ${name}?`, answer: `Sim! O orçamento é totalmente gratuito e sem compromisso. Basta entrar em contato pelo WhatsApp ou telefone.` },
  ];
}

export default function NeighborhoodPage() {
  const { neighborhoodSlug } = useParams();
  const { data: result, isLoading } = useNeighborhoodBySlug(neighborhoodSlug || "");
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();

  const neighborhood = result;
  const city = result?.cities;
  const cityId = city?.id;

  const { data: otherNeighborhoods } = useNeighborhoodsByCity(cityId);

  if (isLoading || !settings) return null;
  if (!result || !city) return <NotFound />;

  const seo = {
    title: neighborhood.seo_title || generateNeighborhoodContent(neighborhood.name, city.name).title,
    metaDescription: neighborhood.meta_description || generateNeighborhoodContent(neighborhood.name, city.name).metaDescription,
    h1: neighborhood.h1 || `Desentupidora no Setor ${neighborhood.name} em ${city.name}`,
    intro: neighborhood.base_content || generateNeighborhoodContent(neighborhood.name, city.name).intro,
  };

  const coverImage = (neighborhood as any).cover_image;
  const faqs = generateNeighborhoodFaqs(neighborhood.name, city.name);
  const whatsappUrl = getWhatsAppUrl(settings, `Olá! Preciso de desentupimento no Setor ${neighborhood.name}, ${city.name}.`);
  const siblings = otherNeighborhoods?.filter((n) => n.id !== neighborhood.id) || [];

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

      {/* Hero */}
      <section className="relative hero-bg py-16 md:py-20">
        {coverImage && (
          <div className="absolute inset-0">
            <img src={coverImage} alt={`Setor ${neighborhood.name}`} className="h-full w-full object-cover opacity-20" />
          </div>
        )}
        <div className="container relative text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <Link to={`/${city.slug}`} className="hover:underline">{city.name}</Link> {" > "}
            <span>Setor {neighborhood.name}</span>
          </nav>
          <h1 className="text-3xl font-black md:text-5xl">{seo.h1}</h1>
          <p className="mt-3 max-w-2xl text-lg opacity-90">{seo.intro.slice(0, 160)}...</p>
          <div className="mt-3 flex items-center gap-2 text-sm opacity-90">
            <Clock className="h-4 w-4" /> Tempo estimado de chegada: 20 a 40 minutos
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="hero" size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Solicitar Orçamento Grátis
              </a>
            </Button>
            <Button variant="hero-phone" size="lg" asChild>
              <a href={getPhoneUrl(settings)}>
                <Phone className="h-5 w-5" /> Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">

            {/* H2: Intro */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <Wrench className="h-6 w-6 text-accent" /> Desentupidora no Setor {neighborhood.name} em {city.name}
              </h2>
              {coverImage && (
                <img src={coverImage} alt={`Desentupidora no Setor ${neighborhood.name}`} className="mb-4 w-full rounded-xl object-cover max-h-80" loading="lazy" />
              )}
              <p className="text-muted-foreground leading-relaxed">{seo.intro}</p>
            </section>

            {/* H2: Como contratar */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <Phone className="h-6 w-6 text-accent" /> Como contratar uma desentupidora no Setor {neighborhood.name} em {city.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Contratar uma desentupidora no Setor {neighborhood.name} é simples e rápido. Basta entrar em contato pelo nosso WhatsApp ou telefone, informar o tipo de problema e sua localização. Em poucos minutos, enviaremos um profissional qualificado até o local para realizar uma avaliação e apresentar o orçamento — sem compromisso.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { step: "1", title: "Entre em Contato", desc: "Fale conosco pelo WhatsApp ou telefone" },
                  { step: "2", title: "Receba o Orçamento", desc: "Avaliação gratuita e sem compromisso" },
                  { step: "3", title: "Problema Resolvido", desc: "Equipe técnica resolve rapidamente" },
                ].map((s) => (
                  <div key={s.step} className="rounded-xl border bg-card p-5 text-center shadow-sm">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">{s.step}</div>
                    <h3 className="font-display text-sm font-bold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* H2: Precisando */}
            <section className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6 md:p-8">
              <h2 className="mb-3 text-2xl font-bold text-foreground">
                Precisando de desentupidora no Setor {neighborhood.name}?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sabemos que um entupimento pode causar grandes transtornos no dia a dia. Por isso, nosso atendimento no Setor {neighborhood.name} é ágil e eficiente. Não espere o problema se agravar — quanto antes você nos acionar, mais rápido e econômico será o serviço. Estamos disponíveis 24 horas, prontos para resolver qualquer emergência.
              </p>
              <Button variant="cta" size="lg" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Fale Agora no WhatsApp
                </a>
              </Button>
            </section>

            {/* H2: Forma mais econômica */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <DollarSign className="h-6 w-6 text-accent" /> Qual a forma mais econômica de contratar uma desentupidora no Setor {neighborhood.name}?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A forma mais econômica é agir rapidamente ao primeiro sinal de entupimento. Quanto mais cedo o problema for identificado, menor será a complexidade e o custo do serviço. Oferecemos orçamento gratuito e transparente, sem taxas ocultas. Compare sempre os valores e priorize empresas com garantia — como a nossa.
              </p>
            </section>

            {/* H2: Garantia */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <Shield className="h-6 w-6 text-accent" /> Desentupidora com garantia no Setor {neighborhood.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Todos os nossos serviços de desentupimento no Setor {neighborhood.name} contam com garantia por escrito. Utilizamos equipamentos modernos e técnicas avançadas que asseguram a qualidade e durabilidade do serviço. Caso o problema retorne dentro do período de garantia, refazemos o serviço sem custo adicional.
              </p>
            </section>

            {/* H2: Desentupimento no Setor */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <Star className="h-6 w-6 text-accent" /> Desentupimento no Setor {neighborhood.name} em {city.name}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Realizamos todos os tipos de desentupimento no Setor {neighborhood.name}: pias, vasos sanitários, ralos, caixas de gordura, esgoto, tubulações industriais e muito mais. Nossos profissionais são treinados para lidar com qualquer nível de complexidade, utilizando hidrojateamento, sondas elétricas e equipamentos de última geração.
              </p>
            </section>

            {/* H2: Como é cobrado */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <DollarSign className="h-6 w-6 text-accent" /> Como é cobrado o desentupimento de cano no Setor {neighborhood.name}?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O valor do desentupimento no Setor {neighborhood.name} varia de acordo com o tipo de serviço, a complexidade do entupimento, o diâmetro da tubulação e a acessibilidade do local. Trabalhamos com preço justo e transparente, sem cobranças surpresa. Após a avaliação no local, informamos o valor exato antes de iniciar qualquer serviço — e o orçamento é gratuito.
              </p>
            </section>

            {/* H2: Serviços */}
            {services && services.length > 0 && (
              <section>
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <Wrench className="h-6 w-6 text-accent" /> Quais são os serviços de desentupimento realizados no Setor {neighborhood.name}?
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {services.map((s) => (
                    <ServiceCard key={s.slug} service={s} whatsappUrl={whatsappUrl} />
                  ))}
                </div>
              </section>
            )}

            {/* H2: Desentupidor caseiro */}
            <section className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <Lightbulb className="h-6 w-6 text-accent" /> Você que mora no Setor {neighborhood.name}, aprenda a fazer um desentupidor caseiro
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para entupimentos leves, você pode tentar algumas soluções caseiras antes de chamar um profissional. Lembre-se: essas dicas funcionam apenas para obstruções simples. Para casos mais graves, sempre conte com uma desentupidora profissional.
              </p>
              <div className="space-y-3">
                {[
                  { title: "Água fervente", desc: "Despeje água fervente diretamente no ralo. Funciona bem para dissolver gordura acumulada." },
                  { title: "Bicarbonato + vinagre", desc: "Coloque 4 colheres de bicarbonato no ralo, adicione 1/2 copo de vinagre e aguarde 30 minutos. Depois enxágue com água quente." },
                  { title: "Detergente + água quente", desc: "Despeje detergente no vaso sanitário, aguarde 15 minutos e jogue água quente (não fervente) para desobstruir." },
                ].map((tip, i) => (
                  <div key={i} className="flex gap-3 rounded-lg bg-muted/50 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">{i + 1}</span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground italic">
                ⚠️ Se o problema persistir, não insista com métodos caseiros. Entre em contato conosco para um serviço profissional e seguro.
              </p>
            </section>

            {/* H2: Preço */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                <DollarSign className="h-6 w-6 text-accent" /> Qual o preço para desentupir no Setor {neighborhood.name}?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Os preços para desentupimento no Setor {neighborhood.name} variam conforme o tipo de serviço. Abaixo uma estimativa geral para referência:
              </p>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Serviço</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Faixa de Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Desentupimento de pia", "R$ 150 - R$ 350"],
                      ["Desentupimento de vaso sanitário", "R$ 150 - R$ 400"],
                      ["Desentupimento de ralo", "R$ 120 - R$ 300"],
                      ["Desentupimento de esgoto", "R$ 250 - R$ 800"],
                      ["Desentupimento de caixa de gordura", "R$ 200 - R$ 500"],
                      ["Hidrojateamento", "R$ 400 - R$ 1.500"],
                    ].map(([service, price], i) => (
                      <tr key={i} className="border-t hover:bg-muted/30">
                        <td className="px-4 py-3 text-foreground">{service}</td>
                        <td className="px-4 py-3 font-semibold text-accent">{price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">* Valores aproximados. O preço final é definido após avaliação no local. Orçamento gratuito.</p>
            </section>

            {/* H2: Setores atendidos */}
            {siblings.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-foreground">
                  <MapPin className="h-6 w-6 text-accent" /> Setores atendidos em {city.name}
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {siblings.map((n) => (
                    <Link key={n.slug} to={`/${city.slug}/${n.slug}`}
                      className="flex items-center gap-2 rounded-lg border bg-card p-3 transition-all hover:shadow-sm hover:border-accent">
                      <MapPin className="h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm font-medium text-foreground">{n.name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* H2: FAQ */}
            <section>
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
                Perguntas Frequentes — Desentupidora no Setor {neighborhood.name}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-display text-sm font-bold text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div>
              <Link to={`/${city.slug}`} className="text-sm font-medium text-accent hover:underline">
                ← Ver todos os setores de {city.name}
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-28 space-y-6">
              <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Atendimento no Setor {neighborhood.name}</h3>
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-accent">
                  <Clock className="h-4 w-4" /> Chegada em 20-40 min
                </div>
                <div className="flex flex-col gap-3">
                  <Button variant="whatsapp" size="lg" asChild className="w-full">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
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

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-3 font-display text-sm font-bold text-foreground">Por que nos escolher?</h3>
                <div className="space-y-3">
                  {[
                    { icon: Clock, text: "Chegamos em até 40 min" },
                    { icon: Shield, text: "Garantia por escrito" },
                    { icon: DollarSign, text: "Orçamento gratuito" },
                    { icon: Star, text: "Profissionais experientes" },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4 text-accent" /> {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
