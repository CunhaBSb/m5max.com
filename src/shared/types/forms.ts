import { z } from 'zod';

// B2B Form Schema - Eventos corporativos e grandes celebrações
export const B2BFormSchema = z.object({
  eventType: z.enum(['reveillon', 'festa-junina', 'casamento', 'festival', 'formatura', 'corporativo', 'outro']),
  productType: z.enum(['kit-festa-basico', 'kit-festa-premium', 'kit-festa-deluxe', 'personalizado']).optional(),
  cityUF: z.string().min(1, 'Cidade/UF obrigatório'),
  eventDate: z.string().min(1, 'Data obrigatória'),
  attendeesRange: z.enum(['ate-500', '500-5k', '5k-20k', '20k+']),
  budgetRange: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
  venueType: z.enum(['indoor', 'outdoor']),
  hasNoiseRestrictions: z.boolean(),
  needsMusicSync: z.boolean(),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  companyName: z.string().optional(),
  additionalInfo: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional()
});

// B2C Form Schema - Eventos pessoais e chá revelação
export const B2CFormSchema = z.object({
  eventType: z.enum(['casamento', 'aniversario', 'cha-revelacao', 'noivado', 'outro']),
  productType: z.enum(['kit-cha-basico', 'kit-cha-premium', 'kit-cha-surpresa', 'kit-festa-basico', 'kit-festa-premium', 'personalizado']).optional(),
  cityUF: z.string().min(1, 'Cidade/UF obrigatório'),
  eventDate: z.string().min(1, 'Data obrigatória'),
  attendeesRange: z.enum(['ate-50', '50-100', '100-200', '200+']),
  budgetRange: z.enum(['ate-5k', '5k-15k', '15k-30k', '30k+']),
  venueType: z.enum(['residencia', 'salao', 'area-aberta', 'outro']),
  hasNoiseRestrictions: z.boolean(),
  specialRequests: z.string().optional(),
  // Campos específicos para chá revelação
  isGenderReveal: z.boolean().optional(),
  expectedGender: z.enum(['menino', 'menina', 'surpresa']).optional(),
  // Informações de contato
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  partnerName: z.string().optional(),
  additionalInfo: z.string().optional()
});

export type B2BFormData = z.infer<typeof B2BFormSchema>;
export type B2CFormData = z.infer<typeof B2CFormSchema>;

export type FormData = B2BFormData | B2CFormData;

// Product interface for e-commerce
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category?: string;
  features?: string[];
  image?: string;
  quantity?: number;
}

export interface FormSubmissionResult {
  success: boolean;
  leadScore: number;
  redirectUrl?: string;
  message: string;
  audience: 'b2b' | 'b2c';
}

export interface ConversionContext {
  source: string;
  audience: 'b2b' | 'b2c' | 'general';
  page?: string;
  productId?: string;
}

// Lead Scoring Weights para produtos específicos
export const LEAD_SCORING_WEIGHTS = {
  B2B: {
    budgetRange: {
      '5k-15k': 15,
      '15k-50k': 25,
      '50k-200k': 35,
      '200k+': 40
    },
    attendeesRange: {
      'ate-500': 10,
      '500-5k': 20,
      '5k-20k': 25,
      '20k+': 30
    },
    eventType: {
      'reveillon': 25,
      'festa-junina': 20,
      'casamento': 20,
      'festival': 25,
      'formatura': 15,
      'corporativo': 30,
      'outro': 10
    },
    productType: {
      'kit-festa-basico': 10,
      'kit-festa-premium': 20,
      'kit-festa-deluxe': 30,
      'personalizado': 25
    }
  },
  B2C: {
    budgetRange: {
      'ate-5k': 10,
      '5k-15k': 20,
      '15k-30k': 30,
      '30k+': 40
    },
    attendeesRange: {
      'ate-50': 15,
      '50-100': 20,
      '100-200': 25,
      '200+': 30
    },
    eventType: {
      'casamento': 30,
      'aniversario': 20,
      'cha-revelacao': 35,
      'noivado': 25,
      'outro': 10
    },
    productType: {
      'kit-cha-basico': 15,
      'kit-cha-premium': 25,
      'kit-cha-surpresa': 35,
      'kit-festa-basico': 15,
      'kit-festa-premium': 25,
      'personalizado': 20
    }
  }
};