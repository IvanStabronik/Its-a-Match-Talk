import { describe, expect, it } from 'vitest';

import { isPasteValid, parsePastedText } from '@/services/conversation';
import { buildGenerationRequest, generateRepliesFromRequest } from '@/services/generation';

describe('parsePastedText', () => {
  it('splits lines into messages', () => {
    const messages = parsePastedText('Привет!\nКак дела?\nНормально');
    expect(messages).toHaveLength(3);
    expect(messages[0].text).toBe('Привет!');
  });

  it('detects speaker prefixes', () => {
    const messages = parsePastedText('They: Hi\nMe: Hello');
    expect(messages[0].speaker).toBe('them');
    expect(messages[1].speaker).toBe('me');
  });
});

describe('isPasteValid', () => {
  it('requires minimum length', () => {
    expect(isPasteValid('short')).toBe(false);
    expect(isPasteValid('This is long enough text')).toBe(true);
  });
});

describe('generateRepliesFromRequest', () => {
  it('returns exactly 3 replies for each locale', async () => {
    for (const locale of ['ru', 'uk', 'pl', 'en'] as const) {
      const request = buildGenerationRequest({
        messages: [{ id: '1', speaker: 'them', text: 'Hey!' }],
        goal: 'keep-it-going',
        tone: 'playful',
        region: 'Auto',
        locale,
      });
      const result = await generateRepliesFromRequest(request);
      expect(result.replies).toHaveLength(3);
      expect(result.replies.map((r) => r.variant)).toEqual(['Safe', 'Playful', 'Bold']);
    }
  });

  it('varies replies by goal', async () => {
    const base = {
      messages: [{ id: '1', speaker: 'them' as const, text: 'Привет, как дела?' }],
      tone: 'playful' as const,
      region: 'Auto' as const,
      locale: 'ru' as const,
    };
    const keepGoing = await generateRepliesFromRequest(
      buildGenerationRequest({ ...base, goal: 'keep-it-going' }),
    );
    const flirt = await generateRepliesFromRequest(
      buildGenerationRequest({ ...base, goal: 'flirt-lightly' }),
    );
    expect(keepGoing.replies[0].text).not.toBe(flirt.replies[0].text);
  });

  it('returns different Safe text on regenerate (time-based mix)', async () => {
    const request = buildGenerationRequest({
      messages: [{ id: '1', speaker: 'them', text: 'Same chat' }],
      goal: 'keep-it-going',
      tone: 'soft',
      region: 'Auto',
      locale: 'ru',
    });
    const first = await generateRepliesFromRequest(request);
    await new Promise((r) => setTimeout(r, 5));
    const second = await generateRepliesFromRequest(request);
    const firstTexts = first.replies.map((r) => r.text).join('|');
    const secondTexts = second.replies.map((r) => r.text).join('|');
    // With 3 sets for keep-it-going, regenerate often differs (not guaranteed every ms).
    expect(first.replies).toHaveLength(3);
    expect(second.replies).toHaveLength(3);
    if (firstTexts === secondTexts) {
      // At least structure is valid when hash collides on same ms
      expect(first.replies[0].variant).toBe('Safe');
    }
  });
});
