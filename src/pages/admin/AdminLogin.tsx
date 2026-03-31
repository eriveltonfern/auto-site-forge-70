import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const WP_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div
      style={{ fontFamily: WP_FONT }}
      className="flex min-h-screen flex-col items-center justify-center bg-[#f0f0f1]"
    >
      {/* WP Logo area */}
      <div className="mb-6 text-center">
        <span className="text-[20px] font-semibold text-[#3c434a]">🔧 Admin</span>
      </div>

      {/* Login box */}
      <div className="w-full max-w-[320px] bg-white p-6 shadow border border-[#c3c4c7]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-semibold text-[#1d2327] mb-1"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[14px] font-semibold text-[#1d2327] mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#8c8f94] rounded-[4px] px-2 py-[5px] text-[14px] text-[#2c3338] focus:border-[#2271b1] focus:shadow-[0_0_0_1px_#2271b1] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2271b1] text-white text-[13px] font-normal rounded-[3px] px-3 py-[6px] border border-[#2271b1] hover:bg-[#135e96] disabled:opacity-60 transition-colors"
          >
            {loading ? "Entrando..." : "Acessar"}
          </button>
        </form>
      </div>

      <p className="mt-4 text-[13px] text-[#50575e]">
        <a href="/" className="text-[#2271b1] hover:text-[#135e96] hover:underline">
          ← Voltar ao site
        </a>
      </p>
    </div>
  );
}
