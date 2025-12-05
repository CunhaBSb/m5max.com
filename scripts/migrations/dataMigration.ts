// 🔥 M5 MAX - Sistema de Migração de Dados
// Utilitários para migrar dados mockados para Supabase

import { supabase, isSupabaseConfigured } from './supabase';
import { produtosKits } from '@/features/produtos/data/produtos';
import { convertLegacyProduct, type ProdutoUnificado, type KitFesta, type KitChaRevelacao } from '@/shared/types/database';

// =============================================================================
// TIPOS E CONFIGURAÇÃO
// =============================================================================

interface MigrationResult {
  success: boolean;
  message: string;
  migrated: number;
  errors: string[];
}

interface MigrationSummary {
  kitFesta: MigrationResult;
  kitChaRevelacao: MigrationResult;
  total: {
    success: boolean;
    totalMigrated: number;
    totalErrors: number;
  };
}

// =============================================================================
// FUNÇÕES DE MIGRAÇÃO
// =============================================================================

/**
 * Migra produtos Kit Festa para o Supabase
 */
export const migrateKitsFesta = async (): Promise<MigrationResult> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase não configurado',
      migrated: 0,
      errors: ['Variáveis de ambiente do Supabase não encontradas']
    };
  }

  const errors: string[] = [];
  let migrated = 0;

  try {
    // Filtrar e converter produtos Kit Festa
    const kitFestaProducts = produtosKits
      .filter(p => p.category === 'kit_festa')
      .map(convertLegacyProduct);

    console.log(`Iniciando migração de ${kitFestaProducts.length} Kit Festa...`);

    // Inserir produtos no Supabase
    for (const produto of kitFestaProducts) {
      try {
        const kitFestaData: Omit<KitFesta, 'created_at' | 'updated_at'> = {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          componentes: produto.componentes || [],
          duracao: produto.duracao || '≈ 60 segundos',
          preco: produto.preco,
          preco_promocional: produto.preco_promocional,
          incluso: produto.incluso || [],
          nivel_seguranca: produto.nivel_seguranca || 'professional',
          inclui_instrucoes: produto.inclui_instrucoes ?? true,
          inclui_detonador: produto.inclui_detonador ?? false,
          ativo: produto.ativo,
          ordem_exibicao: produto.ordem_exibicao || 0,
          popular: produto.popular || false
        };

        const { error } = await supabase
          .from('kit_festa')
          .upsert(kitFestaData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (error) {
          errors.push(`Erro ao migrar ${produto.nome}: ${error.message}`);
        } else {
          migrated++;
          console.log(`✓ Migrado: ${produto.nome}`);
        }
      } catch (err) {
        const errorMsg = `Erro inesperado ao migrar ${produto.nome}: ${err}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `${migrated} Kit Festa migrados com sucesso` 
        : `${migrated} migrados, ${errors.length} com erro`,
      migrated,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: `Falha na migração Kit Festa: ${error}`,
      migrated,
      errors: [String(error)]
    };
  }
};

/**
 * Migra produtos Kit Chá Revelação para o Supabase
 */
export const migrateKitsChaRevelacao = async (): Promise<MigrationResult> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase não configurado',
      migrated: 0,
      errors: ['Variáveis de ambiente do Supabase não encontradas']
    };
  }

  const errors: string[] = [];
  let migrated = 0;

  try {
    // Filtrar e converter produtos Kit Chá Revelação
    const kitRevelacaoProducts = produtosKits
      .filter(p => p.category === 'kit_revelacao')
      .map(convertLegacyProduct);

    console.log(`Iniciando migração de ${kitRevelacaoProducts.length} Kit Chá Revelação...`);

    // Inserir produtos no Supabase
    for (const produto of kitRevelacaoProducts) {
      try {
        const kitChaData: Omit<KitChaRevelacao, 'created_at' | 'updated_at'> = {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          componentes: produto.componentes || [],
          duracao: produto.duracao || '≈ 60 segundos',
          cores_disponiveis: produto.cores_disponiveis || ['azul', 'rosa', 'surpresa'],
          preco: produto.preco,
          preco_promocional: produto.preco_promocional,
          incluso: produto.incluso || [],
          nivel_seguranca: produto.nivel_seguranca || 'professional',
          inclui_controle_remoto: produto.inclui_controle_remoto || false,
          inclui_instrucoes: produto.inclui_instrucoes ?? true,
          efeitos_especiais: produto.efeitos_especiais || [],
          ativo: produto.ativo,
          ordem_exibicao: produto.ordem_exibicao || 0,
          popular: produto.popular || false
        };

        const { error } = await supabase
          .from('kit_cha_revelacao')
          .upsert(kitChaData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (error) {
          errors.push(`Erro ao migrar ${produto.nome}: ${error.message}`);
        } else {
          migrated++;
          console.log(`✓ Migrado: ${produto.nome}`);
        }
      } catch (err) {
        const errorMsg = `Erro inesperado ao migrar ${produto.nome}: ${err}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `${migrated} Kit Chá Revelação migrados com sucesso` 
        : `${migrated} migrados, ${errors.length} com erro`,
      migrated,
      errors
    };

  } catch (error) {
    return {
      success: false,
      message: `Falha na migração Kit Chá Revelação: ${error}`,
      migrated,
      errors: [String(error)]
    };
  }
};

/**
 * Executa migração completa de todos os produtos
 */
export const migrateAllProducts = async (): Promise<MigrationSummary> => {
  console.log('🚀 Iniciando migração completa de produtos...');

  // Verificar se Supabase está configurado
  if (!isSupabaseConfigured()) {
    const errorResult: MigrationResult = {
      success: false,
      message: 'Supabase não configurado',
      migrated: 0,
      errors: ['Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY']
    };

    return {
      kitFesta: errorResult,
      kitChaRevelacao: errorResult,
      total: {
        success: false,
        totalMigrated: 0,
        totalErrors: 2
      }
    };
  }

  // Executar migrações em paralelo
  const [kitFestaResult, kitChaResult] = await Promise.all([
    migrateKitsFesta(),
    migrateKitsChaRevelacao()
  ]);

  const totalMigrated = kitFestaResult.migrated + kitChaResult.migrated;
  const totalErrors = kitFestaResult.errors.length + kitChaResult.errors.length;

  console.log(`\n📊 Resumo da Migração:`);
  console.log(`Kit Festa: ${kitFestaResult.migrated} migrados, ${kitFestaResult.errors.length} erros`);
  console.log(`Kit Chá Revelação: ${kitChaResult.migrated} migrados, ${kitChaResult.errors.length} erros`);
  console.log(`Total: ${totalMigrated} produtos migrados, ${totalErrors} erros`);

  return {
    kitFesta: kitFestaResult,
    kitChaRevelacao: kitChaResult,
    total: {
      success: totalErrors === 0 && totalMigrated > 0,
      totalMigrated,
      totalErrors
    }
  };
};

// =============================================================================
// FUNÇÕES UTILITÁRIAS
// =============================================================================

/**
 * Verifica o status da migração consultando dados no Supabase
 */
export const checkMigrationStatus = async () => {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      message: 'Supabase não configurado'
    };
  }

  try {
    // Contar produtos em cada tabela
    const [kitFestaCount, kitChaCount] = await Promise.all([
      supabase.from('kit_festa').select('id', { count: 'exact', head: true }),
      supabase.from('kit_cha_revelacao').select('id', { count: 'exact', head: true })
    ]);

    return {
      configured: true,
      kitFesta: {
        count: kitFestaCount.count || 0,
        error: kitFestaCount.error
      },
      kitChaRevelacao: {
        count: kitChaCount.count || 0,
        error: kitChaCount.error
      },
      message: 'Status obtido com sucesso'
    };

  } catch (error) {
    return {
      configured: true,
      error: String(error),
      message: 'Erro ao verificar status da migração'
    };
  }
};

