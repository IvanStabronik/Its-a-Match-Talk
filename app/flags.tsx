import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Screen } from '@/components/ui';
import { COLORS } from '@/config/constants';
import { useTranslation } from '@/hooks/useTranslation';
import {
  defaultPolarity,
  FLAG_KINDS,
  type FlagKind,
  useFlagStore,
} from '@/stores/flagStore';

export default function FlagsScreen() {
  const { t } = useTranslation();
  const events = useFlagStore((s) => s.events);
  const addEvent = useFlagStore((s) => s.addEvent);
  const removeEvent = useFlagStore((s) => s.removeEvent);
  const [kind, setKind] = useState<FlagKind>('cancelled_plan');
  const [note, setNote] = useState('');

  const counts = useMemo(() => {
    let red = 0;
    let green = 0;
    for (const e of events) {
      if (e.polarity === 'red') red += 1;
      else green += 1;
    }
    return { red, green };
  }, [events]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('flags.title')} subtitle={t('flags.subtitle')}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          <Card>
            <Text style={styles.meta}>
              {t('flags.summary', { red: counts.red, green: counts.green })}
            </Text>
            <Text style={styles.disclaimer}>{t('flags.disclaimer')}</Text>
          </Card>

          <Text style={styles.label}>{t('flags.add')}</Text>
          <View style={styles.kindWrap}>
            {FLAG_KINDS.map((k) => (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
                style={[styles.kindChip, kind === k && styles.kindChipOn]}
              >
                <Text style={[styles.kindText, kind === k && styles.kindTextOn]}>
                  {t(`flags.kinds.${k}`)}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder={t('flags.notePlaceholder')}
            style={styles.input}
            maxLength={280}
          />
          <Button
            title={t('flags.save')}
            onPress={() => {
              addEvent({
                kind,
                polarity: defaultPolarity(kind),
                note: note.trim() || t(`flags.kinds.${kind}`),
              });
              setNote('');
            }}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>{t('flags.timeline')}</Text>
          {events.length === 0 ? (
            <Text style={styles.meta}>{t('flags.empty')}</Text>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <Text
                  style={[
                    styles.polarity,
                    { color: event.polarity === 'red' ? COLORS.danger : COLORS.success },
                  ]}
                >
                  {event.polarity === 'red' ? t('flags.red') : t('flags.green')} ·{' '}
                  {t(`flags.kinds.${event.kind}`)}
                </Text>
                <Text style={styles.body}>{event.note}</Text>
                <Text style={styles.meta}>{new Date(event.at).toLocaleString()}</Text>
                <Button
                  title={t('flags.remove')}
                  variant="ghost"
                  onPress={() => removeEvent(event.id)}
                />
              </Card>
            ))
          )}

          <Button title={t('common.back')} variant="ghost" onPress={() => router.back()} />
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}

const styles = {
  label: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  kindWrap: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 },
  kindChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
  },
  kindChipOn: { borderColor: COLORS.primary, backgroundColor: '#EEF2FF' },
  kindText: { fontSize: 12, color: COLORS.textMuted },
  kindTextOn: { color: COLORS.primaryDark, fontWeight: '600' as const },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    fontSize: 15,
  },
  polarity: { fontSize: 12, fontWeight: '700' as const, marginBottom: 6 },
  body: { fontSize: 15, color: COLORS.text, marginBottom: 6, lineHeight: 20 },
  meta: { fontSize: 13, color: COLORS.textMuted, marginBottom: 4 },
  disclaimer: { fontSize: 12, color: COLORS.textMuted, lineHeight: 16, marginTop: 8 },
};
