import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription, generateH1 } from "@/lib/seo-helpers";
import { Upload, X } from "lucide-react";

export default function AdminNeighborhoodForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: citiesList } = useQuery({
    queryKey: ["cities-list"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("id, name").order("name");
      return data || [];
    },
  });

  const [form, setForm] = useState({
    name: "", slug: "", city_id: "",
    seo_title: "", meta_description: "", h1: "",
    base_content: "", cover_image: "", status: "draft",
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("neighborhoods").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          name: data.name, slug: data.slug, city_id: data.city_id,
          seo_title: data.seo_title || "", meta_description: data.meta_description || "",
          h1: data.h1 || "", base_content: data.base_content || "",
          cover_image: (data as any).cover_image || "", status: data.status,
        });
      });
    }
  }, [id, isNew]);

  const handleNameChange = (name: string) => {
    const cityName = citiesList?.find((c) => c.id === form.city_id)?.name;
    const updates: any = { name };
    if (isNew || !form.slug) updates.slug = generateSlug(name);
    if (isNew || !form.seo_title) updates.seo_title = generateSeoTitle("neighborhood", name, cityName);
    if (isNew || !form.meta_description) updates.meta_description = generateMetaDescription("neighborhood", name, cityName);
    if (isNew || !form.h1) updates.h1 = generateH1("neighborhood", name);
    if (isNew || !form.base_content) {
      updates.base_content = `Atendemos diariamente o Setor ${name}${cityName ? ` em ${cityName}` : ""}, oferecendo soluções rápidas e profissionais para problemas de entupimento.`;
    }
    setForm((f) => ({ ...f, ...updates }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `neighborhoods/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      setForm((f) => ({ ...f, cover_image: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city_id) { toast({ title: "Selecione uma cidade", variant: "destructive" }); return; }
    setLoading(true);

    let error;
    if (isNew) {
      ({ error } = await supabase.from("neighborhoods").insert(form as any));
    } else {
      ({ error } = await supabase.from("neighborhoods").update(form as any).eq("id", id));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Setor criado!" : "Setor atualizado!" });
      navigate("/admin/bairros");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{isNew ? "Novo Setor" : "Editar Setor"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Nome do Setor *</Label>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <Label>Cidade *</Label>
            <select className="mt-1 block w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground"
              value={form.city_id} onChange={(e) => setForm((f) => ({ ...f, city_id: e.target.value }))} required>
              <option value="">Selecione...</option>
              {citiesList?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label>Imagem de Destaque</Label>
          {form.cover_image ? (
            <div className="relative mt-2 w-full max-w-md">
              <img src={form.cover_image} alt="Preview" className="h-48 w-full rounded-lg object-cover border" />
              <Button type="button" variant="destructive" size="icon"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={() => setForm((f) => ({ ...f, cover_image: "" }))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="mt-2 flex h-32 w-full max-w-md cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-accent transition-colors">
              <div className="text-center text-sm text-muted-foreground">
                <Upload className="mx-auto mb-1 h-6 w-6" />
                {uploading ? "Enviando..." : "Clique para enviar"}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          )}
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">SEO</h3>
          <div><Label>Título SEO</Label><Input value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} /></div>
          <div><Label>Meta Description</Label><Textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={2} /></div>
          <div><Label>H1</Label><Input value={form.h1} onChange={(e) => setForm((f) => ({ ...f, h1: e.target.value }))} /></div>
        </div>

        <div><Label>Conteúdo Base</Label><Textarea value={form.base_content} onChange={(e) => setForm((f) => ({ ...f, base_content: e.target.value }))} rows={4} /></div>

        <div>
          <Label>Status</Label>
          <select className="mt-1 block w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground"
            value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="cta" disabled={loading}>{loading ? "Salvando..." : isNew ? "Criar Setor" : "Salvar"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/bairros")}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
