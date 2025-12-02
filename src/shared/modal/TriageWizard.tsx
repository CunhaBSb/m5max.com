import React, { useState } from 'react';
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
}

const TriageWizard: React.FC<TriageWizardProps> = ({ step: initialStep, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(initialStep);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | null>(null);
  const [selectedAttendees, setSelectedAttendees] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const handleAudienceSelect = (audience: AudienceType) => {
    setSelectedAudience(audience);
    setCurrentStep(2);
  };

  const handleComplete = () => {
    if (selectedAudience && selectedAttendees && selectedBudget) {
      onComplete({
        audience: selectedAudience,
        attendeesRange: selectedAttendees,
        budgetRange: selectedBudget,
      });
    }
  };

  const canProceed = selectedAudience && selectedAttendees && selectedBudget;

  if (currentStep === 1) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white animate-in slide-in-from-top duration-500">
            Qual melhor descreve seu evento?
          </h3>
          <p className="text-sm text-white/70 animate-in slide-in-from-top duration-500 delay-100">
            Escolha a categoria que mais se encaixa
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white animate-in slide-in-from-top duration-500">
          Quase lá!
        </h3>
        <p className="text-sm text-white/70 animate-in slide-in-from-top duration-500 delay-100">
          Nos ajude a personalizar sua proposta
        </p>
      </div>

      <div className="space-y-5">
        {/* Público Estimado */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-fire-orange" />
            <label className="text-sm font-medium text-white">Público estimado</label>
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
                  'cursor-pointer py-2 px-3 justify-center text-sm transition-all duration-200 hover:scale-105',
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
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-fire-gold" />
            <label className="text-sm font-medium text-white">Orçamento estimado</label>
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
                  'cursor-pointer py-2 px-3 justify-center text-sm transition-all duration-200 hover:scale-105',
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
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleComplete}
          disabled={!canProceed}
          className={cn(
            'gap-2 transition-all duration-300',
            canProceed
              ? 'bg-gradient-to-r from-fire-orange to-fire-gold hover:from-fire-gold hover:to-fire-orange shadow-lg'
              : 'opacity-50 cursor-not-allowed'
          )}
        >
          Continuar para formulário
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TriageWizard;
