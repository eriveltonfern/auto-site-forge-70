import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { compressImageToWebP } from "@/lib/image-compressor";
import { Save } from "lucide-react";

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

  const handleFileUpload = async (file: File, field: "logo_url" | "favicon_url") => {
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Configurações Gerais</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">Dados da Empresa</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label>Nome da Empresa</Label><Input value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} /></div>
            <div><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>WhatsApp (com DDI)</Label><Input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} /></div>
            <div className="sm:col-span-2"><Label>Mensagem Padrão WhatsApp</Label><Input value={form.whatsapp_message} onChange={(e) => setForm((f) => ({ ...f, whatsapp_message: e.target.value }))} /></div>
            <div><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} /></div>
            <div><Label>Horário de Atendimento</Label><Input value={form.business_hours} onChange={(e) => setForm((f) => ({ ...f, business_hours: e.target.value }))} /></div>
            <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">Imagens</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Logo do Site</Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "logo_url")} className="mt-1" />
              {form.logo_url && <img src={form.logo_url} alt="Logo" className="mt-2 h-16 object-contain" />}
            </div>
            <div>
              <Label>Favicon</Label>
              <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "favicon_url")} className="mt-1" />
              {form.favicon_url && <img src={form.favicon_url} alt="Favicon" className="mt-2 h-8 object-contain" />}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">Scripts Globais</h2>
          <div>
            <Label>Scripts (Analytics, Pixel, etc)</Label>
            <Textarea value={form.global_scripts} onChange={(e) => setForm((f) => ({ ...f, global_scripts: e.target.value }))} rows={5} placeholder="Cole aqui os scripts de analytics, pixel, etc." />
          </div>
        </div>

        <Button type="submit" variant="cta" disabled={loading}>
          <Save className="h-4 w-4" /> {loading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </form>
    </div>
  );
}
