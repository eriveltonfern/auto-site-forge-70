import { Link } from "react-router-dom";
import { useSiteSettings, useServices, useCities, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();
  const { data: cities } = useCities();

  if (!settings) return null;

  return (
    <footer className="hero-bg text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold">🔧 {settings.company_name}</h3>
            <p className="mb-4 text-sm leading-relaxed opacity-80">
              Atendimento 24 horas em Goiânia e região. Serviços profissionais de desentupimento com garantia e preço justo.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href={getPhoneUrl(settings)} className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4 shrink-0" /> {settings.phone}
              </a>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                  <Mail className="h-4 w-4 shrink-0" /> {settings.email}
                </a>
              )}
              <span className="flex items-center gap-2 opacity-90">
                <MapPin className="h-4 w-4 shrink-0" /> {settings.address}
              </span>
              <span className="flex items-center gap-2 opacity-90">
                <Clock className="h-4 w-4 shrink-0" /> {settings.business_hours}
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-70">Serviços</h4>
            <ul className="space-y-2 text-sm">
              {(services || []).slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link to={`/servicos/${s.slug}`} className="opacity-80 hover:opacity-100 hover:underline transition-opacity">{s.name}</Link>
                </li>
              ))}
              {(services || []).length > 8 && (
                <li>
                  <Link to="/servicos" className="font-medium opacity-90 hover:opacity-100 hover:underline transition-opacity">Ver todos →</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-70">Cidades</h4>
            <ul className="space-y-2 text-sm">
              {(cities || []).map((c) => (
                <li key={c.slug}>
                  <Link to={`/${c.slug}`} className="opacity-80 hover:opacity-100 hover:underline transition-opacity">{c.name}</Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-6 mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-70">Blog</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Ver artigos</Link>
              </li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-70">Contato Rápido</h4>
            <p className="mb-4 text-sm opacity-80">Precisa de ajuda agora? Fale com nossa equipe!</p>
            <div className="flex flex-col gap-3">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-105">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={getPhoneUrl(settings)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-3 text-sm font-bold transition-transform hover:scale-105">
                <Phone className="h-4 w-4" /> Ligar Agora
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/20 pt-6 flex flex-col items-center gap-2 text-center text-xs opacity-60">
          <p>© {new Date().getFullYear()} {settings.company_name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
