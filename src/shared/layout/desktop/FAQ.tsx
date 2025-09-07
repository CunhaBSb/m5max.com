import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { HelpCircle, MessageSquare, Phone, Clock } from "lucide-react";

const faqs = [
  {
    question: "Vocês têm todas as licenças necessárias para eventos?",
    answer: "Sim, somos totalmente licenciados e certificados. Fornecemos toda a documentação necessária e ajudamos com o processo de licenciamento junto aos órgãos competentes."
  },
  {
    question: "Como funcionam os equipamentos profissionais?",
    answer: "Utilizamos equipamentos eletrônicos de última geração com sistemas de ignição remota, garantindo máxima segurança e precisão nos efeitos pirotécnicos."
  },
  {
    question: "Qual a antecedência necessária para contratar?",
    answer: "Recomendamos pelo menos 30 dias de antecedência para eventos grandes, e 15 dias para eventos menores. Isso garante tempo adequado para licenciamento e preparação."
  },
  {
    question: "Os produtos DIY são seguros para uso doméstico?",
    answer: "Absolutamente. Todos os nossos kits DIY são certificados e acompanham manual detalhado de segurança. São projetados para uso seguro por pessoas leigas."
  },
  {
    question: "Vocês oferecem seguro para os eventos?",
    answer: "Sim, trabalhamos com seguro de responsabilidade civil que cobre todos os nossos eventos. A documentação é fornecida como parte do serviço."
  }
];

const FAQ = () => {
  return (
    <section className="relative py-10 overflow-hidden">
      {/* M5 Max Knowledge Base - Dispersed Sparks Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/18 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/18 via-fire-orange/10 to-fire-red/8" />
      
      {/* Dispersed Sparks - Knowledge Illumination Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Knowledge sparks - scattered learning points */}
        <div className="absolute top-1/6 left-1/5 w-1 h-1 bg-fire-gold rounded-full animate-ping opacity-50" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/6 w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse opacity-45" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />
        <div className="absolute top-2/3 left-1/4 w-0.5 h-0.5 bg-fire-red rounded-full animate-ping opacity-40" style={{ animationDelay: '2.2s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-fire-gold/80 rounded-full animate-pulse opacity-55" style={{ animationDelay: '3s', animationDuration: '2s' }} />
        <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-fire-orange rounded-full animate-ping opacity-40" style={{ animationDelay: '0.3s', animationDuration: '5s' }} />
        
        {/* Question marks as subtle sparks */}
        <div className="absolute top-1/4 left-1/6 w-px h-6 bg-gradient-to-b from-fire-gold/20 to-transparent rotate-12 opacity-30" />
        <div className="absolute bottom-1/3 right-1/5 w-px h-8 bg-gradient-to-t from-fire-orange/15 to-transparent -rotate-20 opacity-35" />
      </div>
      
      {/* Knowledge Burst - FAQ enlightenment */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 w-44 h-44 -translate-x-1/2 
             bg-gradient-radial from-fire-gold/8 via-fire-orange/4 to-transparent 
             rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '7s' }} />
        
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 
             bg-gradient-radial from-fire-red/6 via-fire-gold/3 to-transparent 
             rounded-full blur-2xl opacity-45 animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '8s' }} />
      </div>
      
      {/* Optimized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Standardized Container */}
      <div className="relative container mx-auto px-6 max-w-6xl">
        {/* Standardized Header */}
        <div className="text-center mb-16">
          {/* Standardized Badge */}
          <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-fire-orange/20 px-4 py-2 rounded-xl mb-6">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Dúvidas Frequentes
          </div>
          
          {/* Standardized Title - H2 */}
          <h2 className="text-3xl font-bold mb-6">
            <span className="text-white">Tire Suas </span>
            <span className="text-fire-gradient">Dúvidas</span>
          </h2>
          
          {/* Standardized Description */}
          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-r from-fire-gold/12 via-fire-orange/8 to-fire-red/6 hover:from-fire-gold/16 hover:via-fire-orange/12 hover:to-fire-red/10 backdrop-blur-sm border border-fire-gold/30 hover:border-fire-orange/50 rounded-2xl px-6 py-2 transition-all duration-300 group"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-fire-gold group-hover:text-fire-orange transition-all duration-200 text-base py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-fire-gold group-hover:bg-fire-orange rounded-full flex-shrink-0 transition-colors duration-200" />
                    <span className="leading-tight text-white">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/80 leading-relaxed pt-2 text-base pl-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;