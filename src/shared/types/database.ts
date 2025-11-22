// 🔥 M5 MAX - Tipos Database Supabase
// Sistema unificado de tipos para produtos pirotécnicos

// =============================================================================
// TIPOS BASE PARA TABELAS SUPABASE
// =============================================================================

export interface KitFesta {
  id: string;
  nome: string;
  descricao: string;
  componentes: string[]; // Array JSON dos componentes do kit
  duracao: string; // Ex: "≈ 50 segundos", "≈ 120 segundos"
  preco: number | null; // em centavos, null = "Sob consulta"
  preco_promocional?: number | null; // em centavos
  incluso: string[]; // Array JSON do que está incluído
  nivel_seguranca: 'professional' | 'standard' | 'premium';
  inclui_instrucoes: boolean;
  inclui_detonador: boolean;
  ativo: boolean; // Para ativar/desativar produtos
  ordem_exibicao?: number; // Para ordenação customizada
  popular?: boolean; // Destaque como "Mais Popular"
  created_at: string;
  updated_at: string;
}

export interface KitChaRevelacao {
  id: string;
  nome: string;
  descricao: string;
  componentes: string[]; // Array JSON dos componentes
  duracao: string; // Ex: "≈ 60 segundos", "≈ 150 segundos"
  cores_disponiveis: ('azul' | 'rosa' | 'surpresa')[]; // Cores temáticas
  preco: number | null; // em centavos, null = "Sob consulta"
  preco_promocional?: number | null; // em centavos
  incluso: string[]; // Array JSON do que está incluído
  nivel_seguranca: 'professional' | 'standard' | 'premium';
  inclui_controle_remoto: boolean; // Específico para chá revelação premium
  inclui_instrucoes: boolean;
  efeitos_especiais?: string[]; // Lançadores, serpentina, etc.
  ativo: boolean;
  ordem_exibicao?: number;
  popular?: boolean;
  created_at: string;
  updated_at: string;
}

// Tabela para tortas pirotécnicas individuais
export interface Torta {
  id: string;
  nome: string;
  descricao: string;
  especificacoes: {
    tubos: string;
    calibre: string;
    altura: string;
    duracao: string;
    efeitos: string;
  };
  caracteristicas: string[];
  popular: boolean;
  premium: boolean;
  ativo: boolean;
  ordem_exibicao?: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// TIPOS UNIFICADOS PARA FRONTEND
// =============================================================================

export type ProdutoCategoria = 'kit_festa' | 'kit_revelacao' | 'tortas';

// Interface unificada para todos os produtos
export interface ProdutoUnificado {
  id: string;
  nome: string;
  descricao: string;
  categoria: ProdutoCategoria;
  componentes?: string[]; // Opcional para tortas
  duracao?: string; // Opcional para tortas
  preco: number | null; // em centavos, null = "Sob consulta"
  preco_promocional?: number | null; // em centavos
  incluso?: string[]; // Opcional para tortas
  nivel_seguranca?: 'professional' | 'standard' | 'premium';
  ativo: boolean;
  popular?: boolean;
  ordem_exibicao?: number;
  created_at: string;
  updated_at: string;
  
  // Campos específicos Kit Festa
  inclui_instrucoes?: boolean;
  inclui_detonador?: boolean;
  
  // Campos específicos Kit Chá Revelação
  cores_disponiveis?: ('azul' | 'rosa' | 'surpresa')[];
  inclui_controle_remoto?: boolean;
  efeitos_especiais?: string[];
  
