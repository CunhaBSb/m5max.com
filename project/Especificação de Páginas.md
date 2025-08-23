# Especificação de Páginas - M5 Max Produções

## 1. Home Page (`/`)

### 1.1 Objetivo
Segmentar visitantes para as 3 jornadas principais (B2B, Chá Revelação, Kits DIY) com CTAs claros por persona.

### 1.2 Estrutura Above the Fold
```typescript
interface HeroSection {
  headline: "Pirotecnia Profissional com Sincronização Musical";
  subheadline: "40 anos de experiência, equipe habilitada, cumprimento de normas";
  video: {
    youtubeId: "xUPt4tZIM-s"; // Case Iate Clube Brasília
    autoplay: false;
    duration: "30s";
  };
  cta: {
    primary: "Solicitar Orçamento";
    action: "openConversionModal";
    variant: "large";
  };
  socialProof: {
    logos: ["iate-clube-brasilia", "prefeitura-brasilia", "etc"];
    certifications: ["bombeiros", "anvisa", "abnt"];
  };
}
```

### 1.3 Segmentation Cards
```typescript
interface SegmentationSection {
  title: "Qual é o seu evento?";
  cards: [
    {
      audience: "b2b";
      title: "Shows Profissionais";
      description: "Réveillon, festivais, casamentos e eventos corporativos";
      features: ["Equipe técnica habilitada", "Sincronização musical", "Licenças e segurança"];
      cta: "Ver Portfólio";
      link: "/shows-pirotecnicos";
      icon: "professional-show";
    },
    {
      audience: "cha";
      title: "Chá Revelação";
      description: "Momento perfeito e seguro para revelar o sexo do bebê";
      features: ["Kits prontos rosa/azul", "Controle remoto", "Suporte consultivo"];
      cta: "Escolher Kit";
      link: "/cha-revelacao";
      icon: "baby-reveal";
    },
    {
      audience: "kits";
      title: "Kits DIY";
      description: "Fogos certificados para Réveillon, aniversários e confraternizações";
      features: ["Kits por metragem", "Instruções claras", "Acionamento remoto"];
      cta: "Ver Kits";
      link: "/kits";
      icon: "diy-kit";
    }
  ];
}
```

### 1.4 Trust & Social Proof
```typescript
interface TrustSection {
  stats: {
    experience: "40+ anos de experiência";
    events: "5000+ eventos realizados";
    safety: "Zero acidentes registrados";
    coverage: "Atendemos todo o Brasil";
  };
  testimonials: [
    {
      client: "Iate Clube de Brasília";
      quote: "Excelência técnica e pontualidade impecável";
      event: "Réveillon 2024/2025";
      videoId: "xUPt4tZIM-s";
    }
  ];
  certifications: ["CREA", "Bombeiros", "ANVISA"];
}
```

### 1.5 Analytics Events
```typescript
const homePageEvents = {
  page_view: { page_category: 'general', page_slug: '/' },
  segment_card_click: { audience: 'b2b|cha|kits', card_position: number },
  hero_video_start: { video_id: 'xUPt4tZIM-s' },
  cta_click: { cta_type: 'primary', cta_text: 'Solicitar Orçamento' }
};
```

---

## 2. Shows Pirotécnicos Hub (`/shows-pirotecnicos`)

### 2.1 Objetivo
Landing principal para público B2B com foco em credibilidade, portfólio e geração de leads qualificados.

### 2.2 Hero Section
```typescript
interface B2BHeroSection {
  headline: "Shows Pirotécnicos Profissionais";
  subheadline: "Segurança certificada, impacto garantido, cumprimento de prazos";
  value_props: [
    "40+ anos de experiência",
    "Equipe blaster habilitada",
    "Cumprimento de normas AVCB",
    "Portfólio nacional"
  ];
  featured_case: {
    title: "Réveillon Iate Clube Brasília 2024/2025";
    videoId: "xUPt4tZIM-s";
    metrics: "20.000 pessoas, 15 minutos sincronizados";
  };
  cta: {
    primary: "Solicitar Orçamento Técnico";
    secondary: "Ver Mais Cases";
  };
}
```

