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
import { Badge } from '@/shared/ui/badge';
import { Loader2, MessageCircle, AlertCircle, CheckCircle2, Send, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface FormModalContentProps {
  audience: AudienceType;
  source: string;
  initialData?: {
    attendeesRange?: string;
    budgetRange?: string;
  };
  onComplete?: () => void;
  context?: {
    page: string;
    eventType?: string;
    productId?: string;
  };
}

const FormModalContent: React.FC<FormModalContentProps> = ({
  audience,
  source,
  initialData,
  onComplete,
  context
}) => {
  const { trackFormEvent, trackWhatsAppClick, trackEvent } = useAnalytics();
  const { attribution } = useAppStore();

  const schema = z.object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(10, 'Telefone obrigatório'),
    eventType: z.enum(['reveillon', 'corporativo', 'casamento', 'cha-revelacao', 'festa', 'outro']),
    city: z.string().min(2, 'Cidade/UF obrigatória'),
    eventDate: z.string().min(1, 'Data obrigatória'),
    audienceSize: z.enum(['ate-500', '500-5k', '5k-20k', '20k+']),
    budget: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
    noiseRestrictions: z.boolean().default(false),
    message: z.string().optional(),
  });

  // Map wizard budget ranges to form budget ranges
  const mapBudgetRange = (wizardBudget?: string): typeof schema._type.budget => {
    if (!wizardBudget) return '50k-200k';
    if (wizardBudget === '5k') return '5k-15k';
    if (wizardBudget === '15k') return '15k-50k';
    if (wizardBudget === '50k') return '50k-200k';
    if (wizardBudget === '100k+') return '200k+';
    return '50k-200k';
  };

  // Map wizard attendees to form audienceSize
  const mapAttendeesRange = (wizardAttendees?: string): typeof schema._type.audienceSize => {
    if (!wizardAttendees) return '5k-20k';
    if (wizardAttendees === 'ate-50' || wizardAttendees === '50-200') return 'ate-500';
    if (wizardAttendees === '200-500') return '500-5k';
    if (wizardAttendees === '500+') return '5k-20k';
    return '5k-20k';
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: context?.eventType as any || '',
      eventDate: '',
      audienceSize: mapAttendeesRange(initialData?.attendeesRange),
      budget: mapBudgetRange(initialData?.budgetRange),
      noiseRestrictions: false,
    }
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

  const inferProfile = (values: Partial<z.infer<typeof schema>>) => {
    const { eventType, audienceSize, budget } = values;
    if (eventType === 'reveillon' && (audienceSize === '5k-20k' || audienceSize === '20k+')) return 'promotor-clube';
    if (eventType === 'corporativo') return 'promotor-corporativo';
    if (eventType === 'cha-revelacao') return 'cha-revelacao';
    if (eventType === 'casamento') return 'casamento-noivos';
    if (eventType === 'festa' || budget === '5k-15k') return 'residencial';
    return 'outro';
  };

  const derivedProfile = inferProfile(form.watch());

  const submitLead = async (values: z.infer<typeof schema>) => {
    setStatus('sending');
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setStatus('error');
      setErrorMessage('Supabase não configurado. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
      trackEvent('budget_triage_supabase_error', { reason: 'not_configured' });
      return;
    }

    const { eventType, eventDate, audienceSize, noiseRestrictions, ...rest } = values;

    const payload = {
      ...rest,
      event_type: eventType,
      event_date: eventDate,
      audience_size: audienceSize,
      noise_restrictions: noiseRestrictions,
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
        code: (error as any)?.code,
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

    setStatus('success');
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
    setStep(next);
    trackEvent('budget_triage_step_view', {
      step: next,
      audience,
      audience_profile: derivedProfile,
      event_type: form.getValues('eventType'),
      budget: form.getValues('budget'),
      audience_size: form.getValues('audienceSize'),
    });
  };
  const prevStep = () => setStep((s) => Math.max(1, (s - 1) as typeof step));

  return (
    <Card className="bg-gradient-to-br from-white/8 via-white/6 to-white/4 border border-white/10 shadow-elegant animate-in fade-in duration-300">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="border-fire-orange/50 text-fire-orange">
            Formulário profissional
          </Badge>
          <Badge variant="secondary" className="text-xs">Resposta em até 24h</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Etapa {step} de 3</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Proposta personalizada
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitLead)} className="space-y-4">
                    {step === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-right duration-300">
                        <FormField name="name" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl><Input data-testid="budget-name" placeholder="Responsável pelo evento" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl><Input data-testid="budget-email" type="email" placeholder="email@empresa.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="phone" control={form.control} render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Telefone/WhatsApp</FormLabel>
                            <FormControl><Input data-testid="budget-phone" placeholder="(61) 9 9999-9999" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    )}

            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-right duration-300">
                <FormField name="city" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade/UF</FormLabel>
                    <FormControl><Input data-testid="budget-city" placeholder="Brasília - DF" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="eventType" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de evento</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="audienceSize" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público estimado</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger data-testid="budget-audience"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ate-500">Até 500</SelectItem>
                          <SelectItem value="500-5k">500 a 5.000</SelectItem>
                          <SelectItem value="5k-20k">5.000 a 20.000</SelectItem>
                          <SelectItem value="20k+">20.000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="budget" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento estimado</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger data-testid="budget-range"><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5k-15k">R$ 5k - 15k</SelectItem>
                          <SelectItem value="15k-50k">R$ 15k - 50k</SelectItem>
                          <SelectItem value="50k-200k">R$ 50k - 200k</SelectItem>
                          <SelectItem value="200k+">R$ 200k+</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="eventDate" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data do evento</FormLabel>
                    <FormControl><Input data-testid="budget-date" type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 animate-in slide-in-from-right duration-300">
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
                    <FormControl><Textarea rows={3} placeholder="Pontos de filmagem, horários, logística..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="text-sm text-white/80 bg-white/5 border border-white/10 rounded-md p-3 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-fire-orange mt-0.5" />
                  <span>Após enviar, nossa equipe técnica responderá com uma proposta personalizada.</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start gap-2 text-amber-100 text-sm bg-amber-500/10 border border-amber-500/30 rounded-md p-3">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center text-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md p-4">
                <div className="flex items-center gap-2 text-emerald-100 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recebido! Um especialista responderá em breve com sua proposta.</span>
                </div>
                <Button variant="default" onClick={handleWhatsapp} className="min-w-[220px]">
                  <MessageCircle className="w-4 h-4 mr-2" /> Prosseguir no WhatsApp
                </Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={prevStep} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
              ) : (
                <div className="w-full sm:w-auto" />
              )}

              {step < 3 ? (
                <Button type="button" onClick={() => {
                  const fields = step === 1 ? ['name','email','phone'] : ['city','eventType','audienceSize','budget','eventDate'];
                  form.trigger(fields as any).then((ok) => {
                    if (ok) nextStep();
                  });
                }} className="w-full sm:w-auto">
                  Próxima etapa <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button data-testid="budget-submit" type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
                  {status === 'sending' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Enviar para análise técnica
                </Button>
              )}

              <Button type="button" variant="outline" onClick={handleWhatsapp} className="w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" /> Continuar no WhatsApp
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormModalContent;

// Lead score calculation
const estimateLeadScore = (values: z.infer<ReturnType<typeof z.object>>) => {
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
