import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, LanguagePicker, Screen } from '@/components/ui';
import { FREE_GENERATIONS_LIMIT, LOCALE_LABELS } from '@/config/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/stores/settingsStore';
import type { AppLocale } from '@/types/domain';

export default function WelcomeScreen() {
  const { t, locale, setLocale } = useTranslation();
  const freeGenerationsUsed = useSettingsStore((s) => s.freeGenerationsUsed);
  const remaining = Math.max(0, FREE_GENERATIONS_LIMIT - freeGenerationsUsed);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('welcome.title')} subtitle={t('welcome.subtitle')}>
        <LanguagePicker locale={locale} labels={LOCALE_LABELS} onSelect={(l) => setLocale(l as AppLocale)} />
        <View style={{ flex: 1 }} />
        <Button title={t('welcome.pasteText')} onPress={() => router.push('/paste')} />
        <View style={{ height: 12 }} />
        <Button title={t('welcome.uploadScreenshot')} variant="secondary" onPress={() => router.push('/upload')} />
        <View style={{ height: 12 }} />
        <Button title={t('flags.title')} variant="secondary" onPress={() => router.push('/flags')} />
        <View style={{ height: 12 }} />
        <Button title={t('settings.title')} variant="ghost" onPress={() => router.push('/settings')} />
        <View style={{ height: 8 }} />
        <Button
          title={t('welcome.freeGenerationsLeft', { count: remaining })}
          variant="ghost"
          disabled
        />
      </Screen>
    </SafeAreaView>
  );
}
