import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Screen } from '@/components/ui';
import { PASTE_MAX_LENGTH } from '@/config/constants';
import { useTranslation } from '@/hooks/useTranslation';
import { isPasteValid } from '@/services/conversation';
import { useConversationStore } from '@/stores/conversationStore';

export default function PasteScreen() {
  const { t } = useTranslation();
  const setRawPaste = useConversationStore((s) => s.setRawPaste);
  const [text, setText] = useState('');
  const valid = isPasteValid(text);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('paste.title')} subtitle={t('paste.hint')}>
        <TextInput
          multiline
          placeholder={t('paste.placeholder')}
          value={text}
          onChangeText={setText}
          maxLength={PASTE_MAX_LENGTH}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            borderRadius: 12,
            padding: 14,
            fontSize: 15,
            textAlignVertical: 'top',
            backgroundColor: '#FFFFFF',
            marginBottom: 12,
          }}
        />
        {!valid ? <Text style={{ color: '#64748B', marginBottom: 12 }}>{t('paste.minLength')}</Text> : null}
        <Button
          title={t('paste.proceed')}
          disabled={!valid}
          onPress={() => {
            setRawPaste(text);
            router.push('/review');
          }}
        />
      </Screen>
    </SafeAreaView>
  );
}
