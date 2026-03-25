import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Upload } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Setores</h1>
          <p className="text-sm text-muted-foreground">{neighborhoods?.length || 0} setores cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/bairros/importar"><Upload className="h-4 w-4" /> Importar</Link>
          </Button>
          <Button variant="cta" asChild>
            <Link to="/admin/bairros/novo"><Plus className="h-4 w-4" /> Novo Setor</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Setor</th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground md:table-cell">Cidade</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Carregando...</td></tr>
            ) : neighborhoods?.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Nenhum setor cadastrado</td></tr>
            ) : (
              neighborhoods?.map((n: any) => (
                <tr key={n.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{n.name}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{n.cities?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${n.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {n.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/bairros/${n.id}`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm("Excluir este setor?")) deleteMutation.mutate(n.id);
                      }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