### 2.3 Services Grid
```typescript
interface ServicesSection {
  title: "Tipos de Evento";
  services: [
    {
      name: "Réveillon";
      description: "Shows de grande porte com sincronização musical";
      link: "/shows-pirotecnicos/reveillon";
      image: "reveillon-thumb.jpg";
      seasonality: "Q4";
    },
    {
      name: "Festa Junina";
      description: "Tradição e segurança para festivais juninos";
      link: "/shows-pirotecnicos/festa-junina";
      image: "festa-junina-thumb.jpg";
      seasonality: "Q2";
    },
    {
      name: "Casamentos";
      description: "Momentos únicos com efeitos personalizados";
      link: "/shows-pirotecnicos/casamentos";
      image: "casamento-thumb.jpg";
      seasonality: "year-round";
    },
    {
      name: "Festivais";
      description: "Shows para grandes públicos e palcos principais";
      link: "/shows-pirotecnicos/festivais";
      image: "festival-thumb.jpg";
      seasonality: "Q3-Q4";
    },
    {
      name: "Clubes & Condomínios";
      description: "Eventos exclusivos com restrições de ruído";
      link: "/shows-pirotecnicos/clubes-e-condominios";
      image: "clube-thumb.jpg";
      seasonality: "year-round";
    }
  ];
}
```

### 2.4 Differentials Section
```typescript
interface DifferentialsSection {
  title: "Por que escolher a M5?";
  differentials: [
    {
      title: "Segurança Certificada";
      description: "Equipe com certificação de blaster e cumprimento de normas AVCB";
      icon: "shield-check";
    },
    {
      title: "Sincronização Musical";
      description: "Roteiros sincronizados ao milissegundo com a trilha sonora";
      icon: "music-sync";
    },
    {
      title: "Equipamentos Redundantes";
      description: "Sistemas de disparo com redundância para garantir execução perfeita";
      icon: "redundancy";
    },
    {
      title: "Portfólio Nacional";
      description: "Atendemos todo o Brasil com logística própria";
      icon: "brazil-map";
    }
  ];
}
```

### 2.5 Lead Qualification Form
```typescript
interface B2BQualificationForm {
  fields: {
    eventType: { type: 'select', options: ['reveillon', 'festa-junina', 'casamento', 'festival', 'outro'] };
    cityUF: { type: 'text', required: true };
    eventDate: { type: 'date', required: true };
    attendeesRange: { type: 'select', options: ['ate-500', '500-5k', '5k-20k', '20k+'] };
    budgetRange: { type: 'select', options: ['5k-15k', '15k-50k', '50k-200k', '200k+'] };
    venueType: { type: 'radio', options: ['indoor', 'outdoor'] };
    hasNoiseRestrictions: { type: 'checkbox' };
    needsMusicSync: { type: 'checkbox' };
    contactInfo: {
      name: { type: 'text', required: true };
      email: { type: 'email', required: true };
      phone: { type: 'tel', required: true };
      company: { type: 'text', optional: true };
    };
    attachments: { type: 'file', accept: '.pdf,.doc,.docx', multiple: true };
    additionalInfo: { type: 'textarea' };
  };
  leadScoring: {
    budgetRange: { '200k+': 30, '50k-200k': 20, '15k-50k': 10, '5k-15k': 5 };
    eventDate: { 'next-30d': 20, 'next-90d': 15, 'next-180d': 10, 'future': 5 };
    attendeesRange: { '20k+': 15, '5k-20k': 10, '500-5k': 5, 'ate-500': 2 };
  };
}
```

---

## 3. Subpáginas Sazonais B2B

### 3.1 Réveillon (`/shows-pirotecnicos/reveillon`)

```typescript
interface ReveillonPage {
  seo: {
    title: "Show Pirotécnico Réveillon 2025 | M5 Max Produções";
    description: "Shows pirotécnicos profissionais para Réveillon. Sincronização musical, segurança certificada. Orçamento gratuito.";
    keywords: "show pirotécnico réveillon, fogos réveillon, pirotecnia ano novo";
  };
  hero: {
    headline: "Réveillon Inesquecível com Pirotecnia Sincronizada";
    subheadline: "Do planejamento à execução, cuidamos de cada detalhe para seu Réveillon 2025";
    seasonality: "Planejamento inicia em setembro";
    deadlines: "Contratação até novembro para melhor logística";
  };
  featured_cases: [
    {
      title: "Iate Clube Brasília 2024/2025";
      videoId: "xUPt4tZIM-s";
      attendees: "20.000 pessoas";
      duration: "15 minutos";
      highlights: ["Sincronização com orquestra", "Show náutico", "Zero acidentes"];
    }
  ];
  technical_requirements: {
    timeline: "120 dias de antecedência mínima";
    permits: ["AVCB", "Licença ambiental", "Autorização bombeiros"];
    space: "Área mínima segura: 100m raio";
    noise: "Opções low-noise disponíveis";
  };
}
```

