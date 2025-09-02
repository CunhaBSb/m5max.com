import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { HelpCircle, MessageSquare, Phone } from "lucide-react";

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

const FAQMobile = () => {
  return (
    <section className="relative py-8 px-4 overflow-hidden">
      {/* Mobile-optimized background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-metal-platinum/8 to-background"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-fire-gold/6 via-background to-fire-orange/5" />
      
      <div className="relative container mx-auto max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-fire-orange mb-3">
            <div className="w-7 h-7 rounded-full bg-fire-gradient flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold uppercase tracking-wide text-sm">Dúvidas Frequentes</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-3">
            <span className="text-foreground">Tire Suas</span>
            <br />
            <span className="text-fire-gradient">Dúvidas</span>
          </h2>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3 mb-8">
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
              <AccordionContent className="text-muted-foreground leading-relaxed pt-3 text-sm pl-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Mobile CTA Section */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-fire-gradient mb-2">
            Não encontrou sua resposta?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Entre em contato conosco para mais informações
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="default" 
              size="sm"
              className="bg-fire-gradient hover:opacity-90 text-white w-full"
              onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp Direto
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-fire-orange/30 text-foreground hover:bg-fire-orange/10 w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              (61) 98273-5575
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQMobile;