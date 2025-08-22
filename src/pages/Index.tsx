import Hero from "@/components/Hero";
import Segments from "@/components/Segments";
import Differentials from "@/components/Differentials";
import Portfolio from "@/components/Portfolio";
import LeadMagnet from "@/components/LeadMagnet";
import FAQ from "@/components/FAQ";

const Index = () => {
  return (
    <>
      <div id="hero">
        <Hero />
      </div>
      <div id="servicos">
        <Segments />
      </div>
      <div id="diferenciais">
        <Differentials />
      </div>
      <div id="portfolio">
        <Portfolio />
      </div>
      <LeadMagnet />
      <div id="faq">
        <FAQ />
      </div>
    </>
  );
};

export default Index;
