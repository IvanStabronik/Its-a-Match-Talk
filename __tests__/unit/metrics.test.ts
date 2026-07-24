import { describe, expect, it } from 'vitest';

import { buildLocalAnalysis } from '@/services/analyze';
import {
  computeEffortBalance,
  computeGhostRisk,
  computeInterestTrend,
  splitIntoThirds,
} from '@/services/metrics';
import { containsBannedDiagnosis } from '@/services/validator';
import type { Message } from '@/types/domain';

const meHeavy: Message[] = [
  { id: '1', speaker: 'them', text: 'hey' },
  { id: '2', speaker: 'me', text: 'Hey! How was your weekend? Want to grab coffee sometime this week?' },
  { id: '3', speaker: 'them', text: 'ok' },
  { id: '4', speaker: 'me', text: 'Cool, Saturday works for me — any preference on the place?' },
  { id: '5', speaker: 'them', text: 'idk' },
  { id: '6', speaker: 'me', text: 'No pressure, just let me know when you can?' },
];

const balanced: Message[] = [
  { id: '1', speaker: 'them', text: 'How was your day?' },
  { id: '2', speaker: 'me', text: 'Pretty good, yours?' },
  { id: '3', speaker: 'them', text: 'Busy but nice. Want to meet Friday?' },
  { id: '4', speaker: 'me', text: 'Friday works — coffee?' },
];

const pingPong: Message[] = [
  { id: '1', speaker: 'me', text: 'Hi' },
  { id: '2', speaker: 'them', text: 'Hi' },
  { id: '3', speaker: 'me', text: 'How are you?' },
  { id: '4', speaker: 'them', text: 'Good' },
  { id: '5', speaker: 'me', text: 'Plans?' },
  { id: '6', speaker: 'them', text: 'Maybe' },
];

describe('computeEffortBalance', () => {
  it('flags heavier me investment', () => {
    const effort = computeEffortBalance(meHeavy);
    expect(effort.mePercent).toBeGreaterThan(55);
    expect(effort.bulletKeys.length).toBeGreaterThan(0);
  });

  it('looks more balanced on reciprocal chat', () => {
    const effort = computeEffortBalance(balanced);
    expect(Math.abs(effort.mePercent - 50)).toBeLessThanOrEqual(25);
  });

  it('does not count every turn-take as initiation', () => {
    const effort = computeEffortBalance(pingPong);
    // Only the opening message qualifies — no 2+ streaks before switches
    expect(effort.initiationMe + effort.initiationThem).toBe(1);
  });
});

describe('splitIntoThirds', () => {
  it('never returns an empty bucket for short lists', () => {
    expect(splitIntoThirds([1, 2]).every((c) => c.length > 0)).toBe(true);
    expect(splitIntoThirds([1, 2, 3, 4, 5, 6])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });
});

describe('ghost / interest', () => {
  it('detects down trend when them shrinks', () => {
    const chat: Message[] = [
      { id: '1', speaker: 'them', text: 'That concert was amazing, I loved every song and the vibe' },
      { id: '2', speaker: 'me', text: 'Same!' },
      { id: '3', speaker: 'them', text: 'We should go again sometime soon honestly' },
      { id: '4', speaker: 'me', text: 'Yes!' },
      { id: '5', speaker: 'them', text: 'k' },
      { id: '6', speaker: 'me', text: 'You free this week?' },
      { id: '7', speaker: 'them', text: 'mm' },
      { id: '8', speaker: 'me', text: 'Or next?' },
    ];
    expect(computeInterestTrend(chat)).toBe('down');
    expect(['medium', 'high']).toContain(computeGhostRisk(chat));
  });
});

describe('buildLocalAnalysis', () => {
  it('free path returns only effort', () => {
    const result = buildLocalAnalysis(
      {
        messages: balanced,
        goal: 'keep-it-going',
        tone: 'playful',
        region: 'Auto',
        locale: 'en',
      },
      false,
    );
    expect(result.effort).toBeTruthy();
    expect(result.paid).toBeUndefined();
  });

  it('paid path includes replies and bands', () => {
    const result = buildLocalAnalysis(
      {
        messages: balanced,
        goal: 'ask-for-date',
        tone: 'confident',
        region: 'PL',
        locale: 'en',
      },
      true,
    );
    expect(result.paid?.replies).toHaveLength(3);
    expect(result.paid?.ghostRisk).toBeTruthy();
  });
});

describe('validator', () => {
  it('blocks diagnosis language', () => {
    expect(containsBannedDiagnosis('He is a narcissist')).toBe(true);
    expect(containsBannedDiagnosis('Their replies got shorter lately')).toBe(false);
  });
});
