import { useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SEOHead, getFAQSchema } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { useServiceBySlug, useServices, useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { CtaBanner, OutrosServicos, Vantagens, PorQueEscolher, FaqSection, Depoimentos, ContatoSection, BairrosAtendidos } from "@/components/SharedSections";
import heroBgFallback from "@/assets/hero-bg.jpg";
import NotFound from "./NotFound";

/** Extract short noun from service name: "Desentupimento de Pia" → "Pia" */
function getShortName(name: string): string {
  return name
    .replace(/^Desentupimento de /i, "")
    .replace(/^Limpeza de /i, "");
}

/** Same generic FAQs used on the reference site for ALL service pages */
const genericFaqs = [
  { question: "Quanto custa um serviço de desentupimento em Goiânia?", answer: "O valor do serviço de desentupimento em Goiânia varia entre R$120,00 à R$980,00. Trabalhamos com orçamento sem compromisso via WhatsApp ou no local." },
  { question: "O desentupimento perto de mim é mais barato?", answer: "Sim! Quando o nosso equipamento está próximo da sua localização em Goiânia, o custo tende a ser mais baixo, já que a taxa de deslocamento é menor." },
  { question: "Fazem desentupimento de pia de cozinha?", answer: "Sim! Atendemos pias de cozinha e banheiro com remoção de gordura e sujeira acumulada, sem quebrar nada." },
  { question: "A desentupidora atende à noite?", answer: "Sim, somos uma desentupidora 24 horas, com equipe disponível inclusive de madrugada, fins de semana e feriados." },
  { question: "Vocês atendem casas e apartamentos?", answer: "Atendemos residências, condomínios, comércios e empresas com equipamentos adequados para cada ambiente." },
  { question: "Quais formas de pagamento vocês aceitam?", answer: "Trabalhamos com diversas formas de pagamento: dinheiro, Pix, cartões de crédito e débito, além de transferências bancárias." },
  { question: "O serviço suja muito o local?", answer: "Não! Utilizamos métodos modernos e protegemos o ambiente para evitar sujeira durante e após o serviço." },
  { question: "Fazem limpeza de fossa séptica?", answer: "Sim, contamos com caminhão apropriado para limpeza e esgotamento de fossas residenciais e comerciais." },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function ServicePage() {
  const { serviceSlug } = useParams();
  const { data: service, isLoading } = useServiceBySlug(serviceSlug || "");
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

  if (isLoading || !settings) return null;
  if (!service) return <NotFound />;

  const serviceName = service.name; // e.g. "Desentupimento de Pia"
  const serviceNameLower = serviceName.toLowerCase();
  const shortName = getShortName(serviceName); // e.g. "Pia"
  const shortNameLower = shortName.toLowerCase();

  // Reference pattern: "Precisando de Desentupidora de Pia em Goiânia?"
  const heroTitle = service.h1 || `Precisando de Desentupidora de ${shortName} em Goiânia?`;
  const seoTitle = service.seo_title || `Precisando de Desentupidora de ${shortName} em Goiânia?`;
  const seoDesc = service.meta_description || `${serviceName} em Goiânia-GO. Atendimento rápido 24h. Orçamento grátis pelo WhatsApp. Serviço profissional com garantia.`;
  
  // Use custom FAQs from DB if available, otherwise generic home FAQs (matches reference)
  const customFaqs = (service.faq as { question: string; answer: string }[]) || [];
  const faqs = customFaqs.length > 0 ? customFaqs : genericFaqs;
  const whatsappUrl = getWhatsAppUrl(settings, `Olá! Preciso de ${serviceNameLower} em Goiânia.`);

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        canonical={`https://desentupidoras.goiania.br/servicos/${service.slug}`}
        structuredData={getFAQSchema(faqs)}
      />
      <Header />
      <FloatingCTA />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img src={service.cover_image || settings.hero_image || heroBgFallback} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
              {heroTitle}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-4 max-w-2xl text-lg opacity-90 md:text-xl">
              {service.short_description || `${shortName} entupida ou com problemas?`}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mb-8 max-w-2xl text-lg opacity-90 md:text-xl">
              Solicite {serviceNameLower} em Goiânia com atendimento imediato.
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
      {service.long_description && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {service.long_description.split("\n").map((p, i) => {
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
      {allServices && allServices.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <motion.div {...fadeUp} className="mx-auto mb-4 max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-black text-foreground md:text-4xl">
                Empresa de {serviceName} Perto de Mim em Goiânia
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Quando você busca por "<strong className="text-foreground">empresa de {serviceNameLower} perto de mim</strong>" ou "<strong className="text-foreground">desentupidora de {shortNameLower} 24h</strong>" em Goiânia-GO, além do {serviceNameLower} nós entregamos um serviço completo, com equipe experiente e recursos prontos para qualquer situação.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allServices.map((s, i) => (
                <motion.div key={s.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} whatsappUrl={getWhatsAppUrl(settings, `Olá! Preciso de ${s.name.toLowerCase()} em Goiânia. Podem me ajudar?`)} linkTo={`/servicos/${s.slug}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reference: "Outros serviços da Desentupidora de Pia em Goiânia" */}
      <OutrosServicos companyName={settings.company_name || "Desentupidora Goiânia"} serviceName={shortName} />

      {/* Reference: two CTA banners back to back (variant 1 + 2) */}
      <CtaBanner settings={settings} localName="Goiânia" heading={`Desentupidora de ${shortName} Perto de Mim`} variant={1} />
      <CtaBanner settings={settings} localName="Goiânia" heading={`Desentupidora de ${shortName} Perto de Mim`} variant={2} />

      {/* Reference: generic "desentupimento" — no service-specific name */}
      <Vantagens />

      <PorQueEscolher localName="Goiânia" companyName={settings.company_name || "Desentupidora Goiânia"} />

      <CtaBanner settings={settings} localName="Goiânia" heading={`Desentupidora de ${shortName} Perto de Mim`} variant={1} />
      <CtaBanner settings={settings} localName="Goiânia" heading={`Desentupidora de ${shortName} Perto de Mim`} variant={2} />

      <FaqSection faqs={faqs} />

      <CtaBanner settings={settings} localName="Goiânia" heading={`Desentupidora de ${shortName} Perto de Mim`} variant={1} />
      <CtaBanner settings={settings} localName="Goiânia" heading={`Desentupidora de ${shortName} Perto de Mim`} variant={2} />

      <Depoimentos />
      <ContatoSection settings={settings} whatsappUrl={whatsappUrl} />

      {/* Reference: "desentupidora de pia próxima de mim" */}
      <BairrosAtendidos
        neighborhoods={allNeighborhoods || []}
        localName="Goiânia"
        linkPrefix={service.slug}
        searchTerm={`desentupidora de ${shortNameLower} próxima de mim`}
      />

      <Footer />
    </>
  );
}
