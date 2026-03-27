import { Link } from "react-router-dom";
import { Phone, MessageCircle, CheckCircle, Shield, Clock, Star, ChevronDown, Wrench, Award, Zap, CreditCard, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { useServices, useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import NotFound from "./NotFound";

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
  { icon: Zap, title: "Atendimento Imediato", desc: "Chegamos rápido em todo a região com técnicos preparados para resolver na hora." },
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

function generateFaqs(neighborhoodName: string) {
  return [
    { question: `Quanto custa um serviço de desentupimento na ${neighborhoodName}?`, answer: `O valor do serviço de desentupimento na ${neighborhoodName} varia entre R$120,00 à R$980,00. Trabalhamos com orçamento sem compromisso via WhatsApp ou no local.` },
    { question: `O desentupimento perto de mim é mais barato?`, answer: `Sim! Quando o nosso equipamento está próximo da sua localização na ${neighborhoodName}, o custo tende a ser mais baixo, já que a taxa de deslocamento é menor.` },
    { question: `Fazem desentupimento de pia de cozinha?`, answer: `Sim! Atendemos pias de cozinha e banheiro com remoção de gordura e sujeira acumulada, sem quebrar nada.` },
    { question: `A desentupidora atende à noite?`, answer: `Sim, somos uma desentupidora 24 horas, com equipe disponível inclusive de madrugada, fins de semana e feriados.` },
    { question: `Vocês atendem casas e apartamentos?`, answer: `Atendemos residências, condomínios, comércios e empresas com equipamentos adequados para cada ambiente.` },
    { question: `Quais formas de pagamento vocês aceitam?`, answer: `Trabalhamos com diversas formas de pagamento: dinheiro, Pix, cartões de crédito e débito, além de transferências bancárias.` },
    { question: `O serviço suja muito o local?`, answer: `Não! Utilizamos métodos modernos e protegemos o ambiente para evitar sujeira durante e após o serviço.` },
    { question: `Fazem limpeza de fossa séptica?`, answer: `Sim, contamos com caminhão apropriado para limpeza e esgotamento de fossas residenciais e comerciais.` },
  ];
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function CtaBanner({ settings, serviceName, neighborhoodName, variant = 1 }: { settings: any; serviceName: string; neighborhoodName: string; variant?: number }) {
  return (
    <section className="hero-bg py-14 md:py-16">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center text-primary-foreground md:flex-row md:text-left">
          <div className="hidden md:block shrink-0">
            <img src="https://desentupidoras.goiania.br/wp-content/uploads/2025/07/desentupidor-300x300.png" alt="Desentupidor" className="h-28 w-28 object-contain" loading="lazy" />
          </div>
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-black md:text-3xl">Serviço de {serviceName} Perto de Mim</h2>
            <p className="text-lg opacity-90">Problemas com entupimento, vazamento ou retorno de esgoto? Desentupidora 24h resolve!</p>
            <p className="opacity-80">
              {variant === 1
                ? `Atendimento rápido na ${neighborhoodName} com equipe especializada e total segurança.`
                : `Serviço rápido na ${neighborhoodName} com equipe especializada e total segurança.`}
            </p>
          </div>
          <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full shrink-0">
            <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Chamar Agora!
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

interface Props {
  serviceSlug: string;
  neighborhoodSlug: string;
}

export default function ServiceNeighborhoodPage({ serviceSlug, neighborhoodSlug }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: service, isLoading: loadingService } = useQuery({
    queryKey: ["service_combo", serviceSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", serviceSlug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!serviceSlug,
  });

  const { data: neighborhood, isLoading: loadingNeighborhood } = useQuery({
    queryKey: ["neighborhood_combo", neighborhoodSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*")
        .eq("slug", neighborhoodSlug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodSlug,
  });

  const { data: allServices } = useServices();
  const { data: settings } = useSiteSettings();

  const { data: allNeighborhoods } = useQuery({
    queryKey: ["all_neighborhoods_published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("name, slug")
        .eq("status", "published")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  if (loadingService || loadingNeighborhood || !settings) return null;
  if (!service || !neighborhood) return <NotFound />;

  const serviceName = service.name;
  const serviceNameLower = serviceName.toLowerCase();
  const neighborhoodName = neighborhood.name;
  const comboSlug = `${service.slug}-${neighborhood.slug}`;
  const seoTitle = `Precisando de ${serviceName} na ${neighborhoodName}?`;
  const seoDesc = `${serviceName} na ${neighborhoodName} em Goiânia-GO. Atendimento rápido 24h. Orçamento grátis pelo WhatsApp. Serviço profissional com garantia.`;
  const faqs = generateFaqs(neighborhoodName);
  const whatsappUrl = getWhatsAppUrl(settings, `Olá! Preciso de ${serviceNameLower} na ${neighborhoodName}, Goiânia.`);
  const siblings = allNeighborhoods?.filter((n) => n.slug !== neighborhood.slug) || [];

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://desentupidoras.goiania.br/${comboSlug}`}
        structuredData={getFAQSchema(faqs)}
      />
      <Header />
      <FloatingCTA />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-[url('https://desentupidoras.goiania.br/wp-content/uploads/2025/07/fundo-desentupidora-1-scaled.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
              Precisando de {serviceName} na {neighborhoodName}?
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-4 max-w-2xl text-lg opacity-90 md:text-xl">
              Problemas com esgoto ou entupimento?
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
              Solicite {serviceNameLower} 24h na {neighborhoodName} com atendimento imediato.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center">
              <Button variant="whatsapp" size="lg" asChild className="px-10 py-6 text-lg rounded-full">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chame Agora!
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      {allServices && allServices.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-4 max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
                Serviço de {serviceName} Perto de Mim na {neighborhoodName}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Quando você busca por "<strong className="text-foreground">{serviceNameLower} perto de mim</strong>" ou "<strong className="text-foreground">desentupidora 24h</strong>" na {neighborhoodName} em Goiânia-GO, além do {serviceNameLower} nós entregamos um serviço completo, com equipe experiente e recursos prontos para qualquer situação.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allServices.map((s, i) => (
                <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()} na ${neighborhoodName}. Podem me ajudar?`)} />
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
                Além dos desentupimentos tradicionais, a <strong className="text-foreground">{settings.company_name}</strong> realiza serviços especializados com agilidade e segurança, como:
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
              <img src="https://desentupidoras.goiania.br/wp-content/uploads/2025/07/desentupidor-1.png" alt="Desentupidor profissional" className="max-h-96 w-auto object-contain" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER 1 ===== */}
      <CtaBanner settings={settings} serviceName={serviceName} neighborhoodName={neighborhoodName} variant={1} />

      {/* ===== VANTAGENS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">
              Vantagens de contratar serviço de {serviceNameLower} próximo a mim
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
              Por que escolher o Desentupidora 24 horas na {neighborhoodName}?
            </h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              Precisando de uma <strong className="text-foreground">empresa desentupidora com preço justo e serviço rápido</strong>? Atendemos na {neighborhoodName} com soluções eficientes, sem quebra e com garantia.
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
      <CtaBanner settings={settings} serviceName={serviceName} neighborhoodName={neighborhoodName} variant={2} />

      {/* ===== FAQ ===== */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Perguntas frequentes</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
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
      <CtaBanner settings={settings} serviceName={serviceName} neighborhoodName={neighborhoodName} variant={1} />

      {/* ===== DEPOIMENTOS ===== */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">Depoimentos de clientes em Goiânia-GO</h2>
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
                  {settings.phone}
                </a>
              </div>
            </div>
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== BAIRROS ATENDIDOS ===== */}
      {siblings.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-8 max-w-3xl text-center">
              <h2 className="mb-3 text-2xl font-black text-foreground md:text-4xl">
                Atendemos na {neighborhoodName} e Toda a Região em Goiânia
              </h2>
              <p className="text-muted-foreground">
                Está buscando por "<strong className="text-foreground">{serviceNameLower} próximo de mim</strong>" na {neighborhoodName}? Estamos prontos para atender você nos principais bairros da cidade:
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="columns-2 sm:columns-3 lg:columns-4 gap-4">
              {siblings.map((n) => (
                <Link key={n.slug} to={`/${service.slug}-${n.slug}`} className="mb-2 block text-sm text-accent hover:underline transition-colors">
                  {n.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
