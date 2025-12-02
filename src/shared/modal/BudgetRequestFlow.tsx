import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import TriageWizard from './TriageWizard';
import FormModalContent from './FormModalContent';
import { AudienceType } from '@/shared/types/common';
import { useAnalytics } from '@/shared/hooks/useAnalytics';

interface BudgetRequestFlowProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  context?: {
    page: string;
    eventType?: string;
    productId?: string;
  };
}

interface WizardData {
  audience: AudienceType;
  attendeesRange?: string;
  budgetRange?: string;
}

const BudgetRequestFlow: React.FC<BudgetRequestFlowProps> = ({
  isOpen,
  onClose,
  source,
  context
}) => {
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [audienceType, setAudienceType] = useState<AudienceType>('general');

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setAudienceType(data.audience);
    setCurrentStep(3); // Move to form step 1

    trackEvent('triage_wizard_complete', {
      audience: data.audience,
      attendees_range: data.attendeesRange,
      budget_range: data.budgetRange,
      source,
    });
  };

  const handleFormClose = () => {
    // Reset state when closing
    setCurrentStep(1);
    setWizardData(null);
    setAudienceType('general');
    onClose();
  };

  const renderContent = () => {
    // Steps 1-2: Wizard
    if (currentStep <= 2) {
      return (
        <TriageWizard
          step={currentStep}
          onComplete={handleWizardComplete}
        />
      );
    }

    // Steps 3-5: FormModalContent (manages its own internal 3 steps)
    // We pass the wizard data as initial data
    return (
      <FormModalContent
        audience={audienceType}
        source={source}
        initialData={wizardData}
        onComplete={handleFormClose}
        context={context}
      />
    );
  };

  const progressPercentage = (currentStep / 5) * 100;

  const getStepLabel = () => {
    if (currentStep === 1) return 'Identificando seu evento';
    if (currentStep === 2) return 'Detalhes rápidos';
    if (currentStep === 3) return 'Seus dados de contato';
    if (currentStep === 4) return 'Informações do evento';
    return 'Finalizando';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleFormClose}>
      <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-center">
            Solicitar Orçamento
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Triagem profissional em 5 etapas rápidas. Receba orçamento personalizado em até 24h.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-2 mb-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className="animate-in slide-in-from-left duration-300">{getStepLabel()}</span>
            <Badge variant="secondary" className="text-xs animate-in slide-in-from-right duration-300">
              Passo {currentStep} de 5
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 transition-all duration-500 ease-out" />
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetRequestFlow;
