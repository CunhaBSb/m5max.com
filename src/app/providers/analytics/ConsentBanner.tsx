import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { useAppStore } from '@/shared/store/appStore';
import { Shield, Settings, X } from 'lucide-react';

const ConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { consent, updateConsent } = useAppStore();

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('m5max-consent');
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      ad_storage: 'granted' as const,
      ad_user_data: 'granted' as const,
      ad_personalization: 'granted' as const,
      analytics_storage: 'granted' as const,
      functionality_storage: 'granted' as const,
      security_storage: 'granted' as const
    };

    updateConsent(fullConsent);
    localStorage.setItem('m5max-consent', JSON.stringify(fullConsent));
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    const essentialConsent = {
      ad_storage: 'denied' as const,
      ad_user_data: 'denied' as const,
      ad_personalization: 'denied' as const,
      analytics_storage: 'denied' as const,
      functionality_storage: 'granted' as const,
      security_storage: 'granted' as const
    };

    updateConsent(essentialConsent);
    localStorage.setItem('m5max-consent', JSON.stringify(essentialConsent));
    setIsVisible(false);
  };

  const handleCustomConsent = (consentData: typeof consent) => {
    updateConsent(consentData);
    localStorage.setItem('m5max-consent', JSON.stringify(consentData));
    setIsVisible(false);
    setShowSettings(false);
  };

  if (!isVisible) return null;

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Configurações de Privacidade</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Cookies Essenciais</h3>
                <p className="text-sm text-muted-foreground">
                  Necessários para o funcionamento básico do site. Sempre ativos.
                </p>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Sempre Ativo
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Cookies de Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Nos ajudam a entender como você usa nosso site.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.analytics_storage === 'granted'}
                    onChange={(e) => 
                      handleCustomConsent({
                        ...consent,
                        analytics_storage: e.target.checked ? 'granted' : 'denied'
                      })
                    }
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Cookies de Marketing</h3>
                    <p className="text-sm text-muted-foreground">
                      Usados para personalizar anúncios e melhorar campanhas.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={consent.ad_storage === 'granted'}
                    onChange={(e) => 
                      handleCustomConsent({
                        ...consent,
                        ad_storage: e.target.checked ? 'granted' : 'denied',
                        ad_user_data: e.target.checked ? 'granted' : 'denied',
                        ad_personalization: e.target.checked ? 'granted' : 'denied'
                      })
                    }
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={() => handleCustomConsent(consent)} className="flex-1">
                Salvar Preferências
              </Button>
              <Button variant="outline" onClick={handleAcceptAll}>
                Aceitar Tudo
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t">
      <div className="max-w-6xl mx-auto">
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Sua privacidade é importante</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Usamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                Você pode escolher quais cookies aceitar.{' '}
                <a href="/legal" className="text-primary hover:underline">
                  Ver política de privacidade
                </a>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Personalizar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAcceptEssential}
              >
                Apenas Essenciais
              </Button>
              <Button 
                size="sm"
                onClick={handleAcceptAll}
              >
                Aceitar Todos
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConsentBanner;