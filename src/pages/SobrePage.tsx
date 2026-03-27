import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { SEOHead } from "@/components/SEOHead";
import { useSiteSettings, getWhatsAppUrl } from "@/hooks/useSiteData";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBgFallback from "@/assets/hero-bg-2.png";

export default function SobrePage() {
  const { data: settings } = useSiteSettings();
  if (!settings) return null;

  return (
    <>
      <SEOHead
        title={`Sobre | ${settings.company_name}`}
        description={`Conheça a ${settings.company_name}, empresa especializada em desentupimento em Goiânia com atendimento 24 horas.`}
      />
      <Header />
      <FloatingCTA />

      {/* Hero with uploaded image */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="text-3xl font-black md:text-5xl">
              Sobre a {settings.company_name}
            </h1>
            <p className="mt-3 text-lg opacity-90">
              Conheça nossa história e compromisso com a qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Content — clean editorial style */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl">
          <p className="mb-6 text-muted-foreground leading-relaxed text-lg">
            A <strong className="text-foreground">{settings.company_name}</strong> é referência em serviços de desentupimento em Goiânia e região. Com anos de experiência no mercado, nossa equipe é formada por profissionais qualificados e equipados com as melhores ferramentas do setor.
          </p>
          <p className="mb-6 text-muted-foreground leading-relaxed text-lg">
            Atendemos residências, comércios e indústrias com agilidade, segurança e preço justo. Nosso compromisso é resolver o seu problema no menor tempo possível, sem causar danos ao seu imóvel.
          </p>
          <p className="mb-6 text-muted-foreground leading-relaxed text-lg">
            Utilizamos tecnologia de ponta, incluindo hidrojateamento, câmeras de inspeção e equipamentos de alta pressão, garantindo diagnóstico preciso e solução eficaz para qualquer tipo de entupimento.
          </p>
          <p className="mb-8 text-muted-foreground leading-relaxed text-lg">
            Nossa equipe está disponível <strong className="text-foreground">24 horas por dia, 7 dias por semana</strong>, para atender emergências e serviços programados em toda Goiânia e região metropolitana.
          </p>

          <h2 className="mb-4 text-2xl font-black text-foreground">Nossos diferenciais</h2>
          <ul className="mb-8 space-y-3 text-muted-foreground text-lg">
            <li>✅ Atendimento 24 horas, inclusive feriados</li>
            <li>✅ Equipe técnica treinada e uniformizada</li>
            <li>✅ Equipamentos modernos e de alta performance</li>
            <li>✅ Orçamento sem compromisso</li>
            <li>✅ Garantia em todos os serviços</li>
            <li>✅ Sem quebra de pisos ou paredes</li>
            <li>✅ Pagamento facilitado (Pix, cartões, transferência)</li>
          </ul>

          <div className="text-center">
            <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chamar Agora!
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
