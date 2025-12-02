import {
  DetectionFactors,
  DetectionResult,
  AudienceScore,
  CONFIDENCE_THRESHOLDS,
  DETECTION_WEIGHTS,
  UTM_PATTERNS,
  PRODUCT_AUDIENCE_MAP,
  PAGE_AUDIENCE_MAP
} from '@/shared/types/audienceTriage';
import { AudienceType, getAudienceCategory } from '@/shared/types/common';

/**
 * Detecta automaticamente a audiência com base em múltiplos fatores
 * @param factors Fatores de detecção (UTM, contexto, comportamento)
 * @returns Resultado da detecção com audiência sugerida e nível de confiança
 */
export function detectAudience(factors: DetectionFactors): DetectionResult {
  // Calcular scores para cada audiência
  const b2bCorporateScore = calculateB2BCorporateScore(factors);
  const b2cPersonalScore = calculateB2CPersonalScore(factors);
  const b2bSpecializedScore = calculateB2BSpecializedScore(factors);

  // Ordenar por score (maior primeiro)
  const scores: AudienceScore[] = [
    b2bCorporateScore,
    b2cPersonalScore,
    b2bSpecializedScore
  ].sort((a, b) => b.score - a.score);

  // Audiência com maior score
  const winner = scores[0];

  // Calcular breakdown total
  const utmScore = calculateUTMScore(factors);
  const contextScore = calculateContextScore(factors);
  const behaviorScore = calculateBehaviorScore(factors);

  // Determinar método de detecção recomendado
  let method: 'auto' | 'wizard' | 'manual' = 'wizard';
  if (winner.score >= CONFIDENCE_THRESHOLDS.AUTO_CLASSIFY) {
    method = 'auto';
  } else if (winner.score < CONFIDENCE_THRESHOLDS.SUGGEST) {
    method = 'wizard';
  }

  return {
    suggestedAudience: winner.audience,
    confidence: Math.round(winner.score),
    reasons: winner.factors,
    breakdown: {
      utmScore: Math.round(utmScore),
      contextScore: Math.round(contextScore),
      behaviorScore: Math.round(behaviorScore)
    },
    method
  };
}

/**
 * Calcula score para B2B Corporativo
 */
function calculateB2BCorporateScore(factors: DetectionFactors): AudienceScore {
  let score = 0;
  const reasons: string[] = [];

  // UTM Analysis (40 pts max)
  const utmB2BScore = analyzeUTMForAudience(factors, 'B2B_CORPORATE');
  score += utmB2BScore.score;
  reasons.push(...utmB2BScore.reasons);

  // Context Analysis (30 pts max)
  const contextB2BScore = analyzeContextForB2B(factors);
  score += contextB2BScore.score;
  reasons.push(...contextB2BScore.reasons);

  // Behavior Analysis (30 pts max)
  const behaviorB2BScore = analyzeBehaviorForB2B(factors);
  score += behaviorB2BScore.score;
  reasons.push(...behaviorB2BScore.reasons);

  return {
    audience: 'b2b-corporate',
    score,
    factors: reasons
  };
}

/**
 * Calcula score para B2C Personal
 */
function calculateB2CPersonalScore(factors: DetectionFactors): AudienceScore {
  let score = 0;
  const reasons: string[] = [];

  // UTM Analysis (40 pts max)
  const utmB2CScore = analyzeUTMForAudience(factors, 'B2C_PERSONAL');
  score += utmB2CScore.score;
  reasons.push(...utmB2CScore.reasons);

  // Context Analysis (30 pts max)
  const contextB2CScore = analyzeContextForB2C(factors);
  score += contextB2CScore.score;
  reasons.push(...contextB2CScore.reasons);

  // Behavior Analysis (30 pts max)
  const behaviorB2CScore = analyzeBehaviorForB2C(factors);
  score += behaviorB2CScore.score;
  reasons.push(...behaviorB2CScore.reasons);

  return {
    audience: 'b2c-personal',
    score,
    factors: reasons
  };
}

/**
 * Calcula score para B2B Specialized
 */
function calculateB2BSpecializedScore(factors: DetectionFactors): AudienceScore {
  let score = 0;
  const reasons: string[] = [];

  // UTM Analysis (40 pts max)
  const utmSpecializedScore = analyzeUTMForAudience(factors, 'B2B_SPECIALIZED');
  score += utmSpecializedScore.score;
  reasons.push(...utmSpecializedScore.reasons);

  // Context Analysis - páginas específicas têm peso alto
  if (factors.currentPage === '/orcamento-iate-2026') {
    score += 30;
    reasons.push('Página exclusiva para cliente especializado');
  }

  // Behavior - tempo alto no site indica pesquisa aprofundada
  if (factors.timeOnSite > 600000) { // > 10 min
    score += 15;
    reasons.push('Tempo significativo no site (pesquisa aprofundada)');
  } else if (factors.timeOnSite > 300000) { // > 5 min
    score += 10;
    reasons.push('Tempo considerável no site');
  }

  if (factors.pagesVisited > 5) {
    score += 15;
    reasons.push('Múltiplas páginas visitadas');
  }

  return {
    audience: 'b2b-specialized',
    score,
    factors: reasons
  };
}

/**
 * Analisa UTM params para uma audiência específica
 */
