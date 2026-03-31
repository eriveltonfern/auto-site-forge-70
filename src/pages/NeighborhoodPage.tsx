import { useParams, Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { noNa } from "@/lib/preposition";
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

import { CtaBanner, OutrosServicos, Vantagens, PorQueEscolher, FaqSection, Depoimentos, ContatoSection, BairrosAtendidos } from "@/components/SharedSections";
import heroBgFallback from "@/assets/hero-bg.jpg";
import NotFound from "./NotFound";

function generateFaqs(name: string) {
  const loc = noNa(name);
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

export default function NeighborhoodPage() {
  const { slug, neighborhoodSlug: paramNeighborhoodSlug } = useParams();
  const neighborhoodSlug = paramNeighborhoodSlug || slug;
  

  const { data: neighborhood, isLoading } = useQuery({
    queryKey: ["neighborhood_direct", neighborhoodSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*, cities(*)")
        .eq("slug", neighborhoodSlug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!neighborhoodSlug,
  });

  const { data: services } = useServices();
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

  if (isLoading || !settings) return null;
  if (!neighborhood) return <NotFound />;

  const displayName = neighborhood.name;
  const seoName = displayName;
  const loc = noNa(seoName);
  const seoTitle = neighborhood.seo_title || `Precisando de Desentupidora 24h ${loc}?`;
  const seoDesc = neighborhood.meta_description || `Desentupidora ${loc} em Goiânia-GO. Atendimento rápido 24h. Desentupimento de pia, vaso, esgoto e mais. Orçamento grátis pelo WhatsApp.`;
  const faqs = generateFaqs(seoName);
  const whatsappUrl = getWhatsAppUrl(settings, `Olá! Preciso de desentupimento ${loc}, Goiânia.`);
  const siblings = (allNeighborhoods || []).filter((n) => n.slug !== neighborhood.slug);

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://desentupidoras.goiania.br/${neighborhood.slug}`}
        structuredData={getFAQSchema(faqs)}
      />
      <Header />
      <FloatingCTA />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img src={neighborhood.cover_image || settings.hero_image || heroBgFallback} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
              {neighborhood.h1 || `Precisando de Desentupidora 24h ${loc}?`}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-4 max-w-2xl text-lg opacity-90 md:text-xl">
              Problemas com esgoto ou entupimento?
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
              Solicite desentupimento urgente {loc} com atendimento imediato.
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

      {/* ===== CONTEÚDO PERSONALIZADO ===== */}
      {neighborhood.base_content && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {neighborhood.base_content.split("\n").map((p: string, i: number) => {
                const trimmed = p.trim();
                if (!trimmed) return <br key={i} />;
                if (trimmed.startsWith("### ")) return <h3 key={i} className="mt-8 mb-3 text-xl font-bold text-foreground">{trimmed.slice(4)}</h3>;
                if (trimmed.startsWith("## ")) return <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-foreground">{trimmed.slice(3)}</h2>;
                if (trimmed.startsWith("# ")) return <h2 key={i} className="mt-10 mb-4 text-3xl font-bold text-foreground">{trimmed.slice(2)}</h2>;
                return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{trimmed}</p>;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== SERVIÇOS ===== */}
      {services && services.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-4 max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
                Empresa de Desentupimento Perto de Mim {loc}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Quando você busca por "<strong className="text-foreground">desentupimento perto de mim</strong>" ou "<strong className="text-foreground">desentupidora 24h</strong>" {loc} em Goiânia-GO, nós entregamos um atendimento completo, com equipe experiente, atendimento rápido e recursos prontos para qualquer situação.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()} ${loc}. Podem me ajudar?`)} linkTo={`/${s.slug}-${neighborhood.slug}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <OutrosServicos companyName={settings.company_name || "Desentupidora Goiânia"} />
      <CtaBanner settings={settings} localName={seoName} variant={1} />
      <Vantagens />
      <PorQueEscolher localName={seoName} companyName={settings.company_name || "Desentupidora Goiânia"} />
      <CtaBanner settings={settings} localName={seoName} variant={2} />
      <FaqSection faqs={faqs} />
      <CtaBanner settings={settings} localName={seoName} variant={1} />
      <Depoimentos />
      <ContatoSection settings={settings} whatsappUrl={whatsappUrl} />
      <BairrosAtendidos neighborhoods={siblings} localName={seoName} />

      <Footer />
    </>
  );
}
