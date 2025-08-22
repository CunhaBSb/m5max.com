// WhatsApp integration utilities

import { generateWhatsAppLink, formatPhone } from "@/utils";
import { analytics } from "./analytics";
import type { Lead, PublicSegment } from "@/types";

// WhatsApp configuration
const WHATSAPP_CONFIG = {
  phone: "5511999999999", // Número da M5 Max
  businessHours: {
    start: 8, // 8h
    end: 18,  // 18h
    days: [1, 2, 3, 4, 5], // Segunda a Sexta
  },
};

// Generate personalized WhatsApp message based on segment and form data
export const generateWhatsAppMessage = (
  segment: PublicSegment,
  data?: Partial<Lead>,
  customMessage?: string
): string => {
  if (customMessage) return customMessage;

  const name = data?.name ? `Olá! Meu nome é ${data.name}.` : "Olá!";
  const city = data?.city ? ` Sou de ${data.city}` : "";
  const eventDate = data?.eventDate ? ` e meu evento está previsto para ${data.eventDate}` : "";
  const budget = data?.budget ? ` com orçamento ${data.budget.replace('-', ' de ')}` : "";
  
  const messages = {
    b2b: `${name}${city} e tenho interesse em contratar um show pirotécnico profissional${eventDate}${budget}. Gostaria de receber mais informações sobre seus serviços e valores. Obrigado!`,
    
    cha: `${name}${city} e estou organizando um chá revelação${eventDate}${budget}. Gostaria de saber mais sobre os kits e shows disponíveis. Podem me ajudar? Obrigado!`,
    
    kits: `${name}${city} e tenho interesse em kits DIY para fogos de artifício${eventDate}${budget}. Gostaria de conhecer as opções disponíveis e como funciona a entrega. Obrigado!`,
  };

  return messages[segment] || `${name} Tenho interesse nos serviços da M5 Max. Podem me passar mais informações? Obrigado!`;
};

// Open WhatsApp with tracking
export const openWhatsApp = (
  segment: PublicSegment,
  data?: Partial<Lead>,
  customMessage?: string,
  source: string = "button"
) => {
  // Generate message
  const message = generateWhatsAppMessage(segment, data, customMessage);
  
  // Generate WhatsApp link
  const link = generateWhatsAppLink(WHATSAPP_CONFIG.phone, message);
  
  // Track event
  analytics.whatsappClick(segment, source);
  
  // Open WhatsApp
  if (typeof window !== 'undefined') {
    window.open(link, '_blank');
  }
  
  return link;
};

// Quick WhatsApp functions for different segments
export const whatsappActions = {
  // B2B (Shows Pirotécnicos)
  requestB2BQuote: (data?: Partial<Lead>) => {
    return openWhatsApp('b2b', data, undefined, 'b2b-quote-button');
  },

  // Chá Revelação
  askAboutChaRevelacao: (data?: Partial<Lead>) => {
    return openWhatsApp('cha', data, undefined, 'cha-info-button');
  },

  // Kits DIY
  askAboutKits: (data?: Partial<Lead>) => {
    return openWhatsApp('kits', data, undefined, 'kits-info-button');
  },

  // General contact
  generalContact: (customMessage?: string) => {
    const message = customMessage || "Olá! Gostaria de mais informações sobre os serviços da M5 Max. Obrigado!";
    return generateWhatsAppLink(WHATSAPP_CONFIG.phone, message);
  },

  // Emergency contact
  emergencyContact: () => {
    const message = "🚨 URGENTE: Preciso de suporte técnico para um evento da M5 Max. Por favor, entrem em contato o mais rápido possível.";
    return generateWhatsAppLink(WHATSAPP_CONFIG.phone, message);
  },

  // Support for purchased kits
  kitSupport: (kitName?: string) => {
    const message = kitName 
      ? `Preciso de ajuda com o kit "${kitName}" que comprei da M5 Max. Podem me orientar sobre o uso seguro?`
      : "Preciso de suporte técnico para um kit da M5 Max que comprei. Podem me ajudar?";
    
    return generateWhatsAppLink(WHATSAPP_CONFIG.phone, message);
  },
};

// Check if it's business hours
export const isBusinessHours = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR fallback
  
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const isBusinessDay = WHATSAPP_CONFIG.businessHours.days.includes(day);
  const isBusinessTime = hour >= WHATSAPP_CONFIG.businessHours.start && hour < WHATSAPP_CONFIG.businessHours.end;
  
  return isBusinessDay && isBusinessTime;
};

// Get next business hours info
export const getNextBusinessHours = (): string => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  
  // If it's a business day but outside hours
  if (WHATSAPP_CONFIG.businessHours.days.includes(currentDay)) {
    if (currentHour < WHATSAPP_CONFIG.businessHours.start) {
      return `Hoje às ${WHATSAPP_CONFIG.businessHours.start}h`;
    }
  }
  
  // Find next business day
  let nextDay = (currentDay + 1) % 7;
  let daysUntilNext = 1;
  
  while (!WHATSAPP_CONFIG.businessHours.days.includes(nextDay)) {
    nextDay = (nextDay + 1) % 7;
    daysUntilNext++;
  }
  
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  if (daysUntilNext === 1) {
    return `Amanhã (${dayNames[nextDay]}) às ${WHATSAPP_CONFIG.businessHours.start}h`;
  }
  
  return `${dayNames[nextDay]} às ${WHATSAPP_CONFIG.businessHours.start}h`;
};

// WhatsApp status
export const getWhatsAppStatus = () => {
  const isOpen = isBusinessHours();
  const nextHours = getNextBusinessHours();
  
  return {
    isOpen,
    message: isOpen 
      ? "Estamos online! Resposta imediata." 
      : `Fora do horário comercial. Voltamos ${nextHours}`,
    nextBusinessHours: nextHours,
  };
};