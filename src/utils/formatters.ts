/**
 * Utilitários de formatação para o CRM
 */

const LOCALE = 'pt-BR';

/**
 * Formata um número com separadores de milhar
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString(LOCALE);
};

/**
 * Formata um valor monetário
 */
export const formatCurrency = (value: number, compact = false): string => {
  if (compact && value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }
  return value.toLocaleString(LOCALE, {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata uma porcentagem
 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata uma data
 */
export const formatDate = (date: Date | undefined, format: 'short' | 'long' = 'short'): string => {
  if (!date) return '-';
  
  const options: Intl.DateTimeFormatOptions = format === 'long'
    ? { day: '2-digit', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' };
  
  return date.toLocaleDateString(LOCALE, options);
};

/**
 * Formata data e hora
 */
export const formatDateTime = (date: Date | undefined): string => {
  if (!date) return '-';
  
  return date.toLocaleString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formata tempo relativo (ex: "há 2 dias")
 */
export const formatRelativeTime = (date: Date | undefined): string => {
  if (!date) return '-';
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
  return `Há ${Math.floor(diffDays / 365)} anos`;
};

/**
 * Calcula taxa de entrega
 */
export const calculateDeliveryRate = (delivered: number, sent: number): number => {
  if (sent === 0) return 0;
  return Math.round((delivered / sent) * 100);
};

/**
 * Calcula taxa de conversão
 */
export const calculateConversionRate = (conversions: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((conversions / total) * 100 * 10) / 10;
};

/**
 * Calcula progresso percentual
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};
