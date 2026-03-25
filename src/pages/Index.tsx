import { Link } from "react-router-dom";
import { Phone, MessageCircle, CheckCircle, Shield, Clock, Star, ChevronDown, PhoneCall, Wrench, Award, Users, ArrowRight, HelpCircle } from "lucide-react";
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
  { question: "É necessário quebrar parede ou piso?", answer: "Na maioria dos casos, utilizamos métodos modernos que não necessitam de quebra-quebra, preservando a estrutura do imóvel." },
  { question: "Qual a garantia do serviço?", answer: "Todos os nossos serviços possuem garantia por escrito, variando conforme o tipo de desentupimento realizado." },
  { question: "Como solicitar um orçamento?", answer: "Basta entrar em contato pelo WhatsApp ou telefone. Nosso atendimento é imediato e o orçamento é gratuito." },
];

const differentials = [
  { icon: Clock, title: "Atendimento 24h", desc: "Disponíveis a qualquer hora do dia ou da noite, inclusive feriados e finais de semana." },
  { icon: Shield, title: "Garantia por Escrito", desc: "Todos os serviços acompanham garantia formal, para sua total segurança." },
  { icon: Star, title: "Equipe Especializada", desc: "Técnicos certificados, treinados e equipados com tecnologia de ponta." },
  { icon: CheckCircle, title: "Sem Quebra-Quebra", desc: "Métodos modernos que preservam a estrutura do seu imóvel." },
];

