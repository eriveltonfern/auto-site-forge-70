import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NeighborhoodPage from "./NeighborhoodPage";
import ServiceNeighborhoodPage from "./ServiceNeighborhoodPage";
import CityPage from "./CityPage";
import NotFound from "./NotFound";

/**
 * Smart router: given a slug like "setor-bueno", "hidrojateamento-setor-bueno",
 * or "desentupidora-em-trindade", determines the correct page to render.
 */
export default function DynamicSlugPage() {
  const { slug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["resolve_slug", slug],
    queryFn: async () => {
      // 1. Try direct neighborhood match
      const { data: neighborhood } = await supabase
        .from("neighborhoods")
        .select("slug")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();

      if (neighborhood) {
        return { type: "neighborhood" as const, neighborhoodSlug: slug! };
      }

      // 2. Try direct city match (slug like "desentupidora-em-trindade" or just city slug)
      const { data: city } = await supabase
        .from("cities")
        .select("slug")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();

      if (city) {
        return { type: "city" as const, citySlug: slug! };
      }

      // 3. Try service+neighborhood combo: check all services
      const { data: services } = await supabase
        .from("services")
        .select("slug")
        .eq("status", "published");

      if (services) {
        for (const service of services) {
          const prefix = `${service.slug}-`;
          if (slug!.startsWith(prefix)) {
            const remainingSlug = slug!.slice(prefix.length);
            if (remainingSlug) {
              const { data: nb } = await supabase
                .from("neighborhoods")
                .select("slug")
                .eq("slug", remainingSlug)
                .eq("status", "published")
                .maybeSingle();

              if (nb) {
                return {
                  type: "service_neighborhood" as const,
                  serviceSlug: service.slug,
                  neighborhoodSlug: remainingSlug,
                };
              }
            }
          }
        }
      }

      return { type: "not_found" as const };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return null;
  if (!data || data.type === "not_found") return <NotFound />;

  if (data.type === "neighborhood") {
    return <NeighborhoodPage />;
  }

  if (data.type === "city") {
    return <CityPage />;
  }

  return <ServiceNeighborhoodPage serviceSlug={data.serviceSlug!} neighborhoodSlug={data.neighborhoodSlug} />;
}