/**
 * Limpa todas as tabelas de produtos (CUIDADO!)
 */
export const resetProductTables = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase não configurado'
    };
  }

  try {
    console.warn('⚠️ ATENÇÃO: Limpando todas as tabelas de produtos...');

    // Deletar todos os registros (manter estrutura da tabela)
    const [kitFestaDelete, kitChaDelete] = await Promise.all([
      supabase.from('kit_festa').delete().neq('id', ''),
      supabase.from('kit_cha_revelacao').delete().neq('id', '')
    ]);

    if (kitFestaDelete.error) {
      throw new Error(`Erro ao limpar kit_festa: ${kitFestaDelete.error.message}`);
    }

    if (kitChaDelete.error) {
      throw new Error(`Erro ao limpar kit_cha_revelacao: ${kitChaDelete.error.message}`);
    }

    return {
      success: true,
      message: 'Tabelas de produtos limpas com sucesso'
    };

  } catch (error) {
    return {
      success: false,
      message: `Erro ao limpar tabelas: ${error}`
    };
  }
};

// =============================================================================
// EXPORT PRINCIPAL
// =============================================================================

export default {
  migrateKitsFesta,
  migrateKitsChaRevelacao,
  migrateAllProducts,
  checkMigrationStatus,
  resetProductTables
};