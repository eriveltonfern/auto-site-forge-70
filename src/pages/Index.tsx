import { Link } from "react-router-dom";
import { Phone, MessageCircle, CheckCircle, Shield, Clock, Star, ChevronDown, PhoneCall, Wrench, Award, Users, ArrowRight, HelpCircle, Zap, CreditCard, ThumbsUp, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEOHead, getLocalBusinessSchema, getFAQSchema } from "@/components/SEOHead";
import { useSiteSettings, useServices, useCitiesWithNeighborhoodCount, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { ServiceCard } from "@/components/ServiceCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const homeFaq = [
  { question: "Quanto custa um serviço de desentupimento em Goiânia?", answer: "O valor depende do tipo de entupimento e da estrutura, varia entre R$120,00 à R$980,00. Trabalhamos com orçamento sem compromisso via WhatsApp ou no local." },
  { question: "O desentupimento perto de mim é mais barato?", answer: "Sim! Quando o nosso equipamento está próximo da sua localização em Goiânia, o custo tende a ser mais baixo, já que a taxa de deslocamento é menor." },
  { question: "Fazem desentupimento de pia de cozinha?", answer: "Sim! Atendemos pias de cozinha e banheiro com remoção de gordura e sujeira acumulada, sem quebrar nada." },
  { question: "A desentupidora atende à noite?", answer: "Sim, somos uma desentupidora 24 horas, com equipe disponível inclusive de madrugada, fins de semana e feriados." },
  { question: "Vocês atendem casas e apartamentos?", answer: "Atendemos residências, condomínios, comércios e empresas com equipamentos adequados para cada ambiente." },
  { question: "Quais formas de pagamento vocês aceitam?", answer: "Trabalhamos com diversas formas de pagamento: dinheiro, Pix, cartões de crédito e débito, além de transferências bancárias." },
  { question: "O serviço suja muito o local?", answer: "Não! Utilizamos métodos modernos e protegemos o ambiente para evitar sujeira durante e após o serviço." },
  { question: "Fazem limpeza de fossa séptica?", answer: "Sim, contamos com caminhão apropriado para limpeza e esgotamento de fossas residenciais e comerciais." },
];

const otherServices = [
  "Limpeza de caixa de gordura",
  "Inspeção de tubulação com câmera",
  "Localização de obstruções invisíveis",
  "Desentupimento de coluna de prédio",
  "Manutenção preventiva de encanamentos",
  "Desentupimento industrial com alta pressão",
  "Solução para retorno de esgoto em calhas e quintais",
  "Controle de odores em redes de esgoto",
];

const advantages = [
  { icon: Zap, title: "Atendimento Imediato", desc: "Chegamos rápido em Goiânia com técnicos preparados para resolver na hora." },
  { icon: Shield, title: "Segurança e profissionalismo", desc: "Nossa equipe é treinada para executar o serviço com total atenção e segurança." },
  { icon: CheckCircle, title: "Sem Quebra de Piso", desc: "Usamos tecnologia que desentope sem necessidade de quebrar azulejos ou pisos." },
  { icon: Award, title: "Garantia no serviço", desc: "Serviços com garantia e suporte caso ocorra qualquer imprevisto." },
  { icon: CreditCard, title: "Pagamento facilitado", desc: "Aceitamos Pix, cartões de crédito e débito para sua maior comodidade." },
];

const testimonials = [
  { name: "Patrícia Gomes", text: "Meu vaso entupiu no fim de semana e fui atendida em menos de 40 minutos. Serviço limpo, rápido e com preço justo!" },
  { name: "Rodrigo Silva", text: "Chamei para desentupir o esgoto da casa da minha mãe. Atendimento excelente, técnico educado e resolveu na hora." },
  { name: "Camila Duarte", text: "A pia da cozinha estava transbordando. Vieram no mesmo dia e deixaram tudo funcionando. Recomendo muito a empresa!" },
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

  const { data: neighborhoods } = useQuery({
    queryKey: ["all_neighborhoods"],
    queryFn: async () => {
      const { data } = await supabase
        .from("neighborhoods")
        .select("name, slug, city_id, cities!inner(slug)")
        .eq("status", "active")
        .order("name");
      return data;
    },
  });

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

      {/* ===== HERO with background image ===== */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-[url('https://desentupidoras.goiania.br/wp-content/uploads/2025/07/fundo-desentupidora-1-scaled.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
              Precisando de Desentupidora 24h em Goiânia?
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-4 max-w-2xl text-lg opacity-90 md:text-xl">
              Problemas com esgoto ou entupimento?
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
              Solicite desentupimento urgente em Goiânia com atendimento imediato.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center">
              <Button variant="whatsapp" size="lg" asChild className="px-10 py-6 text-lg rounded-full">
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chame Agora!
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      {services && services.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-4 max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
                Empresa de Desentupimento Perto de Mim em Goiânia-GO
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Quando você busca por "<strong className="text-foreground">desentupimento perto de mim</strong>" ou "<strong className="text-foreground">desentupidora 24h</strong>", nós entregamos um atendimento completo, com equipe experiente, atendimento rápido e recursos prontos para qualquer situação.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()}. Podem me ajudar?`)} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== OUTROS SERVIÇOS ===== */}
      <section className="section-alt py-16 md:py-20">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <h2 className="mb-4 text-2xl font-black text-foreground md:text-3xl">
                Outros serviços da Desentupidora em Goiânia
              </h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Além dos desentupimentos tradicionais, <strong className="text-foreground">{settings.company_name}</strong> realiza serviços especializados com agilidade e segurança, como:
              </p>
              <ul className="space-y-3">
                {otherServices.map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Todos os atendimentos são feitos com <strong className="text-foreground">equipamentos modernos</strong>, por <strong className="text-foreground">técnicos especializados</strong>, oferecendo <strong className="text-foreground">diagnóstico preciso</strong> e solução eficaz no menor tempo possível.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="flex justify-center">
              <div className="rounded-2xl bg-primary/5 p-8">
                <div className="flex h-48 w-48 items-center justify-center rounded-full bg-accent/10 mx-auto">
                  <Wrench className="h-24 w-24 text-accent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="hero-bg py-14 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center text-primary-foreground md:flex-row md:text-left">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-black md:text-3xl">Empresa de Desentupimento Perto de Mim</h2>
              <p className="text-lg opacity-90">
                Problemas com entupimento, vazamento ou retorno de esgoto? Desentupidora 24h resolve!
              </p>
              <p className="opacity-80">Atendimento rápido em Goiânia com equipe especializada e total segurança.</p>
            </div>
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full shrink-0">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== VANTAGENS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">
              Vantagens de contratar serviço de desentupidora próximo a mim
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((a, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-accent/50 hover:-translate-y-1">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <a.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POR QUE ESCOLHER ===== */}
      <section className="section-alt py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
              Por que escolher o Desentupidora 24 horas Goiânia?
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Precisando de uma <strong className="text-foreground">empresa desentupidora com preço justo e serviço rápido</strong>? Atendemos toda Goiânia com soluções eficientes, sem quebra e com garantia.
            </p>
            <p className="mb-4 text-foreground font-bold">
              Elimine entupimentos com a desentupidora mais próxima de você!
            </p>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Somos especialistas em desentupimento de esgoto, pia, vaso sanitário, ralo e fossa. Atendemos residências, comércios e indústrias com equipamentos modernos.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A <strong className="text-foreground">{settings.company_name}</strong> está sempre por perto, pronta para agir com agilidade, segurança e profissionais capacitados. Atendimento imediato no WhatsApp!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA BANNER 2 ===== */}
      <section className="hero-bg py-14 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center text-primary-foreground md:flex-row md:text-left">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-black md:text-3xl">Empresa de Desentupimento Perto de Mim</h2>
              <p className="text-lg opacity-90">
                Problemas com entupimento, vazamento ou retorno de esgoto? Desentupidora 24h resolve!
              </p>
              <p className="opacity-80">Serviço rápido em Goiânia com equipe especializada e total segurança.</p>
            </div>
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full shrink-0">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Perguntas frequentes</h2>
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

      {/* ===== CTA BANNER 3 ===== */}
      <section className="hero-bg py-14 md:py-16">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center text-primary-foreground md:flex-row md:text-left">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-black md:text-3xl">Empresa de Desentupimento Perto de Mim</h2>
              <p className="text-lg opacity-90">
                Problemas com entupimento, vazamento ou retorno de esgoto? Desentupidora 24h resolve!
              </p>
              <p className="opacity-80">Atendimento rápido em Goiânia com equipe especializada e total segurança.</p>
            </div>
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full shrink-0">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Depoimentos de clientes em Goiânia</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}
                className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <p className="mb-4 text-sm text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTATO ===== */}
      <section className="section-alt py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto max-w-xl text-center">
            <h2 className="mb-6 text-2xl font-black text-foreground md:text-4xl">Entre em contato</h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Telefone</p>
                <a href={getPhoneUrl(settings)} className="font-display text-lg font-bold text-accent hover:underline">
                  {settings.phone}
                </a>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">WhatsApp</p>
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-bold text-accent hover:underline">
                  {settings.whatsapp || settings.phone}
                </a>
              </div>
            </div>
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== ÁREAS ATENDIDAS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Atendemos Toda a Região de Goiânia</h2>
            <p className="text-muted-foreground">
              Está buscando por "<strong className="text-foreground">desentupidora próxima de mim</strong>" em Goiânia-GO? Estamos prontos para atender você nos principais bairros da cidade:
            </p>
          </motion.div>

          {neighborhoods && neighborhoods.length > 0 && (
            <motion.div {...fadeUp} className="columns-2 sm:columns-3 lg:columns-4 gap-4">
              {neighborhoods.map((n: any) => (
                <Link
                  key={n.slug}
                  to={`/${n.cities?.slug || "goiania"}/${n.slug}`}
                  className="mb-2 block text-sm text-accent hover:underline transition-colors"
                >
                  {n.name}
                </Link>
              ))}
            </motion.div>
          )}

          {citiesData && citiesData.length > 0 && (!neighborhoods || neighborhoods.length === 0) && (
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
          )}
        </div>
      </section>

      <Footer />
      <SEOHead title="" description="" structuredData={getFAQSchema(homeFaq)} />
    </>
  );
}
