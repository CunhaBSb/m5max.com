import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import RootDesktopLayout from "./layouts/RootDesktopLayout";
import ShowsPirotecnicosDesktop from "./pages/ShowsPirotecnicosDesktop";
import ReveillonDesktop from "./pages/ReveillonDesktop";
import KitsDesktop from "./pages/KitsDesktop";
import NotFoundDesktop from "./pages/NotFoundDesktop";

const DesktopApp = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track platform view
    trackPageView({
      page_title: 'Desktop Experience',
      page_location: window.location.href,
      page_category: 'general'
    });
  }, [trackPageView]);

  return (
    <RootDesktopLayout>
      <Routes>
        <Route path="/" element={<HomeDesktop />} />
        <Route path="/shows-pirotecnicos" element={<ShowsPirotecnicosDesktop />} />
        <Route path="/shows-pirotecnicos/reveillon" element={<ReveillonDesktop />} />
        <Route path="/kits" element={<KitsDesktop />} />
        <Route path="*" element={<NotFoundDesktop />} />
      </Routes>
    </RootDesktopLayout>
  );
};

export default DesktopApp;