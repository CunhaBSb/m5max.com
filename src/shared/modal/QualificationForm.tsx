import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { AudienceType } from '@/shared/types/common';
import { B2BFormSchema, FormData } from '@/shared/types/forms';
import B2BForm from '@/shared/modal/B2BForm';

interface QualificationFormProps {
  audience: AudienceType;
  onSubmit: (data: Record<string, unknown>) => void;
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
    return B2BFormSchema; // Only B2B forms supported now
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: initialData || {}
  });

  const calculateLeadScore = (data: Record<string, unknown>): number => {
    let score = 0;

    // B2B scoring system
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

    return Math.min(score, 100); // Cap at 100
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    const leadScore = calculateLeadScore(data);
    onSubmit({ ...data, leadScore });
  };

  const renderForm = () => {
    // Only B2B forms now
    return <B2BForm form={form} />;
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