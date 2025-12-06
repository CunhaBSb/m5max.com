import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ProdutoCategoria, 
  ProdutoUnificado, 
  KitFesta, 
  KitChaRevelacao,
  Torta,
  SupabaseProductsResponse,
  ProductFilters,
  ProductSort,
  ProductLoadingState,
  ProductCache,
  DatabaseError,
  convertLegacyProduct
} from '@/shared/types/database';
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { produtosKits } from '@/features/produtos/data/produtos'; // Fallback data

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const CACHE_KEY_PREFIX = 'm5max_produtos_';

interface CacheManager {
  get: (key: string) => ProductCache | null;
  set: (key: string, data: ProdutoUnificado[], categoria: ProdutoCategoria) => void;
  clear: (categoria?: ProdutoCategoria) => void;
  isValid: (cache: ProductCache) => boolean;
}

const createCacheManager = (): CacheManager => {
  return {
    get: (key: string): ProductCache | null => {
      try {
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    },

    set: (key: string, data: ProdutoUnificado[], categoria: ProdutoCategoria): void => {
      try {
        const cache: ProductCache = {
          data,
          timestamp: Date.now(),
          categoria,
          ttl: CACHE_TTL
        };
        localStorage.setItem(key, JSON.stringify(cache));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Cache storage failed:', error);
        }
      }
    },

    clear: (categoria?: ProdutoCategoria): void => {
      try {
        if (categoria) {
          localStorage.removeItem(`${CACHE_KEY_PREFIX}${categoria}`);
        } else {
          Object.keys(localStorage)
            .filter(key => key.startsWith(CACHE_KEY_PREFIX))
            .forEach(key => localStorage.removeItem(key));
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Cache clear failed:', error);
        }
      }
    },

    isValid: (cache: ProductCache): boolean => {
      return (Date.now() - cache.timestamp) < cache.ttl;
    }
  };
};

// =============================================================================
// TRANSFORMERS PARA TORTAS
// =============================================================================

type TortaRow = Torta & {
  nome_torta?: string;
  tubos_efeitos?: string;
  especificacoes?: Torta['especificacoes'];
  caracteristicas?: string[];
};

const transformTorta = (raw: TortaRow): ProdutoUnificado => {
  return {
    id: String(raw.id),
    nome: raw.nome_torta || raw.nome || '',
    descricao: raw.descricao || '',
    categoria: 'tortas',
    // Tabela de tortas não possui preço no schema atual → null ("Sob consulta")
    preco: null,
    ativo: raw.ativo ?? true,
    popular: false,
    premium: false,
    ordem_exibicao: undefined,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    // Campos específicos das tortas (schema atual não traz json de especificações)
    especificacoes: raw.especificacoes,
    caracteristicas: raw.tubos_efeitos ? [String(raw.tubos_efeitos)] : raw.caracteristicas || [],
  };
};

// =============================================================================
// TRANSFORMERS - Supabase Data → Frontend Data
// =============================================================================

type KitFestaRow = KitFesta & {
  nome_kit?: string;
  tubos_efeitos?: string;
  segundos_aproximados?: number;
  detonador_pavio?: boolean;
};

const transformKitFesta = (raw: KitFestaRow): ProdutoUnificado => {
  const precoRaw = (raw as KitFestaRow).preco ?? (raw as KitFestaRow & { valor?: number }).valor ?? null;
  const precoNumber = precoRaw != null ? Number(precoRaw) : null;
  return {
    id: String(raw.id),
    nome: raw.nome_kit || raw.nome || '',
    descricao: raw.descricao || '',
    categoria: 'kit_festa',
    componentes: raw.componentes || (raw.tubos_efeitos ? [String(raw.tubos_efeitos)] : []),
    duracao: raw.duracao || (raw.segundos_aproximados ? `≈ ${raw.segundos_aproximados} segundos` : undefined),
    preco: precoNumber != null && !Number.isNaN(precoNumber) ? Math.round(precoNumber * 100) : null,
    preco_promocional: raw.preco_promocional != null ? Math.round(Number(raw.preco_promocional)) : null,
    incluso: raw.incluso || [],
    ativo: raw.ativo ?? true,
    popular: false,
    ordem_exibicao: undefined,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    // Específicos inferidos
    inclui_instrucoes: raw.inclui_instrucoes,
    inclui_detonador: typeof raw.inclui_detonador === 'boolean' ? raw.inclui_detonador : !!raw.detonador_pavio,
  };
};

type KitChaRevelacaoRow = KitChaRevelacao & {
  nome_kit?: string;
  tubos_efeitos?: string;
  segundos_aproximados?: number;
};

