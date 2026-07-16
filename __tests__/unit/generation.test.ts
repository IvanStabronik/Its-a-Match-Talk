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
});
