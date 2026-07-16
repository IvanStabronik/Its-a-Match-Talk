import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Screen } from '@/components/ui';
import { FREE_GENERATIONS_LIMIT } from '@/config/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { buildGenerationRequest, generateRepliesFromRequest } from '@/services/generation';
import { useConversationStore } from '@/stores/conversationStore';
import { useSettingsStore } from '@/stores/settingsStore';

const LOADING_KEYS = ['generating.reading', 'generating.checking', 'generating.polishing'] as const;

export default function GeneratingScreen() {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(0);
  const messages = useConversationStore((s) => s.messages);
  const goal = useConversationStore((s) => s.goal);
  const tone = useConversationStore((s) => s.tone);
  const region = useConversationStore((s) => s.region);
  const setReplies = useConversationStore((s) => s.setReplies);
  const freeGenerationsUsed = useSettingsStore((s) => s.freeGenerationsUsed);
  const incrementGenerationsUsed = useSettingsStore((s) => s.incrementGenerationsUsed);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % LOADING_KEYS.length), 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (freeGenerationsUsed >= FREE_GENERATIONS_LIMIT) {
        router.replace('/paywall');
        return;
      }

      try {
        const request = buildGenerationRequest({ messages, goal, tone, region, locale });
        const result = await generateRepliesFromRequest(request);
        if (cancelled) return;
        setReplies(result.replies);
        incrementGenerationsUsed();
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
    freeGenerationsUsed,
    goal,
    incrementGenerationsUsed,
    locale,
    messages,
    region,
    setReplies,
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
