import { Link } from "react-router-dom";
import { SITE_CONFIG, getWhatsAppUrl, getPhoneUrl, services, cities } from "@/data/siteData";
import { Phone, MessageCircle, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="hero-bg text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 font-display text-lg font-bold">🔧 {SITE_CONFIG.name}</h3>
            <p className="text-sm opacity-80">Atendimento 24 horas em Goiânia e região. Serviços profissionais de desentupimento com garantia.</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href={getPhoneUrl()} className="flex items-center gap-2 opacity-90 hover:opacity-100">
                <Phone className="h-4 w-4" /> {SITE_CONFIG.phone}
              </a>
              <span className="flex items-center gap-2 opacity-90">
                <MapPin className="h-4 w-4" /> {SITE_CONFIG.address}
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider opacity-70">Serviços</h4>
            <ul className="space-y-1.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/servicos/${s.slug}`} className="opacity-80 hover:opacity-100 hover:underline">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider opacity-70">Cidades</h4>
            <ul className="space-y-1.5 text-sm">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link to={`/${c.slug}`} className="opacity-80 hover:opacity-100 hover:underline">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider opacity-70">Contato</h4>
            <div className="flex flex-col gap-3">
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-105">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={getPhoneUrl()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-3 text-sm font-bold transition-transform hover:scale-105">
                <Phone className="h-4 w-4" /> Ligar Agora
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs opacity-60">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
