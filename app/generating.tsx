import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { runAnalysis } from '@/services/analyzeRemote';
import { buildCompare, loadPreviousSnapshot, saveSnapshot } from '@/services/compare';
import { useConversationStore } from '@/stores/conversationStore';
import { useSettingsStore } from '@/stores/settingsStore';

const LOADING_KEYS = [
  'generating.reading',
  'generating.checking',
  'generating.measuring',
  'generating.polishing',
] as const;

export default function GeneratingScreen() {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(0);
  const messages = useConversationStore((s) => s.messages);
  const goal = useConversationStore((s) => s.goal);
  const tone = useConversationStore((s) => s.tone);
  const region = useConversationStore((s) => s.region);
  const setAnalysis = useConversationStore((s) => s.setAnalysis);
  const setCompare = useConversationStore((s) => s.setCompare);
  const hasPremium = useSettingsStore((s) => s.hasPremium);
  const incrementGenerationsUsed = useSettingsStore((s) => s.incrementGenerationsUsed);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % LOADING_KEYS.length), 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const assigned = messages.filter((m) => m.speaker === 'me' || m.speaker === 'them');
        if (assigned.length < 2) {
          router.replace('/review');
          return;
        }

        const result = await runAnalysis({
          messages,
          goal,
          tone,
          region,
          locale,
          includePaid: hasPremium,
        });

        if (cancelled) return;

        const currentSnap = {
          at: new Date().toISOString(),
          mePercent: result.effort.mePercent,
          themPercent: result.effort.themPercent,
          ghostRisk: result.paid?.ghostRisk,
          interestTrend: result.paid?.interestTrend,
        };
        const previous = await loadPreviousSnapshot();
        const compare = buildCompare(previous, currentSnap);
        await saveSnapshot(currentSnap);

        setAnalysis(result);
        setCompare(compare);
        if (hasPremium) incrementGenerationsUsed();
        router.replace('/results');
      } catch {
        if (!cancelled) router.replace('/welcome');
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [
    goal,
    hasPremium,
    incrementGenerationsUsed,
    locale,
    messages,
    region,
    setAnalysis,
    setCompare,
    tone,
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen>
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 80 }} />
        <Text style={{ textAlign: 'center', marginTop: 24, fontSize: 18, color: '#0F172A' }}>
          {t(LOADING_KEYS[step])}
        </Text>
      </Screen>
    </SafeAreaView>
  );
}
