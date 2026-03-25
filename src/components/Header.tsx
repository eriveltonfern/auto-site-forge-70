import { Link } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Clock, Menu, X } from "lucide-react";
import { SITE_CONFIG, getWhatsAppUrl, getPhoneUrl } from "@/data/siteData";
import { useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="hero-bg text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {SITE_CONFIG.hours}
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <MapPin className="h-3.5 w-3.5" />
              {SITE_CONFIG.address}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href={getPhoneUrl()} className="flex items-center gap-1 font-semibold hover:underline">
              <Phone className="h-3.5 w-3.5" />
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-xl font-black text-primary">
            🔧 {SITE_CONFIG.name}
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-accent transition-colors">Início</Link>
            <Link to="/servicos" className="text-sm font-medium text-foreground hover:text-accent transition-colors">Serviços</Link>
            <Link to="/goiania" className="text-sm font-medium text-foreground hover:text-accent transition-colors">Áreas Atendidas</Link>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-105">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t bg-card px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-3 pt-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Início</Link>
              <Link to="/servicos" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Serviços</Link>
              <Link to="/goiania" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Áreas Atendidas</Link>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground">
                <MessageCircle className="h-4 w-4" /> Fale no WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
