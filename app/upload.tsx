import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Screen } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { createOcrProvider } from '@/ocr';
import { parsePastedText } from '@/services/conversation';
import { useConversationStore } from '@/stores/conversationStore';

export default function UploadScreen() {
  const { t } = useTranslation();
  const setRawPaste = useConversationStore((s) => s.setRawPaste);
  const setMessages = useConversationStore((s) => s.setMessages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async () => {
    setBusy(true);
    setError(null);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(t('errors.ocrPermission'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (result.canceled || !result.assets[0]) return;

      const ocr = createOcrProvider();
      try {
        const recognized = await ocr.recognizeText(result.assets[0].uri);
        const text = recognized.text.trim();
        if (text.length < 20) {
          setError(t('errors.ocrFailed'));
          return;
        }
        setRawPaste(text);
        setMessages(parsePastedText(text));
        router.push('/review');
      } catch {
        setError(t('errors.ocrFailed'));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('upload.title')} subtitle={t('upload.subtitle')}>
        <Button title={t('upload.pick')} disabled={busy} onPress={pick} />
        <View style={{ height: 12 }} />
        {error ? <Text style={{ color: '#DC2626', marginBottom: 12 }}>{error}</Text> : null}
        <Button title={t('errors.ocrFailedAction')} variant="secondary" onPress={() => router.push('/paste')} />
        <Button title={t('common.back')} variant="ghost" onPress={() => router.back()} />
      </Screen>
    </SafeAreaView>
  );
}
