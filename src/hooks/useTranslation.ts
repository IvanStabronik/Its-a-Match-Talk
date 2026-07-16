import { useCallback, useState } from 'react';

import { setI18nLocale, t } from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';
import type { AppLocale } from '@/types/domain';

export function useTranslation() {
  const locale = useSettingsStore((s) => s.locale);
  const [, setTick] = useState(0);

  const translate = useCallback(
    (key: string, options?: Record<string, string | number>) => {
      setI18nLocale(locale);
      return t(key, options);
    },
    [locale],
  );

  const setLocale = useCallback((next: AppLocale) => {
    useSettingsStore.getState().setLocale(next);
    setTick((n) => n + 1);
  }, []);

  return { t: translate, locale, setLocale };
}
