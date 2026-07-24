import type { EffortBalance, HotColdSegment, InterestTrend, Message, GhostBand } from '@/types/domain';

/**
 * Effort / dynamics from observable message structure only.
 * Without timestamps we do NOT treat every turn-take as "initiation".
 */
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

  let streakSpeaker: 'me' | 'them' | null = null;
  let streakLen = 0;

  for (let i = 0; i < usable.length; i++) {
    const m = usable[i]!;
    const len = m.text.trim().length;
    const hasQ = m.text.includes('?');
    const speaker = m.speaker as 'me' | 'them';

    if (speaker === 'me') {
      volumeMe += len;
      messageCountMe += 1;
      if (hasQ) questionsMe += 1;
    } else {
      volumeThem += len;
      messageCountThem += 1;
      if (hasQ) questionsThem += 1;
    }

    if (i === 0) {
      if (speaker === 'me') initiationMe += 1;
      else initiationThem += 1;
      streakSpeaker = speaker;
      streakLen = 1;
      continue;
    }

    if (streakSpeaker === speaker) {
      streakLen += 1;
    } else {
      // Re-engage only after the other side sent a streak of 2+ (not every ping-pong turn).
      if (streakLen >= 2) {
        if (speaker === 'me') initiationMe += 1;
        else initiationThem += 1;
      }
      streakSpeaker = speaker;
      streakLen = 1;
    }
  }

  const volumeTotal = volumeMe + volumeThem || 1;
  const initTotal = initiationMe + initiationThem || 1;
  const msgTotal = messageCountMe + messageCountThem || 1;
  const qTotal = questionsMe + questionsThem || 1;

  // Volume 45%, messages 30%, initiation 15%, questions 10%
  const meScore =
    0.45 * (volumeMe / volumeTotal) +
    0.3 * (messageCountMe / msgTotal) +
    0.15 * (initiationMe / initTotal) +
    0.1 * (questionsMe / qTotal);

  const mePercent = clampPercent(Math.round(meScore * 100));
  const themPercent = 100 - mePercent;

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

  if (initiationMe > initiationThem) keys.push('insights.effort.bullets.youInitiateMore');
  else if (initiationThem > initiationMe) keys.push('insights.effort.bullets.theyInitiateMore');

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
  if (early === 0) return late > 0 ? 'up' : 'flat';

  if (late > early * 1.25) return 'up';
  if (late < early * 0.75) return 'down';
  return 'flat';
}

export function computeGhostRisk(messages: Message[]): GhostBand {
  const usable = messages.filter((m) => m.speaker === 'me' || m.speaker === 'them');
  if (usable.length < 4) return 'low';

  const them = usable.filter((m) => m.speaker === 'them');
  const me = usable.filter((m) => m.speaker === 'me');
  const trend = computeInterestTrend(usable);
  const last = usable[usable.length - 1];
  const unansweredOpener = last?.speaker === 'me';

  const slice = Math.max(1, Math.floor(them.length / 3));
  const lateThem = them.slice(-slice);
  const earlyThem = them.slice(0, slice);
  const earlyAvg = avgLen(earlyThem);
  const shrinking = earlyAvg > 0 && avgLen(lateThem) < earlyAvg * 0.7;

  let score = 0;
  if (trend === 'down') score += 2;
  if (shrinking) score += 1;
  if (unansweredOpener) score += 1;
  if (them.length > 0 && me.length > them.length * 1.8) score += 1;

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

  const chunks = splitIntoThirds(them);
  const lens = chunks.map((chunk) => avgLen(chunk));
  const max = Math.max(...lens, 1);

  return [
    { label: 'early', engagement: Math.round((lens[0]! / max) * 100) },
    { label: 'mid', engagement: Math.round((lens[1]! / max) * 100) },
    { label: 'late', engagement: Math.round((lens[2]! / max) * 100) },
  ];
}

/** Stable thirds even for short arrays — never reuse full list for an empty bucket. */
export function splitIntoThirds<T>(items: T[]): [T[], T[], T[]] {
  if (items.length === 0) return [[], [], []];
  if (items.length === 1) return [[items[0]!], [items[0]!], [items[0]!]];
  if (items.length === 2) return [[items[0]!], [items[0]!, items[1]!], [items[1]!]];

  const n = items.length;
  const a = Math.floor(n / 3);
  const b = Math.floor((2 * n) / 3);
  return [items.slice(0, a), items.slice(a, b), items.slice(b)];
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

function clampPercent(n: number): number {
  return Math.min(100, Math.max(0, n));
}
