import { UTMParams } from '@shared/types/analytics';

export interface WhatsAppContext {
  source?: string;
  tier?: string;
  product?: string;
  eventType?: string;
  city?: string;
  date?: string;
  budget?: string;
  guests?: number;
}

export const whatsappTemplates = {
  // Template para produtos específicos
  product: (productName: string, context?: WhatsAppContext) => {
    const base = `🎆 *SOLICITAÇÃO DE ORÇAMENTO - M5 MAX*\n\n👋 Olá! Gostaria de solicitar orçamento para:\n\n📦 *PRODUTO:* ${productName}`;
    
    if (context?.eventType) {
      return `${base}\n🎉 *EVENTO:* ${context.eventType}`;
    }
    
    return base;
  },

  // Template para tiers de preço
  pricing: (tierName: string, context?: WhatsAppContext) => {
    let message = `🎆 *ORÇAMENTO ${tierName.toUpperCase()} - M5 MAX*\n\n👋 Olá! Tenho interesse no plano **${tierName}** e gostaria de receber um orçamento personalizado.`;
    
    if (context?.eventType) {
      message += `\n\n🎉 *TIPO DE EVENTO:* ${context.eventType}`;
    }
    
    if (context?.date) {
      message += `\n📅 *DATA PREVISTA:* ${context.date}`;
    }
    
    if (context?.guests) {
      message += `\n👥 *NÚMERO DE CONVIDADOS:* ${context.guests}`;
    }
    
    if (context?.city) {
      message += `\n📍 *LOCAL:* ${context.city}`;
    }
    
    message += '\n\nPodemos conversar sobre os detalhes?';
    
    return message;
  },

  // Template para comparação de produtos
  comparison: (products: string[]) => {
    return `🎆 *COMPARAÇÃO DE PRODUTOS - M5 MAX*\n\n👋 Olá! Gostaria de receber mais informações e orçamentos para os seguintes produtos:\n\n${products.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nPodemos conversar sobre as diferenças e qual seria mais adequado para meu evento?`;
  },

  // Template para solicitação geral
  general: (context?: WhatsAppContext) => {
    let message = '🎆 *SOLICITAÇÃO DE ORÇAMENTO - M5 MAX*\n\n👋 Olá! Gostaria de solicitar orçamento para um espetáculo pirotécnico.';
    
    if (context?.eventType) {
      message += `\n\n🎉 *TIPO DE EVENTO:* ${context.eventType}`;
    }
    
    return message;
  },

  // Template legado para B2B
  b2b: (eventType: string, city: string, date: string) => 
    `🎆 *ORÇAMENTO EMPRESARIAL - M5 MAX*\n\n👋 Olá! Quero orçamento para ${eventType} em ${city} dia ${date}.\n\nSou uma empresa e preciso de um orçamento profissional detalhado.`
};

export const generateWhatsAppURL = (
  message: string,
  utms?: UTMParams,
  context?: WhatsAppContext
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
    
    // Adicionar contexto adicional do WhatsApp
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        if (value) utmParams.append(`wa_${key}`, String(value));
      });
    }
    
    const utmString = utmParams.toString();
    if (utmString) {
      url += `&${utmString}`;
    }
  }
  
  return url;
};

// Função melhorada para gerar mensagens do WhatsApp
export const generateWhatsAppMessage = (
  type: 'product' | 'pricing' | 'comparison' | 'general' | 'b2b',
  data?: {
    productName?: string;
    tierName?: string;
    products?: string[];
    context?: WhatsAppContext;
    // Para compatibilidade com código legado
    eventType?: string;
    city?: string;
    date?: string;
  }
): string => {
  switch (type) {
    case 'product':
      return whatsappTemplates.product(data?.productName || 'Produto', data?.context);
    
    case 'pricing':
      return whatsappTemplates.pricing(data?.tierName || 'Básico', data?.context);
    
    case 'comparison':
      return whatsappTemplates.comparison(data?.products || ['Produto 1', 'Produto 2']);
    
    case 'b2b':
      return whatsappTemplates.b2b(
        data?.eventType || 'evento corporativo',
        data?.city || 'cidade',
        data?.date || 'data a definir'
      );
    
    default:
      return whatsappTemplates.general(data?.context);
  }
};

// Função legada para compatibilidade
export const getWhatsAppMessage = (
  audience: string,
  formData?: Record<string, unknown>
): string => {
  const context: WhatsAppContext = {
    eventType: formData?.eventType as string,
    city: formData?.cityUF as string,
    date: formData?.eventDate as string,
    budget: formData?.budget as string,
    guests: formData?.guests as number
  };

  switch (audience) {
    case 'b2b':
      return generateWhatsAppMessage('b2b', {
        eventType: context.eventType || 'evento corporativo',
        city: context.city || 'cidade',
        date: context.date || 'data a definir'
      });
    
    default:
      return generateWhatsAppMessage('general', { context });
  }
};