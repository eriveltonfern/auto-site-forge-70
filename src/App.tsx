import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ServicesHub from "./pages/ServicesHub.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import CityPage from "./pages/CityPage.tsx";
import NeighborhoodPage from "./pages/NeighborhoodPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/servicos" element={<ServicesHub />} />
            <Route path="/servicos/:serviceSlug" element={<ServicePage />} />
            <Route path="/:citySlug" element={<CityPage />} />
            <Route path="/:citySlug/:neighborhoodSlug" element={<NeighborhoodPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
