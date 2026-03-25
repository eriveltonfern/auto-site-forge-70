import { Phone, MessageCircle } from "lucide-react";
import { SITE_CONFIG, getWhatsAppUrl, getPhoneUrl } from "@/data/siteData";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <a
        href={getPhoneUrl()}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 animate-float"
        aria-label={`Ligar para ${SITE_CONFIG.phone}`}
      >
        <Phone className="h-6 w-6" />
      </a>
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110 animate-pulse-cta"
        aria-label="Fale no WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
