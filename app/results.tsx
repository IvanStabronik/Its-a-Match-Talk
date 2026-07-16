import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Screen } from '@/components/ui';
import { REPLY_VARIANT_KEYS } from '@/config/goals';
import { useTranslation } from '@/hooks/useTranslation';
import { useConversationStore } from '@/stores/conversationStore';

export default function ResultsScreen() {
  const { t } = useTranslation();
  const replies = useConversationStore((s) => s.replies);
  const reset = useConversationStore((s) => s.reset);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyReply = async (variant: string, text: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(variant);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('results.title')}>
        {replies.map((reply) => (
          <Card key={reply.variant}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#4F46E5', marginBottom: 8 }}>
              {t(REPLY_VARIANT_KEYS[reply.variant])}
            </Text>
            <Text style={{ fontSize: 16, color: '#0F172A', lineHeight: 22, marginBottom: 12 }}>{reply.text}</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              {t('results.whyThisWorks')}: {reply.whyThisWorks}
            </Text>
            <Button
              title={copiedId === reply.variant ? t('common.copied') : t('common.copy')}
              variant="secondary"
              onPress={() => copyReply(reply.variant, reply.text)}
            />
          </Card>
        ))}
        <Button title={t('results.regenerate')} onPress={() => router.push('/customize')} />
        <Button
          title={t('results.newConversation')}
          variant="ghost"
          onPress={() => {
            reset();
            router.replace('/welcome');
          }}
        />
      </Screen>
    </SafeAreaView>
  );
}
