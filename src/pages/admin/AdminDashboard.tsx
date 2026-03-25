import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Wrench, MapPin, Building, FileText, Globe } from "lucide-react";

export default function AdminDashboard() {
  const { data: servicesCount } = useQuery({
    queryKey: ["admin-services-count"],
    queryFn: async () => {
      const { count } = await supabase.from("services").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: citiesCount } = useQuery({
    queryKey: ["admin-cities-count"],
    queryFn: async () => {
      const { count } = await supabase.from("cities").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: neighborhoodsCount } = useQuery({
    queryKey: ["admin-neighborhoods-count"],
    queryFn: async () => {
      const { count } = await supabase.from("neighborhoods").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: postsCount } = useQuery({
    queryKey: ["admin-posts-count"],
    queryFn: async () => {
      const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const totalPages = (servicesCount || 0) + (citiesCount || 0) + (neighborhoodsCount || 0) + (postsCount || 0);

  const stats = [
    { label: "Serviços", count: servicesCount ?? 0, icon: Wrench, link: "/admin/servicos", color: "text-accent" },
    { label: "Cidades", count: citiesCount ?? 0, icon: MapPin, link: "/admin/cidades", color: "text-blue-500" },
    { label: "Bairros", count: neighborhoodsCount ?? 0, icon: Building, link: "/admin/bairros", color: "text-green-500" },
    { label: "Posts", count: postsCount ?? 0, icon: FileText, link: "/admin/blog", color: "text-purple-500" },
    { label: "Páginas Geradas", count: totalPages, icon: Globe, link: "#", color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do seu projeto</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} to={s.link} className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <s.icon className={`h-8 w-8 ${s.color}`} />
              <span className="font-display text-3xl font-black text-foreground">{s.count}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-foreground">Atalhos Rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Novo Serviço", link: "/admin/servicos/novo" },
            { label: "Nova Cidade", link: "/admin/cidades/novo" },
            { label: "Novo Bairro", link: "/admin/bairros/novo" },
            { label: "Novo Post", link: "/admin/blog/novo" },
          ].map((a) => (
            <Link key={a.label} to={a.link} className="rounded-lg border bg-card p-4 text-center text-sm font-semibold text-accent transition-all hover:shadow-sm hover:border-accent">
              + {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
