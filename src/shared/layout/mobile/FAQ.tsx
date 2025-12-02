import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { faqData } from "@/shared/constants/faq-data";

const FAQ = () => {
  return (
    <section className="relative py-6 overflow-hidden">
      {/* Background pattern aligned to Services (mobile) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/12 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/6 via-transparent to-fire-orange/4" />
      
      {/* Mobile Dispersed Sparks - Reduced for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/5 left-1/4 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-35" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-30" style={{ animationDelay: '2.5s', animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 left-2/3 w-0.5 h-0.5 bg-fire-red rounded-full animate-ping opacity-25" style={{ animationDelay: '0.8s', animationDuration: '5s' }} />
      </div>
      
      {/* Mobile Knowledge Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-28 h-28 -translate-x-1/2 
             bg-gradient-radial from-fire-gold/6 via-fire-orange/3 to-transparent 
             rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
      
      {/* Subtle ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-fire-gold/2 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-fire-orange/1 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-gradient-radial from-fire-gold/2 via-transparent to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-1/3 right-1/3 w-1/2 h-1/2 bg-gradient-radial from-fire-orange/1 via-transparent to-transparent blur-3xl opacity-40" />
      </div>
      
      {/* Subtle particle effects */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-1.5 h-1.5 bg-fire-gold/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-fire-orange/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 bg-fire-gold/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 max-w-3xl z-10">
        {/* Compact Mobile Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold mb-4">
            <span className="text-foreground">Tire Suas</span>
            <br />
            <span className="ml-2 text-fire-gradient">Dúvidas</span>
          </h2>
          
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1"
            >
              <AccordionTrigger className="text-left font-semibold text-white hover:text-fire-orange transition-smooth text-sm py-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-fire-orange rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-tight">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white/80 leading-relaxed pt-2 text-sm pl-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Section transitions (match Services) */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default FAQ;
