import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const FAQDesktop = ({ 
  faqs, 
  title = "Tire Suas Dúvidas",
  subtitle = "Encontre respostas para as perguntas mais comuns sobre nossos serviços"
}: FAQProps) => {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/8 to-background"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/6 via-background to-fire-orange/5" />
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-fire-gold/4 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-fire-orange/3 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-gradient-radial from-fire-gold/4 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-1/2 h-1/2 bg-gradient-radial from-fire-orange/3 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-1.5 h-1.5 bg-fire-gold/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-fire-orange/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 bg-fire-gold/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-fire-orange mb-3">
            <div className="w-7 h-7 rounded-full bg-fire-gradient flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold uppercase tracking-wide text-sm">Dúvidas Frequentes</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-foreground">{title.split(' ').slice(0, -1).join(' ')}</span>
            <span className="lg:block text-fire-gradient">{title.split(' ').pop()}</span>
          </h2>
          
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-1"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-fire-orange transition-smooth text-sm py-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-fire-orange rounded-full mt-2 flex-shrink-0" />
                  <span className="leading-tight">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-3 text-sm pl-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent"></div>
        <div className="absolute bottom-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/95 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
      </div>
    </section>
  );
};

export default FAQDesktop;