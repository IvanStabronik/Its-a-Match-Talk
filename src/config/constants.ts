export const FREE_GENERATIONS_LIMIT = 3;

export const PASTE_MIN_LENGTH = 20;
export const PASTE_MAX_LENGTH = 5000;
export const REPLY_MAX_LENGTH = 300;

export const COLORS = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  themBubble: '#F1F5F9',
  meBubble: '#EEF2FF',
  danger: '#DC2626',
  success: '#16A34A',
} as const;

export const SUPPORTED_LOCALES = ['ru', 'uk', 'pl', 'en'] as const;

export const LOCALE_LABELS: Record<string, string> = {
  ru: 'Русский',
  uk: 'Українська',
  pl: 'Polski',
  en: 'English',
};
