import { Routes, Route } from "react-router-dom";
import HomePage from "@/features/home/pages/HomePage";
import ReveillonPage from "@/features/reveillon/pages/ReveillonPage";
import NotFound from "./NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reveillon" element={<ReveillonPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}