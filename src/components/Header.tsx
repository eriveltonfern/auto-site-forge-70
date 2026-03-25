import { Link, useLocation } from "react-router-dom";
import { Phone, MessageCircle, MapPin, Clock, Menu, X } from "lucide-react";
import { useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/goiania", label: "Áreas Atendidas" },
  { to: "/blog", label: "Blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!settings) return null;

  return (
    <header className="sticky top-0 z-40">
      {/* Top bar */}
      <div className="hero-bg text-primary-foreground">
        <div className="container flex items-center justify-between py-2 text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {settings.business_hours}
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <MapPin className="h-3.5 w-3.5" />
              {settings.address}
            </span>
          </div>
          <a href={getPhoneUrl(settings)} className="flex items-center gap-1.5 font-semibold text-accent hover:underline">
            <Phone className="h-3.5 w-3.5" />
            Ligar Agora
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`border-b bg-card transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-xl font-black text-primary">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name || ""} className="h-10" />
            ) : (
              <>🔧 {settings.company_name}</>
            )}
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-accent/10 text-accent"
                    : "text-foreground hover:bg-muted hover:text-accent"
                }`}>
                {link.label}
              </Link>
            ))}
            <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
              className="ml-3 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-105">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-2 -mr-2" aria-label="Menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t bg-card px-4 pb-4 md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-muted"
                  }`}>
                  {link.label}
                </Link>
              ))}
              <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-whatsapp-foreground">
                <MessageCircle className="h-4 w-4" /> Fale no WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
