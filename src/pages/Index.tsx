import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import FogosM5Presentation from "@/components/sections/FogosM5Presentation";
import Services from "@/components/sections/services";
import Differentials from "@/components/sections/Differentials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";
import SectionSeparator from "@/components/SectionSeparator";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <div id="apresentacao">
        <FogosM5Presentation />
      </div>
      <SectionSeparator variant="vintage" />
      <div id="servicos">
        <Services />
      </div>
      <SectionSeparator variant="minimal" />
      <div id="diferenciais">
        <Differentials />
      </div>
      <SectionSeparator variant="gradient" />
      <div id="faq">
        <FAQ />
      </div>
      <SectionSeparator variant="minimal" />
      <div id="contato">
        <Footer />
      </div>
    </main>
  );
};

export default Index;