import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/shared/store/appStore';
import { AudienceType } from '@/shared/types/common';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Loader2, MessageCircle, AlertCircle, Send, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface FormModalContentProps {
  audience: AudienceType;
  source: string;
  initialData?: {
    attendeesRange?: string;
    budgetRange?: string;
  };
  onComplete?: () => void;
  onSuccess?: () => void;
  isOpen?: boolean;
  context?: {
    page: string;
    eventType?: string;
    productId?: string;
  };
  onStepChange?: (step: number) => void;
}

const FormModalContent: React.FC<FormModalContentProps> = ({
  audience,
  source,
  initialData,
  onComplete,
  onSuccess,
  isOpen,
  context
  ,
  onStepChange
}) => {
  const { trackFormEvent, trackWhatsAppClick, trackEvent, trackAdsConversion } = useAnalytics();
  const { attribution } = useAppStore();

const formSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  eventType: z.enum(['reveillon', 'corporativo', 'casamento', 'cha-revelacao', 'festa', 'outro']),
  city: z.string().min(2, 'Cidade/UF obrigatória'),
  eventDate: z.string().min(1, 'Data obrigatória'),
  audienceSize: z.enum(['ate-500', '500-5k', '5k-20k', '20k+']),
  budget: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
  fireworkPoints: z.string().min(1, 'Informe a quantidade de pontos'),
  noiseRestrictions: z.boolean().default(false),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type BudgetOption = FormValues['budget'];
type AudienceSizeOption = FormValues['audienceSize'];

const mapBudgetRange = (wizardBudget?: string): BudgetOption => {
  if (!wizardBudget) return '50k-200k';
  if (wizardBudget === '5k') return '5k-15k';
  if (wizardBudget === '15k') return '15k-50k';
  if (wizardBudget === '50k') return '50k-200k';
  if (wizardBudget === '100k+') return '200k+';
  return '50k-200k';
};

const mapAttendeesRange = (wizardAttendees?: string): AudienceSizeOption => {
  if (!wizardAttendees) return '5k-20k';
  if (wizardAttendees === 'ate-50' || wizardAttendees === '50-200') return 'ate-500';
  if (wizardAttendees === '200-500') return '500-5k';
  if (wizardAttendees === '500+') return '5k-20k';
  return '5k-20k';
};

  // Map wizard budget ranges to form budget ranges
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: (context?.eventType as FormValues['eventType'] | undefined) || '',
      eventDate: '',
      audienceSize: mapAttendeesRange(initialData?.attendeesRange),
      budget: mapBudgetRange(initialData?.budgetRange),
      fireworkPoints: '',
      noiseRestrictions: false,
    }
  });

  type FormFieldName = keyof FormValues;

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const d1 = digits.slice(0, 2);
    const d2 = digits.slice(2, 7);
    const d3 = digits.slice(7, 11);
    if (digits.length > 7) return `(${d1}) ${d2}-${d3}`;
    if (digits.length > 2) return `(${d1}) ${d2}`;
    if (digits.length > 0) return `(${d1}`;
    return '';
  };

  const whatsappUrl = useMemo(() => {
    const message = getWhatsAppMessage(
      audience === 'b2c-personal' ? 'b2c' : 'b2b',
      {
        eventType: form.getValues('eventType') || 'Orçamento',
        cityUF: form.getValues('city') || 'Brasília - DF',
        eventDate: form.getValues('eventDate') || '',
      }
    );
    return generateWhatsAppURL(message, attribution?.utm, { audience, source });
  }, [attribution?.utm, source, audience, form]);

  const inferProfile = (values: Partial<FormValues>) => {
    const { eventType, audienceSize, budget } = values;
    if (eventType === 'reveillon' && (audienceSize === '5k-20k' || audienceSize === '20k+')) return 'promotor-clube';
    if (eventType === 'corporativo') return 'promotor-corporativo';
    if (eventType === 'cha-revelacao') return 'cha-revelacao';
    if (eventType === 'casamento') return 'casamento-noivos';
    if (eventType === 'festa' || budget === '5k-15k') return 'residencial';
    return 'outro';
  };

  const derivedProfile = inferProfile(form.watch());

  const submitLead = async (values: FormValues) => {
    if (step !== 3) return; // segurança extra
    if (status === 'idle') {
      trackFormEvent('start', {
        form_type: audience,
        form_name: 'site_budget_modal',
        source,
        page_category: audience,
        lead_score: estimateLeadScore(values)
      });
    }

    setStatus('sending');
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setStatus('error');
      setErrorMessage('Supabase não configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      trackEvent('budget_triage_supabase_error', { reason: 'not_configured' });
      return;
    }

    const { eventType, eventDate, audienceSize, noiseRestrictions, fireworkPoints, ...rest } = values;

    const payload = {
      ...rest,
      event_type: eventType,
      event_date: eventDate,
      audience_size: audienceSize,
      noise_restrictions: noiseRestrictions,
      firework_points: fireworkPoints,
      audience,
      audience_profile: derivedProfile,
      source,
      page: typeof window !== 'undefined' ? window.location.pathname : context?.page,
      lead_score: estimateLeadScore(values),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('lead_submissions')
      .insert(payload, { returning: 'minimal' });

    if (error) {
      console.error('Supabase insert error', error);
      setStatus('error');
      setErrorMessage(`Erro ao enviar: ${error.message ?? 'tente novamente ou use WhatsApp.'}`);
      trackEvent('budget_triage_supabase_error', {
        reason: error.message,
        code: (error as PostgrestError | null)?.code,
      });
      return;
    }

    trackFormEvent('submit', {
      form_type: audience,
      form_name: 'site_budget_modal',
      lead_score: payload.lead_score,
    });

    trackEvent('budget_triage_submit', {
      audience,
      audience_profile: derivedProfile,
      event_type: values.eventType,
      budget: values.budget,
      audience_size: values.audienceSize,
      noise_restrictions: values.noiseRestrictions,
      lead_id: undefined,
    });

    // Google Ads conversion (lead enviado)
    trackAdsConversion('AW-17513080416/-rh5COHrhY8bEODM8Z5B', 1, 'BRL');

    setStatus('success');
    onSuccess?.(); // pai decide fechar o modal e exibir banner
  };

  const handleWhatsapp = () => {
    trackWhatsAppClick({
      audience,
      source,
      message_template: 'Modal orçamento',
      phone_number: '5561982735575',
    });
    trackEvent('budget_triage_whatsapp', {
      audience,
      audience_profile: derivedProfile,
      event_type: form.getValues('eventType'),
      budget: form.getValues('budget'),
      audience_size: form.getValues('audienceSize'),
    });
    window.open(whatsappUrl, '_blank');
  };

  const nextStep = () => {
    const next = Math.min(3, (step + 1) as typeof step);
    setStatus('idle');
    setErrorMessage(null);
    setStep(next);
    onStepChange?.(next);
    if (next === 3) {
      trackEvent('budget_form_final_step', {
        audience,
        source,
        page_category: audience,
      });
    }
    trackEvent('budget_triage_step_view', {
      step: next,
      audience,
      audience_profile: derivedProfile,
      event_type: form.getValues('eventType'),
      budget: form.getValues('budget'),
      audience_size: form.getValues('audienceSize'),
    });
  };
  const prevStep = () => {
    const prev = Math.max(1, (step - 1) as typeof step);
    setStatus('idle');
    setErrorMessage(null);
    setStep(prev);
    onStepChange?.(prev);
  };

  useEffect(() => {
    onStepChange?.(step);
    if (step === 3) {
      trackEvent('budget_form_final_step', {
        audience,
        source,
        page_category: audience,
      });
    }
  }, [onStepChange, step, audience, source, trackEvent]);

  // Reset apenas na transição de abrir (evita apagar enquanto o usuário digita)
  const prevOpen = React.useRef<boolean>(false);
  useEffect(() => {
    const justOpened = isOpen && !prevOpen.current;
    prevOpen.current = !!isOpen;
    if (!justOpened) return;

    setStatus('idle');
    setErrorMessage(null);
    setStep(1);
    form.reset({
      eventType: (context?.eventType as FormValues['eventType'] | undefined) || '',
      eventDate: '',
      audienceSize: mapAttendeesRange(initialData?.attendeesRange),
      budget: mapBudgetRange(initialData?.budgetRange),
      fireworkPoints: '',
      noiseRestrictions: false,
      name: '',
      email: '',
      phone: '',
      city: '',
      message: '',
    });
  }, [isOpen, form, initialData?.attendeesRange, initialData?.budgetRange, context?.eventType]);

  return (
    <Card className="bg-slate-950/90 border border-white/10 shadow-[0_10px_35px_-22px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in duration-200">
      <CardContent className="p-4 sm:p-6 space-y-3 pb-16">
        <div className="flex flex-col gap-1" />

        <Form {...form}>
          <form className="space-y-3" noValidate>
                    {step === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in slide-in-from-right duration-150">
                        <FormField name="name" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl><Input data-testid="budget-name" placeholder="Responsável pelo evento" {...field} /></FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl><Input data-testid="budget-email" type="email" placeholder="email@empresa.com" {...field} /></FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )} />

                <FormField name="phone" control={form.control} render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Telefone/WhatsApp</FormLabel>
                    <FormControl>
                              <Input
                                data-testid="budget-phone"
                                placeholder="(61) 99999-1234"
                                value={field.value || ''}
                                inputMode="tel"
                                onChange={(e) => field.onChange(formatPhone(e.target.value))}
                              />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )} />
                      </div>
                    )}

            {step === 2 && (
              <div className="space-y-2.5 animate-in slide-in-from-right duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <FormField name="eventType" control={form.control} render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Tipo de evento</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger data-testid="budget-event-type"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reveillon">Réveillon</SelectItem>
                            <SelectItem value="corporativo">Corporativo</SelectItem>
                            <SelectItem value="casamento">Casamento</SelectItem>
                            <SelectItem value="cha-revelacao">Chá revelação</SelectItem>
                            <SelectItem value="festa">Festa</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />

                  <FormField name="eventDate" control={form.control} render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Data do evento</FormLabel>
                      <FormControl><Input data-testid="budget-date" type="date" {...field} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />

                  <FormField name="city" control={form.control} render={({ field }) => (
                    <FormItem className="sm:col-span-2 lg:col-span-1">
                      <FormLabel>Cidade/UF</FormLabel>
                      <FormControl><Input data-testid="budget-city" placeholder="Brasília - DF" {...field} /></FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />

                  <FormField name="audienceSize" control={form.control} render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Público estimado</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger data-testid="budget-audience"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ate-500">Até 500</SelectItem>
                            <SelectItem value="500-5k">500 a 5.000</SelectItem>
                            <SelectItem value="5k-20k">5.000 a 20.000</SelectItem>
                            <SelectItem value="20k+">20.000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />

                  <FormField name="budget" control={form.control} render={({ field }) => (
                    <FormItem className="lg:col-span-1">
                      <FormLabel>Orçamento estimado</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                          <SelectTrigger data-testid="budget-range"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5k-15k">R$ 5k - 15k</SelectItem>
                            <SelectItem value="15k-50k">R$ 15k - 50k</SelectItem>
                            <SelectItem value="50k-200k">R$ 50k - 200k</SelectItem>
                            <SelectItem value="200k+">R$ 200k+</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />

                  <FormField name="fireworkPoints" control={form.control} render={({ field }) => (
                    <FormItem className="sm:col-span-2 lg:col-span-1">
                      <FormLabel>Quantidade de pontos de fogos</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="budget-points"
                          placeholder="Ex: 2 pontos (palco e ilha)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2.5 animate-in slide-in-from-right duration-150">
                <FormField name="noiseRestrictions" control={form.control} render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0 rounded-md border border-white/10 px-3 py-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-sm">Há restrição de ruído?</FormLabel>
                      <p className="text-xs text-muted-foreground">Ajustamos calibres, distâncias e lineup conforme zona.</p>
                    </div>
                  </FormItem>
                )} />

                <FormField name="message" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        className="min-h-[44px]"
                        placeholder="Pontos de filmagem, horários, logística..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )} />

              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start gap-2 text-amber-100 text-sm bg-amber-500/10 border border-amber-500/30 rounded-md p-3">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Mensagem de sucesso será exibida fora do modal pelo fluxo pai */}

            <div className="sticky bottom-0 pt-3 mt-3 bg-slate-950/92 backdrop-blur-sm -mx-4 sm:-mx-6 px-4 sm:px-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 1} className="w-full sm:w-auto h-10 text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>

                <Button type="button" variant="outline" onClick={handleWhatsapp} className="w-full sm:w-auto h-10 text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" /> Continuar no WhatsApp
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      const fields: FormFieldName[] = step === 1
                        ? ['name','email','phone']
                        : ['city','eventType','audienceSize','budget','eventDate','fireworkPoints'];
                      form.trigger(fields).then((ok) => {
                        if (ok) nextStep();
                      });
                    }}
                    className="w-full sm:w-auto sm:ml-auto h-10 text-sm"
                  >
                    Próxima etapa <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    data-testid="budget-submit"
                    type="button"
                    onClick={() => form.handleSubmit(submitLead)()}
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto sm:ml-auto h-10 text-sm"
                  >
                    {status === 'sending' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Enviar para análise técnica
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormModalContent;

// Lead score calculation
const estimateLeadScore = (values: FormValues) => {
  let score = 0;
  const budgetScore = {
    '5k-15k': 10,
    '15k-50k': 20,
    '50k-200k': 30,
    '200k+': 40,
  }[values.budget] || 0;

  const audienceScore = {
    'ate-500': 10,
    '500-5k': 20,
    '5k-20k': 30,
    '20k+': 40,
  }[values.audienceSize] || 0;

  if (values.eventType === 'reveillon') score += 10;
  if (values.noiseRestrictions) score -= 5;

  return Math.max(0, Math.min(score + budgetScore + audienceScore, 100));
};
