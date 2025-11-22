import { LEAD_SCORING_WEIGHTS } from '@shared/types/forms';
import type { B2BFormData, B2CFormData, Product } from '@shared/types/forms';

interface LeadScoringResult {
  totalScore: number;
  breakdown: Record<string, number>;
  classification: 'baixo' | 'medio' | 'alto' | 'premium';
  priority: 1 | 2 | 3 | 4 | 5;
  recommendations: string[];
  confidence: number; // 0-100, confiança na pontuação
  conversionProbability: number; // 0-100, probabilidade de conversão
}

// Dados específicos para scoring de e-commerce
interface EcommerceLeadData {
  selectedProducts?: Product[];
  quoteValue?: number;
  eventType?: string;
  eventDate?: string;
  guests?: number;
  budget?: string;
  urgency?: 'low' | 'medium' | 'high';
  source?: string;
  sessionTime?: number; // tempo na página em segundos
  pageViews?: number;
  previousVisits?: number;
}

// Nova função para scoring de e-commerce avançado
export function calculateEcommerceLeadScore(
  ecommerceData: EcommerceLeadData
): LeadScoringResult {
  const breakdown: Record<string, number> = {};
  let totalScore = 0;
  let confidence = 50; // base confidence

  // Pontuação por produtos selecionados (0-25 pontos)
  if (ecommerceData.selectedProducts && ecommerceData.selectedProducts.length > 0) {
    const productScore = Math.min(ecommerceData.selectedProducts.length * 8, 25);
    breakdown.selectedProducts = productScore;
    totalScore += productScore;
    confidence += 10;
  }

  // Pontuação por valor estimado do orçamento (0-30 pontos)
  if (ecommerceData.quoteValue) {
    let valueScore = 0;
    if (ecommerceData.quoteValue >= 5000) valueScore = 30;
    else if (ecommerceData.quoteValue >= 2000) valueScore = 25;
    else if (ecommerceData.quoteValue >= 1000) valueScore = 20;
    else if (ecommerceData.quoteValue >= 500) valueScore = 15;
    else valueScore = 10;
    
    breakdown.quoteValue = valueScore;
    totalScore += valueScore;
    confidence += 15;
  }

  // Pontuação por tipo de evento (0-20 pontos)
  if (ecommerceData.eventType) {
    const eventScores: Record<string, number> = {
      'casamento': 20,
      'reveillon': 18,
      'formatura': 16,
      'corporativo': 18,
      'aniversario': 14,
      'cha-revelacao': 15,
      'outros': 10
    };
    
    const eventScore = eventScores[ecommerceData.eventType] || 10;
    breakdown.eventType = eventScore;
    totalScore += eventScore;
    confidence += 10;
  }

  // Pontuação por urgência/data do evento (0-15 pontos)
  if (ecommerceData.eventDate) {
    const eventDate = new Date(ecommerceData.eventDate);
    const today = new Date();
    const daysDifference = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let urgencyScore = 0;
    if (daysDifference <= 15) urgencyScore = 15; // muito urgente
    else if (daysDifference <= 30) urgencyScore = 12; // urgente
    else if (daysDifference <= 60) urgencyScore = 10; // normal
    else if (daysDifference <= 120) urgencyScore = 8; // planejado
    else urgencyScore = 5; // muito antecipado
    
    breakdown.urgency = urgencyScore;
    totalScore += urgencyScore;
    confidence += 12;
  }

  // Pontuação por número de convidados (0-10 pontos)
  if (ecommerceData.guests) {
    let guestScore = 0;
    if (ecommerceData.guests >= 500) guestScore = 10;
    else if (ecommerceData.guests >= 200) guestScore = 8;
    else if (ecommerceData.guests >= 100) guestScore = 6;
    else if (ecommerceData.guests >= 50) guestScore = 4;
    else guestScore = 2;
    
    breakdown.guests = guestScore;
    totalScore += guestScore;
    confidence += 8;
  }

  // Pontuação por comportamento no site (0-15 pontos)
  let behaviorScore = 0;
  
  if (ecommerceData.sessionTime && ecommerceData.sessionTime > 300) { // mais de 5 minutos
    behaviorScore += 5;
    confidence += 8;
  }
  
  if (ecommerceData.pageViews && ecommerceData.pageViews > 5) {
    behaviorScore += 5;
    confidence += 5;
  }
  
  if (ecommerceData.previousVisits && ecommerceData.previousVisits > 1) {
    behaviorScore += 5; // cliente recorrente
    confidence += 10;
  }
  
  if (behaviorScore > 0) {
    breakdown.behavior = behaviorScore;
    totalScore += behaviorScore;
  }

  // Pontuação por fonte de tráfego (0-5 pontos)
  if (ecommerceData.source) {
    const sourceScores: Record<string, number> = {
      'google-ads': 5,
      'facebook-ads': 4,
      'instagram': 4,
      'google-organic': 3,
      'direct': 5, // tráfego direto é valioso
      'referral': 3,
      'social': 2
    };
    
    const sourceScore = sourceScores[ecommerceData.source] || 1;
    breakdown.source = sourceScore;
    totalScore += sourceScore;
  }

  // Calcular probabilidade de conversão baseada em dados históricos simulados
  const conversionProbability = calculateConversionProbability(totalScore, ecommerceData);

  // Classificação e prioridade
  const classification = getLeadClassification(totalScore);
  const priority = getLeadPriority(totalScore);
  const recommendations = getEcommerceRecommendations(totalScore, ecommerceData);

  return {
    totalScore: Math.min(totalScore, 100),
    breakdown,
    classification,
    priority,
    recommendations,
    confidence: Math.min(confidence, 100),
    conversionProbability
  };
}

