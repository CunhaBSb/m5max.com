import { ReactNode } from "react";
import Header from "@/shared/layout/Header";
import Footer from "@/shared/layout/Footer";
import ConversionModal from "@/shared/modal/ConversionModal";
import BudgetRequestFlow from "@/shared/modal/BudgetRequestFlow";
import ConsentBanner from "@/app/providers/analytics/ConsentBanner";
import { useAppStore } from "@/shared/store/appStore";
import { useAudienceDetection } from "@/shared/hooks";
import config from '@/shared/lib/config';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const {
    conversionModalOpen,
    closeConversionModal,
    formModalOpen,
    closeFormModal,
    currentAudience
  } = useAppStore();

  // Inicializar detecção automática de audiência
  useAudienceDetection();

  return (
    <div className="min-h-screen flex flex-col">
      {/* GTM noscript imediatamente após abertura do body */}
      {config.gtmId && (
        <div
          dangerouslySetInnerHTML={{
            __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
          }}
        />
      )}

      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      <ConversionModal
        isOpen={conversionModalOpen}
        onClose={closeConversionModal}
        audience={currentAudience}
        source="modal"
      />
      
      <BudgetRequestFlow
        isOpen={formModalOpen}
        onClose={closeFormModal}
        source="form_modal"
      />
      
      <ConsentBanner />
    </div>
  );
};

export default RootLayout;
