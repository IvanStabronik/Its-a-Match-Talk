import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Screen } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

export default function PaywallScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('paywall.title')} subtitle={t('paywall.subtitle')}>
        <Button title={t('paywall.restore')} variant="secondary" disabled />
        <Button title={t('common.back')} variant="ghost" onPress={() => router.replace('/welcome')} />
      </Screen>
    </SafeAreaView>
  );
}
