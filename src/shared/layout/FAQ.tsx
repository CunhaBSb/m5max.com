// PROPS: faqs: { question: string, answer: string }[]
// Context Engineering: Shared FAQ component with parametrizable content
// Usage: Import and pass different FAQ data for Home vs Reveillon pages

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { HelpCircle, MessageSquare, Phone, Clock } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

const FAQ = ({ 
  faqs, 
  title = "Tire Suas Dúvidas",
  subtitle = "Encontre respostas para as perguntas mais comuns sobre nossos serviços"
}: FAQProps) => {
  return (
    <section className="relative py-8 xs:py-12 lg:py-16 overflow-hidden">
      {/* Harmonized Background System */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/8 to-background"></div>
      
      {/* Dynamic Ambient Gradients */}
      <div className="absolute inset-0">
        {/* Primary gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/6 via-background to-fire-orange/5" />
        
        {/* Ambient lighting effects */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-fire-gold/4 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-fire-orange/3 via-transparent to-transparent" />
        
        {/* Radial accent gradients */}
        <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-gradient-radial from-fire-gold/4 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-1/2 h-1/2 bg-gradient-radial from-fire-orange/3 via-transparent to-transparent blur-3xl" />
      </div>
      
      {/* Subtle particle effects */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/5 left-1/4 w-1.5 h-1.5 bg-fire-gold/50 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-fire-orange/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 bg-fire-gold/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Mobile Header with Quick Stats */}
        <div className="text-center mb-6 xs:mb-8 lg:mb-12">
          {/* Mobile Quick Stats Bar - Above Title */}
          <div className="flex items-center justify-center gap-2 xs:gap-3 mb-3 lg:hidden">
            <div className="bg-fire-orange/10 px-2 py-1 rounded-full border border-fire-orange/30">
              <span className="text-xs font-bold text-fire-orange">Suporte 24h</span>
            </div>
            <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
              <span className="text-xs font-bold text-green-500">Sempre Online</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-fire-orange mb-2 xs:mb-3">
            <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-fire-gradient flex items-center justify-center">
              <HelpCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" />
            </div>
            <span className="font-semibold uppercase tracking-wide text-xs xs:text-sm">Dúvidas Frequentes</span>
          </div>
          
          <h2 className="text-lg xs:text-xl lg:text-3xl font-bold mb-3 xs:mb-4">
            <span className="text-foreground">{title.split(' ').slice(0, -1).join(' ')}</span>
            <br className="xs:hidden" />
            <span className="xs:ml-2 lg:block text-fire-gradient">{title.split(' ').pop()}</span>
          </h2>
          
          <p className="text-xs xs:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* Mobile Trust Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-3 xs:hidden">
            <Clock className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500 font-medium">Respondemos em 5min</span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        <Accordion type="single" collapsible className="space-y-2 xs:space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-3 xs:px-4 py-1"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-fire-orange transition-smooth text-xs xs:text-sm py-3 xs:py-4">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-fire-orange rounded-full mt-1.5 xs:mt-2 flex-shrink-0" />
                  <span className="leading-tight">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2 xs:pt-3 text-xs xs:text-sm pl-4 xs:pl-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        {/* Mobile CTA Section - Professional */}
        <div className="mt-6 xs:mt-8 lg:hidden">
          <div className="bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 p-3 xs:p-4 rounded-xl border border-fire-orange/15 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-fire-gradient flex items-center justify-center">
                <MessageSquare className="w-2.5 h-2.5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-fire-gradient">Ainda tem dúvidas?</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Nossa equipe responde em até 5 minutos
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-9 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 backdrop-blur-sm"
                onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs font-medium">WhatsApp Direto</span>
              </Button>
              
              <Button
                variant="fire"
                size="sm"
                className="flex-1 h-9 text-xs"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                Falar por Telefone
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-fire-orange/10">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-500">Online</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400">5min resposta</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Professional Bottom Transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 z-20 pointer-events-none">
        {/* Main gradient transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent"></div>
        
        {/* Accent line for visual continuity */}
        <div className="absolute bottom-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-gold/20 to-transparent"></div>
        
        {/* Professional fade pattern */}
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background/95 to-transparent"></div>
        
        {/* Side accent gradients */}
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
      </div>
    </section>
  );
};

export default FAQ;