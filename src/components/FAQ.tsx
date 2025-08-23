import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

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
    answer: "Absolutamente. Todos os nossos kits DIY são certificados pelo INMETRO e acompanham manual detalhado de segurança. São projetados para uso seguro por pessoas leigas."
  },
  {
    question: "Vocês oferecem seguro para os eventos?",
    answer: "Sim, trabalhamos com seguro de responsabilidade civil que cobre todos os nossos eventos. A documentação é fornecida como parte do serviço."
  }
];

const FAQ = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-fire-orange mb-3">
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold uppercase tracking-wide text-sm">Dúvidas Frequentes</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-foreground">Tire Suas</span>
            <br />
            <span className="text-fire-gradient">Dúvidas</span>
          </h2>
          
          <p className="text-base text-muted-foreground">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-1"
            >
              <AccordionTrigger className="text-left font-semibold hover:text-fire-orange transition-smooth text-sm">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-3 text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-10">
          <p className="text-muted-foreground mb-3 text-sm">
            Ainda tem dúvidas? Entre em contato conosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="https://wa.me/5511999999999" 
              className="inline-flex items-center gap-2 text-fire-orange hover:text-fire-red transition-smooth font-semibold text-sm"
            >
              📱 WhatsApp: (11) 99999-9999
            </a>
            <a 
              href="mailto:contato@m5max.com.br"
              className="inline-flex items-center gap-2 text-fire-orange hover:text-fire-red transition-smooth font-semibold text-sm"
            >
              ✉️ contato@m5max.com.br
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;