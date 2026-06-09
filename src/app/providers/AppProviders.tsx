import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AnalyticsProvider } from "@/app/providers/analytics/AnalyticsProvider";
import { useWebVitals } from "@/shared/hooks/useWebVitals";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Componente interno que ativa Web Vitals tracking dentro do AnalyticsProvider
 * (precisa estar dentro porque useWebVitals usa useAnalytics, que consome o consent)
 */
const WebVitalsTracker = () => {
  useWebVitals();
  return null;
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AnalyticsProvider>
        <WebVitalsTracker />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </TooltipProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  </QueryClientProvider>
);