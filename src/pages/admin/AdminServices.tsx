import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AdminServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: "Serviço excluído" });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Serviços</h1>
        <Link
          to="/admin/servicos/novo"
          className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[4px] border border-[#2271b1] hover:bg-[#135e96] transition-colors"
        >
          Adicionar Novo
        </Link>
      </div>

      <div className="text-[13px] text-[#50575e] mb-2">
        {services?.length || 0} item(s)
      </div>

      {/* WP-style table */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#c3c4c7]">
              <th className="px-2 py-2 text-left font-semibold text-[#1d2327]">Título</th>
              <th className="hidden md:table-cell px-2 py-2 text-left font-semibold text-[#1d2327]">Slug</th>
              <th className="px-2 py-2 text-left font-semibold text-[#1d2327]">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-2 py-6 text-center text-[#50575e]">Carregando...</td>
              </tr>
            ) : services?.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-2 py-6 text-center text-[#50575e]">Nenhum serviço encontrado.</td>
              </tr>
            ) : (
              services?.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-b border-[#f0f0f1] group ${
                    i % 2 === 0 ? "bg-white" : "bg-[#f6f7f7]"
                  } hover:bg-[#f0f6fc]`}
                >
                  <td className="px-2 py-2">
                    <div>
                      <Link
                        to={`/admin/servicos/${s.id}`}
                        className="text-[#2271b1] font-semibold hover:text-[#135e96] hover:underline"
                      >
                        {s.icon} {s.name}
                      </Link>
                      {/* Row actions — WP style */}
                      <div className="hidden group-hover:flex gap-2 mt-0.5 text-[12px]">
                         <Link
                          to={`/admin/servicos/${s.id}`}
                          className="text-[#2271b1] hover:text-[#135e96] hover:underline"
                         >
                           Editar
                         </Link>
                         <span className="text-[#c3c4c7]">|</span>
                         <a
                           href={`/servicos/${s.slug}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-[#2271b1] hover:text-[#135e96] hover:underline"
                         >
                           Ver
                         </a>
                         <span className="text-[#c3c4c7]">|</span>
                         <button
                           onClick={() => {
                             if (confirm("Excluir este serviço?")) deleteMutation.mutate(s.id);
                           }}
                           className="text-[#b32d2e] hover:text-[#a02122] hover:underline"
                         >
                           Excluir
                         </button>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-2 py-2 text-[#50575e]">{s.slug}</td>
                  <td className="px-2 py-2 text-[#50575e]">
                    {s.status === "published" ? (
                      <span className="text-[#00a32a]">Publicado</span>
                    ) : (
                      <span className="text-[#996800]">Rascunho</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
