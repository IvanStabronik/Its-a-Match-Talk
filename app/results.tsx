import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Screen } from '@/components/ui';
import { COLORS } from '@/config/constants';
import { REPLY_VARIANT_KEYS } from '@/config/goals';
import { useTranslation } from '@/hooks/useTranslation';
import { useConversationStore } from '@/stores/conversationStore';
import { useSettingsStore } from '@/stores/settingsStore';

export default function ResultsScreen() {
  const { t } = useTranslation();
  const effort = useConversationStore((s) => s.effort);
  const analysis = useConversationStore((s) => s.analysis);
  const replies = useConversationStore((s) => s.replies);
  const compare = useConversationStore((s) => s.compare);
  const reset = useConversationStore((s) => s.reset);
  const hasPremium = useSettingsStore((s) => s.hasPremium);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const paid = hasPremium ? analysis?.paid : undefined;

  const copyReply = async (variant: string, text: string) => {
    await Clipboard.setStringAsync(text);
    setCopiedId(variant);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Screen title={t('insights.title')} subtitle={t('insights.subtitle')}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
          {effort ? (
            <Card>
              <Text style={styles.sectionLabel}>{t('insights.effort.title')}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barMe, { flex: Math.max(effort.mePercent, 1) }]} />
                <View style={[styles.barThem, { flex: Math.max(effort.themPercent, 1) }]} />
              </View>
              <Text style={styles.barLegend}>
                {t('insights.effort.you')}: {effort.mePercent}% · {t('insights.effort.them')}:{' '}
                {effort.themPercent}%
              </Text>
              {effort.bulletKeys.map((key) => (
                <Text key={key} style={styles.bullet}>
                  • {t(key)}
                </Text>
              ))}
              <Text style={styles.disclaimer}>{t('insights.disclaimer')}</Text>
            </Card>
          ) : null}

          {compare ? (
            <Card>
              <Text style={styles.sectionLabel}>{t('insights.compare.title')}</Text>
              <Text style={styles.body}>
                {t('insights.compare.effortDelta', {
                  delta:
                    compare.effortDelta > 0
                      ? `+${compare.effortDelta}`
                      : String(compare.effortDelta),
                })}
              </Text>
              {compare.effortImproved === true ? (
                <Text style={styles.bullet}>• {t('insights.compare.moreBalanced')}</Text>
              ) : null}
              {compare.effortImproved === false ? (
                <Text style={styles.bullet}>• {t('insights.compare.lessBalanced')}</Text>
              ) : null}
              {compare.ghostChanged ? (
                <Text style={styles.bullet}>• {t('insights.compare.ghostChanged')}</Text>
              ) : null}
              {compare.interestChanged ? (
                <Text style={styles.bullet}>• {t('insights.compare.interestChanged')}</Text>
              ) : null}
              <Text style={styles.disclaimer}>{t('insights.compare.disclaimer')}</Text>
            </Card>
          ) : null}

          {hasPremium && paid ? (
            <>
              <Card>
                <Text style={styles.sectionLabel}>{t('insights.interest.title')}</Text>
                <Text style={styles.body}>{t(`insights.interest.${paid.interestTrend}`)}</Text>
              </Card>
              <Card>
                <Text style={styles.sectionLabel}>{t('insights.ghost.title')}</Text>
                <Text style={styles.body}>{t(`insights.ghost.${paid.ghostRisk}`)}</Text>
              </Card>
              <Card>
                <Text style={styles.sectionLabel}>{t('insights.timeline.title')}</Text>
                {paid.timeline.map((seg) => (
                  <Text key={seg.label} style={styles.bullet}>
                    • {t(`insights.timeline.${seg.label}`)}: {seg.engagement}%
                  </Text>
                ))}
              </Card>
              <Card>
                <Text style={styles.sectionLabel}>{t('insights.nextStep.title')}</Text>
                <Text style={styles.bodyBold}>{t(paid.nextStepKey)}</Text>
                <Text style={styles.body}>{t(paid.nextStepDetailKey)}</Text>
              </Card>
              <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>{t('results.title')}</Text>
              {replies.map((reply) => (
                <Card key={reply.variant}>
                  <Text style={styles.variant}>{t(REPLY_VARIANT_KEYS[reply.variant])}</Text>
                  <Text style={styles.body}>{reply.text}</Text>
                  <Text style={styles.meta}>
                    {t('results.whyThisWorks')}: {reply.whyThisWorks}
                  </Text>
                  <Button
                    title={copiedId === reply.variant ? t('common.copied') : t('common.copy')}
                    variant="secondary"
                    onPress={() => copyReply(reply.variant, reply.text)}
                  />
                </Card>
              ))}
            </>
          ) : (
            <Pressable onPress={() => router.push('/paywall')}>
              <Card style={{ opacity: 0.95 }}>
                <Text style={styles.sectionLabel}>{t('insights.locked.title')}</Text>
                <Text style={styles.body}>{t('insights.locked.body')}</Text>
                <Text style={[styles.bullet, { color: COLORS.textMuted }]}>
                  • {t('insights.locked.itemInterest')}
                </Text>
                <Text style={[styles.bullet, { color: COLORS.textMuted }]}>
                  • {t('insights.locked.itemGhost')}
                </Text>
                <Text style={[styles.bullet, { color: COLORS.textMuted }]}>
                  • {t('insights.locked.itemReplies')}
                </Text>
                <Button title={t('insights.locked.cta')} onPress={() => router.push('/paywall')} />
              </Card>
            </Pressable>
          )}

          <Button
            title={t('results.regenerate')}
            variant="secondary"
            onPress={() => router.push('/generating')}
          />
          <Button
            title={t('customize.title')}
            variant="ghost"
            onPress={() => router.push('/customize')}
          />
          <Button
            title={t('results.newConversation')}
            variant="ghost"
            onPress={() => {
              reset();
              router.replace('/welcome');
            }}
          />
        </ScrollView>
      </Screen>
    </SafeAreaView>
  );
}

const styles = {
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: COLORS.primary,
    marginBottom: 10,
    textTransform: 'uppercase' as const,
  },
  barTrack: {
    flexDirection: 'row' as const,
    height: 12,
    borderRadius: 8,
    overflow: 'hidden' as const,
    marginBottom: 8,
  },
  barMe: { backgroundColor: COLORS.primary },
  barThem: { backgroundColor: '#CBD5E1' },
  barLegend: { fontSize: 14, color: COLORS.text, marginBottom: 10, fontWeight: '600' as const },
  bullet: { fontSize: 14, color: COLORS.text, lineHeight: 20, marginBottom: 4 },
  body: { fontSize: 15, color: COLORS.text, lineHeight: 22, marginBottom: 8 },
  bodyBold: { fontSize: 16, color: COLORS.text, fontWeight: '700' as const, marginBottom: 6 },
  disclaimer: { fontSize: 12, color: COLORS.textMuted, marginTop: 10, lineHeight: 16 },
  variant: { fontSize: 13, fontWeight: '600' as const, color: COLORS.primary, marginBottom: 8 },
  meta: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12 },
};
