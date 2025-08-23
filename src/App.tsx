import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import ConversionModal from "@/components/forms/ConversionModal";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import { useAppStore } from "@/store/appStore";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ShowsPirotecnicosPage from "./pages/shows-pirotecnicos/ShowsPirotecnicosPage";
import ReveillonPage from "./pages/shows-pirotecnicos/ReveillonPage";
import ChaRevelacaoPage from "./pages/cha-revelacao/ChaRevelacaoPage";
import KitsPage from "./pages/kits/KitsPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const { conversionModalOpen, closeConversionModal, currentAudience } = useAppStore();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* B2B Routes */}
        <Route path="/shows-pirotecnicos" element={<ShowsPirotecnicosPage />} />
        <Route path="/shows-pirotecnicos/reveillon" element={<ReveillonPage />} />
        
        {/* Product Routes */}
        <Route path="/cha-revelacao" element={<ChaRevelacaoPage />} />
        <Route path="/kits" element={<KitsPage />} />
        
        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ConversionModal
        isOpen={conversionModalOpen}
        onClose={closeConversionModal}
        audience={currentAudience}
        source="modal"
      />
      
      <ConsentBanner />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AnalyticsProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;