import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { Separator } from '@/shared/ui/separator';
import { useAudienceDetection } from '@/shared/hooks';
import { useAppStore } from '@/shared/store/appStore';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { AudienceType } from '@/shared/types/common';
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface AudienceTriageWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audience: AudienceType) => void;
}

// Opções de triagem rápida
const EVENT_TYPES = [
  { value: 'corporativo', label: 'Evento Corporativo', description: 'Confraternização, festa de empresa' },
  { value: 'reveillon', label: 'Réveillon / Festival', description: 'Grande evento de fim de ano' },
  { value: 'casamento', label: 'Casamento', description: 'Cerimônia e recepção' },
  { value: 'cha', label: 'Chá de Revelação/Bebê', description: 'Eventos familiares especiais' },
  { value: 'aniversario', label: 'Aniversário', description: 'Festa de aniversário' },
  { value: 'outro', label: 'Outro Evento', description: 'Evento personalizado' }
];

const ATTENDEE_RANGES = [
  { value: 'small', label: 'Até 50 pessoas', audience: 'b2c-personal' },
  { value: 'medium', label: '50 a 200 pessoas', audience: 'b2c-personal' },
  { value: 'large', label: '200 a 500 pessoas', audience: 'b2b-corporate' },
  { value: 'xlarge', label: 'Mais de 500 pessoas', audience: 'b2b-corporate' }
];

const BUDGET_RANGES = [
  { value: 'low', label: 'Até R$ 5.000', audience: 'b2c-personal' },
  { value: 'medium', label: 'R$ 5.000 a R$ 15.000', audience: 'b2c-personal' },
  { value: 'high', label: 'R$ 15.000 a R$ 50.000', audience: 'b2b-corporate' },
  { value: 'premium', label: 'Acima de R$ 50.000', audience: 'b2b-specialized' }
];

