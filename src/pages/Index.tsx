import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Segments from "@/components/Segments";
import Differentials from "@/components/Differentials";
import Portfolio from "@/components/Portfolio";
import LeadMagnet from "@/components/LeadMagnet";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <div id="servicos">
        <Segments />
      </div>
      <div id="portfolio">
        <Portfolio />
      </div>
      <div id="diferenciais">
        <Differentials />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <div id="contato">
        <Footer />
      </div>
    </main>
  );
};

export default Index;
