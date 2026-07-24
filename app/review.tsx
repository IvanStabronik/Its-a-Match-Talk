import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, MessageBubble, Screen } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { parsePastedText } from '@/services/conversation';
import { useConversationStore } from '@/stores/conversationStore';
import type { Speaker } from '@/types/domain';

const SPEAKER_CYCLE: Speaker[] = ['them', 'me', 'unknown'];

export default function ReviewScreen() {
  const { t } = useTranslation();
  const rawPaste = useConversationStore((s) => s.rawPaste);
  const messages = useConversationStore((s) => s.messages);
  const setMessages = useConversationStore((s) => s.setMessages);
  const updateMessage = useConversationStore((s) => s.updateMessage);

  useEffect(() => {
    if (messages.length === 0 && rawPaste) {
      setMessages(parsePastedText(rawPaste));
    }
  }, [messages.length, rawPaste, setMessages]);

  const speakerLabel = (speaker: Speaker) => {
    if (speaker === 'me') return t('review.speakerMe');
    if (speaker === 'them') return t('review.speakerThem');
    return t('review.speakerUnknown');
  };

  const cycleSpeaker = (id: string, current: Speaker) => {
    const next = SPEAKER_CYCLE[(SPEAKER_CYCLE.indexOf(current) + 1) % SPEAKER_CYCLE.length];
    updateMessage(id, { speaker: next });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('review.title')} subtitle={t('review.contextHint')}>
        {messages.length < 2 ? (
          <Text style={{ color: '#CA8A04', marginBottom: 12 }}>{t('review.fewMessagesWarning')}</Text>
        ) : null}
        <ScrollView style={{ flex: 1, marginBottom: 12 }}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              speakerLabel={speakerLabel(message.speaker)}
              isMe={message.speaker === 'me'}
              onToggleSpeaker={() => cycleSpeaker(message.id, message.speaker)}
            />
          ))}
        </ScrollView>
        <Button
          title={t('review.analyze')}
          disabled={messages.filter((m) => m.speaker === 'me' || m.speaker === 'them').length < 2}
          onPress={() => router.push('/generating')}
        />
      </Screen>
    </SafeAreaView>
  );
}