// Função principal para calcular lead scoring (mantida para compatibilidade)
export function calculateLeadScore(
  formData: B2BFormData | B2CFormData,
  audience: 'b2b' | 'b2c'
): LeadScoringResult {
  const weights = LEAD_SCORING_WEIGHTS[audience === 'b2b' ? 'B2B' : 'B2C'];
  const breakdown: Record<string, number> = {};
  let totalScore = 0;

  // Pontuação por orçamento (peso maior)
  if ('budgetRange' in formData && formData.budgetRange) {
    const budgetScore = weights.budgetRange[formData.budgetRange] || 0;
    breakdown.budget = budgetScore;
    totalScore += budgetScore;
  }

  // Pontuação por número de convidados
  if ('attendeesRange' in formData && formData.attendeesRange) {
    const attendeesScore = weights.attendeesRange[formData.attendeesRange] || 0;
    breakdown.attendees = attendeesScore;
    totalScore += attendeesScore;
  }

  // Pontuação por tipo de evento
  if (formData.eventType) {
    const eventScore = weights.eventType[formData.eventType] || 0;
    breakdown.eventType = eventScore;
    totalScore += eventScore;
  }

  // Pontuação por tipo de produto (se especificado)
  if ('productType' in formData && formData.productType) {
    const productScore = weights.productType[formData.productType] || 0;
    breakdown.productType = productScore;
    totalScore += productScore;
  }

  // Pontuações adicionais baseadas em campos específicos
  if (audience === 'b2b') {
    const b2bData = formData as B2BFormData;
    
    // Empresa definida = +10 pontos
    if (b2bData.companyName && b2bData.companyName.trim()) {
      breakdown.hasCompany = 10;
      totalScore += 10;
    }
    
    // Sincronização musical = +5 pontos
    if (b2bData.needsMusicSync) {
      breakdown.musicSync = 5;
      totalScore += 5;
    }
  }

  if (audience === 'b2c') {
    const b2cData = formData as B2CFormData;
    
    // Chá revelação = +15 pontos (alta conversão)
    if (b2cData.isGenderReveal) {
      breakdown.genderReveal = 15;
      totalScore += 15;
    }
    
    // Nome do parceiro = +5 pontos
    if (b2cData.partnerName && b2cData.partnerName.trim()) {
      breakdown.hasPartner = 5;
      totalScore += 5;
    }
  }

  // Fatores de urgência baseados na data
  if (formData.eventDate) {
    const eventDate = new Date(formData.eventDate);
    const today = new Date();
    const daysDifference = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 30) {
      // Evento em menos de 30 dias = alta urgência
      breakdown.urgency = 15;
      totalScore += 15;
    } else if (daysDifference <= 90) {
      // Evento em menos de 90 dias = média urgência
      breakdown.urgency = 10;
      totalScore += 10;
    } else if (daysDifference <= 180) {
      // Evento em menos de 6 meses = baixa urgência
      breakdown.urgency = 5;
      totalScore += 5;
    }
  }

  // Qualidade do contato
  if (formData.contactEmail.includes('@gmail.com') || 
      formData.contactEmail.includes('@hotmail.com') ||
      formData.contactEmail.includes('@yahoo.com')) {
    // Email pessoal = pontuação normal
  } else {
    // Email corporativo/profissional = +5 pontos
    breakdown.professionalEmail = 5;
    totalScore += 5;
  }

  // Classificação final
  const classification = getLeadClassification(totalScore);
  const priority = getLeadPriority(totalScore);
  const recommendations = getRecommendations(totalScore, formData, audience);

  return {
    totalScore: Math.min(totalScore, 100), // Cap em 100
    breakdown,
    classification,
    priority,
    recommendations,
    confidence: 75, // Confidence padrão para formulários estruturados
    conversionProbability: calculateFormConversionProbability(totalScore, formData)
  };
}

