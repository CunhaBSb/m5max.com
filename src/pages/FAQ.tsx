import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Shield, 
  Clock, 
  Package,
  Phone,
  MessageSquare
} from "lucide-react";

export default function FAQ() {
  const faqCategories = [
    {
      title: "Shows Pirotécnicos",
      icon: Shield,
      questions: [
        {
          question: "Vocês têm licenças para eventos em qualquer cidade?",
          answer: "Sim! Temos todas as licenças necessárias e nossa equipe é certificada para atuar em todo o território nacional. Cuidamos de toda documentação necessária para seu evento."
        },
        {
          question: "Com quanto tempo de antecedência devo contratar?",
          answer: "Recomendamos pelo menos 30 dias de antecedência para shows simples e 60 dias para eventos complexos. Isso garante disponibilidade e planejamento adequado."
        },
        {
          question: "Vocês fazem shows sincronizados com música?",
          answer: "Sim! Somos especialistas em sincronização musical. Podemos trabalhar com qualquer estilo musical e criar um espetáculo perfeitamente alinhado com sua trilha sonora."
        },
        {
          question: "O que acontece se chover no dia do evento?",
          answer: "Temos protocolos específicos para cada tipo de clima. Em casos de chuva leve, o show pode prosseguir. Em tempestades, temos planos de contingência e reagendamento."
        }
      ]
    },
    {
      title: "Chá Revelação",
      icon: Package,
      questions: [
        {
          question: "Os produtos são seguros para usar em casa?",
          answer: "Absolutamente! Todos nossos kits de chá revelação são certificados para uso doméstico e vêm com instruções detalhadas de segurança. Nossa equipe também oferece suporte técnico."
        },
        {
          question: "Posso personalizar as cores?",
          answer: "Sim! Oferecemos azul e rosa tradicionais, mas também temos dourado para quem quer manter a surpresa ou cores especiais sob encomenda."
        },
        {
          question: "Vocês fazem a revelação com equipe profissional?",
          answer: "Sim! Além dos kits DIY, oferecemos serviço completo com nossa equipe, incluindo fotografia, limpeza e operação profissional do show."
        },
        {
          question: "Como funciona a entrega dos kits?",
          answer: "Fazemos entrega em todo o Brasil via transportadora com seguro total. Para São Paulo e região metropolitana, também fazemos entrega expressa no mesmo dia."
        }
      ]
    },
    {
      title: "Kits DIY",
      icon: Package,
      questions: [
        {
          question: "Os kits vêm com instruções em português?",
          answer: "Sim! Todos os kits incluem manual completo em português com ilustrações passo a passo, dicas de segurança e suporte via WhatsApp."
        },
        {
          question: "Posso usar os kits em condomínios?",
          answer: "Recomendamos verificar as regras do condomínio. Nossos kits são seguros e de baixo ruído, mas é importante ter autorização prévia da administração."
        },
        {
          question: "Vocês têm kits para diferentes idades?",
          answer: "Sim! Temos kits específicos para diferentes faixas etárias, sempre com supervisão adulta obrigatória. Consulte-nos sobre a opção mais adequada."
        },
        {
          question: "E se eu não souber usar o kit?",
          answer: "Oferecemos suporte completo! Além do manual detalhado, você pode nos chamar no WhatsApp para orientação em tempo real ou assistir nossos vídeos tutoriais."
        }
      ]
    }
  ];

  const generalQuestions = [
    {
      question: "Vocês atendem em todo o Brasil?",
      answer: "Sim! Atendemos todo o território nacional. Para shows pirotécnicos, nossa equipe se desloca para qualquer cidade. Para kits, fazemos entrega via transportadora."
    },
    {
      question: "Como é calculado o preço dos serviços?",
      answer: "O orçamento varia conforme: tipo de evento, duração do show, quantidade de fogos, distância do local e complexidade. Fazemos orçamentos personalizados sem compromisso."
    },
    {
      question: "Vocês oferecem garantia nos produtos?",
      answer: "Sim! Todos nossos produtos têm garantia total. Se algum item não funcionar conforme especificado, fazemos reposição imediata sem custo adicional."
    },
    {
      question: "É possível cancelar ou remarcar?",
      answer: "Sim, mas depende da antecedência. Cancelamentos até 15 dias antes têm reembolso de 80%. Entre 7-15 dias, 50%. Reagendamentos são sempre possíveis mediante disponibilidade."
    },
    {
      question: "Vocês têm seguro para os eventos?",
      answer: "Sim! Todos nossos serviços são cobertos por seguro de responsabilidade civil com cobertura nacional. Fornecemos as apólices antes do evento."
    },
    {
      question: "Como posso acompanhar meu pedido?",
      answer: "Enviamos código de rastreamento por WhatsApp e e-mail. Você pode acompanhar em tempo real e recebe notificações sobre cada etapa da entrega."
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="fire" className="mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Perguntas Frequentes
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Tire suas</span>
            <br />
            <span className="text-fire-gradient">Dúvidas</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços,
            produtos e procedimentos. Sua tranquilidade é nossa prioridade.
          </p>
        </div>
      </section>

      {/* FAQ by Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className="w-8 h-8 text-fire-orange" />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription>
                    Perguntas específicas sobre {category.title.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Questions */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas <span className="text-fire-gradient">Gerais</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Dúvidas comuns sobre nossos serviços e atendimento
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {generalQuestions.map((faq, index) => (
                <AccordionItem key={index} value={index.toString()}>
                  <AccordionTrigger className="text-left text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center border-2 border-fire-orange/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                Não encontrou sua <span className="text-fire-gradient">resposta</span>?
              </CardTitle>
              <CardDescription className="text-lg">
                Nossa equipe está sempre pronta para ajudar você
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Resposta em até 2 horas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Suporte especializado</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="default" 
                    size="lg"
                    className="bg-fire-orange hover:bg-fire-red"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar Agora
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Horário de atendimento: Segunda a Sexta das 8h às 18h | Sábado das 8h às 14h
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}