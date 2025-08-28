import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/home";
import { Reveillon } from "@/pages/reveillon";
import NotFound from "@/shared/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reveillon" element={<Reveillon />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}