function analyzeUTMForAudience(
  factors: DetectionFactors,
  audienceKey: keyof typeof UTM_PATTERNS
): { score: number; reasons: string[] } {
  const pattern = UTM_PATTERNS[audienceKey];
  let score = 0;
  const reasons: string[] = [];

  // Verificar source
  if (factors.utmSource && pattern.sources.some(s => factors.utmSource?.toLowerCase().includes(s))) {
    score += 20;
    reasons.push(`UTM source: ${factors.utmSource}`);
  }

  // Verificar campaign
  if (factors.utmCampaign) {
    const campaignLower = factors.utmCampaign.toLowerCase();
    const matchedCampaigns = pattern.campaigns.filter(c => campaignLower.includes(c));
    if (matchedCampaigns.length > 0) {
      score += 20;
      reasons.push(`UTM campaign: ${matchedCampaigns.join(', ')}`);
    }
  }

  return { score, reasons };
}

/**
 * Analisa contexto para B2B
 */
function analyzeContextForB2B(factors: DetectionFactors): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Verificar página atual
  if (factors.currentPage === '/reveillon') {
    score += 15;
    reasons.push('Página de Réveillon (evento grande)');
  }

  // Verificar produtos visualizados
  const b2bProducts = factors.productsViewed.filter(p => {
    const category = PRODUCT_AUDIENCE_MAP[p];
    return category === 'b2b';
  });

  if (b2bProducts.length > 0) {
    score += 15;
    reasons.push(`Visualizou produtos B2B: ${b2bProducts.slice(0, 2).join(', ')}`);
  }

  return { score, reasons };
}

/**
 * Analisa contexto para B2C
 */
function analyzeContextForB2C(factors: DetectionFactors): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Verificar produtos visualizados
  const b2cProducts = factors.productsViewed.filter(p => {
    const category = PRODUCT_AUDIENCE_MAP[p];
    return category === 'b2c';
  });

  if (b2cProducts.length > 0) {
    score += 30;  // Alto peso para produtos claramente B2C
    reasons.push(`Visualizou produtos B2C: ${b2cProducts.slice(0, 2).join(', ')}`);
  }

  return { score, reasons };
}

/**
 * Analisa comportamento para B2B
 */
function analyzeBehaviorForB2B(factors: DetectionFactors): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Tempo no site (B2B geralmente pesquisa mais)
  if (factors.timeOnSite > 300000) { // > 5 min
    score += 10;
    reasons.push('Tempo de pesquisa significativo');
  }

  // Páginas visitadas
  if (factors.pagesVisited > 3) {
    score += 10;
    reasons.push('Múltiplas páginas visitadas');
  }

  // Última interação em serviços profissionais
  if (factors.lastInteraction === 'service') {
    score += 10;
    reasons.push('Interesse em serviços profissionais');
  }

  return { score, reasons };
}

/**
 * Analisa comportamento para B2C
 */
function analyzeBehaviorForB2C(factors: DetectionFactors): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // B2C pode ter menos tempo de pesquisa (decisão mais rápida)
  if (factors.timeOnSite > 120000 && factors.timeOnSite < 300000) { // 2-5 min
    score += 15;
    reasons.push('Tempo de pesquisa focado');
  }

  // Última interação em produto
  if (factors.lastInteraction === 'product') {
    score += 15;
    reasons.push('Interesse direto em produtos');
  }

  return { score, reasons };
}

/**
 * Calcula score total de UTM (para breakdown)
 */
function calculateUTMScore(factors: DetectionFactors): number {
  const b2bUTM = analyzeUTMForAudience(factors, 'B2B_CORPORATE');
  const b2cUTM = analyzeUTMForAudience(factors, 'B2C_PERSONAL');
  const specializedUTM = analyzeUTMForAudience(factors, 'B2B_SPECIALIZED');

  return Math.max(b2bUTM.score, b2cUTM.score, specializedUTM.score);
}

/**
 * Calcula score total de contexto (para breakdown)
 */
function calculateContextScore(factors: DetectionFactors): number {
  const b2bContext = analyzeContextForB2B(factors);
  const b2cContext = analyzeContextForB2C(factors);

  // Para B2B Specialized, apenas página específica
  let specializedContext = 0;
  if (factors.currentPage === '/orcamento-iate-2026') {
    specializedContext = 30;
  }

  return Math.max(b2bContext.score, b2cContext.score, specializedContext);
}

/**
 * Calcula score total de comportamento (para breakdown)
 */
function calculateBehaviorScore(factors: DetectionFactors): number {
  const b2bBehavior = analyzeBehaviorForB2B(factors);
  const b2cBehavior = analyzeBehaviorForB2C(factors);

  // B2B Specialized behavior score
  let specializedBehavior = 0;
  if (factors.timeOnSite > 600000) {
    specializedBehavior += 15;
  } else if (factors.timeOnSite > 300000) {
    specializedBehavior += 10;
  }
  if (factors.pagesVisited > 5) {
    specializedBehavior += 15;
  }

  return Math.max(b2bBehavior.score, b2cBehavior.score, specializedBehavior);
}

/**
 * Determina se deve mostrar wizard baseado em confiança
 */
export function shouldShowWizard(confidence: number): boolean {
  return confidence < CONFIDENCE_THRESHOLDS.AUTO_CLASSIFY;
}

/**
 * Determina se deve sugerir audiência (vs wizard completo)
 */
export function shouldSuggestAudience(confidence: number): boolean {
  return confidence >= CONFIDENCE_THRESHOLDS.SUGGEST && confidence < CONFIDENCE_THRESHOLDS.AUTO_CLASSIFY;
}

/**
 * Helper para converter audiência legacy para nova
 */
export function migrateAudience(legacyAudience: 'b2b' | 'b2c' | 'general'): AudienceType {
  if (legacyAudience === 'b2b') return 'b2b-corporate';
  if (legacyAudience === 'b2c') return 'b2c-personal';
  return 'general';
}
