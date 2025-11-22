export interface ProdutoKit {
  id: string;
  name: string;
  category: 'kit_festa' | 'kit_revelacao';
  description: string;
  components: string[];
  duration: string;
  price: number | null; // null para "sob consulta"
  promotional_price?: number;
  includes: string[];
  safety_level: string;
  includes_instructions: boolean;
  includes_detonator: boolean;
  is_active: boolean;
  created_at: string;
}

export interface ProdutoCategoria {
  id: 'kit_festa' | 'kit_revelacao';
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  publico_alvo: 'b2b' | 'b2c';
}

export const categoriasProdutos: ProdutoCategoria[] = [
  {
    id: 'kit_festa',
    nome: 'Kit Festa',
    descricao: 'Kits profissionais com tudo incluído: instruções, detonador e suporte técnico',
    icone: '🎉',
    cor: 'from-fire-gold to-fire-orange',
    publico_alvo: 'b2c'
  },
  {
    id: 'kit_revelacao',
    nome: 'Kit Chá Revelação',
    descricao: 'Momento mágico para revelar o gênero do bebê com cores especiais',
    icone: '👶',
    cor: 'from-pink-500 to-blue-500',
    publico_alvo: 'b2c'
  }
];

// PRODUTOS EXATOS CONFORME PRD
export const produtosKits: ProdutoKit[] = [
  // KITS PARA FESTAS (Conforme PRD seção 5.2)
  {
    id: 'M2',
    name: 'Kit Festa M2 — Pequena Celebração',
    category: 'kit_festa',
    description: 'Kit básico para pequenas celebrações',
    components: [
      '2 tortas: 1× 25 tubos 3/4"',
      '1× 25 tubos 0.6"'
    ],
    duration: '≈ 50 segundos',
    price: 276.49,
    includes: [
      'Instruções detalhadas',
      'Detonador a cabo'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: true,
    is_active: true,
    created_at: '2025-01-09'
  },
  {
    id: 'M3',
    name: 'Kit Festa M3 — Celebração Média',
    category: 'kit_festa',
    description: 'Kit intermediário para celebrações médias',
    components: [
      '3 tortas: 2× 25 tubos 3/4"',
      '1× 25 tubos 0.6"'
    ],
    duration: '≈ 120 segundos',
    price: 438.49,
    includes: [
      'Instruções detalhadas',
      'Detonador a cabo'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: true,
    is_active: true,
    created_at: '2025-01-09'
  },
  {
    id: 'M4',
    name: 'Kit Festa M4 — Grande Celebração',
    category: 'kit_festa',
    description: 'Kit avançado para grandes celebrações',
    components: [
      '4 tortas: 2× 25 tubos 3/4"',
      '1× 25 tubos 30mm',
      '1× 24 tubos 20mm'
    ],
    duration: '≈ 120 segundos',
    price: 770.80,
    includes: [
      'Instruções detalhadas',
      'Detonador a cabo'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: true,
    is_active: true,
    created_at: '2025-01-09'
  },
  {
    id: 'M5',
    name: 'Kit Festa M5 — Celebração Espetacular',
    category: 'kit_festa',
    description: 'Kit premium para celebrações espetaculares',
    components: [
      '5 tortas: 2× 25 tubos 3/4"',
      '1× 120 tubos 20mm',
      '1× 25 tubos 30mm',
      '1× 24 tubos 20mm'
    ],
    duration: 'A confirmar',
    price: 1520.80,
    includes: [
      'Instruções detalhadas',
      'Detonador a cabo',
      'Suporte técnico'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: true,
    is_active: true,
    created_at: '2025-01-09'
  },

  // KITS CHÁ REVELAÇÃO (Conforme PRD seção 5.2)
  {
    id: 'M2_revelacao',
    name: 'Kit Revelação M2 — Revelação Íntima',
    category: 'kit_revelacao',
    description: 'Kit básico para revelação íntima',
    components: [
      '2 Placas coloridas',
      '2 Gerbs'
    ],
    duration: '≈ 60 segundos',
    price: null, // Sob consulta
    includes: [
      'Cores: Azul, Rosa ou Surpresa',
      'Instruções detalhadas'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: false,
    is_active: true,
    created_at: '2025-01-09'
  },
  {
    id: 'M3_revelacao',
    name: 'Kit Revelação M3 — Revelação Especial',
    category: 'kit_revelacao',
    description: 'Kit intermediário para revelação especial',
    components: [
      '2 Placas coloridas',
      '2 Pó Mágico',
      '2 Gerbs'
    ],
    duration: '≈ 90 segundos',
    price: null, // Sob consulta
    includes: [
      'Cores: Azul, Rosa ou Surpresa',
      'Instruções detalhadas'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: false,
    is_active: true,
    created_at: '2025-01-09'
  },
  {
    id: 'M4_revelacao',
    name: 'Kit Revelação M4 — Revelação Premium',
    category: 'kit_revelacao',
    description: 'Kit avançado para revelação premium',
    components: [
      '4 Placas coloridas',
      '4 Pó Mágico',
      '2 Gerbs',
      'Controle Remoto'
    ],
    duration: '≈ 120 segundos',
    price: null, // Sob consulta
    includes: [
      'Cores: Azul, Rosa ou Surpresa',
      'Controle remoto incluído',
      'Instruções detalhadas'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: false,
    is_active: true,
    created_at: '2025-01-09'
  },
  {
    id: 'M5_revelacao',
    name: 'Kit Revelação M5 — Revelação Espetacular',
    category: 'kit_revelacao',
    description: 'Kit premium para revelação espetacular',
    components: [
      '4 Placas coloridas',
      '4 Pó Mágico',
      '2 Lançadores de Serpentina',
      '2 Gerbs',
      'Controle Remoto'
    ],
    duration: '≈ 150 segundos',
    price: null, // Sob consulta
    includes: [
      'Cores: Azul, Rosa ou Surpresa',
      'Controle remoto incluído',
      'Lançadores de serpentina',
      'Instruções detalhadas'
    ],
    safety_level: 'professional',
    includes_instructions: true,
    includes_detonator: false,
    is_active: true,
    created_at: '2025-01-09'
  }
];

// Funções utilitárias atualizadas para a nova estrutura
export const getProdutosByCategoria = (categoria: 'kit_festa' | 'kit_revelacao') => {
  return produtosKits.filter(produto => produto.category === categoria);
};

export const getProdutoById = (id: string) => {
  return produtosKits.find(produto => produto.id === id);
};

export const formatPreco = (price: number | null): string => {
  if (price === null) {
    return 'Sob consulta';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(price);
};

// Cores para kits revelação
export const coresRevelacao = [
  { id: 'azul', nome: 'Azul', cor: '#3B82F6', descricao: 'Para menino' },
  { id: 'rosa', nome: 'Rosa', cor: '#EC4899', descricao: 'Para menina' },
  { id: 'surpresa', nome: 'Surpresa', cor: '#8B5CF6', descricao: 'Mantém o suspense' }
];

// Safety badges conforme PRD
export const safetyBadges = [
  { id: 'certificado', nome: 'Certificado', icon: '🛡️' },
  { id: 'testado', nome: 'Testado', icon: '✅' },
  { id: 'instrucoes', nome: 'Instruções Incluídas', icon: '📋' },
  { id: 'suporte', nome: 'Suporte 24h', icon: '📞' }
];