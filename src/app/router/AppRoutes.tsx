import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/features/home";
import { ReveillonPage } from "@/features/reveillon";
import { ProdutosPage } from "@/features/produtos";
import { OrcamentoIatePage } from "@/features/orcamento-iate";
import { SaoJoaoPage } from "@/features/sao-joao";
import NotFound from "./NotFound";

// Lazy: isola o módulo admin (e a validação de env do Supabase em admin/env.ts)
// das rotas públicas. Sem isto, um import eager derruba o site inteiro quando
// o env do admin não está configurado.
const AdminRoutes = lazy(() =>
  import("@/features/admin").then((m) => ({ default: m.AdminRoutes }))
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reveillon" element={<ReveillonPage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
      <Route path="/orcamento-iate-2026" element={<OrcamentoIatePage />} />
      <Route path="/sao-joao" element={<SaoJoaoPage />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={null}>
            <AdminRoutes />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
