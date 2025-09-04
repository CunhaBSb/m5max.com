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
    <section className="relative py-20 overflow-hidden">
      {/* Standardized Background System - Pattern Alternative */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/12 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/8 via-transparent to-fire-orange/6" />
      
      {/* Standardized Section Transitions */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
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
                className="bg-gradient-to-r from-black/30 via-black/40 to-black/30 backdrop-blur-sm border border-fire-orange/25 rounded-2xl px-6 py-2"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-fire-orange transition-all duration-200 text-base py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-fire-orange rounded-full flex-shrink-0" />
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