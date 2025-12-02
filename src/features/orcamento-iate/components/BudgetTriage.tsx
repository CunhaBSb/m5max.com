import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { Checkbox } from '@/shared/ui/checkbox';
import { Loader2, MessageCircle, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

type Variant = 'desktop' | 'mobile';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone obrigatório'),
  eventType: z.enum(['reveillon', 'corporativo', 'casamento', 'outro']),
  city: z.string().min(2, 'Cidade/UF obrigatória'),
  eventDate: z.string().min(1, 'Data estimada'),
  audienceSize: z.enum(['ate-500', '500-5k', '5k-20k', '20k+']),
  budget: z.enum(['15k-50k', '50k-200k', '200k-500k', '500k+']),
  noiseRestrictions: z.boolean().default(false),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  variant?: Variant;
  source?: string;
}

export const BudgetTriage: React.FC<Props> = ({ variant = 'desktop', source = 'orcamento_iate_2026' }) => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: {
    eventType: 'reveillon',
    audienceSize: '5k-20k',
    budget: '200k-500k',
    noiseRestrictions: false,
  } });

  const { trackFormEvent, trackWhatsAppClick } = useAnalytics();
  const { attribution } = useAppStore();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const whatsappUrl = useMemo(() => {
    const message = getWhatsAppMessage('b2b', { eventType: 'Réveillon 2026', cityUF: 'Brasília - DF' });
    return generateWhatsAppURL(message, attribution?.utm, { audience: 'b2b', source });
  }, [attribution?.utm, source]);

  const onSubmit = async (values: FormValues) => {
    setStatus('sending');
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      setStatus('error');
      setErrorMessage('Supabase não configurado. Finalize pelo WhatsApp.');
      return;
    }

    const payload = {
      ...values,
      audience: 'b2b',
      page: typeof window !== 'undefined' ? window.location.pathname : '/orcamento-iate-2026',
      source,
      lead_score: estimateLeadScore(values),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('lead_submissions').insert(payload, { returning: 'minimal' });
    if (error) {
      console.error('Supabase insert error', error);
      setStatus('error');
      setErrorMessage('Não conseguimos enviar. Tente novamente ou use WhatsApp.');
      return;
    }

    trackFormEvent('submit', {
      form_type: 'b2b',
      form_name: 'orcamento_iate_triage',
      lead_score: payload.lead_score,
    });

    setStatus('success');
  };

  const handleWhatsapp = () => {
    trackWhatsAppClick({
      audience: 'b2b',
      source,
      message_template: 'Triagem orçamento Iate',
      phone_number: '5561982735575',
    });
    window.open(whatsappUrl, '_blank');
  };

  const stack = variant === 'mobile' ? 'space-y-3' : 'grid grid-cols-2 gap-4';

  return (
    <Card className="bg-gradient-to-br from-white/8 via-white/6 to-white/4 border border-white/10 shadow-elegant">
      <CardContent className="p-5 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-fire-orange/50 text-fire-orange">Triagem técnica</Badge>
            <span className="text-sm text-white/80">Coletamos só o essencial para o show do Iate 2026.</span>
          </div>
          <Badge variant="secondary" className="text-xs">Resposta em até 1 dia útil</Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className={stack}>
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
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
                <FormItem>
                  <FormLabel>Telefone/WhatsApp</FormLabel>
                  <FormControl><Input placeholder="(61) 9 9999-9999" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

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
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="eventDate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Data estimada</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
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
                        <SelectItem value="15k-50k">R$ 15k - 50k</SelectItem>
                        <SelectItem value="50k-200k">R$ 50k - 200k</SelectItem>
                        <SelectItem value="200k-500k">R$ 200k - 500k</SelectItem>
                        <SelectItem value="500k+">R$ 500k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="noiseRestrictions" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border border-white/10 px-3 py-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Há restrição de ruído ou vizinhança sensível?</FormLabel>
                    <p className="text-xs text-white/60">Ajustamos calibres e lineup conforme zona de amortecimento.</p>
                  </div>
                </FormItem>
              )} />

              <div className={variant === 'mobile' ? 'col-span-1' : 'col-span-2'}>
                <FormField name="message" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Pontos de filmagem, horários, logística..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-2 text-amber-100 text-sm bg-amber-500/10 border border-amber-500/30 rounded-md p-3">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-start gap-2 text-emerald-100 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-md p-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5" />
                <span>Recebido! Nossa equipe técnica entra em contato em breve.</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3">
              <Button type="submit" disabled={status === 'sending'} className="w-full md:w-auto">
                {status === 'sending' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Enviar para análise técnica
              </Button>
              <Button type="button" variant="outline" onClick={handleWhatsapp} className="w-full md:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" /> Continuar no WhatsApp
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Lead scoring enxuto para priorização interna
const estimateLeadScore = (values: FormValues) => {
  let score = 0;
  const budgetScore = {
    '15k-50k': 10,
    '50k-200k': 25,
    '200k-500k': 35,
    '500k+': 45,
  }[values.budget] || 0;
  const audienceScore = {
    'ate-500': 10,
    '500-5k': 20,
    '5k-20k': 30,
    '20k+': 40,
  }[values.audienceSize] || 0;

  score += budgetScore + audienceScore;
  if (values.eventType === 'reveillon') score += 10;
  if (values.noiseRestrictions) score -= 5;
  return Math.max(0, Math.min(score, 100));
};

export default BudgetTriage;
