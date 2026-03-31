import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateSeoTitle, generateMetaDescription, generateH1 } from "@/lib/seo-helpers";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminNeighborhoodForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
      updates.base_content = `Atendemos diariamente o Setor ${name}${cityName ? ` em ${cityName}` : ""}, oferecendo soluções rápidas e profissionais.`;
    }
    setForm((f) => ({ ...f, ...updates }));
  };

  const handleImageUpload = async (file: File) => {
    const compressed = await compressImageToWebP(file);
    const path = `neighborhoods/${Date.now()}.webp`;
    const { error } = await supabase.storage.from("uploads").upload(path, compressed, { contentType: "image/webp" });
    if (error) { toast({ title: "Erro no upload", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    setForm((f) => ({ ...f, cover_image: urlData.publicUrl }));
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

  const inputClass = "w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none bg-white";

  return (
    <div>
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">{isNew ? "Adicionar Novo Setor" : "Editar Setor"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 space-y-4">
            <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Nome do setor" required
              className="w-full border border-[#8c8f94] rounded-[4px] px-3 py-2 text-[24px] font-normal text-[#1d2327] outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] bg-white" />

            <div className="text-[13px] text-[#50575e]">
              <strong>Slug:</strong> <span className="text-[#2271b1]">/{form.slug}</span>
              <button type="button" onClick={() => { const s = prompt("Slug:", form.slug); if (s) setForm(f => ({...f, slug: s})); }} className="ml-2 text-[#2271b1] hover:underline">Editar</button>
            </div>

            {/* Content */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-3 py-1.5 text-[12px] font-semibold text-[#1d2327]">Conteúdo</div>
              <textarea value={form.base_content} onChange={(e) => setForm(f => ({...f, base_content: e.target.value}))}
                rows={10} placeholder="Conteúdo da página..." className="w-full px-3 py-3 text-[14px] text-[#2c3338] outline-none resize-y min-h-[200px] bg-white" />
            </div>

            {/* SEO */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">SEO</div>
              <div className="p-3 space-y-3">
                <div><label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Título SEO</label><input value={form.seo_title} onChange={(e) => setForm(f => ({...f, seo_title: e.target.value}))} className={inputClass} /></div>
                <div><label className="block text-[13px] font-semibold text-[#1d2327] mb-1">Meta Description</label><textarea value={form.meta_description} onChange={(e) => setForm(f => ({...f, meta_description: e.target.value}))} rows={2} className={`${inputClass} resize-y`} /></div>
                <div><label className="block text-[13px] font-semibold text-[#1d2327] mb-1">H1</label><input value={form.h1} onChange={(e) => setForm(f => ({...f, h1: e.target.value}))} className={inputClass} /></div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[280px] space-y-4">
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
                <div className="text-[13px]">
                  <span className="text-[#1d2327] block mb-1">Cidade:</span>
                  <select value={form.city_id} onChange={(e) => setForm(f => ({...f, city_id: e.target.value}))} required
                    className="w-full border border-[#8c8f94] rounded-[3px] px-1 py-0.5 text-[13px] bg-white">
                    <option value="">Selecione...</option>
                    {citiesList?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-[#c3c4c7] bg-[#f6f7f7] flex justify-between items-center">
                <button type="button" onClick={() => navigate("/admin/bairros")} className="text-[13px] text-[#b32d2e] hover:underline">Cancelar</button>
                <button type="submit" disabled={loading} className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[5px] border border-[#2271b1] hover:bg-[#135e96] disabled:opacity-60">
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
                    <img src={form.cover_image} alt="Destaque" className="w-full h-32 object-cover mb-2" />
                    <button type="button" onClick={() => setForm(f => ({...f, cover_image: ""}))} className="text-[12px] text-[#b32d2e] hover:underline">Remover</button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <span className="text-[13px] text-[#2271b1] hover:underline">Definir imagem destacada</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
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
