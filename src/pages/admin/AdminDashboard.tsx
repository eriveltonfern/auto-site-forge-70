import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Wrench, MapPin, Building, FileText, Globe, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const { data: recentPosts } = useQuery({
    queryKey: ["admin-recent-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("id, title, status, created_at").order("created_at", { ascending: false }).limit(5);
      if (error) throw error;
      return data;
    },
  });

  const totalPages = (servicesCount || 0) + (citiesCount || 0) + (neighborhoodsCount || 0) + (postsCount || 0);

  const stats = [
    { label: "Serviços", count: servicesCount ?? 0, icon: Wrench, link: "/admin/servicos", bgColor: "bg-accent/10", iconColor: "text-accent" },
    { label: "Cidades", count: citiesCount ?? 0, icon: MapPin, link: "/admin/cidades", bgColor: "bg-blue-500/10", iconColor: "text-blue-500" },
    { label: "Setores", count: neighborhoodsCount ?? 0, icon: Building, link: "/admin/bairros", bgColor: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { label: "Posts", count: postsCount ?? 0, icon: FileText, link: "/admin/blog", bgColor: "bg-purple-500/10", iconColor: "text-purple-500" },
    { label: "Páginas Geradas", count: totalPages, icon: Globe, link: "#", bgColor: "bg-primary/10", iconColor: "text-primary" },
  ];

  const shortcuts = [
    { label: "Novo Serviço", link: "/admin/servicos/novo", icon: Wrench },
    { label: "Nova Cidade", link: "/admin/cidades/novo", icon: MapPin },
    { label: "Novo Setor", link: "/admin/bairros/novo", icon: Building },
    { label: "Novo Post", link: "/admin/blog/novo", icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do seu projeto de SEO programático</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} to={s.link}
            className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-accent/30">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bgColor}`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-3xl font-black text-foreground">{s.count}</span>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shortcuts */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Ações Rápidas</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {shortcuts.map((a) => (
              <Button key={a.label} variant="outline" asChild className="justify-start gap-3 h-12">
                <Link to={a.link}>
                  <a.icon className="h-4 w-4 text-accent" />
                  {a.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg font-bold text-foreground">Posts Recentes</h2>
            </div>
            <Link to="/admin/blog" className="text-xs font-medium text-accent hover:underline">Ver todos</Link>
          </div>
          {!recentPosts || recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nenhum post cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((p) => (
                <Link key={p.id} to={`/admin/blog/${p.id}`}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <span className="text-sm font-medium text-foreground truncate mr-3">{p.title}</span>
                  <span className={`shrink-0 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {p.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
