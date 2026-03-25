import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription, generateH1 } from "@/lib/seo-helpers";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminCityForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", slug: "", state: "GO",
    seo_title: "", meta_description: "", h1: "",
    base_content: "", cover_image: "", status: "draft",
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("cities").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          name: data.name, slug: data.slug, state: data.state,
          seo_title: data.seo_title || "", meta_description: data.meta_description || "",
          h1: data.h1 || "", base_content: data.base_content || "",
          cover_image: (data as any).cover_image || "",
          status: data.status,
        });
      });
    }
  }, [id, isNew]);

  const handleNameChange = (name: string) => {
    const updates: any = { name };
    if (isNew || !form.slug) updates.slug = generateSlug(name);
    if (isNew || !form.seo_title) updates.seo_title = generateSeoTitle("city", name);
    if (isNew || !form.meta_description) updates.meta_description = generateMetaDescription("city", name);
    if (isNew || !form.h1) updates.h1 = generateH1("city", name);
    if (isNew || !form.base_content) {
      updates.base_content = `Se você está procurando uma desentupidora em ${name}, conte com atendimento rápido e profissional. Nossa equipe está disponível 24 horas por dia para resolver qualquer tipo de entupimento com agilidade e segurança.`;
    }
    setForm((f) => ({ ...f, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form, cover_image: form.cover_image || null };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("cities").insert(payload));
    } else {
      ({ error } = await supabase.from("cities").update(payload).eq("id", id));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Cidade criada!" : "Cidade atualizada!" });
      navigate("/admin/cidades");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{isNew ? "Nova Cidade" : "Editar Cidade"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Nome da Cidade *</Label>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <Label>Estado</Label>
            <Input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">Imagem de Destaque</h3>
          <Input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const compressed = await compressImageToWebP(file);
              const path = `cities/cover-${Date.now()}.webp`;
              const { error } = await supabase.storage.from("uploads").upload(path, compressed, { contentType: "image/webp" });
              if (error) { toast({ title: "Erro no upload", description: error.message, variant: "destructive" }); return; }
              const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
              setForm((f) => ({ ...f, cover_image: urlData.publicUrl }));
              toast({ title: "Imagem enviada!" });
            }}
          />
          {form.cover_image && (
            <div className="relative">
              <img src={form.cover_image} alt="Destaque" className="mt-2 h-40 w-full rounded-lg object-cover" />
              <Button type="button" variant="ghost" size="sm" className="absolute top-3 right-1 text-destructive bg-card/80"
                onClick={() => setForm((f) => ({ ...f, cover_image: "" }))}>Remover</Button>
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">SEO</h3>
          <div><Label>Título SEO</Label><Input value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} /></div>
          <div><Label>Meta Description</Label><Textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={2} /></div>
          <div><Label>H1</Label><Input value={form.h1} onChange={(e) => setForm((f) => ({ ...f, h1: e.target.value }))} /></div>
        </div>

        <div><Label>Conteúdo Base</Label><Textarea value={form.base_content} onChange={(e) => setForm((f) => ({ ...f, base_content: e.target.value }))} rows={5} /></div>

        <div>
          <Label>Status</Label>
          <select className="mt-1 block w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground"
            value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="cta" disabled={loading}>{loading ? "Salvando..." : isNew ? "Criar Cidade" : "Salvar"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/cidades")}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