### 3.2 Festa Junina (`/shows-pirotecnicos/festa-junina`)

```typescript
interface FestaJuninaPage {
  hero: {
    headline: "Festa Junina com Tradição e Segurança";
    subheadline: "Fogos temáticos que respeitam a tradição junina";
    seasonality: "Temporada maio-julho";
  };
  traditional_elements: [
    "Fogos de bengala tradicionais",
    "Efeitos terrestre baixo ruído",
    "Sincronização com quadrilhas",
    "Cores temáticas (amarelo, laranja, vermelho)"
  ];
  safety_focus: {
    indoor_venues: "Protocolos especiais para quadras cobertas";
    crowd_management: "Efeitos seguros próximos ao público";
    traditional_compliance: "Respeito às tradições locais";
  };
}
```

---

## 4. Chá Revelação Hub (`/cha-revelacao`)

### 4.1 Objetivo
Converter casais grávidos em compradores de kits temáticos com foco em segurança e momento perfeito.

### 4.2 Hero Section
```typescript
interface ChaHeroSection {
  headline: "Chá Revelação Perfeito e Seguro";
  subheadline: "Kits prontos com controle remoto para o momento mais especial";
  emotional_hook: "Transforme a revelação em um momento mágico e inesquecível";
  video: {
    title: "Momento da Revelação - Fumaça Rosa";
    duration: "15s";
    showcase: "reveal-moment-compilation";
  };
  cta: {
    primary: "Escolher Meu Kit";
    secondary: "Ver Ideias de Decoração";
  };
}
```

### 4.3 Kit Options
```typescript
interface ChaKitsSection {
  title: "Escolha seu Kit Perfeito";
  kits: [
    {
      name: "Kit Básico";
      price: "R$ 299";
      duration: "30 segundos";
      coverage: "Até 50 convidados";
      includes: [
        "2 bombas de fumaça (rosa + azul)",
        "Controle remoto 50m alcance",
        "Instruções passo a passo",
        "Suporte WhatsApp"
      ];
      best_for: "Revelação em casa, família próxima";
      cta: "Escolher Básico";
    },
    {
      name: "Kit Popular";
      price: "R$ 599";
      duration: "60 segundos";
      coverage: "Até 100 convidados";
      popular: true;
      includes: [
        "4 bombas de fumaça colorida",
        "2 fontes de faíscas douradas",
        "Controle remoto 100m alcance",
        "Trilha sonora sincronizada",
        "Suporte consultivo"
      ];
      best_for: "Festas em salão, maior impacto visual";
      cta: "Escolher Popular";
    },
    {
      name: "Kit Premium";
      price: "R$ 999";
      duration: "90 segundos";
      coverage: "Até 200 convidados";
      includes: [
        "6 bombas de fumaça + gradiente",
        "4 fontes de faíscas coloridas",
        "2 bombas de confetes temáticos",
        "Controle remoto 200m alcance",
        "Trilha personalizada",
        "Acompanhamento técnico remoto"
      ];
      best_for: "Eventos profissionais, máximo impacto";
      cta: "Escolher Premium";
    }
  ];
}
```

### 4.4 Safety & Instructions
```typescript
interface ChaSafetySection {
  title: "Segurança em Primeiro Lugar";
  safety_tips: [
    {
      title: "Distância Segura";
      description: "Mantenha 5 metros de distância mínima";
      icon: "distance";
    },
    {
      title: "Local Adequado";
      description: "Área aberta, longe de materiais inflamáveis";
      icon: "location";
    },
    {
      title: "Controle Remoto";
      description: "Acionamento à distância para máxima segurança";
      icon: "remote";
    },
    {
      title: "Instruções Claras";
      description: "Passo a passo ilustrado incluso no kit";
      icon: "instructions";
    }
  ];
  legal_requirements: [
    "Uso por maiores de 18 anos",
    "Seguir instruções do fabricante",
    "Verificar regulamentação local",
    "Manter crianças distantes"
  ];
}
```

