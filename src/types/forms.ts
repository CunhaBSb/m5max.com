import { z } from 'zod';

// B2B Form Schema
export const B2BFormSchema = z.object({
  eventType: z.enum(['reveillon', 'festa-junina', 'casamento', 'festival', 'outro']),
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

export type B2BFormData = z.infer<typeof B2BFormSchema>;

// Chá Revelação Schema
export const ChaFormSchema = z.object({
  kitType: z.enum(['basico', 'popular', 'premium']),
  revealColor: z.enum(['rosa', 'azul', 'surpresa']),
  eventDate: z.string().min(1, 'Data obrigatória'),
  guestsCount: z.number().min(1).max(200),
  venueType: z.enum(['casa', 'salao', 'parque', 'praia']),
  needsRemoteControl: z.boolean(),
  needsPersonalization: z.boolean(),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  deliveryAddress: z.object({
    cep: z.string().min(8, 'CEP inválido'),
    street: z.string().min(1, 'Endereço obrigatório'),
    number: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    state: z.string().min(2, 'Estado obrigatório')
  })
});

export type ChaFormData = z.infer<typeof ChaFormSchema>;

// Kits DIY Schema
export const KitsFormSchema = z.object({
  kitCategory: z.enum(['reveillon', 'confraternizacao', 'aniversario']),
  kitSize: z.enum(['pequeno', 'medio', 'grande']),
  spaceSize: z.enum(['quintal-pequeno', 'quintal-medio', 'area-grande']),
  eventDate: z.string().min(1, 'Data obrigatória'),
  isOver18: z.boolean().refine(val => val === true, 'Deve ser maior de 18 anos'),
  acceptsTerms: z.boolean().refine(val => val === true, 'Deve aceitar os termos'),
  contactName: z.string().min(1, 'Nome obrigatório'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().min(10, 'Telefone inválido'),
  deliveryAddress: z.object({
    cep: z.string().min(8, 'CEP inválido'),
    street: z.string().min(1, 'Endereço obrigatório'),
    number: z.string().min(1, 'Número obrigatório'),
    city: z.string().min(1, 'Cidade obrigatória'),
    state: z.string().min(2, 'Estado obrigatório')
  })
});

export type KitsFormData = z.infer<typeof KitsFormSchema>;

export type FormData = B2BFormData | ChaFormData | KitsFormData;

export interface FormSubmissionResult {
  success: boolean;
  leadScore: number;
  redirectUrl?: string;
  message: string;
}

export interface ConversionContext {
  source: string;
  audience: 'b2b' | 'cha' | 'kits' | 'general';
  page?: string;
  productId?: string;
}