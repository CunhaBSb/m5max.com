import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Heart, Building, Star, Users, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AudienceType } from '@/shared/types/common';

interface TriageData {
  audience: AudienceType;
  attendeesRange?: string;
  budgetRange?: string;
}

interface TriageWizardProps {
  step: 1 | 2;
  onComplete: (data: TriageData) => void;
  onStepChange?: (step: 1 | 2) => void;
}

const TriageWizard: React.FC<TriageWizardProps> = ({ step: initialStep, onComplete, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(initialStep);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | null>(null);
  const [selectedAttendees, setSelectedAttendees] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const handleAudienceSelect = (audience: AudienceType) => {
    setSelectedAudience(audience);
    setCurrentStep(2);
    onStepChange?.(2);
  };

  const handleComplete = () => {
    if (selectedAudience && selectedAttendees && selectedBudget) {
      onStepChange?.(2);
      onComplete({
        audience: selectedAudience,
        attendeesRange: selectedAttendees,
        budgetRange: selectedBudget,
      });
    }
  };

  const whatsappHref = "https://wa.me/5561982735575?text=Quero%20um%20or%C3%A7amento%20para%20fogos%20M5";

  // sincroniza passo inicial com pai
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const canProceed = selectedAudience && selectedAttendees && selectedBudget;

  if (currentStep === 1) {
    return (
      <div className="space-y-3.5 animate-in fade-in duration-300 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h3 className="text-xs sm:text-sm font-semibold text-white animate-in slide-in-from-top duration-500">
            Qual melhor descreve seu evento?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* B2C Personal Card */}
          <Card
            onClick={() => handleAudienceSelect('b2c-personal')}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 group",
              "bg-gradient-to-br from-fire-orange/20 via-fire-gold/15 to-fire-orange/20",
              "border-2 border-fire-orange/40 hover:border-fire-orange/80",
              "shadow-lg hover:shadow-fire-orange/30"
            )}
          >
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fire-orange to-fire-gold flex items-center justify-center shadow-lg group-hover:shadow-fire-orange/50 transition-all">
                <Heart className="w-8 h-8 text-white fill-white/20" />
              </div>
              <h4 className="text-base font-bold text-white">Pessoal</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Casamento, Chá Revelação, Aniversário
              </p>
            </CardContent>
          </Card>

          {/* B2B Corporate Card */}
          <Card
            onClick={() => handleAudienceSelect('b2b-corporate')}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 group",
              "bg-gradient-to-br from-tech-blue/20 via-tech-blue-light/15 to-tech-blue/20",
              "border-2 border-tech-blue/40 hover:border-tech-blue/80",
              "shadow-lg hover:shadow-tech-blue/30"
            )}
          >
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-tech-blue to-tech-blue-light flex items-center justify-center shadow-lg group-hover:shadow-tech-blue/50 transition-all">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-base font-bold text-white">Corporativo</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Empresa, Festival, Réveillon
              </p>
            </CardContent>
          </Card>

          {/* B2B Specialized Card */}
          <Card
            onClick={() => handleAudienceSelect('b2b-specialized')}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 group",
              "bg-gradient-to-br from-fire-gold/20 via-yellow-400/15 to-fire-gold/20",
              "border-2 border-fire-gold/40 hover:border-fire-gold/80",
              "shadow-lg hover:shadow-fire-gold/30"
            )}
          >
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fire-gold to-yellow-400 flex items-center justify-center shadow-lg group-hover:shadow-fire-gold/50 transition-all">
                <Star className="w-8 h-8 text-gray-900 fill-gray-900/20" />
              </div>
              <h4 className="text-base font-bold text-white">VIP</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Eventos de grande porte
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Quick Qualifier
  return (
    <div className="space-y-3.5 animate-in fade-in duration-300 pb-14 max-w-4xl mx-auto">
      <div className="text-center space-y-1">
        <h3 className="text-xs sm:text-sm font-semibold text-white animate-in slide-in-from-top duration-500">
          Quase lá!
        </h3>
      </div>

      <div className="space-y-3">
        {/* Público Estimado */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-fire-orange" />
            <label className="text-xs sm:text-sm font-medium text-white">Público estimado</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { value: 'ate-50', label: 'Até 50' },
              { value: '50-200', label: '50-200' },
              { value: '200-500', label: '200-500' },
              { value: '500+', label: '500+' },
            ].map((option) => (
              <Badge
                key={option.value}
                onClick={() => setSelectedAttendees(option.value)}
                variant={selectedAttendees === option.value ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer h-9 py-2 px-2.5 justify-center text-[11px] sm:text-xs transition-all duration-200 hover:scale-105',
                  selectedAttendees === option.value
                    ? 'bg-fire-orange border-fire-orange text-white shadow-lg'
                    : 'border-white/20 text-white/80 hover:border-fire-orange/50 hover:bg-fire-orange/10'
                )}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Orçamento Estimado */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-fire-gold" />
            <label className="text-xs sm:text-sm font-medium text-white">Orçamento estimado</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { value: '5k', label: '5k' },
              { value: '15k', label: '15k' },
              { value: '50k', label: '50k' },
              { value: '100k+', label: '100k+' },
            ].map((option) => (
              <Badge
                key={option.value}
                onClick={() => setSelectedBudget(option.value)}
                variant={selectedBudget === option.value ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer h-9 py-2 px-2.5 justify-center text-[11px] sm:text-xs transition-all duration-200 hover:scale-105',
                  selectedBudget === option.value
                    ? 'bg-fire-gold border-fire-gold text-gray-900 shadow-lg font-medium'
                    : 'border-white/20 text-white/80 hover:border-fire-gold/50 hover:bg-fire-gold/10'
                )}
              >
                R$ {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="sticky bottom-0 left-0 right-0 pt-3 -mx-2 sm:-mx-3 px-2 sm:px-3 bg-slate-950/92 backdrop-blur-sm border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setCurrentStep(1);
              onStepChange?.(1);
            }}
            className="w-full sm:w-auto h-10 text-sm"
          >
            Voltar
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => window.open(whatsappHref, '_blank')}
            className="w-full sm:w-auto h-10 text-sm"
          >
            Continuar no WhatsApp
          </Button>

          <Button
            onClick={handleComplete}
            disabled={!canProceed}
            className={cn(
              'gap-2 w-full sm:w-auto sm:ml-auto transition-all duration-150 h-10 text-sm',
              canProceed ? '' : 'opacity-60 cursor-not-allowed'
            )}
          >
            Continuar para formulário
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TriageWizard;
