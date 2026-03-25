import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription, generateH1 } from "@/lib/seo-helpers";

export default function AdminServiceForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", slug: "", seo_title: "", meta_description: "", h1: "",
    short_description: "", long_description: "", icon: "🔧",
    keywords: "", problems: "", benefits: "",
    faq: [{ question: "", answer: "" }],
    status: "draft" as string,
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from("services").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name, slug: data.slug,
            seo_title: data.seo_title || "", meta_description: data.meta_description || "",
            h1: data.h1 || "", short_description: data.short_description || "",
            long_description: data.long_description || "", icon: data.icon || "🔧",
            keywords: (data.keywords || []).join(", "),
            problems: (data.problems || []).join("\n"),
            benefits: (data.benefits || []).join("\n"),
            faq: (data.faq as any[] || []).length > 0 ? (data.faq as any[]) : [{ question: "", answer: "" }],
            status: data.status,
          });
        }
      });
    }
  }, [id, isNew]);

  const handleNameChange = (name: string) => {
    const updates: any = { name };
    if (isNew || !form.slug) updates.slug = generateSlug(name);
    if (isNew || !form.seo_title) updates.seo_title = generateSeoTitle("service", name);
    if (isNew || !form.meta_description) updates.meta_description = generateMetaDescription("service", name);
    if (isNew || !form.h1) updates.h1 = generateH1("service", name);
    setForm((f) => ({ ...f, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name, slug: form.slug,
      seo_title: form.seo_title, meta_description: form.meta_description,
      h1: form.h1, short_description: form.short_description,
      long_description: form.long_description, icon: form.icon,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      problems: form.problems.split("\n").map((p) => p.trim()).filter(Boolean),
      benefits: form.benefits.split("\n").map((b) => b.trim()).filter(Boolean),
      faq: form.faq.filter((f) => f.question && f.answer),
      status: form.status,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("services").insert(payload));
    } else {
      ({ error } = await supabase.from("services").update(payload).eq("id", id));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Serviço criado!" : "Serviço atualizado!" });
      navigate("/admin/servicos");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">
        {isNew ? "Novo Serviço" : "Editar Serviço"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Nome do Serviço *</Label>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <Label>Ícone (emoji)</Label>
            <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
          </div>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <h3 className="font-display text-sm font-bold text-foreground">SEO (gerado automaticamente)</h3>
          <div>
            <Label>Título SEO</Label>
            <Input value={form.seo_title} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} />
          </div>
          <div>
            <Label>Meta Description</Label>
            <Textarea value={form.meta_description} onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))} rows={2} />
          </div>
          <div>
            <Label>H1</Label>
            <Input value={form.h1} onChange={(e) => setForm((f) => ({ ...f, h1: e.target.value }))} />
          </div>
        </div>

        <div>
          <Label>Descrição Curta</Label>
          <Textarea value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} rows={2} />
        </div>

        <div>
          <Label>Descrição Longa</Label>
          <Textarea value={form.long_description} onChange={(e) => setForm((f) => ({ ...f, long_description: e.target.value }))} rows={5} />
        </div>

        <div>
          <Label>Palavras-chave (separadas por vírgula)</Label>
          <Input value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
        </div>

        <div>
          <Label>Problemas comuns (um por linha)</Label>
          <Textarea value={form.problems} onChange={(e) => setForm((f) => ({ ...f, problems: e.target.value }))} rows={4} />
        </div>

        <div>
          <Label>Benefícios (um por linha)</Label>
          <Textarea value={form.benefits} onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))} rows={4} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>FAQ</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, faq: [...f.faq, { question: "", answer: "" }] }))}>
              + Adicionar Pergunta
            </Button>
          </div>
          {form.faq.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-lg border p-3">
              <Input placeholder="Pergunta" value={item.question}
                onChange={(e) => setForm((f) => ({ ...f, faq: f.faq.map((q, j) => j === i ? { ...q, question: e.target.value } : q) }))} />
              <Textarea placeholder="Resposta" value={item.answer} rows={2}
                onChange={(e) => setForm((f) => ({ ...f, faq: f.faq.map((q, j) => j === i ? { ...q, answer: e.target.value } : q) }))} />
              {form.faq.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="self-end text-destructive"
                  onClick={() => setForm((f) => ({ ...f, faq: f.faq.filter((_, j) => j !== i) }))}>
                  Remover
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div>
            <Label>Status</Label>
            <select className="mt-1 block w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground"
              value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="cta" disabled={loading}>
            {loading ? "Salvando..." : isNew ? "Criar Serviço" : "Salvar Alterações"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/servicos")}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
