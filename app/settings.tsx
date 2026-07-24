import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, LanguagePicker, Screen } from '@/components/ui';
import { LOCALE_LABELS } from '@/config/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { deleteAllUserData } from '@/services/account';
import { restorePurchases } from '@/services/purchases';
import { useSettingsStore } from '@/stores/settingsStore';
import type { AppLocale } from '@/types/domain';

export default function SettingsScreen() {
  const { t, locale, setLocale } = useTranslation();
  const hasPremium = useSettingsStore((s) => s.hasPremium);
  const setPremium = useSettingsStore((s) => s.setPremium);
  const [busy, setBusy] = useState(false);

  const onDelete = () => {
    Alert.alert(t('settings.deleteData'), t('settings.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.deleteData'),
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await deleteAllUserData();
            router.replace('/welcome');
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('settings.title')}>
        <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 8 }}>{t('common.language')}</Text>
        <LanguagePicker locale={locale} labels={LOCALE_LABELS} onSelect={(l) => setLocale(l as AppLocale)} />

        <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 12 }}>
          {hasPremium ? t('settings.premiumOn') : t('settings.premiumOff')}
        </Text>

        <Button
          title={t('paywall.restore')}
          variant="secondary"
          disabled={busy}
          onPress={async () => {
            const state = await restorePurchases();
            if (state.hasPremium) setPremium(true);
            else Alert.alert(t('settings.title'), t('settings.restoreEmpty'));
          }}
        />
        <View style={{ height: 12 }} />
        <Button title={t('settings.deleteData')} variant="secondary" disabled={busy} onPress={onDelete} />
        <View style={{ height: 12 }} />
        <Button title={t('common.back')} variant="ghost" onPress={() => router.back()} />
      </Screen>
    </SafeAreaView>
  );
}
