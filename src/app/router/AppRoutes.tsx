import { Routes, Route } from "react-router-dom";
import HomePage from "@/features/home/pages/HomePage";
import ReveillonPage from "@/features/reveillon/pages/ReveillonPage";
import ProdutosPage from "@/features/produtos/pages/ProdutosPage";
import { OrcamentoIatePage } from "@/features/orcamento-iate";
import NotFound from "./NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reveillon" element={<ReveillonPage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
      <Route path="/orcamento-iate-2026" element={<OrcamentoIatePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
