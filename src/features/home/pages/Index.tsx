import Header from "@/shared/components/layout/Header";
import Hero from "@/features/home/components/Hero";
import FogosM5Complete from "@/features/home/components/FogosM5Complete";
import Services from "@/features/home/components/Services";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/shared/components/layout/Footer";
import SectionSeparator from "@/shared/components/layout/SectionSeparator";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <SectionSeparator variant="curved" />
      <div id="empresa">
        <FogosM5Complete />
      </div>
      <SectionSeparator variant="vintage" />
      <div id="servicos">
        <Services />
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