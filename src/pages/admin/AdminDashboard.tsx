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
    { label: "Serviços", count: servicesCount ?? 0, icon: Wrench, link: "/admin/servicos", color: "#2271b1" },
    { label: "Cidades", count: citiesCount ?? 0, icon: MapPin, link: "/admin/cidades", color: "#d63638" },
    { label: "Setores", count: neighborhoodsCount ?? 0, icon: Building, link: "/admin/bairros", color: "#00a32a" },
    { label: "Posts", count: postsCount ?? 0, icon: FileText, link: "/admin/blog", color: "#dba617" },
    { label: "Total Páginas", count: totalPages, icon: Globe, link: "#", color: "#3582c4" },
  ];

  return (
    <div>
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">Painel</h1>

      {/* Welcome box — WP style */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm mb-5 p-4">
        <h2 className="text-[14px] font-semibold text-[#1d2327] mb-2">Bem-vindo ao seu painel!</h2>
        <p className="text-[13px] text-[#50575e]">Use o menu lateral para gerenciar serviços, cidades, setores e posts do blog.</p>
      </div>

      {/* At a Glance — WP style */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="bg-white border border-[#c3c4c7] shadow-sm">
          <h2 className="text-[14px] font-semibold text-[#1d2327] px-3 py-2 border-b border-[#c3c4c7]">
            Resumo
          </h2>
          <div className="p-3">
            <ul className="space-y-1">
              {stats.map((s) => (
                <li key={s.label}>
                  <Link
                    to={s.link}
                    className="flex items-center gap-2 py-1 text-[13px] text-[#2271b1] hover:text-[#135e96] hover:underline"
                  >
                    <s.icon className="h-4 w-4" style={{ color: s.color }} />
                    <span className="font-semibold text-[#1d2327] mr-1">{s.count}</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm">
          <h2 className="text-[14px] font-semibold text-[#1d2327] px-3 py-2 border-b border-[#c3c4c7]">
            Ações Rápidas
          </h2>
          <div className="p-3 space-y-1">
            {[
              { label: "Adicionar Serviço", link: "/admin/servicos/novo" },
              { label: "Adicionar Cidade", link: "/admin/cidades/novo" },
              { label: "Adicionar Setor", link: "/admin/bairros/novo" },
              { label: "Adicionar Post", link: "/admin/blog/novo" },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.link}
                className="block py-1 text-[13px] text-[#2271b1] hover:text-[#135e96] hover:underline"
              >
                + {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts — WP Activity style */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm mt-5">
        <h2 className="text-[14px] font-semibold text-[#1d2327] px-3 py-2 border-b border-[#c3c4c7]">
          Atividade
        </h2>
        <div className="p-3">
          {!recentPosts || recentPosts.length === 0 ? (
            <p className="text-[13px] text-[#50575e] py-2">Nenhum post cadastrado ainda.</p>
          ) : (
            <ul className="space-y-1">
              {recentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-1">
                  <Link
                    to={`/admin/blog/${p.id}`}
                    className="text-[13px] text-[#2271b1] hover:text-[#135e96] hover:underline truncate mr-3"
                  >
                    {p.title}
                  </Link>
                  <span
                    className={`shrink-0 text-[11px] px-1.5 py-0.5 rounded ${
                      p.status === "published"
                        ? "bg-[#00a32a]/10 text-[#00a32a]"
                        : "bg-[#dba617]/10 text-[#996800]"
                    }`}
                  >
                    {p.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
