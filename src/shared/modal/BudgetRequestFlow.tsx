import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import TriageWizard from './TriageWizard';
import FormModalContent from './FormModalContent';
import { AudienceType } from '@/shared/types/common';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { Button } from '@/shared/ui/button';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';

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
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const FORM_OFFSET = 2; // wizard tem 2 passos, formulário começa no 3

  const handleFormStepChange = useCallback((formStep: number) => {
    setCurrentStep((FORM_OFFSET + formStep) as typeof currentStep);
  }, [FORM_OFFSET]);

  const handleFormSuccess = () => {
    trackEvent('budget_modal_success_shown', {
      source,
      audience: audienceType,
      attendees_range: wizardData?.attendeesRange,
      budget_range: wizardData?.budgetRange,
    });

    // fecha o modal primeiro e exibe o popup logo em seguida para evitar sobreposição
    handleFormClose(false);
    setTimeout(() => setShowSuccessBanner(true), 120);
  };


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

  const handleFormClose = (resetSuccess: boolean = true) => {
    // Reset state when closing
    setCurrentStep(1);
    setWizardData(null);
    setAudienceType('general');
    if (resetSuccess) setShowSuccessBanner(false);
    onClose();
  };

  const renderContent = () => {
    // Steps 1-2: Wizard
    if (currentStep <= 2) {
      return (
        <TriageWizard
          step={currentStep}
          onComplete={handleWizardComplete}
          onStepChange={(s) => setCurrentStep(s)}
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
        isOpen={isOpen}
        context={context}
        onStepChange={handleFormStepChange}
        onSuccess={handleFormSuccess}
      />
    );
  };

  const whatsappUrl = useMemo(() => {
    const message = getWhatsAppMessage(
      audienceType === 'b2c-personal' ? 'b2c' : 'b2b',
      {
        eventType: wizardData?.budgetRange ? 'Orçamento' : 'Evento',
        cityUF: 'Brasília - DF',
        eventDate: '',
      }
    );
    return generateWhatsAppURL(message, undefined, { audience: audienceType, source });
  }, [audienceType, wizardData, source]);

  const progressPercentage = (currentStep / 5) * 100;

  const getStepLabel = () => {
    if (currentStep === 1) return 'Identificando seu evento';
    if (currentStep === 2) return 'Detalhes rápidos';
    if (currentStep === 3) return 'Contato';
    if (currentStep === 4) return 'Evento';
    return 'Confirmação';
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleFormClose}>
        <DialogContent className="w-[96vw] max-w-4xl lg:max-w-5xl mx-auto p-0 border border-white/12 bg-slate-950/92 backdrop-blur-2xl rounded-3xl shadow-[0_24px_80px_-28px_rgba(0,0,0,0.85)] max-h-[calc(100vh-32px)] overflow-y-auto top-6 md:top-1/2 translate-y-0 md:-translate-y-1/2">
          <div className="p-5 sm:p-6 space-y-4">
            <DialogHeader className="space-y-2 text-center">
              <DialogTitle className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-fire-orange to-fire-gold bg-clip-text text-transparent drop-shadow">
                Solicitar Orçamento
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-white/85">
                Finalize para receber o orçamento e a simulação 3D do show.
              </DialogDescription>
            </DialogHeader>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-end text-[10px] sm:text-[11px] text-white/70">
                <Badge variant="secondary" className="text-[10px] sm:text-[11px]">
                  Passo {currentStep} de 5
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-1.5" />
            </div>

            {/* Dynamic Content */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/88 p-3 sm:p-5 shadow-inner space-y-3">
              {renderContent()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showSuccessBanner && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-emerald-950/90 border border-emerald-500/40 shadow-2xl shadow-emerald-900/40 rounded-2xl p-6 flex flex-col gap-4 text-center animate-in fade-in zoom-in-95">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-200" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-emerald-50">Recebido!</p>
              <p className="text-sm text-emerald-100/90">Um especialista responderá em breve com sua proposta.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
              <Button
                variant="secondary"
                onClick={() => {
                  trackEvent('budget_modal_success_close', { source, audience: audienceType });
                  setShowSuccessBanner(false);
                }}
                className="w-full sm:w-auto"
              >
                Voltar para M5
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  trackEvent('budget_modal_success_whatsapp', { source, audience: audienceType });
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Prosseguir no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetRequestFlow;
