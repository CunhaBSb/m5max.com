import HeroMobile from "../components/HeroMobile";
import ServicesMobile from "../components/ServicesMobile";
import Differentials from "@/components/sections/Differentials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import SectionSeparator from "@/components/SectionSeparator";

const HomeMobile = () => {
  return (
    <main className="min-h-screen">
      <div id="hero">
        <HeroMobile />
      </div>
      <SectionSeparator variant="gradient" />
      <div id="servicos">
        <ServicesMobile />
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

export default HomeMobile;