  // Campos específicos Tortas
  especificacoes?: {
    tubos?: string;
    calibre?: string;
    altura?: string;
    duracao?: string;
    efeitos?: string;
  };
  caracteristicas?: string[];
  premium?: boolean;
}

// Alias para compatibilidade com código legacy
export interface ProdutoKit extends ProdutoUnificado {
  name: string; // Alias para nome
  category: ProdutoCategoria; // Alias para categoria
  components: string[]; // Alias para componentes
  duration: string; // Alias para duracao
  price: number | null; // Alias para preco (convertido de centavos para reais)
  promotional_price?: number; // Alias para preco_promocional
  includes: string[]; // Alias para incluso
  safety_level: string; // Alias para nivel_seguranca
  includes_instructions: boolean; // Alias para inclui_instrucoes
  includes_detonator: boolean; // Alias para inclui_detonador
  is_active: boolean; // Alias para ativo
}

// =============================================================================
// TIPOS PARA CONFIGURAÇÃO E METADADOS
// =============================================================================

export interface CategoriaMetadata {
  id: ProdutoCategoria;
  nome: string;
  descricao: string;
  icone: string;
  cor_gradiente: string;
  publico_alvo: 'b2b' | 'b2c';
  slug: string;
}

export interface SupabaseProductsResponse<T> {
  data: T[] | null;
  error: DatabaseError | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

// =============================================================================
// TIPOS PARA FILTROS E QUERIES
// =============================================================================

export interface ProductFilters {
  categoria?: ProdutoCategoria;
  preco_min?: number;
  preco_max?: number;
  inclui_detonador?: boolean;
  inclui_controle_remoto?: boolean;
  cores_disponiveis?: ('azul' | 'rosa' | 'surpresa')[];
  ativo?: boolean;
  popular?: boolean;
  search?: string;
}

export interface ProductSort {
  campo: 'nome' | 'preco' | 'ordem_exibicao' | 'created_at' | 'updated_at';
  ordem: 'asc' | 'desc';
}

// =============================================================================
// CONSTANTES E CONFIGURAÇÕES
// =============================================================================

export const CATEGORIAS_METADATA: CategoriaMetadata[] = [
  {
    id: 'kit_festa',
    nome: 'Kit Festa',
    descricao: 'Kits profissionais com tudo incluído: instruções, detonador e suporte técnico',
    icone: '🎉',
    cor_gradiente: 'from-fire-gold to-fire-orange',
    publico_alvo: 'b2c',
    slug: 'kit-festa'
  },
  {
    id: 'kit_revelacao',
    nome: 'Kit Chá Revelação',
    descricao: 'Momento mágico para revelar o gênero do bebê com cores especiais',
    icone: '👶',
    cor_gradiente: 'from-pink-500 to-blue-500',
    publico_alvo: 'b2c',
    slug: 'cha-revelacao'
  },
  {
    id: 'tortas',
    nome: 'Tortas Pirotécnicas',
    descricao: 'Componentes individuais para shows personalizados e profissionais',
    icone: '🎆',
    cor_gradiente: 'from-purple-500 to-indigo-500',
    publico_alvo: 'b2b',
    slug: 'tortas'
  }
];

export const CORES_REVELACAO = [
  { id: 'azul', nome: 'Azul', cor: '#3B82F6', descricao: 'Para menino', emoji: '💙' },
  { id: 'rosa', nome: 'Rosa', cor: '#EC4899', descricao: 'Para menina', emoji: '💗' },
  { id: 'surpresa', nome: 'Surpresa', cor: '#8B5CF6', descricao: 'Mantém o suspense', emoji: '💜' }
] as const;

export const NIVEIS_SEGURANCA = [
  { id: 'standard', nome: 'Standard', descricao: 'Segurança básica certificada', icon: '🛡️' },
  { id: 'professional', nome: 'Professional', descricao: 'Padrão profissional com certificações', icon: '✅' },
  { id: 'premium', nome: 'Premium', descricao: 'Máxima segurança e controle', icon: '🏆' }
] as const;

// Safety badges para UI
export const SAFETY_BADGES = [
  { id: 'certificado', nome: 'Certificado', icon: '🛡️' },
  { id: 'testado', nome: 'Testado', icon: '✅' },
  { id: 'instrucoes', nome: 'Instruções Incluídas', icon: '📋' },
  { id: 'suporte', nome: 'Suporte 24h', icon: '📞' }
] as const;

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type DatabaseError = {
  message: string;
  code?: string;
  details?: string;
};

export type ProductLoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ProductCache {
  data: ProdutoUnificado[];
  timestamp: number;
  categoria: ProdutoCategoria;
  ttl: number; // Time to live em ms
}

// =============================================================================
// FUNÇÕES UTILITÁRIAS DE TIPO E CONVERSÃO
// =============================================================================

export const isKitFesta = (produto: ProdutoUnificado): produto is ProdutoUnificado & { 
  inclui_instrucoes: boolean; 
  inclui_detonador: boolean; 
} => {
  return produto.categoria === 'kit_festa';
};

export const isKitChaRevelacao = (produto: ProdutoUnificado): produto is ProdutoUnificado & { 
  cores_disponiveis: ('azul' | 'rosa' | 'surpresa')[];
  inclui_controle_remoto: boolean;
} => {
  return produto.categoria === 'kit_revelacao';
};

export const isTorta = (produto: ProdutoUnificado): produto is ProdutoUnificado & { 
  especificacoes: NonNullable<ProdutoUnificado['especificacoes']>;
  caracteristicas: string[];
  premium: boolean;
} => {
  return produto.categoria === 'tortas';
};

// Formatação de preços - suporta preço simples, range de preços e "sob consulta"
export const formatPreco = (preco: number | null, precoPromocional?: number | null): string => {
  if (preco === null) {
    return 'Sob consulta';
  }
  
  const formatarValor = (centavos: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(centavos / 100); // Converter centavos para reais
  };
  
  if (precoPromocional && precoPromocional < preco) {
    return `${formatarValor(precoPromocional)} (antes: ${formatarValor(preco)})`;
  }
  
  return formatarValor(preco);
};

// Formatação de range de preços para múltiplos produtos
export const formatPrecoRange = (precos: (number | null)[]): string => {
  const precosValidos = precos.filter((p): p is number => p !== null);
  
  if (precosValidos.length === 0) {
    return 'Sob consulta';
  }
  
  if (precosValidos.length === 1) {
    return formatPreco(precosValidos[0]);
  }
  
  const minPreco = Math.min(...precosValidos);
  const maxPreco = Math.max(...precosValidos);
  
  if (minPreco === maxPreco) {
    return formatPreco(minPreco);
  }
  
  return `${formatPreco(minPreco)} - ${formatPreco(maxPreco)}`;
};

// Conversão de legacy ProdutoKit para ProdutoUnificado
export const convertLegacyProduct = (legacyProduct: ProdutoKit): ProdutoUnificado => {
  const preco = legacyProduct.price ? Math.round(legacyProduct.price * 100) : null; // Converter reais para centavos
  const precoPromocional = legacyProduct.promotional_price ? Math.round(legacyProduct.promotional_price * 100) : undefined;
  
  return {
    id: legacyProduct.id,
    nome: legacyProduct.name,
    descricao: legacyProduct.description,
    categoria: legacyProduct.category,
    componentes: legacyProduct.components,
    duracao: legacyProduct.duration,
    preco,
    preco_promocional: precoPromocional,
    incluso: legacyProduct.includes,
    nivel_seguranca: legacyProduct.safety_level,
    ativo: legacyProduct.is_active,
    popular: false, // Default
    ordem_exibicao: 0, // Default
    created_at: legacyProduct.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    
    // Campos específicos Kit Festa
    inclui_instrucoes: legacyProduct.includes_instructions,
    inclui_detonador: legacyProduct.includes_detonator,
    
    // Campos específicos Kit Chá Revelação (se aplicável)
    cores_disponiveis: legacyProduct.category === 'kit_revelacao' ? ['azul', 'rosa', 'surpresa'] : undefined,
    inclui_controle_remoto: legacyProduct.category === 'kit_revelacao' && legacyProduct.components?.includes('Controle Remoto'),
    efeitos_especiais: legacyProduct.category === 'kit_revelacao' ? legacyProduct.components?.filter((c: string) => 
      c.includes('Lançadores') || c.includes('Serpentina') || c.includes('Pó Mágico')
    ) : undefined
  };
};

// Filtros e queries para produtos
export const getProdutosByCategoria = (produtos: ProdutoUnificado[], categoria: ProdutoCategoria): ProdutoUnificado[] => {
  return produtos.filter(produto => produto.categoria === categoria && produto.ativo);
};

export const getProdutoById = (produtos: ProdutoUnificado[], id: string): ProdutoUnificado | undefined => {
  return produtos.find(produto => produto.id === id);
};

export const getProdutosByPopularidade = (produtos: ProdutoUnificado[]): ProdutoUnificado[] => {
  return produtos
    .filter(produto => produto.ativo)
    .sort((a, b) => {
      // Primeiro, produtos populares
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      // Depois, ordem de exibição
      const ordemA = a.ordem_exibicao || 999;
      const ordemB = b.ordem_exibicao || 999;
      
      return ordemA - ordemB;
    });
};
