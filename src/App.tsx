import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ServicesHub from "./pages/ServicesHub.tsx";
import AreasPage from "./pages/AreasPage.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import DynamicSlugPage from "./pages/DynamicSlugPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import SobrePage from "./pages/SobrePage.tsx";
import ContatoPage from "./pages/ContatoPage.tsx";
import SitemapPage from "./pages/SitemapPage.tsx";
import SitemapXmlRedirect from "./pages/SitemapXmlRedirect.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminServices from "./pages/admin/AdminServices.tsx";
import AdminServiceForm from "./pages/admin/AdminServiceForm.tsx";
import AdminCities from "./pages/admin/AdminCities.tsx";
import AdminCityForm from "./pages/admin/AdminCityForm.tsx";
import AdminNeighborhoods from "./pages/admin/AdminNeighborhoods.tsx";
import AdminNeighborhoodForm from "./pages/admin/AdminNeighborhoodForm.tsx";
import AdminBlog from "./pages/admin/AdminBlog.tsx";
import AdminBlogForm from "./pages/admin/AdminBlogForm.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminBulkImport from "./pages/admin/AdminBulkImport.tsx";
import AdminPages from "./pages/admin/AdminPages.tsx";
import AdminPageForm from "./pages/admin/AdminPageForm.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/servicos" element={<ServicesHub />} />
            <Route path="/servicos/:serviceSlug" element={<ServicePage />} />
            <Route path="/areas-atendidas" element={<AreasPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/sitemap.xml" element={<SitemapXmlRedirect />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="servicos" element={<AdminServices />} />
              <Route path="servicos/:id" element={<AdminServiceForm />} />
              <Route path="cidades" element={<AdminCities />} />
              <Route path="cidades/importar" element={<AdminBulkImport type="cities" />} />
              <Route path="cidades/:id" element={<AdminCityForm />} />
              <Route path="bairros" element={<AdminNeighborhoods />} />
              <Route path="bairros/importar" element={<AdminBulkImport type="neighborhoods" />} />
              <Route path="bairros/:id" element={<AdminNeighborhoodForm />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/:id" element={<AdminBlogForm />} />
              <Route path="paginas" element={<AdminPages />} />
              <Route path="paginas/:id" element={<AdminPageForm />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="configuracoes" element={<AdminSettings />} />
            </Route>

            {/* Dynamic routes: neighborhood or service+neighborhood */}
            <Route path="/:slug" element={<DynamicSlugPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
