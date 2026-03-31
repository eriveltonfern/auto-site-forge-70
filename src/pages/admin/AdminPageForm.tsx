import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminPageForm() {
  const { id } = useParams();
  const isNew = id === "novo";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    page_type: "static",
    seo_title: "",
    meta_description: "",
    h1: "",
    featured_image: "",
    status: "draft",
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase
        .from("pages")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              title: data.title,
              slug: data.slug,
              content: data.content || "",
              page_type: data.page_type || "static",
              seo_title: data.seo_title || "",
              meta_description: data.meta_description || "",
              h1: data.h1 || "",
              featured_image: data.featured_image || "",
              status: data.status,
            });
          }
        });
    }
  }, [id, isNew]);

  const handleTitleChange = (title: string) => {
    const updates: any = { title };
    if (isNew || !form.slug) {
      updates.slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (isNew || !form.h1) updates.h1 = title;
    if (isNew || !form.seo_title) updates.seo_title = title;
    setForm((f) => ({ ...f, ...updates }));
  };

  const handleImageUpload = async (file: File) => {
    const compressed = await compressImageToWebP(file);
    const path = `pages/${Date.now()}.webp`;
    const { error } = await supabase.storage
      .from("uploads")
      .upload(path, compressed, { contentType: "image/webp" });
    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      return;
    }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    setForm((f) => ({ ...f, featured_image: urlData.publicUrl }));
    toast({ title: "Imagem enviada!" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      featured_image: form.featured_image || null,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("pages").insert(payload));
    } else {
      ({ error } = await supabase.from("pages").update(payload).eq("id", id));
    }

    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Página criada!" : "Página atualizada!" });
      navigate("/admin/paginas");
    }
  };

  const inputClass =
    "w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none bg-white";

  return (
    <div>
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">
        {isNew ? "Adicionar Nova Página" : "Editar Página"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main content area — WP style */}
          <div className="flex-1">
            {/* Title */}
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Adicione o título"
              required
              className="w-full border border-[#8c8f94] rounded-[4px] px-3 py-2 text-[24px] font-normal text-[#1d2327] mb-3 outline-none focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] bg-white"
            />

            {/* Permalink */}
            <div className="text-[13px] text-[#50575e] mb-4">
              <strong>Link permanente:</strong>{" "}
              <span className="text-[#2271b1]">/{form.slug}</span>
              <button
                type="button"
                onClick={() => {
                  const newSlug = prompt("Editar slug:", form.slug);
                  if (newSlug) setForm((f) => ({ ...f, slug: newSlug }));
                }}
                className="ml-2 text-[#2271b1] hover:underline"
              >
                Editar
              </button>
            </div>

            {/* Content editor area */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm mb-4">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-3 py-1.5 text-[12px] text-[#50575e] font-semibold flex gap-3">
                <span className="border-b-2 border-[#2271b1] pb-1 text-[#1d2327]">Visual</span>
                <span className="text-[#50575e] cursor-default">Texto</span>
              </div>
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={18}
                placeholder="Escreva o conteúdo da página aqui..."
                className="w-full px-3 py-3 text-[14px] text-[#2c3338] outline-none resize-y min-h-[300px] bg-white"
              />
              <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-3 py-1 text-[11px] text-[#646970]">
                Contagem de palavras: {form.content.split(/\s+/).filter(Boolean).length}
              </div>
            </div>

            {/* SEO box */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm mb-4">
              <div
                className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327] cursor-pointer"
              >
                SEO
              </div>
              <div className="p-3 space-y-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">
                    Título SEO
                  </label>
                  <input
                    value={form.seo_title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, seo_title: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        meta_description: e.target.value,
                      }))
                    }
                    rows={2}
                    className={`${inputClass} resize-y`}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#1d2327] mb-1">
                    H1
                  </label>
                  <input
                    value={form.h1}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, h1: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — WP Publish box */}
          <div className="lg:w-[280px] space-y-4">
            {/* Publish box */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">
                Publicar
              </div>
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#1d2327]">Status:</span>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                    className="border border-[#8c8f94] rounded-[3px] px-1 py-0.5 text-[13px] bg-white"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicada</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#1d2327]">Tipo:</span>
                  <select
                    value={form.page_type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, page_type: e.target.value }))
                    }
                    className="border border-[#8c8f94] rounded-[3px] px-1 py-0.5 text-[13px] bg-white"
                  >
                    <option value="static">Estática</option>
                    <option value="service">Serviço</option>
                    <option value="city">Cidade</option>
                    <option value="neighborhood">Setor</option>
                  </select>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-[#c3c4c7] bg-[#f6f7f7] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate("/admin/paginas")}
                  className="text-[13px] text-[#b32d2e] hover:underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[5px] border border-[#2271b1] hover:bg-[#135e96] disabled:opacity-60 transition-colors"
                >
                  {loading
                    ? "Salvando..."
                    : form.status === "published"
                    ? "Publicar"
                    : "Salvar Rascunho"}
                </button>
              </div>
            </div>

            {/* Featured Image box */}
            <div className="bg-white border border-[#c3c4c7] shadow-sm">
              <div className="px-3 py-2 border-b border-[#c3c4c7] text-[14px] font-semibold text-[#1d2327]">
                Imagem Destacada
              </div>
              <div className="p-3">
                {form.featured_image ? (
                  <div>
                    <img
                      src={form.featured_image}
                      alt="Destaque"
                      className="w-full h-32 object-cover mb-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, featured_image: "" }))
                      }
                      className="text-[12px] text-[#b32d2e] hover:underline"
                    >
                      Remover imagem destacada
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <span className="text-[13px] text-[#2271b1] hover:text-[#135e96] hover:underline">
                      Definir imagem destacada
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
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
