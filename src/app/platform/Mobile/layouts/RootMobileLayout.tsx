import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConversionModal from "@/components/forms/ConversionModal";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import { useAppStore } from "@/store/appStore";

interface RootMobileLayoutProps {
  children: ReactNode;
}

const RootMobileLayout = ({ children }: RootMobileLayoutProps) => {
  const { conversionModalOpen, closeConversionModal, currentAudience } = useAppStore();

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
      
      <ConsentBanner />
    </div>
  );
};

export default RootMobileLayout;