// Funções utilitárias do projeto M5 Max

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UTMParams, PublicSegment } from "@/types";

// Função para combinar classes CSS (mantendo compatibilidade com shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatação de telefone brasileiro
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  return phone;
}

// Formatação de data brasileira
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Formatação de preço brasileiro
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

// Geração de link WhatsApp
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
}

// Captura de parâmetros UTM da URL
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
  };
}

// Captura de parâmetros de tracking (gclid, fbclid)
export function getTrackingParams(): { gclid?: string; fbclid?: string } {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    gclid: urlParams.get('gclid') || undefined,
    fbclid: urlParams.get('fbclid') || undefined,
  };
}

// Validação de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone brasileiro
export function isValidPhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11;
}

// Identificação do segmento baseado na URL
export function getSegmentFromPath(pathname: string): PublicSegment | null {
  if (pathname.includes('shows-pirotecnicos') || pathname.includes('b2b')) {
    return 'b2b';
  }
  if (pathname.includes('cha-revelacao')) {
    return 'cha';
  }
  if (pathname.includes('kits')) {
    return 'kits';
  }
  return null;
}

// Geração de slug para URLs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

// Debounce para otimização de performance
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Storage helpers com fallback
export const storage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }
};