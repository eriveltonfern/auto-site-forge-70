import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WP_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export default function AdminUsers() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha email e senha");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("create-admin-user", {
        body: { email, password },
      });

      if (res.error) {
        toast.error(res.error.message || "Erro ao criar usuário");
      } else if (res.data?.error) {
        toast.error(res.data.error);
      } else {
        toast.success(`Usuário ${res.data.user.email} criado com sucesso!`);
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: WP_FONT }}>
      {/* WP-style page header */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327]">
          Adicionar Novo Usuário
        </h1>
      </div>
      <hr className="border-[#c3c4c7] mb-5" />

      <p className="text-[13px] text-[#50575e] mb-5">
        Crie uma nova conta de administrador. O usuário poderá acessar o painel com o email e senha definidos abaixo.
      </p>

      {/* WP-style form */}
      <form onSubmit={handleSubmit} className="max-w-[600px]">
        <table className="w-full text-[13px]" style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <tbody>
            <tr>
              <th className="text-left font-semibold text-[#1d2327] py-2 pr-3 align-top w-[160px]">
                E-mail <span className="text-[#d63638]">*</span>
              </th>
              <td>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full max-w-[400px] h-[30px] px-2 text-[13px] border border-[#8c8f94] rounded-[4px] bg-white text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] focus:outline-none"
                  placeholder="usuario@email.com"
                />
              </td>
            </tr>
            <tr>
              <th className="text-left font-semibold text-[#1d2327] py-2 pr-3 align-top w-[160px]">
                Senha <span className="text-[#d63638]">*</span>
              </th>
              <td>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full max-w-[400px] h-[30px] px-2 text-[13px] border border-[#8c8f94] rounded-[4px] bg-white text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] focus:outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </td>
            </tr>
            <tr>
              <th className="text-left font-semibold text-[#1d2327] py-2 pr-3 align-top w-[160px]">
                Função
              </th>
              <td>
                <select
                  disabled
                  className="h-[30px] px-2 text-[13px] border border-[#8c8f94] rounded-[4px] bg-[#f0f0f1] text-[#2c3338]"
                >
                  <option>Administrador</option>
                </select>
                <p className="text-[12px] text-[#646970] mt-1">
                  Todos os usuários criados aqui terão acesso completo ao painel.
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center h-[30px] px-3 text-[13px] font-normal rounded-[3px] border border-[#2271b1] bg-[#2271b1] text-white hover:bg-[#135e96] hover:border-[#135e96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Criando..." : "Adicionar Novo Usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}
