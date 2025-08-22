import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Páginas de features
import ShowsPirotecnicos from "@/features/b2b/pages/ShowsPirotecnicos";
import ChaRevelacao from "@/features/cha/pages/ChaRevelacao";
import Kits from "@/features/kits/pages/Kits";

// Páginas institucionais
import Contato from "@/pages/Contato";
import Sobre from "@/pages/Sobre";
import FAQ from "@/pages/FAQ";
import Legal from "@/pages/Legal";
import Cases from "@/pages/Cases";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      // Features por segmento
      {
        path: "/shows-pirotecnicos",
        element: <ShowsPirotecnicos />,
      },
      {
        path: "/cha-revelacao",
        element: <ChaRevelacao />,
      },
      {
        path: "/kits",
        element: <Kits />,
      },
      // Páginas institucionais
      {
        path: "/contato",
        element: <Contato />,
      },
      {
        path: "/sobre",
        element: <Sobre />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/legal",
        element: <Legal />,
      },
      {
        path: "/cases",
        element: <Cases />,
      },
      // 404
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export default router;