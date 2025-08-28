import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/home";
import { Reveillon } from "@/pages/reveillon";
import { Pyrotechnics } from "@/pages/pyrotechnics";
import NotFound from "@/shared/pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reveillon" element={<Reveillon />} />
      <Route path="/shows" element={<Pyrotechnics />} />
      <Route path="/pirotecnia" element={<Pyrotechnics />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}