// Classificação do lead baseada na pontuação
function getLeadClassification(score: number): 'baixo' | 'medio' | 'alto' | 'premium' {
  if (score >= 80) return 'premium';
  if (score >= 60) return 'alto';
  if (score >= 40) return 'medio';
  return 'baixo';
}

// Prioridade do lead (1-5, sendo 5 a mais alta)
function getLeadPriority(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 80) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  return 1;
}

// Recomendações de ação baseadas no lead
function getRecommendations(
  score: number, 
  formData: B2BFormData | B2CFormData, 
  audience: 'b2b' | 'b2c'
): string[] {
  const recommendations: string[] = [];

  if (score >= 80) {
    recommendations.push('🚀 Lead PREMIUM - Contato imediato obrigatório');
    recommendations.push('📞 Ligar em até 2 horas');
    recommendations.push('💎 Oferecer desconto especial ou brinde exclusivo');
  } else if (score >= 60) {
    recommendations.push('⭐ Lead ALTO valor - Prioridade alta');
    recommendations.push('📞 Contato em até 6 horas');
    recommendations.push('📋 Preparar proposta detalhada');
  } else if (score >= 40) {
    recommendations.push('📊 Lead MÉDIO - Acompanhamento padrão');
    recommendations.push('📧 Email seguido de ligação em 24h');
    recommendations.push('📝 Enviar material informativo');
  } else {
    recommendations.push('📋 Lead BAIXO - Nutrição necessária');
    recommendations.push('📧 Incluir em campanha de email marketing');
    recommendations.push('📱 Acompanhar via WhatsApp');
  }

  // Recomendações específicas por audiência
  if (audience === 'b2c') {
    const b2cData = formData as B2CFormData;
    if (b2cData.isGenderReveal) {
      recommendations.push('👶 Chá revelação - Mencionar exclusividade das cores');
      recommendations.push('📸 Oferecer pacote com fotografia');
    }
  }

  if (audience === 'b2b') {
    const b2bData = formData as B2BFormData;
    if (b2bData.needsMusicSync) {
      recommendations.push('🎵 Cliente interessado em sincronização musical');
      recommendations.push('🎼 Preparar demo com música personalizada');
    }
  }

  // Recomendações baseadas na urgência
  if (formData.eventDate) {
    const eventDate = new Date(formData.eventDate);
    const today = new Date();
    const daysDifference = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 30) {
      recommendations.push('⏰ URGENTE - Evento em menos de 30 dias');
      recommendations.push('🏃‍♂️ Acelerar processo de aprovação');
    } else if (daysDifference >= 365) {
      recommendations.push('📅 Evento distante - Incluir em follow-up mensal');
    }
  }

  return recommendations;
}

// Função utilitária para formatting do score para exibição
export function formatLeadScore(result: LeadScoringResult): string {
  const { totalScore, classification } = result;
  const emoji = {
    premium: '💎',
    alto: '⭐',
    medio: '📊',
    baixo: '📋'
  }[classification];
  
  return `${emoji} ${totalScore}/100 (${classification.toUpperCase()})`;
}

// Função para determinar próximos passos automaticamente
export function getNextSteps(result: LeadScoringResult): {
  timeToContact: string;
  method: 'phone' | 'email' | 'whatsapp';
  template: string;
} {
  const { totalScore, classification } = result;
  
  if (classification === 'premium') {
    return {
      timeToContact: '2 horas',
      method: 'phone',
      template: 'premium_immediate'
    };
  }
  
  if (classification === 'alto') {
    return {
      timeToContact: '6 horas',
      method: 'phone',
      template: 'high_value'
    };
  }
  
  if (classification === 'medio') {
    return {
      timeToContact: '24 horas',
      method: 'email',
      template: 'standard_followup'
    };
  }
  
  return {
    timeToContact: '72 horas',
    method: 'whatsapp',
    template: 'nurture_sequence'
  };
}

