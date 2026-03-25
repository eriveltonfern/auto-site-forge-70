import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { SEOHead } from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/useSiteData";
import { Shield, Award, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <span>Sobre</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Sobre a {settings.company_name}</h1>
          <p className="mt-2 opacity-90">Conheça nossa história e compromisso com a qualidade.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-3xl">
          <p className="mb-6 text-muted-foreground leading-relaxed">
            A <strong className="text-foreground">{settings.company_name}</strong> é referência em serviços de desentupimento em Goiânia e região. Com anos de experiência no mercado, nossa equipe é formada por profissionais qualificados e equipados com as melhores ferramentas do setor.
          </p>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Atendemos residências, comércios e indústrias com agilidade, segurança e preço justo. Nosso compromisso é resolver o seu problema no menor tempo possível, sem causar danos ao seu imóvel.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Shield, title: "Segurança", desc: "Profissionais treinados e equipamentos modernos." },
              { icon: Award, title: "Garantia", desc: "Todos os serviços com garantia de qualidade." },
              { icon: Users, title: "Equipe Qualificada", desc: "Técnicos especializados e experientes." },
              { icon: Clock, title: "24 Horas", desc: "Atendimento a qualquer hora do dia ou da noite." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-1 font-display font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
