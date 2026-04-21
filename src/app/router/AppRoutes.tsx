import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home";
import { ReveillonPage } from "@/features/reveillon";
import { ProdutosPage } from "@/features/produtos";
import { OrcamentoIatePage } from "@/features/orcamento-iate";
import { SaoJoaoPage } from "@/features/sao-joao";
import { AdminRoutes } from "@/features/admin";
import NotFound from "./NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reveillon" element={<ReveillonPage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
      <Route path="/orcamento-iate-2026" element={<OrcamentoIatePage />} />
      <Route path="/sao-joao" element={<SaoJoaoPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
