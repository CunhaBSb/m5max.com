import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { AudienceType } from '@/types/common';
import { B2BFormSchema, ChaFormSchema, KitsFormSchema, FormData } from '@/types/forms';
import B2BForm from './B2BForm';
import ChaForm from './ChaForm';
import KitsForm from './KitsForm';

interface QualificationFormProps {
  audience: AudienceType;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Partial<FormData>;
}

const QualificationForm: React.FC<QualificationFormProps> = ({
  audience,
  onSubmit,
  onCancel,
  initialData
}) => {
  const getSchema = () => {
    switch (audience) {
      case 'b2b':
        return B2BFormSchema;
      case 'cha':
        return ChaFormSchema;
      case 'kits':
        return KitsFormSchema;
      default:
        return B2BFormSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: initialData || {}
  });

  const calculateLeadScore = (data: any): number => {
    let score = 0;

    if (audience === 'b2b') {
      // Budget scoring
      const budgetScores = {
        '200k+': 30,
        '50k-200k': 20,
        '15k-50k': 10,
        '5k-15k': 5
      };
      score += budgetScores[data.budgetRange] || 0;

      // Attendees scoring
      const attendeesScores = {
        '20k+': 15,
        '5k-20k': 10,
        '500-5k': 5,
        'ate-500': 2
      };
      score += attendeesScores[data.attendeesRange] || 0;

      // Date proximity scoring
      if (data.eventDate) {
        const eventDate = new Date(data.eventDate);
        const now = new Date();
        const daysDiff = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        
        if (daysDiff <= 30) score += 20;
        else if (daysDiff <= 90) score += 15;
        else if (daysDiff <= 180) score += 10;
        else score += 5;
      }

      // Company name bonus
      if (data.companyName) score += 10;
    } else {
      // Produto scoring mais simples
      score = 25; // Base score para produtos
      if (data.eventDate) score += 15;
      if (data.needsPersonalization || data.needsRemoteControl) score += 10;
    }

    return Math.min(score, 100); // Cap at 100
  };

  const handleSubmit = (data: any) => {
    const leadScore = calculateLeadScore(data);
    onSubmit({ ...data, leadScore });
  };

  const renderForm = () => {
    switch (audience) {
      case 'b2b':
        return <B2BForm form={form} />;
      case 'cha':
        return <ChaForm form={form} />;
      case 'kits':
        return <KitsForm form={form} />;
      default:
        return <B2BForm form={form} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {renderForm()}
        
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Voltar
          </Button>
          <Button type="submit" className="flex-1">
            Enviar Dados
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QualificationForm;