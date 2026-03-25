import { Link, useLocation } from "react-router-dom";
import { Phone, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { useSiteSettings, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/areas-atendidas", label: "Onde Atendemos" },
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
    <header className={`sticky top-0 z-40 border-b bg-card transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
      <nav className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-black text-primary shrink-0">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.company_name || ""} className="h-10 md:h-12" />
          ) : (
            <>🔧 {settings.company_name}</>
          )}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-5 py-2.5 text-sm font-bold text-whatsapp-foreground transition-transform hover:scale-105">
            <MessageCircle className="h-4 w-4" /> {settings.phone || "(62) 99999-9999"}
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground p-2 -mr-2" aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 lg:hidden animate-in slide-in-from-top-2 duration-200">
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
              <MessageCircle className="h-4 w-4" /> {settings.phone || "Fale no WhatsApp"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
