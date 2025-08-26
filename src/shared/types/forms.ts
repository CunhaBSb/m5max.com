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

export type FormData = B2BFormData;

export interface FormSubmissionResult {
  success: boolean;
  leadScore: number;
  redirectUrl?: string;
  message: string;
}

export interface ConversionContext {
  source: string;
  audience: 'b2b' | 'general';
  page?: string;
  productId?: string;
}