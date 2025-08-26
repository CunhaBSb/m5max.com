import { Routes, Route } from "react-router-dom";
import { Home } from "@/features/home";
import { ShowsPage } from "@/features/pyrotechnics";
import { Reveillon } from "@/features/reveillon";
import NotFound from "@/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shows-pirotecnicos" element={<ShowsPage />} />
      <Route path="/reveillon" element={<Reveillon />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}