const transformKitChaRevelacao = (raw: KitChaRevelacaoRow): ProdutoUnificado => {
  const precoRawR = (raw as KitChaRevelacaoRow).preco ?? (raw as KitChaRevelacaoRow & { valor?: number }).valor ?? null;
  const precoNumber = precoRawR != null ? Number(precoRawR) : null;
  return {
    id: String(raw.id),
    nome: raw.nome_kit || raw.nome || '',
    descricao: raw.descricao || '',
    categoria: 'kit_revelacao',
    componentes: raw.componentes || (raw.tubos_efeitos ? [String(raw.tubos_efeitos)] : []),
    duracao: raw.duracao || (raw.segundos_aproximados ? `≈ ${raw.segundos_aproximados} segundos` : undefined),
    preco: precoNumber != null && !Number.isNaN(precoNumber) ? Math.round(precoNumber * 100) : null,
    preco_promocional: raw.preco_promocional != null ? Math.round(Number(raw.preco_promocional)) : null,
    incluso: raw.incluso || [],
    ativo: raw.ativo ?? true,
    popular: false,
    ordem_exibicao: undefined,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    // Específicos inferidos
    inclui_instrucoes: raw.inclui_instrucoes,
    inclui_controle_remoto: raw.inclui_controle_remoto,
    efeitos_especiais: raw.efeitos_especiais,
  };
};

// =============================================================================
// MAIN HOOK - useSupabaseProducts
// =============================================================================

interface UseSupabaseProductsOptions {
  categoria?: ProdutoCategoria;
  filters?: ProductFilters;
  sort?: ProductSort;
  enableCache?: boolean;
  fallbackToLocal?: boolean;
}

