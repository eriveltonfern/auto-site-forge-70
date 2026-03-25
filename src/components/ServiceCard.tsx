import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { DbService } from "@/hooks/useSiteData";

interface ServiceCardProps {
  service: DbService;
  /** Compact mode for city/neighborhood sidebars */
  compact?: boolean;
  /** Optional CTA whatsapp URL */
  whatsappUrl?: string;
  /** Optional city context label */
  cityLabel?: string;
}

export function ServiceCard({ service, compact = false, whatsappUrl, cityLabel }: ServiceCardProps) {
  if (compact) {
    return (
      <Link
        to={`/servicos/${service.slug}`}
        className="group flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:shadow-sm hover:border-accent"
      >
        {service.cover_image ? (
          <OptimizedImage
            src={service.cover_image}
            alt={service.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-xl">
            {service.icon || "🔧"}
          </span>
        )}
        <div>
          <h3 className="font-display text-sm font-bold text-foreground group-hover:text-accent transition-colors">
            {service.name}
          </h3>
          {cityLabel && <p className="text-xs text-muted-foreground">{cityLabel}</p>}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/servicos/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      {service.cover_image ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={service.cover_image}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-accent/5">
          <span className="text-5xl">{service.icon || "🔧"}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-display text-lg font-bold text-foreground group-hover:text-accent transition-colors">
          {service.name}
        </h3>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
          {service.short_description}
        </p>
        {whatsappUrl ? (
          <Button
            variant="cta"
            size="sm"
            asChild
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Solicitar Orçamento
            </a>
          </Button>
        ) : (
          <span className="mt-auto text-sm font-semibold text-accent">
            Saiba mais →
          </span>
        )}
      </div>
    </Link>
  );
}
