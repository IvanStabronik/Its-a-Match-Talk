import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import pl from './locales/pl.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';
import { SUPPORTED_LOCALES } from '@/config/constants';
import type { AppLocale } from '@/types/domain';

const i18n = new I18n({ en, ru, uk, pl });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export function resolveDeviceLocale(): AppLocale {
  const tag = Localization.getLocales()[0]?.languageCode ?? 'en';
  if (tag === 'ru' || tag === 'uk' || tag === 'pl' || tag === 'en') {
    return tag;
  }
  if (tag === 'be') return 'ru';
  return 'en';
}

export function setI18nLocale(locale: AppLocale): void {
  i18n.locale = locale;
}

export function getI18nLocale(): AppLocale {
  const locale = i18n.locale as AppLocale;
  return SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
}

export function t(key: string, options?: Record<string, string | number>): string {
  return i18n.t(key, options);
}

export { i18n };
