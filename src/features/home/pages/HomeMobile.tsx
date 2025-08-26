import HeroMobile from "@/features/home/components/HeroMobile";
import ServicesMobile from "@/features/home/components/ServicesMobile";
import Differentials from "@/components/sections/Differentials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import SectionSeparator from "@/shared/components/layout/SectionSeparator";
import CardsM5 from "@/features/home/components/CardsM5";

const HomeMobile = () => {
  return (
    <main className="min-h-screen">
      <div id="hero">
        <HeroMobile />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <CardsM5 />
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