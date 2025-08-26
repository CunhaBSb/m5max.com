import { UTMParams } from '@/shared/types/analytics';
import { AudienceType } from '@/shared/types/common';

export const whatsappTemplates = {
  b2b: (eventType: string, city: string, date: string) => 
    `Olá M5! Quero orçamento para ${eventType} em ${city} dia ${date}.`
};

export const generateWhatsAppURL = (
  message: string,
  utms?: UTMParams,
  context?: { audience: AudienceType, source: string }
): string => {
  const phone = '5561982735575';
  const encodedMessage = encodeURIComponent(message);
  
  let url = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Adicionar UTMs se fornecidos
  if (utms) {
    const utmParams = new URLSearchParams();
    Object.entries(utms).forEach(([key, value]) => {
      if (value) utmParams.append(key, value);
    });
    
    // Adicionar contexto adicional
    if (context) {
      utmParams.append('audience', context.audience);
      utmParams.append('source', context.source);
    }
    
    const utmString = utmParams.toString();
    if (utmString) {
      url += `&${utmString}`;
    }
  }
  
  return url;
};

export const getWhatsAppMessage = (
  audience: AudienceType,
  formData?: Record<string, unknown>
): string => {
  switch (audience) {
    case 'b2b':
      return formData 
        ? whatsappTemplates.b2b(
            formData.eventType || 'evento',
            formData.cityUF || 'cidade',
            formData.eventDate || 'data'
          )
        : 'Olá M5! Gostaria de saber mais sobre shows pirotécnicos profissionais.';
    
    default:
      return 'Olá M5! Gostaria de saber mais sobre shows pirotécnicos e espetáculos de réveillon.';
  }
};