import { Link } from "react-router-dom";
import { MessageCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SEOHead, getLocalBusinessSchema, getFAQSchema } from "@/components/SEOHead";
import { useSiteSettings, useServices, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { ServiceCard } from "@/components/ServiceCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { CtaBanner, OutrosServicos, Vantagens, PorQueEscolher, FaqSection, Depoimentos, ContatoSection, BairrosAtendidos } from "@/components/SharedSections";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBgFallback from "@/assets/hero-bg.jpg";

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

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Index() {
  
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();

  const { data: neighborhoods } = useQuery({
    queryKey: ["all_neighborhoods"],
    queryFn: async () => {
      const { data } = await supabase
        .from("neighborhoods")
        .select("name, slug")
        .eq("status", "published")
        .order("name");
      return data || [];
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

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        </div>
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

      <OutrosServicos companyName={settings.company_name || "Desentupidora Goiânia"} />
      <CtaBanner settings={settings} localName="" variant={1} />
      <Vantagens />
      <PorQueEscolher localName="" companyName={settings.company_name || "Desentupidora Goiânia"} />
      <CtaBanner settings={settings} localName="" variant={2} />
      <FaqSection faqs={homeFaq} />
      <CtaBanner settings={settings} localName="" variant={1} />
      <Depoimentos />
      <ContatoSection settings={settings} />
      <BairrosAtendidos neighborhoods={neighborhoods || []} localName="" />

      <Footer />
      <SEOHead title="" description="" structuredData={getFAQSchema(homeFaq)} />
    </>
  );
}
