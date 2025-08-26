import { Routes, Route } from "react-router-dom";
import Index from "@/features/home/pages/Index";
import ShowsPirotecnicosPage from "@/pages/shows-pirotecnicos/ShowsPirotecnicosPage";
import KitsPage from "@/pages/kits/KitsPage";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shows-pirotecnicos" element={<ShowsPirotecnicosPage />} />
      <Route path="/kits" element={<KitsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}