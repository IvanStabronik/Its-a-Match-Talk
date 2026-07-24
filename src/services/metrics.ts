import type { EffortBalance, HotColdSegment, InterestTrend, Message, GhostBand } from '@/types/domain';

const GAP_INITIATION_CHARS = 0; // without timestamps, treat speaker change after unknown as weak signal

export function computeEffortBalance(messages: Message[]): EffortBalance {
  const usable = messages.filter((m) => m.speaker === 'me' || m.speaker === 'them');
  let volumeMe = 0;
  let volumeThem = 0;
  let questionsMe = 0;
  let questionsThem = 0;
  let messageCountMe = 0;
  let messageCountThem = 0;
  let initiationMe = 0;
  let initiationThem = 0;

  for (let i = 0; i < usable.length; i++) {
    const m = usable[i]!;
    const len = m.text.trim().length;
    const hasQ = m.text.includes('?');

    if (m.speaker === 'me') {
      volumeMe += len;
      messageCountMe += 1;
      if (hasQ) questionsMe += 1;
    } else {
      volumeThem += len;
      messageCountThem += 1;
      if (hasQ) questionsThem += 1;
    }

    // Initiation proxy without timestamps: first message, or speaker after 2+ from the other side streak break
    if (i === 0) {
      if (m.speaker === 'me') initiationMe += 1;
      else initiationThem += 1;
    } else {
      const prev = usable[i - 1]!;
      if (prev.speaker !== m.speaker) {
        // count as "picking up the thread" when previous was other person
        if (m.speaker === 'me') initiationMe += 1;
        else initiationThem += 1;
      }
    }
  }

  void GAP_INITIATION_CHARS;

  const volumeTotal = volumeMe + volumeThem || 1;
  const initTotal = initiationMe + initiationThem || 1;
  const msgTotal = messageCountMe + messageCountThem || 1;
  const qTotal = questionsMe + questionsThem || 1;

  // Composite: volume 40%, messages 25%, initiation 25%, questions 10%
  const meScore =
    0.4 * (volumeMe / volumeTotal) +
    0.25 * (messageCountMe / msgTotal) +
    0.25 * (initiationMe / initTotal) +
    0.1 * (questionsMe / qTotal);

  const mePercent = Math.round(meScore * 100);
  const themPercent = Math.max(0, 100 - mePercent);

  return {
    mePercent,
    themPercent,
    initiationMe,
    initiationThem,
    volumeMe,
    volumeThem,
    questionsMe,
    questionsThem,
    messageCountMe,
    messageCountThem,
    bulletKeys: pickEffortBullets(mePercent, initiationMe, initiationThem, questionsMe, questionsThem),
  };
}

function pickEffortBullets(
  mePercent: number,
  initiationMe: number,
  initiationThem: number,
  questionsMe: number,
  questionsThem: number,
): string[] {
  const keys: string[] = [];

  if (mePercent >= 65) keys.push('insights.effort.bullets.youLead');
  else if (mePercent <= 35) keys.push('insights.effort.bullets.theyLead');
  else keys.push('insights.effort.bullets.balanced');

  if (initiationMe > initiationThem + 1) keys.push('insights.effort.bullets.youInitiateMore');
  else if (initiationThem > initiationMe + 1) keys.push('insights.effort.bullets.theyInitiateMore');

  if (questionsMe > questionsThem + 1) keys.push('insights.effort.bullets.youAskMore');
  else if (questionsThem > questionsMe + 1) keys.push('insights.effort.bullets.theyAskMore');

  return keys.slice(0, 3);
}

export function computeInterestTrend(messages: Message[]): InterestTrend {
  const them = messages.filter((m) => m.speaker === 'them');
  if (them.length < 3) return 'flat';

  const third = Math.max(1, Math.floor(them.length / 3));
  const early = avgLen(them.slice(0, third));
  const late = avgLen(them.slice(-third));

  if (late > early * 1.25) return 'up';
  if (late < early * 0.75) return 'down';
  return 'flat';
}

export function computeGhostRisk(messages: Message[]): GhostBand {
  const usable = messages.filter((m) => m.speaker === 'me' || m.speaker === 'them');
  if (usable.length < 4) return 'low';

  const them = usable.filter((m) => m.speaker === 'them');
  const trend = computeInterestTrend(usable);
  const last = usable[usable.length - 1];
  const unansweredOpener = last?.speaker === 'me';

  const lateThem = them.slice(-Math.max(1, Math.floor(them.length / 3)));
  const earlyThem = them.slice(0, Math.max(1, Math.floor(them.length / 3)));
  const shrinking = avgLen(lateThem) < avgLen(earlyThem) * 0.7;

  let score = 0;
  if (trend === 'down') score += 2;
  if (shrinking) score += 1;
  if (unansweredOpener) score += 1;
  if (them.length > 0 && usable.filter((m) => m.speaker === 'me').length > them.length * 1.8) score += 1;

  if (score >= 3) return 'high';
  if (score >= 1) return 'medium';
  return 'low';
}

export function computeHotColdTimeline(messages: Message[]): HotColdSegment[] {
  const them = messages.filter((m) => m.speaker === 'them');
  if (them.length === 0) {
    return [
      { label: 'early', engagement: 50 },
      { label: 'mid', engagement: 50 },
      { label: 'late', engagement: 50 },
    ];
  }

  const third = Math.max(1, Math.floor(them.length / 3));
  const parts = [them.slice(0, third), them.slice(third, third * 2), them.slice(third * 2)];
  const lens = parts.map((p) => avgLen(p.length ? p : them));
  const max = Math.max(...lens, 1);

  return [
    { label: 'early', engagement: Math.round((lens[0]! / max) * 100) },
    { label: 'mid', engagement: Math.round((lens[1]! / max) * 100) },
    { label: 'late', engagement: Math.round((lens[2]! / max) * 100) },
  ];
}

export function pickNextStepKeys(
  ghost: GhostBand,
  trend: InterestTrend,
  effort: EffortBalance,
): { nextStepKey: string; nextStepDetailKey: string } {
  if (ghost === 'high' || (trend === 'down' && effort.mePercent >= 60)) {
    return {
      nextStepKey: 'insights.nextStep.coolDown',
      nextStepDetailKey: 'insights.nextStep.coolDownDetail',
    };
  }
  if (trend === 'up' && effort.themPercent >= 45) {
    return {
      nextStepKey: 'insights.nextStep.proposeMeet',
      nextStepDetailKey: 'insights.nextStep.proposeMeetDetail',
    };
  }
  if (effort.mePercent >= 70) {
    return {
      nextStepKey: 'insights.nextStep.wait',
      nextStepDetailKey: 'insights.nextStep.waitDetail',
    };
  }
  return {
    nextStepKey: 'insights.nextStep.clarify',
    nextStepDetailKey: 'insights.nextStep.clarifyDetail',
  };
}

function avgLen(messages: Message[]): number {
  if (!messages.length) return 0;
  return messages.reduce((sum, m) => sum + m.text.trim().length, 0) / messages.length;
}
