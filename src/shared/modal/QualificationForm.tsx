import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { AudienceType, getAudienceCategory } from '@/shared/types/common';
import { B2BFormSchema, B2CFormSchema, FormData } from '@/shared/types/forms';
import B2BForm from '@/shared/modal/B2BForm';
import B2CForm from '@/shared/modal/B2CForm';
import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { AlertCircle, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';

interface QualificationFormProps {
  audience: AudienceType;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  initialData?: Partial<FormData>;
  source?: string;
}

const QualificationForm: React.FC<QualificationFormProps> = ({
  audience,
  onSubmit,
  onCancel,
  initialData,
  source = 'site_form'
}) => {
  const { trackFormEvent, trackWhatsAppClick } = useAnalytics();
  const { attribution } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getSchema = () => {
    const category = getAudienceCategory(audience);

    if (category === 'b2c') {
      return B2CFormSchema;
    }

    // B2B (both corporate and specialized use B2BFormSchema)
    return B2BFormSchema;
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: initialData || {}
  });

  const whatsappUrl = useMemo(() => {
    const message = getWhatsAppMessage(audience === 'b2c-personal' ? 'b2c' : 'b2b');
    return generateWhatsAppURL(message, attribution?.utm, { audience, source });
  }, [audience, attribution?.utm, source]);

  const calculateLeadScore = (data: Record<string, unknown>): number => {
    let score = 0;
    const category = getAudienceCategory(audience);

    if (category === 'b2c') {
      // B2C scoring system (max ~130 points before cap)
      const budgetScores = {
        '30k+': 35,
        '15k-30k': 25,
        '5k-15k': 15,
        'ate-5k': 5
      };
      score += budgetScores[data.budgetRange as string] || 0;

      // Attendees scoring
      const attendeesScores = {
        '200+': 25,
        '100-200': 15,
        '50-100': 10,
        'ate-50': 5
      };
      score += attendeesScores[data.attendeesRange as string] || 0;

      // Date proximity scoring (same for both)
      if (data.eventDate) {
        const eventDate = new Date(data.eventDate as string);
        const now = new Date();
        const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

        if (daysDiff <= 30) score += 25;
        else if (daysDiff <= 90) score += 20;
        else if (daysDiff <= 180) score += 15;
        else score += 10;
      }

      // Partner name bonus (indicates engaged couple)
      if (data.partnerName) score += 15;

      // Gender reveal bonus (high engagement indicator)
      if (data.isGenderReveal) score += 15;

      // Event type scoring
      const eventTypeScores = {
        'casamento': 15,
        'cha-revelacao': 12,
        'noivado': 10,
        'aniversario': 8,
        'outro': 5
      };
      score += eventTypeScores[data.eventType as string] || 0;
    } else {
      // B2B scoring system (max ~125 points before cap)
      const budgetScores = {
        '200k+': 40,
        '50k-200k': 30,
        '15k-50k': 15,
        '5k-15k': 5
      };
      score += budgetScores[data.budgetRange as string] || 0;

      // Attendees scoring
      const attendeesScores = {
        '20k+': 20,
        '5k-20k': 15,
        '500-5k': 10,
        'ate-500': 5
      };
      score += attendeesScores[data.attendeesRange as string] || 0;

      // Date proximity scoring
      if (data.eventDate) {
        const eventDate = new Date(data.eventDate as string);
        const now = new Date();
        const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

        if (daysDiff <= 30) score += 25;
        else if (daysDiff <= 90) score += 20;
        else if (daysDiff <= 180) score += 15;
        else score += 10;
      }

      // Company name bonus
      if (data.companyName) score += 15;

      // Specialized requirements bonus
      if (data.needsMusicSync) score += 10;

      // Event type scoring
      const eventTypeScores = {
        'reveillon': 15,
        'festival': 12,
        'corporativo': 10,
        'festa-junina': 8,
        'casamento': 8,
        'formatura': 5,
        'outro': 3
      };
      score += eventTypeScores[data.eventType as string] || 0;
    }

    return Math.min(score, 100); // Cap at 100
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    const leadScore = calculateLeadScore(data);
    if (!submitSuccess && !submitError) {
      trackFormEvent('start', {
        form_type: audience,
        form_name: `${audience}_qualification_form`,
        source,
        page_category: audience,
        lead_score: leadScore
      });
    }

    setSubmitting(true);
    setSubmitError(null);

    const { attachments, ...rest } = data as Record<string, unknown> & { attachments?: File[] };

    const payload = {
      ...rest,
      lead_score: leadScore,
      attachments_count: attachments ? attachments.length : 0,
      audience,
      source,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      created_at: new Date().toISOString()
    };

    const doInsert = async () => {
      if (!isSupabaseConfigured()) {
        setSubmitError('Supabase não configurado (verifique env). Use WhatsApp para concluir.');
        return;
      }

      const { error } = await supabase.from('lead_submissions').insert(payload, { returning: 'minimal' });
      if (error) {
        console.error('Supabase insert error', error);
        setSubmitError('Não conseguimos enviar. Tente novamente ou use WhatsApp.');
        return;
      }

      trackFormEvent('submit', {
        form_type: audience,
        form_name: `${audience}_qualification_form`,
        lead_score: leadScore
      });

      setSubmitSuccess(true);
      onSubmit({ ...data, leadScore });
    };

    doInsert().finally(() => setSubmitting(false));
  };

  const handleWhatsapp = () => {
    trackWhatsAppClick({
      audience: audience === 'b2c-personal' ? 'b2c' : 'b2b',
      source,
      message_template: 'Triagem orçamento',
      phone_number: '5561982735575'
    });
    window.open(whatsappUrl, '_blank');
  };

  const renderForm = () => {
    const category = getAudienceCategory(audience);

    if (category === 'b2c') {
      return <B2CForm form={form} />;
    }

    // B2B (both corporate and specialized)
    return <B2BForm form={form} />;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-white/6 via-white/4 to-white/6 border border-white/10">
        <CardContent className="pt-5 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-fire-orange/50 text-fire-orange">Triagem Profissional</Badge>
            <span className="text-sm text-white/80">Responder leva ~60s. Enviamos direto ao time técnico.</span>
          </div>
          <div className="text-xs text-white/60">Preferiu WhatsApp? Conclua pelo botão ao final.</div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {renderForm()}

          {submitError && (
            <div className="flex items-start gap-2 text-amber-200 text-sm bg-amber-500/10 border border-amber-500/30 rounded-md p-3">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="flex items-start gap-2 text-emerald-200 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-md p-3">
              <CheckCircle2 className="w-4 h-4 mt-0.5" />
              <span>Recebemos sua solicitação. Um especialista responderá em breve.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Enviar para análise
            </Button>
            <Button type="button" variant="outline" onClick={handleWhatsapp} className="w-full sm:w-auto">
              <MessageCircle className="w-4 h-4 mr-2" /> Continuar no WhatsApp
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel} className="w-full sm:w-auto">Cancelar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QualificationForm;
