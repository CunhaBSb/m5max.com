// Context Engineering: Centralized FAQ data for different pages
// This enables easy content management and localization

export const homeFaqs = [
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
];

export const reveillonFaqs = [
  {
    question: "O evento do Réveillon será ao ar livre?",
    answer: "Sim, nosso Réveillon 2025 acontece em área externa com vista panorâmica, proporcionando o cenário perfeito para receber o novo ano com fogos espetaculares."
  },
  {
    question: "Incluem bebidas e alimentação no ingresso?",
    answer: "Sim! O ingresso premium inclui open bar premium e jantar buffet completo com pratos especiais da nossa culinária exclusiva."
  },
  {
    question: "Qual o horário do evento?",
    answer: "O evento inicia às 20h do dia 31/12 e vai até às 2h do dia 01/01, com queima de fogos programada exatamente à meia-noite."
  },
  {
    question: "Posso comprar ingresso na hora?",
    answer: "Recomendamos fortemente a compra antecipada. Temos capacidade limitada e o evento tradicionalmente esgota. Vendas na porta sujeitas à disponibilidade."
  },
  {
    question: "Há estacionamento no local?",
    answer: "Sim, oferecemos estacionamento gratuito para todos os convidados, além de serviço de valet opcional para maior comodidade."
  }
];

export const defaultFaqData = {
  home: {
    title: "Tire Suas Dúvidas",
    subtitle: "Encontre respostas para as perguntas mais comuns sobre nossos serviços",
    faqs: homeFaqs
  },
  reveillon: {
    title: "Perguntas do Réveillon",
    subtitle: "Tudo que você precisa saber sobre nosso evento exclusivo",
    faqs: reveillonFaqs
  }
};