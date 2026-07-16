import { PASTE_MIN_LENGTH } from '@/config/constants';
import type { Message, Speaker } from '@/types/domain';

export function parsePastedText(text: string): Message[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => ({
    id: `msg-${index}-${Date.now()}`,
    speaker: guessSpeaker(line, index),
    text: stripSpeakerPrefix(line),
  }));
}

function stripSpeakerPrefix(line: string): string {
  return line.replace(/^(я|me|они|them|вони|ja|oni):\s*/i, '').trim();
}

function guessSpeaker(line: string, index: number): Speaker {
  const lower = line.toLowerCase();
  if (/^(я|me|ja):/.test(lower)) return 'me';
  if (/^(они|them|вони|oni):/.test(lower)) return 'them';
  return index % 2 === 0 ? 'them' : 'me';
}

export function isPasteValid(text: string): boolean {
  return text.trim().length >= PASTE_MIN_LENGTH;
}

export function formatMessagesForPrompt(messages: Message[]): string {
  return messages
    .map((m) => {
      const label = m.speaker === 'me' ? 'Me' : m.speaker === 'them' ? 'Them' : '?';
      return `[${label}] ${m.text}`;
    })
    .join('\n');
}
