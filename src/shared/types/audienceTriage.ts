import { AudienceType, AudienceCategory } from './common';

// Fatores considerados na detecção automática de audiência
export interface DetectionFactors {
  // UTM Analysis (40 pontos max)
  utmSource?: string;      // google-ads-b2b, facebook-casamentos
  utmCampaign?: string;    // reveillon-2026, cha-revelacao
  utmContent?: string;
  utmMedium?: string;

  // Context (30 pontos max)
  currentPage: string;    // /orcamento-iate-2026 = B2B Especializado
  productsViewed: string[];  // Kit Chá = B2C, Tortas = B2B

  // User Behavior (30 pontos max)
  timeOnSite: number;
  pagesVisited: number;
  lastInteraction?: 'product' | 'service' | 'hero' | 'footer';
}

// Resultado da detecção automática
export interface DetectionResult {
  suggestedAudience: AudienceType;
  confidence: number;  // 0-100
  reasons: string[];   // Motivos da classificação
  breakdown: {
    utmScore: number;
    contextScore: number;
    behaviorScore: number;
  };
  method: 'auto' | 'wizard' | 'manual';  // Como foi classificado
}

// Score por audiência (para escolher a mais provável)
export interface AudienceScore {
  audience: AudienceType;
  score: number;  // 0-100
  factors: string[];  // Razões que contribuíram
}

// Estado de triagem armazenado no store
export interface TriageData {
  detectedAudience?: AudienceType;
  confidence?: number;
  detectionMethod?: 'auto' | 'wizard' | 'manual';
  detectedAt?: string;  // ISO timestamp
  userCorrected?: boolean;  // Se usuário mudou a classificação
  previousAudience?: AudienceType;  // Audiência anterior se mudou
}

// Thresholds de confiança para decisão
export const CONFIDENCE_THRESHOLDS = {
  AUTO_CLASSIFY: 70,     // >= 70%: auto-classifica e skip wizard
  SUGGEST: 40,           // 40-69%: sugere mas pede confirmação
  FULL_WIZARD: 0         // < 40%: wizard completo de triagem
} as const;

// Pesos de scoring para detecção (total = 100 pontos)
export const DETECTION_WEIGHTS = {
  UTM: 40,        // 40 pontos max
  CONTEXT: 30,    // 30 pontos max
  BEHAVIOR: 30    // 30 pontos max
} as const;

// Padrões de UTM para identificação automática
export const UTM_PATTERNS = {
  B2B_CORPORATE: {
    sources: ['google-ads-empresas', 'linkedin', 'google-ads-b2b'],
    campaigns: ['corporativo', 'empresa', 'b2b', 'festival', 'reveillon'],
    score: 40
  },
  B2C_PERSONAL: {
    sources: ['facebook-casamentos', 'instagram-cha', 'google-ads-casamento'],
    campaigns: ['casamento', 'cha', 'revelacao', 'aniversario', 'noivado'],
    score: 40
  },
  B2B_SPECIALIZED: {
    sources: ['direct', 'referral'],
    campaigns: ['iate', 'cliente-especial', 'vip'],
    score: 40
  }
} as const;

// Produtos e suas audiências
export const PRODUCT_AUDIENCE_MAP: Record<string, AudienceCategory> = {
  'kit-cha-revelacao': 'b2c',
  'kit-cha-basico': 'b2c',
  'kit-cha-premium': 'b2c',
  'kit-cha-surpresa': 'b2c',
  'tortas': 'b2b',
  'torta-pirotecnica': 'b2b',
  'kit-festa': 'b2b',  // Pode ser ambíguo mas mais comum em B2B
  'kit-festa-basico': 'b2b',
  'kit-festa-premium': 'b2b',
  'kit-festa-deluxe': 'b2b'
};

// Páginas e suas audiências padrão
export const PAGE_AUDIENCE_MAP: Record<string, AudienceType> = {
  '/orcamento-iate-2026': 'b2b-specialized',
  '/reveillon': 'b2b-corporate',
  '/produtos': 'general',  // Depende do produto
  '/': 'general'
};
