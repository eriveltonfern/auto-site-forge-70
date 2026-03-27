import { Link } from "react-router-dom";
import { useSiteSettings, useServices, useCities, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();

  const { data: neighborhoods } = useQuery({
    queryKey: ["footer_neighborhoods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("name, slug")
        .eq("status", "published")
        .order("name")
        .limit(20);
      if (error) throw error;
      return data || [];
    },
  });

  if (!settings) return null;

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold">🔧 {settings.company_name}</h3>
            <p className="mb-4 text-sm leading-relaxed opacity-70">
              Atendimento 24 horas em Goiânia e região. Serviços profissionais de desentupimento com garantia e preço justo.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href={getPhoneUrl(settings)} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4 shrink-0" /> {settings.phone}
              </a>
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <Mail className="h-4 w-4 shrink-0" /> {settings.email}
                </a>
              )}
              <span className="flex items-center gap-2 opacity-80">
                <MapPin className="h-4 w-4 shrink-0" /> {settings.address}
              </span>
              <span className="flex items-center gap-2 opacity-80">
                <Clock className="h-4 w-4 shrink-0" /> {settings.business_hours}
              </span>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-60">Serviços</h4>
            <ul className="space-y-2 text-sm">
              {(services || []).slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link to={`/servicos/${s.slug}`} className="opacity-70 hover:opacity-100 hover:underline transition-opacity">{s.name}</Link>
                </li>
              ))}
              {(services || []).length > 8 && (
                <li>
                  <Link to="/servicos" className="font-medium opacity-80 hover:opacity-100 hover:underline transition-opacity">Ver todos →</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Bairros */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-60">Onde Atendemos</h4>
            <ul className="space-y-2 text-sm">
              {(neighborhoods || []).slice(0, 10).map((n) => (
                <li key={n.slug}>
                  <Link to={`/${n.slug}`} className="opacity-70 hover:opacity-100 hover:underline transition-opacity">{n.name}</Link>
                </li>
              ))}
              {(neighborhoods || []).length > 10 && (
                <li>
                  <Link to="/onde-atendemos" className="font-medium opacity-80 hover:opacity-100 hover:underline transition-opacity">Ver todos →</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contato Rápido */}
          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider opacity-60">Contato Rápido</h4>
            <p className="mb-4 text-sm opacity-70">Precisa de ajuda agora? Fale com nossa equipe!</p>
            <div className="flex flex-col gap-3">
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-105">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={getPhoneUrl(settings)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-background/30 px-4 py-3 text-sm font-bold transition-transform hover:scale-105">
                <Phone className="h-4 w-4" /> Ligar Agora
              </a>
            </div>
            <div className="mt-4">
              <Link to="/blog" className="text-sm opacity-70 hover:opacity-100 hover:underline transition-opacity">📝 Blog</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-background/20 pt-6 text-center text-xs opacity-50">
          <p>© {new Date().getFullYear()} {settings.company_name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
