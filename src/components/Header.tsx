import { Link, useLocation } from "react-router-dom";
import { Phone, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { useSiteSettings, useServices, getWhatsAppUrl, getPhoneUrl } from "@/hooks/useSiteData";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { to: "/servicos", label: "Serviços", hasDropdown: true },
  { to: "/areas-atendidas", label: "Onde Atendemos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div key={link.to} className="relative" ref={link.hasDropdown ? dropdownRef : undefined}>
              {link.hasDropdown ? (
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/servicos")
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {link.label}
                  <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <Link
                  to={link.to}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {link.label}
                </Link>
              )}

              {/* Dropdown */}
              {link.hasDropdown && servicesOpen && services && (
                <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border bg-card shadow-lg py-2">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/servicos/${s.slug}`}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent transition-colors"
                    >
                      {s.name}
                    </Link>
                  ))}
                  <div className="border-t my-1" />
                  <Link
                    to="/servicos"
                    className="block px-4 py-2 text-sm font-semibold text-accent hover:bg-muted transition-colors"
                  >
                    Ver todos os serviços
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:scale-105">
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
              <div key={link.to}>
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        location.pathname.startsWith("/servicos")
                          ? "bg-accent/10 text-accent"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {servicesOpen && services && (
                      <div className="ml-4 space-y-1 py-1">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/servicos/${s.slug}`}
                            className="block rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors block ${
                      location.pathname === link.to
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <a href={getWhatsAppUrl(settings)} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-accent-foreground">
              <MessageCircle className="h-4 w-4" /> {settings.phone || "Fale no WhatsApp"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
