import { Link } from "react-router-dom";
import { useSiteSettings, useServices, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const { data: settings } = useSiteSettings();

  if (!settings) return null;

  return (
    <footer className="border-t border-border bg-foreground text-background">
      {/* Logo centered */}
      <div className="container py-8 flex justify-center">
        <div className="text-center">
          <Link to="/" className="inline-block">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name || ""} className="h-12 w-auto mx-auto" loading="lazy" />
            ) : (
              <span className="font-display text-xl font-black">🔧 {settings.company_name}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Links úteis */}
      <div className="border-t border-background/10">
        <div className="container py-6 text-center">
          <h4 className="mb-3 font-display text-sm font-bold">Links úteis</h4>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm opacity-70">
            <Link to="/sobre" className="hover:opacity-100 hover:underline transition-opacity">Sobre</Link>
            <Link to="/onde-atendemos" className="hover:opacity-100 hover:underline transition-opacity">Onde Atendemos</Link>
            <Link to="/servicos" className="hover:opacity-100 hover:underline transition-opacity">Serviços</Link>
            <Link to="/blog" className="hover:opacity-100 hover:underline transition-opacity">Blog</Link>
            <Link to="/contato" className="hover:opacity-100 hover:underline transition-opacity">Contato</Link>
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-background/10">
        <div className="container py-4 text-center text-xs opacity-50">
          <p>© {new Date().getFullYear()} {settings.company_name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
