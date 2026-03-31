import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription } from "@/lib/seo-helpers";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminBlogForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const compressed = await compressImageToWebP(file);
      const path = `blog/${Date.now()}.webp`;
      const { error } = await supabase.storage.from("uploads").upload(path, compressed, { contentType: "image/webp" });
      if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
      const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
      setForm((f) => ({ ...f, featured_image: urlData.publicUrl }));
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
    const payload = { ...form, published_at: form.status === "published" ? new Date().toISOString() : null };
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

  const inputClass = "w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none bg-white";

  return (
    <div>
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">{isNew ? "Adicionar Novo Post" : "Editar Post"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 space-y-4">
            {/* Title */}
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Adicione o título" required
              className="w-full border border-[#8c8f94] rounded-[4px] px-3 py-2 text-[24px] font-normal text-[#1d2327] outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] bg-white" />

            <div className="text-[13px] text-[#50575e]">
              <strong>Link permanente:</strong> <span className="text-[#2271b1]">/blog/{form.slug}</span>
              <button type="button" onClick={() => { const s = prompt("Slug:", form.slug); if (s) setForm(f => ({...f, slug: s})); }} className="ml-2 text-[#2271b1] hover:underline">Editar</button>
            </div>

            {/* Content */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-3 py-1.5 text-[12px] text-[#50575e] font-semibold flex gap-3">
                <span className="border-b-2 border-[#2271b1] pb-1 text-[#1d2327]">Visual</span>
                <span className="text-[#50575e] cursor-default">Texto</span>
              </div>
              <textarea value={form.content} onChange={(e) => setForm(f => ({...f, content: e.target.value}))}
                rows={18} placeholder="Escreva o conteúdo aqui..." className="w-full px-3 py-3 text-[14px] text-[#2c3338] outline-none resize-y min-h-[300px] bg-white" />
              <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3 py-1 text-[11px] text-[#646970]">
                Contagem de palavras: {form.content.split(/\s+/).filter(Boolean).length}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Resumo</div>
              <div className="p-3">
                <textarea value={form.summary} onChange={(e) => setForm(f => ({...f, summary: e.target.value}))} rows={3}
                  className={`${inputClass} resize-y`} placeholder="Resumo do post..." />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">SEO</div>
              <div className="p-3 space-y-3">
                <div><label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Título SEO</label><input value={form.seo_title} onChange={(e) => setForm(f => ({...f, seo_title: e.target.value}))} className={inputClass} /></div>
                <div><label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Meta Description</label><textarea value={form.meta_description} onChange={(e) => setForm(f => ({...f, meta_description: e.target.value}))} rows={2} className={`${inputClass} resize-y`} /></div>
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
                  <span>Status:</span>
                  <select value={form.status} onChange={(e) => setForm(f => ({...f, status: e.target.value}))} className="border border-[#8c8f94] rounded-[3px] px-1 py-0.5 text-[13px] bg-white">
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-[#c3c4c7] bg-[#f6f7f7] flex justify-between items-center">
                <button type="button" onClick={() => navigate("/admin/blog")} className="text-[13px] text-[#b32d2e] hover:underline">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[5px] border border-[#2271b1] hover:bg-[#135e96] disabled:opacity-60">
                  {loading ? "Salvando..." : form.status === "published" ? "Publicar" : "Salvar Rascunho"}
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Categoria</div>
              <div className="p-3">
                <input value={form.category} onChange={(e) => setForm(f => ({...f, category: e.target.value}))} placeholder="Ex: Dicas" className={inputClass} />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">Imagem Destacada</div>
              <div className="p-3">
                {form.featured_image ? (
                  <div>
                    <img src={form.featured_image} alt="Destaque" className="w-full h-32 object-cover mb-2" />
                    <button type="button" onClick={() => setForm(f => ({...f, featured_image: ""}))} className="text-[12px] text-[#b32d2e] hover:underline">Remover</button>
                    <span className="text-[#c3c4c7] mx-1">|</span>
                    <label className="text-[12px] text-[#2271b1] hover:underline cursor-pointer">
                      Substituir
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                    </label>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <span className="text-[13px] text-[#2271b1] hover:underline">{uploading ? "Enviando..." : "Definir imagem destacada"}</span>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                  </label>
                )}
                <input className={`${inputClass} mt-2`} placeholder="Ou cole a URL" value={form.featured_image} onChange={(e) => setForm(f => ({...f, featured_image: e.target.value}))} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