// Função para calcular probabilidade de conversão para e-commerce
function calculateConversionProbability(
  score: number, 
  ecommerceData: EcommerceLeadData
): number {
  let probability = score * 0.8; // Base: score influencia 80% da probabilidade
  
  // Ajustes baseados em comportamento específico
  if (ecommerceData.selectedProducts && ecommerceData.selectedProducts.length >= 2) {
    probability += 10; // múltiplos produtos = maior interesse
  }
  
  if (ecommerceData.sessionTime && ecommerceData.sessionTime > 600) { // mais de 10 min
    probability += 15; // alta intenção
  }
  
  if (ecommerceData.previousVisits && ecommerceData.previousVisits >= 3) {
    probability += 20; // cliente muito interessado
  }
  
  // Penalizar muito antecipado
  if (ecommerceData.eventDate) {
    const eventDate = new Date(ecommerceData.eventDate);
    const today = new Date();
    const daysDifference = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference > 365) {
      probability -= 15; // evento muito distante
    }
  }
  
  return Math.min(Math.max(probability, 5), 95); // Entre 5% e 95%
}

// Função para calcular probabilidade de conversão para formulários
function calculateFormConversionProbability(
  score: number,
  formData: B2BFormData | B2CFormData
): number {
  let probability = score * 0.9; // Formulários têm maior probabilidade base
  
  // Boost para formulários completos
  if (formData.contactEmail && formData.contactPhone) {
    probability += 10;
  }
  
  // Boost para B2B com empresa
  if ('companyName' in formData && formData.companyName) {
    probability += 15;
  }
  
  return Math.min(Math.max(probability, 10), 98);
}

// Recomendações específicas para e-commerce
function getEcommerceRecommendations(
  score: number,
  ecommerceData: EcommerceLeadData
): string[] {
  const recommendations: string[] = [];
  
  // Recomendações baseadas no score
  if (score >= 80) {
    recommendations.push('🚨 LEAD QUENTE - Ação imediata necessária!');
    recommendations.push('📞 Ligar em até 1 hora');
    recommendations.push('💎 Oferecer desconto exclusivo (10-15%)');
    recommendations.push('📋 Preparar proposta detalhada imediatamente');
  } else if (score >= 60) {
    recommendations.push('🔥 Lead de alta qualidade');
    recommendations.push('📞 Contato em até 4 horas');
    recommendations.push('🎁 Oferecer brinde ou desconto especial');
  } else if (score >= 40) {
    recommendations.push('📊 Lead promissor');
    recommendations.push('📧 Email personalizado + WhatsApp');
    recommendations.push('📱 Agendar demonstração virtual');
  } else {
    recommendations.push('🌱 Lead para nutrição');
    recommendations.push('📧 Incluir em sequência de email marketing');
    recommendations.push('📝 Enviar materiais educativos');
  }
  
  // Recomendações específicas baseadas no comportamento
  if (ecommerceData.selectedProducts && ecommerceData.selectedProducts.length > 1) {
    recommendations.push('🛒 Cliente comparou múltiplos produtos - destacar diferenças');
  }
  
  if (ecommerceData.sessionTime && ecommerceData.sessionTime > 600) {
    recommendations.push('⏰ Alto tempo na página - cliente muito interessado');
  }
  
  if (ecommerceData.previousVisits && ecommerceData.previousVisits > 1) {
    recommendations.push('🔄 Cliente recorrente - priorizar atendimento');
  }
  
  if (ecommerceData.quoteValue && ecommerceData.quoteValue >= 2000) {
    recommendations.push('💰 Alto valor potencial - envolver gerência no atendimento');
  }
  
  // Recomendações baseadas no tipo de evento
  if (ecommerceData.eventType === 'casamento') {
    recommendations.push('💒 Casamento - enfatizar momento único e inesquecível');
    recommendations.push('📸 Oferecer pacote com fotografia/vídeo');
  } else if (ecommerceData.eventType === 'corporativo') {
    recommendations.push('🏢 Evento corporativo - destacar profissionalismo e segurança');
    recommendations.push('📄 Enviar cases de sucesso corporativos');
  } else if (ecommerceData.eventType === 'cha-revelacao') {
    recommendations.push('👶 Chá revelação - enfatizar cores exclusivas e momento especial');
  }
  
  return recommendations;
}

// Função para exportar dados do lead scoring (para analytics)
export function exportLeadScoringData(
  result: LeadScoringResult,
  additionalData?: Record<string, unknown>
) {
  return {
    timestamp: new Date().toISOString(),
    score: result.totalScore,
    classification: result.classification,
    priority: result.priority,
    confidence: result.confidence,
    conversionProbability: result.conversionProbability,
    breakdown: result.breakdown,
    recommendationCount: result.recommendations.length,
    ...additionalData
  };
}
