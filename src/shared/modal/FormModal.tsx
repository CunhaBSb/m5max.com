import React, { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
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
import type { PostgrestError } from '@supabase/supabase-js';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  audience: AudienceType;
  source: string;
  context?: {
    page: string;
    eventType?: string;
    productId?: string;
  };
}

const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  audience,
  source,
  context
}) => {
  const { trackFormEvent, trackWhatsAppClick, trackEvent } = useAnalytics();
  const { attribution } = useAppStore();

  // Data fixa: 01/01 do próximo ano
  const nextYear = new Date().getFullYear() + 1;
  const reveillonDate = `${nextYear}-01-01`;

  const schema = z.object({
    name: z.string().min(2, 'Nome obrigatório'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().min(10, 'Telefone obrigatório'),
    eventType: z.enum(['reveillon', 'corporativo', 'casamento', 'cha-revelacao', 'festa', 'outro']),
    city: z.string().min(2, 'Cidade/UF obrigatória'),
    eventDate: z.string().min(1, 'Data estimada'),
    audienceSize: z.enum(['ate-500', '500-5k', '5k-20k', '20k+']),
    budget: z.enum(['5k-15k', '15k-50k', '50k-200k', '200k+']),
    noiseRestrictions: z.boolean().default(false),
    message: z.string().optional(),
  });

  type FormFieldName = keyof z.infer<typeof schema>;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: 'reveillon',
      eventDate: reveillonDate,
      audienceSize: '5k-20k',
      budget: '50k-200k',
      noiseRestrictions: false,
    }
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Reset ao abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage(null);
      setStep(1);
      form.reset({
        eventType: 'reveillon',
        eventDate: reveillonDate,
        audienceSize: '5k-20k',
        budget: '50k-200k',
        noiseRestrictions: false,
        name: '',
        email: '',
        phone: '',
        city: '',
        message: '',
      });
    }
  }, [isOpen, form, reveillonDate]);

  const whatsappUrl = useMemo(() => {
    const message = getWhatsAppMessage('b2b', {
      eventType: form.getValues('eventType') || 'Réveillon',
      cityUF: form.getValues('city') || 'Brasília - DF',
      eventDate: form.getValues('eventDate') || reveillonDate,
    });
    return generateWhatsAppURL(message, attribution?.utm, { audience: 'b2b', source });
  }, [attribution?.utm, source, form, reveillonDate]);

  const inferProfile = (values: Partial<z.infer<typeof schema>>) => {
    const { eventType, audienceSize, budget } = values;
    if (eventType === 'reveillon' && (audienceSize === '5k-20k' || audienceSize === '20k+')) return 'promotor-clube';
    if (eventType === 'corporativo') return 'promotor-corporativo';
    if (eventType === 'cha-revelacao') return 'cha-revelacao';
    if (eventType === 'casamento') return 'casamento-noivos';
    if (eventType === 'festa' || budget === '5k-15k') return 'residencial';
    return 'outro';
  };

  const inferAudience = (values: Partial<z.infer<typeof schema>>): AudienceType => {
    const profile = inferProfile(values);
    const budget = values.budget;
    const size = values.audienceSize;

    if (profile === 'promotor-clube') return 'b2b-specialized' as AudienceType;
    if (profile === 'promotor-corporativo') return 'b2b-corporate' as AudienceType;
    if (profile === 'cha-revelacao' || profile === 'casamento-noivos' || profile === 'residencial') return 'b2c-personal' as AudienceType;
    if (budget === '200k+' || size === '20k+') return 'b2b-specialized' as AudienceType;
    if (budget === '50k-200k' || size === '5k-20k') return 'b2b-corporate' as AudienceType;
    return 'b2b' as AudienceType;
  };

  const derivedProfile = inferProfile(form.watch());
  const derivedAudience = inferAudience(form.watch());

  const submitLead = async (values: z.infer<typeof schema>) => {
    if (status === 'idle') {
      trackFormEvent('start', {
        form_type: derivedAudience,
        form_name: 'site_budget_modal',
        source,
        page_category: derivedAudience,
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

    const { eventType, eventDate, audienceSize, noiseRestrictions, ...rest } = values;

    const payload = {
      ...rest,
      event_type: eventType,
      event_date: eventDate,
      audience_size: audienceSize,
      noise_restrictions: noiseRestrictions,
      audience: derivedAudience,
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
      form_type: derivedAudience,
      form_name: 'site_budget_modal',
      lead_score: payload.lead_score,
    });

    trackEvent('budget_triage_submit', {
      audience: derivedAudience,
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
      audience: derivedAudience,
      source,
      message_template: 'Modal orçamento',
      phone_number: '5561982735575',
    });
    trackEvent('budget_triage_whatsapp', {
      audience: derivedAudience,
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
      audience: derivedAudience,
      audience_profile: derivedProfile,
      event_type: form.getValues('eventType'),
      budget: form.getValues('budget'),
      audience_size: form.getValues('audienceSize'),
    });
  };
  const prevStep = () => setStep((s) => Math.max(1, (s - 1) as typeof step));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-3 sm:p-5">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-center">Solicitar Orçamento</DialogTitle>
              <DialogDescription className="text-center text-sm text-muted-foreground">
                Triagem inteligente em 3 etapas compactas. Data fixa para Réveillon 2026 e envio da simulação 3D.
              </DialogDescription>
            </DialogHeader>

            <Card className="bg-slate-950/90 border border-white/10 shadow-xl shadow-black/30 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <Badge variant="outline" className="border-fire-orange/60 text-fire-orange bg-white/5">Triagem rápida</Badge>
                  <Badge variant="secondary" className="text-[11px]">Resposta em até 1 dia útil</Badge>
                </div>

                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>Fase {step} de 3</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Simulação 3D após envio</span>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(submitLead)} className="space-y-3 sm:space-y-4">
                    {step === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField name="name" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl><Input placeholder="Responsável pelo evento" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl><Input type="email" placeholder="email@empresa.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="phone" control={form.control} render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Telefone/WhatsApp</FormLabel>
                            <FormControl><Input placeholder="(61) 9 9999-9999" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField name="city" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade/UF</FormLabel>
                            <FormControl><Input placeholder="Brasília - DF" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField name="eventType" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de evento</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                            <FormLabel>Data (fixa para Réveillon)</FormLabel>
                            <FormControl><Input type="date" readOnly {...field} value={reveillonDate} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-3">
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
                          <span>Após enviar, você recebe a simulação 3D do show pro Réveillon.</span>
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
                      <div className="flex items-start gap-2 text-emerald-100 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-md p-3">
                        <CheckCircle2 className="w-4 h-4 mt-0.5" />
                        <span>Recebido! Um especialista responderá e enviaremos a simulação 3D.</span>
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
                          // validate current step fields before advancing
                          const fields: FormFieldName[] = step === 1
                            ? ['name','email','phone']
                            : ['city','eventType','audienceSize','budget','eventDate'];
                          form.trigger(fields).then((ok) => {
                            if (ok) nextStep();
                          });
                        }} className="w-full sm:w-auto">
                          Próxima etapa <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
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
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;

// Lead score simples para priorização
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
