import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { SEOHead } from "@/components/SEOHead";
import { useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ContatoPage() {
  const { data: settings } = useSiteSettings();
  if (!settings) return null;

  return (
    <>
      <SEOHead
        title={`Contato | ${settings.company_name}`}
        description={`Entre em contato com a ${settings.company_name}. Atendimento 24 horas em Goiânia pelo WhatsApp ou telefone.`}
      />
      <Header />
      <FloatingCTA />

      <section className="hero-bg py-12">
        <div className="container text-primary-foreground">
          <nav className="mb-4 text-sm opacity-70">
            <Link to="/" className="hover:underline">Início</Link> {" > "}
            <span>Contato</span>
          </nav>
          <h1 className="text-3xl font-black md:text-4xl">Contato</h1>
          <p className="mt-2 opacity-90">Fale conosco agora mesmo e resolva seu problema com rapidez.</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
              <Phone className="mx-auto mb-3 h-8 w-8 text-accent" />
              <p className="text-sm text-muted-foreground mb-1">Telefone</p>
              <a href={getPhoneUrl(settings)} className="font-display text-lg font-bold text-foreground hover:text-accent transition-colors">
                {settings.phone}
              </a>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm text-center">
              <MessageCircle className="mx-auto mb-3 h-8 w-8 text-accent" />
              <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer" className="font-display text-lg font-bold text-foreground hover:text-accent transition-colors">
                {settings.whatsapp || settings.phone}
              </a>
            </div>
          </div>

          {settings.email && (
            <div className="rounded-xl border bg-card p-6 shadow-sm mb-4 flex items-center gap-4">
              <Mail className="h-6 w-6 text-accent shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <a href={`mailto:${settings.email}`} className="font-medium text-foreground hover:text-accent transition-colors">{settings.email}</a>
              </div>
            </div>
          )}

          {settings.address && (
            <div className="rounded-xl border bg-card p-6 shadow-sm mb-4 flex items-center gap-4">
              <MapPin className="h-6 w-6 text-accent shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium text-foreground">{settings.address}</p>
              </div>
            </div>
          )}

          {settings.business_hours && (
            <div className="rounded-xl border bg-card p-6 shadow-sm mb-8 flex items-center gap-4">
              <Clock className="h-6 w-6 text-accent shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium text-foreground">{settings.business_hours}</p>
              </div>
            </div>
          )}

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