const steps = [
  { number: "1", title: "Entre em Contato", desc: "Fale conosco pelo WhatsApp ou telefone. Atendimento imediato 24h." },
  { number: "2", title: "Orçamento Grátis", desc: "Avaliamos seu problema e enviamos um orçamento sem compromisso." },
  { number: "3", title: "Agendamento Rápido", desc: "Escolha o melhor horário. Chegamos em até 40 minutos." },
  { number: "4", title: "Problema Resolvido", desc: "Serviço executado com qualidade, garantia e sem surpresas." },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

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

      {/* ===== HERO ===== */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Clock className="h-4 w-4" /> Atendimento 24 horas • 7 dias por semana
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
              Desentupidora em Goiânia
              <span className="block text-gradient">Rápida, Profissional e com Garantia</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
              Resolvemos qualquer entupimento com agilidade e segurança. Orçamento grátis e sem compromisso — chame agora!
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="hero" size="lg" asChild className="w-full sm:w-auto px-8 py-6 text-lg">
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
                </a>
              </Button>
              <Button variant="hero-phone" size="lg" asChild className="w-full sm:w-auto px-8 py-6 text-lg">
                <a href={getPhoneUrl(settings)}>
                  <Phone className="h-5 w-5" /> Ligar Agora
                </a>
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm opacity-80">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Orçamento Grátis</span>
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Garantia no Serviço</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4" /> +2.000 Clientes Atendidos</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== DIFERENCIAIS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">
              Por que escolher a <span className="text-accent">{settings.company_name}</span>?
            </h2>
            <p className="text-muted-foreground">Somos referência em desentupimento em Goiânia, com milhares de clientes satisfeitos e atendimento imbatível.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((d, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="group rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg hover:border-accent/50 hover:-translate-y-1">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <d.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">{d.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      {services && services.length > 0 && (
        <section className="section-alt py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Nossos Serviços</h2>
              <p className="text-muted-foreground">Soluções completas para todo tipo de entupimento, com profissionalismo e tecnologia.</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()}. Podem me ajudar?`)} />
                </motion.div>
              ))}
            </div>
            <motion.div {...fadeUp} className="mt-10 text-center">
              <Button variant="cta" size="lg" asChild>
                <Link to="/servicos">Ver Todos os Serviços <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== COMO CONTRATAR ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Como Contratar</h2>
            <p className="text-muted-foreground">Processo simples, rápido e sem burocracia. Em poucos minutos você resolve seu problema.</p>
          </motion.div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-2xl font-black">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] hidden w-[calc(100%-4rem)] border-t-2 border-dashed border-border lg:block" />
                )}
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-10 text-center">
            <Button variant="hero" size="lg" asChild className="px-8 py-6 text-lg">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Solicitar Orçamento Grátis
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== QUEM SOMOS ===== */}
      <section className="section-alt py-16 md:py-20">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">Quem Somos</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                A <strong className="text-foreground">{settings.company_name}</strong> é uma empresa especializada em serviços de desentupimento em Goiânia e região metropolitana. Com anos de experiência no mercado, nos consolidamos como referência em qualidade, agilidade e confiança.
              </p>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Contamos com uma equipe de técnicos altamente qualificados e equipamentos de última geração, capazes de resolver qualquer tipo de entupimento — de pias e vasos a redes de esgoto e caixas de gordura — de forma rápida, limpa e com garantia.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Award, label: "Profissionais Certificados" },
                  { icon: Users, label: "+2.000 Clientes Satisfeitos" },
                  { icon: Wrench, label: "Equipamentos Modernos" },
                  { icon: Clock, label: "Atendimento 24h" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                    <item.icon className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}
              className="relative overflow-hidden rounded-2xl bg-primary/5 p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Nossa Missão</h3>
                    <p className="text-sm text-muted-foreground">Oferecer soluções eficientes em desentupimento, com atendimento humanizado, preço justo e total transparência.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Nossos Valores</h3>
                    <p className="text-sm text-muted-foreground">Comprometimento, honestidade, respeito ao cliente e excelência em cada serviço realizado.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">Nossa Experiência</h3>
                    <p className="text-sm text-muted-foreground">Anos de atuação no mercado goiano, com milhares de atendimentos realizados com sucesso.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">O que nossos clientes dizem</h2>
            <p className="text-muted-foreground">A satisfação dos nossos clientes é o nosso maior orgulho. Confira alguns depoimentos.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Maria Silva", loc: "Setor Bueno", text: "Chamei de madrugada e atenderam rápido. Em 30 minutos já estavam aqui. Serviço excelente e preço justo!" },
              { name: "Carlos Santos", loc: "Jardim Goiás", text: "Preço justo e profissionalismo de verdade. Resolveram o entupimento do esgoto sem quebrar nada. Super indico!" },
              { name: "Ana Oliveira", loc: "Setor Marista", text: "Já é a terceira vez que chamo. Sempre atendem rápido e com qualidade. Super recomendo para toda Goiânia!" },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex text-accent">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mb-4 text-sm text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.loc}, Goiânia</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ÁREAS ATENDIDAS ===== */}
      {citiesData && citiesData.length > 0 && (
        <section className="section-alt py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Áreas Atendidas</h2>
              <p className="text-muted-foreground">Cobertura em toda Goiânia e região metropolitana. Clique em uma cidade para ver os setores atendidos.</p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {citiesData.map((c: any, i: number) => (
                <motion.div key={c.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <Link to={`/${c.slug}`}
                    className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent hover:-translate-y-0.5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-display font-bold text-lg">
                      {c.neighborhoodCount}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-foreground group-hover:text-accent transition-colors">{c.name}</h3>
                      <p className="text-sm text-muted-foreground">{c.neighborhoodCount} setores atendidos</p>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Perguntas Frequentes</h2>
            <p className="text-muted-foreground">Tire suas dúvidas sobre nossos serviços de desentupimento em Goiânia.</p>
          </motion.div>
          <div className="space-y-3">
            {homeFaq.map((faq, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.03 }}
                className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left font-display font-semibold text-foreground hover:bg-muted/50 transition-colors">
                  {faq.question}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="border-t px-5 py-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="hero-bg py-16 md:py-20">
        <div className="container text-center text-primary-foreground">
          <motion.div {...fadeUp}>
            <h2 className="mb-4 text-2xl font-black md:text-4xl">Precisa de uma Desentupidora Agora?</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg opacity-90">
              Não espere o problema piorar! Fale conosco agora e resolva seu entupimento em minutos com garantia e preço justo.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="hero" size="lg" asChild className="w-full sm:w-auto px-8 py-6 text-lg">
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild
                className="w-full sm:w-auto border-primary-foreground/40 px-8 py-6 text-lg text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href={getPhoneUrl(settings)}>
                  <PhoneCall className="h-5 w-5" /> Ligar Agora
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== AINDA COM DÚVIDAS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center shadow-sm md:p-12">
            <motion.div {...fadeUp}>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <HelpCircle className="h-8 w-8 text-accent" />
              </div>
              <h2 className="mb-3 text-2xl font-black text-foreground md:text-3xl">Ainda com dúvidas?</h2>
              <p className="mx-auto mb-6 max-w-lg text-muted-foreground leading-relaxed">
                Não se preocupe! Nossa equipe está pronta para te ajudar. Entre em contato agora mesmo e tire todas as suas dúvidas. O atendimento é rápido, humanizado e sem compromisso.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button variant="cta" size="lg" asChild className="w-full sm:w-auto">
                  <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> Falar com um Especialista
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <a href={getPhoneUrl(settings)}>
                    <Phone className="h-4 w-4" /> Ligar Agora
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <SEOHead title="" description="" structuredData={getFAQSchema(homeFaq)} />
    </>
  );
}
