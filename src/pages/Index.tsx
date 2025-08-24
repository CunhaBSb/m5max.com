import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/services";
import Differentials from "@/components/Differentials";
import LeadMagnet from "@/components/LeadMagnet";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import SectionSeparator from "@/components/SectionSeparator";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <SectionSeparator variant="gradient" />
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