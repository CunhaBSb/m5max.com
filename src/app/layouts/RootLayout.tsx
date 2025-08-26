import { ReactNode } from "react";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import ConversionModal from "@/features/conversion/components/ConversionModal";
import ConsentBanner from "@/app/providers/analytics/ConsentBanner";
import { useAppStore } from "@/shared/store/appStore";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
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

export default RootLayout;