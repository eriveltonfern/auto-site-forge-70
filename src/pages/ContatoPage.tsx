import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { SEOHead } from "@/components/SEOHead";
import { useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ContatoPage() {
  const { data: settings } = useSiteSettings();
  if (!settings) return null;

  return (
    <>
      <SEOHead
        title={`Entre em contato | ${settings.company_name}`}
        description={`Entre em contato com a ${settings.company_name}. Atendimento 24 horas em Goiânia pelo WhatsApp ou telefone.`}
      />
      <Header />
      <FloatingCTA />

      {/* Content — reference style: clean, side-by-side contact + map */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl">
          <h1 className="mb-6 text-3xl font-black text-foreground md:text-4xl">
            Entre em contato
          </h1>

          <p className="mb-2 text-muted-foreground leading-relaxed">
            Está procurando por "<strong className="text-foreground"><Link to="/" className="text-accent underline">empresa de desentupimento próxima a mim</Link></strong>" ou "<strong className="text-foreground">desentupimento urgente em Goiânia</strong>"?
          </p>
          <p className="mb-2 text-muted-foreground leading-relaxed">
            Prestamos atendimento imediato nos principais bairros da cidade e cidades-satélites. Seja qual for o tipo de entupimento, conte com a gente!
          </p>
          <p className="mb-8 font-bold text-foreground">
            Solicite seu orçamento agora mesmo — sem compromisso!
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: contact info */}
            <div>
              <h2 className="mb-6 text-2xl font-black text-foreground">Atendimento</h2>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-accent">Telefone</p>
                  <a href={getPhoneUrl(settings)} className="text-lg font-bold text-foreground underline underline-offset-2 hover:text-accent transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-accent">Whatsapp</p>
                  <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-foreground underline underline-offset-2 hover:text-accent transition-colors">
                    {settings.whatsapp || settings.phone}
                  </a>
                </div>
              </div>

              <Button variant="whatsapp" size="lg" asChild className="px-8 py-6 text-lg rounded-full">
                <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chamar Agora!
                </a>
              </Button>
            </div>

            {/* Right: Google Maps */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245855.47875963425!2d-49.44587820625!3d-16.686891499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef0a04b987d5d%3A0x8f24ac9b2b33bbe8!2sGoi%C3%A2nia%2C%20GO!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Desentupidora Goiânia"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
