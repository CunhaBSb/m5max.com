import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useAppStore } from '@/shared/store/appStore';
import { AudienceType } from '@/shared/types/common';
import QualificationForm from '@/shared/modal/QualificationForm';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

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
  const { trackFormEvent } = useAnalytics();

  const handleFormSubmit = (data: Record<string, unknown>) => {
    console.log('Form submitted:', data);
    trackFormEvent('submit', {
      form_type: audience,
      form_name: `${audience}_qualification_form`,
      lead_score: data.leadScore || 0
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[85vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-center">
            Solicitar Orçamento
          </DialogTitle>
        </DialogHeader>
        <QualificationForm
          audience={audience}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;