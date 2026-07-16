import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, LanguagePicker, Screen } from '@/components/ui';
import { LOCALE_LABELS } from '@/config/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/stores/settingsStore';
import type { AppLocale } from '@/types/domain';

export default function AgeGateScreen() {
  const { t, locale, setLocale } = useTranslation();
  const confirmAge = useSettingsStore((s) => s.confirmAge);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('privacy.ageGateTitle')} subtitle={t('privacy.ageGateSubtitle')}>
        <LanguagePicker locale={locale} labels={LOCALE_LABELS} onSelect={(l) => setLocale(l as AppLocale)} />
        <Button
          title={t('privacy.ageGate')}
          onPress={() => {
            confirmAge();
            router.replace('/privacy');
          }}
        />
      </Screen>
    </SafeAreaView>
  );
}
