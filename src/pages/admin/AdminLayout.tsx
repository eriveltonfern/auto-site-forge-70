import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "./AdminLogin";
import {
  LayoutDashboard,
  Wrench,
  MapPin,
  Building,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WP_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

const menuItems = [
  { title: "Painel", url: "/admin", icon: LayoutDashboard },
  { title: "Serviços", url: "/admin/servicos", icon: Wrench },
  { title: "Cidades", url: "/admin/cidades", icon: MapPin },
  { title: "Setores", url: "/admin/bairros", icon: Building },
  { title: "Posts", url: "/admin/blog", icon: FileText },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings },
];

function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (url: string) =>
    url === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(url);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        style={{ fontFamily: WP_FONT }}
        className={cn(
          "fixed top-[32px] left-0 z-50 flex h-[calc(100vh-32px)] w-[160px] flex-col",
          "bg-[#1d2327] text-[#f0f0f1] text-[13px]",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-2 px-3 py-[6px] border-b border-[#ffffff0d] transition-colors",
                  active
                    ? "bg-[#2271b1] text-white"
                    : "text-[#f0f0f1]/80 hover:bg-[#2271b1] hover:text-white"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0 opacity-80" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#ffffff0d]">
          <Link
            to="/"
            target="_blank"
            onClick={onMobileClose}
            className="flex items-center gap-2 px-3 py-[6px] text-[#f0f0f1]/60 hover:bg-[#2271b1] hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>Ver Site</span>
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 px-3 py-[6px] text-[#f0f0f1]/60 hover:bg-[#be3631] hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout() {
  const { session, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{ fontFamily: WP_FONT }}
        className="flex min-h-screen items-center justify-center bg-[#f0f0f1]"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2271b1] border-t-transparent" />
          <p className="text-sm text-[#50575e]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <div style={{ fontFamily: WP_FONT }} className="min-h-screen bg-[#f0f0f1]">
      {/* WP Admin Bar (top) */}
      <div className="fixed top-0 left-0 right-0 z-[60] flex h-[32px] items-center bg-[#1d2327] px-3 text-[13px] text-[#f0f0f1]">
        <button
          onClick={() => setMobileOpen(true)}
          className="mr-2 rounded p-0.5 text-[#f0f0f1]/70 hover:text-white lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="flex items-center gap-1.5 text-[#f0f0f1]/70 hover:text-white">
          <span className="text-[11px]">🔧</span>
          <span className="hidden sm:inline">Admin</span>
        </span>
        <div className="ml-auto flex items-center gap-3 text-[12px] text-[#f0f0f1]/60">
          <span>{session.user.email}</span>
        </div>
      </div>

      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <div className="pt-[32px] lg:ml-[160px]">
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
