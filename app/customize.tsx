import { router } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Chip, Screen } from '@/components/ui';
import { GOALS, REGIONS, TONES } from '@/config/goals';
import { useTranslation } from '@/hooks/useTranslation';
import { useConversationStore } from '@/stores/conversationStore';

export default function CustomizeScreen() {
  const { t } = useTranslation();
  const goal = useConversationStore((s) => s.goal);
  const tone = useConversationStore((s) => s.tone);
  const region = useConversationStore((s) => s.region);
  const setGoal = useConversationStore((s) => s.setGoal);
  const setTone = useConversationStore((s) => s.setTone);
  const setRegion = useConversationStore((s) => s.setRegion);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('customize.title')}>
        <ScrollView style={{ flex: 1, marginBottom: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8, marginTop: 4 }}>
            {t('customize.region')}
          </Text>
          {REGIONS.map((r) => (
            <Chip
              key={r.id}
              label={t(r.labelKey)}
              selected={region === r.id}
              onPress={() => setRegion(r.id)}
            />
          ))}

          <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8, marginTop: 12 }}>
            {t('customize.goal')}
          </Text>
          {GOALS.map((g) => (
            <Chip
              key={g.id}
              label={t(g.labelKey)}
              description={t(g.descriptionKey)}
              selected={goal === g.id}
              onPress={() => setGoal(g.id)}
            />
          ))}

          <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748B', marginBottom: 8, marginTop: 12 }}>
            {t('customize.tone')}
          </Text>
          {TONES.map((item) => (
            <Chip
              key={item.id}
              label={t(item.labelKey)}
              description={t(item.descriptionKey)}
              selected={tone === item.id}
              onPress={() => setTone(item.id)}
            />
          ))}
        </ScrollView>
        <Button title={t('customize.generate')} onPress={() => router.replace('/generating')} />
      </Screen>
    </SafeAreaView>
  );
}
