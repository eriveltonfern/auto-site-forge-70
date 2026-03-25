import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription, generateH1 } from "@/lib/seo-helpers";
import { Upload } from "lucide-react";

type ImportType = "cities" | "neighborhoods";

export default function AdminBulkImport({ type }: { type: ImportType }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [cityId, setCityId] = useState("");

  const { data: citiesList } = useQuery({
    queryKey: ["cities-for-import"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("id, name").order("name");
      return data || [];
    },
    enabled: type === "neighborhoods",
  });

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText(ev.target?.result as string || "");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) { toast({ title: "Lista vazia", variant: "destructive" }); return; }

    setLoading(true);

    if (type === "cities") {
      const items = lines.map((name) => {
        // Handle CSV: name,state
        const parts = name.split(",").map((p) => p.trim());
        const cityName = parts[0];
        const state = parts[1] || "GO";
        return {
          name: cityName,
          slug: generateSlug(cityName),
          state,
          seo_title: generateSeoTitle("city", cityName),
          meta_description: generateMetaDescription("city", cityName),
          h1: generateH1("city", cityName),
          base_content: `Se você está procurando uma desentupidora em ${cityName}, conte com atendimento rápido e profissional.`,
          status: "published" as const,
        };
      });

      const { error } = await supabase.from("cities").insert(items);
      setLoading(false);
      if (error) {
        toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
      } else {
        toast({ title: `${items.length} cidades importadas!` });
        navigate("/admin/cidades");
      }
    } else {
      if (!cityId) { toast({ title: "Selecione uma cidade", variant: "destructive" }); setLoading(false); return; }
      const cityName = citiesList?.find((c) => c.id === cityId)?.name || "";

      const items = lines.map((name) => ({
        name: name.replace(",", "").trim(),
        slug: generateSlug(name),
        city_id: cityId,
        seo_title: generateSeoTitle("neighborhood", name, cityName),
        meta_description: generateMetaDescription("neighborhood", name, cityName),
        h1: generateH1("neighborhood", name),
        base_content: `Atendemos diariamente o bairro ${name} em ${cityName}, oferecendo soluções rápidas para problemas de entupimento.`,
        status: "published" as const,
      }));

      const { error } = await supabase.from("neighborhoods").insert(items);
      setLoading(false);
      if (error) {
        toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
      } else {
        toast({ title: `${items.length} bairros importados!` });
        navigate("/admin/bairros");
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Importar {type === "cities" ? "Cidades" : "Bairros"} em Massa
      </h1>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        {type === "neighborhoods" && (
          <div>
            <Label>Cidade de destino *</Label>
            <select className="mt-1 block w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground"
              value={cityId} onChange={(e) => setCityId(e.target.value)}>
              <option value="">Selecione...</option>
              {citiesList?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        <div>
          <Label>Upload CSV</Label>
          <Input type="file" accept=".csv,.txt" onChange={handleCsvUpload} className="mt-1" />
        </div>

        <div>
          <Label>Ou cole a lista (um por linha)</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={type === "cities"
              ? "Goiânia\nAparecida de Goiânia, GO\nAnápolis"
              : "Setor Bueno\nSetor Marista\nJardim Goiás"
            }
          />
        </div>

        <div className="text-sm text-muted-foreground">
          {type === "cities"
            ? "Formato: nome da cidade (opcionalmente: nome, estado)"
            : "Formato: nome do bairro (um por linha)"
          }
          <br />
          O sistema gerará automaticamente: slug, título SEO, meta description, H1 e conteúdo base.
        </div>

        <div className="flex gap-3">
          <Button variant="cta" onClick={handleImport} disabled={loading || !text.trim()}>
            <Upload className="h-4 w-4" />
            {loading ? "Importando..." : `Importar ${text.split("\n").filter(Boolean).length} itens`}
          </Button>
          <Button variant="outline" onClick={() => navigate(type === "cities" ? "/admin/cidades" : "/admin/bairros")}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
