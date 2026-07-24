import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Screen } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/stores/settingsStore';

export default function PaywallScreen() {
  const { t } = useTranslation();
  const setPremium = useSettingsStore((s) => s.setPremium);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('paywall.title')} subtitle={t('paywall.subtitle')}>
        <View style={{ gap: 8, marginBottom: 24 }}>
          <Text style={{ fontSize: 15, color: '#334155' }}>• {t('paywall.featureInterest')}</Text>
          <Text style={{ fontSize: 15, color: '#334155' }}>• {t('paywall.featureGhost')}</Text>
          <Text style={{ fontSize: 15, color: '#334155' }}>• {t('paywall.featureReplies')}</Text>
          <Text style={{ fontSize: 15, color: '#334155' }}>• {t('paywall.featureCompare')}</Text>
        </View>
        <Button
          title={t('paywall.unlockDev')}
          onPress={() => {
            setPremium(true);
            router.replace('/generating');
          }}
        />
        <View style={{ height: 12 }} />
        <Button title={t('paywall.restore')} variant="secondary" disabled />
        <Button title={t('common.back')} variant="ghost" onPress={() => router.back()} />
      </Screen>
    </SafeAreaView>
  );
}