### 4.5 Inspiration Gallery
```typescript
interface ChaGallerySection {
  title: "Inspirações para seu Chá";
  categories: [
    {
      name: "Decoração Rosa";
      images: ["cha-rosa-1.jpg", "cha-rosa-2.jpg", "cha-rosa-3.jpg"];
      description: "Ideias de decoração para meninas";
    },
    {
      name: "Decoração Azul";
      images: ["cha-azul-1.jpg", "cha-azul-2.jpg", "cha-azul-3.jpg"];
      description: "Ideias de decoração para meninos";
    },
    {
      name: "Cenários Externos";
      images: ["cha-externo-1.jpg", "cha-externo-2.jpg"];
      description: "Revelação em jardins e áreas abertas";
    }
  ];
  instagram_feed: "@m5maxproducoes"; // Auto-sync últimas 6 fotos com hashtag #charevelacao
}
```

---

## 5. Kits DIY Hub (`/kits`)

### 5.1 Objective
Vender kits certificados para eventos pequenos com foco em facilidade de uso e segurança.

### 5.2 Hero Section
```typescript
interface KitsHeroSection {
  headline: "Kits de Fogos Certificados para seu Evento";
  subheadline: "Seguros, legais e fáceis de usar - do Réveillon aos aniversários";
  value_props: [
    "Certificados pelos órgãos competentes",
    "Instruções claras e seguras",
    "Acionamento remoto incluso",
    "Curadoria por área e metragem"
  ];
  calculator: {
    title: "Encontre o kit ideal";
    inputs: [
      { label: "Tipo de evento", options: ["Réveillon", "Aniversário", "Confraternização"] },
      { label: "Tamanho da área", options: ["Quintal pequeno", "Quintal médio", "Área grande"] },
      { label: "Número de pessoas", range: [10, 200] }
    ];
    output: "Kit recomendado + preço estimado";
  };
}
```

### 5.3 Kit Categories
```typescript
interface KitsCategoriesSection {
  categories: [
    {
      name: "Kits Réveillon";
      link: "/kits/reveillon";
      description: "Celebre a chegada do ano novo com segurança";
      seasonality: "Vendas Q4 (set-dez)";
      popular_sizes: ["Família (10-20 pessoas)", "Condomínio (50-100 pessoas)"];
      starting_price: "R$ 199";
      image: "kit-reveillon-thumb.jpg";
    },
    {
      name: "Kits Aniversário";
      link: "/kits/aniversario";
      description: "Aniversários inesquecíveis para todas as idades";
      seasonality: "Year-round";
      popular_sizes: ["Infantil (seguro)", "Adulto (completo)"];
      starting_price: "R$ 149";
      image: "kit-aniversario-thumb.jpg";
    },
    {
      name: "Kits Confraternização";
      link: "/kits/confraternizacao";
      description: "Perfeito para empresas e grupos";
      seasonality: "Q4 principalmente";
      popular_sizes: ["Corporativo (100+ pessoas)", "Familiar (20-50 pessoas)"];
      starting_price: "R$ 249";
      image: "kit-confraternizacao-thumb.jpg";
    }
  ];
}
```

### 5.4 Size Guide
```typescript
interface KitsSizeGuide {
  title: "Guia de Tamanho por Área";
  size_chart: [
    {
      area: "Quintal Pequeno";
      dimensions: "Até 100m²";
      recommended_distance: "5m raio livre";
      kit_size: "Pequeno";
      duration: "30-60 segundos";
      price_range: "R$ 149-249";
    },
    {
      area: "Quintal Médio";
      dimensions: "100-300m²";
      recommended_distance: "10m raio livre";
      kit_size: "Médio";
      duration: "60-120 segundos";
      price_range: "R$ 249-399";
    },
    {
      area: "Área Grande";
      dimensions: "300m²+";
      recommended_distance: "15m+ raio livre";
      kit_size: "Grande";
      duration: "120-300 segundos";
      price_range: "R$ 399-799";
    }
  ];
  safety_note: "Sempre verifique regulamentação local antes da compra";
}
```

---

## 6. Cases/Portfólio (`/cases`)

### 6.1 Objetivo
Mostrar credibilidade através de cases reais com vídeos, métricas e depoimentos.

