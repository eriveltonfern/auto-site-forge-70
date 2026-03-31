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
  File,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const WP_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

/* WordPress "W" logo as inline SVG */
function WPLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 122.52 122.523" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M8.708 61.26c0 20.802 12.089 38.779 29.619 47.298L13.258 39.872a52.354 52.354 0 0 0-4.55 21.388zM96.74 58.608c0-6.495-2.333-10.993-4.334-14.494-2.664-4.329-5.161-7.995-5.161-12.324 0-4.831 3.664-9.328 8.825-9.328.233 0 .454.029.681.042-9.35-8.566-21.807-13.796-35.489-13.796-18.36 0-34.513 9.42-43.91 23.688 1.233.037 2.395.063 3.382.063 5.497 0 14.006-.668 14.006-.668 2.833-.167 3.167 3.994.337 4.329 0 0-2.847.335-6.015.501L48.2 93.547l11.501-34.493-8.188-22.434c-2.83-.166-5.511-.501-5.511-.501-2.832-.166-2.5-4.496.332-4.329 0 0 8.679.668 13.843.668 5.496 0 14.006-.668 14.006-.668 2.834-.167 3.168 3.994.337 4.329 0 0-2.853.335-6.015.501l18.992 56.494 5.242-17.517c2.272-7.269 4.001-12.49 4.001-16.989z"/>
        <path d="M62.184 65.857l-15.768 45.819a52.516 52.516 0 0 0 14.846 2.141c6.12 0 11.989-1.058 17.452-2.979a4.451 4.451 0 0 1-.374-.724L62.184 65.857zM107.376 36.046c.226 1.674.354 3.471.354 5.404 0 5.333-.996 11.328-3.996 18.824l-16.053 46.413c15.624-9.111 26.133-26.038 26.133-45.426.001-9.137-2.333-17.729-6.438-25.215z"/>
        <path d="M61.262 0C27.483 0 0 27.481 0 61.26c0 33.783 27.483 61.263 61.262 61.263 33.778 0 61.258-27.48 61.258-61.263C122.52 27.481 95.04 0 61.262 0zm0 119.715c-32.23 0-58.453-26.223-58.453-58.455 0-32.23 26.222-58.451 58.453-58.451 32.229 0 58.45 26.221 58.45 58.451 0 32.232-26.221 58.455-58.45 58.455z"/>
      </g>
    </svg>
  );
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
  children?: { title: string; url: string }[];
}

const menuItems: MenuItem[] = [
  { title: "Painel", url: "/admin", icon: LayoutDashboard },
  {
    title: "Posts",
    url: "/admin/blog",
    icon: FileText,
    children: [
      { title: "Todos os Posts", url: "/admin/blog" },
      { title: "Adicionar Novo", url: "/admin/blog/novo" },
    ],
  },
  {
    title: "Páginas",
    url: "/admin/paginas",
    icon: File,
    children: [
      { title: "Todas as Páginas", url: "/admin/paginas" },
      { title: "Adicionar Nova", url: "/admin/paginas/novo" },
    ],
  },
  {
    title: "Serviços",
    url: "/admin/servicos",
    icon: Wrench,
    children: [
      { title: "Todos os Serviços", url: "/admin/servicos" },
      { title: "Adicionar Novo", url: "/admin/servicos/novo" },
    ],
  },
  {
    title: "Cidades",
    url: "/admin/cidades",
    icon: MapPin,
    children: [
      { title: "Todas as Cidades", url: "/admin/cidades" },
      { title: "Adicionar Nova", url: "/admin/cidades/novo" },
      { title: "Importar", url: "/admin/cidades/importar" },
    ],
  },
  {
    title: "Setores",
    url: "/admin/bairros",
    icon: Building,
    children: [
      { title: "Todos os Setores", url: "/admin/bairros" },
      { title: "Adicionar Novo", url: "/admin/bairros/novo" },
      { title: "Importar", url: "/admin/bairros/importar" },
    ],
  },
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
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const isActive = (url: string) =>
    url === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(url);

  const isMenuOpen = (url: string) =>
    openMenus.includes(url) || isActive(url);

  const toggleMenu = (url: string) => {
    setOpenMenus((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

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
          "bg-[#1d2327] text-[13px] overflow-y-auto",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <nav className="flex-1">
          {menuItems.map((item) => {
            const active = isActive(item.url);
            const hasChildren = item.children && item.children.length > 0;
            const open = hasChildren && isMenuOpen(item.url);

            return (
              <div key={item.url}>
                {/* Parent item */}
                <div
                  className={cn(
                    "flex items-center border-b border-[#ffffff08]",
                    active
                      ? "bg-[#2271b1]"
                      : "hover:bg-[#2271b1]"
                  )}
                >
                  <Link
                    to={item.url}
                    onClick={onMobileClose}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-3 py-[7px] transition-colors",
                      active ? "text-white" : "text-[#f0f0f1]/80 hover:text-white"
                    )}
                  >
                    <item.icon className="h-[16px] w-[16px] shrink-0 opacity-70" />
                    <span>{item.title}</span>
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => toggleMenu(item.url)}
                      className="px-2 py-[7px] text-[#f0f0f1]/50 hover:text-white"
                    >
                      {open ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>

                {/* Children */}
                {hasChildren && open && (
                  <div className="bg-[#2c3338]">
                    {item.children!.map((child) => (
                      <Link
                        key={child.url}
                        to={child.url}
                        onClick={onMobileClose}
                        className={cn(
                          "block pl-9 pr-3 py-[5px] text-[12px] transition-colors border-b border-[#ffffff05]",
                          location.pathname === child.url
                            ? "text-white bg-[#2271b1]/60"
                            : "text-[#f0f0f1]/60 hover:text-white hover:bg-[#ffffff08]"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#ffffff0d] mt-auto">
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
      {/* WP Admin Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] flex h-[32px] items-center bg-[#1d2327] px-2 text-[13px] text-[#f0f0f1]">
        <button
          onClick={() => setMobileOpen(true)}
          className="mr-2 rounded p-0.5 text-[#f0f0f1]/70 hover:text-white lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* WP Logo */}
        <Link
          to="/admin"
          className="flex items-center gap-1.5 px-2 py-1 text-[#f0f0f1]/70 hover:text-[#00b9eb] transition-colors"
        >
          <WPLogo className="h-5 w-5" />
        </Link>

        <div className="h-[32px] w-px bg-[#ffffff15] mx-1" />

        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-1 px-2 py-1 text-[13px] text-[#f0f0f1]/70 hover:text-[#00b9eb] transition-colors"
        >
          <span className="hidden sm:inline">🏠</span>
          <span className="hidden md:inline text-[12px]">Visitar Site</span>
        </Link>

        <div className="ml-auto flex items-center gap-3 text-[12px] text-[#f0f0f1]/60">
          <span>Olá, {session.user.email?.split("@")[0]}</span>
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
