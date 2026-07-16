import { router } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Screen } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettingsStore } from '@/stores/settingsStore';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const acceptPrivacy = useSettingsStore((s) => s.acceptPrivacy);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('privacy.title')}>
        <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 12, lineHeight: 22 }}>
          • {t('privacy.screenshotsLocal')}
        </Text>
        <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 12, lineHeight: 22 }}>
          • {t('privacy.noStorage')}
        </Text>
        <Text style={{ fontSize: 16, color: '#64748B', marginBottom: 24, lineHeight: 22 }}>
          • {t('privacy.noSelling')}
        </Text>
        <Button
          title={t('common.continue')}
          onPress={() => {
            acceptPrivacy();
            router.replace('/welcome');
          }}
        />
      </Screen>
    </SafeAreaView>
  );
}
