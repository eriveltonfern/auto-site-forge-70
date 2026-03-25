import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription } from "@/lib/seo-helpers";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminBlogForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "", slug: "", category: "", summary: "", content: "",
    featured_image: "", seo_title: "", meta_description: "", status: "draft",
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          title: data.title, slug: data.slug, category: data.category || "",
          summary: data.summary || "", content: data.content || "",
          featured_image: data.featured_image || "",
          seo_title: data.seo_title || "", meta_description: data.meta_description || "",
          status: data.status,
        });
      });
    }
  }, [id, isNew]);

  const handleTitleChange = (title: string) => {
    const updates: any = { title };
    if (isNew || !form.slug) updates.slug = generateSlug(title);
    if (isNew || !form.seo_title) updates.seo_title = generateSeoTitle("post", title);
    if (isNew || !form.meta_description) updates.meta_description = generateMetaDescription("post", title);
    setForm((f) => ({ ...f, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    } else {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", id));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Post criado!" : "Post atualizado!" });
      navigate("/admin/blog");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">{isNew ? "Novo Post" : "Editar Post"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <Label>Categoria</Label>
            <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </div>
        </div>

        <div><Label>Resumo</Label><Textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} rows={3} /></div>
        <div><Label>Conteúdo</Label><Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={10} /></div>
        <div><Label>URL da Imagem Destacada</Label><Input value={form.featured_image} onChange={(e) => setForm((f) => ({ ...f, featured_image: e.target.value }))} /></div>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">SEO</h3>
          <div><Label>Título SEO</Label><Input value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} /></div>
          <div><Label>Meta Description</Label><Textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={2} /></div>
        </div>

        <div>
          <Label>Status</Label>
          <select className="mt-1 block w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground"
            value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="cta" disabled={loading}>{loading ? "Salvando..." : isNew ? "Criar Post" : "Salvar"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/blog")}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
