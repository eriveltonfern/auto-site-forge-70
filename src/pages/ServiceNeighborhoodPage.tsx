import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { useServices, useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { noNa } from "@/lib/preposition";

import { CtaBanner, OutrosServicos, Vantagens, PorQueEscolher, FaqSection, Depoimentos, ContatoSection, BairrosAtendidos } from "@/components/SharedSections";
import heroBgFallback from "@/assets/hero-bg.jpg";
import NotFound from "./NotFound";

function generateFaqs(neighborhoodName: string) {
  const loc = noNa(neighborhoodName);
  return [
    { question: `Quanto custa um serviço de desentupimento ${loc}?`, answer: `O valor do serviço de desentupimento ${loc} varia entre R$120,00 à R$980,00. Trabalhamos com orçamento sem compromisso via WhatsApp ou no local.` },
    { question: `O desentupimento perto de mim é mais barato?`, answer: `Sim! Quando o nosso equipamento está próximo da sua localização ${loc}, o custo tende a ser mais baixo, já que a taxa de deslocamento é menor.` },
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

interface Props {
  serviceSlug: string;
  neighborhoodSlug: string;
}

export default function ServiceNeighborhoodPage({ serviceSlug, neighborhoodSlug }: Props) {
  

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
      return data || [];
    },
  });

  if (loadingService || loadingNeighborhood || !settings) return null;
  if (!service || !neighborhood) return <NotFound />;

  const serviceName = service.name;
  const serviceNameLower = serviceName.toLowerCase();
  const neighborhoodName = neighborhood.name;
  const loc = noNa(neighborhoodName);
  const comboSlug = `${service.slug}-${neighborhood.slug}`;
  const seoTitle = `Precisando de ${serviceName} ${loc}?`;
  const seoDesc = `${serviceName} ${loc} em Goiânia-GO. Atendimento rápido 24h. Orçamento grátis pelo WhatsApp. Serviço profissional com garantia.`;
  const faqs = generateFaqs(neighborhoodName);
  const whatsappUrl = getWhatsAppUrl(settings, `Olá! Preciso de ${serviceNameLower} ${loc}, Goiânia.`);
  const siblings = (allNeighborhoods || []).filter((n) => n.slug !== neighborhood.slug);

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
        <div className="absolute inset-0">
          <img src={settings.hero_image || heroBgFallback} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
              Precisando de {serviceName} {loc}?
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-4 max-w-2xl text-lg opacity-90 md:text-xl">
              Problemas com esgoto ou entupimento?
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
              Solicite {serviceNameLower} 24h {loc} com atendimento imediato.
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
                Serviço de {serviceName} Perto de Mim {loc}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Quando você busca por "<strong className="text-foreground">{serviceNameLower} perto de mim</strong>" ou "<strong className="text-foreground">desentupidora 24h</strong>" {loc} em Goiânia-GO, além do {serviceNameLower} nós entregamos um serviço completo, com equipe experiente e recursos prontos para qualquer situação.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allServices.map((s, i) => (
                <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()} ${loc}. Podem me ajudar?`)} linkTo={`/${s.slug}-${neighborhood.slug}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <OutrosServicos companyName={settings.company_name || "Desentupidora Goiânia"} />
      <CtaBanner settings={settings} localName={neighborhoodName} heading={`Serviço de ${serviceName} Perto de Mim`} variant={1} />
      <Vantagens serviceName={serviceName} />
      <PorQueEscolher localName={neighborhoodName} companyName={settings.company_name || "Desentupidora Goiânia"} />
      <CtaBanner settings={settings} localName={neighborhoodName} heading={`Serviço de ${serviceName} Perto de Mim`} variant={2} />
      <FaqSection faqs={faqs} />
      <CtaBanner settings={settings} localName={neighborhoodName} heading={`Serviço de ${serviceName} Perto de Mim`} variant={1} />
      <Depoimentos />
      <ContatoSection settings={settings} whatsappUrl={whatsappUrl} />
      <BairrosAtendidos
        neighborhoods={siblings}
        localName={neighborhoodName}
        linkPrefix={service.slug}
        searchTerm={`${serviceNameLower} próximo de mim`}
      />

      <Footer />
    </>
  );
}