export const useSupabaseProducts = (
  options: UseSupabaseProductsOptions = {}
): SupabaseProductsResponse<ProdutoUnificado> => {
  const { categoria, enableCache = true, fallbackToLocal = true } = options;

  // Normalizar filtros e ordenação para identidades estáveis
  const defaultSort = useMemo<ProductSort>(() => ({ campo: 'ordem_exibicao', ordem: 'asc' }), []);
  // Normalize filters using a stable string dependency to satisfy eslint without complex expressions
  const filtersString = useMemo(() => JSON.stringify(options.filters ?? {}), [options.filters]);
  const normalizedFilters = useMemo<ProductFilters | undefined>(
    () => (filtersString && filtersString !== '{}' ? (JSON.parse(filtersString) as ProductFilters) : undefined),
    [filtersString]
  );
  const normalizedSort = useMemo<ProductSort>(
    () => (options.sort ? { ...options.sort } : defaultSort),
    [options.sort, defaultSort]
  );
  
  // Log de debug para desenvolvimento
  useEffect(() => {
    if (import.meta.env.DEV && categoria) {
      console.log('useSupabaseProducts: Configuração', {
        categoria,
        filters: normalizedFilters,
        sort: normalizedSort,
        supabaseConfigured: isSupabaseConfigured()
      });
    }
  }, [categoria, normalizedFilters, normalizedSort]);

  // State
  const [data, setData] = useState<ProdutoUnificado[] | null>(null);
  const [loading, setLoading] = useState<ProductLoadingState>('idle');
  const [error, setError] = useState<DatabaseError | null>(null);

  // Cache manager
  const cacheManager = useMemo(() => createCacheManager(), []);

  // Cache key
  const cacheKey = useMemo(() => {
    if (!categoria) return null;
    const filterKey = JSON.stringify({ filters: normalizedFilters ?? null, sort: normalizedSort });
    return `${CACHE_KEY_PREFIX}${categoria}_${btoa(filterKey)}`;
  }, [categoria, normalizedFilters, normalizedSort]);

  // Fallback to local data
  const getFallbackData = useCallback(() => {
    if (!fallbackToLocal) return [];

    // Converter dados legacy para formato unificado
    let fallbackProducts = produtosKits
      .filter(p => !categoria || p.category === categoria)
      .map(convertLegacyProduct);

    if (import.meta.env.DEV) {
      console.log(`Fallback: Carregados ${fallbackProducts.length} produtos locais da categoria ${categoria}`);
    }

    // Aplicar filtros de busca
    if (normalizedFilters?.search) {
      const searchTerm = normalizedFilters.search.toLowerCase();
      fallbackProducts = fallbackProducts.filter(p => {
        const searchableText = [
          p.nome,
          p.descricao,
          ...(p.componentes || []),
          ...(p.incluso || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
      });
    }

    // Aplicar filtros de preço (valores já em centavos no formato unificado) - apenas para kits
    if (categoria !== 'tortas') {
      if (normalizedFilters?.preco_min !== undefined) {
        const minCentavos = normalizedFilters.preco_min;
        fallbackProducts = fallbackProducts.filter(p => p.preco !== null && (p.preco as number) >= minCentavos);
      }

      if (normalizedFilters?.preco_max !== undefined) {
        const maxCentavos = normalizedFilters.preco_max;
        fallbackProducts = fallbackProducts.filter(p => p.preco !== null && (p.preco as number) <= maxCentavos);
      }
    }

    // Aplicar filtros específicos
    if (normalizedFilters?.inclui_detonador !== undefined) {
      fallbackProducts = fallbackProducts.filter(p => 
        p.inclui_detonador === normalizedFilters.inclui_detonador
      );
    }
    
    if (normalizedFilters?.inclui_controle_remoto !== undefined) {
      fallbackProducts = fallbackProducts.filter(p => 
        p.inclui_controle_remoto === normalizedFilters.inclui_controle_remoto
      );
    }

    // Aplicar ordenação
    fallbackProducts.sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      
      switch (normalizedSort.campo) {
        case 'preco':
          aVal = a.preco || 0;
          bVal = b.preco || 0;
          return normalizedSort.ordem === 'asc' ? aVal - bVal : bVal - aVal;
          
        case 'ordem_exibicao':
          aVal = a.ordem_exibicao || 999;
          bVal = b.ordem_exibicao || 999;
          return normalizedSort.ordem === 'asc' ? aVal - bVal : bVal - aVal;
          
        case 'nome': {
          aVal = a.nome || '';
          bVal = b.nome || '';
          const comparison = (aVal as string).localeCompare(bVal as string, 'pt-BR');
          return normalizedSort.ordem === 'asc' ? comparison : -comparison;
        }
          
        case 'created_at':
        case 'updated_at':
          aVal = new Date(a[normalizedSort.campo] || 0).getTime();
          bVal = new Date(b[normalizedSort.campo] || 0).getTime();
          return normalizedSort.ordem === 'asc' ? aVal - bVal : bVal - aVal;
          
        default:
          return 0;
      }
    });

    return fallbackProducts;
  }, [categoria, normalizedFilters, normalizedSort, fallbackToLocal]);

  // Fetch from Supabase
  const fetchFromSupabase = useCallback(async (): Promise<ProdutoUnificado[]> => {
    if (!categoria) return [];

    try {
      // Verificar se Supabase está configurado
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado - usando dados locais');
      }

      // Determinar nome da tabela
      const tableMap = {
        'kit_festa': 'kit_festa',
        'kit_revelacao': 'kit_cha_revelacao', 
        'tortas': 'tortas'
      };
      
      const tableName = tableMap[categoria];
      if (!tableName) {
        throw new Error(`Categoria não suportada: ${categoria}`);
      }
      
      // Construir query (primeiro tenta com ativo=true)
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('ativo', true);

      // Aplicar filtros de preço apenas para categorias que possuem preço
      // No schema atual, os kits usam coluna 'valor' (reais). No frontend trabalhamos em centavos.
      if (categoria !== 'tortas') {
        if (normalizedFilters?.preco_min !== undefined) {
          // Converter centavos -> reais para filtro server-side
          query = query.gte('valor', Math.floor(normalizedFilters.preco_min) / 100);
        }
        if (normalizedFilters?.preco_max !== undefined) {
          query = query.lte('valor', Math.floor(normalizedFilters.preco_max) / 100);
        }
      }

      // Aplicar ordenação
      // Estratégia de ordenação segura por categoria/coluna
      let sortField: string;
      if (categoria === 'tortas') {
        sortField = normalizedSort.campo === 'nome' ? 'nome_torta' :
                    normalizedSort.campo === 'created_at' ? 'created_at' :
                    normalizedSort.campo === 'updated_at' ? 'updated_at' : 'nome_torta';
      } else {
        sortField = normalizedSort.campo === 'nome' ? 'nome_kit' :
                    normalizedSort.campo === 'preco' ? 'valor' :
                    normalizedSort.campo === 'created_at' ? 'created_at' :
                    normalizedSort.campo === 'updated_at' ? 'updated_at' : 'created_at';
      }
      // Supabase JS aceita string de coluna, manter tipagem ampla
      query = query.order(sortField, { ascending: normalizedSort.ordem === 'asc' });

      let response = await query;

      if (response.error) {
        if (import.meta.env.DEV) {
          console.error('Supabase query error:', response.error);
        }
        throw new Error(response.error.message || 'Falha na consulta Supabase');
      }

      // Se nenhum resultado com ativo=true, tentar sem filtro de ativo
      if (!response.error && Array.isArray(response.data) && response.data.length === 0) {
        if (import.meta.env.DEV) {
          console.warn(`Supabase: zero resultados para ${tableName} com ativo=true. Tentando sem filtro de ativo.`);
        }
        response = await supabase.from(tableName).select('*');
      }

      // Transformar dados baseado na categoria
      let transformed: ProdutoUnificado[];
      
      switch (categoria) {
        case 'kit_festa':
          transformed = (response.data || []).map(transformKitFesta);
          break;
        case 'kit_revelacao':
          transformed = (response.data || []).map(transformKitChaRevelacao);
          break;
        case 'tortas':
          transformed = (response.data || []).map(transformTorta);
          break;
        default:
          throw new Error(`Transformação não implementada para categoria: ${categoria}`);
      }

      if (import.meta.env.DEV) {
        console.log(`Supabase: Carregados ${transformed.length} produtos da categoria ${categoria}`);
      }
      return transformed;

    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Supabase fetch failed:', err);
      }
      throw err;
    }
  }, [categoria, normalizedSort, normalizedFilters]);

  // Load data with cache
  const loadData = useCallback(async () => {
    if (!categoria) {
      setData([]);
      setLoading('success');
      return;
    }

    setLoading('loading');
    setError(null);

    try {
      // Check cache first
      if (enableCache && cacheKey) {
        const cached = cacheManager.get(cacheKey);
        if (cached && cacheManager.isValid(cached)) {
          setData(cached.data);
          setLoading('success');
          return;
        }
      }

      // Fetch from Supabase
      let products: ProdutoUnificado[];

      try {
        products = await fetchFromSupabase();
        if (import.meta.env.DEV) {
          console.log('Supabase fetch result:', products?.length || 0, 'products');
        }

        // Se Supabase retornar array vazio, usar fallback
        if (!products || products.length === 0) {
          if (import.meta.env.DEV) {
            console.warn('Supabase returned empty data, using fallback');
          }
          throw new Error('Supabase returned empty data');
        }
      } catch (supabaseError) {
        if (import.meta.env.DEV) {
          console.warn('Supabase failed, using fallback:', supabaseError);
        }
        products = getFallbackData();
        if (import.meta.env.DEV) {
          console.log('Fallback data:', products?.length || 0, 'products');
        }

        if (!products || products.length === 0) {
          setError({
            message: 'Falha ao carregar produtos do Supabase e fallback vazio',
            code: 'SUPABASE_FALLBACK_EMPTY'
          });
          setLoading('error');
          return;
        }
      }

      // Aplicar filtros adicionais do lado do cliente (para busca textual)
      if (normalizedFilters?.search) {
        const searchTerm = normalizedFilters.search.toLowerCase();
        products = products.filter(p => {
          const searchableText = [
            p.nome,
            p.descricao,
            ...(p.componentes || []),
            ...(p.incluso || []),
            ...(p.caracteristicas || [])
          ].join(' ').toLowerCase();
          
          return searchableText.includes(searchTerm);
        });

        if (import.meta.env.DEV) {
          console.log(`Filtro de busca "${searchTerm}": ${products.length} produtos restantes`);
        }
      }

      // Cache the results
      if (enableCache && cacheKey && products.length > 0) {
        cacheManager.set(cacheKey, products, categoria);
      }

      setData(products);
      setLoading('success');

    } catch (err) {
      const error = err as DatabaseError;
      setError(error);
      setLoading('error');
      
      // Last resort: use fallback
      if (fallbackToLocal) {
        const fallbackProducts = getFallbackData();
        if (fallbackProducts.length > 0) {
          setData(fallbackProducts);
          setLoading('success');
        }
      }
    }
  }, [categoria, cacheKey, enableCache, cacheManager, fetchFromSupabase, getFallbackData, normalizedFilters, fallbackToLocal]);

  // Refetch function
  const refetch = useCallback(async () => {
    if (cacheKey) {
      cacheManager.clear(categoria);
    }
    await loadData();
  }, [loadData, cacheKey, cacheManager, categoria]);

  // Load on mount and dependency changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    error,
    loading: loading === 'loading',
    refetch
  };
};

// =============================================================================
// SPECIALIZED HOOKS
// =============================================================================

export const useKitsFesta = (options?: Omit<UseSupabaseProductsOptions, 'categoria'>) => {
  return useSupabaseProducts({ ...options, categoria: 'kit_festa' });
};

export const useKitsChaRevelacao = (options?: Omit<UseSupabaseProductsOptions, 'categoria'>) => {
  return useSupabaseProducts({ ...options, categoria: 'kit_revelacao' });
};

export const useTortas = (options?: Omit<UseSupabaseProductsOptions, 'categoria'>) => {
  return useSupabaseProducts({ ...options, categoria: 'tortas' });
};

// Export cache manager for manual cache operations
export const productCacheManager = createCacheManager();
