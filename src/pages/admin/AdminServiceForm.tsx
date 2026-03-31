import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription, generateH1 } from "@/lib/seo-helpers";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminServiceForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", slug: "", seo_title: "", meta_description: "", h1: "",
    short_description: "", long_description: "", icon: "🔧",
    cover_image: "",
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
            cover_image: data.cover_image || "",
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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const compressed = await compressImageToWebP(file);
      const path = `services/cover-${Date.now()}.webp`;
      const { error } = await supabase.storage.from("uploads").upload(path, compressed, { contentType: "image/webp" });
      if (error) { toast({ title: "Erro no upload", description: error.message, variant: "destructive" }); return; }
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      setForm((f) => ({ ...f, cover_image: urlData.publicUrl }));
      toast({ title: "Imagem enviada!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: form.name, slug: form.slug,
      seo_title: form.seo_title, meta_description: form.meta_description,
      h1: form.h1, short_description: form.short_description,
      long_description: form.long_description, icon: form.icon,
      cover_image: form.cover_image || null,
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

  const inputClass = "w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none bg-white";

  return (
    <div>
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">
        {isNew ? "Adicionar Novo Serviço" : "Editar Serviço"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome do serviço"
              required
              className="w-full border border-[#8c8f94] rounded-[4px] px-3 py-2 text-[24px] font-normal text-[#1d2327] outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] bg-white"
            />

            <div className="text-[13px] text-[#50575e]">
              <strong>Slug:</strong> <span className="text-[#2271b1]">/{form.slug}</span>
              <button type="button" onClick={() => { const s = prompt("Slug:", form.slug); if (s) setForm(f => ({...f, slug: s})); }} className="ml-2 text-[#2271b1] hover:underline">Editar</button>
            </div>

            {/* Descriptions */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Descrições</div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Descrição Curta</label>
                  <textarea value={form.short_description} onChange={(e) => setForm(f => ({...f, short_description: e.target.value}))} rows={2} className={`${inputClass} resize-y`} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Descrição Longa</label>
                  <textarea value={form.long_description} onChange={(e) => setForm(f => ({...f, long_description: e.target.value}))} rows={8} className={`${inputClass} resize-y`} />
                </div>
              </div>
            </div>

            {/* Keywords, Problems, Benefits */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Detalhes</div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Palavras-chave (separadas por vírgula)</label>
                  <input value={form.keywords} onChange={(e) => setForm(f => ({...f, keywords: e.target.value}))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Problemas comuns (um por linha)</label>
                  <textarea value={form.problems} onChange={(e) => setForm(f => ({...f, problems: e.target.value}))} rows={4} className={`${inputClass} resize-y`} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Benefícios (um por linha)</label>
                  <textarea value={form.benefits} onChange={(e) => setForm(f => ({...f, benefits: e.target.value}))} rows={4} className={`${inputClass} resize-y`} />
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327] flex justify-between items-center">
                <span>FAQ</span>
                <button type="button" onClick={() => setForm(f => ({...f, faq: [...f.faq, { question: "", answer: "" }]}))} className="text-[12px] text-[#2271b1] hover:underline">+ Adicionar</button>
              </div>
              <div className="p-3 space-y-3">
                {form.faq.map((item, i) => (
                  <div key={i} className="border border-[#dcdcde] rounded p-2 space-y-2">
                    <input placeholder="Pergunta" value={item.question}
                      onChange={(e) => setForm(f => ({...f, faq: f.faq.map((q, j) => j === i ? {...q, question: e.target.value} : q)}))}
                      className={inputClass} />
                    <textarea placeholder="Resposta" value={item.answer} rows={2}
                      onChange={(e) => setForm(f => ({...f, faq: f.faq.map((q, j) => j === i ? {...q, answer: e.target.value} : q)}))}
                      className={`${inputClass} resize-y`} />
                    {form.faq.length > 1 && (
                      <button type="button" onClick={() => setForm(f => ({...f, faq: f.faq.filter((_, j) => j !== i)}))}
                        className="text-[12px] text-[#b32d2e] hover:underline">Remover</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">SEO</div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Título SEO</label>
                  <input value={form.seo_title} onChange={(e) => setForm(f => ({...f, seo_title: e.target.value}))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Meta Description</label>
                  <textarea value={form.meta_description} onChange={(e) => setForm(f => ({...f, meta_description: e.target.value}))} rows={2} className={`${inputClass} resize-y`} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">H1</label>
                  <input value={form.h1} onChange={(e) => setForm(f => ({...f, h1: e.target.value}))} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[280px] space-y-4">
            {/* Publish */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Publicar</div>
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#1d2327]">Status:</span>
                  <select value={form.status} onChange={(e) => setForm(f => ({...f, status: e.target.value}))}
                    className="border border-[#8c8f94] rounded-[3px] px-1 py-0.5 text-[13px] bg-white">
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#1d2327]">Ícone:</span>
                  <input value={form.icon} onChange={(e) => setForm(f => ({...f, icon: e.target.value}))}
                    className="w-12 text-center border border-[#8c8f94] rounded-[3px] text-[16px] bg-white" />
                </div>
              </div>
              <div className="px-3 py-2 border-t border-[#c3c4c7] bg-[#f6f7f7] flex justify-between items-center">
                <button type="button" onClick={() => navigate("/admin/servicos")} className="text-[13px] text-[#b32d2e] hover:underline">Cancelar</button>
                <button type="submit" disabled={loading || uploading}
                  className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[5px] border border-[#2271b1] hover:bg-[#135e96] disabled:opacity-60 transition-colors">
                  {loading ? "Salvando..." : form.status === "published" ? "Publicar" : "Salvar Rascunho"}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Imagem Destacada</div>
              <div className="p-3">
                {form.cover_image ? (
                  <div>
                    <img src={form.cover_image} alt="Capa" className="w-full h-32 object-cover mb-2" />
                    <button type="button" onClick={() => setForm(f => ({...f, cover_image: ""}))} className="text-[12px] text-[#b32d2e] hover:underline">Remover</button>
                    <span className="text-[#c3c4c7] mx-1">|</span>
                    <label className="text-[12px] text-[#2271b1] hover:underline cursor-pointer">
                      Substituir
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                    </label>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <span className="text-[13px] text-[#2271b1] hover:underline">
                      {uploading ? "Enviando..." : "Definir imagem destacada"}
                    </span>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
