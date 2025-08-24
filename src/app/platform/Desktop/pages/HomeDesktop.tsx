import HeroDesktop from "../components/HeroDesktop";
import ServicesDesktop from "../components/ServicesDesktop";
import Differentials from "@/components/sections/Differentials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import SectionSeparator from "@/components/SectionSeparator";

const HomeDesktop = () => {
  return (
    <main className="min-h-screen">
      <div id="hero">
        <HeroDesktop />
      </div>
      <SectionSeparator variant="gradient" />
      <div id="servicos">
        <ServicesDesktop />
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
        <LeadMagnet />
      </div>
    </main>
  );
};

export default HomeDesktop;