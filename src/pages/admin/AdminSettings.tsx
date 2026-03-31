import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { compressImageToWebP } from "@/lib/image-compressor";

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: "", phone: "", whatsapp: "", whatsapp_message: "",
    address: "", business_hours: "", email: "",
    logo_url: "", favicon_url: "", global_scripts: "",
    hero_image: "",
  });

  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).single().then(({ data }) => {
      if (data) {
        setSettingsId(data.id);
        setForm({
          company_name: data.company_name || "", phone: data.phone || "",
          whatsapp: data.whatsapp || "", whatsapp_message: data.whatsapp_message || "",
          address: data.address || "", business_hours: data.business_hours || "",
          email: data.email || "", logo_url: data.logo_url || "",
          favicon_url: data.favicon_url || "", global_scripts: data.global_scripts || "",
          hero_image: data.hero_image || "",
        });
      }
    });
  }, []);

  const handleFileUpload = async (file: File, field: "logo_url" | "favicon_url" | "hero_image") => {
    const compressed = await compressImageToWebP(file);
    const path = `${field.replace("_url", "")}-${Date.now()}.webp`;
    const { error } = await supabase.storage.from("uploads").upload(path, compressed, { contentType: "image/webp" });
    if (error) { toast({ title: "Erro no upload", description: error.message, variant: "destructive" }); return; }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
    setForm((f) => ({ ...f, [field]: urlData.publicUrl }));
    toast({ title: "Arquivo enviado!" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("site_settings").update(form).eq("id", settingsId!);
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Configurações salvas!" });
    }
  };

  const inputClass = "w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none bg-white";

  return (
    <div className="max-w-[800px]">
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">Configurações</h1>

      <form onSubmit={handleSubmit}>
        {/* Dados da empresa */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm mb-5">
          <h2 className="text-[14px] font-semibold text-[#1d2327] px-3 py-2 border-b border-[#c3c4c7]">
            Dados da Empresa
          </h2>
          <div className="p-3 space-y-3">
            <div>
              <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Nome da Empresa</label>
              <input value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} className={inputClass} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Telefone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">WhatsApp (com DDI)</label>
                <input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Mensagem Padrão WhatsApp</label>
              <input value={form.whatsapp_message} onChange={(e) => setForm((f) => ({ ...f, whatsapp_message: e.target.value }))} className={inputClass} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Endereço</label>
                <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Horário</label>
                <input value={form.business_hours} onChange={(e) => setForm((f) => ({ ...f, business_hours: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">E-mail</label>
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Imagens */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm mb-5">
          <h2 className="text-[14px] font-semibold text-[#1d2327] px-3 py-2 border-b border-[#c3c4c7]">
            Imagens
          </h2>
          <div className="p-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Logo do Site</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo_url")} className="text-[13px]" />
                {form.logo_url && <img src={form.logo_url} alt="Logo" className="mt-2 h-16 object-contain" />}
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Favicon</label>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "favicon_url")} className="text-[13px]" />
                {form.favicon_url && <img src={form.favicon_url} alt="Favicon" className="mt-2 h-8 object-contain" />}
              </div>
            </div>
            <div>
              <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Imagem Hero (Banner Principal)</label>
              <p className="text-[12px] text-[#50575e] mb-1">Recomendado: 1920×1080px. Usada como fundo da seção principal.</p>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "hero_image")} className="text-[13px]" />
              {form.hero_image && <img src={form.hero_image} alt="Hero" className="mt-2 h-32 w-full object-cover" />}
            </div>
          </div>
        </div>

        {/* Scripts */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm mb-5">
          <h2 className="text-[14px] font-semibold text-[#1d2327] px-3 py-2 border-b border-[#c3c4c7]">
            Scripts Globais
          </h2>
          <div className="p-3">
            <label className="block text-[14px] font-semibold text-[#1d2327] mb-1">Scripts (Analytics, Pixel, etc)</label>
            <textarea
              value={form.global_scripts}
              onChange={(e) => setForm((f) => ({ ...f, global_scripts: e.target.value }))}
              rows={5}
              placeholder="Cole aqui os scripts de analytics, pixel, etc."
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2271b1] text-white text-[13px] rounded-[3px] px-3 py-[6px] border border-[#2271b1] hover:bg-[#135e96] disabled:opacity-60 transition-colors"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
