import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import RootMobileLayout from "./layouts/RootMobileLayout";
import HomeMobile from "./pages/HomeMobile";
import ShowsPirotecnicosMobile from "./pages/ShowsPirotecnicosMobile";
import ReveillonMobile from "./pages/ReveillonMobile";
import ChaRevelacaoMobile from "./pages/ChaRevelacaoMobile";
import KitsMobile from "./pages/KitsMobile";
import NotFoundMobile from "./pages/NotFoundMobile";

const MobileApp = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track platform view
    trackPageView({
      page_title: 'Mobile Experience',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <RootMobileLayout>
      <Routes>
        <Route path="/" element={<HomeMobile />} />
        <Route path="/shows-pirotecnicos" element={<ShowsPirotecnicosMobile />} />
        <Route path="/shows-pirotecnicos/reveillon" element={<ReveillonMobile />} />
        <Route path="/cha-revelacao" element={<ChaRevelacaoMobile />} />
        <Route path="/kits" element={<KitsMobile />} />
        <Route path="*" element={<NotFoundMobile />} />
      </Routes>
    </RootMobileLayout>
  );
};

export default MobileApp;