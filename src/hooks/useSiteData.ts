import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbService = Tables<"services">;
export type DbCity = Tables<"cities">;
export type DbNeighborhood = Tables<"neighborhoods">;
export type DbBlogPost = Tables<"blog_posts">;
export type DbSettings = Tables<"site_settings">;

// Site settings with fallback defaults
const DEFAULT_SETTINGS: DbSettings = {
  id: "",
  company_name: "Desentupidora Goiânia",
  phone: "(62) 99999-9999",
  whatsapp: "5562999999999",
  whatsapp_message: "Olá! Preciso de um serviço de desentupimento. Podem me ajudar?",
  address: "Goiânia, GO",
  business_hours: "24 horas - 7 dias por semana",
  email: null,
  logo_url: null,
  favicon_url: null,
  global_scripts: null,
  hero_image: null,
  created_at: "",
  updated_at: "",
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data || DEFAULT_SETTINGS;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useServices(onlyPublished = true) {
  return useQuery({
    queryKey: ["services", onlyPublished],
    queryFn: async () => {
      let q = supabase.from("services").select("*").order("sort_order", { ascending: true });
      if (onlyPublished) q = q.eq("status", "published");
      const { data, error } = await q;
      if (error) throw error;
      return data as DbService[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useServiceBySlug(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as DbService | null;
    },
    enabled: !!slug,
  });
}

export function useCities(onlyPublished = true) {
  return useQuery({
    queryKey: ["cities", onlyPublished],
    queryFn: async () => {
      let q = supabase.from("cities").select("*").order("name");
      if (onlyPublished) q = q.eq("status", "published");
      const { data, error } = await q;
      if (error) throw error;
      return data as DbCity[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCityBySlug(slug: string) {
  return useQuery({
    queryKey: ["city", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as DbCity | null;
    },
    enabled: !!slug,
  });
}

export function useNeighborhoodsByCity(cityId: string | undefined) {
  return useQuery({
    queryKey: ["neighborhoods", cityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*")
        .eq("city_id", cityId!)
        .eq("status", "published")
        .order("name");
      if (error) throw error;
      return data as DbNeighborhood[];
    },
    enabled: !!cityId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useNeighborhoodBySlug(slug: string) {
  return useQuery({
    queryKey: ["neighborhood", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("neighborhoods")
        .select("*, cities(*)")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as (DbNeighborhood & { cities: DbCity }) | null;
    },
    enabled: !!slug,
  });
}

export function useCitiesWithNeighborhoodCount() {
  return useQuery({
    queryKey: ["cities_with_count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*, neighborhoods(count)")
        .eq("status", "published")
        .order("name");
      if (error) throw error;
      return (data || []).map((c: any) => ({
        ...c,
        neighborhoodCount: c.neighborhoods?.[0]?.count || 0,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Helper functions that work with settings data
export function getWhatsAppUrl(settings: DbSettings, message?: string) {
  const msg = encodeURIComponent(message || settings.whatsapp_message || "");
  return `https://wa.me/${settings.whatsapp}?text=${msg}`;
}

export function getPhoneUrl(settings: DbSettings) {
  const raw = (settings.phone || "").replace(/\D/g, "");
  return `tel:+55${raw}`;
}

// SEO content generators (same logic as before, now using DB data)
export function generateCityContent(cityName: string) {
  return {
    title: `Desentupidora em ${cityName} | Atendimento Rápido 24h`,
    metaDescription: `Desentupidora em ${cityName} com atendimento rápido 24h. Serviços de desentupimento de pia, vaso, esgoto e mais. Ligue agora ou fale no WhatsApp.`,
    h1: `Desentupidora em ${cityName}`,
    intro: `Procurando uma desentupidora em ${cityName}? Conte com atendimento rápido, profissional e disponível 24 horas por dia. Nossa equipe está pronta para resolver qualquer tipo de entupimento com agilidade e segurança.`,
    whyUs: `Somos referência em desentupimento em ${cityName}. Com equipamentos modernos e técnicos experientes, garantimos a solução mais rápida e eficiente para o seu problema.`,
  };
}

export function generateNeighborhoodContent(neighborhoodName: string, cityName: string) {
  return {
    title: `Desentupidora no Setor ${neighborhoodName}, ${cityName} | Atendimento Imediato`,
    metaDescription: `Desentupidora no Setor ${neighborhoodName} em ${cityName}. Atendimento rápido e profissional. Desentupimento de pia, vaso, esgoto e mais. Fale no WhatsApp.`,
    h1: `Desentupidora no Setor ${neighborhoodName}`,
    intro: `Atendemos diariamente o Setor ${neighborhoodName} em ${cityName}, oferecendo soluções rápidas e profissionais para problemas de entupimento. Nossa equipe chega em minutos!`,
    responseTime: "Tempo estimado de chegada: 20 a 40 minutos",
  };
}
