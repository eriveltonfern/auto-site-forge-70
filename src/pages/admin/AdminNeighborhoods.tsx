import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function AdminNeighborhoods() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ["admin-neighborhoods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("neighborhoods").select("*, cities(name)").order("name");
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("neighborhoods").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-neighborhoods"] });
      toast({ title: "Setor excluído" });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[23px] font-normal text-[#1d2327]">Setores</h1>
        <div className="flex gap-2">
          <Link to="/admin/bairros/importar" className="text-[13px] text-[#2271b1] border border-[#2271b1] rounded-[3px] px-3 py-[4px] hover:bg-[#f0f6fc] transition-colors">
            Importar
          </Link>
          <Link to="/admin/bairros/novo" className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[4px] border border-[#2271b1] hover:bg-[#135e96] transition-colors">
            Adicionar Novo
          </Link>
        </div>
      </div>

      <div className="text-[13px] text-[#50575e] mb-2">{neighborhoods?.length || 0} item(s)</div>

      <div className="bg-white border border-[#c3c4c7] shadow-sm">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#c3c4c7]">
              <th className="px-2 py-2 text-left font-semibold text-[#1d2327]">Setor</th>
              <th className="hidden md:table-cell px-2 py-2 text-left font-semibold text-[#1d2327]">Cidade</th>
              <th className="px-2 py-2 text-left font-semibold text-[#1d2327]">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="px-2 py-6 text-center text-[#50575e]">Carregando...</td></tr>
            ) : neighborhoods?.length === 0 ? (
              <tr><td colSpan={3} className="px-2 py-6 text-center text-[#50575e]">Nenhum setor encontrado.</td></tr>
            ) : (
              neighborhoods?.map((n: any, i: number) => (
                <tr key={n.id} className={`border-b border-[#f0f0f1] group ${i % 2 === 0 ? "bg-white" : "bg-[#f6f7f7]"} hover:bg-[#f0f6fc]`}>
                  <td className="px-2 py-2">
                    <div>
                      <Link to={`/admin/bairros/${n.id}`} className="text-[#2271b1] font-semibold hover:text-[#135e96] hover:underline">
                        {n.name}
                      </Link>
                      <div className="hidden group-hover:flex gap-2 mt-0.5 text-[12px]">
                        <Link to={`/admin/bairros/${n.id}`} className="text-[#2271b1] hover:text-[#135e96] hover:underline">Editar</Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <a href={`/${n.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#2271b1] hover:text-[#135e96] hover:underline">Ver</a>
                        <span className="text-[#c3c4c7]">|</span>
                        <button onClick={() => { if (confirm("Excluir este setor?")) deleteMutation.mutate(n.id); }} className="text-[#b32d2e] hover:text-[#a02122] hover:underline">Excluir</button>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-2 py-2 text-[#50575e]">{n.cities?.name}</td>
                  <td className="px-2 py-2 text-[#50575e]">
                    {n.status === "published" ? <span className="text-[#00a32a]">Publicado</span> : <span className="text-[#996800]">Rascunho</span>}
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