const AudienceTriageWizard: React.FC<AudienceTriageWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const { detection, redetect } = useAudienceDetection();
  const { setCurrentAudience, triageData, setTriageData } = useAppStore();
  const { trackEvent } = useAnalytics();

  // Wizard state
  const [step, setStep] = useState<1 | 2>(1);
  const [eventType, setEventType] = useState<string>('');
  const [attendees, setAttendees] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('general');

  // Initialize with detected audience
  useEffect(() => {
    if (detection && detection.suggestedAudience) {
      setSelectedAudience(detection.suggestedAudience);
    }
  }, [detection]);

  // Calculate progress
  const progress = step === 1 ? 50 : 100;

  // Step 1: Check if can proceed
  const canProceedStep1 = eventType && attendees && budget;

  // Enhance detection with user input
  const enhanceDetection = () => {
    // Calculate manual score based on user answers
    let manualScore = 0;
    const reasons: string[] = [];

    // Event type scoring
    if (eventType === 'corporativo' || eventType === 'reveillon') {
      manualScore += 20;
      reasons.push('Tipo de evento corporativo');
    } else if (eventType === 'casamento' || eventType === 'cha' || eventType === 'aniversario') {
      manualScore += 15;
      reasons.push('Tipo de evento pessoal');
    }

    // Attendees scoring
    const attendeeData = ATTENDEE_RANGES.find(r => r.value === attendees);
    if (attendeeData) {
      manualScore += 15;
      reasons.push(`Público estimado: ${attendeeData.label}`);
    }

    // Budget scoring
    const budgetData = BUDGET_RANGES.find(r => r.value === budget);
    if (budgetData) {
      manualScore += 20;
      reasons.push(`Orçamento: ${budgetData.label}`);
    }

    // Determine final audience based on manual + automatic detection
    let finalAudience: AudienceType = detection?.suggestedAudience || 'general';
    const autoConfidence = detection?.confidence || 0;
    const combinedConfidence = Math.min(100, autoConfidence + manualScore);

    // Override if manual signals are very strong
    if (budgetData?.audience === 'b2b-specialized' && attendees === 'xlarge') {
      finalAudience = 'b2b-specialized';
    } else if (attendeeData?.audience === 'b2b-corporate' || budgetData?.audience === 'b2b-corporate') {
      finalAudience = 'b2b-corporate';
    } else if (attendeeData?.audience === 'b2c-personal' || budgetData?.audience === 'b2c-personal') {
      finalAudience = 'b2c-personal';
    }

    setSelectedAudience(finalAudience);

    // Track wizard completion
    trackEvent('triage_wizard_step1_complete', {
      event_type: eventType,
      attendees,
      budget,
      suggested_audience: finalAudience,
      confidence: combinedConfidence
    });

    // Move to confirmation step
    setStep(2);
  };

  // Handle final confirmation
  const handleConfirm = () => {
    // Update store
    setCurrentAudience(selectedAudience);
    setTriageData({
      detectedAudience: selectedAudience,
      confidence: detection?.confidence || 80,
      detectionMethod: 'wizard',
      detectedAt: new Date().toISOString(),
      userCorrected: selectedAudience !== detection?.suggestedAudience
    });

    // Track completion
    trackEvent('triage_wizard_complete', {
      final_audience: selectedAudience,
      was_corrected: selectedAudience !== detection?.suggestedAudience,
      detection_method: 'wizard'
    });

    // Complete wizard
    onComplete(selectedAudience);
    onClose();
  };

  // Handle manual audience selection
  const handleManualSelect = (audience: AudienceType) => {
    setSelectedAudience(audience);
    trackEvent('triage_manual_override', {
      original: detection?.suggestedAudience,
      selected: audience
    });
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
  };

  // Render audience option
  const renderAudienceOption = (audience: AudienceType, title: string, description: string, icon: string) => {
    const isSelected = selectedAudience === audience;
    const isDetected = detection?.suggestedAudience === audience;

    return (
      <Card
        className={`cursor-pointer transition-all ${
          isSelected
            ? 'border-primary ring-2 ring-primary ring-offset-2'
            : 'border-muted hover:border-primary/50'
        }`}
        onClick={() => handleManualSelect(audience)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <CardTitle className="text-base">{title}</CardTitle>
            </div>
            {isDetected && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Detectado
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        {isSelected && (
          <CardContent className="pt-0">
            <div className="flex items-center text-sm text-primary">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Selecionado
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {step === 1 ? 'Sobre seu Evento' : 'Confirme sua Categoria'}
            </DialogTitle>
            <Badge variant="outline" className="text-xs">
              Passo {step} de 2
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </DialogHeader>

        {/* Step 1: Quick Qualifier */}
        {step === 1 && (
          <div className="space-y-6 mt-4">
            <DialogDescription>
              Responda algumas perguntas rápidas para personalizarmos sua experiência.
            </DialogDescription>

            {/* Event Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Tipo de Evento</Label>
              <RadioGroup value={eventType} onValueChange={setEventType} className="space-y-2">
                {EVENT_TYPES.map((type) => (
                  <div key={type.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={type.value} id={`event-${type.value}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`event-${type.value}`} className="font-medium cursor-pointer">
                        {type.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Attendees */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Número Estimado de Convidados</Label>
              <RadioGroup value={attendees} onValueChange={setAttendees} className="space-y-2">
                {ATTENDEE_RANGES.map((range) => (
                  <div key={range.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={range.value} id={`attendees-${range.value}`} />
                    <Label htmlFor={`attendees-${range.value}`} className="font-medium cursor-pointer flex-1">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* Budget */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Orçamento Estimado para Fogos</Label>
              <RadioGroup value={budget} onValueChange={setBudget} className="space-y-2">
                {BUDGET_RANGES.map((range) => (
                  <div key={range.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={range.value} id={`budget-${range.value}`} />
                    <Label htmlFor={`budget-${range.value}`} className="font-medium cursor-pointer flex-1">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Navigation */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={enhanceDetection} disabled={!canProceedStep1}>
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="space-y-6 mt-4">
            <DialogDescription>
              Com base nas suas respostas, recomendamos a categoria abaixo. Você pode confirmar ou ajustar se preferir.
            </DialogDescription>

            {/* Detection Info */}
            {detection && detection.confidence >= 40 && (
              <Card className="bg-muted/50 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">Detecção Automática</CardTitle>
                    <Badge variant="secondary" className="ml-auto">
                      {detection.confidence}% de confiança
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {detection.reasons.slice(0, 3).map((reason, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Audience Options */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Selecione sua Categoria</Label>

              {renderAudienceOption(
                'b2c-personal',
                'Evento Pessoal',
                'Casamentos, aniversários, chás - até 200 pessoas e orçamento até R$ 30k',
                '🎉'
              )}

              {renderAudienceOption(
                'b2b-corporate',
                'Evento Corporativo',
                'Festas de empresa, confraternizações - 200+ pessoas e orçamento R$ 15k+',
                '🏢'
              )}

              {renderAudienceOption(
                'b2b-specialized',
                'Cliente Especial',
                'Projetos customizados, eventos de grande porte - orçamento premium',
                '⭐'
              )}
            </div>

            {/* Warning for low confidence */}
            {detection && detection.confidence < 40 && (
              <Card className="border-orange-500/20 bg-orange-500/5">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-700 dark:text-orange-400">
                        Não conseguimos detectar automaticamente sua categoria
                      </p>
                      <p className="text-orange-600/80 dark:text-orange-400/80 mt-1">
                        Por favor, selecione manualmente a opção que melhor descreve seu evento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirm} disabled={!selectedAudience || selectedAudience === 'general'}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AudienceTriageWizard;
