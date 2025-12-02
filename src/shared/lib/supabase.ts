// 🔥 M5 MAX - Configuração Cliente Supabase
// Cliente unificado para acesso ao banco de dados

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KitFesta, KitChaRevelacao, Torta } from '@/shared/types/database';

// =============================================================================
// CONFIGURAÇÃO E TIPOS
// =============================================================================

// Tipos para o esquema do Supabase
interface Database {
  public: {
    Tables: {
      kit_festa: {
        Row: KitFesta;
        Insert: Omit<KitFesta, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KitFesta, 'id' | 'created_at' | 'updated_at'>>;
      };
      kit_cha_revelacao: {
        Row: KitChaRevelacao;
        Insert: Omit<KitChaRevelacao, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KitChaRevelacao, 'id' | 'created_at' | 'updated_at'>>;
      };
      tortas: {
        Row: Torta;
        Insert: Omit<Torta, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Torta, 'id' | 'created_at' | 'updated_at'>>;
      };
      lead_submissions: {
        Row: LeadSubmission;
        Insert: Omit<LeadSubmission, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LeadSubmission, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface LeadSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  city?: string;
  event_type?: string;
  event_date?: string;
  audience_size?: string;
  budget?: string;
  noise_restrictions?: boolean;
  audience?: string;
  audience_profile?: string;
  source?: string;
  page?: string;
  lead_score?: number;
  message?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// =============================================================================
// CLIENTE SUPABASE
// =============================================================================

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Cria e retorna uma instância do cliente Supabase
 * Implementa singleton pattern para reutilização
 */
export const createSupabaseClient = (): SupabaseClient<Database> => {
  // Verificar se as variáveis de ambiente estão configuradas
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase: Variáveis de ambiente não configuradas', {
      hasUrl: !!SUPABASE_URL,
      hasKey: !!SUPABASE_ANON_KEY
    });
    
    // Retornar um cliente mock para desenvolvimento
    return createMockSupabaseClient();
  }

  // Usar cliente singleton se já existe
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    // Criar novo cliente Supabase
    supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false // Para aplicação pública, não persistir sessão
      },
      global: {}
    });

    console.log('Supabase: Cliente inicializado com sucesso');
    return supabaseClient;

  } catch (error) {
    console.error('Supabase: Erro ao criar cliente:', error);
    return createMockSupabaseClient();
  }
};

// =============================================================================
// CLIENTE MOCK PARA DESENVOLVIMENTO
// =============================================================================

/**
 * Cliente mock para desenvolvimento quando Supabase não está configurado
 */
const createMockSupabaseClient = (): SupabaseClient<Database> => {
  console.warn('Supabase: Usando cliente mock para desenvolvimento');

  const createMockQuery = () => ({
    select: () => createMockQuery(),
    eq: () => createMockQuery(),
    neq: () => createMockQuery(),
    gt: () => createMockQuery(),
    gte: () => createMockQuery(),
    lt: () => createMockQuery(),
    lte: () => createMockQuery(),
    like: () => createMockQuery(),
    ilike: () => createMockQuery(),
    in: () => createMockQuery(),
    order: () => createMockQuery(),
    limit: () => createMockQuery(),
    single: () => Promise.resolve({ data: null, error: { message: 'Mock: No data available' } }),
    insert: async () => ({ data: null, error: null }),
    then: (resolve: (value: { data: unknown[]; error: unknown }) => void) => {
      setTimeout(() => {
        resolve({ 
          data: [], 
          error: { message: 'Mock: Supabase não configurado - usando dados locais', code: 'MOCK_CLIENT' }
        });
      }, 100);
      return Promise.resolve();
    }
  });

  return {
    from: () => createMockQuery(),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInAnonymously: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    channel: () => ({
      on: () => ({ subscribe: () => 'mock-subscription' }),
      unsubscribe: () => 'ok'
    })
  } as unknown as SupabaseClient<Database>;
};

// =============================================================================
// UTILITÁRIOS E HELPERS
// =============================================================================

/**
 * Verifica se o Supabase está configurado corretamente
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};

/**
 * Testa a conectividade com o Supabase
 */
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const client = createSupabaseClient();
    
    // Testar uma consulta simples
    const { error } = await client.from('kit_festa').select('id').limit(1);
    
    if (error) {
      console.warn('Supabase: Teste de conexão falhou:', error);
      return false;
    }

    console.log('Supabase: Teste de conexão bem-sucedido');
    return true;

  } catch (error) {
    console.warn('Supabase: Erro no teste de conexão:', error);
    return false;
  }
};

/**
 * Obtém informações sobre o estado do Supabase
 */
export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured(),
    hasUrl: !!SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY,
    client: supabaseClient ? 'initialized' : 'not-initialized'
  };
};

// =============================================================================
// EXPORT PRINCIPAL
// =============================================================================

// Cliente padrão para uso na aplicação
export const supabase = createSupabaseClient();

// Export para compatibilidade
export default supabase;
