import { ReactNode } from "react";
import Header from "@/shared/layout/Header";
import Footer from "@/shared/layout/Footer";
import ConversionModal from "@/shared/modal/ConversionModal";
import FormModal from "@/shared/modal/FormModal";
import ConsentBanner from "@/app/providers/analytics/ConsentBanner";
import { useAppStore } from "@/shared/store/appStore";

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

  return (
    <div className="min-h-screen flex flex-col">
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
      
      <FormModal
        isOpen={formModalOpen}
        onClose={closeFormModal}
        audience={currentAudience}
        source="form_modal"
      />
      
      <ConsentBanner />
    </div>
  );
};

export default RootLayout;