### 6.2 Featured Case
```typescript
interface FeaturedCase {
  title: "Réveillon Iate Clube Brasília 2024/2025";
  client: "Iate Clube de Brasília";
  videoId: "xUPt4tZIM-s";
  metrics: {
    attendees: "20.000 pessoas";
    duration: "15 minutos sincronizados";
    setup_time: "8 horas de montagem";
    safety_record: "Zero acidentes";
  };
  challenges: [
    "Show náutico com restrições ambientais",
    "Sincronização com orquestra ao vivo",
    "Segurança para grande público"
  ];
  solutions: [
    "Plataformas flutuantes certificadas",
    "Sistema de sincronização via rádio",
    "Equipe de segurança especializada"
  ];
  testimonial: {
    quote: "A M5 superou todas nossas expectativas. Profissionalismo e resultado impecável.";
    author: "João Silva";
    position: "Diretor de Eventos";
  };
}
```

### 6.3 Cases Grid
```typescript
interface CasesGrid {
  filters: ["Todos", "Réveillon", "Festa Junina", "Casamentos", "Festivais", "Corporativo"];
  cases: [
    {
      id: "iate-clube-2025";
      title: "Réveillon Iate Clube Brasília";
      category: "Réveillon";
      year: "2024/2025";
      thumbnail: "case-iate-thumb.jpg";
      videoId: "xUPt4tZIM-s";
      brief_description: "Show náutico para 20.000 pessoas";
      metrics: ["20.000 pessoas", "15 minutos", "Show náutico"];
    },
    // ... mais cases
  ];
  load_more: true;
  pagination: 12; // cases por página
}
```

---

## 7. Analytics Implementation per Page

### 7.1 Common Events (All Pages)
```typescript
const commonEvents = {
  page_view: {
    page_category: 'b2b|cha|kits|general',
    page_slug: string,
    page_title: string
  },
  scroll_depth_50: { page_slug: string },
  whatsapp_click: {
    source: 'header|hero|cta|floating',
    audience: 'b2b|cha|kits',
    utm_preserved: boolean
  },
  conversion_modal_open: {
    source: 'header|hero|cta|exit-intent',
    audience: 'b2b|cha|kits'
  }
};
```

### 7.2 B2B Specific Events
```typescript
const b2bEvents = {
  view_case: { case_id: string, case_category: string },
  request_quote: { audience: 'b2b', form_type: 'modal|page' },
  download_checklist: { lead_magnet: 'licencas|seguranca' },
  service_card_click: { service_type: 'reveillon|festa-junina|casamento|festival|clube' }
};
```

### 7.3 Chá/Kits Specific Events
```typescript
const chaKitsEvents = {
  view_item: {
    item_id: string,
    item_name: string,
    item_category: 'cha|kits',
    price: number,
    currency: 'BRL'
  },
  select_item: {
    item_id: string,
    audience: 'cha|kits',
    selection_type: 'kit-size|color|category'
  },
  begin_checkout: {
    item_id: string,
    value: number,
    currency: 'BRL',
    audience: 'cha|kits'
  }
};
```

---

## 8. Schema Markup per Page Type

### 8.1 LocalBusiness (Home + Contact)
```json
{
  "@type": "LocalBusiness",
  "name": "M5 Max Produções",
  "description": "Empresa de pirotecnia profissional com 40+ anos de experiência",
  "url": "https://m5max.com.br",
  "telephone": "+55-61-82735575",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brasília",
    "addressRegion": "DF",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -15.7797,
    "longitude": -47.9297
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "priceRange": "$$"
}
```

### 8.2 Product Schema (Kits/Chá)
```json
{
  "@type": "Product",
  "name": "Kit Chá Revelação Premium",
  "description": "Kit completo para chá revelação com controle remoto",
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "BRL",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "147"
  }
}
```

### 8.3 Event Schema (Cases)
```json
{
  "@type": "Event",
  "name": "Réveillon Iate Clube Brasília 2024/2025",
  "startDate": "2024-12-31T23:45:00-03:00",
  "endDate": "2025-01-01T00:15:00-03:00",
  "location": {
    "@type": "Place",
    "name": "Iate Clube de Brasília",
    "address": "Brasília, DF"
  },
  "performer": {
    "@type": "Organization",
    "name": "M5 Max Produções"
  }
}
```

---

*Esta especificação de páginas fornece o blueprint detalhado para desenvolvimento de cada seção do website, com foco em conversão por segmento e tracking completo.*